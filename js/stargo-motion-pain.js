/* Pain scenes — the four problem cards of 「工具很多，靠人连接」 on the homepage
   (tools/motion-scenes.mjs places the hosts, css/stargo-motion-pain.css styles
   them, js/stargo-motion.js runs them). The cards showed generated photographs
   until 2026-10-23, when the owner chose to have them drawn in code instead
   (「换这两处,其余照片保留」). Each is a short "before" story, drawn muted, that
   ends on a "fix" beat in the brand orange:

     pain-inquiry  01 询盘来了，还要重新整理   a spec is retyped into a sheet
     pain-chats    02 窗口很多，客户信息分散   one buyer, four windows
     pain-sheet    03 客户在表格，跟进靠人记   follow-ups age in a spreadsheet
     pain-order    04 订单在后台，销售还在追问 sales keep asking where an order is

   The card's glass title sits over the middle of every scene, so the stories
   play in the bands above and below it (CALM) and the middle stays dim and
   still. Every fix stops at a human gate (待你确认): nothing is sent for you.
   All names, numbers and dates are demo data, and the scenes say so. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  /* ---------- stage ---------- */
  // Measured card boxes: 1029×720 at 1440, 914×576 at 1280 (975×614 at 1366), 1042×864 at 1920,
  // 729×614 at 1024, 502×614 at 768 (portrait) and 374×242 / 346×242 on phones.
  // Each layout scales to about 1 in its own range, so phone text stays at its
  // design size (12px and up).
  var LAYOUTS = { wide: { w: 1040, h: 720 }, low: { w: 960, h: 600 }, square: { w: 760, h: 640 }, tall: { w: 520, h: 620 }, phone: { w: 344, h: 240 } };
  // the band the glass title covers, in stage px, with a margin (one- and two-line titles)
  var CALM = { wide: [262, 458], low: [212, 388], square: [246, 394], tall: [196, 424], phone: [62, 178] };
  function pick(w, h) {
    if (w < 420 || h < 330) return 'phone';
    var r = w / h;
    if (r < 1) return 'tall';
    if (r < 1.32 && w < 900) return 'square';
    // short landscape cards (1280×720 and 1366×768 laptops) get a lower stage, so the type is not scaled down
    return h < 660 ? 'low' : 'wide';
  }

  /* ---------- kit ---------- */
  var D = {
    sheet: 'M4.5 5.5h15v13h-15zM4.5 10h15M4.5 14.5h15M10 5.5v13',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4',
    clip: 'M16 8.5 9.6 14.9a1.8 1.8 0 0 0 2.5 2.5l6.9-6.9a3.6 3.6 0 0 0-5.1-5.1l-7 7a5.4 5.4 0 0 0 7.6 7.6l5.5-5.5',
    lock: 'M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11M6 11h12v9H6z',
    tick: 'M5 12.5l4.5 4.5L19 7.5',
    box: 'M4.5 8 12 4l7.5 4v8L12 20l-7.5-4zM4.5 8 12 12l7.5-4M12 12v8'
  };
  function ico(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: D[name] || K.ICON[name], stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function box(e, r) {
    e.style.cssText = 'left:' + r[0] + 'px;top:' + r[1] + 'px;width:' + r[2] + 'px' + (r[3] != null ? ';height:' + r[3] + 'px' : '');
    return e;
  }
  function op(e, a) { put(e, '-opacity', a <= 0 ? '0' : a >= 1 ? '1' : a.toFixed(3)); }
  // fade in while rising dy px into place
  function lift(e, a, dy) { op(e, a); put(e, '-transform', a >= 1 ? 'none' : 'translateY(' + ((1 - a) * dy).toFixed(1) + 'px)'); }
  // every prefix of s, so typing allocates nothing per frame
  function pre(s) { var a = Array.from(s), out = ['']; for (var i = 1; i <= a.length; i++) out.push(a.slice(0, i).join('')); return out; }
  function typ(p, x) { return p[Math.round((p.length - 1) * c01(x))]; }
  // a window: traffic-light dots, an app icon, a title and a meta slot on the right
  function win(parent, r, icn, title, meta) {
    var w = box(el('div', 'sg-pn-pw', parent), r);
    var bar = el('div', 'sg-pn-pw-bar', w);
    var dots = el('span', 'sg-pn-pw-dots', bar); el('i', '', dots); el('i', '', dots); el('i', '', dots);
    ico(icn, bar, 15);
    el('b', '', bar, title);
    var o = { w: w, bar: bar, body: el('div', 'sg-pn-pw-body', w) };
    if (meta != null) o.meta = el('span', 'sg-pn-pw-meta', bar, meta);
    return o;
  }
  // the problem's own count, in muted amber: 重新录入 ×3, 追问 ×3 …
  function metric(parent, label) {
    var m = el('span', 'sg-pain-metric', parent);
    el('i', '', m);
    var t = el('span', '', m, label);
    var n = el('b', '', m);
    return { m: m, t: t, n: n };
  }
  function mark(parent) { var m = el('span', 'sg-app-mark', parent); K.icon('spark', m, 14); return m; }
  // 待你确认: the fix waits for a person
  function okPill(parent) { var p = el('span', 'sg-pain-ok', parent); el('i', '', p); el('span', '', p, T('待你确认', 'Awaiting your OK')); return p; }

  // phone: centre the top row between the tag and the title, and the bottom row between the title and the card's foot
  function place(R) {
    var yT = 34, yB = 182;
    if (R.title) {
      var sr = R.stage.getBoundingClientRect(), tr = R.title.getBoundingClientRect(), k = sr.height / R.h;
      if (k > 0 && tr.height > 0) {
        var tt = (tr.top - sr.top) / k, tb = (tr.bottom - sr.top) / k;
        yT = Math.max(20, Math.min(tt - 3 - R.topH, (20 + tt - R.topH) / 2));
        yB = Math.min(Math.max((tb + R.h - R.botH) / 2, tb + 3), R.h - 2 - R.botH);
      }
    }
    put(R.top, '-transform', 'translateY(' + yT.toFixed(1) + 'px)');
    put(R.bot, '-transform', 'translateY(' + yB.toFixed(1) + 'px)');
  }

  /* One loop of P seconds per card. The problem plays first, the fix beat closes
     it, and the whole picture dips to the card's ground between loops. */
  function Scene(key, P, still, make) {
    var R, my;
    return {
      layouts: LAYOUTS,
      pick: pick,
      build: function (stage, L, name) {
        R = { name: name, phone: name === 'phone', w: L.w, h: L.h, calm: CALM[name], stage: stage };
        stage.className = 'sg-mo-stage sg-pain sg-pain-' + key + ' is-' + name;
        R.body = el('div', 'sg-pain-body', stage);
        var host = stage.parentNode, card = host && host.closest ? host.closest('.work-card') : null, nx = card && card.nextElementSibling;
        if (R.phone) {
          // on a phone the title can take one to three lines of a 242px card, so the row above it and
          // the row below it are placed in whatever room the title leaves (place())
          R.top = el('div', 'sg-pn-band', R.body);
          R.bot = el('div', 'sg-pn-band', R.body);
          R.topH = 32; R.botH = 48; R.placed = 0;
          R.title = card && card.querySelector('.work-title-main');
          place(R);
        }
        my = make(R);
        // the glass title's band: whatever passes under it is dimmed
        var hush = el('div', 'sg-pain-hush', stage);
        hush.style.cssText = 'top:' + R.calm[0] + 'px;height:' + (R.calm[1] - R.calm[0]) + 'px';
        var tag = el('div', 'sg-tag', stage, R.phone ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
        tag.style.left = (L.w - (R.phone ? 10 : 24)) + 'px';
        tag.style.top = (R.phone ? 19 : 36) + 'px';
        // on desktop the cards stack: a card the next one has slid over stops drawing until it shows again
        while (nx && !(nx.classList && nx.classList.contains('work-card'))) nx = nx.nextElementSibling;
        R.card = card; R.next = nx; R.checked = 0; R.under = false; R.drawn = false;
      },
      tick: function (t) {
        if (R.drawn && R.next && R.card) {
          var now = performance.now();
          if (now - R.checked > 300) { R.checked = now; R.under = R.next.getBoundingClientRect().top <= R.card.getBoundingClientRect().top + 2; }
          if (R.under) return;
        }
        R.drawn = true;
        if (R.phone) { var nw = performance.now(); if (nw - R.placed > 400) { R.placed = nw; place(R); } }
        var u = mod(t, P);
        op(R.body, Math.min(seg(u, 0, 0.4), 1 - seg(u, P - 0.55, P - 0.05)));
        my(u);
      },
      still: still,
      cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  /* =====================================================================
     01 询盘来了，还要重新整理 — an RFQ arrives with a PDF spec; model,
     quantity and delivery are typed into the inquiry log by hand, one field
     at a time (the quantity goes in wrong once). Fix: the same three fields
     read from the PDF as tags, waiting for a person to confirm.
     ===================================================================== */
  function Inquiry() {
    return Scene('inquiry', 10.8, 9.2, function (R) {
      var n = R.name, ph = R.phone, X = {};
      var F = [
        { k: 'Model', v: 'LFP-48100 · 48V 100Ah', cell: pre('48V 100Ah'), chip: '48V 100Ah', head: T('型号', 'Model') },
        { k: 'Quantity', v: '200 pcs', cell: pre('2000'), chip: T('200 组', '200 pcs'), head: T('数量', 'Qty') },
        { k: 'Delivery', v: 'DAP Hamburg', cell: pre(T('DAP 汉堡', 'DAP Hamburg')), chip: T('DAP 汉堡', 'DAP Hamburg'), head: T('交货', 'Delivery') }
      ];
      // per field: read in the spec, typing starts, typing ends, entered
      var TM = [[1.9, 2.15, 2.85, 2.95], [3.3, 3.5, 3.82, 4.45], [4.8, 5.0, 5.7, 5.85]];
      var FIX = 7.3;
      var OLD = [['Silva Mobilidade', '60V 30Ah', '500', T('FOB 深圳', 'FOB Shenzhen')], ['PT Surya Energi', '64V 104Ah', '120', T('CIF 雅加达', 'CIF Jakarta')]];

      if (ph) {
        // phone: the mail as one row above the title, the log's new row below it
        var mr = box(el('div', 'sg-pn-prow sg-pn-pmail', R.top), [8, 0, 328, R.topH]);
        X.msg = mr;
        var mi = el('span', 'sg-pn-prow-ico', mr); ico('mail', mi, 14);
        var mt = el('div', 'sg-pn-prow-main', mr);
        var l1 = el('div', 'sg-pn-prow-l1', mt); el('b', '', l1, 'Jonas Weber'); el('span', '', l1, ' · Müller Energie');
        var pa = el('span', 'sg-pn-patt', mr); ico('clip', pa, 12); el('span', '', pa, 'Spec.pdf');
        var sh = X.sheet = box(el('div', 'sg-pn-prow sg-pn-psheet', R.bot), [8, 0, 328, R.botH]);
        var h1 = el('div', 'sg-pn-psheet-h', sh);
        ico('sheet', h1, 13);
        X.label = el('span', 'sg-pn-psheet-name', h1, T('询盘登记表', 'Inquiry log'));
        X.metric = metric(h1, T('重新录入', 'Retyped'));
        X.ok = okPill(h1);
        var cells = el('div', 'sg-pn-psheet-cells', sh);
        X.cellBox = []; X.cells = []; X.chips = [];
        F.forEach(function (f, i) {
          var c = el('span', 'sg-pn-pcell sg-pn-pcell-' + i, cells);
          X.cellBox.push(c);
          X.cells.push(el('span', 'sg-pn-pcell-t', c));
          X.chips.push(el('span', 'sg-pn-pcell-chip', c, f.chip));
        });
        X.pf = [];
      } else {
        var G = {
          wide: { mail: [40, 52, 466, 196], pdf: [534, 52, 466, 196], sheet: [40, 474, 960, 214], col: [[22, 260], [300, 210], [526, 120], [664, 260]] },
          low: { mail: [32, 46, 436, 160], pdf: [492, 46, 436, 160], sheet: [32, 402, 896, 170], col: [[20, 250], [290, 200], [500, 110], [626, 250]] },
          square: { mail: [24, 52, 352, 186], pdf: [384, 52, 352, 186], sheet: [24, 408, 712, 214], col: [[16, 200], [226, 160], [398, 84], [494, 196]] },
          tall: { mail: [16, 40, 488, 82], pdf: [16, 128, 488, 70], sheet: [16, 438, 488, 156], col: [[14, 150], [170, 118], [296, 56], [362, 112]] }
        }[n];
        var tall = n === 'tall', low = n === 'low', nOld = tall || low ? 1 : 2;
        // the mail
        var m = win(R.body, G.mail, 'mail', T('邮件', 'Mail'), T('1 封未读', '1 unread'));
        X.meta = m.meta;
        var msg = X.msg = el('div', 'sg-pn-mail', m.body);
        if (!tall) el('span', 'sg-pn-mail-av', msg, 'JW');
        var mm = el('div', 'sg-pn-mail-main', msg);
        var from = el('div', 'sg-pn-mail-from', mm); el('b', '', from, 'Jonas Weber'); el('span', '', from, ' · Müller Energie GmbH');
        el('div', 'sg-pn-mail-sub', mm, 'RFQ: 48V 100Ah × 200 pcs, DAP Hamburg');
        if (!tall) {
          if (!low) el('div', 'sg-pn-mail-pre', mm, 'Please quote per the attached spec.');
          var at = el('span', 'sg-pn-att', mm); ico('doc', at, 14); el('b', '', at, 'Spec_48V100Ah.pdf'); el('span', '', at, T('2 页', '2 pages'));
        }
        el('span', 'sg-pn-mail-time', msg, '09:12');
        // the spec
        var p = win(R.body, G.pdf, 'doc', 'Spec_48V100Ah.pdf', '1 / 2');
        X.pdf = p.w;
        var doc = el('div', 'sg-pn-doc', p.body);
        if (!tall && !low) el('div', 'sg-pn-doc-h', doc, 'Technical specification');
        X.pf = F.map(function (f, i) {
          var r = el('div', 'sg-pn-pf', doc);
          el('span', 'sg-pn-pf-k', r, f.k);
          el('span', 'sg-pn-pf-v', r, f.v);
          if (!tall && i < 2) el('i', 'sg-pn-doc-line', doc);
          return r;
        });
        // the log
        var s = win(R.body, G.sheet, 'sheet', T('询盘登记表.xlsx', 'Inquiry log.xlsx'));
        X.sheet = s.w;
        X.metric = metric(s.bar, T('重新录入', 'Retyped'));
        var grid = el('div', 'sg-pn-grid', s.body);
        function row(cls, vals) {
          var r = el('div', 'sg-pn-tr' + (cls ? ' ' + cls : ''), grid), out = [];
          G.col.forEach(function (c, i) { out.push(box(el('span', 'sg-pn-td', r, vals ? vals[i] : null), [c[0], 0, c[1]])); });
          return { r: r, c: out };
        }
        row('is-head', [T('客户', 'Customer'), F[0].head, F[1].head, F[2].head]);
        OLD.slice(0, nOld).forEach(function (v) { row('is-old', v); });
        var nr = row('is-new', ['Müller Energie', '', '', '']);
        X.row = nr.r;
        X.cellBox = nr.c.slice(1);
        X.cells = X.cellBox.map(function (c) { return el('span', 'sg-pn-td-t', c); });
        // the fix: a strip over the new row
        var fx = X.fix = el('div', 'sg-pn-fix sg-pn-fix-strip', R.body);
        var bh = tall ? 34 : 40, hh = tall ? 28 : 32, rh = tall ? 38 : 44;
        // on the narrow stage the strip takes two lines: what was read and the OK, then the chips
        box(fx, tall ? [G.sheet[0] + 10, G.sheet[1] + bh + hh + rh * nOld - 24, G.sheet[2] - 20, 86] : [G.sheet[0] + 10, G.sheet[1] + bh + hh + rh * nOld - 8, G.sheet[2] - 20, rh + 16]);
        mark(fx);
        el('span', 'sg-pn-fix-k', fx, T('已从 PDF 识别', 'Read from the PDF'));
        var chips = el('span', 'sg-pn-chips', fx);
        X.chips = F.map(function (f) { return el('span', 'sg-pn-chip2', chips, f.chip); });
        X.ok = okPill(fx);
      }

      return function (u) {
        var fix = seg(u, FIX, FIX + 0.4);
        // the mail arrives; a second one lands while the first is still being retyped
        lift(X.msg, ease.out(seg(u, 0.25, 0.75)), 12);
        if (!ph) textSwap(X.meta, u >= 6.3 && u < FIX + 2.6 ? T('2 封未读', '2 unread') : T('1 封未读', '1 unread'));
        if (X.pdf) {
          var o = ease.out(seg(u, 0.9, 1.4));
          op(X.pdf, o);
          put(X.pdf, '-transform', o >= 1 ? 'none' : 'translateY(' + (8 * (1 - o)).toFixed(1) + 'px) scale(' + (0.97 + 0.03 * o).toFixed(4) + ')');
        }
        if (X.row) lift(X.row, ease.out(seg(u, 1.5, 1.85)), 8);
        var done = 0;
        for (var i = 0; i < 3; i++) {
          var tm = TM[i];
          var v = u < tm[1] ? '' : i === 1 && u >= 4.2 ? '200' : typ(F[i].cell, seg(u, tm[1], tm[2]));
          put(X.cells[i], 'text', v);
          cl(X.cellBox[i], 'is-typing', u >= tm[1] - 0.2 && u < tm[3] && u < FIX);
          cl(X.cellBox[i], 'is-wrong', i === 1 && u >= 3.82 && u < 4.2);
          if (X.pf[i]) {
            cl(X.pf[i], 'is-read', u >= tm[0] && u < tm[3] + 0.25);
            cl(X.pf[i], 'is-fix', u >= FIX + 0.45 + i * 0.15);
          }
          if (u >= tm[3]) done = i + 1;
          if (ph) cl(X.cellBox[i], 'is-fix', u >= FIX + 0.35 + i * 0.15);
          else cl(X.chips[i], 'is-in', u >= FIX + 0.45 + i * 0.15);
        }
        op(X.metric.m, done ? 1 - 0.65 * fix : 0);
        if (done) textSwap(X.metric.n, '×' + done);
        cl(X.ok, 'is-in', u >= FIX + 1.05);
        if (ph) {
          cl(X.sheet, 'is-fix', u >= FIX);
          textSwap(X.label, u >= FIX ? T('已从 PDF 识别', 'From the PDF') : T('询盘登记表', 'Inquiry log'));
        } else {
          op(X.sheet, 1 - 0.5 * fix);
          lift(X.fix, ease.out(seg(u, FIX + 0.1, FIX + 0.55)), 10);
        }
      };
    });
  }

  /* =====================================================================
     02 窗口很多，客户信息分散 — the same buyer in four windows: the price in
     the mail, the spec on WhatsApp, the sample on Alibaba.com, the company
     on the website form. The windows keep taking each other's place. Fix:
     they become one customer card, with a merge for a person to confirm.
     ===================================================================== */
  function Chats() {
    return Scene('chats', 11.2, 9.8, function (R) {
      var n = R.name, ph = R.phone, X = { w: [] };
      var WIN = [
        { ic: 'mail', name: T('邮件', 'Mail'), who: 'Jonas Weber', k: T('报价', 'Price'), l: 'Re: Quotation v2', v: 'USD 128 / pc · 200 pcs', pv: 'USD 128 / pc' },
        { ic: 'chat', name: 'WhatsApp', who: '+49 151 ••• 2207', k: T('规格', 'Spec'), l: '', v: 'Can the 48V 100Ah come with a Bluetooth BMS?', pv: 'Bluetooth BMS?' },
        { ic: 'store', name: T('阿里国际站', 'Alibaba.com'), who: 'Muller Energie', k: T('样品', 'Sample'), l: T('样品申请', 'Sample request'), v: '2 pcs, ship to Hamburg', pv: T('2 组，寄汉堡', '2 pcs to Hamburg') },
        { ic: 'form', name: T('官网表单', 'Website form'), who: 'muller-energie.de', k: T('公司', 'Company'), l: 'Müller Energie GmbH', v: T('储能集成 · 年采购约 2,000 组', 'Storage integrator · ~2,000 packs a year'), pv: 'Müller Energie GmbH' }
      ];
      // who comes to the front, and when
      var ORDER = [0, 2, 1, 3, 0, 2], S0 = 1.2, SP = 1.1, FIX = 7.6;
      var G = {
        wide: { w: [[56, 52, 400, 176], [376, 84, 380, 166], [296, 482, 390, 176], [600, 508, 384, 166]], off: [[16, 6], [-16, -6], [16, -6], [-16, 6]], metric: [56, 650], card: [210, 484, 620, 196] },
        low: { w: [[48, 46, 380, 156], [344, 70, 360, 138], [276, 398, 370, 156], [566, 420, 364, 150]], off: [[14, 5], [-14, -5], [14, -5], [-14, 5]], metric: [48, 566], card: [180, 400, 600, 176] },
        square: { w: [[24, 52, 330, 168], [262, 80, 330, 158], [152, 410, 316, 168], [410, 436, 326, 160]], off: [[12, 5], [-12, -5], [12, -5], [-12, 5]], metric: [24, 598], card: [110, 414, 540, 196] },
        tall: { w: [[16, 48, 300, 140], [204, 64, 300, 128], [16, 436, 300, 140], [204, 448, 300, 154]], off: [[10, 4], [-10, -4], [10, -4], [-10, 4]], metric: null, card: [30, 434, 460, 168] },
        phone: { w: [[8, 0, 200, 29], [136, 3, 200, 29], [8, 4, 200, 30], [136, 16, 200, 30]], off: [[6, 1], [-6, -1], [6, -1], [-6, 1]], metric: null, card: [8, 0, 328, 48] }
      }[n];
      WIN.forEach(function (d, i) {
        var e, r = G.w[i];
        if (ph) {
          e = box(el('div', 'sg-pn-prow sg-pn-pwin', i < 2 ? R.top : R.bot), r);
          var pi = el('span', 'sg-pn-prow-ico', e); ico(d.ic, pi, 13);
          el('span', 'sg-pn-pwin-k', e, d.k);
          el('span', 'sg-pn-pwin-v', e, d.pv);
        } else {
          var o = win(R.body, r, d.ic, d.name, d.who);
          e = o.w;
          var b = o.body;
          el('span', 'sg-pn-frag-k', b, d.k);
          if (i === 1) { el('div', 'sg-pn-bubble', b, d.v); }
          else { if (d.l) el('div', 'sg-pn-frag-l', b, d.l); el('div', 'sg-pn-frag-v', b, d.v); }
        }
        X.w.push({ e: e, x: r[0], y: r[1], cw: r[2], chh: r[3], off: G.off[i] });
      });
      if (G.metric) { X.metric = metric(R.body, T('切换窗口', 'Window switches')); X.metric.m.style.cssText = 'left:' + G.metric[0] + 'px;top:' + (G.metric[1] - 30) + 'px'; }
      // the fix: one customer card
      var c = X.card = box(el('div', 'sg-pn-fix sg-pn-cust', ph ? R.bot : R.body), G.card);
      var ch = el('div', 'sg-pn-cust-h', c);
      el('span', 'sg-pn-cust-av', ch, 'ME');
      var cn = el('div', 'sg-pn-cust-n', ch);
      el('b', '', cn, 'Müller Energie GmbH');
      if (!ph) el('span', '', cn, T('德国 汉堡 · 储能集成', 'Hamburg, Germany · storage integrator'));
      var icons = el('span', 'sg-pn-cust-ch', ch);
      X.ci = WIN.map(function (d) { var s = el('i', '', icons); ico(d.ic, s, ph ? 12 : 14); return s; });
      if (!ph) {
        var fl = el('div', 'sg-pn-cust-f', c);
        X.cf = [[T('报价', 'Price'), 'USD 128 / pc'], [T('规格', 'Spec'), T('48V 100Ah + 蓝牙 BMS', '48V 100Ah + Bluetooth BMS')], [T('样品', 'Sample'), T('2 组，寄汉堡', '2 pcs to Hamburg')], [T('规模', 'Volume'), T('约 2,000 组 / 年', '~2,000 packs / yr')]].map(function (f) {
          var r = el('div', 'sg-pn-cust-r', fl); el('span', '', r, f[0]); el('b', '', r, f[1]); return r;
        });
        var foot = el('div', 'sg-pn-cust-foot', c);
        el('span', 'sg-pn-cust-src', foot, T('4 个渠道 · 1 位客户', '4 channels · 1 buyer'));
        X.ok = okPill(foot);
      } else {
        var line = el('div', 'sg-pn-cust-line', c);
        el('span', '', line, T('4 个渠道 · 1 位客户', '4 channels · 1 buyer'));
        X.ok = okPill(line);
        X.cf = [line];
      }
      var cx = G.card[0] + G.card[2] / 2, cy = G.card[1] + G.card[3] / 2;

      return function (u) {
        var k = u < S0 ? -1 : Math.min(ORDER.length - 1, Math.floor((u - S0) / SP));
        var f = k < 0 ? -1 : ORDER[k];
        var fx = ease.io(seg(u, FIX, FIX + 0.6));
        for (var i = 0; i < 4; i++) {
          var w = X.w[i], a = ease.out(seg(u, 0.1 + 0.18 * i, 0.55 + 0.18 * i));
          // z: the most recent focus wins; the nudge eases in when focused and back out when another takes over
          var z = i, p = 0;
          for (var j = 0; j <= k; j++) {
            var tj = S0 + j * SP;
            if (ORDER[j] === i) { z = 10 + j; p = ease.out(seg(u, tj, tj + 0.4)); }
            else if (p > 0 && z === 10 + j - 1) p = 1 - ease.out(seg(u, tj, tj + 0.4));
          }
          put(w.e, '-z-index', String(z));
          cl(w.e, 'is-focus', i === f && u < FIX);
          var dx = w.off[0] * p, dy = w.off[1] * p + (1 - a) * 12, s = 1, o = a;
          if (fx > 0) {
            if (i < 2) { o = a * (1 - 0.78 * fx); s = 1 - 0.04 * fx; dy -= 10 * fx; }
            else { dx += (cx - (w.x + w.cw / 2)) * fx; dy += (cy - (w.y + w.chh / 2)) * fx; s = 1 - 0.45 * fx; o = a * (1 - fx); }
          }
          op(w.e, o);
          put(w.e, '-transform', dx === 0 && dy === 0 && s === 1 ? 'none' : 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + s.toFixed(4) + ')');
        }
        if (X.metric) {
          op(X.metric.m, k < 0 ? 0 : 1 - 0.8 * fx);
          if (k >= 0) textSwap(X.metric.n, '×' + (9 + k));
        }
        lift(X.card, ease.out(seg(u, FIX + 0.35, FIX + 0.85)), 12);
        for (var q = 0; q < 4; q++) cl(X.ci[q], 'is-on', u >= FIX + 0.7 + 0.12 * q);
        for (var m = 0; m < X.cf.length; m++) cl(X.cf[m], 'is-in', u >= FIX + 0.9 + 0.1 * m);
        cl(X.ok, 'is-in', u >= FIX + 1.4);
      };
    });
  }

  /* =====================================================================
     03 客户在表格，跟进靠人记 — the follow-up sheet ages a day at a time;
     the sticky notes that were the reminders fall away, and Nordic slips
     to 14 days without a word. Fix: a follow-up draft, waiting for you.
     ===================================================================== */
  function Sheet() {
    return Scene('sheet', 11.6, 10.1, function (R) {
      var n = R.name, ph = R.phone, X = {};
      var ROWS = [
        ['Gulf Coast Lift Supply', T('美国', 'US'), 15],
        ['Silva Mobilidade', T('巴西', 'Brazil'), 14],
        ['Ahmed Al-Rashid', T('阿联酋', 'UAE'), 16],
        ['Kowalski Sp. z o.o.', T('波兰', 'Poland'), 12],
        ['Lagos Power Ltd', T('尼日利亚', 'Nigeria'), 13],
        ['Nordic Mobility AB', T('瑞典', 'Sweden'), 9],
        ['Hanoi E-Moto JSC', T('越南', 'Vietnam'), 11]
      ];
      var LATE = 5, D0 = 16, DAYS = 7, DT = 0.8, FIX = 7.4;
      function date(d) { return T('10月' + d + '日', 'Oct ' + d); }
      function ago(d) { return T(d + ' 天', d + (d === 1 ? ' day' : ' days')); }
      var TODAY = [], AGE = [];
      for (var d = 0; d <= DAYS; d++) TODAY.push(T('今天 ', 'Today · ') + date(D0 + d));
      ROWS.forEach(function (r, i) { var a = []; for (var d2 = 0; d2 <= DAYS; d2++) a.push(i === LATE && d2 === DAYS ? T('14 天未跟进', '14 days silent') : ago(D0 + d2 - r[2])); AGE.push(a); });
      var NOTES = [[T('周三前回 Nordic 报价', 'Reply to Nordic by Wed'), 3.0], [T('给 Silva 寄目录', 'Send Silva the catalogue'), 4.4]];
      var DRAFTED = T('已起草跟进', 'Draft ready');
      var draftText = pre('Hi Erik, following up on our quote for the 2,000 e-bike packs a year. Happy to send two samples first if that helps.');
      X.rows = []; X.age = []; X.notes = [];

      if (ph) {
        var bar = box(el('div', 'sg-pn-prow sg-pn-psheet2', R.top), [8, 0, 328, R.topH]);
        var bi = el('span', 'sg-pn-prow-ico', bar); ico('sheet', bi, 13);
        el('span', 'sg-pn-psheet-name', bar, T('客户跟进表', 'Follow-ups'));
        X.today = el('span', 'sg-pn-today', bar);
        var lr = X.late = box(el('div', 'sg-pn-prow sg-pn-plate', R.bot), [8, 0, 328, R.botH]);
        var lm = el('div', 'sg-pn-prow-main', lr);
        var t1 = el('div', 'sg-pn-prow-l1', lm); el('b', '', t1, ROWS[LATE][0]);
        X.lateSub = el('div', 'sg-pn-prow-l2', lm, T('上次联系 ', 'Last contact ') + date(ROWS[LATE][2]));
        X.age[LATE] = el('span', 'sg-pn-age', lr);
        X.ok = okPill(lr);
        var nt = box(el('div', 'sg-pn-paper is-phone', R.top), [228, 3, 100, 26]);
        el('span', '', nt, T('周三回 Nordic', 'Nordic by Wed'));
        X.notes.push({ e: nt, t: 3.0, r: 4 });
      } else {
        var G = {
          wide: { sheet: [40, 52, 960, 640], rh: 80, col: [[24, 320], [360, 150], [520, 170], [700, 236]], notes: [[694, 112, 196, 112, -4], [842, 152, 150, 120, 5]], draft: [400, 100, 560, 156] },
          low: { sheet: [32, 46, 896, 540], rh: 66, col: [[22, 300], [336, 140], [486, 160], [660, 214]], notes: [[600, 96, 180, 100, -4], [744, 124, 150, 104, 5]], draft: [300, 62, 470, 144] },
          square: { sheet: [24, 52, 712, 568], rh: 64, col: [[18, 230], [256, 104], [372, 130], [508, 186]], notes: [[470, 104, 164, 104, -4], [590, 138, 132, 110, 5]], draft: [196, 96, 520, 146] },
          tall: { sheet: [12, 50, 496, 556], rh: 64, col: [[16, 200], [226, 120], [350, 130]], notes: [[290, 112, 170, 70, -4]], draft: [28, 80, 464, 128] }
        }[n];
        var tall = n === 'tall', cols = G.col;
        var s = win(R.body, G.sheet, 'sheet', T('客户跟进表.xlsx', 'Follow-ups.xlsx'));
        X.sheet = s.w;
        X.today = el('span', 'sg-pn-today', s.bar);
        var grid = el('div', 'sg-pn-grid', s.body);
        var head = el('div', 'sg-pn-tr is-head', grid);
        var hv = tall ? [T('客户', 'Customer'), T('上次联系', 'Last contact'), T('未跟进', 'Silent for')] : [T('客户', 'Customer'), T('国家', 'Country'), T('上次联系', 'Last contact'), T('未跟进', 'Silent for')];
        cols.forEach(function (c, i) { box(el('span', 'sg-pn-td' + (i === cols.length - 1 ? ' is-end' : ''), head, hv[i]), [c[0], 0, c[1]]); });
        ROWS.forEach(function (r, i) {
          var tr = el('div', 'sg-pn-tr' + (i === LATE ? ' is-watch' : ''), grid);
          tr.style.height = G.rh + 'px';
          var vals = tall ? [r[0], date(r[2])] : [r[0], r[1], date(r[2])];
          vals.forEach(function (v, j) { box(el('span', 'sg-pn-td', tr, v), [cols[j][0], 0, cols[j][1]]); });
          var ac = box(el('span', 'sg-pn-td is-end', tr), [cols[cols.length - 1][0], 0, cols[cols.length - 1][1]]);
          X.age[i] = el('span', 'sg-pn-age', ac);
          X.rows.push(tr);
        });
        G.notes.forEach(function (g, i) {
          var e = box(el('div', 'sg-pn-paper', R.body), g);
          el('span', '', e, NOTES[i][0]);
          X.notes.push({ e: e, t: NOTES[i][1], r: g[4] });
        });
        // the fix: a follow-up draft where the notes were
        var dr = X.draft = box(el('div', 'sg-pn-fix sg-pn-draft', R.body), G.draft);
        var dh = el('div', 'sg-pn-draft-h', dr);
        mark(dh);
        el('b', '', dh, T('跟进草稿', 'Follow-up draft'));
        el('span', '', dh, ' · Nordic Mobility AB');
        X.draftT = el('div', 'sg-pn-draft-t', dr);
        var df = el('div', 'sg-pn-draft-foot', dr);
        X.ok = okPill(df);
        if (!tall) { el('span', 'sg-btn', df, T('修改', 'Edit')); el('span', 'sg-btn is-primary', df, T('确认发送', 'Approve & send')); }
      }

      return function (u) {
        var day = u < DT ? 0 : Math.min(DAYS, 1 + Math.floor((u - DT) / DT));
        textSwap(X.today, TODAY[day]);
        var fix = seg(u, FIX, FIX + 0.5);
        var late = day === DAYS && u < FIX + 0.6, drafted = u >= FIX + 0.6;
        for (var i = 0; i < ROWS.length; i++) {
          if (!X.age[i]) continue;
          textSwap(X.age[i], i === LATE && drafted ? DRAFTED : AGE[i][day]);
          // on the narrow stage the draft sits right over the rows, so the rest fade further
          if (X.rows[i]) op(X.rows[i], i === LATE ? 1 : 1 - (tall ? 0.75 : 0.45) * fix);
        }
        var lateEl = ph ? X.late : X.rows[LATE];
        cl(lateEl, 'is-late', late);
        cl(lateEl, 'is-drafted', drafted);
        for (var j = 0; j < X.notes.length; j++) {
          var nt = X.notes[j], a = ease.out(seg(u, 0.25 + 0.15 * j, 0.7 + 0.15 * j)), fl = seg(u, nt.t, nt.t + 1.1), ff = fl * fl;
          // a corner lifts, then the note lets go
          var wob = u > nt.t - 0.5 && u < nt.t ? Math.sin((u - nt.t + 0.5) * 22) * 1.6 * seg(u, nt.t - 0.5, nt.t - 0.2) : 0;
          op(nt.e, a * (1 - seg(u, nt.t + 0.55, nt.t + 1.05)));
          put(nt.e, '-transform', 'translate(' + (ff * (ph ? 150 : 460)).toFixed(1) + 'px,' + (ff * (ph ? 6 : 40)).toFixed(1) + 'px) rotate(' + (nt.r + wob + ff * 16).toFixed(2) + 'deg)');
        }
        if (ph) {
          cl(X.ok, 'is-in', u >= FIX + 1.0);
          put(X.lateSub, 'text', drafted ? T('跟进草稿已备好', 'A follow-up draft is ready') : T('上次联系 ', 'Last contact ') + date(ROWS[LATE][2]));
        } else {
          lift(X.draft, ease.out(seg(u, FIX + 0.1, FIX + 0.55)), 12);
          put(X.draftT, 'text', typ(draftText, seg(u, FIX + 0.5, FIX + 1.6)));
          cl(X.draftT, 'is-typing', u >= FIX + 0.4 && u < FIX + 1.7);
          cl(X.ok, 'is-in', u >= FIX + 1.75);
        }
      };
    });
  }

  /* =====================================================================
     04 订单在后台，销售还在追问 — sales asks the team chat where an order
     is, three times, and nobody reads it; the sales view knows nothing.
     Fix: scheduled → QC → loaded shows up in the sales view itself.
     ===================================================================== */
  function Order() {
    return Scene('order', 10.6, 9.5, function (R) {
      var n = R.name, ph = R.phone, X = { pings: [] };
      var PINGS = [
        [T('PO-118 Müller 这单到哪了？', 'Where is PO-118 (Müller)?'), T('周一 09:12', 'Mon 09:12'), 0.6, T('这单到哪了？', 'Where is PO-118?')],
        [T('@跟单 这单到哪了？客户在问', '@ops Where is this one? The buyer is asking.'), T('周二 14:30', 'Tue 14:30'), 2.2, T('@跟单 到哪了？', '@ops Any news?')],
        [T('今天要回客户了，到哪了？', 'I owe the buyer an answer today. Any update?'), T('周三 10:05', 'Wed 10:05'), 3.8, T('今天要回客户了！', 'Buyer needs an answer today')]
      ];
      var STEPS = [[T('已排产', 'Scheduled'), T('10月12日', 'Oct 12')], [T('质检', 'QC'), T('10月19日', 'Oct 19')], [T('已装柜', 'Loaded'), T('10月23日', 'Oct 23')]];
      var FIX = 7.0, ST = [7.45, 7.95, 8.45];
      X.steps = []; X.dates = []; X.lines = [];
      var maxVis;
      if (ph) {
        var cr = X.chat = box(el('div', 'sg-pn-prow sg-pn-pchat', R.top), [8, 0, 328, R.topH]);
        var ci = el('span', 'sg-pn-prow-ico', cr); ico('chat', ci, 13);
        X.pingT = el('span', 'sg-pn-pchat-t', cr);
        X.metric = metric(cr, T('追问', 'Asked'));
        var sv2 = X.sales = box(el('div', 'sg-pn-prow sg-pn-psales', R.bot), [8, 0, 328, R.botH]);
        var top = el('div', 'sg-pn-psales-h', sv2);
        el('b', '', top, 'PO-118 · Müller');
        X.state = el('span', 'sg-pn-psales-s', top);
        var rail = el('div', 'sg-pn-rail2', sv2);
        STEPS.forEach(function (s, i) {
          if (i) { var ln = el('i', 'sg-pn-rail2-ln', rail); X.lines.push(el('i', '', ln)); }
          var st = el('span', 'sg-pn-rail2-st', rail); el('i', '', st); el('span', '', st, s[0]);
          X.steps.push(st);
        });
        maxVis = 1;
      } else {
        var G = {
          wide: { chat: [40, 52, 640, 202], sales: [262, 476, 738, 210], vis: 2 },
          low: { chat: [32, 46, 600, 156], sales: [232, 400, 696, 176], vis: 1 },
          square: { chat: [24, 52, 520, 198], sales: [130, 408, 606, 212], vis: 2 },
          tall: { chat: [16, 50, 488, 140], sales: [16, 414, 488, 194], vis: 1 }
        }[n];
        maxVis = G.vis;
        var c = win(R.body, G.chat, 'chat', T('内部群 · 销售与跟单', 'Team chat · sales and ops'));
        X.chat = c.w;
        X.metric = metric(c.bar, T('追问', 'Asked'));
        var vp = el('div', 'sg-pn-pings', c.body);
        X.stack = el('div', 'sg-pn-pings-in', vp);
        PINGS.forEach(function (p) {
          var e = el('div', 'sg-pn-ping', X.stack);
          el('div', 'sg-pn-bub', e, p[0]);
          var meta = el('div', 'sg-pn-ping-m', e);
          el('span', '', meta, p[1]);
          ico('tick', meta, 13);
          el('span', '', meta, T('未读', 'Unread'));
          X.pings.push(e);
        });
        var s = win(R.body, G.sales, 'box', T('销售视图', 'Sales view'), 'PO-2026-118');
        X.sales = s.w;
        var lk = X.lock = el('span', 'sg-pn-lock', s.bar);
        X.lockIco = ico('lock', lk, 13);
        X.lockT = el('span', '', lk);
        var bd = el('div', 'sg-pn-order', s.body);
        var who = el('div', 'sg-pn-order-who', bd);
        el('b', '', who, 'Müller Energie GmbH');
        el('span', '', who, '48V 100Ah × ' + T('200 组', '200 pcs') + ' · ' + T('DAP 汉堡', 'DAP Hamburg'));
        var rl = el('div', 'sg-pn-rail', bd);
        STEPS.forEach(function (st, i) {
          if (i) { var ln = el('i', 'sg-pn-rail-ln', rl); X.lines.push(el('i', '', ln)); }
          var e = el('div', 'sg-pn-rail-st', rl);
          var dot = el('span', 'sg-pn-rail-dot', e); ico('tick', dot, 12);
          el('b', '', e, st[0]);
          X.dates.push(el('span', 'sg-pn-rail-d', e, '—'));
          X.steps.push(e);
        });
        X.state = el('div', 'sg-pn-order-s', bd);
      }
      var pingH = 0;

      return function (u) {
        var fix = seg(u, FIX, FIX + 0.5), cnt = 0;
        for (var i = 0; i < PINGS.length; i++) if (u >= PINGS[i][2]) cnt = i + 1;
        if (ph) {
          var cur = cnt ? PINGS[cnt - 1] : null;
          textSwap(X.pingT, cur ? cur[3] : '');
          op(X.pingT, cnt ? 1 - 0.55 * fix : 0);
        } else {
          for (var j = 0; j < PINGS.length; j++) {
            var a = ease.out(seg(u, PINGS[j][2], PINGS[j][2] + 0.4));
            op(X.pings[j], a * (1 - 0.55 * fix));
            put(X.pings[j], '-transform', a >= 1 ? 'none' : 'translateY(' + (10 * (1 - a)).toFixed(1) + 'px) scale(' + (0.97 + 0.03 * a).toFixed(4) + ')');
          }
          // older pings scroll up when the window is full
          if (!pingH && X.pings[1]) pingH = X.pings[1].offsetTop - X.pings[0].offsetTop;
          var sc = 0;
          for (var q = maxVis; q < PINGS.length; q++) sc += ease.io(seg(u, PINGS[q][2] - 0.05, PINGS[q][2] + 0.35));
          put(X.stack, '-transform', sc ? 'translateY(' + (-sc * pingH).toFixed(1) + 'px)' : 'none');
        }
        op(X.metric.m, cnt ? 1 - 0.7 * fix : 0);
        if (cnt) textSwap(X.metric.n, ph ? '×' + cnt : '×' + cnt + T(' · 无人回复', ' · no reply'));
        // the sales view: nothing, then the three steps in order
        var on = 0;
        for (var k = 0; k < 3; k++) {
          var lit = u >= ST[k];
          if (lit) on = k + 1;
          cl(X.steps[k], 'is-on', lit);
          if (X.dates[k]) put(X.dates[k], 'text', lit ? STEPS[k][1] : '—');
          if (k) put(X.lines[k - 1], '-transform', 'scaleX(' + ease.io(seg(u, ST[k] - 0.45, ST[k])).toFixed(3) + ')');
        }
        cl(X.sales, 'is-fix', u >= FIX);
        if (ph) textSwap(X.state, on ? T('同步自 ERP', 'From the ERP') : T('状态未知', 'Status unknown'));
        else {
          cl(X.lock, 'is-fix', u >= FIX);
          textSwap(X.lockT, u >= FIX ? T('同步自 ERP', 'Synced from the ERP') : T('生产进度在 ERP 后台', 'Production status sits in the ERP'));
          textSwap(X.state, on === 3 ? T('已装柜，可以直接回复客户了', 'Loaded. You can answer the buyer now.') : on ? T('同步中…', 'Syncing…') : T('状态未知，只能去问跟单', 'Status unknown. Ask ops again.'));
        }
      };
    });
  }

  return { 'pain-inquiry': Inquiry, 'pain-chats': Chats, 'pain-sheet': Sheet, 'pain-order': Order };
});
