/* The closing card of intelligence.html — 「把有用的方法留下，把无效的改动撤回。」
   (tools/build-site.mjs lxPage places the host in the picture's box,
   css/stargo-motion-improve.css styles it, js/stargo-motion.js runs it).

   improve — what the card's sentence says, in the dark product palette the
   card's photograph used to bring: every run is logged with its result and
   where a person corrected it (执行 #231 · 开发信 · 人工修正 1 处); a better
   outreach email is drawn from that, tested beside the current one on a
   small sample, and stops at 等你批准; once approved it is adopted step by
   step, 10% → 50% → 100%. A second change does worse on its trial, is
   reverted, and its failure record is kept as the basis for a fix. Nothing
   is adopted without the approval, and the screen says it shows demo data. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  var IC = {
    loop: 'M18.5 12a6.5 6.5 0 1 1-1.9-4.6M18.6 4.2v3.6H15',
    check: 'M5.5 12.5l4 4 9-9',
    undo: 'M9 7.5 4.5 12 9 16.5M5 12h9.5a5 5 0 0 1 0 10H12',
    flask: 'M9.5 3.5h5M10.5 3.5v5.2L5.6 17.4A2 2 0 0 0 7.4 20.5h9.2a2 2 0 0 0 1.8-3.1l-4.9-8.7V3.5M7.8 14h8.4'
  };
  function ico(name, parent, size) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: 'sgi-ico' }, parent);
    sv('path', { d: IC[name], stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }

  function Improve() {
    var P = 20;
    // every rate is a whole number of replies in 120 emails (the sample the card names): v1 5/120 = 4.2%,
    // v2 8/120 = 6.7%; the runs are 120 emails too (#231 4/120, #232 7/120).
    // run log: [run, task, result, tone, appears at, short task, short result]; the first two are
    // already there. The short forms are for the narrow layouts
    var LOG = [
      ['#229', T('开发信', 'Outreach email'), T('回复率 4.2% · 达标', 'Reply rate 4.2% · on target'), 'ok', -2, T('开发信', 'Email'), T('回复率 4.2%', 'Replies 4.2%')],
      ['#230', T('报价单', 'Quote'), T('准时发出 · 达标', 'Sent on time · on target'), 'ok', -1, T('报价单', 'Quote'), T('准时发出', 'Sent on time')],
      ['#231', T('开发信', 'Outreach email'), T('回复率 3.3% · 人工修正 1 处', 'Reply rate 3.3% · 1 human fix'), 'fix', 0.6, T('开发信', 'Email'), T('人工修正 1 处', '1 human fix')],
      ['#232', T('开发信 v2', 'Outreach email v2'), T('回复率 5.8% · 达标', 'Reply rate 5.8% · on target'), 'ok', 15.4, T('开发信 v2', 'Email v2'), T('回复率 5.8%', 'Replies 5.8%')]
    ];
    var A_IN = 1.6, BAR1 = 2.2, BAR2 = 2.8, ASK = 4.2, TAP = 6.0, R0 = 6.6, STEPS = [6.9, 7.9, 8.9], DONE = 9.8;
    var B_IN = 10.6, B_BAD = 12.0, B_REV = 13.4, B_KEEP = 14.0, OUT0 = P - 1.4, OUT1 = P - 0.6;
    // every layout is drawn at about its box's own size, so no type renders under 12px: wide the card's
    // 512 x 429 box from 1440 up, wide2 its 1.32:1 box below that (one run in the log, no log heading),
    // tall the 768-991 strip, square the 1:1 phone card (358px at 390), small the same below 350px, and
    // under 324px small at the card's own size (288 at 320, 308 at 340; QA round 5, 2026-10-24: 324 drawn
    // into 288 put its words at 11.1px), xs below 300px tall with tighter cards (css/stargo-motion-improve.css)
    var layouts = { wide: { w: 512, h: 430, vis: 2 }, wide2: { w: 512, h: 388, vis: 1 }, tall: { w: 288, h: 536, vis: 3 }, square: { w: 352, h: 352, vis: 1 }, small: { w: 324, h: 324, vis: 1 } };
    var A_PILL = [T('小样本测试', 'Testing'), T('等你批准', 'Awaiting approval'), T('逐步采用', 'Rolling out'), T('已采用', 'Adopted')];
    var B_PILL = [T('试用 10%', 'Trial 10%'), T('效果变差', 'Doing worse'), T('已撤回', 'Reverted')];
    var R, L;

    function build(stage, Ld, name) {
      L = Ld; R = { rows: [] };
      if (Ld.small) name = 'small';
      var sq = name === 'square' || name === 'small', narrow = name !== 'wide' && name !== 'wide2';
      stage.className = 'sg-mo-stage sgi is-' + (name === 'small' ? 'square is-small' + (Ld.h < 300 ? ' is-xs' : '') : name === 'wide2' ? 'wide is-wide2' : name);
      var bar = el('div', 'sgi-bar', stage);
      var mk = el('span', 'sgi-mark', bar); ico('loop', mk, 13);
      el('b', '', bar, T('改进记录', 'Improvements'));
      el('span', 'sg-tag sgi-tag', bar, name === 'square' || name === 'small' ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      var body = el('div', 'sgi-body', stage);

      // the run log
      var log = el('div', 'sgi-log', body);
      var lh = el('div', 'sgi-h', log);
      el('span', '', lh, T('执行记录', 'Run log'));
      el('span', 'sgi-h-r', lh, T('每次执行都留记录', 'Every run is logged'));
      var win = el('div', 'sgi-log-win', log);
      LOG.forEach(function (r) {
        var row = el('div', 'sgi-run is-' + r[3], win);
        el('b', 'sgi-run-n', row, r[0]);
        el('span', 'sgi-run-task', row, narrow ? r[5] : r[1]);
        el('span', 'sgi-run-res', row, narrow ? r[6] : r[2]);
        R.rows.push(row);
      });

      // change A: tested, approved, adopted step by step
      var a = R.a = el('div', 'sgi-card', body);
      var ah = el('div', 'sgi-ch', a);
      var at = el('div', 'sgi-ct', ah);
      // the square phone card names a change by its number alone in English, so the titles keep their words
      el('span', 'sgi-cn', at, T('改进 #12', sq ? '#12' : 'Change #12'));
      el('b', '', at, T('开发信 v2', sq ? 'Email v2' : 'Outreach email v2'));
      R.aPill = el('span', 'sgi-pill', ah);
      el('div', 'sgi-sub', a, T('从 #231 的人工修正复盘：开头先提对方的储能项目', 'From the fix on #231: open with the buyer’s storage project'));
      R.bars = [[T('现行 v1', 'Current v1'), 4.2], [T('新版 v2', 'New v2'), 6.7]].map(function (b, i) {
        var r = el('div', 'sgi-ab' + (i ? ' is-new' : ''), a);
        el('span', 'sgi-ab-k', r, b[0]);
        var tr = el('span', 'sgi-ab-tr', r); var f = el('i', '', tr);
        var v = el('b', 'sgi-ab-v', r);
        return { f: f, v: v, max: b[1] };
      });
      var foot = el('div', 'sgi-foot', a);
      // the tall strip leaves about 100px beside the Approve button: English says it in fewer letters there
      R.sample = el('span', 'sgi-sample', foot, T('小样本 · 各 120 封', name === 'tall' ? '120 emails each' : 'Small sample · 120 each'));
      R.btn = el('span', 'sgi-btn', foot, T('批准', 'Approve'));
      R.tap = el('i', 'sgi-tap', R.btn);
      var ro = R.ro = el('div', 'sgi-ro', foot);
      var track = el('span', 'sgi-ro-tr', ro);
      R.roFill = el('i', '', track);
      R.roStep = ['10%', '50%', '100%'].map(function (s, i) {
        var m = el('span', 'sgi-ro-m', track); m.style.left = [10, 50, 100][i] + '%';
        el('i', '', m); el('b', '', m, s); return m;
      });

      // change B: does worse on its trial and is reverted
      var b = R.b = el('div', 'sgi-card is-b', body);
      var bh = el('div', 'sgi-ch', b);
      var bt = el('div', 'sgi-ct', bh);
      el('span', 'sgi-cn', bt, T('改进 #13', sq ? '#13' : 'Change #13'));
      el('b', '', bt, T('跟进间隔 3 天 → 1 天', sq ? '1-day follow-up' : 'Follow-ups: 3 → 1 day'));
      R.bPill = el('span', 'sgi-pill', bh);
      var m = el('div', 'sgi-metric', b);
      el('span', '', m, T('试用 10% · 退订率', narrow ? 'Trial 10% · unsubscribes' : 'Trial at 10% · unsubscribes'));
      R.bVal = el('b', '', m);
      R.keep = el('div', 'sgi-keep', b);
      ico('undo', R.keep, 13);
      el('span', '', R.keep, T('失败记录已保留，留作修复依据', narrow ? 'Failure record kept for the fix' : 'Failure record kept as the basis for a fix'));
      R.rowH = name === 'small' ? 27 : narrow ? 30 : 27;
      win.style.height = (R.rowH * L.vis) + 'px';
      // each pill keeps the width of its widest state, so a title is laid out once for it and is never cut
      // when the pill changes (「Trial 10%」 → 「Doing worse」)
      reserve(R.aPill, A_PILL); reserve(R.bPill, B_PILL);
    }
    function reserve(p, states) {
      var w = 0;
      for (var i = 0; i < states.length; i++) { p.textContent = states[i]; w = Math.max(w, p.offsetWidth); }
      p.textContent = '';
      p.style.minWidth = w + 'px';
    }

    function tick(t) {
      var u = mod(t, P), out = 1 - seg(u, OUT0, OUT1), inn = seg(u, 0, 0.4);
      // the log scrolls up as runs are added, the newest at the bottom of its window
      var n = LOG.length, vis = L.vis, fade = out * inn;
      for (var k = 0; k < n; k++) {
        var after = 0;
        for (var j = k + 1; j < n; j++) after += ease.out(seg(u, LOG[j][4], LOG[j][4] + 0.5));
        var pk = ease.out(seg(u, LOG[k][4], LOG[k][4] + 0.5)), slot = vis - 1 - after;
        var y = (slot + 0.45 * (1 - pk)) * R.rowH;
        // a run leaving the top of the window is gone by the time two thirds of it have passed the edge
        var o = pk * c01(1.5 * (slot + 1) - 0.5) * c01(vis - slot) * fade;
        css(R.rows[k], 'transform', 'translateY(' + y.toFixed(1) + 'px)');
        css(R.rows[k], 'opacity', o.toFixed(3));
        cl(R.rows[k], 'is-new', u >= LOG[k][4] && u < LOG[k][4] + 2.4);
      }

      // change A
      var pa = ease.out(seg(u, A_IN, A_IN + 0.6));
      css(R.a, 'opacity', (pa * out).toFixed(3));
      css(R.a, 'transform', pa >= 1 ? 'none' : 'translateY(' + (10 * (1 - pa)).toFixed(1) + 'px)');
      R.bars.forEach(function (b, i) {
        var p = ease.out(seg(u, i ? BAR2 : BAR1, (i ? BAR2 : BAR1) + 0.8));
        css(b.f, 'transform', 'scaleX(' + (p * b.max / 8).toFixed(4) + ')');
        put(b.v, 'text', p > 0 ? (b.max * p).toFixed(1) + '%' : '–');
      });
      var aState = u < ASK ? 0 : u < TAP + 0.25 ? 1 : u < DONE ? 2 : 3;
      textSwap(R.aPill, A_PILL[aState]);
      put(R.aPill, 'cls', 'sgi-pill' + ['', ' is-ask', ' is-run', ' is-ok'][aState]);
      var bIn = seg(u, ASK, ASK + 0.4) * (1 - seg(u, R0 - 0.1, R0 + 0.2));
      css(R.btn, 'opacity', bIn.toFixed(3));
      css(R.btn, 'transform', u >= TAP && u < TAP + 0.18 ? 'scale(.93)' : 'none');
      var tp = seg(u, TAP - 0.4, TAP + 0.5);
      css(R.tap, 'opacity', (tp > 0 && tp < 1 ? Math.sin(tp * Math.PI) * 0.85 : 0).toFixed(3));
      css(R.tap, 'transform', 'scale(' + (u < TAP ? 1.3 - 0.3 * ease.out(seg(u, TAP - 0.4, TAP)) : 1 + 0.6 * ease.out(seg(u, TAP, TAP + 0.5))).toFixed(3) + ')');
      css(R.sample, 'opacity', (1 - seg(u, R0 - 0.1, R0 + 0.2)).toFixed(3));
      var pr = seg(u, R0, R0 + 0.3);
      css(R.ro, 'opacity', pr.toFixed(3));
      var fill = 0;
      for (var s = 0; s < 3; s++) {
        var ps = ease.io(seg(u, STEPS[s] - 0.5, STEPS[s]));
        fill += ps * ([10, 40, 50][s]);
        cl(R.roStep[s], 'is-on', u >= STEPS[s]);
      }
      css(R.roFill, 'transform', 'scaleX(' + (fill / 100).toFixed(4) + ')');

      // change B
      var pb = ease.out(seg(u, B_IN, B_IN + 0.6));
      css(R.b, 'opacity', (pb * out).toFixed(3));
      css(R.b, 'transform', pb >= 1 ? 'none' : 'translateY(' + (10 * (1 - pb)).toFixed(1) + 'px)');
      var bad = ease.io(seg(u, B_BAD, B_BAD + 1.0));
      put(R.bVal, 'text', (0.8 + 1.3 * bad).toFixed(1) + '%');
      cl(R.bVal, 'is-bad', bad > 0.5);
      var bState = u < B_BAD + 0.6 ? 0 : u < B_REV ? 1 : 2;
      textSwap(R.bPill, B_PILL[bState]);
      put(R.bPill, 'cls', 'sgi-pill' + ['', ' is-bad', ' is-rev'][bState]);
      var pk2 = ease.out(seg(u, B_KEEP, B_KEEP + 0.5));
      css(R.keep, 'opacity', pk2.toFixed(3));
      css(R.keep, 'transform', 'translateY(' + (6 * (1 - pk2)).toFixed(1) + 'px)');
    }

    return {
      layouts: layouts,
      pick: function (w, h) {
        var r = w / h;
        if (r > 1.26) return 'wide2';
        if (r > 1.12) return 'wide';
        if (r < 0.78) return 'tall';
        if (w >= 350) return 'square';
        if (w >= 324 && h >= 324) return 'small';
        var W = Math.max(260, Math.floor(w)), H = Math.max(260, Math.floor(h)), k = 'small-' + W + 'x' + H;
        if (!layouts[k]) layouts[k] = { w: W, h: H, vis: 1, small: true };
        return k;
      },
      build: build, tick: tick, still: 16.5, cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  return { improve: Improve };
});
