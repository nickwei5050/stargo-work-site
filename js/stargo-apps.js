/* 应用套件 — the capability page's app band (#apps, tools/app-suite.mjs, css/stargo-apps.css).
 *
 * Assemble, once per category, the first time it scrolls into view: its
 * hairline draws, its icons come out of a stack where the first one sits and
 * spread into their places one after another, and the count beside the name
 * ticks up as each one lands, while the bar in the category's colour draws
 * in. Rows already on screen when the page loads are left as they are, and
 * under reduced motion (or without IntersectionObserver / Web Animations)
 * nothing is hidden or moved at all.
 *
 * Then pointing at an icon, or focusing it, lifts it and puts its name, its
 * role and the catalogue group it links to in the row's left column (wide
 * screens only; the CSS keeps that column's height fixed). Nothing cycles on
 * its own and nothing here is a live region: the role is the link's
 * description already (aria-describedby), the column is a visual echo of it.
 * A tile is a plain link to #gNN; js/stargo-catalogue.js glides there and
 * opens the row.
 */
(function () {
  var root = document.querySelector('.sg-apps');
  if (!root) return;
  var rows = Array.prototype.slice.call(root.querySelectorAll('.sg-apps-row'));
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var EASE = 'cubic-bezier(.22, 1, .36, 1)';

  // ---- assemble ----------------------------------------------------------
  function play(row) {
    var cells = Array.prototype.slice.call(row.querySelectorAll('.sg-apps-cell'));
    var count = row.querySelector('.sg-apps-n');
    var first = cells[0].getBoundingClientRect();
    var landed = 0;
    // the start offsets are measured before the row is shown, in one pass
    var from = cells.map(function (c) {
      var r = c.getBoundingClientRect();
      return [(first.left - r.left) * 0.6, (first.top - r.top) * 0.6 + 26];
    });
    row.classList.add('is-in');
    cells.forEach(function (c, i) {
      var delay = 140 + i * 75;
      var timing = { duration: 1000, delay: delay, easing: EASE, fill: 'backwards' };
      c.animate([
        { transform: 'translate(' + from[i][0] + 'px,' + from[i][1] + 'px) scale(.8)', opacity: 0 },
        { opacity: 1, offset: 0.4 },
        { transform: 'none', opacity: 1 }
      ], timing);
      // the names come in once their icons have nearly arrived, so they never cross one another
      var name = c.querySelector('.sg-apps-name');
      // (on linear time: keyframe offsets follow the easing, and this one is nearly done by a third of the way)
      if (name) name.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], { duration: 1000, delay: delay, easing: 'linear', fill: 'backwards' });
      setTimeout(function () { landed += 1; count.textContent = String(landed); }, delay + 380);
    });
  }

  if (!reduce.matches && 'IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    var below = rows.filter(function (r) { return r.getBoundingClientRect().top > window.innerHeight * 0.86; });
    if (below.length) {
      rows.forEach(function (r) { if (below.indexOf(r) === -1) r.classList.add('is-in'); });
      below.forEach(function (r) { r.querySelector('.sg-apps-n').textContent = '0'; });
      root.classList.add('is-armed');
      var next = 0;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          // rows that arrive together follow one another
          var now = Date.now();
          var wait = Math.max(0, next - now);
          next = now + wait + 180;
          setTimeout(function () { play(en.target); }, wait);
        });
      }, { rootMargin: '0px 0px -14% 0px' });
      below.forEach(function (r) { io.observe(r); });
    }
  }

  // ---- an app's role in the row's left column ------------------------------
  rows.forEach(function (row) {
    var role = row.querySelector('.sg-apps-role');
    if (!role) return;
    var nameEl = role.querySelector('.sg-apps-role-name');
    var textEl = role.querySelector('.sg-apps-role-text');
    var goEl = role.querySelector('.sg-apps-role-go');
    if (!nameEl || !textEl || !goEl) return;
    var current = null, timer = 0;

    function on(tile) {
      clearTimeout(timer);
      if (current === tile) return;
      var swap = !!current;
      if (current) current.classList.remove('is-on');
      current = tile;
      tile.classList.add('is-on');
      nameEl.textContent = tile.getAttribute('data-name');
      var why = tile.querySelector('.sg-apps-why-role');
      textEl.textContent = why ? why.textContent : '';
      goEl.textContent = tile.getAttribute('data-go');
      row.classList.add('is-hot');
      // from one icon to the next the words change in place, so give the change a beat
      if (swap && !reduce.matches && role.animate) {
        role.animate([{ opacity: 0.2, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE });
      }
    }
    function off() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (current) current.classList.remove('is-on');
        current = null;
        row.classList.remove('is-hot');
      }, 140);
    }
    Array.prototype.forEach.call(row.querySelectorAll('.sg-apps-tile'), function (tile) {
      // a tap is a jump to the catalogue, not a hover
      tile.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') on(tile); });
      tile.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') off(); });
      tile.addEventListener('focus', function () { on(tile); });
      tile.addEventListener('blur', off);
    });
  });
})();
