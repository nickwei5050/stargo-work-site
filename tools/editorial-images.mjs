/** Final image pass: keep every template element/class/animation target intact. */
import { readFileSync } from 'node:fs';
const { assets } = JSON.parse(readFileSync(new URL('./imagegen/assets-manifest.json', import.meta.url), 'utf8'));
if (assets.length !== 43) throw new Error('All 43 editorial images must exist before building');
const byId = new Map(assets.map(a => [a.id, a]));
const descriptions = {
  'os-cockpit': ['总控制台：工作轨道与关键决策汇聚到一个指挥视图', 'The command cockpit: work lanes and key decisions in one control view'],
  'os-sales-desk': ['销售工作台：询盘、跟进与回复草稿同屏推进', 'The sales desk: inquiries, follow-ups and draft replies on one surface'],
  'os-inquiries': ['客户对话：兴趣、历史与待办汇集成共享上下文', 'Customer inbox: interest, history and next actions as shared context'],
  'os-agent-center': ['专业工具沿并行轨道协作', 'Specialized instruments collaborate along parallel work lanes'],
  'os-quote-studio': ['报价枢纽：单据与凭证汇聚到同一个报价中心', 'The quoting hub: documents and credentials gathered at one quoting centre'],
  'os-trade-execution': ['制造交付区从检验到装运的连续流程', 'A continuous path from inspection to dispatch'],
  'os-desktop': ['系统地图：连接不同业务工作空间的共享桌面', 'System map: one shared desktop connecting business workspaces'],
  'os-login': ['准入核验：受控通道只为确认过的身份开放', 'Admission checks: the controlled passage opens only for verified identities'],
  'os-boot': ['AI 创作工作室：图片与视频任务从同一创作台发起', 'AI creative studio: image and video work starts from one creative desk'],
  'os-loading': ['企业上下文逐层就位', 'Enterprise context assembling layer by layer'],
  'brand-glow-wide': ['相连的全球网络与案头一角', 'A connected global network at the corner of a desk'],
  'brand-glow-square': ['暗夜中的全球网络', 'The global network at night'],
  'brand-glow-tall': ['落笔审批：关键文件上的确认', 'Approval in ink: confirmation on the key document'],
  'brand-ontology': ['企业知识库：经验沉淀为可复用的知识', 'The company knowledge base: experience settled into reusable knowledge'],
  'brand-loop': ['环绕全球节点的协作轨道', 'Collaboration tracks orbiting global nodes'],
  'brand-family-01': ['履约一线：仓库传送带上的 STARGO 货箱', 'The fulfilment line: STARGO cartons on the warehouse conveyor'],
  'brand-family-02': ['企业资源计划：生产、库存与履约状态同屏可见', 'ERP: production, inventory and fulfillment status on one screen'],
  'brand-family-03': ['专业分工与并行执行', 'Specialized roles and parallel execution'],
  'brand-family-04': ['围坐研讨的团队：共识在对话中形成', 'A team in discussion: consensus forming through dialogue'],
  'mobile-approvals': ['关键决策在审批点等待', 'A key decision held at an approval gate'],
  'mobile-agents': ['在共享节点协调的并行任务', 'Parallel tasks coordinated at a shared junction'],
  'mobile-inquiry': ['对话转化为持续保留的客户知识', 'Conversation becomes retained customer knowledge'],
  'mobile-core': ['贯穿各层的企业共享上下文', 'Shared enterprise context across layers'],
  'phone-approvals': ['可控、可回退的审批路径', 'A controlled, reversible approval path'],
  'phone-agents': ['在共享基础上协同的专业角色', 'Specialized roles coordinating on a shared foundation'],
  'silo-email': ['彼此分离的邮件记录', 'Disconnected email records'],
  'silo-whatsapp': ['未连接的客户对话', 'Disconnected customer conversations'],
  'silo-excel': ['需要人工对齐的表格记录', 'Tabular records that require manual reconciliation'],
  'silo-erp': ['彼此隔离的订单状态', 'Order states on disconnected tracks'],
};
/* The owner's own product screenshots (tools/imagegen/product-assets.json,
   handoff of 2026-09-18). They go through this same pass, so a product image
   gets its size, srcset and alt from one place like every other image here.

   What their alt says, and why. These are generated demonstration interfaces
   of the product, not photographs of a customer's account: the alt names the
   surface and then says so, in the page's language. The same sentence is the
   caption the blocks print under a full-bleed product image. Nothing here may
   read as a real screenshot, a customer or a result. */
