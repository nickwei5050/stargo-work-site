/* Motion scenes — code-drawn product motion in place of generated stills
   (tools/motion-scenes.mjs places the hosts, css/stargo-motion.css styles them).

   Every scene is a pure function of time: tick(t) sets the picture for second
   t, so a scene can pause off screen, skip frames or resume without drifting,
   and a reduced-motion visitor gets one composed frame (scene.still) instead
   of a loop. Each scene draws on a fixed design stage (its layout's w × h in
   CSS px) that the runner scales to fit its host, so the type and the lines
   stay vector-sharp at every size. Layouts are picked by the host's size. */
(function () {
  'use strict';
  var hosts = document.querySelectorAll('[data-sg-scene]');
  if (!hosts.length) return;
  var NS = 'http://www.w3.org/2000/svg';
  var ZH = /^zh/i.test(document.documentElement.lang || 'zh');
  var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* ---------- small kit ---------- */
  function T(zh, en) { return ZH ? zh : en; }
  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // write only on change: most frames change a handful of values
  function put(e, k, v) {
    var c = e.__sg || (e.__sg = {});
    if (c[k] === v) return;
    c[k] = v;
    if (k === 'text') { var f = e.firstChild; if (f && f.nodeType === 3 && !f.nextSibling) f.data = v; else e.textContent = v; }
    else if (k === 'cls') e.setAttribute('class', v);
    else if (k.charAt(0) === '-') e.style.setProperty(k.slice(1), v);
    else e.setAttribute(k, v);
  }
  function css(e, k, v) { put(e, '-' + k, v); }
  function cl(e, name, on) {
    var c = e.__sgc || (e.__sgc = {});
    if (c[name] === on) return;
    c[name] = on;
    e.classList.toggle(name, on);
  }
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, b) { return c01((t - a) / (b - a)); }
  var ease = {
    out: function (x) { return 1 - Math.pow(1 - x, 3); },
    expo: function (x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); },
    io: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    sine: function (x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
  };
  function mod(a, b) { return ((a % b) + b) % b; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function bez(p, u) {
    var v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
    return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
  }
  function bezD(p) { return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3]; }
  // a cubic from point a leaving along da to point b arriving along -db
  function curve(a, da, b, db, k) {
    var d = Math.hypot(b[0] - a[0], b[1] - a[1]) * (k || 0.42);
    return [a, [a[0] + da[0] * d, a[1] + da[1] * d], [b[0] + db[0] * d, b[1] + db[1] * d], b];
  }
  function fmt(n) { return Math.round(n).toLocaleString(ZH ? 'zh-CN' : 'en-US'); }
  function typed(s, p) { var n = Math.round(Array.from(s).length * c01(p)); return Array.from(s).slice(0, n).join(''); }
  function flash(e) { if (e.animate) e.animate([{ opacity: 0.25, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  function textSwap(e, v) { if (e.__sg && e.__sg.text !== undefined && e.__sg.text !== v) { put(e, 'text', v); flash(e); } else put(e, 'text', v); }

  var ICON = {
    mail: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM5 7l7 5.5L19 7',
    chat: 'M12 4.5a7.5 7.5 0 0 0-6.6 11.1L4.5 19.5l4-1a7.5 7.5 0 1 0 3.5-14zM9 12h.01M12 12h.01M15 12h.01',
    store: 'M4.5 9.5 6 5h12l1.5 4.5M4.5 9.5h15M4.5 9.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5M6 12v7h12v-7M10 19v-4h4v4',
    form: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM3.5 12h17M12 3.5c2.3 2.3 3.4 5.2 3.4 8.5s-1.1 6.2-3.4 8.5c-2.3-2.3-3.4-5.2-3.4-8.5s1.1-6.2 3.4-8.5z',
    spark: 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z',
    shield: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2 2 4-4',
    check: 'M5 12.5l4.5 4.5L19 7.5'
  };
  function icon(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size || 24, height: size || 24, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: ICON[name], stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  var STAR = 'M0-34C4-9 9-4 34 0 9 4 4 9 0 34-4 9-9 4-34 0-9-4-4-9 0-34Z';

  /* ---------- runner ---------- */
  function Runner(host, scene) {
    var stage = el('div', 'sg-mo-stage', host);
    stage.setAttribute('aria-hidden', 'true');
    var layout = null, W = 0, H = 0, t = scene.start || 0, last = 0, visible = false, raf = 0, built = false;
    var viewportFit = host.getAttribute('data-sg-fit') === 'viewport';
    var lastFit = '';
    // A scene is built the first time its host comes within a screen of the viewport, so a page with many
    // scenes does not build them all at load.
    var near = !('IntersectionObserver' in window);
    function fit() {
      if (!near) return false;
      var w = host.clientWidth, h = host.clientHeight;
      if (w < 8 || h < 8) return false;
      // A host that the page zooms past the screen (the sticky band scales its
      // box up to ~1.3×) is drawn inside a screen-sized window at its centre,
      // measured in the host's own pixels, so nothing ends up off screen.
      var fw = w, fh = h;
      if (viewportFit) {
        var k = host.getBoundingClientRect().width / w || 1, vw = window.innerWidth / k, vh = window.innerHeight / k;
        // from tablet up, lay out for the whole screen (so the layout does not change while the band
        // zooms), keeping clear of the band's own captions at the top and bottom of the screen
        if (window.innerWidth >= 768) { fw = vw; fh = vh - 170 / k; } else { fw = Math.min(w, vw); fh = Math.min(h, vh); }
      }
      var name = scene.pick(fw, fh, viewportFit ? window.innerWidth : fw);
      if (name !== layout) {
        layout = name;
        stage.textContent = '';
        var L = scene.layouts[name];
        W = L.w; H = L.h;
        stage.style.width = W + 'px';
        stage.style.height = H + 'px';
        scene.build(stage, L, name);
        built = true;
        scene.tick(reduced.matches ? scene.still : t);
      }
      var s = Math.min(fw / W, fh / H);
      var tr = 'translate(' + ((w - W * s) / 2).toFixed(1) + 'px,' + ((h - H * s) / 2).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
      if (tr !== lastFit) { stage.style.transform = tr; lastFit = tr; }
      return true;
    }
    var shown = true, visT = 0;
    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) { last = 0; return; }
      if (viewportFit) fit();
      if (reduced.matches) { last = 0; if (viewportFit) raf = requestAnimationFrame(frame); return; }
      if (now - visT > 250) {
        visT = now;
        var sh = host.checkVisibility ? host.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
        if (sh && !shown && scene.cue) t = scene.cue(t);
        shown = sh;
      }
      if (!shown) { last = 0; raf = requestAnimationFrame(frame); return; }
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now; t += dt;
      if (built) scene.tick(t);
      raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (reduced.matches) { if (built) scene.tick(scene.still); if (!viewportFit) return; }
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    host.classList.add('sg-mo-on');
    if ('ResizeObserver' in window) new ResizeObserver(function () { fit(); }).observe(host);
    window.addEventListener('resize', fit);
    fit();
    if (!near) {
      var nio = new IntersectionObserver(function (es) {
        if (!es[es.length - 1].isIntersecting) return;
        near = true; nio.disconnect(); fit();
      }, { rootMargin: '100% 0px' });
      nio.observe(host);
    }
    if ('IntersectionObserver' in window) {
      // A host that only touches the viewport's edge (a sliding panel parked just beside the screen) reports
      // isIntersecting with a zero-area rectangle; it is not on screen, so it does not tick. The second
      // threshold makes the observer report the moment such a host actually comes into view.
      new IntersectionObserver(function (es) { var e = es[es.length - 1], r = e.intersectionRect; visible = e.isIntersecting && r.width > 0 && r.height > 0; if (visible) fit(); wake(); }, { rootMargin: '120px 0px', threshold: [0, 0.001] }).observe(host);
    } else { visible = true; wake(); }
    document.addEventListener('visibilitychange', wake);
    if (reduced.addEventListener) reduced.addEventListener('change', function () { t = scene.still; if (built) scene.tick(t); wake(); });
  }

  /* =====================================================================
     LOOP — 一条业务主线. Inquiries arrive on four channels, run through the
     core, and leave for the five stages; the order stage waits at a human
     approval gate first.
     ===================================================================== */
  function LoopScene() {
    var CH = [
      { icon: 'mail', name: T('邮件', 'Email') },
      { icon: 'chat', name: 'WhatsApp' },
      { icon: 'store', name: T('阿里国际站', 'Alibaba.com'), p: T('阿里国际站', 'Alibaba') },
      { icon: 'form', name: T('官网表单', 'Website form'), p: T('官网表单', 'Web form') }
    ];
    var MSG = [
      ['Müller Energie GmbH', T('德国', 'Germany'), '200 pcs 48V 100Ah, DAP Hamburg?'],
      ['Ahmed Al-Rashid', T('阿联酋', 'UAE'), 'Price for the 72V lithium pack? 50 units.'],
      ['Silva Mobilidade', T('巴西', 'Brazil'), 'Can you do OEM label? MOQ?'],
      ['Nordic Mobility AB', T('瑞典', 'Sweden'), 'E-bike pack supplier wanted, 2,000/yr.'],
      ['PT Surya Energi', T('印尼', 'Indonesia'), 'Lead time for 64V 104Ah packs?'],
      ['Kowalski Sp. z o.o.', T('波兰', 'Poland'), 'Please send the catalogue and CE files.'],
      ['Lagos Power Ltd', T('尼日利亚', 'Nigeria'), 'Off-grid storage, 30 sets, CIF Lagos.'],
      ['Hanoi E-Moto JSC', T('越南', 'Vietnam'), 'Sample order first? 2 pcs 60V 30Ah.']
    ];
    var ST = [
      { n: '01', name: T('找到客户', 'Find prospects'), p: T('找到客户', 'Prospects') },
      { n: '02', name: T('理解需求', 'Understand needs'), p: T('理解需求', 'Needs') },
      { n: '03', name: T('推进订单', 'Advance orders'), p: T('推进订单', 'Orders') },
      { n: '04', name: T('制作内容', 'Create content'), p: T('制作内容', 'Content') },
      { n: '05', name: T('管好经营', 'Coordinate work'), p: T('管好经营', 'Operations') }
    ];
    var NEED = [['48V 100Ah', T('200 组', '200 pcs'), T('DAP 汉堡', 'DAP Hamburg')], ['72V', T('50 组', '50 pcs'), T('贸易术语 待确认', 'Incoterm?')], [T('OEM 贴牌', 'OEM label'), T('问 MOQ', 'MOQ?'), T('巴西', 'Brazil')], [T('电动自行车', 'E-bike'), T('2,000 组/年', '2,000 / yr'), T('瑞典', 'Sweden')],
      ['64V 104Ah', T('问交期', 'Lead time?'), T('印尼', 'Indonesia')], [T('产品目录', 'Catalogue'), T('CE 文件', 'CE files'), T('波兰', 'Poland')], [T('离网储能', 'Off-grid'), T('30 套', '30 sets'), T('CIF 拉各斯', 'CIF Lagos')], ['60V 30Ah', T('样品 2 组', '2 samples'), T('越南', 'Vietnam')]];  // what 理解需求 reads out of MSG[i]
    var P = 2.2;           // a new inquiry every P seconds
    var GATE = 2;          // the stage that passes the approval gate

    var L, R = {}, compact;
    var layouts = {
      wide: { w: 1600, h: 800 },
      mid: { w: 1240, h: 700 },
      square: { w: 640, h: 680 },
      phone: { w: 400, h: 296 }   // the part of the phone band left visible above the next section's curve
    };
    function geometry(name) {
      var g = { w: layouts[name].w, h: layouts[name].h };
      if (name === 'wide') {
        g.core = { x: 800, y: 392, s: 1 };
        g.inp = [0, 1, 2, 3].map(function (i) { return { x: 84, y: 150 + i * 126, w: 404, h: 104 }; });
        g.out = [0, 1, 2, 3, 4].map(function (i) { return { x: 1112, y: 112 + i * 116, w: 404, h: 96 }; });
        g.inA = function (r) { return { p: [r.x + r.w, r.y + r.h / 2], d: [1, 0] }; };
        g.outA = function (r) { return { p: [r.x, r.y + r.h / 2], d: [-1, 0] }; };
        g.ticker = { x: 800, y: 700 };
        g.tag = { x: 1516, y: 84 };
      } else if (name === 'mid') {
        g.core = { x: 620, y: 330, s: 0.8 };
        g.inp = [0, 1, 2, 3].map(function (i) { return { x: 24, y: 120 + i * 110, w: 392, h: 92 }; });
        g.out = [0, 1, 2, 3, 4].map(function (i) { return { x: 852, y: 86 + i * 102, w: 364, h: 86 }; });
        g.inA = function (r) { return { p: [r.x + r.w, r.y + r.h / 2], d: [1, 0] }; };
        g.outA = function (r) { return { p: [r.x, r.y + r.h / 2], d: [-1, 0] }; };
        g.ticker = { x: 620, y: 620 };
        g.tag = { x: 1216, y: 60 };
      } else if (name === 'phone') {
        g.core = { x: 200, y: 136, s: 0.36 };
        g.inp = [0, 1, 2, 3].map(function (i) { return { x: 10, y: 36 + i * 52, w: 114, h: 44 }; });
        g.out = [0, 1, 2, 3, 4].map(function (i) { return { x: 276, y: 30 + i * 42, w: 114, h: 36 }; });
        g.inA = function (r) { return { p: [r.x + r.w, r.y + r.h / 2], d: [1, 0] }; };
        g.outA = function (r) { return { p: [r.x, r.y + r.h / 2], d: [-1, 0] }; };
        g.ticker = null;
        g.status = { x: 200, y: 254 };
        g.tag = { x: 390, y: 20 };
      } else {
        g.core = { x: 320, y: 330, s: 0.62 };
        g.inp = [0, 1, 2, 3].map(function (i) { return { x: 16 + (i % 2) * 312, y: 34 + Math.floor(i / 2) * 74, w: 296, h: 62 }; });
        g.out = [0, 1, 2, 3, 4].map(function (i) { return { x: 16 + i * 122, y: 506, w: 112, h: 104 }; });
        g.inA = function (r, i) { return i < 2 ? { p: [i === 0 ? r.x + r.w + 4 : r.x - 4, r.y + r.h / 2], d: [0, 1] } : { p: [r.x + r.w / 2, r.y + r.h], d: [0, 1] }; };
        g.outA = function (r) { return { p: [r.x + r.w / 2, r.y], d: [0, -1] }; };
        g.ticker = null;
        g.status = { x: 320, y: 428 };
        g.tag = { x: 624, y: 664 };
      }
      return g;
    }
    function corePoint(from, rad) {
      var dx = from[0] - L.core.x, dy = from[1] - L.core.y, m = Math.hypot(dx, dy) || 1;
      return { p: [L.core.x + (dx / m) * rad, L.core.y + (dy / m) * rad], d: [dx / m, dy / m] };
    }

    function build(stage, _, name) {
      compact = name !== 'wide' && name !== 'mid';
      var phone = name === 'phone';
      L = geometry(name);
      R = { inp: [], out: [], parts: [], inPath: [], outPath: [], phone: phone };
      R.host = stage.parentNode;   // tells the page which stage the caption names (data-stage, read by css/stargo-phone.css)
      stage.className = 'sg-mo-stage sg-loop' + (compact ? ' is-compact' : '') + (phone ? ' is-phone' : '') + (name === 'mid' ? ' is-mid' : '');
      var svg = sv('svg', { class: 'sg-loop-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
      var defs = sv('defs', {}, svg);
      var g1 = sv('radialGradient', { id: 'sgl-halo' }, defs);
      sv('stop', { offset: '0', 'stop-color': '#f2b45a', 'stop-opacity': '.28' }, g1);
      sv('stop', { offset: '.45', 'stop-color': '#c77a2a', 'stop-opacity': '.08' }, g1);
      sv('stop', { offset: '1', 'stop-color': '#000', 'stop-opacity': '0' }, g1);
      var g2 = sv('radialGradient', { id: 'sgl-orb', cx: '.38', cy: '.32', r: '.8' }, defs);
      sv('stop', { offset: '0', 'stop-color': '#3b2a18' }, g2);
      sv('stop', { offset: '.6', 'stop-color': '#17110b' }, g2);
      sv('stop', { offset: '1', 'stop-color': '#0b0806' }, g2);
      var g3 = sv('linearGradient', { id: 'sgl-gold', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
      sv('stop', { offset: '0', 'stop-color': '#fff4dc' }, g3);
      sv('stop', { offset: '.5', 'stop-color': '#f3c27a' }, g3);
      sv('stop', { offset: '1', 'stop-color': '#c9802f' }, g3);
      var g4 = sv('radialGradient', { id: 'sgl-dot' }, defs);
      sv('stop', { offset: '0', 'stop-color': '#ffe2b0', 'stop-opacity': '.9' }, g4);
      sv('stop', { offset: '1', 'stop-color': '#f0a64a', 'stop-opacity': '0' }, g4);
      var g5 = sv('linearGradient', { id: 'sgl-rim', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
      sv('stop', { offset: '0', 'stop-color': '#ffe9c4', 'stop-opacity': '.9' }, g5);
      sv('stop', { offset: '.5', 'stop-color': '#f0b25e', 'stop-opacity': '.25' }, g5);
      sv('stop', { offset: '1', 'stop-color': '#f0b25e', 'stop-opacity': '.65' }, g5);
      var f = sv('filter', { id: 'sgl-blur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
      sv('feGaussianBlur', { stdDeviation: '7' }, f);

      // threads
      var threads = sv('g', { class: 'sg-loop-threads' }, svg);
      L.inp.forEach(function (r, i) {
        var a = L.inA(r, i), c = corePoint([a.p[0], a.p[1]], 78 * L.core.s);
        var p = curve(a.p, a.d, c.p, c.d, 0.5);
        R.inPath[i] = p;
        sv('path', { d: bezD(p), class: 'sg-thread' }, threads);
      });
      L.out.forEach(function (r, i) {
        var a = L.outA(r), c = corePoint([a.p[0], a.p[1]], 78 * L.core.s);
        var p = curve(c.p, c.d, a.p, a.d, 0.5);
        R.outPath[i] = p;
        sv('path', { d: bezD(p), class: 'sg-thread' }, threads);
      });

      // approval gate on the order stage's thread
      R.gateU = name === 'square' ? 0.8 : 0.52;
      var gp = bez(R.outPath[GATE], R.gateU);
      R.gate = sv('g', { class: 'sg-gate', transform: 'translate(' + gp[0] + ',' + gp[1] + ')' }, svg);
      R.gateRing = sv('circle', { r: 17, class: 'sg-gate-ring' }, R.gate);
      R.gateCore = sv('rect', { x: -7, y: -7, width: 14, height: 14, rx: 3, transform: 'rotate(45)', class: 'sg-gate-core' }, R.gate);
      var side = compact && !phone;
      R.gateLabel = sv('text', { y: side ? 4 : phone ? -22 : -30, x: side ? 26 : 0, class: 'sg-gate-label', 'text-anchor': side ? 'start' : 'middle' }, R.gate);
      if (phone) R.gate.setAttribute('transform', 'translate(' + gp[0] + ',' + gp[1] + ') scale(.62)');

      // core
      var core = sv('g', { transform: 'translate(' + L.core.x + ',' + L.core.y + ') scale(' + L.core.s + ')' }, svg);
      R.halo = sv('circle', { r: 300, fill: 'url(#sgl-halo)' }, core);
      sv('circle', { r: 176, class: 'sg-ring sg-ring-a' }, core);
      R.ringB = sv('g', {}, core);
      sv('circle', { r: 148, class: 'sg-ring sg-ring-b' }, R.ringB);
      [0, 120, 240].forEach(function (a) { var r = a * Math.PI / 180; sv('circle', { cx: (148 * Math.cos(r)).toFixed(1), cy: (148 * Math.sin(r)).toFixed(1), r: a ? 2.2 : 3, class: 'sg-bead' }, R.ringB); });
      R.arc1 = sv('circle', { r: 118, class: 'sg-ring sg-arc' }, core);
      R.arc2 = sv('circle', { r: 118, class: 'sg-ring sg-arc sg-arc-2' }, core);
      sv('circle', { r: 92, class: 'sg-ring sg-ring-d' }, core);
      R.orb = sv('g', {}, core);
      sv('circle', { r: 74, fill: 'url(#sgl-orb)' }, R.orb);
      sv('circle', { r: 73.5, fill: 'none', stroke: 'url(#sgl-rim)', 'stroke-width': 1.2 }, R.orb);
      sv('ellipse', { cx: -22, cy: -34, rx: 30, ry: 14, fill: '#fff', opacity: '.06', transform: 'rotate(-28 -22 -34)' }, R.orb);
      R.starGlow = sv('path', { d: STAR, fill: '#f6c67f', filter: 'url(#sgl-blur)', opacity: '.75' }, R.orb);
      sv('path', { d: STAR, fill: 'url(#sgl-gold)' }, R.orb);
      R.wave = sv('circle', { r: 74, class: 'sg-wave' }, core);
      svg.appendChild(R.gate); // the gate paints above the rings, under the particles

      // particles (pool)
      var pg = sv('g', {}, svg);
      for (var i = 0; i < 4; i++) {
        var hl = sv('path', { class: 'sg-flow' }, pg);
        var trail = [];
        for (var j = 0; j < 9; j++) trail.push(sv('circle', { r: 4.2 - j * 0.38, class: 'sg-trail', opacity: (0.55 - j * 0.055).toFixed(2) }, pg));
        var glow = sv('circle', { r: 22, fill: 'url(#sgl-dot)' }, pg);
        var head = sv('circle', { r: 4.6, class: 'sg-head' }, pg);
        R.parts.push({ hl: hl, trail: trail, glow: glow, head: head, key: null, len: 0 });
      }

      // labels under the core
      var lab = el('div', 'sg-loop-corelabel', stage);
      lab.style.left = (L.status ? L.status.x : L.core.x) + 'px';
      lab.style.top = (L.status ? L.status.y : L.core.y + 196 * L.core.s) + 'px';
      if (!compact) el('div', 'sg-loop-brand', lab, 'STARGO WORK');
      R.status = el('div', 'sg-loop-status', lab);

      // channel cards
      L.inp.forEach(function (r, i) {
        var c = el('div', 'sg-card sg-in', stage);
        c.style.cssText = 'left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.w + 'px;height:' + r.h + 'px';
        var ic = el('div', 'sg-in-ico', c); icon(CH[i].icon, ic, phone ? 14 : 22);
        var body = el('div', 'sg-in-body', c);
        var top = el('div', 'sg-in-top', body);
        el('span', 'sg-in-name', top, phone && CH[i].p ? CH[i].p : CH[i].name);
        var badge = el('span', 'sg-in-new', top, T('新询盘', 'New'));
        var msg = el('div', 'sg-in-msg', body);
        var who = compact ? null : el('div', 'sg-in-who', body);
        R.inp.push({ c: c, msg: msg, who: who, badge: badge });
      });

      // stage cards
      L.out.forEach(function (r, i) {
        var c = el('div', 'sg-card sg-out sg-out-' + i, stage);
        c.style.cssText = 'left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.w + 'px;height:' + r.h + 'px';
        el('span', 'sg-out-n', c, ST[i].n);
        el('div', 'sg-out-name', c, phone ? ST[i].p : ST[i].name);
        var o = { c: c };
        if (!compact) {
          o.detail = el('div', 'sg-out-detail', c);
          var vis = el('div', 'sg-out-vis', c);
          if (i === 0) { o.radar = el('div', 'sg-mini-radar', vis); el('i', '', o.radar); }
          if (i === 1) { o.chips = [0, 1, 2].map(function () { return el('span', 'sg-chip', o.detail); }); }
          if (i === 2) { o.steps = [0, 1, 2].map(function () { return el('i', 'sg-step', vis); }); }
          if (i === 3) { var bar = el('div', 'sg-bar', vis); o.fill = el('i', '', bar); }
          if (i === 4) {
            var sp = sv('svg', { viewBox: '0 0 96 36', width: 96, height: 36, class: 'sg-spark' }, vis);
            o.spark = sv('path', { d: 'M2 30 L16 26 L28 28 L40 20 L52 22 L64 13 L76 15 L94 5', pathLength: 100 }, sp);
            o.sparkDot = sv('circle', { cx: 94, cy: 5, r: 3 }, sp);
          }
        } else {
          o.pip = el('i', 'sg-out-pip', c);
        }
        R.out.push(o);
      });

      if (L.ticker) {
        var tk = el('div', 'sg-ticker', stage);
        tk.style.left = L.ticker.x + 'px'; tk.style.top = L.ticker.y + 'px';
        el('span', 'sg-ticker-k', tk, T('今日', 'Today'));
        R.tick = [T('询盘', 'Inquiries'), T('AI 起草', 'AI drafts'), T('等你审批', 'Awaiting you'), T('已发送', 'Sent')].map(function (n) {
          var s = el('span', 'sg-ticker-i', tk);
          var v = el('b', '', s); el('span', '', s, n);
          return v;
        });
      }
      var tag = el('div', 'sg-tag', stage, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      tag.style.left = L.tag.x + 'px'; tag.style.top = L.tag.y + 'px';
    }

    // the event that started at k*P
    // an authored 8-beat script: [MSG index, stage]; MSG[c] and MSG[c + 4] write on channel c
    var SEQ = [[0, 2], [1, 1], [2, 3], [3, 0], [4, 4], [5, 3], [6, 2], [7, 1]];
    function ev(k) { var s = SEQ[mod(k, 8)]; return { k: k, t0: k * P, ch: s[0] % 4, st: s[1], msg: MSG[s[0]], gate: s[1] === GATE }; }
    // phases, relative to the event start
    var IN0 = 0.18, IN1 = 1.0, OUT0 = 1.08, HOLD = 1.4;
    function outEnd(e) { return e.gate ? OUT0 + 0.95 + HOLD : OUT0 + 0.85; }
    function where(e, tau) {
      if (tau < IN0) return null;
      if (tau < IN1) return { path: R.inPath[e.ch], u: ease.io(seg(tau, IN0, IN1)), key: 'i' + e.k };
      if (tau < OUT0) return { path: R.outPath[e.st], u: 0, key: 'o' + e.k, hide: true };
      if (!e.gate) {
        if (tau < OUT0 + 0.85) return { path: R.outPath[e.st], u: ease.io(seg(tau, OUT0, OUT0 + 0.85)), key: 'o' + e.k };
        return null;
      }
      var a = OUT0 + 0.5, b = a + HOLD, c = b + 0.45;
      if (tau < a) return { path: R.outPath[e.st], u: R.gateU * ease.out(seg(tau, OUT0, a)), key: 'o' + e.k };
      if (tau < b) return { path: R.outPath[e.st], u: R.gateU, key: 'o' + e.k, wait: true };
      if (tau < c) return { path: R.outPath[e.st], u: R.gateU + (1 - R.gateU) * ease.io(seg(tau, b, c)), key: 'o' + e.k };
      return null;
    }

    function tick(t) {
      var kNow = Math.floor(t / P);
      // particles: the events still travelling
      var slot = 0, hit = -1, gateWait = null, gateDone = -1, gq = null, gc = null;
      for (var k = kNow - 3; k <= kNow; k++) {
        var e = ev(k), tau = t - e.t0;
        if (tau < 0) continue;
        if (tau >= IN1 && tau < IN1 + 0.6) hit = Math.max(hit, tau - IN1);
        var w = where(e, tau);
        if (e.gate && tau >= OUT0 + 0.5 && tau < OUT0 + 0.5 + HOLD) gateWait = seg(tau, OUT0 + 0.5, OUT0 + 0.5 + HOLD);
        if (e.gate && tau >= OUT0 + 0.5 + HOLD && tau < OUT0 + 0.5 + HOLD + 0.9) gateDone = tau - (OUT0 + 0.5 + HOLD);
        if (e.gate && tau >= OUT0 && tau < outEnd(e)) gq = e;
        if (e.gate && tau >= OUT0 && tau < outEnd(e) + 0.6) gc = e;
        if (!w || slot >= R.parts.length) continue;
        drawPart(R.parts[slot++], w);
      }
      for (; slot < R.parts.length; slot++) hidePart(R.parts[slot]);

      // core
      var pulse = hit >= 0 ? Math.exp(-hit * 5) : 0;
      put(R.orb, 'transform', 'scale(' + (1 + 0.07 * pulse).toFixed(4) + ')');
      put(R.halo, 'transform', 'scale(' + (1 + 0.12 * pulse + 0.03 * Math.sin(t * 1.3)).toFixed(4) + ')');
      put(R.starGlow, 'opacity', (0.55 + 0.4 * pulse + 0.1 * Math.sin(t * 2.1)).toFixed(3));
      put(R.wave, 'transform', 'scale(' + (1 + (hit >= 0 ? ease.out(c01(hit / 0.6)) * 1.25 : 0)).toFixed(4) + ')');
      put(R.wave, 'opacity', hit >= 0 ? (0.7 * (1 - c01(hit / 0.6))).toFixed(3) : '0');
      put(R.ringB, 'transform', 'rotate(' + (t * 6).toFixed(2) + ')');
      put(R.arc1, 'transform', 'rotate(' + (t * 38).toFixed(2) + ')');
      put(R.arc2, 'transform', 'rotate(' + (180 - t * 24).toFixed(2) + ')');

      // gate
      var gw = gateWait !== null, gd = gateDone >= 0;
      cl(R.gate, 'is-wait', gw);
      cl(R.gate, 'is-ok', gd && !gw);
      put(R.gateRing, 'transform', gw ? 'scale(' + (1 + 0.12 * Math.sin(t * 9)).toFixed(3) + ')' : 'scale(1)');
      put(R.gateLabel, 'text', gw ? T('等你拍板', 'Your call') : gd ? T('你已批准', 'You approved') : T('人工审批', 'Approval'));
      var okNow = gd && !gw;
      if (okNow && !R.wasOk && R.gateCore.animate) R.gateCore.animate([{ transform: 'rotate(45deg) scale(1)' }, { transform: 'rotate(45deg) scale(1.45)' }, { transform: 'rotate(45deg) scale(1)' }], { duration: 240, easing: 'ease-out' });
      R.wasOk = okNow;
      cl(R.out[GATE].c, 'is-wait', gw);

      // channel cards: lit while their inquiry is fresh; message = the latest one
      var latestIn = [null, null, null, null];
      for (var k2 = kNow - 8; k2 <= kNow; k2++) { var e2 = ev(k2); if (t - e2.t0 >= 0) latestIn[e2.ch] = e2; }
      R.inp.forEach(function (o, i) {
        var e3 = latestIn[i];
        var age = e3 ? t - e3.t0 : 99;
        cl(o.c, 'is-on', age < 1.1);
        cl(o.badge, 'is-on', age < 1.6);
        var m = e3 ? e3.msg : MSG[i];
        // message and sender change together, as one new record
        var kk = e3 ? e3.k : -1;
        if (o.k !== kk) {
          var fl = o.k !== undefined;
          o.k = kk;
          put(o.msg, 'text', m[2]);
          if (o.who) put(o.who, 'text', m[0] + ' · ' + m[1]);
          if (fl) { flash(o.msg); if (o.who) flash(o.who); }
        }
      });

      // stage cards
      var arrived = [null, null, null, null, null];
      for (var k3 = kNow - 10; k3 <= kNow; k3++) { var e4 = ev(k3); if (t - e4.t0 >= outEnd(e4)) arrived[e4.st] = e4; }
      R.out.forEach(function (o, i) {
        var e5 = arrived[i], age = e5 ? t - e5.t0 - outEnd(e5) : 99, n = e5 ? e5.k : i;
        cl(o.c, 'is-on', age < 1.25);
        if (compact) return;
        if (i === 0) textSwap(o.detail, T('新增候选 ', '+') + (8 + mod(n, 7)) + T(' 家 · 最高匹配 ', ' prospects · best fit ') + (88 + mod(n, 9)) + '%');
        if (i === 1) {
          var need = NEED[e5 ? MSG.indexOf(e5.msg) : 0];
          o.chips.forEach(function (c, j) { put(c, 'text', need[j]); cl(c, 'is-ask', /待确认|\?|^问/.test(need[j])); cl(c, 'is-in', age > 0.15 + 0.1 * j); });
        }
        if (i === 2) {
          // quote steps: drafted · approved · sent
          var q = gq || e5, ph = gq ? (t - gq.t0 < OUT0 + 0.5 + HOLD ? 0 : 1) : age < 2.4 ? 2 : 3;
          o.steps.forEach(function (st, j) { cl(st, 'is-on', j === 0 || (j === 1 && ph > 0) || (j === 2 && ph > 1)); });
          textSwap(o.detail, T('报价 v', 'Quote v') + (q ? 2 + mod(q.k, 3) : 2) + ' · ' + [T('等你审批', 'needs your OK'), T('已批准 · 发送中', 'approved · sending'), T('已批准，已发给客户', 'approved, sent'), T('已发送 · 等客户回复', 'awaiting buyer')][ph]);
        }
        if (i === 3) {
          var pr = age < 99 ? ease.out(c01(age / 1.4)) : 1;
          put(o.fill, '-transform', 'scaleX(' + (0.18 + 0.82 * pr).toFixed(3) + ')');
          put(o.detail, 'text', pr < 1 ? T('主图 ×3 · 生成中 ', 'Main images ×3 · rendering ') + Math.round(18 + 82 * pr) + '%' : T('主图 ×3 · 详情页 · 已完成', 'Main images ×3 · detail page · done'));
        }
        if (i === 4) {
          var dr = age < 99 ? ease.out(c01(age / 1.2)) : 1;
          put(o.spark, 'stroke-dashoffset', (100 - 100 * dr).toFixed(1));
          put(o.sparkDot, 'opacity', dr > 0.95 ? '1' : '0');
          textSwap(o.detail, T('本周询盘 +', 'Inquiries +') + (12 + mod(n, 9)) + T('% · 回复更快', '% this week'));
        }
      });

      // status line under the core
      var cur = ev(kNow), ct = t - cur.t0;
      var se = ct >= IN1 - 0.1 ? cur : ev(kNow - 1);
      // the gate says 等你拍板 itself, except on phones where its label is hidden
      // and the caption stays on a quote at the gate until it has landed in its stage card
      textSwap(R.status, gw && gq && R.phone ? T('等你拍板 · ', 'Your call · ') + gq.msg[0] : gc ? gc.msg[0] + ' → ' + ST[gc.st].name : se.msg[0] + ' → ' + ST[se.st].name);
      var cs = gc ? gc.st : se.st; if (R.st !== cs && R.host) R.host.setAttribute('data-stage', String((R.st = cs) + 1));   // only when it changes
      // ticker
      if (R.tick) {
        var arrivedCount = kNow + (t - cur.t0 >= IN1 ? 1 : 0);
        var drafted = 0;
        for (var k4 = kNow - 3; k4 <= kNow; k4++) { var e6 = ev(k4); if (t - e6.t0 >= outEnd(e6)) drafted = Math.max(drafted, k4 + 1); }
        textSwap(R.tick[0], fmt(24 + arrivedCount));
        textSwap(R.tick[1], fmt(19 + drafted));
        textSwap(R.tick[2], String(gw ? 3 : 2));
        textSwap(R.tick[3], fmt(15 + Math.floor(drafted / 5)));
      }
    }

    function drawPart(o, w) {
      if (o.key !== w.key) {
        o.key = w.key;
        put(o.hl, 'd', bezD(w.path));
        o.len = o.hl.getTotalLength ? o.hl.getTotalLength() : 400;
        put(o.hl, 'stroke-dasharray', o.len.toFixed(1) + ' ' + (o.len + 10).toFixed(1));
      }
      var vis = w.hide ? '0' : '1';
      var p = bez(w.path, w.u);
      put(o.head, 'cx', p[0].toFixed(1)); put(o.head, 'cy', p[1].toFixed(1)); put(o.head, 'opacity', vis);
      put(o.glow, 'cx', p[0].toFixed(1)); put(o.glow, 'cy', p[1].toFixed(1)); put(o.glow, 'opacity', w.hide ? '0' : (w.wait ? '1' : '.85'));
      put(o.glow, 'r', w.wait ? '30' : '22');
      for (var j = 0; j < o.trail.length; j++) {
        var q = bez(w.path, Math.max(0, w.u - (j + 1) * 0.022));
        put(o.trail[j], 'cx', q[0].toFixed(1)); put(o.trail[j], 'cy', q[1].toFixed(1));
        put(o.trail[j], 'visibility', w.hide || w.wait || w.u <= 0.001 ? 'hidden' : 'visible');
      }
      put(o.hl, 'stroke-dashoffset', (o.len * (1 - w.u)).toFixed(1));
      put(o.hl, 'opacity', w.hide ? '0' : '1');
    }
    function hidePart(o) {
      put(o.head, 'opacity', '0'); put(o.glow, 'opacity', '0'); put(o.hl, 'opacity', '0');
      for (var j = 0; j < o.trail.length; j++) put(o.trail[j], 'visibility', 'hidden');
    }

    return {
      layouts: layouts,
      pick: function (w, h, sw) { return w / h > 1.2 && w > 560 ? (sw < 1400 ? 'mid' : 'wide') : w / h > 1.1 ? 'phone' : 'square'; },
      // start a few events in, so the cards and counters are already alive
      build: build, tick: tick, still: 6 * P + 2.28, start: 4 * P + 0.3
    };
  }

  /* =====================================================================
     RADAR — Growth OS finding buyers: arcs from the factory to each new
     prospect, the shortlist re-ranking, and the AI's reason being written.
     ===================================================================== */
  function RadarScene() {
    var MAP = window.STARGO_MAP;
    var HOME = [109.4, 24.3];
    var B = [
      ['DE', [10.0, 53.55], 'Nordwerk Energie GmbH', T('储能系统集成', 'Storage integrator'), T('汉堡', 'Hamburg'), 94, T('近 90 天发布 3 条储能招标，产品线与 48V 100Ah 高度匹配，建议优先联系采购经理。', 'Three storage tenders in 90 days and a product line that fits 48V 100Ah. Contact the purchasing manager first.')],
      ['US', [-95.37, 29.76], 'Gulf Coast Lift Supply', T('叉车与仓储', 'Forklift fleets'), T('休斯敦', 'Houston'), 91, T('车队正在换锂电，近期招聘采购专员，可先发 24V/48V 叉车电池资料。', 'Fleet moving to lithium and hiring a buyer. Send the 24V/48V forklift range.')],
      ['BR', [-46.63, -23.55], 'Silva Mobilidade Ltda', T('电动两轮', 'E-scooters'), T('圣保罗', 'São Paulo'), 89, T('新开 12 家门店，正在找 60V/72V 电池的第二供应商。', '12 new stores and looking for a second 60V/72V supplier.')],
      ['AE', [55.27, 25.2], 'Gulf Solar Trading', T('光伏储能', 'Solar storage'), T('迪拜', 'Dubai'), 88, T('中标两个离网项目，需求与储能系列一致，交期是关键。', 'Won two off-grid projects; matches the storage series, lead time decides.')],
      ['SE', [18.07, 59.33], 'Nordic Mobility AB', T('电动自行车', 'E-bikes'), T('斯德哥尔摩', 'Stockholm'), 93, T('年采购约 2,000 组，官网列出 CE 与 UN38.3 要求，我们资料齐全。', 'About 2,000 packs a year; asks for CE and UN38.3, which we have.')],
      ['ID', [106.85, -6.2], 'PT Surya Energi', T('电动三轮', 'E-tricycles'), T('雅加达', 'Jakarta'), 90, T('电动三轮销量增长 40%，64V 104Ah 与其车型匹配。', 'Tricycle sales up 40%; 64V 104Ah fits their models.')],
      ['PL', [21.01, 52.23], 'Wisła E-Bike Sp. z o.o.', T('电动自行车', 'E-bikes'), T('华沙', 'Warsaw'), 86, T('正在扩产，LinkedIn 显示新任采购总监到岗，适合首封开发信。', 'Expanding, with a new purchasing director: a good first email.')],
      ['AU', [151.2, -33.87], 'Harbour Off-Grid Pty', T('房车储能', 'RV storage'), T('悉尼', 'Sydney'), 92, T('房车改装业务需要 12V 100Ah，询价历史显示偏好 LiFePO4。', 'RV conversions need 12V 100Ah; past requests prefer LiFePO4.')],
      ['MX', [-99.13, 19.43], 'Movilidad Verde SA', T('物流车队', 'Delivery fleets'), T('墨西哥城', 'Mexico City'), 87, T('城配车队电动化，预算已批，下季度采购。', 'Electrifying city delivery; budget approved, buying next quarter.')],
      ['NG', [3.38, 6.52], 'Lagos Power Ltd', T('离网储能', 'Off-grid storage'), T('拉各斯', 'Lagos'), 85, T('离网储能需求旺，曾询价 30 套，适合 CIF 报价。', 'Strong off-grid demand; asked for 30 sets before, quote CIF.')],
      ['SA', [46.7, 24.7], 'Najd Energy Co.', T('通信备电', 'Telecom backup'), T('利雅得', 'Riyadh'), 84, T('通信基站备电改造项目启动，48V 机架式产品匹配。', 'Telecom backup retrofit started; 48V rack packs fit.')],
      ['ZA', [18.42, -33.92], 'Table Bay Power (Pty) Ltd', T('家用备电', 'Home backup'), T('开普敦', 'Cape Town'), 88, T('限电推高备电需求，48V 机架式储能匹配，可先寄样品。', 'Load-shedding drives backup demand; 48V rack packs fit. Offer samples first.')]
    ];
    var P = 5.6;
    var L, R, mode;
    var layouts = { wide: { w: 1600, h: 900 }, compact: { w: 800, h: 450 }, mini: { w: 380, h: 214 } };

    function proj(ll) { return [(ll[0] + 180) / 360 * MAP.w, (MAP.top - ll[1]) / (MAP.top - MAP.bottom) * MAP.h]; }
    function buyer(k) { return B[mod(k, B.length)]; }

    function build(stage, Ld, name) {
      mode = name;
      L = Ld; R = { rows: {} };
      stage.className = 'sg-mo-stage sg-radar is-' + mode;
      var bar = el('div', 'sg-app-bar', stage);
      var mk = el('span', 'sg-app-mark', bar); icon('spark', mk, 14);
      el('b', '', bar, 'Growth OS');
      if (mode !== 'mini') el('span', 'sg-app-crumb', bar, T('主动获客', 'Prospecting'));
      var live = el('span', 'sg-app-live', bar); el('i', '', live); el('span', '', live, T('AI 扫描中', 'AI scanning'));
      // map
      var mapBox = { wide: { x: 28, y: 150, w: 1024 }, compact: { x: 14, y: 60, w: 470 }, mini: { x: 8, y: 36, w: 364 } }[mode];
      var ms = mapBox.w / MAP.w;
      var svg = sv('svg', { class: 'sg-radar-map', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
      var defs = sv('defs', {}, svg);
      var gd = sv('radialGradient', { id: 'sgr-glow-' + mode }, defs);
      sv('stop', { offset: '0', 'stop-color': '#ff8a3d', 'stop-opacity': '.55' }, gd);
      sv('stop', { offset: '1', 'stop-color': '#ff8a3d', 'stop-opacity': '0' }, gd);
      var g = sv('g', { transform: 'translate(' + mapBox.x + ',' + mapBox.y + ') scale(' + ms.toFixed(4) + ')' }, svg);
      var d = '';
      for (var i = 0; i < MAP.dots.length; i += 2) d += 'M' + MAP.dots[i] + ' ' + MAP.dots[i + 1] + 'h0';
      sv('path', { d: d, class: 'sg-dots', 'stroke-width': mode === 'wide' ? 3.1 : 3.5 }, g);
      var h = proj(HOME);
      R.home = h; R.inv = 1 / ms;
      sv('circle', { cx: h[0], cy: h[1], r: 26, fill: 'url(#sgr-glow-' + mode + ')' }, g);
      R.homeRing = sv('circle', { cx: h[0], cy: h[1], r: 10, class: 'sg-home-ring' }, g);
      sv('circle', { cx: h[0], cy: h[1], r: 4.5, class: 'sg-home' }, g);
      R.arcs = []; R.pins = [];
      for (var a = 0; a < 6; a++) {
        R.arcs.push({ p: sv('path', { class: 'sg-arc-line', pathLength: 100, 'stroke-width': (1.5 * R.inv).toFixed(2) }, g), dot: sv('circle', { r: (2.6 * R.inv).toFixed(2), class: 'sg-arc-dot' }, g) });
        var pin = sv('g', { class: 'sg-pin' }, g);
        var inner = sv('g', { transform: 'scale(' + R.inv.toFixed(3) + ')' }, pin);
        var o = { g: pin, rip: sv('circle', { r: 7, class: 'sg-pin-rip' }, inner), c: sv('circle', { r: 4, class: 'sg-pin-c' }, inner) };
        if (mode !== 'mini') { o.lab = sv('g', { class: 'sg-pin-lab' }, inner); o.labBg = sv('rect', { x: 10, y: -30, height: 24, rx: 12 }, o.lab); o.labT = sv('text', { x: 21, y: -13.5 }, o.lab); }
        R.pins.push(o);
      }
      // the factory label and the newest pin paint above every arc
      if (mode !== 'mini') {
        // up and to the right of the dot: routes leave it westwards, south to Jakarta and east-south-east to Sydney
        var hl = R.homeLab = sv('text', { x: h[0] + 9 * R.inv, y: h[1] - 11 * R.inv, 'text-anchor': 'start', class: 'sg-map-label is-home', style: 'font-size:' + (13 * R.inv).toFixed(1) + 'px;stroke-width:' + (4 * R.inv).toFixed(1) + 'px' }, g);
        hl.textContent = T('柳州工厂', 'Liuzhou plant');
      }
      g.appendChild(R.pins[0].g);
      // KPIs
      if (mode !== 'mini') {
        var k = el('div', 'sg-kpis', stage);
        R.kpi = [T('已扫描企业', 'Companies scanned'), T('合格候选', 'Qualified'), T('有采购信号', 'Buying signals')].map(function (n) {
          var b = el('div', 'sg-kpi', k); el('span', '', b, n); return el('b', '', b);
        });
      }
      if (mode === 'mini') {
        // one floating card: the newest prospect
        R.card = el('div', 'sg-float', stage);
        R.cardCc = el('span', 'sg-cc', R.card);
        var m = R.cardMain = el('div', 'sg-row-main', R.card);
        R.cardName = el('b', '', m); R.cardSub = el('span', '', m);
        var sc = R.cardScoreBox = el('div', 'sg-float-score', R.card);
        el('span', '', sc, T('匹配', 'Fit'));
        R.cardScore = el('b', '', sc);
      } else {
        var list = el('div', 'sg-list', stage);
        var head = el('div', 'sg-list-head', list);
        el('b', '', head, T('候选客户', 'Prospects'));
        el('span', '', head, T('最新发现 · 按匹配度', 'Newest · by fit'));
        R.listBody = el('div', 'sg-list-body', list);
        R.rowH = mode === 'wide' ? 92 : 70; R.rowGap = mode === 'wide' ? 10 : 8; R.rowsMax = mode === 'wide' ? 5 : 3;
        var ai = el('div', 'sg-ai', stage);
        var ah = el('div', 'sg-ai-head', ai); icon('spark', ah, mode === 'wide' ? 18 : 15); R.aiWho = el('span', '', ah);
        R.aiText = el('div', 'sg-ai-text', ai); R.aiTyped = el('span', '', R.aiText); R.aiRest = el('span', 'sg-ai-rest', R.aiText);
        if (mode === 'wide') {
          var btns = el('div', 'sg-ai-btns', ai);
          R.btn = el('span', 'sg-btn is-primary', btns);
          el('span', 'sg-btn', btns, T('查看依据', 'See why'));
        }
        var note = el('div', 'sg-note', stage);
        icon('shield', note, mode === 'wide' ? 18 : 15);
        var nt = el('div', '', note);
        el('b', '', nt, T('发开发信前', 'Before any outreach'));
        el('span', '', nt, T('数量和花费会先请你确认', 'you confirm quantity and cost'));
      }
      var tg = el('div', 'sg-tag', mode === 'compact' ? null : stage, mode === 'mini' ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      if (mode === 'compact') bar.insertBefore(tg, live);
    }

    // does a right-opening pin label at map point p (lw px wide) overlap the factory label?
    function homeHit(p, lw) {
      var hb = R.homeBox;
      if (hb === undefined) { hb = R.homeBox = null; try { var bb = R.homeLab && R.homeLab.getBBox(); if (bb && bb.width) hb = R.homeBox = { x: bb.x, y: bb.y, w: bb.width, h: bb.height }; else R.homeBox = undefined; } catch (e) { R.homeBox = undefined; } }
      if (!hb) return false;
      var pad = 6 * R.inv, x0 = p[0] + 10 * R.inv, x1 = p[0] + (10 + lw) * R.inv, y0 = p[1] - 30 * R.inv, y1 = p[1] - 6 * R.inv;
      return x1 > hb.x - pad && x0 < hb.x + hb.w + pad && y1 > hb.y - pad && y0 < hb.y + hb.h + pad;
    }

    function arcPath(a, b) {
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [a, [mx, my - d * 0.38], b];
    }
    function q(p, u) { var v = 1 - u; return [v * v * p[0][0] + 2 * v * u * p[1][0] + u * u * p[2][0], v * v * p[0][1] + 2 * v * u * p[1][1] + u * u * p[2][1]]; }

    function rowEl(k) {
      var b = buyer(k);
      var r = el('div', 'sg-row');
      el('span', 'sg-cc', r, b[0]);
      var m = el('div', 'sg-row-main', r);
      el('b', '', m, b[2]);
      el('span', '', m, b[3] + ' · ' + b[4]);
      var s = el('div', 'sg-row-score', r);
      el('b', '', s, String(b[5]));
      var bar = el('i', '', s); var fill = el('i', '', bar); fill.style.transform = 'scaleX(' + (b[5] / 100) + ')';
      return r;
    }

    function tick(t) {
      var kNow = Math.floor(t / P);
      for (var s = 0; s < 6; s++) {
        var k = kNow - s, tau = t - k * P, A = R.arcs[s], pin = R.pins[s];
        if (k < 0) { put(A.p, 'opacity', '0'); put(A.dot, 'opacity', '0'); put(pin.g, 'opacity', '0'); continue; }
        var b = buyer(k), to = proj(b[1]), ap = arcPath(R.home, to);
        put(A.p, 'd', 'M' + ap[0] + 'Q' + ap[1] + ' ' + ap[2]);
        var draw = ease.io(seg(tau, 0, 1.0));
        put(A.p, 'stroke-dashoffset', (100 - 100 * draw).toFixed(1));
        var fade = Math.max(0, 1 - s * 0.17);
        var out = s === 0 ? 0 : ease.out(seg(tau, P, P + 0.6));
        put(A.p, 'opacity', (1 - out * (1 - fade * 0.5)).toFixed(2));
        var dp = q(ap, draw);
        put(A.dot, 'cx', dp[0].toFixed(1)); put(A.dot, 'cy', dp[1].toFixed(1));
        put(A.dot, 'opacity', draw > 0 && draw < 1 ? '1' : '0');
        put(pin.g, 'transform', 'translate(' + to[0].toFixed(1) + ',' + to[1].toFixed(1) + ')');
        var landed = tau >= 1.0;
        put(pin.g, 'opacity', landed ? (1 - out * (1 - fade)).toFixed(2) : '0');
        var rp = seg(tau, 1.0, 2.2);
        put(pin.rip, 'transform', 'scale(' + (1 + 3.2 * ease.out(rp)).toFixed(3) + ')');
        put(pin.rip, 'opacity', s === 0 && landed ? (0.9 * (1 - rp)).toFixed(2) : '0');
        if (pin.lab) {
          var lab = b[4] + ' · ' + b[5];
          if (!pin.labT.__sg || pin.labT.__sg.text !== lab) { put(pin.labT, 'text', lab); put(pin.labBg, 'width', String(Math.ceil(22 + pin.labT.getComputedTextLength()))); }
          // east of the factory the label opens to the left, and below the pin when the pin is south of it;
          // a pin just west of the factory (Dubai, Riyadh) also opens left so it never covers the factory's name
          var lw = +pin.labBg.getAttribute('width'), east = to[0] > MAP.w * 0.75, below = east && to[1] > R.home[1] + 12;
          var left = east || homeHit(to, lw);
          put(pin.labBg, 'x', left ? String(-10 - lw) : '10'); put(pin.labT, 'x', left ? String(1 - lw) : '21');
          put(pin.labBg, 'y', below ? '8' : '-30'); put(pin.labT, 'y', below ? '24.5' : '-13.5');
          put(pin.lab, 'opacity', (s === 0 ? seg(tau, 1.05, 1.4) : 1 - seg(tau, P, P + 0.3)).toFixed(2));
        }
      }
      var ph = (t * 0.8) % 1;
      put(R.homeRing, 'r', (10 + 14 * ph).toFixed(1));
      put(R.homeRing, 'opacity', (0.8 * (1 - ph)).toFixed(2));

      var top = t - kNow * P >= 1.05 ? kNow : kNow - 1;
      var cur = buyer(top), tauTop = t - top * P, td = Array.from(cur[6]).length / (ZH ? 20 : 45);
      if (R.card) {
        var bi = Math.max(top, 0), bb = buyer(bi);
        if (R.card.__k !== bi) {
          var f2 = R.card.__k !== undefined;
          R.card.__k = bi;
          put(R.cardCc, 'text', bb[0]); put(R.cardName, 'text', bb[2]); put(R.cardSub, 'text', bb[3] + ' · ' + bb[4]); put(R.cardScore, 'text', String(bb[5]));
          if (f2) [R.cardCc, R.cardMain, R.cardScoreBox].forEach(flash);
        }
        cl(R.card, 'is-new', tauTop < 2.0);
      }
      if (R.listBody) {
        // the newest rowsMax prospects, ranked by fit; the one that just
        // dropped out of the window fades where it stood
        var want = {}, live = [];
        for (var i = 0; i < R.rowsMax; i++) if (top - i >= 0) live.push(top - i);
        live.sort(function (a, b) { return buyer(b)[5] - buyer(a)[5] || b - a; });
        live.forEach(function (kk, rank) { want[kk] = rank; });
        if (top - R.rowsMax >= 0 && R.rows[top - R.rowsMax]) want[top - R.rowsMax] = -1;
        for (var key in R.rows) if (!(key in want)) { R.listBody.removeChild(R.rows[key]); delete R.rows[key]; }
        for (var kk2 in want) {
          var idx = want[kk2], r = R.rows[kk2];
          if (!r) {
            r = R.rows[kk2] = rowEl(+kk2);
            r.style.transform = 'translateY(' + (Math.max(idx, 0) * (R.rowH + R.rowGap) + 14) + 'px) scale(.97)';
            r.style.opacity = '0';
            R.listBody.appendChild(r);
            r.getBoundingClientRect();
          }
          if (idx >= 0) css(r, 'transform', 'translateY(' + idx * (R.rowH + R.rowGap) + 'px)');
          css(r, 'opacity', idx < 0 ? '0' : '1');
          cl(r, 'is-out', idx < 0);
          cl(r, 'is-new', +kk2 === top);
        }
        put(R.aiWho, 'text', T('AI 判断 · ', 'AI reasoning · ') + cur[2]);
        var shownAi = typed(cur[6], seg(tauTop, 1.2, 1.2 + td));
        put(R.aiTyped, 'text', shownAi); put(R.aiRest, 'text', cur[6].slice(shownAi.length));
        cl(R.aiTyped, 'is-typing', tauTop < 1.3 + td);
      }
      if (R.btn) {
        var pressed = tauTop >= 1.7 + td;
        put(R.btn, 'text', pressed ? T('已加入开发名单 ✓', 'Added to the list ✓') : T('加入开发名单', 'Add to outreach list'));
        cl(R.btn, 'is-press', tauTop >= 1.6 + td && tauTop < 1.8 + td);
        cl(R.btn, 'is-done', pressed);
      }
      if (R.kpi) {
        put(R.kpi[0], 'text', fmt(12480 + Math.floor(t * 4) * 12));
        textSwap(R.kpi[1], fmt(118 + top));
        textSwap(R.kpi[2], fmt(31 + Math.floor(top * 0.6)));
      }
    }

    return {
      layouts: layouts,
      pick: function (w) { return w >= 1100 ? 'wide' : w >= 560 ? 'compact' : 'mini'; },
      build: build, tick: tick, still: 4 * P + 4.4, start: 3 * P + 0.4, cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  /* =====================================================================
     STUDIO — AI 创作: a prompt is typed, the scene behind the product is
     re-generated, the queue fills and waits for a person to review.
     ===================================================================== */
  function StudioScene() {
    var V = [
      { key: 'studio', label: T('主图 · 白底', 'Main image · white'), prompt: T('白底主图，柔光，突出铭牌', 'White background, soft light') },
      { key: 'ware', label: T('场景图 · 仓库 16:9', 'Scene · warehouse 16:9'), prompt: T('仓库货架前，暖色顶灯', 'Warehouse racks, warm light') },
      { key: 'solar', label: T('场景图 · 户外储能', 'Scene · outdoor storage'), prompt: T('户外光伏板前，日落逆光', 'Solar panels at sunset') },
      { key: 'city', label: T('短视频 · 15 秒', 'Short video · 15 s'), prompt: T('城市夜景，镜头缓慢推近', 'City at night, slow push-in') }
    ];
    var LANG = [
      ['中文', '长寿命磷酸铁锂电池，3000 次以上循环。'],
      ['EN', 'Long-life LiFePO4 pack, 3,000+ cycles.'],
      ['ES', 'Batería LiFePO4: más de 3.000 ciclos.'],
      ['AR', 'بطارية LiFePO4 تدوم أكثر من 3000 دورة.'],
      ['RU', 'Батарея LiFePO4: более 3000 циклов.']
    ];
    var P = 6.2, LP = P / 2;
    var PAL = { studio: ['#f6f4f1', '#ebe7e1', '#d9d3cb'], ware: ['#2a2019', '#1c1612', '#3a2c20', '#ffc27a'], solar: ['#3f2f5c', '#e9826a', '#f7b36b', '#ffe2a6'], city: ['#0a0f24', '#18213f', '#0e1430', '#ffcf7a'] };
    var L, R, mode;
    var layouts = { wide: { w: 1600, h: 900 }, compact: { w: 800, h: 450 }, mini: { w: 380, h: 214 } };
    var CW = 788, CH = 560; // canvas drawing size

    function bg(parent, key) {
      var g = sv('g', {}, parent);
      var id = 'sgs-' + key + '-' + Math.floor(Math.random() * 1e6);
      var defs = sv('defs', {}, g);
      function lin(stops, x2, y2) {
        var gr = sv('linearGradient', { id: id + stops.length + (x2 || 0), x1: 0, y1: 0, x2: x2 || 0, y2: y2 == null ? 1 : y2 }, defs);
        stops.forEach(function (s) { sv('stop', { offset: s[0], 'stop-color': s[1] }, gr); });
        return 'url(#' + gr.id + ')';
      }
      if (key === 'studio') {
        sv('rect', { width: CW, height: CH, fill: lin([[0, '#f6f4f1'], [0.62, '#ebe7e1'], [1, '#d9d3cb']]) }, g);
        sv('ellipse', { cx: CW / 2, cy: CH * 0.78, rx: CW * 0.46, ry: 60, fill: '#fff', opacity: '.55' }, g);
      } else if (key === 'ware') {
        sv('rect', { width: CW, height: CH, fill: lin([[0, '#2a2019'], [0.7, '#15100d'], [1, '#0d0a08']]) }, g);
        for (var i = 0; i < 6; i++) {
          var x = 20 + i * 132;
          sv('rect', { x: x, y: 70, width: 110, height: 300, fill: '#1c1612', stroke: '#2b221b' }, g);
          for (var j = 0; j < 4; j++) sv('rect', { x: x + 8, y: 86 + j * 72, width: 94, height: 46, fill: j % 2 ? '#3a2c20' : '#2f241b', rx: 3 }, g);
        }
        [140, 400, 660].forEach(function (cx) {
          var rg = sv('radialGradient', { id: id + 'l' + cx }, defs);
          sv('stop', { offset: 0, 'stop-color': '#ffc27a', 'stop-opacity': '.55' }, rg);
          sv('stop', { offset: 1, 'stop-color': '#ffc27a', 'stop-opacity': '0' }, rg);
          sv('ellipse', { cx: cx, cy: 40, rx: 160, ry: 130, fill: 'url(#' + rg.id + ')' }, g);
        });
        sv('rect', { y: 380, width: CW, height: CH - 380, fill: lin([[0, '#1a1410'], [1, '#0c0907']]) }, g);
      } else if (key === 'solar') {
        sv('rect', { width: CW, height: CH, fill: lin([[0, '#3f2f5c'], [0.45, '#e9826a'], [0.72, '#f7b36b'], [1, '#2a1d22']]) }, g);
        sv('circle', { cx: CW * 0.7, cy: CH * 0.58, r: 54, fill: '#ffe2a6', opacity: '.9' }, g);
        sv('rect', { y: CH * 0.66, width: CW, height: CH * 0.34, fill: '#21171c' }, g);
        for (var p = 0; p < 7; p++) {
          var px = -30 + p * 120;
          sv('path', { d: 'M' + px + ' ' + (CH * 0.66) + 'l40 -60h96l-24 60z', fill: '#1b2236', stroke: '#3a4566', 'stroke-width': 1.5 }, g);
          sv('path', { d: 'M' + (px + 36) + ' ' + (CH * 0.66 - 30) + 'h92', stroke: '#3a4566', 'stroke-width': 1 }, g);
        }
      } else {
        sv('rect', { width: CW, height: CH, fill: lin([[0, '#0a0f24'], [0.65, '#18213f'], [1, '#0b0d16']]) }, g);
        for (var b = 0; b < 14; b++) {
          var bw = 40 + hash(b) * 50, bh = 120 + hash(b + 9) * 220, bx = b * 58 - 10;
          sv('rect', { x: bx, y: 400 - bh, width: bw, height: bh, fill: '#0e1430' }, g);
          for (var w = 0; w < 8; w++) if (hash(b * 10 + w) > 0.55) sv('rect', { x: bx + 6 + (w % 3) * 12, y: 400 - bh + 14 + Math.floor(w / 3) * 26, width: 6, height: 9, fill: '#ffcf7a', opacity: '.75' }, g);
        }
        sv('rect', { y: 400, width: CW, height: CH - 400, fill: '#0a0c14' }, g);
        sv('rect', { y: 402, width: CW, height: 2, fill: '#ec6f10', opacity: '.55' }, g);
      }
      return g;
    }
    function battery(parent, x, y, s, light) {
      var g = sv('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')' }, parent);
      var id = 'sgb' + Math.floor(Math.random() * 1e6);
      var defs = sv('defs', {}, g);
      function lg(n, a, b, x2, y2) { var gr = sv('linearGradient', { id: id + n, x1: 0, y1: 0, x2: x2, y2: y2 }, defs); sv('stop', { offset: 0, 'stop-color': a }, gr); sv('stop', { offset: 1, 'stop-color': b }, gr); return 'url(#' + id + n + ')'; }
      var sh = sv('radialGradient', { id: id + 's' }, defs);
      sv('stop', { offset: 0, 'stop-color': '#000', 'stop-opacity': light ? '.28' : '.6' }, sh);
      sv('stop', { offset: 1, 'stop-color': '#000', 'stop-opacity': '0' }, sh);
      sv('ellipse', { cx: 150, cy: 214, rx: 230, ry: 34, fill: 'url(#' + id + 's)' }, g);
      // top, side, front
      sv('path', { d: 'M0 30 L60 -10 L340 -10 L280 30 Z', fill: lg('t', '#4a4a50', '#2a2a2f', 1, 1) }, g);
      sv('path', { d: 'M280 30 L340 -10 L340 160 L280 200 Z', fill: lg('r', '#202024', '#121215', 1, 0) }, g);
      sv('rect', { x: 0, y: 30, width: 280, height: 170, fill: lg('f', '#2f2f34', '#17171a', 0, 1) }, g);
      sv('rect', { x: 0, y: 30, width: 280, height: 2, fill: '#fff', opacity: '.22' }, g);
      // handles + terminals
      sv('path', { d: 'M96 18 q0 -18 18 -18 h52 q18 0 18 18', fill: 'none', stroke: '#141416', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
      [[46, '#c0392b'], [234, '#18181b']].forEach(function (tm) {
        sv('ellipse', { cx: tm[0], cy: 16, rx: 14, ry: 6, fill: '#0c0c0e' }, g);
        sv('rect', { x: tm[0] - 11, y: 2, width: 22, height: 14, fill: tm[1] }, g);
        sv('ellipse', { cx: tm[0], cy: 2, rx: 11, ry: 4.5, fill: tm[1] === '#18181b' ? '#3a3a40' : '#e0574a' }, g);
      });
      // label plate
      sv('rect', { x: 34, y: 70, width: 212, height: 90, rx: 8, fill: '#101012', stroke: '#2c2c31' }, g);
      sv('rect', { x: 34, y: 70, width: 8, height: 90, rx: 3, fill: '#ec6f10' }, g);
      var t1 = sv('text', { x: 60, y: 106, class: 'sg-bat-brand' }, g); t1.textContent = 'STARGO';
      var t2 = sv('text', { x: 60, y: 134, class: 'sg-bat-spec' }, g); t2.textContent = 'LiFePO4 · 12.8V 100Ah';
      // glint
      var clip = sv('clipPath', { id: id + 'c' }, defs);
      sv('rect', { x: 0, y: 30, width: 280, height: 170 }, clip);
      var glint = sv('rect', { x: -120, y: 0, width: 70, height: 260, fill: '#fff', opacity: '.10', transform: 'skewX(-20)', 'clip-path': 'url(#' + id + 'c)' }, g);
      return { g: g, glint: glint };
    }

    function build(stage, Ld, name) {
      mode = name;
      L = Ld; R = {};
      stage.className = 'sg-mo-stage sg-studio is-' + mode;
      var bar = el('div', 'sg-app-bar', stage);
      var mk = el('span', 'sg-app-mark', bar); icon('spark', mk, 14);
      el('b', '', bar, T('AI 创作', 'AI Creative'));
      if (mode !== 'mini') el('span', 'sg-app-crumb', bar, T('产品图与视频', 'Product images & video'));
      var live = R.live = el('span', 'sg-app-live', bar); el('i', '', live); R.liveText = el('span', '', live, T('生成中', 'Generating'));

      var cv = { wide: { x: 300, y: 72, w: 800, h: 610 }, compact: { x: 14, y: 54, w: 506, h: 284 }, mini: { x: 6, y: 36, w: 368, h: 160 } }[mode];
      var canvas = el('div', 'sg-canvas', stage);
      canvas.style.cssText = 'left:' + cv.x + 'px;top:' + cv.y + 'px;width:' + cv.w + 'px;height:' + cv.h + 'px';
      var svg = sv('svg', { viewBox: '0 0 ' + CW + ' ' + CH, preserveAspectRatio: 'xMidYMid slice', width: cv.w, height: cv.h }, canvas);
      R.bgs = V.map(function (v) { return bg(svg, v.key); });
      R.cam = sv('g', {}, svg);
      var bt = mode === 'mini' ? [261, 223, 0.78] : [250, 250, 1];
      R.bat = battery(R.cam, bt[0], bt[1], bt[2], true);
      R.cells = [];
      var cols = 16, rows = 11;
      var mg = sv('g', {}, svg);
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var c = sv('rect', { x: ((x * CW) / cols).toFixed(1), y: ((y * CH) / rows).toFixed(1), width: (CW / cols + 0.6).toFixed(1), height: (CH / rows + 0.6).toFixed(1), opacity: 0 }, mg);
        R.cells.push({ e: c, o: (y / rows) * 0.62 + hash(x * 31 + y * 7) * 0.38, l: hash(x * 13 + y * 17), y: y / rows });
      }
      R.scan = sv('rect', { x: 0, width: CW, height: 3, fill: '#ffb36b', opacity: 0 }, svg);
      // only the world around the product regenerates: the pack is masked out of the mosaic and the scan line
      var mk = sv('mask', { id: 'sgs-keep-' + mode, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: CW, height: CH }, sv('defs', {}, svg));
      sv('rect', { width: CW, height: CH, fill: '#fff' }, mk);
      sv('path', { d: 'M-4 34L58-14H344V162L282 204H-4Z', fill: '#000', transform: 'translate(' + bt[0] + ',' + bt[1] + ') scale(' + bt[2] + ')' }, mk);
      mg.setAttribute('mask', 'url(#sgs-keep-' + mode + ')'); R.scan.setAttribute('mask', 'url(#sgs-keep-' + mode + ')');
      R.canvasTag = el('span', 'sg-canvas-tag', canvas);

      // the prompt: under the canvas, or over its foot on the smallest layout
      var pr = el('div', 'sg-prompt', mode === 'mini' ? canvas : stage);
      if (mode === 'wide') pr.style.cssText = 'left:300px;top:698px;width:800px';
      if (mode === 'compact') pr.style.cssText = 'left:14px;top:348px;width:506px';
      icon('spark', pr, mode === 'wide' ? 18 : 15);
      R.promptBox = el('span', 'sg-prompt-text', pr); R.prompt = el('span', '', R.promptBox);
      R.gen = el('span', 'sg-btn is-primary', pr, T('生成', 'Generate'));

      if (mode !== 'mini') {
        var lang = el('div', 'sg-langs', stage);
        lang.style.cssText = mode === 'wide' ? 'left:300px;top:778px;width:800px' : 'left:14px;top:406px;width:506px';
        R.langChips = LANG.map(function (l) { return el('span', 'sg-lang', lang, l[0]); });
        R.langText = el('div', 'sg-lang-text', lang);
      }
      if (mode === 'wide') {
        var rail = el('div', 'sg-rail', stage);
        el('div', 'sg-rail-h', rail, T('素材', 'Assets'));
        R.assets = [
          [T('产品照片', 'Product photos'), '12'], [T('品牌色板', 'Brand colours'), ''], ['Logo', 'SVG'], [T('场景库', 'Scene library'), '24']
        ].map(function (a, i) {
          var r = el('div', 'sg-rail-row', rail);
          el('span', '', r, a[0]);
          if (i === 1) { var sw = el('span', 'sg-swatches', r); ['#0d0d0d', '#ec6f10', '#f4f1ec', '#3a6df0'].forEach(function (c) { el('i', '', sw).style.background = c; }); }
          else el('em', '', r, a[1]);
          return r;
        });
        el('div', 'sg-rail-h', rail, T('卖点', 'Selling points'));
        [T('3000+ 次循环', '3,000+ cycles'), 'LiFePO4', T('IP67 防水', 'IP67'), T('5 年质保', '5-year warranty')].forEach(function (s) { el('span', 'sg-pill', rail, s); });
      }
      if (mode !== 'mini') {
        var qb = el('div', 'sg-queue', stage);
        var qh = el('div', 'sg-queue-h', qb);
        el('b', '', qh, T('生成队列', 'Queue'));
        el('span', '', qh, T('人工审核后发布', 'Published after review'));
        R.q = V.map(function (v) {
          var it = el('div', 'sg-q', qb);
          var th = el('div', 'sg-q-thumb', it);
          var ts = sv('svg', { viewBox: '0 0 ' + CW + ' ' + CH, preserveAspectRatio: 'xMidYMid slice', width: mode === 'wide' ? 92 : 64, height: mode === 'wide' ? 66 : 46 }, th);
          bg(ts, v.key); battery(ts, 250, 250, 1, v.key === 'studio');
          var m = el('div', 'sg-q-main', it);
          el('b', '', m, v.label);
          var st = el('span', 'sg-q-state', m);
          var qbar = el('i', 'sg-q-bar', m); var f = el('i', '', qbar);
          return { it: it, st: st, f: f, v: v };
        });
        var note = el('div', 'sg-note', stage);
        icon('shield', note, mode === 'wide' ? 18 : 15);
        var nt = el('div', '', note);
        el('b', '', nt, T('发布前', 'Before publishing'));
        el('span', '', nt, T('每张图、每段视频都要你点通过', 'nothing goes live without your OK'));
      }
      var tg = el('div', 'sg-tag', mode === 'compact' ? null : stage, mode === 'mini' ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      if (mode === 'compact') bar.insertBefore(tg, live);
    }

    function tick(t) {
      var k = Math.floor(t / P), tau = t - k * P, v = mod(k, V.length), prev = mod(k - 1, V.length);
      var td = Math.min(2.0, Array.from(V[v].prompt).length / (ZH ? 12 : 26));
      var genA = 0.2 + td + 0.5, genB = genA + 1.4, swapAt = genA + 0.3;
      var swapped = tau >= swapAt, cover = seg(tau, genA, swapAt), gp = seg(tau, swapAt, genB), pr = seg(tau, genA, genB);
      var busy = tau >= genA && tau < genB, showCells = tau >= genA && tau < genB + 0.05, pal = PAL[V[v].key];
      // cover the old picture, swap under full cover, then let the new one resolve top-down
      R.bgs.forEach(function (g, i) { put(g, 'opacity', i === (swapped ? v : prev) ? '1' : '0'); });
      R.cells.forEach(function (c) {
        var o = !showCells ? 0 : !swapped ? c01(cover * 1.8 - c.l * 0.8) : 1 - c01((gp - c.o * 0.82) / 0.18);
        put(c.e, 'opacity', o.toFixed(2));
        // a low-resolution preview of the new scene: its colours by height, rows blending into each other
        if (showCells) put(c.e, 'fill', pal[Math.max(0, Math.min(pal.length - 2, Math.floor(c.y * (pal.length - 1) + (c.l - 0.5) * 0.7)))]);
      });
      put(R.scan, 'y', (gp * CH).toFixed(1));
      put(R.scan, 'opacity', swapped && showCells ? (0.75 * Math.sin(Math.PI * gp)).toFixed(2) : '0');
      var z = tau < genA ? 1 + 0.035 * (1 - ease.io(seg(tau, 0, 0.8))) : 1 + 0.035 * ease.sine(seg(tau, genB, P));
      put(R.cam, 'transform', 'translate(' + (CW / 2) + ',' + (CH / 2) + ') scale(' + z.toFixed(4) + ') translate(' + (-CW / 2) + ',' + (-CH / 2) + ')');
      put(R.bat.glint, 'x', (-120 + 520 * ease.io(seg(tau, genB + 0.1, genB + 1.1))).toFixed(1));
      put(R.canvasTag, 'text', V[swapped ? v : prev].label);
      put(R.prompt, 'text', typed(V[v].prompt, seg(tau, 0.2, 0.2 + td)));
      cl(R.promptBox, 'is-typing', tau < 0.3 + td);
      cl(R.gen, 'is-press', tau >= 0.55 + td && tau < 0.75 + td);
      cl(R.gen, 'is-busy', busy);
      put(R.gen, 'text', busy ? Math.round(pr * 100) + '%' : T('生成', 'Generate'));
      put(R.liveText, 'text', busy ? T('生成中', 'Generating') : T('就绪', 'Ready'));
      cl(R.live, 'is-idle', !busy);
      if (R.q) R.q.forEach(function (o, i) {
        var age = mod(v - i, V.length); // 0 = the one rendering now
        var fill, state, cls, okNow = age === 1 && tau >= P - 0.7;
        if (age === 0) { fill = tau < genA ? 0 : pr; state = tau < genA ? T('排队中', 'Queued') : tau < genB ? T('生成中 ', 'Rendering ') + Math.round(pr * 100) + '%' : T('待你审核', 'Awaiting review'); cls = tau >= genB ? 'review' : ''; }
        else if (age === 1) { fill = 1; state = okNow ? T('你已通过 ✓', 'You approved ✓') : T('待你审核', 'Awaiting review'); cls = okNow ? 'ok' : 'review'; }
        else { fill = 1; state = T('已通过', 'Approved'); cls = 'ok'; }
        put(o.st, 'text', state);
        put(o.f, '-transform', 'scaleX(' + fill.toFixed(3) + ')');
        cl(o.it, 'is-on', age === 0);
        cl(o.it, 'is-approving', okNow);
        cl(o.st, 'is-review', cls === 'review');
        cl(o.st, 'is-ok', cls === 'ok');
      });
      if (R.langChips) {
        var lk = Math.floor(t / LP), li = mod(lk, LANG.length);
        R.langChips.forEach(function (c, i) { cl(c, 'is-on', i === li); });
        put(R.langText, 'text', typed(LANG[li][1], seg(t - lk * LP, 0.1, 1.3)));
        put(R.langText, 'dir', LANG[li][0] === 'AR' ? 'rtl' : 'ltr');
        put(R.langText, 'lang', ['zh-CN', 'en', 'es', 'ar', 'ru'][li]);
      }
      if (R.assets) R.assets.forEach(function (a, i) { cl(a, 'is-on', i === (v === 0 ? 0 : v === 3 ? 3 : 3)); });
    }

    return {
      layouts: layouts,
      pick: function (w) { return w >= 1100 ? 'wide' : w >= 560 ? 'compact' : 'mini'; },
      build: build, tick: tick, still: 2 * P + 4.6, cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  var SCENES = { loop: LoopScene, radar: RadarScene, studio: StudioScene };
  // Scenes kept in their own files (js/stargo-motion-<name>.js, loaded before this one) queue a factory on
  // window.STARGO_SCENES. Each factory gets this kit and returns { sceneName: SceneConstructor }.
  var KIT = { T: T, el: el, sv: sv, put: put, css: css, cl: cl, c01: c01, seg: seg, ease: ease, mod: mod, hash: hash, bez: bez, bezD: bezD, curve: curve, fmt: fmt, typed: typed, flash: flash, textSwap: textSwap, icon: icon, ICON: ICON, STAR: STAR, ZH: ZH };
  (window.STARGO_SCENES || []).forEach(function (f) {
    try { var add = f(KIT); for (var k in add) if (!SCENES[k]) SCENES[k] = add[k]; } catch (err) { if (window.console) console.warn('[stargo-motion]', err); }
  });
  Array.prototype.forEach.call(hosts, function (host) {
    var make = SCENES[host.getAttribute('data-sg-scene')];
    if (!make) return;
    if (make === RadarScene && !window.STARGO_MAP) return;
    try { Runner(host, make()); } catch (err) { host.classList.remove('sg-mo-on'); if (window.console) console.warn('[stargo-motion]', err); }
  });
})();
