/* AREAS — 「四个板块，十四类能力」 (capabilities.html), the four area cards where the
   owner's photographs C01–C04 were. Each card is its area drawn as a desk: four app
   windows, two above and two below the card's glass caption, working one piece of
   business together. Work passes between them (a chip across a band, a dot down a
   side), and every area ends at a person: something waits for your confirmation and
   nothing is sent by itself. The centre stays still under the caption. The cast is
   the site's one demo cast, and the scene says so on itself (sg-tag).

   Layouts follow the host, so the stage scale stays ~1:
     desk   W 720–1400 × H 380–900   windows above and below the caption's largest box
     phone  W 300–558                the caption covers the middle of a 255px card: the
                                     four apps light in turn along the top, one line
                                     along the bottom says what moved
   Placed by tools/code-art-capareas.mjs, styled by css/stargo-motion-areas.css. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  var GL = {
    search: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l4.5 4.5',
    send: 'M4.5 11.5 19.5 4.5 15 19.5l-3.5-6zM11.5 13.5l8-9',
    gauge: 'M4.5 16.5a7.5 7.5 0 1 1 15 0M12 16.5l3.8-4.6',
    layers: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
    inbox: 'M4.5 13.5 7 5.5h10l2.5 8v5h-15zM4.5 13.5h4.5l1 2h4l1-2h4.5',
    card: 'M4.5 6h15v12h-15zM9 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6.5 16c.6-1.4 1.4-2 2.5-2s1.9.6 2.5 2M14 10h3M14 13.5h3',
    book: 'M12 7.5c-1.6-1.4-3.9-2-7-2v12c3.1 0 5.4.6 7 2 1.6-1.4 3.9-2 7-2v-12c-3.1 0-5.4.6-7 2zM12 7.5v12',
    pen: 'M5 19l1-4 9.5-9.5 3 3L9 18zM13.5 7.5l3 3',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    box: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    play: 'M4.5 6h15v12h-15zM10.5 9.5v5l4-2.5z',
    coin: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM14.4 9.6c-.4-.8-1.2-1.3-2.4-1.3-1.4 0-2.4.8-2.4 1.8 0 2.5 4.9 1.3 4.9 3.8 0 1-1 1.8-2.5 1.8-1.2 0-2.1-.5-2.5-1.3M12 7v1.3M12 15.7V17',
    users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 10.5a2.5 2.5 0 1 0 0-5M17 14.5c2 .3 3.2 1.8 3.6 4.5',
    nodes: 'M8.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM14.5 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 7h7M7 9.2l3.6 6.2M17 9.2l-3.6 6.2',
    shield: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5zM9 12l2 2 4-4',
    loop: 'M18.5 9A7 7 0 0 0 6 7.5M5.5 15A7 7 0 0 0 18 16.5M6 4v3.5h3.5M18 20v-3.5h-3.5',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    lock: 'M7 11h10v8.5H7zM9 11V8.5a3 3 0 0 1 6 0V11',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5'
  };
  function glyph(name, parent, size, cls) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    sv('path', { d: GL[name], stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  function box(cls, parent, x, y, w, h, text) {
    var e = el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  }
  // the entry of a [time, value, …] table in force at tau
  function at(tb, tau) { var j = 0; while (j + 1 < tb.length && tau >= tb[j + 1][0]) j++; return j; }

  /* ---------------- the four areas: the same cast as the other scenes ----------------
     win: tl, tr, bl, br. A row shows from `at`; `p` is its pill's timetable, `v` a value
     counted up over [t0, t1], `bar` a fill over [t0, t1]. A link carries work from one
     window to another at `t`: across a band as a chip with `text`, down a side as a dot.
     `on` are the spans a window is at work, `ph` the phone's line. */
  var WAIT = 'w', OK = 'ok', HOLD = 'h', IDLE = 'i';
  function AREA(key) {
    if (key === 'areaGrowth') return {
      win: [
        { app: T('智搜', 'Smart Search'), g: 'search', grp: T('主动获客与商机判断', 'Customer acquisition'), on: [[0.4, 4.6]],
          st: [[0.5, T('搜索中', 'Searching'), WAIT], [3.4, T('已排序', 'Ranked'), OK]],
          rows: [
            { k: 'q', at: 0.4, t1: 1.9, a: T('48V 储能与叉车电池 · 海外买家', 'Buyers: 48V storage & forklift packs') },
            { k: 'it', at: 2.1, cc: 'DE', a: 'Nordwerk Energie GmbH', b: T('汉堡 · 储能系统集成', 'Hamburg · storage integrator'), v: [94, 2.1, 3.1], bar: [2.1, 3.1, 0.94] },
            { k: 'it', at: 2.5, cc: 'US', a: 'Gulf Coast Lift Supply', b: T('休斯敦 · 叉车与仓储', 'Houston · forklift fleets'), v: [91, 2.5, 3.4], bar: [2.5, 3.4, 0.91], opt: 1 }
          ] },
        { app: T('拓客', 'Outreach'), g: 'send', grp: T('市场渠道与客户发现', 'Channels & discovery'), on: [[4.3, 8.4]],
          st: [[4.4, T('核实中', 'Verifying'), WAIT], [6.6, T('等你授权', 'Needs your OK'), HOLD]],
          rows: [
            { k: 'it', at: 4.5, g: 'card', a: 'Nordwerk Energie GmbH', b: T('采购经理 · 职业社交平台', 'Purchasing manager · professional network'), p: [[4.5, T('核实中', 'Checking'), WAIT], [6.1, T('已核实', 'Verified'), OK]] },
            { k: 'it', at: 6.5, g: 'lock', a: T('联系前先经你授权', 'Contact needs your OK'), b: T('不会自动发出', 'Nothing goes out by itself'), p: [[6.5, T('待授权', 'Waiting'), HOLD]] }
          ] },
        { app: T('补货雷达', 'Reorder radar'), g: 'gauge', grp: T('主动获客与商机判断', 'Opportunity research'), on: [[1.2, 5.8]],
          st: [[1.3, T('观察中', 'Watching'), WAIT], [4.3, T('到期 1 家', '1 due'), HOLD]],
          rows: [
            { k: 'it', at: 1.4, cc: 'ID', a: 'PT Surya Energi', b: T('上次下单 60 天前 · 周期约 60 天', 'Last order 60 days ago · cycle ~60 days'), bar: [1.6, 4.2, 1], p: [[1.4, T('观察', 'Watching'), WAIT], [4.3, T('到补货周期', 'Restock due'), HOLD]] },
            { k: 'it', at: 4.6, g: 'arrow', a: T('建议联系 · 交给指挥中心', 'Worth a call · sent to Command'), b: T('64V 104Ah 与其车型匹配', '64V 104Ah fits their models'), opt: 1 }
          ] },
        { app: T('指挥中心', 'Command Center'), g: 'layers', grp: T('工作台与经营总览', 'Workspace & overview'), on: [[5.6, 15]],
          st: [[5.7, T('排任务', 'Planning'), WAIT], [10.4, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'st', at: 5.7, a: T('开发德国储能经销商', 'Find storage distributors in Germany'), s: [[T('目标', 'Goal'), 5.9], [T('客户 1', 'Account'), 7.1], [T('补货 1', 'Reorder'), 8.2], [T('4 位 AI 员工', '4 AI staff'), 9.3]] },
            { k: 'gt', at: 10.3, a: T('开发计划 · 等你确认', 'Outreach plan · your call'), b: T('确认之前，不会联系任何客户', 'No one is contacted before you confirm') }
          ] }
      ],
      links: [{ a: 0, b: 1, t: 3.6, text: 'Nordwerk Energie · 94' }, { a: 1, b: 3, t: 6.9 }, { a: 2, b: 3, t: 7.6, text: 'PT Surya · ' + T('补货', 'reorder') }],
      pn: [T('智搜', 'Search'), T('拓客', 'Outreach'), T('补货雷达', 'Reorder'), T('指挥中心', 'Command')],
      ph: [[0, T('智搜：找 48V 储能与叉车电池买家', 'Search: 48V storage buyers')], [3.4, 'Nordwerk Energie GmbH · ' + T('匹配 94', 'fit 94')], [6.1, T('拓客：采购经理已核实 · 待授权', 'Buyer verified · contact needs OK')],
        [7.6, T('PT Surya 到补货周期 → 指挥中心', 'PT Surya due to restock → Command')], [10.4, T('开发计划 · 等你确认', 'Outreach plan · your call')]]
    };
    if (key === 'areaContext') return {
      win: [
        { app: T('客户会话', 'Customer Chat'), g: 'inbox', grp: T('询盘与多渠道沟通', 'Inquiries & conversations'), on: [[0.4, 4.4]],
          st: [[0.5, T('2 条新询盘', '2 new'), WAIT], [3.4, T('已归档', 'Filed'), OK]],
          rows: [
            { k: 'it', at: 0.6, cc: 'DE', a: 'Müller Energie GmbH', b: '200 pcs 48V 100Ah, DAP Hamburg?', p: [[0.6, T('邮件', 'Email'), IDLE]] },
            { k: 'it', at: 1.5, cc: 'AE', a: 'Ahmed Al-Rashid', b: T('72V 锂电池组 · 50 套', '72V lithium pack · 50 units'), p: [[1.5, 'WhatsApp', IDLE]], opt: 1 }
          ] },
        { app: T('客户全景', 'Account Overview'), g: 'card', grp: T('CRM 与客户全景', 'CRM & customer context'), on: [[3.5, 8]],
          st: [[3.6, T('读取需求', 'Reading'), WAIT], [6.3, T('需求已理清', 'Needs clear'), OK]],
          rows: [
            { k: 'st', at: 3.7, a: 'Müller Energie GmbH · ' + T('德国', 'Germany'), s: [['48V 100Ah', 4.3], ['200 pcs', 4.9], ['DAP Hamburg', 5.5], [T('第 2 次询价', '2nd inquiry'), 6.1]] },
            { k: 'it', at: 6.4, g: 'arrow', a: T('交给回复起草', 'Sent to the reply draft'), b: T('前因后果一起带上', 'With the full history'), opt: 1 }
          ] },
        { app: T('知识库', 'Knowledge Base'), g: 'book', grp: T('产品与企业知识', 'Products & knowledge'), on: [[4.6, 9]],
          st: [[4.7, T('检索中', 'Searching'), WAIT], [7.4, T('找到 2 处', '2 found'), OK]],
          rows: [
            { k: 'q', at: 4.7, t1: 5.9, a: T('48V 100Ah 交期 · DAP 条款', '48V 100Ah lead time · DAP terms') },
            { k: 'it', at: 6.3, g: 'doc', a: T('产品规格书 v3 · 第 2 页', 'Spec sheet v3 · page 2'), b: T('已审核的企业资料', 'Approved company material'), p: [[6.3, T('引用', 'Cited'), OK]] },
            { k: 'it', at: 7, g: 'doc', a: T('交期表 · 2026 Q4', 'Lead times · Q4 2026'), b: T('标注出处', 'Source noted'), p: [[7, T('引用', 'Cited'), OK]], opt: 1 }
          ] },
        { app: T('回复草稿', 'Reply draft'), g: 'pen', grp: T('询盘与多渠道沟通', 'Customer conversations'), on: [[7.4, 15]],
          st: [[7.5, T('起草中', 'Drafting'), WAIT], [10.6, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'q', at: 7.6, t1: 9.8, a: T('Dear Mr. Müller, 48V 100Ah 可交 200 pcs …', 'Dear Mr. Müller, we can supply 200 pcs …'), pen: 1 },
            { k: 'gt', at: 10.5, a: T('发送前由你确认', 'You confirm before it is sent'), b: T('附 2 处资料出处', '2 sources attached') }
          ] }
      ],
      links: [{ a: 0, b: 1, t: 3.3, text: 'Müller Energie · ' + T('询盘', 'inquiry') }, { a: 1, b: 3, t: 6.7 }, { a: 2, b: 3, t: 7.6, text: T('2 处出处', '2 sources') }],
      pn: [T('客户会话', 'Chat'), T('客户全景', 'Account'), T('知识库', 'Knowledge'), T('回复草稿', 'Reply')],
      ph: [[0, T('客户会话：Müller Energie 的邮件询盘', 'Chat: inquiry from Müller Energie')], [3.4, T('客户全景：48V 100Ah · 200 pcs · DAP', 'Account: 48V 100Ah × 200 · DAP')],
        [6.3, T('知识库：规格书 v3、交期表', 'Knowledge: spec sheet, lead times')], [7.6, T('回复草稿：引用 2 处资料', 'Reply draft: 2 sources cited')], [10.6, T('发送前由你确认', 'You confirm before it is sent')]]
    };
    if (key === 'areaDeal') return {
      win: [
        { app: T('报价中心', 'Quotation Center'), g: 'doc', grp: T('报价、PI 与商业文件', 'Quotes, PI & records'), on: [[0.4, 5.2]],
          st: [[0.5, T('核价中', 'Pricing'), WAIT], [3.6, T('1 份待审批', '1 to approve'), HOLD]],
          rows: [
            { k: 'it', at: 0.6, g: 'check', a: T('Q-1041 · 已批准', 'Q-1041 · approved'), b: T('生成 PI · 进入订单', 'PI issued · into an order'), p: [[0.6, T('已批准', 'Approved'), OK]] },
            { k: 'it', at: 1.6, g: 'doc', a: 'Q-1042 · 48V 100Ah × 200', b: T('毛利低于底价', 'Margin below the floor'), bar: [1.8, 3.4, 0.38], floor: 0.5, p: [[1.6, T('核价', 'Pricing'), WAIT], [3.5, T('等你审批', 'Needs approval'), HOLD]] }
          ] },
        { app: T('企业管理', 'ERP'), g: 'box', grp: T('ERP、订单与履约', 'ERP, orders & fulfilment'), on: [[2.6, 9]],
          st: [[2.7, T('生产中', 'In production'), WAIT], [7.6, T('已出货', 'Shipped'), OK]],
          rows: [
            { k: 'st', at: 2.8, a: T('订单 · 72V 锂电池组 × 50', 'Order · 72V lithium pack × 50'), s: [[T('排产', 'Planned'), 3.2], [T('生产', 'Built'), 4.6], [T('质检', 'QC'), 5.9], [T('出货', 'Shipped'), 7.4]] },
            { k: 'it', at: 7.5, g: 'doc', a: T('CI · 箱单 · 提单', 'CI · packing list · B/L'), b: T('随货单证已齐', 'Shipping documents ready'), p: [[7.5, T('已齐', 'Ready'), OK]], opt: 1 }
          ] },
        { app: T('视频制作', 'Video Studio'), g: 'play', grp: T('AI 图片、视频与营销', 'AI images, video & marketing'), on: [[1, 7.4]],
          st: [[1.1, T('生成中', 'Making'), WAIT], [5.6, T('待审核', 'For review'), HOLD]],
          rows: [
            { k: 'th', at: 1.2, a: T('主图 · 场景图 · 15 秒短视频', 'Product · scene · 15 s video'), s: [2.2, 3.4, 4.6] },
            { k: 'it', at: 5, g: 'pen', a: T('卖点文案 · 英 / 德 / 西', 'Copy · EN / DE / ES'), b: T('人工审核后才发布', 'Published only after review'), p: [[5, T('待审核', 'For review'), HOLD]], opt: 1 }
          ] },
        { app: T('付款节点', 'Payments'), g: 'coin', grp: T('ERP、订单与履约', 'Collections'), on: [[7.8, 15]],
          st: [[7.9, T('跟进中', 'Tracking'), WAIT], [10.4, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'it', at: 8, g: 'check', a: T('订金 30% · 已到账', 'Deposit 30% · received'), b: 'PI-1041', p: [[8, T('已到账', 'Received'), OK]] },
            { k: 'gt', at: 10.3, a: T('尾款 70% · 催款信待你确认', 'Balance 70% · reminder for your OK'), b: T('出货后 · 不会自动发出', 'After shipment · not sent by itself') }
          ] }
      ],
      links: [{ a: 0, b: 1, t: 2.3, text: 'PI-1041 → ' + T('订单', 'order') }, { a: 1, b: 3, t: 7.7 }, { a: 2, b: 0, t: 5.4 }],
      pn: [T('报价中心', 'Quotes'), T('企业管理', 'ERP'), T('视频制作', 'Video'), T('付款节点', 'Payments')],
      ph: [[0, T('报价：Q-1041 已批准，生成 PI', 'Quote: Q-1041 approved, PI issued')], [2.4, T('企业管理：72V 锂电池组排产', 'ERP: 72V packs scheduled')], [3.6, T('Q-1042 低于底价 · 等你审批', 'Q-1042 below floor · needs you')],
        [5.6, T('视频制作：主图、场景图、短视频待审核', 'Video: images and clip for review')], [7.6, T('已出货 · 单证已齐', 'Shipped · documents ready')], [10.4, T('尾款催款信 · 等你确认', 'Balance reminder · your call')]]
    };
    return {
      win: [
        { app: T('数字员工', 'AI Staff'), g: 'users', grp: T('数字员工与团队协作', 'AI workforce & teamwork'), on: [[0.4, 5.6]],
          st: [[0.5, T('挑选中', 'Choosing'), WAIT], [3.6, T('4 位已就位', '4 assigned'), OK]],
          rows: [
            { k: 'q', at: 0.4, t1: 1.8, a: T('开发德国储能经销商', 'Find storage distributors in Germany') },
            { k: 'st', at: 2, a: T('288 个岗位里挑 4 位', '4 of 288 roles'), s: [[T('市场研究员', 'Research'), 2.4], [T('产品工程师', 'Engineer'), 2.8], [T('销售', 'Sales'), 3.2], [T('创意', 'Creative'), 3.6]] }
          ] },
        { app: T('业务关系', 'Relationships'), g: 'nodes', grp: T('企业业务关系与上下文', 'Business context'), on: [[1.2, 6]],
          st: [[1.3, T('关联中', 'Linking'), WAIT], [4.4, T('已对齐', 'Linked'), OK]],
          rows: [
            { k: 'st', at: 1.4, a: 'Müller Energie GmbH', s: [[T('询盘', 'Inquiry'), 1.9], ['Q-1042', 2.7], [T('负责人', 'Owner'), 3.5], [T('往来邮件', 'Emails'), 4.3]] },
            { k: 'it', at: 4.6, g: 'arrow', a: T('同一个客户，各系统对得上', 'One customer, every system'), b: T('AI 员工按此推进', 'AI employees work from this'), opt: 1 }
          ] },
        { app: T('权限与审批', 'Permissions'), g: 'shield', grp: T('权限、审批与经营控制', 'Permissions & approvals'), on: [[5.8, 11.5]],
          st: [[5.9, T('核对权限', 'Checking'), WAIT], [8.4, T('1 项待批', '1 to approve'), HOLD]],
          rows: [
            { k: 'it', at: 6, g: 'check', a: T('读客户记录 · 起草开发信', 'Read records · draft emails'), b: T('在授权范围内', 'Within the granted scope'), p: [[6, T('允许', 'Allowed'), OK]] },
            { k: 'gt', at: 8.3, a: T('发送开发信 · 等你批准', 'Send the emails · needs your OK'), b: T('关键操作由人批准', 'People approve key actions') }
          ] },
        { app: T('改进复核', 'Improvement'), g: 'loop', grp: T('长期经验与持续改进', 'Retained experience'), on: [[8, 15]],
          st: [[8.1, T('复盘中', 'Reviewing'), WAIT], [12, T('等你批准', 'Your call'), HOLD]],
          rows: [
            { k: 'st', at: 8.2, a: T('开发信 v2', 'Outreach email v2'), s: [[T('执行观察', 'Observed'), 8.7], [T('结果复盘', 'Reviewed'), 9.6], [T('发布前测试', 'Tested'), 10.6], [T('等你批准', 'Your OK'), 11.6]] },
            { k: 'it', at: 11.8, g: 'lock', a: T('未经批准，不会发布', 'Not released without approval'), b: T('可随时撤回', 'Can be reverted'), p: [[11.8, T('待批准', 'Waiting'), HOLD]], opt: 1 }
          ] }
      ],
      links: [{ a: 1, b: 0, t: 4.7, text: T('客户背景', 'Customer context') }, { a: 0, b: 2, t: 5.6 }, { a: 2, b: 3, t: 7.9, text: T('执行记录', 'Work records') }],
      pn: [T('数字员工', 'AI Staff'), T('业务关系', 'Context'), T('权限审批', 'Approvals'), T('改进复核', 'Improve')],
      ph: [[0, T('数字员工：为一个目标挑 4 位', 'AI Staff: 4 roles for one goal')], [1.4, T('业务关系：客户、报价、负责人对上', 'Context: Müller, Q-1042, owner')], [6, T('权限：起草可以，发送要你批准', 'Drafts allowed · sending needs OK')],
        [8.3, T('发送开发信 · 等你批准', 'Send the emails · needs your OK')], [12, T('开发信 v2 · 未经批准不会发布', 'Email v2 · needs your approval')]]
    };
  }

  function AreaScene(key) {
    return function () {
      var P = 15.2, CLEAR = 14.4, START = 2;
      var A = AREA(key);
      A.win.forEach(function (d) { d.st.unshift([0, T('待命', 'Ready'), IDLE]); });
      var layouts = {};
      function lay(kind, w, h) { var k = kind + '-' + w + 'x' + h; if (!layouts[k]) layouts[k] = { w: w, h: h, kind: kind }; return k; }
      function pick(w, h) {
        if (w < 560 || h < 330) return lay('phone', Math.max(300, Math.min(558, Math.round(w / 2) * 2)), Math.max(220, Math.min(440, Math.round(h / 2) * 2)));
        return lay('desk', Math.max(720, Math.min(1400, Math.round(w / 20) * 20)), Math.max(380, Math.min(900, Math.round(h / 20) * 20)));
      }
      var R, kind, W, H, card = null, nextCard = null, covered = false, chk = -1;

      /* ---------------- desk ---------------- */
      // the caption's largest box at this width, per language (measured 768–1920): kept clear of motion
      function hub() {
        var hw = Math.min(W - 96, Math.max(K.ZH ? 0.56 * W : 0.66 * W, K.ZH ? 520 : 600));
        return { w: hw, h: Math.max(0.36 * H, 190) };
      }
      // row heights, and tighter ones for the short windows of a 720-768px tall screen
      var ROWS = { q: 36, it: 46, st: 50, th: 54, gt: 54 }, TIGHT = { q: 34, it: 42, st: 46, th: 50, gt: 48 }, ROWH = ROWS;
      function buildDesk(stage) {
        var m = W >= 1100 ? 26 : 18, gap = W >= 1100 ? 22 : 14, hb = hub();
        var bandH = Math.floor((H - hb.h) / 2) - m - 6;
        ROWH = bandH < 190 ? TIGHT : ROWS;
        var ww = Math.floor((W - 2 * m - gap) / 2);
        var y0 = m, y1 = H - m - bandH;
        var rects = [[m, y0], [m + ww + gap, y0], [m, y1], [m + ww + gap, y1]];
        R.side = Math.max(0, (W - hb.w) / 2 - m);
        var svg = R.svg = sv('svg', { class: 'sga-fx', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' }, stage);
        R.win = A.win.map(function (d, i) { return win(stage, d, rects[i][0], rects[i][1], ww, bandH, i); });
        R.links = A.links.map(function (l) { return link(stage, svg, l, m); });
        var tag = el('div', 'sg-tag', stage, T('动态示意 · 演示数据', 'Illustrative motion · demo data'));
        tag.style.left = (W - m) + 'px'; tag.style.top = (H - 5) + 'px';
      }
      function win(stage, d, x, y, w, h, i) {
        var c = box('sga-win', stage, x, y, w, h);
        var bar = el('div', 'sga-bar', c);
        var ic = el('span', 'sga-app', bar); glyph(d.g, ic, 15);
        el('b', '', bar, d.app);
        if (w >= 420) el('span', 'sga-grp', bar, d.grp);
        var st = el('span', 'sga-st', bar); el('i', '', st);
        var o = { c: c, d: d, x: x, y: y, w: w, h: h, st: el('span', '', st), stEl: st, stK: -1, rows: [] };
        var avail = h - 48, rows = d.rows.slice(), need = function () { return rows.reduce(function (s, r) { return s + ROWH[r.k] + 6; }, 0); };
        // short windows drop the optional rows, then the earlier ones: what waits for a person stays
        while (need() > avail && rows.some(function (r) { return r.opt; })) rows.splice(rows.map(function (r) { return !!r.opt; }).lastIndexOf(true), 1);
        while (need() > avail && rows.length > 1) rows.shift();
        var ry = 46;
        rows.forEach(function (r) { o.rows.push(row(c, r, ry, w)); ry += ROWH[r.k] + 6; });
        return o;
      }
      function row(c, r, y, w) {
        var e = box('sga-row is-' + r.k, c, 10, y, w - 20, ROWH[r.k]);
        var o = { e: e, r: r, on: null };
        if (r.k === 'q') {
          glyph(r.pen ? 'pen' : 'search', e, 15, 'sga-q-ico');
          var qt = el('span', 'sga-q', e); o.q = el('span', '', qt); o.qn = -1; o.chars = Array.from(r.a);
          return o;
        }
        if (r.k === 'gt') {
          var gs = sv('svg', { viewBox: '-20 -20 40 40', width: 34, height: 34, class: 'sg-gate is-wait sga-gate', 'aria-hidden': 'true' }, e);
          o.ring = sv('circle', { r: 16, class: 'sg-gate-ring' }, gs);
          sv('rect', { x: -6, y: -6, width: 12, height: 12, rx: 2.4, transform: 'rotate(45)', class: 'sg-gate-core' }, gs);
          var gt = el('div', 'sga-tx', e); el('b', '', gt, r.a); el('span', '', gt, r.b);
          if (w >= 460) { var bt = el('span', 'sga-btns', e); el('span', 'sg-btn is-primary', bt, T('确认', 'Confirm')); el('span', 'sg-btn', bt, T('修改', 'Revise')); }
          return o;
        }
        if (r.cc) el('span', 'sga-cc', e, r.cc); else if (r.g) { var gi = el('span', 'sga-gi', e); glyph(r.g, gi, 14); }
        var tx = el('div', 'sga-tx', e); el('b', '', tx, r.a);
        if (r.k === 'st') {
          var ss = el('div', 'sga-steps', tx);
          o.steps = r.s.map(function (s) { var sp = el('span', 'sga-step', ss); el('i', '', sp); el('em', '', sp, s[0]); return sp; });
          return o;
        }
        if (r.k === 'th') {
          var th = el('div', 'sga-thumbs', e);
          o.th = r.s.map(function (s, k) { var tile = el('i', 'sga-tile is-t' + k, th); if (k === 2) glyph('play', tile, 14); return tile; });
          return o;
        }
        if (r.b) el('span', '', tx, r.b);
        if (r.bar && w >= 380) {
          var bb = el('i', 'sga-meter', e); o.fill = el('i', '', bb);
          if (r.floor) { var fl = el('i', 'sga-floor', bb); fl.style.left = (r.floor * 100) + '%'; }
        }
        if (r.v) o.v = el('em', 'sga-v', e, '0');
        if (r.p) { o.p = el('span', 'sga-pill', e); o.pk = -1; }
        return o;
      }
      // a link: across a band a chip is carried over the gap; down a side, a dot runs beside the caption
      function link(stage, svg, l, m) {
        var a = R.win[l.a], b = R.win[l.b], o = { l: l };
        if (a.y === b.y) {
          var right = a.x < b.x, y = a.y + Math.min(a.h - 20, 74);
          var x0 = right ? a.x + a.w - 56 : a.x + 56, x1 = right ? b.x + 56 : b.x + b.w - 56;
          o.p = [[x0, y], [x0 + (x1 - x0) * 0.3, y - 34], [x0 + (x1 - x0) * 0.7, y - 34], [x1, y]];
          var g = (x0 + x1) / 2;
          o.guide = sv('path', { d: 'M' + (right ? a.x + a.w : a.x) + ' ' + y + 'H' + (right ? b.x : b.x + b.w), class: 'sga-guide' }, svg);
          o.chip = el('div', 'sga-chip', stage); var ci = el('span', '', o.chip); glyph('arrow', ci, 13); el('b', '', ci, l.text);
          o.g = g;
        } else {
          var left = a.x < W / 2, x = left ? m + Math.min(46, R.side / 2) : W - m - Math.min(46, R.side / 2);
          var ya = a.y < b.y ? a.y + a.h : a.y, yb = a.y < b.y ? b.y : b.y + b.h;
                    sv('path', { d: 'M' + x + ' ' + ya + 'V' + yb, class: 'sga-rail' }, svg);
          o.lit = sv('path', { d: 'M' + x + ' ' + ya + 'V' + yb, class: 'sga-rail is-lit', pathLength: 100 }, svg);
          o.dot = sv('circle', { cx: x, cy: ya, r: 3.6, class: 'sga-dot', opacity: 0 }, svg);
          o.d = yb - ya;
          sv('circle', { cx: x, cy: ya, r: 2.4, class: 'sga-node' }, svg);
          sv('circle', { cx: x, cy: yb, r: 2.4, class: 'sga-node' }, svg);
        }
        return o;
      }

      /* ---------------- phone ---------------- */
      function buildPhone(stage) {
        var pad = 12, n = 4, gap = 6, cw = (W - 2 * pad - gap * (n - 1)) / n;
        R.chips = A.win.map(function (d, i) {
          var c = box('sga-pchip', stage, pad + i * (cw + gap), 9, cw, 28);
          glyph(d.g, c, 13); el('span', '', c, A.pn[i]);
          return { c: c, d: d };
        });
        var line = box('sga-pline', stage, pad, H - 37, W - 2 * pad, 28);
        R.pdot = el('i', '', line);
        R.ptext = el('span', 'sga-ptext', line);
        el('span', 'sg-tag', line, T('演示数据', 'Demo data'));
      }

      function build(stage, L) {
        kind = L.kind; W = L.w; H = L.h; R = { stage: stage };
        // the phone's app chips drop their glyphs when a name would not fit beside one
        var narrow = kind === 'phone' && A.pn.some(function (n) { return Array.from(n).length * (K.ZH ? 12 : 6.9) + 32 > (W - 42) / 4; });
        stage.className = 'sg-mo-stage sga is-' + kind + (narrow ? ' is-narrow' : '');
        if (kind === 'phone') buildPhone(stage); else buildDesk(stage);
        // the card stack: a card under the next one is covered, and is not drawn while it is
        var host = stage.parentNode;
        card = host && host.closest ? host.closest('.work-card') : null;
        nextCard = card ? card.nextElementSibling : null;
        chk = -1;
      }

      /* ---------------- frame ---------------- */
      var pt = [0, 0];
      function bezAt(p, u) {
        var v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
        pt[0] = a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0];
        pt[1] = a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1];
      }
      function onAt(d, tau) { for (var k = 0; k < d.on.length; k++) if (tau >= d.on[k][0] && tau < d.on[k][1]) return true; return false; }
      function rowTick(o, tau) {
        var r = o.r, show = tau >= r.at;
        if (o.on !== show) { o.on = show; cl(o.e, 'is-on', show); }
        if (r.k === 'q') {
          var n = Math.round(o.chars.length * c01((tau - r.at) / (r.t1 - r.at)));
          if (o.qn !== n) { o.qn = n; put(o.q, 'text', o.chars.slice(0, n).join('')); }
          cl(o.e, 'is-typing', tau >= r.at && tau < r.t1 + 0.4);
          return;
        }
        if (o.ring) { put(o.ring, 'transform', show ? 'scale(' + (1 + 0.08 * Math.sin(tau * 4.4)).toFixed(3) + ')' : 'scale(1)'); cl(o.e, 'is-wait', show); return; }
        if (o.steps) { for (var k = 0; k < o.steps.length; k++) cl(o.steps[k], 'is-on', tau >= r.s[k][1]); return; }
        if (o.th) { for (var j = 0; j < o.th.length; j++) cl(o.th[j], 'is-on', tau >= r.s[j]); return; }
        if (o.fill) put(o.fill, '-transform', 'scaleX(' + (r.bar[2] * ease.out(seg(tau, r.bar[0], r.bar[1]))).toFixed(3) + ')');
        if (o.v) put(o.v, 'text', String(Math.round(r.v[0] * ease.out(seg(tau, r.v[1], r.v[2])))));
        if (o.p) {
          var pk = at(r.p, tau);
          if (o.pk !== pk) { o.pk = pk; put(o.p, 'data-tone', r.p[pk][2]); textSwap(o.p, r.p[pk][1]); }
        }
      }
      function tick(t) {
        var tau = mod(t, P), i;
        // 4 times a second, one rect read: is the next card of the stack lying on this one?
        if (card && nextCard && t !== chk && Math.abs(t - chk) > 0.25) {
          chk = t;
          covered = nextCard.getBoundingClientRect().top <= card.getBoundingClientRect().top + 2 && getComputedStyle(card).position === 'sticky';
        }
        if (covered && R.drawn) return;
        R.drawn = true;
        cl(R.stage, 'is-clear', tau >= CLEAR);
        if (kind === 'phone') {
          for (i = 0; i < 4; i++) cl(R.chips[i].c, 'is-on', onAt(R.chips[i].d, tau));
          var pk = at(A.ph, tau);
          if (R.pk !== pk) { R.pk = pk; textSwap(R.ptext, A.ph[pk][1]); }
          put(R.pdot, '-transform', 'scale(' + (1 + 0.35 * Math.sin(tau * 5)).toFixed(3) + ')');
          return;
        }
        for (i = 0; i < R.win.length; i++) {
          var w = R.win[i], d = w.d;
          cl(w.c, 'is-on', onAt(d, tau));
          var sk = at(d.st, tau);
          if (w.stK !== sk) { w.stK = sk; put(w.stEl, 'data-tone', d.st[sk][2]); textSwap(w.st, d.st[sk][1]); }
          for (var k = 0; k < w.rows.length; k++) rowTick(w.rows[k], tau);
        }
        for (i = 0; i < R.links.length; i++) {
          var o = R.links[i], t0 = o.l.t, u = seg(tau, t0, t0 + 0.9), e = ease.io(u), moving = u > 0 && u < 1;
          if (o.chip) {
            if (moving) { bezAt(o.p, e); put(o.chip, '-transform', 'translate(' + pt[0].toFixed(1) + 'px,' + pt[1].toFixed(1) + 'px)'); }
            put(o.chip, '-opacity', moving ? (Math.min(1, u * 6, (1 - u) * 6)).toFixed(3) : '0');
            cl(o.guide, 'is-lit', tau >= t0 && tau < t0 + 1.6);
          } else {
            put(o.lit, 'stroke-dashoffset', (100 - 100 * e).toFixed(1));
            put(o.lit, 'opacity', tau >= t0 && tau < CLEAR ? '1' : '0');
            put(o.dot, 'transform', 'translate(0 ' + (o.d * e).toFixed(1) + ')');
            put(o.dot, 'opacity', moving ? '1' : '0');
          }
        }
      }

      return {
        layouts: layouts,
        pick: pick,
        build: build,
        tick: tick,
        start: START,  // a card slides in with its first windows already at work
        still: 12.6,   // every window has done its part; the area waits for a person
        cue: function (t) { return Math.ceil((t - START) / P) * P + START; }
      };
    };
  }

  return { areaGrowth: AreaScene('areaGrowth'), areaContext: AreaScene('areaContext'), areaDeal: AreaScene('areaDeal'), areaTeam: AreaScene('areaTeam') };
});
