/**
 * 代码动画 — motion scenes drawn in code where the homepage showed generated
 * stills (owner, 2026-10-23: “不要全部放那种假假的AI图片”).
 *
 * Each host is an empty box the browser fills (js/stargo-motion.js); it keeps
 * the slot's own size, so no section moves:
 *
 *   loop   — 「一条业务主线」: the box the sticky band zooms out of (it was
 *            os-cockpit.webp as a CSS background on .absolute-photo).
 *   radar  — the Growth OS panel of the core-systems switcher (gos10).
 *   studio — the AI 创作 panel of the same switcher (os-boot).
 *   team   — 「团队分工、交流、并行与接力」 (capabilities #story-6, third card)
 *            and the 「不再各聊各的」 tile of the workforce page, both of which
 *            showed the Expert Teams composite (sw006-expert-teams.webp).
 *            js/stargo-motion-team.js + css/stargo-motion-team.css.
 *
 * And on intelligence.html, phone screens drawn in the light chrome of the
 * phone app (js/stargo-motion-phone.js):
 *
 *   feed   — the hand-held phone of 「不再 等提醒 / 等回复 / 丢背景」 (it was
 *            mobile-core.webp laid over the template's phone).
 *   squad  — the phone of the 「按任务组队」 card, beside 「工作暂停，背景不必
 *            从头解释」 (it was mobile-core.webp over mobile-agents.webp).
 *   pain-inquiry, pain-chats, pain-sheet, pain-order — the four problem cards
 *            of 「工具很多，靠人连接」 (S01–S04, the owner's photographs until
 *            2026-10-23, when he chose 「换这两处,其余照片保留」);
 *            js/stargo-motion-pain.js.
 *   cockpit-overview, cockpit-blocker, cockpit-budget — the three pictures
 *            beside 「(老板驾驶舱)」 on the enterprise page (E05–E07, owner's
 *            choice 2026-10-23). js/stargo-motion-cockpit.js +
 *            css/stargo-motion-cockpit.css.
 *
 * The hosts are role="img" with a sentence for screen readers; the scenes
 * themselves are aria-hidden drawing. Every scene says on itself that it is
 * illustrative motion with demo data.
 */
import { escapeHtml } from './lib-html.mjs';

