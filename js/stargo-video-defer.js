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
 *
 * Since 2026-10-21 that band's 27 cards show the owner's still photographs
 * (tools/replaceables.mjs RING_STILLS), so it fetches no clip at all; the
 * other donor clips on the site still come through here.
 *
 * Since 2026-10-21 every page's template clips go through this (tools/chrome.mjs
 * writes the markup), with two refinements:
 *   - A reader who asks for reduced motion gets the poster frames and no
 *     download, the same stillness the Webflow runtime gives the clips it
 *     starts itself. Should the preference change, the clips in view start.
 *   - A clip in the side menu sits under the page while the menu is closed,
 *     where an observer would count it as visible. It loads when the menu is
 *     about to open: the pointer reaching the menu icon, the icon taking
 *     focus, or the menu losing `inert`. That was the orb in the menu's
 *     contact card; since 2026-10-21 the card shows a still photograph
 *     (tools/chrome.mjs), so no page has a clip in its menu today and this
 *     branch attaches nothing. It stays so a clip put back there still waits
 *     for the menu instead of loading with the page.
 */
(function () {
  var vids = document.querySelectorAll('video[data-defer]');
  if (!vids.length) return;
  var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function load(v) {
    if (v.dataset.deferDone || reduced.matches) return;
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

  var menu = document.getElementById('stargo-side-menu');
  var inMenu = [], onPage = [];
  for (var k = 0; k < vids.length; k++) (menu && menu.contains(vids[k]) ? inMenu : onPage).push(vids[k]);
  if (inMenu.length) {
    var openMenu = function () { for (var m = 0; m < inMenu.length; m++) load(inMenu[m]); };
    var trigger = document.querySelector('[aria-controls="stargo-side-menu"]');
    if (trigger) {
      trigger.addEventListener('pointerenter', openMenu);
      trigger.addEventListener('focus', openMenu);
      trigger.addEventListener('click', openMenu);
    }
    if ('MutationObserver' in window) new MutationObserver(function () { if (!menu.hasAttribute('inert')) openMenu(); }).observe(menu, { attributes: true, attributeFilter: ['inert'] });
  }

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < onPage.length; i++) load(onPage[i]);
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
      if (entries[i].target.dataset.deferDone) io.unobserve(entries[i].target);
    }
  }, { rootMargin: '25% 0px' });

  function watch() { for (var j = 0; j < onPage.length; j++) if (!onPage[j].dataset.deferDone) { io.unobserve(onPage[j]); io.observe(onPage[j]); } }
  watch();
  if (reduced.addEventListener) reduced.addEventListener('change', function () { if (!reduced.matches) watch(); });
})();

/* The brand film's poster (speed lane, Z14). A <video preload="none"> still
   fetches its poster with the page, 145 KB ahead of the first screen's own
   pictures for a film far down the homepage. tools/speed.mjs ships it as
   data-poster; it goes back two screens before the film comes into view, or at
   once without IntersectionObserver. */
(function () {
  var vids = document.querySelectorAll('video[data-poster]');
  if (!vids.length) return;
  function show(v) {
    if (!v.getAttribute('data-poster')) return;
    v.setAttribute('poster', v.getAttribute('data-poster'));
    v.removeAttribute('data-poster');
  }
  if (!('IntersectionObserver' in window)) { for (var i = 0; i < vids.length; i++) show(vids[i]); return; }
  // The film's section is watched, not the clip: the clip sits in a sticky,
  // clipped box that an observer would not count until it is on screen.
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      var t = entries[i].target;
      io.unobserve(t);
      for (var k = 0; k < vids.length; k++) if (t === vids[k] || t.contains(vids[k])) show(vids[k]);
    }
  }, { rootMargin: '200% 0px' });
  for (var j = 0; j < vids.length; j++) io.observe(vids[j].closest('section') || vids[j]);
})();
