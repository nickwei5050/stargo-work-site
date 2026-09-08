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
