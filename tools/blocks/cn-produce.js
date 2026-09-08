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
