/* og-intro — the homepage's opening: at most once per browser session, started
   on the first frame or not at all, and gone at the first tap, key or scroll.

   tools/build-site.mjs writes this file, comments stripped, as an inline
   <script> directly after the overlay's markup at the top of <body>, so it runs
   the moment the overlay exists and before the first frame is painted. Whether
   the overlay is shown at all was settled a moment earlier by the <head>
   snippet in tools/blocks/og-intro-head.js, which adds `og-intro-play` to <html>
   only when: the opening has not started yet in this browser session, the
   reader has not asked for reduced motion, and the stylesheets arrived within
   1.5s of navigation. Without that class og-intro.css never displays the overlay and
   this script takes it out of the document straight away — which is what every
   later homepage view in the session (logo, 首页, back, reload), every slow
   connection, every reduced-motion reader and every browser without the Web
   Animations API gets: the homepage, with nothing over it, from the first frame.

   The motion: three donor animations, in the order the owner asked for them and
   approved (2026-10-21 09:34). Every duration, delay, easing and stagger below
   is the one the opening played with before this change; where each number was
   read from is in the header of tools/blocks/og-intro.mjs.

     phase 1   offgrid IX2 a-24 "Hero Load In", the two items this cut keeps
                 a-24-n-8  the headline  opacity 0 → 1, delay 0, 600ms,
                           GSAP `power4.inOut` (see FADE below)
                 a-24-n-2  the span      width 0.5% → its natural width,
                           delay 1000, 1200ms, cubic-bezier(.544, -.011, 0, .983)
     phase 2   offgrid's works mosaic — cut by the owner (2026-09-10), nothing
               plays here; phase 3 starts where the bracket ends.
     phase 3   rototo ix3 t-195e7dff / ta-ae57309f on the forty-eight columns:
               down over the page, a .5s beat, then up and away. Each column
               500ms (the runtime's DEFAULTS.DURATION), GSAP `power2.out`,
               staggered .015s apart in random order — a fresh random order for
               the arrival and for the lift, as GSAP's `from: 'random'` gave.

   The sequence, in ms from the first frame:
     0     headline starts to fade in              (done at 600)
     1000  the bracket opens                       (done at 2200)
     2200  the columns start to come down          (all down at 3405)
     3405  covered: the headline and its ground go, taps reach the page
     3905  the columns start to lift               (all up at 5110)
     5110  SEQUENCE — the overlay leaves the document

   Why it no longer waits for GSAP. Until 2026-10-21 this file was a `defer`
   script built on js/gsap.min.js, which loads after the 1.05MB js/app.fused.js;
   the overlay painted black on the first frame and nothing moved on it until
   the document was interactive. Worse, on a fast connection the window `load`
   arrives together with DOMContentLoaded, and Webflow's IX3 start-up — one
   main-thread task of 3s or more (SplitText over the whole page) — then ran
   straight after the opening had started, freezing it, black, for that long.
   So the same numbers are now played by the browser's own animation engine
   (Element.animate): the headline's opacity, the bracket's transforms, the
   columns and the step that hides the headline and its ground all run on the
   compositor, and keep running, on time, through any main-thread task. The
   only main-thread work is building the animations on the first frame,
   re-measuring the bracket if the web font swaps in later, letting taps through
   at 3405 and removing the node at 5110 — and if the main thread is busy at
   those two moments the overlay is already invisible and inert for the reader
   underneath, because the page cannot take a tap during that task anyway.

   How the bracket is drawn. offgrid grows the span's `width` and lets the
   inline-flex headline re-centre around it: `[` and `]` move apart by half the
   growth each, and the name, start-aligned in a box too small for it, is
   uncovered from the left while it slides with the box's left edge. `width` is
   layout and cannot run on the compositor, so the same geometry is drawn with
   transforms on the final layout instead: the span takes its natural width at
   once and, at a width `w` of the animation, `[` sits (W−w)/2 to the right of
   where it rests, `]` the same distance to the left, the span (the clip, still
   `overflow: hidden`) (W−w)/2 to the left, and the name inside it W−w to the
   right, so the visible window is exactly the one the narrow box drew and the
   name starts at its left edge. Every one of those offsets is linear in `w`,
   so each is one transform tween on a-24-n-2's own curve. The headline's
   ground box no longer narrows with the span — it is #0e0e10 on #0f0f0f.

   Skipping. A pointer press, a touch, a scroll, a wheel or a key, anywhere,
   while the overlay is there ends it at once: the animations are cancelled,
   the node is removed, and if the press landed on the overlay itself the click
   it would turn into is swallowed, so skipping never also follows a link that
   happened to be underneath. A page hidden for the back/forward cache is
   finished first, so going back to the homepage never brings it back.

   Reduced motion and no JavaScript: no class, no overlay (og-intro.css). The
   overlay is `aria-hidden`, holds nothing focusable, and nothing here moves
   focus. */
