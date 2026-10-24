/**
 * Phone and tablet header that comes back on scroll-up (review item Z05).
 *
 * Below 992px the header (`.navigation-top`, Mono's absolute bar holding the
 * logo, the compact 预约演示 / Book a Demo pill and Webflow's menu button)
 * scrolled away with the hero, and nothing else on the page reached the menu:
 * the floating pill is desktop-only. This keeps the bar where it is at the
 * top of the page and, once the reader has scrolled past it, brings it back
 * as soon as they scroll up, then slides it away again when they scroll on
 * down. The CSS is at the end of css/stargo-fusion.css ("Lane: phone").
 *
 * States, as classes on <html>:
 *   stargo-nav-stick  the bar is sticky at the top of the viewport (it keeps
 *                     its place in the flow through a negative margin of its
 *                     own height, so nothing below it moves);
 *   stargo-nav-show   ...and is on screen; without it the bar sits just above
 *                     the viewport, translated by its own height.
 * Nothing is added from 992px up, while the Webflow menu is open, or before
 * the reader has scrolled one bar height down.
 */
(function () {
  var bar = document.querySelector('.navigation-top');
  if (!bar || !window.matchMedia) return;
  var root = document.documentElement;
  var phone = window.matchMedia('(max-width: 991px)');
  var lastY = window.scrollY || 0;
  var travel = 0;          // distance scrolled in the current direction
  /* How far the reader must scroll up before the bar comes back, and down
     before it goes. The page's smooth-scroll settles a few pixels backwards
     after a fling has stopped (10px measured on the homepage at 390), which
     is not the reader asking for the menu. */
  var UP = 40, DOWN = 12;
  var ticking = false;

  function height() { return bar.offsetHeight || 68; }
  function menuOpen() { return !!bar.querySelector('.w-nav-button.w--open'); }
  function set(stick, show) {
    root.classList.toggle('stargo-nav-stick', stick);
    root.classList.toggle('stargo-nav-show', stick && show);
  }

  function update() {
    ticking = false;
    var y = window.scrollY || 0;
    var dy = y - lastY;
    lastY = y;
    if (!phone.matches) { set(false, false); return; }
    if (menuOpen()) return;                     // keep whatever is on screen while the menu is open
    root.style.setProperty('--stargo-nav-h', height() + 'px');
    if ((dy > 0) !== (travel > 0)) travel = 0;
    travel += dy;
    var stuck = root.classList.contains('stargo-nav-stick');
    var shown = root.classList.contains('stargo-nav-show');
    if (y <= 2) { set(false, false); return; }  // back at the top: the bar is in its own place
    if (travel < -UP) {
      if (!stuck) {
        // Start hidden above the viewport, then slide in on the next frame.
        set(true, false);
        requestAnimationFrame(function () { if (root.classList.contains('stargo-nav-stick')) set(true, true); });
      } else if (!shown) set(true, true);
    } else if (travel > DOWN && stuck && shown) {
      set(true, false);
    } else if (stuck && !shown && y < height()) {
      set(false, false);                        // the bar's own place is on screen again
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  if (phone.addEventListener) phone.addEventListener('change', update);
})();
