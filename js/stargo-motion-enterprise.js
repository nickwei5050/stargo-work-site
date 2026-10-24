/* Enterprise page: code-drawn scenes in place of the photographs E01–E04 and E08 (placed by
   tools/code-art-enterprise.mjs, styled by css/stargo-motion-enterprise.css, run by js/stargo-motion.js).
   Demo data from the site's one cast; each scene says so on itself.

     ent-decide   决定  the rules say who approves what; items stop at the gate, you approve or reject
                        and the reason goes on record. Quote Q-1042 (below the floor price) ends the loop
                        waiting for you.
     ent-verify   核对  the Müller quote checked line by line against its sources; the lead time does not
                        match the schedule, goes back, is fixed and re-checked, and only then counts.
     ent-connect  连接  systems join one by one once access is set and you authorize; the finance folder
                        is not authorized and stays out.
     ent-operate  经营  the week adds up day by day; what needs a decision goes to the top.
     ent-stop     原则  an AI run with a large stop control: paused at step 3, logged, resumed from step 3,
                        and it ends waiting for your approval.

   The panel hosts are the part of each panel that the heading and sentence leave free (the CSS sets
   that box), so a scene never runs under the type: col (460 × 640, the column right of the text, or the
   area above it on tablets), band (900 × 250, the strip above an English heading on 992–1259px screens),
   phone (360 × 520, content above the text). Each is drawn at about its own size, so text stays ≥ 12px. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod, flash = K.flash;

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
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    gauge: 'M4.2 16.2a7.8 7.8 0 1 1 15.6 0M12 16.2l3.7-4.7',
    pause: 'M9.2 6.5v11M14.8 6.5v11',
    play: 'M8.5 6.2v11.6L18 12z'
  };
  function ico(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: PATH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function at(parent, cls, x, y, w, h, text) {
    var e = el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  // cached writers: they compare numbers, so a frame that changes nothing writes and allocates nothing
  function tf(e, x, y, s) {
    x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10; s = s == null ? 1 : Math.round(s * 1000) / 1000;
    if (e.__x === x && e.__y === y && e.__s === s) return;
    e.__x = x; e.__y = y; e.__s = s;
    e.style.transform = 'translate(' + x + 'px,' + y + 'px)' + (s !== 1 ? ' scale(' + s + ')' : '');
  }
  function rot(e, a, css) { a = Math.round(mod(a, 360)); if (e.__r === a) return; e.__r = a; if (css) e.style.transform = 'rotate(' + a + 'deg)'; else e.setAttribute('transform', 'rotate(' + a + ')'); }
  function op(e, v) { v = Math.round(v * 100) / 100; if (e.__op === v) return; e.__op = v; e.style.opacity = v; }
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
  function state(e, k) { if (e.__k === k) return; e.__k = k; e.setAttribute('data-k', k); }
  function chip(parent, cls, text, icon) { var c = el('span', 'sg-en-chip' + (cls ? ' ' + cls : ''), parent); if (icon) ico(icon, c, 14); el('span', '', c, text); return c; }
  // the soft fade that hides a loop's seam: in over [0, .5], out over [P − 1.2, P − .3]
  function veil(u, P) { return Math.min(seg(u, 0, 0.5), 1 - seg(u, P - 1.2, P - 0.3)); }

  var PANEL = { col: { w: 460, h: 640 }, band: { w: 900, h: 250 }, phone: { w: 360, h: 520 }, off: { w: 40, h: 40 } };
  // col and band use 13px type, phone 12px: a layout is taken only where it draws its type at 12px or more.
  // A short column (a laptop's short window) takes the phone layout; a box too small for any is left empty.
  function panelPick(w, h) {
    var k = 12 / 13;
    if ((window.innerWidth || w) < 768) return 'phone';
    if (w > h * 2) return w >= 900 * k && h >= 250 * k ? 'band' : 'off';
    if (w >= 460 * k && h >= 640 * k) return 'col';
    return w >= 360 && h >= 520 ? 'phone' : 'off';
  }
  function panel(sc) {
    var b = sc.build, t = sc.tick, off = false;
    sc.layouts = PANEL; sc.pick = panelPick;
    sc.build = function (stage, L, name) { off = name === 'off'; if (off) stage.className = 'sg-mo-stage'; else b(stage, L, name); };
    sc.tick = function (u) { if (!off) t(u); };
    return sc;
  }
  var TAG_FULL = T('动态示意 · 演示数据', 'Illustrative motion · demo data'), TAG_MINI = T('演示数据', 'Demo data');
  /* col and band are an app window: the app bar (mark, app name, where you are, a status pill) over the
     scene; phone has no chrome. The honesty tag sits in the band's bar, at the col's foot, and over the
     phone scene where its geometry says. */
  function chrome(stage, name, cls, mark, app, crumb, tag) {
    stage.className = 'sg-mo-stage sg-en ' + cls + ' is-' + name;
    var R = { phone: name === 'phone', band: name === 'band', col: name === 'col' };
    if (R.phone) { at(stage, 'sg-tag', tag[0], tag[1], null, null, TAG_MINI); return R; }
    var bar = el('div', 'sg-app-bar', stage);
    var mk = el('span', 'sg-app-mark', bar); ico(mark, mk, 15);
    el('b', '', bar, app);
    el('span', 'sg-app-crumb', bar, crumb);
    if (R.band) el('span', 'sg-tag', bar, TAG_FULL);
    R.pill = el('span', 'sg-en-pill', bar);
    if (R.col) at(stage, 'sg-tag', tag[0], tag[1], null, null, TAG_FULL);
    return R;
  }
  function pill(R, s, k) { if (!R.pill) return; say(R.pill, s, true); state(R.pill, k); }

  /* =====================================================================
     DECIDE — 关键决定由你们拍板. Your rules name the approver. An outreach email is rejected (too
     pushy, with the reason), a product page is approved by the marketing lead, the rewritten email is
     approved by you; then quote Q-1042, below the floor price, arrives and waits for your decision.
     ===================================================================== */
  function DecideScene() {
    var P = 6.4, HOLD = 6.4, TT = 3 * P + HOLD, ARRIVE = 1.3, SWAP = 1.1, TYPE0 = 1.5, TYPE1 = 3.0, PRESS = 3.3, DONE = 3.6, OUT = 4.6, REC = 3.8;
    var IT = [
      { ic: 'mail', t: T('开发信 · Nordwerk Energie', 'Outreach · Nordwerk Energie'), s: T('首次联系 · 销售 AI 起草', 'First contact · sales AI'), p: T('开发信', 'Outreach'), rule: 1, by: T('你', 'You'), ok: false,
        why: T('语气太硬，先问清需求', 'Too pushy — ask their needs first'), w: T('语气太硬，先问需求', 'Too pushy — ask first') },
      { ic: 'page', t: T('产品页 · 48V 储能柜', 'Product page · 48V rack storage'), s: T('3 张主图 · 中英两版', '3 images · 2 languages'), p: T('产品页', 'Product page'), rule: 2, by: T('市场主管', 'Marketing lead'), ok: true,
        why: T('参数与规格书一致，可以发布', 'Specs match the datasheet'), w: T('与规格书一致', 'Matches the datasheet') },
      { ic: 'mail', t: T('开发信 · 已修改', 'Outreach · revised'), s: T('先问需求 · 销售 AI 重写', 'Asks first · rewritten'), p: T('改后开发信', 'Revised outreach'), rule: 1, by: T('你', 'You'), ok: true,
        why: T('先问需求，语气合适，可以发', 'Asks first, right tone — send'), w: T('先问需求，可以发', 'Asks first — send') },
      { ic: 'doc', t: T('报价 Q-1042', 'Quote Q-1042'), s: T('低于底价 · 销售 AI 提交', 'Below the floor price'), p: 'Q-1042', rule: 0, by: T('你', 'You'), wait: true }
    ];
    var N = IT.length;
    var RS = [T('报价 → 你', 'Quotes → you'), T('联系客户 → 你', 'Outreach → you'), T('发布内容 → 市场主管', 'Publishing → marketing lead')];
    var G, R;
    function geo(name) {
      if (name === 'col') return { rules: [20, 58, 420], lock: true, gx: 404, ty: 192, gr: 22, iw: 250, ih: 54, q: [116, 56], ex: 90, dy: 26, card: [20, 252, 420, 152], rec: [20, 420, 420], rows: 3, rh: 46, tag: [444, 630] };
      if (name === 'band') return { one: [16, 60, 300], gx: 300, ty: 146, gr: 20, iw: 214, ih: 50, q: [54, 4], ex: 40, dy: 22, card: [340, 92, 300, 146], rec: [656, 54, 228], rows: 3, rh: 44 };
      return { gx: 318, ty: 46, gr: 18, iw: 196, ih: 44, q: [94, 40], ex: 50, dy: 14, card: [12, 84, 336, 112], rec: [12, 206, 336], rows: 2, rh: 30, tag: [350, 274] };
    }
    function build(stage, L, name) {
      G = geo(name);
      R = chrome(stage, name, 'sg-en-decide', 'person', T('审批', 'Approvals'), T('规则由你们定', 'Your rules'), G.tag);
      R.items = []; R.rows = [];
      if (G.rules) {
        // the bar's crumb (规则由你们定 / Your rules) names them; English wraps to three rows above the track
        var ru = at(stage, 'sg-en-rules', G.rules[0], G.rules[1], G.rules[2]);
        var rr = el('div', 'sg-en-rules-row', ru);
        R.rule = RS.map(function (r) { return chip(rr, 'sg-en-rule', r); });
        if (G.lock) chip(rr, 'sg-en-rule is-lock', T('付款 · 正式申报 · 专业审阅 → 始终人工', 'Payments · filings · reviews → always a person'), 'lock');
      }
      if (G.one) { var r1 = at(stage, 'sg-en-rules is-one', G.one[0], G.one[1], G.one[2]); el('span', 'sg-en-k', r1, T('规则', 'Rule')); R.one = chip(r1, 'sg-en-rule is-on', '').lastChild; }
      var svg = sv('svg', { class: 'sg-en-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
      var tx2 = R.band ? G.card[0] - 8 : L.w + 40;
      sv('line', { class: 'sg-en-track', x1: -40, y1: G.ty, x2: tx2, y2: G.ty }, svg);
      R.pass = sv('line', { class: 'sg-en-pass', x1: G.gx, y1: G.ty, x2: tx2, y2: G.ty }, svg);
      var gr = G.gr;
      R.gate = sv('g', { class: 'sg-en-gate', transform: 'translate(' + G.gx + ' ' + G.ty + ')' }, svg);
      sv('line', { class: 'sg-en-gate-bar', x1: 0, y1: -gr * 1.5, x2: 0, y2: gr * 1.5 }, R.gate);
      sv('circle', { class: 'sg-en-gate-ring', r: gr }, R.gate);
      var gi = sv('g', { class: 'sg-en-gate-ico', transform: 'translate(' + (-gr * 0.55) + ' ' + (-gr * 0.55) + ') scale(' + (gr * 1.1 / 24) + ')' }, R.gate);
      sv('path', { d: PATH.person, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gi);
      if (R.col) at(stage, 'sg-en-gate-label', G.gx, G.ty + gr + 6, null, null, T('审批关口', 'Gate'));
      for (var i = 0; i < N; i++) {
        var it = at(stage, 'sg-en-item', 0, G.ty - G.ih / 2, G.iw, G.ih);
        var ib = el('span', 'sg-en-item-ico', it); ico(IT[i].ic, ib, R.phone ? 16 : 20);
        var tx = el('span', 'sg-en-item-tx', it);
        el('b', '', tx, IT[i].p); // the short name on the moving tile; the card below carries the full title
        if (!R.phone) el('span', '', tx, IT[i].s);
        R.items.push(it);
      }
      var c = G.card, card = at(stage, 'sg-en-card sg-en-dcard', c[0], c[1], c[2], c[3]);
      var hd = el('div', 'sg-en-dhead', card);
      R.badge = el('span', 'sg-en-badge', hd);
      R.title = el('b', 'sg-en-dtitle', hd);
      var rs = el('div', 'sg-en-reason', card);
      el('span', 'sg-en-k', rs, T('原因', 'Reason'));
      R.why = el('span', 'sg-en-why', rs);
      var bt = el('div', 'sg-en-btns', card);
      R.no = el('span', 'sg-btn', bt, T('驳回', 'Reject'));
      R.yes = el('span', 'sg-btn is-primary', bt, T('批准', 'Approve'));
      R.card = card;
      var rc = G.rec, rec = at(stage, 'sg-en-rec', rc[0], rc[1], rc[2]);
      if (!R.phone) { var rh = el('div', 'sg-en-rec-h', rec); el('b', '', rh, T('审批记录', 'Approval record')); if (R.col) el('span', '', rh, T('每个决定都记下原因', 'Every decision keeps its reason')); }
      var body = el('div', 'sg-en-rec-body', rec);
      body.style.height = (G.rows * G.rh) + 'px';
      for (var r = 0; r <= G.rows; r++) {
        var row = at(body, 'sg-en-rrow', 0, 0, null, G.rh - 6);
        row.style.right = '0';
        var mk = el('span', 'sg-en-rmark', row); ico('check', mk, 14, 'sg-ico sg-en-rok'); ico('cross', mk, 14, 'sg-ico sg-en-rno');
        var rt = el('span', 'sg-en-rtx', row);
        R.rows.push({ e: row, a: el('b', '', rt), b: el('span', '', rt), tm: R.col ? el('time', '', row) : null });
      }
    }
    function tick(t) {
      var u = mod(t, TT), idx = u < 3 * P ? Math.floor(u / P) : 3, v = u - idx * P, fade = veil(u, TT), x;
      for (var i = 0; i < N; i++) {
        var r = i - idx, e = R.items[i], y = 0, o = 1, w8 = IT[i].wait;
        if (r === 0) {
          if (v < ARRIVE) { var ka = ease.out(seg(v, 0.1, ARRIVE)); x = G.q[1] + (G.q[0] - G.q[1]) * ka; o = ka; }
          else if (w8 || v < DONE) x = G.q[0];
          else if (IT[i].ok) { x = G.q[0] + ease.io(seg(v, DONE, DONE + 0.7)) * G.ex; o = 1 - seg(v, DONE, DONE + 0.6); }
          else { var k2 = ease.out(seg(v, DONE, DONE + 0.8)); x = G.q[0] - k2 * 30; y = k2 * G.dy; o = 1 - k2; }
        } else { x = G.q[1]; o = 0; }
        tf(e, x, y);
        op(e, o * fade);
        cl(e, 'is-at', r === 0 && v >= ARRIVE - 0.2 && (w8 || v < DONE));
        cl(e, 'is-ok', r === 0 && !w8 && v >= DONE && IT[i].ok);
        cl(e, 'is-no', r === 0 && !w8 && v >= DONE && !IT[i].ok);
      }
      // the decision card: the last decision while the next item travels, then the item at the gate
      var live = !(v < SWAP && idx > 0), I = IT[live ? idx : idx - 1];
      say(R.title, R.col ? I.t : I.p, true);
      var dec = I.wait ? 'wait' : live ? (v >= DONE ? (I.ok ? 'ok' : 'no') : 'wait') : (I.ok ? 'ok' : 'no');
      state(R.card, dec);
      var ds = dec === 'wait' ? T('等你拍板', 'Your call') : dec === 'ok' ? T('已批准', 'Approved') : T('已驳回', 'Rejected');
      say(R.badge, ds, true);
      pill(R, ds, dec);
      if (I.wait) { say(R.why, T('写下原因，再批准或驳回', 'Write a reason, then decide'), true); R.why.__tk = null; }
      else { R.why.__s = null; typedC(R.why, R.col ? I.why : I.w, live ? seg(v, TYPE0, TYPE1) : 1); }
      cl(R.why, 'is-ph', !!I.wait);
      cl(R.why, 'is-typing', live && !I.wait && v > TYPE0 && v < PRESS);
      var press = live && !I.wait && v >= PRESS && v < DONE, done = !I.wait && !(live && v < DONE);
      cl(R.yes, 'is-press', press && I.ok); cl(R.no, 'is-press', press && !I.ok);
      cl(R.yes, 'is-done', done && I.ok); cl(R.no, 'is-done', done && !I.ok);
      op(R.card, (live ? 1 : 0.5 + 0.5 * (1 - seg(v, 0, 0.6))) * fade);
      var cur = IT[idx];
      state(R.gate, v >= ARRIVE - 0.2 && (cur.wait || v < DONE) ? 'wait' : v >= DONE && v < OUT + 0.4 ? (cur.ok ? 'ok' : 'no') : 'idle');
      op(R.pass, !cur.wait && cur.ok && v >= DONE && v < OUT + 0.6 ? 1 - seg(v, OUT - 0.2, OUT + 0.6) : 0);
      if (R.rule) for (var q = 0; q < R.rule.length; q++) cl(R.rule[q], 'is-on', v >= 0.4 && (cur.wait || v < OUT) && cur.rule === q);
      if (R.one) say(R.one, RS[cur.rule]);
      // the record: a decision is written at REC; the newest is on top
      var adding = idx < 3 && v >= REC, n = Math.min(idx, 3) + (adding ? 1 : 0), k3 = ease.out(seg(v, REC, REC + 0.7));
      for (var j = 0; j < R.rows.length; j++) {
        var o2 = R.rows[j], d = n - 1 - j;
        if (d < 0) { op(o2.e, 0); continue; }
        if (o2.d !== d) {
          o2.d = d;
          var it2 = IT[d];
          state(o2.e, it2.ok ? 'ok' : 'no');
          put(o2.a, 'text', (it2.ok ? T('批准 · ', 'Approved · ') : T('驳回 · ', 'Rejected · ')) + it2.p + (R.col ? ' · ' + it2.by : ''));
          put(o2.b, 'text', R.col ? T('原因：', 'Reason: ') + it2.why : it2.w);
          if (o2.tm) put(o2.tm, 'text', '14:' + (32 + d * 4));
        }
        tf(o2.e, 0, (j === 0 && adding ? 0 : j - (adding ? 1 - k3 : 0)) * G.rh);
        op(o2.e, (j === 0 && adding ? k3 : j >= G.rows ? (adding ? 1 - k3 : 0) : 1) * fade);
      }
    }
    return panel({ build: build, tick: tick, still: 3 * P + 2.6, start: P + 0.2 });
  }

  /* =====================================================================
     VERIFY — 结果可以核对. The draft's five lines are checked against the inquiry, the production
     schedule and the product file; the lead time does not match, is flagged and sent back, fixed and
     re-checked. Only then is it 已核对 — and it still goes to you for approval.
     ===================================================================== */
  function VerifyScene() {
    var P = 16, START = 0.9, STEP = 1.45, C0 = 1.3, FIX = 9.3, REOK = 9.9, DONE = 10.4;
    var SRC = [T('询盘邮件', 'Inquiry email'), T('生产排期', 'Schedule'), T('产品资料', 'Product file')];
    var F = [
      { k: T('型号', 'Model'), v: '48V 100Ah', src: 0 },
      { k: T('数量', 'Quantity'), v: T('200 组', '200 pcs'), src: 0 },
      { k: T('贸易术语', 'Trade term'), v: T('DAP 汉堡', 'DAP Hamburg'), src: 0 },
      { k: T('交期', 'Lead time'), v: T('15 天', '15 days'), fix: T('35 天', '35 days'), src: 1, bad: T('排期：最早 35 天', 'Schedule: 35 days') },
      { k: T('认证', 'Certificates'), v: 'CE · UN38.3', src: 2 }
    ];
    var G, R;
    function geo(name) {
      if (name === 'col') return { hd: [20, 66, 420], doc: [20, 156, 420], dh: 36, rh: 48, note: [20, 446, 420], rec: [20, 478, 420], tag: [444, 630] };
      if (name === 'band') return { hd: [16, 58, 250], doc: [282, 52, 404], dh: 0, rh: 36, note: [16, 128, 250], rec: [706, 54, 180] };
      return { hd: [12, 12, 336], doc: [12, 70, 336], dh: 0, rh: 36, note: [12, 40, 336], rec: [12, 254, 336], tag: [350, 300] };
    }
    function build(stage, L, name) {
      G = geo(name);
      R = chrome(stage, name, 'sg-en-verify', 'check', T('结果核对', 'Checks'), T('报价草稿 · 对照 3 份来源', 'Quote draft · 3 sources'), G.tag);
      R.f = [];
      var h = at(stage, 'sg-en-vhead', G.hd[0], G.hd[1], G.hd[2]);
      if (!R.phone) {
        var ht = el('div', 'sg-en-vtitle', h);
        el('span', 'sg-en-k', ht, T('销售 AI 起草', 'Drafted by the sales AI'));
        el('b', '', ht, 'Müller Energie GmbH');
      }
      var stp = R.band ? null : el('div', 'sg-en-vsteps', h);
      R.steps = R.band ? [] : [T('已提交', 'Submitted'), T('核对中', 'Checking'), T('已核对', 'Checked')].map(function (s) {
        var e = el('span', 'sg-en-vstep', stp); el('i', '', e); el('span', '', e, s); return e;
      });
      R.note = at(stage, 'sg-en-vnote', G.note[0], G.note[1], G.note[2]);
      var d = G.doc, doc = at(stage, 'sg-en-card sg-en-vdoc', d[0], d[1], d[2], G.dh + F.length * G.rh);
      if (G.dh) { var dh = el('div', 'sg-en-vdh', doc); ico('bot', dh, 16); el('span', '', dh, T('AI 起草的报价', 'AI-drafted quote')); el('span', 'sg-en-vdh-r', dh, T('来源', 'Source')); }
      F.forEach(function (f) {
        var r = el('div', 'sg-en-vrow', doc);
        r.style.height = G.rh + 'px';
        el('span', 'sg-en-vk', r, f.k);
        var o = { e: r, v: el('b', 'sg-en-vv', r, f.v), s: el('span', 'sg-en-vsrc', r, SRC[f.src]) };
        var m = el('span', 'sg-en-vmark', r); ico('check', m, 14, 'sg-ico sg-en-vok'); ico('cross', m, 14, 'sg-ico sg-en-vno');
        o.m = m;
        R.f.push(o);
      });
      var rec = at(stage, 'sg-en-vrec', G.rec[0], G.rec[1], G.rec[2]);
      var kv = function (k, v) { var s = el('span', 'sg-en-kv', rec); el('span', 'sg-en-k', s, k); return el('b', '', s, v); };
      kv(T('谁做的', 'Done by'), T('销售 AI', 'Sales AI'));
      if (!R.phone) R.appr = kv(T('谁批准', 'Approver'), T('你 · 核对之后', 'You · after the check'));
      R.res = kv(T('结果', 'Result'));
      R.stuck = kv(T('卡在', 'Stopped at'));
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P), bad = F[3];
      var stepK = u < START ? 0 : u < DONE ? 1 : 2;
      for (var s = 0; s < R.steps.length; s++) { cl(R.steps[s], 'is-on', s === stepK); cl(R.steps[s], 'is-past', s < stepK); }
      for (var i = 0; i < F.length; i++) {
        var c0 = C0 + i * STEP, f = R.f[i], scan = u >= c0 && u < c0 + 0.9, res = u >= c0 + 0.9;
        var k = F[i].bad ? (u >= REOK ? 'ok' : u >= FIX ? 'scan' : res ? 'no' : scan ? 'scan' : 'idle') : (res ? 'ok' : scan ? 'scan' : 'idle');
        state(f.e, k);
        op(f.m, (k === 'ok' || k === 'no') ? fade : 0);
        if (F[i].bad) { say(f.v, u >= FIX + 0.1 ? F[i].fix : F[i].v); say(f.s, k === 'no' ? F[i].bad : SRC[F[i].src], true); }
      }
      var flagged = u >= C0 + 3 * STEP + 0.9 && u < REOK;
      say(R.note, u < START ? T('已提交 ≠ 已完成', 'Submitted ≠ done') : flagged ? T('1 处不一致 · 已退回修正', '1 mismatch · sent back to fix') : u < DONE ? T('逐项对照来源', 'Checking each line') : T('核对过才算数 ✓', 'Counts once checked ✓'), u < 0.2);
      state(R.note, flagged ? 'no' : u >= DONE ? 'ok' : 'idle');
      var rs = u < C0 + 0.9 ? T('待核对', 'Pending') : flagged ? T('交期不符', 'Lead time mismatch') : u < DONE ? T('核对中', 'Checking') : T('符合要求', 'Meets spec');
      say(R.res, rs, u < 0.2);
      state(R.res, flagged ? 'no' : u >= DONE ? 'ok' : 'idle');
      say(R.stuck, flagged ? T('第 4 项 · 交期', 'Line 4 · lead time') : '—', u < 0.2);
      state(R.stuck, flagged ? 'no' : 'idle');
      pill(R, flagged ? T('退回修正', 'Sent back') : stepK === 0 ? T('已提交', 'Submitted') : stepK === 1 ? T('核对中', 'Checking') : T('已核对', 'Checked'), flagged ? 'no' : stepK === 2 ? 'ok' : 'wait');
    }
    return panel({ build: build, tick: tick, still: 11.2, start: 6.4 });
  }

  /* =====================================================================
     CONNECT — 逐项接入. Each system: access set (可读 / 可改 / 需审批), your authorization, then the
     line goes live and work flows to the one workflow. The finance folder is not authorized.
     ===================================================================== */
  function ConnectScene() {
    var P = 22, S0 = 0.8, GAP = 3.1, LAST = S0 + 5 * GAP;
    var NODES = [
      { ic: 'mail', n: T('邮箱', 'Email'), p: [T('可读', 'Read'), T('发信需审批', 'Sending needs approval')] },
      { ic: 'users', n: T('客户记录', 'Customer records'), s: T('客户记录', 'Customers'), p: [T('可读', 'Read'), T('可改', 'Change')] },
      { ic: 'book', n: T('产品知识', 'Product knowledge'), s: T('产品知识', 'Product info'), p: [T('可读', 'Read')] },
      { ic: 'box', n: 'ERP', p: [T('可读', 'Read'), T('改单需审批', 'Edits need approval')] },
      { ic: 'folder', n: T('网盘 · 产品资料', 'Drive · Specs'), s: T('网盘 · 产品资料', 'Specs'), p: [T('可读', 'Read')] },
      { ic: 'folder', n: T('网盘 · 财务目录', 'Drive · Finance'), s: T('网盘 · 财务目录', 'Finance'), p: [], deny: true }
    ];
    var G, R;
    function geo(name) {
      if (name === 'col') return { kind: 'col', hub: [56, 106], hr: 26, x0: 92, y0: 160, nw: 348, nh: 64, step: 72, tag: [444, 630] };
      if (name === 'band') return { kind: 'band', hub: [450, 132], hr: 30, nw: 240, nh: 58, at: [[136, 79], [136, 143], [136, 207], [764, 79], [764, 143], [764, 207]] };
      return { kind: 'list', hub: [52, 110], hr: 30, nw: 240, nh: 31, at: [0, 1, 2, 3, 4, 5].map(function (i) { return [230, 22 + i * 35]; }), tag: [350, 226] };
    }
    function build(stage, L, name) {
      G = geo(name);
      R = chrome(stage, name, 'sg-en-connect', 'link', T('应用连接', 'App Connections'), T('逐项接入', 'One at a time'), G.tag);
      R.n = [];
      var svg = sv('svg', { class: 'sg-en-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
      var hx = G.hub[0], hy = G.hub[1], col = G.kind === 'col', list = G.kind === 'list';
      NODES.forEach(function (nd, i) {
        var o = { i: i }, x, y, d, cx, cy;
        if (col) {
          y = G.y0 + i * G.step; x = G.x0; cy = y + G.nh / 2;
          var top = hy + G.hr + 4;
          d = 'M' + hx + ' ' + top + 'V' + (cy - 10) + 'Q' + hx + ' ' + cy + ' ' + (hx + 10) + ' ' + cy + 'H' + x;
          o.a = [x, cy]; o.run = [x - hx, cy - top];
        } else {
          var p = G.at[i], left = p[0] < hx;
          x = p[0] - G.nw / 2; y = p[1] - G.nh / 2; cx = left ? x + G.nw : x; cy = p[1];
          if (list) {
            var dx = cx - hx, dy = cy - hy, m = Math.hypot(dx, dy) || 1, sx = hx + dx / m * (G.hr + 4), sy = hy + dy / m * (G.hr + 4);
            d = 'M' + sx + ' ' + sy + 'L' + cx + ' ' + cy;
            o.bz = { a: [cx, cy], b: [cx, cy], c: [sx, sy], d: [sx, sy] };
          } else {
            var sx2 = hx + (left ? -1 : 1) * (G.hr + 4), mx = (sx2 + cx) / 2;
            d = 'M' + sx2 + ' ' + hy + 'C' + mx + ' ' + hy + ' ' + mx + ' ' + cy + ' ' + cx + ' ' + cy;
            o.bz = { a: [cx, cy], b: [mx, cy], c: [mx, hy], d: [sx2, hy] };
          }
          o.a = [cx, cy];
        }
        o.dash = sv('path', { class: 'sg-en-cl is-dash' + (nd.deny ? ' is-deny' : ''), d: d }, svg);
        o.solid = sv('path', { class: 'sg-en-cl is-live', d: d }, svg);
        o.dot = sv('circle', { class: 'sg-en-cdot', r: list ? 2.5 : 3.5, cx: o.a[0], cy: o.a[1] }, svg);
        var c = at(stage, 'sg-en-card sg-en-node' + (nd.deny ? ' is-deny' : ''), x, y, G.nw, G.nh);
        var tp = el('div', 'sg-en-ntop', c);
        var ib = el('span', 'sg-en-nico', tp); ico(nd.ic, ib, list ? 14 : 17);
        el('b', 'sg-en-nname', tp, col ? nd.n : (nd.s || nd.n));
        o.st = el('span', 'sg-en-nst', tp);
        if (nd.deny) ico('lock', o.st, 13);
        o.stt = el('span', '', o.st);
        if (!list) {
          o.btn = el('span', 'sg-btn is-primary sg-en-auth', tp, T('授权', 'Authorize'));
          var ch = el('div', 'sg-en-nchips', c);
          o.chips = nd.p.map(function (s) { return chip(ch, '', s); });
          if (nd.deny) o.note = el('span', 'sg-en-ndeny', ch, T('没有授权，就不接入', 'Not authorized, so not connected'));
        }
        o.c = c;
        R.n.push(o);
      });
      var hub = sv('g', { class: 'sg-en-hub', transform: 'translate(' + hx + ' ' + hy + ')' }, svg);
      sv('circle', { class: 'sg-en-hub-halo', r: G.hr + (list ? 8 : 12) }, hub);
      sv('circle', { class: 'sg-en-hub-ring', r: G.hr }, hub);
      R.spin = sv('circle', { class: 'sg-en-hub-spin', r: G.hr + (list ? 4 : 6) }, hub);
      sv('path', { class: 'sg-en-hub-star', d: K.STAR, transform: 'scale(' + (G.hr / 62) + ')' }, hub);
      var lab = col ? at(stage, 'sg-en-hublab is-side', hx + G.hr + 20, hy - 24, 330) : at(stage, 'sg-en-hublab', hx, hy + G.hr + (list ? 10 : 14));
      if (!list) el('b', '', lab, T('同一套业务流程', 'One workflow'));
      if (col) el('em', '', lab, T('现有软件保留，逐项接入', 'Keep your software; connect one at a time'));
      if (!col) { R.count = el('span', '', lab); R.deny = el('span', 'sg-en-hubno', lab, T('1 项未授权', '1 not authorized')); }
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P), live = 0;
      for (var i = 0; i < NODES.length; i++) {
        var nd = NODES[i], o = R.n[i], s = S0 + i * GAP, k;
        if (nd.deny) k = u < s ? 'idle' : u < s + 1.2 ? 'ask' : 'deny';
        else k = u < s ? 'idle' : u < s + 1.1 ? 'cfg' : u < s + 2.0 ? 'auth' : 'live';
        if (k === 'live' && fade < 0.6) k = 'idle';
        state(o.c, k);
        say(o.stt, k === 'idle' ? T('未连接', 'Not connected') : k === 'cfg' ? T('设置权限', 'Set access') : k === 'auth' ? T('等你授权', 'Needs your OK') : k === 'live' ? T('已接入', 'Connected') : k === 'ask' ? T('需要授权', 'Needs your OK') : T('未授权', 'Not authorized'), true);
        if (o.chips) for (var j = 0; j < o.chips.length; j++) cl(o.chips[j], 'is-in', k !== 'idle' && u >= s + 0.25 + j * 0.3);
        if (o.btn) { cl(o.btn, 'is-in', k === 'auth'); cl(o.btn, 'is-press', k === 'auth' && u >= s + 1.65); }
        op(o.dash, (k === 'idle' ? 0.35 : k === 'live' ? 0 : 0.85) * fade);
        op(o.solid, k === 'live' ? fade * ease.out(seg(u, s + 2.0, s + 2.5)) : 0);
        if (k === 'live') {
          live++;
          var f = mod(u * 0.5 + i * 0.37, 1);
          op(o.dot, Math.min(1, f * 6, (1 - f) * 6) * fade);
          if (o.run) { var a = o.run[0], b = o.run[1], q = f * (a + b); tf(o.dot, -Math.min(q, a), q > a ? a - q : 0); }
          else { var g = o.bz, v = 1 - f, w0 = v * v * v, w1 = 3 * v * v * f, w2 = 3 * v * f * f, w3 = f * f * f; tf(o.dot, w0 * g.a[0] + w1 * g.b[0] + w2 * g.c[0] + w3 * g.d[0] - g.a[0], w0 * g.a[1] + w1 * g.b[1] + w2 * g.c[1] + w3 * g.d[1] - g.a[1]); }
        } else op(o.dot, 0);
      }
      rot(R.spin, u * 24);
      var no = u >= LAST + 1.2 && fade > 0.6, ck = live * 2 + (no ? 1 : 0);
      if (R.__ck !== ck) {
        R.__ck = ck;
        var cs = T('已接入 ', 'Connected ') + live + '/5';
        pill(R, cs, live ? 'ok' : 'idle');
        if (R.count) { say(R.count, cs); op(R.deny, no ? 1 : 0); }
      }
    }
    return panel({ build: build, tick: tick, still: LAST + 2.6, start: S0 + 2 * GAP + 2.3 });
  }

  /* =====================================================================
     OPERATE — 看经营. Seven days roll up into the week: opportunities, orders, tasks, exceptions,
     costs and approvals; the decisions that matter rise to the top of the list.
     ===================================================================== */
  function OperateScene() {
    var P = 18, D0 = 0.6, DAY = 1.45, END = D0 + 7 * DAY;
    var KPI = [T('商机', 'Opportunities'), T('订单', 'Orders'), T('任务完成', 'Tasks done'), T('异常', 'Exceptions'), T('费用', 'Costs'), T('待审批', 'Approvals')];
    // per day: opportunities, orders, tasks, exceptions, cost (yuan), approvals
    var DD = [[4, 1, 6, 0, 260, 0], [3, 0, 7, 0, 310, 0], [5, 1, 6, 1, 280, 0], [2, 2, 8, 0, 340, 1], [6, 1, 7, 1, 300, 0], [2, 1, 4, 0, 220, 0], [1, 0, 3, 0, 150, 0]];
    var WD = [T('一', 'M'), T('二', 'T'), T('三', 'W'), T('四', 'T'), T('五', 'F'), T('六', 'S'), T('日', 'S')];
    var DAYN = K.ZH ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var PR = [ // rank 0 first; d = the day it appears
      { d: 3, c: 'wait', t: T('报价 Q-1042 · 低于底价', 'Quote Q-1042 · below floor'), s: T('Q-1042 · 低于底价', 'Q-1042 · below floor'), o: T('你 · 今天', 'You · today'), tg: T('待审批', 'Approval') },
      { d: 2, c: 'no', t: T('交期提醒 · 柳州工厂', 'Lead-time alert · Liuzhou plant'), s: T('交期 · 柳州工厂', 'Lead time · Liuzhou'), o: T('跟单 · 周四', 'Orders desk · Thu'), tg: T('异常', 'Exception') },
      { d: 4, c: 'idle', t: T('PT Surya Energi · 该补货了', 'PT Surya Energi · restock due'), s: T('PT Surya · 补货', 'PT Surya · restock'), o: T('销售 AI · 周五', 'Sales AI · Fri'), tg: T('补货', 'Restock') }
    ];
    var MAXB = 7, G, R;
    function geo(name) {
      if (name === 'col') return { kp: [20, 66, 420, 74, 3], ch: [20, 248, 420, 160], pr: [20, 428, 420, 50], tag: [444, 630] };
      if (name === 'band') return { kp: [16, 54, 372, 86, 3], ch: [404, 54, 192, 182], pr: [616, 54, 268, 50] };
      return { kp: [12, 26, 336, 56, 3, 3], ch: [12, 94, 336, 56], pr: null, tag: [350, 22] };
    }
    function build(stage, L, name) {
      G = geo(name);
      R = chrome(stage, name, 'sg-en-operate', 'gauge', T('经营驾驶舱', 'Business Cockpit'), T('本周', 'This week'), G.tag);
      R.k = []; R.b = []; R.p = [];
      var kp = G.kp, kw = (kp[2] - (kp[4] - 1) * 10) / kp[4];
      (R.phone ? [0, 1, 5] : [0, 1, 2, 3, 4, 5]).forEach(function (ki, i) {
        // is-co: the costs card, whose four-digit yen total leaves no room beside it for the day's delta
        var c = at(stage, 'sg-en-card sg-en-kpi' + (ki === 5 ? ' is-ap' : ki === 3 ? ' is-ex' : ki === 4 ? ' is-co' : ''), kp[0] + (i % kp[4]) * (kw + 10), kp[1] + Math.floor(i / kp[4]) * (kp[3] + 10), kw, kp[3]);
        el('span', 'sg-en-k', c, KPI[ki]);
        var vr = el('div', 'sg-en-kvr', c);
        R.k.push({ i: ki, r: vr, v: el('b', 'sg-en-kval', vr), d: el('em', 'sg-en-kd', vr) });
      });
      var ch = G.ch, chart = at(stage, 'sg-en-chart', ch[0], ch[1], ch[2], ch[3]);
      if (!R.phone) {
        var chh = el('div', 'sg-en-chh', chart); el('b', '', chh, T('每天', 'By day'));
        var lg = R.band ? null : el('span', 'sg-en-legend', chh);
        if (lg) { el('i', 'is-a', lg); el('span', '', lg, KPI[0]); el('i', 'is-b', lg); el('span', '', lg, KPI[1]); }
      }
      var bars = el('div', 'sg-en-bars', chart);
      for (var d = 0; d < 7; d++) {
        var col2 = el('div', 'sg-en-bar', bars);
        var st = el('div', 'sg-en-bstack', col2);
        el('i', 'sg-en-ba', st).style.height = (DD[d][0] / MAXB * 100) + '%';
        el('i', 'sg-en-bb', st).style.height = (DD[d][1] / MAXB * 100) + '%';
        el('span', 'sg-en-bd', col2, WD[d]);
        R.b.push({ c: col2, s: st });
      }
      if (G.pr) {
        var pr = at(stage, 'sg-en-plist', G.pr[0], G.pr[1], G.pr[2], 34 + PR.length * G.pr[3]);
        var ph = el('div', 'sg-en-chh', pr); el('b', '', ph, T('要紧的先处理', 'What matters first'));
        PR.forEach(function (p) {
          var r = at(pr, 'sg-en-prow is-' + p.c, 0, 34, null, G.pr[3] - 8);
          r.style.right = '0';
          el('span', 'sg-en-ptag', r, p.tg);
          var tx = el('span', 'sg-en-ptx', r); el('b', '', tx, R.band ? p.s : p.t); el('span', '', tx, p.o);
          R.p.push(r);
        });
      }
    }
    function tick(t) {
      var u = mod(t, P), fade = veil(u, P);
      var dd = u < D0 ? -1 : Math.min(6, Math.floor((u - D0) / DAY)), dp = dd < 0 ? 0 : ease.out(seg(u - D0 - dd * DAY, 0, 0.8));
      for (var i = 0; i < R.k.length; i++) {
        var o = R.k[i], tot = 0, last = 0;
        for (var d = 0; d <= dd; d++) { var x = DD[d][o.i]; tot += d === dd ? x * dp : x; if (d === dd) last = x; }
        if (o.i === 3 && dd >= 5) tot -= 1;   // one exception resolved on Saturday
        num(o.v, Math.round(tot), o.i === 4 ? '¥' : '');
        op(o.r, fade);
        var dk = dd >= 0 && last > 0 && u - D0 - dd * DAY < 1.1;
        cl(o.d, 'is-on', dk && fade > 0.9);
        if (dk && o.d.__l !== last) { o.d.__l = last; put(o.d, 'text', '+' + (o.i === 4 ? '¥' : '') + last); }
      }
      for (var b = 0; b < 7; b++) {
        var bb = R.b[b], k = b < dd ? 1 : b === dd ? dp : 0;
        syf(bb.s, Math.max(0.001, k * fade));
        cl(bb.c, 'is-today', b === dd && u < END);
      }
      var wk = u >= END;
      pill(R, wk ? T('一周汇总', 'Week total') : DAYN[dd < 0 ? 0 : dd], wk ? 'ok' : 'wait');
      for (var r = 0; r < R.p.length; r++) {
        var slot = 0;
        for (var q = 0; q < r; q++) if (dd >= PR[q].d) slot++;
        tf(R.p[r], 0, slot * G.pr[3]);
        op(R.p[r], dd >= PR[r].d ? fade : 0);
      }
    }
    return panel({ build: build, tick: tick, still: END + 1.4, start: D0 + 3.3 * DAY });
  }

  /* =====================================================================
     STOP — 可管理、可停止、可追踪、可验证. A six-step run with a large stop control: you pause it at
     step 3 (progress kept, logged), resume it from step 3 (steps 1–2 are not redone), and it ends
     waiting for your approval; it never sends by itself.
     ===================================================================== */
  function StopScene() {
    var P = 18, PAUSE = 3.5, RESUME = 7.0;
    var STEPS = [T('读取询盘', 'Read the inquiry'), T('匹配产品与库存', 'Match product and stock'), T('计算报价', 'Price the quote'), T('核对底价', 'Check the floor price'), T('起草回复', 'Draft the reply'), T('等你审批后发送', 'Send after your approval')];
    // step i runs [S[i], E[i]); step 3 (index 2) is interrupted by the pause
    var S = [0.2, 1.3, 2.5, 8.3, 9.5, 10.7], E = [1.3, 2.5, 8.3, 9.5, 10.7, 99];
    // [time, clock, full line, short line (narrow boxes), kind]
    var LOG = [
      [1.3, '14:31:52', T('第 1 步 读取询盘 ✓', 'Step 1 · inquiry read ✓'), T('第 1 步 ✓', 'Step 1 ✓'), 'ok'],
      [2.5, '14:31:58', T('第 2 步 匹配产品与库存 ✓', 'Step 2 · product matched ✓'), T('第 2 步 ✓', 'Step 2 ✓'), 'ok'],
      [3.6, '14:32:08', T('你 暂停 · 停在第 3 步，进度已保存', 'You paused · held at step 3, progress kept'), T('暂停在第 3 步 · 已保存', 'Paused at step 3 · saved'), 'stop'],
      [7.1, '14:35:40', T('你 继续 · 从第 3 步接着做', 'You resumed · from step 3'), T('从第 3 步继续', 'Resumed from step 3'), 'go'],
      [9.5, '14:35:57', T('第 4 步 核对底价 ✓', 'Step 4 · floor price checked ✓'), T('第 4 步 底价 ✓', 'Step 4 · floor price ✓'), 'ok'],
      [10.7, '14:36:03', T('第 6 步 等你审批 · 不会自动发送', 'Step 6 · waits for you · never sends itself'), T('等你审批 · 不自动发', 'Waits for you · no auto-send'), 'wait']
    ];
    var PROPS = [[T('可管理', 'Manage'), 0.2], [T('可停止', 'Stop'), PAUSE + 0.1], [T('可追踪', 'Trace'), PAUSE + 0.3], [T('可验证', 'Verify'), 9.5]];
    var G, R;
    var layouts = { square: { w: 680, h: 660 }, tall: { w: 520, h: 640 }, mid: { w: 520, h: 510 }, narrow: { w: 360, h: 460 }, phone: { w: 340, h: 252 } };
    // the largest layout drawn at 12px or more (square and tall use 13px type, the others 12px)
    function pick(w, h) {
      if (h < w * 0.8 && w < 560) return 'phone';
      if (w >= 628 && h >= 609) return h > w * 1.08 ? 'tall' : 'square';
      if (w >= 480 && h >= 591 && h > w * 1.08) return 'tall';
      return w >= 520 && h >= 510 ? 'mid' : 'narrow';
    }
    function geo(name) {
      if (name === 'square') return { hd: [34, 44, 612], st: [34, 120, 330, 52], ctl: [520, 236, 92], pr: [520, 362], log: [34, 466, 580, 3, 27], tag: [646, 452] };
      if (name === 'mid') return { hd: [24, 26, 472], st: [24, 92, 270, 44], ctl: [404, 166, 70], pr: [404, 250], log: [24, 358, 440, 2, 26], tag: [496, 344] };
      if (name === 'tall') return { hd: [26, 40, 468], st: [26, 112, 250, 50], ctl: [400, 224, 80], pr: [400, 336], log: [26, 444, 436, 3, 27], tag: [494, 432] };
      // narrow and phone: the six steps as a row of dots and one line for the current step. The narrow box
      // is the picture's, which Mono's parallax slides by a tenth of its height: its last 40px stay empty.
      if (name === 'narrow') return { hd: [18, 18, 324], hz: true, cw: 214, st: [18, 106], ctl: [292, 130, 46], pr: [180, 194], log: [18, 238, 292, 3, 27], tag: [342, 402], short: true };
      return { hd: [12, 16, 316], hz: true, cw: 214, nolh: true, st: [14, 60], ctl: [284, 104, 44], pr: null, log: [12, 176, 292, 1, 26], tag: [328, 166], short: true };
    }
    function build(stage, L, name) {
      stage.className = 'sg-mo-stage sg-en sg-en-stop is-' + name + (name === 'phone' || name === 'narrow' ? ' is-compact' : '');
      G = geo(name); R = { s: [], log: [], pr: [] };
      var h = at(stage, 'sg-en-shead', G.hd[0], G.hd[1], G.hd[2]);
      var ht = el('div', 'sg-en-stitle', h);
      if (!G.short) el('span', 'sg-en-k', ht, T('AI 任务 · 负责人 销售 AI · 审批人 你', 'AI task · owner sales AI · approver you'));
      el('b', '', ht, name === 'phone' ? T('报价跟进 · Müller Energie', 'Quote · Müller Energie') : T('报价跟进 · Müller Energie', 'Quote follow-up · Müller Energie'));
      R.pill = el('span', 'sg-en-spill', h);
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
      if (G.hz) R.cur = at(stage, 'sg-en-scur', st[0], st[1] + 40, G.cw);
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
      var lg = G.log, log = at(stage, 'sg-en-slog', lg[0], lg[1], lg[2], (G.nolh ? 0 : 34) + lg[3] * lg[4]);
      if (!G.nolh) { var lh = el('div', 'sg-en-rec-h', log); el('b', '', lh, T('运行记录', 'Run log')); el('span', '', lh, T('每一步都有记录', 'Every step on record')); }
      var body = el('div', 'sg-en-rec-body', log); body.style.height = (lg[3] * lg[4]) + 'px';
      for (var i = 0; i <= lg[3]; i++) {
        var row = at(body, 'sg-en-lrow', 0, 0, null, lg[4]); row.style.right = '0';
        R.log.push({ e: row, tm: el('time', '', row), tx: el('span', '', row) });
      }
      at(stage, 'sg-tag', G.tag[0], G.tag[1], null, null, name === 'phone' ? TAG_MINI : TAG_FULL);
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
        if (k === 'run') rot(o.spin, u * 300, true);
        if (o.sub) say(o.sub, k === 'ok' ? T('完成', 'Done') : k === 'run' ? (i === 2 && u > RESUME ? T('从这一步继续…', 'Resumed here…') : T('进行中…', 'Running…')) : k === 'pause' ? T('已暂停 · 进度已保存', 'Paused · progress kept') : k === 'wait' ? T('等你审批 · 不会自动发送', 'Waits for you · never sends itself') : T('未开始', 'Not started'), true);
      }
      var ck = curI * 2 + (paused ? 1 : 0);
      if (R.cur && R.cur.__ck !== ck) { R.cur.__ck = ck; say(R.cur, curI < 0 ? '1 · ' + STEPS[0] : (curI + 1) + ' · ' + STEPS[curI] + (paused ? T(' · 已暂停', ' · paused') : ''), true); }
      var pk = u < PAUSE ? 'run' : paused ? 'pause' : u < E[4] ? 'resume' : 'wait';
      if (fade < 0.5) pk = 'run';
      state(R.pill, pk);
      say(R.pill, pk === 'run' ? T('运行中', 'Running') : pk === 'pause' ? T('已暂停', 'Paused') : pk === 'resume' ? (G.short ? T('已继续', 'Resumed') : T('从第 3 步继续', 'Resumed at step 3')) : T('等你审批', 'Waits for you'), true);
      state(R.ctl, paused ? 'pause' : pk === 'wait' ? 'idle' : 'run');
      say(R.blab, paused ? T('继续', 'Resume') : T('暂停', 'Pause'), true);
      cl(R.btn, 'is-press', (u >= PAUSE - 0.25 && u < PAUSE + 0.1) || (u >= RESUME - 0.25 && u < RESUME + 0.1));
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
        if (e.i !== idx) { e.i = idx; put(e.tm, 'text', LOG[idx][1]); put(e.tx, 'text', LOG[idx][G.short ? 3 : 2]); state(e.e, LOG[idx][4]); }
        tf(e.e, 0, (j === 0 ? 0 : j - (1 - k3)) * H);
        op(e.e, (j === 0 ? k3 : j >= G.log[3] ? 1 - k3 : 1) * fade);
      }
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 11.6 };
  }

  return { 'ent-decide': DecideScene, 'ent-verify': VerifyScene, 'ent-connect': ConnectScene, 'ent-operate': OperateScene, 'ent-stop': StopScene };
});
