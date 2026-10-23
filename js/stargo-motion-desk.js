/* DESK — the six windows around the brand film in the homepage theatre
   (「一个工作台，管好每天的生意。」), where six generated photographs (W01–W06)
   were. tools/code-art-theatre.mjs places the hosts, css/stargo-motion-desk.css
   styles them, js/stargo-motion.js runs them like its own scenes.

   Each cell is one window of the STARGO WORK desktop, and the six windows tell
   one demo deal on ONE shared clock, clockwise from the top left so the eye
   travels round the film:
     desk-growth   Growth OS      Nordwerk Energie (94) rises to the top of the shortlist
     desk-sales    Sales Desk     Müller Energie's inquiry is read into 48V 100Ah · 200 组 · DAP 汉堡
     desk-quote    报价审批        Q-1042 is under the floor price, waits, a person taps 批准 — not sent
     desk-erp      ERP            the order line goes 备货 → 质检 → 装柜
     desk-creative AI 创作         three product images land in the review queue, 待审核
     desk-cockpit  经营驾驶舱      four plain counts and the latest event follow the other five
   A window holds its last state until just before its next turn, so the ring
   never resets all at once. Every name and number is demo data and each window
   says so in its status bar.

   One clock: the runner gives every host its own time, so the windows share a
   module clock instead. Whichever window ticks twice before the others have
   ticked once has started a new frame and advances it, so it moves once per
   frame however many windows are on screen. The film's own button
   (.stargo-media-toggle) holds it too: a reader who pauses the film pauses the
   whole theatre. Reduced motion draws every window at STILL.

   Layouts follow the host (W × H in design px, H kept between 200 and 320, so
   the scale is 1 on phones and nothing is under 12 CSS px): land (desktop wide
   cells), mid (desktop narrow cells), sq (tablet wide cells), tall (tablet
   narrow cells and phone wide cells), slim (phone narrow cells). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap, typed = K.typed;
  var P = 18, STILL = 15.4, OUT = 0.8;   // loop, the reduced-motion frame, how long a window takes to clear before its turn
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var serial = 0;

  /* ---------- the shared clock ---------- */
  var CLK = { t: 0, f: 0, held: false };
  var film = document.querySelector('.stargo-media-toggle');
  if (film) film.addEventListener('click', function () {
    setTimeout(function () { CLK.held = film.getAttribute('aria-pressed') !== 'true'; }, 0);
  });
  if (window.__SGD_DEBUG) window.__sgdT = function () { return CLK.t; };   // for the visual checks only
  function advance(me, t) {
    var dt = me.lt === undefined ? 0 : t - me.lt;
    me.lt = t;
    if (!(dt > 0 && dt < 0.25)) dt = 0;
    if (me.f === CLK.f) { CLK.f++; if (!CLK.held) CLK.t += dt; }
    me.f = CLK.f;
  }

  /* ---------- glyphs ---------- */
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
  function ico(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: G[name], stroke: 'currentColor', 'stroke-width': name === 'check' ? 2.6 : 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function div(cls, parent, text) { return el('div', cls, parent, text); }
  function span(cls, parent, text) { return el('span', cls, parent, text); }
  var SMALL = { tall: 1, slim: 1 };
  // a value that eases in over [a, a + d] and out over [b, b + d]
  function inOut(u, a, b, d) { return ease.out(seg(u, a, a + d)) * (1 - seg(u, b, b + d)); }
  function show(e, o, dy) {
    css(e, 'opacity', o.toFixed(3));
    if (dy) css(e, 'transform', o >= 0.999 ? 'none' : 'translateY(' + ((1 - o) * dy).toFixed(2) + 'px)');
  }
  function pill(R, text, tone) { put(R.pill, 'text', text); put(R.pill, 'cls', 'sgd-pill is-' + tone); }

  /* ---------- the window every tile is drawn in ---------- */
  function shell(stage, app, kind, W, H) {
    var small = !!SMALL[kind], low = H < 260, narrow = small || W < 420;
    var bar = small ? 30 : low ? 34 : 38, foot = small || low ? 20 : 22, pad = small ? 8 : low ? 10 : 12;
    stage.className = 'sg-mo-stage sgd sgd-' + app.key + ' is-' + kind + (low ? ' is-low' : '');
    stage.style.setProperty('--bar', bar + 'px');
    stage.style.setProperty('--foot', foot + 'px');
    stage.style.setProperty('--pad', pad + 'px');
    var R = { kind: kind, W: W, H: H, bodyH: H - bar - foot - 2 * pad, bodyW: W - 2 * (small ? (kind === 'slim' ? 7 : 8) : 14) };
    var b = div('sgd-bar', stage);
    if (!small) { var d = span('sgd-dots', b); el('i', '', d); el('i', '', d); el('i', '', d); }
    ico(app.key, span('sgd-mark', b), small ? 12 : 13);
    el('b', 'sgd-name', b, narrow && app.short ? app.short : app.name);
    if (!narrow && app.crumb) span('sgd-crumb', b, app.crumb);
    if (kind !== 'slim') R.pill = span('sgd-pill', b);
    R.body = div('sgd-body', stage);
    var f = div('sgd-foot', stage);
    R.note = span('sgd-note', f, small || (kind === 'mid' && W < 420) ? '' : (kind === 'land' && app.noteLong) || app.note || '');
    span('sgd-tag', f, kind === 'land' || kind === 'mid' ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
    R.glow = el('i', 'sgd-glow', stage);
    return R;
  }

  /* ---------- the deal ---------- */
  var B = { growth: 0.4, sales: 3.0, quote: 6.0, erp: 8.8, creative: 11.6 };   // when each window's turn starts
  var NORDWERK = 'Nordwerk Energie GmbH';
  var MULLER = 'Müller Energie GmbH';
  var SPEC = T('48V 100Ah × 200 组', '48V 100Ah × 200');
  var DAP = T('DAP 汉堡', 'DAP Hamburg');

  /* =================== Growth OS: the shortlist =================== */
  function placeRow(o, st, slot, op, dx, dy) {
    css(o.r, 'transform', 'translate(' + dx.toFixed(1) + 'px,' + (slot * st + dy).toFixed(1) + 'px)');
    css(o.r, 'opacity', op.toFixed(3));
  }
  var GROWTH = {
    key: 'growth', name: 'Growth OS', crumb: T('德国 · 储能经销商', 'Germany · storage'), D: 3.6,
    note: T('联系前，数量和花费先由你确认', 'You confirm count and cost before outreach'),
    rows: [
      ['DE', NORDWERK, 'Nordwerk Energie', T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), T('汉堡', 'Hamburg'), 94],
      ['US', 'Gulf Coast Lift Supply', 'Gulf Coast Lift', T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), T('休斯敦', 'Houston'), 91],
      ['ZA', 'Table Bay Power (Pty) Ltd', 'Table Bay Power', T('家用备电 · 开普敦', 'Home backup · Cape Town'), T('开普敦', 'Cape Town'), 88],
      ['SA', 'Najd Energy Co.', 'Najd Energy', T('通信备电 · 利雅得', 'Telecom backup · Riyadh'), T('利雅得', 'Riyadh'), 84]
    ],
    why: T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配。', 'Three storage tenders in 90 days; the range fits 48V 100Ah.'),
    whyMore: T('建议优先联系采购经理。', ' Contact the purchasing manager first.'),
    build: function (R, kind) {
      var tall = SMALL[kind], land = kind === 'land', sq = kind === 'sq';
      var col = div('sgd-g-col', R.body);
      var head = div('sgd-head', col);
      el('b', '', head, T('候选客户', 'Prospects'));
      if (!tall) span('', head, T('按匹配度', 'By fit'));
      var aiH = sq ? 58 : 0, gap = tall ? 5 : 7, headH = tall ? 24 : 28;
      var rowH = Math.max(38, Math.min(tall ? 46 : 56, Math.floor((R.bodyH - headH - aiH - 2 * gap) / 3)));
      R.step = rowH + gap;
      var list = div('sgd-g-list', col);
      list.style.height = (3 * rowH + 2 * gap) + 'px';
      R.rows = this.rows.map(function (d, i) {
        var r = div('sgd-g-row' + (i === 0 ? ' is-new' : ''), list);
        r.style.height = rowH + 'px';
        if (!tall) span('sgd-cc', r, d[0]);
        var m = div('sgd-g-main', r);
        el('b', '', m, tall ? d[2] : d[1]);
        span('', m, tall ? d[0] + ' · ' + d[4] : d[3]);
        var s = div('sgd-g-score', r);
        var v = el('b', '', s, String(d[5]));
        var fill = null;
        if (!tall) { var tr = el('i', '', s); fill = el('i', '', tr); fill.style.transform = 'scaleX(' + d[5] / 100 + ')'; }
        return { r: r, v: v, fill: fill };
      });
      if (land || sq) {
        var ai = R.ai = div('sgd-g-ai', land ? R.body : col);
        var ah = div('sgd-g-aih', ai); ico('spark', ah, 14); span('', ah, T('AI 判断', 'AI reasoning'));
        if (land) R.who = el('b', 'sgd-g-who', ai, '');
        var tx = div('sgd-g-why', ai);
        R.typed = span('', tx); R.rest = span('sgd-rest', tx);
        R.whyText = land ? this.why + this.whyMore : this.why;
        R.whyDur = Array.from(R.whyText).length / (K.ZH ? 16 : 38);   // seconds to type it
        if (land) { R.gnext = div('sgd-g-next', ai); ico('arrow', R.gnext, 13); span('', R.gnext, T('加入跟进名单 · 待你确认', 'Add to follow-up · you confirm')); }
      }
    },
    draw: function (R, u) {
      var nIn = ease.out(seg(u, 0.35, 0.8)), drop = ease.out(seg(u, 0.3, 0.7)), cnt = ease.out(seg(u, 0.8, 1.6));
      var s1 = ease.io(seg(u, 1.3, 1.6)), s2 = ease.io(seg(u, 1.6, 1.95));
      var r1 = seg(u, P - OUT, P - OUT / 2), r2 = ease.io(seg(u, P - OUT, P - 0.1));
      // slot (0 = top), opacity, sideways drift for each row
      var st = R.step, rows = R.rows;
      placeRow(rows[0], st, 2 - s1 - s2, nIn * (1 - r1), 0, (1 - nIn) * 10);
      placeRow(rows[1], st, s2 - r2, 1, 0, 0);
      placeRow(rows[2], st, 1 + s1 - r2, 1, 0, 0);
      placeRow(rows[3], st, 2, Math.max(1 - drop, r2), drop * (1 - r2) * 18, 0);
      var sc = Math.round(94 * cnt);
      put(rows[0].v, 'text', String(sc));
      if (rows[0].fill) css(rows[0].fill, 'transform', 'scaleX(' + (0.94 * cnt).toFixed(3) + ')');
      cl(rows[0].r, 'is-top', u >= 1.95 && u < P - OUT);
      if (u < 2) pill(R, T('AI 扫描中', 'AI scanning'), 'live');
      else pill(R, T('新增候选 · 94', 'New fit · 94'), 'warm');
      if (R.ai) {
        var td = R.whyDur;
        var s = typed(R.whyText, seg(u, 2.1, 2.1 + td));
        put(R.typed, 'text', s); put(R.rest, 'text', u >= 2.1 ? R.whyText.slice(s.length) : '');
        cl(R.typed, 'is-typing', u >= 2 && u < 2.2 + td);
        if (R.who) put(R.who, 'text', u >= 2 ? NORDWERK : T('比对采购信号…', 'Checking buying signals…'));
        if (R.who) cl(R.who, 'is-wait', u < 2);
        css(R.ai, 'opacity', (1 - r1).toFixed(3));
        if (R.gnext) show(R.gnext, ease.out(seg(u, 2.3 + td, 2.7 + td)), 5);
      }
    }
  };

  /* =================== Sales Desk: the inquiry =================== */
  var SALES = {
    key: 'sales', name: 'Sales Desk', crumb: T('询盘', 'Inquiry'), D: 3.6,
    note: T('AI 只起草，发送前由你确认', 'AI drafts; you confirm before sending'),
    H: [0.85, 1.3, 1.75],   // when each of the three facts is underlined
    msg: ['200 pcs', ' ', '48V 100Ah', ', ', 'DAP Hamburg', '?'],
    chips: [[T('型号', 'Model'), '48V 100Ah', 2], [T('数量', 'Qty'), T('200 组', '200 pcs'), 0], [T('贸易术语', 'Incoterm'), DAP, 4]],
    stages: [T('新询盘', 'New'), T('需求确认', 'Needs'), T('待报价', 'To quote'), T('报价中', 'Quoting'), T('已报价·谈判', 'Negotiating'), T('PI·待定金', 'PI · deposit'), T('已成交', 'Won')],
    build: function (R, kind) {
      var tall = SMALL[kind], land = kind === 'land';
      // the case's seven stages, as in the real Sales Desk
      var stp = R.stp = div('sgd-s-steps' + (land ? '' : ' is-compact'), R.body);
      var track = div('sgd-s-track', stp); R.fill = el('i', '', track);
      R.nodes = [];
      var dots = div('sgd-s-dots', stp);
      for (var i = 0; i < 7; i++) {
        var n = div('sgd-s-node', dots);
        el('i', '', n);
        if (land) span('', n, this.stages[i]);
        R.nodes.push(n);
      }
      if (!land) R.stName = span('sgd-s-name', stp, '');
      var main = R.main = div('sgd-s-main', R.body);
      var left = div('sgd-s-left', main);
      var who = div('sgd-s-who', left);
      span('sgd-av', who, 'ME');
      var wn = div('', who);
      el('b', '', wn, tall ? 'Müller Energie' : MULLER);
      span('', wn, T('德国 · 邮件 · 刚刚', 'Germany · email · now'));
      var bub = div('sgd-s-msg', left);
      R.hl = this.msg.map(function (p, j) { return span(j % 2 === 0 && j < 5 ? 'sgd-hl' : '', bub, p); });
      if (land) {   // the reply AI drafted, waiting for a person
        var d = R.draft = div('sgd-s-draft', left), dh = div('sgd-s-dh', d);
        ico('spark', dh, 12); span('', dh, T('AI 回复草稿', 'AI reply draft')); span('sgd-s-dw', dh, T('待你确认', 'You confirm'));
        div('sgd-s-db', d, 'Hi! Our quote Q-1042 (DAP Hamburg) is attached.');
      }
      var right = div('sgd-s-right', main);
      if (!tall) { var ah = div('sgd-s-aih', right); ico('spark', ah, 13); span('', ah, T('AI 读出需求', 'AI read the request')); }
      var chips = div('sgd-s-chips', right);
      R.chips = this.chips.map(function (c) {
        var e = span('sgd-chip', chips);
        if (!tall) span('sgd-chip-k', e, c[0]);
        el('b', '', e, c[1]);
        return e;
      });
      if (!tall) {
        R.next = div('sgd-s-next', right);
        ico('arrow', R.next, 14);
        span('', R.next, land && R.H >= 260 ? T('报价 Q-1042 已起草，送去审批', 'Quote Q-1042 drafted, sent for approval') : T('报价 Q-1042 送去审批', 'Q-1042 sent for approval'));
      }
      if (tall) R.body.appendChild(stp);   // on a phone the stages sit under the request
    },
    draw: function (R, u) {
      var r = seg(u, P - OUT, P - OUT / 2);
      var a = ease.out(seg(u, 0.05, 0.5)) * (1 - r);
      show(R.main, a, 8);
      var H = this.H;
      for (var j = 0; j < 3; j++) {
        var c = this.chips[j];
        cl(R.hl[c[2]], 'is-on', u >= H[j] && u < P - OUT);
        var x = ease.out(seg(u, H[j] + 0.15, H[j] + 0.5));
        css(R.chips[j], 'opacity', x.toFixed(3));
        css(R.chips[j], 'transform', x >= 0.999 ? 'none' : 'translateY(' + ((1 - x) * 6).toFixed(1) + 'px) scale(' + (0.92 + 0.08 * x).toFixed(3) + ')');
      }
      var si = (ease.io(seg(u, 2.2, 2.6)) + ease.io(seg(u, 3.1, 3.5))) * (1 - ease.io(seg(u, P - OUT, P - 0.2)));
      css(R.fill, 'transform', 'scaleX(' + (si / 6).toFixed(4) + ')');
      var cur = Math.round(si);
      for (var i = 0; i < 7; i++) put(R.nodes[i], 'cls', 'sgd-s-node' + (i < cur ? ' is-done' : i === cur ? ' is-cur' : ''));
      if (R.stName) put(R.stName, 'text', (cur + 1) + '/7 · ' + this.stages[cur]);
      if (R.draft) show(R.draft, ease.out(seg(u, 2.6, 3.0)) * (1 - r), 6);
      if (R.next) show(R.next, ease.out(seg(u, 3.0, 3.4)) * (1 - r), 6);
      if (R.pill) {
        if (u < 0.05 || u >= P - OUT / 2) pill(R, T('等待询盘', 'Waiting'), 'idle');
        else if (u < 2.4) pill(R, T('新询盘', 'New inquiry'), 'live');
        else pill(R, this.stages[cur], 'warm');
      }
    }
  };

  /* =================== Sales Desk · 报价审批: the human gate =================== */
  var QUOTE = {
    key: 'quote', name: T('报价审批', 'Quote approval'), short: T('报价审批', 'Approval'), crumb: 'Sales Desk', D: 3.4,
    note: T('批准后也不会自动发送', 'Approving does not send it'),
    TAP: 2.6,
    build: function (R, kind) {
      var slim = kind === 'slim';
      var card = R.card = div('sgd-q-card', R.body);
      var top = div('sgd-q-top', card);
      el('b', 'sgd-q-id', top, 'Q-1042');
      if (!slim) span('sgd-q-v', top, 'v2');
      span('sgd-q-who', slim ? card : top, slim ? 'Müller Energie' : MULLER);
      div('sgd-q-spec', card, slim ? '48V 100Ah × 200' : SPEC + ' · ' + DAP);
      if (!slim) {
        // the price against the floor: the line a person may not cross without approving
        var g = div('sgd-q-gauge', card);
        var tr = div('sgd-q-track', g);
        R.below = el('i', 'sgd-q-below', tr);
        var fl = div('sgd-q-floor', tr); span('', fl, T('底价', 'Floor'));
        R.mk = el('i', 'sgd-q-mk', tr);
      }
      var lr = div('sgd-q-lowrow', card);
      R.low = span('sgd-q-low', lr, slim ? T('低于底价 2%', 'Below floor') : T('低于底价 2%', 'Below floor · 2%'));
      if (!slim) R.px = span('sgd-q-px', lr, SMALL[kind] ? T('€735 · 底价 €750', '€735 vs €750') : T('报价 €735 · 底价 €750', '€735 · floor €750'));
      if (slim) R.wait = span('sgd-q-wait', div('sgd-q-lowrow', card), T('等你审批', 'Needs you'));
      var gate = div('sgd-q-gate', card);
      var act = R.act = div('sgd-q-act', gate);
      var ok = R.ok = span('sgd-q-btn is-primary', act);
      span('', ok, T('批准', 'Approve'));
      var tap = el('i', 'sgd-tap', ok); R.dot = el('i', 'sgd-tap-dot', tap); R.ring = el('i', 'sgd-tap-ring', tap);
      if (!slim) span('sgd-q-btn', act, T('退回修改', 'Send back'));
      var done = R.done = div('sgd-q-done', gate);
      var dh = div('sgd-q-doneh', done);
      ico('check', span('sgd-ck', dh), slim ? 10 : 12);
      el('b', '', dh, T('已批准', 'Approved'));
      var dn = div('sgd-q-dones', done);
      if (!slim) ico('lock', dn, 13);
      span('', dn, slim ? T('未发送', 'Not sent') : T('未发送 · 发送前由你确认', 'Not sent · you confirm before it goes'));
    },
    draw: function (R, u) {
      var r = seg(u, P - OUT, P - OUT / 2), TAP = this.TAP;
      show(R.card, ease.out(seg(u, 0.1, 0.5)) * (1 - r), 10);
      if (R.mk) {
        var p = 0.8 - 0.4 * ease.io(seg(u, 0.5, 1.1));
        css(R.mk, 'transform', 'translateX(' + (p * 100).toFixed(2) + '%)');
        cl(R.mk, 'is-low', p < 0.5);
        css(R.below, 'opacity', c01((0.5 - p) / 0.1).toFixed(3));
      }
      var lo = ease.out(seg(u, 1.05, 1.35));
      css(R.low, 'opacity', lo.toFixed(3));
      css(R.low, 'transform', lo >= 0.999 ? 'none' : 'scale(' + (0.85 + 0.15 * lo).toFixed(3) + ')');
      if (R.px) css(R.px, 'opacity', lo.toFixed(3));
      var waiting = u >= 1.2 && u < TAP + 0.05;
      if (R.wait) { css(R.wait, 'opacity', (waiting ? 1 : 0).toFixed(0)); }
      // a finger comes down on 批准, presses, lifts; a ring spreads from it
      var fin = seg(u, TAP - 0.45, TAP - 0.2) * (1 - seg(u, TAP + 0.22, TAP + 0.5)), ring = seg(u, TAP, TAP + 0.6);
      css(R.dot, 'opacity', (fin * 0.85).toFixed(3));
      css(R.dot, 'transform', 'scale(' + (u < TAP ? 1.25 - 0.25 * ease.out(seg(u, TAP - 0.45, TAP - 0.05)) : 0.84 + 0.16 * ease.out(seg(u, TAP + 0.12, TAP + 0.32))).toFixed(3) + ')');
      css(R.ring, 'opacity', (ring > 0 && ring < 1 ? 0.6 * (1 - ease.out(ring)) : 0).toFixed(3));
      css(R.ring, 'transform', 'scale(' + (0.7 + 1.5 * ease.out(ring)).toFixed(3) + ')');
      cl(R.ok, 'is-press', u >= TAP && u < TAP + 0.2);
      cl(R.ok, 'is-wait', waiting);
      var swap = ease.out(seg(u, TAP + 0.1, TAP + 0.4));
      show(R.act, 1 - swap, 0);
      show(R.done, ease.out(seg(u, TAP + 0.2, TAP + 0.55)), 6);
      css(R.act, 'visibility', swap >= 1 ? 'hidden' : 'visible');
      if (R.pill) {
        if (u < 0.1 || u >= P - OUT / 2) pill(R, T('暂无待审批', 'Nothing waiting'), 'idle');
        else if (u < 1.2) pill(R, T('核对底价', 'Checking floor'), 'live');
        else if (u < TAP + 0.05) pill(R, T('等你审批', 'Needs your OK'), 'wait');
        else pill(R, T('已批准 · 未发送', 'Approved · not sent'), 'ok');
      }
    }
  };

  /* =================== ERP: the order line =================== */
  var ERP = {
    key: 'erp', name: 'ERP', crumb: T('销售订单', 'Sales order'), D: 3.6,
    note: T('订单 · 单证 · 出货', 'Orders · documents · shipping'),
    build: function (R, kind) {
      var tall = SMALL[kind], land = kind === 'land';
      var o = R.ord = div('sgd-e-ord', R.body);
      var h = div('sgd-e-h', o);
      el('b', '', h, 'SO-2041');
      span('sgd-e-who', h, tall ? 'Müller Energie' : MULLER + ' · ' + DAP);
      if (!tall) span('sgd-e-item', h, SPEC);
      else div('sgd-e-item', o, SPEC);
      var steps = div('sgd-e-steps' + (land ? ' is-row' : ''), o);
      var names = [T('备货', 'Stock'), T('质检', 'QC'), T('装柜', 'Load')];
      var det = [T('仓位 A3 · 批次 2041', 'Bay A3 · lot 2041'), T('抽检 20 组 · 电压 / 内阻', 'Sample 20 · voltage / IR'), T('1 × 40HQ · 订舱已确认', '1 × 40HQ · booked')];
      R.p = [0, 0, 0];
      R.steps = names.map(function (n, i) {
        var s = div('sgd-e-step', steps);
        var top = div('sgd-e-st', s);
        span('sgd-e-n', top, String(i + 1));
        el('b', '', top, n);
        var v = span('sgd-e-v', top, '');
        if (land) div('sgd-e-d', s, det[i]);
        var bar = el('i', 'sgd-e-bar', s), f = el('i', '', bar);
        return { s: s, v: v, f: f };
      });
    },
    draw: function (R, u) {
      var r = seg(u, P - OUT, P - OUT / 2);
      show(R.ord, ease.out(seg(u, 0.6, 1.0)) * (1 - r), 8);
      var p = R.p;
      p[0] = ease.io(seg(u, 1.1, 2.1)); p[1] = seg(u, 2.2, 2.75); p[2] = ease.io(seg(u, 2.85, 3.45));
      for (var i = 0; i < 3; i++) {
        var s = R.steps[i];
        put(s.v, 'text', i === 0 ? (p[0] < 1 ? Math.round(200 * p[0]) + '/200' : T('已备齐', 'Ready'))
          : i === 1 ? (p[1] <= 0 ? T('待检', 'Pending') : p[1] < 1 ? T('抽检中', 'Sampling') : T('已通过', 'Passed'))
          : (p[2] <= 0 ? '40HQ' : p[2] < 1 ? T('装柜中', 'Loading') : T('已装柜', 'Loaded')));
        css(s.f, 'transform', 'scaleX(' + p[i].toFixed(3) + ')');
        put(s.s, 'cls', 'sgd-e-step' + (p[i] >= 1 ? ' is-done' : p[i] > 0 ? ' is-on' : ''));
      }
      if (R.pill) {
        if (u < 0.6 || u >= P - OUT / 2) pill(R, T('今日订单', 'Today'), 'idle');
        else if (u < 1.1) pill(R, T('新订单', 'New order'), 'live');
        else if (p[2] < 1) pill(R, p[1] <= 0 ? T('备货中', 'Stocking') : p[2] <= 0 ? T('质检中', 'In QC') : T('装柜中', 'Loading'), 'live');
        else pill(R, SMALL[R.kind] ? T('已装柜', 'Loaded') : T('已装柜 · 待出运', 'Loaded · to ship'), 'ok');
      }
    }
  };

  /* =================== AI 创作: the review queue =================== */
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
    return s;
  }
  var CREATIVE = {
    key: 'creative', name: T('AI 创作', 'AI Creative'), crumb: T('48V 100Ah · 德国站', '48V 100Ah · German store'), D: 2.9,
    note: T('每张图都要你点通过才发布', 'Nothing is published without your OK'),
    labels: [T('主图 · 白底', 'Main · white'), T('场景 · 储能柜', 'Scene · rack'), T('详情页 · 德语', 'Detail · German')],
    G0: [0.15, 0.7, 1.25], GEN: 0.95,
    build: function (R, kind) {
      var tall = SMALL[kind], land = kind === 'land';
      var q = div('sgd-c-q' + (tall ? ' is-col' : ''), R.body);
      var self = this;
      R.items = [0, 1, 2].map(function (k) {
        var it = div('sgd-c-it', q);
        var th = div('sgd-c-th', it);
        thumb(th, k);
        var cover = div('sgd-c-cover', th), band = el('i', '', cover);
        var m = div('sgd-c-m', it);
        el('b', '', m, self.labels[k]);
        var st = span('sgd-c-st', m, '');
        return { cover: cover, band: band, st: st };
      });
      if (!tall) {
        var side = R.side = div('sgd-c-side' + (land || kind === 'mid' ? '' : ' is-row'), R.body);
        var n = div('sgd-c-n', side);
        R.count = el('b', '', n, '0');
        span('', n, T('张待你审核', 'awaiting your review'));
        var cw = land && div('sgd-c-cks', side);
        if (cw) R.cks = [T('品牌规范已核对', 'Brand rules checked'), T('德语文案已校对', 'German copy proofed')].map(function (t) {
          var c = div('sgd-c-ck', cw); ico('check', c, 12); span('', c, t); return c;
        });
        var go = span('sgd-q-btn', side);
        span('', go, T('去审核', 'Review'));
        R.go = go;
      }
    },
    draw: function (R, u) {
      var r = ease.out(seg(u, P - OUT, P - 0.2)), done = 0;
      for (var k = 0; k < 3; k++) {
        var o = R.items[k], g0 = this.G0[k], g1 = g0 + this.GEN;
        var pr = seg(u, g0, g1), gone = ease.out(seg(u, g1, g1 + 0.35));
        var cov = Math.max(1 - gone, r);
        css(o.cover, 'opacity', cov.toFixed(3));
        css(o.band, 'transform', 'translateX(' + (-100 + 300 * mod(u * 0.9 + k * 0.3, 1)).toFixed(1) + '%)');
        css(o.band, 'opacity', u >= g0 && u < g1 ? '1' : '0');
        var ready = u >= g1 && u < P - OUT;
        if (ready) done++;
        put(o.st, 'text', ready ? T('待审核', 'Needs review') : u >= g0 && u < g1 ? T('生成中 ', 'Rendering ') + Math.round(pr * 100) + '%' : T('排队中', 'Queued'));
        put(o.st, 'cls', 'sgd-c-st' + (ready ? ' is-review' : u >= g0 && u < g1 ? ' is-busy' : ''));
      }
      if (R.count) { textSwap(R.count, String(done)); cl(R.go, 'is-hot', done === 3); }
      if (R.cks) for (var c = 0; c < 2; c++) show(R.cks[c], ease.out(seg(u, 2.35 + c * 0.25, 2.7 + c * 0.25)) * (1 - r), 4);
      if (R.pill) {
        if (u < 0.15 || u >= P - OUT / 2) pill(R, T('就绪', 'Ready'), 'idle');
        else if (done < 3) pill(R, T('生成中', 'Rendering'), 'live');
        else pill(R, T('待审核 3', '3 to review'), 'wait');
      }
    }
  };

  /* =================== 经营驾驶舱: what the other five did =================== */
  var EV = [
    [B.growth + 1.95, 'Nordwerk Energie · ' + T('匹配 94', 'fit 94')],
    [B.sales + 0.05, 'Müller Energie · ' + T('新询盘', 'new inquiry')],
    [B.quote + 1.2, 'Q-1042 · ' + T('等你审批', 'needs your OK')],
    [B.quote + QUOTE.TAP + 0.05, 'Q-1042 · ' + T('你已批准，未发送', 'approved, not sent')],
    [B.erp + 0.6, 'SO-2041 · ' + T('新订单', 'new order')],
    [B.erp + 3.45, 'SO-2041 · ' + T('已装柜', 'loaded')],
    [B.creative + CREATIVE.G0[2] + CREATIVE.GEN, T('3 张素材待审核', '3 images to review')]
  ];
  var COCKPIT = {
    key: 'cockpit', name: T('经营驾驶舱', 'Business Cockpit'), short: T('经营驾驶舱', 'Cockpit'), crumb: T('今天', 'Today'), D: 0,
    note: T('只看数，不替你做决定', 'Counts only; decisions stay with you'),
    kpis: [T('今日询盘', 'Inquiries today'), T('等你审批', 'Awaiting you'), T('在制订单', 'Open orders'), T('待审素材', 'To review')],
    kpiS: [T('今日询盘', 'Inquiries'), T('等你审批', 'Need you'), T('在制订单', 'Orders'), T('待审素材', 'Images')],
    build: function (R, kind) {
      var slim = kind === 'slim';
      var g = div('sgd-k-grid' + (slim ? ' is-col' : ''), R.body);
      R.v = (slim && R.H < 260 ? this.kpiS : this.kpis).map(function (n, i) {
        var c = div('sgd-k', g);
        span('', c, n);
        return el('b', i === 1 ? 'is-gate' : '', c, '');
      });
      if (!slim) {
        var e = div('sgd-k-ev', R.body);
        el('i', '', e);
        R.ev = span('', e, '');
      }
    },
    draw: function (R, u, tau, now) {
      var k = Math.floor(now / P);
      var appr = tau >= EV[2][0] && tau < EV[3][0] ? 1 : 0;
      // the creative window clears its three images just before its next turn
      var imgs = tau >= EV[6][0] || tau < B.creative - OUT ? 3 : 0;
      textSwap(R.v[0], String(23 + k + (tau >= EV[1][0] ? 1 : 0)));
      textSwap(R.v[1], String(appr));
      cl(R.v[1], 'is-hot', appr === 1);
      textSwap(R.v[2], String(6 + k + (tau >= EV[4][0] ? 1 : 0)));
      textSwap(R.v[3], String(imgs));
      var last = EV.length - 1, glow = 0;
      for (var i = 0; i < EV.length; i++) {
        if (tau >= EV[i][0]) last = i;
        var x = tau - EV[i][0];
        if (x >= 0 && x < 0.9) glow = Math.max(glow, 0.5 * Math.sin(Math.PI * x / 0.9));
      }
      if (R.ev) textSwap(R.ev, EV[last][1]);
      R.glowNow = glow;
      if (R.pill) pill(R, appr ? T('1 项等你', '1 needs you') : T('实时', 'Live'), appr ? 'wait' : 'live');
    }
  };

  /* ---------- a scene per window ---------- */
  function Tile(app) {
    return function () {
      var layouts = {}, R = null, me = {};
      function lay(kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
      function pick(w, h) {
        var H = Math.max(200, Math.min(320, Math.round(h))), s = h / H, W = Math.max(100, Math.round(w / s)), a = W / H;
        return lay(W >= 600 && a >= 1.95 ? 'land' : a >= 1.3 ? 'mid' : a >= 0.9 ? 'sq' : a >= 0.55 ? 'tall' : 'slim', W, H);
      }
      function tick(t) {
        var now;
        if (RM.matches) now = STILL; else { advance(me, t); now = CLK.t; }
        if (!R) return;
        var tau = mod(now, P), u = mod(tau - (B[app.key] || 0), P);
        app.draw(R, u, tau, now);
        // the window whose turn it is lights its frame
        var g = app.D ? inOut(u, 0, app.D, 0.45) : R.glowNow || 0;
        css(R.glow, 'opacity', g.toFixed(3));
      }
      return {
        layouts: layouts, pick: pick, tick: tick, still: STILL, start: 0,
        build: function (stage, L) { R = shell(stage, app, L.kind, L.w, L.h); app.build(R, L.kind, L.w, L.h); }
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
