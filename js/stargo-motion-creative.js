/* CREATIVE — the portrait beside 「图片 / 视频」 (capabilities #story-5, the accordion of seven
   topics; it was the owner's AI photograph c08-product-references), drawn in code.

   Three reference photos of one 48V pack go in; the screen makes a white-background main image,
   a warehouse scene and the storyboard of a 15-second video, one after another (each canvas
   resolves under a lifting veil); each lands in a review queue as 待审核, and a person's tap passes
   them. Nothing is published by the scene: the last line says publishing is still yours. The words
   follow the topics' own copy (参考图 → 白底主图、场景图; 脚本、分镜 → 成片经人工审核后再发布).

   Runs like js/stargo-motion-sales.js: queued on window.STARGO_SCENES, tick(t) a pure function of
   time, `still` the reduced-motion frame; the stage is cut to the host's shape (portrait from
   tablets up, nearly square on phones, where it is drawn at scale ~1 so no text is under 12 CSS px).
   Styles: css/stargo-motion-creative.css. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, typed = K.typed;
  var serial = 0;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function arrive(e, p, dy) {
    if (p <= 0) { css(e, 'opacity', '0'); return; }
    if (p >= 1) { css(e, 'opacity', '1'); css(e, 'transform', 'none'); return; }
    css(e, 'opacity', p.toFixed(3));
    css(e, 'transform', 'translate3d(0,' + ((1 - p) * (dy || 8)).toFixed(2) + 'px,0)');
  }
  var CHECK = 'M5 12.5l4.5 4.5L19 7.5', PLAY = 'M9 7.5v9l7-4.5z';
  var LINE0 = T('长寿命磷酸铁锂，3000 次以上循环', 'Long-life LiFePO4, 3,000+ cycles');
  function mini(d, parent, size) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: 'sg-ico' }, parent);
    sv('path', { d: d, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }

  var FONT = 'Inter, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  function txt(parent, x, y, size, s, a) {
    var e = sv('text', { x: x, y: y, 'font-size': size, 'font-family': FONT, fill: '#f4eee8' }, parent);
    for (var k in a) e.setAttribute(k, a[k]);
    e.textContent = s;
    return e;
  }
  /* The pack, drawn once per picture: a dark LiFePO4 case in three-quarter view, its handle, two
     terminals and its nameplate (model, chemistry, the spec row and the marks it ships with). `id`
     keeps each picture's gradients its own. */
  function pack(parent, id, x, y, s, light) {
    var g = sv('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')' }, parent);
    var defs = sv('defs', {}, g);
    function lg(n, a, b, x2, y2) { var gr = sv('linearGradient', { id: id + n, x1: 0, y1: 0, x2: x2, y2: y2 }, defs); sv('stop', { offset: 0, 'stop-color': a }, gr); sv('stop', { offset: 1, 'stop-color': b }, gr); return 'url(#' + id + n + ')'; }
    var sh = sv('radialGradient', { id: id + 's' }, defs);
    sv('stop', { offset: 0, 'stop-color': '#000', 'stop-opacity': light ? '.3' : '.6' }, sh);
    sv('stop', { offset: 1, 'stop-color': '#000', 'stop-opacity': '0' }, sh);
    sv('ellipse', { cx: 92, cy: 128, rx: 132, ry: 18, fill: 'url(#' + id + 's)' }, g);
    sv('path', { d: 'M0 18 36-6h168l-36 24z', fill: lg('t', '#4b4a50', '#2a292e', 1, 1) }, g);
    sv('path', { d: 'M168 18l36-24v98l-36 26z', fill: lg('r', '#202024', '#111114', 1, 0) }, g);
    sv('rect', { y: 18, width: 168, height: 100, fill: lg('f', '#323136', '#18171a', 0, 1) }, g);
    sv('rect', { y: 18, width: 168, height: 1.5, fill: '#fff', opacity: '.22' }, g);
    sv('path', { d: 'M58 10q0-10 10-10h32q10 0 10 10', fill: 'none', stroke: '#151417', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    [[28, '#d2533f'], [140, '#1b1b1e']].forEach(function (tm) {
      sv('rect', { x: tm[0] - 7, y: 2, width: 14, height: 9, rx: 2, fill: tm[1] }, g);
    });
    sv('rect', { x: 20, y: 42, width: 128, height: 54, rx: 5, fill: '#101012', stroke: '#2d2c31' }, g);
    sv('rect', { x: 20, y: 42, width: 5, height: 54, rx: 2, fill: '#ec6f10' }, g);
    txt(g, 32, 59, 13, '48V 100Ah', { 'font-weight': 700, 'letter-spacing': '-.2' });
    txt(g, 32, 69, 6.5, T('LiFePO4 · 磷酸铁锂', 'LiFePO4 BATTERY'), { opacity: '.6', 'letter-spacing': '.3' });
    txt(g, 142, 56, 6, 'CE', { 'text-anchor': 'end', 'font-weight': 700, opacity: '.7' });
    txt(g, 142, 64, 5.5, 'UN38.3', { 'text-anchor': 'end', opacity: '.55' });
    sv('path', { d: 'M32 76.5h110M68 79v12M104 79v12', stroke: '#f4eee8', 'stroke-opacity': '.16', 'stroke-width': 0.7 }, g);
    [['51.2V', 32], ['100Ah', 72], ['5.12kWh', 108]].forEach(function (c) { txt(g, c[1], 88, 7, c[0], { 'font-weight': 600, opacity: '.8' }); });
    return g;
  }
  // one picture on a 400 × 300 board: the white main image, the warehouse scene, the plate close-up, the end card
  function shot(parent, kind, id) {
    var g = sv('g', {}, parent), defs = sv('defs', {}, g);
    function lin(n, stops) { var gr = sv('linearGradient', { id: id + n, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); stops.forEach(function (s) { sv('stop', { offset: s[0], 'stop-color': s[1] }, gr); }); return 'url(#' + id + n + ')'; }
    if (kind === 'studio' || kind === 'close') {
      sv('rect', { width: 400, height: 300, fill: lin('a', [[0, '#f7f5f2'], [0.6, '#ece8e2'], [1, '#d8d2ca']]) }, g);
      sv('ellipse', { cx: 200, cy: 236, rx: 190, ry: 34, fill: '#fff', opacity: '.6' }, g);
      // the close-up keeps the whole plate inside a portrait crop of the board (233 of its 400 wide)
      if (kind === 'close') pack(g, id + 'p', 49, 26, 1.8, true);
      else pack(g, id + 'p', 112, 110, 0.98, true);
    } else if (kind === 'ware') {
      sv('rect', { width: 400, height: 300, fill: lin('a', [[0, '#2b2019'], [0.68, '#15100d'], [1, '#0d0a08']]) }, g);
      for (var i = 0; i < 5; i++) {
        var x = 6 + i * 80;
        sv('rect', { x: x, y: 36, width: 70, height: 150, fill: '#1d1712', stroke: '#2c231b' }, g);
        for (var j = 0; j < 3; j++) sv('rect', { x: x + 6, y: 46 + j * 46, width: 58, height: 30, rx: 2, fill: j % 2 ? '#3a2c20' : '#30251c' }, g);
      }
      var rg = sv('radialGradient', { id: id + 'l' }, defs);
      sv('stop', { offset: 0, 'stop-color': '#ffc27a', 'stop-opacity': '.5' }, rg);
      sv('stop', { offset: 1, 'stop-color': '#ffc27a', 'stop-opacity': '0' }, rg);
      [80, 220, 360].forEach(function (cx) { sv('ellipse', { cx: cx, cy: 18, rx: 110, ry: 90, fill: 'url(#' + id + 'l)' }, g); });
      sv('rect', { y: 190, width: 400, height: 110, fill: lin('f', [[0, '#1b1511'], [1, '#0b0907']]) }, g);
      pack(g, id + 'p', 112, 130, 0.98, false);
    } else {
      sv('rect', { width: 400, height: 300, fill: lin('a', [[0, '#1d1612'], [1, '#100c0a']]) }, g);
      // the end card: the product and its selling line (the scene's own first line), and its marks
      sv('rect', { x: 176, y: 96, width: 48, height: 3, rx: 1.5, fill: '#ec6f10' }, g);
      txt(g, 200, 146, 36, '48V 100Ah', { 'text-anchor': 'middle', 'font-weight': 700, 'letter-spacing': '-.5' });
      txt(g, 200, 178, 16, T('长寿命磷酸铁锂', 'Long-life LiFePO4'), { 'text-anchor': 'middle', opacity: '.8' });
      txt(g, 200, 200, 16, T('3000 次以上循环', '3,000+ cycles'), { 'text-anchor': 'middle', opacity: '.8' });
      txt(g, 200, 236, 11, 'CE · UN38.3 · MSDS', { 'text-anchor': 'middle', opacity: '.45', 'letter-spacing': '1' });
    }
    return g;
  }
  function art(parent, kind, id, box) {
    var s = sv('svg', { viewBox: box || '0 0 400 300', preserveAspectRatio: 'xMidYMid slice', width: '100%', height: '100%', class: 'sgc-art' }, parent);
    shot(s, kind, id);
    return s;
  }

  function CreativeScene() {
    var sid = 'sgc' + (++serial);
    var OUT = [
      { key: 'studio', name: T('白底主图', 'Main image'), meta: T('主图 · 白底 1:1', 'Main · white 1:1'), n: '× 3' },
      { key: 'ware', name: T('场景图 · 仓库', 'Warehouse scene'), meta: T('场景图 · 16:9', 'Scene · 16:9'), n: '× 2' },
      { key: 'board', name: T('短视频分镜', 'Video storyboard'), meta: T('短视频 · 15 秒 · 4 个镜头', 'Video · 15 s · 4 shots'), n: '15s' }
    ];
    var SHOT = [T('推近 0–3s', 'Push-in 0–3s'), T('铭牌 3–6s', 'Plate 3–6s'), T('仓库 6–11s', 'Warehouse 6–11s'), T('片尾 11–15s', 'End 11–15s')];
    var SHOT_S = ['0–3s', '3–6s', '6–11s', '11–15s'];   // a phone's four shots in one row: the times only
    // the selling line in the visitor's language first, then three more (the English page stays in Latin script)
    var LANG = K.ZH ? [['中文', LINE0], ['EN', 'Long-life LiFePO4, 3,000+ cycles'], ['ES', 'LiFePO4: más de 3.000 ciclos'], ['DE', 'LiFePO4: über 3.000 Zyklen']]
      : [['EN', LINE0], ['ES', 'LiFePO4: más de 3.000 ciclos'], ['DE', 'LiFePO4: über 3.000 Zyklen'], ['FR', 'LiFePO4 : plus de 3 000 cycles']];
    var G = 4.4, N = OUT.length, REVIEW = N * G + 0.2, TAP = REVIEW + 0.9, P = 19.5, OUT0 = 18.6, OUT1 = 19.3;
    var DROP = 0.4, LIFT0 = 0.5, LIFT1 = 2.0;
    var layouts = {}, R, kind;

    function pick(w, h) {
      // the portrait from 480 wide, and a tall column from 420 (992–1279 gives it 424–478 × 890–955), at its
      // own size; the stage takes the host's pixels, so it is drawn at scale 1
      if (w >= 480 || (w >= 420 && h > w * 1.6)) { var W = clamp(Math.floor(w), 420, 640); return lay('big', W, clamp(Math.floor(W * h / w), 560, 1100)); }
      return lay('small', clamp(Math.floor(w), 296, 400), clamp(Math.floor(h), 300, 440));
    }
    function lay(k, w, h) { var key = k + '-' + w + 'x' + h; if (!layouts[key]) layouts[key] = { w: w, h: h, kind: k }; return key; }

    function build(stage, L) {
      kind = L.kind; R = {};
      var big = kind === 'big';
      stage.className = 'sg-mo-stage sgc is-' + kind;
      var bar = el('div', 'sgc-bar', stage);
      var mk = el('span', 'sg-app-mark', bar); K.icon('spark', mk, big ? 14 : 12);
      el('b', '', bar, T('AI 创作', 'AI Creative'));
      if (big && L.w >= 520) el('span', 'sgc-crumb', bar, T('产品图与视频', 'Images & video'));
      el('span', 'sgc-tagline', bar, big ? T('动态示意 · 演示数据', 'Illustrative motion · demo data') : T('演示数据', 'Demo data'));
      R.pane = el('div', 'sgc-pane', stage);
      // the references
      var refs = el('div', 'sgc-refs', R.pane);
      var rk = el('div', 'sgc-refs-k', refs);
      el('b', '', rk, T('参考图', 'References'));
      el('span', '', rk, T('同一款 48V 100Ah', 'One 48V 100Ah pack'));
      var rr = el('div', 'sgc-refs-r', refs);
      R.refs = [0, 1, 2].map(function (i) {
        var th = el('span', 'sgc-ref', rr);
        art(th, ['studio', 'studio', 'close'][i], sid + 'r' + i);
        if (i === 1) th.firstChild.style.transform = 'scaleX(-1)';
        return th;
      });
      R.flow = el('span', 'sgc-flow', rr);
      mini('M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5', R.flow, 14);
      R.flowT = el('span', '', R.flow, '');
      // under 340 wide the row has room for the count only; the canvas says "Generating" itself
      R.tight = !big && L.w < 340;
      // the canvas: the pictures stacked; a veil drops over the old one and lifts off the new one. Only the
      // veil's own fill is scaled; its bright edge is moved and its label stays put, so nothing is squashed.
      var cv = el('div', 'sgc-canvas', R.pane);
      R.boards = [art(cv, 'studio', sid + 'b0'), art(cv, 'ware', sid + 'b1'), el('div', 'sgc-shots', cv)];
      SHOT.forEach(function (lab, i) {
        var c = el('div', 'sgc-shot', R.boards[2]);
        art(c, ['studio', 'close', 'ware', 'end'][i], sid + 's' + i);
        el('span', '', c, big ? lab : SHOT_S[i]);
      });
      R.veil = el('div', 'sgc-veil', cv);
      R.edge = el('div', 'sgc-edge', cv); el('i', 'sgc-scan', R.edge);
      var vi = R.veilInfo = el('div', 'sgc-veil-i', cv);
      R.veilT = el('span', 'sgc-veil-t', vi, '');
      var vb = el('i', 'sgc-veil-bar', vi); R.veilF = el('i', '', vb);
      R.meta = el('span', 'sgc-meta', cv, '');
      // multilingual selling line, on the portrait only
      if (big) {
        var lg = el('div', 'sgc-langs', R.pane);
        var lr = el('div', 'sgc-langs-r', lg);
        el('span', 'sgc-langs-k', lr, T('卖点 · 多语言', 'Selling line'));
        R.langs = LANG.map(function (l) { return el('span', 'sgc-lang', lr, l[0]); });
        R.langT = el('span', 'sgc-lang-t', lg, '');
      }
      // the review queue
      var q = el('div', 'sgc-queue', R.pane);
      var qh = el('div', 'sgc-q-h', q);
      el('b', '', qh, T('审核队列', 'Review'));
      R.passAll = el('span', 'sg-btn is-primary sgc-pass', qh);
      R.passT = el('span', '', R.passAll, T('通过 3 项', 'Approve 3'));
      var tp = el('i', 'sgc-tap', R.passAll); R.tapDot = el('i', 'sgc-tap-dot', tp); R.tapRing = el('i', 'sgc-tap-ring', tp);
      R.items = OUT.map(function (o) {
        var it = el('div', 'sgc-q', q);
        var th = el('span', 'sgc-q-th is-' + o.key, it);
        if (o.key === 'board') mini(PLAY, th, 14);
        el('b', '', it, o.name);
        el('em', '', it, o.n);
        var st = el('span', 'sgc-st', it, '');
        var ck = el('span', 'sgc-ck', st); mini(CHECK, ck, 11);
        var stT = el('span', '', st, '');
        return { it: it, st: st, t: stT };
      });
      R.note = el('div', 'sgc-note', R.pane, '');
    }

    function tick(t) {
      var tau = mod(t, P), k = Math.min(N - 1, Math.floor(tau / G)), x = tau - k * G;
      css(R.pane, 'opacity', tau < OUT0 ? '1' : (1 - seg(tau, OUT0, OUT1)).toFixed(3));
      // which picture is on the canvas, and the veil over it (scaleY from the top: transform only)
      var gen = tau < N * G;
      var cover = gen ? (x < DROP ? ease.io(x / DROP) : 1 - ease.io(seg(x, LIFT0, LIFT1))) : 0;
      if (gen && k === 0 && tau < DROP) cover = 1;   // the loop opens on the veil, not on the last picture
      var showing = gen && x < DROP ? k - 1 : k;
      if (showing < 0) showing = N - 1;
      var i;
      for (i = 0; i < R.boards.length; i++) css(R.boards[i], 'opacity', i === showing ? '1' : '0');
      css(R.veil, 'transform', 'scaleY(' + cover.toFixed(4) + ')');
      css(R.veil, 'opacity', cover > 0.001 ? '1' : '0');
      css(R.edge, 'transform', 'translate3d(0,' + ((cover - 1) * 100).toFixed(2) + '%,0)');
      css(R.edge, 'opacity', cover > 0.01 && cover < 0.995 ? '1' : '0');
      var pg = gen ? seg(x, LIFT0, LIFT1) : 1;
      css(R.veilInfo, 'opacity', c01((cover - 0.5) / 0.2).toFixed(3));
      put(R.veilT, 'text', T('生成中 ', 'Generating ') + Math.round(100 * pg) + '%');
      css(R.veilF, 'transform', 'scaleX(' + pg.toFixed(3) + ')');
      put(R.meta, 'text', OUT[showing].meta);
      cl(R.meta, 'is-on', !(gen && x < LIFT1));
      // the references feed the canvas while it works
      var busy = gen && x >= DROP && x < LIFT1;
      for (i = 0; i < R.refs.length; i++) cl(R.refs[i], 'is-on', busy && Math.floor((x - DROP) * 3) % 3 === i);
      put(R.flowT, 'text', (R.tight ? '' : busy ? T('正在生成 ', 'Generating ') : T('已生成 ', 'Generated ')) + (gen ? k + 1 : N) + '/3');
      cl(R.flow, 'is-on', busy);
      // the queue: each item appears while it is made, waits for review, then passes with the tap
      var passed = tau >= TAP + 0.1;
      for (i = 0; i < R.items.length; i++) {
        var o = R.items[i], t0 = i * G + DROP, p = ease.out(seg(tau, t0, t0 + 0.4));
        arrive(o.it, p, 6);
        var made = tau >= i * G + LIFT1, ok = passed && tau >= TAP + 0.1 + i * 0.14;
        put(o.t, 'text', ok ? T('已通过', 'Approved') : made ? T('待审核', 'To review') : T('生成中', 'Generating'));
        cl(o.st, 'is-wait', made && !ok);
        cl(o.st, 'is-ok', ok);
        cl(o.it, 'is-on', (gen && k === i && x < LIFT1 + 0.6) || (ok && tau < TAP + 0.9 + i * 0.14));
      }
      var ready = tau >= REVIEW;
      cl(R.passAll, 'is-ready', ready && !passed);
      cl(R.passAll, 'is-press', tau >= TAP - 0.06 && tau < TAP + 0.2);
      cl(R.passAll, 'is-done', passed);
      put(R.passT, 'text', passed ? T('已通过', 'Approved') : T('通过 3 项', 'Approve 3'));
      var tx = tau - TAP, d = tx >= -0.25 && tx < 0.9 ? (tx < 0 ? 1 + tx * 4 : 1 - c01((tx - 0.35) / 0.5)) : 0, rg = tx >= 0 && tx < 0.7 ? ease.out(tx / 0.7) : 0;
      css(R.tapDot, 'opacity', d.toFixed(2));
      css(R.tapRing, 'opacity', rg > 0 ? (0.7 * (1 - rg)).toFixed(2) : '0');
      css(R.tapRing, 'transform', 'scale(' + (0.6 + 1.6 * rg).toFixed(3) + ')');
      put(R.note, 'text', passed ? T('你已通过 · 发布与否仍由你决定', 'Approved by you · publishing is still your call') : ready ? T('3 项待你审核 · 未发布任何内容', '3 items wait for you · nothing published') : T('生成后先进审核队列，不会自动发布', 'Everything waits for review; nothing auto-publishes'));
      cl(R.note, 'is-ok', passed);
      if (R.langs) {
        var li = Math.floor(tau / 2.4) % LANG.length;
        for (i = 0; i < R.langs.length; i++) cl(R.langs[i], 'is-on', i === li);
        put(R.langT, 'text', typed(LANG[li][1], seg(tau - Math.floor(tau / 2.4) * 2.4, 0.1, 1.2)));
      }
    }
    return { layouts: layouts, pick: pick, build: build, tick: tick, still: TAP + 1.6, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  return { creative: CreativeScene };
});
