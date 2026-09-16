/* Capability-page block scripts. Written by tools/capability-donors.mjs from tools/blocks/<id>.js. Do not edit by hand. */
(function(){
/* ---- cn-about-reviews: tools/blocks/cn-about-reviews.js ---- */
/* cn-about-reviews — the two behaviours the cut cannot carry.

   ONE: THE SLIDER, which Webflow would have supplied and this site does not.
   `.w-slider` is a Webflow COMPONENT, not an IX2 interaction. IX2 travels:
   tools/donor-lib.mjs lifts the donor's `{events, actionLists}` and
   tools/fuse-ix.mjs merges them into js/app.fused.js — which is how this
   block's one interaction, the pill's blurred square, arrives on its own. A
   component does not: it is a module of Webflow's runtime, registered with
   `define("<name>", …)`, and this site ships only

     js/app.fused.js                      dropdown, lightbox
     js/app.schunk.25099a4fefa544e6.js    brand, edit, focus, forms, links,
                                          lottie, navbar, scroll, touch
     js/app.schunk.e0c428ff9737f919.js    (no component definitions)

   — no `slider`, and the string `w-slider` appears in none of the three.
   cinery's own exported bundle does not carry it either. Left alone the band
   would draw its first card and clip the other three behind
   `.w-slider-mask { overflow: hidden }`, and both arrows would be dead
   controls: two 4rem bars that say 上一条 / 下一条 and do nothing.

   WHY IT IS NOT CSS KEYFRAMES. The house rule is to replay donor motion the
   tooling drops as keyframes with the donor's own numbers, and that is what
   tools/blocks/cn-about-reviews.css does for this block's four ix3 timelines.
   It cannot be done for the slider. The four cards are inline-blocks tiled
   across one `white-space: nowrap` mask, so a shared transform can only
   translate the row; wrapping from the fourth card to the first in the same
   direction — the donor's `data-infinite="true"` — needs a fifth box to slide
   in from, and adding one would be adding an element. And
   `data-hide-arrows="false"` is a control: a keyframe cannot be clicked.

   WHY THIS IS A SECOND COPY OF tools/blocks/cn-reviews.js. That file drives
   `.cn-reviews .cn-testimonial-slider`; this band's root is
   `.cn-about-reviews`, so it would never be touched. One file per block is the
   rule (tools/blocks/README.md: "two blocks are never edited in the same
   file"), and the duplication is its price. Both scripts are concatenated into
   js/capability-blocks.js and each selects only under its own root, so if the
   two bands ever appear on one page neither drives the other's slider. If the
   logic below is ever corrected, correct it in both.

   EVERY NUMBER BELOW IS READ OFF THE DONOR'S OWN ELEMENT. The slider element
   carries them exactly as cinery exported them, and
   tools/blocks/cn-about-reviews.mjs asserts each one is still there:

     data-animation="slide"      the transition is a slide, not a crossfade
     data-duration="500"         how long one transition takes, ms
     data-easing="ease"          the CSS timing function, by that name
     data-delay="4000"           how long a card is held once it has arrived, ms
     data-autoplay="true"        it advances on its own
     data-autoplay-limit="0"     for as many rounds as it likes
     data-infinite="true"        the fourth card hands back to the first
     data-disable-swipe="false"  a touch drag moves it

   The fallbacks in the code are those same values, so a re-cut that dropped an
   attribute would still turn at cinery's speed rather than at some other one.
   The cycle is `delay` after a card lands plus `duration` to move it on —
   4.5s a card — which is how Webflow's own slider arms its timer.

   WHAT IT DOES TO THE DOM. Nothing that is in the fragment. It sets `transform`
   and `transition` on the four cards and, once a transition has finished, moves
   one card from the front of the mask to the back (or back to front) — which is
   how a four-card row wraps forward without a clone. No class, no `data-w-id`,
   no `#w-node-…` id and no attribute in the markup is touched, so the pill's
   IX2 loop and the grid placement in tools/blocks/cn-about-reviews.css both
   stay bound to what they were bound to. The reorder waits for `transitionend`,
   with a timer 200ms past the donor's own duration behind it, so a timer that
   fires a frame early can never cut a card off mid-slide.

   The `role` / `tabindex` / `aria-label` on the two arrows are added for the
   same reason Webflow's slider adds them at runtime: cinery exported the arrows
   as bare `<div>`s because its runtime was going to make them buttons. The
   label is the arrow's own word, so nothing is written here that
   tools/blocks/cn-about-reviews.mjs did not already take out of tools/copy.mjs.

   STOPPING. An auto-advancing band with no way to stop it is a barrier, so the
   first deliberate act by a reader — a click, a key, a swipe, or simply putting
   keyboard focus on one of the arrows — stops the autoplay for good and leaves
   the band under the reader's hand. Webflow's slider stops autoplay on
   interaction too; the focus case is this file's own. A reader who has asked
   their system for less motion never gets the autoplay at all, and their arrow
   presses cut straight to the next card instead of sliding.

   All four cards stay in the document and in the accessibility tree at every
   moment; only three of them are outside the mask's clip. A reader on a screen
   reader gets all four scenarios whether or not the band ever turns.

   TWO: THE HEADING'S ARRIVAL, which is ix3 and therefore also cannot travel.

     interaction i-9f439e20   trigger  wf:scroll on class `heading-wrap`,
                              scrollTriggerConfig { start: "top 85%",
                              enter: "play", leave/enterBack/leaveBack: "none" }
     timeline    t-864fc814   ta-7549a871  .top-title     y 110% -> 0%, position 0
                              ta-f06a78d6  .bottom-title  y 110% -> 0%, position 0.3
                              both tt:2 (fromTo), ease 6, duration unset

   Read out of tools/templates/cinery/js/app.9d009f54.b1680441e3b493e5.js. The
   two classes below are the whole of the replay; tools/blocks/cn-about-reviews.css
   draws them, with the donor's easing (ease 6 = gsap `power2.inOut`) and the ix3
   runtime's own default duration (0.5s). The trigger is an IntersectionObserver
   whose bottom margin (-15% of the viewport) is the same line as ScrollTrigger's
   "top 85%", firing once. `cn-about-reviews-armed` is added only after the
   observer is already watching, so the heading is never put down where nothing
   is left to pick it up. Same replay, same numbers, as
   tools/blocks/cn-produce.js, which owns cinery's other `.top-title` /
   `.bottom-title` pair. */
(function () {
  var ROOT = '.cn-about-reviews';

  function reduced() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;   /* no matchMedia: keep the donor's motion */
    }
  }

  /* ---------------------------------------------------------- the slider -- */

  var EASINGS = { ease: 1, 'ease-in': 1, 'ease-out': 1, 'ease-in-out': 1, linear: 1 };

  function num(el, name, fallback) {
    var v = parseInt(el.getAttribute(name), 10);
    return isFinite(v) && v >= 0 ? v : fallback;
  }

  /* Run `fn` when a transition of `ms` on `el` is over. `transitionend` is the
     truth (only `transform` is transitioned here, so it fires once per card);
     the timer is the safety net for a transition that never starts — a hidden
     tab, a browser that dropped the frame — and it is deliberately late. */
  function after(el, ms, fn) {
    var done = false;
    function once() {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', once);
      fn();
    }
    if (ms > 0) {
      el.addEventListener('transitionend', once);
      window.setTimeout(once, ms + 200);
    } else {
      window.setTimeout(once, 0);
    }
  }

  function setupSlider(slider) {
    var mask = slider.querySelector('.cn-mask');
    if (!mask) return;
    var count = mask.querySelectorAll('.cn-testimonial-slide').length;
    /* One card cannot slide anywhere, and a mask holding anything other than
       the cards is not the shape this drives. Leave it exactly as drawn. */
    if (count < 2 || count !== mask.children.length) return;

    var still = reduced();
    var duration = still ? 0 : num(slider, 'data-duration', 500);
    var delay = num(slider, 'data-delay', 4000);
    var easing = slider.getAttribute('data-easing');
    if (!EASINGS[easing]) easing = 'ease';
    var autoplay = slider.getAttribute('data-autoplay') !== 'false' && !still;
    var swipe = slider.getAttribute('data-disable-swipe') !== 'true';

    var busy = false;
    var timer = null;

    function place(pct, ms) {
      var kids = mask.children;
      for (var i = 0; i < kids.length; i++) {
        kids[i].style.transition = ms > 0 ? ('transform ' + ms + 'ms ' + easing) : 'none';
        kids[i].style.transform = 'translateX(' + pct + '%)';
      }
    }

    function arm() {
      window.clearTimeout(timer);
      if (!autoplay) return;
      timer = window.setTimeout(function () { go(1); }, delay);
    }

    function stop() {
      autoplay = false;
      window.clearTimeout(timer);
    }

    /* Each card is exactly one mask wide, so -100% of a card's own width moves
       the whole row by exactly one card. Forward: slide the row left, then send
       the card that left to the back and put the row back at zero. Backward:
       bring the last card round to the front first, start the row one card to
       the left, and slide it home. Either way the row rests at zero and the
       card on show is the first child. */
    function go(dir) {
      if (busy) return;
      busy = true;
      var moving;
      if (dir > 0) {
        place(0, 0);
        void mask.offsetWidth;                      /* commit the reset before animating */
        moving = mask.firstElementChild;
        place(-100, duration);
        after(moving, duration, function () {
          mask.appendChild(mask.firstElementChild);
          place(0, 0);
          busy = false;
          arm();
        });
      } else {
        mask.insertBefore(mask.lastElementChild, mask.firstElementChild);
        moving = mask.firstElementChild;
        place(-100, 0);
        void mask.offsetWidth;
        place(0, duration);
        after(moving, duration, function () {
          place(0, 0);
          busy = false;
          arm();
        });
      }
    }

    function word(el) {
      var t = el && el.querySelector('.cn-slide-text');
      return t ? (t.textContent || '').trim() : '';
    }

    function control(el, dir) {
      if (!el) return;
      var label = word(el);
      if (!el.getAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (label && !el.getAttribute('aria-label')) el.setAttribute('aria-label', label);
      el.addEventListener('click', function () { stop(); go(dir); });
      el.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        e.preventDefault();
        stop();
        go(dir);
      });
      el.addEventListener('focus', stop);
    }

    control(slider.querySelector('.cn-left-arrow'), -1);
    control(slider.querySelector('.cn-right-arrow'), 1);

    if (swipe) {
      var x0 = null;
      var y0 = 0;
      mask.addEventListener('touchstart', function (e) {
        if (!e.touches || e.touches.length !== 1) { x0 = null; return; }
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
      }, { passive: true });
      mask.addEventListener('touchend', function (e) {
        if (x0 === null || !e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - x0;
        var dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        /* 40px, and more sideways than up: the page scrolls vertically through
           this band, and a drag that is mostly vertical belongs to the page.
           Nothing is prevented here, so that scroll still happens. */
        if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
        stop();
        go(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    place(0, 0);
    arm();
  }

  /* --------------------------------------------------------- the heading -- */

  function setupHeading(root) {
    var wrap = root.querySelector('.cn-heading-wrap');
    var top = root.querySelector('.cn-top-title');
    var bottom = root.querySelector('.cn-bottom-title');
    if (!wrap || !top || !bottom) return;
    if (typeof IntersectionObserver !== 'function') return;
    if (reduced()) return;

    var armed = false;
    function play() {
      if (!armed) return;
      armed = false;
      root.classList.remove('cn-about-reviews-armed');
      root.classList.add('cn-about-reviews-reveal');
    }

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        io.disconnect();
        play();
        return;
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });

    io.observe(wrap);
    armed = true;
    root.classList.add('cn-about-reviews-armed');

    /* Belt and braces: if the heading is on screen and the observer has still
       not spoken, put the lines up anyway rather than leave them below the
       mask. */
    window.setTimeout(function () {
      if (armed && wrap.getBoundingClientRect().top < window.innerHeight) { io.disconnect(); play(); }
    }, 6000);
  }

  /* ------------------------------------------------------------- wiring -- */

  function init() {
    var roots = document.querySelectorAll(ROOT);
    for (var i = 0; i < roots.length; i++) {
      setupHeading(roots[i]);
      var sliders = roots[i].querySelectorAll('.cn-testimonial-slider');
      for (var j = 0; j < sliders.length; j++) setupSlider(sliders[j]);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* ---- cn-about: tools/blocks/cn-about.js ---- */
/* cn-about — the introduction paragraph's arrival, which the cut cannot carry.

   cinery reveals the one sentence in this card with an ix3 (GSAP) timeline, not
   with the IX2 payload tools/donor-lib.mjs extracts. Read out of
   tools/templates/cinery/js/app.9d009f54.b1680441e3b493e5.js:

     interaction i-7405f602   scope { type: "site" }
                              trigger wf:scroll on class `text-size-large`,
                              scrollTriggerConfig { clamp: true,
                                start: "top 85%", end: "bottom top",
                                scrub: null, enter: "play",
                                leave / enterBack / leaveBack: "none" }
     timeline    t-a0ad7ea5   ta-34911dc2  targets ["wf:trigger-only"] — the
                              paragraph itself; timing { position: 0,
                              stagger: { each: .1 }, ease: 5 }; tt: 2 (fromTo);
                              properties { "wf:transform": { y: ["110%","0%"] } };
                              splitText { type: "lines", mask: "lines" }

   The runtime resolves the two numbers the action leaves out. Ease 5 is index 5
   of its own table in js/app.schunk.25099a4fefa544e6.js — ["none","power1.in",
   "power1.out","power1.inOut","power2.in","power2.out","power2.inOut",…] — i.e.
   gsap `power2.out`; and an action with no duration takes that runtime's
   `DEFAULTS.DURATION = .5`. Both are the same two lookups tools/blocks/
   cn-produce.js documents for cinery's heading reveal.

   WHY IT CANNOT TRAVEL, AND WHY IT IS HERE AND NOT IN THE CSS
   donor-lib returns `{events, actionLists}` (IX2) only — it never reads a
   donor's ix3 arrays — and although this site ships the ix3 runtime on every
   page, it registers no interactions with it (`register([{id:"i-…"` appears
   nowhere in js/), so no donor timeline fires. That much is true of the button
   label's roll as well, and that one is replayed in tools/blocks/cn-about.css,
   because a whole element can be moved by a stylesheet. This one cannot: it
   animates LINES, and a stylesheet cannot find a line box. So it is replayed
   with the donor's own tools — the gsap, SplitText and ScrollTrigger this site
   already loads on every page (js/gsap.min.js, js/SplitText.min.js, and
   js/stargo-splittext-cjk.js, which wraps SplitText so Chinese, which has no
   spaces, still breaks into words and therefore into lines) — and with the
   donor's own numbers: 110% -> 0%, 0.5s, power2.out, 0.1s between lines,
   starting when the paragraph's top crosses 85% of the viewport.

   NOTHING IS EVER HIDDEN THAT THIS SCRIPT CANNOT SHOW AGAIN. The paragraph is
   split only at the instant it plays, and the split is reverted the moment the
   tween finishes, so:

     · a page that never loads this file simply shows the paragraph, drawn
       exactly as cinery draws it at rest. That is today's case for the page
       this block is for: tools/build-site.mjs appends
       `<script src="js/capability-blocks.js" defer>` on capabilities.html and
       on pricing.html only, and about.html gets no such tag — so until the
       central wiring adds one there, the block is complete and still, and this
       file is inert rather than harmful. It needs nothing else: about.html
       already loads js/gsap.min.js, js/SplitText.min.js,
       js/stargo-splittext-cjk.js and js/ScrollTrigger.min.js;
     · a browser without gsap, SplitText or ScrollTrigger does the same;
     · a reader who has asked for less motion does the same;
     · once the entrance is over the DOM is the donor's markup again, so a
       resize re-wraps the sentence normally instead of re-flowing it inside
       line boxes measured at the old width.

   That is the same guarantee tools/blocks/cn-produce.js writes down for
   cinery's heading, arrived at the other way round: it arms a hidden state only
   after its observer is watching, this one never arms one at all. */
(function () {
  var root = document.querySelector('.cn-about');
  if (!root) return;
  var p = root.querySelector('.cn-text-size-large');
  if (!p) return;

  var gsap = window.gsap;
  var Split = window.SplitText;
  var ST = window.ScrollTrigger;
  if (!gsap || !Split || !ST) return;
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { /* no matchMedia: keep the donor's motion */ }

  var played = false;
  function play() {
    if (played) return;
    played = true;
    var split = null;
    try {
      /* `mask: "lines"` is the donor's own option: SplitText wraps each line in
         an overflow-hidden box, which is what makes a 110% offset read as the
         line rising out of the page rather than sliding over its neighbour. */
      split = Split.create(p, { type: 'lines', mask: 'lines' });
      if (!split.lines || !split.lines.length) throw new Error('no lines');
      /* fromTo, as the action's `tt: 2` says. immediateRender puts the lines
         down in the same task as the split, before the browser paints, so the
         sentence never flashes at its resting position first. */
      gsap.fromTo(split.lines, { yPercent: 110 }, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        onComplete: function () { try { split.revert(); } catch (e) { /* already gone */ } },
      });
    } catch (e) {
      /* Anything unexpected and the paragraph goes back to being a paragraph. */
      if (split && split.revert) { try { split.revert(); } catch (e2) { /* nothing to undo */ } }
    }
  }

  try { gsap.registerPlugin(ST); } catch (e) { /* the plugin registers itself */ }
  ST.create({ trigger: p, start: 'top 85%', once: true, onEnter: play });

  /* The donor's trigger is a scroll trigger on a page where this section is
     below the fold. Here the block may already be on screen when the script
     runs, and ScrollTrigger's behaviour for a trigger created inside its own
     range is not something to depend on — so the same line is checked once,
     directly: "top 85%" is the paragraph's top crossing 85% of the viewport.
     play() is idempotent, so whichever of the two speaks first wins and the
     other is a no-op. */
  if (!played && p.getBoundingClientRect().top < window.innerHeight * 0.85) play();
})();


/* ---- cn-produce: tools/blocks/cn-produce.js ---- */
/* cn-produce — the heading's arrival, which the cut cannot carry.

   cinery reveals this section's two heading lines with an ix3 (GSAP) timeline,
   not with the IX2 payload tools/donor-lib.mjs extracts:

     interaction i-9f439e20   trigger  wf:scroll on class `heading-wrap`,
                              scrollTriggerConfig { start: "top 85%",
                              enter: "play", leave/enterBack/leaveBack: "none" }
     timeline    t-864fc814   ta-7549a871  .top-title     y 110% -> 0%, position 0
                              ta-f06a78d6  .bottom-title  y 110% -> 0%, position 0.3
                              both tt:2 (fromTo), ease 6, duration unset

   The runtime resolves those two numbers itself: ease 6 is index 6 of its own
   table ("none", "power1.in", "power1.out", "power1.inOut", "power2.in",
   "power2.out", "power2.inOut", ...) = gsap `power2.inOut`, and an action with
   no duration takes DEFAULTS.DURATION = 0.5s. Both were read out of
   js/app.schunk.25099a4fefa544e6.js, the ix3 runtime this site already ships.

   donor-lib returns `{events, actionLists}` only — it never reads a donor's
   ix3 arrays, though tools/fuse-ix.mjs would merge them if a payload carried
   them — so this timeline cannot travel with the block. The reveal is
   therefore re-declared: the shape, the offsets and the easing are the
   donor's, the trigger is an IntersectionObserver whose bottom margin (-15% of
   the viewport) is the same line as ScrollTrigger's "top 85%", firing once.

   The two classes are the whole of it; tools/blocks/cn-produce.css draws them.
   `cn-produce-armed` is added only after the observer is already watching, so
   the heading is never put down where nothing is left to pick it up. */
(function () {
  var root = document.querySelector('.cn-produce');
  if (!root) return;
  var wrap = root.querySelector('.cn-heading-wrap');
  var top = root.querySelector('.cn-top-title');
  var bottom = root.querySelector('.cn-bottom-title');
  if (!wrap || !top || !bottom) return;
  if (typeof IntersectionObserver !== 'function') return;
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { /* no matchMedia: keep the donor's motion */ }

  var armed = false;
  function play() {
    if (!armed) return;
    armed = false;
    root.classList.remove('cn-produce-armed');
    root.classList.add('cn-produce-reveal');
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      io.disconnect();
      play();
      return;
    }
  }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });

  io.observe(wrap);
  armed = true;
  root.classList.add('cn-produce-armed');

  /* Belt and braces: if the heading is on screen and the observer has still
     not spoken, put the lines up anyway rather than leave them below the mask. */
  window.setTimeout(function () {
    if (armed && wrap.getBoundingClientRect().top < window.innerHeight) { io.disconnect(); play(); }
  }, 6000);
})();


/* ---- cn-reviews: tools/blocks/cn-reviews.js ---- */
/* cn-reviews — the slider behaviour cinery's markup asks for and this site does
   not ship.

   WHY THIS FILE EXISTS
   `.w-slider` is a Webflow COMPONENT, not an IX2 interaction. IX2 travels:
   tools/donor-lib.mjs lifts the donor's `{events, actionLists}` and
   tools/fuse-ix.mjs merges them into js/app.fused.js, which is how the two
   arrows keep their hover rolls (a-45 … a-48, fired by e-248 … e-251 on
   MOUSE_OVER / MOUSE_OUT). A component does not: it is a module of Webflow's
   runtime, registered with `define("<name>", …)`, and this site ships only

     js/app.fused.js                      dropdown, lightbox
     js/app.schunk.25099a4fefa544e6.js    brand, edit, focus, forms, links,
                                          lottie, navbar, scroll, touch
     js/app.schunk.e0c428ff9737f919.js    (no component definitions)

   — no `slider`, and the string `w-slider` appears in none of the three.
   cinery's own exported bundle does not carry it either. Left alone the band
   would draw its first card and clip the other three behind
   `.w-slider-mask { overflow: hidden }`, and both arrows would be dead
   controls: two 4rem bars that say Previous and Next and do nothing.

   WHY IT IS NOT CSS KEYFRAMES
   The house rule is to replay donor motion the tooling drops as keyframes with
   the donor's own numbers, and that is what tools/blocks/ro-gallery.css and
   tools/blocks/cn-produce.css do. It cannot be done here. The four cards are
   inline-blocks tiled across one `white-space: nowrap` mask, so a shared
   transform can only translate the row; wrapping from the fourth card to the
   first in the same direction — the donor's `data-infinite="true"` — needs a
   fifth box to slide in from, and adding one would be adding an element. And
   `data-hide-arrows="false"` is a control: a keyframe cannot be clicked.

   EVERY NUMBER BELOW IS READ OFF THE DONOR'S OWN ELEMENT
   The slider element carries them, exactly as cinery exported it, and
   tools/blocks/cn-reviews.mjs asserts each one is still there:

     data-animation="slide"      the transition is a slide, not a crossfade
     data-duration="500"         how long one transition takes, ms
     data-easing="ease"          the CSS timing function, by that name
     data-delay="4000"           how long a card is held once it has arrived, ms
     data-autoplay="true"        it advances on its own
     data-autoplay-limit="0"     for as many rounds as it likes
     data-infinite="true"        the fourth card hands back to the first
     data-disable-swipe="false"  a touch drag moves it

   The fallbacks in the code are those same values, so a re-cut that dropped an
   attribute would still turn at cinery's speed rather than at some other one.
   The cycle is `delay` after a card lands plus `duration` to move it on —
   4.5s a card — which is how Webflow's own slider arms its timer: it waits
   `delay`, transitions for `duration`, and re-arms when the transition
   completes.

   WHAT IT DOES TO THE DOM
   Nothing that is in the fragment. It sets `transform` and `transition` on the
   four cards and, once a transition has finished, moves one card from the front
   of the mask to the back (or back to front) — which is how a four-card row
   wraps forward without a clone. Webflow's own slider does the same kind of
   thing at runtime. No class, no `data-w-id`, no `#w-node-…` id and no
   attribute in the markup is touched, so the IX2 hover rolls and the grid
   placement in tools/blocks/cn-reviews.css both stay bound to what they were
   bound to. The reorder waits for `transitionend`, with a timer 200ms past the
   donor's own duration behind it, so a timer that fires a frame early can never
   cut a card off mid-slide.

   The `role` / `tabindex` / `aria-label` on the two arrows are added here for
   the same reason Webflow's slider adds them at runtime: cinery exported the
   arrows as bare `<div>`s because its runtime was going to make them buttons.
   The label is the arrow's own word, so nothing is written here that
   tools/blocks/cn-reviews.mjs did not already take out of tools/copy.mjs.

   STOPPING. An auto-advancing quote band with no way to stop it is a barrier,
   so the first deliberate act by a reader — a click, a key, a swipe, or simply
   putting keyboard focus on one of the arrows — stops the autoplay for good and
   leaves the band under the reader's hand. Webflow's slider stops autoplay on
   interaction too; the focus case is this file's own, and it is what makes the
   stop reachable without a mouse. A reader who has asked their system for less
   motion never gets the autoplay at all, and their arrow presses cut straight
   to the next card instead of sliding — the line js/stargo-pricing.js,
   js/stargo-media.js and tools/blocks/cn-produce.js already take.

   All four cards stay in the document and in the accessibility tree at every
   moment; only three of them are outside the mask's clip. A reader on a screen
   reader gets all four scenarios whether or not the band ever turns. */
(function () {
  var EASINGS = { ease: 1, 'ease-in': 1, 'ease-out': 1, 'ease-in-out': 1, linear: 1 };

  function num(el, name, fallback) {
    var v = parseInt(el.getAttribute(name), 10);
    return isFinite(v) && v >= 0 ? v : fallback;
  }

  function reduced() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;   /* no matchMedia: keep the donor's motion */
    }
  }

  /* Run `fn` when a transition of `ms` on `el` is over. `transitionend` is the
     truth (only `transform` is transitioned here, so it fires once per card);
     the timer is the safety net for a transition that never starts — a hidden
     tab, a browser that dropped the frame — and it is deliberately late. */
  function after(el, ms, fn) {
    var done = false;
    function once() {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', once);
      fn();
    }
    if (ms > 0) {
      el.addEventListener('transitionend', once);
      window.setTimeout(once, ms + 200);
    } else {
      window.setTimeout(once, 0);
    }
  }

  function setup(slider) {
    var mask = slider.querySelector('.cn-mask');
    if (!mask) return;
    var count = mask.querySelectorAll('.cn-testimonial-slide').length;
    /* One card cannot slide anywhere, and a mask holding anything other than
       the cards is not the shape this drives. Leave it exactly as drawn. */
    if (count < 2 || count !== mask.children.length) return;

    var still = reduced();
    var duration = still ? 0 : num(slider, 'data-duration', 500);
    var delay = num(slider, 'data-delay', 4000);
    var easing = slider.getAttribute('data-easing');
    if (!EASINGS[easing]) easing = 'ease';
    var autoplay = slider.getAttribute('data-autoplay') !== 'false' && !still;
    var swipe = slider.getAttribute('data-disable-swipe') !== 'true';

    var busy = false;
    var timer = null;

    function place(pct, ms) {
      var kids = mask.children;
      for (var i = 0; i < kids.length; i++) {
        kids[i].style.transition = ms > 0 ? ('transform ' + ms + 'ms ' + easing) : 'none';
        kids[i].style.transform = 'translateX(' + pct + '%)';
      }
    }

    function arm() {
      window.clearTimeout(timer);
      if (!autoplay) return;
      timer = window.setTimeout(function () { go(1); }, delay);
    }

    function stop() {
      autoplay = false;
      window.clearTimeout(timer);
    }

    /* Each card is exactly one mask wide, so -100% of a card's own width moves
       the whole row by exactly one card. Forward: slide the row left, then send
       the card that left to the back and put the row back at zero. Backward:
       bring the last card round to the front first, start the row one card to
       the left, and slide it home. Either way the row rests at zero and the
       card on show is the first child. */
    function go(dir) {
      if (busy) return;
      busy = true;
      var moving;
      if (dir > 0) {
        place(0, 0);
        void mask.offsetWidth;                      /* commit the reset before animating */
        moving = mask.firstElementChild;
        place(-100, duration);
        after(moving, duration, function () {
          mask.appendChild(mask.firstElementChild);
          place(0, 0);
          busy = false;
          arm();
        });
      } else {
        mask.insertBefore(mask.lastElementChild, mask.firstElementChild);
        moving = mask.firstElementChild;
        place(-100, 0);
        void mask.offsetWidth;
        place(0, duration);
        after(moving, duration, function () {
          place(0, 0);
          busy = false;
          arm();
        });
      }
    }

    function word(el) {
      var t = el && el.querySelector('.cn-slide-text');
      return t ? (t.textContent || '').trim() : '';
    }

    function control(el, dir) {
      if (!el) return;
      var label = word(el);
      if (!el.getAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (label && !el.getAttribute('aria-label')) el.setAttribute('aria-label', label);
      el.addEventListener('click', function () { stop(); go(dir); });
      el.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        e.preventDefault();
        stop();
        go(dir);
      });
      el.addEventListener('focus', stop);
    }

    control(slider.querySelector('.cn-left-arrow'), -1);
    control(slider.querySelector('.cn-right-arrow'), 1);

    if (swipe) {
      var x0 = null;
      var y0 = 0;
      mask.addEventListener('touchstart', function (e) {
        if (!e.touches || e.touches.length !== 1) { x0 = null; return; }
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
      }, { passive: true });
      mask.addEventListener('touchend', function (e) {
        if (x0 === null || !e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - x0;
        var dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        /* 40px, and more sideways than up: the page scrolls vertically through
           this band, and a drag that is mostly vertical belongs to the page.
           Nothing is prevented here, so that scroll still happens. */
        if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
        stop();
        go(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    place(0, 0);
    arm();
  }

  function init() {
    var sliders = document.querySelectorAll('.cn-reviews .cn-testimonial-slider');
    for (var i = 0; i < sliders.length; i++) setup(sliders[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* ---- og-intro: tools/blocks/og-intro.js ---- */
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


/* ---- qx-whatwedo: tools/blocks/qx-whatwedo.js ---- */
/* qx-whatwedo — open one foundation's capability list on click.
   Vanilla, scoped to .qx-whatwedo. The donor ships no click interaction on
   this block; this is the smallest toggle that does what the owner asked:
   "点击可以分别展开介绍01、02、03、04的功能". One node open at a time, so a
   list never stacks onto a neighbour on the crowded stage. */
(function () {
  var root = document.querySelector('.qx-whatwedo');
  if (!root) return;
  var nodes = root.querySelectorAll('.qx-wrapper-main-services[aria-controls]');
  function setOpen(node, open) {
    var panel = root.querySelector('#' + node.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = !open;
    node.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function toggle(node) {
    var open = node.getAttribute('aria-expanded') !== 'true';
    for (var i = 0; i < nodes.length; i++) if (nodes[i] !== node) setOpen(nodes[i], false);
    setOpen(node, open);
  }
  for (var i = 0; i < nodes.length; i++) {
    (function (node) {
      node.addEventListener('click', function () { toggle(node); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(node); }
      });
    })(nodes[i]);
  }
})();


})();
