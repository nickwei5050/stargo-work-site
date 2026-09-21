/**
 * Same-page links whose target moves while the page scrolls to it.
 *
 * Webflow's scroll module takes every same-page "#" link: it cancels the
 * click, pushes the hash, measures where the target is at that moment and
 * glides to that fixed point (duration 472 * ln(distance + 125) - 2000 ms,
 * cubic in-out). On intelligence.html that fixed point goes stale on the way.
 * Below 768px the three expandable cards under the hero are in the page flow,
 * and each one collapses from about 24rem to 5rem once it has been scrolled
 * past, so the page is some 888px shorter by the time the glide ends. The
 * hero's second button, which points at the closing card (#lx-evolution),
 * landed that far below it, in the footer, at 320-430px in both languages.
 *
 * Links marked `data-stargo-anchor` get the same glide — same duration, same
 * easing, same hash and focus handling — but the target is measured again on
 * every frame, so the glide ends where the target is when it ends. Nothing on
 * the page changes size because of this, and the cards collapse exactly as
 * before. The listener sits on the link itself and stops the click there, so
 * Webflow's delegated handler on the document never starts a second glide.
 * A wheel, touch or key press by the reader ends the glide where it is.
 */
(function () {
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function ease(c) { return c < 0.5 ? 4 * c * c * c : (c - 1) * (2 * c - 2) * (2 * c - 2) + 1; }
  function top(el) { return el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop); }
  function maxY() { return document.documentElement.scrollHeight - window.innerHeight; }

  function focusTarget(el) {
    var had = el.getAttribute('tabindex');
    if (had === null) el.setAttribute('tabindex', '-1');
    el.classList.add('wf-force-outline-none');
    try { el.focus({ preventScroll: true }); } catch (e) { /* older engines */ }
    if (had === null) el.removeAttribute('tabindex');
    el.classList.remove('wf-force-outline-none');
  }

  function glide(el) {
    var start = window.pageYOffset || document.documentElement.scrollTop;
    var end = Math.min(top(el), maxY());
    var still = document.body.getAttribute('data-wf-scroll-motion') === 'none' || (reduce && reduce.matches);
    var duration = still ? 0 : Math.max(0, 472.143 * Math.log(Math.abs(end - start) + 125) - 2000);
    var began = Date.now();
    var stopped = false;
    function stop() { stopped = true; }
    var opts = { passive: true, once: true };
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchstart', stop, opts);
    window.addEventListener('keydown', stop, opts);
    function done() {
      window.removeEventListener('wheel', stop, opts);
      window.removeEventListener('touchstart', stop, opts);
      window.removeEventListener('keydown', stop, opts);
    }
    function frame() {
      if (stopped) { done(); return; }
      var t = Date.now() - began;
      var goal = Math.min(top(el), maxY());
      if (t >= duration) {
        window.scrollTo(0, goal);
        done();
        focusTarget(el);
        return;
      }
      window.scrollTo(0, start + (goal - start) * ease(t / duration));
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bind(a) {
    a.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var hash = a.hash;
      if (!hash || hash.length < 2 || a.host + a.pathname !== location.host + location.pathname) return;
      var el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      if (location.hash !== hash && window.history && history.pushState) history.pushState({ hash: hash }, '', hash);
      glide(el);
    });
  }

  function run() {
    var links = document.querySelectorAll('a[data-stargo-anchor]');
    for (var i = 0; i < links.length; i++) bind(links[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
