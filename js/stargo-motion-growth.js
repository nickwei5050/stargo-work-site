/* Growth OS row backgrounds, capabilities.html 「主动获客」 (hosts placed by
   tools/blocks/cn-service.mjs, styled by css/stargo-motion-growth.css). The
   four night photographs behind the rows are drawn instead, in row order:
   dossier (企业研究: a company file assembling, each fact sourced and dated,
   one 待核实), lanes (贸易情报: shipment lanes to buyers' ports, one buyer's
   records at a time), rhythm (补货判断: PT Surya's ~60-day order rhythm up to
   the restock window), committee (关键角色: who weighs in, who decides, and the
   hand-off that waits for your OK). Cinery's hover crossfade sets each host's
   opacity and the runner ticks only a visible host, so only the hovered row's
   scene moves (on phones only the first background shows). Each stage takes
   its host's shape, so nothing is letterboxed. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  // a stage the shape of its host
  function shaped() {
    var layouts = {};
    return {
      layouts: layouts,
      pick: function (w, h) {
        // from 992 up the stage is drawn at about the host's own width (1200-1920, so 1:1 on most
        // screens); a 1440 design scaled up on a 1920 screen grew past the rows' type
        var dw = w >= 992 ? Math.min(1920, Math.max(1200, Math.round(w / 16) * 16)) : Math.max(320, Math.round(w));
        var dh = Math.max(360, Math.round(h * dw / w / 8) * 8);
        var k = dw + 'x' + dh;
        if (!layouts[k]) layouts[k] = { w: dw, h: dh };
        return k;
      }
    };
  }
  function base(stage, L, name) {
    stage.className = 'sg-mo-stage sgg sgg-' + name + (L.w >= 900 ? ' is-wide' : ' is-narrow');
    var svg = sv('svg', { class: 'sgg-svg', width: L.w, height: L.h, viewBox: '0 0 ' + L.w + ' ' + L.h }, stage);
    var tg = el('span', 'sg-tag sgg-tag', stage, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
    tg.style.left = (L.w - (L.w >= 900 ? 40 : 20)) + 'px';
    tg.style.top = (L.w >= 900 ? 136 : 104) + 'px';
    return svg;
  }
  // a card placed by its centre; appear(p) slides it up into place
  function card(stage, cls, x, y, w) {
    var c = el('div', 'sgg-card ' + (cls || ''), stage);
    c.style.left = Math.round(x - w / 2) + 'px'; c.style.top = Math.round(y) + 'px'; c.style.width = w + 'px';
    css(c, 'opacity', '0');
    return c;
  }
  function appear(c, p, o) {
    css(c, 'opacity', (p * (o == null ? 1 : o)).toFixed(3));
    css(c, 'transform', p >= 1 ? 'translateY(-50%)' : 'translateY(calc(-50% + ' + (12 * (1 - p)).toFixed(1) + 'px)) scale(' + (0.97 + 0.03 * p).toFixed(4) + ')');
  }
  function line(svg, a, b, bend, cls) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    var p = sv('path', { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + (mx - dy * bend).toFixed(1) + ' ' + (my + dx * bend).toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), class: cls || 'sgg-link', pathLength: 100, 'stroke-dasharray': '100 100', 'stroke-dashoffset': 100 }, svg);
    return p;
  }
  function draw(p, d, o) {
    put(p, 'stroke-dashoffset', (100 - 100 * d).toFixed(1));
    put(p, 'opacity', d > 0 ? (o == null ? 1 : o).toFixed(2) : '0');
  }
  function node(svg, x, y, cls) {
    var g = sv('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')' }, svg);
    return { g: g, rip: sv('circle', { r: 6, class: 'sgg-rip', opacity: 0 }, g), dot: sv('circle', { r: 4, class: cls || 'sgg-dot' }, g) };
  }
  function ripple(n, p, keep) {
    put(n.rip, 'opacity', p > 0 && p < 1 ? (0.8 * (1 - p)).toFixed(2) : '0');
    if (p > 0 && p < 1) put(n.rip, 'transform', 'scale(' + (1 + 3 * ease.out(p)).toFixed(3) + ')');
    if (!keep) put(n.dot, 'opacity', p > 0 ? '1' : '0');
  }
  function pill(parent, text, cls) { return el('span', 'sgg-pill' + (cls ? ' ' + cls : ''), parent, text); }
  // the end of every loop: what was assembled fades, the frame stays
  function outOf(u, P) { return 1 - seg(u, P - 1.5, P - 0.7); }

  /* =====================================================================
     DOSSIER — 企业研究
     ===================================================================== */
  function Dossier() {
    var P = 16;
    var F = [
      [T('官网', 'Website'), T('产品页 12 个 · 德英双语', '12 product pages · DE / EN'), T('来源：官网 · 10-21 更新', 'Source: website · updated 10-21')],
      [T('主营产品', 'Products'), T('储能系统集成 · 48V 机架式', 'Storage systems · 48V rack'), T('来源：产品目录 · 10-18 更新', 'Source: catalogue · updated 10-18')],
      [T('认证', 'Certifications'), 'CE · UN38.3 · IEC 62619', T('来源：官网下载区 · 10-21 更新', 'Source: downloads · updated 10-21')],
      [T('市场与渠道', 'Markets & channels'), T('德国 · 奥地利 · 经销与集成商', 'DE · AT · dealers, integrators'), T('来源：新闻稿 · 10-19 更新', 'Source: press release · updated 10-19')],
      [T('规模', 'Size'), T('员工约 120 人', 'About 120 staff'), T('仅一个来源 · 待核实', 'One source only · to verify'), true],
      [T('新闻', 'News'), T('近 90 天 3 条储能招标', '3 storage tenders in 90 days'), T('来源：公开招标 · 10-20 更新', 'Source: public tenders · updated 10-20')]
    ];
    var R;
    var S = shaped();
    function build(stage, L) {
      var svg = base(stage, L, 'dossier'), wide = L.w >= 900;
      R = { sat: [] };
      // the rows' type covers most of the field, so the file sits in the empty bands between rows
      // (~29%, ~50%, ~71% of the field), clear of hovered row 1 and its thumbnail. Below 992 it is the
      // whole section's background: the company between rows 2 and 3, its facts as chips either side.
      var cx = L.w / 2, cy = L.h * (wide ? 0.5 : 0.495);
      var SPOT = [[0.2, 0.295], [0.8, 0.295], [0.18, 0.5], [0.82, 0.5], [0.3, 0.71], [0.7, 0.71]];
      R.orbit = [wide ? 170 : 120, wide ? 280 : 170].map(function (r, i) {
        var g = sv('g', {}, svg);
        sv('circle', { cx: cx, cy: cy, r: r, class: 'sgg-orbit' + (i ? ' is-b' : '') }, g);
        return { g: g, sfx: ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')', dir: i ? -1 : 1 };
      });
      var cw = wide ? 330 : Math.min(310, L.w - 40);
      var c = R.center = card(stage, 'sgg-core', cx, cy, cw);
      var top = el('div', 'sgg-core-top', c);
      el('span', 'sgg-av', top, 'NE');
      var nm = el('div', 'sgg-core-name', top);
      el('b', '', nm, 'Nordwerk Energie GmbH');
      el('span', '', nm, T('德国 · 汉堡 · 企业档案', 'Hamburg, Germany · company file'));
      R.status = el('div', 'sgg-core-status', c);
      appear(c, 1);
      F.forEach(function (f, i) {
        var x, y, w, o = { at: 0.9 + i * 0.95 };
        if (wide) {
          x = L.w * SPOT[i][0]; y = L.h * SPOT[i][1]; w = 270;
        } else {
          x = L.w * [0.2, 0.5, 0.8][i % 3]; y = L.h * (i < 3 ? 0.275 : 0.712); w = Math.min(118, L.w * 0.3);
        }
        o.line = line(svg, [cx, cy], [x, y], wide ? 0.08 : 0.05);
        o.node = node(svg, x, y, f[3] ? 'sgg-dot is-ask' : 'sgg-dot');
        if (wide) {
          o.card = card(stage, f[3] ? 'is-ask' : '', x, y, w);
          el('span', 'sgg-k', o.card, f[0]);
          el('b', 'sgg-v', o.card, f[1]);
          el('span', 'sgg-src', o.card, f[2]);
        } else {
          // a phone has the row text over it: each fact is a chip — its name and whether it is checked
          o.card = card(stage, 'sgg-chip' + (f[3] ? ' is-ask' : ''), x, y, w);
          el('b', '', o.card, f[0]);
          el('span', '', o.card, f[3] ? T('待核实', 'to verify') : '✓');
        }
        R.sat.push(o);
      });
      // the centre paints above the links
      stage.appendChild(c);
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P), n = 0;
      R.orbit.forEach(function (o) { put(o.g, 'transform', 'rotate(' + (mod(t * 5 * o.dir, 360)).toFixed(2) + o.sfx); });
      R.sat.forEach(function (o) {
        var d = ease.io(seg(u, o.at, o.at + 0.7));
        draw(o.line, d, out);
        ripple(o.node, seg(u, o.at + 0.6, o.at + 1.7));
        put(o.node.g, 'opacity', out.toFixed(2));
        var p = ease.out(seg(u, o.at + 0.5, o.at + 1.1));
        appear(o.card, p, out);
        if (p >= 1 && out > 0.5) n++;
      });
      textSwap(R.status, n < 6 ? T('正在汇总来源 ' + n + '/6', 'Gathering sources ' + n + '/6') : T('5 项已核对 · 1 项待核实', '5 checked · 1 to verify'));
      cl(R.status, 'is-done', n === 6);
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 11, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* =====================================================================
     LANES — 贸易情报
     ===================================================================== */
  // land on a 3° grid, centred on the Pacific (tools/motion-map-coarse.mjs)
  var MASK = { w0: -30, top: 78, step: 3, cols: 120, rows: 45, bits: '4AEAAAAMAAAAAABgLz//8AAADFf/+NAAAADe/gH/4AAwAN////4ADwAfb+D///8F+MAAAAAB////////OAO////////4D////rhwAB/////////4P///4vBwAIM//////4EABgf/4PwAAIZ//////wMACAP/+PwAAd///////8cAAAP///4AAD///////8AAAAD///EAAH///////8AAAAD///2AAfLh3////mAAAAB//+AAAeP/7///+MAAAAD//8AAAYxf7///6IAAAAB//4AAAf4n////74AAAAB//wAAAf//////4AAAAAAf/gAAA///3///4AAAAAAHwgAAB///////wAAAAAAPwQAAD//9/H//AAAAAAADwQAAD////D78IAAAAAAB+eAAD//+8DhcIAAAAAAAeAAAD///wBg+MAAAAAAAHAAAD///8BgcEAAAAAAABHgAA///4AgQMAAAAAAAAPwAAd//wAA4wAAAAAAAAP+AAAf/gAAbyAAAAAAAAf/AAAf/AAAb44AAAAAAAf/wAAP+AAAEIegAAAAAA//8AAP/AAAGAOIAAAAAAf/+AAP/AAAAEFAAAAAAAP/8AAP/IAAAB0AAAAAAAH/4AAP/4AAAP+AAAAAAAH/4AAP8QAAAP+AAAAAAAD/4AAH8wAAA//hAAAAAAD/4AAH4AAAA//gAAAAAAB/AAAH4AAAA//wAAAAAAD/AAAHwAAAA//gAAAAAAD+AAACAAAAAwPAAAAAAAD2AAAAAAAAAAPAMAAAAAH4AAAAAAAAAAAAIAAAAADgAAAAAAAAAADBwAAAAAHgAAAAAAAAAAAAAAAAAAHAAAAAAAIAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAABAA' };
  var PORT = {
    nb: [121.6, 29.9, T('宁波', 'Ningbo')], sz: [114.1, 22.4, T('深圳', 'Shenzhen')], qz: [108.6, 21.6, T('钦州', 'Qinzhou')], hp: [106.7, 20.8, T('海防', 'Haiphong')],
    ham: [10, 53.5, T('汉堡', 'Hamburg')], jkt: [106.9, -6.1, T('雅加达', 'Jakarta')], dxb: [55, 25, T('杰贝阿里', 'Jebel Ali')], hou: [-95.3, 29.6, T('休斯敦', 'Houston')], los: [3.4, 6.4, T('拉各斯', 'Lagos')]
  };
  var SG = [[105.5, 3.5], [103.8, 1.2], [97, 5.5], [88, 5], [80, 5.5]];
  var SUEZ = [[66, 11], [52, 12.5], [43.4, 12.6], [39, 19], [34, 27.5], [32.5, 30.5], [28, 33.4], [18, 35.5], [10, 37.5], [0, 36.5], [-5.6, 36], [-10.5, 38], [-10, 43.5], [-5.5, 48.3], [0, 50], [4, 51.8], [8, 54]];
  // each lane: from, waypoints, to, buyer, what the records say, the change; two lanes may share a buyer
  var LANE = [
    ['nb', [[122.5, 26], [119, 22], [114, 17], [109, 10]].concat(SG, SUEZ), 'ham', 0],
    ['hp', [[108, 17], [109.5, 12], [106.5, 6]].concat(SG, SUEZ), 'ham', 0, true],
    ['sz', [[121, 21], [140, 24], [175, 25], [215, 18], [245, 11], [275, 6.5], [280.5, 8.8], [281, 11.5], [276, 17], [274.5, 21.5], [270, 25.5]], 'hou', 1],
    ['qz', [[109.5, 17], [110, 10], [108, 3], [106.9, -2]], 'jkt', 2],
    ['nb', [[122.5, 26], [119, 22], [114, 17], [109, 10]].concat(SG, [[72, 12], [62, 20], [58.5, 23.5], [56.6, 26.3]]), 'dxb', 3],
    ['sz', [[114, 17], [109, 10]].concat(SG.slice(0, 2), [[96, -2], [80, -15], [60, -28], [35, -36], [20, -36.5], [10, -28], [5, -10], [3, 0]]), 'los', 4]
  ];
  var BUYER = [
    ['Nordwerk Energie GmbH', T('近 12 个月 9 票 · HS 8507.60', '9 shipments in 12 months · HS 8507.60'), T('供应商 2 → 3 · 新增 1 家越南工厂', 'Suppliers 2 → 3 · a new one in Vietnam')],
    ['Gulf Coast Lift Supply', T('叉车电池 · 近 6 个月 4 票', 'Forklift batteries · 4 in 6 months'), T('铅酸换锂电 · 采购量 +35%', 'Lead-acid to lithium · volume +35%')],
    ['PT Surya Energi', T('约每 60 天一票', 'About one shipment every 60 days'), T('上一票到港已 60 天', 'Last arrival 60 days ago')],
    ['Gulf Solar Trading', T('储能柜 · 近 3 个月 3 票', 'Storage cabinets · 3 in 3 months'), T('供应商未变', 'Same supplier')],
    ['Lagos Power Ltd', T('离网储能 · 首次进口', 'Off-grid storage · first import'), T('新进口商', 'New importer')]
  ];
  function Lanes() {
    var P = 20, SLOT = P / BUYER.length, R;
    var S = shaped();
    function build(stage, L) {
      var svg = base(stage, L, 'lanes'), wide = L.w >= 900;
      var mw = wide ? L.w * 1.1 : L.w * 2.6, c0 = wide ? 150 : 75;
      var cell = mw / MASK.cols, mh = cell * MASK.rows, y0 = (L.h - mh) / 2 - (wide ? 0 : L.h * 0.04);
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
      sv('path', { d: d, class: 'sgg-land', 'stroke-width': (cell * 0.34).toFixed(2) }, svg);
      R = { lanes: [], ports: {}, buyers: [] };
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
          even.push([raw[j][0] + (raw[j + 1][0] - raw[j][0]) * f, raw[j][1] + (raw[j + 1][1] - raw[j][1]) * f]);
        }
        var dd = 'M' + raw.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
        var o = { buyer: ln[3], pts: even, isNew: !!ln[4] };
        o.base = sv('path', { d: dd, class: 'sgg-lane' + (o.isNew ? ' is-new' : '') }, svg);
        o.hi = sv('path', { d: dd, class: 'sgg-lane-hi', opacity: 0, pathLength: 100, 'stroke-dasharray': '100 100', 'stroke-dashoffset': 100 }, svg);
        o.ship = sv('circle', { r: wide ? 3.6 : 3, class: 'sgg-ship' }, svg);
        o.phase = hashOf(ln[0] + ln[2]);
        R.lanes.push(o);
      });
      Object.keys(PORT).forEach(function (k) {
        var p = px(PORT[k][0], PORT[k][1]);
        if (p[0] < 0 || p[0] > L.w) return;
        var g = sv('g', { class: 'sgg-port' + (/^(nb|sz|qz|hp)$/.test(k) ? ' is-origin' : '') }, svg);
        var nd = node(g, p[0], p[1], 'sgg-dot');
        put(nd.dot, 'opacity', '1');
        // the four origin ports sit close together: two labels open right, two left, staggered up and down
        var right = /^(hou|jkt|nb|sz)$/.test(k), dy = { nb: -6, sz: 15, qz: 15, hp: -6 }[k];
        var lab = sv('text', { x: (p[0] + (right ? 9 : -9)).toFixed(1), y: (p[1] + (dy == null ? 4 : dy)).toFixed(1), 'text-anchor': right ? 'start' : 'end', class: 'sgg-port-t' }, g);
        lab.textContent = PORT[k][2];
        R.ports[k] = { p: p, n: nd };
      });
      BUYER.forEach(function (b, i) {
        var to = R.ports[LANE.filter(function (l) { return l[3] === i; })[0][2]];
        if (!to) { R.buyers.push(null); return; }
        var w = wide ? 300 : Math.min(250, L.w - 40), x = to.p[0], y = to.p[1], cx, cy;
        // wide: every buyer's records open in one place, the empty middle of row 3 (row 2 is the one
        // hovered), and name their lane; narrow: above or below the port, kept inside the frame
        if (wide) { cx = L.w / 2; cy = L.h * 0.61; } else {
          cx = Math.max(w / 2 + 20, Math.min(L.w - w / 2 - 20, x + (x < L.w * 0.3 ? w * 0.35 : x > L.w * 0.7 ? -w * 0.35 : 0)));
          cy = y + (y > L.h * 0.55 ? 92 : -92);
        }
        var c = card(stage, 'sgg-callout' + (i === 0 || i === 4 ? ' is-change' : ''), cx, cy, w);
        var from = [];
        LANE.forEach(function (l) { if (l[3] === i && from.indexOf(PORT[l[0]][2]) < 0) from.push(PORT[l[0]][2]); });
        el('span', 'sgg-k', c, from.join(' / ') + ' → ' + PORT[LANE.filter(function (l) { return l[3] === i; })[0][2]][2]);
        el('b', 'sgg-v', c, b[0]);
        el('span', 'sgg-src', c, b[1]);
        el('span', 'sgg-chg', c, b[2]);
        R.buyers.push({ c: c, to: to });
      });
    }
    function hashOf(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return h / 997; }
    function tick(t) {
      var u = mod(t, P), act = Math.floor(u / SLOT), v = u - act * SLOT;
      R.lanes.forEach(function (o) {
        var on = o.buyer === act, d = on ? ease.io(seg(v, 0.1, 1.4)) * (1 - seg(v, SLOT - 0.5, SLOT)) : 0;
        put(o.hi, 'stroke-dashoffset', (100 - 100 * (on ? ease.io(seg(v, 0.1, 1.4)) : 0)).toFixed(1));
        put(o.hi, 'opacity', d.toFixed(2));
        // ships keep sailing on every lane, slowly; the active lane's ship rides its highlight
        var s = on && v < 1.4 ? ease.io(seg(v, 0.1, 1.4)) : mod(t / 26 + o.phase, 1);
        var pt = o.pts[Math.min(120, Math.floor(s * 120))];
        put(o.ship, 'cx', pt[0].toFixed(1)); put(o.ship, 'cy', pt[1].toFixed(1));
        put(o.ship, 'opacity', (on ? 1 : 0.55 * Math.min(1, s * 8, (1 - s) * 8)).toFixed(2));
        cl(o.base, 'is-on', on);
      });
      R.buyers.forEach(function (b, i) {
        if (!b) return;
        var on = i === act, p = on ? ease.out(seg(v, 1.0, 1.6)) : 0, o = on ? 1 - seg(v, SLOT - 0.6, SLOT - 0.1) : 0;
        appear(b.c, p, o);
        if (on) ripple(b.to.n, seg(v, 1.2, 2.4), true);
      });
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 2.6, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* =====================================================================
     RHYTHM — 补货判断
     ===================================================================== */
  function Rhythm() {
    var P = 16, R;
    var S = shaped();
    // day of the year: four orders about 60 days apart, today 60 days after the last
    var ORD = [[34, 120, '2/3'], [94, 150, '4/4'], [153, 140, '6/2'], [213, 160, '8/1']], TODAY = 273, DAYS = 304;
    var MON = T('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月', 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct').split(' ');
    function build(stage, L) {
      var svg = base(stage, L, 'rhythm'), wide = L.w >= 900;
      // shown while row 3 (~61% of the field) is hovered: the rhythm stands above it, the conclusion below;
      // the bars stay low enough that the interval labels clear row 1's heading
      var x0 = L.w * (wide ? 0.08 : 0.07), x1 = L.w * (wide ? 0.92 : 0.93), ay = L.h * (wide ? 0.47 : 0.6), bh = wide ? Math.max(120, Math.min(200, L.h * 0.47 - 350)) : 150, bw = wide ? 30 : 16;
      function X(d) { return x0 + d / DAYS * (x1 - x0); }
      R = { X: X, ay: ay, bars: [], spans: [] };
      sv('path', { d: 'M' + x0 + ' ' + ay + 'H' + x1, class: 'sgg-axis' }, svg);
      MON.forEach(function (m, i) {
        var x = X(i * 30.4);
        sv('path', { d: 'M' + x.toFixed(1) + ' ' + ay + 'v6', class: 'sgg-axis' }, svg);
        if (wide || i % 2 === 0) { var tx = sv('text', { x: (x + 4).toFixed(1), y: ay + 26, class: 'sgg-axis-t' }, svg); tx.textContent = m; }
      });
      // the restock window and the order that should come
      var wx = X(TODAY - 6), ww = X(TODAY + 6) - wx;
      R.band = sv('rect', { x: wx.toFixed(1), y: ay - bh - 40, width: ww.toFixed(1), height: bh + 40, class: 'sgg-band', opacity: 0 }, svg);
      R.ghost = sv('rect', { x: (X(TODAY) - bw / 2).toFixed(1), y: ay - bh * 0.62, width: bw, height: bh * 0.62, rx: 4, class: 'sgg-ghost', opacity: 0 }, svg);
      ORD.forEach(function (o, i) {
        var x = X(o[0]), h = bh * o[1] / 160;
        var g = sv('g', { class: 'sgg-bar' }, svg);
        var r = sv('rect', { x: (x - bw / 2).toFixed(1), y: ay - h, width: bw, height: h, rx: 4 }, g);
        r.style.transformOrigin = x.toFixed(1) + 'px ' + ay + 'px';
        var q = sv('text', { x: x.toFixed(1), y: ay - h - 12, 'text-anchor': 'middle', class: 'sgg-bar-q' }, g); q.textContent = '×' + o[1];
        var dt = sv('text', { x: x.toFixed(1), y: ay + 50, 'text-anchor': 'middle', class: 'sgg-bar-d' }, g); dt.textContent = o[2];
        R.bars.push({ g: g, r: r });
        if (i) {
          var a = X(ORD[i - 1][0]), top = ay - bh - (wide ? 44 : 40);
          var sp = sv('g', { class: 'sgg-span', opacity: 0 }, svg);
          sv('path', { d: 'M' + (a + 4).toFixed(1) + ' ' + (top + 10) + 'V' + top + 'H' + (x - 4).toFixed(1) + 'V' + (top + 10), class: 'sgg-span-l' }, sp);
          var st = sv('text', { x: ((a + x) / 2).toFixed(1), y: top - 10, 'text-anchor': 'middle', class: 'sgg-span-t' }, sp);
          st.textContent = T((o[0] - ORD[i - 1][0]) + ' 天', (o[0] - ORD[i - 1][0]) + ' days');
          R.spans.push(sp);
        }
      });
      R.cur = sv('g', { class: 'sgg-cursor' }, svg);
      sv('path', { d: 'M0 ' + ay + 'V' + (ay - bh - 40), class: 'sgg-cursor-l' }, R.cur);
      sv('circle', { cx: 0, cy: ay, r: 5, class: 'sgg-cursor-d' }, R.cur);
      R.count = el('div', 'sgg-count', stage);
      R.countN = el('b', '', R.count); R.countT = el('span', '', R.count, T('天未下单', 'days since the last order'));
      // wide: the count rides just right of the cursor, under the band's top, clear of row 1's text
      R.countDx = wide ? 14 : 0;
      R.count.style.top = (ay - bh - (wide ? 34 : 66)) + 'px';
      if (wide) R.count.style.alignItems = 'flex-start';
      var cw = wide ? 360 : Math.min(300, L.w - 40);
      var c = R.card = card(stage, 'sgg-restock', wide ? X(TODAY) - cw / 2 + 30 : L.w / 2, wide ? L.h * 0.705 : L.h * 0.2, cw);
      var hd = el('div', 'sgg-row', c); el('b', 'sgg-v', hd, 'PT Surya Energi'); R.pill = pill(hd, T('补货周期到了', 'Restock due'), 'is-amber');
      el('span', 'sgg-src', c, T('依据：近 3 次下单间隔 59–60 天 · 64V 104Ah', 'Why: the last 3 orders were 59–60 days apart'));
      el('span', 'sgg-chg', c, T('建议联系 · 跟进草稿等你确认', 'Worth a call · the draft waits for your OK'));
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P), X = R.X;
      R.bars.forEach(function (b, i) {
        var p = ease.out(seg(u, 0.3 + i * 0.35, 0.9 + i * 0.35));
        css(b.r, 'transform', 'scaleY(' + p.toFixed(3) + ')');
        put(b.g, 'opacity', (p > 0 ? Math.max(out, 0.35) : 0).toFixed(2));
      });
      R.spans.forEach(function (s, i) { put(s, 'opacity', (ease.out(seg(u, 1.2 + i * 0.35, 1.7 + i * 0.35)) * Math.max(out, 0.35)).toFixed(2)); });
      var sweep = ease.io(seg(u, 2.6, 8.6)), day = ORD[3][0] + Math.round(60 * sweep), x = X(ORD[3][0] + 60 * sweep);
      put(R.cur, 'transform', 'translate(' + x.toFixed(1) + ' 0)');
      put(R.cur, 'opacity', (seg(u, 2.2, 2.6) * out).toFixed(2));
      put(R.countN, 'text', String(day - ORD[3][0]));
      css(R.count, 'transform', R.countDx ? 'translate(' + (x + R.countDx).toFixed(1) + 'px,0)' : 'translate(' + x.toFixed(1) + 'px,0) translateX(-50%)');
      css(R.count, 'opacity', (seg(u, 2.2, 2.6) * out).toFixed(3));
      cl(R.count, 'is-due', day - ORD[3][0] >= 55);
      put(R.band, 'opacity', (ease.out(seg(u, 7.2, 8.4)) * out).toFixed(2));
      put(R.ghost, 'opacity', (ease.out(seg(u, 8.2, 9.2)) * out).toFixed(2));
      appear(R.card, ease.out(seg(u, 8.8, 9.6)), out);
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 12, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* =====================================================================
     COMMITTEE — 关键角色
     ===================================================================== */
  function Committee() {
    var P = 16, R;
    var S = shaped();
    var ROLE = [
      ['JW', T('采购经理', 'Purchasing manager'), 'J. Weber', T('发起需求', 'Raises the need'), T('依据：官网团队页 · 招聘启事', 'Source: team page · job post')],
      ['LF', T('技术负责人', 'Head of engineering'), 'L. Fischer', T('评估规格', 'Checks the spec'), T('依据：展会演讲 · 职业资料', 'Source: trade-fair talk · profile')],
      ['MB', T('财务总监', 'Finance director'), 'M. Braun', T('批预算', 'Holds the budget'), T('依据：年报签字页', 'Source: annual report')],
      ['TK', T('总经理', 'Managing director'), 'T. Krüger', T('拍板', 'Decides'), T('依据：公司注册信息', 'Source: company register')]
    ];
    function build(stage, L) {
      var svg = base(stage, L, 'committee'), wide = L.w >= 900;
      R = { roles: [] };
      var cx = wide ? L.w * 0.57 : L.w / 2, cw = wide ? 300 : Math.min(300, L.w - 40);
      // shown while row 4 (~81% of the field) is hovered: the committee stands in one line in the gap
      // between rows 2 and 3, the three who weigh in on the left, the one who decides at its end, and
      // the hand-off under him in the gap above row 4
      var y0 = wide ? L.h * 0.49 : 0, gy = L.h * (wide ? 0.70 : 0.86), dx = wide ? L.w * 0.83 : cx;
      var pos = wide
        ? [[L.w * 0.14, y0], [L.w * 0.36, y0], [L.w * 0.58, y0], [dx, y0]]
        : [[cx, L.h * 0.4], [cx, L.h * 0.55], [cx, L.h * 0.7], [cx, L.h * 0.2]];
      var dec = pos[3];
      // four across with a gap between them on the narrowest desktop stage (1200)
      if (wide) cw = Math.min(300, Math.round(L.w * 0.22 - 18));
      ROLE.forEach(function (r, i) {
        var o = { at: 0.8 + i * 0.9 };
        if (i < 3) {
          o.line = wide
            ? line(svg, [pos[i][0], y0 - 48], [dec[0] - 70 + i * 40, y0 - 48], 0.14, 'sgg-link is-flow')
            : line(svg, [pos[i][0] - cw / 2 + 18, pos[i][1]], [dec[0] - cw / 2 + 18, dec[1]], 0.25, 'sgg-link is-flow');
        }
        var c = o.card = card(stage, i === 3 ? 'sgg-role is-dec' : 'sgg-role', pos[i][0], pos[i][1], cw);
        var top = el('div', 'sgg-core-top', c);
        el('span', 'sgg-av', top, r[0]);
        var nm = el('div', 'sgg-core-name', top);
        el('b', '', nm, r[1]); el('span', '', nm, r[2]);
        o.pill = pill(top, r[3], i === 3 ? 'is-amber' : '');
        el('span', 'sgg-src', c, r[4]);
        R.roles.push(o);
      });
      var gw = wide ? 420 : cw, gx = wide ? Math.min(dx, L.w - gw / 2 - 24) : cx;
      if (wide) R.gateLine = line(svg, [dx, y0 + 50], [dx, gy - 24], 0, 'sgg-link');
      var g = R.gate = card(stage, 'sgg-gate', gx, gy, gw);
      var gr = el('div', 'sgg-row', g);
      el('b', 'sgg-v', gr, T('关键人 4 位 · 确认后交给 Sales Desk', '4 key people · next: Sales Desk'));
      R.gatePill = pill(gr, T('等你确认', 'Waits for your OK'), 'is-amber');
      R.dec = R.roles[3];
    }
    function tick(t) {
      var u = mod(t, P), out = outOf(u, P);
      R.roles.forEach(function (o, i) { appear(o.card, ease.out(seg(u, o.at, o.at + 0.6)), out); if (o.line) draw(o.line, ease.io(seg(u, 4.6 + i * 0.25, 5.6 + i * 0.25)), out); });
      cl(R.dec.card, 'is-on', u > 4.4 && out > 0.5);
      if (R.gateLine) draw(R.gateLine, ease.io(seg(u, 6.2, 6.7)), out);
      appear(R.gate, ease.out(seg(u, 6.6, 7.2)), out);
    }
    return { layouts: S.layouts, pick: S.pick, build: build, tick: tick, still: 10, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  return { dossier: Dossier, lanes: Lanes, rhythm: Rhythm, committee: Committee };
});
