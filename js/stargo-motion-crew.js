/* CREW — about.html's four AI-employee tiles (tools/blocks/cn-about-projects.mjs),
   where the owner's still lifes D01, D07, D02 and D05 were: each AI employee
   drawn at its work, in the product's own dark chrome.

     crewSignal  市场信号 — two signals arrive, the buyers re-rank, the top one
                 gets a written reason and waits for your decision (Growth OS)
     crewQuote   报价     — quote Q-1042 is assembled line by line, fails the
                 floor-price check and stops at your approval (Sales Desk)
     crewFollow  跟进     — Müller Energie has been silent for three days; a
                 follow-up is drafted and waits for your OK (客户会话)
     crewCoord   统筹     — a goal is split into five steps, handed to four
                 roles, and the summary waits for you (数字员工)

   Nothing is ever sent: every loop ends at a person. Names and numbers are the
   site's one demo cast (js/stargo-motion.js, js/stargo-motion-phone.js) and
   every tile says on itself that it is illustrative motion with demo data.

   Each tile takes its box's own size as the stage (scale 1), so the type is
   drawn at its design size: 'full' from about 380 × 300 (desktop, tablet),
   'mini' below (phones, 296–326 × 192). The tile's STARGO wordmark is laid
   over the app bar's left end (css/stargo-motion-crew.css), so the bar leaves
   it room. Queued on window.STARGO_SCENES; js/stargo-motion.js runs it. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  var G = {
    signal: 'M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    clock: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 8v4.2l2.8 1.8',
    layers: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    up: 'M12 18V6.5M6.5 12 12 6.5l5.5 5.5',
    warn: 'M12 4.5 21 19.5H3zM12 10v4.2M12 17h.01',
    mail: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM5 7l7 5.5L19 7'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
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

  /* One frame for all four: the stage (its box's size), an app bar that leaves
     the wordmark its corner, the live pill, the tag, and a body below. */
  function frame(stage, L, app, ico) {
    var full = L.kind === 'full', W = L.w, H = L.h;
    stage.className = 'sg-mo-stage sg-crew is-' + L.kind + (W < 330 ? ' is-narrow' : '');
    var bh = full ? 56 : 36;
    var bar = box('sg-crew-bar', stage, 0, 0, W, bh);
    el('span', 'sg-crew-brand', bar);
    var ap = el('span', 'sg-crew-app', bar);
    glyph(ico, ap, full ? 16 : 13);
    el('b', '', ap, app);
    var live = el('span', 'sg-app-live sg-crew-live', bar);
    el('i', '', live);
    var liveT = el('span', '', live);
    var tag = el('div', 'sg-tag sg-crew-tag', stage, full ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
    tag.style.left = (W - (full ? 18 : 10)) + 'px';
    tag.style.top = (H - (full ? 12 : 5)) + 'px';
    var pad = full ? 20 : 10, top = bh + (full ? 16 : 8), bottom = H - (full ? 34 : 22);
    return { full: full, W: W, H: H, pad: pad, top: top, bottom: bottom, iw: W - 2 * pad, live: live, liveT: liveT, liveK: -1 };
  }
  function liveTick(F, k, texts) {
    if (F.liveK === k) return;
    F.liveK = k;
    textSwap(F.liveT, texts[k]);
    cl(F.live, 'is-wait', k === texts.length - 1);
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
  // a scene object around a build and a tick; the loop fades out and back in at its seam
  function scene(P, still, build, tick) {
    var R = null;
    return {
      layouts: {}, pick: pick, start: 0, still: still,
      build: function (stage, L) { R = build(stage, L); R.stage = stage; },
      tick: function (t) {
        var tau = mod(t, P);
        cl(R.stage, 'is-clear', tau >= P - 0.7 || tau < 0.35);
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
      { n: 'Nordwerk Energie GmbH', cc: 'DE', sub: T('储能系统集成 · 汉堡', 'Storage integrator · Hamburg'), s0: 88, s1: 94 },
      { n: 'Gulf Coast Lift Supply', cc: 'US', sub: T('叉车与仓储 · 休斯敦', 'Forklift fleets · Houston'), s0: 85, s1: 91 }
    ];
    var SIG = [
      { at: 1.1, b: 3, k: T('招聘', 'Hiring'), text: T('车队换锂电，正在招聘采购专员', 'Fleet moving to lithium, hiring a buyer') },
      { at: 4.5, b: 2, k: T('招标', 'Tender'), text: T('近 90 天第 3 条储能招标', 'Third storage tender in 90 days') }
    ];
    var RANK = [[0, 1, 2, 3], [0, 2, 3, 1], [1, 3, 0, 2]], RE = [2.3, 5.7];
    var WHY = 7.7, TYPE1 = 10.1, ASK = 10.5;
    var D = {
      scanK: T('正在扫描', 'Scanning'), scan: T('招聘、招标、海关数据和官网动态…', 'Hiring, tenders, customs data, websites…'),
      sigK: T('新信号', 'New signal'), whyK: T('推荐理由', 'Why this buyer'),
      why: T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配，建议优先联系采购经理。', 'Three storage tenders in 90 days and a product line that fits 48V 100Ah. Contact the purchasing manager first.'),
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
      var ch = full ? (F.W < 560 ? 104 : 92) : 40;
      var card = R.card = box('sg-crew-card sg-crew-sig', stage, F.pad, F.top, F.iw, ch);
      var ic = el('span', 'sg-crew-sig-ico', card); glyph('signal', ic, full ? 18 : 13);
      var tx = el('div', 'sg-crew-sig-tx', card);
      var hd = el('div', 'sg-crew-sig-k', tx);
      R.k = el('span', 'sg-crew-chip', hd);
      R.who = el('b', '', hd);
      R.text = el('div', 'sg-crew-sig-text', tx);
      R.typer = new Typer(R.text, full ? D.why : D.whyMini);
      R.delta = el('span', 'sg-crew-delta', card);
      glyph('up', R.delta, full ? 13 : 11); R.deltaT = el('span', '', R.delta, '+6');
      // the suggestion waits on the card (mini) or on the top buyer's row (full)
      R.ask = el('span', 'sg-crew-ask', full ? null : card);
      el('i', '', R.ask); el('span', '', R.ask, full && F.W >= 560 ? D.ask : D.askMini);
      var ly = F.top + ch + (full ? 18 : 8);
      if (full) {
        var lh = box('sg-crew-k sg-crew-lhead', stage, F.pad, ly, F.iw, 18);
        el('span', '', lh, D.list);
        R.count = el('span', 'sg-crew-count', lh);
        ly += 28;
      }
      var lhH = F.bottom - ly, n = full ? 4 : 3;
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
        if (full && i === 2) r.insertBefore(R.ask, sc);
        return { r: r, rk: rk, v: v, fill: fill, s: -1, rank: -1 };
      });
      return R;
    }
    function tick(R, tau) {
      var F = R.F, i;
      var st = tau < SIG[0].at ? -1 : tau < SIG[1].at ? 0 : tau < WHY ? 1 : 2;
      if (R.st !== st) {
        R.st = st;
        if (st < 0) { put(R.k, 'text', D.scanK); put(R.who, 'text', ''); put(R.text, 'text', D.scan); }
        else if (st < 2) { put(R.k, 'text', D.sigK + ' · ' + SIG[st].k); put(R.who, 'text', B[SIG[st].b].n); put(R.text, 'text', SIG[st].text); }
        else { put(R.k, 'text', D.whyK); put(R.who, 'text', B[2].n); R.typer.n = -1; }
        put(R.card, 'data-st', st < 0 ? 'scan' : st < 2 ? 'sig' : 'why');
        if (st >= 0) K.flash(R.text);
      }
      if (st === 2) R.typer.at(seg(tau, WHY + 0.2, TYPE1));
      else cl(R.text, 'is-typing', false);
      var dOn = st >= 0 && st < 2 && tau >= SIG[st].at + 0.25 && tau < SIG[st].at + 2.9;
      cl(R.delta, 'is-on', dOn);
      cl(R.ask, 'is-on', tau >= ASK);
      var rs = tau < RE[0] ? 0 : tau < RE[1] ? 1 : 2, rank = RANK[rs];
      for (i = 0; i < 4; i++) {
        var row = R.rows[i], s = score(i, tau);
        if (row.s !== s) {
          row.s = s; put(row.v, 'text', String(s));
          if (row.fill) put(row.fill, '-transform', 'scaleX(' + ((s - 70) / 30).toFixed(3) + ')');
        }
        if (row.rank !== rank[i]) {
          row.rank = rank[i];
          put(row.r, '-transform', 'translateY(' + rank[i] * R.pitch + 'px)');
          put(row.rk, 'text', '0' + (rank[i] + 1));
          cl(row.r, 'is-out', rank[i] > 3);
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
      liveTick(F, tau < WHY ? 0 : tau < ASK ? 1 : 2, D.live);
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
      total: T('合计', 'Total'), check: T('底价校验', 'Floor-price check'), checking: T('核对中…', 'Checking…'),
      below: T('单价低于底价 US$ 426（-3.3%）', 'Unit price below the US$ 426 floor (-3.3%)'), belowMini: T('低于底价 3.3%', 'Below floor, -3.3%'),
      gate: T('已提交审批 · 等你批准', 'Sent for approval · waiting for you'), gateSub: T('批准前不会发给客户', 'Nothing goes to the buyer before you approve'),
      gateMini: T('低于底价 · 等你审批', 'Below floor · your approval'),
      approve: T('批准', 'Approve'), revise: T('修改', 'Revise'),
      cols: [T('品名', 'Item'), T('数量', 'Qty'), T('单价', 'Unit'), T('金额', 'Amount')],
      live: [T('报价中', 'Quoting'), T('校验中', 'Checking'), T('等你审批', 'Needs approval')]
    };
    function build(stage, L) {
      var F = frame(stage, L, 'Sales Desk', 'doc'), full = F.full, R = { F: F }, y = F.top;
      var hd = box('sg-crew-qhead', stage, F.pad, y, F.iw, full ? 48 : 20);
      var t1 = el('div', 'sg-crew-qtitle', hd); el('b', '', t1, full ? D.title : 'Q-1042'); el('span', '', t1, D.who);
      if (full) el('div', 'sg-crew-qask', hd, D.ask);
      y += full ? 62 : 24;
      // the gate sits on the floor and the check above it; the table takes what is left
      var gh = full ? 70 : 0, ckh = full ? 40 : 22;
      // a short tile drops the column heads, then the documents line, before a row gets cramped
      var avail = F.bottom - gh - 12 - ckh - 12 - y - 8;
      var nr = !full ? 3 : avail / 5 >= 34 ? 5 : avail / 4 >= 30 ? 4 : 3, head = full && nr === 5, docs = !full ? false : nr >= 4;
      var rh = full ? Math.min(48, Math.max(26, Math.floor(avail / nr))) : 19;
      var tb = box('sg-crew-card sg-crew-qtable', stage, F.pad, y, F.iw, rh * nr + (full ? 8 : 4));
      if (head) {
        var th = el('div', 'sg-crew-qrow is-head', tb); th.style.height = rh + 'px';
        el('span', 'sg-crew-qk', th, D.cols[0]); el('span', 'sg-crew-qq', th, D.cols[1]); el('span', 'sg-crew-qu', th, D.cols[2]); el('span', 'sg-crew-qv', th, D.cols[3]);
      }
      R.lines = LINES.map(function (l, i) {
        if (i === 1 && !docs) return null;
        var r = el('div', 'sg-crew-qrow', tb); r.style.height = rh + 'px';
        el('span', 'sg-crew-qk', r, l.k);
        if (full) el('span', 'sg-crew-qq', r, l.q);
        var u = el('span', 'sg-crew-qu', r, l.u);
        el('b', 'sg-crew-qv', r, l.v ? 'US$ ' + K.fmt(l.v) : '—');
        return { r: r, u: u };
      });
      var tr = el('div', 'sg-crew-qrow is-total', tb); tr.style.height = rh + 'px';
      el('span', 'sg-crew-qk', tr, D.total);
      R.total = el('b', 'sg-crew-qv', tr);
      y = full ? F.bottom - gh - 12 - ckh : y + rh * 3 + 4 + 5;
      var ck = R.check = box('sg-crew-check', stage, F.pad, y, F.iw, ckh);
      var cki = el('span', 'sg-crew-check-ico', ck); glyph('warn', cki, full ? 15 : 12);
      if (full) el('span', 'sg-crew-check-k', ck, D.check);
      R.checkT = el('span', 'sg-crew-check-v', ck);
      var cb = el('i', 'sg-crew-scan', ck); R.scan = el('i', '', cb);
      if (full) y += ckh + 12;  // a phone's gate takes the check's place when it opens
      var g = R.gate = box('sg-crew-gatebox', stage, F.pad, y, F.iw, full ? gh : ckh);
      R.ring = gateGlyph(el('span', 'sg-crew-gico', g), full ? 30 : 18);
      var gt = el('div', 'sg-crew-gtx', g);
      el('b', '', gt, full ? D.gate : D.gateMini);
      if (full) {
        el('span', '', gt, D.gateSub);
        var bt = el('span', 'sg-crew-btns', g); el('span', 'sg-btn is-primary', bt, D.approve); el('span', 'sg-btn', bt, D.revise);
      }
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
        textSwap(R.checkT, cs === 2 ? (full ? D.below : D.belowMini) : cs === 1 ? D.checking : full ? '' : D.check);
        if (R.lines[0]) cl(R.lines[0].u, 'is-flag', cs === 2);
      }
      put(R.scan, '-transform', 'scaleX(' + ease.io(seg(tau, CHECK0, CHECK1 - 0.1)).toFixed(3) + ')');
      var gOn = tau >= GATE;
      if (gOn && !R.gate.classList.contains('is-on')) pop(R.gate);
      cl(R.gate, 'is-on', gOn);
      if (!full) cl(R.check, 'is-off', gOn); // on a phone the gate takes the check's place
      put(R.ring, 'transform', gOn ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)');
      liveTick(R.F, tau < CHECK0 ? 0 : tau < GATE ? 1 : 2, D.live);
    }
    return scene(14, 11.5, build, tick);
  }

  /* ============================= 跟进 ============================= */
  function FollowScene() {
    var DAYS = [T('10/20', 'Oct 20'), T('10/21', 'Oct 21'), T('10/22', 'Oct 22'), T('今天', 'Today')];
    var DAY_AT = [0.7, 1.5, 2.3, 3.1], GAP = 3.5, DRAFT0 = 4.2, DRAFT1 = 8.6, GATE = 9.1;
    var MAIL = 'Hello, following up on our quote for 200 pcs 48V 100Ah, DAP Hamburg. Happy to answer questions or arrange a sample pack first.';
    var MAIL_MINI = 'Following up on our quote for 200 pcs 48V 100Ah…';
    var MAIL_LONG = 'Hello,\nFollowing up on the quote we sent on 20 October for 200 pcs 48V 100Ah, DAP Hamburg. Is there anything we can clarify? We can also arrange a sample pack first.\nBest regards';
    var D = {
      who: 'Müller Energie GmbH', where: T('德国 · 询盘 200 pcs 48V 100Ah, DAP Hamburg', 'Germany · inquiry: 200 pcs 48V 100Ah, DAP Hamburg'),
      whoMini: T('Müller Energie · 德国', 'Müller Energie · Germany'),
      sent: T('已发报价', 'Quote sent'), silent: T('3 天未回复', 'No reply in 3 days'),
      draftK: T('AI 起草的跟进信 · 英文', 'Follow-up drafted by AI'),
      gate: T('待你确认 · 尚未发送', 'Needs your OK · not sent'), gateSub: T('你确认后才会发出', 'It goes out only after you confirm'),
      send: T('确认发送', 'Confirm & send'), edit: T('修改', 'Edit'),
      live: [T('盯进度', 'Watching'), T('起草中', 'Drafting'), T('待你确认', 'Needs your OK')]
    };
    function build(stage, L) {
      var F = frame(stage, L, T('客户会话', 'Customer Chat'), 'mail'), full = F.full, R = { F: F }, y = F.top;
      var hd = box('sg-crew-fhead', stage, F.pad, y, F.iw, full ? 44 : 20);
      el('span', 'sg-crew-av', hd, 'ME');
      var ht = el('div', 'sg-crew-fwho', hd); el('b', '', ht, full ? D.who : D.whoMini);
      if (full) el('span', '', ht, D.where);
      R.silent = el('span', 'sg-crew-silent', hd, D.silent);
      y += full ? 60 : 26;
      var two = full && F.H >= 440, th = two ? 52 : full ? 34 : 30, tl = R.tl = box('sg-crew-tl', stage, F.pad, y, F.iw, th);
      var x0 = full ? 8 : 5, x1 = F.iw - (full ? 8 : 5), ly = full ? 12 : 6;
      var svg = sv('svg', { class: 'sg-crew-tl-svg', width: F.iw, height: th, viewBox: '0 0 ' + F.iw + ' ' + th, 'aria-hidden': 'true' }, tl);
      sv('line', { x1: x0, y1: ly, x2: x1, y2: ly, class: 'sg-crew-tl-base' }, svg);
      R.gapLine = sv('line', { x1: x0 + (x1 - x0) / 3, y1: ly, x2: x0 + (x1 - x0) / 3, y2: ly, class: 'sg-crew-tl-gap' }, svg);
      R.gx = [x0 + (x1 - x0) / 3, x1];
      R.dots = DAYS.map(function (d, i) {
        var x = x0 + (x1 - x0) * i / 3;
        var c = sv('circle', { cx: x, cy: ly, r: full ? 5 : 3.5, class: 'sg-crew-tl-dot' + (i === 0 ? ' is-sent' : '') }, svg);
        var lab = box('sg-crew-tl-lab', tl, x, ly + (full ? 12 : 8), null, null);
        if (full) { el('b', '', lab, d); if (two) el('span', '', lab, i === 0 ? D.sent : i === 3 ? D.silent : T('未回复', 'No reply')); }
        else if (i === 0 || i === 3) el('b', '', lab, i === 0 ? d : D.silent);
        cl(lab, 'is-end', i === 3); cl(lab, 'is-start', i === 0);
        return { c: c, lab: lab };
      });
      y += th + (full ? 14 : 6);
      var gh = full ? 64 : 24, dh = Math.max(full ? 90 : 22, F.bottom - y - gh - (full ? 12 : 5));
      var dr = R.draft = box('sg-crew-card sg-crew-draft', stage, F.pad, y, F.iw, dh);
      var long = full && dh >= 170;
      if (full) { var dk = el('div', 'sg-crew-k', dr); glyph('mail', dk, 13); el('span', '', dk, D.draftK); }
      if (long) el('div', 'sg-crew-draft-subj', dr, 'Re: 200 pcs 48V 100Ah, DAP Hamburg');
      R.body = el('div', 'sg-crew-draft-text', dr);
      R.typer = new Typer(R.body, long ? MAIL_LONG : full && dh >= 120 ? MAIL : MAIL_MINI);
      y += dh + (full ? 12 : 5);
      var g = R.gate = box('sg-crew-gatebox', stage, F.pad, y, F.iw, gh);
      R.ring = gateGlyph(el('span', 'sg-crew-gico', g), full ? 30 : 18);
      var gt = el('div', 'sg-crew-gtx', g); el('b', '', gt, D.gate);
      if (full) {
        el('span', '', gt, D.gateSub);
        var bt = el('span', 'sg-crew-btns', g); el('span', 'sg-btn is-primary', bt, D.send); el('span', 'sg-btn', bt, D.edit);
      }
      return R;
    }
    function tick(R, tau) {
      for (var i = 0; i < 4; i++) {
        var on = tau >= DAY_AT[i];
        cl(R.dots[i].c, 'is-on', on); cl(R.dots[i].lab, 'is-on', on);
      }
      var g = ease.io(seg(tau, DAY_AT[1], DAY_AT[3]));
      put(R.gapLine, 'x2', (R.gx[0] + (R.gx[1] - R.gx[0]) * g).toFixed(1));
      cl(R.silent, 'is-on', tau >= GAP);
      cl(R.tl, 'is-alert', tau >= GAP);
      cl(R.draft, 'is-on', tau >= DRAFT0 - 0.3);
      R.typer.at(seg(tau, DRAFT0, DRAFT1));
      var gOn = tau >= GATE;
      if (gOn && !R.gate.classList.contains('is-on')) pop(R.gate);
      cl(R.gate, 'is-on', gOn);
      put(R.ring, 'transform', gOn ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)');
      liveTick(R.F, tau < DRAFT0 ? 0 : tau < GATE ? 1 : 2, D.live);
    }
    return scene(14, 11.8, build, tick);
  }

  /* ============================= 统筹 ============================= */
  function CoordScene() {
    var GOAL = T('开拓巴西电动两轮市场', 'Open the Brazil e-scooter market');
    var STEPS = [
      { t: T('找出 12 家经销商', 'Find 12 dealers'), s: T('找经销商', 'Dealers'), who: T('研究', 'Research'), a: 2.6, b: 6.4 },
      { t: T('核对 60V/72V 参数', 'Check 60V/72V specs'), s: T('核对参数', 'Specs'), who: T('产品', 'Product'), a: 2.8, b: 5.2 },
      { t: T('起草葡语开发信', 'Draft Portuguese emails'), s: T('写开发信', 'Emails'), who: T('销售', 'Sales'), a: 6.6, b: 9.0, wait: T('等名单和参数', 'Waits on 01, 02') },
      { t: T('做 3 张场景图', 'Make 3 scene images'), s: T('场景图', 'Images'), who: T('创意', 'Creative'), a: 3.0, b: 8.0 },
      { t: T('汇总，交你确认', 'Sum up for your OK'), s: T('汇总', 'Sum up'), who: T('统筹', 'Lead'), a: 9.2, b: 10.3, last: true }
    ];
    var TYPE0 = 0.4, TYPE1 = 1.6, SPLIT = 1.9;
    var D = {
      goalK: T('目标', 'Goal'), split: T('统筹拆成 5 步，交给 4 位 AI 员工', 'Split into 5 steps for 4 AI employees'),
      run: T('进行中', 'Running'), done: T('完成', 'Done'), wait: T('等你确认', 'Your OK'), idle: T('待开始', 'Queued'),
      sum: T('4/5 完成 · 汇总待你确认，确认前不对外发送', '4 of 5 done · summary waits for you; nothing goes out first'),
      sumMini: T('汇总待你确认', 'Summary needs your OK'),
      live: [T('拆分任务', 'Planning'), T('4 位协作中', '4 at work'), T('等你确认', 'Needs your OK')]
    };
    function build(stage, L) {
      var F = frame(stage, L, T('数字员工', 'AI Staff'), 'layers'), full = F.full, R = { F: F }, y = F.top;
      var gh = full ? 58 : 22;
      var gc = box('sg-crew-card sg-crew-goal', stage, F.pad, y, F.iw, gh);
      if (full) el('span', 'sg-crew-k', gc, D.goalK);
      var gb = el('div', 'sg-crew-goal-b', gc);
      R.goal = el('b', 'sg-crew-type', gb);
      R.typer = new Typer(R.goal, GOAL);
      if (full) R.splitT = el('span', 'sg-crew-goal-s', gb, D.split);
      y += gh + (full ? 14 : 4);
      var sumH = full ? 44 : 0, n = STEPS.length;
      var pitch = Math.max(full ? 34 : 18, Math.min(full ? 58 : 22, Math.floor((F.bottom - y - sumH - (full ? 10 : 0)) / n)));
      var rh = pitch - (full ? 6 : 2);
      R.rows = STEPS.map(function (s, i) {
        var r = box('sg-crew-step', stage, F.pad, y + i * pitch, F.iw, rh);
        el('span', 'sg-crew-sn', r, '0' + (i + 1));
        el('span', 'sg-crew-st', r, full || F.W >= 300 ? s.t : s.s);
        el('span', 'sg-crew-who', r, s.who);
        var stt = el('span', 'sg-crew-ss', r);
        var bar = full ? el('i', 'sg-crew-sbar', r) : null;
        return { r: r, st: stt, fill: bar ? el('i', '', bar) : null, k: -1 };
      });
      if (full) {
        R.sum = box('sg-crew-sum', stage, F.pad, F.bottom - sumH, F.iw, sumH);
        R.ring = gateGlyph(el('span', 'sg-crew-gico', R.sum), 24);
        el('span', '', R.sum, D.sum);
      } else {
        R.ring = null;
      }
      R.sumMini = full ? null : el('span', 'sg-crew-summini', R.rows[n - 1].r, D.sumMini);
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
          textSwap(row.st, k === 4 ? s.wait : k === 1 ? D.run : k === 2 ? D.done : k === 3 ? D.wait : D.idle);
          if (k >= 2 && was === 1) pop(row.r);
        }
        if (row.fill) put(row.fill, '-transform', 'scaleX(' + seg(tau, s.a, s.b).toFixed(3) + ')');
      }
      var gate = tau >= STEPS[4].b;
      if (R.sum) { cl(R.sum, 'is-on', gate); put(R.ring, 'transform', gate ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)'); }
      if (R.sumMini) cl(R.sumMini, 'is-on', gate);
      liveTick(R.F, tau < SPLIT + 0.7 ? 0 : !gate ? 1 : 2, D.live);
    }
    return scene(14, 12, build, tick);
  }

  return { crewSignal: SignalScene, crewQuote: QuoteScene, crewFollow: FollowScene, crewCoord: CoordScene };
});
