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
     3405  covered: the headline and its ground go
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
   re-measuring the bracket if the web font swaps in later, removing the node
   at 5110 and answering a tap — and none of it depends on when the main thread
   gets there: at 5110 a busy main thread only leaves an invisible node in
   place a little longer, and a tap is judged by when it happened (below).

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

   Skipping. A press (mouse, pen or touch), a wheel or a key, anywhere, while
   the overlay is there ends it at once: the animations are cancelled and the
   node is removed. The overlay never takes the pointer itself (og-intro.css),
   so every press reaches the page with its own target, and these listeners on
   the window decide what it was by WHEN it happened — the event's own
   timeStamp, the moment of the press, not the moment a main thread busy with
   Webflow's start-up gets round to it:
     - pressed while the point under it was still covered — anywhere before
       the lift (3905), or during the lift on a column that had not finished
       lifting — it skips, and the click it turns into is swallowed, so the
       link the reader could not see is never followed;
     - pressed on a point already uncovered, the opening ends and the click
       goes where it was aimed;
     - pressed after the last column has gone (5110), it is an ordinary click
       on a page that has visibly finished, even if the node is still in the
       document waiting for its timer;
     - pressed after an earlier skip had been drawn, it is a click on the
       homepage; before that frame, the compositor was still playing the
       opening, and the press is judged as above.
   Only that press's own click is swallowed: the first click after it, within
   EAT of it, and only if no other press or key came first. A page hidden for
   the back/forward cache is finished first, so going back to the homepage
   never brings it back.

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
  /* A press turns into its click when it is released: a tap or a click takes
     well under a second. A press held longer than this is not a tap, and the
     reader has been looking at the uncovered page under it all that time. */
  var EAT = 1000;

  var over = false;
  var anims = [];
  var bracketAnims = [];
  var base = null;
  var timer = 0;
  var watcher = null;
  /* The opening's first frame on the document timeline (the clock of both
     the animations and an event's timeStamp), and the first frame drawn
     after finish() took the overlay away. A press is judged against these. */
  var start = null;
  var goneAt = Infinity;
  /* The timeStamp of the last press that landed on a covered point, until the
     click it turns into has been swallowed. */
  var pressAt = null;
  var covered = function () { return true; };
  var listening = false;
  /* One event per press, whatever presses: mouse, pen or finger. A browser
     without pointer events (none that has Element.animate is still in use)
     does not play the opening. */
  var PRESS = 'pointerdown';

  /* The moment an input happened, on the clock performance.now() reads. An
     engine that stamps its events some other way gets the moment it is
     handled instead. */
  function stamp(e) {
    var now = performance.now();
    var t = e.timeStamp;
    return t > 0 && t <= now + 1 ? t : now;
  }

  function onInput(e) {
    if (e.type === PRESS) {
      pressAt = null;
      var t = stamp(e);
      if (t <= goneAt && covered(t, e.clientX)) pressAt = t;
    } else if (e.type === 'keydown') {
      pressAt = null;
    }
    finish();
  }

  function onClick(e) {
    if (pressAt == null || !e.isTrusted) return;
    var late = stamp(e) - pressAt;
    pressAt = null;
    if (late > EAT) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  /* Once the overlay has gone, presses made before it went (and queued behind
     a busy main thread) still have to be judged and their clicks swallowed, so
     those listeners stay until no such press can be left. */
  function release() {
    pressAt = null;
    window.removeEventListener(PRESS, onInput, true);
    window.removeEventListener('keydown', onInput, true);
    window.removeEventListener('click', onClick, true);
    window.removeEventListener('auxclick', onClick, true);
  }

  function finish() {
    if (over) return;
    over = true;
    if (start == null && base) start = base.startTime;
    window.clearTimeout(timer);
    window.removeEventListener('wheel', onInput, true);
    window.removeEventListener('pagehide', finish);
    if (listening) {
      /* The overlay is gone from the screen when the next frame is drawn, not
         now: if a long task starts first, the compositor goes on playing the
         opening until then, and a press in between is still a press on it. */
      window.requestAnimationFrame(function () { goneAt = performance.now(); });
      window.setTimeout(release, EAT);
    }
    if (watcher) watcher.disconnect();
    var all = anims.concat(bracketAnims);
    for (var i = 0; i < all.length; i++) { try { all[i].cancel(); } catch (e) { /* already gone */ } }
    html.classList.remove(PLAY);
    if (root.parentNode) root.parentNode.removeChild(root);
  }

  try {
    if (!html.classList.contains(PLAY) || typeof root.animate !== 'function' || !window.PointerEvent || performance.now() > START_BY) { finish(); return; }

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

    base = h1.animate(fade, { duration: FADE, fill: 'both' });
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

    /* Was the point at x covered at time t? Everything is, until the lift:
       the ground until 3405 and the columns from then on. During the lift a
       point stays covered until the column over it has finished lifting —
       the press was aimed at a screen that was moving, not at the page coming
       out from under it. After 5110 nothing is. The columns share the width
       of the layout viewport (og-intro.css: fixed, inset 0, 48 equal tracks),
       which is still there to measure after the overlay has been removed. */
    covered = function (t, x) {
      var t0 = start != null ? start : base.startTime;
      if (t0 == null) return true;
      var s = t - t0;
      if (s < LIFT_AT) return true;
      if (s >= SEQUENCE) return false;
      var c = Math.floor(x / (html.clientWidth || window.innerWidth) * n);
      c = c > 0 ? (c < n ? c : n - 1) : 0;
      return s < LIFT_AT + EACH * up[c] + WIPE;
    };

    /* The first window listeners for these events (this runs at the top of
       <body>, before any other script of the page), so a swallowed click
       reaches no other listener. */
    window.addEventListener(PRESS, onInput, { capture: true, passive: true });
    window.addEventListener('keydown', onInput, { capture: true, passive: true });
    window.addEventListener('wheel', onInput, { capture: true, passive: true });
    window.addEventListener('click', onClick, true);
    window.addEventListener('auxclick', onClick, true);
    window.addEventListener('pagehide', finish);
    listening = true;

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
       that frame: line every animation up on it, and take the node out when
       the last column has gone. */
    base.ready.then(function () {
      if (over) return;
      var t0 = start = base.startTime;
      var all = anims.concat(bracketAnims);
      for (var i = 0; i < all.length; i++) if (all[i].startTime !== t0) all[i].startTime = t0;
      timer = window.setTimeout(finish, Math.max(0, t0 + SEQUENCE - doc.timeline.currentTime));
    }, function () { /* cancelled before its first frame: finish() ran */ });
  } catch (e) {
    finish();
  }
})();
