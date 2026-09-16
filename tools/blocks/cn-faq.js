/* cn-faq — open the creative topic an address names.

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
   (tools/blocks/cn-faq.css). The scroll is window.scrollTo, not
   scrollIntoView, which would also scroll any clipped ancestor of the row.
   The row is aligned again once the 800ms opening is over, because content
   above it (lazy pictures, other blocks' reveals) can still move it. */
(function () {
  var root = document.getElementById('story-5');
  if (!root || !root.querySelector('.cn-accordion-content-item[id^="creative-"]')) return;
  var PREFIX = 'creative-';
  var OPEN_MS = 800;   // cinery's "Accordion Opens" size tween
  var PATIENCE = 4000; // how long to wait for IX2 before treating it as absent

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

  function align(row) {
    var margin = parseFloat(window.getComputedStyle(row).scrollMarginTop) || 0;
    var y = row.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - margin;
    window.scrollTo(0, Math.max(0, Math.round(y)));
  }

  var latest = 0;
  function arrive(hash) {
    var row = rowFor(hash);
    if (!row) return;
    var wrap = row.querySelector('.cn-accordion-content-wrap');
    var run = ++latest; // a newer arrival replaces one still waiting
    var waited = 0;
    (function step() {
      if (run !== latest) return;
      var h = wrap ? wrap.style.height : '';
      /* Wait while IX2 has not started (every wrap still unset) or while this
         row is mid-tween (a pixel height that is not 0). */
      var busy = !ixStarted() || (h !== '' && h !== '0px');
      if (busy && waited < PATIENCE) { waited += 100; window.setTimeout(step, 100); return; }
      align(row);
      if (wrap && wrap.style.height === '0px') row.click();
      window.setTimeout(function () { if (run === latest) align(row); }, OPEN_MS + 150);
    })();
  }

  function onLoad() { arrive(window.location.hash); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', function () { arrive(window.location.hash); });

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
    if (a.pathname.replace(/\.html$/, '') !== window.location.pathname.replace(/\.html$/, '')) return;
    if (!rowFor(a.hash)) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.location.hash !== a.hash && window.history && window.history.pushState) window.history.pushState({ hash: a.hash }, '', a.hash);
    arrive(a.hash);
  }, true);
})();
