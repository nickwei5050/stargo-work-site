/* Enterprise page — code-drawn scenes in place of the owner's photographs E01–E04 and E08
   (tools/code-art-enterprise.mjs places the hosts, css/stargo-motion-enterprise.css styles them,
   js/stargo-motion.js runs them). Demo data from the site's one cast; every scene says so on itself.

     ent-decide   决定  items that need approval stop at the gate; you approve or reject, the reason
                        goes into the approval record (a rejected quote comes back revised).
     ent-verify   核对  an AI-drafted quote checked line by line against its sources; the lead time
                        does not match the schedule, is flagged, fixed and re-checked — then it counts.
     ent-connect  连接  email, customer records, product knowledge, ERP and the drive's product folder
                        join one by one once permissions are set and you authorize; the finance
                        folder is not authorized and stays out.
     ent-operate  经营  the week adds up day by day; what needs a decision goes to the top.
     ent-stop     原则  an AI run with a large stop control: paused at step 3, logged, resumed from
                        step 3, and it ends waiting for your approval.

   The four panel scenes sit behind the panels' large type (bottom left), so they keep that corner
   clear and stay calm. Layouts: wide (1600 × 900), mid (1200 × 820, 992–1180 screens), tall (800 ×
   1000, portrait tablets), phone (360 × 520, scale ≈ 1). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod, typed = K.typed, flash = K.flash;

  /* ---------- kit ---------- */
  var PATH = {
    doc: 'M7 3.5h7l4 4V20H7zM14 3.5V8h4M9.5 12h6M9.5 15.5h6',
    mail: K.ICON.mail,
    page: 'M4.5 5.5h15v13h-15zM4.5 9h15M8 12.5h4M8 15h7',
    check: K.ICON.check,
    cross: 'M7 7l10 10M17 7 7 17',
    person: 'M12 11.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM5.4 19.4c.9-3.2 3.4-4.8 6.6-4.8s5.7 1.6 6.6 4.8',
    bot: 'M7 9.4h10a2 2 0 0 1 2 2v5.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5.2a2 2 0 0 1 2-2zM12 9.4V6.7M12 5.2v.01M9.6 14h.01M14.4 14h.01',
    lock: 'M7 11V8.5a5 5 0 0 1 10 0V11M6 11h12v9H6zM12 14.5v2',
    users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.7-2.8 2.8-4.2 5.5-4.2s4.8 1.4 5.5 4.2M15.5 5.3a3 3 0 0 1 0 5.4M17.5 14.9c1.4.6 2.4 1.9 2.9 4.1',
    book: 'M5 5.5A1.5 1.5 0 0 1 6.5 4H18v13H6.5A1.5 1.5 0 0 0 5 18.5zM5 18.5A1.5 1.5 0 0 0 6.5 20H18v-3',
    box: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
    folder: 'M4 7.5A1.5 1.5 0 0 1 5.5 6H10l2 2h6.5A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z',
    pause: 'M9.2 6.5v11M14.8 6.5v11',
    play: 'M8.5 6.2v11.6L18 12z',
    alert: 'M12 4.4 3.2 19.4h17.6zM12 10.2v4.2M12 16.9v.01'
  };
  function ico(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: PATH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  // an absolutely placed box
  function at(parent, cls, x, y, w, h, text) {
    var e = el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  // cached writers: compare numbers, so a frame that changes nothing writes and allocates nothing
  function tf(e, x, y, s) {
    x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10; s = s == null ? 1 : Math.round(s * 1000) / 1000;
    if (e.__x === x && e.__y === y && e.__s === s) return;
    e.__x = x; e.__y = y; e.__s = s;
    e.style.transform = 'translate(' + x + 'px,' + y + 'px)' + (s !== 1 ? ' scale(' + s + ')' : '');
  }
  function rot(e, a) { a = Math.round(mod(a, 360)); if (e.__r === a) return; e.__r = a; e.setAttribute('transform', 'rotate(' + a + ')'); }
  function op(e, v) { v = Math.round(v * 100) / 100; if (e.__op === v) return; e.__op = v; e.style.opacity = v; }
  function sxf(e, v) { v = Math.round(v * 1000) / 1000; if (e.__sx === v) return; e.__sx = v; e.style.transform = 'scaleX(' + v + ')'; }
  function syf(e, v) { v = Math.round(v * 1000) / 1000; if (e.__sy === v) return; e.__sy = v; e.style.transform = 'scaleY(' + v + ')'; }
  // one of a few fixed strings, flashed when it changes
  function say(e, s, quiet) { if (e.__s === s) return; var fl = e.__s !== undefined && !quiet; e.__s = s; put(e, 'text', s); if (fl) flash(e); }
  // a typed line: the slice is rebuilt only when the number of characters shown changes
  function typedC(e, s, p) {
    var a = e.__ta && e.__tsrc === s ? e.__ta : (e.__ta = Array.from(s)), n = Math.round(a.length * (p < 0 ? 0 : p > 1 ? 1 : p));
    e.__tsrc = s;
    if (e.__tn === n && e.__tk === s) return;
    e.__tn = n; e.__tk = s;
    put(e, 'text', n >= a.length ? s : a.slice(0, n).join(''));
  }
  function num(e, v, pre) { if (e.__v === v) return; e.__v = v; put(e, 'text', (pre || '') + K.fmt(v)); }
  // the state word on an element: data-k, written on change
  function state(e, k) { if (e.__k === k) return; e.__k = k; e.setAttribute('data-k', k); }
  function honest(stage, x, y, full) { var g = at(stage, 'sg-tag', x, y, null, null, full ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data')); return g; }
  function chip(parent, cls, text, icon) { var c = el('span', 'sg-en-chip' + (cls ? ' ' + cls : ''), parent); if (icon) ico(icon, c, 14); el('span', '', c, text); return c; }
  // the soft fade that hides a loop's reset: in over [0, .5], out over [P − 1.2, P − .3]
  function veil(u, P) { return Math.min(seg(u, 0, 0.5), 1 - seg(u, P - 1.2, P - 0.3)); }

  var PANEL = { wide: { w: 1600, h: 900 }, mid: { w: 1200, h: 820 }, tall: { w: 800, h: 1000 }, phone: { w: 360, h: 520 } };
  function panelPick(w, h) { return w < 600 ? 'phone' : h > w * 1.05 ? 'tall' : w < 1180 ? 'mid' : 'wide'; }
  function panelStage(stage, name, cls) { stage.className = 'sg-mo-stage sg-en ' + cls + ' is-' + name + (name === 'phone' ? ' is-compact' : ''); }

  /* =====================================================================
     DECIDE — 关键决定由你们拍板. Four items, one every P seconds: a quote below the floor price
     (rejected, with the reason), an outreach email, a product page (its approver is the marketing
     lead, by your rules), and the revised quote (approved). Each waits at the gate; the reason is
     typed, the button pressed, the decision written into the record.
     ===================================================================== */
  function DecideScene() {
    var P = 6.4, ARRIVE = 1.3, SWAP = 1.1, TYPE0 = 1.5, TYPE1 = 3.0, PRESS = 3.3, DONE = 3.6, OUT = 4.6, REC = 3.8;
    var IT = [
      { ic: 'doc', t: T('报价 Q-1042', 'Quote Q-1042'), s: T('低于底价 · 销售 AI 提交', 'Below floor price · from the sales AI'), rule: 0, by: T('你', 'You'), ok: false,
        why: T('低于底价，先核算运费再报', 'Below floor price — recheck freight first'), p: T('Q-1042', 'Q-1042') },
      { ic: 'mail', t: T('开发信 · Nordwerk Energie', 'Outreach · Nordwerk Energie'), s: T('首次联系 · 匹配度 94', 'First contact · fit 94'), rule: 1, by: T('你', 'You'), ok: true,
        why: T('目标客户，语气合适，可以发', 'Right buyer, right tone — send it'), p: T('开发信', 'Outreach') },
      { ic: 'page', t: T('产品页 · 48V 储能柜', 'Product page · 48V rack storage'), s: T('3 张主图 · 中英两版', '3 images · Chinese and English'), rule: 2, by: T('市场主管', 'Marketing lead'), ok: true,
        why: T('参数与规格书一致，可以发布', 'Specs match the datasheet — publish'), p: T('产品页', 'Product page') },
      { ic: 'doc', t: T('报价 Q-1042 · 已修改', 'Quote Q-1042 · revised'), s: T('已核运费 · 销售 AI 重新提交', 'Freight rechecked · resubmitted'), rule: 0, by: T('你', 'You'), ok: true,
        why: T('运费核过，按新价发出', 'Freight checked — send at the new price'), p: T('Q-1042', 'Q-1042') }
    ];
    var N = IT.length;
    var RULES = [[T('报价', 'Quotes'), T('你', 'you')], [T('联系客户', 'Customer outreach'), T('你', 'you')], [T('发布内容', 'Publishing'), T('市场主管', 'marketing lead')]];
    var G, R;
    function geo(name) {
      if (name === 'wide') return { gx: 1236, ty: 310, iw: 290, ih: 64, q: [902, 576, 250], card: [902, 392, 600, 204], rec: [902, 626, 600], rows: 3, rh: 54, rules: [660, 92, 900], tag: [1560, 872] };
      if (name === 'mid') return { gx: 1010, ty: 250, iw: 262, ih: 60, q: [712, 420, 128], card: [560, 318, 600, 196], rec: [560, 540, 600], rows: 3, rh: 52, rules: [520, 56, 660], tag: [1180, 806] };
      if (name === 'tall') return { gx: 610, ty: 290, iw: 262, ih: 60, q: [312, 20, -272], card: [100, 362, 620, 196], rec: [100, 584, 620], rows: 2, rh: 54, rules: [40, 60, 720], tag: [780, 986] };
      return { gx: 318, ty: 46, iw: 196, ih: 44, q: [94, -124, -342], card: [12, 84, 336, 112], rec: [12, 206, 336], rows: 2, rh: 30, rules: null, tag: [350, 274] };
    }
    function build(stage, L, name) {
      panelStage(stage, name, 'sg-en-decide');
      G = geo(name); R = { phone: name === 'phone', items: [], rows: [] };
      var W = L.w;
      if (G.rules) {
        var ru = at(stage, 'sg-en-rules', G.rules[0], G.rules[1], G.rules[2]);
        el('span', 'sg-en-k', ru, T('审批规则 · 你们自己定', 'Approval rules · set by you'));
        var rr = el('div', 'sg-en-rules-row', ru);
        R.rule = RULES.map(function (r) { var c = chip(rr, 'sg-en-rule', r[0] + ' → ' + r[1]); return c; });
        chip(rr, 'sg-en-rule is-lock', T('付款 · 正式申报 · 专业审阅 → 始终人工', 'Payments · filings · reviews → always a person'), 'lock');
      }
      // the track and the gate
      var svg = sv('svg', { class: 'sg-en-svg', width: W, height: L.h, viewBox: '0 0 ' + W + ' ' + L.h }, stage);
      sv('line', { class: 'sg-en-track', x1: -40, y1: G.ty, x2: W + 40, y2: G.ty }, svg);
      R.pass = sv('line', { class: 'sg-en-pass', x1: G.gx, y1: G.ty, x2: W + 40, y2: G.ty }, svg);
      var gr = R.phone ? 18 : 30;
      R.gate = sv('g', { class: 'sg-en-gate', transform: 'translate(' + G.gx + ' ' + G.ty + ')' }, svg);
      sv('line', { class: 'sg-en-gate-bar', x1: 0, y1: -gr * 2.6, x2: 0, y2: gr * 2.6 }, R.gate);
      sv('circle', { class: 'sg-en-gate-ring', r: gr }, R.gate);
      var gi = sv('g', { class: 'sg-en-gate-ico', transform: 'translate(' + (-gr * 0.55) + ' ' + (-gr * 0.55) + ') scale(' + (gr * 1.1 / 24) + ')' }, R.gate);
      sv('path', { d: PATH.person, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gi);
      if (!R.phone) at(stage, 'sg-en-gate-label', G.gx, G.ty - gr * 2.6 - 30, null, null, T('审批关口', 'Approval gate'));
      // the items on the track
      for (var i = 0; i < N; i++) {
        var it = at(stage, 'sg-en-item', 0, G.ty - G.ih / 2, G.iw, G.ih);
        var ib = el('span', 'sg-en-item-ico', it); ico(IT[i].ic, ib, R.phone ? 16 : 20);
        var tx = el('span', 'sg-en-item-tx', it);
        el('b', '', tx, R.phone ? IT[i].p : IT[i].t);
        if (!R.phone) el('span', '', tx, IT[i].s);
        R.items.push(it);
      }
      // the decision card
      var c = G.card, card = at(stage, 'sg-en-card sg-en-dcard', c[0], c[1], c[2], c[3]);
      var hd = el('div', 'sg-en-dhead', card);
      R.badge = el('span', 'sg-en-badge', hd);
      R.title = el('b', 'sg-en-dtitle', hd);
      if (!R.phone) { R.meta = el('div', 'sg-en-dmeta', card); }
      var rs = el('div', 'sg-en-reason', card);
      el('span', 'sg-en-k', rs, T('原因', 'Reason'));
      R.why = el('span', 'sg-en-why', rs);
      var bt = el('div', 'sg-en-btns', card);
      R.no = el('span', 'sg-btn', bt, T('驳回', 'Reject'));
      R.yes = el('span', 'sg-btn is-primary', bt, T('批准', 'Approve'));
      R.card = card;
      // the record
      var rc = G.rec, rec = at(stage, 'sg-en-rec', rc[0], rc[1], rc[2], (R.phone ? 0 : 34) + G.rows * G.rh);
      if (!R.phone) { var rh = el('div', 'sg-en-rec-h', rec); el('b', '', rh, T('审批记录', 'Approval record')); el('span', '', rh, T('每个决定都记下原因', 'Every decision keeps its reason')); }
      var body = el('div', 'sg-en-rec-body', rec);
      body.style.height = (G.rows * G.rh) + 'px';
      for (var r = 0; r <= G.rows; r++) {
        var row = at(body, 'sg-en-rrow', 0, 0, null, G.rh - 6);
        row.style.right = '0';
        var mk = el('span', 'sg-en-rmark', row); ico('check', mk, 14, 'sg-ico sg-en-rok'); ico('cross', mk, 14, 'sg-ico sg-en-rno');
        var rt = el('span', 'sg-en-rtx', row);
        var o = { e: row, a: el('b', '', rt), b: el('span', '', rt), tm: R.phone ? null : el('time', '', row) };
        R.rows.push(o);
      }
      honest(stage, G.tag[0], G.tag[1], !R.phone);
    }
    function clock(d) { var m = 14 * 60 + 32 + d * 4; return ('0' + Math.floor(m / 60) % 24).slice(-2) + ':' + ('0' + m % 60).slice(-2); }
    function tick(t) {
      var c = Math.floor(t / P), u = t - c * P, cur = mod(c, N), x;
      // items: r = 0 at the gate, 1 and 2 queued, 3 out of sight
      for (var i = 0; i < N; i++) {
        var r = mod(i - cur, N), e = R.items[i], y = 0, o = 1;
        if (r === 0) {
          if (u < ARRIVE) x = G.q[1] + (G.q[0] - G.q[1]) * ease.io(seg(u, 0, ARRIVE));
          else if (u < DONE) x = G.q[0];
          else if (IT[i].ok) { var k = ease.io(seg(u, DONE, OUT)); x = G.q[0] + k * (G.iw + (R.phone ? 70 : 150)); o = 1 - seg(u, DONE + 0.5, OUT); }
          else { var k2 = ease.out(seg(u, DONE, OUT)); x = G.q[0] - k2 * 40; y = k2 * (R.phone ? 14 : 30); o = 1 - k2; }
        } else if (r === 1) { x = G.q[2] + (G.q[1] - G.q[2]) * ease.io(seg(u, 0, ARRIVE)); o = 0.55; }
        else if (r === 2) { x = G.q[2]; o = 0.3 * seg(u, OUT, OUT + 0.8); }
        else { x = G.q[2]; o = 0; }
        tf(e, x, y);
        op(e, o);
        cl(e, 'is-at', r === 0 && u >= ARRIVE - 0.2 && u < DONE);
        cl(e, 'is-ok', r === 0 && u >= DONE && IT[i].ok);
        cl(e, 'is-no', r === 0 && u >= DONE && !IT[i].ok);
      }
      // the decision card follows the item at the gate
      var I = IT[mod(u < SWAP ? cur - 1 : cur, N)], live = u >= SWAP;
      say(R.title, I.t, true);
      if (R.meta && R.meta.__it !== I) { R.meta.__it = I; put(R.meta, 'text', T('提交：销售 AI · 审批人：', 'From: sales AI · approver: ') + I.by); }
      var dec = live ? (u >= DONE ? (I.ok ? 'ok' : 'no') : 'wait') : (I.ok ? 'ok' : 'no');
      state(R.card, dec);
      say(R.badge, dec === 'wait' ? T('等你拍板', 'Your call') : dec === 'ok' ? T('已批准', 'Approved') : T('已驳回', 'Rejected'), true);
      typedC(R.why, I.why, live ? seg(u, TYPE0, TYPE1) : 1);
      cl(R.why, 'is-typing', live && u > TYPE0 && u < PRESS);
      var press = live && u >= PRESS && u < DONE;
      cl(R.yes, 'is-press', press && I.ok); cl(R.no, 'is-press', press && !I.ok);
      cl(R.yes, 'is-done', !(live && u < DONE) && I.ok); cl(R.no, 'is-done', !(live && u < DONE) && !I.ok);
      op(R.card, live ? 1 : 0.5 + 0.5 * (1 - seg(u, 0, 0.6)));
      state(R.gate, u >= ARRIVE - 0.2 && u < DONE ? 'wait' : u >= DONE && u < OUT + 0.4 ? (IT[cur].ok ? 'ok' : 'no') : 'idle');
      op(R.pass, u >= DONE && u < OUT + 0.6 && IT[cur].ok ? 1 - seg(u, OUT - 0.2, OUT + 0.6) : 0);
      if (R.rule) for (var q = 0; q < R.rule.length; q++) cl(R.rule[q], 'is-on', live && u < OUT && IT[cur].rule === q);
      // the record: decision d is written at REC of its cycle; the newest is on top
      var n = c + (u >= REC ? 1 : 0), k3 = ease.out(seg(u, REC, REC + 0.7));
      for (var j = 0; j < R.rows.length; j++) {
        var o2 = R.rows[j], d = n - 1 - j;
        var slot = j - (u >= REC ? 1 - k3 : 0);
        if (d < 0) { op(o2.e, 0); continue; }
        if (o2.d !== d) {
          o2.d = d;
          var it2 = IT[mod(d, N)];
          state(o2.e, it2.ok ? 'ok' : 'no');
          put(o2.a, 'text', (it2.ok ? T('批准 · ', 'Approved · ') : T('驳回 · ', 'Rejected · ')) + (R.phone ? it2.p : it2.t) + (R.phone ? '' : ' · ' + it2.by));
          put(o2.b, 'text', T('原因：', 'Reason: ') + it2.why);
          if (o2.tm) put(o2.tm, 'text', clock(d));
        }
        tf(o2.e, 0, (j === 0 && u >= REC ? 0 : slot) * G.rh);
        op(o2.e, j === 0 && u >= REC ? k3 : j >= G.rows ? (u >= REC ? 1 - k3 : 0) : 1);
      }
    }
    return { layouts: PANEL, pick: panelPick, build: build, tick: tick, still: 3 * P + 3.15, start: 2 * P };
  }

  /* =====================================================================
     VERIFY — 结果可以核对. The draft's five lines are checked against three source documents;
     the lead time does not match the schedule, is flagged and sent back, fixed and re-checked.
     Only then does the status read 已核对.
     ===================================================================== */
  function VerifyScene() {
    var P = 16, START = 0.9, STEP = 1.45, C0 = 1.3, FIX = 9.3, REOK = 9.9, DONE = 10.4;
    var F = [
      { k: T('型号', 'Model'), v: '48V 100Ah', src: 0, sv: '48V 100Ah' },
      { k: T('数量', 'Quantity'), v: T('200 组', '200 pcs'), src: 0, sv: '200 pcs' },
      { k: T('贸易术语', 'Trade term'), v: T('DAP 汉堡', 'DAP Hamburg'), src: 0, sv: 'DAP Hamburg' },
      { k: T('交期', 'Lead time'), v: T('15 天', '15 days'), fix: T('35 天', '35 days'), src: 1, sv: T('最早 35 天', 'earliest 35 days'), bad: true },
      { k: T('认证', 'Certificates'), v: 'CE · UN38.3', src: 2, sv: 'CE · UN38.3' }
    ];
    var SRC = [
      { ic: 'mail', t: T('询盘邮件 · Müller Energie', 'Inquiry · Müller Energie'), rows: [0, 1, 2] },
      { ic: 'box', t: T('生产排期 · 柳州工厂', 'Schedule · Liuzhou plant'), rows: [3] },
      { ic: 'book', t: T('产品资料 · 认证', 'Product file · certificates'), rows: [4] }
    ];
    var G, R;
    function geo(name) {
      if (name === 'wide') return { hd: [660, 92, 880], doc: [660, 190, 400], rh: 70, src: [1180, 190, 360], gap: 22, rec: [660, 672, 880], tag: [1560, 872] };
      if (name === 'mid') return { hd: [520, 56, 650], doc: [520, 140, 320], rh: 62, src: [900, 140, 270], gap: 16, rec: [560, 548, 610], tag: [1180, 806] };
      if (name === 'tall') return { hd: [40, 60, 720], doc: [40, 150, 360], rh: 64, src: [460, 150, 300], gap: 18, rec: [40, 590, 720], tag: [780, 986] };
      return { hd: [12, 12, 336], doc: [12, 70, 336], rh: 36, src: null, rec: [12, 254, 336], tag: [350, 300] };
    }
    function build(stage, L, name) {
      panelStage(stage, name, 'sg-en-verify');
      G = geo(name); R = { phone: name === 'phone', f: [], s: [], ln: [], dot: [] };
      var h = at(stage, 'sg-en-vhead', G.hd[0], G.hd[1], G.hd[2]);
      var ht = el('div', 'sg-en-vtitle', h);
      el('span', 'sg-en-k', ht, T('报价草稿 · 销售 AI 起草', 'Quote draft · by the sales AI'));
      el('b', '', ht, 'Müller Energie GmbH');
      R.steps = [T('已提交', 'Submitted'), T('核对中', 'Checking'), T('已核对', 'Checked')].map(function (s, i) {
        var e = el('span', 'sg-en-vstep', h); el('i', '', e); el('span', '', e, s); return e;
      });
      R.note = el('span', 'sg-en-vnote', h);
      // the draft
      var d = G.doc, doc = at(stage, 'sg-en-card sg-en-vdoc', d[0], d[1], d[2], (R.phone ? 0 : 44) + F.length * G.rh);
      if (!R.phone) { var dh = el('div', 'sg-en-vdh', doc); ico('bot', dh, 16); el('span', '', dh, T('AI 起草的报价', 'AI-drafted quote')); }
      F.forEach(function (f, i) {
        var r = el('div', 'sg-en-vrow', doc);
        r.style.height = G.rh + 'px';
        el('span', 'sg-en-vk', r, f.k);
        var o = { e: r, v: el('b', 'sg-en-vv', r, f.v) };
        if (R.phone) el('span', 'sg-en-vsrc', r, SRC[f.src].t.split(' · ')[0]);
        var m = el('span', 'sg-en-vmark', r); ico('check', m, 14, 'sg-ico sg-en-vok'); ico('cross', m, 14, 'sg-ico sg-en-vno');
        o.m = m;
        R.f.push(o);
      });
      // sources and the lines between
      if (G.src) {
        var y = G.src[1], srow = [];
        SRC.forEach(function (s, si) {
          var hgt = 44 + s.rows.length * (G.rh - 16);
          var c = at(stage, 'sg-en-card sg-en-vsrcc', G.src[0], y, G.src[2], hgt);
          var sh = el('div', 'sg-en-vdh', c); ico(s.ic, sh, 16); el('span', '', sh, s.t);
          s.rows.forEach(function (fi, j) {
            var r = el('div', 'sg-en-vsr', c, F[fi].sv);
            r.style.height = (G.rh - 16) + 'px';
            srow[fi] = { e: r, y: y + 44 + (j + 0.5) * (G.rh - 16) };
          });
          R.s.push(c);
          y += hgt + G.gap;
        });
        var svg = sv('svg', { class: 'sg-en-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
        var x0 = G.doc[0] + G.doc[2], x1 = G.src[0];
        F.forEach(function (f, i) {
          var y0 = G.doc[1] + 44 + (i + 0.5) * G.rh, y1 = srow[i].y, mx = (x0 + x1) / 2;
          var p = sv('path', { class: 'sg-en-vln', d: 'M' + x0 + ' ' + y0 + 'C' + mx + ' ' + y0 + ' ' + mx + ' ' + y1 + ' ' + x1 + ' ' + y1 }, svg);
          var dot = sv('circle', { class: 'sg-en-vdot', r: 3.5 }, svg);
          R.ln.push(p); R.dot.push({ e: dot, a: [x0, y0], b: [mx, y0], c: [mx, y1], d: [x1, y1] });
          R.f[i].src = srow[i].e;
        });
      }
      var rc = G.rec, rec = at(stage, 'sg-en-vrec', rc[0], rc[1], rc[2]);
      var kv = function (k) { var s = el('span', 'sg-en-kv', rec); el('span', 'sg-en-k', s, k); return el('b', '', s); };
      R.who = kv(T('谁做的', 'Done by'));
      if (!R.phone) R.chk = kv(T('对照', 'Checked against'));
      R.res = kv(T('结果', 'Result'));
      R.stuck = kv(T('卡在', 'Stopped at'));
      put(R.who, 'text', T('销售 AI', 'Sales AI'));
      if (R.chk) put(R.chk, 'text', T('3 份来源', '3 sources'));
      honest(stage, G.tag[0], G.tag[1], !R.phone);
    }
    var PT = [0, 0];
    function bz(o, k) { var v = 1 - k, a = v * v * v, b = 3 * v * v * k, c = 3 * v * k * k, d = k * k * k; PT[0] = a * o.a[0] + b * o.b[0] + c * o.c[0] + d * o.d[0]; PT[1] = a * o.a[1] + b * o.b[1] + c * o.c[1] + d * o.d[1]; return PT; }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P), bad = F[3];
      var stepK = u < START ? 0 : u < DONE ? 1 : 2;
      for (var s = 0; s < 3; s++) { cl(R.steps[s], 'is-on', s === stepK); cl(R.steps[s], 'is-past', s < stepK); }
      for (var i = 0; i < F.length; i++) {
        var c0 = C0 + i * STEP, f = R.f[i], scan = u >= c0 && u < c0 + 0.9, res = u >= c0 + 0.9;
        var k = F[i].bad ? (u >= REOK ? 'ok' : u >= FIX ? 'scan' : res ? 'no' : scan ? 'scan' : 'idle') : (res ? 'ok' : scan ? 'scan' : 'idle');
        state(f.e, k);
        op(f.m, (k === 'ok' || k === 'no') ? fade : 0);
        if (F[i].bad) say(f.v, u >= FIX + 0.1 ? F[i].fix : F[i].v);
        if (f.src) state(f.src, k);
        if (R.ln[i]) {
          op(R.ln[i], (k === 'idle' ? 0 : k === 'scan' ? 0.9 : 0.55) * fade);
          state(R.ln[i], k);
          var dk = F[i].bad && u >= FIX ? seg(u, FIX, REOK) : seg(u, c0, c0 + 0.9);
          var dd = R.dot[i];
          op(dd.e, dk > 0 && dk < 1 ? 1 : 0);
          if (dk > 0 && dk < 1) { var pt = bz(dd, ease.io(dk)); put(dd.e, 'cx', Math.round(pt[0])); put(dd.e, 'cy', Math.round(pt[1])); }
        }
      }
      var flagged = u >= C0 + 3 * STEP + 0.9 && u < REOK;
      say(R.note, u < START ? T('已提交 ≠ 已完成', 'Submitted ≠ done') : flagged ? T('1 处不一致 · 已退回修正', '1 mismatch · sent back') : u < DONE ? T('逐项对照来源', 'Checking each line') : T('核对过才算数 ✓', 'Checked, so it counts ✓'), u < 0.2);
      state(R.note, flagged ? 'no' : u >= DONE ? 'ok' : 'idle');
      say(R.res, u < C0 + 0.9 ? T('待核对', 'Pending') : flagged ? T('交期不符', 'Lead time off') : u < DONE ? T('核对中', 'Checking') : T('符合要求', 'Meets spec'), u < 0.2);
      state(R.res, flagged ? 'no' : u >= DONE ? 'ok' : 'idle');
      say(R.stuck, flagged ? T('第 4 项 · 交期', 'Line 4 · lead time') : '—', u < 0.2);
      state(R.stuck, flagged ? 'no' : 'idle');
    }
    return { layouts: PANEL, pick: panelPick, build: build, tick: tick, still: 11.2 };
  }

  /* =====================================================================
     CONNECT — 逐项接入. Each system: permissions set (可读 / 可改 / 需审批), your authorization,
     then the line goes live and work flows to the hub. The finance folder is not authorized.
     ===================================================================== */
  function ConnectScene() {
    var P = 22, S0 = 0.8, GAP = 3.1, LAST = S0 + 5 * GAP;
    var NODES = [
      { ic: 'mail', n: T('邮箱', 'Email'), p: [T('可读', 'Read'), T('发信需审批', 'Send: approval')] },
      { ic: 'users', n: T('客户记录', 'Customers'), p: [T('可读', 'Read'), T('可改', 'Change')] },
      { ic: 'book', n: T('产品知识', 'Product info'), p: [T('可读', 'Read')] },
      { ic: 'box', n: 'ERP', p: [T('可读', 'Read'), T('改单需审批', 'Edits: approval')] },
      { ic: 'folder', n: T('网盘 · 产品资料', 'Specs drive'), p: [T('可读', 'Read')] },
      { ic: 'folder', n: T('网盘 · 财务目录', 'Finance drive'), p: [], deny: true }
    ];
    var G, R;
    function ell(cx, cy, rx, ry, angs) { return angs.map(function (a) { a = a * Math.PI / 180; return [Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a))]; }); }
    function geo(name) {
      if (name === 'wide') return { hub: [1120, 440], hr: 66, nw: 262, nh: 84, at: ell(1120, 440, 335, 270, [-150, -118, -62, -20, 25, 70]), tag: [1560, 872] };
      if (name === 'mid') return { hub: [830, 400], hr: 56, nw: 232, nh: 80, at: ell(830, 400, 240, 236, [-158, -122, -58, -22, 25, 70]), tag: [1180, 806] };
      if (name === 'tall') return { hub: [400, 390], hr: 58, nw: 228, nh: 80, at: [[140, 210], [330, 90], [572, 130], [670, 300], [650, 540], [200, 600]], tag: [780, 986] };
      // phone: kept above the panel's heading, which rises with a longer (English) sentence
      return { hub: [52, 110], hr: 30, nw: 240, nh: 31, list: true, at: [0, 1, 2, 3, 4, 5].map(function (i) { return [230, 22 + i * 35]; }), tag: [350, 232] };
    }
    function build(stage, L, name) {
      panelStage(stage, name, 'sg-en-connect');
      G = geo(name); R = { phone: name === 'phone', n: [] };
      var svg = sv('svg', { class: 'sg-en-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
      var hx = G.hub[0], hy = G.hub[1];
      NODES.forEach(function (nd, i) {
        var p = G.at[i], dx = p[0] - hx, dy = p[1] - hy, m = Math.hypot(dx, dy) || 1, nw = G.nw + (nd.deny && !G.list ? 40 : 0);
        var k = Math.min(nw / 2 / (Math.abs(dx) || 1e-6), G.nh / 2 / (Math.abs(dy) || 1e-6));
        var ex = Math.round(G.list ? p[0] - nw / 2 : p[0] - dx * k), ey = Math.round(G.list ? p[1] : p[1] - dy * k), sx = hx + dx / m * (G.hr + 4), sy = hy + dy / m * (G.hr + 4);
        var o = { h: [sx, sy] };
        o.dash = sv('line', { class: 'sg-en-cl is-dash' + (nd.deny ? ' is-deny' : ''), x1: sx, y1: sy, x2: ex, y2: ey }, svg);
        o.solid = sv('line', { class: 'sg-en-cl is-live', x1: sx, y1: sy, x2: ex, y2: ey }, svg);
        o.dot = sv('circle', { class: 'sg-en-cdot', r: G.list ? 2.5 : 4 }, svg);
        o.a = [ex, ey];
        var c = at(stage, 'sg-en-card sg-en-node' + (nd.deny ? ' is-deny' : ''), p[0] - nw / 2, p[1] - G.nh / 2, nw, G.nh);
        var top = el('div', 'sg-en-ntop', c);
        var ib = el('span', 'sg-en-nico', top); ico(nd.ic, ib, G.list ? 14 : 18);
        el('b', 'sg-en-nname', top, nd.n);
        o.st = el('span', 'sg-en-nst', top);
        if (nd.deny) ico('lock', o.st, 13);
        o.stt = el('span', '', o.st);
        if (!G.list) {
          o.btn = el('span', 'sg-btn is-primary sg-en-auth', top, T('授权', 'Authorize'));
          var ch = el('div', 'sg-en-nchips', c);
          o.chips = nd.p.map(function (s) { return chip(ch, '', s); });
          if (nd.deny) o.note = el('span', 'sg-en-ndeny', ch, T('没有授权，就不接入', 'Not authorized, so not connected'));
        }
        o.c = c;
        R.n.push(o);
      });
      // the hub
      var hub = sv('g', { class: 'sg-en-hub', transform: 'translate(' + hx + ' ' + hy + ')' }, svg);
      sv('circle', { class: 'sg-en-hub-halo', r: G.hr + (G.list ? 8 : 16) }, hub);
      sv('circle', { class: 'sg-en-hub-ring', r: G.hr }, hub);
      R.spin = sv('circle', { class: 'sg-en-hub-spin', r: G.hr + (G.list ? 4 : 7) }, hub);
      sv('path', { class: 'sg-en-hub-star', d: K.STAR, transform: 'scale(' + (G.hr / 62) + ')' }, hub);
      var lab = at(stage, 'sg-en-hublab', hx, hy + G.hr + (G.list ? 10 : 22));
      if (!G.list) el('b', '', lab, T('同一套业务流程', 'One workflow'));
      R.count = el('span', '', lab);
      if (!G.list) el('em', '', lab, T('现有软件保留，逐项接入', 'Keep current software; connect item by item'));
      honest(stage, G.tag[0], G.tag[1], !R.phone);
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P), live = 0, hx = G.hub[0], hy = G.hub[1];
      for (var i = 0; i < NODES.length; i++) {
        var nd = NODES[i], o = R.n[i], s = S0 + i * GAP, k;
        if (nd.deny) k = u < s ? 'idle' : u < s + 1.2 ? 'ask' : 'deny';
        else k = u < s ? 'idle' : u < s + 1.1 ? 'cfg' : u < s + 2.0 ? 'auth' : 'live';
        if (k === 'live' && fade < 0.6) k = 'idle';
        state(o.c, k);
        say(o.stt, k === 'idle' ? T('未连接', 'Not connected') : k === 'cfg' ? T('设置权限', 'Set access') : k === 'auth' ? T('等你授权', 'Needs your OK') : k === 'live' ? T('已接入', 'Connected') : k === 'ask' ? T('需要授权', 'Needs your OK') : T('未授权', 'Unauthorized'), true);
        if (o.chips) for (var j = 0; j < o.chips.length; j++) cl(o.chips[j], 'is-in', k !== 'idle' && u >= s + 0.25 + j * 0.3);
        if (o.btn) { cl(o.btn, 'is-in', k === 'auth'); cl(o.btn, 'is-press', k === 'auth' && u >= s + 1.65); }
        op(o.dash, (k === 'idle' ? 0.35 : k === 'live' ? 0 : 0.85) * fade);
        op(o.solid, k === 'live' ? fade * ease.out(seg(u, s + 2.0, s + 2.5)) : 0);
        if (k === 'live') {
          live++;
          var f = mod(u * 0.55 + i * 0.37, 1);
          op(o.dot, Math.min(1, f * 6, (1 - f) * 6) * fade);
          tf(o.dot, (o.h[0] - o.a[0]) * f, (o.h[1] - o.a[1]) * f);
        } else op(o.dot, 0);
      }
      for (var q = 0; q < R.n.length; q++) { var dt = R.n[q].dot; if (dt.__a !== 1) { dt.__a = 1; dt.setAttribute('cx', R.n[q].a[0]); dt.setAttribute('cy', R.n[q].a[1]); } }
      rot(R.spin, u * 24);
      var ck = live * 2 + (u >= LAST + 1.2 ? 1 : 0);
      if (R.count.__ck !== ck) { R.count.__ck = ck; say(R.count, live === 0 ? T('等待接入', 'Nothing connected yet') : T('已接入 ', 'Connected ') + live + ' / 5' + (ck % 2 ? T(' · 1 项未授权', ' · 1 not authorized') : '')); }
    }
    return { layouts: PANEL, pick: panelPick, build: build, tick: tick, still: LAST + 2.6 };
  }

  /* =====================================================================
     OPERATE — 看经营. Seven days roll up into the week: opportunities, orders, tasks, exceptions,
     costs and approvals; the decisions that matter rise to the top of the list.
     ===================================================================== */
  function OperateScene() {
    var P = 18, D0 = 0.7, DAY = 1.45, END = D0 + 7 * DAY;
    var KPI = [T('商机', 'Opportunities'), T('订单', 'Orders'), T('任务完成', 'Tasks done'), T('异常', 'Exceptions'), T('费用', 'Costs'), T('待审批', 'Approvals')];
    // per day: opportunities, orders, tasks, exceptions, cost (yuan), approvals
    var DD = [[4, 1, 6, 0, 260, 0], [3, 0, 7, 0, 310, 0], [5, 1, 6, 1, 280, 0], [2, 2, 8, 0, 340, 1], [6, 1, 7, 1, 300, 0], [2, 1, 4, 0, 220, 0], [1, 0, 3, 0, 150, 0]];
    var WD = [T('一', 'M'), T('二', 'T'), T('三', 'W'), T('四', 'T'), T('五', 'F'), T('六', 'S'), T('日', 'S')];
    var PR = [ // rank 0 first; d = the day it appears
      { d: 3, c: 'wait', t: T('报价 Q-1042 · 低于底价', 'Quote Q-1042 · below floor'), o: T('你 · 今天', 'You · today'), tg: T('待审批', 'Approval') },
      { d: 2, c: 'no', t: T('交期提醒 · 柳州工厂', 'Lead-time alert · Liuzhou plant'), o: T('跟单 · 周四', 'Orders · Thu'), tg: T('异常', 'Exception') },
      { d: 4, c: 'idle', t: T('PT Surya Energi · 该补货了', 'PT Surya Energi · restock due'), o: T('销售 AI · 周五', 'Sales AI · Fri'), tg: T('补货', 'Restock') },
      { d: 0, c: 'idle', t: T('Müller Energie · 跟进', 'Müller Energie · follow-up'), o: T('销售 AI · 下周一', 'Sales AI · next Mon'), tg: T('跟进', 'Follow-up') }
    ];
    var MAXB = 7, G, R;
    function geo(name) {
      if (name === 'wide') return { hd: [660, 96, 880], kp: [660, 144, 880, 100, 6], ch: [660, 290, 410, 290], pr: [1110, 290, 430, 64], sum: [660, 640, 880], tag: [1560, 872] };
      if (name === 'mid') return { hd: [520, 56, 650], kp: [520, 96, 650, 88, 6], ch: [520, 220, 300, 230], pr: [846, 220, 324, 56], sum: [520, 504, 650], tag: [1180, 806] };
      if (name === 'tall') return { hd: [40, 60, 720], kp: [40, 104, 720, 86, 3], ch: [40, 330, 330, 260], pr: [400, 330, 360, 60], sum: [40, 640, 720], tag: [780, 986] };
      return { hd: null, kp: [12, 26, 336, 56, 3, 3], ch: [12, 94, 336, 56], pr: null, sum: null, tag: [350, 22] };
    }
    function build(stage, L, name) {
      panelStage(stage, name, 'sg-en-operate');
      G = geo(name); R = { phone: name === 'phone', k: [], b: [], p: [] };
      if (G.hd) {
        var h = at(stage, 'sg-en-ohead', G.hd[0], G.hd[1], G.hd[2]);
        el('b', '', h, T('本周经营', 'This week'));
        el('span', 'sg-en-k', h, T('按负责人和期限排好', 'By owner and deadline'));
        R.day = el('span', 'sg-en-oday', h);
      }
      var kp = G.kp, kw = (kp[2] - (kp[4] - 1) * 10) / kp[4];
      var shown = R.phone ? [0, 1, 5] : [0, 1, 2, 3, 4, 5];
      shown.forEach(function (ki, i) {
        var col = i % kp[4], row = Math.floor(i / kp[4]);
        var c = at(stage, 'sg-en-card sg-en-kpi' + (ki === 5 ? ' is-ap' : ki === 3 ? ' is-ex' : ''), kp[0] + col * (kw + 10), kp[1] + row * (kp[3] + 10), kw, kp[3]);
        el('span', 'sg-en-k', c, KPI[ki]);
        var v = el('b', 'sg-en-kv', c);
        var dl = el('em', 'sg-en-kd', c);
        R.k.push({ i: ki, v: v, d: dl, c: c });
      });
      // the week chart
      var ch = G.ch, chart = at(stage, 'sg-en-chart', ch[0], ch[1], ch[2], ch[3]);
      if (!R.phone) {
        var chh = el('div', 'sg-en-chh', chart); el('b', '', chh, T('每天', 'By day'));
        var lg = el('span', 'sg-en-legend', chh); el('i', 'is-a', lg); el('span', '', lg, KPI[0]); el('i', 'is-b', lg); el('span', '', lg, KPI[1]);
      }
      var bars = el('div', 'sg-en-bars', chart);
      for (var d = 0; d < 7; d++) {
        var col2 = el('div', 'sg-en-bar', bars);
        var st = el('div', 'sg-en-bstack', col2);
        var a = el('i', 'sg-en-ba', st), b = el('i', 'sg-en-bb', st);
        a.style.height = (DD[d][0] / MAXB * 100) + '%';
        b.style.height = (DD[d][1] / MAXB * 100) + '%';
        el('span', 'sg-en-bd', col2, WD[d]);
        R.b.push({ c: col2, s: st });
      }
      // the list: what needs a decision first
      if (G.pr) {
        var pr = at(stage, 'sg-en-plist', G.pr[0], G.pr[1], G.pr[2], 40 + 4 * G.pr[3]);
        var ph = el('div', 'sg-en-chh', pr); el('b', '', ph, T('要紧的先处理', 'What matters first'));
        PR.forEach(function (p) {
          var r = at(pr, 'sg-en-prow is-' + p.c, 0, 40, null, G.pr[3] - 8);
          r.style.right = '0';
          el('span', 'sg-en-ptag', r, p.tg);
          var tx = el('span', 'sg-en-ptx', r); el('b', '', tx, p.t); el('span', '', tx, p.o);
          R.p.push(r);
        });
      }
      if (G.sum) { R.sum = at(stage, 'sg-en-osum', G.sum[0], G.sum[1], G.sum[2]); ico('check', R.sum, 16); R.sumt = el('span', '', R.sum, T('本周汇总已交到老板手上 · 1 项决定等你处理', 'The week’s summary is with the owner · 1 decision waits for you')); }
      honest(stage, G.tag[0], G.tag[1], !R.phone);
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P);
      var dd = u < D0 ? -1 : Math.min(6, Math.floor((u - D0) / DAY)), dp = dd < 0 ? 0 : ease.out(seg(u - D0 - dd * DAY, 0, 0.8));
      for (var i = 0; i < R.k.length; i++) {
        var o = R.k[i], tot = 0, last = 0;
        for (var d = 0; d <= dd; d++) { var x = DD[d][o.i]; tot += d === dd ? x * dp : x; if (d === dd) last = x; }
        if (o.i === 3 && dd >= 5) tot -= 1;   // one exception resolved on Saturday
        num(o.v, Math.round(tot * fade), o.i === 4 ? '¥' : '');
        var dk = dd >= 0 && last > 0 && u - D0 - dd * DAY < 1.1;
        cl(o.d, 'is-on', dk && fade > 0.9);
        if (dk && o.d.__l !== last) { o.d.__l = last; put(o.d, 'text', '+' + (o.i === 4 ? '¥' : '') + last); }
      }
      for (var b = 0; b < 7; b++) {
        var bb = R.b[b], k = b < dd ? 1 : b === dd ? dp : 0;
        syf(bb.s, Math.max(0.001, k * fade));
        cl(bb.c, 'is-today', b === dd && u < END);
      }
      var dk2 = u < END ? dd : 7;
      if (R.day && R.day.__dk !== dk2) { R.day.__dk = dk2; say(R.day, dd < 0 ? T('周一', 'Monday') : dk2 === 7 ? T('一周汇总', 'Week total') : T('周', '') + ZHW[dd], true); }
      if (R.p.length) {
        for (var r = 0; r < PR.length; r++) {
          var vis = dd >= PR[r].d, slot = 0;
          for (var q = 0; q < r; q++) if (dd >= PR[q].d) slot++;
          tf(R.p[r], 0, slot * G.pr[3]);
          op(R.p[r], vis ? fade : 0);
        }
      }
      if (R.sum) { op(R.sum, ease.out(seg(u, END + 0.2, END + 0.9)) * fade); }
    }
    var ZHW = K.ZH ? ['一', '二', '三', '四', '五', '六', '日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return { layouts: PANEL, pick: panelPick, build: build, tick: tick, still: END + 1.4 };
  }

  /* =====================================================================
     STOP — 可管理、可停止、可追踪、可验证. A six-step run with a large stop control: you pause it at
     step 3 (progress kept, logged), resume it from step 3 (steps 1–2 are not redone), and it ends
     waiting for your approval — it never sends by itself.
     ===================================================================== */
  function StopScene() {
    var P = 18, PAUSE = 3.5, RESUME = 7.0, END = 16.4;
    var STEPS = [T('读取询盘', 'Read the inquiry'), T('匹配产品与库存', 'Match product and stock'), T('计算报价', 'Price the quote'), T('核对底价', 'Check the floor price'), T('起草回复', 'Draft the reply'), T('等你审批后发送', 'Send after your approval')];
    // step i runs [S[i], E[i]); step 3 (index 2) is interrupted by the pause
    var S = [0.2, 1.3, 2.5, 8.3, 9.5, 10.7], E = [1.3, 2.5, 8.3, 9.5, 10.7, 99];
    var LOG = [
      [1.3, '14:31:52', T('第 1 步 读取询盘 ✓', 'Step 1 · inquiry read ✓'), 'ok'],
      [2.5, '14:31:58', T('第 2 步 匹配产品与库存 ✓', 'Step 2 · product matched ✓'), 'ok'],
      [3.6, '14:32:08', T('你 暂停 · 停在第 3 步，进度已保存', 'You paused · held at step 3, progress kept'), 'stop'],
      [7.1, '14:35:40', T('你 继续 · 从第 3 步接着做', 'You resumed · from step 3'), 'go'],
      [9.5, '14:35:57', T('第 4 步 核对底价 ✓', 'Step 4 · floor price checked ✓'), 'ok'],
      [10.7, '14:36:03', T('第 6 步 等你审批 · 不会自动发送', 'Step 6 · waits for you · never sends itself'), 'wait']
    ];
    var PROPS = [[T('可管理', 'Manage'), 0.2], [T('可停止', 'Stop'), PAUSE + 0.1], [T('可追踪', 'Trace'), PAUSE + 0.3], [T('可验证', 'Verify'), 9.5]];
    var G, R;
    var layouts = { square: { w: 680, h: 660 }, tall: { w: 520, h: 640 }, narrow: { w: 380, h: 500 }, phone: { w: 350, h: 252 } };
    function pick(w, h) { return h < w * 0.8 ? 'phone' : w < 440 ? 'narrow' : h > w * 1.08 ? 'tall' : 'square'; }
    function geo(name) {
      if (name === 'square') return { hd: [34, 44, 612], st: [34, 120, 330, 52], ctl: [520, 236, 92], pr: [520, 362], log: [34, 466, 580, 3, 27], tag: [646, 452] };
      if (name === 'tall') return { hd: [26, 40, 468], st: [26, 112, 250, 50], ctl: [400, 224, 80], pr: [400, 336], log: [26, 444, 436, 3, 27], tag: [494, 432] };
      // narrow and phone: the six steps as a row of dots and one line for the current step
      if (name === 'narrow') return { hd: [20, 28, 220], hz: true, cw: 340, st: [20, 186], ctl: [302, 96, 50], pr: [190, 262], log: [20, 306, 316, 3, 27], tag: [360, 168] };
      return { hd: [14, 16, 322], hz: true, cw: 220, nolh: true, st: [18, 60], ctl: [290, 104, 44], pr: null, log: [14, 176, 298, 1, 26], tag: [336, 166] };
    }
    function build(stage, L, name) {
      stage.className = 'sg-mo-stage sg-en sg-en-stop is-' + name + (name === 'phone' || name === 'narrow' ? ' is-compact' : '');
      G = geo(name); R = { s: [], log: [], pr: [] };
      var h = at(stage, 'sg-en-shead', G.hd[0], G.hd[1], G.hd[2]);
      var ht = el('div', 'sg-en-stitle', h);
      el('span', 'sg-en-k', ht, T('AI 任务 · 负责人 销售 AI · 审批人 你', 'AI task · owner sales AI · approver you'));
      el('b', '', ht, T('报价跟进 · Müller Energie', 'Quote follow-up · Müller Energie'));
      R.pill = el('span', 'sg-en-spill', h);
      // steps
      var st = G.st;
      STEPS.forEach(function (s, i) {
        var r = G.hz ? at(stage, 'sg-en-sstep', st[0] + i * 34, st[1], 28, 28) : at(stage, 'sg-en-sstep', st[0], st[1] + i * st[3], st[2], st[3] - 8);
        var n = el('span', 'sg-en-sn', r);
        var spin = el('i', 'sg-en-sspin', n);
        el('span', 'sg-en-snum', n, String(i + 1));
        var ok = el('span', 'sg-en-sok', n); ico('check', ok, 14);
        var o = { e: r, spin: spin };
        if (!G.hz) { var tx = el('span', 'sg-en-stx', r); el('b', '', tx, s); o.sub = el('span', '', tx); }
        R.s.push(o);
      });
      if (G.hz) { R.cur = at(stage, 'sg-en-scur', st[0], st[1] + 40, G.cw); }
      // the stop control
      var c = G.ctl, ctl = at(stage, 'sg-en-ctl', c[0] - c[2], c[1] - c[2], c[2] * 2, c[2] * 2);
      var csv = sv('svg', { class: 'sg-en-ctl-svg', width: c[2] * 2, height: c[2] * 2, viewBox: (-c[2]) + ' ' + (-c[2]) + ' ' + (c[2] * 2) + ' ' + (c[2] * 2) }, ctl);
      sv('circle', { class: 'sg-en-ctl-track', r: c[2] - 3 }, csv);
      R.arc = sv('circle', { class: 'sg-en-ctl-arc', r: c[2] - 3, 'stroke-dasharray': (Math.PI * 2 * (c[2] - 3) * 0.22).toFixed(1) + ' 999' }, csv);
      R.btn = el('div', 'sg-en-ctl-btn', ctl);
      var bi = el('span', 'sg-en-ctl-ico', R.btn); ico('pause', bi, Math.round(c[2] * 0.42), 'sg-ico sg-en-i-pause'); ico('play', bi, Math.round(c[2] * 0.42), 'sg-ico sg-en-i-play');
      R.blab = el('span', 'sg-en-ctl-lab', R.btn);
      R.ring = el('i', 'sg-en-ctl-ring', ctl);
      R.ctl = ctl;
      if (G.pr) {
        var pr = at(stage, 'sg-en-props', G.pr[0], G.pr[1]);
        PROPS.forEach(function (p) { R.pr.push(chip(pr, '', p[0], 'check')); });
      }
      // the log
      var lg = G.log, log = at(stage, 'sg-en-slog', lg[0], lg[1], lg[2], (G.nolh ? 0 : 34) + lg[3] * lg[4]);
      if (!G.nolh) { var lh = el('div', 'sg-en-rec-h', log); el('b', '', lh, T('运行记录', 'Run log')); el('span', '', lh, T('每一步都有记录', 'Every step on record')); }
      var body = el('div', 'sg-en-rec-body', log); body.style.height = (lg[3] * lg[4]) + 'px';
      for (var i = 0; i <= lg[3]; i++) {
        var row = at(body, 'sg-en-lrow', 0, 0, null, lg[4]); row.style.right = '0';
        R.log.push({ e: row, tm: el('time', '', row), tx: el('span', '', row) });
      }
      honest(stage, G.tag[0], G.tag[1], name !== 'phone');
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P), paused = u >= PAUSE && u < RESUME;
      var curI = -1;
      for (var i = 0; i < STEPS.length; i++) {
        var o = R.s[i], k;
        if (u < S[i]) k = 'idle';
        else if (i === 5) k = 'wait';
        else if (u >= E[i]) k = 'ok';
        else k = paused ? 'pause' : 'run';
        if (k === 'run' || k === 'pause' || k === 'wait') curI = i;
        if (fade < 0.5) k = 'idle';
        state(o.e, k);
        if (k === 'run') rot2(o.spin, u * 300);
        if (o.sub) say(o.sub, k === 'ok' ? T('完成', 'Done') : k === 'run' ? (i === 2 && u > RESUME ? T('从这一步继续…', 'Resumed here…') : T('进行中…', 'Running…')) : k === 'pause' ? T('已暂停 · 进度已保存', 'Paused · progress kept') : k === 'wait' ? T('等你审批 · 不会自动发送', 'Waits for you · never sends itself') : T('未开始', 'Not started'), true);
      }
      var ck = curI * 2 + (paused ? 1 : 0);
      if (R.cur && R.cur.__ck !== ck) { R.cur.__ck = ck; say(R.cur, curI < 0 ? '1 · ' + STEPS[0] : (curI + 1) + ' · ' + STEPS[curI] + (paused ? T(' · 已暂停', ' · paused') : ''), true); }
      var pk = u < PAUSE ? 'run' : paused ? 'pause' : u < E[4] ? 'resume' : 'wait';
      if (fade < 0.5) pk = 'run';
      state(R.pill, pk);
      say(R.pill, pk === 'run' ? T('运行中', 'Running') : pk === 'pause' ? T('已暂停', 'Paused') : pk === 'resume' ? T('从第 3 步继续', 'Resumed at step 3') : T('等你审批', 'Waits for you'), true);
      state(R.ctl, paused ? 'pause' : pk === 'wait' ? 'idle' : 'run');
      say(R.blab, paused ? T('继续', 'Resume') : T('暂停', 'Pause'), true);
      var press = (u >= PAUSE - 0.25 && u < PAUSE + 0.1) || (u >= RESUME - 0.25 && u < RESUME + 0.1);
      cl(R.btn, 'is-press', press);
      var rp = u >= PAUSE ? seg(u, PAUSE, PAUSE + 0.9) : 0, rq = u >= RESUME ? seg(u, RESUME, RESUME + 0.9) : 0, rr = rq > 0 ? rq : rp;
      op(R.ring, rr > 0 && rr < 1 ? 0.7 * (1 - rr) : 0);
      tf(R.ring, 0, 0, 0.9 + 0.5 * ease.out(rr));
      if (!paused && pk !== 'wait') rot(R.arc, u * 140);
      op(R.arc, paused || pk === 'wait' ? 0.25 : 1);
      for (var p = 0; p < R.pr.length; p++) cl(R.pr[p], 'is-on', u >= PROPS[p][1] && fade > 0.5);
      // the log, newest on top
      var n = 0; for (var l = 0; l < LOG.length; l++) if (u >= LOG[l][0]) n = l + 1;
      var lastT = n ? LOG[n - 1][0] : 0, k3 = ease.out(seg(u, lastT, lastT + 0.6)), H = G.log[4];
      for (var j = 0; j < R.log.length; j++) {
        var e = R.log[j], idx = n - 1 - j;
        if (idx < 0) { op(e.e, 0); continue; }
        if (e.i !== idx) { e.i = idx; put(e.tm, 'text', LOG[idx][1]); put(e.tx, 'text', LOG[idx][2]); state(e.e, LOG[idx][3]); }
        tf(e.e, 0, (j === 0 ? 0 : j - (1 - k3)) * H);
        op(e.e, (j === 0 ? k3 : j >= G.log[3] ? 1 - k3 : 1) * fade);
      }
    }
    function rot2(e, a) { a = Math.round(mod(a, 360)); if (e.__r === a) return; e.__r = a; e.style.transform = 'rotate(' + a + 'deg)'; }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 11.6 };
  }

  return { 'ent-decide': DecideScene, 'ent-verify': VerifyScene, 'ent-connect': ConnectScene, 'ent-operate': OperateScene, 'ent-stop': StopScene };
});
