/* Atmosphere scenes — the factory-floor and office photographs the owner asked
   to have drawn in code (2026-10-24: 「现场氛围也全部换成代码」). Placed by
   tools/code-art-atmos.mjs, styled by css/stargo-motion-atmos.css, run by
   js/stargo-motion.js. Quiet, low-contrast line art in the dark warm palette:
   they sit behind text, so nothing in them is bright or busy.

   night — the homepage's full-screen picture before the four scenario cards
           (`.photo-half._01 / ._02`, R1v2 until 2026-10-24). The trade business
           at night as one system: the Liuzhou plant, the road to Qinzhou port,
           a container ship and the buyers over the sea, joined by thin lines.
           Müller Energie's inquiry comes down its line to the port and on to
           the plant, the plant's windows light up, a container is driven to
           the quay and craned onto the ship, and the shipment goes back up the
           line to Hamburg. The template opens the picture like two doors, so
           each half carries its own host and both draw the same stage (each
           host is the whole screen, clipped by its half).
   plant — about.html's introduction band (A01 until 2026-10-24): the plant at
           dawn as a line-art floor plan. Packs run round a U-shaped line and
           each station lights up the first time one reaches it; once the line
           is awake it stays lit and the packs keep moving. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, hash = K.hash, bez = K.bez, bezD = K.bezD, curve = K.curve;
  var TAG = T('动态示意 · 演示数据', 'Illustrative motion · demo data');
  function f1(n) { return n.toFixed(1); }
  function at(e, x, y, s) { css(e, 'transform', 'translate(' + f1(x) + 'px,' + f1(y) + 'px)' + (s ? ' scale(' + s.toFixed(3) + ')' : '')); }
  function op(e, v) { css(e, 'opacity', c01(v).toFixed(3)); }
  function label(stage, cls, x, y, a, b) {
    var d = el('div', 'sga-label ' + cls, stage);
    d.style.left = f1(x) + 'px'; d.style.top = f1(y) + 'px';
    el('b', '', d, a);
    return { d: d, s: el('span', '', d, b || '') };
  }

  /* =====================================================================
     NIGHT — 柳州工厂 → 钦州港 → buyers over the sea.
     ===================================================================== */
  function NightScene() {
    var P = 18;
    var layouts = { box: { w: 1200, h: 900 }, std: { w: 1440, h: 900 }, wide: { w: 1600, h: 900 }, ultra: { w: 2000, h: 900 } };
    /* Each buyer's line leaves the port along `a` and comes into the pin along −`b` (k: how far the bends reach,
       as a share of the line's length). Until 2026-10-24 every line left straight up and came in from the lower
       left, whichever side the name sat on, so Müller's bright line ran through Ahmed's two lines and ended over
       its own 「…48V 100Ah」, and PT Surya's ended over 「…补货周期到了」 (QA round 5 #12, 1440 zh). Now the names
       stand in two columns either side of the port's column, Nordwerk over Ahmed to its west and Müller over
       PT Surya to its east, each name on the side its line does not come from: the lines rise up the middle
       between the columns and turn out to their pins from below, so no line passes through a name. Every name
       also stays east of the doors' seam (W / 2, + 16px): each door draws its own half of the stage, and a name
       across the seam would split in two as they open (as en 'Qinzhou port' once did, see R.port below).
       Checked in all four layouts with the widest strings (en, and the 0.8 fit of 1280 × 720 that sets the type
       bigger in stage px): a line ends 18px from its own buyer's name and keeps ≥ 36px from every other name
       and ≥ 24px from every other pin. */
    var BUY = [
      { n: 'Müller Energie GmbH', c: T('德国 · 汉堡', 'Hamburg, Germany'), x: 0.78, y: 0.22, side: 1, a: [0.32, -0.95], b: [-0.83, 0.56], k: 0.42 },
      { n: 'Ahmed Al-Rashid', c: T('阿联酋 · 询价 72V × 50 台', 'UAE · asks about 72V × 50'), x: 0.7, y: 0.32, side: -1, a: [-0.4, -0.92], b: [0.69, 0.73], k: 0.54 },
      { n: 'PT Surya Energi', c: T('印度尼西亚 · 补货周期到了', 'Indonesia · due to restock'), x: 0.95, y: 0.435, side: -1, a: [0.41, -0.91], b: [0.26, 0.97], k: 0.5 },
      { n: 'Nordwerk Energie GmbH', c: T('德国 · 匹配度 94', 'Germany · fit 94'), x: 0.705, y: 0.145, side: -1, a: [0.1, -1], b: [0.05, 1], k: 0.6 }
    ];
    var WIN = 12, RIP = [0.6, 6.4, 9.6, 13.4], R, G, tio = null;   // RIP: when each buyer's ring ripples

    function build(stage, L, name) {
      var W = L.w, H = L.h, gy = Math.round(H * 0.68);
      stage.className = 'sg-mo-stage sga sga-night is-' + name;
      G = { W: W, H: H, gy: gy, px: W * 0.5, plant: [W * 0.07, W * 0.3], quay: W * 0.445, ship: [W * 0.575, W * 0.75] };
      if (name === 'box') G.plant = [W * 0.05, W * 0.31];
      R = { arcs: [], nodes: [], win: [] };
      var svg = sv('svg', { class: 'sga-svg', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H }, stage);
      // sky: a field of faint stars (one path of dots), a few that breathe
      var d = '';
      for (var i = 0; i < 90; i++) d += 'M' + f1(hash(i) * W) + ' ' + f1(hash(i + 300) * (gy - 140)) + 'h0';
      sv('path', { d: d, class: 'sga-stars' }, svg);
      R.tw = [3, 11, 19, 27, 41, 58].map(function (i) { return sv('circle', { cx: f1(hash(i) * W), cy: f1(hash(i + 300) * (gy - 140)), r: 1.4, class: 'sga-star' }, svg); });
      var moon = [W * 0.17, H * 0.17];
      sv('circle', { cx: f1(moon[0]), cy: f1(moon[1]), r: 70, class: 'sga-halo' }, svg);
      sv('circle', { cx: f1(moon[0]), cy: f1(moon[1]), r: 17, class: 'sga-moon' }, svg);
      // land and water
      // the karst hills round Liuzhou, faint behind the plant
      var hb = gy - H * 0.03, hx = -60, hd = 'M' + hx + ' ' + f1(hb), hs = (G.plant[1] + 120) / 9;
      for (var hi = 0; hi < 9; hi++) { var hh2 = H * (0.05 + 0.11 * hash(hi + 50)); hd += 'C' + f1(hx + hs * 0.12) + ' ' + f1(hb - hh2 * 1.32) + ' ' + f1(hx + hs * 0.88) + ' ' + f1(hb - hh2 * 1.32) + ' ' + f1(hx + hs) + ' ' + f1(hb); hx += hs; }
      sv('path', { d: hd + 'V' + gy + 'H-60Z', class: 'sga-hills' }, svg);
      sv('path', { d: 'M-2000 ' + gy + 'H' + f1(G.quay + W * 0.11), class: 'sga-ground' }, svg);
      var wd = '';
      for (var j = 0; j < 46; j++) { var wx = G.quay + hash(j + 90) * (W - G.quay + 300), wy = gy + 14 + hash(j + 140) * (H - gy - 30); wd += 'M' + f1(wx) + ' ' + f1(wy) + 'h' + f1(14 + hash(j + 7) * 46); }
      sv('path', { d: wd, class: 'sga-water' }, svg);
      // the buyers' lines: from the port up over the sea
      var port = G.hub = [G.ship[1] - 6, gy - 30];
      BUY.forEach(function (b, k) {
        var to = [W * b.x, H * b.y];
        var p = curve(port, b.a, to, b.b, b.k);
        sv('path', { d: bezD(p), class: 'sga-arc' }, svg);
        R.arcs.push({ p: p, hot: sv('path', { d: bezD(p), class: 'sga-arc is-hot' }, svg) });
        var g = sv('g', { class: 'sga-node' }, svg);
        g.setAttribute('transform', 'translate(' + f1(to[0]) + ' ' + f1(to[1]) + ')');
        var ring = sv('circle', { r: 9, class: 'sga-node-ring' }, g);
        sv('circle', { r: 2.6, class: 'sga-node-core' }, g);
        var rip = sv('circle', { r: 9, class: 'sga-node-rip' }, g);
        var lb = label(stage, 'sga-buyer' + (b.side < 0 ? ' is-left' : ''), to[0] + b.side * 18, to[1] - 11, b.n, b.c);
        R.nodes.push({ g: g, ring: ring, rip: rip, lb: lb });
      });
      // the plant: an office block and a saw-tooth hall with a row of windows
      var x0 = G.plant[0], x1 = G.plant[1], hh = H * 0.15, ox = x0 - W * 0.045;
      sv('path', { d: 'M' + f1(ox) + ' ' + gy + 'V' + f1(gy - H * 0.23) + 'H' + f1(x0) + 'V' + gy, class: 'sga-line sga-bld' }, svg);
      for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) sv('rect', { x: f1(ox + 14 + c * 22), y: f1(gy - H * 0.2 + r * 30), width: 12, height: 8, class: 'sga-win-dim' }, svg);
      var teeth = 6, tw = (x1 - x0) / teeth, roof = 'M' + f1(x0) + ' ' + gy + 'V' + f1(gy - hh);
      for (var t2 = 0; t2 < teeth; t2++) roof += 'L' + f1(x0 + tw * t2 + tw * 0.78) + ' ' + f1(gy - hh - 34) + 'V' + f1(gy - hh) + (t2 < teeth - 1 ? '' : '');
      roof += 'L' + f1(x1) + ' ' + f1(gy - hh) + 'V' + gy;
      sv('path', { d: roof, class: 'sga-line sga-bld' }, svg);
      for (var t3 = 0; t3 < teeth; t3++) sv('path', { d: 'M' + f1(x0 + tw * t3 + tw * 0.78) + ' ' + f1(gy - hh - 30) + 'v26', class: 'sga-glass' }, svg);
      var ww = (x1 - x0 - 40) / WIN;
      for (var k = 0; k < WIN; k++) {
        var wxx = x0 + 20 + k * ww;
        sv('rect', { x: f1(wxx), y: f1(gy - hh * 0.62), width: f1(ww - 8), height: 18, class: 'sga-win-dim' }, svg);
        R.win.push(sv('rect', { x: f1(wxx), y: f1(gy - hh * 0.62), width: f1(ww - 8), height: 18, class: 'sga-win' }, svg));
      }
      G.door = x1 - 46;
      sv('path', { d: 'M' + f1(G.door - 20) + ' ' + gy + 'v-30h40v30', class: 'sga-line' }, svg);
      R.doorLit = sv('rect', { x: f1(G.door - 19), y: gy - 29, width: 38, height: 29, class: 'sga-door' }, svg);
      R.plant = label(stage, 'sga-place', x0, gy + 22, T('柳州工厂', 'Liuzhou plant'), '');
      // the road to the port
      sv('path', { d: 'M' + f1(x1 + 8) + ' ' + (gy + 8) + 'H' + f1(G.quay), class: 'sga-road' }, svg);
      // the port: container stacks, two quay cranes, the quay
      var q = G.quay, cs = 0;
      for (var col = 0; col < 4; col++) for (var row = 0; row < 3 - (col % 2); row++) { sv('rect', { x: f1(q + 6 + col * 22), y: gy - 12 - row * 12, width: 20, height: 10, class: 'sga-box' + (hash(cs++) > 0.7 ? ' is-warm' : '') }, svg); }
      G.crane = [q + W * 0.075, q + W * 0.11];
      var boomY = gy - H * 0.17, boomEnd = G.ship[0] + 104;
      G.crane.forEach(function (cx, n) {
        sv('path', { d: 'M' + f1(cx - 16) + ' ' + gy + 'L' + f1(cx - 12) + ' ' + f1(boomY) + 'M' + f1(cx + 16) + ' ' + gy + 'L' + f1(cx + 12) + ' ' + f1(boomY) +
          'M' + f1(cx - 30) + ' ' + f1(boomY) + 'H' + f1(n ? boomEnd + 40 : boomEnd) + 'M' + f1(cx - 12) + ' ' + f1(boomY) + 'L' + f1(cx) + ' ' + f1(boomY - 34) + 'L' + f1(cx + 12) + ' ' + f1(boomY) +
          'M' + f1(cx) + ' ' + f1(boomY - 34) + 'L' + f1(n ? boomEnd + 40 : boomEnd) + ' ' + f1(boomY) + 'M' + f1(cx - 14) + ' ' + f1(gy - H * 0.07) + 'H' + f1(cx + 14), class: 'sga-line' }, svg);
        sv('circle', { cx: f1(cx), cy: f1(boomY - 34), r: 2, class: 'sga-beacon' }, svg);
      });
      G.boomY = boomY;
      R.trolley = sv('rect', { x: -9, y: f1(boomY - 3), width: 18, height: 7, rx: 1.5, class: 'sga-trolley' }, svg);
      R.cable = sv('rect', { x: -0.6, y: f1(boomY + 4), width: 1.2, height: 100, class: 'sga-cable' }, svg);
      sv('path', { d: 'M' + f1(q) + ' ' + gy + 'H' + f1(G.ship[0] - 4), class: 'sga-quay' }, svg);
      // the ship: hull, deck boxes with one empty slot, the bridge at the stern
      var s0 = G.ship[0], s1 = G.ship[1], sy = gy + 4;
      sv('path', { d: 'M' + f1(s0) + ' ' + sy + 'H' + f1(s1 + 26) + 'L' + f1(s1) + ' ' + (sy + 24) + 'H' + f1(s0 + 10) + 'Z', class: 'sga-hull' }, svg);
      var slots = Math.floor((s1 - s0 - 70) / 24);
      G.slot = [s0 + 70.5, sy - 16.5];
      for (var b2 = 0; b2 < slots; b2++) for (var lv = 0; lv < 2; lv++) {
        if (b2 === 0 && lv === 1) continue;
        sv('rect', { x: f1(s0 + 60 + b2 * 24), y: sy - 11 - lv * 11, width: 21, height: 10, class: 'sga-box' + (hash(b2 * 3 + lv) > 0.75 ? ' is-warm' : '') }, svg);
      }
      sv('path', { d: 'M' + f1(s0 + 10) + ' ' + sy + 'V' + (sy - 40) + 'H' + f1(s0 + 44) + 'V' + sy + 'M' + f1(s0 + 18) + ' ' + (sy - 40) + 'V' + (sy - 52) + 'H' + f1(s0 + 36) + 'V' + (sy - 40), class: 'sga-line' }, svg);
      R.shipLit = sv('g', { class: 'sga-shiplit' }, svg);
      for (var m = 0; m < 3; m++) { sv('rect', { x: f1(s0 + 15 + m * 9), y: sy - 33, width: 6, height: 5, class: 'sga-lamp' }, R.shipLit); sv('rect', { x: f1(s0 + 15 + m * 9), y: sy + 30 + m * 3, width: 6, height: 26 - m * 6, class: 'sga-reflect' }, R.shipLit); }
      sv('circle', { cx: f1(s1 + 20), cy: sy - 16, r: 1.8, class: 'sga-lamp' }, R.shipLit);
      // under the quay's containers, ending 16px short of the doors' seam (W / 2): each door carries its own half of
      // the stage, so a label that crossed the seam (en 'Qinzhou port' did, from the quay at 0.445 W) split in two as the doors opened
      R.port = label(stage, 'sga-place is-left', W * 0.5 - 16, gy + 22, T('钦州港', 'Qinzhou port'), '');
      // the container that travels, and the pulse
      R.box = sv('rect', { x: -11, y: -5, width: 22, height: 10, rx: 1, class: 'sga-moving' }, svg);
      R.pulse = sv('g', { class: 'sga-pulse' }, svg);
      sv('circle', { r: 14, class: 'sga-glow' }, R.pulse); sv('circle', { r: 3.6, class: 'sga-head' }, R.pulse);
      R.trail = [0, 1, 2].map(function () { return sv('circle', { r: 2.2, class: 'sga-head' }, svg); });
      // The tag rides the left door's inner edge, right-aligned with 钦州港 (W / 2 − 16): the doors slide outwards,
      // so at the stage's outer edge it left the screen in the opening's first frames, while the inner edges are the
      // last of the picture to go. 94px above the foot keeps it clear of the fixed pill navigation (from 992px:
      // 50px tall, 15px off the bottom, across the middle), and the same place serves the resting frame and the still.
      var tag = el('div', 'sg-tag sga-tag', stage, TAG);
      tag.style.left = (W * 0.5 - 16) + 'px'; tag.style.top = (H - 94) + 'px';
      // Near the end of the opening a door's strip is narrower than the tag: there it steps out (css: .is-out, gone
      // at once, back with a fade) rather than being sliced by the screen's edge. An observer on the tag itself, its
      // root 96px in from the sides, so the tag is gone before the edge even when the observer reports several
      // frames late on a busy page (a fade-out there was still showing as the edge reached it at 1024px); it
      // reports only when the tag crosses that line, never per frame. (The copy in the right door lies outside its
      // half, so it is always out.)
      if (tio) tio.disconnect();
      if ('IntersectionObserver' in window) {
        tio = new IntersectionObserver(function (es) { var e = es[es.length - 1]; cl(e.target, 'is-out', e.intersectionRatio < 0.99); }, { rootMargin: '0px -96px', threshold: [0.99] });
        tio.observe(tag);
      }
    }
    function pulseAt(p, u, back) {
      var q = bez(p, u); at(R.pulse, q[0], q[1]);
      R.trail.forEach(function (d, i) { var v = back ? u + 0.035 * (i + 1) : u - 0.035 * (i + 1); var r = bez(p, c01(v)); at(d, r[0], r[1]); op(d, (0.55 - i * 0.16) * (v > 0 && v < 1 ? 1 : 0)); });
    }
    function tick(t) {
      var ph = mod(t, P), gy = G.gy, fade = 1 - seg(ph, 16.8, 17.8);
      R.tw.forEach(function (s, i) { op(s, 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * (0.7 + i * 0.13) + i * 2))); });
      // the pulse: Müller's inquiry comes down (0.8–3.4), along the road (3.4–4.8); the shipment goes up (12.2–15.2)
      var down = seg(ph, 0.8, 3.4), road = seg(ph, 3.4, 4.8), up = seg(ph, 12.2, 15.2), A = R.arcs[0];
      var showP = (ph > 0.8 && ph < 4.8) || (ph > 12.2 && ph < 15.2);
      op(R.pulse, showP ? 1 : 0);
      if (ph < 3.4) pulseAt(A.p, 1 - ease.io(down), true);
      else if (ph < 4.8) {
        var e2 = ease.io(road), l1 = G.hub[0] - G.quay, l2 = G.quay - G.plant[1] - 8, d2 = e2 * (l1 + l2), rx, ry;
        if (d2 < l1) { rx = G.hub[0] - d2; ry = G.hub[1] + (gy + 8 - G.hub[1]) * (d2 / l1); } else { rx = G.quay - (d2 - l1); ry = gy + 8; }
        at(R.pulse, rx, ry); R.trail.forEach(function (d, i) { at(d, rx + 10 * (i + 1), ry); op(d, 0.5 - i * 0.15); });
      }
      else if (ph > 12.2) pulseAt(A.p, ease.io(up), false);
      if (!showP) R.trail.forEach(function (d) { op(d, 0); });
      op(A.hot, (seg(ph, 0.5, 1.2) * (1 - seg(ph, 3.6, 4.6)) + seg(ph, 11.9, 12.6) * (1 - seg(ph, 15.4, 16.6))) * 0.9);
      // buyers: Müller lit with the inquiry and the shipment, the others breathe in turn
      R.nodes.forEach(function (n, i) {
        var at0 = RIP[i], hot = i === 0 ? (ph > 0.6 && ph < 4.6) || (ph > 14.8 && ph < 17.4) : false;
        var rip = seg(ph, at0, at0 + 1.6);
        cl(n.g, 'is-hot', hot);
        css(n.rip, 'transform', 'scale(' + (1 + 2.2 * ease.out(rip)).toFixed(3) + ')');
        op(n.rip, rip > 0 && rip < 1 ? 0.7 * (1 - rip) : 0);
        cl(n.lb.d, 'is-hot', hot || (rip > 0 && rip < 1));
      });
      put(R.nodes[0].lb.s, 'text', ph > 14.8 && ph < 17.6 ? T('已发运 · DAP Hamburg', 'Shipped · DAP Hamburg') : T('询盘 · 200 pcs 48V 100Ah', 'Inquiry · 200 pcs 48V 100Ah'));
      // the plant wakes window by window
      var lit = 0;
      R.win.forEach(function (w, i) { var v = seg(ph, 4.9 + i * 0.26, 5.3 + i * 0.26) * fade; lit += v; op(w, v * (0.62 + 0.18 * hash(i + 20))); });
      op(R.doorLit, seg(ph, 8.2, 8.7) * (1 - seg(ph, 10.2, 11)));
      put(R.plant.s, 'text', ph > 4.8 && ph < 17 ? (ph < 8.6 ? T('排产 · 200 pcs', 'Scheduled · 200 pcs') : T('生产完成 · 已装柜', 'Built · container loaded')) : T('今晚', 'Tonight'));
      cl(R.plant.d, 'is-hot', ph > 4.6 && ph < 9);
      // the container: out of the door, along the road, up the crane, onto the ship
      var b = R.box, cx = G.crane[0], bx, by, vis = ph > 8.6 && ph < 17.8;
      var r1 = ease.io(seg(ph, 8.6, 10)), lift = ease.io(seg(ph, 10, 10.6)), over = ease.io(seg(ph, 10.6, 11.4)), drop = ease.io(seg(ph, 11.4, 11.9));
      bx = G.door + (cx - G.door) * r1; by = gy - 5;
      var top = G.boomY + 20;
      if (ph >= 10) { by = gy - 5 + (top - gy + 5) * lift; }
      if (ph >= 10.6) { bx = cx + (G.slot[0] - cx) * over; by = top; }
      if (ph >= 11.4) { by = top + (G.slot[1] - top) * drop; }
      at(b, bx, by); op(b, (vis ? 1 : 0) * fade);
      var tx = ph < 10 ? cx : bx;
      at(R.trolley, tx, 0);
      var cabTop = G.boomY + 4, cabLen = ph >= 10 && ph < 12.2 ? Math.max(1, by - 5 - cabTop) : (ph < 10 ? Math.max(1, (gy - 10 - cabTop) * seg(ph, 9.4, 10)) : 1);
      css(R.cable, 'transform', 'translate(' + f1(tx) + 'px,0) scaleY(' + (cabLen / 100).toFixed(3) + ')');
      op(R.cable, ph > 9.4 && ph < 12.2 ? 0.8 : 0);
      op(R.shipLit, seg(ph, 11.9, 12.5) * fade);
      put(R.port.s, 'text', ph > 9.6 && ph < 17.4 ? (ph < 12 ? T('装船', 'Loading') : T('已发运', 'Shipped')) : '');
      cl(R.port.d, 'is-hot', ph > 9.8 && ph < 13);
    }
    return {
      layouts: layouts,
      pick: function (w, h) { var r = w / h; return r >= 1.95 ? 'ultra' : r >= 1.7 ? 'wide' : r >= 1.45 ? 'std' : 'box'; },
      // the stage is drawn for 900px-high screens; shorter ones (1280 × 720 scales it to 0.8) keep the labels at
      // 12px or more through --sg-fit (css/stargo-motion-atmos.css)
      scaleVar: true,
      build: build, tick: tick, still: 15.6, start: 0.4
    };
  }

  /* =====================================================================
     PLANT — the Liuzhou plant at dawn, a floor plan whose line wakes up.
     ===================================================================== */
  function PlantScene() {
    /* The stage is drawn at the host's own size (scale 1, so every word is at its CSS size) and composed
       around the introduction card, which covers the middle of the band. The card's place comes from the
       band's template rules (css/cinery.cn2.css + css/stargo-fusion.css, by window width): its ring sits
       S px below the band's top and above its bottom, and it is 892px wide from 992px up.
         wide (window ≥ 1280) — the U line runs down the free columns either side of the card, its stations
                beside it, the title above the west column and the tag in the strip under the card;
         band (narrower) — the card fills the width, so the stations, the title and the tag sit in rows in
                the strip under the card; from 768px the line comes down the side gutters to reach them, on
                a phone (20px gutters) it simply crosses the strip.
       Nothing that moves ever crosses a word: names sit above their machines, off the belt. */
    var layouts = {};
    var ST = [T('电芯分选', 'Cell sorting'), T('模组装配', 'Module assembly'), T('BMS 测试', 'BMS test'), T('老化测试', 'Ageing test'), T('质检', 'Quality check'), T('包装', 'Packing'), T('装柜', 'Loading')];
    var SPEED, GAP, PRE, R, U;
    function lay(kind, w, h, s) { var k = kind + '-' + w + 'x' + h + '-' + s; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind, s: s }; return k; }
    function pick(w, h) {
      var vw = window.innerWidth || w;
      // the card's distance from the band's top and bottom edges: padding of the band + the section + the card's ring
      var s = vw < 480 ? 104 : vw < 768 ? 120 : vw < 992 ? 168 : 128;
      w = Math.round(w); h = Math.round(h);
      return vw >= 1280 ? lay('wide', Math.min(1440, w - (w % 2)), h, s) : lay('band', w, h, s);
    }

    function lerpPath(s) {
      // a point s px along the line
      var i = 0;
      while (i < U.len.length - 1 && s > U.len[i + 1]) i++;
      var a = U.pts[i], b = U.pts[i + 1], k = (s - U.len[i]) / ((U.len[i + 1] - U.len[i]) || 1);
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
    function along(x, y) {
      // the distance along the line to a point that lies on it
      for (var i = 0; i < U.pts.length - 1; i++) {
        var a = U.pts[i], b = U.pts[i + 1];
        if ((a[0] === b[0] && x === a[0] && (y - a[1]) * (y - b[1]) <= 0) || (a[1] === b[1] && y === a[1] && (x - a[0]) * (x - b[0]) <= 0)) return U.len[i] + Math.abs(x - a[0]) + Math.abs(y - a[1]);
      }
      return 0;
    }
    function machine(svg, cx, cy, w, h) {
      var gS = sv('g', { class: 'sga-st' }, svg);
      gS.setAttribute('transform', 'translate(' + f1(cx) + ' ' + f1(cy) + ')');
      sv('rect', { x: f1(-w / 2), y: f1(-h / 2), width: f1(w), height: f1(h), rx: h < 30 ? 5 : 7, class: 'sga-mach' }, gS);
      var r = h < 30 ? 3 : 4, ly = -h / 2 + (h < 30 ? 7 : 12);
      sv('path', { d: 'M' + f1(-w / 2 + 8) + ' ' + f1(ly) + 'h' + f1(w * 0.36) + (h < 30 ? '' : 'M' + f1(-w / 2 + 8) + ' ' + f1(ly + 8) + 'h' + f1(w * 0.22)), class: 'sga-mach-ln' }, gS);
      sv('circle', { cx: f1(w / 2 - 6 - r * 2), cy: f1(ly), r: r, class: 'sga-mach-ln' }, gS);
      var lit = sv('g', { class: 'sga-st-lit' }, gS);
      sv('rect', { x: f1(-w / 2), y: f1(-h / 2), width: f1(w), height: f1(h), rx: h < 30 ? 5 : 7, class: 'sga-mach is-lit' }, lit);
      sv('circle', { cx: f1(w / 2 - 6 - r * 2), cy: f1(ly), r: r * 0.6, class: 'sga-lamp' }, lit);
      return lit;
    }
    function name(stage, k, x, y, cls) {
      var lb = el('div', 'sga-st-name ' + cls, stage, ST[k]);
      lb.style.left = f1(x) + 'px'; lb.style.top = f1(y) + 'px';
      return lb;
    }
    function build(stage, L, kind) {
      var W = L.w, H = L.h, S = L.s, wide = L.kind === 'wide';
      stage.className = 'sg-mo-stage sga sga-plant is-' + L.kind;
      var svg = sv('svg', { class: 'sga-svg', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H }, stage);
      // the free column either side of the card (its ring included), and the strip under it
      var Z = wide || W >= 992 ? (W - 892) / 2 : W < 768 ? 20 : 40;
      var C = H - S;
      var m = wide ? [30, 96, 30, 40] : [3, 64, 3, 6];       // wall inset: left, top, right, bottom
      var x0 = m[0], y0 = m[1], x1 = W - m[2], y1 = H - m[3];
      // the column grid as one path of dots, the walls, the east windows and their dawn light
      var g = wide ? 96 : 64, d = '';
      for (var gx = x0 + g / 2; gx < x1; gx += g) for (var gyy = y0 + g / 2; gyy < y1; gyy += g) d += 'M' + f1(gx) + ' ' + f1(gyy) + 'h0';
      sv('path', { d: d, class: 'sga-grid' }, svg);
      sv('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 4, class: 'sga-wall' }, svg);
      if (wide) sv('rect', { x: x0 + 7, y: y0 + 7, width: x1 - x0 - 14, height: y1 - y0 - 14, rx: 2, class: 'sga-wall is-in' }, svg);
      var wd = '';
      for (var wy = y0 + 40; wy < y1 - 60; wy += wide ? 92 : 70) wd += 'M' + x1 + ' ' + wy + 'v' + (wide ? 46 : 34);
      sv('path', { d: wd, class: 'sga-east' }, svg);
      R = { st: [], packs: [], dawn: el('div', 'sga-dawn', stage) };

      // rows of the strip under the card (band): names, the line with its machines, then title + tag, spaced
      // evenly in the S − FADE px the band's bottom fade (css/stargo-motion-atmos.css) leaves untouched
      var FADE = S < 125 ? 40 : 64, LH = 17, MH = wide ? 60 : 20;
      var u = Math.max(4, (S - FADE - (LH * 2 + MH)) / 4);
      // the line: down the west column (or gutter), along the south, up the east side to the loading door
      var flat = !wide && W < 768;
      var ux0 = wide ? 58 : flat ? -20 : Math.round(Math.min(58, Math.max(10, Z / 2))), ux1 = W - ux0;
      var uy1 = wide ? H - 84 : C + u + LH + u + MH / 2;
      var top = wide ? y0 + 76 : y0 + 14;     // on the wide plan the line starts under the title block
      U = { pts: flat ? [[ux0, uy1], [ux1, uy1]] : [[ux0, top], [ux0, uy1], [ux1, uy1], [ux1, top]], len: [0] };
      for (var i = 1; i < U.pts.length; i++) U.len.push(U.len[i - 1] + Math.abs(U.pts[i][0] - U.pts[i - 1][0]) + Math.abs(U.pts[i][1] - U.pts[i - 1][1]));
      U.total = U.len[U.len.length - 1];
      var pd = 'M' + U.pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L');
      sv('path', { d: pd, class: 'sga-belt' }, svg);
      sv('path', { d: pd, class: 'sga-belt is-dash' }, svg);

      var first = U.total, feed = '';
      if (wide) {
        // three stations down each column, beside the line on the card's side, joined to it by a short feeder;
        // the seventh, the ageing tunnel, sits across the south run
        var bw = Math.min(132, Z - 70 - 22), bh = MH, ya = 270, yc = Math.max(ya + 200, C - 170), ys = [ya, (ya + yc) / 2, yc];
        [[0, 1, 2], [6, 5, 4]].forEach(function (ks, side) {
          ks.forEach(function (k, j) {
            var y = ys[j], mx = side ? ux1 - 12 - bw / 2 : ux0 + 12 + bw / 2, s = along(side ? ux1 : ux0, y);
            feed += side ? 'M' + (ux1 - 3) + ' ' + y + 'H' + (ux1 - 12) : 'M' + (ux0 + 3) + ' ' + y + 'H' + (ux0 + 12);
            R.st.push({ s: s, lit: machine(svg, mx, y, bw, bh), lb: name(stage, k, mx - bw / 2, y - bh / 2 - 7, 'is-n') });
            first = Math.min(first, s);
          });
        });
        R.st.push({ s: along(W / 2, uy1), lit: machine(svg, W / 2, uy1, 132, bh), lb: name(stage, 3, W / 2 + 66 + 12, uy1 - 6, 'is-n') });
        var tl = el('div', 'sga-plan-title', stage);
        el('b', '', tl, T('柳州工厂', 'Liuzhou plant')); el('span', '', tl, T('车间平面示意', 'Floor plan'));
        tl.style.left = (ux0 + 14) + 'px'; tl.style.top = (y0 + 30) + 'px';
        // .sg-tag is placed by its bottom-right corner: here just above the south run, inside the east column
        var tag = el('div', 'sg-tag sga-tag', stage, TAG);
        tag.style.left = (ux1 - 16) + 'px'; tag.style.top = (uy1 - 12) + 'px';
      } else {
        // the stations that fit the strip, in order, evenly along the south run
        var ks2 = W < 480 ? [2, 3, 4] : W < 768 ? [2, 3, 4, 5] : W < 992 ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];
        var a = Math.max(0, ux0) + 14, span = W - 2 * a, bw2 = Math.min(56, span / ks2.length - 34);
        ks2.forEach(function (k, j) {
          var x = Math.round(a + span * (j + 0.5) / ks2.length), s = along(x, uy1);
          R.st.push({ s: s, lit: machine(svg, x, uy1, bw2, MH), lb: name(stage, k, x, C + u, 'is-b') });
          first = Math.min(first, s);
        });
        var fy = uy1 + MH / 2 + u, mx2 = Math.max(16, ux0 + 10);
        if (W >= 340) {
          var tl2 = el('div', 'sga-plan-title is-row', stage);
          el('b', '', tl2, T('柳州工厂', 'Liuzhou plant')); if (W >= 560) el('span', '', tl2, T('车间平面示意', 'Floor plan'));
          tl2.style.left = mx2 + 'px'; tl2.style.top = fy + 'px';
        }
        var tag2 = el('div', 'sg-tag sga-tag', stage, TAG);
        tag2.style.left = (W - mx2) + 'px'; tag2.style.top = (fy + LH) + 'px';
      }
      if (feed) sv('path', { d: feed, class: 'sga-feed' }, svg);
      // the band shows its south strip first: the line is already running down to it, and its first pack is
      // about a second short of the first station when the scene starts
      SPEED = wide ? 80 : 60; GAP = wide ? 4.2 : 2.4;
      PRE = Math.max(0, first / SPEED - 1.2);
      for (var n = 0; n < Math.ceil(U.total / SPEED / GAP) + 1; n++) R.packs.push(sv('rect', { x: -7, y: -4.5, width: 14, height: 9, rx: 2, class: 'sga-pack' }, svg));
    }
    function tick(t) {
      op(R.dawn, 0.35 + 0.65 * ease.sine(seg(t, 0, 5)));
      // pack n is n·GAP behind the first; a station lights as the first pack reaches it and stays lit
      var tt = t + PRE, N = R.packs.length;
      for (var n = 0; n < N; n++) {
        var p = R.packs[n], age = tt - n * GAP;
        var s = age < 0 ? -1 : mod(age, N * GAP) * SPEED;
        if (s < 0 || s > U.total) { op(p, 0); continue; }
        var q = lerpPath(s); css(p, 'transform', 'translate(' + f1(q[0]) + 'px,' + f1(q[1]) + 'px)');
        op(p, seg(s, 0, 40) * (1 - seg(s, U.total - 40, U.total)));
      }
      var head = tt * SPEED;
      for (var i = 0; i < R.st.length; i++) {
        var o = R.st[i], v = seg(head, o.s - 8, o.s + 70);
        op(o.lit, v); cl(o.lb, 'is-on', v > 0.5);
      }
    }
    return {
      layouts: layouts,
      pick: pick,
      build: build, tick: tick, still: 60, start: 0
    };
  }

  return { night: NightScene, plant: PlantScene };
});
