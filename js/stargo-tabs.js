/* Webflow tabs and the pricing period toggle, without a second Webflow runtime.
   One runtime can exist on a page (window.Webflow is a singleton); the Mono
   runtime this site loads registers no `tabs` module, so the Scalora pricing
   tabs are driven here with the same markup contract Webflow uses:
   .w-tab-link[data-w-tab] ↔ .w-tab-pane[data-w-tab], w--current / w--tab-active,
   data-duration-in / data-duration-out for the fade. */
(function () {
  function fade(el, from, to, ms, done) {
    el.style.transition = 'opacity ' + ms + 'ms ease';
    el.style.opacity = from;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = to;
        setTimeout(function () { el.style.transition = ''; if (done) done(); }, ms);
      });
    });
  }

  function initTabs(root) {
    var links = root.querySelectorAll('.w-tab-link');
    var panes = root.querySelectorAll('.w-tab-pane');
    var dIn = parseInt(root.getAttribute('data-duration-in') || '300', 10);
    var dOut = parseInt(root.getAttribute('data-duration-out') || '100', 10);
    var busy = false;
    function activate(name) {
      if (busy) return;
      var current = root.querySelector('.w-tab-pane.w--tab-active');
      var next = null;
      for (var i = 0; i < panes.length; i++) if (panes[i].getAttribute('data-w-tab') === name) next = panes[i];
      if (!next || next === current) return;
      busy = true;
      for (var j = 0; j < links.length; j++) {
        var on = links[j].getAttribute('data-w-tab') === name;
        links[j].classList.toggle('w--current', on);
        links[j].setAttribute('aria-selected', on ? 'true' : 'false');
        links[j].setAttribute('tabindex', on ? '0' : '-1');
      }
      var show = function () {
        if (current) current.classList.remove('w--tab-active');
        next.classList.add('w--tab-active');
        fade(next, 0, 1, dIn, function () { busy = false; });
      };
      if (current) fade(current, 1, 0, dOut, show); else show();
    }
    for (var k = 0; k < links.length; k++) {
      links[k].setAttribute('role', 'tab');
      links[k].addEventListener('click', function (e) { e.preventDefault(); activate(this.getAttribute('data-w-tab')); });
      links[k].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(this.getAttribute('data-w-tab')); } });
    }
  }

  /* Pricing period: the template ships the two price blocks (.monthly / .year)
     and two dot toggles, with the yearly block hidden by CSS and no behaviour
     wired to the dots. Wire it. */
  function initPeriod(block) {
    var opts = block.querySelectorAll('.pricng-tab-info');
    if (opts.length < 2) return;
    function select(idx) {
      for (var i = 0; i < opts.length; i++) {
        var dot = opts[i].querySelector('.pricing-tab-bot');
        opts[i].classList.toggle('is-active', i === idx);
        if (dot) dot.style.backgroundColor = i === idx ? 'var(--border-color--border-color-03)' : 'var(--border-color--border-color-02)';
      }
      var yearly = idx === 1;
      var monthlyBlocks = document.querySelectorAll('.pricing-card-price-block.monthly');
      var yearBlocks = document.querySelectorAll('.pricing-card-price-block.year');
      for (var m = 0; m < monthlyBlocks.length; m++) monthlyBlocks[m].style.display = yearly ? 'none' : '';
      for (var y = 0; y < yearBlocks.length; y++) yearBlocks[y].style.display = yearly ? 'flex' : '';
    }
    for (var i = 0; i < opts.length; i++) {
      opts[i].style.cursor = 'pointer';
      opts[i].setAttribute('role', 'button');
      opts[i].setAttribute('tabindex', '0');
      (function (idx) {
        opts[idx].addEventListener('click', function () { select(idx); });
        opts[idx].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(idx); } });
      })(i);
    }
    select(0);
  }


  /* Keep the template's four panels, sticky layout and crossfade. One
     controller owns both click and scroll state; no scroll-position guessing,
     corrective nudges, or competing IX2 writers (see tools/fuse-ix.mjs). */
  function initSwitcher() {
    var block = document.querySelector('.product-sticky-block');
    if (!block) return;
    var names = block.querySelectorAll('.products-card-name-wrapper .products-card-name-block');
    var panels = block.querySelectorAll('.products-cards-right-inner-block .products-cards-dashboard-block');
    if (names.length !== 4 || panels.length !== 4) return;
    var active = -1;
    var trigger = null;
    var clickTarget = null;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var list = block.querySelector('.products-card-name-wrapper');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-orientation', 'vertical');
    list.setAttribute('aria-label', document.documentElement.lang.startsWith('zh') ? '核心系统' : 'Core systems');
    block.classList.add('stargo-switcher');
    function activate(index) {
      if (index === active) return;
      active = index;
      for (var k = 0; k < names.length; k++) {
        var selected = k === index;
        names[k].setAttribute('aria-selected', String(selected));
        names[k].setAttribute('tabindex', selected ? '0' : '-1');
        panels[k].classList.toggle('is-active', selected);
        panels[k].setAttribute('aria-hidden', String(!selected));
        panels[k].inert = !selected;
      }
    }
    function go(i) {
      if (trigger) trigger.refresh(); // Earlier template reveals can change page height.
      activate(i);
      if (!trigger) return; // Click remains functional if animation JS is unavailable.
      var y = trigger.start + (trigger.end - trigger.start) * (i + 0.5) / names.length;
      clickTarget = i;
      if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) {
        lenis.scrollTo(y, { duration: 0.8, immediate: reduced.matches, onComplete: function () { clickTarget = null; } });
      } else {
        window.scrollTo(0, y);
        clickTarget = null;
      }
    }
    for (var i = 0; i < names.length; i++) {
      (function (idx) {
        var n = names[idx];
        n.id = 'core-tab-' + idx;
        n.setAttribute('role', 'tab');
        n.setAttribute('aria-controls', 'core-panel-' + idx);
        panels[idx].id = 'core-panel-' + idx;
        panels[idx].setAttribute('role', 'tabpanel');
        panels[idx].setAttribute('aria-labelledby', n.id);
        n.addEventListener('click', function () { go(idx); });
        n.addEventListener('keydown', function (e) {
          var to = idx;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (idx + 1) % names.length;
          else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (idx + names.length - 1) % names.length;
          else if (e.key === 'Home') to = 0;
          else if (e.key === 'End') to = names.length - 1;
          else if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          go(to);
          names[to].focus({ preventScroll: true });
        });
      })(i);
    }
    activate(0);
    function interrupt() { clickTarget = null; }
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 992px)', function () {
      trigger = ScrollTrigger.create({
        id: 'stargo-core-systems',
        trigger: block,
        start: 'top top',
        end: function () { return '+=' + Math.max(1, block.offsetHeight - window.innerHeight); },
        onUpdate: function (self) {
          if (clickTarget === null) activate(Math.min(names.length - 1, Math.floor(self.progress * names.length)));
        },
        onRefresh: function (self) {
          if (clickTarget === null) activate(Math.min(names.length - 1, Math.floor(self.progress * names.length)));
        }
      });
      return function () { trigger = null; clickTarget = null; };
    });
    // Fonts/images can alter the sticky start after initial layout.
    if (document.fonts) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true });
    if ('ResizeObserver' in window) {
      var refreshTimer;
      new ResizeObserver(function () {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(function () { if (trigger) trigger.refresh(); }, 120);
      }).observe(document.body);
    }
  }
  initSwitcher();

  var tabs = document.querySelectorAll('.w-tabs');
  for (var i = 0; i < tabs.length; i++) initTabs(tabs[i]);
  var periods = document.querySelectorAll('.pricing-tabs-info-block');
  for (var p = 0; p < periods.length; p++) initPeriod(periods[p]);
})();
