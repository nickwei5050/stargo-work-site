/**
 * The capability page's in-page links, and the capability catalogue (#atlas,
 * groups #g01–#g14): land every jump where its heading can be read, open the
 * group a link points at, and keep an open group open while it is being read.
 *
 * The fourteen rows are cinery's accordion, driven by Webflow IX2: a click on
 * the row runs "Accordion Opens", the next click "Accordion Closes", and the
 * runtime tweens the answer to its natural height. Nothing here animates a
 * row; a row is opened with the same click a reader would make, so IX2's own
 * open/closed bookkeeping stays right and the row still closes on the next
 * click of its heading.
 *
 * The targets are the page's sections and the catalogue: #loop, #story-1 …
 * #story-6, #foundations, #atlas, #g01 … #g14 and #start. Each lands with its
 * top at its own CSS `scroll-margin-top` (0 for most sections; 12vh for
 * #story-3, whose reveals ignore the top eighth of the screen; 24px for the
 * catalogue). The page has no fixed header — the navigation scrolls away with
 * the hero — so nothing else is subtracted. (#creative-* rows are handled the
 * same way by tools/blocks/cn-faq.js.)
 *
 *   - A link on this page (hero buttons, the nine steps, the story buttons and
 *     cards, the floating pill). Webflow's scroll module used to take these: it
 *     measures the target once, when the link is clicked, and glides to that
 *     number for up to two and a half seconds while ignoring scroll-margin. A
 *     section above that changes height on the way (a late picture, a block
 *     that pins or unpins, the catalogue collapsing) left the page short of the
 *     target or past it, and #story-3 always landed 12vh too high. The click is
 *     now taken first (capture phase) and the same glide is played here — the
 *     same duration formula and the same ease-in-out-cubic curve as Webflow's,
 *     so the motion is the template's — but the destination is measured again
 *     on every frame, so it ends where the target is, not where it was. The
 *     hash is written the way Webflow writes it (pushState, so Back works) and
 *     the target takes focus the way Webflow gives it. A row is opened as the
 *     glide starts (it grows downwards, so its heading does not move).
 *   - Arriving with an address (capabilities#g08 from another page, a hash
 *     set by script, Back/Forward between two hashes): the browser jumps while IX2 is
 *     still collapsing the accordions, so once IX2 has applied its closed
 *     state the target is put back in place, and a row is opened if closed.
 *   - After either, for a few seconds, the target is put back whenever late
 *     layout has moved it and the page is otherwise still. Wheel, touch, keys
 *     or a press mean the reader has taken over, and nothing is moved after
 *     that.
 *   - A click inside an open answer does not reach the row. Each answer is
 *     several paragraphs long, and IX2 treats any click in the row as the
 *     toggle, so selecting a sentence used to collapse the group and move the
 *     page under the reader. The heading and the plus still toggle.
 *   - The plus is given button semantics (role, name, state, keyboard), since
 *     the donor rows are plain divs.
 *
 * "This page" is compared on the path with its form taken off: the site is
 * served with clean URLs (/capabilities, /en/capabilities/), and the files
 * also open as capabilities.html, locally or from disk.
 *
 * Without JavaScript IX2 never collapses the rows, so every answer stays
 * readable, and every link is a plain jump. Without IX2 (no initial closed
 * state within a few seconds) this script only aligns and leaves rows as they
 * are.
 */
