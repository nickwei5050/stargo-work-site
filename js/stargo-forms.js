/* Forms: the contact form and the footer newsletter.
   Submissions go to the site's own endpoint (/api/contact, a Cloudflare Pages
   Function) which relays them by e-mail. If the endpoint is missing or its
   e-mail service is not configured, the visitor's mail client opens with the
   message pre-filled and the page says so — nothing ever shows "thank you"
   for a message that went nowhere. Double submits are blocked while a
   request is in flight. */
(function () {
  var TO = 'sales@stargomoto.com';
  var WA = '+86 187 7512 7878';
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var T = zh ? {
    sent: '已收到，我们会在一个工作日内联系你。',
    sentNews: '订阅成功。',
    fallback: '在线提交暂不可用，已为你打开邮件客户端。也可以直接发到 ' + TO + '，或 WhatsApp ' + WA + '。',
    invalid: '请填写姓名和有效的邮箱地址。',
    busy: '发送中…',
  } : {
    sent: 'Received. We will be in touch within one working day.',
    sentNews: 'You are subscribed.',
    fallback: 'Online submission is unavailable right now, so your mail client should open. You can also write to ' + TO + ' or WhatsApp ' + WA + '.',
    invalid: 'Please enter your name and a valid e-mail address.',
    busy: 'Sending…',
  };
  var endpoint = (location.pathname.indexOf('/en/') === 0 ? '/' : location.pathname.replace(/[^/]*$/, '')) + 'api/contact';
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
      if (v && String(v).trim()) fields.push({ label: label(form, f), value: String(v).trim() });
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
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function arm(form) {
    var isNews = !form.querySelector('textarea') && form.querySelectorAll('input[type="email"]').length === 1 && form.querySelectorAll('input:not([type=hidden]):not([type=submit])').length <= 2;
    form.setAttribute('novalidate', 'novalidate');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (form.hasAttribute('data-stargo-busy')) return;
      var fields = collect(form);
      var email = form.querySelector('input[type="email"]');
      var name = form.querySelector('input[name="name"], input[name="Name"]');
      var emailOk = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
      if (!emailOk || (name && !name.value.trim())) { note(form, T.invalid, false); (emailOk ? name : email).focus(); return; }
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { note(form, isNews ? T.sentNews : T.sent, true); return; }   // bots see success, nothing is sent
      if (!endpoint) { mailto(form, fields, isNews); return; }
      form.setAttribute('data-stargo-busy', '1');
      note(form, T.busy, false);
      var payload = { form: isNews ? 'newsletter' : 'contact', lang: zh ? 'zh-CN' : 'en', page: location.href, fields: fields, website: hp ? hp.value : '' };
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 12000);
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, ok: r.ok && j && j.ok, json: j }; }); })
        .then(function (res) {
          if (res.ok) { note(form, isNews ? T.sentNews : T.sent, true); return; }
          if (res.status === 422) { note(form, T.invalid, false); return; }
          mailto(form, fields, isNews);
        })
        .catch(function () { mailto(form, fields, isNews); })
        .then(function () { if (timer) clearTimeout(timer); form.removeAttribute('data-stargo-busy'); });
    }, true);
  }
  var forms = document.querySelectorAll('form');
  for (var i = 0; i < forms.length; i++) arm(forms[i]);
})();
