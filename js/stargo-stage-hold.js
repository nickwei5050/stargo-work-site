/**
 * Keep a picture in the business stages' sticky box the whole time that list is
 * on screen.
 *
 * The homepage's five stages (001 主动获客 … 005 复购与改进) are five
 * `.service-wrapper`s, each holding its own title and its own picture; the
 * pictures are absolutely positioned in one shared sticky box, and Mono lights
 * them one at a time: SCROLL_INTO_VIEW (action list a-239) sets a stage's
 * `.service-media-wrap` to opacity 1 and its `.service-title-wrap` to 1,
 * SCROLL_OUT_OF_VIEW (a-240) sets them back to 0 and 0.12, both at a 50%
 * offset — so the stage crossing the viewport's midline is the one shown, and
 * exactly one ever is. That rule is the donor's and is left alone.
 *
 * Its gap is the tail. Once the last stage has passed the midline nothing is
 * lit, and the sticky box sits empty until the column itself scrolls out —
 * half a viewport height, which is why the measured figures track the window's
 * height and not its width: 488px at 768x1024, 420px at 1440x900, 622px at
 * 1920x1080, and 0px at all three with this script loaded. The same happens, more briefly, before the first stage reaches the
 * midline and in the frame between one stage going out and the next coming in.
 *
 * So whenever the runtime has nothing lit and the list is still in view, this
 * shows the stage nearest the midline — which is the stage the runtime's own
 * rule would light if its band were continuous, so the picture is never a
 * surprise: past the end it is the last stage, before the start the first, and
 * mid-handoff it is whichever of the two is closer.
 *
 * It holds with a class rather than a value. `.sgp-stage-hold` overrides the
 * inline opacity through `!important` (css/stargo-fusion.css), so the runtime
 * keeps writing its own state underneath, this script writes no style at all,
 * and dropping the class shows exactly what the runtime wants at that moment —
 * there is nothing of ours to restore and nothing to get out of step.
 *
 * Reading that state has one trap. Inline opacity is the runtime's whole state
 * for four of the five stages, but the first one is lit by the stylesheet
 * instead — `.service-media-wrap:where(.w-variant-f1d8637b-…){opacity:100}`,
 * from the donor's `variant="active"` — so with no inline value it is *visible*,
 * not dark. Take it for dark and this script can hold a second picture on top of
 * it. (It does not happen today only because js/stargo-ix-arrival.js runs first
 * and writes that stage an inline 0; depending on that would be a bug waiting
 * for someone to add `defer` to it.) So a stage with no inline value is read as
 * whatever its own stylesheet says.
 *
 * The same shape as js/stargo-ix-arrival.js: a small correction on top of the
 * Webflow runtime, reading the inline opacity it manages and writing none.
 */
(function () {
  var HOLD = 'sgp-stage-hold';

  /* The box the pictures actually live in decides when there is nothing left to
     hold; between 480 and 499px it outlives the list by up to 41px, and above
     that it is the shorter of the two. The list is the fallback. */
  var column = document.querySelector('.service-media-sticky') || document.querySelector('.service-list, .service-grid');
  var wraps = [].slice.call(document.querySelectorAll('.service-media-wrap'));
  var titles = [].slice.call(document.querySelectorAll('.service-title-wrap'));
  if (!column || wraps.length < 2 || titles.length !== wraps.length) return;

  /* Which stages the stylesheet lights on its own (the donor's active variant). */
  var variant = wraps.map(function (w) { return String(w.className).indexOf('w-variant-') >= 0; });
  /* The runtime's state: its inline value where it has written one, the
     stylesheet's answer where it has not. */
  function runtimeLit(el, i) { return el.style.opacity === '' ? variant[i] : parseFloat(el.style.opacity) > 0; }

  var current = -1;
  function hold(index) {
    if (index === current) return;                 // nothing to write on most frames
    if (current >= 0) wraps[current].classList.remove(HOLD);
    if (index >= 0) wraps[index].classList.add(HOLD);
    current = index;
  }

  function sync() {
    for (var i = 0; i < wraps.length; i++) if (runtimeLit(wraps[i], i)) { hold(-1); return; }
    var box = column.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) { hold(-1); return; }
    var mid = window.innerHeight / 2, best = -1, bestDistance = Infinity;
    for (var j = 0; j < titles.length; j++) {
      var r = titles[j].getBoundingClientRect();
      var d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestDistance) { bestDistance = d; best = j; }
    }
    hold(best);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; sync(); });
  }

  /* The runtime writes inline styles, so watch those rather than polling; the
     scroll listener covers the case where nothing changes but the list moves.
     This script's own writes are class changes, which `attributeFilter` skips,
     so it can never observe itself. */
  var observer = new MutationObserver(schedule);
  for (var k = 0; k < wraps.length; k++) observer.observe(wraps[k], { attributes: true, attributeFilter: ['style'] });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
})();
