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
     ===================================================================== */
  function RequestScene() {
    var P = 12;
    // tag: just under the card's mark row; the steps sit at the foot of the card, under its author line
    var layouts = {
      card: { w: 370, h: 450, x: 25, tag: 58, foot: 14 },
      narrow: { w: 286, h: 450, x: 25, tag: 82, foot: 10 },
      wide: { w: 346, h: 350, x: 16, tag: 54, foot: 8 }
    };
    // the page's own words: 提交后我们先了解你的需求，会议时间另行确认 / 我们会通过你留下的联系方式联系你
    var STEP = [
      [T('收到申请', 'Request in'), '', T('收到申请', 'Received')],
      [T('先了解需求', 'We learn'), T('', 'your needs'), T('了解需求', 'We learn')],
      [T('按你留的方式', 'We contact'), T('联系你', 'you'), T('联系你', 'We contact')],
      [T('会议时间', 'Meeting time'), T('另行确认', 'set separately'), T('另定时间', 'Meeting')]
    ];
    var AT = [0.8, 2.4, 4.0, 5.6];
    var R;
    function build(stage, L, name) {
      R = { st: [] };
      stage.className = 'sg-mo-stage sgk sgk-request is-' + name;
      el('div', 'sgk-glow', stage);
      // the English quote runs longer: the full two-line steps and the caption only where the card leaves room;
      // on the tablet card the English quote reaches the author line's foot, so its tag goes under the mark
      var full = K.ZH && name === 'card', cap = K.ZH || name === 'card';
      var line = el('div', 'sgk-steps', stage), rowH = full ? 48 : 33;
      line.style.left = L.x + 'px'; line.style.right = L.x + 'px'; line.style.top = (L.h - L.foot - rowH) + 'px';
      if (!K.ZH && name === 'narrow') { var tg = el('span', 'sg-tag sgk-tag sgk-corner', stage, MINI); tg.style.left = L.x + 'px'; tg.style.top = L.tag + 'px'; }
      else {
        var h = el('div', 'sgk-head', stage);
        h.style.left = L.x + 'px'; h.style.right = L.x + 'px'; h.style.top = (L.h - L.foot - rowH - (cap ? 26 : 22)) + 'px';
        if (cap) { var mk = el('span', 'sgk-mark', h); K.icon('mail', mk, 11); el('b', '', h, T('提交表单之后', 'After you submit')); }
        el('span', 'sg-tag sgk-tag', h, MINI);
      }
      R.fill = el('i', 'sgk-fill', line);
      STEP.forEach(function (s, i) {
        var c = el('div', 'sgk-step', line);
        el('i', 'sgk-dot', c);
        var tx = el('span', 'sgk-step-t', c, full ? s[0] : s[2]);
        if (s[1] && full) { tx.appendChild(document.createElement('br')); tx.appendChild(document.createTextNode(s[1])); }
        R.st.push(c);
      });
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
      pick: function (w, h) { var r = w / h; return r > 0.95 ? 'wide' : r < 0.72 ? 'narrow' : 'card'; },
      build: build, tick: tick, still: 7.5, start: 0.2
    };
  }

  return { board: BoardScene, request: RequestScene };
});