export const MOTION_LABEL = {
  /* enterprise.html (tools/code-art-enterprise.mjs, js/stargo-motion-enterprise.js): the four story
     panels behind 决定 / 核对 / 连接 / 经营 and the 「(原则)」 picture. */
  'ent-decide': {
    zh: '动态示意（演示数据）：需要审批的事项排队到关口，审批人按你们定的规则——开发信语气太硬被驳回，产品页由市场主管批准，改过的开发信由你批准，原因都记进审批记录；低于底价的报价 Q-1042 停在关口等你拍板。付款、正式申报和专业审阅始终由人把关。',
    en: 'Illustrative motion with demo data: items that need approval queue at the gate, each going to the approver your rules name — a pushy outreach email is rejected, a product page is approved by the marketing lead, the rewritten email is approved by you, and every reason goes into the approval record; quote Q-1042, below the floor price, waits at the gate for your call. Payments, official filings and professional reviews always stay with people.',
  },
  'ent-verify': {
    zh: '动态示意（演示数据）：AI 起草的报价逐项对照来源文件核对——型号、数量和贸易术语与询盘一致，交期与生产排期不符，被标出并退回修正，复核通过后才算完成，然后交给你审批。',
    en: 'Illustrative motion with demo data: an AI-drafted quote is checked line by line against its sources — model, quantity and trade term match the inquiry, the lead time does not match the production schedule, so it is flagged and sent back, and it counts as done only once the re-check passes; then it goes to you for approval.',
  },
  'ent-connect': {
    zh: '动态示意（演示数据）：邮箱、客户记录、产品知识、ERP 和网盘的产品资料，先说清可读、可改、需审批，经你授权后逐项接入同一套业务流程；网盘的财务目录没有授权，就不接入。',
    en: 'Illustrative motion with demo data: email, customer records, product knowledge, the ERP and the shared drive’s product folder are each set to read, change or needs-approval and join one workflow one at a time once you authorize them; the drive’s finance folder is not authorized, so it stays out.',
  },
  'ent-operate': {
    zh: '动态示意（演示数据）：本周的商机、订单、任务、异常、费用和待审批事项一天天汇总起来，按负责人和期限排好，要紧的决定排在最前面交给老板。',
    en: 'Illustrative motion with demo data: the week’s opportunities, orders, tasks, exceptions, costs and pending approvals add up day by day, sorted by owner and deadline, with the decisions that matter at the top for the owner.',
  },
  'ent-stop': {
    zh: '动态示意（演示数据）：一项 AI 任务按步骤运行，你按下暂停，它停在第 3 步，每一步都有记录；继续后从第 3 步接着做，不重跑已完成的步骤，最后停在等你审批，不会自动发送。',
    en: 'Illustrative motion with demo data: an AI task runs step by step; you press pause and it stops at step 3, with every step on record; when you resume it carries on from step 3 without redoing finished steps, and it ends waiting for your approval, never sending by itself.',
  },
  loop: {
    zh: '动态示意：邮件、WhatsApp、阿里国际站和官网表单的询盘汇入 STARGO WORK，报价先经人工审批，再流向找客户、理解需求、推进订单、制作内容和管好经营五个环节。',
    en: 'Illustrative motion: inquiries from email, WhatsApp, Alibaba.com and the website flow into STARGO WORK, quotes pass a human approval, and work flows on to five stages.',
  },
  radar: {
    zh: '动态示意：Growth OS 从柳州工厂出发在全球找到目标客户，按匹配度实时排序，并写出推荐理由。',
    en: 'Illustrative motion: Growth OS finds buyers worldwide from the Liuzhou factory, ranks them by fit and writes down why.',
  },
  studio: {
    zh: '动态示意：AI 创作根据一句要求生成产品主图、场景图和短视频，并生成多语言卖点文案，全部人工审核后发布。',
    en: 'Illustrative motion: AI Creative turns one instruction into product images, scenes and short video plus copy in several languages, all reviewed before publishing.',
  },
  team: {
    zh: '动态示意：目标「开发德国储能经销商」分给市场研究员、产品工程师、销售和创意四位 AI 员工并行推进、互相接力；目标国家先等你确认，统筹汇总成果后停在人工审批，等你拍板，不会自动发送。',
    en: 'Illustrative motion: one goal, finding storage distributors in Germany, is split between four AI employees (market researcher, product engineer, sales and creative) who work in parallel and hand off to each other; a question about the target country waits for you, and a coordinator gathers the results and stops at a human approval, so nothing is sent automatically.',
  },
  feed: {
    zh: '动态示意（演示数据）：手机上的待办自己列出来——Müller Energie 三天没回复，跟进信已起草、等你确认；报价 Q-1042 低于底价，等你审批；PT Surya 到了补货周期，建议联系。你点了批准，发送前仍由你确认。',
    en: 'Illustrative motion (demo data): the phone’s to-do list fills itself — Müller Energie has not replied in three days and a follow-up is drafted for your OK; quote Q-1042 is below the floor price and needs your approval; PT Surya is due to restock. Once you approve, you still confirm before anything is sent.',
  },
  squad: {
    zh: '动态示意（演示数据）：一项任务在手机上组队，统筹、研究、销售、产品、创意分头推进、互相提问；你暂停后，任务卡留着已完成什么、在等什么、由谁拍板，继续后从中断的那一步接着做，最后汇总交你确认。',
    en: 'Illustrative motion (demo data): a task forms its team on the phone — lead, research, sales, product and creative split the work and ask each other; when you pause it, the task keeps what is done, what is waiting and who decides, then picks up at the step where it stopped and hands you the summary to confirm.',
  },
  'pain-inquiry': {
    zh: '动态示意：一封带 PDF 规格书的询盘到了，型号、数量和交货条件被一项项手工重新录入询盘表；最后同样三项从 PDF 中识别出来，等你确认。',
    en: 'Illustrative motion: an inquiry arrives with a PDF spec and the model, quantity and delivery terms are typed into the inquiry log again by hand; at the end the same three details are read from the PDF and wait for your confirmation.',
  },
  'pain-chats': {
    zh: '动态示意：同一位客户的报价、规格、样品申请和公司信息分散在邮件、WhatsApp、阿里国际站和官网表单四个窗口里，窗口来回遮挡；最后合并成一张客户卡，等你确认。',
    en: 'Illustrative motion: one buyer’s price, spec, sample request and company details sit in four windows (email, WhatsApp, Alibaba.com and the website form) that keep covering each other; at the end they merge into one customer card for you to confirm.',
  },
  'pain-sheet': {
    zh: '动态示意：客户跟进表里的日子一天天过去，便签提醒一张张掉落，一位客户变成 14 天未跟进；最后系统起草一封跟进邮件，等你确认后再发。',
    en: 'Illustrative motion: days pass in a follow-up spreadsheet, the sticky-note reminders fall away and one buyer goes 14 days without a reply; at the end a follow-up draft waits for you to approve it before anything is sent.',
  },
  'pain-order': {
    zh: '动态示意：销售在内部群里三次追问「这单到哪了？」都没人回复，销售视图里看不到生产进度；最后已排产、质检、已装柜直接显示在销售视图里。',
    en: 'Illustrative motion: sales asks the team chat three times where an order is and nobody answers, because production status is not in the sales view; at the end scheduled, QC and loaded appear in the sales view itself.',
  },
  'cockpit-overview': {
    zh: '动态示意（演示数据）：老板驾驶舱总览。商机进展的询盘和报价数随新数据增加，交付状态显示准时与延迟的订单，待审批事项升到 3 项，你批准一项后回到 2 项；数据来源里邮箱、客户记录、产品知识、ERP 和网盘已接入（5/5），网盘的财务目录没有授权，缺的财务数据已标出。',
    en: 'Illustrative motion with demo data: the owner’s cockpit overview. Inquiry and quote counts rise as new data arrives, delivery shows on-time against late orders, and pending approvals rise to three and fall back to two when you approve one. Email, customer records, product knowledge, the ERP and the shared drive are connected (5 of 5); the drive’s finance folder is not authorized, so its missing figures are flagged.',
  },
  'cockpit-blocker': {
    zh: '动态示意（演示数据）：任务与卡点。报价 Q-1043 的负责人是销售 AI，卡在缺底价，等你处理；你接手、填上底价后交回销售 AI，报价更新后仍要等你审批才发出，不会自动发送。',
    en: 'Illustrative motion with demo data: tasks and blockers. Quote Q-1043, owned by the sales AI, is blocked on a missing floor price and waits for you; you take it, enter the price and hand it back, and the updated quote still waits for your approval before it is sent. Nothing is sent automatically.',
  },
  'cockpit-budget': {
    zh: '动态示意（演示数据）：用量与预算。本月 AI 用量逐日上升，到 80% 时提醒你；下一批任务会超出上限时，新任务先暂停，等你批准。',
    en: 'Illustrative motion with demo data: usage and budget. This month’s AI usage rises day by day and alerts you at 80%; when the next batch would cross the limit, new work pauses until you approve it.',
  },
  /* capgrowth (2026-10-23): the four full-bleed backgrounds of the capabilities page's Growth OS rows
     (tools/blocks/cn-service.mjs; js/stargo-motion-growth.js), in row order, and the closing card of
     intelligence.html (tools/build-site.mjs lxPage; js/stargo-motion-improve.js). */
  dossier: {
    zh: '动态示意（演示数据）：Growth OS 为一家德国储能集成商建企业档案——官网、主营产品、认证、市场与渠道、新闻逐项汇总，每项注明来源和更新时间；只有一个来源的员工规模标为待核实。',
    en: 'Illustrative motion (demo data): Growth OS builds a file on a German storage integrator — website, products, certifications, markets and channels, news — each fact with its source and date; the company size, found in one source only, is marked to verify.',
  },
  lanes: {
    zh: '动态示意（演示数据）：点阵世界地图上，从宁波、深圳、钦州、海防出发的海运航线通往汉堡、休斯敦、雅加达和拉各斯；航线逐条亮起，显示这位买家的采购记录和供应商变化。',
    en: 'Illustrative motion (demo data): on a dotted world map, shipping lanes run from Ningbo, Shenzhen, Qinzhou and Haiphong to Hamburg, Houston, Jakarta and Lagos; one lane at a time lights up with that buyer’s purchase records and supplier changes.',
  },
  rhythm: {
    zh: '动态示意（演示数据）：PT Surya Energi 过去四次下单约每 60 天一次；距上次下单的天数逐日增加，到 60 天进入补货窗口，建议联系，跟进草稿等你确认。',
    en: 'Illustrative motion (demo data): PT Surya Energi has ordered about every 60 days; the days since its last order count up to 60 and reach the restock window, so a check-in is suggested and the draft waits for your OK.',
  },
  committee: {
    zh: '动态示意（演示数据）：德国买家 Nordwerk Energie GmbH 的采购决策链——采购经理发起需求，技术负责人评估规格，财务总监批预算，总经理拍板，每人注明身份依据；你确认后才交给 Sales Desk。',
    en: 'Illustrative motion (demo data): the buying committee of Nordwerk Energie GmbH, a German buyer — the purchasing manager raises the need, the head of engineering checks the spec, the finance director holds the budget and the managing director decides, each with the source that identifies them; it goes to Sales Desk only after you confirm.',
  },
  improve: {
    zh: '动态示意（演示数据）：每次执行都记下结果和人工修正；新版开发信先在小样本上和现行版本对比，停在等你批准，批准后按 10%、50%、100% 逐步采用；另一项改动效果不好，被撤回，失败记录留作修复依据。',
    en: 'Illustrative motion (demo data): every run logs its result and any human correction; a new outreach email is tested against the current one on a small sample and stops for your approval, then rolls out to 10%, 50% and 100%; another change does worse, is reverted, and its failure record is kept for the fix.',
  },
  /* capabilities.html, lane capsales (tools/motion-capsales.mjs) */
  inbox: {
    zh: '动态示意（演示数据）：邮件、WhatsApp、阿里国际站和官网表单的消息落进同一个收件箱，每条先读出语言、意图和产品，再分成新询盘、历史消息或垃圾信息：Müller Energie 和 Ahmed Al-Rashid 的询价分给欧洲组和中东组，PT Surya 的回复并入客户记录，一条从官网表单发来的钓鱼信息被拦截。',
    en: 'Illustrative motion (demo data): messages from email, WhatsApp, Alibaba.com and the website form land in one inbox; each is read for language, intent and product and sorted as a new inquiry, history or spam. The requests from Müller Energie and Ahmed Al-Rashid go to the EU and Middle East teams, PT Surya’s reply is filed to its account, and a phishing message sent through the website form is blocked.',
  },
  account: {
    zh: '动态示意（演示数据）：Müller Energie GmbH 的客户全景一块块拼起来：联系人和各自角色、商机阶段（报价）、需求与样品、报价 Q-1042 与 Q-1031、文件、最近的沟通；随后 Q-1042 获批、MSDS 附上，带着 v3 报价和 MSDS 的跟进信已起草，等你确认后才发送。',
    en: 'Illustrative motion (demo data): the account view of Müller Energie GmbH assembles piece by piece: contacts and their roles, the stage (quote), needs and samples, quotes Q-1042 and Q-1031, documents and the latest conversations. Then Q-1042 is approved, the MSDS is attached, and the follow-up carrying both waits for your OK before anything is sent.',
  },
  quote: {
    zh: '动态示意（演示数据）：给 Müller Energie 的报价 Q-1042（48V 100Ah × 200 组，DAP 汉堡）逐行起草，每个价格都标出依据（历史成交价、包装规则、货代报价），合计 €150,550；单价 €735 低于 €750 的底价，停下来等你审批。你点了批准（仅限本单），v3 存为正式版，按价格表的 v1 和客户目标价的 v2 也都留底可对比；转成 PI 发送前仍由你确认。',
    en: 'Illustrative motion (demo data): quote Q-1042 for Müller Energie (200 pcs 48V 100Ah, DAP Hamburg) is drafted line by line, each price labelled with its source (past deal prices, the packing rule, the forwarder’s rate), €150,550 in total. At €735 a pack it is below the €750 floor price, so it stops for your approval. You approve it for this order only; v3 is kept as the formal version, with v1 (price list) and v2 (buyer target) kept for comparison, and the PI goes out only after your OK.',
  },
  creative: {
    zh: '动态示意（演示数据）：三张 48V 100Ah 电池包的参考图进 AI 创作，依次做出白底主图、仓库场景图和 15 秒短视频的四个分镜，每一项都先进审核队列；你点了通过，发布与否仍由你决定，不会自动发布。',
    en: 'Illustrative motion (demo data): three reference photos of a 48V 100Ah pack go into AI Creative, which makes a white-background main image, a warehouse scene and the four-shot storyboard of a 15-second video; each waits in a review queue, you approve them, and publishing is still your call: nothing goes out automatically.',
  },
  /* The six code-drawn windows that stood round the homepage theatre's brand film from 2026-10-23
     (js/stargo-motion-desk.js), in the order the deal passes through them. Since 2026-10-24 those
     cells show the system's own screens (tools/real-theatre.mjs) and no page places these scenes;
     they stay registered so a cell can go back to its window in one line (tools/replaceables.mjs
     HERO keeps the history). */
  'desk-growth': {
    zh: '动态示意（演示数据）：Growth OS 的候选客户名单，Nordwerk Energie 以匹配度 94 排到第一，AI 写出理由。',
    en: 'Illustrative motion (demo data): the Growth OS shortlist, where Nordwerk Energie rises to the top with a fit of 94 and the AI writes down why.',
  },
  'desk-sales': {
    zh: '动态示意（演示数据）：Sales Desk 收到 Müller Energie 的询盘，AI 读出 48V 100Ah、200 组、DAP 汉堡，报价 Q-1042 送去审批。',
    en: 'Illustrative motion (demo data): Sales Desk receives Müller Energie’s inquiry, the AI reads out 48V 100Ah, 200 pcs and DAP Hamburg, and quote Q-1042 goes for approval.',
  },
  'desk-quote': {
    zh: '动态示意（演示数据）：报价 Q-1042 低于底价，停下等你审批；你点了批准，报价仍未发送，发送前由你确认。',
    en: 'Illustrative motion (demo data): quote Q-1042 is below the floor price and waits for your approval; you approve it, and it is still not sent until you confirm.',
  },
  'desk-erp': {
    zh: '动态示意（演示数据）：ERP 里的订单 SO-2041 依次完成备货、质检和装柜。',
    en: 'Illustrative motion (demo data): order SO-2041 in the ERP goes through stocking, quality check and container loading.',
  },
  'desk-creative': {
    zh: '动态示意（演示数据）：AI 创作生成三张产品图——白底主图、储能柜场景图和德语详情页，都停在待你审核。',
    en: 'Illustrative motion (demo data): AI Creative renders three product images — a white-background main image, a rack scene and a German detail page — and each waits for your review.',
  },
  'desk-cockpit': {
    zh: '动态示意（演示数据）：经营驾驶舱跟着其他窗口更新今日询盘、等你审批、在制订单和待审素材，并显示最新动态。',
    en: 'Illustrative motion (demo data): the business cockpit follows the other windows — inquiries today, items awaiting you, open orders and images to review — and shows the latest event.',
  },
  /* lane people (2026-10-23): about.html's four AI-employee tiles (js/stargo-motion-staff.js)
     and the workforce desktop collage card (js/stargo-motion-rolecard.js) */
  crewSignal: {
    zh: '动态示意（演示数据）：市场信号 AI 员工在 Growth OS 里扫描招聘、招标等信号，候选客户随之重新排序；Nordwerk Energie 升到第一，推荐理由写好后，联系与否由你决定。',
    en: 'Illustrative motion (demo data): the Market Signal AI scans hiring and tender signals in Growth OS and the buyer list re-ranks; Nordwerk Energie moves to the top with a written reason, and whether to contact them is your call.',
  },
  crewQuote: {
    zh: '动态示意（演示数据）：报价 AI 员工为 Ahmed Al-Rashid 的 72V 锂电池组询盘逐行生成报价 Q-1046，底价校验发现单价低于底价，报价提交审批，等你批准，批准前不会发给客户。',
    en: 'Illustrative motion (demo data): the Quotation AI builds quote Q-1046 line by line for Ahmed Al-Rashid’s 72V lithium pack inquiry; the floor-price check finds the unit price below the floor, so the quote waits for your approval and nothing goes to the buyer first.',
  },
  crewFollow: {
    zh: '动态示意（演示数据）：报价发出后，Müller Energie 三天没有回复；跟进 AI 员工起草了一封跟进信，停在待你确认，你确认后才会发出。',
    en: 'Illustrative motion (demo data): three days after the quote, Müller Energie has not replied; the Follow-up AI drafts a follow-up email and stops for your OK — it goes out only after you confirm.',
  },
  crewCoord: {
    zh: '动态示意（演示数据）：统筹 AI 员工把目标「开拓巴西电动两轮市场」拆成五步，交给研究、产品、销售和创意四位 AI 员工分头推进，最后汇总，等你确认，确认前不对外发送。',
    en: 'Illustrative motion (demo data): the Coordination AI splits the goal of opening the Brazil e-scooter market into five steps for four AI employees (research, product, sales and creative), then sums up and waits for your confirmation before anything goes out.',
  },
  deskReport: {
    zh: '动态示意（演示数据）：网页桌面里的报告应用，报告 AI 员工汇总本周询盘、报价和订单，起草第 43 周周报，停在待你确认。',
    en: 'Illustrative motion (demo data): in the browser desktop’s report app, the Reporting AI totals this week’s inquiries, quotes and orders and drafts the week 43 report, then waits for your OK.',
  },
};

