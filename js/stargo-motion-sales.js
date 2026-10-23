/* SALES — the capability page's Sales Desk and quote pictures, drawn in code where the owner's
   AI photographs were (2026-10-23, 「图片改成代码」):

     inbox    「统一询盘入口」 (Sales Desk row 01; c05-unified-inbox): messages from email, WhatsApp,
              阿里国际站 and the website form land in one list, each one read for language, intent and
              product, sorted into 新询盘 / 历史消息 / 垃圾 and handed to a team.
     account  「客户全景」 (Sales Desk row 03; c06-customer-360): Müller Energie's record assembles
              itself — contacts and their roles, the stage, orders and samples, quotes, documents, the
              last conversations and the next step, which waits for a person.
     quote    03 「报价有依据，利润有边界，文件有版本」 (the quote band; c07-quote-approval): Q-1042 is
              drafted from the price list and the packing and freight rules, the margin guard finds it
              under the floor, an approver taps 批准, and v3 is kept as the formal version beside v1, v2.

   Each lives on window.STARGO_SCENES and is run by js/stargo-motion.js: tick(t) is a pure function
   of time, `still` the reduced-motion frame. Every layout is cut to its host's own size (W × H follow
   the box, so the stage scale is ~1 and no text is under 12 CSS px on a phone); the pieces sit in CSS
   flex and grid (css/stargo-motion-sales.css), and a frame writes only transforms, opacity and classes
   through put(), which skips unchanged values. Every name and number is demo data from the site's one
   demo cast, and each picture says so on itself. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod;

  var GLYPH = {
    mail: K.ICON.mail, chat: K.ICON.chat, store: K.ICON.store, form: K.ICON.form, shield: K.ICON.shield, check: K.ICON.check,
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
    box: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    price: 'M4 12.5V5h7.5L20 13.5 13.5 20zM8 8.5h.01',
    lock: 'M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11M5.5 11h13v9h-13zM12 14.5v2',
    clock: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 8v4.2l2.8 1.8',
    alert: 'M12 4.5 20.5 19.5h-17zM12 10v4M12 16.8h.01',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5',
    stack: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function even(v) { return Math.round(v / 2) * 2; }
  function lay(layouts, kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
  var TAG_FULL = T('动态示意 · 演示数据', 'Illustrative motion · demo data'), TAG_MINI = T('演示数据', 'Demo data');
  // the app bar of every Sales Desk screen: mark, product, place, and what the picture is
  function bar(stage, title, crumb, tag) {
    var b = el('div', 'sgs-bar', stage);
    var mk = el('span', 'sg-app-mark', b); K.icon('spark', mk, 12);
    el('b', '', b, title);
    if (crumb) el('span', 'sgs-crumb', b, crumb);
    var right = el('span', 'sgs-bar-r', b);
    el('span', 'sgs-tagline', right, tag);
    return right;
  }
  // a piece that arrives at a moment: opacity and a short rise, both on the compositor
  function arrive(e, p, dy) {
    if (p <= 0) { css(e, 'opacity', '0'); return; }
    if (p >= 1) { css(e, 'opacity', '1'); css(e, 'transform', 'none'); return; }
    css(e, 'opacity', p.toFixed(3));
    css(e, 'transform', 'translate3d(0,' + ((1 - p) * (dy || 8)).toFixed(2) + 'px,0)');
  }
  // the person's tap: a dot and a ring inside the button it lands on
  function tapMark(parent) {
    var t = el('i', 'sgs-tap', parent);
    return { dot: el('i', 'sgs-tap-dot', t), ring: el('i', 'sgs-tap-ring', t) };
  }
  function drawTap(o, x) {   // x: seconds since the tap, or < 0 / > 1 for none
    var on = x >= -0.25 && x < 0.9, d = on ? (x < 0 ? 1 + x * 4 : 1 - c01((x - 0.35) / 0.5)) : 0;
    css(o.dot, 'opacity', d.toFixed(2));
    var r = x >= 0 && x < 0.7 ? ease.out(x / 0.7) : 0;
    css(o.ring, 'opacity', r > 0 ? (0.7 * (1 - r)).toFixed(2) : '0');
    css(o.ring, 'transform', 'scale(' + (0.6 + 1.6 * r).toFixed(3) + ')');
  }

  /* =====================================================================
     INBOX — 统一询盘入口. A message arrives every P seconds at the top of one
     list; it is read (language · intent · product), sorted, and handed on.
     Message i always lives in row i: the rows only move.
     ===================================================================== */
  function InboxScene() {
    var P = 3;
    var CLS = { 'new': T('新询盘', 'New inquiry'), hist: T('历史消息', 'History'), spam: T('垃圾信息', 'Spam') }, CLS_S = { 'new': T('新询盘', 'New'), hist: T('历史', 'History'), spam: T('垃圾', 'Spam') };
    var MSG = [
      { ch: 'mail', who: 'Müller Energie GmbH', text: '200 pcs 48V 100Ah, DAP Hamburg?', tags: [T('英语', 'EN'), T('询价', 'RFQ'), '48V 100Ah'], c: 'new', to: T('欧洲组', 'EU team') },
      { ch: 'chat', who: 'Ahmed Al-Rashid', text: 'Price for the 72V lithium pack? 50 units.', tags: [T('英语', 'EN'), T('询价', 'RFQ'), T('72V 锂电', '72V pack')], c: 'new', to: T('中东组', 'ME team') },
      { ch: 'store', who: 'Silva Mobilidade', text: 'Vocês fazem OEM? Qual o MOQ? 60V/72V', tags: [T('葡语', 'PT'), 'OEM', '60V/72V'], c: 'new', to: T('美洲组', 'Americas') },
      { ch: 'mail', who: 'PT Surya Energi', text: 'Re: Barang sudah tiba di Jakarta', tags: [T('印尼语', 'ID'), T('回复', 'Reply')], c: 'hist', to: T('并入客户记录', 'Filed to account') },
      { ch: 'form', who: 'pay-verify@mail.xyz', text: 'Urgent: verify your payment account', tags: [T('英语', 'EN'), T('钓鱼链接', 'Phishing')], c: 'spam', to: T('已拦截', 'Blocked') }
    ];
    var N = MSG.length;
    var READ = 0.5, CHIP = [0.75, 0.95, 1.15], SORT = 1.5, HAND = 1.85;
    var BASE = { all: 36, 'new': 7, hist: 26, spam: 3 }, cnt = { all: 0, 'new': 0, hist: 0, spam: 0 };
    var layouts = {}, R, ROW, FADE;

    function pick(w, h) {
      var W = clamp(even(w), 260, 440), H = clamp(even(W * h / w), 168, 340);
      return lay(layouts, H < 215 ? 'short' : 'tall', W, H);
    }
    function build(stage, L) {
      R = { rows: [] };
      stage.className = 'sg-mo-stage sgs sgs-inbox is-' + L.kind + (L.w < 300 ? ' is-slim' : '');
      bar(stage, 'Sales Desk', T('收件箱', 'Inbox'), TAG_MINI);
      var tabs = el('div', 'sgs-tabs', stage);
      R.tabs = [['all', T('全部', 'All')], ['new', T('新询盘', 'New')], ['hist', T('历史', 'History')], ['spam', T('垃圾', 'Spam')]].map(function (d) {
        var tb = el('span', 'sgs-tab is-' + d[0], tabs);
        el('span', '', tb, d[1]);
        return { e: tb, n: el('b', '', tb, ''), k: d[0] };
      });
      var list = el('div', 'sgs-list', stage);
      ROW = L.kind === 'short' ? 52 : 58;
      var listH = L.h - (L.kind === 'short' ? 30 + 26 : 34 + 30);
      FADE = listH / ROW - 1;
      MSG.forEach(function (m) {
        var r = el('div', 'sgs-msg is-' + m.c, list);
        r.style.height = ROW + 'px';
        var ic = el('span', 'sgs-ch is-' + m.ch, r); glyph(m.ch, ic, L.kind === 'short' ? 14 : 15);
        var body = el('div', 'sgs-msg-b', r);
        var l1 = el('div', 'sgs-msg-1', body);
        el('b', '', l1, m.who);
        var pill = el('span', 'sgs-pill is-' + m.c, l1, (L.w < 300 ? CLS_S : CLS)[m.c]);
        el('div', 'sgs-msg-2', body, m.text);
        var l3 = el('div', 'sgs-msg-3', body);
        var chips = m.tags.map(function (tg) { return el('span', 'sgs-chip', l3, tg); });
        var to = el('span', 'sgs-to', l3);
        glyph(m.c === 'spam' ? 'shield' : 'arrow', to, 12); el('span', '', to, m.to);
        var scan = el('i', 'sgs-scan', r);
        R.rows.push({ r: r, pill: pill, chips: chips, to: to, scan: scan });
      });
    }
    // how many times message i has been sorted by time t (its first pass at i * P, then every N * P)
    function passes(i, t, off) { var x = t - off - i * P; return x < 0 ? 0 : Math.floor(x / (N * P)) + 1; }
    function tick(t) {
      var k = Math.floor(t / P), e = ease.out(c01((t - k * P) / 0.6)), hit = '';
      cnt.all = BASE.all; cnt['new'] = BASE['new']; cnt.hist = BASE.hist; cnt.spam = BASE.spam;
      for (var i = 0; i < N; i++) {
        var o = R.rows[i], m = MSG[i];
        var j = k - mod(k - i, N), tau = t - j * P, p = (k - j) - 1 + e;
        css(o.r, 'transform', 'translate3d(0,' + (p * ROW).toFixed(1) + 'px,0)');
        var op = p < 0 ? 1 + p : 1 - c01((p - FADE) / 0.7);
        css(o.r, 'opacity', op.toFixed(3));
        cl(o.r, 'is-fresh', tau < SORT + 0.9);
        cl(o.r, 'is-done', tau >= HAND + 0.2 && m.c === 'spam');
        for (var c = 0; c < o.chips.length; c++) cl(o.chips[c], 'is-in', tau >= CHIP[c]);
        cl(o.pill, 'is-in', tau >= SORT);
        cl(o.to, 'is-in', tau >= HAND);
        var sc = seg(tau, READ, SORT);
        css(o.scan, 'opacity', sc > 0 && sc < 1 ? '1' : '0');
        css(o.scan, 'transform', 'scaleX(' + sc.toFixed(3) + ')');
        cnt.all += passes(i, t, 0);
        cnt[m.c] += passes(i, t, SORT);
        if (tau >= SORT && tau < SORT + 1.2 && j === k) hit = m.c;
      }
      for (var b = 0; b < R.tabs.length; b++) {
        var tb = R.tabs[b];
        put(tb.n, 'text', String(cnt[tb.k]));
        cl(tb.e, 'is-hit', tb.k === hit || (tb.k === 'all' && t - k * P < 0.9));
      }
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 2 * P + 2.4 };
  }

  /* =====================================================================
     ACCOUNT — 客户全景. Müller Energie's record fills in, piece by piece,
     from where each fact lives, and ends on a next step that waits for you.
     ===================================================================== */
  function AccountScene() {
    var P = 15, OUT0 = 13.9, OUT1 = 14.6;
    var STAGES = [T('线索', 'Lead'), T('询价', 'RFQ'), T('样品', 'Sample'), T('报价', 'Quote'), T('成交', 'Order')], CUR = 3;
    var TILES = [
      { g: 'user', k: T('联系人', 'Contacts'), rows: [['Jonas Müller', T('决策者', 'Decider')], ['Lena Vogt', T('影响者', 'Influencer')]] },
      { g: 'box', k: T('订单与样品', 'Orders & samples'), rows: [[T('试单 50 组', 'Trial, 50'), T('已交付', 'Delivered')], [T('样品 2 组', '2 samples'), T('已签收', 'Received')]] },
      { g: 'price', k: T('报价', 'Quotes'), rows: [['Q-1042 · v3', T('待审批', 'Pending'), 'is-warn'], ['Q-1031', T('已接受', 'Accepted')]] },
      { g: 'doc', k: T('文件', 'Documents'), rows: [['CE · UN38.3', T('已发', 'Sent')], ['MSDS', T('待发', 'To send')]] }
    ];
    var LOG = [['mail', T('3 天前 · 邮件', '3 days ago · email'), T('规格书已发，未回复', 'Spec sheet sent, no reply')],
      ['chat', T('8 天前 · WhatsApp', '8 days ago · WhatsApp'), T('确认 DAP 汉堡', 'DAP Hamburg agreed')]];
    var AT = { head: 0.25, stage: 0.7, tile: [1.5, 1.85, 2.2, 2.55], log: [3.0, 3.3], next: 3.85 };
    var layouts = {}, R, kind;

    function pick(w, h) {
      // the stage keeps its slot's shape. Two tiles side by side need 328 (square) or 340 (card); the
      // 223 × 244 slot of 992–1279 gets the tiles as a list, one line each
      var r = h / w, W, H;
      if (w < 300) return lay(layouts, 'list', 264, clamp(even(264 * r), 210, 340));
      if (r > 0.9) { W = clamp(even(w), 328, 440); return lay(layouts, 'square', W, clamp(even(W * r), 300, 480)); }
      W = clamp(even(w), 296, 440); H = clamp(even(W * r), 190, 440);
      if (H >= 226 && W < 340) { W = 340; H = clamp(even(W * r), 226, 440); }
      return lay(layouts, H < 226 ? 'short' : 'card', W, H);
    }
    function build(stage, L) {
      kind = L.kind; R = {};
      stage.className = 'sg-mo-stage sgs sgs-acct is-' + kind + (kind === 'list' && L.h < 260 ? ' is-lo' : '');
      var pane = R.pane = el('div', 'sgs-acct-pane', stage);
      var hd = R.head = el('div', 'sgs-acct-h', pane);
      el('span', 'sgs-av', hd, 'ME');
      var ht = el('div', 'sgs-acct-ht', hd);
      el('b', '', ht, 'Müller Energie GmbH');
      el('span', '', ht, kind === 'list' ? T('德国 汉堡', 'Hamburg, DE') : T('德国 汉堡 · 储能经销商', 'Hamburg, DE · storage dealer'));
      el('span', 'sgs-tagline', hd, TAG_MINI);
      var st = R.stage = el('div', 'sgs-stages', pane);
      R.dots = STAGES.map(function (s, i) {
        var d = el('span', 'sgs-st' + (i === CUR ? ' is-cur' : ''), st);
        el('i', '', d);
        if (kind !== 'short' || i === CUR) el('span', '', d, s);
        return d;
      });
      R.fill = el('i', 'sgs-st-fill', st);
      var grid = el('div', 'sgs-tiles', pane);
      R.tiles = TILES.map(function (tl, i) {
        var c = el('div', 'sgs-tile' + (i === 3 ? ' is-4th' : ''), grid);
        var k = el('div', 'sgs-tile-k', c); glyph(tl.g, k, 12); el('span', '', k, tl.k);
        tl.rows.slice(0, kind === 'short' || kind === 'list' ? 1 : 2).forEach(function (r) {
          var row = el('div', 'sgs-tile-r' + (r[2] ? ' ' + r[2] : ''), c);
          el('b', '', row, r[0]); el('span', '', row, r[1]);
        });
        return c;
      });
      if (kind === 'square') {
        var lg = el('div', 'sgs-log', pane);
        R.log = LOG.map(function (l) {
          var r = el('div', 'sgs-log-r', lg);
          var ic = el('span', 'sgs-ch is-' + l[0], r); glyph(l[0], ic, 12);
          el('b', '', r, l[1]); el('span', '', r, l[2]);
          return r;
        });
      }
      var nx = R.next = el('div', 'sgs-next', pane);
      glyph('clock', nx, 13);
      el('span', 'sgs-next-t', nx, kind === 'list' ? T('跟进信已起草', 'Follow-up drafted') : kind === 'square' ? T('下一步：跟进信已起草', 'Next: follow-up drafted') : T('3 天未回复 · 跟进信已起草', '3 days, no reply · draft ready'));
      el('span', 'sgs-pill is-wait', nx, T('等你确认', 'Needs your OK'));
    }
    function tick(t) {
      var tau = mod(t, P);
      css(R.pane, 'opacity', tau < OUT0 ? '1' : (1 - seg(tau, OUT0, OUT1)).toFixed(3));
      arrive(R.head, ease.out(seg(tau, AT.head, AT.head + 0.5)));
      arrive(R.stage, ease.out(seg(tau, AT.stage - 0.2, AT.stage + 0.3)), 4);
      var sp = ease.io(seg(tau, AT.stage, AT.stage + 0.9));
      css(R.fill, 'transform', 'scaleX(' + (sp * CUR / (STAGES.length - 1)).toFixed(4) + ')');
      var i;
      for (i = 0; i < R.dots.length; i++) cl(R.dots[i], 'is-on', sp * CUR >= i - 0.02);
      for (i = 0; i < R.tiles.length; i++) {
        var c = R.tiles[i], p = ease.out(seg(tau, AT.tile[i], AT.tile[i] + 0.55));
        css(c, 'opacity', p.toFixed(3));
        css(c, 'transform', p >= 1 ? 'none' : 'translate3d(' + ((1 - p) * (i % 2 ? 10 : -10)).toFixed(2) + 'px,' + ((1 - p) * 6).toFixed(2) + 'px,0) scale(' + (0.97 + 0.03 * p).toFixed(4) + ')');
        cl(c, 'is-new', tau >= AT.tile[i] && tau < AT.tile[i] + 1.3);
      }
      if (R.log) for (i = 0; i < R.log.length; i++) arrive(R.log[i], ease.out(seg(tau, AT.log[i], AT.log[i] + 0.5)), 6);
      arrive(R.next, ease.out(seg(tau, AT.next, AT.next + 0.5)), 6);
      cl(R.next, 'is-on', tau >= AT.next + 0.4);
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 9 };
  }

  /* =====================================================================
     QUOTE — 报价有依据，利润有边界，文件有版本. Q-1042 for Müller Energie:
     drafted from the price list and the rules, stopped by the margin guard,
     approved by a person, kept as v3 beside v1 and v2.
     ===================================================================== */
  function QuoteScene() {
    var P = 16, OUT0 = 14.9, OUT1 = 15.6;
    var LINES = [
      ['48V 100Ah', '× 200', '€79,000', T('价格表', 'Price list')],
      [T('出口木箱', 'Crating'), '× 200', '€1,200', T('包装规则', 'Rule')],
      [T('DAP 汉堡', 'DAP Hamburg'), '× 1', '€2,350', T('货代报价', 'Freight')]
    ];
    var TOTAL = 82550, MARGIN = 15.2, FLOOR = 18, SCALE = 30;   // the meter runs 0–30 %
    var AT = { line: [0.4, 0.95, 1.5], total: 2.05, meter: 2.6, flag: 3.55, ask: 3.9, tap: 6.2, ok: 6.35, v3: 7.0 };
    var VERS = [['v3', T('正式版 · 已批准', 'Formal · approved')], ['v2', T('客户目标价', 'Buyer target')], ['v1', T('按价格表', 'From price list')]];
    var layouts = {}, R, kind;
    var STATUS = [T('起草中', 'Drafting'), T('等你审批', 'Needs approval'), T('已批准', 'Approved'), T('v3 正式版', 'v3 is formal')];

    function pick(w, h) {
      var r = h / w, W;
      // one column (approval, then versions, under the guard) for a portrait slot, and for a narrow one
      // tall enough to hold it; it needs 424 of height
      if (r > 1.2 || (w < 400 && w * r >= 400)) { W = Math.max(clamp(even(w), 240, 400), even(424 / r) + 2); return lay(layouts, 'tall', W, clamp(even(W * r), 424, 640)); }
      W = clamp(even(w), 300, 520);
      if (W >= 400 && W < 440) W = 440;
      var H = clamp(even(W * r), 200, W < 400 ? 420 : 480);
      return lay(layouts, W < 400 ? 'narrow' : 'card', W, H);
    }
    function build(stage, L) {
      kind = L.kind; R = {};
      stage.className = 'sg-mo-stage sgs sgs-quote is-' + kind + (kind === 'tall' && L.w < 330 ? ' is-thin' : '');
      if (kind !== 'tall') stage.style.setProperty('--sgs-room', clamp((L.h - L.w * 0.667) / 100, 0, 1.6).toFixed(3));
      var right = bar(stage, T('报价', 'Quote') + ' Q-1042', null, kind === 'card' ? TAG_FULL : TAG_MINI);
      R.pane = el('div', 'sgs-q-pane', stage);
      var sheet = el('div', 'sgs-sheet', R.pane), sk = null;
      if (kind !== 'narrow' || L.h >= 232) {
        sk = el('div', 'sgs-sheet-k', sheet);
        el('span', '', sk, kind === 'tall' ? 'Müller Energie GmbH' : 'Müller Energie GmbH · DAP Hamburg');
      }
      R.status = el('span', 'sgs-status', kind === 'tall' ? sk : right);
      R.lines = LINES.map(function (l) {
        var r = el('div', 'sgs-line', sheet);
        var a = el('span', 'sgs-line-a', r); el('b', '', a, l[0]); el('em', '', a, l[1]);
        el('span', 'sgs-src', r, l[3]);
        el('span', 'sgs-amt', r, l[2]);
        return r;
      });
      var tot = R.total = el('div', 'sgs-total', sheet);
      el('span', '', tot, T('合计 · EUR', 'Total · EUR'));
      R.totalV = el('b', '', tot, '€0');
      var guard = R.guard = el('div', 'sgs-guard', R.pane);
      var gh = el('div', 'sgs-guard-h', guard);
      el('span', '', gh, T('毛利', 'Margin'));
      R.marginV = el('b', '', gh, '0.0%');
      R.flag = el('span', 'sgs-flag', gh);
      glyph('alert', R.flag, 12, 'sg-ico sgs-fi-low'); glyph('check', R.flag, 12, 'sg-ico sgs-fi-ok'); R.flagT = el('span', '', R.flag, '');
      var meter = el('div', 'sgs-meter', guard);
      R.bar = el('i', 'sgs-meter-f', meter);
      var fl = el('span', 'sgs-floor', meter); fl.style.left = (FLOOR / SCALE * 100) + '%';
      el('em', '', fl, T('底线 ', 'Floor ') + FLOOR + '%');
      if (kind !== 'narrow') {
        var pi = R.pi = el('div', 'sgs-pi', R.pane);
        glyph('doc', pi, 13);
        el('span', '', pi, T('v3 可转 PI · 发送前由你确认', 'v3 → PI · sent after your OK'));
      }
      var ap = R.ask = el('div', 'sgs-ask', R.pane);
      var at = el('div', 'sgs-ask-t', ap);
      el('b', '', at, kind === 'narrow' ? T('销售总监审批', 'Sales director') : T('审批人：销售总监', 'Approver: sales director'));
      R.askS = el('span', '', at, '');
      if (kind !== 'narrow') el('em', '', at, T('AI 起草 · 10:38 提交', 'Drafted by AI · sent 10:38'));
      var btns = el('div', 'sgs-ask-b', ap);
      R.ok = el('span', 'sg-btn is-primary sgs-btn', btns);
      R.okT = el('span', '', R.ok, T('批准', 'Approve'));
      el('span', 'sg-btn sgs-btn', btns, T('退回', 'Return'));
      R.tap = tapMark(R.ok);
      var vs = R.vers = el('div', 'sgs-vers', R.pane);
      el('div', 'sgs-vers-k', vs, T('版本 · 每版留底', 'Versions · all kept'));
      R.v = VERS.map(function (v, i) {
        var r = el('div', 'sgs-ver' + (i === 0 ? ' is-top' : ''), vs);
        el('b', '', r, v[0]);
        el('span', '', r, v[1]);
        if (i === 0) glyph('lock', r, 12, 'sg-ico sgs-lock');
        return r;
      });
    }
    function tick(t) {
      var tau = mod(t, P);
      css(R.pane, 'opacity', tau < OUT0 ? '1' : (1 - seg(tau, OUT0, OUT1)).toFixed(3));
      for (var i = 0; i < R.lines.length; i++) { arrive(R.lines[i], ease.out(seg(tau, AT.line[i], AT.line[i] + 0.45)), 6); cl(R.lines[i], 'is-src', tau >= AT.line[i] && tau < AT.line[i] + 1.1); }
      var tp = ease.out(seg(tau, AT.total - 0.3, AT.total + 0.5));
      put(R.totalV, 'text', '€' + K.fmt(TOTAL * tp));
      var mp = ease.io(seg(tau, AT.meter, AT.meter + 0.9));
      css(R.bar, 'transform', 'scaleX(' + (mp * MARGIN / SCALE).toFixed(4) + ')');
      put(R.marginV, 'text', (MARGIN * mp).toFixed(1) + '%');
      var low = tau >= AT.flag, okd = tau >= AT.ok;
      cl(R.guard, 'is-low', low && !okd);
      cl(R.guard, 'is-ok', okd);
      arrive(R.flag, ease.out(seg(tau, AT.flag, AT.flag + 0.35)), 3);
      put(R.flagT, 'text', okd ? T('低于底线 · 已批准', 'Approved') : T('低于底线 · 需审批', 'Below floor'));
      // the approver's card: waiting (breathing ring, written per frame), then the tap, then approved
      var askP = ease.out(seg(tau, AT.ask, AT.ask + 0.45));
      if (kind !== 'card') {
        // one place for both: the approval, then the versions that replace it. On a phone it drops in over
        // the lines like a notification, so the margin guard that stopped the quote stays in view under it.
        var vin = ease.out(seg(tau, AT.v3 - 0.1, AT.v3 + 0.4)), dy = kind === 'narrow' ? -30 : 8;
        arrive(R.ask, askP * (1 - vin), dy);
        css(R.ask, 'visibility', vin >= 1 ? 'hidden' : 'visible');
        arrive(R.vers, vin, dy);
      } else {
        arrive(R.ask, askP, 6);
        arrive(R.vers, ease.out(seg(tau, AT.v3 - 0.35, AT.v3 + 0.2)), 6);
      }
      var wait = tau >= AT.ask && tau < AT.ok;
      cl(R.ask, 'is-wait', wait);
      cl(R.ask, 'is-ok', okd);
      css(R.ask, '--sgs-breathe', wait ? (0.5 + 0.5 * Math.sin((tau - AT.ask) * 4.2)).toFixed(3) : '0');
      cl(R.ok, 'is-press', tau >= AT.tap - 0.05 && tau < AT.tap + 0.22);
      cl(R.ok, 'is-done', okd);
      put(R.okT, 'text', okd ? T('已批准', 'Approved') : T('批准', 'Approve'));
      put(R.askS, 'text', okd ? (kind === 'narrow' ? T('仅限本单', 'This order only') : T('仅限本单 · 10:42', 'This order only · 10:42')) : T(kind === 'narrow' ? '低于底线 2.8 个点' : 'Q-1042 低于底线 2.8 个点', '2.8 pts under floor'));
      drawTap(R.tap, tau - AT.tap);
      arrive(R.v[0], ease.out(seg(tau, AT.v3, AT.v3 + 0.5)), -8);   // v1 and v2 were there all along
      cl(R.v[0], 'is-on', tau >= AT.v3 + 0.35);
      if (R.pi) arrive(R.pi, ease.out(seg(tau, AT.v3 + 0.7, AT.v3 + 1.2)), 5);
      put(R.status, 'text', STATUS[tau < AT.flag ? 0 : !okd ? 1 : tau < AT.v3 + 0.35 ? 2 : 3]);
      cl(R.status, 'is-wait', tau >= AT.flag && !okd);
      cl(R.status, 'is-ok', okd);
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 10 };
  }

  return { inbox: InboxScene, account: AccountScene, quote: QuoteScene };
});
