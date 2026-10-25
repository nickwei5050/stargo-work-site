/* 老板驾驶舱 — three code-drawn views of the owner's cockpit, in the column
   beside 「(老板驾驶舱)」 on enterprise.html and en/enterprise.html, where the
   photographs E05–E07 were (owner decision, 2026-10-23). tools/motion-scenes.mjs
   places the hosts, css/stargo-motion-cockpit.css styles them, and the engine
   (js/stargo-motion.js) runs them.

   They show what the paragraph beside them says, with demo data:
     cockpit-overview  商机进展 counts tick up, 交付状态 shows on-time against
                       late, 待审批 rises to 3 and falls back when you approve
                       one; the data-source row lists the five systems the
                       Connect panel above connects (邮箱, 客户记录, 产品知识,
                       ERP, 网盘) and flags the finance folder it leaves
                       unauthorized: 财务目录未授权 · 缺数据，已标出, because
                       figures only come from connected systems.
     cockpit-blocker   「报价 Q-1043 · 负责人 销售 AI · 卡点：缺底价 · 等你」
                       pulses; a person takes it, types the floor price and
                       hands it back; the quote then waits for approval —
                       nothing is sent by itself.
     cockpit-budget    AI 用量 climbs toward the 上限 line, warns at 80%, and
                       when the next batch would cross the limit new work
                       pauses and waits for your approval.

   The slots follow the text column (taller in English) and run from about
   109 × 90 on phones to 690 × 893 on desktop. So each scene is laid out for
   its host's own size at scale 1 instead of scaling one fixed drawing: the
   stage is the host's size, rounded down, in one of three tiers — full (a
   cockpit window, 400px and up), tab (the 235px tablet tiles) and mini (the
   phone thumbnails: one number or one status). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod, flash = K.flash;

  var PATH = {
    gauge: 'M4.2 16.2a7.8 7.8 0 1 1 15.6 0M12 16.2l3.7-4.7M7.4 16.2h.01M16.6 16.2h.01M12 8.8v.01M8.7 10.3v.01',
    alert: 'M12 4.4 3.2 19.4h17.6zM12 10.2v4.2M12 16.9v.01',
    person: 'M12 11.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM5.4 19.4c.9-3.2 3.4-4.8 6.6-4.8s5.7 1.6 6.6 4.8',
    bot: 'M7 9.4h10a2 2 0 0 1 2 2v5.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5.2a2 2 0 0 1 2-2zM12 9.4V6.7M12 5.2v.01M9.6 14h.01M14.4 14h.01',
    pause: 'M9.2 6.5v11M14.8 6.5v11',
    check: K.ICON.check,
    shield: K.ICON.shield
  };
  function ico(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: PATH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }

  /* cached writers: they compare numbers, so a frame that changes nothing writes and allocates nothing */
  function sx(e, x) { x = Math.round(x * 1000) / 1000; if (e.__sx === x) return; e.__sx = x; e.style.transform = 'scaleX(' + x + ')'; }
  function op(e, v) { v = Math.round(v * 100) / 100; if (e.__op === v) return; e.__op = v; e.style.opacity = v; }
  function mv(e, x, y) { x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10; if (e.__mx === x && e.__my === y) return; e.__mx = x; e.__my = y; e.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
  function grow(e, v) { if (e.__g === v) return; e.__g = v; e.style.flexGrow = v; }
  function at(e, k, v) { v = Math.round(v * 10) / 10; var c = e.__at || (e.__at = {}); if (c[k] === v) return; c[k] = v; e.setAttribute(k, v); }
  // a figure: written, and flashed when it changes, only when the value changes
  function num(e, v, quiet) { if (e.__v === v) return; var fl = e.__v !== undefined && !quiet; e.__v = v; e.textContent = K.fmt(v); if (fl) flash(e); }
  // one of a few fixed strings, flashed when it changes
  function say(e, s, quiet) { if (e.__s === s) return; var fl = e.__s !== undefined && !quiet; e.__s = s; put(e, 'text', s); if (fl) flash(e); }
  // the soft fade at the end of a beat and back in at the start of the next
  function beat(e, tau, P, out) { op(e, tau < 0.45 ? 0.3 + 0.7 * ease.out(seg(tau, 0, 0.45)) : 1 - 0.7 * ease.io(seg(tau, out, P))); }
  // a tap's ripple: o.w is placed at the tap, o.i grows and fades over p = 0…1
  function ripple(stage) { var w = el('div', 'sg-ck-ripple', stage); return { w: w, i: el('i', '', w) }; }
  function ring(o, at2, p) {
    var on = p > 0 && p < 1;
    op(o.i, on ? 0.7 * (1 - p) : 0);
    if (!on || !at2) return;
    mv(o.w, at2[0], at2[1]);
    var s = Math.round((0.45 + 1.75 * ease.out(p)) * 100) / 100;
    if (o.i.__rs !== s) { o.i.__rs = s; o.i.style.transform = 'scale(' + s + ')'; }
  }
  // the centre of e in the stage's own (unscaled) pixels
  // (below: just under its right part, so a pointer resting there leaves the text in view)
  function centre(e, stage, below) {
    var x = e.offsetWidth * (below ? 0.7 : 0.5), y = below ? e.offsetHeight + 8 : e.offsetHeight / 2, n = e;
    while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return n === stage ? [x, y] : null;
  }

  /* The stage is the host's own size. Tiers: full from 400 × 300 (desktop), tab from 200 × 180
     (the three 235px tiles at 768–991), mini below (phones: 109–235 wide, 90–250 tall). */
  function sized() {
    var layouts = {};
    return {
      layouts: layouts,
      pick: function (w, h) {
        var W = Math.floor(w), H = Math.floor(h);
        var tier = W >= 400 && H >= 300 ? 'full' : W >= 200 && H >= 180 ? 'tab' : 'mini';
        var name = tier + ' ' + W + 'x' + H;
        if (!layouts[name]) layouts[name] = { w: W, h: H, tier: tier };
        return name;
      }
    };
  }
  // app bar (full: the cockpit's name, a crumb and a status pill; tab: a short name and the tag)
  function chrome(stage, L, cls, crumb, short) {
    var narrow = L.tier === 'full' && L.w < 560;
    stage.className = 'sg-mo-stage sg-ck ' + cls + ' is-' + L.tier + (narrow ? ' is-narrow' : '');
    var R = { tier: L.tier, H: L.h, W: L.w, narrow: narrow, stage: stage, tk: {}, tp: {} };
    if (L.tier === 'mini') return R;
    var bar = el('div', 'sg-app-bar', stage);
    var mk = el('span', 'sg-app-mark', bar); ico('gauge', mk, L.tier === 'full' ? 15 : 12);
    el('b', '', bar, L.tier === 'full' ? T('老板驾驶舱', 'Owner’s cockpit') : short);
    if (L.tier === 'full') {
      el('span', 'sg-app-crumb', bar, crumb);
      R.live = el('span', 'sg-app-live', bar); el('i', '', R.live); R.liveText = el('span', '', R.live);
    } else el('span', 'sg-tag', bar, T('演示数据', 'Demo data'));
    return R;
  }
  function foot(stage, tier) {
    if (tier === 'tab') return;
    var f = el('div', 'sg-ck-foot', stage);
    el('span', 'sg-tag', f, tier === 'full' ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
  }
  function head(parent, title, aside) {
    var h = el('div', 'sg-ck-th', parent);
    el('b', '', h, title);
    return aside ? el('span', '', h, aside) : null;
  }
  function live(R, s, cls) { if (!R.live) return; put(R.liveText, 'text', s); cl(R.live, 'is-idle', cls === 'idle'); cl(R.live, 'is-warn', cls === 'warn'); }
  // where something sits, measured once per beat (layout may change with the text in it)
  function target(R, name, e, k, below) {
    if (R.tk[name] !== k) { R.tk[name] = k; R.tp[name] = centre(e, R.stage, below) || R.tp[name] || [R.W / 2, R.H / 2]; }
    return R.tp[name];
  }
  function owner(parent, name, ai) {
    var o = el('span', 'sg-ck-owner', parent);
    o.av = el('i', 'sg-ck-av' + (ai ? ' is-ai' : ''), o);
    ico('bot', o.av, 13, 'sg-ico sg-ck-av-ai'); ico('person', o.av, 13, 'sg-ico sg-ck-av-p');
    o.t = el('span', '', o, name);
    return o;
  }

  /* =====================================================================
     OVERVIEW — 商机进展, 交付状态, 待审批, and where the figures come from.
     One 12 s beat: an inquiry arrives (1 s), an order is delivered on time
     (3 s), a new quote joins the approvals (5 s), the sources sync and the
     unauthorized finance folder is flagged (7 s), you approve the oldest item (9.2 s), the
     next order ships (10.8 s). Counts carry over from beat to beat, so the
     loop never jumps back.
     ===================================================================== */
  function OverviewScene() {
    var P = 12, IN = 1, SHIP = 3, QUOTE = 5, SYNC = 7, OK = 9.2, OUT = 9.7, SHIP2 = 10.8;
    // what joins the approvals; each number is one deal across the site: Q-1041 is the approved forklift
    // order (PI-1041), Q-1043 the Swedish quote blocked in BLOCKER (handed back, it waits for approval),
    // PI-2207 the Nigerian proforma done there. The first three are the queue the still shows (k = 0: oldest
    // at the foot, Q-1043 joining on top) and the week's three approvals of the enterprise 经营 / Operate panel
    // (js/stargo-motion-enterprise.js OperateScene): the German outreach (20 emails, awaiting approval in
    // BLOCKER too), quote Q-1042 below the floor price, the quote the whole page waits on, and Q-1043. QA round 5
    // (2026-10-24): the queue used to be Q-1039, samples and outreach, so it never held Q-1042 or Q-1043.
    var POOL = [
      [T('开发信', 'Outreach'), T('20 封', '20 emails')],
      [T('报价 Q-1042', 'Quote Q-1042'), T('低于底价', 'Below floor')],
      [T('报价 Q-1043', 'Quote Q-1043'), T('瑞典', 'Sweden')],
      [T('样品寄送', 'Samples'), T('2 组', '2 sets')],
      [T('报价 Q-1044', 'Quote Q-1044'), T('波兰', 'Poland')],
      [T('形式发票 PI-2208', 'Proforma PI-2208'), T('越南', 'Vietnam')]
    ];
    // the same five systems ent-connect (js/stargo-motion-enterprise.js) connects, 5/5; the drive's finance folder
    // is the one it leaves unauthorized, so its figures are missing here and flagged
    var SRC = [T('邮箱', 'Email'), T('客户记录', 'Customers'), T('产品知识', 'Products'), 'ERP', T('网盘', 'Drive')];
    var NOTE = [T(' · 运输中 · 预计今天', ' · in transit · due today'), T(' · 已签收 · 准时 ✓', ' · delivered on time ✓'), T(' · 已发货 · 运输中', ' · shipped · in transit')];
    var NOTE_S = [T(' · 预计今天到', ' · due today'), T(' · 准时签收 ✓', ' · on time ✓'), T(' · 已发货', ' · shipped')];
    var MINI = [T('等你拍板', 'Your call'), T('新报价 · 等你', 'Needs your OK'), T('你已批准 ✓', 'You approved ✓')];
    var S = sized(), R;

    function build(stage, L) {
      R = chrome(stage, L, 'sg-ck-ov', T('总览', 'Overview'), T('驾驶舱总览', 'Cockpit'));
      live(R, T('已接入 5/5', '5 of 5 connected'));
      var body = el('div', 'sg-ck-body', stage);
      if (R.tier === 'full') {
        var fu = el('div', 'sg-ck-tile sg-ck-funnel', body);
        head(fu, T('商机进展', 'Opportunities'), T('本月', 'This month'));
        R.fun = [T('询盘', 'Inquiries'), T('报价', 'Quoted'), T('样品', 'Samples'), T('成交', 'Won')].map(function (n) {
          var r = el('div', 'sg-ck-fun', fu);
          el('span', 'sg-ck-fun-k', r, n);
          var tr = el('i', 'sg-ck-track', r);
          var o = { f: el('i', '', tr) };
          var v = el('span', 'sg-ck-fun-v', r);
          o.d = el('em', 'sg-ck-delta', v, '+1'); o.v = el('b', '', v);
          return o;
        });
        var de = el('div', 'sg-ck-tile sg-ck-deliv', body);
        head(de, T('交付状态', 'Delivery'), T('本月订单', 'Orders this month'));
        var st = el('div', 'sg-ck-dstats', de);
        [['is-ok', T('准时', 'On time')], ['is-late', T('延迟', 'Late')], ['is-way', T('运输中', 'In transit')]].forEach(function (s, i) {
          var c = el('span', 'sg-ck-dstat ' + s[0], st); el('i', '', c);
          R[['on', 'late', 'way'][i]] = el('b', '', c); el('span', '', c, s[1]);
        });
        var sb = el('div', 'sg-ck-stack', de);
        R.segOn = el('i', 'is-ok', sb); R.segLate = el('i', 'is-late', sb); R.segWay = el('i', 'is-way', sb);
        R.dnote = el('div', 'sg-ck-dnote', de);
        var ap = el('div', 'sg-ck-tile sg-ck-appr', body);
        head(ap, T('待审批', 'Awaiting approval'), T('按期限', 'By deadline'));
        var ab = el('div', 'sg-ck-abody', ap);
        R.n = el('b', 'sg-ck-big', ab);
        R.list = el('div', 'sg-ck-alist', ab);
        R.rowH = 30;
        R.rows = POOL.map(function (p) {
          var r = el('div', 'sg-ck-arow', R.list);
          el('b', '', r, p[0]); el('span', '', r, p[1]); var ok = el('em', '', r); el('small', 'sg-ck-okt', ok, T('已批准 ', 'Approved ')); ok.appendChild(document.createTextNode('✓'));
          r.style.opacity = '0';
          return r;
        });
        var so = el('div', 'sg-ck-tile sg-ck-src', body);
        el('span', 'sg-ck-src-h', so, T('数据来源', 'Data sources'));
        R.src = SRC.map(function (n) { var c = el('span', 'sg-ck-chip', so); ico('check', c, 13); el('span', '', c, n); return c; });
        R.gap = el('span', 'sg-ck-chip is-gap', so); ico('alert', R.gap, 14); el('span', '', R.gap, T('财务目录未授权 · 缺数据，已标出', 'Finance folder not authorized · flagged'));
      } else if (R.tier === 'tab') {
        var l1 = el('div', 'sg-ck-line', body);
        el('span', 'sg-ck-k', l1, T('商机进展', 'Opportunities'));
        var v1 = el('span', 'sg-ck-v', l1);
        var f0 = { d: el('em', 'sg-ck-delta', v1, '+1') };
        f0.v = el('b', '', v1); el('span', '', v1, T(' 询盘', ' inquiries'));
        R.fun = [f0];
        var l2 = el('div', 'sg-ck-line is-two', body);
        el('span', 'sg-ck-k', l2, T('交付状态', 'Delivery'));
        var v2 = el('span', 'sg-ck-v', l2);
        var vo = el('span', 'sg-ck-okc', v2); if (ZHs()) el('span', '', vo, '准时 '); R.on = el('b', '', vo); if (!ZHs()) el('span', '', vo, ' on time');
        el('span', 'sg-ck-sep', v2, ' · ');
        var vl = el('span', 'sg-ck-latec', v2); if (ZHs()) el('span', '', vl, '延迟 '); R.late = el('b', '', vl); if (!ZHs()) el('span', '', vl, ' late');
        var sb2 = el('div', 'sg-ck-stack', l2);
        R.segOn = el('i', 'is-ok', sb2); R.segLate = el('i', 'is-late', sb2); R.segWay = el('i', 'is-way', sb2);
        var l3 = el('div', 'sg-ck-line', body);
        el('span', 'sg-ck-k', l3, T('待审批', 'Awaiting approval'));
        R.n = el('b', 'sg-ck-big', l3);
        R.gap = el('span', 'sg-ck-chip is-gap', body); ico('alert', R.gap, 13); el('span', '', R.gap, T('财务目录未授权 · 已标出', 'Finance not authorized'));
      } else {
        el('span', 'sg-ck-k', body, T('待审批', 'Approvals'));
        R.n = el('b', 'sg-ck-big', body);
        R.st = el('span', 'sg-ck-mst', body);
      }
      foot(stage, R.tier);
    }

    function tick(t) {
      var k = Math.floor(t / P), tau = t - k * P;
      num(R.n, 2 + (tau >= QUOTE ? 1 : 0) - (tau >= OUT ? 1 : 0));
      cl(R.n, 'is-new', tau >= QUOTE && tau < OK);
      if (R.st) {
        var ph = tau < QUOTE ? 0 : tau < OK ? 1 : 2;
        say(R.st, MINI[ph]);
        cl(R.st, 'is-wait', ph === 1); cl(R.st, 'is-ok', ph === 2);
      }
      if (R.fun) {
        var v0 = 41 + k + (tau >= IN ? 1 : 0);
        for (var f = 0; f < R.fun.length; f++) {
          var o = R.fun[f], v = f === 0 ? v0 : f === 1 ? 17 + k + (tau >= QUOTE ? 1 : 0) : f === 2 ? 7 + Math.floor((k + 2) / 3) : 3 + Math.floor((k + 4) / 6);
          num(o.v, v);
          if (o.f) sx(o.f, v / v0);
          if (o.d) cl(o.d, 'is-on', f === 0 ? tau >= IN && tau < IN + 1.6 : f === 1 && tau >= QUOTE && tau < QUOTE + 1.6);
        }
      }
      if (R.on) {
        var onT = 11 + k + (tau >= SHIP ? 1 : 0), way = tau < SHIP || tau >= SHIP2 ? 1 : 0;
        num(R.on, onT); num(R.late, 2);
        if (R.way) num(R.way, way, true);
        grow(R.segOn, onT); grow(R.segLate, 2); grow(R.segWay, way);
        cl(R.segWay, 'is-gone', !way);
        if (R.dnote) {
          var dp = tau < SHIP ? 0 : tau < SHIP2 ? 1 : 2, key = k * 4 + dp;
          if (R.dk !== key) {
            var fl = R.dk !== undefined;
            R.dk = key;
            // customer orders run from PO-3301 up, clear of the proformas PI-2207 / PI-2208 named beside them
            put(R.dnote, 'text', 'PO-' + (3301 + k + (dp === 2 ? 1 : 0)) + (R.narrow ? NOTE_S : NOTE)[dp]);
            cl(R.dnote, 'is-ok', dp === 1);
            if (fl) flash(R.dnote);
          }
        }
      }
      if (R.rows) {
        // newest on top: the oldest of three is approved and leaves; next beat starts where this one ends
        var a = mod(k, 6), b = mod(k + 1, 6), c = mod(k + 2, 6), m = ease.io(seg(tau, QUOTE, QUOTE + 0.6)), H = R.rowH;
        for (var i = 0; i < 6; i++) {
          var r = R.rows[i];
          if (i === c) { var e1 = ease.out(seg(tau, QUOTE, QUOTE + 0.55)); mv(r, 0, -10 * (1 - e1)); op(r, e1); cl(r, 'is-new', tau >= QUOTE && tau < OK); cl(r, 'is-ok', false); }
          else if (i === b) { mv(r, 0, H * m); op(r, 1); cl(r, 'is-new', false); cl(r, 'is-ok', false); }
          else if (i === a) { var q = ease.io(seg(tau, OUT, OUT + 0.5)); mv(r, 18 * q, H * (1 + m)); op(r, 1 - q); cl(r, 'is-ok', tau >= OK); cl(r, 'is-new', false); }
          else { op(r, 0); cl(r, 'is-ok', false); cl(r, 'is-new', false); }
        }
      }
      if (R.src) for (var j = 0; j < R.src.length; j++) cl(R.src[j], 'is-sync', tau >= SYNC + j * 0.22 && tau < SYNC + j * 0.22 + 0.7);
      if (R.gap) cl(R.gap, 'is-ping', R.tier === 'full' ? tau >= SYNC + 0.9 && tau < SYNC + 2.2 : tau >= SYNC && tau < SYNC + 1.3);
    }

    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 8.4 };
  }
  function ZHs() { return K.ZH; }

  /* =====================================================================
     BLOCKER — 任务负责人和卡点. The quote Q-1043 is held up by a missing floor
     price and waits for you; a person takes it (a visible tap), types the
     price and hands it back to the sales AI, which updates the quote; the
     quote then waits for approval. 14 s, ending on a soft fade back.
     ===================================================================== */
  function BlockerScene() {
    var P = 14, IN0 = 1.2, TAP1 = 2.5, TY0 = 3.4, TY1 = 4.5, TAP2 = 5.9, REVIEW = 8, FADE = 13.4;
    var PRICE = ['', '8', '86', '86.', '86.0', '86.00'];
    var TASKS = [
      [T('样品寄送 S-0318', 'Samples S-0318'), T('巴西', 'Brazil'), T('跟单 AI', 'Order AI'), 1, 'run', T('进行中', 'In progress'), T('周五', 'Fri')],
      [T('开发信 · 德国储能', 'Outreach · German storage'), T('20 封', '20 emails'), T('获客 AI', 'Prospecting AI'), 1, 'review', T('待审批', 'Awaiting approval'), T('明天', 'Tomorrow')],
      [T('验厂资料', 'Factory audit files'), T('印尼客户', 'Indonesia'), T('质检主管', 'QC lead'), 0, 'run', T('进行中', 'In progress'), T('周四', 'Thu')],
      [T('形式发票 PI-2207', 'Proforma PI-2207'), T('尼日利亚', 'Nigeria'), T('跟单 AI', 'Order AI'), 1, 'done', T('已完成 · 结果已核对', 'Done · result checked'), T('昨天', 'Yesterday')]
    ];
    var OWN = [T('负责人 销售 AI', 'Owner: Sales AI'), T('负责人 你', 'Owner: you')];
    var OWN_S = [T('销售 AI', 'Sales AI'), T('你', 'You')];
    var STATE = [T('等你', 'Needs you'), T('你在处理', 'You’re on it'), T('进行中 · 更新报价', 'In progress · updating quote'), T('待审批', 'Awaiting approval')];
    var STATE_S = [T('等你', 'Needs you'), T('你在处理', 'You’re on it'), T('进行中', 'In progress'), T('待审批', 'Awaiting OK')];
    var MINI = [T('等你', 'Needs you'), T('你已接手', 'You took it'), T('已交回 ✓', 'Returned ✓')];
    var S = sized(), R;

    function task(list, d, compact) {
      var r = el('div', 'sg-ck-task', list);
      var top = el('div', 'sg-ck-task-top', r);
      el('b', '', top, d[0]);
      if (!compact) el('span', 'sg-ck-task-sub', top, d[1]);
      var due = d[6] ? el('span', 'sg-ck-due', top, d[6]) : null;
      var bot = el('div', 'sg-ck-task-bot', r);
      var o = owner(bot, compact ? d[2] : T('负责人 ', 'Owner: ') + d[2], d[3]);
      var chips = el('span', 'sg-ck-chips', bot);
      var st = el('span', 'sg-ck-st is-' + d[4], chips, compact && d[4] === 'done' ? T('已完成', 'Done') : d[5]);
      return { r: r, top: top, due: due, o: o, chips: chips, st: st };
    }

    function build(stage, L) {
      R = chrome(stage, L, 'sg-ck-bl', T('任务与卡点', 'Tasks & blockers'), T('任务与卡点', 'Blockers'));
      var body = R.body = el('div', 'sg-ck-body', stage);
      if (R.tier !== 'mini') {
        var full = R.tier === 'full', list = el('div', 'sg-ck-tasks', body);
        var q = R.q = task(list, [T('报价 Q-1043', 'Quote Q-1043'), T('瑞典', 'Sweden'), T('销售 AI', 'Sales AI'), 1, 'block', '', full ? T('今天', 'Today') : ''], !full);
        q.r.classList.add('is-key');
        // the blocker itself: beside the status on desktop, in place of the deadline on the small tile
        if (full) { R.why = el('span', 'sg-ck-why', null, T('卡点：缺底价', 'Blocker: no floor price')); q.chips.insertBefore(R.why, q.st); }
        else R.why = el('span', 'sg-ck-why', q.top, T('缺底价', 'No floor price'));
        // as many of the other tasks as the height holds
        var more = full ? (R.H >= 840 ? 4 : R.H >= 700 ? 3 : 2) : 2;
        for (var i = 0; i < more; i++) task(list, TASKS[full ? i : [0, 3][i]], !full);
        if (full) {
          var d = el('div', 'sg-ck-tile sg-ck-detail', body);
          var dh = el('div', 'sg-ck-th', d);
          el('b', '', dh, T('Q-1043 · 卡点详情', 'Q-1043 · blocker'));
          R.dOwner = el('span', '', dh);
          el('p', 'sg-ck-dp', d, T('销售 AI 已起草报价 v2（电动自行车电池，约 2,000 组/年）。缺底价：要由有权限的人来定。', 'The sales AI has drafted quote v2 (e-bike packs, about 2,000 a year). It is missing the floor price, which someone with authority must set.'));
          var fd = el('div', 'sg-ck-field', d);
          el('span', '', fd, T('底价（美元/组）', 'Floor price (USD per pack)'));
          R.inp = el('span', 'sg-ck-input', fd); R.inpT = el('span', '', R.inp);
          var bt = el('div', 'sg-ck-btns', d);
          R.b1 = el('span', 'sg-btn is-primary', bt);
          R.b2 = el('span', 'sg-btn', bt);
          var lg = el('div', 'sg-ck-log', d);
          R.log1 = el('span', '', lg, T('你补上底价 86.00 美元/组，已交回销售 AI', 'You set the floor price at USD 86.00 and handed it back'));
          R.log2 = el('span', '', lg, T('销售 AI 更新报价 v3 · 等你审批后才发出', 'Sales AI updated quote v3 · it waits for your approval'));
          var nt = el('div', 'sg-ck-note', d);
          ico('shield', nt, 16);
          el('span', '', nt, T('报价发出前仍需审批，不会自动发送', 'A quote still needs approval before it goes out; nothing is sent by itself'));
        } else {
          var ac = el('div', 'sg-ck-tact', body);
          R.inp = el('span', 'sg-ck-input', ac); el('span', 'sg-ck-inp-k', R.inp, T('底价', 'Floor')); R.inpT = el('b', '', R.inp);
          R.b1 = el('span', 'sg-btn', ac);
          R.log1 = el('div', 'sg-ck-log1', body, T('已交回 · 报价发出前仍需审批', 'Handed back · still needs approval'));
        }
        R.touch = el('div', 'sg-ck-touch', stage);
        el('i', '', R.touch);
        if (full) el('span', '', R.touch, T('你', 'You'));
      } else {
        el('span', 'sg-ck-k', body, T('卡点', 'Blocker'));
        el('b', 'sg-ck-mid', body, 'Q-1043');
        el('span', 'sg-ck-mwhy', body, T('缺底价', 'No floor price'));
        if (R.H >= 140) R.mo = owner(body, OWN_S[0], 1);
        R.st = el('span', 'sg-ck-mchip', body);
      }
      R.rip = ripple(stage);
      foot(stage, R.tier);
    }

    function tick(t) {
      var k = Math.floor(t / P), tau = t - k * P;
      var ph = tau < TAP1 + 0.1 ? 0 : tau < TAP2 + 0.1 ? 1 : tau < REVIEW ? 2 : 3, mine = ph === 1;
      var g0 = seg(tau, TAP1, TAP1 + 0.6), g1 = seg(tau, TAP2, TAP2 + 0.6), first = g0 > 0 && g0 < 1;
      beat(R.body, tau, P, FADE);
      // the count drops only once the price is handed back: while you hold the task the blocker is still there
      live(R, ph === 0 ? T('1 个卡点', '1 blocker') : ph === 1 ? T('1 个卡点 · 处理中', R.narrow ? 'Being handled' : '1 blocker · being handled') : T('0 个卡点', '0 blockers'), ph === 0 ? 'warn' : ph === 1 ? '' : 'idle');
      if (R.st) {
        // mini: one status, tapped where it stands
        var mp = ph === 0 ? 0 : ph === 1 ? 1 : 2;
        say(R.st, MINI[mp]);
        cl(R.st, 'is-wait', mp === 0); cl(R.st, 'is-mine', mp === 1); cl(R.st, 'is-ok', mp === 2);
        if (R.mo) { say(R.mo.t, OWN_S[mine ? 1 : 0]); cl(R.mo.av, 'is-ai', !mine); cl(R.mo.av, 'is-you', mine); }
        ring(R.rip, target(R, 'chip', R.st, k), first ? g0 : g1);
        return;
      }
      var q = R.q, full = R.tier === 'full';
      cl(q.r, 'is-block', ph === 0); cl(q.r, 'is-mine', mine); cl(q.r, 'is-done', ph >= 2);
      say(q.o.t, full ? OWN[mine ? 1 : 0] : OWN_S[mine ? 1 : 0]);
      cl(q.o.av, 'is-ai', !mine); cl(q.o.av, 'is-you', mine);
      say(q.st, full ? STATE[ph] : STATE_S[ph]);
      cl(q.st, 'is-block', ph === 0); cl(q.st, 'is-mine', ph === 1); cl(q.st, 'is-run', ph === 2); cl(q.st, 'is-review', ph === 3);
      cl(R.why, 'is-gone', ph >= 2);
      if (R.dOwner) put(R.dOwner, 'text', OWN[mine ? 1 : 0]);
      // the price is typed while you hold the task
      put(R.inpT, 'text', ph === 0 ? '' : PRICE[Math.round(5 * seg(tau, TY0, TY1))]);
      cl(R.inp, 'is-focus', mine);
      cl(R.inp, 'is-typing', mine && tau < TY1 + 0.3);
      var down1 = tau >= TAP1 - 0.08 && tau < TAP1 + 0.14, down2 = tau >= TAP2 - 0.08 && tau < TAP2 + 0.14;
      if (R.b2) {
        put(R.b1, 'text', ph === 0 ? T('我来处理', 'Take it') : T('你已接手', 'You took it'));
        cl(R.b1, 'is-primary', ph === 0); cl(R.b1, 'is-done', ph >= 1);
        put(R.b2, 'text', ph >= 2 ? T('已交回 ✓', 'Handed back ✓') : T('交回销售 AI', 'Hand back to Sales AI'));
        cl(R.b2, 'is-primary', ph === 1 && tau >= TY1); cl(R.b2, 'is-done', ph >= 2);
        cl(R.b1, 'is-press', down1); cl(R.b2, 'is-press', down2);
        op(R.log2, seg(tau, REVIEW, REVIEW + 0.4));
      } else {
        put(R.b1, 'text', ph === 0 ? T('我来处理', 'Take it') : ph === 1 ? T('交回', 'Hand back') : T('已交回 ✓', 'Returned ✓'));
        cl(R.b1, 'is-primary', ph === 0 || (ph === 1 && tau >= TY1)); cl(R.b1, 'is-done', ph >= 2);
        cl(R.b1, 'is-press', down1 || down2);
      }
      op(R.log1, seg(tau, TAP2 + 0.2, TAP2 + 0.6));

      // the pointer: a person's tap, then typing, then a second tap
      // every point is measured on demand, so a still frame or a rebuild mid-beat has them all
      var b2 = R.b2 || R.b1, p0, p1, u, vis;
      if (tau < TAP1 + 0.4) {
        p1 = target(R, 'b1', R.b1, k); u = ease.io(seg(tau, IN0, TAP1 - 0.15));
        p0 = [p1[0] + 90, p1[1] + 70]; vis = seg(tau, IN0, IN0 + 0.3);
      } else if (tau < TY1 + 0.3) {
        p0 = target(R, 'b1', R.b1, k); p1 = target(R, 'inp', R.inp, k, true); u = ease.io(seg(tau, TAP1 + 0.4, TY0)); vis = 1;
      } else {
        p0 = target(R, 'inp', R.inp, k, true); p1 = target(R, 'b2', b2, k); u = ease.io(seg(tau, TY1 + 0.3, TAP2 - 0.15)); vis = 1 - seg(tau, TAP2 + 0.5, TAP2 + 1.1);
      }
      var px = p0[0] + (p1[0] - p0[0]) * u;
      mv(R.touch, px, p0[1] + (p1[1] - p0[1]) * u); op(R.touch, vis);
      cl(R.touch, 'is-flip', px > R.W - 64); // the 你 label goes on the left near the right edge
      cl(R.touch, 'is-down', down1 || down2);
      ring(R.rip, first ? target(R, 'b1', R.b1, k) : target(R, 'b2', b2, k), first ? g0 : g1);
    }

    // the still: handed back and waiting for approval, so the pill, the row and the log agree
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 8.6 };
  }

  /* =====================================================================
     BUDGET — 用量与预算上限. This month's AI usage climbs day by day toward
     the limit, warns at 80%, and when the next batch would cross the limit
     new work pauses for approval. 13 s, ending on a soft fade back.
     ===================================================================== */
  var LIMIT = 8000, TODAY = 23, NEXT = 600, SHARE = [0.38, 0.27, 0.21, 0.14];
  // usage to the end of each day of a 31-day month (October 2026: the 1st is a Thursday, weekends run light), scaled so today reads 97%
  var CUM = (function () {
    var c = [0], s = 0, d;
    for (d = 1; d <= 31; d++) { var wd = (d + 3) % 7; s += (wd === 6 || wd === 0 ? 0.45 : 1) * (0.8 + 0.4 * K.hash(d * 1.37 + 5)); c.push(s); }
    var f = LIMIT * 0.97 / c[TODAY];
    for (d = 0; d <= 31; d++) c[d] = c[d] * f;
    return c;
  })();
  function usage(day) { var i = Math.min(30, Math.floor(day)), u = day - i; return CUM[i] + (CUM[i + 1] - CUM[i]) * u; }
  var WARN_DAY = (function () { for (var d = 0; d < TODAY; d += 0.01) if (usage(d) >= LIMIT * 0.8) return d; return TODAY; })();

  function BudgetScene() {
    var P = 13, D0 = 0.6, D1 = 8.4, HOLD = 8.6, FADE = 12.4;
    function dayAt(tau) { var x = seg(tau, D0, D1); return TODAY * x * (1.3 - 0.3 * x); }
    var WARN_T = (function () { for (var s = D0; s < D1; s += 0.005) if (dayAt(s) >= WARN_DAY) return s; return D1; })();
    var ROLE = [T('销售 AI', 'Sales'), T('获客 AI', 'Prospecting'), T('AI 创作', 'Creative'), T('跟单 AI', 'Orders')];
    var RULE = [T('规则：用到 80% 提醒你；超出上限前，新任务先暂停', 'Rule: alert at 80%; before the limit, new work pauses'), T('已用 80% · 已提醒你；超出上限前，新任务会先暂停', '80% used · you were alerted; before the limit, new work pauses')];
    var TAB = [T('80% 提醒 · 超限前暂停', 'Alert at 80% · pause at the limit'), T('已用 80% · 已提醒你', '80% used · alerted'), T('已暂停 · 等你批准', 'Paused · needs your OK')];
    var MINI = [T('AI 用量', 'AI usage'), T('80% 预警', '80% alert'), T('等你批准', 'Needs your OK')];
    var S = sized(), R, uid = 0;

    function chart(box, w, h, full) {
      var pl = 2, pr = 2, pt = full ? 10 : 6, pb = full ? 24 : 4;
      var vmax = LIMIT / (full ? 0.8 : 0.82);
      var X = function (d) { return pl + (w - pl - pr) * d / 31; }, Y = function (v) { return pt + (h - pt - pb) * (1 - v / vmax); };
      var id = 'sgck' + (++uid) + (full ? 'f' : 't');
      var svg = sv('svg', { class: 'sg-ck-svg', width: w, height: h, viewBox: '0 0 ' + w + ' ' + h }, box);
      var defs = sv('defs', {}, svg);
      var ag = sv('linearGradient', { id: id + 'a', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      sv('stop', { offset: 0, 'stop-color': '#a9a0ff', 'stop-opacity': '.26' }, ag);
      sv('stop', { offset: 1, 'stop-color': '#a9a0ff', 'stop-opacity': '0' }, ag);
      var lg = sv('linearGradient', { id: id + 'l', gradientUnits: 'userSpaceOnUse', x1: X(0), y1: 0, x2: X(TODAY), y2: 0 }, defs);
      var wf = (WARN_DAY / TODAY).toFixed(3);
      sv('stop', { offset: 0, 'stop-color': '#e9d4bf' }, lg);
      sv('stop', { offset: wf, 'stop-color': '#ceccf6' }, lg);
      sv('stop', { offset: wf, 'stop-color': '#a9a0ff' }, lg);
      sv('stop', { offset: 1, 'stop-color': '#a9a0ff' }, lg);
      var clip = sv('clipPath', { id: id + 'c' }, defs);
      R.clip = sv('rect', { x: 0, y: 0, width: 0, height: h }, clip);
      // grid, the 80% line and the limit; their labels sit at the left, where this month's line is still low
      // above the limit: the zone new work may not enter, shaded while it waits there
      R.over = sv('rect', { x: X(0), y: pt - 4, width: X(31) - X(0), height: Y(LIMIT) - pt + 4, class: 'sg-ck-over' }, svg);
      if (full) [0.25, 0.5].forEach(function (f) { sv('line', { x1: X(0), x2: X(31), y1: Y(LIMIT * f), y2: Y(LIMIT * f), class: 'sg-ck-grid' }, svg); });
      sv('line', { x1: X(0), x2: X(31), y1: Y(0), y2: Y(0), class: 'sg-ck-base' }, svg);
      R.l80 = sv('line', { x1: X(0), x2: X(31), y1: Y(LIMIT * 0.8), y2: Y(LIMIT * 0.8), class: 'sg-ck-l80' }, svg);
      R.lim = sv('line', { x1: X(0), x2: X(31), y1: Y(LIMIT), y2: Y(LIMIT), class: 'sg-ck-lim' }, svg);
      var t1 = sv('text', { x: X(0) + 1, y: Y(LIMIT) - 7, class: 'sg-ck-lab is-lim' }, svg);
      t1.textContent = full ? T('上限 8,000', 'Limit 8,000') : T('上限', 'Limit');
      if (full) {
        var t2 = sv('text', { x: X(0) + 1, y: Y(LIMIT * 0.8) - 7, class: 'sg-ck-lab is-80' }, svg);
        t2.textContent = T('80% 预警', '80% alert');
        [[0, '10/1'], [9, '10/10'], [19, '10/20'], [30, '10/31']].forEach(function (a, i) {
          var tx = sv('text', { x: X(a[0]), y: h - 6, 'text-anchor': i === 0 ? 'start' : i === 3 ? 'end' : 'middle', class: 'sg-ck-lab' }, svg);
          tx.textContent = a[1];
        });
      }
      // the month so far, revealed day by day
      var dl = '';
      for (var d = 0; d <= TODAY; d++) dl += (d ? 'L' : 'M') + X(d).toFixed(1) + ' ' + Y(CUM[d]).toFixed(1);
      var da = dl + 'L' + X(TODAY).toFixed(1) + ' ' + Y(0).toFixed(1) + 'L' + X(0).toFixed(1) + ' ' + Y(0).toFixed(1) + 'Z';
      var g = sv('g', { 'clip-path': 'url(#' + id + 'c)' }, svg);
      sv('path', { d: da, fill: 'url(#' + id + 'a)' }, g);
      sv('path', { d: dl, class: 'sg-ck-line-u', stroke: 'url(#' + id + 'l)' }, g);
      // the next batch, which would cross the limit
      R.proj = sv('g', { class: 'sg-ck-proj' }, svg);
      var px = X(TODAY + 2.2), py = Y(CUM[TODAY] + NEXT);
      sv('path', { d: 'M' + X(TODAY).toFixed(1) + ' ' + Y(CUM[TODAY]).toFixed(1) + 'L' + px.toFixed(1) + ' ' + py.toFixed(1) }, R.proj);
      sv('circle', { cx: px.toFixed(1), cy: py.toFixed(1), r: 3.5 }, R.proj);
      if (full) { var pt2 = sv('text', { x: X(31), y: py - 10, 'text-anchor': 'end', class: 'sg-ck-lab is-proj' }, R.proj); pt2.textContent = T('下一批 +' + NEXT, 'Next batch +' + NEXT); }
      // the 80% mark and today's point
      R.m80 = sv('circle', { cx: X(WARN_DAY).toFixed(1), cy: Y(LIMIT * 0.8).toFixed(1), r: 5, class: 'sg-ck-m80' }, svg);
      R.m80r = sv('circle', { cx: X(WARN_DAY).toFixed(1), cy: Y(LIMIT * 0.8).toFixed(1), r: 5, class: 'sg-ck-m80r' }, svg);
      R.glow = sv('circle', { r: 12, class: 'sg-ck-glow' }, svg);
      R.dot = sv('circle', { r: 4.5, class: 'sg-ck-dot' }, svg);
      R.X = X; R.Y = Y;
    }

    function build(stage, L) {
      R = chrome(stage, L, 'sg-ck-bu', T('用量与预算', 'Usage & budget'), T('用量与预算', 'Usage & budget'));
      var body = R.body = el('div', 'sg-ck-body', stage);
      if (R.tier === 'mini') {
        R.k = el('span', 'sg-ck-k', body);
        var bn = el('b', 'sg-ck-big', body); R.pct = el('span', '', bn); el('small', '', bn, '%');
        var mb = el('div', 'sg-ck-mbar', body); R.fill = el('i', '', mb); el('em', '', mb);
        foot(stage, R.tier);
        return;
      }
      var hd = el('div', 'sg-ck-bhead', body);
      var hl = el('div', 'sg-ck-bl-l', hd);
      el('span', 'sg-ck-k', hl, T('AI 用量 · 本月', 'AI usage · this month'));
      var nb = el('div', 'sg-ck-bnum', hl);
      R.used = el('b', '', nb); el('span', '', nb, T(' / 8,000 额度', ' / 8,000 credits'));
      R.pctBox = el('span', 'sg-ck-pct', hd); R.pct = el('b', '', R.pctBox); el('span', '', R.pctBox, '%');
      var box = el('div', 'sg-ck-chart', body);
      if (R.tier === 'full') {
        var ro = el('div', 'sg-ck-roles', body);
        R.roles = ROLE.map(function (n, i) {
          var c = el('div', 'sg-ck-role', ro);
          el('span', '', c, n);
          var o = { v: el('b', '', c), s: SHARE[i] };
          var tr = el('i', 'sg-ck-track', c); o.f = el('i', '', tr);
          return o;
        });
        var gt = R.gate = el('div', 'sg-ck-gate', body);
        var ru = el('div', 'sg-ck-rule', gt); ico('shield', ru, 16); R.rule = el('span', '', ru);
        var hb = el('div', 'sg-ck-held', gt); ico('pause', hb, 16);
        el('span', '', hb, T('下一批任务需 ' + NEXT + ' 额度，会超出上限 · 已暂停', 'Next batch needs ' + NEXT + ' credits, over the limit · paused'));
        el('span', 'sg-btn is-primary', hb, T('等你批准', 'Needs your OK'));
      } else R.status = el('div', 'sg-ck-bstat', body);
      foot(stage, R.tier);
      // the chart takes the room left (every other row has a fixed height)
      chart(box, box.clientWidth || R.W - 32, box.clientHeight || 80, R.tier === 'full');
    }

    function tick(t) {
      var k = Math.floor(t / P), tau = t - k * P;
      var day = dayAt(tau), u = usage(day), pc = Math.floor(u / LIMIT * 100), held = tau >= HOLD, warned = tau >= WARN_T;
      var ph = held ? 2 : warned ? 1 : 0;
      beat(R.body, tau, P, FADE);
      live(R, held ? T('已暂停 · 等你', R.narrow ? 'Paused' : 'Paused · needs you') : warned ? T('80% 预警', '80% alert') : T('本月', 'This month'), held || warned ? 'warn' : 'idle');
      num(R.pct, pc, true);
      if (R.k) {
        say(R.k, MINI[ph]);
        cl(R.k, 'is-warn', ph === 1); cl(R.k, 'is-hold', ph === 2);
        sx(R.fill, u / LIMIT);
        cl(R.body, 'is-warn', warned); cl(R.body, 'is-hold', held);
        return;
      }
      num(R.used, Math.round(u / 10) * 10, true);
      cl(R.pctBox, 'is-warn', warned && !held); cl(R.pctBox, 'is-hold', held);
      var x = R.X(day), y = R.Y(u);
      at(R.clip, 'width', x + 1);
      at(R.dot, 'cx', x); at(R.dot, 'cy', y); at(R.glow, 'cx', x); at(R.glow, 'cy', y);
      cl(R.glow, 'is-hold', held);
      op(R.dot, tau >= D0 ? 1 : 0); op(R.glow, tau >= D0 ? 1 : 0);
      cl(R.m80, 'is-on', warned); cl(R.l80, 'is-on', warned);
      var w0 = seg(tau, WARN_T, WARN_T + 0.9);
      op(R.m80r, w0 > 0 && w0 < 1 ? 0.8 * (1 - w0) : 0);
      if (w0 > 0 && w0 < 1) at(R.m80r, 'r', 5 + 16 * ease.out(w0));
      op(R.proj, ease.out(seg(tau, HOLD, HOLD + 0.5)));
      cl(R.lim, 'is-hold', held); cl(R.over, 'is-hold', held);
      // each role rounded to 10 on its own, the last one the headline minus the others, so the four add up
      if (R.roles) for (var i = 0, rest = Math.round(u / 10) * 10; i < R.roles.length; i++) { var o = R.roles[i], rv = i < R.roles.length - 1 ? Math.round(u * o.s / 10) * 10 : rest; rest -= rv; num(o.v, rv, true); sx(o.f, o.s / SHARE[0] * u / CUM[TODAY]); }
      if (R.gate) { say(R.rule, RULE[warned ? 1 : 0]); cl(R.gate, 'is-warn', warned && !held); cl(R.gate, 'is-hold', held); }
      if (R.status) { say(R.status, TAB[ph]); cl(R.status, 'is-warn', ph === 1); cl(R.status, 'is-hold', ph === 2); }
    }

    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 10.2 };
  }

  return { 'cockpit-overview': OverviewScene, 'cockpit-blocker': BlockerScene, 'cockpit-budget': BudgetScene };
});
