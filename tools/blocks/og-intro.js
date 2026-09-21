/* og-intro — the homepage's opening, played once and then taken away.

   Three donor animations, in the order the owner asked for them. Every
   duration, delay, easing, transform and stagger below is the donor's own; the
   reasons none of the three can travel through tools/donor-lib.mjs, and where
   each number was read from, are in the header of tools/blocks/og-intro.mjs.
   Written to js/stargo-intro.js by tools/build-site.mjs — do not edit that copy.

     phase 1   offgrid IX2 a-24 "Hero Load In", the two items this cut keeps
                 a-24-n-8  the h1        opacity 0 → 1, delay 0,    600ms, inOutQuart
                 a-24-n-2  the span      width 0.5% → AUTO, delay 1000, 1200ms,
                                         cubic-bezier(.544, -.011, 0, .983)
     phase 2   offgrid's own gsap.fromTo on [data-works-grid] .grid__img
                 autoAlpha 0→1, scale .8→1, rotateY 45→0, duration 1,
                 stagger { amount: .8, from: 'center', grid: [4, 9] }
     phase 3   rototo ix3 t-195e7dff / ta-ae57309f on .page-loader-column
                 y 0% → -100%, duration .5 (the runtime's DEFAULTS.DURATION),
                 ease 5 = power2.out, stagger { each: .015, from: 'random' },
                 at position .5 of its timeline

   Sequencing. Phase 2 begins where phase 1's last motion ends (1000 + 1200ms);
   phase 3 begins where phase 2's stagger ends. No pause is invented between
   them. The one beat that is not a donor value in its donor's direction is
   phase 3's arrival: rototo's loader is already covering its page when that
   page loads, so it only ever plays the lift, and here it has to come down over
   the settled mosaic first. That arrival is ta-ae57309f the other way round —
   the same forty-eight columns, the same 0.5s, the same power2.out, the same
   0.015s random stagger — and the beat it then holds before lifting is
   ta-ae57309f's own `position: .5`.

   Reduced motion, and anything that goes wrong. A reader who has asked for less
   motion never sees the overlay at all (tools/blocks/og-intro.css never
   displays it) and this script takes it out of the document. So does a browser
   with no GSAP on the page, and so does a connection too slow for the sequence
   to finish under the ceiling — see the budget below. Above all of that,
   og-intro.css stops the overlay covering the page fifteen seconds after the
   first paint whatever has happened here, including this file never arriving;
   the timeout at the foot of this file is the same promise again, for the case
   where the sequence starts and then stalls.

   The overlay is `aria-hidden`, holds nothing focusable, and this script never
   moves focus; when the sequence ends the node is removed from the document, so
   the homepage underneath is interactive again and no hit-testing layer is
   left behind. */
