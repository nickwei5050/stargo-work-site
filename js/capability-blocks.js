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

   EVERY NUMBER BELOW IS READ OFF THE DONOR'S OWN ELEMENT — ONE IS NOT OBEYED.
   The slider element carries them exactly as cinery exported them, and
   tools/blocks/cn-about-reviews.mjs asserts each one is still there:

     data-animation="slide"      the transition is a slide, not a crossfade
     data-duration="500"         how long one transition takes, ms
     data-easing="ease"          the CSS timing function, by that name
     data-delay="4000"           how long a card is held once it has arrived, ms
     data-autoplay="true"        it advances on its own
     data-autoplay-limit="0"     cinery's word for "as many rounds as it likes"
     data-infinite="true"        the fourth card hands back to the first
     data-disable-swipe="false"  a touch drag moves it

   The fallbacks in the code are those same values — for the five it reads back,
   `duration`, `delay`, `easing`, `autoplay` and `disable-swipe` — so a re-cut
   that dropped an attribute would still turn at cinery's speed rather than at
   some other one. TWO THINGS ARE DELIBERATELY NOT THE DONOR'S, and both are in
   STOPPING below. The code never reads `data-autoplay-limit` at all: it stops
   after ONE round, where the attribute asks for rounds without end, because
   motion that starts by itself has to stop by itself (WCAG 2.2.2). And that
   round starts when the band comes into view, not when the page loads, because
   this band is thousands of pixels below the fold on both pages it appears on.
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
   first deliberate act by a reader — a click, a key, a swipe, pointing at the
   band, or simply putting keyboard focus inside it — stops the autoplay for
   good and leaves the band under the reader's hand. And the band stops on its
   own: it turns once round, showing every card, and then rests on the card it
   started on. An advance moves a card inside the mask, so it moves in the
   reading order too, and moving content that starts by itself has to be
   stoppable (WCAG 2.2.2 Pause, Stop, Hide); after the round the arrows and a
   swipe are the way on. The round is spent in front of a reader, not above
   one: it starts when the band first comes into view (an IntersectionObserver,
   at a quarter of the band), because the band's top sits about 3,620-3,670px down
   about.html and ~3,757px down en/about.html at 1440x900, and a round armed at
   page load would be over before anyone had scrolled to it — the one turn
   spent on an empty screen. A browser without IntersectionObserver arms it at
   load, as this file always did. Webflow's slider stops autoplay on
   interaction too; the hover, focus and one-round cases are this file's own. A
   reader who has asked their system for less motion never gets the autoplay at
   all, and their arrow presses cut straight to the next card instead of
   sliding.

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
    var turns = 0;          /* cards the band has moved on by itself */

    function place(pct, ms) {
      var kids = mask.children;
      for (var i = 0; i < kids.length; i++) {
        kids[i].style.transition = ms > 0 ? ('transform ' + ms + 'ms ' + easing) : 'none';
        kids[i].style.transform = 'translateX(' + pct + '%)';
      }
    }

    /* The band turns itself once round and then rests on the card it started
       on. An advance moves a card inside the mask, which moves it in the
       reading order too, so a band that never stops is a page that rewrites
       itself under a screen reader with no way to hold it still (WCAG 2.2.2).
       One round shows every card once; after that the arrows and a swipe are
       the way on, and pointing at the band or putting focus in it stops the
       turning at once. */
    function arm() {   /* the next card of the round; `armWhenSeen` starts it */
      window.clearTimeout(timer);
      if (!autoplay) return;
      if (turns >= count) { stop(); return; }
      timer = window.setTimeout(function () { turns++; go(1); }, delay);
    }

    function stop() {
      autoplay = false;
      window.clearTimeout(timer);
    }

    /* And the round is spent in front of a reader rather than above one. This
       band's top sits ~3,667px down about.html (~3,757px down en/about.html)
       at 1440x900, so a round armed at page load would turn itself out while
       the reader was still on the hero, and the band they eventually scrolled
       to would already be resting: the one turn spent on an empty screen. It
       is armed instead the first time a quarter of the band is on screen —
       ~175px of a ~700px band against a 720–900px viewport, so it fires as the
       band arrives rather than waiting for it to fill the screen. Nothing else
       changes: one round, then rest, and a reader who has already stopped it
       (a pointer that met the band on the way) finds `arm` doing nothing. A
       browser with no IntersectionObserver arms the round at load, which is
       what this file did before. The heading below has an observer of its own:
       same reason, different line (its trigger is the donor's "top 85%"). */
    var SEEN = 0.25;

    function armWhenSeen() {
      if (!autoplay) return;
      if (typeof IntersectionObserver !== 'function') { arm(); return; }
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].intersectionRatio < SEEN) continue;
          io.disconnect();
          arm();
          return;
        }
      }, { threshold: SEEN });
      io.observe(slider);
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

    /* A reader pointing at the band, or with focus anywhere inside it, is
       reading it: the turning stops, the same way an arrow stops it. */
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('focusin', stop);

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
    armWhenSeen();
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


