/* AREAS · the cast — what each of the four area cards of capabilities.html shows
   (the scenes are js/stargo-motion-areas.js, which reads this through K.sgaCast when a
   card's scene is made). The site's one demo cast: Nordwerk Energie 94, Gulf Coast Lift
   Supply 91, PT Surya due to restock, Müller Energie's 200 pcs 48V 100Ah DAP Hamburg,
   Ahmed Al-Rashid's 72V × 50, Q-1042 at €735 below the €750 floor price (waits for the
   owner's approval), the goal 开发德国储能经销商. The
   order that ships in areaDeal is a different one (Q-1041, 24 forklift batteries). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T;


  /* ---------------- the four areas: the same cast as the other scenes ----------------
     win: an app window. `st` its status timetable, `on` the span it is at work, `body`
     its centrepiece. A row sits in slot `s` (`c` when the window is short; null: not
     then) from `at` until the next row of its slot; a row at 0 is the window's resting
     state and comes back when the loop fades. `p` a pill's timetable, `v` a value
     counted up, `bar` a fill, `o` an earlier item (dimmer), `bs` a shorter second line
     for a narrow window (`as`, `bs`, `bx`, `phs` are the shorter forms any text falls back to
   when it does not fit). desk / narrow: the windows of the two bands, by share of the
     width. Links carry work: `chip` across a band, `side` down a side, `wire` from a
     row of one window to a row of the next. `ph` the phone's line. */
  var WAIT = 'w', OK = 'ok', HOLD = 'h', IDLE = 'i';
  K.sgaCast = function (key) {
    if (key === 'areaGrowth') return {
      win: [
        { app: T('智搜', 'Smart Search'), g: 'search', grp: T('主动获客与商机判断', 'Customer acquisition'), on: [0.3, 4.2], body: 'radar',
          st: [[0.4, T('搜索中', 'Searching'), WAIT], [3.7, T('已排序', 'Ranked'), OK]],
          pins: [[1.9, 0.64, 'DE · 94'], [2.9, 0.8, 'US · 91']],
          rows: [
            { k: 'q', s: 0, at: 0, t0: 0.4, t1: 1.6, ph: T('产品、市场、客户类型…', 'Product, market, buyer type…'), a: T('48V 储能与叉车电池 · 海外买家', 'Buyers: 48V storage & forklift packs'), as: T('48V 储能 · 海外买家', 'Storage & forklift buyers') },
            { k: 'it', id: 'nw', s: 1, at: 1.9, cc: 'DE', a: 'Nordwerk Energie GmbH', as: 'Nordwerk', b: T('汉堡 · 储能系统集成', 'Hamburg · storage integrator'), bs: T('汉堡', 'Hamburg'), v: [94, 1.9, 2.9], bar: [1.9, 2.9, 0.94] },
            { k: 'it', s: 2, c: null, at: 2.9, cc: 'US', a: 'Gulf Coast Lift Supply', as: 'Gulf Coast', b: T('休斯敦 · 叉车与仓储', 'Houston · forklift fleets'), bs: T('休斯敦', 'Houston'), v: [91, 2.9, 3.7], bar: [2.9, 3.7, 0.91] }
          ] },
        { app: T('拓客', 'Outreach'), g: 'send', grp: T('市场渠道与客户发现', 'Channels & discovery'), on: [3.8, 7.4],
          st: [[3.9, T('核实中', 'Verifying'), WAIT], [6.1, T('等你授权', 'Needs your OK'), HOLD]],
          rows: [
            { k: 'it', s: 0, at: 0, o: 1, g: 'users', a: T('今日开发名单', "Today's outreach list"), b: T('2 家排队 · 联系前先核实', '2 queued · checked before contact'), bs: T('2 家排队', '2 queued') },
            { k: 'it', id: 'nw2', s: 0, at: 4.1, g: 'card', a: 'Nordwerk Energie GmbH', as: 'Nordwerk Energie', b: T('采购经理 · 职业社交平台', 'Purchasing manager · professional network'), bs: T('采购经理', 'Purchasing manager'), p: [[4.1, T('核实中', 'Checking'), WAIT], [5.5, T('已核实', 'Verified'), OK]] },
            { k: 'it', s: 1, at: 6, g: 'lock', a: T('联系前先经你授权', 'Contact needs your OK'), as: T('联系需你授权', 'Needs your OK'), b: T('不会自动发出', 'Nothing goes out by itself'), p: [[6, T('待授权', 'Waiting'), HOLD]] }
          ] },
        { app: T('补货雷达', 'Reorder Radar'), g: 'gauge', grp: T('主动获客与商机判断', 'Opportunity research'), on: [0.8, 5],
          st: [[0.9, T('观察中', 'Watching'), WAIT], [4, T('到期 1 家', '1 due'), HOLD]],
          rows: [
            { k: 'it', s: 0, at: 0, cc: 'ID', a: 'PT Surya Energi', as: 'PT Surya', b: T('上次下单 60 天前 · 周期约 60 天', 'Last order 60 days ago · ~60-day cycle'), bs: T('上次下单 60 天前', 'Last order 60 days ago'), bar: [0.9, 3.9, 1], p: [[0, T('观察', 'Watching'), IDLE], [4, T('到补货周期', 'Restock due'), HOLD]] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'gauge', a: T('关注中的进口商 · 6 家', 'Importers watched · 6'), b: T('按各自的下单周期估算', 'Estimated from their order cycles'), bs: T('按下单周期估算', 'From their order cycles') },
            { k: 'it', id: 'sug', s: 1, at: 4.3, g: 'arrow', a: T('建议联系 · 交给指挥中心', 'Worth a call · sent to Command'), as: T('建议联系 → 指挥中心', 'Worth a call → Command'), b: T('64V 104Ah 与其车型匹配', '64V 104Ah fits their models'), bs: T('64V 104Ah 匹配', '64V 104Ah fits') }
          ] },
        { app: T('指挥中心', 'Command Center'), g: 'layers', grp: T('工作台与经营总览', 'Workspace & overview'), on: [5, 13.2],
          st: [[5.1, T('排任务', 'Planning'), WAIT], [9.6, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'st', id: 'goal', s: 0, at: 0, a: T('开发德国储能经销商', 'Find storage distributors in Germany'), s2: [[T('目标', 'Goal'), 0], [T('客户 1', '1 account'), 5.4], [T('补货 1', '1 reorder'), 7.9], [T('4 位 + 统筹', '4 roles + coordinator'), 8.8]] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'check', a: T('上周 · 展会线索已排期', 'Last week · trade-show leads scheduled'), b: T('12 条 · 已完成', '12 leads · done') },
            { k: 'gt', s: 1, at: 9.5, a: T('开发计划 · 等你确认', 'Outreach plan · your call'), b: T('确认之前，不会联系任何客户', 'No one is contacted before you confirm') }
          ] }
      ],
      desk: [[[0, 0.6], [1, 0.4]], [[2, 0.4], [3, 0.6]]],
      links: [{ k: 'chip', a: 0, b: 1, ra: 'nw', rb: 'nw2', t: 3.7, text: 'Nordwerk Energie · 94' }, { k: 'side', a: 1, b: 3, t: 6.4 }, { k: 'chip', a: 2, b: 3, ra: 'sug', rb: 'goal', t: 7.1, text: 'PT Surya · ' + T('补货', 'reorder') }],
      pn: [T('智搜', 'Search'), T('拓客', 'Outreach'), T('补货雷达', 'Reorder'), T('指挥中心', 'Command')],
      ph: [[0, T('智搜：找 48V 储能与叉车电池买家', 'Search: 48V storage buyers')], [3.7, 'Nordwerk Energie GmbH · ' + T('匹配 94', 'fit 94')], [6.1, T('拓客：采购经理已核实 · 待授权', 'Buyer verified · contact needs OK')],
        [7.1, T('PT Surya 到补货周期 → 指挥中心', 'PT Surya due to restock → Command')], [9.6, T('开发计划 · 等你确认', 'Outreach plan · your call')]]
    };
    if (key === 'areaContext') return {
      win: [
        { app: T('客户会话', 'Customer Chat'), g: 'inbox', grp: T('询盘与多渠道沟通', 'Inquiries & conversations'), on: [0.3, 3.4],
          st: [[0.4, T('2 条新询盘', '2 new'), WAIT], [2.9, T('已提取需求', 'Extracted'), OK]],
          rows: [
            { k: 'msg', s: 0, c: null, at: 0, o: 1, cc: 'AE', a: 'Ahmed Al-Rashid', ch: 'WhatsApp · 09:12', parts: [T('72V 锂电池组，50 套，报个价？', 'Price for the 72V lithium pack? 50 units.')], ps: T('72V 锂电池组 50 套，报价？', '72V lithium pack × 50: price?') },
            { k: 'msg', id: 'mu', s: 1, c: 0, at: 0.5, cc: 'DE', a: 'Müller Energie GmbH', ch: T('邮件', 'Email') + ' · 09:40', parts: [['200 pcs', 1.5], ' ', ['48V 100Ah', 1.9], ', ', ['DAP Hamburg', 2.3], '?'] }
          ] },
        { app: T('客户全景', 'Account Overview'), g: 'card', grp: T('CRM 与客户全景', 'CRM & customer context'), on: [1.4, 4.4],
          st: [[1.5, T('读取需求', 'Reading'), WAIT], [3.2, T('需求已理清', 'Requirements clear'), OK]],
          rows: [
            { k: 'it', s: 0, at: 0, cc: 'DE', a: 'Müller Energie GmbH', b: T('德国 · 汉堡 · 第 2 次询价', 'Germany · Hamburg · 2nd inquiry'), bs: T('第 2 次询价', '2nd inquiry') },
            { k: 'fx', id: 'fx', s: 1, at: 0, f: [[T('数量', 'Qty'), '200 pcs', 2.4], [T('型号', 'Model'), '48V 100Ah', 2.8], [T('条款', 'Terms'), 'DAP Hamburg', 3.2, 0, 'DAP'], [T('交期', 'Lead time'), T('交期 待确认', 'Lead time?'), 3.4, 1]] },
            { k: 'it', s: 2, c: null, at: 3.6, g: 'arrow', a: T('交给回复起草', 'Sent to the reply draft'), b: T('前因后果一起带上', 'With the full history') }
          ] },
        { app: T('知识库', 'Knowledge Base'), g: 'book', grp: T('产品与企业知识', 'Products & knowledge'), on: [3.6, 7],
          st: [[3.7, T('检索中', 'Searching'), WAIT], [5.6, T('找到 2 处', '2 found'), OK]],
          rows: [
            { k: 'q', s: 0, at: 0, t0: 3.7, t1: 4.7, ph: T('搜索已审核的企业资料…', 'Search approved company material…'), phs: T('搜索已审核资料…', 'Search approved material…'), a: T('48V 100Ah 交期 · DAP 条款', '48V 100Ah lead time · DAP terms') },
            { k: 'it', s: 1, at: 0, o: 1, g: 'book', a: T('已审核资料 · 126 份', '126 approved documents'), b: T('规格书、价格政策、交期、认证', 'Specs, pricing policy, lead times, certificates'), bs: T('规格书、交期、认证', 'Specs, lead times, certificates') },
            { k: 'it', id: 'spec', s: 1, at: 5, g: 'doc', a: T('产品规格书 v3 · 第 2 页', 'Spec sheet v3 · page 2'), as: T('产品规格书 v3', 'Spec sheet v3'), b: T('已审核的企业资料', 'Approved company material'), bs: T('已审核', 'Approved'), p: [[5, T('引用', 'Cited'), OK]] },
            { k: 'it', id: 'lt', s: 2, c: null, at: 5.5, g: 'doc', a: T('交期表 · 2026 Q4', 'Lead times · Q4 2026'), b: T('标注出处', 'Source noted'), p: [[5.5, T('引用', 'Cited'), OK]] }
          ] },
        { app: T('回复草稿', 'Reply Draft'), g: 'pen', grp: T('询盘与多渠道沟通', 'Customer conversations'), on: [5.8, 13.2],
          st: [[5.9, T('起草中', 'Drafting'), WAIT], [9.6, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'it', s: 0, at: 0, g: 'mail', a: 'Re: 48V 100Ah · DAP Hamburg', b: T('致 Müller Energie GmbH · 英文', 'To Müller Energie GmbH · in English'), bs: 'Müller Energie GmbH' },
            { k: 'q', s: 1, c: 0, at: 6, t0: 6, t1: 8.2, pen: 1, a: 'Dear Mr. Müller, we can supply 200 pcs …' },
            { k: 'ci', id: 'ci', s: 2, c: 1, at: 8.4, f: [[T('[1] 规格书 v3 · 第 2 页', '[1] Spec sheet v3 · p. 2'), 8.8], [T('[2] 交期表 · Q4', '[2] Lead times · Q4'), 9.1]] },
            { k: 'gt', s: 3, c: 0, at: 9.5, a: T('发送前由你确认', 'You confirm before it is sent'), as: T('发送前由你确认', 'Your OK before sending'), b: T('附 2 处资料出处', '2 sources attached') }
          ] }
      ],
      desk: [[[0, 0.5], [1, 0.5]], [[2, 0.42], [3, 0.58]]],
      // the inquiry's three facts go over together, under the account's empty fields, as those fill
      links: [{ k: 'chip', a: 0, b: 1, ra: 'mu', rb: 'fx', t: 2, text: '200 pcs · 48V 100Ah · DAP Hamburg', ts: '200 pcs · 48V · DAP' },
        { k: 'side', a: 1, b: 3, t: 4 }, { k: 'wire', a: 2, b: 3, ra: 'spec', rb: 'ci', t: 8.4 }, { k: 'wire', a: 2, b: 3, ra: 'lt', rb: 'ci', t: 8.7 }],
      pn: [T('客户会话', 'Chat'), T('客户全景', 'Account'), T('知识库', 'Knowledge'), T('回复草稿', 'Reply')],
      ph: [[0, T('客户会话：Müller Energie 的邮件询盘', 'Chat: inquiry from Müller Energie')], [2.4, T('客户全景：200 pcs · 48V 100Ah · DAP', 'Account: 200 × 48V 100Ah · DAP')],
        [5, T('知识库：规格书 v3、交期表', 'Knowledge: spec sheet, lead times')], [8.4, T('回复草稿：引用 2 处资料', 'Reply draft: 2 sources cited')], [9.6, T('发送前由你确认', 'You confirm before it is sent')]]
    };
    if (key === 'areaDeal') return {
      win: [
        { app: T('企业管理', 'Enterprise'), g: 'box', grp: T('ERP、订单与履约', 'ERP, orders & fulfilment'), on: [0.3, 8.4], body: 'rail',
          st: [[0.4, T('履约中', 'In progress'), WAIT], [6.6, T('已出货', 'Shipped'), OK], [8, T('等回款', 'Balance due'), HOLD]],
          rail: [[T('报价', 'Quote'), T('Q-1041 · 已批准', 'Q-1041 · approved'), 0], ['PI', T('PI-1041 · 订金 30%', 'PI-1041 · 30% deposit'), 1.2],
            [T('生产', 'Production'), T('叉车电池', 'Forklift battery'), 2.4, 24], [T('质检', 'QC'), T('质检报告 · 通过', 'QC report · passed'), 4.8],
            [T('出货', 'Shipment'), T('CI · 箱单 · 提单', 'CI · packing list · B/L'), 6.2], [T('回款', 'Collection'), T('尾款 70% · 待催收', 'Balance 70% · due'), 7.6, 0, T('尾款 70% · 等你确认', 'Balance 70% · your call')]] },
        { app: T('报价中心', 'Quotation Center'), g: 'doc', grp: T('报价、PI 与商业文件', 'Quotes, PI & records'), on: [0.6, 4],
          st: [[0.7, T('核价中', 'Pricing'), WAIT], [3.4, T('1 份待审批', '1 to approve'), HOLD]],
          rows: [
            { k: 'it', s: 0, at: 0, g: 'check', a: T('Q-1041 · 已批准', 'Q-1041 · approved'), b: T('已转 PI-1041', 'Now PI-1041'), p: [[0, T('已批准', 'Approved'), OK]] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'doc', a: T('本周报价 · 6 份', 'Quotes this week · 6'), b: T('按价格规则起草', 'Drafted within pricing rules') },
            { k: 'it', s: 1, at: 1, g: 'doc', a: 'Q-1042 · 48V 100Ah × 200', as: 'Q-1042 · 48V', b: T('单价 €735 · 低于底价 €750', '€735 a pack · below the €750 floor price'), bs: T('€735 · 低于底价', '€735 · below floor price'), bx: T('低于底价', 'Below floor price'), bar: [1.2, 3, 0.35], floor: 0.5, p: [[1, T('核价', 'Pricing'), WAIT], [3.3, T('等你审批', 'Needs approval'), HOLD]] }
          ] },
        { app: T('视频制作', 'Video Studio'), g: 'play', grp: T('AI 图片、视频与营销', 'AI images, video & marketing'), on: [1, 6],
          st: [[1.1, T('生成中', 'Generating'), WAIT], [4.8, T('待审核', 'For review'), HOLD]],
          rows: [
            { k: 'th', s: 0, at: 0, a: T('主图 · 场景图 · 15 秒短视频', 'Product · scene · 15 s video'), as: T('主图 · 短视频', 'Images · video'), s2: [1.6, 2.8, 4] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'doc', a: T('产品资料 · 48V 100Ah', 'Product facts · 48V 100Ah'), as: T('产品资料', 'Product facts'), b: T('已审核 · 作为生成依据', 'Approved · the source material'), bs: T('已审核', 'Approved') },
            { k: 'it', s: 1, at: 4.6, g: 'pen', a: T('卖点文案 · 英 / 德 / 西', 'Copy · EN / DE / ES'), as: T('卖点文案', 'Sales copy'), b: T('人工审核后才发布', 'Published only after review'), bs: T('审核后发布', 'Published after review'), p: [[4.6, T('待审核', 'For review'), HOLD]] }
          ] },
        { app: T('付款节点', 'Payments'), g: 'coin', grp: T('ERP、订单与履约', 'Collections'), on: [7.6, 13.2],
          st: [[7.7, T('跟进中', 'Tracking'), WAIT], [9.4, T('等你确认', 'Your call'), HOLD]],
          rows: [
            { k: 'it', s: 0, at: 0, g: 'coin', a: T('订金 30% · PI-1041', 'Deposit 30% · PI-1041'), b: T('出货前收取', 'Due before shipment'), p: [[0, T('待到账', 'Pending'), IDLE], [1.8, T('已到账', 'Received'), OK]] },
            { k: 'gt', s: 1, at: 9.2, a: T('尾款 70% · 催款信待你确认', 'Balance 70% · reminder for your OK'), as: T('尾款 70% · 待你确认', 'Balance 70% · your OK'), b: T('出货后 · 不会自动发出', 'After shipment · not sent by itself'), bs: T('不会自动发出', 'Not sent by itself') }
          ] }
      ],
      desk: [[[0, 1]], [[1, 0.36], [2, 0.28], [3, 0.36]]],
      narrow: [[[0, 1]], [[1, 0.52], [2, 0.48]]],
      links: [{ k: 'side', a: 1, b: 0, t: 0.7 }, { k: 'side', a: 0, b: 3, t: 8 }],
      pn: [T('企业管理', 'Enterprise'), T('报价中心', 'Quotes'), T('视频制作', 'Video'), T('付款节点', 'Payments')],
      ph: [[0, T('Q-1041 → PI-1041 · 订金已到账', 'Q-1041 → PI-1041 · deposit in')], [2.4, T('企业管理：叉车电池 × 24 生产中', 'Enterprise: 24 forklift batteries')], [3.4, T('Q-1042 低于底价 · 等你审批', 'Q-1042 below floor price · your OK')],
        [4.8, T('视频制作：主图、场景图、短视频待审核', 'Video: images and clip for review')], [6.2, T('已出货 · CI、箱单、提单已齐', 'Shipped · documents ready')], [9.4, T('尾款催款信 · 等你确认', 'Balance reminder · your call')]]
    };
    return {
      win: [
        { app: T('数字员工', 'AI Staff'), g: 'users', grp: T('数字员工与团队协作', 'AI workforce & teamwork'), on: [0.3, 4.4], body: 'crew',
          st: [[0.4, T('挑选中', 'Choosing'), WAIT], [3.4, T('已分派 4 + 1', '4 + 1 assigned'), OK]],
          goal: [0.4, 1.6, T('交给团队一个目标…', 'Give the team a goal…'), T('开发德国储能经销商', 'Find storage distributors in Germany'), T('开发德国储能经销商', 'German storage dealers'), T('开发德国储能经销商', 'Storage dealers · DE')],
          crew: [['layers', T('统筹', 'Coordinator'), 1.9], ['search', T('市场研究员', 'Researcher'), 2.3], ['box', T('产品工程师', 'Engineer'), 2.6], ['sales', T('销售', 'Sales'), 2.9], ['image', T('创意', 'Creative'), 3.2]],
          note: T('288 个岗位里，挑出 4 位 + 统筹', '4 roles + a coordinator, from 288') },
        { app: T('业务关系', 'Relationships'), g: 'nodes', grp: T('企业业务关系与上下文', 'Business context'), on: [1.2, 5.4],
          st: [[1.3, T('关联中', 'Linking'), WAIT], [4.4, T('已对齐', 'Linked'), OK]],
          rows: [
            { k: 'st', id: 'mu', s: 0, at: 0, a: 'Müller Energie GmbH', s2: [[T('询盘', 'Inquiry'), 0], ['Q-1042', 1.8], [T('负责人', 'Owner'), 2.6], [T('往来邮件', 'Emails'), 3.4, T('邮件', 'Mail')]] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'nodes', a: T('客户 · 报价 · 订单 · 负责人', 'Customers · quotes · orders · owners'), as: T('客户 · 报价 · 负责人', 'Customers · quotes · owners'), b: T('一一对上', 'Linked one to one') },
            { k: 'it', s: 1, at: 4.6, g: 'arrow', a: T('同一个客户，各系统对得上', 'One customer in every system'), b: T('AI 员工按此推进', 'AI employees work from this') }
          ] },
        { app: T('审批中心', 'Approval Center'), g: 'shield', grp: T('权限、审批与经营控制', 'Permissions & approvals'), on: [5.4, 10.4],
          st: [[5.5, T('核对权限', 'Checking'), WAIT], [8, T('1 项待批', '1 to approve'), HOLD]],
          rows: [
            { k: 'pm', s: 0, c: null, at: 0, g: 'check', a: T('读客户记录', 'Read customer records'), p: [[0, T('允许', 'Allowed'), OK]] },
            { k: 'pm', s: 1, c: 0, at: 0, g: 'check', a: T('起草开发信', 'Draft outreach emails'), p: [[0, T('允许', 'Allowed'), OK]] },
            { k: 'pm', s: 2, c: 1, at: 0, g: 'lock', a: T('发送开发信', 'Send outreach emails'), p: [[0, T('需批准', 'Needs approval'), IDLE], [5.8, T('已请求', 'Requested'), WAIT]] },
            { k: 'gt', id: 'ask', s: 3, c: 1, at: 7.8, a: T('销售 AI 请求发送 3 封开发信', 'Sales AI asks to send 3 emails'), b: T('关键操作由人批准', 'People approve key actions') }
          ] },
        { app: T('改进复核台', 'Improvement Review'), g: 'loop', grp: T('长期经验与持续改进', 'Retained experience'), on: [8, 13.2],
          st: [[8.1, T('复盘中', 'Reviewing'), WAIT], [11.6, T('等你批准', 'Your call'), HOLD]],
          rows: [
            { k: 'st', id: 'v2', s: 0, at: 0, a: T('开发信 v2', 'Outreach email v2'), s2: [[T('执行观察', 'Observed'), 8.4, T('观察', 'Observed')], [T('结果复盘', 'Reviewed'), 9.3, T('复盘', 'Reviewed')], [T('发布前测试', 'Tested'), 10.3, T('测试', 'Tested')], [T('等你批准', 'Your OK'), 11.3, T('待批准', 'Your OK')]] },
            { k: 'it', s: 1, at: 0, o: 1, g: 'doc', a: T('开发信 v1 · 在用', 'Outreach email v1 · in use'), b: T('v2 批准前不变', 'Unchanged until v2 is approved') },
            { k: 'it', s: 1, at: 11.4, g: 'lock', a: T('未经批准，不会发布', 'Not released without approval'), as: T('未经批准不发布', 'Held until approved'), b: T('可随时撤回', 'Can be reverted'), p: [[11.4, T('待批准', 'Waiting'), HOLD]] }
          ] }
      ],
      desk: [[[0, 0.56], [1, 0.44]], [[2, 0.5], [3, 0.5]]],
      links: [{ k: 'chip', a: 1, b: 0, ra: 'mu', t: 4.5, text: T('客户背景', 'Customer context') }, { k: 'side', a: 0, b: 2, t: 5.3 }, { k: 'chip', a: 2, b: 3, ra: 'ask', rb: 'v2', t: 8, text: T('执行记录', 'Work records') }],
      pn: [T('数字员工', 'AI Staff'), T('业务关系', 'Context'), T('审批中心', 'Approvals'), T('改进复核', 'Improve')],
      ph: [[0, T('数字员工：4 位 + 统筹，为一个目标', 'AI Staff: 4 roles + a coordinator')], [1.4, T('业务关系：客户、报价、负责人对上', 'Context: Müller, Q-1042, owner')], [5.5, T('权限：起草可以，发送要你批准', 'Drafts allowed · sending needs OK')],
        [7.8, T('发送开发信 · 等你批准', 'Send the emails · needs your OK')], [11.6, T('开发信 v2 · 未经批准不会发布', 'Email v2 · needs your approval')]]
    };
  };
  return {};
});
