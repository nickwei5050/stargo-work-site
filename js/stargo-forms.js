/* Forms on this site have no receiving endpoint. The template posts them to
   Webflow's form service, which this static deployment does not have.
   Every submission is turned into a pre-filled e-mail to the public sales
   address instead, and the page says so — nothing shows "Thank you" for a
   message that went nowhere. */
(function () {
  var TO = 'sales@stargomoto.com';
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var NOTICE = zh
    ? '已为你打开邮件客户端。也可以直接发到 sales@stargomoto.com，或 WhatsApp +86 187 7512 7878。'
    : 'Your mail client should open now. You can also write to sales@stargomoto.com or WhatsApp +86 187 7512 7878.';

  function label(form, el) {
    var l = el.id && form.querySelector('label[for="' + el.id + '"]');
    return (l && l.textContent.trim()) || el.getAttribute('placeholder') || el.name || '';
  }

  function arm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var lines = [];
      var fields = form.querySelectorAll('input, select, textarea');
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (f.type === 'submit' || f.type === 'hidden' || f.type === 'button') continue;
        var v = f.tagName === 'SELECT' ? (f.options[f.selectedIndex] || {}).text : f.value;
        if (v && String(v).trim()) lines.push(label(form, f) + ': ' + String(v).trim());
      }
      var subject = zh ? 'STARGO WORK 咨询' : 'STARGO WORK inquiry';
      var href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var wrap = form.parentElement;
      var done = wrap && wrap.querySelector('.w-form-done');
      form.style.display = 'none';
      if (done) {
        var inner = done.querySelector('div') || done;
        inner.textContent = NOTICE;
        done.style.display = 'block';
      } else {
        var p = document.createElement('p');
        p.textContent = NOTICE;
        form.insertAdjacentElement('afterend', p);
      }
      window.location.href = href;
    }, true);
  }
  var forms = document.querySelectorAll('form');
  for (var i = 0; i < forms.length; i++) arm(forms[i]);
})();
