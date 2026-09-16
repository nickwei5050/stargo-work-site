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
 *   - Arriving on capabilities.html#g08 from another page (or a hash set by
 *     script): the browser jumps to the row while IX2 is still collapsing the
 *     accordions above it, so the landing point drifts. Once IX2 has applied
 *     its closed state, the row is brought back to the top of the screen (its
 *     CSS scroll-margin keeps the heading clear of the edge), then clicked
 *     open if it is closed. #atlas is re-aligned the same way without opening
 *     anything.
 *   - A link on this page (a macro card, a "details" link): Webflow's scroll
 *     module takes the click — it cancels it, pushes the hash without a
 *     hashchange event and glides to where the row was when the link was
 *     clicked. That glide is the template's motion and stays. The row is
 *     opened at once (it grows downwards, so its heading does not move), and
 *     when the page has stopped moving the row is re-aligned in case the
 *     sections above it changed height on the way (lazy images, pinned
 *     blocks). If the reader scrolls or clicks meanwhile, it is left alone.
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

  function marginOf(el) { return parseFloat(getComputedStyle(el).scrollMarginTop) || 0; }
  function scrollToEl(el) {
    var y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - marginOf(el));
    // `lenis` is the page's smooth-scroll instance (a top-level const in the
    // template's inline script); jump it too, or it glides back.
    if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }
  function misplaced(el) { return Math.abs(el.getBoundingClientRect().top - marginOf(el)) > 2; }

  // Wheel, touch, keys or a press after the arrival mean the reader has taken
  // over; nothing is moved after that.
  var moved = false;
  function markMoved() { moved = true; }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, markMoved, { passive: true });
  });

  function targetOf(hash) {
    if (!ROW.test(hash) && hash !== '#atlas') return null;
    var el = document.getElementById(hash.slice(1));
    return el && root.contains(el) ? el : null; // contains() is true for root itself
  }
  function openRow(el, ix) {
    if (!ix || !ROW.test('#' + el.id) || isOpen(el)) return;
    var plus = el.querySelector('.cn-plus-block');
    (plus || el).click();
  }

  // the page jumped (load, hashchange): put the row in place, open it, and
  // put it back once more after late layout (fonts, images above)
  function arrive() {
    var el = targetOf(window.location.hash);
    if (!el) return;
    whenIxReady(function (ix) {
      moved = false;
      scrollToEl(el);
      openRow(el, ix);
      setTimeout(function () { if (!moved) scrollToEl(el); }, 1000);
    });
  }

  // the page is gliding there (Webflow's scroll): open the row now, and align
  // it once the page has held still for a moment
  function follow(el) {
    whenIxReady(function (ix) {
      moved = false;
      openRow(el, ix);
      var last = null, still = 0, start = Date.now();
      (function settle() {
        if (moved) return;
        var y = window.pageYOffset;
        still = y === last ? still + 1 : 0;
        last = y;
        if (still < 6 && Date.now() - start < 8000) { setTimeout(settle, 50); return; }
        if (misplaced(el)) scrollToEl(el);
      })();
    });
  }

  function onLoad() { requestAnimationFrame(function () { requestAnimationFrame(arrive); }); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', arrive);

  // A link to a group on this page. Webflow's handler may run before or after
  // this one, so what happened is read once both have: a cancelled click is
  // Webflow gliding; otherwise the browser jumped, and a changed hash has
  // already fired hashchange (a hash that was already current fires nothing).
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.host !== window.location.host || a.pathname !== window.location.pathname) return;
    var el = targetOf(a.hash);
    if (!el) return;
    var before = window.location.hash;
    setTimeout(function () {
      if (e.defaultPrevented) follow(el);
      else if (before === a.hash) arrive();
    }, 0);
  });
})();
