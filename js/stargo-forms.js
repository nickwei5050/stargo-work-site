/* Forms: the contact form and the footer newsletter.
   Submissions go to the site's own endpoint (/api/contact, a Cloudflare Pages
   Function) which relays them by e-mail. If the endpoint is missing or its
   e-mail service is not configured, an explicit pre-filled email link is offered
   without launching another app — nothing ever shows "thank you"
   for a message that went nowhere. Double submits are blocked while a
   request is in flight. */
(function () {
  var TO = 'sales@stargomoto.com';
  var WA = '+86 187 7512 7878';
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var T = zh ? {
    sent: '已收到你的演示需求，我们会根据提交的联系方式与你沟通。',   // V5 P07: no response time is promised
    sentNews: '订阅申请已收到。',
    fallback: '暂时无法确认提交结果。请重试，或点击下方邮件链接联系 ' + TO + '；WhatsApp ' + WA + '。',
    emailLink: '通过邮件发送',
    invalid: '请填写姓名和有效的邮箱地址。',
    busy: '发送中…',
  } : {
    sent: 'Your demo request has been received. We will follow up using the contact details provided.',
    sentNews: 'Your subscription request has been received.',
    fallback: 'Submission confirmation is unavailable right now. Retry, or use the email link below to contact ' + TO + '; WhatsApp ' + WA + '.',
    emailLink: 'Send by email',
    invalid: 'Please enter your name and a valid e-mail address.',
    busy: 'Sending…',
  };
  var endpoint = '/api/contact';
  if (location.protocol === 'file:') endpoint = null;

  function label(form, el) {
    var l = el.id && form.querySelector('label[for="' + el.id + '"]');
    return (l && l.textContent.trim()) || el.getAttribute('placeholder') || el.name || '';
  }
  function collect(form) {
    var fields = [];
    var els = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < els.length; i++) {
      var f = els[i];
      if (f.type === 'submit' || f.type === 'hidden' || f.type === 'button' || f.name === 'website') continue;
      var v = f.tagName === 'SELECT' ? (f.selectedIndex > 0 ? f.options[f.selectedIndex].text : '') : f.value;
      var key = f.type === 'email' ? 'email' : /^name$/i.test(f.name) ? 'name' : f.name;
      if (v && String(v).trim()) fields.push({ key: key, label: label(form, f), value: String(v).trim() });
    }
    return fields;
  }
  function note(form, text, ok) {
    var wrap = form.parentElement;
    var done = wrap && wrap.querySelector('.w-form-done');
    var fail = wrap && wrap.querySelector('.w-form-fail');
    if (fail) fail.style.display = 'none';
    if (ok && done) {
      var inner = done.querySelector('div') || done;
      inner.textContent = text;
      form.style.display = 'none';
      done.style.display = 'block';
      done.setAttribute('role', 'status');
      done.setAttribute('tabindex', '-1');
      done.focus({ preventScroll: true });
      return;
    }
    var p = form.querySelector('.stargo-form-note');
    if (!p) { p = document.createElement('p'); p.className = 'stargo-form-note'; p.setAttribute('role', 'status'); p.setAttribute('aria-live', 'polite'); form.appendChild(p); }
    p.textContent = text;
  }
  function mailto(form, fields, isNews) {
    var subject = zh ? (isNews ? 'STARGO WORK 订阅' : 'STARGO WORK 咨询') : (isNews ? 'STARGO WORK newsletter' : 'STARGO WORK inquiry');
    var body = fields.map(function (f) { return f.label + ': ' + f.value; }).join('\n');
    note(form, T.fallback, false);
    var link = document.createElement('a');
    link.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    link.textContent = T.emailLink;
    var p = form.querySelector('.stargo-form-note');
    p.appendChild(document.createElement('br'));
    p.appendChild(link);
  }
  function arm(form) {
    var isNews = form.getAttribute('data-stargo-form') === 'newsletter' || (!form.querySelector('textarea') && form.querySelectorAll('input[type="email"]').length === 1 && form.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([name=website])').length <= 2);
    var lastPayload = '', submissionId = '';
    form.setAttribute('novalidate', 'novalidate');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (form.hasAttribute('data-stargo-busy')) return;
      var fields = collect(form);
      var email = form.querySelector('input[type="email"]');
      var name = form.querySelector('input[name="name"]:not([type=email]), input[name="Name"]:not([type=email])');
      var emailOk = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
      if (!emailOk || (!isNews && (!name || !name.value.trim()))) { note(form, T.invalid, false); var invalid = emailOk ? name : email; if (invalid) invalid.focus(); return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { note(form, isNews ? T.sentNews : T.sent, true); return; }   // bots see success, nothing is sent
      if (!endpoint) { mailto(form, fields, isNews); return; }
      form.setAttribute('data-stargo-busy', '1');
      form.setAttribute('aria-busy', 'true');
      var submit = form.querySelector('[type=submit]');
      if (submit) submit.disabled = true;
      note(form, T.busy, false);
      var payload = { form: isNews ? 'newsletter' : 'contact', lang: zh ? 'zh-CN' : 'en', page: location.href, fields: fields, website: hp ? hp.value : '' };
      var serialized = JSON.stringify(payload);
      if (serialized !== lastPayload) {
        lastPayload = serialized;
        submissionId = crypto.randomUUID();
      }
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 12000);
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submissionId }, body: serialized, signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, ok: r.ok && j && j.ok, json: j }; }); })
        .then(function (res) {
          if (res.ok) { note(form, isNews ? T.sentNews : T.sent, true); return; }
          if (res.status === 422) { note(form, T.invalid, false); return; }
          mailto(form, fields, isNews);
        })
        .catch(function () { mailto(form, fields, isNews); })
        .finally(function () { if (timer) clearTimeout(timer); form.removeAttribute('data-stargo-busy'); form.setAttribute('aria-busy', 'false'); if (submit) submit.disabled = false; });
    }, true);
  }
  var forms = document.querySelectorAll('form');
  for (var i = 0; i < forms.length; i++) arm(forms[i]);
})();
