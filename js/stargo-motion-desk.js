/* DESK — the six windows around the brand film in the homepage theatre
   (「一个工作台，管好每天的生意。」), where photographs W01–W06 were.
   tools/code-art-theatre.mjs places the hosts, css/stargo-motion-desk.css
   styles them, js/stargo-motion.js runs them like its own scenes.

   One demo deal on one 20 s clock, clockwise round the film:
      0.3  Growth OS    (top left)     Nordwerk Energie rises to 94 on the shortlist
      2.8  Sales Desk   (top right)    Müller's inquiry → 48V 100Ah · 200 组 · DAP 汉堡 → Q-1042 drafted
      6.1  报价审批      (middle right) under the floor → 等你审批 → a person taps 批准, then 发送
      9.8  Sales Desk   again          已报价 → PI · 待定金 → 已成交 (deposit in)
     11.3  ERP          (bottom right) SO-2041: 备货 → 质检 → 装柜
     14.1  AI 创作       (bottom left)  three images for the German store wait for review
     16.7  经营驾驶舱    (middle left)  the day in counts: you approved, you sent, nothing auto-sent
   A window never goes blank: it keeps its frame and swaps only the record it
   shows. The Müller windows go back to their empty states one at a time
   (ERP 18.0, quote 18.6, Sales 19.0) before the deal starts again, so no
   window shows a step of the deal the others have not reached.

   The template crops the ring: the outer ~8% of every cell is off screen on
   desktop, the top row is seen mostly in its lower half and the bottom row in
   its upper half (the next section's curve covers the rest). So each window
   has an app rail on its outer side as wide as that crop, the top row keeps
   its name, state and honesty tag in a status bar at the bottom, the bottom
   row keeps them in its title bar, and content sits on the side that shows.

   One clock: the runner gives every host its own time, so the windows share a
   module clock. Whichever window ticks twice before the others have ticked
   once has started a new frame and advances it. The film's button
   (.stargo-media-toggle) holds it too: a reader who pauses the film pauses the
   theatre. Blinks are drawn here (opacity), so they stop with the windows.
   Reduced motion draws every window at STILL, where all six agree. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;
  var P = 20, STILL = 17.6;
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var serial = 0;

  /* ---------- the shared clock ---------- */
  var CLK = { t: 0, f: 0, held: false };
  var film = document.querySelector('.stargo-media-toggle');
  // the reader's own choice, read before the film's handler flips the button
  if (film) film.addEventListener('click', function () { if (!film.disabled) CLK.held = film.getAttribute('aria-pressed') === 'true'; }, true);
  if (window.__SGD_DEBUG) { window.__sgdT = function () { return CLK.t; }; window.__sgdSet = function (t) { CLK.t = t; }; }   // visual checks only
  function advance(me, t) {
    var dt = me.lt === undefined ? 0 : t - me.lt;
    me.lt = t;
    if (!(dt > 0 && dt < 0.25)) dt = 0;
    if (me.f === CLK.f) { CLK.f++; if (!CLK.held) CLK.t += dt; }
    me.f = CLK.f;
  }
  function blink(now, per) { return 0.5 + 0.5 * Math.cos(6.2832 * now / per); }

  /* ---------- kit ---------- */
  var G = {
    growth: 'M12 4.5a7.5 7.5 0 1 0 7.5 7.5M12 8.6a3.4 3.4 0 1 0 3.4 3.4M12 12l5.8-5.8',
    sales: 'M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-7l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5zM8 10h8M8 12.8h5',
    quote: 'M7 3.5h7l4 4v13H6v-17zM14 3.5V8h4M9 14.2l2 2 4-4.2',
    erp: 'M12 3.5l7.5 4v9L12 20.5l-7.5-4v-9zM4.5 7.5l7.5 4 7.5-4M12 11.5v9',
    creative: 'M4.5 5.5h15v13h-15zM4.5 15.5l4.5-4.5 4 4 2.5-2.5 4 4M15 9.5h.01',
    cockpit: 'M4.5 15.5a7.5 7.5 0 1 1 15 0M12 15.5l3.6-4.4M8 19h8',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    spark: K.ICON.spark,
    lock: 'M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M5.5 10.5h13v10h-13zM12 14.3v2.6',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5'
  };
  var ORDER = ['growth', 'sales', 'quote', 'erp', 'creative', 'cockpit'];
  function ico(name, parent, size) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: 'sg-ico' }, parent);
    sv('path', { d: G[name], stroke: 'currentColor', 'stroke-width': name === 'check' ? 2.6 : 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function div(cls, parent, text) { return el('div', cls, parent, text); }
  function span(cls, parent, text) { return el('span', cls, parent, text); }
  function inOut(u, a, b, d) { return ease.out(seg(u, a, a + d)) * (1 - seg(u, b, b + d)); }
  function show(e, o, dy) {
    css(e, 'opacity', o.toFixed(3));
    if (dy) css(e, 'transform', o >= 0.999 ? 'none' : 'translateY(' + ((1 - o) * dy).toFixed(2) + 'px)');
  }
  // as x goes 0 → 1, a leaves first and b arrives after it (and back the same way): never two layers at once
  function swap(a, b, x) { show(a, 1 - ease.out(seg(x, 0, 0.45)), 0); show(b, ease.out(seg(x, 0.55, 1)), 6); }
  function pill(R, text, tone) { if (!R.pill) return; put(R.ptx, 'text', text); put(R.pill, 'cls', R.pcls + tone); R.tone = tone; }
  function stack(cls, parent) { return div('sgd-stack' + (cls ? ' ' + cls : ''), parent); }

  /* ---------- the window every tile is drawn in ---------- */
  function shell(stage, app, L) {
    var kind = L.kind, W = L.w, H = L.h, rw = L.rail, row = app.pos.charAt(0), side = app.pos.charAt(1);
    var small = kind === 'tall' || kind === 'slim', low = H < 260, phone = small && !rw;
    var bar = small ? 30 : low ? 34 : 38, foot = row === 'b' ? 0 : small || low ? 22 : 24, pad = small ? 8 : low ? 9 : 12;
    var cw = W - rw, full = !small;   // content width; full-size pictures carry the full tag
    stage.className = 'sg-mo-stage sgd sgd-' + app.key + ' is-' + kind + ' at-' + row + (low ? ' is-low' : '') + (phone ? ' is-phone' : '');
    var st = stage.style;
    st.setProperty('--bar', bar + 'px'); st.setProperty('--foot', foot + 'px'); st.setProperty('--pad', pad + 'px');
    st.setProperty('--l', (side === 'l' ? rw : 0) + 'px'); st.setProperty('--r', (side === 'r' ? rw : 0) + 'px');
    var R = { kind: kind, W: cw, H: H, row: row, small: small, low: low, phone: phone };
    if (rw) {   // the desktop's app rail, in the band the template keeps off screen
      var rl = div('sgd-rail is-' + side, stage);
      for (var i = 0; i < 6; i++) ico(ORDER[i], span('sgd-ri' + (ORDER[i] === app.key ? ' is-me' : ''), rl), 13);
    }
    var tag = full ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data');
    var b = div('sgd-bar', stage);
    if (kind === 'land' || kind === 'mid') { var d = span('sgd-dots', b); el('i', '', d); el('i', '', d); el('i', '', d); }
    ico(app.key, span('sgd-mark', b), small ? 12 : 13);
    el('b', 'sgd-name', b, small || kind === 'sq' || cw < 360 ? app.short || app.name : app.name);
    if ((kind === 'land' || kind === 'mid') && cw >= (row === 'b' ? 600 : K.ZH ? 420 : 470) && app.crumb) span('sgd-crumb', b, app.crumb);
    function mkPill(parent, cls) {
      R.pill = span('', parent); R.pcls = 'sgd-pill ' + cls + 'is-';
      R.pdot = el('i', '', R.pill); R.ptx = span('', R.pill);
    }
    if (row === 'm' && !small) mkPill(b, '');
    if (row === 'b') { if (kind === 'land') mkPill(b, 'in-bar '); span('sgd-tag', b, tag); }
    R.body = div('sgd-body', stage);
    if (foot) {
      var f = div('sgd-foot', stage);
      if (row === 't') {   // a status bar: whose window, what it is doing, what it is
        f.className = 'sgd-foot is-status';
        if (!small && cw >= (K.ZH ? 0 : 300)) { var id = span('sgd-fid', f); ico(app.key, span('sgd-fmark', id), 10); el('b', '', id, app.short || app.name); }
        if (kind !== 'sq') mkPill(f, 'in-foot ');
      } else if (!small && cw >= (K.ZH ? 330 : 440)) span('sgd-note', f, app.note);
      span('sgd-tag', f, tag);
    }
    R.glow = el('i', 'sgd-glow', stage);
    return R;
  }

  /* ---------- the deal ---------- */
  var NORDWERK = 'Nordwerk Energie GmbH', MULLER = 'Müller Energie GmbH';
  var SPEC = T('48V 100Ah × 200 组', '48V 100Ah × 200'), DAP = T('DAP 汉堡', 'DAP Hamburg');

  /* =================== Growth OS: the shortlist (top left) =================== */
  function placeRow(o, st, slot, op, dx) {
    css(o.r, 'transform', 'translate(' + dx.toFixed(1) + 'px,' + (slot * st).toFixed(1) + 'px)');
    css(o.r, 'opacity', op.toFixed(3));
  }
  var GROWTH = {
    key: 'growth', name: 'Growth OS', pos: 'tl', B: 0.3, D: 3.6, crumb: T('德国 · 储能经销商', 'Germany · storage dealers'),
    rows: [
      ['DE', NORDWERK, 'Nordwerk Energie', T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), T('汉堡', 'Hamburg'), 94],
      ['US', 'Gulf Coast Lift Supply', 'Gulf Coast Lift', T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), T('休斯敦', 'Houston'), 91],
      ['ZA', 'Table Bay Power (Pty) Ltd', 'Table Bay Power', T('家用备电 · 开普敦', 'Home backup · Cape Town'), T('开普敦', 'Cape Town'), 88],
      ['SA', 'Najd Energy Co.', 'Najd Energy', T('通信备电 · 利雅得', 'Telecom backup · Riyadh'), T('利雅得', 'Riyadh'), 84]
    ],
    why: T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配。', 'Three storage tenders in 90 days; the range fits 48V 100Ah.'),
    whyMore: T('建议优先联系采购经理。', ' Contact the purchasing manager first.'),
    build: function (R) {
      var k = R.kind, small = R.small, land = k === 'land';
      var col = div('sgd-g-col', R.body), head = div('sgd-head', col);
      el('b', '', head, T('候选客户', 'Prospects'));
      span('', head, T('按匹配度', 'By match'));
      var gap = small ? 5 : 6, rowH = small ? (R.low ? 42 : 46) : R.low ? 38 : k === 'sq' ? 42 : R.H > 300 ? 50 : 46;
      R.step = rowH + gap;
      var list = div('sgd-g-list', col);
      list.style.height = (3 * rowH + 2 * gap) + 'px';
      R.rows = [];
      for (var i = 0; i < 4; i++) {
        var d = this.rows[i], r = div('sgd-g-row' + (i === 0 ? ' is-new' : ''), list), m = div('sgd-g-main', r), v, fill = null;
        r.style.height = rowH + 'px';
        if (small) {   // a phone row: the name on its own line, the score under it
          el('b', '', m, d[2]);
          var l2 = div('sgd-g-l2', m);
          span('', l2, d[0] + ' · ' + d[4]);
          v = el('b', '', l2, String(d[5]));
        } else {
          r.insertBefore(span('sgd-cc', null, d[0]), m);
          var nar = k === 'sq' && R.W < 320;   // a narrow tablet cell: the short name, the trade without the city
          el('b', '', m, nar ? d[2] : d[1]); span('', m, nar ? d[3].split(' · ')[0] : d[3]);
          var s = div('sgd-g-score', r);
          v = el('b', '', s, String(d[5]));
          fill = el('i', '', el('i', '', s));
          fill.style.transform = 'scaleX(' + d[5] / 100 + ')';
        }
        R.rows.push({ r: r, v: v, fill: fill });
      }
      if (land || k === 'sq') {
        var ai = R.ai = div('sgd-g-ai', land ? R.body : col);
        var ah = div('sgd-g-aih', ai); ico('spark', ah, 13); span('', ah, T('AI 判断', 'AI reasoning'));
        if (land) R.who = el('b', 'sgd-g-who', ai, '');
        var tx = div('sgd-g-why', ai);
        R.typed = span('', tx); R.caret = el('i', 'sgd-caret', tx); R.rest = span('sgd-rest', tx);
        R.skel = div('sgd-skel', tx); el('i', '', R.skel); el('i', '', R.skel); el('i', '', R.skel);
        var text = land && !R.low ? this.why + this.whyMore : this.why;
        R.chars = Array.from(text); R.n = -1;
        R.whyDur = R.chars.length / (K.ZH ? 16 : 38);   // seconds to type it
        if (land && !R.low) { R.gnext = div('sgd-g-next', ai); ico('arrow', R.gnext, 13); span('', R.gnext, T('加入跟进名单 · 待你确认', 'Add to follow-up · you confirm')); }
      }
    },
    draw: function (R, u, now) {
      var nIn = ease.out(seg(u, 0.35, 0.8)), drop = ease.out(seg(u, 0.3, 0.7)), cnt = ease.out(seg(u, 0.8, 1.6));
      var s1 = ease.io(seg(u, 1.3, 1.6)), s2 = ease.io(seg(u, 1.6, 1.95));
      var Q = P - 0.8, r1 = seg(u, Q, Q + 0.4), r2 = ease.io(seg(u, Q, P - 0.1));   // the list settles back for the next turn
      var st = R.step, rows = R.rows;
      placeRow(rows[0], st, 2 - s1 - s2, nIn * (1 - r1), (1 - nIn) * 10);
      placeRow(rows[1], st, s2 - r2, 1, 0);
      placeRow(rows[2], st, 1 + s1 - r2, 1, 0);
      placeRow(rows[3], st, 2, Math.max(1 - drop, r2), drop * (1 - r2) * 18);
      put(rows[0].v, 'text', String(Math.round(94 * cnt)));
      if (rows[0].fill) css(rows[0].fill, 'transform', 'scaleX(' + (0.94 * cnt).toFixed(3) + ')');
      cl(rows[0].r, 'is-top', u >= 1.95 && u < Q);
      var found = u >= 2 && u < Q;
      if (!found) pill(R, R.small ? T('扫描中', 'Scanning') : T('AI 扫描中', 'AI scanning'), 'live');
      else pill(R, R.small ? T('新增 · 94', 'New · 94') : T('新增候选 · 94', 'New match · 94'), 'warm');
      if (R.ai) {
        var td = R.whyDur, n = Math.round(R.chars.length * seg(u, 2.1, 2.1 + td));
        if (n !== R.n) { R.n = n; put(R.typed, 'text', R.chars.slice(0, n).join('')); put(R.rest, 'text', R.chars.slice(n).join('')); }
        css(R.typed, 'opacity', (1 - seg(u, Q, Q + 0.3)).toFixed(3));
        css(R.caret, 'opacity', u >= 2 && u < 2.3 + td && blink(now, 1) > 0.5 ? '1' : '0');
        show(R.skel, Math.max(1 - seg(u, 1.95, 2.15), seg(u, Q + 0.3, Q + 0.6)), 0);
        if (R.who) { put(R.who, 'text', found ? NORDWERK : T('比对采购信号…', 'Checking buying signals…')); cl(R.who, 'is-wait', !found); }
        if (R.gnext) show(R.gnext, ease.out(seg(u, 2.3 + td, 2.7 + td)) * (1 - seg(u, Q, Q + 0.3)), 5);
      }
    }
  };

  /* =================== Sales Desk: the inquiry, then the deal (top right) =================== */
  var SALES = {
    key: 'sales', name: 'Sales Desk', pos: 'tr', B: 2.8, D: 3.4, D2: [6.9, 8.6], crumb: T('询盘', 'Inquiry'), RS: 16.2,
    stages: [T('新询盘', 'New'), T('需求确认', 'Qualifying'), T('待报价', 'To quote'), T('报价中', 'Quoting'), T('已报价·谈判', 'Negotiating'), T('PI·待定金', 'PI · deposit'), T('已成交', 'Won')],
    stagesS: [T('新询盘', 'New'), T('需求确认', 'Qualify'), T('待报价', 'To quote'), T('报价中', 'Quoting'), T('已报价·谈判', 'Talks'), T('PI·待定金', 'Deposit'), T('已成交', 'Won')],   // the pill beside the tag in a phone's status bar
    SI: [2.0, 2.6, 3.0, 7.0, 7.6, 8.2],   // when the case moves on a stage
    H: [0.8, 1.2, 1.6],                   // when each of the three facts is underlined
    msg: ['200 pcs', ' ', '48V 100Ah', ', ', 'DAP Hamburg', '?'],
    chips: [[T('型号', 'Model'), '48V 100Ah', 2], [T('数量', 'Qty'), T('200 组', '200 pcs'), 0], [T('贸易术语', 'Incoterm'), DAP, 4]],
    next: [   // u, what the case line says, and the same in a narrow window
      [3.0, T('报价 Q-1042 已起草，送去审批', 'Quote Q-1042 drafted, sent for approval'), T('Q-1042 送去审批', 'Q-1042 sent for approval')],
      [6.95, T('Q-1042 已由你发送', 'Q-1042 sent by you'), T('Q-1042 已由你发送', 'Q-1042 sent by you')],
      [7.6, T('PI 已发出 · 等定金', 'PI sent · awaiting deposit'), T('PI 已发出 · 等定金', 'PI sent · awaiting deposit')],
      [8.2, T('定金已到账 · 转 ERP 订单', 'Deposit in · order goes to ERP'), T('定金已到账 · 转 ERP', 'Deposit in · to ERP')]],
    build: function (R) {
      var land = R.kind === 'land', phone = R.small;
      if (land && R.H >= 280) {   // an earlier thread, above the one that matters
        var ea = div('sgd-s-earlier', R.body);
        span('sgd-av is-dim', ea, 'AA');
        var et = div('sgd-s-mt', ea); el('b', '', et, 'Ahmed Al-Rashid'); span('', et, T('阿联酋 · WhatsApp · 72V 锂电池包 50 组', 'UAE · WhatsApp · 72V lithium pack, 50 units'));
        span('sgd-s-er', ea, T('已回复', 'Replied'));
      }
      var g = div('sgd-s-grid', R.body);
      var mail = stack('sgd-s-mail', g);
      var m0 = R.m0 = div('sgd-s-m', mail);
      if (!phone) span('sgd-av is-empty', m0);
      var t0 = div('sgd-s-mt', m0); el('b', '', t0, T('收件箱', 'Inbox')); span('', t0, T('等待新询盘…', 'Waiting for inquiries…'));
      var m1 = R.m1 = div('sgd-s-m', mail);
      if (!phone) span('sgd-av', m1, 'MÜ');
      var t1 = div('sgd-s-mt', m1), who = div('sgd-s-who', t1);
      el('b', '', who, phone ? 'Müller' : MULLER);
      if (!phone && !R.low && R.W >= 420) span('', who, T('德国 · 邮件 · 刚刚', 'Germany · email'));
      var bub = div('sgd-s-msg', t1);
      R.hl = [];
      for (var j = 0; j < 6; j++) R.hl.push(span(j % 2 === 0 && j < 5 ? 'sgd-hl' : '', bub, this.msg[j]));
      var chips = div('sgd-s-chips', g);
      R.chips = [];
      for (var c = 0; c < 3; c++) {
        var e = span('sgd-chip is-empty', chips), box = phone ? stack('', e) : e;
        R.chips.push({ e: e, k: span('sgd-chip-k', box, this.chips[c][0]), v: el('b', '', box, this.chips[c][1]) });
      }
      if (land) {   // the reply AI drafts, waiting for a person
        var dr = div('sgd-s-draft', g), dh = div('sgd-s-dh', dr);
        ico('spark', dh, 12); span('', dh, T('AI 回复草稿', 'AI reply draft'));
        R.dw = span('sgd-s-dw', dh, T('待你确认', 'You confirm'));
        var db = stack('sgd-s-db', dr);
        R.db0 = span('sgd-dim', db, T('读完询盘再起草，发送前由你确认', 'Drafted once the inquiry is read; you confirm'));
        R.db1 = span('', db, 'Hello, please find quote Q-1042 (DAP Hamburg) attached.');
      }
      if (!phone) { R.next = div('sgd-s-next', g); ico('arrow', R.next, 13); R.nx = span('', R.next, ''); }
      var stp = div('sgd-s-steps' + (land ? '' : ' is-compact'), g);
      R.fill = el('i', '', div('sgd-s-track', stp));
      var dots = div('sgd-s-dots', stp);
      R.nodes = [];
      for (var i = 0; i < 7; i++) { var n = div('sgd-s-node', dots); el('i', '', n); if (land) span('', n, this.stages[i]); R.nodes.push(n); }
      if (R.kind === 'sq') R.stName = span('sgd-s-name', stp, '');
    },
    draw: function (R, u) {
      var RS = this.RS, on = u < RS, x = seg(u, 0, 0.5) * (1 - seg(u, RS, RS + 0.5));
      swap(R.m0, R.m1, x);
      for (var j = 0; j < 3; j++) {
        var d = this.chips[j], h = this.H[j], c = R.chips[j];
        cl(R.hl[d[2]], 'is-on', u >= h && on);
        var cx = ease.out(seg(u, h + 0.15, h + 0.5)) * (1 - seg(u, RS, RS + 0.3));
        if (R.small) swap(c.k, c.v, cx); else show(c.v, cx, 0);
        cl(c.e, 'is-empty', cx < 0.5);
      }
      var si = 0, SI = this.SI;
      for (var q = 0; q < 6; q++) si += ease.io(seg(u, SI[q], SI[q] + 0.3));
      si *= 1 - ease.io(seg(u, RS, RS + 0.6));
      css(R.fill, 'transform', 'scaleX(' + (si / 6).toFixed(4) + ')');
      var cur = Math.round(si), live = x >= 0.5;
      for (var i = 0; i < 7; i++) put(R.nodes[i], 'cls', 'sgd-s-node' + (!live ? '' : i < cur || cur === 6 ? ' is-done' : i === cur ? ' is-cur' : ''));
      if (R.stName) put(R.stName, 'text', live ? this.stages[cur] : T('暂无询盘', 'No inquiry'));
      if (R.db1) {
        swap(R.db0, R.db1, seg(u, 2.3, 2.7) * (1 - seg(u, RS, RS + 0.5)));
        var sent = u >= 6.9 && on;
        put(R.dw, 'text', sent ? T('已由你发送', 'Sent by you') : T('待你确认', 'You confirm'));
        cl(R.dw, 'is-ok', sent);
      }
      if (R.next) {
        var t = T('下一步：报价', 'Next: quote'), nx = this.next, w = R.W < 600 || R.low ? 2 : 1;
        for (var k = 0; k < nx.length; k++) if (u >= nx[k][0] && on) t = nx[k][w];
        textSwap(R.nx, t);
        cl(R.next, 'is-on', u >= 3.0 && on);
        cl(R.next, 'is-ok', u >= 8.2 && on);
      }
      if (!live) pill(R, T('等待询盘', 'Waiting'), 'idle');
      else if (u < 2.0) pill(R, R.small ? T('新询盘', 'New') : T('新询盘', 'New inquiry'), 'live');
      else pill(R, (R.small ? this.stagesS : this.stages)[cur], cur === 6 ? 'ok' : 'warm');
    }
  };

  /* =================== 报价审批: the two human gates (middle right) =================== */
  function button(parent, text, primary) {
    var e = span('sgd-q-btn' + (primary ? ' is-primary' : ''), parent);
    span('', e, text);
    var B = { e: e, wait: el('i', 'sgd-wait', e) };
    var tap = el('i', 'sgd-tap', e); B.dot = el('i', 'sgd-tap-dot', tap); B.ring = el('i', 'sgd-tap-ring', tap);
    return B;
  }
  // a finger comes down on the button, presses, lifts; a ring spreads from it
  function tap(B, u, at, now, waiting) {
    var fin = seg(u, at - 0.45, at - 0.2) * (1 - seg(u, at + 0.22, at + 0.5)), ring = seg(u, at, at + 0.6);
    css(B.dot, 'opacity', (fin * 0.85).toFixed(3));
    css(B.dot, 'transform', 'scale(' + (u < at ? 1.25 - 0.25 * ease.out(seg(u, at - 0.45, at - 0.05)) : 0.84 + 0.16 * ease.out(seg(u, at + 0.12, at + 0.32))).toFixed(3) + ')');
    css(B.ring, 'opacity', (ring > 0 && ring < 1 ? 0.6 * (1 - ease.out(ring)) : 0).toFixed(3));
    css(B.ring, 'transform', 'scale(' + (0.7 + 1.5 * ease.out(ring)).toFixed(3) + ')');
    cl(B.e, 'is-press', u >= at && u < at + 0.2);
    css(B.wait, 'opacity', waiting ? (0.2 + 0.8 * blink(now, 1.1)).toFixed(2) : '0');
  }
  function okLine(parent, text, size) { var d = div('sgd-q-ok', parent); ico('check', span('sgd-ck', d), size); el('b', '', d, text); return d; }
  var QUOTE = {
    key: 'quote', name: T('报价审批', 'Quote approval'), short: T('报价审批', 'Approval'), pos: 'mr', B: 6.1, D: 4.3, crumb: 'Sales Desk',
    note: T('批准和发送，都由你来点', 'You approve it, and you send it'),
    TAP1: 2.5, TAP2: 3.6, RS: 12.5,
    build: function (R) {
      var slim = R.kind === 'slim', small = R.small;
      // the empty queue, until Sales Desk sends Q-1042 over
      var e = R.empty = div('sgd-q-empty', R.body);
      ico('quote', span('sgd-q-eic', e), 16);
      el('b', '', e, slim ? T('暂无待审批', 'Nothing waiting') : T('暂无等你审批的报价', 'No quote waiting for you'));
      if (!slim) span('', e, T('低于底价的报价会停在这里，等你决定', 'Quotes below the floor price stop here for you'));
      var card = R.card = div('sgd-q-card', R.body), top = div('sgd-q-top', card);
      el('b', 'sgd-q-id', top, 'Q-1042');
      if (!slim) span('sgd-q-v', top, 'v2');
      span('sgd-q-who', slim ? card : top, small ? 'Müller Energie' : MULLER);
      // the spec and the incoterm are kept whole: a narrow card wraps between them, never inside 汉堡 / Hamburg
      if (slim && !R.low) div('sgd-q-spec', card, '48V 100Ah × 200');
      else if (!slim) { var sp = div('sgd-q-spec is-split', card); span('', sp, SPEC); span('', sp, DAP); }
      if (!small && !R.low) {   // the price against the floor, in words and on a line
        var pr = div('sgd-q-price', card);
        el('b', '', pr, '€735'); span('', pr, T('/ 组 · 底价 €750', '/ pc · floor €750'));
      }
      var tr = div('sgd-q-track', div('sgd-q-gauge', card));
      R.below = el('i', 'sgd-q-below', tr);
      span('', div('sgd-q-floor', tr), T('底价', 'Floor'));
      R.mk = el('i', 'sgd-q-mk', tr);
      var lr = div('sgd-q-lowrow', card);
      R.chip = span('sgd-q-low', lr, slim ? T('低于底价 2%', 'Under floor') : T('低于底价 2%', 'Below floor · 2%'));
      if (!slim) R.px = span('sgd-q-px', lr, small || R.low ? T('€735 · 底价 €750', '€735 · floor €750') : T('每组低 €15', '€15 under, per pc'));
      var gate = stack('sgd-q-gate', card);
      R.s1 = div('sgd-q-act', gate);
      R.b1 = button(R.s1, T('批准', 'Approve'), true);
      if (!slim) button(R.s1, T('退回修改', 'Send back'), false);
      R.s2 = div('sgd-q-act is-2', gate);
      okLine(R.s2, slim ? T('已批准', 'Approved') : T('已批准 · 未发送', R.W < 320 ? 'Approved' : 'Approved · not sent'), 10);
      R.b2 = button(R.s2, slim ? T('发送', 'Send') : T('发送给客户', 'Send to client'), true);
      R.s3 = div('sgd-q-done', gate);
      okLine(R.s3, slim ? T('已发送', 'Sent') : T('已由你发送', 'Sent by you'), 10);
      var dn = div('sgd-q-dones', R.s3);
      if (!slim) ico('lock', dn, 12);
      span('', dn, slim ? T('由你确认', 'by you') : small ? (R.W < 190 ? T('AI 不会自动发送', 'AI never auto-sends') : T('AI 只起草，不会自动发送', 'AI never sends on its own')) : T('AI 只起草，不会自动发送', 'AI drafts; it never sends on its own'));
    },
    draw: function (R, u, now) {
      var RS = this.RS, T1 = this.TAP1, T2 = this.TAP2, x = seg(u, 0, 0.5) * (1 - seg(u, RS, RS + 0.5));
      swap(R.empty, R.card, x);
      var p = 0.8 - 0.4 * ease.io(seg(u, 0.5, 1.1));
      css(R.mk, 'transform', 'translateX(' + (p * 100).toFixed(2) + '%)');
      cl(R.mk, 'is-low', p < 0.5);
      css(R.below, 'opacity', c01((0.5 - p) / 0.1).toFixed(3));
      var lo = ease.out(seg(u, 1.05, 1.35));
      css(R.chip, 'opacity', lo.toFixed(3));
      css(R.chip, 'transform', lo >= 0.999 ? 'none' : 'scale(' + (0.85 + 0.15 * lo).toFixed(3) + ')');
      if (R.px) css(R.px, 'opacity', lo.toFixed(3));
      var a = seg(u, T1 + 0.1, T1 + 0.6), b = seg(u, T2 + 0.1, T2 + 0.6);
      if (b > 0) { show(R.s1, 0, 0); swap(R.s2, R.s3, b); } else { swap(R.s1, R.s2, a); show(R.s3, 0, 0); }
      css(R.s1, 'visibility', a >= 1 ? 'hidden' : 'visible');
      tap(R.b1, u, T1, now, u >= 1.2 && u < T1);
      tap(R.b2, u, T2, now, u >= T1 + 0.6 && u < T2);
      if (x < 0.5) pill(R, T('暂无待审批', 'Nothing waiting'), 'idle');
      else if (u < 1.2) pill(R, T('核对底价', 'Checking floor'), 'live');
      else if (u < T1) pill(R, T('等你审批', 'Needs your OK'), 'wait');
      else if (u < T2) pill(R, T('已批准 · 等你发送', 'Approved · you send'), 'wait');
      else pill(R, T('已由你发送', 'Sent by you'), 'ok');
    }
  };

  /* =================== ERP: today's board, then SO-2041 (bottom right) =================== */
  var ERP = {
    key: 'erp', name: 'ERP', pos: 'br', B: 11.3, D: 3.0, crumb: T('销售订单', 'Sales orders'), RS: 6.7,
    build: function (R) {
      var land = R.kind === 'land', phone = R.small;
      var names = [T('备货', 'Stock'), T('质检', 'QC'), T('装柜', 'Load')];
      var board = [T('2 单', '2 orders'), T('1 单', '1 order'), T('3 单', '3 orders')];
      var det = [T('仓位 A3 · 批次 2041', 'Bay A3 · lot 2041'), T('抽检 20 组 · 电压 / 内阻', 'Sample 20 · voltage / IR'), T('1 × 40HQ · 订舱已确认', '1 × 40HQ · booked')];
      var h = stack('sgd-e-h', R.body);
      R.h0 = div('sgd-e-hl', h); el('b', '', R.h0, T('今日订单', 'Today')); span('sgd-e-who', R.h0, phone ? T('在制 6', '6 open') : T('柳州工厂 · 在制 6 单', 'Liuzhou plant · 6 open'));
      R.h1 = div('sgd-e-hl', h); el('b', '', R.h1, 'SO-2041'); span('sgd-e-who', R.h1, phone || R.kind === 'sq' ? 'Müller' : land ? MULLER + ' · ' + DAP : 'Müller Energie');
      if (!phone) span('sgd-e-item', R.h1, land ? SPEC : '48V 100Ah × 200');
      var steps = div('sgd-e-steps' + (land ? ' is-row' : ''), R.body);
      R.steps = [];
      for (var i = 0; i < 3; i++) {
        var s = div('sgd-e-step', steps), top = div('sgd-e-st', s);
        span('sgd-e-n', top, String(i + 1)); el('b', '', top, names[i]);
        var vs = stack('sgd-e-v', land && !R.low ? s : top), o = { s: s, v0: span('sgd-dim', vs, board[i]), v1: span('', vs, '') };
        if (land) { var ds = stack('sgd-e-d', s); o.d0 = span('', ds, T('今日', 'today')); o.d1 = span('', ds, det[i]); }
        R.steps.push(o);
      }
      if (!land) { R.ship = div('sgd-e-ship', R.body); ico('check', R.ship, 12); span('', R.ship, det[2]); }
    },
    draw: function (R, u) {
      var RS = this.RS, x = seg(u, 0, 0.45) * (1 - seg(u, RS, RS + 0.45)), order = x >= 0.5;
      swap(R.h0, R.h1, x);
      var p0 = ease.io(seg(u, 0.5, 1.4)), p1 = seg(u, 1.5, 2.0), p2 = ease.io(seg(u, 2.1, 2.7));
      for (var i = 0; i < 3; i++) {
        var s = R.steps[i], p = i === 0 ? p0 : i === 1 ? p1 : p2;
        put(s.v1, 'text', i === 0 ? (p0 < 1 ? Math.round(200 * p0) + '/200' : T('已备齐', 'Ready'))
          : i === 1 ? (p1 <= 0 ? T('待检', 'Pending') : p1 < 1 ? T('抽检中', 'Sampling') : T('已通过', 'Passed'))
          : (p2 <= 0 ? T('待装', 'Waiting') : p2 < 1 ? T('装柜中', 'Loading') : T('已装柜', 'Loaded')));
        swap(s.v0, s.v1, x);
        if (s.d1) swap(s.d0, s.d1, x);
        put(s.s, 'cls', 'sgd-e-step' + (!order ? '' : p >= 1 ? ' is-done' : p > 0 ? ' is-on' : ''));
      }
      if (R.ship) show(R.ship, ease.out(seg(u, 2.75, 3.1)) * (1 - seg(u, RS, RS + 0.3)), 4);
      if (!order) pill(R, T('看板', 'Board'), 'idle');
      else if (u < 0.5) pill(R, T('新订单 · 定金已到', 'New order · deposit in'), 'live');
      else if (p2 < 1) pill(R, p1 <= 0 ? T('备货中', 'Stocking') : p2 <= 0 ? T('质检中', 'In QC') : T('装柜中', 'Loading'), 'live');
      else pill(R, u < 6.4 ? T('已装柜 · 待出运', 'Loaded · to ship') : T('已出运', 'Shipped'), 'ok');
    }
  };

  /* =================== AI 创作: the review queue (bottom left) =================== */
  function thumb(parent, k) {
    var id = 'sgd' + (++serial);
    var s = sv('svg', { viewBox: '0 0 160 104', preserveAspectRatio: 'xMidYMid slice', class: 'sgd-th-svg', 'aria-hidden': 'true' }, parent);
    var defs = sv('defs', {}, s);
    function lin(n, a, b) { var g = sv('linearGradient', { id: id + n, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); sv('stop', { offset: 0, 'stop-color': a }, g); sv('stop', { offset: 1, 'stop-color': b }, g); return 'url(#' + id + n + ')'; }
    function pack(x, y, w, h) {   // a lithium pack: top, side, front, the orange band and the nameplate
      sv('path', { d: 'M' + x + ' ' + y + 'l8-7h' + w + 'l-8 7z', fill: '#4a4a50' }, s);
      sv('path', { d: 'M' + (x + w) + ' ' + y + 'l8-7v' + h + 'l-8 7z', fill: '#1c1c20' }, s);
      sv('rect', { x: x, y: y, width: w, height: h, rx: 1.5, fill: '#2d2d32' }, s);
      sv('rect', { x: x, y: y + h * 0.3, width: w, height: 2.6, fill: '#ec6f10' }, s);
      sv('rect', { x: x + 6, y: y + h * 0.52, width: w * 0.42, height: 3, rx: 1.5, fill: 'rgba(255,255,255,.55)' }, s);
      sv('rect', { x: x + 6, y: y + h * 0.68, width: w * 0.28, height: 2.4, rx: 1.2, fill: 'rgba(255,255,255,.28)' }, s);
    }
    if (k === 0) {        // main image, white background
      sv('rect', { width: 160, height: 104, fill: lin('a', '#f4f1ec', '#ddd6cc') }, s);
      sv('ellipse', { cx: 82, cy: 84, rx: 46, ry: 6, fill: 'rgba(0,0,0,.16)' }, s);
      pack(50, 40, 56, 40);
    } else if (k === 1) { // scene: a 48V rack in a dim room
      sv('rect', { width: 160, height: 104, fill: lin('b', '#2c2119', '#120d0a') }, s);
      var rg = sv('radialGradient', { id: id + 'r', cx: 0.5, cy: 0, r: 0.75 }, defs);
      sv('stop', { offset: 0, 'stop-color': '#ffbe78', 'stop-opacity': 0.16 }, rg); sv('stop', { offset: 1, 'stop-color': '#ffbe78', 'stop-opacity': 0 }, rg);
      sv('rect', { width: 160, height: 86, fill: 'url(#' + id + 'r)' }, s);
      sv('rect', { y: 86, width: 160, height: 18, fill: '#0e0a08' }, s);
      sv('rect', { x: 58, y: 16, width: 44, height: 72, rx: 3, fill: '#1e1a17', stroke: '#3d3229' }, s);
      for (var i = 0; i < 4; i++) {
        sv('rect', { x: 62, y: 21 + i * 16.5, width: 36, height: 12, rx: 1.5, fill: '#2d2621' }, s);
        sv('circle', { cx: 92, cy: 27 + i * 16.5, r: 1.6, fill: i === 1 ? '#ff8a3d' : '#9fe0b0' }, s);
        sv('rect', { x: 66, y: 25.5 + i * 16.5, width: 14, height: 2.4, rx: 1.2, fill: 'rgba(255,255,255,.25)' }, s);
      }
    } else {              // detail page, German
      sv('rect', { width: 160, height: 104, fill: '#1b1512' }, s);
      sv('rect', { x: 24, y: 9, width: 112, height: 95, rx: 4, fill: '#f4f0ea' }, s);
      sv('rect', { x: 24, y: 9, width: 112, height: 11, rx: 4, fill: '#24201d' }, s);
      sv('circle', { cx: 31, cy: 14.5, r: 2, fill: '#ec6f10' }, s);
      sv('rect', { x: 30, y: 28, width: 46, height: 34, rx: 2, fill: '#e6e0d7' }, s);
      pack(37, 41, 28, 16);
      [[82, 30, 46], [82, 37, 38], [82, 44, 42], [30, 70, 98], [30, 77, 86], [30, 84, 92]].forEach(function (l) { sv('rect', { x: l[0], y: l[1], width: l[2], height: 3, rx: 1.5, fill: '#cfc7bb' }, s); });
      sv('rect', { x: 82, y: 52, width: 24, height: 10, rx: 5, fill: '#ec6f10' }, s);
      sv('rect', { x: 87, y: 55.8, width: 14, height: 2.4, rx: 1.2, fill: '#fff' }, s);
    }
  }
  var CREATIVE = {
    key: 'creative', name: T('AI 创作', 'AI Creative'), short: T('AI 创作', 'Creative'), pos: 'bl', B: 14.1, D: 3.0,
    crumb: T('48V 100Ah · 德国站', '48V 100Ah · DE store'),
    labels: [T('主图 · 白底', 'Main image'), T('场景 · 储能柜', 'Rack scene'), T('详情页 · 德语', 'German page')],
    G0: [0.15, 0.7, 1.25], GEN: 0.95,
    build: function (R) {
      var land = R.kind === 'land', phone = R.small;
      var q = div('sgd-c-q', R.body);
      R.items = [];
      for (var i = 0; i < 3; i++) {
        var it = div('sgd-c-it', q), th = div('sgd-c-th', it);
        thumb(th, i);
        var cover = div('sgd-c-cover', th), m = div('sgd-c-m', it);
        el('b', '', m, this.labels[i]);
        R.items.push({ cover: cover, band: el('i', '', cover), st: phone ? span('sgd-c-st', m, '') : span('sgd-c-st', th, '') });
      }
      var side = div('sgd-c-side', R.body), n = div('sgd-c-n', side);
      R.count = el('b', '', n, '0');
      span('', n, phone || R.low ? T('张待审核', 'to review') : T('张待你审核', 'awaiting your review'));
      R.go = span('sgd-q-btn', side); span('', R.go, T('去审核', 'Review'));
      if (land && !R.low) {   // under the fold of the next section: a detail, not the point
        var cw = div('sgd-c-cks', side);
        R.cks = [];
        for (var c = 0; c < 2; c++) { var ck = div('sgd-c-ck', cw); ico('check', ck, 12); span('', ck, c ? T('德语文案已校对', 'German copy proofed') : T('品牌规范已核对', 'Brand rules checked')); R.cks.push(ck); }
      }
    },
    draw: function (R, u) {
      var Q = P - 0.9, r = ease.out(seg(u, Q, Q + 0.6)), done = 0;   // the queue clears just before the next turn
      for (var k = 0; k < 3; k++) {
        var o = R.items[k], g0 = this.G0[k], g1 = g0 + this.GEN, gen = u >= g0 && u < g1, ready = u >= g1 && u < Q;
        css(o.cover, 'opacity', Math.max(1 - ease.out(seg(u, g1, g1 + 0.35)), r).toFixed(3));
        css(o.band, 'transform', 'translateX(' + (-100 + 300 * mod(u * 0.9 + k * 0.3, 1)).toFixed(1) + '%)');
        css(o.band, 'opacity', gen ? '1' : '0');
        if (ready) done++;
        put(o.st, 'text', ready ? T('待审核', 'To review') : gen ? 'AI · ' + Math.round(seg(u, g0, g1) * 100) + '%' : T('排队中', 'Queued'));
        put(o.st, 'cls', 'sgd-c-st' + (ready ? ' is-review' : gen ? ' is-busy' : ''));
      }
      textSwap(R.count, String(done));
      cl(R.go, 'is-hot', done === 3);
      if (R.cks) for (var c = 0; c < 2; c++) show(R.cks[c], ease.out(seg(u, 2.35 + c * 0.25, 2.7 + c * 0.25)) * (1 - r), 4);
      if (done === 3) pill(R, T('待你审核 3', '3 to review'), 'wait');
      else if (u >= this.G0[0] && u < Q) pill(R, T('生成中', 'Rendering'), 'live');
      else pill(R, T('排队中', 'Queued'), 'idle');
    }
  };

  /* =================== 经营驾驶舱: the day, from the other five (middle left) =================== */
  var E = {
    mul: SALES.B, wait: QUOTE.B + 1.2, appr: QUOTE.B + QUOTE.TAP1, sent: QUOTE.B + QUOTE.TAP2, inbox: SALES.B + SALES.RS,
    so: ERP.B, board: ERP.B + ERP.RS, img: CREATIVE.B + CREATIVE.G0[0] + CREATIVE.GEN
  };
  var EV = [
    [GROWTH.B + 1.95, 'Nordwerk Energie · ' + T('匹配 94', 'match 94')],
    [E.mul, 'Müller Energie · ' + T('新询盘', 'new inquiry')],
    [E.wait, 'Q-1042 · ' + T('等你审批', 'needs your OK')],
    [E.appr, 'Q-1042 · ' + T('你已批准', 'approved by you')],
    [E.sent, 'Q-1042 · ' + T('你已发送', 'sent by you')],
    [SALES.B + 8.2, 'Müller Energie · ' + T('定金已到账', 'deposit in')],
    [E.so, 'SO-2041 · ' + T('新订单', 'new order')],
    [ERP.B + 2.7, 'SO-2041 · ' + T('已装柜', 'loaded')],
    [E.img, T('AI 创作 · 素材待你审核', 'AI Creative · images to review'), T('AI 创作 · 素材待审核', 'Creative · images to review')],
    [16.7 + 0.3, T('今天：你批准 1 · 你发送 1 · 自动发送 0', 'Today: you approved 1 · sent 1 · auto-sent 0'), T('今天：你批准 1 · 你发送 1 · 自动发送 0', 'Approved 1 · sent 1 · auto-sent 0')]
  ];
  var COCKPIT = {
    key: 'cockpit', name: T('经营驾驶舱', 'Business Cockpit'), short: T('经营驾驶舱', 'Cockpit'), pos: 'ml', B: 16.7, D: 2.4, crumb: T('今天', 'Today'),
    note: T('只看数，不替你做决定', 'Counts only; decisions stay with you'),
    kpis: [T('今日询盘', 'Inquiries today'), T('等你审批', 'Awaiting your OK'), T('在制订单', 'Open orders'), T('待审素材', 'Images to review')],
    kpiM: [T('今日询盘', 'Inquiries'), T('等你审批', 'To approve'), T('在制订单', 'Open orders'), T('待审素材', 'To review')],
    kpiS: [T('今日询盘', 'Inquiries'), T('等你审批', 'Your OK'), T('在制订单', 'Orders'), T('待审素材', 'Images')],
    build: function (R) {
      var slim = R.kind === 'slim', labels = slim ? this.kpiS : R.kind === 'tall' ? this.kpiM : this.kpis, i;
      R.v = [];
      if (slim || (R.kind === 'tall' && R.W < 200)) {   // two counts, the week, two counts: the middle is where the page's headline sits on a phone
        var top = div('sgd-k-rows', R.body), mid = div('sgd-k-chart', R.body), bot = div('sgd-k-rows', R.body);
        for (i = 0; i < 4; i++) { var r = div('sgd-k is-row', i < 2 ? top : bot); span('', r, labels[i]); R.v.push(el('b', '', r, '')); }
        span('', mid, T('本周询盘', 'This week'));
        var bars = div('sgd-k-bars', mid), hs = [0.52, 0.7, 0.46, 0.8, 0.62, 0.88, 0.6];
        for (i = 0; i < 7; i++) { var bi = el('i', i === 6 ? 'is-today' : '', bars); bi.style.transform = 'scaleY(' + hs[i] + ')'; if (i === 6) R.today = bi; }
      } else {
        var g = div('sgd-k-grid', R.body);
        for (i = 0; i < 4; i++) { var c = div('sgd-k', g); span('', c, labels[i]); R.v.push(el('b', '', c, '')); }
        var e = div('sgd-k-ev', R.body);
        R.evd = el('i', '', e);
        R.ev = span('', e, '');
      }
    },
    draw: function (R, u, now, tau) {
      var inq = tau >= E.mul && tau < E.inbox ? 24 : 23, wait = tau >= E.wait && tau < E.appr ? 1 : 0;
      textSwap(R.v[0], String(inq));
      textSwap(R.v[1], String(wait));
      cl(R.v[1], 'is-hot', wait === 1);
      textSwap(R.v[2], String(tau >= E.so && tau < E.board ? 7 : 6));
      // images to review: counted image by image exactly as the AI 创作 window counts them, so the Live panel never disagrees
      var uc = mod(tau - CREATIVE.B, P), imgs = 0;
      for (var k = 0; k < 3; k++) if (uc >= CREATIVE.G0[k] + CREATIVE.GEN && uc < P - 0.9) imgs++;
      textSwap(R.v[3], String(imgs));
      if (R.today) css(R.today, 'transform', 'scaleY(' + (inq === 24 ? 0.64 : 0.6) + ')');
      var last = EV.length - 1, glow = 0;
      for (var i = 0; i < EV.length; i++) {
        if (tau >= EV[i][0]) last = i;
        var x = tau - EV[i][0];
        if (x >= 0 && x < 0.9) glow = Math.max(glow, 0.5 * Math.sin(Math.PI * x / 0.9));
      }
      if (R.ev) { textSwap(R.ev, (R.W < 400 && EV[last][2]) || EV[last][1]); css(R.evd, 'opacity', (0.35 + 0.65 * blink(now, 1.6)).toFixed(2)); }
      R.glowNow = glow;
      pill(R, wait ? T('1 项等你', '1 needs you') : T('实时', 'Live'), wait ? 'wait' : 'live');
    }
  };

  /* ---------- a scene per window ---------- */
  function Tile(app) {
    return function () {
      var layouts = {}, R = null, me = {};
      function pick(w, h) {
        var H = Math.max(200, Math.min(320, Math.round(h))), s = h / H, W = Math.max(100, Math.round(w / s)), a = W / H;
        var kind = W >= 600 && a >= 1.95 ? 'land' : a >= 1.3 ? 'mid' : a >= 0.9 ? 'sq' : a >= 0.55 ? 'tall' : 'slim';
        // the template zooms the ring to ~1.1 and lets ~4.4% of the screen width of each outer cell run off screen
        var vw = window.innerWidth || 0, rail = vw >= 768 ? Math.min(Math.round(W * 0.2), Math.ceil(0.046 * vw / (1.1 * s)) + 4) : 0;
        if (kind === 'sq' && W - rail < 280) kind = 'tall';   // a narrow tablet, once the rail is taken
        var key = kind + '-' + W + 'x' + H + '-' + rail;
        if (!layouts[key]) layouts[key] = { w: W, h: H, kind: kind, rail: rail };
        return key;
      }
      function tick(t) {
        var now;
        if (RM.matches) now = STILL; else { advance(me, t); now = CLK.t; }
        if (!R) return;
        var tau = mod(now, P), u = mod(tau - app.B, P);
        app.draw(R, u, now, tau);
        if (R.pill) css(R.pdot, 'opacity', R.tone === 'live' ? (0.3 + 0.7 * blink(now, 1.6)).toFixed(2) : R.tone === 'wait' ? (0.3 + 0.7 * blink(now, 1.1)).toFixed(2) : '1');
        // the window whose turn it is lights its frame
        var g = Math.max(inOut(u, 0, app.D, 0.45), app.D2 ? inOut(u, app.D2[0], app.D2[1], 0.4) : 0, R.glowNow || 0);
        css(R.glow, 'opacity', g.toFixed(3));
      }
      return {
        layouts: layouts, pick: pick, tick: tick, still: STILL, start: 0,
        build: function (stage, L) { R = shell(stage, app, L); app.build(R); }
      };
    };
  }
  return {
    'desk-growth': Tile(GROWTH),
    'desk-sales': Tile(SALES),
    'desk-quote': Tile(QUOTE),
    'desk-erp': Tile(ERP),
    'desk-creative': Tile(CREATIVE),
    'desk-cockpit': Tile(COCKPIT)
  };
});
