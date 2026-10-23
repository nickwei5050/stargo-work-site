/* ORG — the homepage pricing band's card beside 企业版, where the owner's
   photograph T01 (an enterprise campus at night) was
   (tools/replaceables.mjs HOME_PRICING_CARD).

   It draws what the Enterprise copy beside it lists and nothing more:
   多部门、多公司、多品牌、多账号 (two demo companies, their brands, departments
   and accounts, each with its own permissions, approvals and data boundary —
   the pricing FAQ's words), 复杂审批 (quote Q-1042 passing an approval route
   one person at a time), 系统对接 (existing CRM / ERP / mailbox connected with
   authorization), 共用同一支 AI 员工队伍, 专属前置部署工程师 and 私有化部署
   (the dashed boundary around all of it). Names and numbers are demo data and
   the bar says so.

   Unlike the fixed-stage scenes, this one is laid out by the browser: the
   stage is sized to the host (so the scale is ~1 and type stays at its design
   size on phones) and flexbox places the parts. Only three things move, all
   by transform and opacity from tick(t): the approval token, the data
   packets coming in from the connected systems, and the AI workforce's
   activity dots. Layout kinds, by the host's size:
     full  ≥ 520 × 440  the 1280–1920 desktop card (606–692 × 504–756)
     mid   portrait     the tablet card (361 × 450)
     flat  wide/short   phones and small tablets (374–576 × 240–320) */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, seg = K.seg, ease = K.ease, mod = K.mod;

  var GLYPH = {
    org: 'M9 4.5h6v4H9zM4.5 15.5h6v4h-6zM13.5 15.5h6v4h-6zM12 8.5v3.5M7.5 15.5V12h9v3.5',
    lock: 'M7 10.5h10v9H7zM9 10.5V8a3 3 0 0 1 6 0v2.5',
    shield: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2 2 4-4',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    plug: 'M9 4v4M15 4v4M7 8h10v3a5 5 0 0 1-10 0zM12 16v4',
    person: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 19.5c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5',
    spark: 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GLYPH[name], stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function tone(e, name) { if (e.__tone === name) return; if (e.__tone) e.classList.remove('is-' + e.__tone); e.__tone = name; if (name) e.classList.add('is-' + name); }

  var CO = [
    { name: T('公司 A', 'Company A'), sub: T('柳州工厂', 'Liuzhou plant'), tags: [T('自有品牌', 'Own brand')],
      depts: [[T('生产部', 'Production'), 8], [T('采购部', 'Purchasing'), 4], [T('财务部', 'Finance'), 3]] },
    { name: T('公司 B', 'Company B'), sub: T('外贸公司', 'Trading arm'), tags: [T('品牌 A', 'Brand A'), T('品牌 B', 'Brand B')],
      depts: [[T('销售部', 'Sales'), 12], [T('市场部', 'Marketing'), 5], [T('财务部', 'Finance'), 2]] }
  ];
  var ROUTE = [T('销售', 'Sales'), T('销售主管', 'Sales lead'), T('财务', 'Finance'), T('总经理', 'GM')];
  var WAIT = [T('销售已提交', 'Submitted by sales'), T('待销售主管审批', 'With the sales lead'), T('待财务审批', 'With finance'), T('待总经理审批', 'With the GM'), T('已批准 · 每一步都由人批', 'Approved · a person at every step')];
  var STEP_AT = [0.8, 2.3, 3.9, 5.5, 7.4];   // the token reaches step i (index 4: approved)
  var P = 11;

  var layouts = {};
  function lay(kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
  function pick(w, h) {
    var W = Math.round(Math.max(340, Math.min(720, w)) / 2) * 2, H = Math.round(Math.max(230, Math.min(780, h)) / 2) * 2;
    if (W >= 520 && H >= 440) return lay('full', W, H);
    if (H >= 400 && W < 520) return lay('mid', W, H);
    return lay('flat', W, H);
  }

  function OrgScene() {
    var R;
    function build(stage, L) {
      var kind = L.kind, full = kind === 'full', flat = kind === 'flat';
      R = { packets: [], dots: [], nodes: [] };
      stage.className = 'sg-mo-stage sg-org is-' + kind + (full && L.h >= 680 ? ' is-tall' : full && L.h < 580 ? ' is-short' : '');
      var bar = el('div', 'sg-org-bar', stage);
      var mk = el('span', 'sg-org-mark', bar); glyph('org', mk, full ? 14 : 12);
      el('b', '', bar, T('企业管理', 'Enterprise'));
      if (!flat) el('span', 'sg-org-crumb', bar, T('组织与审批', 'Organization & approvals'));
      el('span', 'sg-org-tag', bar, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));

      var fence = el('div', 'sg-org-fence', stage);
      var fl = el('div', 'sg-org-fence-k', fence); glyph('shield', fl, 13); el('span', '', fl, T('私有化部署', 'Private deployment')); el('span', 'sg-org-long', fl, T('· 专属环境', '· dedicated environment'));

      var top = fence;
      if (full && L.h >= 580) {   // the group node, joined to both companies by a bracket
        top = el('div', 'sg-org-top', fence);
        var root = el('div', 'sg-org-root', top);
        el('span', 'sg-org-root-k', root, T('演示集团', 'Demo group'));
        el('i', 'sg-org-stem', root);
      }
      var cos = el('div', 'sg-org-cos', top);
      CO.forEach(function (c) {
        var p = el('div', 'sg-org-co', cos);
        var hd = el('div', 'sg-org-co-head', p);
        el('b', '', hd, c.name); el('span', '', hd, c.sub);
        if (!flat) {
          var tg = el('div', 'sg-org-tags', p);
          c.tags.forEach(function (t) { el('span', '', tg, t); });
        }
        if (full) {
          var dl = el('div', 'sg-org-depts', p);
          c.depts.forEach(function (d) { var r = el('div', '', dl); el('span', '', r, d[0]); el('b', '', r, d[1] + T(' 个账号', ' accounts')); });
        }
        var gd = el('div', 'sg-org-guard', p);
        [T('权限', 'Access'), T('审批', 'Approvals'), T('数据', 'Data')].forEach(function (g) { var s = el('span', '', gd); glyph('lock', s, 11); el('span', '', s, g); });
      });

      var route = el('div', 'sg-org-route', fence);
      var rh = el('div', 'sg-org-route-head', route);
      el('b', '', rh, T('报价 Q-1042 · 审批路线', 'Quote Q-1042 · approval route'));
      R.state = el('span', '', rh);
      var steps = el('div', 'sg-org-steps', route);
      var rail = el('div', 'sg-org-rail', steps);
      R.rail = el('i', '', rail);
      ROUTE.forEach(function (name) {
        var s = el('div', 'sg-org-step', steps);
        var n = el('span', 'sg-org-node', s); glyph('check', n, 11, 'sg-ico sg-org-ck');
        el('span', 'sg-org-step-k', s, name);
        R.nodes.push(n);
      });
      R.token = el('div', 'sg-org-token', steps);
      el('span', '', R.token, 'Q-1042');

      var pool = el('div', 'sg-org-pool', fence);
      var pk = el('div', 'sg-org-pool-k', pool); glyph('spark', pk, 12); el('span', '', pk, T('AI 员工队伍', 'One AI workforce')); el('span', 'sg-org-long', pk, T('· 两家公司共用', '· shared by both')); el('span', 'sg-org-short', pk, T('共用', ', shared'));
      var dots = el('div', 'sg-org-dots', pool);
      for (var i = 0; i < (flat ? 8 : 10); i++) R.dots.push(el('i', '', dots));

      var foot = el('div', 'sg-org-foot', stage);
      var ports = el('div', 'sg-org-ports', foot);
      [['CRM'], ['ERP'], [T('邮箱', 'Email')]].forEach(function (p) {
        var s = el('span', 'sg-org-port', ports); glyph('plug', s, 11); el('span', '', s, p[0]);
        if (!flat) R.packets.push(el('i', 'sg-org-pkt', s));
      });
      el('span', 'sg-org-foot-k', ports, T('经授权接入', 'connected with authorization'));
      var fde = el('span', 'sg-org-fde', foot); glyph('person', fde, 13); el('span', '', fde, T('专属前置部署工程师', 'Dedicated FDE'));
    }

    function tick(t) {
      var tau = mod(t, P);
      // the approval token: one step at a time, a person at each
      var k = 0;
      for (var i = STEP_AT.length - 1; i >= 0; i--) if (tau >= STEP_AT[i]) { k = i; break; }
      if (tau < STEP_AT[0]) k = -1;
      var x = 0;
      for (var j = 1; j < 4; j++) x += ease.io(seg(tau, STEP_AT[j] - 0.55, STEP_AT[j]));
      var tx = 'translateX(' + (x * 25).toFixed(2) + '%)';
      put(R.token, '-transform', tx);
      var o = Math.min(seg(tau, 0.4, 0.8), 1 - seg(tau, P - 0.9, P - 0.4));
      put(R.token, '-opacity', o >= 1 ? '1' : o.toFixed(3));
      put(R.rail, '-transform', x >= 3 ? 'none' : 'scaleX(' + (x / 3).toFixed(4) + ')');
      for (var n = 0; n < 4; n++) tone(R.nodes[n], k > n || k === 4 ? 'done' : k === n ? 'run' : '');
      cl(R.token, 'is-ok', k === 4);
      var si = k < 0 ? 0 : k;
      if (R.state.__k !== si) { R.state.__k = si; R.state.textContent = WAIT[si]; tone(R.state, si === 4 ? 'ok' : 'wait'); }
      put(R.state, '-opacity', o >= 1 ? '1' : o.toFixed(3));
      // data coming in from the connected systems, staggered
      for (var p = 0; p < R.packets.length; p++) {
        var u = mod(t / 2.6 + p * 0.37, 1);
        put(R.packets[p], '-transform', 'translateY(' + (-34 * ease.io(u)).toFixed(1) + 'px)');
        put(R.packets[p], '-opacity', (u < 0.15 ? u / 0.15 : u > 0.8 ? (1 - u) / 0.2 : 1).toFixed(3));
      }
      // the shared workforce at work: a slow wave across the ten roles
      for (var d = 0; d < R.dots.length; d++) {
        var w = 0.5 + 0.5 * Math.cos((t * 1.4 - d * 0.55));
        put(R.dots[d], '-opacity', (0.28 + 0.72 * w * w).toFixed(2));
      }
    }

    return { layouts: layouts, pick: pick, build: build, tick: tick, still: 9.2, start: 0.5 };
  }

  return { org: OrgScene };
});
