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


  /* Core-system switcher on the homepage. The template drives the four panels
     from scroll progress (an IX2 "scroll into view" action list over a 400vh
     block). The four names on the left were only styled as tabs. Clicking one
     scrolls the page to the zone where that panel is the active one, then
     nudges the position until the panel actually reads as fully visible — the
     scroll animation stays the single source of truth, and the mapping never
     has to be guessed. Lenis (the template's smooth scroll) is used when
     present. */
  function initSwitcher() {
    var block = document.querySelector('.product-sticky-block');
    if (!block) return;
    var names = block.querySelectorAll('.products-card-name-wrapper .products-card-name-block');
    var panels = block.querySelectorAll('.products-cards-right-inner-block .products-cards-dashboard-block');
    if (names.length !== 4 || panels.length !== 4) return;
    var zones = [0.17, 0.37, 0.58, 0.72];      // rough scroll progress of each panel; refined live
    var settling = 0;
    function scrollTo(y, seconds) {
      if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { duration: seconds });
      else window.scrollTo({ top: y, behavior: seconds > 0.4 ? 'smooth' : 'auto' });
    }
    function opacity(el) { return +getComputedStyle(el).opacity || 0; }
    /* The scroll animation only advances on scroll events (its smoothing is
       applied per event), so after an animated scroll ends it can sit halfway
       through a crossfade. A handful of ±1px scroll events lets it converge. */
    function jiggle(n, done) {
      if (n <= 0) { done(); return; }
      window.scrollBy(0, n % 2 ? 1 : -1);
      requestAnimationFrame(function () { setTimeout(function () { jiggle(n - 1, done); }, 24); });
    }
    function settle(i, token, attempt) {
      if (token !== settling) return;
      jiggle(10, function () {
        if (token !== settling) return;
        if (opacity(panels[i]) > 0.96 || attempt > 12) return;
        var shown = -1, best = 0;
        for (var k = 0; k < 4; k++) { var o = opacity(panels[k]); if (o > best) { best = o; shown = k; } }
        var dir = shown > i ? -1 : 1;                 // wrong panel, or still mid-fade: keep moving toward the zone
        window.scrollBy(0, dir * 40);
        setTimeout(function () { settle(i, token, attempt + 1); }, 60);
      });
    }
    function go(i) {
      var vh = window.innerHeight;
      var top = block.getBoundingClientRect().top + window.pageYOffset;
      var y = Math.round(top - vh + (block.offsetHeight + vh) * zones[i]);
      var token = ++settling;
      scrollTo(y, 1.1);
      setTimeout(function () { settle(i, token, 0); }, 1300);
    }
    for (var i = 0; i < names.length; i++) {
      (function (idx) {
        var n = names[idx];
        n.setAttribute('role', 'button');
        n.setAttribute('tabindex', '0');
        n.addEventListener('click', function () { go(idx); });
        n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(idx); } });
      })(i);
    }
  }
  initSwitcher();

  var tabs = document.querySelectorAll('.w-tabs');
  for (var i = 0; i < tabs.length; i++) initTabs(tabs[i]);
  var periods = document.querySelectorAll('.pricing-tabs-info-block');
  for (var p = 0; p < periods.length; p++) initPeriod(periods[p]);
})();
