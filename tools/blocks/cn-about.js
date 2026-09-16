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