/* capareas (capabilities.html): the four area cards (js/stargo-motion-areas.js) and the first two cards
   of 「让 AI 团队把活干完」 (js/stargo-motion-crew.js), where the owner's photographs C01–C04, C09 and C10 were. */
Object.assign(MOTION_LABEL, {
  areaGrowth: {
    zh: '动态示意（演示数据）：指挥与增长——智搜的雷达扫出 Nordwerk Energie（匹配 94）和 Gulf Coast Lift Supply（91），拓客核实采购经理、联系前等你授权；补货雷达提示 PT Surya 到了补货周期；指挥中心把它们排进「开发德国储能经销商」，开发计划等你确认。',
    en: 'Illustrative motion (demo data): workspace and growth — the search radar finds Nordwerk Energie (fit 94) and Gulf Coast Lift Supply (91), outreach verifies the buyer and waits for your OK before any contact, the reorder radar flags PT Surya as due, and the command center turns them into an outreach plan that waits for you.',
  },
  areaContext: {
    zh: '动态示意（演示数据）：客户与知识——Müller Energie 的邮件询盘进入客户会话，询盘里的 200 pcs、48V 100Ah、DAP Hamburg 被标出并写进客户全景，交期标为待确认；知识库找到规格书和交期表的出处；回复草稿引用这两处资料，发送前由你确认。',
    en: 'Illustrative motion (demo data): customers and knowledge — in an email inquiry from Müller Energie the words 200 pcs, 48V 100Ah and DAP Hamburg are marked and become the account’s facts, with the lead time flagged to confirm; the knowledge base finds the spec sheet and lead times, and a reply draft cites both and waits for you to confirm before it is sent.',
  },
  areaDeal: {
    zh: '动态示意（演示数据）：商务、履约与创作——一笔订单沿着一条线走完：Q-1041 已批准，生成 PI-1041，24 台叉车电池经生产、质检到出货，再到回款；Q-1042 低于底价，等你审批；视频制作生成主图、场景图和短视频，人工审核后才发布；订金已到账，尾款催款信等你确认。',
    en: 'Illustrative motion (demo data): commercial, delivery and creative — one order runs along a line: approved quote Q-1041 becomes PI-1041, 24 forklift batteries are built, checked and shipped, and the balance falls due; Q-1042 is below the floor price and waits for your approval; images and a short video wait for review; the deposit is in and the balance reminder waits for you.',
  },
  areaTeam: {
    zh: '动态示意（演示数据）：员工与管理——目标「开发德国储能经销商」交给一位统筹，统筹分给从 288 个岗位里挑出的 4 位 AI 员工；业务关系把客户、报价和负责人对上；审批中心允许读记录、起草开发信，发送要你批准；改进后的开发信 v2 经测试后，未经批准不会发布。',
    en: 'Illustrative motion (demo data): workforce and management — the goal of finding storage distributors in Germany goes to a coordinator, who hands it to four AI employees chosen from 288 roles; the relationship map links customer, quote and owner; the approval center allows reading and drafting, but sending needs your approval; an improved email is tested and not released without approval.',
  },
  crewRoles: {
    zh: '动态示意（演示数据）：288 个岗位按十个职能排开；输入任务「开发德国储能经销商」后，只留下这次需要的 4 个岗位和 1 位统筹——市场研究员、产品工程师、销售、创意，统筹来自运营——组成一支团队，交给任务看板。',
    en: 'Illustrative motion (demo data): 288 roles laid out in ten functions; for the task of finding storage distributors in Germany only the four roles it needs and a coordinator stay lit — market researcher, product engineer, sales and creative, with a coordinator from operations — and form one team that is handed to the task board.',
  },
  crewBoard: {
    zh: '动态示意（演示数据）：员工任务看板——任务从待开始、进行中，到待你确认、已完成，交付的名单、规格核对和素材挂在任务上，也汇总在看板下方；开发信草稿由你批准后才算完成，报价 Q-1042 低于底价，一直等你审批。',
    en: 'Illustrative motion (demo data): a task board for AI employees — tasks move from to do and in progress to waiting for you and done, with their results attached and collected under the board; the email draft is done only once you approve it, and quote Q-1042, below the floor price, keeps waiting for your approval.',
  },
});

