/* OPEN WORK homepage behaviour (tools/ow-blocks): the showcase tabs and the
   product-shot lightbox. Hand-written, no dependencies, loaded with defer on
   the two homepages only. Without it every showcase panel is shown in turn
   (css/stargo-ow.css) and the pictures stay as they are. */
(function () {
  'use strict';

  /* ---- tabs: WAI-ARIA tab pattern, automatic activation ---------------- */
  function initTabs(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = panelOf(t);
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
      // keep the selected tab in view when the tab bar scrolls sideways (phones)
      var bar = tab.closest('.ow-tablist-wrap');
      if (bar && bar.scrollWidth > bar.clientWidth) {
        var l = tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, l), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') to = tabs[0];
        else if (e.key === 'End') to = tabs[tabs.length - 1];
        if (!to) return;
        e.preventDefault();
        select(to, true);
      });
    });
  }
  var sets = document.querySelectorAll('[data-ow-tabs]');
  for (var s = 0; s < sets.length; s++) initTabs(sets[s]);

  /* ---- lightbox: the widest file in the picture's own srcset ------------ */
  var box = document.getElementById('ow-lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  var big = box.querySelector('.ow-lightbox-img');
  var body = box.querySelector('.ow-lightbox-body');
  var opener = null;
  var smooth = typeof lenis !== 'undefined' ? lenis : null;   // the page's Lenis instance (template script), if any

  function widest(img) {
    var best = { url: img.getAttribute('src'), w: 0 };
    (img.getAttribute('srcset') || '').split(',').forEach(function (part) {
      var bits = part.trim().split(/\s+/);
      var w = parseInt(bits[1], 10);
      if (bits[0] && w > best.w) best = { url: bits[0], w: w };
    });
    return best.url;
  }
  function open(button) {
    var img = button.querySelector('img');
    if (!img) return;
    opener = button;
    big.alt = img.alt;
    big.src = widest(img);
    box.showModal();
    if (smooth && smooth.stop) smooth.stop();
    // a phone shows the full screen at full size: start at the left edge, top
    body.scrollTo(0, 0);
  }
  box.addEventListener('close', function () {
    if (smooth && smooth.start) smooth.start();
    big.removeAttribute('src');
    if (opener) { opener.focus({ preventScroll: true }); opener = null; }
  });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('[data-ow-close]')) box.close();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ow-zoom]');
    if (b) { e.preventDefault(); open(b); }
  });
})();
