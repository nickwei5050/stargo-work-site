/* AREAS · the centrepieces — the one drawing each area card is built around (the
   scenes are js/stargo-motion-areas.js; a window of the cast with a `body` gets one).
   Each returns its tick(tau) and, when rows follow it, the x where they start. Last, where
   the hand-off chips between windows land (K.sgaHandoff). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var ZH = K.ZH, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease;
  function glyph(n, p, s, c) { return K.capGlyph(n, p, s, c); }
  function box(c, p, x, y, w, h, t) { return K.capBox(c, p, x, y, w, h, t); }

  var SW = 120;   // the sweep turns 120° a second
  K.sgaBody = {
    // 智搜: a radar whose sweep finds the shortlist; the dim dots are signals not yet worth a call
    radar: function (c, d, o, W, CLEAR) {
      var S = Math.max(90, Math.min(o.h - 54, o.w * 0.36, 250)), cx = 16 + S / 2, cy = 44 + (o.h - 44 - 6) / 2, r0 = S / 2;
      var svg = sv('svg', { class: 'sga-radar', width: o.w, height: o.h, 'aria-hidden': 'true' }, c);
      [1, 0.66, 0.33].forEach(function (k) { sv('circle', { cx: cx, cy: cy, r: r0 * k, class: 'sga-rr' }, svg); });
      sv('path', { d: 'M' + (cx - r0) + ' ' + cy + 'H' + (cx + r0) + 'M' + cx + ' ' + (cy - r0) + 'V' + (cy + r0), class: 'sga-rr' }, svg);
      var sw = sv('g', {}, svg), a = 52 * Math.PI / 180;
      sv('path', { d: 'M' + cx + ' ' + cy + 'L' + cx + ' ' + (cy - r0) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + (cx - r0 * Math.sin(a)).toFixed(1) + ' ' + (cy - r0 * Math.cos(a)).toFixed(1) + 'Z', class: 'sga-sweep' }, sw);
      sv('path', { d: 'M' + cx + ' ' + cy + 'V' + (cy - r0), class: 'sga-edge' }, sw);
      for (var i = 0; i < 9; i++) { var an = K.hash(i + 3) * 6.283, rr = r0 * (0.22 + 0.72 * K.hash(i + 11)); sv('circle', { cx: (cx + rr * Math.sin(an)).toFixed(1), cy: (cy - rr * Math.cos(an)).toFixed(1), r: 2.2, class: 'sga-sig' }, svg); }
      var pins = d.pins.map(function (p) {
        // a pin sits where the sweep's edge is when it is found
        var an = (p[0] * SW) * Math.PI / 180, ux = Math.sin(an), uy = -Math.cos(an), px = cx + r0 * p[1] * ux, py = cy + r0 * p[1] * uy;
        var g = sv('g', { transform: 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')', class: 'sga-pin' }, svg);
        var ring = sv('circle', { r: 11, class: 'sga-pin-r' }, g);
        sv('circle', { r: 4.6, class: 'sga-pin-c' }, g);
        // the label sits on the inner side of the pin, inside the window
        var t = sv('text', { x: ux < 0 ? 15 : -15, y: 4, 'text-anchor': ux < 0 ? 'start' : 'end', class: 'sga-pin-t' }, g); t.textContent = p[2];
        return { g: g, ring: ring, t: p[0] };
      });
      return { left: S + 28, tick: function (tau) {
        put(sw, 'transform', 'rotate(' + ((tau * SW) % 360).toFixed(1) + ' ' + cx + ' ' + cy + ')');
        for (var i = 0; i < pins.length; i++) {
          var p = pins[i], on = tau >= p.t && tau < CLEAR, u = seg(tau, p.t, p.t + 1.1);
          cl(p.g, 'is-on', on);
          put(p.ring, 'transform', 'scale(' + (on ? (0.6 + 1.1 * ease.out(u)).toFixed(3) : '0.6') + ')');
          put(p.ring, 'opacity', on ? (1 - u * 0.75).toFixed(3) : '0');
        }
      } };
    },
    // 企业管理: one order along its rail, quote to collection
    rail: function (c, d, o, W, CLEAR) {
      // the first and last labels stay inside the window
      var N = d.rail.length, gap = (o.w - 24) / N, l = 12 + gap / 2;
      if (gap > 198) { l = 111; gap = (o.w - 222) / (N - 1); }
      var r = o.w - l, lw = Math.min(gap - 8, 190), y = 46 + Math.max(26, (o.h - 46 - 74) / 2);
      box('sga-rl', c, l, y, r - l, 2);
      var fill = box('sga-rl is-fill', c, l, y, r - l, 2), tok = box('sga-tok', c, l - 7, y - 6, 14, 14);
      var nodes = d.rail.map(function (n, i) {
        var x = l + i * gap, nd = box('sga-nd', c, x - 13, y - 12, 26, 26), lb = box('sga-nl', c, x - lw / 2, y + 22, lw);
        glyph(i === N - 1 ? 'coin' : i === 0 ? 'doc' : i === 2 ? 'box' : i === 3 ? 'check' : i === 4 ? 'send' : 'doc', nd, 13);
        el('b', '', lb, n[0]);
        var sub = el('span', '', lb, n[3] ? n[1] + ' 0/' + n[3] : W < 900 && n[4] ? n[4] : n[1]);
        return { nd: nd, lb: lb, sub: sub, n: n, x: x, last: -1 };
      });
      if (o.w < 760) cl(c, 'is-tight', true);
      return { tick: function (tau) {
        // the order stands at a node from its time; it travels in the 0.5 s before
        var pos = 0, i;
        for (i = 1; i < N; i++) { var t = d.rail[i][2]; if (tau >= t - 0.5) pos = i - 1 + ease.io(seg(tau, t - 0.5, t)); }
        if (tau >= CLEAR) pos = 0;
        put(fill, '-transform', 'scaleX(' + (pos / (N - 1)).toFixed(4) + ')');
        put(tok, '-transform', 'translateX(' + (pos * gap).toFixed(1) + 'px)');
        for (i = 0; i < N; i++) {
          var n = nodes[i], on = tau >= n.n[2] && (n.n[2] === 0 || tau < CLEAR);
          cl(n.nd, 'is-on', on); cl(n.lb, 'is-on', on);
          cl(n.nd, 'is-hold', on && i === N - 1);
          if (n.n[3]) { var k = tau >= CLEAR ? 0 : Math.round(n.n[3] * seg(tau, n.n[2], n.n[2] + 2)); if (k !== n.last) { n.last = k; put(n.sub, 'text', n.n[1] + ' ' + k + '/' + n.n[3]); } }
        }
      } };
    },
    // 数字员工: a goal handed to a coordinator, who hands it on to four roles (an org chart)
    crew: function (c, d, o, W, CLEAR) {
      var bodyH = o.h - 46 - 10, tall = bodyH >= 124, est = function (s) { return Array.from(s).length * (ZH ? 13.5 : 7.4) + 44; };
      var co = d.crew[0], roles = d.crew.slice(1), cw = est(co[1]), H1 = 30, x0 = 14, inner = o.w - 28;
      // tall: the goal, then the coordinator under it; short: the goal and the coordinator side by side
      var gw = tall ? inner : inner - cw - 24, gy = 50, cx = tall ? x0 + (inner - cw) / 2 : x0 + gw + 24, cy = tall ? gy + 36 + 12 : gy + 3;
      var q = box('sga-row is-q is-on sga-goal', c, x0, gy, gw, 36);
      glyph('search', q, 15, 'sga-q-ico');
      var qt = el('span', 'sga-q', q), qs = el('span', '', qt), car = el('i', 'sga-car', qt), chars = Array.from(d.goal[3]), qn = -1;
      // a goal too long for its field is typed in its short form (measured once the card is built)
      if (o.fit) o.fit.add(qs, K.capAlts(d.goal[3], d.goal[4], d.goal[5]), function (v) { chars = Array.from(v); });
      var svg = sv('svg', { class: 'sga-wires', width: o.w, height: o.h, 'aria-hidden': 'true' }, c);
      if (tall) sv('path', { d: 'M' + (x0 + inner / 2) + ' ' + (gy + 36) + 'V' + cy, class: 'sga-wire' }, svg);
      // the four in one row under the coordinator, centred on it where they fit
      // too wide: the roles go without their glyphs, then narrower
      var sum = function () { return ws.reduce(function (a, b) { return a + b + 10; }, -10); };
      var ws = roles.map(function (r) { return est(r[1]); }), tot = sum(), bare = tot > inner;
      if (bare) { ws = ws.map(function (w) { return w - 20; }); tot = sum(); }
      if (tot > inner) { var k = (inner - 30) / (tot - 30); ws = ws.map(function (w) { return Math.floor(w * k); }); tot = inner; }
      var ry = cy + H1 + 18, rx = Math.max(x0, Math.min(x0 + inner - tot, cx + cw / 2 - tot / 2)), bus = cy + H1 + 9, mx = cx + cw / 2;
      function chip(rl, x, y, w, g) { var e = box('sga-crew', c, x, y, w, H1); if (g) glyph(rl[0], e, 13); el('span', '', e, rl[1]); return e; }
      var cE = chip(co, cx, cy, cw, 1); cl(cE, 'is-co', true);
      var nodes = roles.map(function (rl, i) {
        var e = chip(rl, rx, ry, ws[i], !bare), ex = rx + ws[i] / 2, dd = 'M' + mx + ' ' + (cy + H1) + 'V' + bus + 'H' + ex + 'V' + ry;
        rx += ws[i] + 10;
        sv('path', { d: dd, class: 'sga-wire' }, svg);
        return { e: e, w: sv('path', { d: dd, class: 'sga-wire is-lit', opacity: 0 }, svg), t: rl[2] };
      });
      var note = ry + H1 + 26 <= o.h - 6 ? box('sga-note', c, x0, ry + H1 + 8, inner, 18, d.note) : null;
      return { full: function (on) { put(qs, 'text', on ? chars.join('') : ''); qn = -1; }, tick: function (tau) {
        var n = tau >= CLEAR ? 0 : Math.round(chars.length * seg(tau, d.goal[0], d.goal[1]));
        if (n !== qn) { qn = n; put(qs, 'text', n ? chars.slice(0, n).join('') : d.goal[2]); cl(q, 'is-ph', !n); }
        put(car, '-opacity', tau >= d.goal[0] && tau < d.goal[1] + 0.6 && (tau < d.goal[1] || (tau * 2.4 | 0) % 2 === 0) ? '1' : '0');
        cl(cE, 'is-on', tau >= co[2] && tau < CLEAR);
        for (var i = 0; i < nodes.length; i++) { var on = tau >= nodes[i].t && tau < CLEAR; cl(nodes[i].e, 'is-on', on); put(nodes[i].w, 'opacity', on ? '1' : '0'); }
        if (note) cl(note, 'is-on', tau >= d.crew[4][2] + 0.3 && tau < CLEAR);
      } };
    }
  };
  /* The hand-off chips of an area card (js/stargo-motion-areas.js), placed once its texts are
     final: stg the stage (W wide), Q its typing fields, SHOWN how long a chip is on screen. */
  K.sgaHandoff = function (stg, W, Q, SHOWN, links) {
    var RISE = 10;
    /* Where a hand-off chip lands: the free space of the destination window nearest the row it
       is for, swept from the window's near edge, clear of every text, pill and glyph that is on
       screen while the chip is (rows by their time spans, earlier chips by theirs). Read once per
       build. Nowhere free: no chip, the guide alone carries the hand-off. */
    function marks(w) {
      if (w.marks) return w.marks;
      var M = w.marks = [], sr = stg.getBoundingClientRect(), k = sr.width / W || 1, rng = document.createRange();
      function add(r, ro) {
        if (!r.width || !r.height) return;
        // a row is measured before it first shows, 6px below its place (.sga-row's rise), and it
        // sinks back there as it leaves: it covers its place and those 6px
        var f = ro ? ro.at : -1, u = ro ? ro.__until + 0.5 : 99, dy = ro ? -6 : 0;
        M.push([(r.left - sr.left) / k - 3, (r.top - sr.top) / k + dy - 3, (r.right - sr.left) / k + 3, (r.bottom - sr.top) / k + 3, f, u]);
      }
      function walk(n, ro) {
        for (var c = n.firstChild; c; c = c.nextSibling) {
          if (c.nodeType === 3) { if (c.data.trim()) { rng.selectNodeContents(c); add(rng.getBoundingClientRect(), ro); } continue; }
          if (c.nodeType !== 1 || c.classList.contains('sga-bar')) continue;
          var r2 = c.__ro || ro;
          if (c.matches('.sga-cc, .sga-gi, .sga-meter, .sga-pill, .sga-v, .sga-fact, .sga-tile, .sga-gate, .sga-btns, .sga-crew, .sga-nd, .sga-q-ico')) add(c.getBoundingClientRect(), r2);
          if (c.namespaceURI !== 'http://www.w3.org/2000/svg') walk(c, r2);
        }
      }
      // measured as wide as they get: facts with their values, fields with their full text
      function facts(on) { w.rows.forEach(function (o) { if (o.f && o.r.k === 'fx') o.f.forEach(function (F) { put(F.t, 'text', on ? F.v : F.f[0]); }); }); }
      w.rows.forEach(function (o) { o.r.__until = o.until; });
      facts(true);
      if (w.body && w.body.full) w.body.full(true);
      Q.forEach(function (o) { put(o.q, 'text', o.chars.length >= Array.from(o.ph || '').length ? o.chars.join('') : o.ph); });
      walk(w.c, null);
      Q.forEach(function (o) { put(o.q, 'text', ''); });
      if (w.body && w.body.full) w.body.full(false);
      facts(false);
      return M;
    }
    function lane(o) {
      var a = o.a, b = o.b, t0 = o.l.t, t1 = t0 + SHOWN, M = marks(b), yt = o.yb == null ? o.ya : o.yb, cw, ch;
      // a free box of the chip's size in b; `swept`: so is the strip from b's near edge to it
      function find(swept) {
        // risen in place, it starts RISE lower
        var best = null, bc = 1e9, n = Math.floor((b.w - 20 - cw) / 16), lo = swept ? 0 : RISE;
        for (var y = b.y + 46; y + ch + lo <= b.y + b.h - 5; y += 2) {
          for (var j = 0; j <= n; j++) {
            var xl = o.right ? b.x + 10 + j * 16 : b.x + b.w - 10 - cw - j * 16;
            var x0 = swept && o.right ? b.x : xl, x1 = swept && !o.right ? b.x + b.w : xl + cw + 4, free = true;
            for (var m = 0; m < M.length && free; m++) { var q = M[m]; if (q[5] > t0 - 0.1 && q[4] < t1 && q[0] < x1 && q[2] > x0 && q[1] < y + ch + lo && q[3] > y) free = false; }
            if (!free) continue;
            var cost = Math.abs(y + ch / 2 - yt) + j * (swept ? 10 : 3);
            if (cost < bc) { bc = cost; best = [xl, y]; }
            break;
          }
        }
        return best;
      }
      // slid in from the edge; else risen in place; then the same at a smaller size (and shorter text)
      var best = null, slide = false;
      for (var k = 0; k < 2 && !best; k++) {
        if (k) { cl(o.chip, 'is-sm', true); if (o.l.ts) put(o.chip.firstChild.lastChild, 'text', o.l.ts); }
        cw = o.chip.firstChild.offsetWidth; ch = o.chip.firstChild.offsetHeight;
        best = find(true); slide = !!best;
        if (!best) best = find(false);
      }
      if (!best) { o.clip.parentNode.removeChild(o.clip); o.chip = null; return; }
      // the chip keeps its place while it is shown: a later chip to this window goes round it
      M.push([best[0] - 4, best[1] - 4, best[0] + cw + 4, best[1] + ch + 4, t0, t1]);
      var edge = o.right ? a.x + a.w : a.x, cl0 = o.right ? edge : b.x, cw0 = o.right ? b.x + b.w - edge : edge - b.x, yl = best[1] + ch / 2;
      var cs = o.clip.style; cs.left = cl0 + 'px'; cs.top = (best[1] - 28) + 'px'; cs.width = cw0 + 'px'; cs.height = (ch + 56) + 'px';
      o.chip.style.left = (best[0] - cl0) + 'px'; o.chip.style.top = '28px';
      // it starts just behind the source window's edge (or a little low, where it rises in place)
      o.dx = slide ? (o.right ? -(best[0] - cl0 + cw + 2) : (edge - best[0] + 2)) : 0; o.dy = slide ? 0 : RISE;
      put(o.chip, '-transform', 'translate(' + o.dx + 'px,' + o.dy + 'px)');
      var bx = o.right ? b.x : b.x + b.w, gx = (edge + bx) / 2;
      o.guide.setAttribute('d', 'M' + edge + ' ' + o.ya + 'C' + gx + ' ' + o.ya + ' ' + gx + ' ' + yl + ' ' + bx + ' ' + yl);
    }
    links.forEach(function (o) { if (o.chip) lane(o); });
  };
  return {};
});