export function motionHost(scene, lang, extraClass = '', { fit } = {}) {
  const label = MOTION_LABEL[scene][lang];
  return `<div class="sg-mo${extraClass ? ` ${extraClass}` : ''}" data-sg-scene="${scene}"${fit ? ` data-sg-fit="${fit}"` : ''} role="img" aria-label="${escapeHtml(label)}"></div>`;
}

export const MOTION_CSS = 'css/stargo-motion.css';
export const MOTION_SCRIPTS = '<script src="js/stargo-motion-map.js" defer></script><script src="js/stargo-motion.js" defer></script>';

/* Script and style tags for a page that hosts the given scenes. A scene outside the engine lives in
   js/stargo-motion-<name>.js (plus css/stargo-motion-<name>.css when it has its own styles) and must load
   before js/stargo-motion.js, which picks it up from window.STARGO_SCENES. The world map is only loaded
   for the radar. */
const BUILT_IN = new Set(['loop', 'radar', 'studio']);
export function motionAssets(scenes) {
  const extra = [...new Set(scenes.flatMap((n) => SCENE_FILE[n] || n))].filter((n) => !BUILT_IN.has(n));
  const css = [MOTION_CSS, ...extra.filter((n) => SCENE_CSS.has(n)).map((n) => `css/stargo-motion-${n}.css`)];
  const js = [
    ...(scenes.includes('radar') ? ['js/stargo-motion-map.js'] : []),
    ...extra.map((n) => `js/stargo-motion-${n}.js`),
    'js/stargo-motion.js',
  ];
  return {
    css: css.map((href) => `<link href="${href}" rel="stylesheet" type="text/css"/>`).join('\n'),
    js: js.map((src) => `<script src="${src}" defer></script>`).join(''),
  };
}
/* scene name → the file that defines it (several scenes may share one file), or the files it needs,
   in load order */
