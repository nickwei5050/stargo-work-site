/* TEAM — 「团队分工、交流、并行与接力」 (capabilities #story-6, the third card)
   and 「不再各聊各的，一起把事做完」 (workforce), where a generated 'AI Staff'
   poster was (assets/stargo-product/sw006-expert-teams.webp).

   One goal is typed and handed to four AI employees, who work on it in
   parallel and pass work to each other. One of them stops until a person
   answers its question; a visible tap answers it. A coordinator (统筹) gathers
   the four results, reviews them and stops at a human approval gate in the
   loop scene's style: nothing is sent. Every name and number is demo data and
   the scene says so on itself (sg-tag).

   Lives in its own file and is queued on window.STARGO_SCENES; js/stargo-motion.js
   (loaded after this) hands it the engine's kit and runs it like its own scenes:
   tick(t) is a pure function of time, `still` is the reduced-motion frame.
   tools/motion-scenes.mjs places the hosts, css/stargo-motion-team.css styles it.

   Layouts, picked by the host's size (the type stays at its design size, so
   on phones the stage scale is ~1 and nothing is under 12 CSS px):
     wide   W × 615      capabilities card from a 1180px wide card (1280px
                         screens) up, W 1180–1280 following the card: four
                         lanes on a shared timeline, hand-off arrows, and
                         the coordinator's card
     mid     700 × 500   the same card on tablets and small laptops; in the
             W × H       notices page's 「继续看」 card (596–682 × 480) it
                         follows the host (W 560–700, H 440–500) so it is
                         drawn at scale 1, not shrunk to 0.85–0.96
     phone   W × 350     the same card on phones (W follows the host, 320–500;
                         a host under 350px tall, the notices card on tablets,
                         gets H = its height, down to 300)
     tile    W × W/1.78  workforce tile on desktop and tablet (W 470–552, so
                         at 1180–1366px screens it is drawn at its size, not
                         scaled under it)
     mini    W × W/1.78  workforce tile on phones (W 280–340) */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, flash = K.flash, textSwap = K.textSwap;
  var serial = 0;

  var GLYPH = {
    research: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l4.5 4.5',
    product: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    sales: 'M4.5 8.5h15v10h-15zM9 8.5V6.2c0-.7.5-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2v2.3M4.5 13h15',
    creative: 'M4.5 5.5h15v13h-15zM4.5 15.5l4.5-4.5 4 4 2.5-2.5 4 4M15 9.5h.01',
    layers: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5',
    target: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function box(cls, parent, x, y, w, h, text) {
    var e = el('div', cls, parent, text);
    var s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  function pop(e) {
    if (e.animate) e.animate([{ transform: 'scale(.95)' }, { transform: 'scale(1.035)', offset: 0.55 }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
  }

  function TeamScene() {
    var sid = 'sgt' + (++serial);

    /* ---------------- the script: seconds into a 22 s loop ---------------- */
    var P = 22;
    // the goal as typed; tiles narrower than 552 (1180-1366px screens) type the English one shorter
    var GOALS = [Array.from(T('开发德国储能经销商（演示）', 'Find storage distributors in Germany (demo)')), Array.from(T('开发德国储能经销商（演示）', 'Germany storage distributors (demo)'))];
    var GOAL = GOALS[0];
    var TYPE0 = 0.3, TYPE1 = TYPE0 + Math.min(1.8, GOAL.length / (K.ZH ? 8 : 24));
    var ASSIGN = 2.25;                  // the person presses 分派
    var SPLIT0 = 2.4, SPLIT1 = 3.15;    // the goal fans out to the four lanes
    var T0 = 3, T1 = 13;                // the span the lanes' shared timeline draws
    var ASK0 = 5, TAP = 6.4, ASK1 = 6.8; // the researcher stops for a person, the tap, it carries on
    var TRAVEL = 0.6;                   // a result's trip to the coordinator
    var REVIEW = 13.6, GATE = 15.2, CLEAR = 21.2;
    var DONE = [9.4, 6.5, 12.2, 12.8];  // when each lane delivers
    var FROM = [ASK1, 3.1, 6.7, 8.2];   // when its deliverable starts to fill
    var SEGS = [                        // w working · h waiting for a person · d waiting on a teammate
      [[3, ASK0, 'w'], [ASK0, ASK1, 'h'], [ASK1, 9.4, 'w']],
      [[3.1, 6.5, 'w']],
      [[3, 6.7, 'd'], [6.7, 12.2, 'w']],
      [[3.2, 4.8, 'w'], [4.8, 8.2, 'd'], [8.2, 12.8, 'w']]
    ];
    var ROLE = [
      { g: 'research', name: T('市场研究员', 'Market researcher'), short: T('市场研究员', 'Researcher') },
      { g: 'product', name: T('产品工程师', 'Product engineer'), short: T('产品工程师', 'Engineer') },
      { g: 'sales', name: T('销售', 'Sales'), short: T('销售', 'Sales') },
      { g: 'creative', name: T('创意', 'Creative'), short: T('创意', 'Creative') }
    ];
    // a hands to b at t; `text` labels the arrow (and the mini layout's line), `got` is the receiving row's own line on the phone
    var HAND = [
      { a: 1, b: 2, t: 6.6, text: T('规格已核对 → 可写开发信', 'Specs checked → write the email'), got: T('收到规格 → 写开发信', 'Got the specs → email') },
      { a: 2, b: 3, t: 8.1, text: T('开发信要配图 → 做 3 张素材', 'Email needs images → make 3'), got: T('收到要点 → 做配图', 'Got the brief → images') },
      { a: 0, b: 2, t: 9.6, text: T('12 家名单 → 排开发顺序', '12 accounts → rank for outreach'), got: T('收到 12 家名单', 'Got 12 accounts') }
    ];
    var IDLE = T('待分派', 'Not assigned yet'), DELIVERED = T('已交付', 'Delivered');
    var STATUS = [
      [[0, IDLE, 'idle'], [3, T('筛选德国储能经销商', 'Finding distributors'), 'w'], [ASK0, T('等你确认目标国家', 'Needs your answer'), 'h'],
        [TAP + 0.05, T('你已确认：仅德国', 'You: Germany only'), 'ok'], [ASK1, T('核实采购联系人', 'Verifying buyer contacts'), 'w'], [9.4, DELIVERED, 'done']],
      [[0, IDLE, 'idle'], [3.1, T('核对 48V 100Ah 规格', 'Checking 48V 100Ah specs'), 'w'], [4.5, T('电压、容量已核对', 'Voltage, capacity OK'), 'w'],
        [5.4, T('核对认证文件', 'Checking certificates'), 'w'], [6.5, DELIVERED, 'done']],
      [[0, IDLE, 'idle'], [3, T('等规格和客户名单', 'Needs specs, accounts'), 'd'], [6.7, T('起草开发信', 'Drafting the email'), 'w'],
        [9.8, T('排开发顺序', 'Ranking accounts'), 'w'], [12.2, DELIVERED, 'done']],
      [[0, IDLE, 'idle'], [3.2, T('整理产品照片和卖点', 'Photos and selling points'), 'w'], [4.8, T('等开发信要点', 'Waiting for the brief'), 'd'],
        [8.2, T('做开发信配图', 'Making email images'), 'w'], [12.8, DELIVERED, 'done']]
    ];
    var SHORT = [                       // the mini layout's second line
      [[0, T('待分派', 'Waiting'), 'idle'], [3, T('筛选中', 'Screening'), 'w'], [ASK0, T('等你确认', 'Needs you'), 'h'], [TAP + 0.05, T('你已确认', 'You chose'), 'ok'],
        [ASK1, T('核实中', 'Verifying'), 'w'], [9.4, T('12 家客户', '12 accounts'), 'done']],
      [[0, T('待分派', 'Waiting'), 'idle'], [3.1, T('核对规格', 'Checking'), 'w'], [6.5, T('规格核对', 'Spec check'), 'done']],
      [[0, T('待分派', 'Waiting'), 'idle'], [3, T('等接力', 'Waiting'), 'd'], [6.7, T('起草开发信', 'Drafting'), 'w'], [9.8, T('排顺序', 'Ranking'), 'w'],
        [12.2, T('开发计划', 'Outreach plan'), 'done']],
      [[0, T('待分派', 'Waiting'), 'idle'], [3.2, T('整理素材', 'Gathering'), 'w'], [4.8, T('等接力', 'Waiting'), 'd'], [8.2, T('做配图', 'Making'), 'w'],
        [12.8, T('素材 3 张', '3 images'), 'done']]
    ];
    var OUT_K = [T('目标客户', 'Target accounts'), T('规格核对', 'Spec check'), T('开发计划', 'Outreach plan'), T('素材', 'Assets')];
    var FINAL_N = [12, 3, 1, 3];
    function outCount(i, tau) {
      if (i === 0) return Math.round(12 * ease.out(seg(tau, ASK1, 9.2)));
      if (i === 1) return (tau >= 4 ? 1 : 0) + (tau >= 4.9 ? 1 : 0) + (tau >= 5.8 ? 1 : 0);
      if (i === 2) return tau >= 9.8 ? 1 : 0;
      return (tau >= 9.6 ? 1 : 0) + (tau >= 11 ? 1 : 0) + (tau >= 12.4 ? 1 : 0);
    }
    // the value a deliverable shows; built only when its count changes
    function outText(i, st, n, compact) {
      if (i === 0) return compact ? T('目标客户 ' + n + ' 家', n + ' accounts') : T(n + ' 家', String(n));
      if (i === 1) return compact ? (st === 2 ? T('规格核对', 'Specs checked') : T('规格核对 ' + n + '/3', 'Specs ' + n + '/3')) : n + '/3';
      if (i === 2) {
        if (st === 2) return compact ? T('开发计划 3 轮', 'Plan · 3 touches') : T('3 轮', '3 touches');
        return compact ? (n ? T('开发计划 · 排序', 'Plan · ranking') : T('开发计划 · 起草', 'Plan · drafting')) : (n ? T('排序中', 'Ranking') : T('起草中', 'Drafting'));
      }
      if (st === 2) return compact ? T('素材 3 张', '3 images') : T('3 张', '3 images');
      return compact ? T('素材 ' + n + ' 张', n + ' of 3 images') : T(n + ' 张', n + ' of 3');
    }
    var FINAL_V = [0, 1, 2, 3].map(function (i) { return outText(i, 2, FINAL_N[i], false); });

    var PH = T('写下一个目标…', 'Describe a goal…');
    var ASSIGN_T = [T('分派给团队', 'Assign to team'), T('已分派 · 4 位', 'Assigned · 4')];
    var ASSIGN_S = [T('分派', 'Assign'), T('已分派', 'Assigned')];
    var LIVE = [T('就绪', 'Ready'), T('4 位协作中', '4 at work'), T('等你确认', 'Needs you'), T('等你拍板', 'Your call')];
    var D = {
      coord: T('统筹', 'Coordinator'),
      coordSub: T('汇总成果 · 复核 · 交你确认', 'Gathers, reviews, hands to you'),
      idleSub: T('等目标分派', 'Waiting for a goal'),
      track: T('统筹 · 跟进 4 位员工', 'Coordinator · tracking 4'),
      trackSub: T('成果到齐后汇总、复核', 'Reviews each result'),
      approval: T('人工审批', 'Human approval'),
      approvalSub: [T('关键一步，由你决定', 'The key step is yours to decide'), T('你确认过 1 个问题 · 暂无待办', '1 question answered · nothing waiting')],
      askWho: T('市场研究员问：目标国家', 'Market researcher asks'),
      askQ: T('只做德国，还是加上奥地利、瑞士？', 'Germany only, or Austria and Switzerland too?'),
      askLine: T('研究员问：要不要加上奥地利、瑞士？', 'Researcher: add Austria and Switzerland?'),
      askShort: T('要不要加上奥地利、瑞士？', 'Add Austria and Switzerland?'),
      askMini: T('目标国家？', 'Markets?'),
      pick: T('仅德国', 'Germany only'),
      other: T('三国都做', 'All three'),
      ok: T('你已确认：仅德国', 'You chose: Germany only'),
      okSub: T('市场研究员继续核实联系人', 'The researcher carries on'),
      review: T('统筹 · 复核汇总', 'Coordinator · reviewing'),
      reviewSub: T('4 项成果 · 你确认过 1 个问题', '4 results · 1 answer from you'),
      gate: T('等你拍板', 'Your call'),
      gateSub: T('4 项成果已汇总 · 未发送任何内容', '4 results ready · nothing has been sent'),
      gateMini: T('等你拍板 · 未发送任何内容', 'Your call · nothing sent'),
      gateSubS: T('尚未发送任何内容', 'Nothing sent yet'),
      miniIdle: T('统筹 · 等你给目标', 'Coordinator · waiting for a goal'),
      assigned: T('已分派给 4 位 AI 员工', 'Assigned to 4 AI employees'),
      parallel: T('4 位员工并行开工', '4 roles working in parallel'),
      approve: T('批准', 'Approve'), revise: T('修改', 'Revise'),
      wait: T('等待中', 'waiting'),
      rev: [T('等成果到齐', 'Waiting'), T('复核中', 'Reviewing'), T('已复核', 'Reviewed')]
    };
    var RECV = [0, 1, 2, 3, 4].map(function (n) { return T('统筹 · 已收到 ' + n + '/4 项成果', 'Coordinator · ' + n + ' of 4 in'); });
    var RECV_S = [0, 1, 2, 3, 4].map(function (n) { return T('统筹 · 已收到 ' + n + '/4', 'Coordinator · ' + n + '/4 in'); });
    var JUSTIN = [T('等第一份成果', 'Waiting for the first result'), T('刚收到：规格核对', 'Just in: spec check'), T('刚收到：目标客户 12 家', 'Just in: 12 target accounts'),
      T('刚收到：开发计划', 'Just in: outreach plan'), T('刚收到：素材 3 张', 'Just in: 3 images')];

    function dockState(tau) {
      if (tau < ASSIGN) return 0;        // waiting for a goal
      if (tau < ASK0) return 1;          // tracking the four
      if (tau < TAP + 0.35) return 2;    // a question for the person
      if (tau < ASK1 + 0.5) return 3;    // answered
      if (tau < REVIEW) return 4;        // results coming in
      if (tau < GATE) return 5;          // review
      return 6;                          // the gate
    }
    function received(tau) {
      var n = 0;
      for (var i = 0; i < 4; i++) if (tau >= DONE[i] + TRAVEL) n++;
      return n;
    }
    // the mini caption tells each hand-off in turn, after the answer has been shown
    function miniHand(tau) {
      if (tau >= ASK1 + 0.5 && tau < HAND[1].t) return 0;
      if (tau >= HAND[1].t && tau < HAND[2].t) return 1;
      if (tau >= HAND[2].t && tau < HAND[2].t + 1.6) return 2;
      return -1;
    }

    /* ---------------- layouts ---------------- */
    var layouts = {};
    function lay(kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
    /* The card is 615px tall from 992px up and 1100-1280 wide only on 1280px screens and wider; below
       that its 944-1100 × 615 box takes the tablet layout, scaled up, rather than the wide one scaled
       to 0.8. The tile keeps the picture's 1672 × 941 box, so it is always about 1.78 wide to 1 tall. */
    function pick(w, h) {
      var a = w / h;
      if (h >= 560) return a > 1.55 && w >= 1180 ? lay('wide', Math.min(1280, Math.floor(w / 10) * 10), 615) : lay('mid', 700, 500);
      if (a >= 1.62) {
        if (w >= 552) return lay('tile', 552, 311);
        if (w >= 470) { var tw = Math.floor(w / 10) * 10; return lay('tile', tw, Math.floor(tw * 941 / 1672)); }
        var mw = Math.max(280, Math.min(340, Math.floor(w / 10) * 10));
        return lay('mini', mw, Math.floor(mw * 941 / 1672));
      }
      // a host this short is a card, not the capabilities band: draw at its own size where it is under 700 × 500
      if (w >= 560) return lay('mid', Math.min(700, Math.floor(w / 2) * 2), Math.max(440, Math.min(500, Math.floor(h))));
      var ph = Math.max(300, Math.min(350, Math.floor(h)));
      return lay('phone', Math.max(320, Math.min(500, Math.floor(w * ph / h / 2) * 2)), ph);
    }

    var kind, W, H, R, LIT;

    function appBar(stage, o) {
      var b = el('div', 'sg-app-bar', stage);
      var mk = el('span', 'sg-app-mark', b); K.icon('spark', mk, o.mark);
      el('b', '', b, T('AI 团队', 'AI Team'));
      if (o.crumb) el('span', 'sg-app-crumb', b, T('开拓新市场', 'New market'));
      if (o.tag) el('span', 'sg-tag', b, o.tag);
      if (o.pill) { R.live = el('span', 'sg-app-live', b); el('i', '', R.live); R.liveText = el('span', '', R.live); }
    }
    function goalCard(stage, x, y, w, h, btn) {
      var c = box('sg-team-goal sg-team-card', stage, x, y, w, h);
      if (kind === 'mini') glyph('target', c, 13, 'sg-team-k');
      else el('span', 'sg-team-k', c, T('目标', 'Goal'));
      R.goalBox = el('div', 'sg-team-goal-text', c);
      R.goal = el('span', '', R.goalBox);
      if (btn) { R.assign = el('span', 'sg-btn is-primary sg-team-assign', c); R.assignT = btn; }
      return c;
    }
    function lane(stage, i, x, y, w, h, o) {
      var r = ROLE[i];
      var c = box('sg-team-lane sg-team-card', stage, x, y, w, h);
      var av = el('div', 'sg-team-av', c); glyph(r.g, av, o.ico); el('i', 'sg-team-pip', av);
      var tx = el('div', 'sg-team-tx', c);
      el('b', 'sg-team-name', tx, o.short ? r.short : r.name);
      var st = el('div', 'sg-team-status', tx);
      glyph('arrow', st, 13, 'sg-team-st-ico');
      var L = { c: c, st: el('span', '', st), key: -2, ok: -1 };
      if (o.chip) {
        var ch = L.chip = el('div', 'sg-team-out', c);
        if (o.chip === 'two') el('span', 'sg-team-out-k', ch, OUT_K[i]);
        var v = el('div', 'sg-team-out-v', ch);
        L.val = el('b', '', v);
        glyph('check', v, o.chip === 'two' ? 15 : 13, 'sg-team-ck');
        if (o.chip === 'two' && i === 3) { var th = el('span', 'sg-team-thumbs', v); L.thumbs = [el('i', '', th), el('i', '', th), el('i', '', th)]; }
        L.compact = o.chip !== 'two';
      }
      return L;
    }
    function gateGlyph(parent, size) {
      var s = sv('svg', { viewBox: '-20 -20 40 40', width: size, height: size, class: 'sg-gate sg-team-gate', 'aria-hidden': 'true' }, parent);
      var ring = sv('circle', { r: 17, class: 'sg-gate-ring' }, s);
      sv('rect', { x: -6.5, y: -6.5, width: 13, height: 13, rx: 2.5, transform: 'rotate(45)', class: 'sg-gate-core' }, s);
      return { s: s, ring: ring };
    }
    /* The person's corner: the question while the researcher waits, and the
       gate at the end. In the wide layout it is the foot of the coordinator's
       card; elsewhere it is a card of its own that also carries the
       coordinator's progress. */
    function dock(parent, x, y, w, h, mode) {
      var d = R.dock = box('sg-team-dock is-' + mode + (mode === 'card' ? '' : ' sg-team-card'), parent, x, y, w, h);
      R.dockMode = mode; R.groups = {};
      var sz = { card: 36, bar: 30, phone: 28, mini: 18 }[mode];
      function grp(name) { return (R.groups[name] = el('div', 'sg-team-dg sg-team-dg-' + name, d)); }
      function ico(g, name, cls) { var b = el('span', 'sg-team-dico' + (cls ? ' ' + cls : ''), g); if (name === 'gate') return gateGlyph(b, sz + 4); glyph(name, b, Math.round(sz * 0.55)); return b; }
      function texts(g, a, b) { var tx = el('div', 'sg-team-dtx', g); return [el('b', '', tx, a), b != null ? el('span', '', tx, b) : null, tx]; }
      if (mode === 'card') {
        var gi = grp('idle'); R.idleGate = ico(gi, 'gate', 'is-gate'); R.idleSub = texts(gi, D.approval, D.approvalSub[0])[1];
      } else {
        var gc = grp('coord'); ico(gc, 'layers');
        var tc = texts(gc, D.coord, mode === 'mini' ? null : D.idleSub); R.coordT = tc[0]; R.coordS = tc[1];
        if (mode !== 'mini') {
          var side = el('span', 'sg-team-dside', gc);
          var pp = el('span', 'sg-team-pips', side); R.pips = [el('i', '', pp), el('i', '', pp), el('i', '', pp), el('i', '', pp)];
          var rb = el('i', 'sg-team-rbar', side); R.revFill = el('i', '', rb);
        }
      }
      var ga = grp('ask'); ico(ga, 'research', 'is-role');
      var ta = el('div', 'sg-team-dtx', ga), cp;
      if (mode === 'card') { el('span', 'sg-team-who', ta, D.askWho); el('b', '', ta, D.askQ); cp = el('span', 'sg-team-choices', ta); }
      else if (mode === 'phone') { el('b', '', ta, D.askShort); cp = el('span', 'sg-team-choices', ta); }
      else { el('b', '', ta, mode === 'mini' ? D.askMini : kind === 'tile' || (kind === 'mid' && W < 660) ? D.askShort : D.askLine); cp = el('span', 'sg-team-choices', ga); }
      R.pick = el('span', 'sg-team-choice', cp, D.pick);
      R.other = el('span', 'sg-team-choice', cp, D.other);
      var go = grp('ok'); ico(go, 'check', 'is-ok'); texts(go, D.ok, mode === 'mini' ? null : D.okSub);
      var gg = grp('gate'); R.gate = ico(gg, 'gate', 'is-gate');
      cl(R.gate.s, 'is-wait', true);
      var tg = texts(gg, mode === 'mini' ? D.gateMini : D.gate, mode === 'mini' ? null : mode === 'phone' ? D.gateSubS : D.gateSub);
      if (mode !== 'mini') {
        var bt = el('span', 'sg-team-btns', mode === 'card' ? tg[2] : gg);
        el('span', 'sg-btn is-primary', bt, D.approve); el('span', 'sg-btn', bt, D.revise);
      }
    }
    function cursor(stage, from, away) {
      var c = R.cur = el('div', 'sg-team-cur', stage);
      R.rip = el('i', 'sg-team-rip', c);
      var p = sv('svg', { viewBox: '0 0 16 20', width: 16, height: 20, class: 'sg-team-ptr', 'aria-hidden': 'true' }, c);
      sv('path', { d: 'M1.5 1.5v14.6l3.9-3.7 2.7 6 2.5-1.1-2.7-5.9 5.4-.2z' }, p);
      el('span', 'sg-team-you', c, T('你', 'You'));
      R.curFrom = from; R.curAway = away; R.curAt = null;
    }

    /* ---------------- the shared timeline ---------------- */
    function svgLayer(stage) {
      var svg = sv('svg', { class: 'sg-team-fx', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' }, stage);
      var defs = sv('defs', {}, svg);
      var g1 = sv('linearGradient', { id: sid + '-bar', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
      sv('stop', { offset: 0, 'stop-color': '#d9954a' }, g1);
      sv('stop', { offset: 1, 'stop-color': '#ffe2b0' }, g1);
      var hp = sv('pattern', { id: sid + '-hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
      sv('rect', { width: 5, height: 5, fill: 'rgba(255,138,61,.22)' }, hp);
      sv('rect', { width: 2, height: 5, fill: '#ff8a3d' }, hp);
      var g2 = sv('radialGradient', { id: sid + '-glow' }, defs);
      sv('stop', { offset: 0, 'stop-color': '#ffd9a0', 'stop-opacity': '.75' }, g2);
      sv('stop', { offset: 1, 'stop-color': '#f0a64a', 'stop-opacity': '0' }, g2);
      return svg;
    }
    function track(svg, i, x0, x1, y, th) {
      var tr = { x0: x0, x1: x1, segs: [] };
      sv('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'sg-team-base' }, svg);
      SEGS[i].forEach(function (s) {
        tr.segs.push(s[2] === 'd'
          ? sv('line', { x1: x0, y1: y, x2: x0, y2: y, class: 'sg-team-seg is-d', opacity: 0 }, svg)
          : sv('rect', { x: x0, y: y - th / 2, width: 0, height: th, rx: th / 2, class: 'sg-team-seg is-' + s[2], fill: s[2] === 'w' ? 'url(#' + sid + '-bar)' : th > 3 ? 'url(#' + sid + '-hatch)' : '#ff8a3d', opacity: 0 }, svg));
      });
      if (th > 3) {
        tr.glow = sv('circle', { cy: y, r: 13, fill: 'url(#' + sid + '-glow)', opacity: 0 }, svg);
        tr.head = sv('circle', { cy: y, r: th > 5 ? 3.8 : 3.2, class: 'sg-team-head', opacity: 0 }, svg);
      }
      return tr;
    }
    function X(tr, t) { return tr.x0 + (tr.x1 - tr.x0) * c01((t - T0) / (T1 - T0)); }
    function drawTrack(tr, i, tau) {
      var segs = SEGS[i], act = '';
      for (var k = 0; k < segs.length; k++) {
        var s = segs[k], e = tr.segs[k];
        if (tau < s[0]) { put(e, 'opacity', '0'); continue; }
        var a = X(tr, s[0]), b = X(tr, Math.min(tau, s[1]));
        if (s[2] === 'd') { put(e, 'x1', a.toFixed(1)); put(e, 'x2', b.toFixed(1)); }
        else { put(e, 'x', a.toFixed(1)); put(e, 'width', Math.max(0, b - a).toFixed(1)); }
        put(e, 'opacity', '1');
        if (tau < s[1]) act = s[2];
      }
      if (tr.head) {
        var on = act === 'w' || act === 'h', hx = X(tr, tau).toFixed(1);
        put(tr.head, 'cx', hx); put(tr.glow, 'cx', hx);
        put(tr.head, 'opacity', on ? '1' : '0'); put(tr.glow, 'opacity', on && act === 'w' ? '1' : '0');
        cl(tr.head, 'is-h', act === 'h');
      }
    }

    /* ---------------- wide and mid: lanes on a timeline ---------------- */
    function buildLanes(stage) {
      var wide = kind === 'wide', d = wide ? 1280 - W : 700 - W;
      // mid is designed at 700 × 500; a narrower stage gives up timeline (the outputs stay right-aligned), a
      // shorter one shrinks everything under the 46px app bar by f
      var f = wide ? 1 : (H - 46) / 454;
      function v(y) { return Math.round(46 + (y - 46) * f); }
      var g = R.g = wide
        ? { gx: 24, gy: 72, gw: 820 - d, gh: 64, sx: 40, lx: 56, lw: 788 - d, ly: 152, lh: 96, lg: 12, t0: 280, t1: 600 - d }
        : { gx: 20, gy: v(60), gw: 660 - d, gh: Math.round(52 * f), sx: 32, lx: 46, lw: 634 - d, ly: v(126), lh: Math.round(62 * f), lg: Math.round(8 * f), t0: 232, t1: 460 - d };
      function top(i) { return g.ly + i * (g.lh + g.lg); }
      function cy(i) { return top(i) + g.lh / 2; }
      appBar(stage, { mark: 14, crumb: true, pill: true, tag: wide ? null : T('动态示意 · 演示数据', 'Illustrative motion · demo data') });
      if (wide) { var tag = el('div', 'sg-tag', stage, T('动态示意 · 演示数据', 'Illustrative motion · demo data')); tag.style.left = (W - 24) + 'px'; tag.style.top = (H - 13) + 'px'; }
      goalCard(stage, g.gx, g.gy, g.gw, g.gh, ASSIGN_T);
      R.lanes = ROLE.map(function (r, i) { return lane(stage, i, g.lx, top(i), g.lw, g.lh, { ico: wide ? 22 : 18, chip: 'two' }); });
      var svg = svgLayer(stage);
      // the fan-out from the goal to each lane
      var s0 = g.gy + g.gh, s1 = cy(3);
      R.spine = { y0: s0, y1: s1 };
      sv('path', { d: 'M' + g.sx + ' ' + s0 + 'V' + s1, class: 'sg-team-spine' }, svg);
      R.spineLit = sv('path', { d: 'M' + g.sx + ' ' + s0 + 'V' + s1, class: 'sg-team-spine is-lit', pathLength: 100 }, svg);
      sv('circle', { cx: g.sx, cy: s0, r: 3, class: 'sg-team-node' }, svg);
      LIT = []; R.stubs = [];
      for (var i = 0; i < 4; i++) {
        LIT.push(SPLIT0 + (SPLIT1 - SPLIT0) * (cy(i) - s0) / (s1 - s0));
        R.stubs.push(sv('path', { d: 'M' + g.sx + ' ' + cy(i) + 'H' + (g.lx - 1), class: 'sg-team-stub' }, svg));
      }
      R.spineDot = sv('circle', { cx: g.sx, cy: s0, r: 3.4, class: 'sg-team-head', opacity: 0 }, svg);
      // the timelines and a shared "now"
      R.tracks = [0, 1, 2, 3].map(function (i) { return track(svg, i, g.lx + g.t0, g.lx + g.t1, cy(i), wide ? 6 : 5); });
      R.ph = sv('line', { x1: 0, x2: 0, y1: g.ly - 8, y2: top(3) + g.lh, class: 'sg-team-ph', opacity: 0 }, svg);
      R.phDot = sv('circle', { cx: 0, cy: g.ly - 8, r: 2.6, class: 'sg-team-ph-dot', opacity: 0 }, svg);
      // hand-offs: an arrow from one lane's bar to the other's, and a line saying what was handed over
      R.hand = HAND.map(function (h) {
        var x = Math.round(X(R.tracks[0], h.t)) + 0.5, y1 = cy(h.a) + 6, y2 = cy(h.b) - (wide ? 7 : 6);
        var gr = sv('g', { class: 'sg-team-hand', opacity: 0 }, svg);
        var line = sv('path', { d: 'M' + x + ' ' + y1 + 'V' + y2, class: 'sg-team-hand-line', pathLength: 100 }, gr);
        var head = sv('path', { d: 'M' + (x - 4) + ' ' + (y2 - 5) + 'L' + x + ' ' + y2 + 'L' + (x + 4) + ' ' + (y2 - 5), class: 'sg-team-hand-head', opacity: 0 }, gr);
        var dot = sv('circle', { cx: x, cy: y1, r: 2.6, class: 'sg-team-head' }, gr);
        return { g: gr, line: line, head: head, dot: dot, x: x, y1: y1, y2: y2, h: h };
      });
      R.hand.forEach(function (o) {
        var parts = o.h.text.split(' → ');
        // on a narrow mid card a label that would run past the lanes' right edge opens to the arrow's left
        // (its width estimated from its text: 12.5px type, padding, the arrow glyph)
        var est = parts.join('').length * (K.ZH ? 12.6 : 6.9) + 48, flip = !wide && o.x + 10 + est > g.lx + g.lw - 6;
        var lab = o.lab = box('sg-team-hand-lab' + (flip ? ' is-l' : ''), stage, flip ? o.x - 10 : o.x + 10, top(o.h.a) + g.lh + g.lg / 2);
        el('span', '', lab, parts[0]); glyph('arrow', lab, 13); el('span', '', lab, parts[1]);
      });
      if (wide) buildCoord(stage, svg, cy); else dock(stage, 20, v(412), 660 - d, Math.round(68 * f), 'bar');
      cursor(stage, wide ? [120, 40] : [-120, -50], wide ? [26, 18] : [24, -10]);
    }

    // the coordinator's card on the wide layout, and the threads its results arrive on
    function buildCoord(stage, svg, cy) {
      var cx = W - 340, cyy = 72, cw = 316, ch = 500;
      var c = box('sg-team-coord sg-team-card', stage, cx, cyy, cw, ch);
      var hd = el('div', 'sg-team-coord-h', c);
      var av = el('div', 'sg-team-av is-coord', hd); glyph('layers', av, 22);
      var ht = el('div', '', hd); el('b', '', ht, D.coord); el('span', '', ht, D.coordSub);
      R.rows = ROLE.map(function (r, i) {
        var row = box('sg-team-crow', c, 14, 78 + i * 48, cw - 28, 40);
        var ic = el('span', 'sg-team-crow-ico', row); glyph(r.g, ic, 15);
        el('span', 'sg-team-crow-k', row, OUT_K[i]);
        var v = el('span', 'sg-team-crow-v', row, D.wait);
        glyph('check', row, 15, 'sg-team-ck');
        return { row: row, v: v, on: null };
      });
      R.rev = box('sg-team-review', c, 16, 278, cw - 32, 30);
      el('span', '', R.rev, T('复核汇总', 'Review'));
      R.revV = el('em', '', R.rev);
      var rb = el('i', 'sg-team-rbar', R.rev); R.revFill = el('i', '', rb);
      dock(c, 14, 324, cw - 28, 162, 'card');
      R.threads = [0, 1, 2, 3].map(function (i) {
        var a = [R.g.lx + R.g.lw - 16, cy(i)], b = [cx, cyy + 98 + i * 48];
        var p = K.curve(a, [1, 0], b, [-1, 0], 0.55);
        sv('path', { d: K.bezD(p), class: 'sg-thread' }, svg);
        return {
          p: p,
          lit: sv('path', { d: K.bezD(p), class: 'sg-team-thread', pathLength: 100, opacity: 0 }, svg),
          glow: sv('circle', { r: 13, fill: 'url(#' + sid + '-glow)', opacity: 0 }, svg),
          head: sv('circle', { r: 3.4, class: 'sg-team-head', opacity: 0 }, svg)
        };
      });
    }

    /* ---------------- phone and tile: lanes as rows ---------------- */
    function buildRows(stage) {
      var ph = kind === 'phone', k = c01((H - 264) / 47), kp = c01((H - 300) / 50);
      function lerp(a, b) { return Math.round(a + (b - a) * k); }
      function lp(a, b) { return Math.round(a + (b - a) * kp); }
      // the phone card is 350 tall; a shorter host (300–350) tightens it towards the 300 column
      var g = R.g = ph
        ? { pad: 12, gy: lp(38, 44), gh: lp(46, 48), ry: lp(89, 100), rh: lp(37, 42), rg: lp(4, 5), dy: lp(250, 290), dh: lp(44, 52) }
        : { pad: lerp(12, 14), gy: lerp(44, 48), gh: lerp(32, 36), ry: lerp(82, 92), rh: lerp(28, 32), rg: lerp(4, 6), dy: lerp(212, 246), dh: lerp(45, 51) };
      appBar(stage, { mark: ph ? 12 : 13, crumb: !ph && W >= 520, pill: true, tag: ph ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data') });
      goalCard(stage, g.pad, g.gy, W - 2 * g.pad, g.gh, ph ? ASSIGN_S : ASSIGN_T);
      LIT = [2.55, 2.69, 2.83, 2.97];
      R.lanes = ROLE.map(function (r, i) { return lane(stage, i, g.pad, g.ry + i * (g.rh + g.rg), W - 2 * g.pad, g.rh, { ico: ph ? 15 : 13, chip: 'one', short: !ph && W < 520 }); });
      var svg = svgLayer(stage);
      // a thin timeline under each one-line row; the phone's two-line rows have no room for one
      if (!ph) R.tracks = [0, 1, 2, 3].map(function (i) { var y = g.ry + i * (g.rh + g.rg) + g.rh - 1.5; return track(svg, i, g.pad + 10, W - g.pad - 10, y, 2); });
      dock(stage, g.pad, g.dy, W - 2 * g.pad, g.dh, ph ? 'phone' : 'bar');
      cursor(stage, ph ? [-80, -40] : [-120, -46], [24, -10]);
    }

    /* ---------------- mini: four tiles and one line ---------------- */
    function buildMini(stage) {
      /* Each lane holds two lines (name, status) and keeps 3.5px above and below them inside its
         border (QA round 4: at 280 × 157, 360px phones, the lines crossed the borders). On the
         short tile (H 157-169, 'is-low': 13px lines, a 24px bar, an 18px choice) the bar, the goal
         row, the gaps and the line give up those pixels; from H 174 (390px phones) the spacing is
         the tile's own again (14px lines). */
      var k = c01((H - 157) / 17);
      function lp(a, b) { return Math.round(a + (b - a) * k); }
      var pad = 8, padB = lp(6, 8), cap = lp(26, 28), gy = lp(47, 54), rg = lp(4, 5), gd = lp(4, 5);
      appBar(stage, { mark: 11, tag: T('演示数据', 'Demo data') });
      goalCard(stage, pad, lp(26, 31), W - 2 * pad, lp(18, 20), null);
      LIT = [2.55, 2.69, 2.83, 2.97];
      var th = Math.floor((H - padB - cap - gd - gy - rg) / 2), tw = (W - 2 * pad - 5) / 2;
      R.lanes = ROLE.map(function (r, i) { return lane(stage, i, pad + (i % 2) * (tw + 5), gy + Math.floor(i / 2) * (th + rg), tw, th, { ico: 12, short: true }); });
      dock(stage, pad, H - padB - cap, W - 2 * pad, cap, 'mini');
      cursor(stage, [64, 12], [26, 18]);
    }

    function build(stage, L) {
      kind = L.kind; W = L.w; H = L.h;
      GOAL = GOALS[(kind === 'tile' && W < 552) || (kind === 'mid' && W < 660) ? 1 : 0];
      R = { stage: stage };
      stage.className = 'sg-mo-stage sg-team is-' + kind + (kind === 'phone' && W < 350 ? ' is-narrow' : '') + (kind === 'tile' && W < 520 ? ' is-tight' : '') + (kind === 'mini' && H < 170 ? ' is-low' : '');
      if (kind === 'wide' || kind === 'mid') buildLanes(stage);
      else if (kind === 'mini') buildMini(stage);
      else buildRows(stage);
    }

    /* ---------------- frame ---------------- */
    var pt = [0, 0];
    function bezAt(p, u) {
      var v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
      pt[0] = a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0];
      pt[1] = a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1];
      return pt;
    }
    function laneTick(i, L, tau, table, relay) {
      cl(L.c, 'is-on', tau >= LIT[i] && tau < CLEAR);
      var tb = table[i], j = 0;
      while (j + 1 < tb.length && tau >= tb[j + 1][0]) j++;
      var key = j, text = tb[j][1], tone = tb[j][2];
      for (var k = 0; k < HAND.length; k++) {
        var h = HAND[k];
        if (h.b !== i) continue;
        cl(L.c, 'is-recv', tau >= h.t + 0.1 && tau < h.t + 0.9);
        if (relay && tau >= h.t + 0.15 && tau < h.t + 1.55) { key = 100 + k; text = kind === 'phone' || (kind === 'tile' && W < 552) ? h.got : h.text; tone = 'hand'; }
        if (tau >= h.t + 0.1 && tau < h.t + 0.9) break;
      }
      if (L.key !== key) { L.key = key; put(L.c, 'data-tone', tone); textSwap(L.st, text); }
      if (!L.chip) return;
      var st = tau >= DONE[i] ? 2 : tau >= FROM[i] ? 1 : 0;
      var n = st === 2 ? FINAL_N[i] : st ? outCount(i, tau) : 0, ok = st * 100 + n;
      if (L.ok === ok) return;
      var was = L.ok; L.ok = ok;
      put(L.val, 'text', st ? outText(i, st, n, L.compact) : L.compact ? OUT_K[i] : '—');
      put(L.chip, 'data-st', String(st));
      if (L.thumbs) for (var m = 0; m < 3; m++) cl(L.thumbs[m], 'is-on', n > m);
      if (st === 2 && was >= 100 && was < 200) pop(L.chip);
    }
    function dockTick(tau) {
      var ds = dockState(tau), m = R.dockMode;
      var name = ds === 2 ? 'ask' : ds === 3 ? 'ok' : ds === 6 ? 'gate' : m === 'card' ? 'idle' : 'coord';
      if (R.dockG !== name) {
        R.dockG = name;
        for (var k in R.groups) cl(R.groups[k], 'is-on', k === name);
        put(R.dock, 'data-g', name);
      }
      var n = received(tau);
      if (name === 'idle') textSwap(R.idleSub, D.approvalSub[ds >= 4 ? 1 : 0]);
      if (name === 'coord') {
        var t1, t2 = null;
        if (ds === 0) { t1 = m === 'mini' ? D.miniIdle : D.coord; t2 = D.idleSub; }
        else if (ds === 1) { t1 = m === 'mini' ? (tau < SPLIT1 + 0.5 ? D.assigned : D.parallel) : D.track; t2 = D.trackSub; }
        else if (ds === 4) { var hk = m === 'mini' ? miniHand(tau) : -1; t1 = hk >= 0 ? HAND[hk].text : m === 'mini' ? RECV_S[n] : RECV[n]; t2 = JUSTIN[n]; }
        else { t1 = m === 'mini' ? D.review : D.review; t2 = D.reviewSub; }
        textSwap(R.coordT, t1);
        if (R.coordS) textSwap(R.coordS, t2);
        if (R.pips) {
          for (var p = 0; p < 4; p++) cl(R.pips[p], 'is-on', p < n);
          cl(R.dock, 'is-review', ds === 5);
        }
      }
      if (R.revFill) put(R.revFill, '-transform', 'scaleX(' + ease.io(seg(tau, REVIEW, GATE - 0.15)).toFixed(3) + ')');
      put(R.gate.ring, 'transform', name === 'gate' ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)');
      // the person's tap on 仅德国
      cl(R.pick, 'is-press', tau >= TAP - 0.04 && tau < TAP + 0.2);
      cl(R.pick, 'is-picked', tau >= TAP + 0.05);
      cl(R.other, 'is-off', tau >= TAP + 0.05);
    }
    function cursorTick(tau) {
      var c = R.cur;
      if (tau < ASK0 + 0.5 || tau >= ASK1 + 0.5) { put(c, '-opacity', '0'); return; }
      var at = R.curAt;
      if (!at) {
        // the chip's place on the stage, in the stage's own pixels
        var x = R.pick.offsetWidth * 0.5, y = R.pick.offsetHeight * 0.62, n = R.pick;
        for (; n && n !== R.stage; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        if (n !== R.stage || !R.pick.offsetWidth) { put(c, '-opacity', '0'); return; }
        at = R.curAt = [x, y];
      }
      var u = ease.io(seg(tau, ASK0 + 0.55, TAP - 0.12)), out = ease.io(seg(tau, ASK1 + 0.05, ASK1 + 0.5));
      var press = Math.sin(Math.PI * seg(tau, TAP - 0.04, TAP + 0.22));
      var cx = at[0] + R.curFrom[0] * (1 - u) + R.curAway[0] * out, cy = at[1] + R.curFrom[1] * (1 - u) + R.curAway[1] * out;
      put(c, '-transform', 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) scale(' + (1 - 0.14 * press).toFixed(3) + ')');
      put(c, '-opacity', (seg(tau, ASK0 + 0.5, ASK0 + 0.75) * (1 - out)).toFixed(3));
      var rp = seg(tau, TAP, TAP + 0.62);
      put(R.rip, '-transform', 'scale(' + (0.35 + 1.75 * ease.out(rp)).toFixed(3) + ')');
      put(R.rip, '-opacity', rp > 0 && rp < 1 ? (0.8 * (1 - rp)).toFixed(3) : '0');
    }

    function tick(t) {
      var tau = mod(t, P), i;
      cl(R.stage, 'is-clear', tau >= CLEAR);
      // the goal is typed, then handed to the team
      var nCh = Math.round(GOAL.length * c01((tau - TYPE0) / (TYPE1 - TYPE0)));
      if (R.goalN !== nCh) { R.goalN = nCh; put(R.goal, 'text', nCh ? GOAL.slice(0, nCh).join('') : PH); cl(R.goalBox, 'is-ph', !nCh); }
      cl(R.goalBox, 'is-typing', tau < TYPE1 + 0.4);
      if (R.assign) {
        var gone = tau >= ASSIGN + 0.18 && tau < CLEAR;
        cl(R.assign, 'is-press', tau >= ASSIGN && tau < ASSIGN + 0.18);
        cl(R.assign, 'is-done', gone);
        put(R.assign, 'text', R.assignT[gone ? 1 : 0]);
      }
      if (R.live) {
        var ds = dockState(tau), ls = tau < ASSIGN || tau >= CLEAR ? 0 : ds === 2 ? 2 : ds === 6 ? 3 : 1;
        if (R.liveS !== ls) { R.liveS = ls; put(R.liveText, 'text', LIVE[ls]); cl(R.live, 'is-idle', ls === 0); cl(R.live, 'is-wait', ls >= 2); }
      }
      for (i = 0; i < 4; i++) laneTick(i, R.lanes[i], tau, kind === 'mini' ? SHORT : STATUS, kind === 'phone' || kind === 'tile');
      if (R.tracks) for (i = 0; i < 4; i++) drawTrack(R.tracks[i], i, tau);
      if (R.spineLit) {
        var u = seg(tau, SPLIT0, SPLIT1);
        put(R.spineLit, 'stroke-dashoffset', (100 - 100 * u).toFixed(1));
        put(R.spineDot, 'cy', (R.spine.y0 + (R.spine.y1 - R.spine.y0) * u).toFixed(1));
        put(R.spineDot, 'opacity', u > 0 && u < 1 ? '1' : '0');
        for (i = 0; i < 4; i++) cl(R.stubs[i], 'is-lit', tau >= LIT[i] && tau < CLEAR);
        var px = X(R.tracks[0], tau).toFixed(1), pf = (seg(tau, T0 - 0.3, T0) * (1 - seg(tau, T1 + 0.2, T1 + 0.9))).toFixed(3);
        put(R.ph, 'x1', px); put(R.ph, 'x2', px); put(R.phDot, 'cx', px);
        put(R.ph, 'opacity', pf); put(R.phDot, 'opacity', pf);
      }
      if (R.hand) for (i = 0; i < R.hand.length; i++) {
        var o = R.hand[i], t0 = o.h.t, v = ease.out(seg(tau, t0, t0 + 0.5));
        put(o.g, 'opacity', tau >= t0 ? '1' : '0');
        put(o.line, 'stroke-dashoffset', (100 - 100 * v).toFixed(1));
        put(o.head, 'opacity', v > 0.92 ? '1' : '0');
        put(o.dot, 'cy', (o.y1 + (o.y2 - o.y1) * v).toFixed(1));
        put(o.dot, 'opacity', v > 0 && v < 1 ? '1' : '0');
        cl(o.g, 'is-past', tau > t0 + 1.7);
        cl(o.lab, 'is-on', tau >= t0 + 0.12 && tau < t0 + 1.7);
      }
      if (R.threads) {
        for (i = 0; i < 4; i++) {
          var th = R.threads[i], a = seg(tau, DONE[i], DONE[i] + TRAVEL), e = ease.io(a);
          put(th.lit, 'stroke-dashoffset', (100 - 100 * e).toFixed(1));
          var glow = tau < DONE[i] ? 0 : tau >= REVIEW && tau < GATE ? 0.55 + 0.45 * Math.sin((tau - REVIEW) * 5 - i * 0.7) : tau >= GATE ? 0.5 : 0.75;
          put(th.lit, 'opacity', glow.toFixed(2));
          var moving = a > 0 && a < 1;
          if (moving) { bezAt(th.p, e); put(th.head, 'cx', pt[0].toFixed(1)); put(th.head, 'cy', pt[1].toFixed(1)); put(th.glow, 'cx', pt[0].toFixed(1)); put(th.glow, 'cy', pt[1].toFixed(1)); }
          put(th.head, 'opacity', moving ? '1' : '0'); put(th.glow, 'opacity', moving ? '1' : '0');
        }
        for (i = 0; i < 4; i++) {
          var row = R.rows[i], inn = tau >= DONE[i] + TRAVEL;
          if (row.on !== inn) { var first = row.on === null; row.on = inn; cl(row.row, 'is-in', inn); put(row.v, 'text', inn ? FINAL_V[i] : D.wait); if (inn && !first) pop(row.row); }
        }
        var rk = tau < REVIEW ? 0 : tau < GATE - 0.15 ? 1 : 2;
        if (R.revK !== rk) { R.revK = rk; put(R.revV, 'text', D.rev[rk]); cl(R.rev, 'is-on', rk === 1); cl(R.rev, 'is-done', rk === 2); }
      }
      dockTick(tau);
      cursorTick(tau);
    }

    return {
      layouts: layouts,
      pick: pick,
      build: build,
      tick: tick,
      start: 0,
      still: GATE + 2.4,  // all four delivered, the summary at the gate, waiting for a person
      cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  return { team: TeamScene };
});