/* ---- cn-faq: tools/blocks/cn-faq.js ---- */
/* cn-faq — open the creative topic an address names, and let a keyboard open
   any topic.

   The seven rows of #story-5 carry ids (creative-images … creative-assets,
   tools/blocks/cn-faq.mjs) so another page can send a reader to one topic,
   e.g. capabilities.html#creative-video. The browser on its own would only
   scroll there, to a closed row: the answers are collapsed by cinery's Webflow
   IX2 accordion, which sets every answer wrap to `height: 0px` when it starts
   and opens a row on a click on that row (MOUSE_CLICK → "Accordion Opens";
   the next click on the same row closes it). So this waits for that closed
   state, scrolls the row into place and clicks it — once, and only while it
   is closed, so a row the reader already opened stays open. It runs on load,
   on every hash change, and when a link on this page to one of the rows is
   clicked (see the click handler at the end: Webflow turns those into
   pushState, which fires no hashchange).

   No other hash opens anything. Without IX2 nothing was collapsed to begin
   with: the answer is already on the page and the row is only scrolled to.

   How far below the top edge the row lands is its own `scroll-margin-top`
   (tools/blocks/cn-faq.css). The scroll is a plain window scroll (through the
   page's Lenis instance, so its own glide stops too), not scrollIntoView,
   which would also scroll any clipped ancestor of the row.
   For a few seconds after, the row is put back whenever content above it
   (lazy pictures, other blocks' reveals, the 800ms opening itself) has moved
   it while the page was otherwise still — unless the reader has scrolled,
   touched, pressed a key or clicked meanwhile.

   The rows are plain divs, and IX2 listens for a click, so without help they
   opened for a mouse only. Each row's plus is given what js/stargo-catalogue.js
   gives the catalogue's: role="button", a place in the Tab order, the row's
   question as its name, aria-controls on the answer, aria-expanded kept in
   step with the answer's real height (so it follows IX2's own tween), and
   Enter or Space doing what a click does. The opening and closing are still
   IX2's.

   A click inside an open answer does not reach the row, as in the catalogue
   (js/stargo-catalogue.js). IX2 treats any click in the row as the toggle, so
   a tap on a paragraph, or a drag to select a sentence, collapsed an answer
   several hundred pixels tall under the reader. The heading and the plus sit
   outside the answer and still toggle; links inside an answer are taken by
   the capture-phase handler below first, and the address path opens a row
   with row.click(), which starts on the row itself. */
