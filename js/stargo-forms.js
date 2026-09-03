/* Forms on this site have no receiving endpoint yet.
   The template posts them to Webflow's form service, which this static
   deployment does not have. Rather than let a submission fail with the
   template's generic error — or worse, show "Thank you!" for a message that
   went nowhere — every form says exactly what happened. */
(function () {
  var NOTICE = '这个表单还没有接入收件端。正式联系方式待业主确认后启用；在此之前，请通过页脚给出的渠道联系。';
  function arm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
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
    }, true);
  }
  var forms = document.querySelectorAll('form');
  for (var i = 0; i < forms.length; i++) arm(forms[i]);
})();
