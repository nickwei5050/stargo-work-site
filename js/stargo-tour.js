/* 真实界面 — tabs and numbered markers for the homepage product tour (tools/product-tour.mjs). */
(function () {
  var root = document.querySelector('.sg-tour');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.sg-tour-tab'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function select(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
      panels[k].classList.toggle('is-in', on);
    });
    if (focus) tabs[i].focus();
    // keep the active tab visible when the row scrolls on phones
    var row = tabs[i].parentNode;
    if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: 'smooth' });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, k = null;
      if (e.key === 'ArrowRight') k = (i + 1) % n;
      else if (e.key === 'ArrowLeft') k = (i - 1 + n) % n;
      else if (e.key === 'Home') k = 0;
      else if (e.key === 'End') k = n - 1;
      if (k !== null) { e.preventDefault(); select(k, true); }
    });
  });

  // Pointing at a sentence lights its marker on the screenshot, and the other way round.
  panels.forEach(function (p) {
    function light(id) {
      p.querySelectorAll('[data-pin]').forEach(function (el) { el.classList.toggle('is-on', id !== null && el.getAttribute('data-pin') === id); });
    }
    p.querySelectorAll('li[data-pin]').forEach(function (li) {
      li.addEventListener('mouseenter', function () { light(li.getAttribute('data-pin')); });
      li.addEventListener('mouseleave', function () { light(null); });
      li.addEventListener('click', function () { light(li.getAttribute('data-pin')); });
    });
  });
  // Click a screenshot to see it full size.
  var lang = document.documentElement.lang || '';
  var closeLabel = /^zh/.test(lang) ? '关闭' : 'Close';
  var box = document.createElement('div');
  box.className = 'sg-tour-zoom';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button type="button" class="sg-tour-zoom-x" aria-label="' + closeLabel + '">×</button><img alt=""/>';
  document.body.appendChild(box);
  var zimg = box.querySelector('img'), back = null;
  function close() { box.hidden = true; document.documentElement.classList.remove('sg-tour-locked'); if (back) back.focus(); }
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
  root.querySelectorAll('.sg-tour-pic').forEach(function (pic) {
    var img = pic.querySelector('img');
    pic.tabIndex = 0;
    pic.setAttribute('role', 'button');
    pic.setAttribute('aria-label', img.alt);
    function open() {
      back = pic;
      zimg.src = img.getAttribute('src');
      zimg.alt = img.alt;
      box.hidden = false;
      document.documentElement.classList.add('sg-tour-locked');
      box.querySelector('button').focus();
    }
    pic.addEventListener('click', open);
    pic.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
})();
