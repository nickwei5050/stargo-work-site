/* STAGES — the homepage's five business stages (主动获客 … 复购与改进), where
   the owner's photographs P01–P05 were (tools/replaceables.mjs HOME_STAGES).

   Each stage keeps its own picture box, so Mono's own switching (one
   `.service-media-wrap` lit at a time, js/stargo-stage-hold.js for the gaps)
   is untouched: five hosts, five small scenes. A host whose box is at opacity
   0 is not ticked (the runner checks it every 250 ms), and a stage that comes
   back carries on from the frame it stopped on, so a switch never jumps.

   One demo deal runs through the five, with the site's one demo cast:
     001 Growth OS · the shortlist forms: Nordwerk Energie GmbH 94 and Gulf
         Coast Lift Supply 91, with the reason written down;
     002 Sales Desk · Müller Energie's inquiry (200 pcs 48V 100Ah, DAP
         Hamburg) → the needs read out → an AI draft of quote Q-1042 → it
         waits for your approval and nothing is sent;
     003 ERP · the order PI-1042: 排产 → 质检 → 装柜 with dates, against the
         date sales promised;
     004 ERP · its documents (发票 / 装箱单 / 提单) tick off and the payment
         goes from the 30% deposit to 100%;
     005 Growth OS · PT Surya Energi is due to restock (60 days since the last
         order) → a suggested reorder → it waits for your confirmation.
   Every name and number is demo data and each scene says so in its bar.

   Queued on window.STARGO_SCENES; js/stargo-motion.js (loaded after this) hands
   it the engine's kit. tick(t) is a pure function of time; nothing is
   animated but transform and opacity, and no transition runs on anything
   else. Layouts, picked by the host's width:
     card  336 × 224  the 3:2 box from 992px up (295–338px wide: the scale
                      stays 0.88–1.0, so 12px type stays 11–12px)
     mini  180 × 120  the same box on tablets (103–230px wide), fewer words */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod;

  var GLYPH = {
    spark: 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z',
    radar: 'M12 4.5a7.5 7.5 0 1 0 7.5 7.5M12 8.5a3.5 3.5 0 1 0 3.5 3.5M12 12l6-6',
    chat: 'M12 4.5a7.5 7.5 0 0 0-6.6 11.1L4.5 19.5l4-1a7.5 7.5 0 1 0 3.5-14z',
    box: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    mail: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM5 7l7 5.5L19 7',
    shield: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2 2 4-4',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    repeat: 'M5 9.5A7 7 0 0 1 17.5 7M19 14.5A7 7 0 0 1 6.5 17M17.5 3.5V7H14M6.5 20.5V17H10'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function box(cls, parent, x, y, w, h, text) {
    var e = el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  // an element that rises into place: p 0 → 1 (strings only while it moves)
  function rise(e, p, dy) {
    if (p <= 0) { put(e, '-opacity', '0'); put(e, '-transform', e.__dy || (e.__dy = 'translateY(' + (dy || 8) + 'px)')); return; }
    if (p >= 1) { put(e, '-opacity', '1'); put(e, '-transform', 'none'); return; }
    var q = ease.out(p);
    put(e, '-opacity', q.toFixed(3));
    put(e, '-transform', 'translateY(' + ((1 - q) * (dy || 8)).toFixed(2) + 'px)');
  }
  // a ring that pings outwards while `on` (driven by the clock, so it stops whenever the scene does)
  function ping(e, t, on) {
    if (!on) { put(e, '-opacity', '0'); return; }
    var u = (t * 0.66) % 1;
    put(e, '-opacity', (0.85 * (1 - u)).toFixed(3));
    put(e, '-transform', 'scale(' + (0.7 + 0.75 * ease.out(u)).toFixed(3) + ')');
  }
  function fade(e, p) { put(e, '-opacity', p <= 0 ? '0' : p >= 1 ? '1' : ease.out(p).toFixed(3)); }
  // a bar that fills: p 0 → 1 of its full length v (0–1)
  function fill(e, v) { put(e, '-transform', v <= 0 ? 'scaleX(0)' : v >= 1 ? 'none' : 'scaleX(' + v.toFixed(4) + ')'); }
  // text typed out character by character; the characters are split once
  function typer(e, s) { e.__ch = Array.from(s); e.__n = -1; return e; }
  function typeTo(e, p) {
    var n = Math.round(e.__ch.length * (p <= 0 ? 0 : p >= 1 ? 1 : p));
    if (n !== e.__n) { e.__n = n; e.textContent = e.__ch.slice(0, n).join(''); }
    cl(e, 'is-typing', p > 0 && p < 1);
  }
  function num(e, v) { if (e.__v !== v) { e.__v = v; e.textContent = String(v); } }
  function fmt(n) { return Math.round(n).toLocaleString(K.ZH ? 'zh-CN' : 'en-US'); }
  // the state a status pill shows: a class from a list, set once per change
  function tone(e, name) { if (e.__tone === name) return; if (e.__tone) e.classList.remove('is-' + e.__tone); e.__tone = name; if (name) e.classList.add('is-' + name); }

  var TAG = { card: T('动态示意 · 演示数据', 'Illustrative motion · demo data'), mini: T('演示数据', 'Demo data') };
  var LAYOUTS = { card: { w: 336, h: 224 }, mini: { w: 180, h: 120 } };

  /* One stage: its bar (app mark, app name, the honesty tag) over a body that
     fades in at the start of each loop and out at its end. */
  function stage(key, app, g, P, still, build, tick) {
    return function () {
      var R = {};
      return {
        layouts: LAYOUTS,
        pick: function (w) { return w >= 236 ? 'card' : 'mini'; },
        build: function (st, L, mode) {
          R = { mode: mode, card: mode === 'card' };
          st.className = 'sg-mo-stage sg-stg sg-stg-' + key + ' is-' + mode;
          var bar = el('div', 'sg-stg-bar', st);
          var mk = el('span', 'sg-stg-mark', bar); glyph(g, mk, R.card ? 12 : 10);
          el('b', 'sg-stg-app', bar, app);
          el('span', 'sg-stg-tag', bar, TAG[mode]);
          R.body = el('div', 'sg-stg-body', st);
          build(R, R.body, R.card);
        },
        tick: function (t) {
          var tau = mod(t, P);
          var o = Math.min(seg(tau, 0, 0.3), 1 - seg(tau, P - 0.55, P - 0.1));
          put(R.body, '-opacity', o >= 1 ? '1' : o <= 0 ? '0' : o.toFixed(3));
          tick(R, tau, R.card);
        },
        still: still, start: 0.45
      };
    };
  }

  /* ---------------- 001 主动获客 · Growth OS ---------------- */
  var PROSPECTS = [
    ['DE', 'Nordwerk Energie GmbH', 'Nordwerk', T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), 94],
    ['US', 'Gulf Coast Lift Supply', 'Gulf Coast', T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), 91]
  ];
  var REASON = T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配，建议优先联系采购经理。',
    'Three storage tenders in 90 days; fits 48V\u00a0100Ah. Contact the buyer first.');
  var prospect = stage('find', 'Growth OS', 'radar', 9.6, 7.4, function (R, b, card) {
    if (card) {
      var hd = box('sg-stg-head', b, 12, 40, 312, 16);
      el('b', '', hd, T('候选客户 · 按匹配度', 'Prospects · by fit'));
      R.scan = el('span', 'sg-stg-dim', hd);
    }
    R.rows = PROSPECTS.map(function (p, i) {
      var row = card ? box('sg-stg-row', b, 12, 60 + i * 45, 312, 40) : box('sg-stg-row', b, 8, 31 + i * 44, 164, 38);
      if (card) el('span', 'sg-stg-cc', row, p[0]);
      var m = el('div', 'sg-stg-main', row);
      el('b', '', m, card ? p[1] : p[2]);
      if (card) el('span', '', m, p[3]);
      var s = el('div', 'sg-stg-score', row);
      var n = el('b', '', s, '0');
      var track = el('i', 'sg-stg-track', s);
      var f = el('i', '', track);
      return { row: row, n: n, f: f, v: p[4] };
    });
    if (card) {
      var ai = R.ai = box('sg-stg-note', b, 12, 151, 312, 66);
      var ah = el('div', 'sg-stg-note-k', ai); glyph('spark', ah, 12); el('span', '', ah, T('AI 判断 · Nordwerk Energie', 'AI reasoning · Nordwerk Energie'));
      R.pick = el('span', 'sg-stg-flag', ah, T('建议先开发', 'Contact first'));
      R.why = typer(el('div', 'sg-stg-note-v', ai), REASON);
    }
  }, function (R, tau, card) {
    for (var i = 0; i < 2; i++) {
      var r = R.rows[i], a = 0.45 + i * 0.95;
      rise(r.row, seg(tau, a, a + 0.5), 10);
      var p = ease.out(seg(tau, a + 0.2, a + 1.0));
      num(r.n, Math.round(r.v * p));
      fill(r.f, p * r.v / 100);
    }
    if (!card) return;
    var sc = 12480 + Math.floor(seg(tau, 0.3, 2.6) * 26) * 12;
    if (R.scan.__v !== sc) { R.scan.__v = sc; R.scan.textContent = T('已扫描 ', 'Scanned ') + fmt(sc); }
    rise(R.ai, seg(tau, 2.5, 2.9), 6);
    typeTo(R.why, seg(tau, 2.8, 2.8 + R.why.__ch.length / (K.ZH ? 15 : 34)));
    var picked = tau >= 6.1;
    cl(R.rows[0].row, 'is-pick', tau >= 2.6);
    rise(R.pick, seg(tau, 6.1, 6.45), 4);
    cl(R.pick, 'is-on', picked);
  });

  /* ---------------- 002 外贸销售 · Sales Desk ---------------- */
  var DRAFT = 'Hi Mr. Müller, quote Q-1042 is attached.';
  var deal = stage('sell', 'Sales Desk', 'chat', 9.6, 7.2, function (R, b, card) {
    if (card) {
      var q = R.inq = box('sg-stg-card', b, 12, 40, 312, 54);
      var top = el('div', 'sg-stg-line', q); glyph('mail', top, 13, 'sg-ico sg-stg-dim');
      el('b', '', top, 'Müller Energie GmbH'); el('span', 'sg-stg-dim', top, T('德国', 'Germany')); el('span', 'sg-stg-time', top, '09:12');
      el('div', 'sg-stg-msg', q, '200 pcs 48V 100Ah, DAP Hamburg?');
      var chips = box('sg-stg-chips', b, 12, 101, 312, 22);
      el('span', 'sg-stg-dim', chips, T('AI 识别', 'AI reads'));
      R.chips = [['48V 100Ah'], [T('200 组', '200 pcs')], [T('DAP 汉堡', 'DAP Hamburg')]].map(function (c) { return el('span', 'sg-stg-chip', chips, c[0]); });
      var d = R.draft = box('sg-stg-card is-draft', b, 12, 130, 312, 54);
      var dk = el('div', 'sg-stg-note-k', d); glyph('spark', dk, 12); el('span', '', dk, T('AI 草稿 · 报价 Q-1042', 'AI draft · quote Q-1042'));
      R.text = typer(el('div', 'sg-stg-msg', d), DRAFT);
      var act = box('sg-stg-act', b, 12, 192, 312, 24);
      R.btn = el('span', 'sg-stg-btn', act, T('提交审批', 'Send for approval'));
      R.gate = el('span', 'sg-stg-gate', act); glyph('shield', R.gate, 13); el('span', '', R.gate, T('等你审批', 'Needs your approval'));
      R.hold = el('span', 'sg-stg-dim sg-stg-right', act, T('批准前不会发送', 'Not sent yet'));
    } else {
      var m = R.inq = box('sg-stg-card', b, 8, 31, 164, 46);
      el('b', 'sg-stg-name', m, 'Müller Energie');
      var ch = el('div', 'sg-stg-chips', m);
      R.chips = ['48V 100Ah', T('200 组', '200 pcs')].map(function (c) { return el('span', 'sg-stg-chip', ch, c); });
      var g = box('sg-stg-act', b, 8, 86, 164, 24);
      R.btn = el('span', 'sg-stg-btn', g, T('AI 草稿 Q-1042', 'AI draft Q-1042'));
      R.gate = el('span', 'sg-stg-gate', g); glyph('shield', R.gate, 12); el('span', '', R.gate, T('等你审批', 'Needs approval'));
    }
  }, function (R, tau, card) {
    rise(R.inq, seg(tau, 0.35, 0.85), 10);
    for (var i = 0; i < R.chips.length; i++) { var c = R.chips[i], a = 1.15 + i * 0.28; rise(c, seg(tau, a, a + 0.35), 5); cl(c, 'is-new', tau >= a && tau < a + 0.9); }
    var gated = tau >= (card ? 5.0 : 3.6);
    if (card) {
      rise(R.draft, seg(tau, 2.2, 2.6), 8);
      typeTo(R.text, seg(tau, 2.5, 4.1));
      rise(R.btn.parentNode, seg(tau, 4.1, 4.4), 4);
      fade(R.hold, seg(tau, 5.1, 5.5));
    } else rise(R.btn, seg(tau, 2.2, 2.6), 4);
    cl(R.btn, 'is-press', tau >= (card ? 4.75 : 3.35) && !gated);
    fade(R.btn, 1 - seg(tau, card ? 4.95 : 3.55, card ? 5.1 : 3.7));
    rise(R.gate, seg(tau, card ? 5.0 : 3.6, card ? 5.35 : 3.95), 4);
    cl(R.gate, 'is-on', gated);
  });

  /* ---------------- 003 企业履约 · ERP ---------------- */
  var STEPS = [
    { k: T('排产', 'Production'), m: T('排产', 'Make'), d: T('11/02', 'Nov 2') },
    { k: T('质检', 'QC'), m: T('质检', 'QC'), d: T('11/09', 'Nov 9') },
    { k: T('装柜', 'Loading'), m: T('装柜', 'Load'), d: T('11/12', 'Nov 12') }
  ];
  var PHASE = [   // [from, status pill, the line under the steps]
    [0, T('待排产', 'Scheduled'), T('计划已排 · 物料齐套', 'Planned · materials ready')],
    [0.7, T('生产中', 'In production'), ''],
    [3.15, T('质检中', 'In QC'), T('抽检 20 组 · 容量、内阻、外观', '20 packs sampled · capacity, resistance, finish')],
    [4.4, T('质检通过', 'QC passed'), T('抽检 20 组 · 全部合格', '20 packs sampled · all passed')],
    [5.25, T('装柜中', 'Loading'), T('1 × 20GP · 装柜中', '1 × 20GP · loading')],
    [6.1, T('已装柜', 'Loaded'), T('1 × 20GP · 已装柜', '1 × 20GP · loaded')]
  ];
  var order = stage('make', 'ERP', 'box', 9.6, 7.6, function (R, b, card) {
    var xs = card ? [46, 168, 290] : [26, 90, 154];
    var ty = card ? 104 : 61;
    if (card) {
      var hd = box('sg-stg-head', b, 12, 40, 312, 18);
      el('b', '', hd, 'PI-1042'); el('span', 'sg-stg-dim', hd, 'Müller Energie GmbH');
      R.pill = el('span', 'sg-stg-pill', hd);
      box('sg-stg-sub sg-stg-dim', b, 12, 61, 312, 16, T('48V 100Ah × 200 组 · DAP 汉堡', '48V 100Ah × 200 packs · DAP Hamburg'));
    } else {
      var mh = box('sg-stg-head', b, 8, 30, 164, 18);
      el('b', '', mh, 'PI-1042'); R.pill = el('span', 'sg-stg-pill', mh);
    }
    var tr = box('sg-stg-rail', b, xs[0], ty - 1, xs[2] - xs[0], 2);
    R.rail = el('i', '', tr);
    R.rings = [];
    R.nodes = STEPS.map(function (s, i) {
      var n = box('sg-stg-node', b, xs[i] - 10, ty - 10, 20, 20);
      R.rings.push(el('i', 'sg-stg-ring', n));
      glyph('check', n, 12, 'sg-ico sg-stg-ck');
      var lab = box('sg-stg-step', b, xs[i] - 50, ty + (card ? 15 : 13), 100, null);
      el('b', '', lab, card ? s.k : s.m);
      if (card) el('span', 'sg-stg-dim', lab, s.d);
      return n;
    });
    if (card) {
      var st = box('sg-stg-status', b, 12, 166, 312, 20);
      R.line = el('span', '', st);
      R.made = el('b', 'sg-stg-made', st);
      var pt = el('i', 'sg-stg-track', st); R.prog = el('i', '', pt);
      var ft = box('sg-stg-foot', b, 12, 196, 312, 20);
      el('span', 'sg-stg-dim', ft, T('承诺装柜 11/12', 'Promised loading Nov 12'));
      R.match = el('span', 'sg-stg-ok sg-stg-right', ft); glyph('check', R.match, 12); el('span', '', R.match, T('进度与承诺一致', 'On the promised date'));
    } else {
      R.foot = box('sg-stg-foot sg-stg-dim', b, 8, 100, 164, 16, T('承诺装柜 11/12', 'Promised Nov 12'));
    }
  }, function (R, tau, card) {
    var ph = 0;
    for (var i = PHASE.length - 1; i > 0; i--) if (tau >= PHASE[i][0]) { ph = i; break; }
    if (R.pill.__ph !== ph) { R.pill.__ph = ph; R.pill.textContent = PHASE[ph][1]; tone(R.pill, ph === 5 ? 'ok' : ph === 0 ? '' : 'run'); }
    // the rail: node 1 → 2 while QC starts, 2 → 3 while loading starts
    fill(R.rail, 0.5 * ease.io(seg(tau, 2.7, 3.15)) + 0.5 * ease.io(seg(tau, 4.8, 5.25)));
    var at = [[0.7, 2.7], [3.15, 4.4], [5.25, 6.1]];
    for (var n = 0; n < 3; n++) {
      var run = tau >= at[n][0] && tau < at[n][1];
      tone(R.nodes[n], tau >= at[n][1] ? 'done' : run ? 'run' : '');
      ping(R.rings[n], tau - at[n][0], run);
    }
    if (!card) { cl(R.foot, 'is-ok', tau >= 6.1); return; }
    var made = Math.round(200 * ease.io(seg(tau, 0.8, 2.6)));
    var producing = ph === 1;
    if (R.line.__ph !== ph) { R.line.__ph = ph; R.line.textContent = producing ? T('生产中 · 已完成', 'In production · done') : PHASE[ph][2]; }
    if (R.made.__m !== (producing ? made : -1)) { R.made.__m = producing ? made : -1; R.made.textContent = producing ? made + ' / 200' : ''; }
    cl(R.made.parentNode, 'is-prod', producing);
    fill(R.prog, made / 200);
    rise(R.match, seg(tau, 6.35, 6.7), 4);
  });

  /* ---------------- 004 回款与服务 · ERP ---------------- */
  var DOCS = [
    { k: T('商业发票', 'Commercial invoice'), s: 'CI-1042', w: T('待生成', 'To do'), ok: T('已生成', 'Ready'), at: 0.9 },
    { k: T('装箱单', 'Packing list'), s: 'PL-1042', w: T('待生成', 'To do'), ok: T('已生成', 'Ready'), at: 1.6 },
    { k: T('提单', 'Bill of lading'), s: 'B/L', w: T('等船公司', 'With the carrier'), ok: T('已签发', 'Issued'), at: 2.7 }
  ];
  var collect = stage('pay', 'ERP', 'doc', 9.6, 7.2, function (R, b, card) {
    if (card) {
      var hd = box('sg-stg-head', b, 12, 40, 312, 18);
      el('b', '', hd, 'PI-1042'); el('span', 'sg-stg-dim', hd, T('单证与回款', 'Documents and payment'));
    }
    R.docs = DOCS.map(function (d, i) {
      var r = card ? box('sg-stg-doc', b, 12, 64 + i * 27, 312, 23) : box('sg-stg-doc', b, 8 + i * 56, 31, 52, 40);
      glyph('doc', r, card ? 13 : 12, 'sg-ico sg-stg-dim');
      el('b', '', r, card ? d.k : T(['发票', '装箱单', '提单'][i], ['Invoice', 'Packing', 'B/L'][i]));
      if (card) el('span', 'sg-stg-dim', r, d.s);
      var st = el('span', 'sg-stg-docst', r);
      if (card) { d.wEl = el('span', 'sg-stg-wait', st, d.w); }
      var ok = el('span', 'sg-stg-done', st); glyph('check', ok, 12); if (card) el('span', '', ok, d.ok);
      return { r: r, ok: ok, wait: d.wEl, at: d.at };
    });
    var py = card ? 152 : 80;
    var pk = box('sg-stg-pay', b, card ? 12 : 8, py, card ? 312 : 164, card ? 18 : 14);
    el('b', '', pk, T('回款', 'Payment'));
    R.pct = el('b', 'sg-stg-pct', pk);
    var bar = box('sg-stg-paybar', b, card ? 12 : 8, py + (card ? 24 : 20), card ? 312 : 164, card ? 8 : 6);
    R.bar = el('i', '', bar);
    el('i', 'sg-stg-cut', bar);
    if (card) {
      var ms = box('sg-stg-ms', b, 12, py + 40, 312, 16);
      el('span', '', ms, T('定金 30% · 已到账', 'Deposit 30% · paid'));
      R.bal = el('span', 'sg-stg-right', ms);
    }
  }, function (R, tau, card) {
    for (var i = 0; i < 3; i++) {
      var d = R.docs[i];
      rise(d.r, seg(tau, 0.35 + i * 0.12, 0.75 + i * 0.12), 6);
      var done = tau >= d.at;
      cl(d.r, 'is-done', done);
      if (d.wait) fade(d.wait, 1 - seg(tau, d.at - 0.1, d.at + 0.1));
      rise(d.ok, seg(tau, d.at, d.at + 0.3), 3);
    }
    var v = 0.3 + 0.7 * ease.io(seg(tau, 3.6, 4.7));
    fill(R.bar, v);
    var pc = Math.round(v * 100);
    if (R.pct.__v !== pc) { R.pct.__v = pc; R.pct.textContent = pc + '%'; }
    cl(R.pct, 'is-ok', v >= 1);
    if (R.bal) {
      var st = tau >= 4.7 ? 2 : tau >= 2.7 ? 1 : 0;
      if (R.bal.__st !== st) { R.bal.__st = st; R.bal.textContent = [T('尾款 70% · 见提单副本', 'Balance 70% · on B/L copy'), T('尾款 70% · 已通知客户', 'Balance 70% · customer told'), T('尾款 70% · 已到账，已对账', 'Balance 70% · paid, reconciled')][st]; cl(R.bal, 'is-ok', st === 2); }
    }
  });

  /* ---------------- 005 复购与改进 · Growth OS ---------------- */
  var SUGGEST = T('补货 64V 104Ah × 120 组，跟进草稿已备好', 'Reorder 120 × 64V 104Ah; follow-up drafted');
  var reorder = stage('again', 'Growth OS', 'repeat', 9.6, 7.4, function (R, b, card) {
    if (card) {
      var hd = box('sg-stg-head', b, 12, 40, 312, 18);
      el('span', 'sg-stg-cc', hd, 'ID');
      el('b', '', hd, 'PT Surya Energi'); el('span', 'sg-stg-dim', hd, T('雅加达', 'Jakarta'));
      R.due = el('span', 'sg-stg-pill is-run', hd, T('该补货了', 'Restock due'));
      // the order rhythm: three past orders 60 days apart, then today
      var axY = 104, x0 = 40, x3 = 296, step = (x3 - x0) / 3;
      box('sg-stg-axis', b, x0, axY, x3 - x0, 1);
      R.gap = box('sg-stg-gap', b, x0 + 2 * step, axY - 1, step, 3);
      R.gapFill = el('i', '', R.gap);
      var labels = [T('180 天前', '180 days'), T('120 天前', '120 days'), T('60 天前', '60 days'), T('今天', 'Today')];
      for (var i = 0; i < 4; i++) {
        var x = x0 + i * step;
        var dot = box(i < 3 ? 'sg-stg-dot' : 'sg-stg-dot is-today', b, x - 5, axY - 5, 10, 10);
        if (i === 3) { R.today = dot; R.ring = el('i', 'sg-stg-ring', dot); }
        box('sg-stg-tick sg-stg-dim', b, x - 44, axY + 10, 88, 14, labels[i]);
        if (i < 3) glyph('box', box('sg-stg-order', b, x - 7, axY - 22, 14, 14), 14, 'sg-ico');
      }
      R.days = box('sg-stg-days', b, x0 + 2 * step, axY - 26, step, 16);
      var s = R.sug = box('sg-stg-note', b, 12, 136, 312, 50);
      var sk = el('div', 'sg-stg-note-k', s); glyph('spark', sk, 12); el('span', '', sk, T('AI 建议', 'AI suggestion'));
      R.text = typer(el('div', 'sg-stg-note-v', s), SUGGEST);
      var act = box('sg-stg-act', b, 12, 194, 312, 24);
      R.gate = el('span', 'sg-stg-gate', act); glyph('shield', R.gate, 13); el('span', '', R.gate, T('等你确认', 'Awaiting your OK'));
      R.hold = el('span', 'sg-stg-dim sg-stg-right', act, T('确认后才会联系客户', 'No contact until you confirm'));
    } else {
      var mh = box('sg-stg-head', b, 8, 31, 164, 16);
      el('b', '', mh, 'PT Surya Energi');
      var big = box('sg-stg-bigrow', b, 8, 52, 164, 28);
      R.days = el('b', 'sg-stg-big', big); el('span', 'sg-stg-dim', big, T('距上次下单', 'since last order'));
      var g = box('sg-stg-act', b, 8, 88, 164, 24);
      R.gate = el('span', 'sg-stg-gate', g); glyph('shield', R.gate, 12); el('span', '', R.gate, T('等你确认', 'Needs your OK'));
    }
  }, function (R, tau, card) {
    var p = ease.io(seg(tau, 0.6, 2.4)), d = Math.round(60 * p);
    if (R.days.__v !== d) { R.days.__v = d; R.days.textContent = card ? T('已 ' + d + ' 天', d + ' days') : d + T(' 天', ' days'); }
    var due = tau >= 2.4;
    if (card) {
      fill(R.gapFill, p);
      tone(R.today, due ? 'due' : '');
      ping(R.ring, tau - 2.4, due);
      rise(R.due, seg(tau, 2.45, 2.8), 4);
      rise(R.sug, seg(tau, 3.0, 3.4), 6);
      typeTo(R.text, seg(tau, 3.3, 3.3 + R.text.__ch.length / (K.ZH ? 14 : 30)));
      rise(R.gate.parentNode, seg(tau, 5.4, 5.75), 4);
      cl(R.gate, 'is-on', tau >= 5.4);
      fade(R.hold, seg(tau, 5.6, 6.0));
    } else {
      cl(R.days, 'is-due', due);
      rise(R.gate, seg(tau, 3.0, 3.35), 4);
      cl(R.gate, 'is-on', tau >= 3.0);
    }
  });

  return { 'stage-find': prospect, 'stage-sell': deal, 'stage-make': order, 'stage-pay': collect, 'stage-again': reorder };
});