(function () {
  var root = document.getElementById('story-5');
  if (!root || !root.querySelector('.cn-accordion-content-item[id^="creative-"]')) return;
  var PREFIX = 'creative-';
  var PATIENCE = 4000; // how long to wait for IX2 before treating it as absent
  var HOLD = 3000;     // how long a landed row is kept in place

  /* ---- the plus as a button ------------------------------------------- */
  var items = root.querySelectorAll('.cn-accordion-content-item[id^="creative-"]');
  for (var k = 0; k < items.length; k++) {
    (function (row) {
      var plus = row.querySelector('.cn-plus-block');
      var heading = row.querySelector('.cn-accordion-heading');
      var wrap = row.querySelector('.cn-accordion-content-wrap');
      if (!plus || !heading || !wrap) return;
      wrap.addEventListener('click', function (e) { e.stopPropagation(); });
      heading.id = row.id + '-title';
      wrap.id = row.id + '-answer';
      plus.setAttribute('role', 'button');
      plus.setAttribute('tabindex', '0');
      plus.setAttribute('aria-labelledby', heading.id);
      plus.setAttribute('aria-controls', wrap.id);
      function sync() {
        var open = wrap.getBoundingClientRect().height > 1;
        plus.setAttribute('aria-expanded', String(open));
        wrap.setAttribute('aria-hidden', String(!open));
      }
      plus.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        plus.click(); // bubbles to the row, where IX2 listens
      });
      sync();
      if ('ResizeObserver' in window) new ResizeObserver(sync).observe(wrap);
      else row.addEventListener('click', function () { window.setTimeout(sync, 900); });
    })(items[k]);
  }

  function rowFor(hash) {
    var id = String(hash || '').replace(/^#/, '');
    try { id = decodeURIComponent(id); } catch (e) { return null; }
    if (id.indexOf(PREFIX) !== 0) return null;
    var el = document.getElementById(id);
    return el && root.contains(el) && el.classList.contains('cn-accordion-content-item') ? el : null;
  }

  /* IX2 has started once it has closed any row of this block; after that the
     answer being open or closed is the reader's doing, so it is remembered. */
  var started = false;
  function ixStarted() {
    if (started) return true;
    var wraps = root.querySelectorAll('.cn-accordion-content-wrap');
    for (var i = 0; i < wraps.length; i++) if (wraps[i].style.height === '0px') return (started = true);
    return false;
  }

  function destOf(row) {
    var margin = parseFloat(window.getComputedStyle(row).scrollMarginTop) || 0;
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var y = row.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - margin;
    return Math.max(0, Math.min(max, Math.round(y)));
  }
  function align(row) {
    var y = destOf(row);
    // `lenis` is the page's smooth-scroll instance; an immediate jump through
    // it also stops a glide of its own that would pull the page away again.
    if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }

  var moved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, function () { moved = true; }, { passive: true });
  });

  var latest = 0;
  function arrive(hash) {
    var row = rowFor(hash);
    /* A hash that is not ours ends any wait or hold of ours (`latest` is the
       counter both take their turn from): the page now belongs to whoever owns
       that hash — js/stargo-catalogue.js for #gNN and the page's sections —
       and two scripts putting the page back in two places would fight for
       seconds. */
    if (!row) { latest++; return; }
    var wrap = row.querySelector('.cn-accordion-content-wrap');
    var run = ++latest; // a newer arrival replaces one still waiting
    var waited = 0;
    moved = false;
    (function step() {
      if (run !== latest) return;
      var h = wrap ? wrap.style.height : '';
      /* Wait while IX2 has not started (every wrap still unset) or while this
         row is mid-tween (a pixel height that is not 0). */
      var busy = !ixStarted() || (h !== '' && h !== '0px');
      if (busy && waited < PATIENCE) { waited += 100; window.setTimeout(step, 100); return; }
      moved = false;
      align(row);
      if (wrap && wrap.style.height === '0px') row.click();
      var start = Date.now(), last = null;
      (function hold() {
        if (run !== latest || moved) return;
        var y = window.pageYOffset;
        if (y === last && Math.abs(y - destOf(row)) > 2) align(row);
        last = window.pageYOffset;
        if (Date.now() - start < HOLD) window.setTimeout(hold, 120);
      })();
    })();
  }

  function onLoad() { arrive(window.location.hash); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', function () { arrive(window.location.hash); });

  /* The same page whatever form its address takes: /capabilities,
     /en/capabilities/, capabilities.html, …/index.html. */
  function pagePath(p) {
    p = String(p || '');
    try { p = decodeURIComponent(p); } catch (e) { /* keep it as written */ }
    return p.replace(/\/index(?:\.html?)?$/i, '/').replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
  }

  /* A link on this page to one of the rows. Webflow's own scroll module takes
     every same-page hash link (a delegated jQuery click handler on document):
     it cancels the jump, writes the hash with history.pushState — which fires
     no hashchange — and eases the window to the row's top edge over about two
     seconds, ignoring scroll-margin. Left to it, the row was reached closed and
     under the top edge (measured: 75px above it at 1440). So these links are
     taken first, in the capture phase, and do what the address path does: the
     hash is written the way Webflow writes it (so Back still works), and the
     row is aligned and opened. A modified click (new tab, new window) is left
     to the browser. */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href*="#' + PREFIX + '"]') : null;
    if (!a || a.host !== window.location.host) return;
    if (pagePath(a.pathname) !== pagePath(window.location.pathname)) return;
    if (!rowFor(a.hash)) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.location.hash !== a.hash && window.history && window.history.pushState) {
      try { window.history.pushState({ hash: a.hash }, '', a.hash); } catch (err) { /* file: in some engines */ }
    }
    arrive(a.hash);
  }, true);
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

   EVERY NUMBER BELOW IS READ OFF THE DONOR'S OWN ELEMENT — ONE IS NOT OBEYED
   The slider element carries them, exactly as cinery exported it, and
   tools/blocks/cn-reviews.mjs asserts each one is still there:

     data-animation="slide"      the transition is a slide, not a crossfade
     data-duration="500"         how long one transition takes, ms
     data-easing="ease"          the CSS timing function, by that name
     data-delay="4000"           how long a card is held once it has arrived, ms
     data-autoplay="true"        it advances on its own
     data-autoplay-limit="0"     cinery's word for "as many rounds as it likes"
     data-infinite="true"        the fourth card hands back to the first
     data-disable-swipe="false"  a touch drag moves it

   The fallbacks in the code are those same values — for the five it reads back,
   `duration`, `delay`, `easing`, `autoplay` and `disable-swipe` — so a re-cut
   that dropped an attribute would still turn at cinery's speed rather than at
   some other one. TWO THINGS ARE DELIBERATELY NOT THE DONOR'S, and both are in
   STOPPING below. The code never reads `data-autoplay-limit` at all: it stops
   after ONE round, where the attribute asks for rounds without end, because
   motion that starts by itself has to stop by itself (WCAG 2.2.2). And that
   round starts when the band comes into view, not when the page loads, because
   this band is thousands of pixels below the fold on both pages it appears on.
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
   so the first deliberate act by a reader — a click, a key, a swipe, pointing
   at the band, or simply putting keyboard focus inside it — stops the autoplay
   for good and leaves the band under the reader's hand. And the band stops on
   its own: it turns once round, showing every card, and then rests on the card
   it started on. An advance moves a card inside the mask, so it moves in the
   reading order too, and moving content that starts by itself has to be
   stoppable (WCAG 2.2.2 Pause, Stop, Hide); after the round the arrows and a
   swipe are the way on. The round is spent in front of a reader, not above
   one: it starts when the band first comes into view (an IntersectionObserver,
   at a quarter of the band), because the band's top sits ~5,865px down
   pricing.html and ~6,154px down en/pricing.html at 1440x900, and a round
   armed at page load would be over before anyone had scrolled to it — the one
   turn spent on an empty screen. A browser without IntersectionObserver arms
   it at load, as this file always did. Webflow's slider stops autoplay on
   interaction too; the hover, focus and one-round cases are this file's own,
   and they are what make the stop reachable without a mouse and without a
   control at all. A reader who has asked their system for less motion never
   gets the autoplay at all, and their arrow presses cut straight to the next
   card instead of sliding — the line js/stargo-pricing.js, js/stargo-media.js
   and tools/blocks/cn-produce.js already take.

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
    var turns = 0;          /* cards the band has moved on by itself */

    function place(pct, ms) {
      var kids = mask.children;
      for (var i = 0; i < kids.length; i++) {
        kids[i].style.transition = ms > 0 ? ('transform ' + ms + 'ms ' + easing) : 'none';
        kids[i].style.transform = 'translateX(' + pct + '%)';
      }
    }

    /* The band turns itself once round and then rests on the card it started
       on. An advance moves a card inside the mask, which moves it in the
       reading order too, so a band that never stops is a page that rewrites
       itself under a screen reader with no way to hold it still (WCAG 2.2.2).
       One round shows every card once; after that the arrows and a swipe are
       the way on, and pointing at the band or putting focus in it stops the
       turning at once. */
    function arm() {   /* the next card of the round; `armWhenSeen` starts it */
      window.clearTimeout(timer);
      if (!autoplay) return;
      if (turns >= count) { stop(); return; }
      timer = window.setTimeout(function () { turns++; go(1); }, delay);
    }

    function stop() {
      autoplay = false;
      window.clearTimeout(timer);
    }

    /* And the round is spent in front of a reader rather than above one. This
       band's top sits ~5,865px down pricing.html (~6,154px down
       en/pricing.html) at 1440x900, so a round armed at page load would turn
       itself out while the reader was still on the hero, and the band they
       eventually scrolled to would already be resting: the one turn spent on
       an empty screen. It is armed instead the first time a quarter of the
       band is on screen — ~175px of a ~700px band against a 720–900px
       viewport, so it fires as the band arrives rather than waiting for it to
       fill the screen. Nothing else changes: one round, then rest, and a
       reader who has already stopped it (a pointer that met the band on the
       way) finds `arm` doing nothing. A browser with no IntersectionObserver
       arms the round at load, which is what this file did before. */
    var SEEN = 0.25;

    function armWhenSeen() {
      if (!autoplay) return;
      if (typeof IntersectionObserver !== 'function') { arm(); return; }
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].intersectionRatio < SEEN) continue;
          io.disconnect();
          arm();
          return;
        }
      }, { threshold: SEEN });
      io.observe(slider);
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

    /* A reader pointing at the band, or with focus anywhere inside it, is
       reading it: the turning stops, the same way an arrow stops it. */
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('focusin', stop);

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
    armWhenSeen();
  }

  function init() {
    var sliders = document.querySelectorAll('.cn-reviews .cn-testimonial-slider');
    for (var i = 0; i < sliders.length; i++) setup(sliders[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* ---- og-intro: tools/blocks/og-intro.js ---- */
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


/* ---- qx-whatwedo: tools/blocks/qx-whatwedo.js ---- */
/* qx-whatwedo — open one foundation's capability list on click.
   Vanilla, scoped to .qx-whatwedo. The donor ships no click interaction on
   this block; this is the smallest toggle that does what the owner asked:
   "点击可以分别展开介绍01、02、03、04的功能". One node open at a time, so a
   list never stacks onto a neighbour on the crowded stage.

   Where an open list goes. qx-whatwedo.css hangs each list off its node
   toward the middle of the stage (01 to its right, 02 below, 03 above, 04
   above and to the right), which is right on a desktop screen. The nodes do
   not shrink with the screen, though, and on a tablet the lists landed on a
   neighbour: at 768 and 820 list 01 lay over node 02's title and took its
   clicks, at 1024 × 768 list 02 ran over node 03 and off the bottom of the
   pinned frame, and at 991 list 02 covered node 03. So when a list opens
   (and when the window or the frame changes), its place is checked against
   the other nodes and the pinned frame (`.qx-sticky-service-wrapp`, which
   clips): if the stylesheet's place is clear it is kept; otherwise the list
   goes to the nearest clear place beside, below or above its own node, in the
   order that keeps it pointing into the stage, and may be drawn wider (up to
   twice its node) so it is shorter. Where no clear place holds the whole list
   (a short frame, or the stacked nodes of a 480–767 screen with a long
   English list), it takes the largest clear stretch next to its node and
   scrolls inside it. The orb and the split heading may still be covered, as
   the stylesheet intends; another node's words never are, so every node
   stays readable and clickable while a list is open. Below 480 the lists
   flow under their nodes and none of this runs. */
(function () {
  var root = document.querySelector('.qx-whatwedo');
  if (!root) return;
  var nodes = root.querySelectorAll('.qx-wrapper-main-services[aria-controls]');
  var current = null;
  var settled = false; // the last placement is a compromise: do not redo it on scroll

  function panelOf(node) { return root.querySelector('#' + node.getAttribute('aria-controls')); }
  function setOpen(node, open) {
    var panel = panelOf(node);
    if (!panel) return;
    panel.hidden = !open;
    node.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { current = node; place(node, panel); }
    else if (current === node) current = null;
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

  /* ---- where an open list goes ------------------------------------------ */

  /* Per node, the sides to try after the stylesheet's own place, nearest to
     the donor's composition first. right/left: 'start' aligns the list's top
     with the node's, 'end' its bottom. above/below: 'start' aligns the left
     edges, 'end' the right edges, 'beside' starts the list past the node's
     right edge. The list then slides along that side to the nearest clear
     spot. */
  var SIDES = [
    [['right', 'start'], ['below', 'start'], ['left', 'start'], ['above', 'start']],  // 01, top left
    [['below', 'start'], ['left', 'start'], ['above', 'end'], ['right', 'start']],    // 02, right
    [['above', 'start'], ['left', 'end'], ['right', 'end'], ['below', 'start']],      // 03, bottom
    [['above', 'beside'], ['right', 'end'], ['above', 'start'], ['below', 'start']]   // 04, bottom left
  ];

  function frameOf(stage) {
    for (var e = stage; e && e !== document.body; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') return e;
    }
    return null;
  }
  function hits(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
  function rect(x, y, w, h) { return { left: x, top: y, right: x + w, bottom: y + h }; }

  /* The start coordinate nearest `pref` inside [lo, hi] that is not inside any
     blocked interval. */
  function slide(lo, hi, pref, blocked) {
    if (hi < lo) return null;
    var tries = [Math.max(lo, Math.min(hi, pref))];
    for (var i = 0; i < blocked.length; i++) tries.push(blocked[i][0], blocked[i][1]);
    var best = null;
    for (var j = 0; j < tries.length; j++) {
      var c = tries[j], ok = c >= lo - 0.01 && c <= hi + 0.01;
      for (var k = 0; ok && k < blocked.length; k++) if (c > blocked[k][0] + 0.01 && c < blocked[k][1] - 0.01) ok = false;
      if (ok && (best === null || Math.abs(c - pref) < Math.abs(best - pref))) best = c;
    }
    return best;
  }

  function geometry(node, panel) {
    var stage = node.offsetParent;
    if (!stage) return null;
    var sb = stage.getBoundingClientRect();
    var frame = frameOf(stage);
    var fb = frame ? frame.getBoundingClientRect() : { top: -Infinity, bottom: Infinity };
    var gap = parseFloat(getComputedStyle(panel).rowGap) || 12;
    var others = [], rects = [];
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      rects.push(r);
      /* keep a list a gap clear of every node, its own included */
      others.push({ left: r.left - gap + 1, right: r.right + gap - 1, top: r.top - gap + 1, bottom: r.bottom + gap - 1 });
    }
    return {
      box: { left: sb.left, right: sb.right, top: Math.max(sb.top, fb.top), bottom: Math.min(sb.bottom, fb.bottom) },
      gap: gap,
      node: node.getBoundingClientRect(),
      index: Array.prototype.indexOf.call(nodes, node),
      others: others,
      rects: rects
    };
  }
  function distance(a, b) {
    var dx = Math.max(0, a.left - b.right, b.left - a.right);
    var dy = Math.max(0, a.top - b.bottom, b.top - a.bottom);
    return Math.sqrt(dx * dx + dy * dy);
  }
  /* A list away from its node should still sit about as near to it as to any
     other node (within two gaps), or it reads as the other node's list. */
  function nearestIsOwn(g, r) {
    var own = distance(r, g.rects[g.index]);
    for (var i = 0; i < g.rects.length; i++) if (i !== g.index && distance(r, g.rects[i]) + 2 * g.gap < own) return false;
    return true;
  }
  function clear(g, r) {
    if (r.left < g.box.left - 1 || r.right > g.box.right + 1 || r.top < g.box.top - 1 || r.bottom > g.box.bottom + 1) return false;
    for (var i = 0; i < g.others.length; i++) if (hits(r, g.others[i])) return false;
    return true;
  }

  /* The free vertical runs of the frame for a list spanning [x, x + w]. */
  function runs(g, x, w) {
    var busy = [];
    for (var i = 0; i < g.others.length; i++) {
      var r = g.others[i];
      if (r.left < x + w && r.right > x) busy.push([r.top, r.bottom]);
    }
    busy.sort(function (a, b) { return a[0] - b[0]; });
    var out = [], at = g.box.top;
    for (var k = 0; k < busy.length; k++) {
      if (busy[k][0] > at) out.push([at, Math.min(busy[k][0], g.box.bottom)]);
      at = Math.max(at, busy[k][1]);
    }
    if (at < g.box.bottom) out.push([at, g.box.bottom]);
    return out;
  }

  function place(node, panel) {
    var s = panel.style;
    s.left = s.top = s.right = s.bottom = s.width = s.maxHeight = s.overflowY = '';
    panel.removeAttribute('data-lenis-prevent');
    settled = false;
    if (panel.hidden || getComputedStyle(panel).position !== 'absolute') return;
    var g = geometry(node, panel);
    if (!g) return;
    if (clear(g, panel.getBoundingClientRect())) return; // the stylesheet's place is fine

    /* where (left: 0; top: 0) puts the list: the origin of its node's box */
    s.left = '0px'; s.top = '0px'; s.right = 'auto'; s.bottom = 'auto';
    var o = panel.getBoundingClientRect();
    var n = g.node, gap = g.gap, box = g.box;
    var sides = SIDES[g.index] || SIDES[0];
    var full = box.right - box.left;

    /* the widths a list may take — its node's, up to twice that — and the
       height it then needs */
    var sizes = [];
    [1, 1.25, 1.5, 1.75, 2].forEach(function (k) {
      var w = Math.round(Math.min(full, n.width * k));
      if (sizes.length && w <= sizes[sizes.length - 1].w) return;
      s.width = w + 'px';
      sizes.push({ w: w, h: panel.offsetHeight });
    });

    function apply(c) {
      s.width = Math.round(c.w) + 'px';
      s.left = Math.round(c.x - o.left) + 'px';
      s.top = Math.round(c.y - o.top) + 'px';
      if (c.max) {
        /* a list taller than the room it has scrolls inside itself; Lenis is
           told to leave the wheel to it */
        s.maxHeight = Math.floor(c.max) + 'px';
        s.overflowY = 'auto';
        panel.setAttribute('data-lenis-prevent', '');
      }
      settled = !!c.max || !!c.far;
    }
    function blockedY(x, w, h) {
      var b = [];
      for (var j = 0; j < g.others.length; j++) {
        var r = g.others[j];
        if (r.left < x + w && r.right > x) b.push([r.top - h, r.bottom]);
      }
      return b;
    }
    function blockedX(y, w, h) {
      var b = [];
      for (var j = 0; j < g.others.length; j++) {
        var r = g.others[j];
        if (r.top < y + h && r.bottom > y) b.push([r.left - w, r.right]);
      }
      return b;
    }
    function clampX(x, w) { return Math.max(box.left, Math.min(box.right - w, x)); }
    /* a list reads as its node's when it starts beside the node's own lines,
       or right under or over them */
    function besideIt(y, h) { return y <= n.bottom - 24 && y + h >= n.top + 24; }
    function underIt(x, w) { return x <= n.right + gap + 1 && x + w >= n.left - 1; }

    /* 1. Next to its node — beside it, or right under or over it — sliding
          along that side, at the narrowest width that fits. On the way, note
          the first clear place further along that side or down the same
          column, preferring one that still sits nearest its own node. */
    var mine = null, any = null;
    function aside(x, y, w, h) {
      var c = { x: x, y: y, w: w, far: true };
      if (!mine && nearestIsOwn(g, rect(x, y, w, h))) mine = c;
      if (!any) any = c;
    }
    for (var si = 0; si < sides.length; si++) {
      var side = sides[si][0], align = sides[si][1];
      for (var zi = 0; zi < sizes.length; zi++) {
        var w = sizes[zi].w, h = sizes[zi].h, x, y;
        if (side === 'right' || side === 'left') {
          x = side === 'right' ? n.right + gap : n.left - gap - w;
          if (x < box.left - 1 || x + w > box.right + 1) continue;
          y = slide(box.top, box.bottom - h, align === 'end' ? n.bottom - h : n.top, blockedY(x, w, h));
          if (y === null || !clear(g, rect(x, y, w, h))) continue;
          if (besideIt(y, h)) { apply({ x: x, y: y, w: w }); return; }
          aside(x, y, w, h);
          continue;
        }
        var want = side === 'below' ? n.bottom + gap : n.top - gap - h;
        var px = clampX(align === 'end' ? n.right - w : align === 'beside' ? n.right + gap : n.left, w);
        if (want >= box.top - 1 && want + h <= box.bottom + 1) {
          x = slide(box.left, box.right - w, px, blockedX(want, w, h));
          if (x !== null && clear(g, rect(x, want, w, h))) {
            if (underIt(x, w)) { apply({ x: x, y: want, w: w }); return; }
            aside(x, want, w, h);
          }
        }
        y = slide(box.top, box.bottom - h, want, blockedY(px, w, h));
        if (y !== null && clear(g, rect(px, y, w, h))) aside(px, y, w, h);
      }
    }
    if (mine) { apply(mine); return; }

    /* 2. No clear place near its node holds the whole list (a short or
          crowded frame): the largest clear stretch of a column next to the
          node, scrolling — or, failing that, the whole list further away. */
    var best = null, bestAny = null;
    for (var zj = 0; zj < sizes.length; zj++) {
      var ww = sizes[zj].w, need = sizes[zj].h;
      var xs = [n.left, n.right - ww, n.right + gap, n.left - gap - ww, box.left, box.right - ww];
      for (var xi = 0; xi < xs.length; xi++) {
        var cx = xs[xi];
        if (cx < box.left - 1 || cx + ww > box.right + 1) continue;
        var free = runs(g, cx, ww);
        for (var fi = 0; fi < free.length; fi++) {
          var top = free[fi][0], end = free[fi][1], tall = end - top;
          if (tall < 120) continue;
          var over = Math.abs(end - (n.top - gap)) < 2;
          var ty = over && need < tall ? end - need : top;
          var shown = Math.min(tall, need);
          var near = underIt(cx, ww) && (over || Math.abs(top - (n.bottom + gap)) < 2);
          /* more of the list first, then a list touching its node, then a narrower one */
          var score = shown + (near ? 40 : 0) - zj;
          var c = { x: cx, y: ty, w: ww, max: need > tall ? tall : 0, score: score };
          if (nearestIsOwn(g, rect(cx, ty, ww, shown))) { if (!best || score > best.score) best = c; }
          else if (!bestAny || score > bestAny.score) bestAny = c;
        }
      }
    }
    if (best) { apply(best); return; }
    if (any) { apply(any); return; }
    if (bestAny) { apply(bestAny); return; }

    /* 3. A frame with no room at all (a landscape phone): the list goes
          under its node — or over it, where there is more room — inside the
          frame, and scrolls there, rather than off the edge of the screen. */
    var below = box.bottom - (n.bottom + gap), above = (n.top - gap) - box.top;
    var room = Math.max(below, above, 80);
    var need0 = sizes[0].h;
    var cy = below >= above ? n.bottom + gap : n.top - gap - Math.min(need0, room);
    cy = Math.max(box.top, Math.min(box.bottom - Math.min(need0, room), cy));
    apply({ x: clampX(n.left, sizes[0].w), y: cy, w: sizes[0].w, max: need0 > room ? room : 0, far: true });
  }

  /* The frame moves with the page until it pins, and the nodes drift a little
     as they fade in; a list that no longer fits is placed again. A resize or a
     late font always places it again. */
  var queued = false;
  function recheck(force) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      if (!current) return;
      var panel = panelOf(current);
      if (!panel || panel.hidden) return;
      if (!force) {
        if (settled) return;
        var g = geometry(current, panel);
        if (!g || clear(g, panel.getBoundingClientRect())) return;
      }
      place(current, panel);
    });
  }
  window.addEventListener('resize', function () { recheck(true); });
  window.addEventListener('scroll', function () { recheck(false); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { recheck(true); });
})();


/* ---- rk-price-tiers: tools/blocks/rk-price-tiers.js ---- */
/* rk-price-tiers — the price-period switch, reachable and operable from the
   keyboard.

   renok's switch is a pointer control only: IX2 event e-1700/e-1701
   (MOUSE_CLICK on `.rt-toggle`) alternates a-35 / a-36, which swap the two card
   grids (`.rt-monthly-wrapper` / `.rt-yearly-wrapper`, here 首年价格 / 续费)
   and animate the ball, the two labels and their underlines. The labels
   themselves do nothing and nothing in the switch can take focus, so a
   keyboard or screen-reader visitor could never see the renewal prices.

   This adds the tabs pattern on top, and nothing else:
     - the row is a tablist; the two labels are its tabs; the two grids are
       their tabpanels (the grid IX2 hides is `display: none`, so it is out of
       the accessibility tree already);
     - clicking a label, or Enter / Space / ← / → / Home / End on a focused
       label, selects that period — by clicking the switch, so the donor's own
       animation runs exactly as it does for a pointer;
     - a pointer click on the switch updates the tabs' state too.

   IX2 flips on every click (three quick clicks end on the renewal grid) and
   applies the change on its next frame, so the period is tracked here by
   counting clicks rather than read back straight away; 300ms after the last
   click it is read back from the grids, which also covers a page where IX2
   never started (then the switch does nothing, and the tabs say so).

   No price, plan, label or style is changed. The labels get a pointer cursor,
   which is what they now do. */
(function () {
  var root = document.querySelector('.rk-price-tiers');
  if (!root) return;
  var list = root.querySelector('.rk-rt-pricing-toggle-wrap');
  var toggle = root.querySelector('.rk-rt-toggle');
  var tabs = [root.querySelector('.rk-rt-monthly-wrap'), root.querySelector('.rk-rt-yearly-wrap')];
  var panes = [root.querySelector('.rk-rt-monthly-wrapper'), root.querySelector('.rk-rt-yearly-wrapper')];
  if (!list || !toggle || !tabs[0] || !tabs[1] || !panes[0] || !panes[1]) return;
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;

  /* Read from the first-year grid: before IX2 starts, both grids are drawn and
     the first-year one is what IX2's initial state keeps. */
  function shown() { return window.getComputedStyle(panes[0]).display === 'none' ? 1 : 0; }
  var period = shown();
  var settle = null;

  function sync() {
    for (var i = 0; i < 2; i++) {
      tabs[i].setAttribute('aria-selected', String(i === period));
      tabs[i].setAttribute('tabindex', i === period ? '0' : '-1');
    }
  }

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', zh ? '价格周期' : 'Price period');
  /* The switch stays a pointer control; the two tabs are its accessible form. */
  toggle.setAttribute('aria-hidden', 'true');
  for (var i = 0; i < 2; i++) {
    tabs[i].id = 'rk-price-period-' + i;
    panes[i].id = 'rk-price-panel-' + i;
    tabs[i].setAttribute('role', 'tab');
    tabs[i].setAttribute('aria-controls', panes[i].id);
    panes[i].setAttribute('role', 'tabpanel');
    panes[i].setAttribute('aria-labelledby', tabs[i].id);
    tabs[i].style.cursor = 'pointer';
  }

  toggle.addEventListener('click', function () {
    period = 1 - period;
    sync();
    window.clearTimeout(settle);
    settle = window.setTimeout(function () { period = shown(); sync(); }, 300);
  });

  function select(index) {
    if (index !== period) toggle.click();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(index); });
    tab.addEventListener('keydown', function (e) {
      var to;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') to = 1 - index;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = 1;
      else if (e.key === 'Enter' || e.key === ' ') to = index;
      else return;
      e.preventDefault();
      select(to);
      tabs[to].focus({ preventScroll: true });
    });
  });

  sync();
})();


})();
