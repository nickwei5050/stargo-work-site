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
