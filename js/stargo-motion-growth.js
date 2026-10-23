/* Growth OS row backgrounds, capabilities.html 「主动获客」 (hosts placed by
   tools/blocks/cn-service.mjs, styled by css/stargo-motion-growth.css). The
   four night photographs behind the rows are drawn instead, in row order:
   dossier (企业研究: a company file assembling, each fact sourced and dated,
   one 待核实), lanes (贸易情报, in js/stargo-motion-lanes.js, which draws with
   this file's kit), rhythm (补货判断: PT Surya's ~60-day order rhythm up to
   the restock window), committee (关键角色: who weighs in, who decides, and the
   hand-off that waits for your OK). Cinery's hover crossfade sets each host's
   opacity and the runner ticks only a visible host, so only the hovered row's
   scene moves (on phones only the first background shows).

   Composition: the rows' type covers the field, so a scene writes only in the
   strips between the rows — 64px each side of every hairline from 992 up, 48
   below — and only in the two strips that frame its own row, so what it says
   is on screen whenever its row is. Those strips are read from the page once
   per build (the stage is drawn at the host's own size, 1:1); the hovered
   row's thumbnail cuts into the strips beside it, so nothing is placed there.
   The rest of the field is quiet texture: dots, a map, an orbit. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  // the stage is the host's own size, so a stage px is a page px
  function shaped() {
    var layouts = {};
    return {
      layouts: layouts,
      pick: function (w, h) {
        var k = Math.round(w) + 'x' + Math.round(h);
        if (!layouts[k]) layouts[k] = { w: Math.round(w), h: Math.round(h) };
        return k;
      }
    };
  }
  /* The section, measured: its five hairlines, the four rows (top, bottom) and
     each row's hover thumbnail. Read once per build; layout is not read again. */
  function geo(stage, L) {
    var host = stage.parentNode, sec = host && host.closest ? host.closest('.cn-service') : null;
    var G = { w: L.w, h: L.h, wide: L.w >= 992, lines: [], rows: [], cl: 40, cr: L.w - 40 };
    var it = sec ? sec.querySelectorAll('.cn-service-content-item') : [], hl = sec ? sec.querySelectorAll('.cn-dividing-line') : [];
    if (it.length === 4 && hl.length === 5) {
      var hr = host.getBoundingClientRect(), k = L.w / (hr.width || L.w);
      for (var i = 0; i < 5; i++) {
        var r = hl[i].getBoundingClientRect();
        G.lines.push((r.top - hr.top) * k);
        if (!i) { G.cl = (r.left - hr.left) * k; G.cr = (r.right - hr.left) * k; }
      }
      for (var j = 0; j < 4; j++) {
        var b = it[j].getBoundingClientRect(), im = it[j].querySelector('.cn-service-image-item'), x = (b.left - hr.left) * k, y = (b.top - hr.top) * k;
        var row = { t: y, b: (b.bottom - hr.top) * k, th: null };
        if (im && im.offsetWidth > 8) row.th = { l: x + im.offsetLeft, r: x + im.offsetLeft + im.offsetWidth, t: y + im.offsetTop, b: y + im.offsetTop + im.offsetHeight };
        G.rows.push(row);
      }
    } else {
      // not inside the section (never on the page): five even bands
      var bh = (L.h - 128) / 4;
      for (var n = 0; n < 5; n++) G.lines.push(64 + n * bh);
      for (var m = 0; m < 4; m++) G.rows.push({ t: G.lines[m] + 64, b: G.lines[m + 1] - 64, th: null });
    }
    return G;
  }
  /* the free strip on one side of hairline j: 'u' between row j-1 and the line, 'd' between the line and row j */
  function strip(G, j, side) {
    var y = G.lines[j], pad = G.wide ? 8 : 10, gap = G.wide ? 12 : 9, t, b;
    if (side === 'u') { t = j > 0 ? G.rows[j - 1].b + pad : y - 44; b = y - gap; } else { t = y + gap; b = j < 4 ? G.rows[j].t - pad : y + 44; }
    return { t: t, b: b, y: (t + b) / 2 };
  }
  function base(stage, L, name) {
    var G = geo(stage, L);
    stage.className = 'sg-mo-stage sgg sgg-' + name + (G.wide ? ' is-wide' : ' is-narrow');
    G.svg = sv('svg', { class: 'sgg-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
    return G;
  }
  // the honesty tag, beside what it labels; a: 'l' its left edge at x, 'r' its right edge
  function tag(stage, x, y, a, short) {
    var t = el('span', 'sg-tag sgg-tag', stage, short ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
    t.style.left = Math.round(x) + 'px'; t.style.top = Math.round(y) + 'px';
    t.style.transform = a === 'r' ? 'translate(-100%, -50%)' : 'translateY(-50%)';
    return t;
  }
  // a box in a strip, centred on y; x is its left edge ('l'), right edge ('r') or centre ('c')
  function box(stage, cls, x, y, w, a) {
    var c = el('div', 'sgg-card ' + (cls || ''), stage);
    c.style.left = Math.round(a === 'r' ? x - w : a === 'c' ? x - w / 2 : x) + 'px'; c.style.top = Math.round(y) + 'px'; c.style.width = Math.round(w) + 'px';
    c.l = Math.round(a === 'r' ? x - w : a === 'c' ? x - w / 2 : x); c.r = c.l + Math.round(w);
    css(c, 'opacity', '0');
    return c;
  }
  function appear(c, p, o) {
    css(c, 'opacity', (p * (o == null ? 1 : o)).toFixed(3));
    css(c, 'transform', p >= 1 ? 'translateY(-50%)' : 'translateY(calc(-50% + ' + (6 * (1 - p)).toFixed(1) + 'px))');
  }
  // two lines: a key and a value, then a quieter line
  function two(c, k, v, s) {
    var a = el('div', 'sgg-l1', c);
    if (k) el('span', 'sgg-k', a, k);
    el('b', 'sgg-v', a, v);
    return el('div', 'sgg-l2', c, s);
  }
  function path(svg, d, cls) { return sv('path', { d: d, class: cls || 'sgg-link', pathLength: 100, 'stroke-dasharray': '100 100', 'stroke-dashoffset': 100, opacity: 0 }, svg); }
  function link(svg, a, b, bend, cls) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    return path(svg, 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + (mx - dy * bend).toFixed(1) + ' ' + (my + dx * bend).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), cls);
  }
  function draw(p, d, o) {
    put(p, 'stroke-dashoffset', (100 - 100 * d).toFixed(1));
    put(p, 'opacity', d > 0 ? (o == null ? 1 : o).toFixed(2) : '0');
  }
  function node(svg, x, y, cls) {
    var g = sv('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')' }, svg);
    return { g: g, rip: sv('circle', { r: 6, class: 'sgg-rip', opacity: 0 }, g), dot: sv('circle', { r: 3.5, class: cls || 'sgg-dot' }, g) };
  }
  function ripple(n, p) {
    put(n.rip, 'opacity', p > 0 && p < 1 ? (0.8 * (1 - p)).toFixed(2) : '0');
    if (p > 0 && p < 1) put(n.rip, 'transform', 'scale(' + (1 + 3 * ease.out(p)).toFixed(3) + ')');
  }
  function pill(parent, text, cls) { return el('span', 'sgg-pill' + (cls ? ' ' + cls : ''), parent, text); }
  function avatar(c, s) { el('span', 'sgg-av', c, s); }
  // the end of every loop: what was assembled fades, the frame stays
  function outOf(u, P) { return 1 - seg(u, P - 1.5, P - 0.7); }

  /* =====================================================================
     DOSSIER — 企业研究: the company under the hovered row's thumbnail, its
     facts landing around it three at a time, each with its source and date
     ===================================================================== */
  function Dossier() {
    var P = 18, D = 1.8, R, S = shaped();
    var F = [
      [T('官网', 'Website'), T('产品页 12 个 · 德英双语', '12 product pages · DE / EN'), T('来源：官网 · 10-21 更新', 'Source: website · 10-21')],
      [T('主营产品', 'Products'), T('储能系统集成 · 48V 机架式', '48V rack storage'), T('来源：产品目录 · 10-18 更新', 'Source: catalogue · 10-18')],
      [T('认证', 'Certified'), 'CE · UN38.3 · IEC 62619', T('来源：官网下载区 · 10-21 更新', 'Source: downloads · 10-21')],
      [T('市场与渠道', 'Markets'), T('德国 · 奥地利 · 经销与集成', 'DE · AT · dealers'), T('来源：新闻稿 · 10-19 更新', 'Source: press release · 10-19')],
      [T('规模', 'Size'), T('员工约 120 人', 'About 120 staff'), T('仅一个来源 · 待核实', 'One source only · to verify'), true],
      [T('新闻', 'News'), T('近 90 天 3 条储能招标', '3 storage tenders in 90 days'), T('来源：公开招标 · 10-20 更新', 'Source: public tenders · 10-20')]
    ];
    var SHORT = [T('官网', 'Website'), T('主营产品', 'Products'), T('认证', 'Certified'), T('市场渠道', 'Markets'), T('规模', 'Size'), T('新闻', 'News')];
    function build(stage, L) {
      var G = base(stage, L, 'dossier'), svg = G.svg, wide = G.wide, th = G.rows[0].th;
      var nb = strip(G, 1, 'u'), fb = strip(G, 1, 'd'), slots = [], pw, px, c;
      R = { f: [], dots: [] };
      if (wide && th) {
        // the company sits under row 1's thumbnail, across the hairline from it; facts flank both
        var tc = (th.l + th.r) / 2, fw = 280;
        pw = 340; px = clamp(tc - pw / 2, G.cl, G.cr - pw);
        if (th.l - 24 - G.cl >= 240) slots.push({ x: th.l - 24, y: nb.y, a: 'r', w: Math.min(fw, th.l - 24 - G.cl), to: [px + 30, fb.t] });
        slots.push({ x: th.r + 24, y: nb.y, a: 'l', w: Math.min(fw, G.cr - th.r - 24), to: [px + pw - 30, fb.t] });
        if (G.cr - px - pw - 20 >= 240) slots.push({ x: px + pw + 20, y: fb.y, a: 'l', w: Math.min(fw, G.cr - px - pw - 20), to: [px + pw, fb.y] });
        if (px - 20 - G.cl >= 240) slots.push({ x: px - 20, y: fb.y, a: 'r', w: Math.min(fw, px - 20 - G.cl), to: [px, fb.y] });
        tag(stage, G.cr, strip(G, 0, 'd').y, 'r');
        c = R.core = box(stage, 'sgg-core is-2', px, fb.y, pw, 'l');
      } else {
        // phones and tablets: the whole section's background; the facts as chips above the hairline under
        // row 1, the company and the tag below it
        var n = 3, cw = Math.min(118, (G.cr - G.cl - 16) / 3), step = (G.cr - G.cl - cw) / (n - 1);
        pw = Math.min(G.w >= 600 ? 440 : 236, G.cr - G.cl - 84); px = G.cl;
        for (var s = 0; s < n; s++) slots.push({ x: G.cl + s * step, y: nb.y, a: 'l', w: cw, to: [px + 16 + s * (pw - 32) / 2, fb.t] });
        tag(stage, G.cr, fb.y, 'r', true);
        c = R.core = box(stage, 'sgg-core is-1', px, fb.y, pw, 'l');
      }
      avatar(c, 'NE');
      var nm = el('div', 'sgg-nm', c);
      el('b', '', nm, 'Nordwerk Energie GmbH');
      R.status = wide || G.w >= 600 ? el('span', 'sgg-st', nm) : null;
      if (wide) { var dl = el('span', 'sgg-dots', c); F.forEach(function (f) { R.dots.push(el('i', f[3] ? 'is-ask' : '', dl)); }); }
      appear(c, 1);
      F.forEach(function (f, i) {
        var sl = slots[i % slots.length], o = { at: 0.6 + i * D, keep: i >= 3 };
        // a link leaves a fact from its edge nearest the company
        var from = !wide ? [sl.x + sl.w / 2, nb.b] : sl.y === nb.y ? [sl.a === 'r' ? sl.x - 26 : sl.x + 26, nb.b] : [sl.x, fb.y];
        o.line = link(svg, from, sl.to, wide ? 0.12 : 0.08);
        if (wide) {
          o.card = box(stage, 'is-2' + (f[3] ? ' is-ask' : ''), sl.x, sl.y, sl.w, sl.a);
          two(o.card, f[0], f[1], f[2]);
        } else {
          o.card = box(stage, 'sgg-chip is-1' + (f[3] ? ' is-ask' : ''), sl.x, sl.y, sl.w, sl.a);
          el('b', '', o.card, SHORT[i]);
          el('span', '', o.card, f[3] ? T('待核实', 'verify') : '✓');
        }
        R.f.push(o);
      });
      // orbits around the company: their own small layers, turned by a transform
      var ox = px + pw / 2, oy = fb.y;
      R.orbit = (wide ? [150, 250] : [90, 150]).map(function (r, i) {
        var s = sv('svg', { class: 'sgg-orbit-l', width: 2 * r + 4, height: 2 * r + 4, viewBox: '0 0 ' + (2 * r + 4) + ' ' + (2 * r + 4) }, null);
        stage.insertBefore(s, G.svg.nextSibling);
        s.style.left = (ox - r - 2).toFixed(1) + 'px'; s.style.top = (oy - r - 2).toFixed(1) + 'px';
        sv('circle', { cx: r + 2, cy: r + 2, r: r, class: 'sgg-orbit' + (i ? ' is-b' : '') }, s);
        return { s: s, dir: i ? -1 : 1 };
      });
      stage.appendChild(c);
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P), n = 0;
      R.orbit.forEach(function (o) { css(o.s, 'transform', 'rotate(' + mod(t * 4 * o.dir, 360).toFixed(2) + 'deg)'); });
      R.f.forEach(function (o, i) {
        var gone = o.keep ? out : 1 - seg(u, o.at + 5.2, o.at + 5.6);
        draw(o.line, ease.io(seg(u, o.at, o.at + 0.6)) * (o.keep ? 1 : 1 - seg(u, o.at + 3.2, o.at + 3.8)), 0.9 * (o.keep ? out : 1));
        var p = ease.out(seg(u, o.at + 0.4, o.at + 1));
        appear(o.card, p, gone);
        var land = u >= o.at + 0.9 && out > 0.5;
        if (land) n++;
        if (R.dots[i]) cl(R.dots[i], 'is-on', land);
      });
      if (R.status) {
        textSwap(R.status, n < 6 ? T('正在汇总来源 ' + n + '/6', 'Gathering sources ' + n + '/6') : T('5 项已核对 · 1 项待核实', '5 checked · 1 to verify'));
        cl(R.status, 'is-done', n === 6);
      }
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 11.8, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* =====================================================================
     RHYTHM — 补货判断: the hairline above row 3 is the time axis; PT Surya's
     orders stand on it ~60 days apart, the days since the last one count up
     to the restock window above the thumbnail, the judgement waits below
     ===================================================================== */
  function Rhythm() {
    var P = 16, R, S = shaped();
    // day of the year 2026: four orders 59-60 days apart; "today" is 21 Oct, 60 days after the last
    var ORD = [[55, 120, T('2月24日', 'Feb 24')], [115, 150, T('4月25日', 'Apr 25')], [174, 140, T('6月23日', 'Jun 23')], [234, 160, T('8月22日', 'Aug 22')]], TODAY = 294;
    function build(stage, L) {
      var G = base(stage, L, 'rhythm'), svg = G.svg, th = G.rows[2].th;
      var ay = G.lines[2], tc = th ? (th.l + th.r) / 2 : G.cl + (G.cr - G.cl) * 0.6, x0 = G.cl + 64;
      var kx = (tc - x0) / (TODAY - ORD[0][0]), roomy = 60 * kx >= 150, bh = 26, by = ay - 37;
      function X(d) { return tc - (TODAY - d) * kx; }
      R = { X: X, bars: [], spans: [] };
      ORD.forEach(function (o, i) {
        var x = X(o[0]), h = bh * o[1] / 160;
        var g = sv('g', { class: 'sgg-bar', opacity: 0 }, svg);
        var r = sv('rect', { x: (x - 8).toFixed(1), y: (ay - 3 - h).toFixed(1), width: 16, height: h.toFixed(1), rx: 3 }, g);
        r.style.transformOrigin = x.toFixed(1) + 'px ' + (ay - 3) + 'px';
        var dt = sv('text', { x: x.toFixed(1), y: ay + 18, 'text-anchor': 'middle', class: 'sgg-bar-d' }, g);
        dt.textContent = o[2] + (roomy ? ' · ' + o[1] + T(' 套', ' packs') : '');
        R.bars.push({ g: g, r: r });
        if (i) R.spans.push(span(svg, X(ORD[i - 1][0]), x, by, T((o[0] - ORD[i - 1][0]) + ' 天', (o[0] - ORD[i - 1][0]) + ' days')));
      });
      // the restock window and the order that should come
      var hw = Math.max(9, 6 * kx);
      R.band = sv('rect', { x: (tc - hw).toFixed(1), y: by - 4, width: (2 * hw).toFixed(1), height: ay - by + 3, class: 'sgg-band', opacity: 0 }, svg);
      R.ghost = sv('rect', { x: (tc - 8).toFixed(1), y: (ay - 3 - bh * 150 / 160).toFixed(1), width: 16, height: (bh * 150 / 160).toFixed(1), rx: 3, class: 'sgg-ghost', opacity: 0 }, svg);
      // the interval still open: its bracket grows with the cursor
      var lx = X(ORD[3][0]) + 5;
      R.live = sv('path', { d: 'M' + lx.toFixed(1) + ' ' + (by + 6) + 'V' + by + 'H' + (tc - 5).toFixed(1), class: 'sgg-span-l is-live', pathLength: 100, 'stroke-dasharray': '100 100', 'stroke-dashoffset': 100 }, svg);
      R.liveT = sv('text', { x: X(264).toFixed(1), y: by - 7, 'text-anchor': 'middle', class: 'sgg-span-t is-live', opacity: 0 }, svg);
      R.liveT.textContent = T('60 天', '60 days');
      R.cur = sv('g', { class: 'sgg-cursor', opacity: 0 }, svg);
      sv('path', { d: 'M0 ' + (ay - 1) + 'V' + by + 'M0 ' + by + 'h-5v6', class: 'sgg-cursor-l' }, R.cur);
      sv('circle', { cx: 0, cy: ay, r: 4, class: 'sgg-cursor-d' }, R.cur);
      R.count = el('div', 'sgg-count', stage);
      R.count.style.top = (ay - 17) + 'px';
      R.countN = el('b', '', R.count); el('span', '', R.count, T('天未下单', 'days since the last order'));
      R.cdx = hw + 10;
      // the judgement, under the thumbnail across the hairline below row 3, and the draft beside it
      var fb = strip(G, 3, 'd'), cw = Math.min(440, G.cr - G.cl), gw = Math.min(T(196, 250), G.cr - G.cl);
      var cx = clamp(tc - cw / 2, G.cl, G.cr - cw - gw - 16);
      var c = R.card = box(stage, 'is-2 sgg-restock', cx, fb.y, cw, 'l');
      var l2 = two(c, null, 'PT Surya Energi', T('近 4 次下单，间隔 59–60 天 · 64V 104Ah', 'Last 4 orders 59–60 days apart · 64V 104Ah'));
      el('span', 'sgg-route', l2.previousSibling, T('印尼', 'Indonesia'));
      R.pill = pill(l2.previousSibling, T('补货周期到了', 'Restock due'), 'is-amber');
      var gd = R.draft = box(stage, 'is-1 sgg-draft', c.r + 16, fb.y, gw, 'l');
      el('span', '', gd, T('跟进草稿', 'Follow-up draft'));
      pill(gd, T('等你确认', 'Waits for your OK'), 'is-amber');
      R.arrow = link(svg, [c.r + 2, fb.y], [c.r + 14, fb.y], 0);
      tag(stage, G.cr, strip(G, 2, 'd').y, 'r');
    }
    function span(svg, a, b, y, label) {
      var g = sv('g', { class: 'sgg-span', opacity: 0 }, svg);
      sv('path', { d: 'M' + (a + 5).toFixed(1) + ' ' + (y + 6) + 'V' + y + 'H' + (b - 5).toFixed(1) + 'V' + (y + 6), class: 'sgg-span-l' }, g);
      var tx = sv('text', { x: ((a + b) / 2).toFixed(1), y: y - 7, 'text-anchor': 'middle', class: 'sgg-span-t' }, g);
      tx.textContent = label;
      return g;
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P), X = R.X;
      R.bars.forEach(function (b, i) {
        var p = ease.out(seg(u, 0.3 + i * 0.35, 0.9 + i * 0.35));
        css(b.r, 'transform', 'scaleY(' + p.toFixed(3) + ')');
        put(b.g, 'opacity', (p > 0 ? out : 0).toFixed(2));
      });
      R.spans.forEach(function (s, i) { put(s, 'opacity', (ease.out(seg(u, 1.2 + i * 0.35, 1.7 + i * 0.35)) * out).toFixed(2)); });
      var sweep = ease.io(seg(u, 2.6, 8.6)), day = Math.round(60 * sweep), x = X(ORD[3][0] + 60 * sweep);
      put(R.cur, 'transform', 'translate(' + x.toFixed(1) + ' 0)');
      put(R.cur, 'opacity', (seg(u, 2.2, 2.6) * out).toFixed(2));
      put(R.live, 'stroke-dashoffset', (100 - 100 * sweep).toFixed(1));
      put(R.live, 'opacity', (seg(u, 2.2, 2.6) * out).toFixed(2));
      put(R.countN, 'text', String(day));
      css(R.count, 'transform', 'translate(' + (x + 12 + (R.cdx - 12) * ease.io(seg(u, 7.6, 8.6))).toFixed(1) + 'px, -50%)');
      css(R.count, 'opacity', (seg(u, 2.2, 2.6) * out).toFixed(3));
      cl(R.count, 'is-due', day >= 55);
      put(R.liveT, 'opacity', (ease.out(seg(u, 8.6, 9.1)) * out).toFixed(2));
      put(R.band, 'opacity', (ease.out(seg(u, 7.6, 8.6)) * out).toFixed(2));
      put(R.ghost, 'opacity', (ease.out(seg(u, 8.4, 9.2)) * out).toFixed(2));
      appear(R.card, ease.out(seg(u, 8.9, 9.6)), out);
      draw(R.arrow, ease.io(seg(u, 9.7, 10)), out);
      appear(R.draft, ease.out(seg(u, 9.9, 10.5)), out);
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 12, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* =====================================================================
     COMMITTEE — 关键角色: Nordwerk's buying committee in the strips that frame
     row 4 — three who weigh in above the hairline, the one who decides below
     it beside the thumbnail, the hand-off under the row waiting for your OK
     ===================================================================== */
  function Committee() {
    var P = 16, R, S = shaped();
    var ROLE = [
      ['JW', T('采购经理', 'Purchasing manager'), 'J. Weber', T('发起需求', 'Raises the need'), T('依据：官网团队页', 'via team page')],
      ['LF', T('技术负责人', 'Head of engineering'), 'L. Fischer', T('评估规格', 'Checks the spec'), T('依据：展会演讲', 'via trade-fair talk')],
      ['MB', T('财务总监', 'Finance director'), 'M. Braun', T('批预算', 'Holds the budget'), T('依据：年报签字页', 'via annual report')],
      ['TK', T('总经理', 'Managing director'), 'T. Krüger', T('拍板', 'Decides'), T('依据：公司注册信息', 'via company register')]
    ];
    function build(stage, L) {
      var G = base(stage, L, 'committee'), svg = G.svg, th = G.rows[3].th;
      var fa = strip(G, 3, 'u'), na = strip(G, 3, 'd'), nb = strip(G, 4, 'u');
      var rw = Math.min(310, Math.floor((G.cr - G.cl - 32) / 3)), segR = th ? th.r + 16 : (G.cl + G.cr) / 2, dw = Math.min(320, G.cr - segR);
      R = { roles: [] };
      ROLE.forEach(function (r, i) {
        var dec = i === 3, o = { at: dec ? 3.4 : 0.6 + i * 0.8 };
        var c = o.card = dec ? box(stage, 'is-2 is-p sgg-role is-dec', G.cr, na.y, dw, 'r') : box(stage, 'is-2 is-p sgg-role', G.cl + i * (rw + 16), fa.y, rw, 'l');
        avatar(c, r[0]);
        var tx = el('div', 'sgg-p', c);
        var l1 = el('div', 'sgg-l1', tx); el('b', 'sgg-v', l1, r[1]); el('span', 'sgg-nm2', l1, r[2]);
        var l2 = el('div', 'sgg-l2', tx); el('span', dec ? 'sgg-verb is-amber' : 'sgg-verb', l2, r[3]); el('span', '', l2, ' · ' + r[4]);
        if (!dec) {
          // each who weighs in, to the one who decides: down to the hairline, along it, into his card
          var sx = c.l + rw / 2, ex = G.cr - dw + 30, ly = G.lines[3] + 4 + i * 3, c2 = sx < ex - 90 ? ex - 90 : ex;
          o.line = path(svg, 'M' + sx.toFixed(1) + ' ' + fa.b.toFixed(1) + 'C' + sx.toFixed(1) + ' ' + ly.toFixed(1) + ' ' + c2.toFixed(1) + ' ' + ly.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + na.t.toFixed(1), 'sgg-link is-flow');
        }
        R.roles.push(o);
      });
      R.dec = R.roles[3];
      // under the row: whose committee it is with the tag, and the hand-off that waits
      var cap = R.cap = el('div', 'sgg-cap', stage);
      cap.style.left = Math.round(G.cl) + 'px'; cap.style.top = Math.round(nb.y) + 'px';
      var ct = el('div', '', cap); el('b', '', ct, 'Nordwerk Energie GmbH'); el('span', '', ct, T(' · 采购决策链', ' · buying committee'));
      var tg = tag(cap, 0, 0, 'l'); tg.removeAttribute('style');
      var g = R.gate = box(stage, 'is-1 sgg-gate', G.cr, nb.y, Math.min(T(330, 380), G.cr - segR), 'r');
      el('span', '', g, T('关键人 4 位 · 确认后交给 Sales Desk', '4 key people · then Sales Desk'));
      pill(g, T('等你确认', 'Waits for your OK'), 'is-amber');
      css(cap, 'opacity', '0');
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P);
      R.roles.forEach(function (o, i) {
        appear(o.card, ease.out(seg(u, o.at, o.at + 0.6)), out);
        if (o.line) draw(o.line, ease.io(seg(u, 2.8 + i * 0.25, 3.8 + i * 0.25)), 0.85 * out);
      });
      cl(R.dec.card, 'is-on', u > 4.4 && out > 0.5);
      css(R.cap, 'opacity', (seg(u, 0.2, 0.7) * out).toFixed(3));
      appear(R.gate, ease.out(seg(u, 5.4, 6)), out);
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 10, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  // the kit the lanes scene (js/stargo-motion-lanes.js, loaded after this file) draws with
  K.growth = { clamp: clamp, shaped: shaped, strip: strip, base: base, tag: tag, box: box, appear: appear, two: two, path: path, draw: draw, node: node, ripple: ripple };
  return { dossier: Dossier, rhythm: Rhythm, committee: Committee };
});
