/* Two small card scenes where the owner's office photographs were (2026-10-24,
   「现场氛围也全部换成代码」). Placed by tools/code-art-atmos.mjs, styled by
   css/stargo-motion-atmos-cards.css, run by js/stargo-motion.js.

   Each card keeps its own mark, quote and washes on top: the template blurs
   the lower half of the card (`.work-overlay.first.half`, a masked 15px
   backdrop blur) and sets the quote in the middle, so a scene draws its sharp
   part in the band between the card's mark and its quote (each layout's
   `top`, in stage px) and leaves only a soft glow for the blurred half.

   board   — the homepage's third scenario card, 「客户可能到了补货周期，先核实
             采购信号，再给出跟进建议。」 (R2, the manager at the whiteboard, until
             2026-10-24): today's priority on the board the AI keeps current.
             PT Surya Energi is due to restock; the buying signal is checked,
             the follow-up is drafted, and it stops at 「等你确认」 — it is never
             sent on its own. The copper magnet that moves along the boxes is
             the one on the photograph's whiteboard.
   request — the contact page's quote card beside the form (K01 until
             2026-10-24). Its quote runs long in English, so here the steps sit at
             the foot of the card under the author line, and the card's blur is
             not drawn over them (css/stargo-motion-atmos-cards.css): what happens
             after the form, in the page's own words —
             the request arrives, we first learn what you need, we contact you
             using the details you left, and the meeting time is set
             separately. Nothing more is promised. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod;
  var MINI = T('演示数据', 'Demo data');
  function op(e, v) { css(e, 'opacity', c01(v).toFixed(3)); }
  function head(stage, L, icon, text, extra) {
    var h = el('div', 'sgk-head', stage);
    h.style.left = L.x + 'px'; h.style.right = L.x + 'px'; h.style.top = L.top + 'px';
    var mk = el('span', 'sgk-mark', h); K.icon(icon, mk, 11);
    el('b', '', h, text);
    if (extra) { var lv = el('span', 'sgk-live', h); el('i', '', lv); el('span', '', lv, extra); }
    el('span', 'sg-tag sgk-tag', h, MINI);
    return h;
  }

  /* =====================================================================
     BOARD — 今日优先 · PT Surya Energi.
     ===================================================================== */
  function BoardScene() {
    var P = 12;
    var layouts = {
      card: { w: 400, h: 450, x: 24, top: 62, box: 94, bh: 60, gap: 14 },
      wide: { w: 360, h: 350, x: 14, top: 50, box: 74, bh: 50, gap: 10, short: true }
    };
    var BOX = [
      [T('补货周期', 'Restock'), T('已 60 天', '60 days')],
      [T('采购信号', 'Signal'), T('核实中…', 'checking…')],
      [T('跟进建议', 'Follow-up'), T('已起草', 'drafted')],
      [T('等你确认', 'Your OK'), T('不自动发送', 'waiting')]
    ];
    var ON = [0.6, 2.0, 4.0, 5.6];
    var R, L;
    function build(stage, Ld, name) {
      L = Ld; R = { b: [] };
      stage.className = 'sg-mo-stage sgk sgk-board is-' + name;
      el('div', 'sgk-glow', stage);
      head(stage, L, 'spark', T('今日优先 · PT Surya Energi', 'Today · PT Surya Energi'), L.short ? null : T('AI 随时更新', 'AI-updated'));
      var bw = (L.w - 2 * L.x - 3 * L.gap) / 4;
      BOX.forEach(function (b, i) {
        var x = L.x + i * (bw + L.gap);
        var d = el('div', 'sgk-box' + (i === 3 ? ' is-gate' : ''), stage);
        d.style.left = x + 'px'; d.style.top = L.box + 'px'; d.style.width = bw + 'px'; d.style.height = L.bh + 'px';
        el('b', '', d, b[0]);
        var s = el('span', '', d, b[1]);
        if (i < 3) { var a = el('i', 'sgk-arrow', stage); a.style.left = (x + bw + L.gap / 2) + 'px'; a.style.top = (L.box + L.bh / 2) + 'px'; }
        R.b.push({ d: d, s: s, x: x + bw - 6 });
      });
      R.mag = el('i', 'sgk-magnet', stage);
      R.mag.style.top = (L.box - 5) + 'px';
    }
    function tick(t) {
      var ph = mod(t, P), out = seg(ph, 11.2, 11.9);
      R.b.forEach(function (b, i) {
        var on = ph >= ON[i] && ph < 11.4, done = i < 3 && ph >= ON[i + 1] - 0.4 && ph < 11.4;
        cl(b.d, 'is-on', on && !done); cl(b.d, 'is-done', done);
        if (i === 1) put(b.s, 'text', ph > 3.4 && ph < 11.4 ? T('已核实 ✓', 'checked ✓') : BOX[1][1]);
      });
      // the magnet moves to the box the AI is on and stays on 「等你确认」
      var k = 0;
      for (var i = 1; i < 4; i++) k += ease.io(seg(ph, ON[i] - 0.5, ON[i] - 0.05));
      var x = R.b[0].x + (R.b[1].x - R.b[0].x) * k;
      css(R.mag, 'transform', 'translateX(' + x.toFixed(1) + 'px)');
      op(R.mag, seg(ph, 0.3, 0.7) * (1 - out));
    }
    return {
      layouts: layouts,
      pick: function (w, h) { return w / h > 0.95 ? 'wide' : 'card'; },
      build: build, tick: tick, still: 8, start: 0.2
    };
  }

  /* =====================================================================
     REQUEST — after the form.
     The stage is the host's own size (one layout per host size, made by
     pick), so it is never scaled and its 12px type stays 12px. The card's
     quote and author line wrap differently at every width and in each
     language, so build reads the card's own text boxes once (and again when
     the web fonts land), never per frame, and places the parts below them:
     the four steps at the foot, with the richest labels that leave at least
     16px between neighbours; above them the 「提交表单之后」 / After you submit
     row with its 演示数据 / Demo data tag, when it clears the author line by
     8px; else the tag alone, beside the author's first line (or in the gap
     under the card's mark row).
     ===================================================================== */
  function RequestScene() {
    var P = 12;
    var layouts = {};
    // the page's own words: 提交后我们先了解你的需求，会议时间另行确认 / 我们会通过你留下的联系方式联系你.
    // Label sets, richest first: two lines (Chinese only), one line, short.
    var SETS = [
      K.ZH ? [['收到申请'], ['先了解需求'], ['按你留的方式', '联系你'], ['会议时间', '另行确认']] : null,
      [[T('已收到', 'Received')], [T('了解需求', 'We learn')], [T('联系你', 'We contact')], [T('另定时间', 'Meeting')]],
      [[T('收到', 'Request')], [T('需求', 'Needs')], [T('联系', 'Contact')], [T('定时间', 'Meeting')]]
    ];
    var AT = [0.8, 2.4, 4.0, 5.6];
    var GAP = 16, HEAD = 20;
    var R;
    function build(stage, L) {
      var mode = L.h < 400 ? 'wide' : L.w < 330 ? 'narrow' : 'card';
      R = { st: [], tx: [], stage: stage, L: L };
      stage.className = 'sg-mo-stage sgk sgk-request is-' + mode;
      el('div', 'sgk-glow', stage);
      R.line = el('div', 'sgk-steps', stage);
      R.fill = el('i', 'sgk-fill', R.line);
      for (var i = 0; i < 4; i++) {
        var c = el('div', 'sgk-step', R.line);
        el('i', 'sgk-dot', c);
        R.tx.push(el('span', 'sgk-step-t', c));
        R.st.push(c);
      }
      R.head = el('div', 'sgk-head', stage);
      var mk = el('span', 'sgk-mark', R.head); K.icon('mail', mk, 11);
      el('b', '', R.head, T('提交表单之后', 'After you submit'));
      R.tag = el('span', 'sg-tag sgk-tag', R.head, MINI);
      place();
      var mine = R;
      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(function () { if (R === mine) place(); });
    }
    function labels(set) {
      R.tx.forEach(function (t, i) {
        var s = set[i];
        t.textContent = s[0];
        if (s[1]) { t.appendChild(document.createElement('br')); t.appendChild(document.createTextNode(s[1])); }
      });
    }
    // the smallest space between neighbouring labels centred under their dots (c), and with the end labels
    // drawn to the line's ends (e)
    function gaps(col) {
      var w = R.tx.map(function (t) { return t.offsetWidth; }), c = 1e9;
      for (var i = 0; i < 3; i++) c = Math.min(c, col - (w[i] + w[i + 1]) / 2);
      var e = Math.min(col - (w[1] + w[2]) / 2, col - w[1] / 2 - w[0] + (col - w[0]) / 2 + w[0] / 2, col - w[2] / 2 - w[3] / 2 + (col - w[3]) / 2);
      return { c: c, e: e };
    }
    function place() {
      var L = R.L, host = R.stage.parentNode, card = host && host.closest ? host.closest('.testimonials-card') : null;
      var x = 25, ab = Math.round(L.h * 0.7), lines = [], au = [], gapBox = null;
      if (card) {
        var hb = host.getBoundingClientRect(), k = hb.width / (host.clientWidth || 1) || 1;
        var rel = function (r) { return [(r.left - hb.left) / k, (r.top - hb.top) / k, (r.right - hb.left) / k, (r.bottom - hb.top) / k]; };
        var rects = function (root, out) {
          var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, rg = document.createRange();
          while ((n = w.nextNode())) {
            if (!n.data.trim()) continue;
            rg.selectNodeContents(n);
            var rs = rg.getClientRects();
            for (var j = 0; j < rs.length; j++) if (rs[j].width > 1) out.push(rel(rs[j]));
          }
          return out;
        };
        var a = card.querySelector('.card-author'), q = card.querySelector('.card-testi > .top-text'), m = card.querySelector('.flex-btw');
        if (a) {
          au = rects(a, []);
          x = Math.max(12, Math.round(rel(a.getBoundingClientRect())[0]));
          if (au.length) ab = Math.ceil(Math.max.apply(null, au.map(function (r) { return r[3]; })));
          lines = au.slice();
        }
        if (q) { var ql = rects(q, []); lines = lines.concat(ql); if (m && ql.length) gapBox = [rel(m.getBoundingClientRect())[3], ql[0][1]]; }
      }
      R.line.style.left = x + 'px'; R.line.style.right = x + 'px';
      R.head.style.left = x + 'px'; R.head.style.right = x + 'px';
      var col = (L.w - 2 * x) / 4, avail = L.h - ab, footMax = L.h >= 400 ? 14 : 10;
      // which label sets leave room between neighbours (centred, or with the ends drawn out)
      var ok = SETS.map(function (set) {
        if (!set) return null;
        labels(set);
        var g = gaps(col);
        return g.c >= GAP ? 'c' : g.e >= GAP ? 'e' : null;
      });
      var tries = [];
      [true, false].forEach(function (head) { [false, true].forEach(function (tight) { if (!(head && tight)) SETS.forEach(function (s, i) { if (ok[i]) tries.push({ set: i, head: head, tight: tight }); }); }); });
      if (!tries.length) tries.push({ set: 2, head: false, tight: true });
      var pick = null, foot = 8, rowH = 33;
      for (var t = 0; t < tries.length; t++) {
        var tr = tries[t];
        labels(SETS[tr.set]);
        cl(R.line, 'is-tight', tr.tight); cl(R.line, 'is-ends', ok[tr.set] === 'e');
        rowH = R.line.offsetHeight;
        var need = rowH + 8 + (tr.head ? HEAD + 6 : 0);
        if (need + (tr.tight ? 6 : 8) <= avail || t === tries.length - 1) { pick = tr; foot = Math.max(4, Math.min(footMax, avail - need)); break; }
      }
      var top = L.h - foot - rowH;
      R.line.style.top = top + 'px';
      if (pick.head) {
        R.head.style.display = '';
        R.head.style.top = (top - 6 - HEAD) + 'px';
        if (R.tag.parentNode !== R.head) { R.head.appendChild(R.tag); R.tag.className = 'sg-tag sgk-tag'; R.tag.style.left = R.tag.style.top = ''; }
        return;
      }
      // no room for the row: the tag alone, beside an author line it clears by 12px, else under the mark row
      R.head.style.display = 'none';
      if (R.tag.parentNode !== R.stage) { R.stage.appendChild(R.tag); R.tag.className = 'sg-tag sgk-tag sgk-corner'; }
      var tw = R.tag.offsetWidth, th = R.tag.offsetHeight, tl = L.w - x - tw, at = null;
      var clear = function (y) { return lines.every(function (r) { return r[3] <= y - 1 || r[1] >= y + th + 1 || r[2] + 12 <= tl; }); };
      for (var i2 = 0; i2 < au.length && at === null; i2++) {
        var y = Math.round((au[i2][1] + au[i2][3] - th) / 2);
        if (clear(y)) at = [tl, y];
      }
      if (at === null && gapBox && gapBox[1] - gapBox[0] >= th + 8) at = [x, Math.round((gapBox[0] + gapBox[1] - th) / 2)];
      if (at === null) at = [tl, Math.max(0, top - th - 4)];
      R.tag.style.left = at[0] + 'px'; R.tag.style.top = at[1] + 'px';
    }
    function tick(t) {
      var ph = mod(t, P), out = seg(ph, 11, 11.8);
      var reach = 0;
      for (var i = 1; i < 4; i++) reach += ease.io(seg(ph, AT[i] - 0.9, AT[i] - 0.1));
      css(R.fill, 'transform', 'scaleX(' + ((reach / 3) * (1 - out)).toFixed(3) + ')');
      R.st.forEach(function (c, i) { cl(c, 'is-on', ph >= AT[i] && ph < 11.2); cl(c, 'is-now', ph >= AT[i] && ph < 11.2 && (i === 3 || ph < AT[i + 1])); });
    }
    return {
      layouts: layouts,
      // one layout per host size: the stage is never scaled
      pick: function (w, h) {
        var W = Math.max(200, Math.round(w)), H = Math.max(200, Math.round(h)), name = W + 'x' + H;
        if (!layouts[name]) layouts[name] = { w: W, h: H };
        return name;
      },
      build: build, tick: tick, still: 7.5, start: 0.2
    };
  }

  return { board: BoardScene, request: RequestScene };
});
