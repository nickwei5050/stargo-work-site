/* Growth OS row 2 background, capabilities.html 「贸易情报」: a dotted world
   map, the shipping lanes from four Chinese and Vietnamese ports to four
   buyers' ports, and one buyer at a time — its lane lit, its ship sailing,
   its purchase records and supplier change under the row's type, beside
   the hovered row's thumbnail. Kept apart from js/stargo-motion-growth.js for its map data;
   it draws with that file's kit (K.growth, loaded first) and its styles are
   in css/stargo-motion-growth.css. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var H = K.growth;
  if (!H) return {};
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod;
  var clamp = H.clamp, shaped = H.shaped, strip = H.strip, base = H.base, tag = H.tag, box = H.box, appear = H.appear, two = H.two, path = H.path, draw = H.draw, node = H.node, ripple = H.ripple;

  // land on a 3° grid, centred on the Pacific (tools/motion-map-coarse.mjs)
  var MASK = { w0: -30, top: 78, step: 3, cols: 120, rows: 45, bits: '4AEAAAAMAAAAAABgLz//8AAADFf/+NAAAADe/gH/4AAwAN////4ADwAfb+D///8F+MAAAAAB////////OAO////////4D////rhwAB/////////4P///4vBwAIM//////4EABgf/4PwAAIZ//////wMACAP/+PwAAd///////8cAAAP///4AAD///////8AAAAD///EAAH///////8AAAAD///2AAfLh3////mAAAAB//+AAAeP/7///+MAAAAD//8AAAYxf7///6IAAAAB//4AAAf4n////74AAAAB//wAAAf//////4AAAAAAf/gAAA///3///4AAAAAAHwgAAB///////wAAAAAAPwQAAD//9/H//AAAAAAADwQAAD////D78IAAAAAAB+eAAD//+8DhcIAAAAAAAeAAAD///wBg+MAAAAAAAHAAAD///8BgcEAAAAAAABHgAA///4AgQMAAAAAAAAPwAAd//wAA4wAAAAAAAAP+AAAf/gAAbyAAAAAAAAf/AAAf/AAAb44AAAAAAAf/wAAP+AAAEIegAAAAAA//8AAP/AAAGAOIAAAAAAf/+AAP/AAAAEFAAAAAAAP/8AAP/IAAAB0AAAAAAAH/4AAP/4AAAP+AAAAAAAH/4AAP8QAAAP+AAAAAAAD/4AAH8wAAA//hAAAAAAD/4AAH4AAAA//gAAAAAAB/AAAH4AAAA//wAAAAAAD/AAAHwAAAA//gAAAAAAD+AAACAAAAAwPAAAAAAAD2AAAAAAAAAAPAMAAAAAH4AAAAAAAAAAAAIAAAAADgAAAAAAAAAADBwAAAAAHgAAAAAAAAAAAAAAAAAAHAAAAAAAIAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAABAA' };
  var PORT = {
    nb: [121.6, 29.9, T('宁波', 'Ningbo')], sz: [114.1, 22.4, T('深圳', 'Shenzhen')], qz: [108.6, 21.6, T('钦州', 'Qinzhou')], hp: [106.7, 20.8, T('海防', 'Haiphong')],
    ham: [10, 53.5, T('汉堡', 'Hamburg')], jkt: [106.9, -6.1, T('雅加达', 'Jakarta')], hou: [-95.3, 29.6, T('休斯敦', 'Houston')], los: [3.4, 6.4, T('拉各斯', 'Lagos')]
  };
  var SG = [[105.5, 3.5], [103.8, 1.2], [97, 5.5], [88, 5], [80, 5.5]];
  var SUEZ = [[66, 11], [52, 12.5], [43.4, 12.6], [39, 19], [34, 27.5], [32.5, 30.5], [28, 33.4], [18, 35.5], [10, 37.5], [0, 36.5], [-5.6, 36], [-10.5, 38], [-10, 43.5], [-5.5, 48.3], [0, 50], [4, 51.8], [8, 54]];
  // each lane: from, waypoints, to, buyer, a new supplier's lane (dashed)
  var LANE = [
    ['nb', [[122.5, 26], [119, 22], [114, 17], [109, 10]].concat(SG, SUEZ), 'ham', 0],
    ['hp', [[108, 17], [109.5, 12], [106.5, 6]].concat(SG, SUEZ), 'ham', 0, true],
    ['sz', [[121, 21], [140, 24], [175, 25], [215, 18], [245, 11], [275, 6.5], [280.5, 8.8], [281, 11.5], [276, 17], [274.5, 21.5], [270, 25.5]], 'hou', 1],
    ['qz', [[109.5, 17], [110, 10], [108, 3], [106.9, -2]], 'jkt', 2],
    ['sz', [[114, 17], [109, 10]].concat(SG.slice(0, 2), [[96, -2], [80, -15], [60, -28], [35, -36], [20, -36.5], [10, -28], [5, -10], [3, 0]]), 'los', 3]
  ];
  // buyer, its records, what changed
  var BUYER = [
    ['Nordwerk Energie GmbH', T('近 12 个月 9 票 · HS 8507.60', '9 shipments in 12 months'), T('供应商 2 → 3，新增越南工厂', 'Suppliers 2 → 3, one in Vietnam')],
    ['Gulf Coast Lift Supply', T('叉车电池 · 近 6 个月 4 票', 'Forklift batteries · 4 in 6 months'), T('铅酸换锂电，采购量 +35%', 'Lead-acid to lithium, +35%')],
    ['PT Surya Energi', T('约每 60 天一票', 'About one shipment every 60 days'), T('上次下单已 60 天', 'Last order 60 days ago')],
    ['Lagos Power Ltd', T('离网储能 · 首次进口', 'Off-grid storage · first import'), T('新进口商', 'New importer')]
  ];
  function Lanes() {
    var P = 20, SLOT = P / BUYER.length, R, S = shaped();
    function build(stage, L) {
      var G = base(stage, L, 'lanes'), svg = G.svg, th = G.rows[1].th;
      // the land never changes: a layer of its own under the one that moves
      var land = sv('svg', { class: 'sgg-svg sgg-land-l', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, null);
      stage.insertBefore(land, svg);
      // the map dims under the rows' description column, where the Americas fall
      var mk = 'linear-gradient(90deg, #000 ' + Math.round(G.cr - 460) + 'px, rgba(0,0,0,.3) ' + Math.round(G.cr - 370) + 'px)';
      [land, svg].forEach(function (s) { s.style.webkitMaskImage = mk; s.style.maskImage = mk; });
      var mw = L.w * 1.1, c0 = 150, cell = mw / MASK.cols, mh = cell * MASK.rows, y0 = (L.h - mh) / 2;
      function px(lon, lat) {
        if (lon < MASK.w0) lon += 360;
        return [L.w / 2 + (lon - c0) / 360 * mw, y0 + (MASK.top - lat) / (MASK.rows * MASK.step) * mh];
      }
      var bits = atob(MASK.bits), d = '';
      for (var r = 2; r < MASK.rows; r++) for (var c = 0; c < MASK.cols; c++) {
        var n = r * MASK.cols + c;
        if (!(bits.charCodeAt(n >> 3) & (128 >> (n & 7)))) continue;
        var x = L.w / 2 + (MASK.w0 + (c + 0.5) * MASK.step - c0) / 360 * mw, y = y0 + (r + 0.5) * cell;
        if (x > -10 && x < L.w + 10) d += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'h0';
      }
      sv('path', { d: d, class: 'sgg-land', 'stroke-width': (cell * 0.42).toFixed(2) }, land);
      R = { lanes: [], ports: {}, pv: {}, buyers: [] };
      LANE.forEach(function (ln) {
        var pts = [PORT[ln[0]]].concat(ln[1], [PORT[ln[2]]]).map(function (p) { return px(p[0], p[1]); });
        // Catmull-Rom through the waypoints, then resampled to 120 even steps for the ship
        var raw = [];
        for (var i = 0; i < pts.length - 1; i++) {
          var p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
          for (var s = 0; s < 8; s++) {
            var u = s / 8, u2 = u * u, u3 = u2 * u;
            raw.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
              0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)]);
          }
        }
        raw.push(pts[pts.length - 1]);
        var acc = [0];
        for (var k = 1; k < raw.length; k++) acc.push(acc[k - 1] + Math.hypot(raw[k][0] - raw[k - 1][0], raw[k][1] - raw[k - 1][1]));
        var total = acc[acc.length - 1], even = [], j = 0;
        for (var q = 0; q <= 120; q++) {
          var want = total * q / 120;
          while (j < acc.length - 2 && acc[j + 1] < want) j++;
          var f = (want - acc[j]) / ((acc[j + 1] - acc[j]) || 1);
          even.push([(raw[j][0] + (raw[j + 1][0] - raw[j][0]) * f).toFixed(1), (raw[j][1] + (raw[j + 1][1] - raw[j][1]) * f).toFixed(1)]);
        }
        var dd = 'M' + raw.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
        var o = { buyer: ln[3], pts: even, from: ln[0], to: ln[2] };
        o.base = sv('path', { d: dd, class: 'sgg-lane' + (ln[4] ? ' is-new' : '') }, svg);
        o.hi = path(svg, dd, 'sgg-lane-hi');
        o.ship = sv('circle', { r: 3.6, class: 'sgg-ship', opacity: 0 }, svg);
        R.lanes.push(o);
      });
      Object.keys(PORT).forEach(function (k) {
        var p = px(PORT[k][0], PORT[k][1]);
        R.ports[k] = node(svg, p[0], p[1], /^(nb|sz|qz|hp)$/.test(k) ? 'sgg-dot is-origin' : 'sgg-dot');
      });
      // the records, under row 2's type beside the hovered thumbnail (the corner with more room), so they
      // stay in the row's own band; the route is named there
      var C = H.corners ? H.corners(G, 1) : null, fb = C ? C.b : strip(G, 2, 'u'), bL = C ? C.L >= C.R : true;
      var rw = Math.min(460, C ? (bL ? C.L : C.R) : G.cr - G.cl), rx = C ? (bL ? C.lx - rw : C.rx) : G.cl;
      BUYER.forEach(function (b, i) {
        var from = [], to;
        LANE.forEach(function (l) { if (l[3] === i) { to = PORT[l[2]][2]; if (from.indexOf(PORT[l[0]][2]) < 0) from.push(PORT[l[0]][2]); } });
        var c = box(stage, 'is-2 sgg-rec', rx, fb.y, rw, 'l');
        var l2 = two(c, null, b[0], b[1] + ' · ');
        el('span', 'sgg-route', l2.previousSibling, from.join(' / ') + ' → ' + to);
        el('span', 'sgg-chg', l2, b[2]);
        R.buyers.push(c);
      });
      tag(stage, G.cr, strip(G, 1, 'd').y, 'r');
    }
    function tick(t) {
      var u = mod(t, P), act = Math.floor(u / SLOT), v = u - act * SLOT, pv = R.pv, k;
      for (k in R.ports) pv[k] = 0;
      R.lanes.forEach(function (o) {
        var on = o.buyer === act, dr = on ? ease.io(seg(v, 0.1, 1.4)) : 0, o2 = on ? 1 - seg(v, SLOT - 0.5, SLOT) : 0;
        draw(o.hi, dr, o2);
        cl(o.base, 'is-on', on);
        // only the lane being read has a ship: it sails while its records are open
        if (on) {
          var pt = o.pts[Math.round(ease.io(seg(v, 0.3, 3.8)) * 120)];
          put(o.ship, 'cx', pt[0]); put(o.ship, 'cy', pt[1]);
        }
        put(o.ship, 'opacity', (on ? seg(v, 0.2, 0.5) * o2 : 0).toFixed(2));
        if (on) { pv[o.from] = seg(v, 0.2, 1.3); pv[o.to] = seg(v, 3.7, 4.8); }
      });
      for (k in R.ports) ripple(R.ports[k], pv[k]);
      R.buyers.forEach(function (c, i) {
        var on = i === act;
        appear(c, on ? ease.out(seg(v, 0.9, 1.5)) : 0, on ? 1 - seg(v, SLOT - 0.6, SLOT - 0.1) : 0);
      });
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 2.9, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  return { lanes: Lanes };
});
