/**
 * Reveal what the reader has already scrolled past.
 *
 * Webflow's SCROLL_INTO_VIEW fires when an element crosses into the viewport.
 * The elements it drives are exported carrying an inline `opacity: 0`, so until
 * that event fires they are not merely un-animated — they are invisible.
 *
 * That is fine when a reader scrolls down the page. It is wrong in two cases
 * this site actually produces:
 *
 *   - Arriving on an anchor. The floating pill jumps to #story-1 … #story-4 and
 *     the hero button jumps to #atlas. The browser lands mid-page, so every
 *     animated element above the landing point has already been passed, will
 *     never cross into view, and stays at opacity 0 for good.
 *   - Reloading with a restored scroll position, which does the same thing.
 *
 * So after the runtime has bound its events, anything still holding an inline
 * opacity above the fold is put back to 1 — no animation, because there is
 * nothing left to animate into: the reader is already past it. Elements below
 * the fold are untouched and animate normally when they arrive.
 *
 * Only inline opacity is read, and only on elements Webflow addresses
 * (`data-w-id`), so nothing this site styles itself is affected.
 */
(function () {
  /**
   * `strict` is the immediate pass, run before the runtime has had a chance to
   * fire anything: only elements entirely above the viewport are revealed,
   * because those are the ones whose trigger provably can never fire again.
   *
   * The later passes drop that to "not still below the fold". By then the
   * runtime has had over a second: anything on screen that it was ever going to
   * animate has animated. What is left at zero is what the hash jump scrolled
   * past mid-element, and revealing it is the only way it will ever be read.
   * Elements still below the fold are never touched, so the entrance animation
   * a reader scrolls into is exactly as the donor drew it.
   */
  function reveal(strict) {
    var nodes = document.querySelectorAll('[data-w-id][style*="opacity"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.style.opacity !== '0') continue;
      var r = el.getBoundingClientRect();
      if (strict ? r.bottom > 0 : r.top > window.innerHeight) continue;
      el.style.opacity = '1';
    }
  }

  function run() {
    // After the runtime's own ready pass, so this is not overwritten by it.
    requestAnimationFrame(function () { requestAnimationFrame(function () { reveal(true); }); });
    // The hash jump can land after layout settles; look again once it has.
    setTimeout(function () { reveal(true); }, 400);
    setTimeout(function () { reveal(false); }, 1400);
  }

  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run);
})();

/**
 * The homepage's five business stages: one stage lit at a time, however the
 * reader gets there.
 *
 * Each stage row lights its title and its picture when it crosses the middle
 * of the screen and dims them again when it leaves (Webflow's scroll-into-view
 * and scroll-out-of-view, 50% offset). The first row is exported already lit —
 * the template's "active" variant, a class, not an inline style — so a reader
 * coming down from the top sees it lit before it arrives. But only the
 * out-of-view event ever dims it, and that fires only after the row has been
 * in the middle of the screen. A reader who never passed it there — the End
 * key and then back up, a reload that restores a lower position, a jump
 * straight into the list — had stage 001 lit beside the stage really in view,
 * two pictures and two descriptions drawn over each other.
 *
 * So once the middle of the screen is below the first row, the first row gets
 * exactly what the out-of-view event would have written. Above it (the reader
 * has not reached the list) and on it, nothing is touched: the template's look
 * and its own events stay in charge, and the motion is unchanged.
 */
(function () {
  var first = document.querySelector('.service-wrapper[data-wf--service-item--variant="active"]');
  if (!first) return;
  var title = first.querySelector('.service-title-wrap');
  var media = first.querySelector('.service-media-wrap');
  if (!title || !media) return;
  var queued = false;

  function check() {
    queued = false;
    // The runtime's own test, at its 50% offset: in view while the row
    // reaches the middle line of the document's client area.
    if (first.getBoundingClientRect().bottom >= document.documentElement.clientHeight / 2) return;
    if (title.style.opacity !== '0.12') title.style.opacity = '0.12';
    if (media.style.opacity !== '0') media.style.opacity = '0';
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('pageshow', queue);
  if (document.readyState === 'complete') queue();
  else window.addEventListener('load', queue);
  // The restored or hash position can land after the load event.
  setTimeout(queue, 400);
  setTimeout(queue, 1400);
  queue();
})();
