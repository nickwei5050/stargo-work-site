/* QUOTE — 03 「报价有依据，利润有边界，文件有版本」 on the capability page (the quote band; the owner's
   AI photograph c07-quote-approval was here until 2026-10-23, 「图片改成代码」).

   Q-1042 for Müller Energie is drafted line by line, each price labelled with where it came from
   (历史成交价 · 包装规则 · 货代报价). The margin guard finds it 2.8 points under the 18% floor and
   stops it; the sales director taps 批准, for this order only; v3 is kept as the formal version beside
   v1 (the price list) and v2 (the buyer's target), and can become the PI only after your OK.

   Three layouts, cut to the host's own size (scale ~1, so no text is under 12 CSS px on a phone):
     card    desktop, the band's 3:2 box from 400 wide: the sheet and the margin guard on the left, the
             approver and the versions on the right, all on the screen from the start, filling in
     tall    a portrait box (tablets, small laptops): one column; the approver slides away to the versions
     narrow  phones and the 1280 desktop: three steps (起草 · 审批 · 正式版) over three panels that slide
             one after another, like an app's screens, so no card ever lies over another
   Queued on window.STARGO_SCENES and run by js/stargo-motion.js (tick(t) a pure function of time,
   `still` the reduced-motion frame); a frame writes only transforms, opacity, classes and changed text
   through put(). Styles: css/stargo-motion-quote.css, after css/stargo-motion-sales.css (the chrome). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod;

  var GLYPH = {
    check: K.ICON.check,
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    lock: 'M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11M5.5 11h13v9h-13zM12 14.5v2',
    alert: 'M12 4.5 20.5 19.5h-17zM12 10v4M12 16.8h.01'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function arrive(e, p, dy) {
    if (p <= 0) { css(e, 'opacity', '0'); return; }
    if (p >= 1) { css(e, 'opacity', '1'); css(e, 'transform', 'none'); return; }
    css(e, 'opacity', p.toFixed(3));
    css(e, 'transform', 'translate3d(0,' + ((1 - p) * (dy || 8)).toFixed(2) + 'px,0)');
  }

  function QuoteScene() {
    var P = 16, OUT0 = 14.9, OUT1 = 15.6;
    // [item, quantity, amount, where the price came from]
    var LINES = [
      ['48V 100Ah', '× 200', '€79,000', T('历史成交价', 'Past deals')],
      [T('出口木箱', 'Crating'), '× 200', '€1,200', T('包装规则', 'Packing rule')],
      [T('DAP 汉堡', 'DAP Hamburg'), '× 1', '€2,350', T('货代报价', 'Freight')]
    ];
    var TOTAL = 82550, MARGIN = 15.2, FLOOR = 18, SCALE = 30;   // the meter runs 0–30 %
    var AT = { line: [0.4, 0.95, 1.5], total: 2.05, meter: 2.6, flag: 3.55, ask: 3.9, tap: 6.2, ok: 6.35, v3: 7.0, pi: 7.7 };
    var GO1 = 4.1, GO2 = 7.0, SLIDE = 0.55;   // the narrow panels: to the approval, to the versions
    // v3 is the draft on the sheet; v1 and v2 were kept before it
    var VERS = [['v3', '', '€82,550'], ['v2', T('客户目标价', 'Buyer target'), '€76,000'], ['v1', T('按价格表', 'Price list'), '€86,400']];
    var V3 = [T('起草中', 'Drafting'), T('待审批', 'Awaiting approval'), T('已批准', 'Approved'), T('正式版 · 已批准', 'Formal · approved')];
    var V3_CARD = [V3[0], V3[1], V3[2], T('正式版', 'Formal')];   // the card's column is narrow: the lock says the rest
    var STATUS = [T('起草中', 'Drafting'), T('等你审批', 'To approve'), T('已批准', 'Approved'), T('v3 正式版', 'v3 formal')];
    var STEPS = [T('起草', 'Draft'), T('审批', 'Approve'), T('正式版', 'Formal')];
    var ASK = [T('等待报价草稿', 'Waiting for the draft'), T('Q-1042 低于底线 2.8 个点', '2.8 pts under the floor'), T('仅限本单 · 10:42', 'This order only · 10:42')];
    var layouts = {}, R, kind;

    function lay(k, w, h, full) { var key = k + (full ? '-f-' : '-') + w + 'x' + h; if (!layouts[key]) layouts[key] = { w: w, h: h, kind: k, full: full }; return key; }
    function pick(w, h) {
      var r = h / w, W;
      // the full tag on a desktop or laptop screen where the bar has room for it (the card's bar also
      // holds the status); a phone or a small tablet has the short one
      var big = window.innerWidth >= 900;
      if (w >= 400 && r < 0.9) { W = clamp(Math.floor(w), 400, 560); return lay('card', W, Math.floor(W * r), true); }
      if (h >= 400 && r >= 0.95) { W = clamp(Math.floor(w), 240, 440); return lay('tall', W, clamp(Math.floor(W * r), 400, 640), big && (K.ZH || W >= 340)); }
      W = clamp(Math.floor(w), 240, 420);
      return lay('narrow', W, clamp(Math.floor(W * r), 210, 380), big && (K.ZH || W >= 340));
    }
    function panel(parent, w) { var p = el('div', 'sgs-panel', parent); p.style.width = w + 'px'; return p; }
    function build(stage, L) {
      kind = L.kind; R = {};
      var card = kind === 'card', narrow = kind === 'narrow', tall = kind === 'tall';
      var barH = narrow && L.h < 250 ? 30 : 32, cust = !narrow || L.h >= 250;
      stage.className = 'sg-mo-stage sgs sgs-quote is-' + kind + ((card ? L.w < 470 : L.w < 330) ? ' is-thin' : '') + (card && L.h < 300 ? ' is-lo' : '') + (narrow && L.w < 290 ? ' is-xs' : '');
      R.v3 = card || L.w < 290 ? V3_CARD : V3;
      // the spare height spreads the rows (css --sgs-room, 0 at the smallest box of each layout)
      var room = card ? (L.h - 268) / 90 : tall ? (L.h - 380) / 100 : (L.h - barH - 26 - 164 - (cust ? 20 : 0)) / 60;
      stage.style.setProperty('--sgs-room', clamp(room, 0, 1.6).toFixed(3));
      var b = el('div', 'sgs-bar', stage);
      if (barH === 30) b.style.height = '30px';
      var mk = el('span', 'sg-app-mark', b); K.icon('spark', mk, 12);
      el('b', '', b, T('报价', 'Quote') + ' Q-1042');
      if (!cust) el('span', 'sgs-crumb', b, 'Müller Energie');
      el('span', 'sgs-tagline', b, L.full ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
      R.status = card ? el('span', 'sgs-status', b) : null;
      // narrow: the three steps of the band (按规则起草 · 审批人批准 · 保留正式版本) over the panels
      R.steps = null;
      if (narrow) {
        var sp = el('div', 'sgs-steps', stage);
        R.steps = []; R.links = [];
        STEPS.forEach(function (s, i) {
          if (i) { var ln = el('i', 'sgs-step-l', sp); R.links.push(el('i', '', ln)); }
          var d = el('span', 'sgs-step', sp), n = el('i', 'sgs-step-n', d);
          el('em', '', n, String(i + 1)); glyph('check', n, 11);
          el('span', '', d, s);
          R.steps.push(d);
        });
      }
      var pane = R.pane = el('div', 'sgs-q-pane', stage), p1 = pane, p2 = pane, p3 = pane, slot = null;
      R.track = null;
      if (narrow) {
        R.track = el('div', 'sgs-track', pane); R.tw = L.w; R.go = [GO1, GO2];
        p1 = panel(R.track, L.w); p2 = panel(R.track, L.w); p3 = panel(R.track, L.w);
      }
      // the sheet
      var sheet = el('div', 'sgs-sheet', p1);
      if (cust) {
        var sk = el('div', 'sgs-sheet-k', sheet);
        el('span', '', sk, 'Müller Energie GmbH');
        if (tall) R.status = el('span', 'sgs-status', sk);
      }
      R.lines = LINES.map(function (l) {
        var r = el('div', 'sgs-line', sheet);
        var a = el('span', 'sgs-line-a', r); el('b', '', a, l[0]); el('em', '', a, l[1]);
        el('span', 'sgs-src', r, l[3]);
        el('span', 'sgs-amt', r, l[2]);
        return r;
      });
      var tot = el('div', 'sgs-total', sheet);
      el('span', '', tot, T('合计 · EUR', 'Total · EUR'));
      R.totalV = el('b', '', tot, '€0');
      // the margin guard
      var guard = R.guard = el('div', 'sgs-guard', p1);
      var gh = el('div', 'sgs-guard-h', guard);
      el('span', '', gh, T('毛利', 'Margin'));
      R.marginV = el('b', '', gh, '0.0%');
      R.flag = el('span', 'sgs-flag', gh);
      glyph('alert', R.flag, 12, 'sg-ico sgs-fi-low'); glyph('check', R.flag, 12, 'sg-ico sgs-fi-ok'); R.flagT = el('span', '', R.flag, '');
      var meter = el('div', 'sgs-meter', guard);
      R.bar = el('i', 'sgs-meter-f', meter);
      var fl = el('span', 'sgs-floor', meter); fl.style.left = (FLOOR / SCALE * 100) + '%';
      el('em', '', fl, T('底线 ', 'Floor ') + FLOOR + '%');
      // card: the approver over the versions, a column of its own beside the sheet and the guard
      if (card) p2 = p3 = el('div', 'sgs-q-r', pane);
      // tall: the approver and the versions share one place and slide
      if (tall) {
        slot = el('div', 'sgs-slot', pane);
        R.track = el('div', 'sgs-track', slot); R.tw = L.w - 14; R.go = [GO2];   // the slot reaches 5px past the pane's padding, for the ring
        p2 = panel(R.track, R.tw); p3 = panel(R.track, R.tw);
      }
      if (narrow) {
        // the approval screen opens on what stopped the quote: the margin against the floor
        var rc = el('div', 'sgs-recap', p2), rh = el('div', 'sgs-guard-h', rc);
        el('span', '', rh, T('毛利', 'Margin')); el('b', '', rh, MARGIN + '%');
        var rf = el('span', 'sgs-flag', rh); glyph('alert', rf, 12); el('span', '', rf, T('低于底线 18%', 'Floor 18%'));
        var rm = el('div', 'sgs-meter', rc), rb = el('i', 'sgs-meter-f', rm);
        rb.style.transform = 'scaleX(' + (MARGIN / SCALE).toFixed(4) + ')';
        el('span', 'sgs-floor', rm).style.left = (FLOOR / SCALE * 100) + '%';
      }
      // the approver
      var ap = R.ask = el('div', 'sgs-ask', p2);
      R.ring = el('i', 'sgs-ask-ring', ap);
      var at = el('div', 'sgs-ask-t', ap);
      el('b', '', at, T('审批人：销售总监', 'Approver: sales director'));
      R.askS = el('span', '', at, '');
      var btns = el('div', 'sgs-ask-b', ap);
      R.ok = el('span', 'sg-btn is-primary sgs-btn', btns);
      R.okT = el('span', '', R.ok, '');
      R.ret = el('span', 'sg-btn sgs-btn sgs-ret', btns, T('退回', 'Return'));
      R.askM = el('em', '', narrow ? btns : at, '');   // who drafted it, when: beside the buttons on a phone
      var tp = el('i', 'sgs-tap', R.ok);
      R.tapDot = el('i', 'sgs-tap-dot', tp); R.tapRing = el('i', 'sgs-tap-ring', tp);
      // the versions; on a phone they open on what the quote is
      if (narrow) {
        var sum = el('div', 'sgs-sum', p3); glyph('doc', sum, 13);
        el('span', '', sum, T('48V 100Ah × 200 · DAP 汉堡', '48V 100Ah × 200 · DAP Hamburg'));
      }
      var vs = R.vers = el('div', 'sgs-vers', p3);
      el('div', 'sgs-vers-k', vs, T('版本 · 每版留底', 'Versions · all kept'));
      R.v = VERS.map(function (v, i) {
        var r = el('div', 'sgs-ver' + (i === 0 ? ' is-top' : ''), vs);
        el('b', '', r, v[0]);
        var s = el('span', 'sgs-ver-n', r, v[1]);
        el('em', '', r, v[2]);
        if (i === 0) glyph('lock', r, 12, 'sg-ico sgs-lock');
        return { r: r, s: s };
      });
      var pi = R.pi = el('div', 'sgs-pi', narrow ? p3 : pane);
      glyph('doc', pi, 13);
      el('span', '', pi, T('v3 可转 PI · 发送前由你确认', 'PI from v3 · sent after your OK'));
    }
    function tick(t) {
      var tau = mod(t, P), i;
      css(R.pane, 'opacity', tau < 0.3 ? (tau / 0.3).toFixed(3) : tau < OUT0 ? '1' : (1 - seg(tau, OUT0, OUT1)).toFixed(3));
      for (i = 0; i < R.lines.length; i++) { arrive(R.lines[i], ease.out(seg(tau, AT.line[i], AT.line[i] + 0.45)), 6); cl(R.lines[i], 'is-src', tau >= AT.line[i] && tau < AT.line[i] + 1.1); }
      put(R.totalV, 'text', '€' + K.fmt(TOTAL * ease.out(seg(tau, AT.total - 0.3, AT.total + 0.5))));
      var mp = ease.io(seg(tau, AT.meter, AT.meter + 0.9));
      css(R.bar, 'transform', 'scaleX(' + (mp * MARGIN / SCALE).toFixed(4) + ')');
      put(R.marginV, 'text', (MARGIN * mp).toFixed(1) + '%');
      var ph = tau < AT.flag ? 0 : tau < AT.ok ? 1 : tau < AT.v3 ? 2 : 3, okd = ph >= 2;
      cl(R.guard, 'is-low', ph === 1);
      cl(R.guard, 'is-ok', okd);
      arrive(R.flag, ease.out(seg(tau, AT.flag, AT.flag + 0.35)), 3);
      put(R.flagT, 'text', okd ? T('低于底线 · 已批准', 'Approved') : T('低于底线 · 需审批', 'Below floor'));
      // the approver: on screen from the start, waiting for the draft; then waiting for you (a ring
      // that breathes: its own layer, opacity only); then the tap; then approved, 退回 set aside
      var idle = tau < AT.ask, wait = !idle && !okd;
      cl(R.ask, 'is-idle', idle);
      cl(R.ask, 'is-wait', wait);
      cl(R.ask, 'is-ok', okd);
      css(R.ring, 'opacity', wait ? (0.5 + 0.5 * Math.sin((tau - AT.ask) * 4.2)).toFixed(3) : '0');
      put(R.askS, 'text', ASK[idle ? 0 : okd ? 2 : 1]);
      put(R.askM, 'text', idle ? T('AI 正在起草', 'AI is drafting') : T('AI 起草 · 10:38 提交', 'AI draft · sent 10:38'));
      cl(R.ok, 'is-press', tau >= AT.tap - 0.05 && tau < AT.tap + 0.22);
      cl(R.ok, 'is-done', okd);
      cl(R.ret, 'is-off', okd);
      put(R.okT, 'text', okd ? T('已批准', 'Approved') : T('批准', 'Approve'));
      var x = tau - AT.tap, d = x >= -0.25 && x < 0.9 ? (x < 0 ? 1 + x * 4 : 1 - c01((x - 0.35) / 0.5)) : 0, rg = x >= 0 && x < 0.7 ? ease.out(x / 0.7) : 0;
      css(R.tapDot, 'opacity', d.toFixed(2));
      css(R.tapRing, 'opacity', rg > 0 ? (0.7 * (1 - rg)).toFixed(2) : '0');
      css(R.tapRing, 'transform', 'scale(' + (0.6 + 1.6 * rg).toFixed(3) + ')');
      // v3: a dashed place while it is drafted and approved, then the formal version, locked
      put(R.v[0].s, 'text', R.v3[ph]);
      cl(R.v[0].r, 'is-on', tau >= AT.v3 + 0.2);
      arrive(R.ask, ease.out(seg(tau, 0.1, 0.5)), 6);
      arrive(R.vers, ease.out(seg(tau, 0.25, 0.65)), 6);
      arrive(R.pi, ease.out(seg(tau, AT.pi, AT.pi + 0.5)), 5);
      if (R.status) { put(R.status, 'text', STATUS[ph]); cl(R.status, 'is-wait', ph === 1); cl(R.status, 'is-ok', okd); }
      // the panels slide one after another (narrow), or the approver gives way to the versions (tall)
      if (R.track) {
        var off = 0;
        for (i = 0; i < R.go.length; i++) off += ease.io(seg(tau, R.go[i], R.go[i] + SLIDE));
        css(R.track, 'transform', off > 0 ? 'translate3d(' + (-off * R.tw).toFixed(1) + 'px,0,0)' : 'none');
      }
      if (R.steps) {
        var cur = tau < GO1 ? 0 : tau < GO2 ? 1 : 2, done = [tau >= GO1, okd, tau >= AT.v3 + 0.2];
        for (i = 0; i < 3; i++) { cl(R.steps[i], 'is-cur', i === cur && !done[i]); cl(R.steps[i], 'is-done', done[i]); cl(R.steps[i], 'is-at', i === cur); }
        css(R.links[0], 'transform', 'scaleX(' + ease.io(seg(tau, GO1, GO1 + SLIDE)).toFixed(3) + ')');
        css(R.links[1], 'transform', 'scaleX(' + ease.io(seg(tau, GO2, GO2 + SLIDE)).toFixed(3) + ')');
      }
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 10 };
  }

  return { quote: QuoteScene };
});
