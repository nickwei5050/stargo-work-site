/* Forms: the demo-request form (the homepage band and contact.html) and the
   footer newsletter.
   Submissions go to the site's own endpoint (/api/contact, a Cloudflare Pages
   Function) which relays them by e-mail. If the endpoint is missing or its
   e-mail service is not configured, an explicit pre-filled email link is offered
   (with the WeChat ID and the phone number) without launching another app —
   nothing ever shows "thank you" for a message that went nowhere. Double
   submits are blocked while a request is in flight.

   The demo form needs a name, a company and a mobile number or WeChat ID; the
   e-mail is optional but must be valid when given (owner, 2026-10-10). Which
   fields are required is read off the form's own [required] attributes, so the
   markup (tools/ow-blocks/contact.mjs) and this file cannot disagree. The keys
   sent are name / company / phone / email, then the other fields by their name;
   functions/api/contact.js applies the same rules again. */
(function () {
  var TO = 'sales@stargomoto.com';
  var WECHAT = '505099021';
  var PHONE = '+86 187 7512 7878';        // also the WhatsApp number
  var PHONE_HREF = 'tel:+8618775127878';
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var T = zh ? {
    sent: '已收到你的演示需求，我们会在 12 小时内通过你留下的联系方式回复。',
    sentNews: '订阅申请已收到。',
    fallback: '暂时无法确认提交结果。请重试，或换一种方式联系我们：邮件 ' + TO + '，微信 ' + WECHAT + '，电话 / WhatsApp ' + PHONE + '。',
    emailLink: '通过邮件发送',
    callLink: '拨打 ' + PHONE,
    invalid: '提交的信息有误，请检查姓名、公司、手机 / 微信和邮箱。',
    invalidNews: '请填写有效的邮箱地址。',
    missing: function (names) { return '请填写' + names.join('、') + '。'; },
    badEmail: '邮箱格式不太对，请检查；不想留邮箱也可以留空。',
    badPhone: '请填写有效的手机号或微信号。',
    busy: '发送中…',
  } : {
    sent: 'Your demo request has been received. We will reply within 12 hours using the contact details you left.',
    sentNews: 'Your subscription request has been received.',
    fallback: 'We couldn’t confirm that your request went through. Please try again, or reach us another way: e-mail ' + TO + ', WeChat ' + WECHAT + ', or call / WhatsApp ' + PHONE + '.',
    emailLink: 'Send by e-mail',
    callLink: 'Call ' + PHONE,
    invalid: 'Some details need another look. Please check your name, company, mobile / WeChat and e-mail.',
    invalidNews: 'Please enter a valid e-mail address.',
    missing: function (names) { return 'Please fill in ' + (names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0]) + '.'; },
    badEmail: 'That e-mail address doesn’t look right. Please check it, or leave it blank.',
    badPhone: 'Please enter a valid mobile number or WeChat ID.',
    busy: 'Sending…',
  };
  var endpoint = '/api/contact';
  if (location.protocol === 'file:') endpoint = null;

  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  /* A plausible phone number or WeChat ID, the rule functions/api/contact.js
     applies: 5-64 characters with a letter or five digits in them. */
  var LETTER;
  try { LETTER = new RegExp('\\p{L}', 'u'); } catch (e) { LETTER = /[A-Za-zÀ-￿]/; }
  function plausiblePhone(v) {
    return v.length >= 5 && v.length <= 64 && (LETTER.test(v) || (v.match(/\d/g) || []).length >= 5);
  }

  function controls(form) {
    var out = [];
    var els = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < els.length; i++) {
      var f = els[i];
      if (f.type === 'submit' || f.type === 'hidden' || f.type === 'button' || f.name === 'website') continue;
      out.push(f);
    }
    return out;
  }
  /* The field's name as the visitor reads it, without the * and 「（选填）」
     marks (those sit in spans of their own): "姓名", "手机 / 微信", "Email". */
  function label(form, el) {
    var l = el.id && form.querySelector('label[for="' + el.id + '"]');
    if (l) {
      var c = l.cloneNode(true);
      var marks = c.querySelectorAll('.ow-req, .ow-opt');
      for (var i = 0; i < marks.length; i++) marks[i].parentNode.removeChild(marks[i]);
      var text = c.textContent.replace(/\s*\*\s*$/, '').trim();
      if (text) return text;
    }
    return el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.name || '';
  }
  /* The stable key the endpoint reads: name / company / phone / email, then the
     field's own name (plan, focus, message …). `last-name` is the old template's
     company input, kept so a cached page still sends the right key. */
  function keyOf(f) {
    if (f.type === 'email') return 'email';
    var n = String(f.name || '').toLowerCase();
    return n === 'last-name' ? 'company' : n || f.name;
  }
  function collect(form) {
    var fields = [];
    var els = controls(form);
    for (var i = 0; i < els.length; i++) {
      var f = els[i];
      var v = f.tagName === 'SELECT' ? (f.selectedIndex > 0 ? f.options[f.selectedIndex].text : '') : f.value;
      if (v && String(v).trim()) fields.push({ key: keyOf(f), label: label(form, f), value: String(v).trim() });
    }
    return fields;
  }
  /* Check the form before anything is sent. Returns null, or the message and
     the field to focus: the first one left empty, else the first with a wrong
     value. Every field at fault is marked aria-invalid. */
  function check(form, isNews) {
    var els = controls(form), missing = [], wrong = [], firstMissing = null, firstWrong = null, why = '';
    for (var i = 0; i < els.length; i++) {
      var f = els[i];
      var v = (f.value || '').trim();
      f.removeAttribute('aria-invalid');
      if (!v) {
        if (f.hasAttribute('required')) { missing.push(f); firstMissing = firstMissing || f; }
      } else if (f.type === 'email' && !EMAIL.test(v)) {
        wrong.push(f); firstWrong = firstWrong || f; why = why || T.badEmail;
      } else if (f.name === 'phone' && !plausiblePhone(v)) {
        wrong.push(f); firstWrong = firstWrong || f; why = why || T.badPhone;
      }
    }
    if (!missing.length && !wrong.length) return null;
    var bad = missing.concat(wrong);
    for (var j = 0; j < bad.length; j++) bad[j].setAttribute('aria-invalid', 'true');
    var message = isNews ? T.invalidNews : missing.length ? T.missing(missing.map(function (f) { return label(form, f); })) : why;
    return { message: message, focus: firstMissing || firstWrong };
  }
  function byKind(form, kind) {
    return kind === 'email' ? form.querySelector('input[type="email"]') : form.querySelector('[name="' + kind + '"]');
  }
  /* tone 'warn' marks a validation message (styled as a warning); busy and fallback notes stay neutral */
  function note(form, text, ok, tone) {
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
    if (!p) {
      p = document.createElement('p'); p.className = 'stargo-form-note'; p.setAttribute('role', 'status'); p.setAttribute('aria-live', 'polite');
      // just above the send button, where the visitor is looking after pressing it
      var submit = form.querySelector('[type=submit]');
      if (submit && submit.parentNode === form) form.insertBefore(p, submit); else form.appendChild(p);
    }
    p.textContent = text;
    if (tone) p.setAttribute('data-tone', tone); else p.removeAttribute('data-tone');
  }
  function mailto(form, fields, isNews) {
    var subject = zh ? (isNews ? 'STARGO WORK 订阅' : 'STARGO WORK 咨询') : (isNews ? 'STARGO WORK newsletter' : 'STARGO WORK inquiry');
    var body = fields.map(function (f) { return f.label + ': ' + f.value; }).join('\n');
    note(form, T.fallback, false);
    var p = form.querySelector('.stargo-form-note');
    var link = document.createElement('a');
    link.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    link.textContent = T.emailLink;
    var call = document.createElement('a');
    call.href = PHONE_HREF;
    call.textContent = T.callLink;
    p.appendChild(document.createElement('br'));
    p.appendChild(link);
    p.appendChild(document.createTextNode(' · '));
    p.appendChild(call);
  }
  // Idempotency-Key for one submission (the endpoint accepts [A-Za-z0-9_-]{16,128}). crypto.randomUUID is
  // missing in older browsers and on non-HTTPS pages, so fall back to getRandomValues, then Math.random.
  function newId() {
    try {
      var c = window.crypto || window.msCrypto;
      if (c && typeof c.randomUUID === 'function') return c.randomUUID();
      if (c && c.getRandomValues) {
        var b = new Uint8Array(16);
        c.getRandomValues(b);
        b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
        var h = '';
        for (var i = 0; i < 16; i++) h += (b[i] + 256).toString(16).slice(1);
        return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
      }
    } catch (e) { /* fall through */ }
    return 'sg-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
  }
  function arm(form) {
    var isNews = form.getAttribute('data-stargo-form') === 'newsletter' || (!form.querySelector('textarea') && form.querySelectorAll('input[type="email"]').length === 1 && form.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([name=website])').length <= 2);
    var lastPayload = '', submissionId = '';
    form.setAttribute('novalidate', 'novalidate');
    // a field the visitor is correcting is no longer flagged
    form.addEventListener('input', function (e) { if (e.target && e.target.removeAttribute) e.target.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (form.hasAttribute('data-stargo-busy')) return;
      var problem = check(form, isNews);
      if (problem) { note(form, problem.message, false, 'warn'); if (problem.focus) problem.focus.focus(); return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fields = collect(form);
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { note(form, isNews ? T.sentNews : T.sent, true); return; }   // bots see success, nothing is sent
      if (!endpoint) { mailto(form, fields, isNews); return; }
      form.setAttribute('data-stargo-busy', '1');
      form.setAttribute('aria-busy', 'true');
      var submit = form.querySelector('[type=submit]');
      if (submit) submit.disabled = true;
      note(form, T.busy, false);
      var timer = null;
      var done = function () { if (timer) clearTimeout(timer); form.removeAttribute('data-stargo-busy'); form.setAttribute('aria-busy', 'false'); if (submit) submit.disabled = false; };
      try {
        var payload = { form: isNews ? 'newsletter' : 'contact', lang: zh ? 'zh-CN' : 'en', page: location.href, fields: fields, website: hp ? hp.value : '' };
        var serialized = JSON.stringify(payload);
        if (serialized !== lastPayload) {
          lastPayload = serialized;
          submissionId = newId();
        }
        var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        timer = ctrl && setTimeout(function () { ctrl.abort(); }, 12000);
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submissionId }, body: serialized, signal: ctrl ? ctrl.signal : undefined })
          .then(function (r) { return r.json().then(function (j) { return { status: r.status, ok: r.ok && j && j.ok, json: j }; }); })
          .then(function (res) {
            if (res.ok) { note(form, isNews ? T.sentNews : T.sent, true); return; }
            if (res.status === 422) {
              // the endpoint says which kinds it refused (name, company, phone, email): flag and focus the first
              var kinds = (res.json && res.json.fields) || [];
              var first = null;
              for (var k = 0; k < kinds.length; k++) { var el = byKind(form, kinds[k]); if (el) { el.setAttribute('aria-invalid', 'true'); first = first || el; } }
              note(form, isNews ? T.invalidNews : T.invalid, false, 'warn');
              if (first) first.focus();
              return;
            }
            mailto(form, fields, isNews);
          })
          .catch(function () { mailto(form, fields, isNews); })
          .then(done, done);
      } catch (err) {
        // Nothing was sent (no fetch, no crypto, a bad payload): clear the busy state and offer the e-mail link.
        done();
        mailto(form, fields, isNews);
      }
    }, true);
  }
  var forms = document.querySelectorAll('form');
  for (var i = 0; i < forms.length; i++) arm(forms[i]);
})();
