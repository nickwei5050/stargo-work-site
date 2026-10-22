/* Forms: the contact form and the footer newsletter.
   Submissions go to the site's own endpoint (/api/contact, a Cloudflare Pages
   Function) which relays them by e-mail. If the endpoint is missing or its
   e-mail service is not configured, an explicit pre-filled email link is offered
   without launching another app — nothing ever shows "thank you"
   for a message that went nowhere. Double submits are blocked while a
   request is in flight.
   The address and WhatsApp number that fallback names are the form's own
   data-stargo-to / data-stargo-wa, written by tools/chrome.mjs from
   tools/copy.mjs CONTACT_INFO: this file carries no contact details.
   Also here: the copy buttons for the WeChat ID ([data-stargo-copy], at the
   end), since WeChat has no web link to follow. */
(function () {
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var T = zh ? {
    sent: '演示申请已收到，我们会按你留下的方式和你联系。',   // V5 P07: no response time is promised
    sentNews: '订阅申请已收到。',
    fallback: function (to, wa) { return '暂时无法确认提交结果。请重试，或点击下方链接发邮件到 ' + to + '，也可以用 WhatsApp ' + wa + ' 联系我们。'; },
    emailLink: '通过邮件发送',
    invalid: '请填写姓名和有效的邮箱地址。',
    busy: '发送中……',
  } : {
    sent: 'We have received your demo request and will follow up using the contact details you provided.',
    sentNews: 'Your subscription request has been received.',
    fallback: function (to, wa) { return 'We couldn’t confirm your submission. Please try again, or use the email link below to write to ' + to + '. You can also reach us on WhatsApp at ' + wa + '.'; },
    emailLink: 'Send by email',
    invalid: 'Please enter your name and a valid email address.',
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
    var to = form.getAttribute('data-stargo-to') || '';
    note(form, T.fallback(to, form.getAttribute('data-stargo-wa') || ''), false);
    var link = document.createElement('a');
    link.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
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

  /* Copy buttons. A button with data-stargo-copy puts that text on the
     clipboard, then for two seconds shows that it did: data-stargo-copied-short
     (or data-stargo-copied) in place of its [data-stargo-copy-label] when it
     has one, as its own text when it is a text button, and a check mark when
     it is an icon. data-stargo-copied is announced through one polite live
     region, in the page from the start. Buttons that are nothing but this
     action ship `hidden` and are revealed here, so without this script none
     of them is shown. */
  var copies = document.querySelectorAll('[data-stargo-copy]');
  if (!copies.length) return;
  var live = document.createElement('p');
  live.className = 'stargo-sr';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);
  var CHECK = '<path d="m5 12.5 4.5 4.5L19 7.5"/>';
  function writeText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error('copy'));
    });
  }
  function armCopy(btn) {
    var timer = null, restore = null;
    btn.removeAttribute('hidden');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var done = btn.getAttribute('data-stargo-copied') || '';
      writeText(btn.getAttribute('data-stargo-copy') || '').then(function () {
        live.textContent = '';
        setTimeout(function () { live.textContent = done; }, 50);
        if (restore) restore();
        var label = btn.querySelector('[data-stargo-copy-label]');
        var svgs = btn.querySelectorAll('svg');
        var shown = btn.getAttribute('data-stargo-copied-short') || done;
        if (label) {
          var before = label.textContent;
          label.textContent = shown;
          restore = function () { label.textContent = before; };
        } else if (svgs.length) {
          var saved = [];
          for (var i = 0; i < svgs.length; i++) { saved.push(svgs[i].innerHTML); svgs[i].innerHTML = CHECK; }
          restore = function () { for (var i = 0; i < svgs.length; i++) svgs[i].innerHTML = saved[i]; };
        } else {
          var text = btn.textContent;
          btn.textContent = shown;
          restore = function () { btn.textContent = text; };
        }
        btn.setAttribute('data-stargo-copied-on', '');
        clearTimeout(timer);
        timer = setTimeout(function () { if (restore) restore(); restore = null; btn.removeAttribute('data-stargo-copied-on'); }, 2000);
      }, function () {});
    });
  }
  for (var c = 0; c < copies.length; c++) armCopy(copies[c]);
})();
