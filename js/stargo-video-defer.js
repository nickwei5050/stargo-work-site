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

  /* One screen of lead time, so the file is there by the time the band is. */
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      load(entries[i].target);
      io.unobserve(entries[i].target);
    }
  }, { rootMargin: '100% 0px' });

  for (var j = 0; j < vids.length; j++) io.observe(vids[j]);
})();
