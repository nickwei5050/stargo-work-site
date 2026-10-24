/* ORG — the homepage pricing band's card beside 企业版, where the owner's
   photograph T01 (an enterprise campus at night) was
   (tools/replaceables.mjs HOME_PRICING_CARD).

   It draws what the Enterprise copy beside it lists and nothing more:
   多部门、多公司、多品牌、多账号 (two demo companies, their brands, departments
   and accounts, each with its own permissions, approvals and data — the
   pricing FAQ's words), 复杂审批 (quote Q-1042, below the floor price, passing
   its approval route one person at a time), 系统对接 (the existing CRM and ERP,
   connected with authorization), 共用同一支 AI 员工队伍 (the pricing FAQ),
   专属前置部署工程师 and 私有化部署 (the dashed boundary around all of it).
   Names and numbers are demo data and the bar says so.

   Unlike the fixed-stage scenes, this one is laid out by the browser: the
   stage is sized to the host (so the scale is ~1 and type stays at its design
   size on phones) and flexbox places the parts, with fixed gaps and the stack
   centred in the boundary. What is shown depends on the room (the card is
   300–740 × 240–760 across the site's widths and heights):
     flat   H < 400          phones and small tablets; below 440 wide the
                             companies share one guard line and the route
                             drops its moving token
     mid    H ≥ 400, W < 520 portrait tablets
     full   H ≥ 400, W ≥ 520 desktops
     + the group node from 580 tall, departments from 500, the floor-price
       rule from 600, the workforce row from 290; the wires from the systems
       into the boundary from 400.
   Only transform and opacity move, from tick(t): the approval token, the
   pulses on the two system wires, and the workforce's activity dots (in 0.05
   steps, so most frames write nothing). The reduced-motion still shows the
   approved route and no pulses. */
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
    { name: T('公司 A', 'Company A'), sub: T('柳州工厂', 'Liuzhou plant'), subS: T('柳州工厂', 'Liuzhou'), tags: [T('自有品牌', 'Own brand')],
      depts: [[T('生产部', 'Production'), 8], [T('采购部', 'Purchasing'), 4], [T('财务部', 'Finance'), 3]] },
    { name: T('公司 B', 'Company B'), sub: T('外贸公司', 'Trading arm'), subS: T('品牌 A · B', '2 brands'), tags: [T('品牌 A', 'Brand A'), T('品牌 B', 'Brand B')],
      depts: [[T('销售部', 'Sales'), 12], [T('市场部', 'Marketing'), 5], [T('财务部', 'Finance'), 2]] }
  ];
  var GUARDS = [T('权限', 'Access'), T('审批', 'Approvals'), T('数据', 'Data')];
  var ROUTE = [T('销售', 'Sales'), T('销售主管', 'Sales lead'), T('财务', 'Finance'), T('总经理', 'GM')];
  // the status by the number of people who have signed (sales signs by submitting)
  var STATUS = [T('待销售主管审批', 'With the sales lead'), T('待财务审批', 'With finance'), T('待总经理审批', 'With the GM')];
  var DONE_L = T('已批准 · 每一步都由人批', 'Approved · a person at every step'), DONE_S = T('已逐级批准', 'Approved, step by step');
  // person i signs at SIGN[i]; the token leaves 0.2 s later and reaches the next person 0.6 s after that
  var SIGN = [0.7, 2.7, 4.7, 6.7], P = 10.5, STILL = 8.2;

  var layouts = {};
  function pick(w, h) {
    var W = Math.round(Math.max(300, Math.min(760, w)) / 2) * 2, H = Math.round(Math.max(230, Math.min(800, h)) / 2) * 2;
    var kind = H < 400 ? 'flat' : W < 520 ? 'mid' : 'full', k = kind + '-' + W + 'x' + H;
    if (!layouts[k]) layouts[k] = { w: W, h: H, kind: kind };
    return k;
  }

  function OrgScene() {
    var R;
    function build(stage, L) {
      var W = L.w, H = L.h, flat = L.kind === 'flat', full = L.kind === 'full';
      var narrow = W < 440, token = !flat || H >= 290;
      var F = { group: H >= 580, tags: !flat || H >= 290, depts: H >= 500, rule: H >= 600, pool: H >= 290, wires: !flat };
      R = { nodes: [], rings: [], dots: [], pulses: [], token: null, wide: !narrow || !flat };
      stage.className = 'sg-mo-stage sg-org is-' + L.kind + (narrow ? ' is-narrow' : '') + (!flat && H < 580 ? ' is-short' : '') + (H >= 680 ? ' is-tall' : '') + (token ? '' : ' no-token');

      var bar = el('div', 'sg-org-bar', stage);
      var mk = el('span', 'sg-org-mark', bar); glyph('org', mk, full ? 14 : 12);
      el('b', '', bar, T('企业管理', 'Enterprise'));
      if (W >= (K.ZH ? 520 : 600)) el('span', 'sg-org-crumb', bar, T('组织与审批', 'Organization & approvals'));
      el('span', 'sg-org-tag', bar, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));

      // the private-deployment boundary, with one label
      var fence = el('div', 'sg-org-fence', stage);
      var fl = el('div', 'sg-org-fence-k', fence); glyph('shield', fl, 13); el('span', '', fl, T('私有化部署', 'Private deployment'));

      // the companies (and, when there is room, their group) as one block
      var top = el('div', 'sg-org-top', fence);
      if (F.group) {   // the group node, joined to both companies by a bracket
        var root = el('div', 'sg-org-root', top);
        el('span', 'sg-org-root-k', root, T('演示集团', 'Demo group'));
        el('i', 'sg-org-stem', root);
      }
      var cos = el('div', 'sg-org-cos', top);
      CO.forEach(function (c) {
        var p = el('div', 'sg-org-co', cos);
        var hd = el('div', 'sg-org-co-head', p);
        el('b', '', hd, c.name); el('span', '', hd, F.tags ? c.sub : c.subS);
        if (F.tags) {
          var tg = el('div', 'sg-org-tags', p);
          c.tags.forEach(function (t) { el('span', '', tg, t); });
        }
        if (F.depts) {
          var dl = el('div', 'sg-org-depts', p);
          c.depts.forEach(function (d) { var r = el('div', '', dl); el('span', '', r, d[0]); el('b', '', r, d[1] + T(' 个账号', narrow ? '' : ' accounts')); });
        }
        if (!narrow) {   // each company its own guards
          var gd = el('div', 'sg-org-guard', p);
          GUARDS.forEach(function (g) { var s = el('span', '', gd); if (W >= 600) glyph('lock', s, 11); el('span', '', s, g); });
        }
      });
      if (narrow) {      // too narrow for three chips per card: one line for both
        var ga = el('div', 'sg-org-guardline', top); glyph('lock', ga, 11);
        el('span', '', ga, T('每家公司独立的权限 · 审批 · 数据', 'Each company: own access, approvals, data'));
      }

      var route = el('div', 'sg-org-route', fence);
      var rh = el('div', 'sg-org-route-head', route);
      el('b', '', rh, T('报价 Q-1042 · 审批路线', flat && narrow ? 'Q-1042 · approval route' : 'Quote Q-1042 · approval route'));
      R.state = el('span', '', rh);
      if (F.rule) el('div', 'sg-org-rule', route, T('低于底价 · 按审批规则逐级批准', 'Below the floor price, so it goes up the route'));
      var steps = el('div', 'sg-org-steps', route);
      var rail = el('div', 'sg-org-rail', steps);
      R.rail = el('i', '', rail);
      ROUTE.forEach(function (name) {
        var s = el('div', 'sg-org-step', steps);
        var n = el('span', 'sg-org-node', s);
        R.rings.push(el('i', 'sg-org-ring', n));
        glyph('check', n, flat ? 10 : 11, 'sg-ico sg-org-ck');
        el('span', 'sg-org-step-k', s, name);
        R.nodes.push(n);
      });
      if (token) { R.token = el('div', 'sg-org-token', steps); el('span', '', R.token, 'Q-1042'); }

      if (F.pool) {
        var pool = el('div', 'sg-org-pool', fence);
        var pk = el('div', 'sg-org-pool-k', pool); glyph('spark', pk, 12);
        el('span', '', pk, full ? T('AI 员工队伍 · 两家公司共用', 'One AI workforce · shared by both') : T('AI 员工队伍 · 共用', 'One shared AI workforce'));
        var dots = el('div', 'sg-org-dots', pool);
        for (var i = 0; i < (full ? 10 : 6); i++) R.dots.push(el('i', '', dots));
      }

      // outside the boundary: the connected systems (wired into it) and the engineer
      var foot = el('div', 'sg-org-foot', stage);
      var ports = el('div', 'sg-org-ports', foot);
      ['CRM', 'ERP'].forEach(function (name) {
        var s = el('span', 'sg-org-port', ports); glyph('plug', s, 11); el('span', '', s, name);
        if (F.wires) { var wire = el('i', 'sg-org-wire', s); R.pulses.push(el('i', '', wire)); }
      });
      el('span', 'sg-org-foot-k', ports, T('经授权接入', W >= 460 ? 'connected with authorization' : 'connected'));
      var fde = el('span', 'sg-org-fde', foot); glyph('person', fde, 13); el('span', '', fde, T('专属前置部署工程师', 'Dedicated FDE'));
      settle(stage, fence);
    }

    /* Spare height goes to the spacing (the --air the stylesheet adds to the
       gaps and paddings), up to 18px of it; whatever is left stays centred.
       Measured once per layout, never per frame. */
    function slack(fence) {
      var kids = fence.children, a = null, b = null;
      for (var i = 0; i < kids.length; i++) if (kids[i].className !== 'sg-org-fence-k') { if (!a) a = kids[i]; b = kids[i]; }
      var cs = getComputedStyle(fence);
      return fence.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (b.offsetTop + b.offsetHeight - a.offsetTop);
    }
    function settle(stage, fence) {
      stage.style.setProperty('--air', '0px');
      var f0 = slack(fence);
      if (!(f0 > 10)) return;
      stage.style.setProperty('--air', '10px');
      var k = (f0 - slack(fence)) / 10;
      stage.style.setProperty('--air', k > 0 ? Math.min(18, (f0 - 6) / k).toFixed(1) + 'px' : '0px');
    }

    function tick(t) {
      var tau = mod(t, P);
      // the approval token: one person at a time
      var s = 0, x = 0;
      for (var j = 0; j < 4; j++) if (tau >= SIGN[j]) s = j + 1;
      for (var m = 1; m < 4; m++) x += ease.io(seg(tau, SIGN[m - 1] + 0.2, SIGN[m - 1] + 0.8));
      var o = Math.min(seg(tau, 0.3, 0.7), 1 - seg(tau, P - 0.9, P - 0.4)), os = o >= 1 ? '1' : o.toFixed(3);
      if (R.token) {
        put(R.token, '-transform', 'translateX(' + (x * 25).toFixed(2) + '%)');
        put(R.token, '-opacity', os);
        cl(R.token, 'is-ok', s === 4);
      }
      put(R.rail, '-transform', x >= 3 ? 'none' : 'scaleX(' + (x / 3).toFixed(4) + ')');
      cl(R.rail.parentNode, 'is-ok', s === 4);
      for (var n = 0; n < 4; n++) {
        var run = n === s && n > 0 && tau >= SIGN[n - 1] + 0.8;   // waiting on this person
        tone(R.nodes[n], n < s ? 'done' : run ? 'run' : '');
        if (run) {
          var u = ((tau - SIGN[n - 1] - 0.8) * 0.7) % 1;
          put(R.rings[n], '-opacity', (0.8 * (1 - u)).toFixed(2));
          put(R.rings[n], '-transform', 'scale(' + (0.8 + 0.7 * ease.out(u)).toFixed(3) + ')');
        } else put(R.rings[n], '-opacity', '0');
      }
      var si = Math.max(s, 1);
      if (R.state.__k !== si) { R.state.__k = si; R.state.textContent = si === 4 ? (R.wide ? DONE_L : DONE_S) : STATUS[si - 1]; tone(R.state, si === 4 ? 'ok' : 'wait'); }
      // the status appears once sales has submitted, so it never names a step the route has not reached
      put(R.state, '-opacity', s === 0 ? '0' : Math.min(o, seg(tau, SIGN[0], SIGN[0] + 0.3)).toFixed(3));
      // data coming in from the connected systems: a short pulse inside each wire (none in the still)
      for (var p = 0; p < R.pulses.length; p++) {
        var v = mod(t / 2.4 + p * 0.5, 1), on = t !== STILL && v < 0.6, q = v / 0.6;
        put(R.pulses[p], '-transform', on ? 'translateY(' + (-22 * ease.io(q)).toFixed(1) + 'px)' : 'none');
        put(R.pulses[p], '-opacity', on ? Math.min(1, q / 0.2, (1 - q) / 0.25).toFixed(2) : '0');
      }
      // the shared workforce at work: a slow wave across the roles, in 0.05 steps
      for (var d = 0; d < R.dots.length; d++) {
        var w = 0.5 + 0.5 * Math.cos(t * 1.4 - d * 0.55);
        put(R.dots[d], '-opacity', (Math.round((0.28 + 0.72 * w * w) * 20) / 20).toFixed(2));
      }
    }

    return { layouts: layouts, pick: pick, build: build, tick: tick, still: STILL, start: 0.5 };
  }

  return { org: OrgScene };
});