const AREA_FILES = ['cap-kit', 'areas-cast', 'areas', 'areas-centre'];
const CREW_FILES = ['cap-kit', 'crew'];
export const SCENE_FILE = {
  'ent-decide': 'enterprise',
  'ent-verify': 'enterprise',
  'ent-connect': 'enterprise',
  'ent-operate': 'enterprise',
  'ent-stop': 'enterprise',
  team: 'team',
  feed: 'phone',
  squad: 'phone',
  'cockpit-overview': 'cockpit',
  'cockpit-blocker': 'cockpit',
  'cockpit-budget': 'cockpit',
  dossier: 'growth',
  lanes: 'lanes',
  rhythm: 'growth',
  committee: 'growth',
  improve: 'improve',
  inbox: 'sales',
  account: 'sales',
  quote: 'quote',
  creative: 'creative',
  areaGrowth: AREA_FILES,
  areaContext: AREA_FILES,
  areaDeal: AREA_FILES,
  areaTeam: AREA_FILES,
  crewRoles: CREW_FILES,
  crewBoard: CREW_FILES,
  'desk-growth': 'desk',
  'desk-sales': 'desk',
  'desk-quote': 'desk',
  'desk-erp': 'desk',
  'desk-creative': 'desk',
  'desk-cockpit': 'desk',
  'stage-find': 'stages',   // homemore: the five homepage stage cards
  'stage-sell': 'stages',
  'stage-make': 'stages',
  'stage-pay': 'stages',
  'stage-again': 'stages',
  org: 'org',               // homemore: the pricing band's enterprise card
  crewSignal: 'staff',
  crewQuote: 'staff',
  crewFollow: 'staff',
  crewCoord: 'staff',
  deskReport: 'rolecard',
  night: 'atmos',          // lane atmos (tools/code-art-atmos.mjs): homepage R1 and about A01 …
  plant: 'atmos',
  board: 'atmos-cards',    // … and the homepage R2 card and the contact K01 card
  request: 'atmos-cards',
};
/* scene files that ship their own stylesheet */
export const SCENE_CSS = new Set([
  'enterprise',
  'team',
  'phone',
  'cockpit',
  'growth',
  'improve',
  'sales',
  'quote',
  'creative',
  'areas',
  'areas-centre',
  'crew',
  'desk',
  'stages',
  'org',
  'staff',
  'rolecard',
  'atmos',
  'atmos-cards',
]);

/* pain — the homepage's four problem cards, in page order (S01–S04): one file and one stylesheet */
export const PAIN_SCENES = ['pain-inquiry', 'pain-chats', 'pain-sheet', 'pain-order'];
for (const n of PAIN_SCENES) SCENE_FILE[n] = 'pain';
SCENE_CSS.add('pain');
