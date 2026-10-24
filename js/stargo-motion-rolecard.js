/* DESK — workforce.html, the collage card under 「网页桌面与 AI 办公」, where the
   owner's D06 still life (a bound report and coffee) was: a mini web desktop
   in which the 报告 AI 员工 totals the week and drafts the weekly report, then
   stops at 待你确认. Nothing is sent or published by itself.

   The stage is the card's own size (scale 1): 'card' on desktop and tablet
   (160 × 205: a desktop with a window and a dock), 'tiny' on phones (84–93 ×
   108–119: the window alone). Demo data, and it says so (演示数据).
   Queued on window.STARGO_SCENES; js/stargo-motion.js runs it. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod;

  // per-frame scales come from a table, so a tick builds no strings
  var SY = [], SX = [];
  for (var q = 0; q <= 100; q++) { SY.push('scaleY(' + q / 100 + ')'); SX.push('scaleX(' + q / 100 + ')'); }

  /* The hero's marquee role cards (static, tools/code-art-people.mjs) own one
     CSS pulse on their running dots; it rests while the marquee is off screen. */
  var hero = document.getElementById('lx-roles');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { hero.classList.toggle('sg-rc-rest', !es[es.length - 1].isIntersecting); }).observe(hero);
  }

  function DeskScene() {
    var P = 10, DRAFT0 = 2.9, DRAFT1 = 6.1, ASK = 6.5;
    var KPI = [
      { k: T('询盘', 'RFQs'), v: 38, a: 0.6 },
      { k: T('报价', 'Quotes'), v: 12, a: 1.1 },
      { k: T('订单', 'Orders'), v: 5, a: 1.6 }
    ];
    var BARS = [0.42, 0.66, 0.5, 0.86, 0.74];
    var D = {
      app: T('报告', 'Reports'), title: T('第 43 周周报', 'Week 43 report'), short: T('周报', 'Weekly'),
      drafting: T('起草中', 'Drafting'), ask: T('待你确认', 'Needs your OK'), askS: T('待你确认', 'Your OK'),
      tag: T('演示数据', 'Demo data')
    };
    var layouts = {}, R;
    function pick(w, h) {
      var k = w >= 130 && h >= 160 ? 'card' : 'tiny';
      var W = Math.floor(Math.max(k === 'card' ? 130 : 70, Math.min(k === 'card' ? 240 : 130, w)));
      var H = Math.floor(Math.max(k === 'card' ? 160 : 90, Math.min(k === 'card' ? 300 : 170, h)));
      var name = k + '-' + W + 'x' + H;
      if (!layouts[name]) layouts[name] = { w: W, h: H, kind: k };
      return name;
    }
    function build(stage, L) {
      var card = L.kind === 'card', W = L.w, H = L.h;
      R = { stage: stage, kpi: [], bars: [], lines: [] };
      stage.className = 'sg-mo-stage sg-desk is-' + L.kind;
      var m = card ? 7 : 0, dockH = card ? 20 : 0;
      var win = el('div', 'sg-desk-win', stage);
      var s = win.style; s.left = m + 'px'; s.top = m + 'px'; s.width = (W - 2 * m) + 'px'; s.height = (H - 2 * m - dockH) + 'px';
      var bar = el('div', 'sg-desk-bar', win);
      var dots = el('span', 'sg-desk-dots', bar); el('i', '', dots); el('i', '', dots); el('i', '', dots);
      if (card) el('b', '', bar, D.app);
      el('span', 'sg-desk-tag', bar, D.tag);
      var body = el('div', 'sg-desk-body', win);
      el('div', 'sg-desk-title', body, card ? D.title : D.short);
      var host = body; // the card sets the week's numbers beside the chart, a phone shows the chart alone
      if (card) {
        host = el('div', 'sg-desk-row', body);
        var kl = el('div', 'sg-desk-kpis', host);
        KPI.forEach(function (k) {
          var r = el('div', 'sg-desk-kpi', kl); el('span', '', r, k.k);
          R.kpi.push({ v: el('b', '', r), n: -1 });
        });
      }
      var ch = el('div', 'sg-desk-chart', host);
      BARS.forEach(function (v) { var b = el('i', '', ch); R.bars.push({ e: b, v: v }); });
      if (card) {
        var ls = el('div', 'sg-desk-lines', body);
        [1, 0.82, 0.58].forEach(function (w) { var l = el('i', '', ls); l.style.width = (w * 100) + '%'; R.lines.push(l); });
      }
      R.chip = el('div', 'sg-desk-chip', body);
      el('i', '', R.chip);
      R.chipT = el('span', '', R.chip);
      if (card) {
        var dock = el('div', 'sg-desk-dock', stage);
        dock.style.top = (H - dockH - 2) + 'px';
        for (var i = 0; i < 5; i++) cl(el('i', '', dock), 'is-on', i === 2);
      }
    }
    function tick(t) {
      var tau = mod(t, P), i;
      cl(R.stage, 'is-clear', tau >= P - 0.6 || tau < 0.3);
      for (i = 0; i < R.kpi.length; i++) {
        var k = KPI[i], n = Math.round(k.v * ease.out(seg(tau, k.a, k.a + 1.1)));
        if (R.kpi[i].n !== n) { R.kpi[i].n = n; put(R.kpi[i].v, 'text', String(n)); }
      }
      for (i = 0; i < R.bars.length; i++) {
        put(R.bars[i].e, '-transform', SY[Math.round(100 * R.bars[i].v * ease.out(seg(tau, 1.2 + i * 0.25, 2.2 + i * 0.25)))]);
      }
      for (i = 0; i < R.lines.length; i++) {
        put(R.lines[i], '-transform', SX[Math.round(100 * ease.io(seg(tau, DRAFT0 + i * 1.05, DRAFT0 + 1.05 + i * 1.05)))]);
      }
      var ask = tau >= ASK, pct = Math.round(100 * seg(tau, 0.4, DRAFT1));
      var key = ask ? -1 : R.lines.length ? pct : 0;
      if (R.key !== key) {
        R.key = key;
        put(R.chipT, 'text', ask ? (R.lines.length ? D.ask : D.askS) : R.lines.length ? D.drafting + ' ' + pct + '%' : D.drafting);
        if (ask && R.chip.animate) R.chip.animate([{ transform: 'scale(.92)' }, { transform: 'scale(1.06)', offset: 0.55 }, { transform: 'none' }], { duration: 440, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      cl(R.chip, 'is-wait', ask);
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, start: 0, still: 8, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  return { deskReport: DeskScene };
});
