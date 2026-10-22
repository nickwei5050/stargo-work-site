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
      if (f.type === 'hidden' && f.name === 'plan' && f.value) { fields.push({ key: 'plan', label: f.getAttribute('data-stargo-label') || 'Plan', value: f.value }); continue; }
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
  /* Z12 (form lane): an invalid field is marked where it is. aria-invalid, and
     the same sentence the status line carries, printed directly under the field
     when the field has a visible <label for> (the contact page), and tied to it
     with aria-describedby; on the placeholder-only forms the field points at the
     status line instead, so their layout is untouched. Cleared as soon as the
     visitor edits the field. */
  function describe(el, id, on) {
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
    if (on) ids.push(id);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby');
  }
  function clearInvalid(el) {
    if (!el || el.getAttribute('aria-invalid') !== 'true') return;
    el.removeAttribute('aria-invalid');
    var form = el.form;
    var note = form && form.querySelector('.stargo-form-note');
    var err = el.id && document.getElementById(el.id + '-stargo-error');
    if (err) err.hidden = true;
    /* Drop every error line and the status line from this field's description. */
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && !/-stargo-error$/.test(x) && !(note && x === note.id); });
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby');
    /* A field still invalid that pointed at the line just hidden gets its own. */
    if (!err || !form) return;
    var rest = form.querySelectorAll('[aria-invalid="true"]');
    for (var j = 0; j < rest.length; j++) {
      if ((rest[j].getAttribute('aria-describedby') || '').split(/\s+/).indexOf(err.id) !== -1) {
        describe(rest[j], err.id, false);
        markInvalid(form, rest[j], '');
      }
    }
  }
  function markInvalid(form, el, shared) {
    el.setAttribute('aria-invalid', 'true');
    var labelled = el.id && form.querySelector('label[for="' + el.id + '"]');
    if (labelled && shared) {
      /* One sentence covers both fields, so it is printed once, under the
         first; a later invalid field points at that same line. */
      describe(el, shared, true);
    } else if (labelled) {
      var id = el.id + '-stargo-error';
      var err = document.getElementById(id);
      if (!err) {
        err = document.createElement('p');
        err.id = id;
        err.className = 'stargo-field-error';
        el.parentNode.insertBefore(err, el.nextSibling);
      }
      err.textContent = T.invalid;
      err.hidden = false;
      describe(el, id, true);
    } else {
      var p = form.querySelector('.stargo-form-note');
      if (p) { if (!p.id) p.id = (form.id || 'stargo-form') + '-note'; describe(el, p.id, true); }
    }
    if (!el.hasAttribute('data-stargo-watch')) {
      el.setAttribute('data-stargo-watch', '');
      el.addEventListener('input', function () { clearInvalid(el); });
      el.addEventListener('change', function () { clearInvalid(el); });
    }
  }
  /* After a send that did not go through, the visitor's place is the status
     line that says so and offers the e-mail link, not <body>. */
  function focusNote(form) {
    var p = form.querySelector('.stargo-form-note');
    if (!p) return;
    p.setAttribute('tabindex', '-1');
    p.focus({ preventScroll: true });
    if (p.scrollIntoView) p.scrollIntoView({ block: 'center' });
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
    focusNote(form);
  }
  function arm(form) {
    var isNews = form.getAttribute('data-stargo-form') === 'newsletter' || (!form.querySelector('textarea') && form.querySelectorAll('input[type="email"]').length === 1 && form.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([name=website])').length <= 2);
    var lastPayload = '', submissionId = '';
    form.setAttribute('novalidate', 'novalidate');
    /* Z11 (form lane): a pricing plan button links here with ?plan=<key>. Only
       a key the form lists in data-stargo-plans is taken, and what is sent is
       that plan's own name, never the raw query text. */
    var planField = form.querySelector('input[type="hidden"][name="plan"][data-stargo-plans]');
    if (planField) {
      try {
        var plans = JSON.parse(planField.getAttribute('data-stargo-plans') || '{}');
        var key = new URLSearchParams(location.search).get('plan');
        if (key && Object.prototype.hasOwnProperty.call(plans, key)) planField.value = plans[key];
      } catch (err) { /* a malformed list or URL leaves the field empty */ }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (form.hasAttribute('data-stargo-busy')) return;
      var fields = collect(form);
      var email = form.querySelector('input[type="email"]');
      var name = form.querySelector('input[name="name"]:not([type=email]), input[name="Name"]:not([type=email])');
      var emailOk = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
      var nameOk = isNews || (name && name.value.trim());
      if (!emailOk || !nameOk) {
        note(form, T.invalid, false);
        var bad = [];
        if (!nameOk && name) bad.push(name);
        if (!emailOk && email) bad.push(email);
        clearInvalid(name); clearInvalid(email);
        bad.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });   // page order
        for (var b = 0; b < bad.length; b++) markInvalid(form, bad[b], b && bad[0].id ? bad[0].id + '-stargo-error' : '');
        if (bad[0]) {
          bad[0].focus({ preventScroll: true });
          if (bad[0].scrollIntoView) bad[0].scrollIntoView({ block: 'center' });
        }
        return;
      }
      clearInvalid(name); clearInvalid(email);
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { note(form, isNews ? T.sentNews : T.sent, true); return; }   // bots see success, nothing is sent
      if (!endpoint) { mailto(form, fields, isNews); return; }
      form.setAttribute('data-stargo-busy', '1');
      form.setAttribute('aria-busy', 'true');
      var submit = form.querySelector('[type=submit]');
      /* Z12: the button itself says it is sending (T.busy, the sentence the
         status line already shows) while the request is in flight. */
      var idle = submit && submit.tagName === 'INPUT' ? submit.value : null;
      if (submit) { submit.disabled = true; if (idle !== null) submit.value = T.busy; }
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
          if (res.status === 422) { note(form, T.invalid, false); focusNote(form); return; }
          mailto(form, fields, isNews);
        })
        .catch(function () { mailto(form, fields, isNews); })
        .finally(function () { if (timer) clearTimeout(timer); form.removeAttribute('data-stargo-busy'); form.setAttribute('aria-busy', 'false'); if (submit) { submit.disabled = false; if (idle !== null) submit.value = idle; } });
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
