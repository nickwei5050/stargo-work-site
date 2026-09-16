/**
 * Load a donor block's video only once the reader is near it.
 *
 * cinery's "LET'S PRODUCE" band is a fan of 27 video cards, and the template
 * ships every one as `<video autoplay preload="metadata">`. Faithful to the
 * template, that is 32 MB fetched the moment the capability page opens, before
 * a reader has scrolled anywhere near the band — on a phone connection the page
 * is unusable long before it is beautiful.
 *
 * So the build writes each `<source src>` as `<source data-src>` (see
 * tools/build-site.mjs) and this restores it when the band comes within a
 * screen of the viewport. Nothing else changes: same elements, same classes,
 * same `data-w-id`s, same `autoplay`, same poster frame showing until the file
 * arrives, same interactions. Once a reader reaches the band it is the
 * template's band exactly.
 *
 * Without IntersectionObserver every video is restored immediately, which is
 * the behaviour the template itself has.
 */
(function () {
  var vids = document.querySelectorAll('video[data-defer]');
  if (!vids.length) return;

  function load(v) {
    if (v.dataset.deferDone) return;
    v.dataset.deferDone = '1';
    var sources = v.querySelectorAll('source[data-src]');
    for (var i = 0; i < sources.length; i++) {
      sources[i].setAttribute('src', sources[i].getAttribute('data-src'));
      sources[i].removeAttribute('data-src');
    }
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay may be blocked; the poster stands */ });
  }

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < vids.length; i++) load(vids[i]);
    return;
  }

  /* Lead time, measured rather than guessed.
     ------------------------------------------------------------------------
     This was one full screen ('100% 0px'), which is right for cinery's break
     band on the capability page — that band is a long way down, so a screen of
     warning costs nothing and the clips are ready when the reader arrives.

     It is wrong for the About page, where the four project clips are the
     SECOND section: measured at 1440x900 the band starts at y=869 against a
     900px viewport, so a screen of lead time means every clip is fetched at
     first paint — 5.66 MB before the reader has scrolled. The band's own
     position, not the observer, is why desktop cannot be saved here; all four
     tiles sit side by side and are genuinely on screen almost at once.

     Where it does pay is a phone, where the same four tiles stack into a
     2133px column: with a quarter-screen of lead only the tiles actually
     approaching are fetched, and the ones near the bottom wait until they are
     wanted. A quarter screen is still ~210px of warning on a phone and ~225px
     on a desktop — enough that the file is in flight before the poster scrolls
     into view, which is what the lead time is for. */
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      load(entries[i].target);
      io.unobserve(entries[i].target);
    }
  }, { rootMargin: '25% 0px' });

  for (var j = 0; j < vids.length; j++) io.observe(vids[j]);
})();
