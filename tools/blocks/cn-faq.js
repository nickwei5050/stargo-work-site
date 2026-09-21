/* cn-faq — open the creative topic an address names, and let a keyboard open
   any topic.

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
   (tools/blocks/cn-faq.css). The scroll is a plain window scroll (through the
   page's Lenis instance, so its own glide stops too), not scrollIntoView,
   which would also scroll any clipped ancestor of the row.
   For a few seconds after, the row is put back whenever content above it
   (lazy pictures, other blocks' reveals, the 800ms opening itself) has moved
   it while the page was otherwise still — unless the reader has scrolled,
   touched, pressed a key or clicked meanwhile.

   The rows are plain divs, and IX2 listens for a click, so without help they
   opened for a mouse only. Each row's plus is given what js/stargo-catalogue.js
   gives the catalogue's: role="button", a place in the Tab order, the row's
   question as its name, aria-controls on the answer, aria-expanded kept in
   step with the answer's real height (so it follows IX2's own tween), and
   Enter or Space doing what a click does. The opening and closing are still
   IX2's.

   A click inside an open answer does not reach the row, as in the catalogue
   (js/stargo-catalogue.js). IX2 treats any click in the row as the toggle, so
   a tap on a paragraph, or a drag to select a sentence, collapsed an answer
   several hundred pixels tall under the reader. The heading and the plus sit
   outside the answer and still toggle; links inside an answer are taken by
   the capture-phase handler below first, and the address path opens a row
   with row.click(), which starts on the row itself. */
(function () {
  var root = document.getElementById('story-5');
  if (!root || !root.querySelector('.cn-accordion-content-item[id^="creative-"]')) return;
  var PREFIX = 'creative-';
  var PATIENCE = 4000; // how long to wait for IX2 before treating it as absent
  var HOLD = 3000;     // how long a landed row is kept in place

  /* ---- the plus as a button ------------------------------------------- */
  var items = root.querySelectorAll('.cn-accordion-content-item[id^="creative-"]');
  for (var k = 0; k < items.length; k++) {
    (function (row) {
      var plus = row.querySelector('.cn-plus-block');
      var heading = row.querySelector('.cn-accordion-heading');
      var wrap = row.querySelector('.cn-accordion-content-wrap');
      if (!plus || !heading || !wrap) return;
      wrap.addEventListener('click', function (e) { e.stopPropagation(); });
      heading.id = row.id + '-title';
      wrap.id = row.id + '-answer';
      plus.setAttribute('role', 'button');
      plus.setAttribute('tabindex', '0');
      plus.setAttribute('aria-labelledby', heading.id);
      plus.setAttribute('aria-controls', wrap.id);
      function sync() {
        var open = wrap.getBoundingClientRect().height > 1;
        plus.setAttribute('aria-expanded', String(open));
        wrap.setAttribute('aria-hidden', String(!open));
      }
      plus.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        plus.click(); // bubbles to the row, where IX2 listens
      });
      sync();
      if ('ResizeObserver' in window) new ResizeObserver(sync).observe(wrap);
      else row.addEventListener('click', function () { window.setTimeout(sync, 900); });
    })(items[k]);
  }

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

  function destOf(row) {
    var margin = parseFloat(window.getComputedStyle(row).scrollMarginTop) || 0;
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var y = row.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - margin;
    return Math.max(0, Math.min(max, Math.round(y)));
  }
  function align(row) {
    var y = destOf(row);
    // `lenis` is the page's smooth-scroll instance; an immediate jump through
    // it also stops a glide of its own that would pull the page away again.
    if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }

  var moved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, function () { moved = true; }, { passive: true });
  });

  var latest = 0;
  function arrive(hash) {
    var row = rowFor(hash);
    /* A hash that is not ours ends any wait or hold of ours (`latest` is the
       counter both take their turn from): the page now belongs to whoever owns
       that hash — js/stargo-catalogue.js for #gNN and the page's sections —
       and two scripts putting the page back in two places would fight for
       seconds. */
    if (!row) { latest++; return; }
    var wrap = row.querySelector('.cn-accordion-content-wrap');
    var run = ++latest; // a newer arrival replaces one still waiting
    var waited = 0;
    moved = false;
    (function step() {
      if (run !== latest) return;
      var h = wrap ? wrap.style.height : '';
      /* Wait while IX2 has not started (every wrap still unset) or while this
         row is mid-tween (a pixel height that is not 0). */
      var busy = !ixStarted() || (h !== '' && h !== '0px');
      if (busy && waited < PATIENCE) { waited += 100; window.setTimeout(step, 100); return; }
      moved = false;
      align(row);
      if (wrap && wrap.style.height === '0px') row.click();
      var start = Date.now(), last = null;
      (function hold() {
        if (run !== latest || moved) return;
        var y = window.pageYOffset;
        if (y === last && Math.abs(y - destOf(row)) > 2) align(row);
        last = window.pageYOffset;
        if (Date.now() - start < HOLD) window.setTimeout(hold, 120);
      })();
    })();
  }

  function onLoad() { arrive(window.location.hash); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', function () { arrive(window.location.hash); });

  /* The same page whatever form its address takes: /capabilities,
     /en/capabilities/, capabilities.html, …/index.html. */
  function pagePath(p) {
    p = String(p || '');
    try { p = decodeURIComponent(p); } catch (e) { /* keep it as written */ }
    return p.replace(/\/index(?:\.html?)?$/i, '/').replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
  }

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
    if (pagePath(a.pathname) !== pagePath(window.location.pathname)) return;
    if (!rowFor(a.hash)) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.location.hash !== a.hash && window.history && window.history.pushState) {
      try { window.history.pushState({ hash: a.hash }, '', a.hash); } catch (err) { /* file: in some engines */ }
    }
    arrive(a.hash);
  }, true);
})();
