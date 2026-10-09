/* OPEN WORK page behaviour (tools/ow-blocks): the showcase tabs, the
   product-shot lightbox, the demo bar, the product page's folded catalogue,
   the pricing questions and the contact form's plan. Hand-written, no
   dependencies, loaded with defer on every page tools/build-site.mjs builds
   with owShell (all but the blog). Without it every
   showcase panel is shown in turn (css/stargo-ow.css), the pictures stay as
   they are, the catalogue groups open by hand and the demo bar never
   appears. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      // keep the selected tab in view when the tab bar scrolls sideways
      var bar = tab.closest('.ow-tablist-wrap');
      if (bar && bar.scrollWidth > bar.clientWidth) {
        var l = tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, l), behavior: reduce ? 'auto' : 'smooth' });
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

  /* ---- demo bar: in once the hero's buttons are gone, out at the demo band,
     and out while it would sit on a product shot (it used to cover the
     showcase's own words, 「批准前不会发给客户」). Its box is read without the
     slide-in transform (offset*), so the test does not depend on whether it
     is showing. */
  (function () {
    var bar = document.querySelector('[data-ow-sticky]');
    var cta = document.querySelector('.ow-hero .ow-cta-row');
    var demo = document.getElementById('demo');
    if (!bar || !cta || !demo) return;
    var shots = document.querySelectorAll('.ow-shot .ow-frame, .ow-shot-meta, [data-ow-avoid]');
    var on = false;
    function overShot() {
      var top = bar.offsetTop - 8, bottom = bar.offsetTop + bar.offsetHeight + 8;
      var left = bar.offsetLeft - 8, right = bar.offsetLeft + bar.offsetWidth + 8;
      for (var i = 0; i < shots.length; i++) {
        var r = shots[i].getBoundingClientRect();
        if (r.width && r.top < bottom && r.bottom > top && r.left < right && r.right > left) return true;
      }
      return false;
    }
    function update() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      var show = cta.getBoundingClientRect().bottom < 0 && demo.getBoundingClientRect().top > h * 0.85 && !overShot();
      if (show === on) return;
      on = show;
      bar.classList.toggle('is-on', show);
      if (show) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    }
    var queued = false;
    function queue() { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; update(); }); } }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  })();

  /* ---- folded catalogue (product page): open the group an address names
     (capabilities.html#g08, from an article or a link on the page), and the
     「全部展开 / 全部收起」 button. Without this script every group is a plain
     <details> the reader opens by hand. */
  (function () {
    function openTarget() {
      var id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
      var el = id && document.getElementById(id);
      var d = el && (el.tagName === 'DETAILS' ? el : el.closest && el.closest('details'));
      if (d && !d.open) d.open = true;
    }
    openTarget();
    window.addEventListener('hashchange', openTarget);
    var all = document.querySelectorAll('[data-ow-expand]');
    for (var i = 0; i < all.length; i++) {
      (function (btn) {
        var root = document.querySelector(btn.getAttribute('data-ow-expand'));
        if (!root) return;
        var label = btn.querySelector('span');
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') !== 'true';
          var groups = root.querySelectorAll('details');
          for (var j = 0; j < groups.length; j++) groups[j].open = on;
          btn.setAttribute('aria-pressed', String(on));
          if (label) label.textContent = btn.getAttribute(on ? 'data-label-close' : 'data-label-open');
        });
      })(all[i]);
    }
  })();

  /* ---- pricing questions (<details>): aria-expanded follows the answer, and
     Escape closes an open one. Without this script they still open and close. */
  (function () {
    var items = document.querySelectorAll('[data-ow-faq] details');
    for (var i = 0; i < items.length; i++) {
      (function (d) {
        var q = d.querySelector('summary');
        if (!q) return;
        function sync() { q.setAttribute('aria-expanded', String(d.open)); }
        d.addEventListener('toggle', sync);
        q.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && d.open) { e.preventDefault(); d.open = false; sync(); }
        });
        sync();
      })(items[i]);
    }
  })();

  /* ---- the demo form names the plan a pricing card linked from
     (contact.html?plan=growth …); without the script the select says
     「还没决定」 and the reader picks one. */
  (function () {
    var sel = document.querySelector('[data-ow-plan]');
    if (!sel) return;
    var m = /[?&]plan=([a-z-]+)/.exec(location.search);
    if (!m) return;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === m[1]) { sel.selectedIndex = i; break; }
    }
  })();

  /* ---- lightbox ---------------------------------------------------------
     It opens the widest file of the srcset that is showing: on a phone the
     card's own <source> (fitted to the screen, pinch to zoom), on a desktop
     the 2400w render, never smaller than the picture was on the page. A
     full-app render opens at its data-ow-zoom-w (1800px) and is scrolled so
     its chat column is in the middle. */
  var box = document.getElementById('ow-lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  var big = box.querySelector('.ow-lightbox-img');
  var body = box.querySelector('.ow-lightbox-body');
  var opener = null;
  var smooth = typeof lenis !== 'undefined' ? lenis : null;   // the page's Lenis instance (template script), if any

  function widest(srcset, fallback) {
    var best = { url: fallback, w: 0 };
    (srcset || '').split(',').forEach(function (part) {
      var bits = part.trim().split(/\s+/);
      var w = parseInt(bits[1], 10);
      if (bits[0] && w > best.w) best = { url: bits[0], w: w };
    });
    return best;
  }
  function fileOf(img) {
    var pic = img.parentNode && img.parentNode.tagName === 'PICTURE' ? img.parentNode : null;
    var sources = pic ? pic.querySelectorAll('source') : [];
    for (var i = 0; i < sources.length; i++) {
      var m = sources[i].getAttribute('media');
      if (!m || matchMedia(m).matches) return widest(sources[i].getAttribute('srcset'), img.currentSrc || img.src);
    }
    return widest(img.getAttribute('srcset'), img.getAttribute('src'));
  }
  function layout(button, file, shown) {
    var shownWidth = shown.width;
    var room = body.clientWidth;
    /* at least as large as on the page, at most 1.4 CSS px per image pixel… */
    var cap = file.w ? file.w / 1.4 : room;
    var min = parseInt(button.getAttribute('data-ow-zoom-w'), 10) || 0;
    var w = Math.min(cap, Math.max(room, min, shownWidth));
    /* …and on a phone the screen's width: the card is already a phone layout */
    if (window.innerWidth < 992) w = room;
    big.style.width = Math.round(w) + 'px';
    /* the picture's proportions before the file arrives, so the dialog can
       scroll to the right place at once */
    if (shown.width && shown.height) big.style.aspectRatio = shown.width + ' / ' + shown.height;
    var x = parseFloat(button.getAttribute('data-ow-zoom-x'));
    var left = isFinite(x) && w > room ? Math.max(0, w * x - room / 2) : 0;
    /* after the dialog's first layout, or the browser keeps it at 0 */
    function place() { body.scrollTo({ top: 0, left: left, behavior: 'auto' }); }
    place();
    requestAnimationFrame(place);
    big.onload = place;
  }
  function open(button) {
    var img = button.querySelector('img');
    if (!img) return;
    opener = button;
    var file = fileOf(img);
    var shown = img.getBoundingClientRect();
    big.alt = img.alt;
    big.src = file.url;
    box.setAttribute('aria-label', button.getAttribute('aria-label') || '');
    box.showModal();
    if (smooth && smooth.stop) smooth.stop();
    layout(button, file, shown);
    body.focus({ preventScroll: true });
  }
  box.addEventListener('close', function () {
    if (smooth && smooth.start) smooth.start();
    big.removeAttribute('src');
    big.style.width = '';
    big.style.aspectRatio = '';
    big.onload = null;
    if (opener) { opener.focus({ preventScroll: true }); opener = null; }
  });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('[data-ow-close]')) box.close();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var b = e.target.closest('[data-ow-zoom]');
    /* the 「点图放大」 hint beside a shot opens the same picture */
    if (!b) {
      var hint = e.target.closest('[data-ow-hint]');
      var fig = hint && hint.closest('.ow-shot');
      b = fig && fig.querySelector('[data-ow-zoom]');
    }
    if (b) { e.preventDefault(); open(b); }
  });
})();
