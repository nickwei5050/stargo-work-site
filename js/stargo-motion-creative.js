/* CREATIVE — the portrait beside 「图片 / 视频」 (capabilities #story-5, the accordion of seven
   topics; it was the owner's AI photograph c08-product-references), drawn in code.

   Three reference photos of one 48V pack go in; the screen makes a white-background main image,
   a warehouse scene and the storyboard of a 15-second video, one after another (each canvas
   resolves under a lifting veil); each lands in a review queue as 待审核, and a person's tap passes
   them. Nothing is published by the scene: the last line says publishing is still yours. The words
   follow the topics' own copy (参考图 → 白底主图、场景图; 脚本、分镜 → 成片经人工审核后再发布).

   Runs like js/stargo-motion-sales.js: queued on window.STARGO_SCENES, tick(t) a pure function of
   time, `still` the reduced-motion frame; the stage is cut to the host's shape (portrait from
   tablets up, nearly square on phones) and drawn at scale ~1, so the interface's own text is never
   under 12 CSS px. The battery's print follows the same rule: type only where it prints large enough
   (the model on a phone is set as 48V over 100Ah), bars where it would not (thumbnails, small shots);
   once a picture is fitted, a print whose smallest type would land under 12 CSS px steps down
   (fitPrint: full → title → bars, stack → bars; the end card's marks → outlines).
   Styles: css/stargo-motion-creative.css (prefix sgc-; the crew scenes on the same page use sgw-). */
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
  function bar(parent, x, y, w, h, o) { return sv('rect', { x: x, y: y, width: w, height: h, rx: h / 2, fill: '#f4eee8', opacity: o }, parent); }

  /* Everything the pictures repeat is drawn once per stage, in one hidden <defs>, and placed with <use>:
     the gradients, the three backdrops and the pack, a dark LiFePO4 case in three-quarter view (handle,
     two terminals, nameplate). The nameplate comes in four prints over the same body:
       full   model, chemistry, marks and spec row as type (a large canvas, where they print at ~12 px)
       title  the model as type, the fine print as bars (the close-up in a storyboard cell)
       stack  48V over 100Ah, set large, the fine print as bars (phones: the canvas and the close-up)
       bars   all of it as bars (thumbnails, where type would print as specks)
     Each picture's viewBox is fitted to its own box around the part that must show (SAFE, fitBox), so
     nothing that matters is cropped whatever the box's shape; the backdrops run past the 400 × 300 board
     to fill what is left. */
  var SAFE = { studio: [90, 94, 314, 246], ware: [90, 114, 314, 262], close: [74, 90, 326, 212], closeN: [80, 92, 232, 210], end: [80, 72, 320, 250], endN: [128, 72, 272, 236] };
  function defs(stage, id) {
    var d = sv('defs', {}, sv('svg', { class: 'sgc-defs', width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' }, stage));
    function grad(tag, n, at, stops) {
      var g = sv(tag, at, d); g.id = id + n;
      for (var i = 0; i < stops.length; i++) { var e = sv('stop', { offset: stops[i][0], 'stop-color': stops[i][1] }, g); if (stops[i][2]) e.setAttribute('stop-opacity', stops[i][2]); }
    }
    function g(n) { var e = sv('g', {}, d); e.id = id + n; return e; }
    function U(y1, y2) { return { gradientUnits: 'userSpaceOnUse', x1: 0, y1: y1, x2: 0, y2: y2 }; }
    function f(n) { return 'url(#' + id + n + ')'; }
    grad('linearGradient', 't', { x1: 0, y1: 0, x2: 1, y2: 1 }, [[0, '#4b4a50'], [1, '#2a292e']]);
    grad('linearGradient', 'r', { x1: 0, y1: 0, x2: 1, y2: 0 }, [[0, '#202024'], [1, '#111114']]);
    grad('linearGradient', 'f', { x1: 0, y1: 0, x2: 0, y2: 1 }, [[0, '#323136'], [1, '#18171a']]);
    grad('radialGradient', 'sd', {}, [[0, '#000', '.6'], [1, '#000', '0']]);
    grad('radialGradient', 'sl', {}, [[0, '#000', '.3'], [1, '#000', '0']]);
    grad('radialGradient', 'lamp', {}, [[0, '#ffc27a', '.5'], [1, '#ffc27a', '0']]);
    grad('linearGradient', 'ws', U(0, 300), [[0, '#f7f5f2'], [0.6, '#ece8e2'], [1, '#d8d2ca']]);
    grad('linearGradient', 'wb', U(0, 300), [[0, '#2b2019'], [0.68, '#15100d'], [1, '#0d0a08']]);
    grad('linearGradient', 'wf', U(190, 300), [[0, '#1b1511'], [1, '#0b0907']]);
    grad('linearGradient', 'we', U(0, 300), [[0, '#1d1612'], [1, '#100c0a']]);
    var BIG = { x: -400, y: -300, width: 1200, height: 900 };
    // the backdrops: the studio sweep, the warehouse aisle, the end card's ground
    var bs = g('bgS'); BIG.fill = f('ws'); sv('rect', BIG, bs);
    sv('ellipse', { cx: 200, cy: 236, rx: 190, ry: 34, fill: '#fff', opacity: '.6' }, bs);
    var bw = g('bgW'); BIG.fill = f('wb'); sv('rect', BIG, bw);
    for (var i = 0; i < 5; i++) {
      var x = 6 + i * 80;
      sv('rect', { x: x, y: 36, width: 70, height: 150, fill: '#1d1712', stroke: '#2c231b' }, bw);
      for (var j = 0; j < 3; j++) sv('rect', { x: x + 6, y: 46 + j * 46, width: 58, height: 30, rx: 2, fill: j % 2 ? '#3a2c20' : '#30251c' }, bw);
    }
    [80, 220, 360].forEach(function (cx) { sv('ellipse', { cx: cx, cy: 18, rx: 110, ry: 90, fill: f('lamp') }, bw); });
    sv('rect', { x: -400, y: 190, width: 1200, height: 410, fill: f('wf') }, bw);
    BIG.fill = f('we'); sv('rect', BIG, g('bgE'));
    // the pack's body, with an empty nameplate
    var pk = g('pk');
    sv('path', { d: 'M0 18 36-6h168l-36 24z', fill: f('t') }, pk);
    sv('path', { d: 'M168 18l36-24v98l-36 26z', fill: f('r') }, pk);
    sv('rect', { y: 18, width: 168, height: 100, fill: f('f') }, pk);
    sv('rect', { y: 18, width: 168, height: 1.5, fill: '#fff', opacity: '.22' }, pk);
    sv('path', { d: 'M58 10q0-10 10-10h32q10 0 10 10', fill: 'none', stroke: '#151417', 'stroke-width': 6, 'stroke-linecap': 'round' }, pk);
    sv('rect', { x: 21, y: 2, width: 14, height: 9, rx: 2, fill: '#d2533f' }, pk);
    sv('rect', { x: 133, y: 2, width: 14, height: 9, rx: 2, fill: '#1b1b1e' }, pk);
    sv('rect', { x: 20, y: 42, width: 128, height: 54, rx: 5, fill: '#101012', stroke: '#2d2c31' }, pk);
    sv('rect', { x: 20, y: 42, width: 5, height: 54, rx: 2, fill: '#ec6f10' }, pk);
    var RULE = { d: 'M32 76.5h110M68 79v12M104 79v12', stroke: '#f4eee8', 'stroke-opacity': '.16', 'stroke-width': 0.7 };
    // the prints: the model (type or a bar), the fine print (type or bars), and the phones' stacked plate
    txt(g('pt'), 32, 59, 13, '48V 100Ah', { 'font-weight': 700, 'letter-spacing': '-.2' });
    bar(g('ptb'), 32, 51, 60, 8, '.85');
    var ps = g('ps');
    txt(ps, 32, 70.5, 8, T('LiFePO4 · 磷酸铁锂', 'LiFePO4 BATTERY'), { opacity: '.6', 'letter-spacing': '.2' });
    txt(ps, 142, 56, 8, 'CE', { 'text-anchor': 'end', 'font-weight': 700, opacity: '.7' });
    txt(ps, 142, 65.5, 7.5, 'UN38.3', { 'text-anchor': 'end', opacity: '.55' });
    sv('path', RULE, ps);
    [['51.2V', 32], ['100Ah', 72], ['5.12kWh', 108]].forEach(function (c) { txt(ps, c[1], 89.5, 8.5, c[0], { 'font-weight': 600, opacity: '.8' }); });
    var pb = g('psb');
    bar(pb, 32, 65.5, 46, 3.5, '.38'); bar(pb, 128, 50, 14, 5, '.5'); bar(pb, 120, 59, 22, 3.5, '.35');
    sv('path', RULE, pb);
    bar(pb, 32, 83.5, 24, 4.5, '.55'); bar(pb, 72, 83.5, 22, 4.5, '.55'); bar(pb, 108, 83.5, 30, 4.5, '.55');
    var st = g('pst');
    txt(st, 32, 65, 22, '48V', { 'font-weight': 700, 'letter-spacing': '-.3' });
    txt(st, 32, 86, 17, '100Ah', { 'font-weight': 600, opacity: '.92' });
    bar(st, 104, 50, 38, 4, '.5'); bar(st, 104, 58, 26, 3.5, '.32');
    sv('path', { d: 'M104 67.5h38', stroke: '#f4eee8', 'stroke-opacity': '.16', 'stroke-width': 0.7 }, st);
    bar(st, 104, 74, 30, 4.5, '.55'); bar(st, 104, 82, 22, 4.5, '.55');
  }
  var PRINT = { full: ['pt', 'ps'], title: ['pt', 'psb'], stack: ['pst'], bars: ['ptb', 'psb'] };
  // each print's smallest type (pack units) and the print it steps down to
  var PRINT_MIN = { full: 7.5, title: 13, stack: 17, bars: 0 }, PRINT_DOWN = { full: 'title', title: 'bars', stack: 'bars' };
  var MIN_PX = 12.2;
  function use(parent, id) { return sv('use', { href: '#' + id }, parent); }
  var packs = [];   // the current shot()'s packs: [print group, scale, print, id]
  function printInto(g, id, print) { g.textContent = ''; PRINT[print].forEach(function (n) { use(g, id + n); }); }
  function pack(parent, id, x, y, s, light, print) {
    var g = sv('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')' }, parent);
    sv('ellipse', { cx: 92, cy: 128, rx: 132, ry: 18, fill: 'url(#' + id + (light ? 'sl' : 'sd') + ')' }, g);
    use(g, id + 'pk');
    var pg = sv('g', {}, g);
    printInto(pg, id, print);
    packs.push([pg, s, print, id]);
  }
  // k: screen px per board unit
  function fitPrint(list, k) {
    list.forEach(function (p) {
      var pr = p[2];
      while (PRINT_MIN[pr] && PRINT_MIN[pr] * p[1] * k < MIN_PX) pr = PRINT_DOWN[pr];
      if (pr !== p[2]) printInto(p[0], p[3], pr);
    });
  }
  // one picture on the 400 × 300 board: the white main image, the warehouse scene, the plate close-up, the end card
  function shot(parent, kind, id, print, narrow) {
    if (kind === 'studio' || kind === 'close') {
      use(parent, id + 'bgS');
      if (kind === 'close') pack(parent, id, 49, 26, 1.8, true, print);
      else pack(parent, id, 102, 112, 0.98, true, print);
    } else if (kind === 'ware') {
      use(parent, id + 'bgW');
      pack(parent, id, 102, 132, 0.98, false, print);
    } else {
      // the end card: the product and its selling line (the scene's own first line) and its marks; a phone's
      // narrow cell sets the model on two lines and draws the rest as bars
      use(parent, id + 'bgE');
      var mid = { 'text-anchor': 'middle', 'font-weight': 700, 'letter-spacing': '-.5' };
      if (narrow) {
        sv('rect', { x: 180, y: 92, width: 40, height: 3, rx: 1.5, fill: '#ec6f10' }, parent);
        txt(parent, 200, 150, 50, '48V', mid);
        txt(parent, 200, 190, 36, '100Ah', { 'text-anchor': 'middle', 'font-weight': 600, opacity: '.9' });
        bar(parent, 152, 206, 96, 5, '.4'); bar(parent, 166, 217, 68, 5, '.3');
        [150, 186, 222].forEach(function (x) { sv('rect', { x: x, y: 228, width: 28, height: 8, rx: 2, fill: 'none', stroke: '#f4eee8', 'stroke-opacity': '.3' }, parent); });
      } else {
        sv('rect', { x: 176, y: 88, width: 48, height: 3, rx: 1.5, fill: '#ec6f10' }, parent);
        txt(parent, 200, 140, 40, '48V 100Ah', mid);
        txt(parent, 200, 176, 22, T('长寿命磷酸铁锂', 'Long-life LiFePO4'), { 'text-anchor': 'middle', opacity: '.8' });
        txt(parent, 200, 204, 22, T('3000 次以上循环', '3,000+ cycles'), { 'text-anchor': 'middle', opacity: '.8' });
        var fine = txt(parent, 200, 238, 19.5, 'CE · UN38.3 · MSDS', { 'text-anchor': 'middle', opacity: '.45', 'letter-spacing': '1' });
        var fb = sv('g', { display: 'none' }, parent);
        [140, 182, 224].forEach(function (x) { sv('rect', { x: x, y: 225, width: 36, height: 16, rx: 3, fill: 'none', stroke: '#f4eee8', 'stroke-opacity': '.3' }, fb); });
        packs.push([fine, fb, 'end']);
      }
    }
  }
  // a box of the picture box's own shape: the largest that fits a frame of fw × fh (the whole board, the
  // main image's tighter frame, or none for a close crop), grown until it holds `safe`, and kept on the
  // 400 × 300 board where it can be
  function fitBox(safe, w, h, fw, fh) {
    var A = w > 8 && h > 8 ? w / h : 4 / 3, sw = safe[2] - safe[0], sh = safe[3] - safe[1], bw, bh;
    if (!fh || A >= fw / fh) { bw = fw; bh = fw / A; } else { bh = fh; bw = fh * A; }
    if (bw < sw) { bw = sw; bh = sw / A; }
    if (bh < sh) { bh = sh; bw = sh * A; }
    function place(lo, hi, size, board) {
      var c = (lo + hi) / 2 - size / 2;
      if (size > board) return c;
      return clamp(clamp(c, Math.max(0, hi - size), Math.min(board - size, lo)), 0, board - size);
    }
    return [place(safe[0], safe[2], bw, 400), place(safe[1], safe[3], bh, 300), bw, bh];
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
    var layouts = {}, R, kind, arts;
    // a picture in its box: drawn now, its viewBox fitted once the stage is laid out (build's last step)
    // the frames a picture is cut from: the whole board, the main image's (the pack larger), a storyboard
    // cell's, and a phone cell's closest crop
    var FRAME = { board: [400, 300], main: [320, 240], cell: [270, 200], tight: [0, 0] };
    function art(parent, k, print, frame, safe, narrow) {
      var s = sv('svg', { preserveAspectRatio: 'xMidYMid slice', width: '100%', height: '100%', class: 'sgc-art' }, parent);
      packs = [];
      shot(s, k, sid, print, narrow);
      arts.push([s, parent, SAFE[safe || k], FRAME[frame], parent.className === 'sgc-shot' ? (kind === 'big' ? 30 : 22) : 0, packs]);
      return s;
    }

    function pick(w, h) {
      // the portrait from 480 wide, and a tall column from 420 (992–1279 gives it 424–478 × 890–955), at its
      // own size; the stage takes the host's pixels, so it is drawn at scale 1
      if (w >= 480 || (w >= 420 && h > w * 1.6)) { var W = clamp(Math.floor(w), 420, 640); return lay('big', W, clamp(Math.floor(W * h / w), 560, 1100)); }
      return lay('small', clamp(Math.floor(w), 296, 400), clamp(Math.floor(h), 300, 440));
    }
    function lay(k, w, h) { var key = k + '-' + w + 'x' + h; if (!layouts[key]) layouts[key] = { w: w, h: h, kind: k }; return key; }

    function build(stage, L) {
      kind = L.kind; R = {}; arts = [];
      var big = kind === 'big';
      // a short portrait (a tablet's, a wide desktop's) tightens its rows so the canvas keeps its height
      stage.className = 'sg-mo-stage sgc is-' + kind + (big && L.h < 800 ? ' is-short' : '');
      defs(stage, sid);
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
        art(th, ['studio', 'studio', 'close'][i], 'bars', 'board');
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
      R.boards = [art(cv, 'studio', big ? 'full' : 'stack', 'main'), art(cv, 'ware', big ? 'full' : 'stack', 'main'), el('div', 'sgc-shots', cv)];
      SHOT.forEach(function (lab, i) {
        var c = el('div', 'sgc-shot', R.boards[2]);
        // the four shots: a push-in, the plate close up, the aisle (wide on a big board), the end card
        var fr = big ? 'cell' : 'tight';
        if (i === 1) art(c, 'close', big ? 'title' : 'stack', fr, big ? 'close' : 'closeN');
        else if (i === 3) art(c, 'end', null, fr, big ? 'end' : 'endN', !big);
        else art(c, i ? 'ware' : 'studio', 'bars', i && big ? 'board' : fr);
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
        var wd = el('i', 'sgc-wd', st);   // breathes while it waits for review
        var ck = el('span', 'sgc-ck', st); mini(CHECK, ck, 11);
        var stT = el('span', '', st, '');
        return { it: it, st: st, t: stT, wd: wd };
      });
      R.note = el('div', 'sgc-note', R.pane, '');
      // a canvas much wider than tall lays the four shots in one row; then every box is measured first and
      // every viewBox written after
      if (big && cv.clientWidth > 2.1 * cv.clientHeight) cl(R.boards[2], 'is-row', true);
      var box = arts.map(function (a) { return [a[1].clientWidth, a[1].clientHeight]; });
      arts.forEach(function (a, i) {
        // a cell's label takes its foot: the picture is fitted above it, and its ground runs on beneath
        var w = box[i][0], h = box[i][1] - a[4], b = fitBox(a[2], w, h, a[3][0], a[3][1]);
        if (a[4] && w > 8 && h > 8) b[3] += a[4] * b[2] / w;
        a[0].setAttribute('viewBox', b.map(function (v) { return v.toFixed(1); }).join(' '));
        // the prints at the scale the picture now has (slice: the larger ratio)
        var k = w > 8 && h > 8 ? Math.max(w / b[2], box[i][1] / b[3]) : 0;
        fitPrint(a[5].filter(function (p) { return p[2] !== 'end'; }), k);
        a[5].forEach(function (p) { if (p[2] === 'end' && 19.5 * k < MIN_PX) { p[0].setAttribute('display', 'none'); p[1].removeAttribute('display'); } });
      });
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
        if (made && !ok) css(o.wd, 'opacity', (0.6 + 0.4 * Math.sin(tau * 4.2 - i)).toFixed(2));
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