(function () {
  var doc = document;
  var html = doc.documentElement;
  var root = doc.querySelector('[data-og-intro]');
  if (!root) return;

  var PLAY = 'og-intro-play';
  /* The <head> already refused anything later than 1.5s; this is the same
     promise for the overlay markup itself arriving late. */
  var START_BY = 2000;

  var over = false;
  var anims = [];
  var marks = [];
  var bracketAnims = [];
  var EVENTS = ['pointerdown', 'mousedown', 'touchstart', 'touchmove', 'wheel', 'keydown'];
  var watcher = null;

  function finish() {
    if (over) return;
    over = true;
    var i;
    for (i = 0; i < marks.length; i++) window.clearTimeout(marks[i]);
    for (i = 0; i < EVENTS.length; i++) window.removeEventListener(EVENTS[i], onInput, true);
    window.removeEventListener('pagehide', finish);
    if (watcher) watcher.disconnect();
    var all = anims.concat(bracketAnims);
    for (i = 0; i < all.length; i++) { try { all[i].cancel(); } catch (e) { /* already gone */ } }
    html.classList.remove(PLAY);
    if (root.parentNode) root.parentNode.removeChild(root);
  }

  try {
    if (!html.classList.contains(PLAY) || typeof root.animate !== 'function' || performance.now() > START_BY) { finish(); return; }

    var stage = root.querySelector('.og-page-wrapper');
    var h1 = root.querySelector('.og-is-hero');
    var span = root.querySelector('.og-text-spam');
    var name = root.querySelector('.og-intro-name');
    var brackets = root.querySelectorAll('.og-intro-bracket');
    var columns = root.querySelectorAll('.og-intro-column');
    if (!stage || !h1 || !span || !name || brackets.length !== 2 || !columns.length) { finish(); return; }

    /* It starts now: mark the session, so no later homepage view of it plays
       the opening again (the <head> snippet reads this). A private window may
       refuse the write; then the next view plays it too, as it always did. */
    try { window.sessionStorage.setItem('stargo-intro', '1'); } catch (e) { /* not stored */ }

    /* ------------------------------------------------------------ timing -- */
    var FADE = 600;
    var BRACKET_AT = 1000;
    var BRACKET = 1200;
    var WIPE = 500;
    var EACH = 15;
    var n = columns.length;
    var WIPE_AT = BRACKET_AT + BRACKET;              /* '>': where the bracket ends */
    var COVERED = WIPE_AT + WIPE + EACH * (n - 1);   /* the last column is down */
    var LIFT_AT = COVERED + 500;                     /* ta-ae57309f's position: .5 */
    var SEQUENCE = LIFT_AT + WIPE + EACH * (n - 1);  /* 5110 with 48 columns */

    /* GSAP's `power2.out` is 1 − (1 − t)³, which is exactly this Bézier. */
    var OUT = 'cubic-bezier(0.333333, 1, 0.666667, 1)';
    /* a-24-n-2's own curve; CSS solves cubic-bezier() the way Webflow does. */
    var BRACKET_EASE = 'cubic-bezier(0.544, -0.011, 0, 0.983)';

    /* The fade played with GSAP's `power4.inOut`, which is quintic
       (t < .5 ? 16t⁵ : 1 − 16(1 − t)⁵). No cubic-bezier() is that curve, so it
       is written out as keyframes, 48 straight segments of it: the largest gap
       between them and the curve is under 0.3% opacity. */
    var fade = [];
    for (var k = 0; k <= 48; k++) {
      var p = k / 48;
      fade.push({ opacity: p < 0.5 ? Math.pow(2 * p, 5) / 2 : 1 - Math.pow(2 * (1 - p), 5) / 2, offset: p });
    }

    var base = h1.animate(fade, { duration: FADE, fill: 'both' });
    anims.push(base);

    /* The ground and the headline go together, in one step, once the columns
       cover them: what the lift then uncovers is the homepage. The ground is
       painted on this element rather than on the overlay (og-intro.css) so that
       the step is an opacity change the compositor can make. */
    var hideAt = COVERED / SEQUENCE;
    anims.push(stage.animate([
      { opacity: 1, offset: 0 }, { opacity: 1, offset: hideAt },
      { opacity: 0, offset: hideAt }, { opacity: 0, offset: 1 },
    ], { duration: SEQUENCE, fill: 'both' }));

    /* The columns: each its own arrival and lift, from the stylesheet's resting
       `translateY(-100%)` to 0 and back, one animation per column. */
    function shuffled() {
      var a = [];
      for (var i = 0; i < n; i++) a.push(i);
      for (var j = n - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; }
      return a;
    }
    var down = shuffled();
    var up = shuffled();
    var UP = 'translateY(-100%)';
    var DOWN = 'translateY(0%)';
    for (var c = 0; c < n; c++) {
      var a0 = WIPE_AT + EACH * down[c];
      var l0 = LIFT_AT + EACH * up[c];
      var frames = [
        { transform: UP, offset: 0 },
        { transform: UP, offset: a0 / SEQUENCE, easing: OUT },
        { transform: DOWN, offset: (a0 + WIPE) / SEQUENCE },
        { transform: DOWN, offset: l0 / SEQUENCE, easing: OUT },
        { transform: UP, offset: (l0 + WIPE) / SEQUENCE },
      ];
      if (l0 + WIPE < SEQUENCE) frames.push({ transform: UP, offset: 1 });
      anims.push(columns[c].animate(frames, { duration: SEQUENCE, fill: 'both' }));
    }

    /* ----------------------------------------------------------- bracket -- */
    var geometry = null;
    function measure() {
      /* `0.5%` is the donor's own starting width (a-24-n, written on the span
         by the export); `auto` is a-24-n-2's `widthUnit: "AUTO"`. */
      span.style.width = '0.5%';
      var w0 = span.getBoundingClientRect().width;
      span.style.width = 'auto';
      var W = span.getBoundingClientRect().width;
      return { w0: w0, W: W };
    }
    function bracket(startTime) {
      var g = measure();
      if (geometry && Math.abs(g.W - geometry.W) < 0.25 && Math.abs(g.w0 - geometry.w0) < 0.25) return;
      geometry = g;
      for (var i = 0; i < bracketAnims.length; i++) bracketAnims[i].cancel();
      bracketAnims = [];
      var d = (g.W - g.w0) / 2;
      var opts = { delay: BRACKET_AT, duration: BRACKET, easing: BRACKET_EASE, fill: 'both' };
      var moves = [[brackets[0], d], [brackets[1], -d], [span, -d], [name, 2 * d]];
      for (var m = 0; m < moves.length; m++) {
        var anim = moves[m][0].animate([
          { transform: 'translateX(' + moves[m][1] + 'px)' }, { transform: 'translateX(0px)' },
        ], opts);
        if (startTime != null) anim.startTime = startTime;
        bracketAnims.push(anim);
      }
    }
    bracket(null);

    /* --------------------------------------------- what needs the main thread */
    function onInput(e) {
      if (over) return;
      var onOverlay = e.target && e.target.nodeType === 1 && root.contains(e.target);
      finish();
      if (onOverlay && e.type !== 'keydown' && e.type !== 'wheel') {
        /* The press that skipped would otherwise become a click on whatever
           is under it now that the overlay is gone. */
        var eat = function (ev) { ev.preventDefault(); ev.stopPropagation(); done(); };
        var done = function () { window.removeEventListener('click', eat, true); };
        window.addEventListener('click', eat, true);
        window.setTimeout(done, 800);
      }
    }
    for (var ev = 0; ev < EVENTS.length; ev++) window.addEventListener(EVENTS[ev], onInput, { capture: true, passive: true });
    window.addEventListener('pagehide', finish);

    /* The bracket is measured in whatever font has arrived by the first frame,
       at the window's size then. When either changes — the headline's own
       face swapping in (`font-display: swap`), the window resizing or turning —
       measure again and, if the name is a different width, rebuild the four
       tweens on the same clock, so they carry on from where they are rather
       than restart. A ResizeObserver reports the change after layout and before
       paint, in the very frame that draws the new layout, so no frame pairs the
       new width with the old offsets — not even while a long task then holds
       the main thread and the compositor carries on alone. */
    if (typeof ResizeObserver === 'function') {
      watcher = new ResizeObserver(function () { if (!over) bracket(base.startTime); });
      watcher.observe(name);
      watcher.observe(stage);
    }

    /* Everything above starts on the same frame — the first one painted. From
       that frame: line every animation up on it, then schedule the two
       main-thread moments. */
    base.ready.then(function () {
      if (over) return;
      var t0 = base.startTime;
      var all = anims.concat(bracketAnims);
      for (var i = 0; i < all.length; i++) if (all[i].startTime !== t0) all[i].startTime = t0;
      var now = doc.timeline.currentTime;
      marks.push(window.setTimeout(function () { root.style.pointerEvents = 'none'; }, Math.max(0, t0 + COVERED - now)));
      marks.push(window.setTimeout(finish, Math.max(0, t0 + SEQUENCE - now)));
    }, function () { /* cancelled before its first frame: finish() ran */ });
  } catch (e) {
    finish();
  }
})();
