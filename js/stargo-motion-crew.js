/* CREW — about.html's four AI-employee tiles (tools/blocks/cn-about-projects.mjs,
   where the stills D01, D07, D02, D05 were), each AI employee at its work in the
   product's dark chrome; every loop ends at a person and nothing is sent.
     crewSignal 市场信号  signals arrive, buyers re-rank, the top one waits for you (Growth OS)
     crewQuote  报价      Q-1042 is built, fails the floor-price check, waits for approval (Sales Desk)
     crewFollow 跟进      Müller Energie silent three days; a follow-up waits for your OK (客户会话)
     crewCoord  统筹      a goal split into five steps for four roles; the summary waits (数字员工)
   The site's one demo cast; each tile carries the engine's demo-data tag.
   The stage is the tile's own size (scale 1): 'full' from 380 × 290 (tiles are
   408–879 × 352–560), 'is-mid' below 400 tall (480–767 px screens, landscape
   phones), where a scene drops a block rather than squeeze one and sizes the
   rest from the space left; 'mini' on phones (256–415 × 192). The tile's STARGO
   wordmark sits over the app bar's left end (css/stargo-motion-crew.css).
   Blinks are driven here, so they stop with the tick off screen. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  var G = {
    signal: 'M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    layers: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
    up: 'M12 18V6.5M6.5 12 12 6.5l5.5 5.5',
    warn: 'M12 4.5 21 19.5H3zM12 10v4.2M12 17h.01',
    mail: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM5 7l7 5.5L19 7'
  };
  // per-frame values come from these tables, so a tick builds no strings
  var SX = [], OP = [], SC = [], i0;
  for (i0 = 0; i0 <= 100; i0++) SX.push('scaleX(' + (i0 / 100) + ')');
  for (i0 = 0; i0 <= 10; i0++) OP.push((0.25 + 0.075 * i0).toFixed(3));
  for (i0 = 0; i0 <= 20; i0++) SC.push('scale(' + (1 + 0.004 * (i0 - 10)).toFixed(3) + ')');
  function sx(e, v) { put(e, '-transform', SX[Math.round(100 * c01(v))]); }
  function breathe(ring, on, tau) { put(ring, 'transform', on ? SC[Math.round(10 + 10 * Math.sin(tau * 4.4))] : SC[10]); }

  function glyph(name, parent, size) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: 'sg-ico' }, parent);
    sv('path', { d: G[name], stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function box(cls, parent, x, y, w, h, text) {
    var e = el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  function pop(e) {
    if (e.animate) e.animate([{ transform: 'scale(.96)' }, { transform: 'scale(1.03)', offset: 0.55 }, { transform: 'none' }], { duration: 440, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  // typed text, rebuilt only when the number of characters changes
  function Typer(e, s) { this.e = e; this.c = Array.from(s); this.n = -1; }
  Typer.prototype.at = function (p) {
    var n = Math.round(this.c.length * c01(p));
    if (n !== this.n) { this.n = n; put(this.e, 'text', this.c.slice(0, n).join('')); }
    cl(this.e, 'is-typing', p > 0 && p < 1);
  };
  function gateGlyph(parent, size) {
    var s = sv('svg', { viewBox: '-20 -20 40 40', width: size, height: size, class: 'sg-gate is-wait sg-crew-gate', 'aria-hidden': 'true' }, parent);
    var ring = sv('circle', { r: 17, class: 'sg-gate-ring' }, s);
    sv('rect', { x: -6.5, y: -6.5, width: 13, height: 13, rx: 2.5, transform: 'rotate(45)', class: 'sg-gate-core' }, s);
    return ring;
  }
  // the person's gate: a ring, what it waits for, and (when there is room) the two buttons
  function gateBox(F, stage, y, h, title, sub, ok, alt) {
    var g = box('sg-crew-gatebox', stage, F.pad, y, F.iw, h);
    var ring = gateGlyph(el('span', 'sg-crew-gico', g), F.full ? 30 : 18);
    var gt = el('div', 'sg-crew-gtx', g);
    el('b', '', gt, title);
    if (F.full) {
      el('span', '', gt, sub);
      var bt = el('span', 'sg-crew-btns', g);
      el('span', 'sg-btn is-primary', bt, ok);
      if (F.iw >= 440) el('span', 'sg-btn', bt, alt);
    }
    return { g: g, ring: ring };
  }

  // the frame of all four: app bar (leaving the wordmark its corner), live pill, tag, body
  function frame(stage, L, app, ico) {
    var full = L.kind === 'full', W = L.w, H = L.h, mid = full && H < 400;
    stage.className = 'sg-mo-stage sg-crew is-' + L.kind + (mid ? ' is-mid' : '') + (W < 330 ? ' is-narrow' : '');
    var bh = full ? 56 : 36;
    var bar = box('sg-crew-bar', stage, 0, 0, W, bh);
    el('span', 'sg-crew-brand', bar);
    var ap = el('span', 'sg-crew-app', bar);
    glyph(ico, ap, full ? 16 : 13);
    el('b', '', ap, app);
    var live = el('span', 'sg-app-live sg-crew-live', bar);
    var dot = el('i', '', live);
    var liveT = el('span', '', live);
    var tag = el('div', 'sg-tag sg-crew-tag', stage, full ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
    tag.style.left = (W - (full ? 18 : 10)) + 'px';
    tag.style.top = (H - (full ? 12 : 5)) + 'px';
    var pad = full ? 20 : 10, top = bh + (full ? (mid ? 14 : 16) : 8), bottom = H - (full ? 34 : 22);
    return { full: full, mid: mid, W: W, H: H, pad: pad, top: top, bottom: bottom, iw: W - 2 * pad, live: live, dot: dot, liveT: liveT, liveK: -1 };
  }
  // the live pill: its words by phase (a phone's own shorter set when given), its dot blinking until it waits
  function liveTick(F, k, texts, mini, tau) {
    var last = k === texts.length - 1;
    if (F.liveK !== k) {
      F.liveK = k;
      textSwap(F.liveT, (mini && (!F.full || F.W < 460) ? mini : texts)[k]);
      cl(F.live, 'is-wait', last);
    }
    put(F.dot, '-opacity', last ? OP[10] : OP[Math.round(5 + 5 * Math.cos(tau * 3.93))]);
  }
  function pick(w, h) {
    var k = w >= 380 && h >= 290 ? 'full' : 'mini';
    var W = k === 'full' ? Math.max(380, Math.min(820, w)) : Math.max(260, Math.min(420, w));
    var H = k === 'full' ? Math.max(290, Math.min(640, h)) : Math.max(170, Math.min(280, h));
    W = Math.floor(W / 2) * 2; H = Math.floor(H / 2) * 2;
    var name = k + '-' + W + 'x' + H;
    if (!this.layouts[name]) this.layouts[name] = { w: W, h: H, kind: k };
    return name;
  }
  /* The loop fades out over its last 0.4 s and resets unseen; the four periods
     differ by half a second, so tiles side by side never clear together. */
  function scene(P, still, build, tick) {
    var R = null;
    return {
      layouts: {}, pick: pick, start: 0, still: still,
      build: function (stage, L) { R = build(stage, L); R.stage = stage; },
      tick: function (t) {
        var tau = mod(t, P);
        cl(R.stage, 'is-clear', tau >= P - 0.4 || tau < 0.15);
        tick(R, tau);
      },
      cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  /* =========================== 市场信号 =========================== */
  function SignalScene() {
    var B = [
      { n: 'Nordic Mobility AB', cc: 'SE', sub: T('电动自行车 · 斯德哥尔摩', 'E-bikes · Stockholm'), s0: 93, s1: 93 },
      { n: 'Silva Mobilidade Ltda', cc: 'BR', sub: T('电动两轮 · 圣保罗', 'E-scooters · São Paulo'), s0: 89, s1: 89 },
      { n: 'Nordwerk Energie GmbH', sn: 'Nordwerk Energie', cc: 'DE', sub: T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), s0: 88, s1: 94 },
      { n: 'Gulf Coast Lift Supply', sn: 'Gulf Coast Lift', cc: 'US', sub: T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), s0: 85, s1: 91 }
    ];
    var SIG = [
      { at: 1.1, b: 3, k: T('招聘', 'Hiring'), text: T('车队换锂电，正在招聘采购专员', 'Fleet moving to lithium, hiring a buyer'), m: T('', 'Going lithium, hiring a buyer') },
      { at: 4.5, b: 2, k: T('招标', 'Tender'), text: T('近 90 天第 3 条储能招标', 'Third storage tender in 90 days') }
    ];
    var RANK = [[0, 1, 2, 3], [0, 2, 3, 1], [1, 3, 0, 2]], RE = [2.3, 5.7];
    var WHY = 7.7, TYPE1 = 10.1, ASK = 10.5;
    var D = {
      // the sources the site's own copy names (采购记录、招聘、扩张和企业动态), and no others
      scanK: T('正在扫描', 'Scanning'), scan: T('招聘、招标、采购记录和官网动态…', 'Hiring, tenders, purchase records, websites…'), scanM: T('', 'Hiring, tenders, purchases…'),
      sigK: T('新信号', 'New signal'), whyK: T('推荐理由', 'Why this buyer'),
      why: T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配，建议优先联系采购经理。', 'Three storage tenders in 90 days and a product line that fits 48V 100Ah. Contact the purchasing manager first.'),
      whyMid: T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配。', 'Three storage tenders in 90 days; the product line fits 48V 100Ah.'),
      whyMini: T('近 90 天 3 条储能招标', '3 storage tenders'),
      ask: T('建议优先联系 · 由你决定', 'Contact first? Your call'), askMini: T('由你决定', 'Your call'),
      list: T('候选客户 · 按匹配度排序', 'Buyers, ranked by fit'), scanned: T('今日已扫描 ', 'Scanned today: '),
      live: [T('扫描中', 'Scanning'), T('写推荐', 'Writing'), T('等你决定', 'Your call')]
    };
    function score(i, tau) {
      var b = B[i], s = b.s0;
      for (var k = 0; k < SIG.length; k++) if (SIG[k].b === i) s += (b.s1 - b.s0) * ease.out(seg(tau, SIG[k].at + 0.25, SIG[k].at + 1.05));
      return Math.round(s);
    }
    function build(stage, L) {
      var F = frame(stage, L, 'Growth OS', 'signal'), full = F.full, R = { F: F };
      // a narrow tile keeps the suggestion on the signal card, so the top buyer's row keeps its name
      var narrow = full && F.W < 600;
      R.sn = narrow || !full;
      var ch = full ? (narrow ? 104 : 92) : 40;
      var card = R.card = box('sg-crew-card sg-crew-sig', stage, F.pad, F.top, F.iw, ch);
      if (narrow) cl(card, 'is-ask', true);
      var ic = el('span', 'sg-crew-sig-ico', card); glyph('signal', ic, full ? 18 : 13);
      var tx = el('div', 'sg-crew-sig-tx', card);
      var hd = el('div', 'sg-crew-sig-k', tx);
      R.k = el('span', 'sg-crew-chip', hd);
      R.who = el('b', '', hd);
      R.text = el('div', 'sg-crew-sig-text', tx);
      R.typer = new Typer(R.text, !full ? D.whyMini : narrow ? D.whyMid : D.why);
      R.delta = el('span', 'sg-crew-delta', card);
      glyph('up', R.delta, full ? 13 : 11); el('span', '', R.delta, '+6');
      R.ask = el('span', 'sg-crew-ask', full && !narrow ? null : narrow ? tx : card);
      el('i', '', R.ask); el('span', '', R.ask, full ? D.ask : D.askMini);
      var ly = F.top + ch + (full ? (F.mid ? 14 : 18) : 8);
      if (full) {
        var lh = box('sg-crew-k sg-crew-lhead', stage, F.pad, ly, F.iw, 18);
        el('span', '', lh, D.list);
        R.count = el('span', 'sg-crew-count', lh);
        ly += 28;
      }
      // four rows when each gets 30 px, else three, and the fourth slides in and out of sight below
      var lhH = F.bottom - ly, n = R.n = full && Math.floor(lhH / 4) >= 30 ? 4 : 3;
      var pitch = Math.min(full ? 78 : 30, Math.floor(lhH / n)), rh = pitch - (full ? 8 : 4);
      R.pitch = pitch;
      var list = box('sg-crew-list', stage, F.pad, ly, F.iw, pitch * n - (full ? 8 : 4));
      R.rows = B.map(function (b, i) {
        var r = box('sg-crew-row', list, 0, 0, F.iw, rh);
        var rk = el('span', 'sg-crew-rank', r);
        el('span', 'sg-cc', r, b.cc);
        var m = el('div', 'sg-crew-row-m', r);
        el('b', '', m, b.n);
        if (full && rh >= 46) el('span', '', m, b.sub);
        var sc = el('div', 'sg-crew-score', r);
        var v = el('b', '', sc);
        var bar = full && rh >= 44 ? el('i', '', sc) : null, fill = bar ? el('i', '', bar) : null;
        if (full && !narrow && i === 2) r.insertBefore(R.ask, sc);
        return { r: r, rk: rk, v: v, fill: fill, s: -1, rank: -1 };
      });
      return R;
    }
    function tick(R, tau) {
      var F = R.F, i;
      var st = tau < SIG[0].at ? -1 : tau < SIG[1].at ? 0 : tau < WHY ? 1 : 2;
      if (R.st !== st) {
        R.st = st;
        // a narrow card or a phone names the signal's kind alone and the buyer's short name, so both fit
        if (st < 0) { put(R.k, 'text', D.scanK); put(R.who, 'text', ''); put(R.text, 'text', !F.full && D.scanM || D.scan); }
        else if (st < 2) { put(R.k, 'text', R.sn ? SIG[st].k : D.sigK + ' · ' + SIG[st].k); put(R.who, 'text', R.sn ? B[SIG[st].b].sn : B[SIG[st].b].n); put(R.text, 'text', !F.full && SIG[st].m || SIG[st].text); }
        else { put(R.k, 'text', D.whyK); put(R.who, 'text', R.sn ? B[2].sn : B[2].n); R.typer.n = -1; }
        put(R.card, 'data-st', st < 0 ? 'scan' : st < 2 ? 'sig' : 'why');
        if (st >= 0) K.flash(R.text);
      }
      if (st === 2) R.typer.at(seg(tau, WHY + 0.2, TYPE1));
      else cl(R.text, 'is-typing', false);
      cl(R.delta, 'is-on', st >= 0 && st < 2 && tau >= SIG[st].at + 0.25 && tau < SIG[st].at + 2.9);
      cl(R.ask, 'is-on', tau >= ASK);
      var rs = tau < RE[0] ? 0 : tau < RE[1] ? 1 : 2, rank = RANK[rs];
      for (i = 0; i < 4; i++) {
        var row = R.rows[i], s = score(i, tau);
        if (row.s !== s) {
          row.s = s; put(row.v, 'text', String(s));
          if (row.fill) sx(row.fill, (s - 70) / 30);
        }
        if (row.rank !== rank[i]) {
          row.rank = rank[i];
          put(row.r, '-transform', 'translateY(' + rank[i] * R.pitch + 'px)');
          put(row.rk, 'text', '0' + (rank[i] + 1));
          cl(row.r, 'is-out', rank[i] >= R.n);
        }
        var lit = false;
        for (var k = 0; k < SIG.length; k++) if (SIG[k].b === i && tau >= SIG[k].at && tau < SIG[k].at + 2.9) lit = true;
        cl(row.r, 'is-on', lit);
        cl(row.r, 'is-top', i === 2 && tau >= WHY);
      }
      if (R.count) {
        var n = 1236 + Math.floor(48 * tau / 14);
        if (R.cn !== n) { R.cn = n; put(R.count, 'text', D.scanned + K.fmt(n)); }
      }
      liveTick(F, tau < WHY ? 0 : tau < ASK ? 1 : 2, D.live, null, tau);
    }
    return scene(14, 12.2, build, tick);
  }

  /* ============================= 报价 ============================= */
  function QuoteScene() {
    var LINES = [
      { at: 1.0, k: T('72V 锂电池组', '72V lithium pack'), q: T('50 套', '50 sets'), u: 'US$ 412', v: 20600 },
      { at: 1.9, k: T('运输文件 UN38.3 · MSDS', 'UN38.3 · MSDS documents'), q: '', u: T('含', 'incl.'), v: 0 },
      { at: 2.8, k: T('海运 · CIF Jebel Ali', 'Sea freight · CIF Jebel Ali'), q: '', u: '', v: 1180 }
    ];
    var CHECK0 = 4.1, CHECK1 = 5.3, GATE = 6.3;
    var D = {
      title: T('报价 Q-1042', 'Quote Q-1042'), who: T('Ahmed Al-Rashid · 阿联酋', 'Ahmed Al-Rashid · UAE'),
      ask: T('询盘：72V 锂电池组的价格，50 套', 'Inquiry: price for the 72V lithium pack, 50 units'),
      total: T('合计', 'Total'), check: T('底价校验', 'Floor-price check'), checking: T('核对中…', 'Checking…'), checkingN: T('底价校验中…', 'Checking the floor price…'),
      below: T('单价低于底价 US$ 426（-3.3%）', 'Unit price below the US$ 426 floor (-3.3%)'), belowMini: T('低于底价 3.3%', 'Below floor, -3.3%'),
      gate: T('已提交审批 · 等你批准', 'Awaiting your approval'), gateSub: T('批准前不会发给客户', 'Not sent until you approve'),
      gateMini: T('低于底价 · 等你审批', 'Below floor · your approval'),
      approve: T('批准', 'Approve'), revise: T('修改', 'Revise'),
      cols: [T('品名', 'Item'), T('数量', 'Qty'), T('单价', 'Unit'), T('金额', 'Amount')],
      live: [T('报价中', 'Quoting'), T('校验中', 'Checking'), T('等你审批', 'Needs approval')],
      liveM: [T('报价中', 'Quoting'), T('校验中', 'Checking'), T('等你审批', 'Approve?')]
    };
    function build(stage, L) {
      var F = frame(stage, L, 'Sales Desk', 'doc'), full = F.full, R = { F: F }, y = F.top;
      var hd = box('sg-crew-qhead', stage, F.pad, y, F.iw, full ? 48 : 20);
      var t1 = el('div', 'sg-crew-qtitle', hd); el('b', '', t1, full ? D.title : 'Q-1042'); el('span', '', t1, D.who);
      if (full) el('div', 'sg-crew-qask', hd, D.ask);
      y += full ? (F.mid ? 58 : 62) : 24;
      /* Gate on the floor, check above, table in what is left; without room for
         three 30 px rows (and on a phone) check and gate share one slot. A short
         table drops the column heads, then the documents line. */
      var gh = full ? (F.mid ? 58 : 64) : 22, ckh = full ? 40 : 22, gap = full ? 12 : 5;
      var share = R.share = !full || F.bottom - y - gh - ckh - 2 * gap - 8 < 90;
      var avail = (share ? F.bottom - gh - gap : F.bottom - gh - ckh - 2 * gap) - y - (full ? 8 : 4);
      var nr = !full ? 3 : avail / 5 >= 34 ? 5 : avail / 4 >= 30 ? 4 : 3, head = nr === 5, docs = nr >= 4;
      var rh = full ? Math.min(48, Math.floor(avail / nr)) : 19;
      var tb = box('sg-crew-card sg-crew-qtable', stage, F.pad, y, F.iw, rh * nr + (full ? 8 : 4));
      if (head) {
        var th = el('div', 'sg-crew-qrow is-head', tb); th.style.height = rh + 'px';
        el('span', 'sg-crew-qk', th, D.cols[0]); el('span', 'sg-crew-qq', th, D.cols[1]); el('span', 'sg-crew-qu', th, D.cols[2]); el('span', 'sg-crew-qv', th, D.cols[3]);
      }
      R.lines = LINES.map(function (l, i) {
        if (i === 1 && !docs) return null;
        var r = el('div', 'sg-crew-qrow', tb); r.style.height = rh + 'px';
        // a line without a quantity or a unit price gives its label those columns
        el('span', 'sg-crew-qk', r, l.k);
        if (full && l.q) el('span', 'sg-crew-qq', r, l.q);
        var u = l.u ? el('span', 'sg-crew-qu', r, l.u) : null;
        el('b', 'sg-crew-qv', r, l.v ? 'US$ ' + K.fmt(l.v) : '—');
        return { r: r, u: u };
      });
      var tr = el('div', 'sg-crew-qrow is-total', tb); tr.style.height = rh + 'px';
      el('span', 'sg-crew-qk', tr, D.total);
      R.total = el('b', 'sg-crew-qv', tr);
      y = !full ? y + rh * 3 + 9 : share ? F.bottom - gh : F.bottom - gh - gap - ckh;
      var ck = R.check = box('sg-crew-check', stage, F.pad, y, F.iw, share ? gh : ckh);
      var cki = el('span', 'sg-crew-check-ico', ck); glyph('warn', cki, full ? 15 : 12);
      R.lab = full && F.iw >= 460;
      if (R.lab) el('span', 'sg-crew-check-k', ck, D.check);
      R.checkT = el('span', 'sg-crew-check-v', ck);
      var cb = el('i', 'sg-crew-scan', ck); R.scan = el('i', '', cb);
      if (!share) y += ckh + gap;
      var g = gateBox(F, stage, y, gh, full ? D.gate : D.gateMini, D.gateSub, D.approve, D.revise);
      R.gate = g.g; R.ring = g.ring;
      return R;
    }
    function tick(R, tau) {
      var full = R.F.full, sum = 0, i;
      for (i = 0; i < LINES.length; i++) {
        var on = tau >= LINES[i].at, ln = R.lines[i];
        if (ln) { if (on && !ln.r.classList.contains('is-in')) pop(ln.r); cl(ln.r, 'is-in', on); }
        sum += LINES[i].v * ease.out(seg(tau, LINES[i].at, LINES[i].at + 0.7));
      }
      var tv = Math.round(sum / 10) * 10;
      if (R.tv !== tv) { R.tv = tv; put(R.total, 'text', tv ? 'US$ ' + K.fmt(tv) : '—'); }
      var cs = tau < CHECK0 ? 0 : tau < CHECK1 ? 1 : 2;
      if (R.cs !== cs) {
        R.cs = cs;
        put(R.check, 'data-st', String(cs));
        textSwap(R.checkT, cs === 2 ? (full ? D.below : D.belowMini) : cs === 1 ? (R.lab ? D.checking : D.checkingN) : R.lab ? '' : D.check);
        cl(R.lines[0].u, 'is-flag', cs === 2);
      }
      sx(R.scan, ease.io(seg(tau, CHECK0, CHECK1 - 0.1)));
      var gOn = tau >= GATE;
      if (gOn && !R.gate.classList.contains('is-on')) pop(R.gate);
      cl(R.gate, 'is-on', gOn);
      if (R.share) cl(R.check, 'is-off', gOn);
      breathe(R.ring, gOn, tau);
      liveTick(R.F, tau < CHECK0 ? 0 : tau < GATE ? 1 : 2, D.live, D.liveM, tau);
    }
    return scene(14.5, 11.5, build, tick);
  }

  /* ============================= 跟进 ============================= */
  function FollowScene() {
    var DAYS = [T('10/20', 'Oct 20'), T('10/21', 'Oct 21'), T('10/22', 'Oct 22'), T('今天', 'Today')];
    var DAY_AT = [0.7, 1.5, 2.3, 3.1], GAP = 3.5, DRAFT0 = 4.2, DRAFT1 = 8.6, GATE = 9.1;
    var MAIL = 'Hello, following up on our quote for 200 pcs 48V 100Ah, DAP Hamburg. Happy to answer questions or arrange a sample pack first.';
    var MAIL_2 = 'Following up on our quote for 200 pcs 48V 100Ah, DAP Hamburg. Can we answer any questions?';
    // one-line drafts, longest first: the first that fits whole is typed (≈ 8 / 6.9 px a character)
    var MAIL_1 = ['Following up on our quote for 200 pcs 48V 100Ah, DAP Hamburg…', 'Following up on our quote for 200 pcs 48V 100Ah…', 'Following up on our 48V 100Ah quote…'];
    var MAIL_LONG = 'Hello,\nFollowing up on the quote we sent on 20 October for 200 pcs 48V 100Ah, DAP Hamburg. Is there anything we can clarify? We can also arrange a sample pack first.\nBest regards';
    var D = {
      who: 'Müller Energie GmbH', where: T('德国 · 询盘 200 pcs 48V 100Ah, DAP Hamburg', 'Germany · inquiry: 200 pcs 48V 100Ah, DAP Hamburg'),
      whereS: T('德国 · 200 pcs 48V 100Ah', 'Germany · 200 pcs 48V 100Ah'), whereXS: T('德国 · 48V 100Ah', 'Germany · 48V 100Ah'),
      whoMini: T('Müller Energie · 德国', 'Müller Energie · Germany'),
      sent: T('已发报价', 'Quote sent'), quiet: T('未回复', 'No reply'), silent: T('3 天未回复', 'No reply in 3 days'),
      draftK: T('AI 起草的跟进信 · 英文', 'Follow-up drafted by AI'),
      gate: T('待你确认 · 尚未发送', 'Waiting for your OK'), gateSub: T('你确认后才会发出', 'Not sent until you confirm'),
      send: T('确认发送', 'Confirm & send'), edit: T('修改', 'Edit'),
      live: [T('盯进度', 'Watching'), T('起草中', 'Drafting'), T('待你确认', 'Needs your OK')],
      liveM: [T('盯进度', 'Watching'), T('起草中', 'Drafting'), T('待你确认', 'Your OK')]
    };
    function build(stage, L) {
      var F = frame(stage, L, T('客户会话', 'Customer Chat'), 'mail'), full = F.full, R = { F: F }, y = F.top;
      var two = full && F.H >= 440;
      var hd = box('sg-crew-fhead', stage, F.pad, y, F.iw, full ? 44 : 24);
      el('span', 'sg-crew-av', hd, 'ME');
      var ht = el('div', 'sg-crew-fwho', hd); el('b', '', ht, full ? D.who : D.whoMini);
      var room = F.iw - 52 - (two ? 0 : T(102, 152));
      if (full) el('span', '', ht, room >= 300 ? D.where : room >= 190 ? D.whereS : D.whereXS);
      // 3 天未回复 is said once: by the header pill (one-line timeline) or, once the days pass, the last label
      R.silent = full && !two ? el('span', 'sg-crew-silent', hd, D.silent) : null;
      y += full ? (F.mid ? 56 : 60) : 28;
      var th = two ? 52 : full ? 34 : 30, tl = R.tl = box('sg-crew-tl', stage, F.pad, y, F.iw, th);
      var x0 = full ? 8 : 5, x1 = F.iw - (full ? 8 : 5), ly = full ? 12 : 6;
      var svg = sv('svg', { class: 'sg-crew-tl-svg', width: F.iw, height: th, viewBox: '0 0 ' + F.iw + ' ' + th, 'aria-hidden': 'true' }, tl);
      sv('line', { x1: x0, y1: ly, x2: x1, y2: ly, class: 'sg-crew-tl-base' }, svg);
      R.gapLine = sv('line', { x1: x0 + (x1 - x0) / 3, y1: ly, x2: x0 + (x1 - x0) / 3, y2: ly, class: 'sg-crew-tl-gap' }, svg);
      R.gx = [x0 + (x1 - x0) / 3, x1];
      R.end = null; R.endA = full ? D.quiet : DAYS[3];
      R.dots = DAYS.map(function (d, i) {
        var x = x0 + (x1 - x0) * i / 3;
        var c = sv('circle', { cx: x, cy: ly, r: full ? 5 : 3.5, class: 'sg-crew-tl-dot' + (i === 0 ? ' is-sent' : '') }, svg);
        var lab = box('sg-crew-tl-lab', tl, x, ly + (full ? 12 : 8), null, null);
        if (full) {
          el('b', '', lab, d);
          if (two) { var s = el('span', '', lab, i === 0 ? D.sent : D.quiet); if (i === 3) R.end = s; }
        } else if (i === 0 || i === 3) { var b = el('b', '', lab, d); if (i === 3) R.end = b; }
        cl(lab, 'is-end', i === 3); cl(lab, 'is-start', i === 0);
        return { c: c, lab: lab };
      });
      y += th + (full ? (F.mid ? 10 : 14) : 6);
      // the draft takes what the gate leaves, and shows only the lines that fit whole
      var gh = full ? (F.mid ? 56 : 64) : 24, gap = full ? 12 : 5;
      var dh = Math.max(full ? 40 : 22, F.bottom - y - gh - gap);
      var dr = R.draft = box('sg-crew-card sg-crew-draft', stage, F.pad, y, F.iw, dh);
      var withK = full && dh >= 72, lines = full ? Math.floor((dh - 24 - (withK ? 25 : 0)) / 23) : 1;
      var long = full && dh >= 170;
      if (withK) { var dk = el('div', 'sg-crew-k', dr); glyph('mail', dk, 13); el('span', '', dk, D.draftK); }
      if (long) el('div', 'sg-crew-draft-subj', dr, 'Re: 200 pcs 48V 100Ah, DAP Hamburg');
      R.body = el('div', 'sg-crew-draft-text', dr);
      if (lines <= 1) cl(dr, 'is-one', true);
      var one = MAIL_1[2], cap = (F.iw - (full ? 32 : 16)) / (full ? 8 : 6.9);
      for (var mi = MAIL_1.length - 1; mi >= 0; mi--) if (MAIL_1[mi].length <= cap) one = MAIL_1[mi];
      R.typer = new Typer(R.body, long ? MAIL_LONG : lines >= 3 ? MAIL : lines === 2 ? MAIL_2 : one);
      var g = gateBox(F, stage, y + dh + gap, gh, D.gate, D.gateSub, D.send, D.edit);
      R.gate = g.g; R.ring = g.ring;
      return R;
    }
    function tick(R, tau) {
      for (var i = 0; i < 4; i++) {
        var on = tau >= DAY_AT[i];
        cl(R.dots[i].c, 'is-on', on); cl(R.dots[i].lab, 'is-on', on);
      }
      var g = Math.round(100 * ease.io(seg(tau, DAY_AT[1], DAY_AT[3])));
      if (R.g !== g) { R.g = g; put(R.gapLine, 'x2', String(Math.round(10 * (R.gx[0] + (R.gx[1] - R.gx[0]) * g / 100)) / 10)); }
      var quiet = tau >= GAP;
      if (R.silent) cl(R.silent, 'is-on', quiet);
      if (R.end) { textSwap(R.end, quiet ? D.silent : R.endA); cl(R.end, 'is-alert', quiet); }
      cl(R.tl, 'is-alert', quiet);
      cl(R.draft, 'is-on', tau >= DRAFT0 - 0.3);
      R.typer.at(seg(tau, DRAFT0, DRAFT1));
      var gOn = tau >= GATE;
      if (gOn && !R.gate.classList.contains('is-on')) pop(R.gate);
      cl(R.gate, 'is-on', gOn);
      breathe(R.ring, gOn, tau);
      liveTick(R.F, tau < DRAFT0 ? 0 : tau < GATE ? 1 : 2, D.live, D.liveM, tau);
    }
    return scene(15, 11.8, build, tick);
  }

  /* ============================= 统筹 ============================= */
  function CoordScene() {
    var GOAL = T('开拓巴西电动两轮市场', 'Open the Brazil e-scooter market');
    var STEPS = [
      { t: T('找出 12 家经销商', 'Find 12 dealers'), m: T('找出 12 家经销商', 'Find 12 dealers'), s: T('找经销商', 'Dealers'), who: T('研究', 'Research'), a: 2.6, b: 6.4 },
      { t: T('核对 60V/72V 参数', 'Check 60V/72V specs'), m: T('核对 60V/72V 参数', 'Check 60V/72V'), s: T('核对参数', 'Specs'), who: T('产品', 'Product'), a: 2.8, b: 5.2 },
      { t: T('起草葡语开发信', 'Draft Portuguese emails'), m: T('起草葡语开发信', 'Draft PT emails'), s: T('写开发信', 'Emails'), who: T('销售', 'Sales'), a: 6.6, b: 9.0, wait: T('等名单和参数', 'Waits on 01, 02'), waitM: T('等 01·02', 'After 01·02') },
      { t: T('做 3 张场景图', 'Make 3 scene images'), m: T('做 3 张场景图', 'Make 3 images'), s: T('场景图', 'Images'), who: T('创意', 'Creative'), a: 3.0, b: 8.0 },
      { t: T('汇总，交你确认', 'Summary for your OK'), m: T('汇总，交你确认', 'Summary for you'), s: T('汇总', 'Summary'), who: T('统筹', 'Lead'), a: 9.2, b: 10.3, last: true }
    ];
    var TYPE0 = 0.4, TYPE1 = 1.6, SPLIT = 1.9;
    var D = {
      goalK: T('目标', 'Goal'), split: T('统筹拆成 5 步，交给 4 位 AI 员工', 'Split into 5 steps for 4 AI employees'),
      run: T('进行中', 'Running'), done: T('完成', 'Done'), wait: T('等你确认', 'Your OK'), idle: T('待开始', 'Queued'),
      sum: T('4/5 完成 · 汇总待你确认，确认前不对外发送', '4 of 5 done · summary waits for your OK; nothing goes out until then'),
      sumMid: T('4/5 完成 · 汇总待你确认，确认前不对外发送', 'Summary waits for your OK; nothing is sent'),
      sumMini: T('汇总待你确认', 'Summary needs your OK'),
      live: [T('拆分任务', 'Planning'), T('4 位协作中', '4 at work'), T('等你确认', 'Needs your OK')],
      liveM: [T('拆分任务', 'Planning'), T('4 位协作中', '4 at work'), T('等你确认', 'Your OK')]
    };
    function build(stage, L) {
      var F = frame(stage, L, T('数字员工', 'AI Staff'), 'layers'), full = F.full, R = { F: F }, y = F.top;
      var gh = full ? (F.mid ? 54 : 58) : 22;
      var gc = box('sg-crew-card sg-crew-goal', stage, F.pad, y, F.iw, gh);
      if (full) el('span', 'sg-crew-k', gc, D.goalK);
      var gb = el('div', 'sg-crew-goal-b', gc);
      R.goal = el('b', 'sg-crew-type', gb);
      R.typer = new Typer(R.goal, GOAL);
      if (full) R.splitT = el('span', 'sg-crew-goal-s', gb, D.split);
      y += gh + (full ? (F.mid ? 10 : 14) : 4);
      // the summary gets its own bar if each step keeps 34 px, else it opens over step 05
      var n = STEPS.length, sumH = 44, room = F.bottom - y;
      var own = full && Math.floor((room - sumH - 10 + 6) / n) >= 34;
      var pitch = Math.min(full ? 58 : 22, Math.floor((room - (own ? sumH + 10 : 0) + (full ? 6 : 2)) / n));
      var rh = pitch - (full ? 6 : 2);
      R.rows = STEPS.map(function (s, i) {
        var r = box('sg-crew-step', stage, F.pad, y + i * pitch, F.iw, rh);
        el('span', 'sg-crew-sn', r, '0' + (i + 1));
        el('span', 'sg-crew-st', r, full ? (F.iw >= 440 ? s.t : s.m) : F.W >= 300 ? s.t : s.s);
        el('span', 'sg-crew-who', r, s.who);
        var stt = el('span', 'sg-crew-ss', r);
        var bar = full ? el('i', 'sg-crew-sbar', r) : null;
        return { r: r, st: stt, fill: bar ? el('i', '', bar) : null, k: -1, f: -1 };
      });
      if (own) {
        R.sum = box('sg-crew-sum', stage, F.pad, F.bottom - sumH, F.iw, sumH);
        R.ring = gateGlyph(el('span', 'sg-crew-gico', R.sum), 24);
        el('span', '', R.sum, F.iw >= 520 ? D.sum : D.sumMid);
      } else {
        // over step 05: the row's own words step out first, then the summary steps in
        R.sum = el('span', 'sg-crew-summini', R.rows[n - 1].r);
        R.ring = full ? gateGlyph(el('span', 'sg-crew-gico', R.sum), 20) : null;
        el('span', '', R.sum, full ? D.sumMid : D.sumMini);
      }
      R.over = !own;
      return R;
    }
    function tick(R, tau) {
      var full = R.F.full;
      R.typer.at(seg(tau, TYPE0, TYPE1));
      if (R.splitT) cl(R.splitT, 'is-on', tau >= SPLIT);
      for (var i = 0; i < STEPS.length; i++) {
        var s = STEPS[i], row = R.rows[i];
        cl(row.r, 'is-in', tau >= SPLIT + 0.12 * i);
        var k = tau < s.a ? (s.wait && tau >= SPLIT + 0.6 ? 4 : 0) : tau < s.b ? 1 : s.last ? 3 : 2;
        if (row.k !== k) {
          var was = row.k; row.k = k;
          put(row.r, 'data-k', String(k));
          textSwap(row.st, k === 4 ? (R.F.iw >= 440 ? s.wait : s.waitM) : k === 1 ? D.run : k === 2 ? D.done : k === 3 ? D.wait : D.idle);
          if (k >= 2 && was === 1) pop(row.r);
        }
        if (row.fill) sx(row.fill, seg(tau, s.a, s.b));
      }
      var gate = tau >= STEPS[4].b;
      cl(R.sum, 'is-on', gate);
      if (R.over) cl(R.rows[4].r, 'is-sum', gate);
      if (R.ring) breathe(R.ring, gate, tau);
      liveTick(R.F, tau < SPLIT + 0.7 ? 0 : !gate ? 1 : 2, D.live, D.liveM, tau);
    }
    return scene(15.5, 12, build, tick);
  }

  return { crewSignal: SignalScene, crewQuote: QuoteScene, crewFollow: FollowScene, crewCoord: CoordScene };
});
