/* AREAS — 「四个板块，十四类能力」 (capabilities.html): the four area cards where the
   photographs C01–C04 were. Each card is its area's apps working one piece of business
   around the card's glass caption, with one centrepiece each: 智搜's radar (areaGrowth),
   an inquiry whose words become the account's facts and a reply wired to its sources
   (areaContext), one order on a rail from quote to collection (areaDeal), a goal handed
   to a coordinator and four roles (areaTeam). Work passes as a chip across a band, a dot
   down a side or a wire; every area ends at a person and nothing is sent by itself.
   Every window has a resting state, and the loop fades back to it. The caption is
   measured (and watched), so nothing runs under it in any language:
     desk   W 720–1400 × H 380–900   bands above and below the caption; the honesty
                                     tag on the top edge, which the next card of the
                                     sticky stack never covers
     phone  W 300–558                the apps light in turn above the caption and a
                                     line below says what moved, shrinking to labels
                                     and then to the tag alone as the caption grows
   The cast is js/stargo-motion-areas-cast.js (K.sgaCast), the centrepieces
   js/stargo-motion-areas-centre.js (K.sgaBody), the glyphs js/stargo-motion-cap-kit.js.
   Placed by tools/code-art-capareas.mjs, styled by css/stargo-motion-areas.css. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, ZH = K.ZH, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;
  function glyph(n, p, s, c) { return K.capGlyph(n, p, s, c); }
  function box(c, p, x, y, w, h, t) { return K.capBox(c, p, x, y, w, h, t); }
  // the entry of a [time, value, …] table in force at tau
  function at(tb, tau) { var j = 0; while (j + 1 < tb.length && tau >= tb[j + 1][0]) j++; return j; }

  function AreaScene(key) {
    return function () {
      var P = 14, CLEAR = 13.2, START = 1.6;
      var A = K.sgaCast(key), layouts = {};
      A.win.forEach(function (d) { d.st.unshift([0, T('待命', 'Ready'), 'i']); });
      function lay(kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
      function pick(w, h) {
        if (w < 560 || h < 330) return lay('phone', Math.max(300, Math.min(558, Math.round(w / 2) * 2)), Math.max(220, Math.min(440, Math.round(h / 2) * 2)));
        return lay('desk', Math.max(720, Math.min(1400, Math.round(w / 20) * 20)), Math.max(380, Math.min(900, Math.round(h / 20) * 20)));
      }
      var R, kind, W, H, Lc = null, stg = null, card = null, nextCard = null, covered = false, chk = -1, capEl = null, capRO = null, capK = '', lastT = START;

      /* the caption's box in stage pixels (the host is not transformed; its ancestors may be) */
      function cap(stage) {
        var host = stage.parentNode;
        card = host && host.closest ? host.closest('.work-card') : null;
        nextCard = card ? card.nextElementSibling : null;
        capEl = card ? card.querySelector('.work-title-main') : null;
        if (!capEl || !host.offsetWidth) return null;
        var hr = host.getBoundingClientRect(), cr = capEl.getBoundingClientRect(), k = hr.width / host.offsetWidth || 1;
        var w = host.clientWidth, h = host.clientHeight, s = Math.min(w / W, h / H), ox = (w - W * s) / 2, oy = (h - H * s) / 2;
        if (!cr.width) return null;
        var c = { x: ((cr.left - hr.left) / k - ox) / s, y: ((cr.top - hr.top) / k - oy) / s, w: cr.width / k / s, h: cr.height / k / s };
        // a caption that is not on the stage (a page mid-capture, say): lay out around the usual place
        return c.x > -4 && c.y > -4 && c.x + c.w < W + 4 && c.y + c.h < H + 4 ? c : null;
      }
      function capKey(c) { return c ? [c.x, c.y, c.w, c.h].map(function (v) { return Math.round(v / 3); }).join() : ''; }

      /* ---------------- desk ---------------- */
      var ROWS = { q: 36, it: 46, st: 50, th: 54, gt: 54, pm: 34, msg: 60, fx: 40, ci: 34 }, TIGHT = { q: 34, it: 42, st: 46, th: 50, gt: 50, pm: 30, msg: 56, fx: 36, ci: 30 }, ROWH = ROWS;
      function buildDesk(stage, c) {
        var m = W >= 1300 ? 26 : W >= 1100 ? 22 : 18, g = W >= 1100 ? 20 : 12, cg = 14;
        if (!c) c = { x: W * 0.2, y: H * 0.34, w: W * 0.6, h: H * 0.32 };
        var yT = m + 16, y2 = Math.round(c.y + c.h + cg), b1 = Math.max(0, Math.round(c.y - cg) - yT), b2 = Math.max(0, H - m - y2);
        ROWH = Math.min(b1, b2) < 176 ? TIGHT : ROWS;
        R.m = m; R.cap = c;
        R.svg = sv('svg', { class: 'sga-fx', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' }, stage);
        R.win = []; R.wl = [];
        var spec = W < 900 && A.narrow ? A.narrow : A.desk;
        [[spec[0], yT, b1], [spec[1], y2, b2]].forEach(function (band) {
          var list = band[0], inner = W - 2 * m - g * (list.length - 1), x = m;
          list.forEach(function (it, j) {
            var w = j === list.length - 1 ? W - m - x : Math.round(inner * it[1]);
            R.wl.push(R.win[it[0]] = win(stage, A.win[it[0]], x, band[1], w, band[2]));
            x += w + g;
          });
        });
        R.links = [];
        A.links.forEach(function (l) { var o = R.win[l.a] && R.win[l.b] ? link(stage, l) : null; if (o) R.links.push(o); });
        var tag = el('div', 'sg-tag sga-tag', stage, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
        tag.style.left = (W - m) + 'px'; tag.style.top = (m + 8) + 'px';
      }
      function win(stage, d, x, y, w, h) {
        var c = box('sga-win', stage, x, y, w, h);
        var bar = el('div', 'sga-bar', c);
        var ic = el('span', 'sga-app', bar); glyph(d.g, ic, 15);
        el('b', '', bar, d.app);
        if (w >= 430) el('span', 'sga-grp', bar, d.grp);
        var st = el('span', 'sga-st', bar); el('i', '', st);
        var o = { c: c, d: d, x: x, y: y, w: w, h: h, st: el('span', '', st), stEl: st, stK: -1, rows: [], slotY: [] };
        var top = 46, left = 10, rw = w - 20;
        if (d.body) {
          o.body = K.sgaBody[d.body](c, d, o, W, CLEAR);
          if (o.body.left) { left = o.body.left; rw = w - left - 10; } else return o;
        }
        // the slots that fit: the full plan, else the short one, else the later slots only
        var avail = h - top - 8;
        function plan(full) {
          var sl = [], tot = 0, rows = [];
          d.rows.forEach(function (r) { var s = full || r.c === undefined ? r.s : r.c; if (s == null) return; rows.push([r, s]); sl[s] = Math.max(sl[s] || 0, ROWH[r.k]); });
          for (var i = 0; i < sl.length; i++) tot += (sl[i] || 0) + 6;
          return { sl: sl, tot: tot, rows: rows, from: 0 };
        }
        var p = plan(true);
        if (p.tot > avail) p = plan(false);
        while (p.tot > avail && p.from < p.sl.length - 1) p.tot -= (p.sl[p.from++] || 0) + 6;
        var yy = top;
        for (var s = p.from; s < p.sl.length; s++) { o.slotY[s] = yy; yy += (p.sl[s] || 0) + 6; }
        p.rows.forEach(function (rs) { if (rs[1] >= p.from) o.rows.push(row(c, rs[0], left, o.slotY[rs[1]], rw, rs[1], o)); });
        // a row shows until the next row of its slot; a resting row comes back as the loop fades
        o.rows.forEach(function (a) {
          a.until = CLEAR;
          o.rows.forEach(function (b) { if (b.slot === a.slot && b.r.at > a.r.at && b.r.at < a.until) a.until = b.r.at; });
        });
        return o;
      }
      function row(c, r, x, y, w, slot, wo) {
        var e = box('sga-row is-' + r.k + (r.o ? ' is-old' : ''), c, x, y, w, ROWH[r.k]);
        // a narrow row takes its short strings; a very narrow one leaves its pill to the window's status
        var o = { e: e, r: r, slot: slot, y: y, vis: null }, sh = w < (r.bar ? 540 : 380);
        if (r.k === 'q') {
          glyph(r.pen ? 'pen' : 'search', e, 15, 'sga-q-ico');
          var qt = el('span', 'sga-q', e); o.q = el('span', '', qt); o.car = el('i', 'sga-car', qt); o.qn = -1; o.chars = Array.from(r.a);
          return o;
        }
        if (r.k === 'gt') {
          var gs = sv('svg', { viewBox: '-20 -20 40 40', width: 34, height: 34, class: 'sg-gate is-wait sga-gate', 'aria-hidden': 'true' }, e);
          o.ring = sv('circle', { r: 16, class: 'sg-gate-ring' }, gs);
          sv('rect', { x: -6, y: -6, width: 12, height: 12, rx: 2.4, transform: 'rotate(45)', class: 'sg-gate-core' }, gs);
          var gt = el('div', 'sga-tx', e); el('b', '', gt, sh && r.as ? r.as : r.a); el('span', '', gt, sh && r.bs ? r.bs : r.b);
          if (w >= 470) { var bt = el('span', 'sga-btns', e); el('span', 'sg-btn is-primary', bt, T('确认', 'Confirm')); el('span', 'sg-btn', bt, T('修改', 'Revise')); }
          return o;
        }
        if (r.k === 'fx' || r.k === 'ci') {
          // a narrow row: tighter chips, and a fact's short value where it has one
          var tight = w < 340; cl(e, 'is-tight', tight);
          o.f = r.f.map(function (f) { var ch = el('span', 'sga-fact' + (f[3] ? ' is-miss' : ''), e); return { e: ch, t: el('span', '', ch, f[0]), f: f, v: tight && f[4] || f[1], on: null }; });
          return o;
        }
        if (r.k === 'msg') {
          el('span', 'sga-cc is-av', e, r.cc);
          var mt = el('div', 'sga-msg', e), hd = el('div', 'sga-msg-h', mt); el('b', '', hd, r.a); el('span', '', hd, r.ch);
          var bb = el('div', 'sga-bub', mt);
          o.hl = [];
          r.parts.forEach(function (p) { if (typeof p === 'string') bb.appendChild(document.createTextNode(p)); else o.hl.push([el('mark', '', bb, p[0]), p[1]]); });
          return o;
        }
        if (r.cc) el('span', 'sga-cc', e, r.cc); else if (r.g) { var gi = el('span', 'sga-gi', e); glyph(r.g, gi, r.k === 'pm' ? 13 : 14); }
        var tx = el('div', 'sga-tx', e); el('b', '', tx, sh && r.as ? r.as : r.a);
        if (r.k === 'st') {
          var ss = el('div', 'sga-steps', tx);
          o.steps = r.s2.map(function (s) { var sp = el('span', 'sga-step', ss); el('i', '', sp); el('em', '', sp, s[0]); return sp; });
          return o;
        }
        if (r.k === 'th') {
          var th = el('div', 'sga-thumbs', e);
          if (w < 300) cl(e, 'is-stack', true);   // the label above the frames
          o.th = r.s2.map(function (s, k) { var tile = el('i', 'sga-tile is-t' + k, th); glyph(k === 2 ? 'play' : 'image', tile, 14); return tile; });
          return o;
        }
        if (r.b) el('span', '', tx, sh && r.bs ? r.bs : r.b);
        if (r.bar && w >= 400) {
          var mb = el('i', 'sga-meter', e); o.fill = el('i', '', mb);
          if (r.floor) { var fl = el('i', 'sga-floor', mb); fl.style.left = (r.floor * 100) + '%'; }
        }
        if (r.v) o.v = el('em', 'sga-v', e, '0');
        if (r.p && (w >= 260 || r.k !== 'it')) { o.p = el('span', 'sga-pill', e); o.pk = -1; }
        return o;
      }

      // work passing between windows
      // the centre line of a window's row by its id, in stage pixels (no id: the top of its body)
      function rowAt(w, id) {
        for (var i = 0; i < w.rows.length; i++) if (w.rows[i].r.id === id) return w.y + w.rows[i].y + ROWH[w.rows[i].r.k] / 2;
        return id ? null : w.y + 68;
      }
      function link(stage, l) {
        var a = R.win[l.a], b = R.win[l.b], o = { l: l };
        if (l.k === 'chip' || l.k === 'wire') {
          var right = a.x < b.x, ya = rowAt(a, l.ra), yb = rowAt(b, l.rb);
          if (ya == null || yb == null) { if (l.k === 'wire') return null; ya = ya || a.y + 74; yb = yb || b.y + 74; }
          var x0 = right ? a.x + a.w - (l.k === 'wire' ? 10 : 56) : a.x + 56, x1 = right ? b.x + (l.k === 'wire' ? 10 : 56) : b.x + b.w - 56;
          o.p = [[x0, ya], [x0 + (x1 - x0) * 0.35, ya - (l.k === 'wire' ? 0 : 34)], [x0 + (x1 - x0) * 0.65, yb - (l.k === 'wire' ? 0 : 34)], [x1, yb]];
          if (l.k === 'wire') {
            var dd = 'M' + o.p[0] + 'C' + o.p[1] + ' ' + o.p[2] + ' ' + o.p[3];
            o.wire = sv('path', { d: dd, class: 'sga-wire is-lit is-cite', opacity: 0 }, R.svg);
            o.dot = sv('circle', { r: 3.4, class: 'sga-dot', opacity: 0 }, R.svg);
            return o;
          }
          o.guide = sv('path', { d: 'M' + (right ? a.x + a.w : a.x) + ' ' + ya + 'H' + (right ? b.x : b.x + b.w), class: 'sga-guide' }, R.svg);
          o.chip = el('div', 'sga-chip', stage); var ci = el('span', '', o.chip); glyph('arrow', ci, 13); el('b', '', ci, l.text);
          return o;
        }
        // down (or up) a side, beside the caption
        var left = a.x + a.w / 2 < W / 2, x = left ? R.m + 40 : W - R.m - 40, down = a.y < b.y;
        var y0 = down ? a.y + a.h : b.y + b.h, y1 = down ? b.y : a.y;
        box('sga-sr', stage, x - 0.7, y0, 1.4, y1 - y0);
        o.lit = box('sga-sr is-lit' + (down ? '' : ' is-up'), stage, x - 0.7, y0, 1.4, y1 - y0);
        o.dot = box('sga-sd', stage, x - 4, (down ? y0 : y1) - 4, 8, 8);
        o.d = down ? y1 - y0 : y0 - y1;
        box('sga-sn', stage, x - 3, y0 - 3, 6, 6); box('sga-sn', stage, x - 3, y1 - 3, 6, 6);
        return o;
      }

      /* ---------------- phone: what the caption leaves above and below it ---------------- */
      function buildPhone(stage, c) {
        var pad = 12;
        if (!c) c = { x: 24, y: 48, w: W - 48, h: H - 96 };
        var gt = c.y, gb = H - c.y - c.h, cb = c.y + c.h;
        var big = gt >= 40, small = !big && gt >= 16, n = A.pn.length, gap = big ? 6 : 10;
        var tagTop = gb < 15;   // no room below: the tag joins the top row
        var tw = tagTop ? (ZH ? 60 : 70) : 0, av = W - 2 * pad - tw - gap * (n - 1);
        // each app as wide as its name (and glyph) needs, sharing what is left; names that would
        // not fit beside their glyphs go without them
        function fit(g) {
          var e = A.pn.map(function (s) { return Array.from(s).length * (ZH ? 12 : 6.9) + (big ? 14 : 0) + g; }), t = e.reduce(function (a, b) { return a + b; }, 0);
          return { t: t, w: e.map(function (x) { return t <= av ? x + (av - t) / n : x * av / t; }) };
        }
        var narrow = big && fit(18).t > av, ws = fit(big ? (narrow ? 0 : 18) : 11).w, cx = pad;
        cl(stage, 'is-narrow', narrow);
        R.chips = (big || small) ? A.win.map(function (d, i) {
          var h = big ? 28 : 16, e = box(big ? 'sga-pchip' : 'sga-plab', stage, cx, Math.max(4, Math.round((gt - h) / 2)), ws[i], h);
          cx += ws[i] + gap;
          if (big) glyph(d.g, e, 13); else el('i', '', e);
          el('span', '', e, A.pn[i]);
          return { c: e, d: d };
        }) : [];
        if (gb >= 30) {
          var line = box('sga-pline', stage, pad, Math.round(cb + (gb - 22) / 2), W - 2 * pad, 22);
          R.pdot = el('i', '', line);
          R.ptext = el('span', 'sga-ptext', line);
          el('span', 'sg-tag', line, T('演示数据', 'Demo data'));
        } else {
          var tg = el('div', 'sg-tag sga-ptag', stage, T('演示数据', 'Demo data'));
          tg.style.left = (W - pad) + 'px'; tg.style.top = (tagTop ? Math.max(15, Math.round(gt / 2 + 7)) : Math.round(H - (gb - 15) / 2)) + 'px';
        }
      }

      function build(stage, L) {
        kind = L.kind; W = L.w; H = L.h; Lc = L; stg = stage; R = { stage: stage };
        stage.textContent = '';
        stage.className = 'sg-mo-stage sga sga-' + key + ' is-' + kind;
        var c = cap(stage);
        capK = capKey(c);
        if (kind === 'phone') buildPhone(stage, c); else buildDesk(stage, c);
        // the caption changes size when its webfont arrives or its text reflows: lay out again
        if (!capRO && capEl && window.ResizeObserver) {
          capRO = new ResizeObserver(function () {
            if (!Lc || capKey(cap(stg)) === capK) return;
            build(stg, Lc); tick(lastT);
          });
          capRO.observe(capEl);
        }
        chk = -1;
      }

      /* ---------------- frame ---------------- */
      var pt = [0, 0];
      function bezAt(p, u) {
        var v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
        pt[0] = a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0];
        pt[1] = a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1];
      }
      function rowTick(o, tau) {
        var r = o.r, keep = r.at === 0, vis = keep ? tau < o.until || tau >= CLEAR : tau >= r.at && tau < o.until, live = tau < CLEAR;
        if (o.vis !== vis) { o.vis = vis; cl(o.e, 'is-on', vis); }
        if (r.k === 'q') {
          var n = live ? Math.round(o.chars.length * seg(tau, r.t0, r.t1)) : 0;
          if (o.qn !== n) { o.qn = n; put(o.q, 'text', n || !r.ph ? o.chars.slice(0, n).join('') : r.ph); cl(o.e, 'is-ph', !n && !!r.ph); }
          // the caret blinks in script, so it stops with the scene
          put(o.car, '-opacity', tau >= r.t0 && tau < r.t1 + 0.7 && (tau < r.t1 || (tau * 2.4 | 0) % 2 === 0) ? '1' : '0');
          return;
        }
        if (o.ring) { put(o.ring, 'transform', vis ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)'); cl(o.e, 'is-wait', vis); return; }
        if (o.steps) { for (var k = 0; k < o.steps.length; k++) cl(o.steps[k], 'is-on', tau >= r.s2[k][1] && (r.s2[k][1] === 0 || live)); return; }
        if (o.th) { for (var j = 0; j < o.th.length; j++) cl(o.th[j], 'is-on', tau >= r.s2[j] && live); return; }
        if (o.hl) { for (var h = 0; h < o.hl.length; h++) cl(o.hl[h][0], 'is-on', tau >= o.hl[h][1] && live); return; }
        if (o.f) {
          for (var f = 0; f < o.f.length; f++) {
            var F = o.f[f], on = tau >= F.f[r.k === 'fx' ? 2 : 1] && live;
            if (F.on !== on) { F.on = on; cl(F.e, 'is-on', on); if (r.k === 'fx') textSwap(F.t, on ? F.v : F.f[0]); }
          }
          return;
        }
        if (o.fill) put(o.fill, '-transform', 'scaleX(' + (live ? r.bar[2] * ease.out(seg(tau, r.bar[0], r.bar[1])) : 0).toFixed(3) + ')');
        if (o.v) put(o.v, 'text', String(live ? Math.round(r.v[0] * ease.out(seg(tau, r.v[1], r.v[2]))) : 0));
        if (o.p) {
          var pk = live ? at(r.p, tau) : 0;
          if (o.pk !== pk) { o.pk = pk; put(o.p, 'data-tone', r.p[pk][2]); textSwap(o.p, r.p[pk][1]); }
        }
      }
      function tick(t) {
        lastT = t;
        var tau = mod(t, P), i;
        // 4 times a second, two rect reads: is the next card of the stack lying on this one?
        if (card && nextCard && Math.abs(t - chk) > 0.25) {
          chk = t;
          covered = nextCard.getBoundingClientRect().top <= card.getBoundingClientRect().top + 2 && getComputedStyle(card).position === 'sticky';
        }
        if (covered && R.drawn) return;
        R.drawn = true;
        if (kind === 'phone') {
          for (i = 0; i < R.chips.length; i++) cl(R.chips[i].c, 'is-on', tau >= R.chips[i].d.on[0] && tau < R.chips[i].d.on[1]);
          if (R.ptext) {
            var pk = at(A.ph, tau);
            if (R.pk !== pk) { R.pk = pk; textSwap(R.ptext, A.ph[pk][1]); }
            put(R.pdot, '-transform', 'scale(' + (1 + 0.35 * Math.sin(tau * 5)).toFixed(3) + ')');
          }
          return;
        }
        for (i = 0; i < R.wl.length; i++) {
          var w = R.wl[i], d = w.d;
          cl(w.c, 'is-on', tau >= d.on[0] && tau < d.on[1]);
          var sk = tau >= CLEAR ? 0 : at(d.st, tau);
          if (w.stK !== sk) { w.stK = sk; put(w.stEl, 'data-tone', d.st[sk][2]); textSwap(w.st, d.st[sk][1]); }
          if (w.body) w.body.tick(tau);
          for (var k = 0; k < w.rows.length; k++) rowTick(w.rows[k], tau);
        }
        for (i = 0; i < R.links.length; i++) {
          var o = R.links[i], t0 = o.l.t, u = seg(tau, t0, t0 + 0.9), e = ease.io(u), moving = u > 0 && u < 1;
          if (o.chip) {
            if (moving) { bezAt(o.p, e); put(o.chip, '-transform', 'translate(' + pt[0].toFixed(1) + 'px,' + pt[1].toFixed(1) + 'px)'); }
            put(o.chip, '-opacity', moving ? (Math.min(1, u * 6, (1 - u) * 6)).toFixed(3) : '0');
            cl(o.guide, 'is-lit', tau >= t0 && tau < t0 + 1.6);
          } else if (o.wire) {
            put(o.wire, 'opacity', tau >= t0 && tau < CLEAR ? '1' : '0');
            if (moving) { bezAt(o.p, e); put(o.dot, 'transform', 'translate(' + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1) + ')'); }
            put(o.dot, 'opacity', moving ? '1' : '0');
          } else {
            put(o.lit, '-transform', 'scaleY(' + (tau < CLEAR ? e : 0).toFixed(3) + ')');
            put(o.dot, '-transform', 'translateY(' + (o.d * e).toFixed(1) + 'px)');
            put(o.dot, '-opacity', moving ? '1' : '0');
          }
        }
      }

      return {
        layouts: layouts,
        pick: pick,
        build: build,
        tick: tick,
        start: START,  // a card slides in with its first windows already at work
        still: 12.4,   // every window has done its part; the area waits for a person
        cue: function (t) { return Math.ceil((t - START) / P) * P + START; }
      };
    };
  }

  return { areaGrowth: AreaScene('areaGrowth'), areaContext: AreaScene('areaContext'), areaDeal: AreaScene('areaDeal'), areaTeam: AreaScene('areaTeam') };
});