(function () {
  var root = document.querySelector('[data-og-intro]');
  if (!root) return;

  var failsafe = null;
  var over = false;
  function finish() {
    if (over) return;
    over = true;
    if (failsafe) window.clearTimeout(failsafe);
    if (root.parentNode) root.parentNode.removeChild(root);
  }

  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
  } catch (e) { /* no matchMedia: keep the donor's motion */ }

  var gsap = window.gsap;
  if (!gsap || typeof gsap.timeline !== 'function') { finish(); return; }

  /* Slow connections do not get a late intro; they get the homepage.

     This file is `defer`, so it runs when the document is interactive — after
     every classic script on the page, of which js/app.fused.js alone is 1.05 MB.
     Measured on this homepage: the document is interactive at 0.4s unthrottled,
     4.7s on a 9 Mbps connection and 33.7s on 1.6 Mbps. A sequence started at
     33.7s would be six and a half more seconds of nothing for a reader who has
     already waited half a minute, and og-intro.css uncovers the page at fifteen
     anyway — so the budget is that ceiling less the sequence's own 6.9s. Past
     it, the overlay simply goes and the homepage is there. Same shape as the
     reduced-motion path above: when the intro cannot be the right thing, the
     page is. */
  var CEILING = 15000;
  var SEQUENCE = 6900;
  if (performance && performance.now() > CEILING - SEQUENCE) { finish(); return; }

  var stage = root.querySelector('.og-page-wrapper');
  var h1 = root.querySelector('.og-is-hero');
  var span = root.querySelector('.og-text-spam');
  var columns = root.querySelectorAll('.og-intro-column');
  /* The mosaic is no longer part of this opening, so it is no longer part of
     the guard: requiring tiles that the markup does not contain would send
     every visitor straight to finish() and there would be no opening at all. */
  if (!h1 || !span || !columns.length) { finish(); return; }

  /* Webflow builds an easing from four numbers with the same bezier solver
     every browser uses for `cubic-bezier()`; a-24-n-2 carries
     [0.544, -0.011, 0, 0.983]. GSAP's own eases are curves, not beziers, so the
     curve is evaluated here rather than named. Newton-Raphson on x, then a
     bisection fallback, which is the standard solve. */
  function cubicBezier(x1, y1, x2, y2) {
    var A = function (a, b) { return 1 - 3 * b + 3 * a; };
    var B = function (a, b) { return 3 * b - 6 * a; };
    var C = function (a) { return 3 * a; };
    var calc = function (t, a, b) { return ((A(a, b) * t + B(a, b)) * t + C(a)) * t; };
    var slope = function (t, a, b) { return 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a); };
    return function (p) {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      var t = p;
      for (var i = 0; i < 8; i++) {
        var d = slope(t, x1, x2);
        if (d === 0) break;
        var e = calc(t, x1, x2) - p;
        if (Math.abs(e) < 1e-6) return calc(t, y1, y2);
        t -= e / d;
      }
      var lo = 0, hi = 1;
      t = p;
      while (lo < hi) {
        var v = calc(t, x1, x2);
        if (Math.abs(v - p) < 1e-6) break;
        if (v > p) hi = t; else lo = t;
        t = (hi + lo) / 2;
        if (hi - lo < 1e-7) break;
      }
      return calc(t, y1, y2);
    };
  }
  var BRACKET = cubicBezier(0.544, -0.011, 0, 0.983);

  /* `widthUnit: "AUTO"`. Webflow measures the element's natural width at run
     time and animates to it; measured on the donor page at 1440 it tweened to
     373px and then released to the 342px `auto` really is. Same thing here:
     read the natural width when the tween starts (a full second in, so the
     donor's Satoshi has arrived), then hand the element back to `auto` at the
     end so the resting state is the browser's own measurement, not ours. */
  function autoWidth() {
    var was = span.style.width;
    span.style.width = 'auto';
    var w = span.getBoundingClientRect().width;
    span.style.width = was;
    return w;
  }

  var tl = gsap.timeline({ onComplete: finish });

  /* -- phase 1: offgrid a-24 ------------------------------------------- */
  tl.to(h1, { opacity: 1, duration: 0.6, ease: 'power4.inOut' }, 0);
  tl.to(span, {
    width: autoWidth,
    duration: 1.2,
    ease: BRACKET,
    onComplete: function () { span.style.width = 'auto'; },
  }, 1);

  /* -- phase 2 is gone -------------------------------------------------- */
  /* offgrid's thirty-six-tile works mosaic used to reveal here, between the
     name and the wipe. The owner cut it (2026-09-10): 「这么多照片墙不要了」 —
     the name, then rototo's effect, then the homepage. The tiles are no longer
     in the markup either (tools/blocks/og-intro.mjs), so there is nothing left
     to tween and 4.25 MB is no longer fetched on a first visit.

     The wipe keeps its `'>'` position, which now reads off the end of the
     bracket instead of the end of the mosaic's stagger: the opening is the same
     motion it always was, ~2.2s shorter. Nothing about the wipe's own values
     changes. */

  /* -- phase 3: rototo t-195e7dff -------------------------------------- */
  /* `y: 0` in both from-vars is not a donor value and does not move anything:
     the columns rest at `transform: translateY(-100%)` in the stylesheet, and
     GSAP reads a stylesheet transform back off the computed matrix as pixels.
     Pinning y to 0 keeps it from adding those pixels to the percentage this
     tween sets. */
  /* `immediateRender: false` on the lift, and a stagger object of its own.
     GSAP applies a fromTo's from-vars the moment the tween is built, wherever it
     sits on the timeline — so the lift, built at t=0 and starting at ~5.7s,
     would otherwise put all forty-eight columns down over the whole intro and
     the reader would watch a black screen for six seconds. The arrival keeps
     the default: its from-state is `translateY(-100%)`, which is where
     og-intro.css already rests them. */
  function wipe(to, immediate) {
    return {
      yPercent: to,
      duration: 0.5,
      ease: 'power2.out',
      stagger: { each: 0.015, from: 'random' },
      immediateRender: immediate,
    };
  }

  tl.fromTo(columns, { yPercent: -100, y: 0 }, wipe(0, true), '>');
  /* Fully covered now, so what is behind the columns can go without anyone
     seeing it leave: the intro's ground and its two donor sections stop
     covering the homepage, and the lift reveals the page rather than the
     mosaic. */
  tl.call(function () {
    if (stage) stage.style.display = 'none';
    root.style.backgroundColor = 'transparent';
  });
  tl.fromTo(columns, { yPercent: 0, y: 0 }, wipe(-100, false), '+=0.5');

  /* If the sequence starts and then stalls, the node still goes. og-intro.css
     has already stopped the overlay covering anything by then; this is what
     takes it out of the document. */
  failsafe = window.setTimeout(finish, CEILING);
})();
