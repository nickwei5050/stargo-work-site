/* STAGES — the homepage's five business stages (主动获客 … 复购与改进), where
   the owner's photographs P01–P05 were (tools/replaceables.mjs HOME_STAGES).

   Each stage keeps its own picture box, so Mono's own switching (one
   `.service-media-wrap` lit at a time, js/stargo-stage-hold.js for the gaps)
   is untouched: five hosts, five small scenes. A host whose box is at opacity
   0 is not ticked (the runner checks it every 250 ms).

   One demo deal runs through the five, with the site's one demo cast:
     001 Growth OS · the shortlist: Nordwerk Energie GmbH 94 and Gulf Coast
         Lift Supply 91, with the reason written down → 建议先开发;
     002 Sales Desk · Müller Energie's inquiry (200 pcs 48V 100Ah, DAP
         Hamburg) → the needs read out → an AI draft of quote Q-1042 → 等你审批,
         and nothing is sent before you approve;
     003 ERP · the order PI-1042: 排产 → 质检 → 装柜 with dates, against the
         date sales promised;
     004 ERP · its documents (发票 / 装箱单 / 提单) tick off and the payment
         goes from the 30% deposit to 100%, reconciled;
     005 Growth OS · PT Surya Energi is due to restock (60 days since the last
         order) → a suggested reorder → 等你确认.
   Every name and number is demo data and each scene says so in its bar.

   A stage is often lit for well under a second while the visitor scrolls, so
   every frame reads: the cards, rows and steps are always there and only the
   details move (scores count, text types, steps tick, the gate appears). The
   key line lands within about 2 s of a loop's start, and a stage opens on its
   finished frame as the last detail settles (start, and cue() each time it
   is lit again), holds it, and replays.

   tick(t) is a pure function of time; only transform and opacity animate.
   Layouts, by the box's width (3:2), so the scale stays near 1:
     card   336 × 224  from 330px (1440px screens and up)
     cards  272 × 181  245–329px (about 1100–1439px screens)
     mini   180 × 120  165–244px (tablets)
     micro  the box's own size, under 165px (phones in landscape): the app
            mark, one big figure and its state, laid out by flexbox */
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
  // an element that rises into place (p 0 → 1), times k, the fade before a loop restarts
  function rise(e, p, dy, k) {
    if (k == null) k = 1;
    if (p <= 0 || k <= 0) { put(e, '-opacity', '0'); put(e, '-transform', e.__dy || (e.__dy = 'translateY(' + (dy || 8) + 'px)')); return; }
    var q = ease.out(Math.min(p, 1)), o = q * k;
    put(e, '-opacity', o >= 1 ? '1' : o.toFixed(3));
    put(e, '-transform', q >= 1 ? 'none' : 'translateY(' + ((1 - q) * (dy || 8)).toFixed(2) + 'px)');
  }
  // a ring that pings outwards while `on` (driven by the clock, so it stops whenever the scene does)
  function ping(e, t, on) {
    if (!on) { put(e, '-opacity', '0'); return; }
    var u = (t * 0.66) % 1;
    put(e, '-opacity', (0.85 * (1 - u)).toFixed(3));
    put(e, '-transform', 'scale(' + (0.7 + 0.75 * ease.out(u)).toFixed(3) + ')');
  }
  function fade(e, p) { put(e, '-opacity', p <= 0 ? '0' : p >= 1 ? '1' : ease.out(p).toFixed(3)); }
  function fill(e, v) { put(e, '-transform', v <= 0 ? 'scaleX(0)' : v >= 1 ? 'none' : 'scaleX(' + v.toFixed(4) + ')'); }
  // text typed out character by character; the characters are split once
  function typer(e, s) { e.__ch = Array.from(s); e.__n = -1; return e; }
  function typeTo(e, p) {
    var n = Math.round(e.__ch.length * (p <= 0 ? 0 : p >= 1 ? 1 : p));
    if (n !== e.__n) { e.__n = n; e.textContent = e.__ch.slice(0, n).join(''); }
    cl(e, 'is-typing', p > 0 && p < 1);
  }
  function text(e, v) { if (e.__v !== v) { e.__v = v; e.textContent = v; } }
  function fmt(n) { return Math.round(n).toLocaleString(K.ZH ? 'zh-CN' : 'en-US'); }
  function tone(e, name) { if (e.__tone === name) return; if (e.__tone) e.classList.remove('is-' + e.__tone); e.__tone = name; if (name) e.classList.add('is-' + name); }

  var TAG = T('动态示意 · 演示数据', 'Illustrative motion · demo data'), TAG_S = T('演示数据', 'Demo data');
  var LAYOUTS = { card: { w: 336, h: 224 }, cards: { w: 272, h: 181 }, mini: { w: 180, h: 120 } };
  function pick(w, h) {
    // card from 330 px (scale 0.98+; --sg-fit covers the last 2%): the 316 px box at 1366 takes cards at 1.16,
    // where the full card would scale to 0.94 and its English rows would need more room than they have
    if (w >= 330) return 'card';
    if (w >= 245) return 'cards';
    if (w >= 165) return 'mini';
    var W = Math.max(90, Math.round(w)), H = Math.max(60, Math.round(h)), k = 'micro-' + W + 'x' + H;
    if (!LAYOUTS[k]) LAYOUTS[k] = { w: W, h: H, micro: true };
    return k;
  }

  /* One stage: its bar (app mark, app name, the honesty tag) over a body.
     `done` is when the frame is complete; M is the micro layout's figure:
     [count to (or null), its text, the state under it, count from]. */
  function stage(key, app, g, P, done, build, tick, M) {
    var open = done - 0.3;
    return function () {
      var R = {};
      return {
        layouts: LAYOUTS, pick: pick, scaleVar: true,   // --sg-fit keeps the small type at 12 px+ (css/stargo-motion-stages.css)
        build: function (st, L, name) {
          var m = L.micro ? 'micro' : name;
          R = { m: m, card: m === 'card', cs: m === 'cards', k: 1 };
          st.className = 'sg-mo-stage sg-stg sg-stg--' + key + ' is-' + m;
          var bar = el('div', 'sg-stg-bar', st);
          var mk = el('span', 'sg-stg-mark', bar); glyph(g, mk, m === 'micro' ? 9 : m === 'mini' ? 10 : 12);
          if (m !== 'micro') el('b', 'sg-stg-app', bar, app);
          el('span', 'sg-stg-tag', bar, R.card ? TAG : TAG_S);
          R.body = el('div', 'sg-stg-body', st);
          if (m !== 'micro') { build(R, R.body, m); return; }
          var f = el('div', 'sg-stg-fig', R.body);
          R.big = el('b', '', f); R.state = el('span', '', f, M[2]);
        },
        tick: function (t) {
          var tau = mod(t, P);
          R.k = 1 - seg(tau, P - 0.45, P - 0.05);   // the details fade out before the loop restarts
          if (R.m !== 'micro') { tick(R, tau, R.m); return; }
          if (M[0] != null) {   // the figure counts up from M[3] (or 0)
            var f0 = M[3] || 0;
            text(R.big, M[1].replace('#', Math.round(f0 + (M[0] - f0) * ease.out(seg(tau, 0.15, 0.95)))));
            fade(R.big, R.k);
          } else text(R.big, M[1]);
          rise(R.state, seg(tau, 1.0, 1.3), 4, R.k);
        },
        still: done + 2.4, start: open,
        // lit again: open on (nearly) the finished frame unless it is already showing
        cue: function (t) { var tau = mod(t, P); return tau >= open && tau < P - 1.6 ? t : t - tau + (tau >= open ? P : 0) + open; }
      };
    };
  }

  /* ---------------- 001 主动获客 · Growth OS ---------------- */
  var PROSPECTS = [
    ['DE', 'Nordwerk Energie GmbH', 'Nordwerk', T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), 94],
    ['US', 'Gulf Coast Lift Supply', 'Gulf Coast', T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), 91]
  ];
  var REASON = T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配，建议优先联系采购经理。',
    'Three storage tenders in 90 days; fits 48V 100Ah. Contact the buyer first.');
  var REASON_S = T('近 90 天发布 3 条储能招标，与 48V 100Ah 高度匹配。', 'Three storage tenders in 90 days; fits 48V 100Ah.');
  var prospect = stage('find', 'Growth OS', 'radar', 7.4, 1.95, function (R, b, m) {
    var big = m !== 'mini', cs = m === 'cards';
    if (m === 'card') {
      var hd = box('sg-stg-head', b, 12, 38, 312, 16);
      el('b', '', hd, T('候选客户 · 按匹配度', 'Prospects · by fit'));
      R.scan = el('span', 'sg-stg-dim', hd);
    }
    R.rows = PROSPECTS.map(function (p, i) {
      var row = m === 'card' ? box('sg-stg-row', b, 12, 58 + i * 44, 312, 40) : cs ? box('sg-stg-row', b, 10, 33 + i * 38, 252, 35) : box('sg-stg-row', b, 8, 31 + i * 44, 164, 38);
      if (m === 'card') el('span', 'sg-stg-cc', row, p[0]);
      var mn = el('div', 'sg-stg-main', row);
      el('b', '', mn, big ? p[1] : p[2]);
      if (big) el('span', '', mn, p[3]);
      var s = el('div', 'sg-stg-score', row);
      return { row: row, n: el('b', '', s, '0'), f: el('i', '', el('i', 'sg-stg-track', s)), v: p[4] };
    });
    if (big) {
      var ai = box('sg-stg-note', b, cs ? 10 : 12, cs ? 111 : 148, cs ? 252 : 312, cs ? 62 : 64);
      var ah = el('div', 'sg-stg-note-k', ai); glyph('spark', ah, 12); el('span', '', ah, cs ? T('AI 判断', 'AI reasoning') : T('AI 判断 · Nordwerk Energie', 'AI reasoning · Nordwerk Energie'));
      R.pick = el('span', 'sg-stg-flag', ah, T('建议先开发', 'Contact first'));
      R.why = typer(el('div', 'sg-stg-note-v', ai), cs ? REASON_S : REASON);
    }
  }, function (R, tau, m) {
    for (var i = 0; i < 2; i++) {
      var r = R.rows[i], p = ease.out(seg(tau, 0.15 + i * 0.15, 0.85 + i * 0.15));
      text(r.n, String(Math.round(r.v * p)));
      fill(r.f, p * r.v / 100);
      fade(r.n, R.k); fade(r.f, R.k);
    }
    cl(R.rows[0].row, 'is-pick', tau >= 0.9 && R.k > 0.5);
    if (m === 'mini') return;
    if (R.scan) text(R.scan, T('已扫描 ', 'Scanned ') + fmt(12480 + Math.floor(seg(tau, 0, 1.4) * 26) * 12));
    typeTo(R.why, seg(tau, 0.45, 0.45 + R.why.__ch.length / (K.ZH ? 36 : 70)));
    fade(R.why, R.k);
    rise(R.pick, seg(tau, 1.6, 1.9), 4, R.k);
  }, [94, '#', 'Nordwerk']);

  /* ---------------- 002 外贸销售 · Sales Desk ---------------- */
  var deal = stage('sell', 'Sales Desk', 'chat', 7.4, 2.0, function (R, b, m) {
    if (m === 'mini') {
      var mq = box('sg-stg-card', b, 8, 31, 164, 46);
      el('b', 'sg-stg-name', mq, 'Müller Energie');
      var ch = el('div', 'sg-stg-chips', mq);
      R.chips = ['48V 100Ah', T('200 组', '200 pcs')].map(function (c) { return el('span', 'sg-stg-chip', ch, c); });
      var g = box('sg-stg-act', b, 8, 86, 164, 24);
      R.btn = el('span', 'sg-stg-btn', g, T('AI 草稿 Q-1042', 'AI draft Q-1042'));
      R.gate = el('span', 'sg-stg-gate', g); glyph('shield', R.gate, 12); el('span', '', R.gate, T('等你审批', 'Needs approval'));
      return;
    }
    var cs = m === 'cards', x = cs ? 10 : 12, w = cs ? 252 : 312;
    var q = box('sg-stg-card', b, x, cs ? 34 : 40, w, cs ? 50 : 54);
    var top = el('div', 'sg-stg-line', q); glyph('mail', top, 13, 'sg-ico sg-stg-dim');
    el('b', '', top, 'Müller Energie GmbH'); if (!cs) el('span', 'sg-stg-dim', top, T('德国', 'Germany')); el('span', 'sg-stg-time', top, '09:12');
    var msg = el('div', 'sg-stg-msg', q);
    if (cs) {   // no room for a chips row: the AI marks the needs inside the message
      R.chips = ['200 pcs', ' ', '48V 100Ah', ', ', 'DAP Hamburg', '?'].map(function (c, i) { return i % 2 ? (msg.appendChild(document.createTextNode(c)), null) : el('span', 'sg-stg-hl', msg, c); }).filter(Boolean);
    } else {
      msg.textContent = '200 pcs 48V 100Ah, DAP Hamburg?';
      var chips = box('sg-stg-chips', b, x, 101, w, 22);
      el('span', 'sg-stg-dim', chips, T('AI 识别', 'AI reads'));
      R.chips = ['48V 100Ah', T('200 组', '200 pcs'), T('DAP 汉堡', 'DAP Hamburg')].map(function (c) { return el('span', 'sg-stg-chip', chips, c); });
    }
    var d = box('sg-stg-card is-draft', b, x, cs ? 92 : 130, w, cs ? 48 : 54);
    var dk = el('div', 'sg-stg-note-k', d); glyph('spark', dk, 12); el('span', '', dk, T('AI 草稿 · 报价 Q-1042', 'AI draft · quote Q-1042'));
    R.text = typer(el('div', 'sg-stg-msg', d), cs ? 'Hi Mr. Müller, Q-1042 attached.' : 'Hi Mr. Müller, quote Q-1042 is attached.');
    var act = box('sg-stg-act', b, x, cs ? 150 : 192, w, cs ? 20 : 24);
    R.btn = el('span', 'sg-stg-btn', act, T('提交审批', 'Send for approval'));
    R.gate = el('span', 'sg-stg-gate', act); glyph('shield', R.gate, 13); el('span', '', R.gate, T('等你审批', 'Needs approval'));
    R.hold = el('span', 'sg-stg-dim sg-stg-right', act, cs ? T('批准前不会发送', 'Not sent until then') : T('批准前不会发送', 'Not sent until you approve'));
  }, function (R, tau, m) {
    var mini = m === 'mini';
    for (var i = 0; i < R.chips.length; i++) { var a = 0.15 + i * 0.15; cl(R.chips[i], 'is-new', tau >= a && R.k > 0.5); }
    var press = mini ? 0.85 : 1.25, gate = mini ? 1.05 : 1.45;
    if (!mini) { typeTo(R.text, seg(tau, 0.45, 1.2)); fade(R.text, R.k); rise(R.hold, seg(tau, 1.55, 1.85), 3, R.k); }
    cl(R.btn, 'is-press', tau >= press && tau < gate);
    fade(R.btn, Math.max(1 - seg(tau, gate - 0.1, gate + 0.05), 1 - R.k));
    rise(R.gate, seg(tau, gate, gate + 0.3), 4, R.k);
  }, [null, 'Q-1042', T('等你审批', 'To approve')]);

  /* ---------------- 003 企业履约 · ERP ---------------- */
  var STEPS = [
    { k: T('排产', 'Production'), m: T('排产', 'Make'), d: T('11/02', 'Nov 2') },
    { k: T('质检', 'QC'), m: T('质检', 'QC'), d: T('11/09', 'Nov 9') },
    { k: T('装柜', 'Loading'), m: T('装柜', 'Load'), d: T('11/12', 'Nov 12') }
  ];
  var PHASE = [   // [from, status pill, the line under the steps]
    [0, T('待排产', 'Scheduled'), T('计划已排 · 物料齐套', 'Planned · materials ready')],
    [0.1, T('生产中', 'In production'), ''],
    [0.9, T('质检中', 'In QC'), T('抽检 20 组 · 容量、内阻、外观', '20 sampled · capacity, resistance, finish')],
    [1.25, T('质检通过', 'QC passed'), T('抽检 20 组 · 全部合格', '20 packs sampled · all passed')],
    [1.45, T('装柜中', 'Loading'), T('1 × 20GP · 装柜中', '1 × 20GP · loading')],
    [1.85, T('已装柜', 'Loaded'), T('1 × 20GP · 已装柜', '1 × 20GP · loaded')]
  ];
  var AT = [[0.1, 0.9], [0.9, 1.25], [1.45, 1.85]];   // each step runs, then is done
  var order = stage('make', 'ERP', 'box', 7.4, 2.15, function (R, b, m) {
    var cs = m === 'cards', mini = m === 'mini', x = cs ? 10 : 12, w = cs ? 252 : 312;
    var xs = mini ? [26, 90, 154] : cs ? [44, 136, 228] : [46, 168, 290], ty = mini ? 61 : cs ? 86 : 104;
    var hd = mini ? box('sg-stg-head', b, 8, 30, 164, 18) : box('sg-stg-head', b, x, cs ? 34 : 40, w, 18);
    el('b', '', hd, 'PI-1042');
    if (m === 'card') el('span', 'sg-stg-dim', hd, 'Müller Energie GmbH');
    R.pill = el('span', 'sg-stg-pill', hd);
    if (!mini) box('sg-stg-sub sg-stg-dim', b, x, cs ? 55 : 61, w, 16, T('48V 100Ah × 200 组 · DAP 汉堡', '48V 100Ah × 200 packs · DAP Hamburg'));
    R.rail = el('i', '', box('sg-stg-rail', b, xs[0], ty - 1, xs[2] - xs[0], 2));
    R.rings = [];
    R.nodes = STEPS.map(function (s, i) {
      var n = box('sg-stg-node', b, xs[i] - 10, ty - 10, 20, 20);
      R.rings.push(el('i', 'sg-stg-ring', n));
      glyph('check', n, 12, 'sg-ico sg-stg-ck');
      var lab = box('sg-stg-step' + (cs ? ' is-inline' : ''), b, xs[i] - 50, ty + (mini ? 13 : 15), 100, null);
      el('b', '', lab, mini || cs ? s.m : s.k);
      if (!mini) el('span', 'sg-stg-dim', lab, s.d);
      return n;
    });
    if (mini) { R.foot = box('sg-stg-foot sg-stg-dim', b, 8, 100, 164, 16, T('承诺装柜 11/12', 'Promised Nov 12')); return; }
    var st = box('sg-stg-status', b, x, cs ? 128 : 166, w, cs ? 18 : 20);
    R.line = el('span', '', st);
    R.made = el('b', 'sg-stg-made', st);
    R.prog = el('i', '', el('i', 'sg-stg-track', st));
    var ft = box('sg-stg-foot', b, x, cs ? 154 : 196, w, cs ? 16 : 20);
    el('span', 'sg-stg-dim', ft, cs ? T('承诺装柜 11/12', 'Promised Nov 12') : T('承诺装柜 11/12', 'Promised loading Nov 12'));
    R.match = el('span', 'sg-stg-ok sg-stg-right', ft); glyph('check', R.match, 12); el('span', '', R.match, T('进度与承诺一致', 'On the promised date'));
  }, function (R, tau, m) {
    var ph = 0;
    for (var i = PHASE.length - 1; i > 0; i--) if (tau >= PHASE[i][0]) { ph = i; break; }
    if (R.pill.__ph !== ph) { R.pill.__ph = ph; R.pill.textContent = PHASE[ph][1]; tone(R.pill, ph === 5 ? 'ok' : ph === 0 ? '' : 'run'); }
    // the rail: node 1 → 2 as QC starts, 2 → 3 as loading starts
    fill(R.rail, 0.5 * ease.io(seg(tau, 0.65, 0.9)) + 0.5 * ease.io(seg(tau, 1.25, 1.45)));
    fade(R.rail, R.k);
    cl(R.rail.parentNode, 'is-ok', tau >= 1.85);   // all three done: one solid tone
    for (var n = 0; n < 3; n++) {
      var run = tau >= AT[n][0] && tau < AT[n][1];
      tone(R.nodes[n], tau >= AT[n][1] ? 'done' : run ? 'run' : '');
      ping(R.rings[n], tau - AT[n][0], run);
    }
    if (m === 'mini') { cl(R.foot, 'is-ok', tau >= 1.85); return; }
    var made = Math.round(200 * ease.io(seg(tau, 0.12, 0.8))), producing = ph === 1;
    text(R.line, producing ? T('生产中 · 已完成', 'In production · done') : PHASE[ph][2]);
    text(R.made, producing ? made + ' / 200' : '');
    cl(R.made.parentNode, 'is-prod', producing);
    fill(R.prog, made / 200);
    rise(R.match, seg(tau, 1.95, 2.25), 4, R.k);
  }, [200, '#', T('组已装柜', 'packs loaded')]);

  /* ---------------- 004 回款与服务 · ERP ---------------- */
  var DOCS = [
    { k: T('商业发票', 'Commercial invoice'), s: 'CI-1042', w: T('待生成', 'To do'), ok: T('已生成', 'Ready'), at: 0.25 },
    { k: T('装箱单', 'Packing list'), s: 'PL-1042', w: T('待生成', 'To do'), ok: T('已生成', 'Ready'), at: 0.5 },
    { k: T('提单', 'Bill of lading'), s: 'B/L', w: T('等船公司', 'With the carrier'), ok: T('已签发', 'Issued'), at: 0.8 }
  ];
  var BAL = [T('尾款 70% · 见提单副本付款', 'Balance 70% · due on B/L copy'), T('尾款 70% · 已通知客户', 'Balance 70% · customer notified'), T('尾款 70% · 已到账，已对账', 'Balance 70% · paid, reconciled')];
  var BAL_S = [T('尾款 · 见提单副本付款', 'Balance due on B/L copy'), T('尾款 · 已通知客户', 'Customer notified'), T('尾款 · 已到账，已对账', 'Paid, reconciled')];
  var collect = stage('pay', 'ERP', 'doc', 7.4, 1.85, function (R, b, m) {
    var cs = m === 'cards', mini = m === 'mini', x = mini ? 8 : cs ? 10 : 12, w = mini ? 164 : cs ? 252 : 312;
    if (!mini) { var hd = box('sg-stg-head', b, x, cs ? 34 : 40, w, 18); el('b', '', hd, 'PI-1042'); el('span', 'sg-stg-dim', hd, T('单证与回款', 'Documents and payment')); }
    R.docs = DOCS.map(function (d, i) {
      var r = mini ? box('sg-stg-doc', b, 8 + i * 56, 31, 52, 40) : box('sg-stg-doc', b, x, (cs ? 56 : 64) + i * (cs ? 24 : 27), w, cs ? 21 : 23);
      glyph('doc', r, mini ? 12 : 13, 'sg-ico sg-stg-dim');
      el('b', '', r, mini ? T(['发票', '装箱单', '提单'][i], ['Invoice', 'Packing', 'B/L'][i]) : d.k);
      if (m === 'card') el('span', 'sg-stg-dim', r, d.s);
      var st = el('span', 'sg-stg-docst', r), wait = mini ? null : el('span', 'sg-stg-wait', st, d.w);
      var ok = el('span', 'sg-stg-done', st); glyph('check', ok, 12); if (!mini) el('span', '', ok, d.ok);
      return { r: r, ok: ok, wait: wait, at: d.at };
    });
    var py = mini ? 80 : cs ? 131 : 152;
    var pk = box('sg-stg-pay', b, x, py, w, mini ? 14 : cs ? 16 : 18);
    el('b', '', pk, T('回款', 'Payment'));
    R.pct = el('b', 'sg-stg-pct', pk);
    var bar = R.paybar = box('sg-stg-paybar', b, x, py + (mini ? 20 : cs ? 20 : 24), w, mini || cs ? 6 : 8);
    R.bar = el('i', '', bar);
    el('i', 'sg-stg-cut', bar);
    if (!mini) {
      var ms = box('sg-stg-ms', b, x, py + (cs ? 30 : 40), w, 16);
      el('span', '', ms, cs ? T('定金 30%', 'Deposit 30%') : T('定金 30% · 已到账', 'Deposit 30% · paid'));
      R.bal = el('span', 'sg-stg-right', ms); R.balT = cs ? BAL_S : BAL;
    }
  }, function (R, tau, m) {
    for (var i = 0; i < 3; i++) {
      var d = R.docs[i], done = tau >= d.at && R.k > 0.5;
      cl(d.r, 'is-done', done);
      if (d.wait) fade(d.wait, done ? 0 : 1);
      rise(d.ok, seg(tau, d.at, d.at + 0.3), 3, R.k);
    }
    var v = 0.3 + 0.7 * ease.io(seg(tau, 0.95, 1.55));
    fill(R.bar, v);
    text(R.pct, Math.round(v * 100) + '%');
    cl(R.pct, 'is-ok', v >= 1);
    cl(R.paybar, 'is-ok', v >= 1);
    if (R.bal) { var st = tau >= 1.55 ? 2 : tau >= 0.8 ? 1 : 0; text(R.bal, R.balT[st]); cl(R.bal, 'is-ok', st === 2); }
  }, [100, '#%', T('已对账', 'Reconciled'), 30]);

  /* ---------------- 005 复购与改进 · Growth OS ---------------- */
  var SUGGEST = T('补货 64V 104Ah × 120 组，跟进草稿已备好', 'Reorder 120 × 64V 104Ah; follow-up drafted');
  var reorder = stage('again', 'Growth OS', 'repeat', 7.4, 1.75, function (R, b, m) {
    if (m === 'mini') {
      el('b', '', box('sg-stg-head', b, 8, 31, 164, 16), 'PT Surya Energi');
      var big = box('sg-stg-bigrow', b, 8, 52, 164, 28);
      R.days = el('b', 'sg-stg-big', big); el('span', 'sg-stg-dim', big, T('距上次下单', 'since last order'));
      var g = box('sg-stg-act', b, 8, 88, 164, 24);
      R.gate = el('span', 'sg-stg-gate', g); glyph('shield', R.gate, 12); el('span', '', R.gate, T('等你确认', 'Needs your OK'));
      return;
    }
    var cs = m === 'cards', x = cs ? 10 : 12, w = cs ? 252 : 312;
    var hd = box('sg-stg-head', b, x, cs ? 34 : 40, w, 18);
    el('span', 'sg-stg-cc', hd, 'ID');
    el('b', '', hd, 'PT Surya Energi');
    if (!cs) el('span', 'sg-stg-dim', hd, T('雅加达', 'Jakarta'));
    R.due = el('span', 'sg-stg-pill is-run', hd, T('该补货了', 'Restock due'));
    // the order rhythm: three past orders 60 days apart, then today
    var axY = cs ? 84 : 102, x0 = cs ? 38 : 40, x3 = cs ? 234 : 296, step = (x3 - x0) / 3;
    box('sg-stg-axis', b, x0, axY, x3 - x0, 1);
    R.gapFill = el('i', '', box('sg-stg-gap', b, x0 + 2 * step, axY - 1, step, 3));
    var ticks = [T('180 天前', '180 d ago'), T('120 天前', '120 d ago'), T('60 天前', '60 d ago'), T('今天', 'Today')];
    for (var i = 0; i < 4; i++) {
      var xi = x0 + i * step;
      var dot = box(i < 3 ? 'sg-stg-dot' : 'sg-stg-dot is-today', b, xi - 5, axY - 5, 10, 10);
      if (i === 3) { R.today = dot; R.ring = el('i', 'sg-stg-ring', dot); }
      box('sg-stg-tick sg-stg-dim', b, xi - 44, axY + 13, 88, 14, ticks[i]);   // clear of the ring round today's dot
    }
    R.days = box('sg-stg-days', b, x0 + 2 * step - 40, axY - 24, step + 80, 16);
    R.dayT = cs ? T('已 # 天', '# days, no order') : T('距上次下单已 # 天', '# days since last order');
    if (cs) {
      var sn = box('sg-stg-note is-line', b, x, 119, w, 26); glyph('spark', sn, 12, 'sg-ico sg-stg-spark');
      R.text = typer(el('div', 'sg-stg-note-v', sn), T('补货 64V 104Ah × 120 组', 'Reorder 120 × 64V 104Ah'));
    } else {
      var s = box('sg-stg-note', b, x, 134, w, 50);
      var sk = el('div', 'sg-stg-note-k', s); glyph('spark', sk, 12); el('span', '', sk, T('AI 建议', 'AI suggestion'));
      R.text = typer(el('div', 'sg-stg-note-v', s), SUGGEST);
    }
    var act = box('sg-stg-act', b, x, cs ? 153 : 192, w, cs ? 20 : 24);
    R.gate = el('span', 'sg-stg-gate', act); glyph('shield', R.gate, 13); el('span', '', R.gate, cs ? T('等你确认', 'Needs your OK') : T('等你确认', 'Awaiting your OK'));
    R.hold = el('span', 'sg-stg-dim sg-stg-right', act, cs ? T('确认后才联系客户', 'No contact until then') : T('确认后才会联系客户', 'No contact until you confirm'));
  }, function (R, tau, m) {
    var p = ease.io(seg(tau, 0.1, 0.65)), d = Math.round(60 * p), due = tau >= 0.65 && R.k > 0.5;
    if (m === 'mini') {
      text(R.days, d + T(' 天', ' days'));
      cl(R.days, 'is-due', due);
      rise(R.gate, seg(tau, 0.9, 1.2), 4, R.k);
      return;
    }
    text(R.days, R.dayT.replace('#', d));
    fade(R.days, R.k);
    fill(R.gapFill, p); fade(R.gapFill, R.k);
    tone(R.today, due ? 'due' : '');
    ping(R.ring, tau - 0.65, due);
    rise(R.due, seg(tau, 0.65, 0.95), 3, R.k);
    typeTo(R.text, seg(tau, 0.7, 0.7 + R.text.__ch.length / (K.ZH ? 36 : 80)));
    fade(R.text, R.k);
    rise(R.gate, seg(tau, 1.3, 1.6), 4, R.k);
    rise(R.hold, seg(tau, 1.45, 1.75), 3, R.k);
  }, [60, T('# 天', '# days'), T('该补货了', 'Restock due')]);

  return { 'stage-find': prospect, 'stage-sell': deal, 'stage-make': order, 'stage-pay': collect, 'stage-again': reorder };
});