const products = JSON.parse(readFileSync(new URL('./imagegen/product-assets.json', import.meta.url), 'utf8')).assets;
for (const a of products) {
  /* Each id keeps the surface it came from and the source document's own
     number, so a screen can be found again in the document it was taken from. */
  /* ow = OPEN WORK renders (tools/openwork/): the number is the render's
     own, not a source document's, and the source is a render, not imageNN. */
  const id = a.id.match(/^(?:sw|erp|gos)(\d{2,3})-/) ?? a.id.match(/^ow(\d{2})-/);
  const source = a.sourceFile?.match(/image(\d+)\.(?:png|webp)$/i);
  if (!id) throw new Error(`Product image ids keep their source number: ${a.id}`);
  if (source && Number(id[1]) !== Number(source[1])) {
    throw new Error(`Product image id and source disagree: ${a.id} is ${a.sourceFile}`);
  }
  byId.set(a.id, a);
}
const productText = {
  'sw003-ai-workspace-home': ['AI 工作台首页：一句需求进入，左侧是专家、技能、任务与企业知识', 'The AI workspace home: one request goes in, with experts, skills, tasks and company knowledge beside it'],
  'sw004-experts-library': ['专家库：按职能筛选的专业岗位，每个岗位有技能声明', 'The experts library: specialized roles filtered by function, each with its declared skills'],
  'sw006-expert-teams': ['专家团队：五个角色围绕同一条询盘分工，并留下完成记录', 'An expert team: five roles divide one inquiry between them and leave a record of what was done'],
  'sw008-workflow-library': ['工作流库：业务流程的步骤、审批要求与接入状态', 'The workflow library: the steps, approval points and integration status of each business process'],
  /* Growth OS. gos10 stays the control tower from the curated pack.
     gos01 / gos09 / gos11 were the older 1268px stills; on 2026-09-22 they
     took the remaining pack screens with the closest narrative
     (growth analytics, control centre, workspace home). Those screens are
     demonstration interfaces, including a not-started analytics runtime on
     the growth view. Nothing is cropped. */
  'gos10-growth-control-tower': ['增长控制塔：市场信号、商机优先级与今日决策栈，右侧是同一条线索的问答', 'The growth control tower: market signals, prioritized opportunities and the day\u2019s decisions, with questions about the same account beside them'],
  'gos01-market-thesis': ['增长分析看板标题区：STARGO 增长分析', 'Growth analytics board header: STARGO growth analytics'],
  'gos09-reorder-radar': ['控制中心：本组应用的运行状态、延迟与相关能力域', 'Control centre: health, latency and the capability domains for this group of applications'],
  'gos11-dormant-reactivation': ['全能工作台：对话、应用与语音控制台从同一个入口进入', 'The workspace home: conversation, applications and the voice console from one entrance'],
  'gos05-buying-committee': ['采购委员会：一家客户的决策角色覆盖情况、缺口与分角色的行动计划', 'The buying committee: which decision roles are covered at one account, what is missing and the plan for each role'],
  'sw028-sales-desk-inquiry-reply': ['销售工作台：一封询盘的要点提取与带依据的回复草稿', 'Sales Workbench: the key facts extracted from an inquiry and a grounded draft reply'],
  'sw033-sales-desk-document-pack': ['销售工作台：询盘要点、报价草稿与单据中心在同一工作台', 'Sales Workbench: the inquiry, a draft quote and the document centre on one workbench'],
  /* Curated 2026-09-22 UI stills that keep editorial filenames (module cards /
     story art slots) but are product interfaces with demonstration data. */
  'brand-family-02': ['企业资源计划：生产、库存与履约状态同屏可见', 'ERP: production, inventory and fulfillment status on one screen'],
  'os-boot': ['AI 创作工作室：图片与视频任务从同一创作台发起', 'AI creative studio: image and video work starts from one creative desk'],
  'os-cockpit': ['总控制台：工作轨道与关键决策汇聚到一个指挥视图', 'The command cockpit: work lanes and key decisions in one control view'],
  'os-sales-desk': ['销售工作台：询盘、跟进与回复草稿同屏推进', 'The sales desk: inquiries, follow-ups and draft replies on one surface'],
  'os-inquiries': ['客户对话：兴趣、历史与待办汇集成共享上下文', 'Customer inbox: interest, history and next actions as shared context'],
  'os-desktop': ['系统地图：连接不同业务工作空间的共享桌面', 'System map: one shared desktop connecting business workspaces'],
  /* OPEN WORK (2026-10-09): HTML rebuilds of the real chat workspace, rendered
     by tools/openwork/render.mjs. Layout, app list, quick actions and the
     composer footnote are the real interface; every conversation is demo data. */
  'ow01-home': ['OPEN WORK 新聊天：左侧是 15 个应用，输入框下方是起草开发信、分析询盘并回复、跟进客户、起草报价单 / PI、整理企业资料五个快捷操作', 'OPEN WORK new chat: the 15 apps on the left and five quick actions under the message box (draft outreach, analyze an inquiry and reply, follow up customers, draft a quote or PI, organize company material)'],
  'ow02-inquiry': ['OPEN WORK 分析询盘并回复：一封瑞典客户的询盘，查了客户CRM 和企业知识库，按价格表算出 FOB 宁波报价，英文回复草稿等你点「批准」', 'OPEN WORK analyzing an inquiry: a Swedish buyer\u2019s request checked against the customer CRM and the knowledge base, priced FOB Ningbo from the price list, with an English reply waiting for your approval'],
  'ow03-quote': ['OPEN WORK 起草 PI：套用公司抬头和银行信息，单价低于标准价 4.2%，已交销售经理审批，批准前不会发给客户', 'OPEN WORK drafting a PI: company letterhead and bank details applied; the unit price is 4.2% below standard, so it waits for the sales manager and is not sent before approval'],
  'ow04-outreach': ['OPEN WORK 起草开发信：主动获客筛出 5 家北欧零售商，与客户CRM 去重，每封开发信发送前都要你确认', 'OPEN WORK drafting outreach: five Nordic retailers found by Prospecting, de-duplicated against the customer CRM, each email waiting for your confirmation'],
  'ow05-brief': ['OPEN WORK 本周业务简报：询盘、报价、赢单和等你审批的 4 件事在一屏说清', 'OPEN WORK weekly brief: inquiries, quotes, wins and the four items awaiting your decision on one screen'],
  'ow06-follow': ['OPEN WORK 跟进客户：读客户CRM 时间线，找出样品未回复、报价未回复和到了补货周期的客户，跟进消息起草好，逐条等你确认', 'OPEN WORK customer follow-up: the customer CRM timeline shows who has not answered a sample or a quote and who is due to reorder; drafted follow-ups wait for your approval one by one'],
  /* the chat column of ow02–ow05 alone, for the desktop showcase */
  'ow32-inquiry-focus': ['OPEN WORK 对话：分析一封瑞典客户的询盘，查了客户CRM 和企业知识库，按价格表算出 FOB 宁波报价，英文回复草稿等你点「批准」', 'An OPEN WORK chat analyzing a Swedish buyer\u2019s inquiry: checked against the customer CRM and the knowledge base, priced FOB Ningbo from the price list, with an English reply waiting for your approval'],
  'ow33-quote-focus': ['OPEN WORK 对话：起草 PI，套用公司抬头和银行信息，单价低于标准价 4.2%，已交销售经理审批，批准前不会发给客户', 'An OPEN WORK chat drafting a PI: letterhead and bank details applied; the unit price is 4.2% below standard, so it waits for the sales manager and is not sent before approval'],
  'ow34-outreach-focus': ['OPEN WORK 对话：主动获客筛出 5 家北欧零售商，与客户CRM 去重，开发信发送前要你确认', 'An OPEN WORK chat on prospecting: five Nordic retailers, de-duplicated against the customer CRM, and an outreach email waiting for your confirmation'],
  'ow35-brief-focus': ['OPEN WORK 对话：本周业务简报，询盘、报价、赢单和等你决定的 4 件事', 'An OPEN WORK chat with the weekly brief: inquiries, quotes, wins and the four decisions waiting for you'],
  'ow12-inquiry-card': ['询盘回复草稿：英文回复已写好，对外发送需要你确认，点「批准」才发出', 'An inquiry reply draft: the English reply is written, and nothing goes out until you press Approve'],
  'ow13-quote-card': ['PI 卡片：明细、FOB 宁波总价和付款条件，审批中，批准前不会发给客户', 'A PI card: line items, the FOB Ningbo total and payment terms, in approval and not sent before it is approved'],
  'ow14-outreach-card': ['目标客户表：5 家北欧零售商的国家、类型、信号和匹配度', 'The prospect list: five Nordic retailers with country, type, buying signal and match score'],
  'ow15-brief-card': ['老板简报卡片：新询盘、已报价、赢单、待你审批，以及需要你决定的 4 件事', 'The weekly brief card: new inquiries, quotes, wins, pending approvals and the four decisions waiting for you'],
  'ow16-follow-card': ['建议跟进卡片：4 位客户的跟进理由和起草好的消息，发送前逐条等你确认', 'Suggested follow-ups: four customers, why each is due and a drafted message, each waiting for your approval'],
  'ow20-apps': ['OPEN WORK 侧栏：老板看板、客户CRM、主动获客、销售工作台、企业ERP 等 15 个应用', 'The OPEN WORK sidebar: 15 apps including Owner Dashboard, Customer CRM, Prospecting, Sales Workbench and ERP'],
  'ow21-pi-check': ['价格校验：单价低于标准价 4.2%，PI-2026-1108 已提交销售经理审批，批准前不会发给客户', 'Price check: the unit price is 4.2% below standard, so PI-2026-1108 waits for the sales manager and is not sent to the customer before approval'],
  'ow22-approval-bar': ['回复草稿和它的审批栏：对外发送需要你确认，点「批准」才发出', 'A reply draft and its approval bar: sending to a customer needs your confirmation, and nothing goes out until you click Approve'],
  'ow23-quick-actions': ['OPEN WORK 输入框和五个快捷操作：选择后只填入输入框，不会自动发送', 'The OPEN WORK message box and five quick actions: a shortcut only fills the box and never sends on its own'],
  'ow24-step-log': ['执行记录：找该跟进的客户时，AI 写明读了客户CRM 时间线、销售工作台的报价与寄样记录、老客户的下单间隔', 'The step record: to find customers due a follow-up, AI notes that it read the customer CRM timeline, quote and sample records in the Sales Workbench, and past reorder intervals'],
  /* the real welcome page and four apps opened in the chat's right-hand panel (2026-10-09, C1) */
  'ow07-welcome': ['OPEN WORK 欢迎页：「你好，欢迎使用 OPEN WORK，你的 AI 外贸业务执行系统」，下方是按主动获客、询盘处理、客户跟进、报价与 PI 等分类的快速任务、六张任务卡片和输入框', 'The OPEN WORK welcome page: “Welcome to OPEN WORK, your AI execution system for foreign trade”, quick tasks sorted by prospecting, inquiries, follow-up and quotes & PI, six task cards and the message box'],
  'ow08-crm': ['OPEN WORK 把广交会 6 张名片录进客户CRM：左侧对话查重、建档并起草跟进邮件，右侧面板打开客户CRM，5 家新公司标为新建、1 家已合并到原档案，邮件发送前等你确认', 'OPEN WORK filing six trade-fair business cards into the customer CRM: the chat de-duplicates, creates records and drafts follow-up emails, the right-hand panel shows the CRM with five new companies and one merged, and the emails wait for your confirmation'],
  'ow09-automation': ['OPEN WORK 创建自动化流程：每天 9 点找出报价 3 天未回复的客户并起草跟进邮件，右侧是自动化中心的流程列表和最近运行，邮件发送前等你批准', 'OPEN WORK creating an automation: every morning at 9 it finds customers who have not answered a quote in 3 days and drafts follow-ups; the right-hand panel shows the Automation Center flows and recent runs, and nothing is sent before you approve'],
  'ow10-erp': ['OPEN WORK 下生产工单：读取 PI、确认定金到账、检查库存，右侧企业ERP 显示生产工单草稿和物料状态，礼盒库存为 0 已起草采购单，下达前等你确认', 'OPEN WORK raising a production order: it reads the PI, checks the deposit and the stock; the ERP panel shows the draft work order and material status, with no gift boxes in stock and a purchase order drafted, and everything waits for your confirmation'],
  'ow11-staff': ['OPEN WORK 派工：新询盘交给企业调度长，由询盘接待员、客户档案管家、客户背调员和报价员分头处理，右侧是 STARGO 数字员工 288 名的花名册，报价草稿发送前等你确认', 'OPEN WORK dispatching work: a new inquiry goes to the dispatcher, which hands it to the inquiry desk, the customer-file keeper, the background checker and the quoter; the right-hand panel lists the roster of 288 STARGO AI Staff, and the quote draft waits for your confirmation'],
  'ow17-crm-card': ['名片建档卡片：4 个步骤，5 家新建客户和 1 家合并到原档案的客户，5 封跟进邮件等你确认', 'A business-card filing card: four steps, five new customers and one merged into an existing record, with five follow-up emails waiting for your confirmation'],
  'ow18-automation-card': ['自动化流程卡片：每天 09:00 读取报价记录，找出 3 天未回复的客户，起草跟进邮件，等你批准', 'An automation card: every day at 09:00 it reads the quote records, finds customers silent for 3 days and drafts follow-up emails that wait for your approval'],
  'ow19-erp-card': ['生产工单卡片：产品、数量和工期，四种物料的库存状态，礼盒库存为 0 需要采购，下达前等你确认', 'A production-order card: product, quantity and dates, the stock status of four materials, the gift boxes out of stock and needing a purchase, and a confirmation before it is released'],
  'ow25-staff-card': ['数字员工派工卡片：询盘接待员、客户档案管家、客户背调员和报价员各做了什么，以及等你确认的报价草稿', 'A dispatch card: what the inquiry desk, the customer-file keeper, the background checker and the quoter each did, and the quote draft waiting for your confirmation'],
};
for (const a of products) if (a.id.startsWith('ow') && !productText[a.id]) throw new Error(`OPEN WORK image without alt text: ${a.id}`);
export const PRODUCT_CAPTION = { zh: '产品界面示意（演示数据）', en: 'Illustrative product interface · demo data' };
export function editorialImages(html, lang) {
  // Also covers inline backgrounds and absolute Open Graph URLs.
  let out = html.replaceAll('assets/stargo/', 'assets/stargo-editorial/');
  out = out.replace(/<img\b[^>]*>/g, (tag) => {
    const id = tag.match(/\bsrc="assets\/(?:stargo-editorial|stargo-product)\/([^"/]+)\.(?:webp|png)"/)?.[1];
    if (!id) return tag;
    const asset = byId.get(id);
    if (!asset) throw new Error(`Unregistered editorial image: ${id}`);
    const product = productText[id];
    const decorative = /\balt=""/.test(tag) || id.startsWith('avatar-');
    const text = (product ?? descriptions[id])?.[lang === 'zh' ? 0 : 1];
    const suffix = product
      /* the OPEN WORK renders are its Chinese interface: an English reader is told so */
      ? (lang === 'zh' ? `。${PRODUCT_CAPTION.zh}` : ` — ${id.startsWith('ow') ? 'Illustrative product interface, shown in Chinese · demo data' : PRODUCT_CAPTION.en}`)
      : (lang === 'zh' ? '（AI 概念图）' : ' (AI concept illustration)');
    const alt = decorative || !text ? '' : `${text}${suffix}`;
    /* A block that knows its own display width names it in data-sizes
       (the OPEN WORK shots: 1200px on desktop); it replaces the guess below. */
    const named = tag.match(/\sdata-sizes="([^"]*)"/)?.[1];
    let result = tag.replace(/\s(?:alt|srcset|sizes|width|height|decoding|data-sizes)="[^"]*"/g, '');
    const attrs = [`alt="${alt}"`, `width="${asset.width}"`, `height="${asset.height}"`, 'decoding="async"'];
    if (asset.variants.length) {
      const variants = [...asset.variants, asset];
      attrs.push(`srcset="${variants.map(v => `${v.src} ${v.width}w`).join(', ')}"`);
      // Do not use sizes=auto: CSS auto-width images in the supplied templates
      // acquire a 300px containment intrinsic size, collapsing wide card art.
      // The rotating gallery's tiles are a fixed 14rem box at every width, so
      // they name their own size instead of a viewport fraction — without this
      // they would download the widest variant for a 224px tile.
      const tile = /ro-home-header-img/.test(result);
      const dashboard = /prodect-dashboard-image/.test(result);
      const small = /photo-image|image-rotator|image-text-rotator|author/.test(result);
      /* (2026-10-09, C2) A `card` branch used to give the homepage stage
         cards, the enterprise column and the capability rows
         "(max-width: 767px) 45vw, 360px". Those boxes were drawn far wider
         (the enterprise cockpit at 681px, the capability area cards at
         1382px), so the browser picked the 400w file and stretched it up to
         4x (tech audit #7). None of those boxes is on any page now; a box
         like them gets the generous default below, never a blurry file. */
      /* The capability rows' thumbnail: a fixed box, 12rem x 10rem from 992 and
         16rem x 12rem from 1440 (cinery.cn2.css), and not drawn below 992. */
      const thumb = /cn-service-thumbnail/.test(result);
      /* Gallery tiles are ~18–20rem after the curated-asset pass; the core-system
         dashboard plate may grow to 1040px on desktop (css/stargo-fusion.css). */
      if (named) attrs.push(`sizes="${named}"`);
      else attrs.push(`sizes="${tile ? '(max-width: 1439px) 288px, 320px' : dashboard ? '(max-width: 991px) 92vw, (max-width: 1439px) 70vw, 1040px' : thumb ? '(max-width: 1439px) 186px, 250px' : small ? '(max-width: 767px) 50vw, 400px' : '(max-width: 767px) 100vw, (max-width: 991px) 75vw, 60vw'}"`);
    }
    return result.replace(/\s*\/?>(\s*)$/, ` ${attrs.join(' ')}/>$1`);
  });
  return out;
}
