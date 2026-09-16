/**
 * The capability catalogue (#atlas, groups #g01–#g14): open the group a link
 * points at, and keep an open group open while it is being read.
 *
 * The fourteen rows are cinery's accordion, driven by Webflow IX2: a click on
 * the row runs "Accordion Opens", the next click "Accordion Closes", and the
 * runtime tweens the answer to its natural height. Nothing here animates; the
 * row is opened with the same click a reader would make, so IX2's own
 * open/closed bookkeeping stays right and the row still closes on the next
 * click of its heading.
 *
 *   - Arriving on capabilities.html#g08 (from another page, or a link or
 *     macro card on this one): the browser jumps to the row while IX2 is
 *     still collapsing the accordions above it, so the landing point drifts.
 *     Once IX2 has applied its closed state, the row is brought back to the
 *     top of the screen (its CSS scroll-margin keeps the heading clear of the
 *     edge), then clicked open if it is closed. #atlas is re-aligned the same
 *     way without opening anything.
 *   - A click inside an open answer does not reach the row. Each answer is now
 *     several paragraphs long, and IX2 treats any click in the row as the
 *     toggle, so selecting a sentence used to collapse the group and move the
 *     page under the reader. The heading and the plus still toggle.
 *   - The plus is given button semantics (role, name, state, keyboard), since
 *     the donor rows are plain divs.
 *
 * Without JavaScript IX2 never collapses the rows, so every answer stays
 * readable. Without IX2 (no initial closed state within a few seconds) this
 * script only aligns the row and leaves it as it is.
 */
(function () {
  var root = document.querySelector('.cn-capmap');
  if (!root) return;
  var ROW = /^#g(0[1-9]|1[0-4])$/;
  var rows = root.querySelectorAll('.cn-accordion-content-item[id]');

  function wrapOf(row) { return row.querySelector('.cn-accordion-content-wrap'); }
  function isOpen(row) { var w = wrapOf(row); return !!w && w.getBoundingClientRect().height > 1; }

  // ---- reading: clicks inside an answer stay there -------------------------
  for (var i = 0; i < rows.length; i++) {
    var w = wrapOf(rows[i]);
    if (w) w.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  // ---- the plus as a button -------------------------------------------------
  for (var j = 0; j < rows.length; j++) {
    (function (row) {
      var plus = row.querySelector('.cn-plus-block');
      var heading = row.querySelector('.cn-accordion-heading');
      var wrap = wrapOf(row);
      if (!plus || !heading || !wrap) return;
      heading.id = row.id + '-title';
      wrap.id = row.id + '-detail';
      plus.setAttribute('role', 'button');
      plus.setAttribute('tabindex', '0');
      plus.setAttribute('aria-labelledby', heading.id);
      plus.setAttribute('aria-controls', wrap.id);
      function sync() {
        var open = isOpen(row);
        plus.setAttribute('aria-expanded', String(open));
        wrap.setAttribute('aria-hidden', String(!open));
      }
      plus.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        plus.click();
      });
      sync();
      if ('ResizeObserver' in window) new ResizeObserver(sync).observe(wrap);
      else row.addEventListener('click', function () { setTimeout(sync, 900); });
    })(rows[j]);
  }

  // ---- arriving on a group --------------------------------------------------
  var ixReady = false;
  function whenIxReady(cb) {
    if (ixReady) { cb(true); return; }
    var start = Date.now();
    (function check() {
      // IX2 writes height:0px on every row's answer when it starts.
      if (root.querySelector('.cn-accordion-content-wrap[style*="height"]')) { ixReady = true; cb(true); return; }
      if (Date.now() - start > 5000) { cb(false); return; }
      setTimeout(check, 100);
    })();
  }

  function scrollToEl(el) {
    var margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    var y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - margin);
    // `lenis` is the page's smooth-scroll instance (a top-level const in the
    // template's inline script); jump it too, or it glides back.
    if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }

  var moved = false;
  function markMoved() { moved = true; }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, markMoved, { passive: true });
  });

  function arrive() {
    var hash = window.location.hash;
    var isRow = ROW.test(hash);
    if (!isRow && hash !== '#atlas') return;
    var el = document.getElementById(hash.slice(1));
    if (!el || !root.contains(el)) return; // contains() is true for root itself
    whenIxReady(function (ix) {
      moved = false;
      scrollToEl(el);
      if (isRow && ix && !isOpen(el)) {
        var plus = el.querySelector('.cn-plus-block');
        (plus || el).click();
      }
      // Late layout (fonts, images above) can still shift the row once;
      // put it back unless the reader has started moving.
      setTimeout(function () { if (!moved) scrollToEl(el); }, 1000);
    });
  }

  function onLoad() { requestAnimationFrame(function () { requestAnimationFrame(arrive); }); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', arrive);
  // A link to the group already in the address fires no hashchange.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.hash !== window.location.hash || a.pathname !== window.location.pathname) return;
    if (!ROW.test(a.hash) && a.hash !== '#atlas') return;
    setTimeout(arrive, 0);
  });
})();
