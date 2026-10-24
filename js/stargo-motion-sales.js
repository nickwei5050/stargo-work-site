/* SALES — the capability page's two Sales Desk pictures, drawn in code where the owner's AI
   photographs were (2026-10-23, 「图片改成代码」); the quote band's scene is js/stargo-motion-quote.js.

     inbox    「统一询盘入口」 (Sales Desk row 01; c05-unified-inbox): messages from email, WhatsApp,
              阿里国际站 and the website form land in one list. Each is read (its preview rolls up into
              language · intent · product), sorted into 新询盘 / 历史消息 / 垃圾 and handed to a team.
     account  「客户全景」 (Sales Desk row 03; c06-customer-360): Müller Energie's record assembles itself
              (contacts and their roles, the stage, needs and samples, quotes, documents, the last
              conversations), then keeps moving: Q-1042 is approved, the MSDS is attached, and the
              follow-up that carries both waits for a person.

   Both are Sales Desk screens with the same app bar. Each lives on window.STARGO_SCENES and is run by
   js/stargo-motion.js: tick(t) is a pure function of time, `still` the reduced-motion frame. A layout is
   the host's own size (scale 1, so no text is under 12 CSS px on a phone or a tablet); the pieces sit in
   CSS flex and grid (css/stargo-motion-sales.css), and a frame writes only transforms, opacity, classes
   and changed text through put(). Every name and number is demo data from the site's one demo cast,
   and each picture says so on itself. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  var GLYPH = {
    mail: K.ICON.mail, chat: K.ICON.chat, store: K.ICON.store, form: K.ICON.form, shield: K.ICON.shield,
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
    box: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    price: 'M4 12.5V5h7.5L20 13.5 13.5 20zM8 8.5h.01',
    clock: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 8v4.2l2.8 1.8',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  // the stage takes the host's own pixels (clientWidth/Height are whole numbers), so it is drawn at scale 1
  function fitWH(w, h, w0, w1, h0, h1) { var W = clamp(Math.floor(w), w0, w1); return [W, clamp(Math.floor(W * h / w), h0, h1)]; }
  function lay(layouts, kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
  var TAG_MINI = T('演示数据', 'Demo data');
  // the app bar of every Sales Desk screen: mark, product, place, and what the picture is
  function bar(stage, crumb) {
    var b = el('div', 'sgs-bar', stage);
    var mk = el('span', 'sg-app-mark', b); K.icon('spark', mk, 12);
    el('b', '', b, 'Sales Desk');
    if (crumb) el('span', 'sgs-crumb', b, crumb);
    el('span', 'sgs-tagline', b, TAG_MINI);
  }
  // a piece that arrives at a moment: opacity and a short rise, both on the compositor
  function arrive(e, p, dy) {
    if (p <= 0) { css(e, 'opacity', '0'); return; }
    if (p >= 1) { css(e, 'opacity', '1'); css(e, 'transform', 'none'); return; }
    css(e, 'opacity', p.toFixed(3));
    css(e, 'transform', 'translate3d(0,' + ((1 - p) * (dy || 8)).toFixed(2) + 'px,0)');
  }

  /* =====================================================================
     INBOX — 统一询盘入口. A message arrives every P seconds at the top of one
     list. Its preview is read (the orange line), then rolls up into its
     tags; it is sorted (pill, tab count) and handed to a team.
     Message i always lives in row i: the rows only move.
     ===================================================================== */
  function InboxScene() {
    var P = 3, LINE = 18;
    var CLS = { 'new': T('新询盘', 'New inquiry'), hist: T('历史消息', 'History'), spam: T('垃圾信息', 'Spam') }, CLS_S = { 'new': T('新询盘', 'New'), hist: T('历史', 'History'), spam: T('垃圾', 'Spam') };
    var MSG = [
      { ch: 'mail', who: 'Müller Energie GmbH', text: '200 pcs 48V 100Ah, DAP Hamburg?', tags: [T('英语', 'EN'), T('询价', 'RFQ'), '48V 100Ah'], c: 'new', to: T('欧洲组', 'EU team') },
      { ch: 'chat', who: 'Ahmed Al-Rashid', text: 'Price for the 72V lithium pack? 50 units.', tags: [T('英语', 'EN'), T('询价', 'RFQ'), T('72V 锂电', '72V pack')], c: 'new', to: T('中东组', 'ME team') },
      { ch: 'store', who: 'Silva Mobilidade', text: 'Vocês fazem OEM? Qual o MOQ? 60V/72V', tags: [T('葡语', 'PT'), 'OEM', '60V/72V'], c: 'new', to: T('美洲组', 'Americas team') },
      { ch: 'mail', who: 'PT Surya Energi', text: 'Re: Barang sudah tiba di Jakarta', tags: [T('印尼语', 'ID'), T('回复', 'Reply')], c: 'hist', to: T('并入客户记录', 'Filed to account') },
      // a phishing message sent through the website form, from a reserved (never real) domain
      { ch: 'form', who: 'billing@pay-verify.example', text: 'Urgent: verify your payment account', tags: [T('英语', 'EN'), T('钓鱼链接', 'Phishing')], c: 'spam', to: T('已拦截', 'Blocked') }
    ];
    var N = MSG.length;
    var READ = 0.3, ROLL = 1.45, CHIP = [1.65, 1.8, 1.95], SORT = 2.1, HAND = 2.35;
    var BASE = { all: 36, 'new': 7, hist: 26, spam: 3 }, cnt = { all: 0, 'new': 0, hist: 0, spam: 0 };
    var layouts = {}, R, ROW, FADE;

    function pick(w, h) {
      var s = fitWH(w, h, 200, 460, 168, 340);
      return lay(layouts, s[1] < 225 ? 'short' : 'tall', s[0], s[1]);
    }
    function build(stage, L) {
      R = { rows: [] };
      var short = L.kind === 'short', slim = L.w < 290;
      stage.className = 'sg-mo-stage sgs sgs-inbox is-' + L.kind + (slim ? ' is-slim' : '');
      bar(stage, L.w >= 300 ? T('收件箱', 'Inbox') : null);
      var tabs = el('div', 'sgs-tabs', stage);
      var TABS = [['all', T('全部', 'All')], ['new', T('新询盘', 'New')], ['hist', T('历史', 'History')], ['spam', T('垃圾', 'Spam')]];
      if (slim) TABS.splice(2, 1);   // a slim list keeps 全部 / 新询盘 / 垃圾
      R.tabs = TABS.map(function (d) {
        var tb = el('span', 'sgs-tab is-' + d[0], tabs);
        el('span', '', tb, d[1]);
        return { e: tb, n: el('b', '', tb, ''), k: d[0] };
      });
      var list = el('div', 'sgs-list', stage);
      // a row is as tall as its two lines and their padding (css .sgs-msg), plus its hairline
      ROW = short ? 54 : 59;
      FADE = (L.h - (short ? 56 : 62)) / ROW - 1;   // the list is under the bar and the tabs (30 + 26, 32 + 30)
      MSG.forEach(function (m) {
        var r = el('div', 'sgs-msg is-' + m.c, list);
        r.style.height = ROW + 'px';
        var ic = el('span', 'sgs-ch is-' + m.ch, r); glyph(m.ch, ic, short ? 14 : 15);
        var body = el('div', 'sgs-msg-b', r);
        var l1 = el('div', 'sgs-msg-1', body);
        el('b', '', l1, m.who);
        var pill = el('span', 'sgs-pill is-' + m.c, l1, (L.w < 320 ? CLS_S : CLS)[m.c]);
        // line two is a window on two lines: the preview, then (rolled up) the tags and the hand-off
        var roll = el('div', 'sgs-roll', el('div', 'sgs-msg-2', body));
        el('div', 'sgs-prev', roll, m.text);
        var l3 = el('div', 'sgs-msg-3', roll);
        var chips = m.tags.map(function (tg) { return el('span', 'sgs-chip', l3, tg); });
        var to = null;
        if (!slim) { to = el('span', 'sgs-to', l3); glyph(m.c === 'spam' ? 'shield' : 'arrow', to, 12); el('span', '', to, m.to); }
        var scan = el('i', 'sgs-scan', body);
        R.rows.push({ r: r, pill: pill, roll: roll, chips: chips, to: to, scan: scan });
      });
      // a row cut by the list's bottom edge fades out under a still veil, so it reads as 'more below'
      var listH = L.h - (short ? 56 : 62), rest = listH - Math.floor(listH / ROW) * ROW;
      if (rest > 12) el('i', 'sgs-list-fade', list).style.height = (rest + 6) + 'px';
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
        cl(o.r, 'is-fresh', tau < SORT + 0.7);
        cl(o.r, 'is-done', tau >= HAND + 0.2 && m.c === 'spam');
        var rp = ease.io(seg(tau, ROLL, ROLL + 0.4));
        css(o.roll, 'transform', rp > 0 ? 'translate3d(0,' + (-LINE * rp).toFixed(2) + 'px,0)' : 'none');
        for (var c = 0; c < o.chips.length; c++) cl(o.chips[c], 'is-in', tau >= CHIP[c]);
        cl(o.pill, 'is-in', tau >= SORT);
        if (o.to) cl(o.to, 'is-in', tau >= HAND);
        var sc = seg(tau, READ, ROLL);
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
    // the still: Silva's message being read on top, Ahmed's and Müller's tagged and handed on below
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 2 * P + 1.1 };
  }

  /* =====================================================================
     ACCOUNT — 客户全景. Müller Energie's record fills in, piece by piece, then
     moves on: Q-1042 is approved, the MSDS is attached, and the follow-up that
     carries both waits for a person. Nothing is sent by the scene.
     ===================================================================== */
  function AccountScene() {
    var P = 12, OUT0 = 10.9, OUT1 = 11.6;
    var STAGES = [T('线索', 'Lead'), T('询价', 'RFQ'), T('样品', 'Sample'), T('报价', 'Quote'), T('成交', 'Order')], CUR = 3;
    // [label, value, class while pending, value once it moves on, the moment it moves (AT)]
    var TILES = [
      { g: 'user', k: T('联系人', 'Contacts'), rows: [['Jonas Müller', T('决策者', 'Decider')], ['Lena Vogt', T('影响者', 'Influencer')]] },
      { g: 'box', k: T('需求与样品', 'Needs & samples'), opt: 1, rows: [['48V 100Ah', '× 200'], [T('样品 2 组', '2 samples'), T('已签收', 'Received')]] },
      { g: 'price', k: T('报价', 'Quotes'), rows: [['Q-1042 · v3', T('待审批', 'Pending'), 'is-warn', T('已批准', 'Approved'), 'quote'], ['Q-1031', T('已接受', 'Accepted')]] },
      { g: 'doc', k: T('文件', 'Documents'), rows: [['MSDS', T('待发', 'To send'), 'is-warn', T('已附上', 'Attached'), 'doc'], ['CE · UN38.3', T('已发', 'Sent')]] }
    ];
    var LOG = [['mail', T('3 天前 · 邮件', '3 days ago · email'), T('规格书已发，未回复', 'Spec sheet sent, no reply')],
      ['chat', T('8 天前 · WhatsApp', '8 days ago · WhatsApp'), T('确认 DAP 汉堡', 'DAP Hamburg agreed')]];
    // the next step, before and after the quote and the MSDS are ready, per layout
    var NEXT = {
      card: [T('3 天未回复 · 跟进信已起草', '3 days, no reply · draft ready'), T('跟进信附上 v3 报价与 MSDS', 'Follow-up with v3 + MSDS')],
      square: [T('下一步：跟进信已起草', 'Next: follow-up drafted'), T('下一步：发出 v3 报价与 MSDS', 'Next: send v3 + MSDS')],
      list: [T('跟进信已起草', 'Draft ready'), T('附 v3 与 MSDS', 'v3 + MSDS')]
    };
    var AT = { head: 0.2, stage: 0.55, tile: [1.2, 1.5, 1.8, 2.1], log: [2.5, 2.8], next: 3.2, quote: 5.0, doc: 6.1, follow: 7.1 };
    var layouts = {}, R, kind;

    function pick(w, h) {
      // two tiles side by side need 320; under that the tiles are a list, one line each
      var s = fitWH(w, h, 200, 460, 184, 460), r = h / w;
      return lay(layouts, s[0] < 320 ? 'list' : r > 0.9 ? 'square' : 'card', s[0], s[1]);
    }
    function build(stage, L) {
      kind = L.kind; R = { moved: [], beat: [] };
      var lo = kind === 'list' && L.h < 230;
      stage.className = 'sg-mo-stage sgs sgs-acct is-' + kind + (lo ? ' is-lo' : '');
      bar(stage, L.w >= 300 ? T('客户全景', 'Account') : null);
      var pane = R.pane = el('div', 'sgs-acct-pane', stage);
      var hd = R.head = el('div', 'sgs-acct-h', pane);
      el('span', 'sgs-av', hd, 'ME');
      var ht = el('div', 'sgs-acct-ht', hd);
      el('b', '', ht, 'Müller Energie GmbH');
      el('span', '', ht, kind === 'list' ? T('德国 汉堡', 'Hamburg, DE') : kind === 'card' ? T('德国 汉堡 · 储能经销商', 'DE · storage dealer') : T('德国 汉堡 · 储能经销商', 'Hamburg, DE · storage dealer'));
      // the stage: five labelled steps on a square card; a line of dots and the current step elsewhere
      R.stage = null;
      if (!lo) {
        var st = R.stage = el('div', 'sgs-stages' + (kind === 'square' ? '' : ' is-mini'), pane);
        var track = el('div', 'sgs-st-track', st);
        R.dots = STAGES.map(function (s, i) {
          var d = el('span', 'sgs-st' + (i === CUR ? ' is-cur' : ''), track);
          el('i', '', d);
          if (kind === 'square') el('span', '', d, s);
          return d;
        });
        R.fill = el('i', 'sgs-st-fill', track);
        if (kind !== 'square') el('span', 'sgs-st-now', st, T('商机阶段 · ', 'Stage · ') + STAGES[CUR]);
      }
      var grid = el('div', 'sgs-tiles', pane);
      R.tiles = TILES.map(function (tl, i) {
        var c = el('div', 'sgs-tile' + (tl.opt ? ' is-opt' : ''), grid);
        R.beat[i] = -1;
        var k = el('div', 'sgs-tile-k', c); glyph(tl.g, k, 12); el('span', '', k, tl.k);
        tl.rows.slice(0, kind === 'list' ? 1 : 2).forEach(function (r) {
          var row = el('div', 'sgs-tile-r' + (r[2] ? ' ' + r[2] : ''), c);
          el('b', '', row, r[0]);
          var v = el('span', '', row, r[1]);
          if (r[3]) { R.moved.push({ row: row, v: v, a: r[1], b: r[3], at: AT[r[4]] }); R.beat[i] = AT[r[4]]; }
        });
        return c;
      });
      R.log = null;
      if (kind === 'square') {
        var lg = el('div', 'sgs-log', pane);
        R.log = LOG.slice(0, L.h >= 350 ? 2 : 1).map(function (l) {
          var r = el('div', 'sgs-log-r', lg);
          var ic = el('span', 'sgs-ch is-' + l[0], r); glyph(l[0], ic, 12);
          el('b', '', r, l[1]); el('span', '', r, l[2]);
          return r;
        });
      }
      var nx = R.next = el('div', 'sgs-next', pane);
      glyph('clock', nx, 13);
      R.nextT = el('span', 'sgs-next-t', nx, '');
      R.nextW = NEXT[kind];
      el('span', 'sgs-pill is-wait', nx, kind === 'list' ? T('待确认', 'Your OK') : T('等你确认', 'Needs your OK'));
    }
    function tick(t) {
      var tau = mod(t, P), i;
      css(R.pane, 'opacity', tau < OUT0 ? '1' : (1 - seg(tau, OUT0, OUT1)).toFixed(3));
      arrive(R.head, ease.out(seg(tau, AT.head, AT.head + 0.5)));
      if (R.stage) {
        arrive(R.stage, ease.out(seg(tau, AT.stage - 0.2, AT.stage + 0.3)), 4);
        var sp = ease.io(seg(tau, AT.stage, AT.stage + 0.9));
        css(R.fill, 'transform', 'scaleX(' + (sp * CUR / (STAGES.length - 1)).toFixed(4) + ')');
        for (i = 0; i < R.dots.length; i++) cl(R.dots[i], 'is-on', sp * CUR >= i - 0.02);
      }
      for (i = 0; i < R.tiles.length; i++) {
        var c = R.tiles[i], p = ease.out(seg(tau, AT.tile[i], AT.tile[i] + 0.55));
        css(c, 'opacity', p.toFixed(3));
        css(c, 'transform', p >= 1 ? 'none' : 'translate3d(' + ((1 - p) * (i % 2 ? 10 : -10)).toFixed(2) + 'px,' + ((1 - p) * 6).toFixed(2) + 'px,0) scale(' + (0.97 + 0.03 * p).toFixed(4) + ')');
        var bt = R.beat[i];
        cl(c, 'is-new', (tau >= AT.tile[i] && tau < AT.tile[i] + 1.3) || (bt >= 0 && tau >= bt && tau < bt + 1.3));
      }
      // the second beat: the quote is approved, then the MSDS goes with the follow-up
      for (i = 0; i < R.moved.length; i++) {
        var mv = R.moved[i], done = tau >= mv.at;
        cl(mv.row, 'is-warn', !done);
        cl(mv.row, 'is-ok', done);
        textSwap(mv.v, done ? mv.b : mv.a);
      }
      if (R.log) for (i = 0; i < R.log.length; i++) arrive(R.log[i], ease.out(seg(tau, AT.log[i], AT.log[i] + 0.5)), 6);
      arrive(R.next, ease.out(seg(tau, AT.next, AT.next + 0.5)), 6);
      cl(R.next, 'is-on', (tau >= AT.next + 0.4 && tau < AT.next + 1.6) || tau >= AT.follow);
      textSwap(R.nextT, R.nextW[tau >= AT.follow ? 1 : 0]);
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 9 };
  }

  return { inbox: InboxScene, account: AccountScene };
});