(function () {
  var root = document.querySelector('.cn-capmap');
  if (!root) return;
  var ROW = /^#g(0[1-9]|1[0-4])$/;
  var SECTION = /^#(?:loop|story-[1-6]|foundations|atlas|start)$/;
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

  // ---- this page ------------------------------------------------------------
  /* "/en/capabilities", "/en/capabilities/", "/en/capabilities.html" and
     "/en/capabilities/index.html" are one page; so are two spellings of the
     same local file. */
  function pagePath(p) {
    p = String(p || '');
    try { p = decodeURIComponent(p); } catch (e) { /* keep it as written */ }
    return p.replace(/\\/g, '/')
      .replace(/\/index(?:\.html?)?$/i, '/')
      .replace(/\.html?$/i, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  }
  function samePage(a) {
    return a.protocol === window.location.protocol &&
      a.host === window.location.host &&
      pagePath(a.pathname) === pagePath(window.location.pathname);
  }

  // ---- where a target belongs --------------------------------------------
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
  function maxY() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function destOf(el) {
    return Math.max(0, Math.min(maxY(), el.getBoundingClientRect().top + window.pageYOffset - marginOf(el)));
  }
  // `lenis` is the page's smooth-scroll instance (a top-level const in the
  // template's inline script). An immediate jump through it also stops any
  // glide of its own, which would otherwise carry on and pull the page away.
  function hasLenis() { return typeof lenis !== 'undefined' && lenis && lenis.scrollTo; }
  function jump(y) {
    if (hasLenis()) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }
  function scrollToEl(el) { jump(destOf(el)); }
  function misplaced(el) { return Math.abs(window.pageYOffset - destOf(el)) > 2; }

  // Wheel, touch, keys or a press after the jump mean the reader has taken
  // over; nothing is moved after that.
  var moved = false;
  function markMoved() { moved = true; }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, markMoved, { passive: true });
  });

  function targetOf(hash) {
    if (!ROW.test(hash) && !SECTION.test(hash)) return null;
    var el = document.getElementById(hash.slice(1));
    if (!el) return null;
    if (ROW.test(hash) || hash === '#atlas') return root.contains(el) ? el : null; // contains() is true for root itself
    return el;
  }
  function openRow(el, ix) {
    if (!ix || !ROW.test('#' + el.id) || isOpen(el)) return;
    var plus = el.querySelector('.cn-plus-block');
    (plus || el).click();
  }

  /* For a few seconds after a jump, put the target back if late layout moved
     it while the page itself was still. A newer jump replaces an older one. */
  var run = 0;
  function hold(el, ms) {
    var mine = ++run, start = Date.now(), last = null;
    (function check() {
      if (mine !== run || moved) return;
      var y = window.pageYOffset;
      if (y === last && misplaced(el)) scrollToEl(el);
      last = window.pageYOffset;
      if (Date.now() - start < ms) setTimeout(check, 120);
    })();
  }

  /* Webflow's own after-scroll focus: the target takes focus without an
     outline, so the next Tab continues from it. */
  function focusTarget(el) {
    var had = el.getAttribute('tabindex');
    el.classList.add('wf-force-outline-none');
    if (had === null) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { /* old engines */ }
    if (had === null) el.removeAttribute('tabindex');
    el.classList.remove('wf-force-outline-none');
  }

  /* Webflow's glide (its scroll module, js/app.schunk.25099a4fefa544e6.js):
     duration (472.143 · ln(|distance| + 125) − 2000) ms, scaled by any
     data-scroll-time, none under reduced motion; ease-in-out cubic. The
     distance is taken once, as Webflow takes it, so the timing is the
     template's; the destination is taken on every frame. */
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function glide(el, link, done) {
    var from = window.pageYOffset;
    var scale = 1;
    [document.body, link].forEach(function (n) {
      var v = n ? parseFloat(n.getAttribute('data-scroll-time')) : NaN;
      if (!isNaN(v) && v >= 0) scale = v;
    });
    var still = document.body.getAttribute('data-wf-scroll-motion') === 'none' || (reduce && reduce.matches);
    var ms = still ? 0 : Math.max(0, (472.143 * Math.log(Math.abs(destOf(el) - from) + 125) - 2000) * scale);
    var mine = ++run;
    if (hasLenis()) lenis.scrollTo(from, { immediate: true, force: true });
    var t0 = Date.now();
    (function frame() {
      if (mine !== run || moved) return;
      var p = ms ? Math.min(1, (Date.now() - t0) / ms) : 1;
      var e = p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1;
      window.scrollTo(0, from + (destOf(el) - from) * e);
      if (p < 1) requestAnimationFrame(frame);
      else { jump(destOf(el)); done(); }
    })();
  }

  // the page jumped (load, hashchange): put the target in place, open it,
  // and keep it there through late layout (fonts, pictures, pinned blocks)
  function arrive() {
    var el = targetOf(window.location.hash);
    /* A hash that is not ours ends any glide or hold of ours (`run` is the
       counter both take their turn from): the page now belongs to whoever owns
       that hash — tools/blocks/cn-faq.js for #creative-* — and two scripts
       putting the page back in two places would fight for seconds. */
    if (!el) { run++; return; }
    whenIxReady(function (ix) {
      moved = false;
      scrollToEl(el);
      openRow(el, ix);
      hold(el, 3000);
    });
  }

  // a link on this page: glide there, open a row on the way, keep it in place
  function go(el, link) {
    moved = false;
    whenIxReady(function (ix) { if (!moved) openRow(el, ix); });
    glide(el, link, function () {
      focusTarget(el);
      hold(el, 2500);
    });
  }

  function onLoad() { requestAnimationFrame(function () { requestAnimationFrame(arrive); }); }
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  window.addEventListener('hashchange', arrive);

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href*="#"]') : null;
    if (!a || !samePage(a)) return;
    var el = targetOf(a.hash);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.location.hash !== a.hash && window.history && window.history.pushState) {
      try { window.history.pushState({ hash: a.hash }, '', a.hash); } catch (err) { /* file: in some engines */ }
    }
    go(el, a);
  }, true);
})();
