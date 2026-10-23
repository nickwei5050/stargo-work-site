/* Phone parity: classes for css/stargo-phone.css, loaded with it on the first touch or scroll.
   What each part does and why: tools/chrome.mjs (phoneFx). Class toggles only. */
(function () {
  'use strict';
  var w = window, d = document;
  d.addEventListener('touchstart', function () {}, { passive: true }); // iOS: :active needs a touch listener
  if (!w.matchMedia) return;
  var calm = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function all(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  // Core-systems accordion, any width it shows at: `sg-open` follows the template's own open height.
  var acc = d.querySelector('.products-cards-mobile');
  if (acc && 'ResizeObserver' in w) {
    acc.classList.add('sg-acc');
    var ro = new ResizeObserver(function (es) {
      for (var i = 0; i < es.length; i++) es[i].target.parentNode.classList.toggle('sg-open', es[i].contentRect.height > 1);
    });
    all('.products-cards-dashboard-size', acc).forEach(function (s) { ro.observe(s); });
  }

  if (!w.matchMedia('(max-width: 767px)').matches || !('IntersectionObserver' in w)) return;

  // One observer; its root is a thin band across the middle of the screen.
  var watch = new Map(), dirty = [];
  var io = new IntersectionObserver(function (es) {
    for (var i = 0; i < es.length; i++) { var h = watch.get(es[i].target); if (h) h(es[i]); }
    for (var j = 0; j < dirty.length; j++) dirty[j]();
    dirty.length = 0;
  }, { rootMargin: '-49% 0px -49% 0px' });

  // A lit list: the item crossing the middle carries `cls`; with none crossing, the last keeps it.
  function focus(els, cls, box, first) {
    if (els.length < 2) return;
    var inBand = [], mid = [], cur = -1;
    function set(k) {
      if (k === cur) return;
      if (cur >= 0) els[cur].classList.remove(cls);
      els[k].classList.add(cls);
      cur = k;
      if (box) box.classList.add('sg-focusing');
    }
    function settle() {
      var best = -1, bestD = Infinity;
      for (var k = 0; k < els.length; k++) if (inBand[k] && mid[k] < bestD) { bestD = mid[k]; best = k; }
      if (best >= 0) set(best);
    }
    els.forEach(function (el, i) {
      watch.set(el, function (e) {
        var r = e.boundingClientRect, b = e.rootBounds;
        inBand[i] = e.isIntersecting;
        mid[i] = Math.abs(r.top + r.height / 2 - (b ? b.top + b.height / 2 : w.innerHeight / 2));
        if (dirty.indexOf(settle) < 0) dirty.push(settle);
      });
      io.observe(el);
    });
    if (first) set(0);
  }
  // Played once, the first time `el` reaches the middle; then unobserved.
  function once(el, fn) {
    if (!el) return;
    watch.set(el, function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(el); watch.delete(el);
      fn();
    });
    io.observe(el);
  }
  // A class that takes itself off when its animation ends.
  function cue(el, cls) {
    el.addEventListener('animationend', function end(e) {
      if (e.target !== el && !el.contains(e.target)) return;
      el.classList.remove(cls); el.removeEventListener('animationend', end);
    });
    el.classList.add(cls);
  }

  var stages = d.querySelector('.service-list'); // homepage, the five business stages
  if (stages) {
    stages.classList.add('sg-fx-stages');
    focus(all('.service-wrapper', stages), 'is-lit', null, true);
  }
  focus(all('.rk-insight .rk-rt-insights-item-wrapper'), 'is-focus', null, false); // capability insight rows
  var lines = d.querySelector('.lx-gradient-section-text'); // intelligence, the four lines
  if (lines) focus(all('.lx-gradient-section-text-holder', lines), 'is-focus', lines, false);

  if (!calm) {
    var card = d.querySelector('.stats-container'); // pricing ladder: the first card turns a little
    once(card, function () { cue(card, 'sg-peek'); });
    once(acc, function () { // accordion: point at the next closed system, once; never open it
      var blocks = all('.products-cards-inner-block-mobile', acc), open = -1;
      for (var i = 0; i < blocks.length; i++) if (blocks[i].classList.contains('sg-open')) { open = i; break; }
      var next = blocks[open + 1];
      var name = next && !next.classList.contains('sg-open') && next.querySelector('.products-card-name-block');
      if (name) cue(name, 'sg-nudge');
    });
  }

  // Product tour: a sideways swipe on the screenshot changes tab.
  var tour = d.querySelector('.sg-tour');
  if (tour) {
    var tabs = all('.sg-tour-tab', tour), x0 = 0, y0 = 0, on = false;
    tour.addEventListener('touchstart', function (e) {
      on = e.touches.length === 1 && !!e.target.closest('.sg-tour-stage');
      if (on) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }
    }, { passive: true });
    tour.addEventListener('touchend', function (e) {
      if (!on) return;
      on = false;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0, cur = -1;
      if (Math.abs(dx) <= 40 || Math.abs(dx) <= Math.abs(dy)) return;
      for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('aria-selected') === 'true') cur = i;
      var k = cur + (dx < 0 ? 1 : -1);
      if (cur < 0 || k < 0 || k >= tabs.length) return;
      var panel = d.getElementById(tabs[k].getAttribute('aria-controls'));
      all('.sg-tour-panel[data-sg-swipe]', tour).forEach(function (p) { p.removeAttribute('data-sg-swipe'); });
      if (panel) panel.setAttribute('data-sg-swipe', dx < 0 ? 'next' : 'prev');
      tabs[k].click();
    }, { passive: true });
  }
})();
