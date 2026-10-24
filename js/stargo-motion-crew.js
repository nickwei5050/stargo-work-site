/* CREW — 「让 AI 团队把活干完」 (capabilities #story-6), the first two cards, where the
   owner's photographs C09 (c09-288-flatlay) and C10 (c10-progress-board) were. They
   are the third card's siblings (the 'team' scene, js/stargo-motion-team.js): the same
   goal, the same four roles and a coordinator, the same chrome.

   crewRoles — 「288 个跨部门专业岗位」: the role directory as 288 dots in its ten
     functions (tools/copy.mjs WORKFORCE_ROLE_GROUPS: 15, 50, 16, 5, 20, 4, 14, 19, 129,
     16). A task is typed; the directory narrows to the four roles it needs and a
     coordinator (the team scene's "4 at work" and its coordinator), who lift out into
     one team that is then handed to the board. 288 is a directory, not 288 people.
   crewBoard — 「员工任务、进度与成果」: a board where tasks move 待开始 → 进行中 →
     待你确认 → 已完成 with what they delivered attached, and the results collect in a
     tray under the board. A person approves the email draft (the buttons take the
     result's place in its card); the quote below the floor price keeps waiting.

   Layouts follow the host so the scale stays ~1 (type ≥ 12px on phones):
     tall   W × 724  (W 440–640)  desktop cards
     mid    W × 500  (W 560–720)  tablets
     phone  W × 350  (W 300–440)  phones; the board becomes a list */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, ZH = K.ZH, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  // the glyphs are the capabilities page's (js/stargo-motion-cap-kit.js), under the roles' names
  var GA = { research: 'search', product: 'box', creative: 'image' };
  function glyph(n, p, s, c) { return K.capGlyph(GA[n] || n, p, s, c); }
  function box(c, p, x, y, w, h, t) { return K.capBox(c, p, x, y, w, h, t); }
  function pick(w, h) {
    if (h >= 620 && w >= 420) return { kind: 'tall', w: Math.max(440, Math.min(640, Math.round(w / 4) * 4)), h: 724 };
    if (h >= 440 && w >= 560) return { kind: 'mid', w: Math.max(560, Math.min(720, Math.round(w / 4) * 4)), h: 500 };
    return { kind: 'phone', w: Math.max(300, Math.min(440, Math.round(w / 2) * 2)), h: 350 };
  }
  function picker() {
    var layouts = {};
    return { layouts: layouts, pick: function (w, h) { var L = pick(w, h), k = L.kind + '-' + L.w; if (!layouts[k]) layouts[k] = L; return k; } };
  }
  function appBar(stage, title, crumb, tag) {
    var b = el('div', 'sg-app-bar sgc-bar', stage);
    var mk = el('span', 'sg-app-mark', b); K.icon('spark', mk, 13);
    el('b', '', b, title);
    if (crumb) el('span', 'sg-app-crumb', b, crumb);
    el('span', 'sg-tag', b, tag);
    return b;
  }
  function cursor(stage) {
    var c = el('div', 'sgc-cur', stage);
    var rip = el('i', 'sgc-rip', c);
    var p = sv('svg', { viewBox: '0 0 16 20', width: 16, height: 20, class: 'sgc-ptr', 'aria-hidden': 'true' }, c);
    sv('path', { d: 'M1.5 1.5v14.6l3.9-3.7 2.7 6 2.5-1.1-2.7-5.9 5.4-.2z' }, p);
    el('span', 'sgc-you', c, T('你', 'You'));
    return { c: c, rip: rip };
  }

  /* ===================== crewRoles: 288 → the five a task needs ===================== */
  // the ten functions as tools/copy.mjs WORKFORCE_ROLE_GROUPS names them (English shortened to fit
  // the label column: tall, then tablet)
  var DEPTS = [
    [T('企业通用支持', 'Enterprise essentials'), T('通用支持', 'Enterprise'), 15], [T('客户开发与市场', 'Customer development'), T('客户开发', 'Customer dev.'), 50],
    [T('销售', 'Sales'), T('销售', 'Sales'), 16], [T('客户服务', 'Customer service'), T('客户服务', 'Customer service'), 5],
    [T('风控与合规', 'Risk & compliance'), T('风控合规', 'Risk & compliance'), 20], [T('供应链', 'Supply chain'), T('供应链', 'Supply chain'), 4],
    [T('财务', 'Finance'), T('财务', 'Finance'), 14], [T('运营', 'Operations'), T('运营', 'Operations'), 19],
    [T('产品与工程', 'Product & engineering'), T('产品工程', 'Engineering'), 129], [T('专业服务', 'Professional services'), T('专业服务', 'Prof. services'), 16]
  ];
  // the four and their coordinator (from 运营, as the workforce page's 统筹协调 AI 员工):
  // department, the dot's index in it, glyph, name, short name, phone name
  var PICKS = [
    [1, 7, 'research', T('市场研究员', 'Market researcher'), T('市场研究员', 'Researcher'), T('研究员', 'Research')],
    [8, 40, 'product', T('产品工程师', 'Product engineer'), T('产品工程师', 'Engineer'), T('工程师', 'Engineer')],
    [2, 3, 'sales', T('销售', 'Sales'), T('销售', 'Sales'), T('销售', 'Sales')],
    [1, 31, 'creative', T('创意', 'Creative'), T('创意', 'Creative'), T('创意', 'Creative')],
    [7, 9, 'layers', T('统筹', 'Coordinator'), T('统筹', 'Coordinator'), T('统筹', 'Coordinator')]
  ];
  // the width of the five chips in a row (a generous estimate of the type), to choose the names that fit
  function slotsW(ix, ph) { return PICKS.reduce(function (s, p) { return s + Array.from(p[ix]).length * (ZH ? 13.5 : 7.4) + (ph ? 23 : 51); }, -7); }

  function RolesScene() {
    var P = 11, TY0 = 0.4, TY1 = 2, GO = 2.2, SCAN0 = 2.4, SCAN1 = 3.7, FLY0 = 3.9, FLY = 0.75, STEP = 0.32, TEAM = 6.1, HAND = 7.6, CLEAR = 10.4;
    var TASK = Array.from(T('开发德国储能经销商', 'Find storage distributors in Germany'));
    var lp = picker(), R, kind, W, H;

    function build(stage, L) {
      kind = L.kind; W = L.w; H = L.h; R = { stage: stage };
      stage.className = 'sg-mo-stage sgc sgc-roles is-' + kind;
      var ph = kind === 'phone', mid = kind === 'mid', pad = ph ? 12 : 18;
      appBar(stage, T('数字员工', 'AI Staff'), ph ? null : T('岗位目录', 'Role directory'), ph ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      var top = ph ? 50 : mid ? 60 : 68;
      // the count and the task
      var head = box('sgc-head', stage, pad, top, W - 2 * pad, ph ? 34 : 44);
      R.num = el('b', 'sgc-num', head, '288');
      R.numK = el('span', 'sgc-numk', head, T('个岗位 · 10 个职能', 'roles · 10 functions'));
      R.numX = el('span', 'sgc-numx', head, T('+ 统筹', '+ coordinator'));
      var qy = ph ? top + 40 : top + (mid ? 52 : 56), qh = ph ? 34 : 40;
      var q = box('sgc-q', stage, pad, qy, W - 2 * pad, qh);
      glyph('search', q, 15, 'sgc-q-ico');
      var qt = el('span', 'sgc-q-text', q); R.q = el('span', '', qt); R.car = el('i', 'sgc-car', qt); R.qn = -1;
      R.go = el('span', 'sg-btn is-primary sgc-go', q, T('筛选', 'Filter'));
      // the directory
      var inner = W - 2 * pad - (ph ? 20 : 28), nm = ph ? 5 : slotsW(3) <= inner ? 3 : 4, two = ph && slotsW(5, 1) > inner;
      var trayH = ph ? (two ? 94 : 62) : mid ? 76 : (W < 560 ? 116 : 90);
      var fy = qy + qh + (ph ? 10 : 16), fh = H - fy - trayH - (ph ? 10 : 16);
      // tablets set the ten functions in two columns of five, so the dots keep their size
      var cols = mid ? 2 : 1, cg = 26, colW = (W - 2 * pad - cg * (cols - 1)) / cols, split = mid ? 5 : DEPTS.length;
      var labW = ph ? 0 : mid ? (ZH ? 100 : 146) : W < 560 ? (ZH ? 104 : 140) : ZH ? 150 : 186, fw = colW - labW;
      var pitch = 18, rows, minH = ph ? 0 : 17, gap0 = ph ? (two ? 2 : 4) : 7;
      function colH(a, b, g) { var h = -g; for (var i = a; i < b; i++) h += Math.max(rows[i] * pitch, minH) + g; return h; }
      for (; pitch >= 8; pitch--) {
        var per = Math.floor(fw / pitch);
        rows = DEPTS.map(function (d) { return Math.ceil(d[2] / per); });
        if (Math.max(colH(0, split, gap0), colH(split, DEPTS.length, gap0)) <= fh) break;
      }
      per = Math.floor(fw / pitch);
      // what is left over opens the gaps between functions, up to twice the pitch
      var gaps = [[0, split], [split, DEPTS.length]].map(function (c) { var n = c[1] - c[0]; return n > 1 ? Math.min(2 * pitch, gap0 + Math.floor((fh - colH(c[0], c[1], gap0)) / (n - 1))) : 0; });
      var svg = sv('svg', { class: 'sgc-field', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' }, stage);
      R.fw = fw; R.scan = [];
      for (var c = 0; c < cols; c++) R.scan.push(sv('rect', { x: pad + c * (colW + cg) + labW - 10, y: fy - 4, width: 2, height: fh + 8, rx: 1, class: 'sgc-scan', opacity: 0 }, svg));
      var y = fy, r = Math.max(2.2, pitch * 0.3);
      R.dept = [];
      DEPTS.forEach(function (d, i) {
        var col = i < split ? 0 : 1, x0 = pad + col * (colW + cg), fx = x0 + labW, gap = gaps[col];
        if (i === split) y = fy;
        var rh = Math.max(rows[i] * pitch, minH), d0 = '';
        var pos = [];
        for (var k = 0; k < d[2]; k++) {
          var cx = fx + (k % per) * pitch + pitch / 2, cy = y + Math.floor(k / per) * pitch + pitch / 2 + (rh - rows[i] * pitch) / 2;
          pos.push([cx, cy]);
          d0 += 'M' + (cx - r).toFixed(1) + ' ' + cy.toFixed(1) + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0';
        }
        var path = sv('path', { d: d0, class: 'sgc-dots' }, svg);
        var lab = null;
        if (!ph) { lab = box('sgc-lab', stage, x0, y + rh / 2, labW - 12); el('span', '', lab, W < 560 || mid ? d[1] : d[0]); el('em', '', lab, String(d[2])); }
        R.dept.push({ p: path, lab: lab, pos: pos, hit: PICKS.some(function (p) { return p[0] === i; }) });
        y += rh + gap;
      });
      // the five roles: their dots, and the chips that carry them into the team
      var ty = H - trayH - (ph ? 2 : 6);
      var tray = R.tray = box('sgc-tray', stage, pad, ty, W - 2 * pad, trayH);
      var th = el('div', 'sgc-tray-h', tray);
      R.trayT = el('b', '', th, T('这次任务的团队', 'The team for this task'));
      R.teamBtn = el('span', 'sgc-team-st', th, T('待组队', 'Not formed'));
      var slots = el('div', 'sgc-slots', tray);
      cl(tray, 'is-two', two);
      R.picks = PICKS.map(function (p, i) {
        var at = R.dept[p[0]].pos[p[1]];
        var ring = sv('circle', { cx: at[0], cy: at[1], r: r + 3.5, class: 'sgc-ring', opacity: 0 }, svg);
        var dot = sv('circle', { cx: at[0], cy: at[1], r: r + 0.6, class: 'sgc-pick' }, svg);
        var slot = el('span', 'sgc-slot', slots);
        if (!ph) glyph(p[2], slot, 14);
        el('span', '', slot, p[nm]);
        var fly = el('span', 'sgc-fly', stage); glyph(p[2], fly, 13);
        return { ring: ring, dot: dot, slot: slot, fly: fly, at: at, to: null, t: FLY0 + i * STEP };
      });
    }

    function tick(t) {
      var tau = mod(t, P), i;
      cl(R.stage, 'is-clear', tau >= CLEAR);
      var n = tau >= CLEAR ? 0 : Math.round(TASK.length * c01((tau - TY0) / (TY1 - TY0)));
      if (R.qn !== n) { R.qn = n; put(R.q, 'text', n ? TASK.slice(0, n).join('') : T('写下一个任务…', 'Describe a task…')); cl(R.q, 'is-ph', !n); }
      // the caret blinks in script, so it stops with the scene off screen
      put(R.car, '-opacity', tau >= TY0 - 0.2 && tau < TY1 + 0.6 && (tau < TY1 || (tau * 2.4 | 0) % 2 === 0) ? '1' : '0');
      cl(R.go, 'is-press', tau >= GO && tau < GO + 0.18);
      cl(R.go, 'is-done', tau >= GO + 0.18 && tau < CLEAR);
      // the scan narrows 288 to 5
      var u = seg(tau, SCAN0, SCAN1), on = tau >= SCAN0 && tau < CLEAR;
      for (i = 0; i < R.scan.length; i++) {
        put(R.scan[i], 'opacity', u > 0 && u < 1 ? '1' : '0');
        put(R.scan[i], 'transform', 'translate(' + (R.fw * ease.io(u)).toFixed(1) + ' 0)');
      }
      // while it counts down the line says it is matching; at the end, four and a coordinator
      var cnt = tau < SCAN0 || tau >= CLEAR ? 288 : Math.round(288 - 284 * ease.out(u));
      if (R.cnt !== cnt) { R.cnt = cnt; put(R.num, 'text', String(cnt)); }
      var k2 = tau < SCAN0 || tau >= CLEAR ? 0 : tau < SCAN1 ? 1 : 2;
      if (R.k2 !== k2) { R.k2 = k2; textSwap(R.numK, [T('个岗位 · 10 个职能', 'roles · 10 functions'), T('匹配中…', 'matching…'), T('个岗位', 'roles')][k2]); cl(R.numX, 'is-on', k2 === 2); }
      for (i = 0; i < R.dept.length; i++) {
        var D = R.dept[i], dim = on && tau >= SCAN0 + (SCAN1 - SCAN0) * 0.15 * (i % 4 + 1);
        cl(D.p, 'is-dim', dim);
        if (D.lab) { cl(D.lab, 'is-dim', dim && !D.hit); cl(D.lab, 'is-hit', dim && D.hit); }
      }
      for (i = 0; i < R.picks.length; i++) {
        var p = R.picks[i], lit = tau >= SCAN0 + 0.25 + i * 0.22 && tau < CLEAR;
        cl(p.dot, 'is-on', lit);
        put(p.ring, 'opacity', lit && tau < p.t + 0.2 ? '1' : '0');
        if (!p.to) {
          // the slot's place on the stage, in the stage's own pixels
          var x = p.slot.offsetWidth / 2, y = p.slot.offsetHeight / 2, nd = p.slot;
          for (; nd && nd !== R.stage; nd = nd.offsetParent) { x += nd.offsetLeft; y += nd.offsetTop; }
          if (nd === R.stage && p.slot.offsetWidth) p.to = [x, y];
        }
        var f = seg(tau, p.t, p.t + FLY), e = ease.io(f), moving = f > 0 && f < 1 && p.to;
        if (moving) {
          var fx = p.at[0] + (p.to[0] - p.at[0]) * e, fy = p.at[1] + (p.to[1] - p.at[1]) * e - Math.sin(Math.PI * e) * 46;
          put(p.fly, '-transform', 'translate(' + fx.toFixed(1) + 'px,' + fy.toFixed(1) + 'px) scale(' + (0.7 + 0.3 * Math.sin(Math.PI * e)).toFixed(3) + ')');
        }
        put(p.fly, '-opacity', moving ? '1' : '0');
        cl(p.slot, 'is-on', tau >= p.t + FLY - 0.05 && tau < CLEAR);
      }
      // formed, then handed to the task board (the next card)
      var formed = tau >= CLEAR ? 0 : tau >= HAND ? 2 : tau >= TEAM ? 1 : 0;
      if (R.formed !== formed) { R.formed = formed; textSwap(R.teamBtn, [T('待组队', 'Not formed'), T('已组队 · 4 位 + 统筹', 'Team: 4 + coordinator'), T('已派活 · 见任务看板', 'Assigned · see the task board')][formed]); cl(R.teamBtn, 'is-on', !!formed); cl(R.tray, 'is-on', !!formed); }
    }
    return { layouts: lp.layouts, pick: lp.pick, build: build, tick: tick, start: 0, still: 7, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  /* ===================== crewBoard: tasks, progress, results ===================== */
  var COLS = [T('待开始', 'To do'), T('进行中', 'In progress'), T('待你确认', 'Needs you'), T('已完成', 'Done')];
  // role glyph, role, task, [[time, column]], what it delivers (shown from the column it names)
  // moves at least MOVE apart, so no two cards travel at once
  var TASKS = [
    { g: 'research', role: T('市场研究员', 'Researcher'), a: T('筛选储能经销商', 'List storage distributors'), s: [[0, 0], [1.4, 1], [4.8, 3]], out: T('12 家客户', '12 accounts') },
    { g: 'product', role: T('产品工程师', 'Product engineer'), a: T('核对 48V 规格', 'Check the 48V specs'), s: [[0, 0], [0.6, 1], [3.2, 3]], out: T('规格核对 3/3', 'Specs 3 of 3') },
    { g: 'sales', role: T('销售', 'Sales'), a: T('起草开发信', 'Draft the outreach email'), s: [[0, 0], [4, 1], [6.5, 2], [9.3, 3]], out: T('开发信草稿', 'Email draft'), out2: T('草稿已批准', 'Approved') },
    { g: 'creative', role: T('创意', 'Creative'), a: T('做开发信配图', 'Make the email images'), s: [[0, 0], [5.6, 1], [7.8, 3]], out: T('素材 3 张', '3 images') },
    { g: 'doc', role: T('销售', 'Sales'), a: T('报价 Q-1042', 'Quote Q-1042'), s: [[0, 2]], out: T('低于底价 · 待审批', 'Below floor price'), wait: 1 }
  ];
  // the tray under a tall board: each result as its task is done
  var OUTS = [['product', T('规格核对 3/3', 'Spec check 3/3'), 3.2], ['research', T('12 家客户名单', '12-account list'), 4.8], ['creative', T('开发信配图 3 张', '3 email images'), 7.8], ['sales', T('开发信 · 已批准', 'Email · approved'), 9.3]];
  function BoardScene() {
    var P = 15, TAP = 8.9, CLEAR = 14, MOVE = 0.65;
    var lp = picker(), R, kind, W, H;
    // every moment a card changes column, and where each card sits after it
    var EV = [];
    TASKS.forEach(function (k) { k.s.forEach(function (s) { if (EV.indexOf(s[0]) < 0) EV.push(s[0]); }); });
    EV.sort(function (a, b) { return a - b; });
    function colAt(k, tau) { var c = k.s[0][1]; for (var j = 0; j < k.s.length; j++) if (tau >= k.s[j][0]) c = k.s[j][1]; return c; }
    function slots(tau) {
      // in each column, cards in the order they arrived
      var out = [], cnt = [0, 0, 0, 0];
      var order = TASKS.map(function (k, i) {
        var c = colAt(k, tau), since = 0;
        for (var j = 0; j < k.s.length; j++) if (tau >= k.s[j][0] && k.s[j][1] === c) since = k.s[j][0];
        return { i: i, c: c, since: since };
      }).sort(function (a, b) { return a.since - b.since || a.i - b.i; });
      order.forEach(function (o) { out[o.i] = [o.c, cnt[o.c]++]; });
      return { at: out, cnt: cnt };
    }
    var SL = EV.map(function (e) { return slots(e + 0.001); });

    function build(stage, L) {
      kind = L.kind; W = L.w; H = L.h; R = { stage: stage };
      var list = kind === 'phone' || W < 560;
      stage.className = 'sg-mo-stage sgc sgc-board is-' + kind + (list ? ' is-list' : '');
      var ph = kind === 'phone', pad = ph ? 12 : 18;
      appBar(stage, T('数字员工', 'AI Staff'), ph ? null : T('任务看板', 'Task board'), ph ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
      var top = ph ? 48 : kind === 'mid' ? 58 : 66;
      // the summary: what is moving, what needs you, what is done
      var sum = box('sgc-sum', stage, pad, top, W - 2 * pad, ph ? 26 : 30);
      R.sum = [1, 2, 3].map(function (c) { var s = el('span', 'sgc-sum-i is-c' + c, sum); el('i', '', s); var b = el('b', '', s, '0'); el('span', '', s, COLS[c]); return b; });
      R.cards = [];
      var by = top + (ph ? 34 : 44);
      if (list) {
        var rh = ph ? 50 : 76, rg = ph ? 4 : 10;
        TASKS.forEach(function (k, i) { R.cards.push(card(stage, k, pad, by + i * (rh + rg), W - 2 * pad, rh, true)); });
      } else {
        var cg = 8, cw = Math.floor((W - 2 * pad - 3 * cg) / 4), ch = kind === 'mid' ? 80 : 104, sg = kind === 'mid' ? 6 : 8;
        R.geo = { x: function (c) { return pad + c * (cw + cg); }, y: function (s) { return by + 34 + s * (ch + sg); } };
        // a tall board ends where four done cards end; the results tray takes the rest
        var colH = kind === 'tall' ? 34 + 4 * (ch + sg) + 4 : H - by - pad;
        if (kind === 'tall') tray(stage, pad, by + colH + 10, W - 2 * pad, H - pad - by - colH - 10);
        COLS.forEach(function (c, j) {
          var col = box('sgc-col is-c' + j, stage, R.geo.x(j), by, cw, colH);
          var hd = el('div', 'sgc-col-h', col); el('i', '', hd); el('span', '', hd, c);
        });
        TASKS.forEach(function (k) { R.cards.push(card(stage, k, 0, 0, cw, ch, false)); });
      }
      R.cur = cursor(stage);
    }
    function tray(stage, x, y, w, h) {
      // the roles card's team tray, holding what the tasks hand in
      var t = box('sgc-tray sgc-res', stage, x, y, w, h), hd = el('div', 'sgc-tray-h sgc-res-h', t);
      el('b', '', hd, T('交付成果', 'Results'));
      R.resN = el('span', '', hd, '0 / ' + OUTS.length);
      var row = el('div', 'sgc-slots', t);
      R.res = OUTS.map(function (o) { var c = el('span', 'sgc-slot sgc-res-i', row); glyph(o[0], c, 13); el('span', '', c, o[1]); return c; });
    }
    function card(stage, k, x, y, w, h, row) {
      var c = box('sgc-card' + (row ? ' is-row' : ''), stage, x, y, w, h);
      var hd = el('div', 'sgc-card-r', c); glyph(k.g, hd, 13); el('span', '', hd, k.role);
      el('b', 'sgc-card-t', c, k.a);
      var o = { c: c, k: k, key: -1 };
      if (row) {
        var st = el('div', 'sgc-steps', c); o.steps = [0, 1, 2, 3].map(function () { return el('i', '', st); });
        o.pill = el('span', 'sgc-pill', c);
      }
      var out = o.out = el('span', 'sgc-out', c); glyph('check', out, 12); o.outT = el('span', '', out, k.out);
      if (k.out2) { var bt = o.btns = el('span', 'sgc-btns', c); o.ok = el('span', 'sg-btn is-primary', bt, T('批准', 'Approve')); el('span', 'sg-btn', bt, T('修改', 'Revise')); }
      return o;
    }

    var pt = [0, 0];
    function posAt(i, tau) {
      var k = 0; while (k + 1 < EV.length && tau >= EV[k + 1]) k++;
      var cur = SL[k].at[i], prev = SL[Math.max(0, k - 1)].at[i];
      var u = k ? ease.io(seg(tau, EV[k], EV[k] + MOVE)) : 1;
      pt[0] = R.geo.x(prev[0]) + (R.geo.x(cur[0]) - R.geo.x(prev[0])) * u;
      pt[1] = R.geo.y(prev[1]) + (R.geo.y(cur[1]) - R.geo.y(prev[1])) * u;
      return u;
    }
    function tick(t) {
      var tau = mod(t, P), i;
      cl(R.stage, 'is-clear', tau >= CLEAR);
      var cnt = [0, 0, 0, 0];
      for (i = 0; i < R.cards.length; i++) {
        var o = R.cards[i], k = o.k, c = colAt(k, tau);
        cnt[c]++;
        if (R.geo) {
          var u = posAt(i, tau);
          put(o.c, '-transform', 'translate(' + pt[0].toFixed(1) + 'px,' + pt[1].toFixed(1) + 'px)');
          cl(o.c, 'is-moving', u < 1);
        }
        if (o.key !== c) {
          o.key = c;
          put(o.c, 'data-col', String(c));
          if (o.pill) textSwap(o.pill, COLS[c]);
          if (o.steps) for (var s = 0; s < 4; s++) cl(o.steps[s], 'is-on', s <= c);
          var shown = c === 3 || (c === 2 && !!k.wait);
          cl(o.out, 'is-on', shown);
          put(o.outT, 'text', c === 3 && k.out2 ? k.out2 : k.out);
        }
        if (o.btns) { cl(o.btns, 'is-on', c === 2); cl(o.ok, 'is-press', tau >= TAP - 0.04 && tau < TAP + 0.2); }
      }
      for (i = 1; i < 4; i++) put(R.sum[i - 1], 'text', String(cnt[i]));
      if (R.res) {
        var nr = 0;
        for (i = 0; i < R.res.length; i++) { var got = tau >= OUTS[i][2] && tau < CLEAR; if (got) nr++; cl(R.res[i], 'is-on', got); }
        put(R.resN, 'text', nr + ' / ' + OUTS.length);
      }
      // the person approves the draft
      var cu = R.cur, card2 = R.cards[2];
      if (tau < TAP - 1.3 || tau > TAP + 0.9) { put(cu.c, '-opacity', '0'); return; }
      if (!R.okAt) {
        // the button's place in its card, read once (the card moves only by its transform)
        if (!card2.ok.offsetWidth) { put(cu.c, '-opacity', '0'); return; }
        var ox = card2.ok.offsetWidth / 2, oy = card2.ok.offsetHeight * 0.6, n = card2.ok;
        for (; n && n !== R.stage; n = n.offsetParent) { ox += n.offsetLeft; oy += n.offsetTop; }
        R.okAt = [ox, oy];
      }
      var x = R.okAt[0], y = R.okAt[1];
      if (R.geo) { posAt(2, tau); x += pt[0]; y += pt[1]; }
      var a = ease.io(seg(tau, TAP - 1.3, TAP - 0.1)), out = ease.io(seg(tau, TAP + 0.35, TAP + 0.9));
      var press = Math.sin(Math.PI * seg(tau, TAP - 0.04, TAP + 0.22));
      put(cu.c, '-transform', 'translate(' + (x + 60 * (1 - a) + 22 * out).toFixed(1) + 'px,' + (y + 50 * (1 - a) + 16 * out).toFixed(1) + 'px) scale(' + (1 - 0.14 * press).toFixed(3) + ')');
      put(cu.c, '-opacity', (seg(tau, TAP - 1.3, TAP - 1.05) * (1 - out)).toFixed(3));
      var rp = seg(tau, TAP, TAP + 0.6);
      put(cu.rip, '-transform', 'scale(' + (0.35 + 1.7 * ease.out(rp)).toFixed(3) + ')');
      put(cu.rip, '-opacity', rp > 0 && rp < 1 ? (0.8 * (1 - rp)).toFixed(3) : '0');
    }
    return { layouts: lp.layouts, pick: lp.pick, build: build, tick: tick, start: 0, still: 11, cue: function (t) { return Math.ceil(t / P) * P; } };
  }

  return { crewRoles: RolesScene, crewBoard: BoardScene };
});
