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
  const id = a.id.match(/^(?:sw|erp|gos)(\d{2,3})-/);
  /* The clean captures of 2026-10-21 (site-images/screens-final) are named
     live<NN>-, NN being the capture's own number in that folder, e.g.
     live23-erp-items-16x9 comes from clean/23-erp-items.png. */
  const live = a.id.match(/^live(\d{2})-/);
  const source = a.sourceFile?.match(/image(\d+)\.(?:png|webp)$/i);
  if (!id && !live) throw new Error(`Product image ids keep their source number: ${a.id}`);
  if (id && source && Number(id[1]) !== Number(source[1])) {
    throw new Error(`Product image id and source disagree: ${a.id} is ${a.sourceFile}`);
  }
  if (live) {
    const capture = a.sourceFile?.match(/screens-final\/(?:clean|slot-crops)\/(?:[a-z]+-row\d+-)?(\d{2})-[\w-]+\.png$/);
    if (!capture || capture[1] !== live[1]) throw new Error(`Product image id and source disagree: ${a.id} is ${a.sourceFile}`);
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
  'sw028-sales-desk-inquiry-reply': ['Sales Desk：一封询盘的要点提取与带依据的回复草稿', 'Sales Desk: the key facts extracted from an inquiry and a grounded draft reply'],
  'sw033-sales-desk-document-pack': ['Sales Desk：询盘要点、报价草稿与单据中心在同一工作台', 'Sales Desk: the inquiry, a draft quote and the document centre on one workbench'],
  /* Curated 2026-09-22 UI stills that keep editorial filenames (module cards /
     story art slots) but are product interfaces with demonstration data. */
  'brand-family-02': ['企业资源计划：生产、库存与履约状态同屏可见', 'ERP: production, inventory and fulfillment status on one screen'],
  'os-boot': ['AI 创作工作室：图片与视频任务从同一创作台发起', 'AI creative studio: image and video work starts from one creative desk'],
  'os-cockpit': ['总控制台：工作轨道与关键决策汇聚到一个指挥视图', 'The command cockpit: work lanes and key decisions in one control view'],
  'os-sales-desk': ['销售工作台：询盘、跟进与回复草稿同屏推进', 'The sales desk: inquiries, follow-ups and draft replies on one surface'],
  'os-inquiries': ['客户对话：兴趣、历史与待办汇集成共享上下文', 'Customer inbox: interest, history and next actions as shared context'],
  'os-desktop': ['系统地图：连接不同业务工作空间的共享桌面', 'System map: one shared desktop connecting business workspaces'],
  /* Clean captures of the product with demonstration data (2026-10-21,
     site-images/screens-final). They replace the earlier stills that showed a
     live mailbox, a real-looking customer and infrastructure details, and the
     generated renders with invented interfaces. Each line says what that crop
     shows and nothing more. */
  'live09-sales-desk-case-4x3': ['Sales Desk 询盘处理：左边是按等待时间排列的询盘，右边是一封询盘的型号、数量、目的港和贸易术语，下方是审批后才发出的回复草稿', 'Sales Desk inquiry handling: inquiries ordered by waiting time on the left; on the right one inquiry\u2019s model, quantity, destination and trade term, and a reply draft that is sent only after approval'],
  'live09-sales-desk-case-3x2': ['Sales Desk：询盘列表，一封询盘自动整理出的型号、数量、目的港和贸易术语，以及建议的下一步', 'Sales Desk: the inquiry list, the model, quantity, destination and trade term pulled out of one inquiry, and the suggested next step'],
  'live09-sales-desk-case-16x9': ['Sales Desk 客户案例：询盘列表、询盘要点和回复草稿，右侧 AI 助手可以分析客户、起草回复、整理报价需求，发出前由你确认', 'A Sales Desk case: the inquiry list, the inquiry\u2019s key facts and a reply draft, with the AI assistant beside them to analyse the customer, draft replies and gather quote needs, all confirmed by you before anything is sent'],
  'live23-erp-items-16x9': ['ERP 物料列表：177 个 STARGO 自有型号的名称、启用状态和物料组', 'The ERP item list: the name, status and item group of 177 STARGO products'],
  'live23-erp-items-3x2': ['ERP 物料列表：177 个 STARGO 自有型号的名称、启用状态和物料组', 'The ERP item list: the name, status and item group of 177 STARGO products'],
  'live05-growth-home-2x1': ['Growth OS 主动获客首页：上手进度，以及开始找客户和发送开发信两个入口，开始前都会请你确认', 'The Growth OS home: onboarding progress and the two starting points, finding customers and sending first emails, each confirmed with you before it runs'],
  'live05-growth-home-start-3x2': ['Growth OS 开始找客户：按你填写的产品和目标客户找新的潜在客户，由 AI 判断是否合适并写下理由', 'Growth OS, finding customers: new prospects found from the products and target customers you enter, with AI judging whether each fits and writing down why'],
  'live05-growth-home-start-5x4': ['Growth OS 开始找客户：按你填写的产品和目标客户找新的潜在客户，由 AI 判断是否合适并写下理由', 'Growth OS, finding customers: new prospects found from the products and target customers you enter, with AI judging whether each fits and writing down why'],
  'live01-desktop-home-16x9': ['网页桌面：AI 工作台、成交工作台、企业管理、视频制作等业务应用都在同一个桌面里', 'The web desktop: the AI workspace, the Sales Desk, enterprise management, video tools and other business apps on one desktop'],
  'live43-app-connections-16x9': ['应用连接：1568 个可连接服务、18345 个本地可执行操作，以及工具调用趋势和最近调用记录', 'App connections: 1,568 connectable services and 18,345 executable actions, with the trend and the record of recent tool calls'],
  'live52-mobile-case-16x9': ['手机上的 Sales Desk：一封询盘的型号和数量已经整理出来，下面是买家的原话', 'The Sales Desk on a phone: the model and quantity of an inquiry already pulled out, above the buyer\u2019s own message'],
  'live52-mobile-case-needs': ['买方需求提取：型号 DEMO C300、数量 4 直接列在买家原话上方', 'Buyer need extraction: model DEMO C300 and quantity 4 listed right above the buyer\u2019s own words'],
  'live52-mobile-case-screen': ['在手机上回询盘：英文来信可一键翻译，AI 给出下一步建议并起草回复，提交审批后才会发给客户', 'Answering an inquiry on a phone: the incoming message can be translated in one tap, AI suggests the next step and drafts a reply, and nothing reaches the customer before approval'],
  'live51-mobile-board-screen': ['手机上的成交看板：待回复、待审批和成交信号一目了然，等你批的报价单随时处理', 'The deal board on a phone: replies due, approvals waiting and buying signals at a glance, with the quote awaiting your approval one tap away'],
  'live18-quote-approval-16x9': ['销售工作台的报价审批：从邮件接入到 PI 单据每一步的状态，待审批的报价单独列出，只能由人批准', 'Quote approval in the sales workbench: the status of every step from incoming email to PI, with the quote awaiting approval listed on its own and approvable only by a person'],
};
export const PRODUCT_CAPTION = { zh: '产品界面示意（演示数据）', en: 'Illustrative product interface · demo data' };
/* The owner's graded photographs (tools/imagegen/photo-assets.json,
   site-images/batch-1 to batch-8 of 2026-10-21), keyed by registry id. They
   are photographs of places, not product screens and not concept art, so
   their alt is the owner's own sentence from the batch manifest (alt_zh,
   alt_en) with no caption after it: neither PRODUCT_CAPTION nor （AI 概念图）.
   A CSS background has no alt to carry: G01 (css/stargo-fusion.css) has no
   entry, and the entries of A01 and E01-E04, which the manifests place only
   as CSS backgrounds, are read only if one of them becomes an <img>. */
const photos = JSON.parse(readFileSync(new URL('./imagegen/photo-assets.json', import.meta.url), 'utf8')).assets;
const photoBySrc = new Map(photos.map(a => [a.src, a]));
const photoText = {
  'g02-menu-harbour-night': ['夜里隔着平静的水面望向集装箱码头，四台岸边龙门吊是深色剪影，岸线上一排暖黄的灯在水里拉出长长的倒影。', 'A container terminal at night seen across calm water: four quay cranes in silhouette and a row of warm shoreline lights casting long reflections.'],
  'w01-trade-office': ['傍晚的外贸部开放办公区，中间走道一点透视延伸到落地窗前一盏亮着的黄铜台灯，两侧工位上几位年轻业务员低头对着电脑工作，窗外是暮色中的厂房和楼群。', 'An open-plan export sales office at dusk, with a central aisle in one-point perspective leading to a lit brass desk lamp by floor-to-ceiling windows; a few young staff work at desks on either side, and factory buildings sit in the twilight beyond.'],
  'w02-workshop': ['傍晚的注塑车间主通道，两侧对称排列着浅灰色注塑机，操作工在机旁低头取件，远处一名穿暗橙色背心的工人推着装满白色塑料件的灰色周转车。', 'The main aisle of an injection-moulding workshop in the evening, with grey machines lined up on both sides and operators taking parts out beside them, while in the distance a worker in a faded orange vest pushes a grey cart of white plastic parts.'],
  'w03-warehouse': ['傍晚无人的成品仓库中央通道，两侧深灰色高位货架上整齐码放着裹缠绕膜的牛皮纸箱，通道尽头卷帘门敞开，门外是灰蓝色的天空和停着的集装箱车。', 'An empty finished-goods warehouse aisle at dusk, lined on both sides with tall dark-grey racks of shrink-wrapped kraft cartons, leading to an open loading door with a blue-grey evening sky and a parked container truck outside.'],
  'w04-qc-lab': ['傍晚的质检室里，一位穿米白工作服的女检验员站在深色花岗岩检验台尽头低头察看，台面中线上排着一列黄铜阀体，两侧是灰色量具柜和检测仪器。', 'In a dim quality-control room at dusk, a woman inspector in an off-white work jacket stands at the far end of a dark granite bench, looking down at a row of brass valve bodies, with grey gauge cabinets and measuring instruments on both sides.'],
  'w05-owner-office': ['傍晚昏暗的办公室里，一位中年男子坐在深色木桌后低头斟茶，身旁一盏落地灯亮着暖光，身后的木格架上摆着几件金属零件样品。', 'In a dim office at dusk, a middle-aged man sits behind a dark wooden table pouring tea beside a warm floor lamp, with a few metal part samples on the shelves behind him.'],
  'w06-showroom': ['傍晚无人的工厂展厅，两侧深灰钢架上整齐陈列着灯具、电热水壶和不锈钢五金件，中间一张近黑色长会议桌配黑色布面椅，桌上放着一个白瓷托盘和一件五金合页样品，上方三盏黄铜吊灯亮着暖光。', 'An empty factory showroom at dusk. Dark grey steel shelving on both sides holds lamps, electric kettles and stainless-steel hardware. A long near-black meeting table with black fabric chairs has a white tray and a hinge sample on it, and three brass pendant lamps glow above.'],
  /* Batch 1: the homepage opening mosaic. */
  'h01-port-blue-hour': ['蓝调时分雨后的集装箱码头，一台灰色岸边吊机的两条钢腿之间悬着一个旧集装箱，吊具上一盏琥珀色灯亮着并倒映在湿地面上，三名戴白色安全帽的工人背对镜头站在码头上，右侧停着一艘货轮。', 'A wet container quay at blue hour. A weathered container hangs between the two grey legs of a quay crane, and an amber lamp on the spreader is reflected in the wet ground. Three workers in white hard hats stand with their backs to the camera, and a cargo ship is moored on the right.'],
  'h02-night-inquiry': ['夜里关了顶灯的办公室，一位扎低马尾、穿米白针织衫的年轻女业务员侧脸望向画面左侧电脑的柔光，桌上放着不锈钢合页样品和白瓷杯，窗外对面楼的一排灯窗亮着暖黄色的光。', 'In a darkened office at night, a young saleswoman with a low ponytail and a cream knit sweater looks left into the soft glow of an unseen laptop. A stainless steel hinge sample and a white porcelain mug sit on the desk, and a row of warm-lit windows glows in the building across the way.'],
  'h03-sample-wall': ['样品间里，深灰金属货架上摆着不锈钢水龙头、五金件和白色小家电，一只穿藏青袖子的手从右侧伸进来，握着一只拉丝黄铜水龙头。', 'In a sample room lined with dark grey steel shelves of stainless faucets, hardware and white small appliances, a hand in a navy sleeve reaches in from the right holding a brushed brass faucet.'],
  'h04-caliper-qc': ['一只戴灰色手套的手在黑色花岗岩质检台上用游标卡尺测量一个不锈钢阶梯圆柱零件，背景是虚化的车间。', 'A gloved hand measures a stepped stainless-steel part with a vernier caliper on a dark granite inspection table, with a blurred workshop behind.'],
  'h05-assembly-line': ['灯具装配车间里，深灰色传送带伸向远处，两侧戴白色工作帽和白手套的女工低头装配白色圆形吸顶灯，线体中间一盏通电测试的灯亮着暖光。', 'In a lighting assembly workshop, a grey conveyor stretches into the distance. Women in white caps and gloves bend over white round ceiling lamps on both sides, and one lamp under test glows warm in the middle of the line.'],
  'h06-packing': ['俯拍包装台：一双穿藏青袖子的手，一只平按在空白牛皮纸箱上，另一只握着灰色胶带枪沿箱盖接缝封箱，窗光从左侧斜照在钢制台面上。', 'Overhead view of a packing bench. Two hands in navy sleeves seal a blank kraft carton: one presses the lid flat while the other pulls a grey tape gun along the seam. Window light falls across the steel bench from the left.'],
  'h07-owner-walk': ['一位两鬓斑白、穿深灰夹克的中年男子背着手走在机加工车间的主通道上，两侧是数控机床和装满金属零件的推车，晨光在水泥地面投下一道道光带，远处一台机床顶上亮着一盏琥珀色信号灯。', 'A grey-haired man in a dark grey jacket walks with his hands clasped behind his back down the main aisle of a machining workshop, past CNC machines and carts of metal parts, with bands of morning light on the concrete floor and an amber signal lamp lit on a distant machine.'],
  'h08-product-shoot': ['车间角落临时搭的拍摄台上，一位穿深灰T恤的年轻男员工弯腰扶着一只白色铜底电热水壶调整角度，上方是柔光箱，左侧前景是虚化的三脚架相机。', 'At a makeshift product-shoot table in a factory corner, a young worker in a dark grey T-shirt leans in to adjust a white electric kettle with a copper base, under a softbox, with a blurred camera on a tripod in the foreground.'],
  'h09-container-loading': ['夜间厂区装货场，一台深灰色叉车背对镜头驶上钢板，开进箱门大开、内部被顶灯照成琥珀色的集装箱，箱内已码放着牛皮纸箱托盘，湿地面映出暖光。', 'At night in a factory yard, a dark grey forklift seen from behind drives up a steel plate into an open shipping container. A ceiling lamp lights the interior amber, pallets of kraft cartons are already stacked inside, and the wet ground reflects the warm light.'],
  'h10-video-showing': ['灯具工厂展厅里，一位穿藏青色衬衫的男业务员低头看着手机，另一只手掌心向上托着一只拉丝铜色壁灯，背后是虚化的灰色展示架。', 'In a lighting factory showroom, a man in a navy shirt looks down at his phone while holding a brushed-copper wall lamp on his open palm, with grey display shelves blurred behind him.'],
  /* Batch 2: the homepage stage and problem cards. */
  'p01-prospecting': ['一位外贸经理把一只黄铜阀门放进白色样品盒的深灰海绵格里，旁边两格已放好不锈钢管接头。', 'A trade manager sets a brass valve into the dark foam insert of a white sample box, beside two stainless steel fittings already packed.'],
  'p02-sales': ['会议桌上一盏亮着的白色蘑菇形台灯样品，左边一只穿深灰袖子的手扶着灯座，右边一只穿米白袖子的手握笔停在一张画着线稿的规格图纸上。', 'A lit white mushroom table-lamp sample on a meeting table. One hand in a dark grey sleeve steadies its base, while another hand in an off-white sleeve rests a pen on a line-drawn spec sheet.'],
  'p03-fulfilment': ['小家电流水线末端，一位穿浅灰工作服、戴白色棉手套的女质检员低头检查一只白色电热水壶，身后传送带上排着同款水壶，上方一盏暖色吊灯亮着。', 'At the end of a small-appliance assembly line, a quality inspector in a light grey work jacket and white cotton gloves looks down at a white electric kettle in her hands. Identical kettles stand in a row on the conveyor behind her, under a warm pendant lamp.'],
  'p04-payment-docs': ['单证员坐在窗边办公桌前，把一叠用黑色长尾夹夹好的单证装进牛皮纸绕线文件袋，窗外厂区路上一辆白色集装箱货车正在驶离。', 'A documents clerk at a window desk slides a binder-clipped stack of papers into a kraft string-tie envelope while a white container truck drives out of the factory yard below.'],
  'p05-reorder': ['深灰工作台上并排放着两件同款胡桃木 L 形椅子扶手部件，左边旧件接缝处有一道明显的缝，右边改进后的新件接缝严密、转角圆润，一只穿藏青袖子的手用食指轻点新件的转角。', 'Two matching walnut L-shaped chair-arm parts side by side on a dark grey workbench. The older one on the left shows an open seam at the joint. The improved one on the right has a tight joint and a softer rounded corner, and a hand in a navy sleeve touches that corner with one finger.'],
  's01-inquiry-rework': ['傍晚的外贸办公室里，一名穿深灰毛衣的业务员背对镜头低头在本子上抄写要点，桌上摊着打印的询盘和零件图纸，图纸上放着一个黄铜法兰样品，手机扣在纸堆旁，笔记本电脑被推到桌子远端，窗外是暮色中的城市。', 'At dusk in an export sales office, a salesman in a dark grey sweater, seen from behind, copies notes into a notebook. Printed inquiries and a part drawing are spread across the desk with a brass flange sample on top. A phone lies face down, and a laptop is pushed to the far end of the desk by windows onto a dim city skyline.'],
  's02-scattered-chats': ['傍晚昏暗的办公室里，深色桌面上散放着三部亮着白屏的手机，一只穿藏青衬衫的手正伸过来拿起最近的一部，左前方放着一支黄铜笔，背后是虚化的窗户。', 'In a dim office at dusk, three phones with glowing blank screens lie on a dark desk. A hand in a navy shirt sleeve reaches for the nearest one, a brass pen lies in front on the left, and a blurred window fills the background.'],
  's03-spreadsheet-memory': ['一位穿深色毛衣的员工俯身在深灰色桌前，用琥珀色荧光笔划过一叠打印清单上的几行，另一只手按住纸张，旁边散放着两张空白的白色便签。', 'Over the shoulder of a worker in a dark sweater, marking rows on a stack of printed lists with an amber highlighter on a dark grey desk, one hand holding the pages flat, two blank white notes lying beside them.'],
  's04-chasing-order': ['蓝调时分的工厂厂区，地面湿漉漉的。一名穿深色夹克的中国业务员手握手机、腋下夹着文件夹，从暗处快步走向一扇敞开的车间大门，门内透出暖黄色灯光，门口放着一托缠膜包装的货物，暖光倒映在湿地面上。', 'A Chinese factory yard at blue hour, the ground wet after rain. A salesman in a dark jacket, seen from behind, hurries with a phone in his hand and a folder under his arm toward an open workshop door. Warm amber light pours out of the doorway onto a shrink-wrapped pallet and reflects across the wet concrete.'],
  /* Batch 4: about, contact, pricing and the role scenes. */
  'a01-empty-workshop': ['清晨还没开工的装配车间，两排对称的长工作台和凳子沿中央通道延伸，尽头高窗透进低角度的琥珀色晨光，铺在灰色水泥地面上。', 'An empty assembly workshop at dawn: two symmetrical rows of long workbenches and stools line the central aisle, and low amber light from the tall windows at the far end falls along the grey concrete floor.'],
  'k01-meeting-table': ['一张深色木会客桌的远端摆着一盏铜色蘑菇小台灯、一只金属门把手样品、一块木材小样、一本合上的灰色布面笔记本和钢笔，以及一只冒着热气的白瓷盖碗，窗光斜照在后面的墙上。', 'At the far end of a dark wooden meeting table sit a small copper mushroom lamp, a metal door-handle sample, a wood sample, a closed grey cloth notebook with a pen and a steaming white porcelain gaiwan, with window light falling across the wall behind.'],
  'r1-sales-rep': ['白天靠窗的办公室里，一位短发女业务员背对镜头坐在深色长桌边，一手拿着打印的报价单，一手按在不锈钢电水壶样品的壶盖上核对，桌上放着一个合上的牛皮纸档案夹。', 'In a daylit office by a window, a short-haired woman sales rep sits at a dark table with her back to the camera. She holds a printed quote sheet in one hand and rests the other on the lid of a stainless-steel kettle sample, with a closed kraft folder on the table beside her.'],
  'r2-trade-manager': ['会议室里，一位穿深色衬衫的男经理侧身站在白板前，用白板笔指着一排用箭头连起来的空白方框，其中一个方框上贴着铜色圆磁贴；两位同事坐在前景，只露出虚化的背影。', 'In a meeting room, a manager in a dark shirt stands side-on at a whiteboard and points a marker at a row of empty boxes joined by arrows, one of which holds a copper round magnet; two colleagues sit in the blurred foreground, seen from behind.'],
  'r3-sales-director': ['阴天的仓库装货口旁，一位穿深色夹克的中年男子一手扶着缠膜的牛皮纸箱托盘，一手拿着手机，侧身望向半开卷帘门外的天光。', 'In a dim warehouse by a half-open loading door, a middle-aged man in a dark jacket rests one hand on a shrink-wrapped pallet of kraft cartons, holds a phone in the other, and looks out toward the overcast daylight.'],
  'r4-general-manager': ['车间工作台旁，一位两鬓花白、穿深灰夹克的中年管理者一手扶着台面，低头看一位穿藏青工作服的技术员把黄铜阀体放进钢制夹具。', 'At a workshop bench, a grey-haired manager in a dark grey jacket rests one hand on the table and watches a technician in a navy work jacket set a brass valve body into a steel fixture.'],
  't01-enterprise-campus': ['蓝调时分航拍的一座制造园区：两栋大厂房、一栋六层办公楼和一排仓库被树林环绕，装货口亮着冷白灯，园区外主路两侧的暖黄路灯刚刚亮起。', 'Blue-hour aerial view of a manufacturing campus. Two large factory halls, a six-storey office block and a row of warehouses sit in woodland. The loading docks are lit cool white, and warm streetlights are just coming on along the road outside.'],
  /* Batch 5: the AI role cards. */
  'd01-market-research': ['深石墨色台面上叠放着三本封面空白的厚书（炭黑、浅灰、米白），最上面压着一把黄铜框放大镜，书侧露出几片米白色索引贴，左侧低角度柔光照明。', 'Three thick blank-covered books in charcoal, grey and off-white stacked on a dark graphite table, with a brass-framed magnifying glass resting on the top one and cream index tabs along the side, softly lit from the left.'],
  'd02-follow-up': ['深色石墨台面上，一部屏幕朝下的灰色手机、一只钢框沙漏和一枚拉丝不锈钢合页并排摆放，沙漏里的琥珀色细沙正在落下。', 'On a dark graphite tabletop, a face-down grey phone, a steel-framed hourglass and a brushed stainless-steel hinge sit side by side while amber sand runs through the hourglass.'],
  'd03-product-spec': ['深色台面上，一把不锈钢游标卡尺立着，量爪夹住一根横躺的黄铜阶梯轴最粗的一段，零件下垫着一张画有淡淡细线的米白小卡片。', 'A stainless steel vernier caliper stands upright on a dark tabletop, its jaws gripping the widest section of a brass stepped shaft that rests on a small off-white card ruled with faint lines.'],
  'd04-finance': ['深色石墨台面上放着一小叠只有浅灰横线的空白单据，左上角夹着黄铜长尾夹，纸上斜放一支黑色钢笔，右后方的暗处是一台深灰色计算器。', 'A small stack of blank ruled sheets held by a brass binder clip, with a black pen lying across it, on a dark graphite table; a dark grey calculator sits in shadow behind it to the right.'],
  'd05-coordination': ['深石墨色台面上一字排开金属单据夹、磨砂白灯泡、牛皮纸胶带卷和开口扳手，一只露出藏青袖口的手从右侧用两根手指把扳手推正。', 'On a dark graphite tabletop, a metal clipboard, a frosted white bulb, a roll of kraft paper tape and an open-end wrench sit in a row as a hand in a navy cuff nudges the wrench straight with two fingers.'],
  'd06-reporting': ['深色石台上放着一份黑色书脊、米白封面的装订报告，下面压着几张印有灰色柱形和铜色折线的图表纸，后方是一杯黑咖啡。', 'A bound report with a blank off-white cover and black spine on a dark stone table, resting on printed sheets with grey bars and a copper line chart, with a mug of black coffee behind.'],
  'd07-quotation': ['深色石纹台面上从左到右排着一件缎面镍色家具拉手、拉丝不锈钢、浅灰哑光塑料和浅色橡木三块材质小样，最右边是一叠空白米白便签，上面横放着一支黑色铅笔。', 'On a dark stone tabletop, a satin-nickel furniture pull sits in a row with three material samples (brushed stainless steel, light grey matte plastic and light oak), followed by a blank off-white note pad with a black pencil lying across it.'],
  /* Batch 6: the capability page. */
  'c01-command-growth': ['晨光从左侧落地窗斜照进外贸部会议室，一位中年经理俯身扶着深灰色长桌，低头看着桌上的黄铜水龙头样品，四名年轻业务员坐在桌子远端两侧，看图纸、拿着不锈钢配件。', 'Morning light slants through floor-to-ceiling windows into a trade-department meeting room. A middle-aged manager leans on a long dark-grey table and looks down at a brass faucet sample. Four young staff sit around the far end of the table, reviewing a drawing and handling stainless-steel fittings.'],
  'c02-customer-knowledge': ['一位穿米白针织衫的女业务员站在灰色钢制档案架前，一只手从架上抽出牛皮纸资料夹，另一只手拿着一件不锈钢门把手样品。', 'A sales rep in an ivory knit sweater stands at grey steel archive shelving, pulling a kraft folder from a shelf with one hand while holding a stainless steel door-handle sample in the other.'],
  'c03-commerce-fulfilment': ['昏暗的仓库里，前景钢制业务桌上放着一份只有灰色格线的报价单和一件拉丝不锈钢法兰样品，旁边一支黑色笔；中景灰色塑料托盘上码着缠了拉伸膜的牛皮纸箱，远处卷帘门敞开，门外是阴天下的厂房和水泥地。', 'In a dim warehouse, a quote sheet with only grey ruled lines and a brushed stainless-steel flange sample lie on a steel desk beside a black pen. Behind them, stretch-wrapped kraft cartons are stacked on grey plastic pallets in front of an open roller door that looks out on an overcast factory yard.'],
  'c04-team-management': ['工厂车间里，一位穿深灰西装外套的女经理侧身低头看手中的平板，身后一位穿焦糖色马甲的班组长和一位穿灰色工作服的工人正弯腰检查工作台上的金属零件，侧窗阳光斜照进来。', 'In a factory workshop, a woman manager in a dark grey blazer looks down at the tablet in her hands. Behind her, a team lead in a caramel work vest and a worker in a grey uniform lean over a bench to inspect a metal part, lit by low sunlight from high side windows.'],
  'c05-unified-inbox': ['一位穿藏青衬衫的业务员双手扶着一叠刚拢齐的打印询盘，放进浅灰办公桌中央的拉丝铜色收文盘，旁边是合上的笔记本电脑和带盖白瓷杯。', 'A salesperson in a navy shirt settles a squared stack of printed inquiries into a brushed copper letter tray at the centre of a clean grey desk, beside a closed laptop and a lidded white porcelain cup.'],
  'c06-customer-360': ['俯拍深灰石墨桌面上整齐摆放的一位客户档案：上方四张黑白阀门照片，中间一个打开的黑色皮质合同夹，左边一只旧黄铜球阀和一只不锈钢球阀，右边是空白名片和一支黑色钢笔。', 'Overhead view of one customer\'s file laid out on a dark graphite table: four black-and-white valve photos above an open black leather contract folder, an early brass ball valve beside a stainless one on the left, and blank business cards and a black pen on the right.'],
  'c07-quote-approval': ['深灰色桌面上放着一张只有格线的报价单，经理握着钢笔悬在签名线上方，业务员的手按住纸张，纸上压着一件黄铜五金样品。', 'On a dark grey desk lies a quote sheet with only grid lines. A manager holds a fountain pen just above the signature line while a salesperson\'s hand holds the page flat, and a small brass hardware sample rests on the sheet.'],
  'c08-product-references': ['靠窗的浅灰色桌面上立着一盏黑色半球灯罩、黄铜灯杆的台灯样品，前方并排摊着三张这盏台灯的冲印照片和灰、白、黑三张色卡。', 'A sample table lamp with a black dome shade and brass stem stands on a light grey desk by a window, with three printed photos of the same lamp and grey, ivory and black colour swatches laid out in front of it.'],
  'c09-288-flatlay': ['俯拍一张深灰色旧钢板工作台，九件工作物件排成三行三列：灰色线手套、不锈钢法兰、黑色订书机、透明胶带、灰阶色卡、黑色印台、灰色布面账本和白色安全帽，正中是一串黄铜钥匙。', 'Overhead view of a worn dark steel workbench with nine work objects in a three-by-three grid: grey knit gloves, a steel flange, a black stapler, clear tape, grey swatch cards, a black ink pad, a grey cloth-bound ledger and a white hard hat, with a bunch of brass keys at the centre.'],
  'c10-progress-board': ['车间里一块白色磁性看板被深色胶带分成三列，左列贴满空白灰色磁贴，一只穿深灰工作服的手正用并拢的手指把一张铜色磁贴从中间一列推向右列。', 'In a workshop, a white magnetic board divided into three columns by dark tape holds blank grey magnets, and a hand in a dark grey work sleeve pushes a copper magnet from the middle column toward the right one.'],
  'c11-company-research': ['夜间无人机垂直俯拍的工业区，一排排灰色彩钢瓦厂房屋顶纵向铺满画面，屋顶之间的窄路上亮着稀疏的琥珀色路灯，停着货车和小车。', 'Night drone view straight down over an industrial park: rows of grey corrugated factory roofs run top to bottom, with narrow lanes between them lit by sparse amber streetlights and lined with parked trucks and cars.'],
  'c12-trade-intelligence': ['俯拍的集装箱堆场，一列列深灰、炭黑和灰白色集装箱竖向排列在深色地面上，画面中上部正中有一个铜橙色集装箱。', 'An overhead view of a container yard: columns of dark grey, charcoal and off-white containers run vertically across dark ground, with one copper-orange container in the upper centre.'],
  'c13-restock': ['夜间成品仓库里正面平视的一整面深灰色高位货架，灰色塑料托盘上是缠绕膜包好的货物，空位穿插其间，正中一格是刚补进来的一托盘牛皮纸箱。', 'A dark finished-goods warehouse seen straight on: a wall of charcoal pallet racking holding stretch-wrapped loads on grey plastic pallets, with a few empty bays and one pallet of fresh kraft cartons in the centre bay.'],
  'c14-decision-makers': ['夜晚隔着竖条纹长虹玻璃看会议室，五个模糊的人影围坐桌边讨论，桌子上方一盏琥珀色吊灯。', 'At night, seen through a wall of vertically fluted glass: five blurred figures talk around a meeting table under a single amber pendant lamp.'],
  /* Batch 7: the enterprise page. */
  'e01-decide': ['深夜办公室里，一位穿藏青衬衫的男子坐在桌后，右手握着黄铜笔身的钢笔悬在一页空白文件上方，左手按住纸边，身后窗外是虚化的车间灯光。', 'At night in an office, a man in a navy shirt sits at his desk holding a brass fountain pen just above a blank document, his other hand resting on the paper\'s edge, with blurred factory lights through the window behind him.'],
  'e02-verify': ['昏暗的质检台上并排立着两只同款拉丝不锈钢鹅颈龙头，穿藏青工作服、戴灰色手套的检验员正把一枚空白牛皮纸吊牌系在左边那只龙头上。', 'Two identical brushed-steel gooseneck taps stand side by side on a dark inspection bench as an inspector in navy workwear and grey gloves ties a blank kraft tag to the left one.'],
  'e03-connect': ['傍晚昏暗的工厂档案室里，一名穿米白衬衫的年轻男员工双手捧着灰色资料盒侧身走过，左边是几只旧铁皮柜和深色木柜，右边是一排放着灰色资料盒、留有空位的钢制档案架，他头顶一盏旧搪瓷吊灯亮着暖光。', 'In a dim factory archive room at dusk, a young male clerk in an off-white shirt walks past in profile carrying a grey archive box. On the left are old metal and dark wooden cabinets. On the right is a row of steel shelving holding grey archive boxes, with some slots still empty. An old enamel pendant lamp above him gives off a warm glow.'],
  'e04-operate': ['夜班车间里，一名男子站在生产线上方的钢结构走廊上，双手扶着栏杆俯瞰下方，头顶一盏暖色吊灯照出他的轮廓，下方两条装配线亮着白灯，工人们低头作业。', 'In a factory at night, a man stands on a steel walkway above the production floor, hands on the railing, looking down. A single warm pendant lamp outlines him, and below, workers bend over two assembly lines lit with white lamps.'],
  'e05-cockpit-overview': ['清晨未开灯的办公室里，深色办公桌上立着一台背对镜头的平板，旁边一杯逆光的琥珀色热茶冒着热气，后方空着的老板椅和落地窗外是薄雾中的厂房屋顶、湿润的厂区道路和一辆停着的白色货车。', 'An unlit office at dawn: a tablet stands on a dark desk with its back to the camera, next to a steaming glass of backlit amber tea. Behind them are an empty executive chair and floor-to-ceiling windows overlooking misty factory roofs, a wet yard road and a parked white truck.'],
  'e06-cockpit-blocker': ['车间通道里，一位穿深色夹克的中年老板贴着耳朵打电话，停下脚步侧头看向右侧一台打开侧板的机床，穿灰色工作服的维修工正俯身往里检查，机床顶上的信号灯只亮着一节琥珀色。', 'In a factory aisle, a middle-aged manager in a dark jacket stops mid-call, phone to his ear, and looks toward an opened machine where a technician in grey workwear leans in to inspect it; one amber segment is lit on the machine\'s signal tower.'],
  'e07-cockpit-budget': ['深色桌面上，一只手掀起厚账本里一叠空白格子纸页，另一只手平按在右页上，账本中缝垂下一根铜色丝带书签。', 'On a dark desk, one hand lifts a sheaf of blank grid-ruled pages in a thick ledger while the other rests flat on the right-hand page; a copper ribbon bookmark hangs from the spine.'],
  'e08-emergency-stop': ['逆光的车间里，一只戴灰色针织手套的手悬在深灰色金属机床面板的红橙色急停按钮上方，背景是虚化的厂房窗户和设备。', 'A hand in a grey knit work glove hovers just above a red-orange emergency stop button on a dark steel machine panel, with a softly blurred, backlit factory hall behind.'],
  'e09-capabilities': ['深灰色洞洞板上挂着螺丝刀、铜头锤和尖嘴钳，一只穿灰色工作服的手正把扳手挂回白线画出的轮廓，旁边一个钳子的白线轮廓空着。', 'A hand in a grey work sleeve hangs a wrench back into its white outline on a dark pegboard, next to an empty pliers outline, screwdrivers, a copper-headed hammer and needle-nose pliers.'],
  'e10-access': ['一只露出藏青工作服袖口的手把一张空白浅灰工牌贴近车间门边灰色水泥墙上的深灰读卡器，读卡器上亮着一颗琥珀色小灯，背景是虚化的车间。', 'A hand in a navy work-shirt sleeve holds a blank light-grey badge up to a dark grey card reader on a concrete wall beside the workshop door, its small amber light glowing, with the factory floor blurred behind.'],
  'e11-approval': ['一只穿藏青衬衫袖口的手握着木柄印章，压在深色桌面上一叠空白表格纸上，侧光在纸面投下长长的影子。', 'A hand in a navy shirt cuff presses a wooden-handled stamp onto a stack of blank grid forms on a dark desk, with low side light casting a long shadow across the paper.'],
  'e12-records': ['车间灰色机床侧面的挂钩上挂着一块深色记录夹板，黄铜夹子夹着一张只有格子和一列勾的表格，一支黑色笔用细绳拴在夹子上垂下，背后是虚化的厂房与天窗光。', 'A dark clipboard hangs from a hook on the side of a grey machine tool in a workshop. Its brass clip holds a blank grid form with a column of ticks, and a black pen hangs from the clip on a thin cord, in front of a blurred factory hall lit by skylight.'],
  'e13-key-cabinet': ['一只穿深色工装袖口的手捏着钢钥匙，正插入挂在车间工具柜门搭扣上的旧黄铜挂锁，背后是虚化的工厂车间与机器。', 'A hand in a dark work sleeve turns a steel key in a worn brass padlock on the hasp of a scuffed steel tool cabinet, with a blurred factory floor and machines behind.'],
  /* Batch 8: the blog covers and the intelligence page. */
  'b01-visual-guide': ['傍晚时分，从车间二楼办公室的窗后俯看灯光整齐的机加工车间，中间通道尽头的装货口亮着暖光，两名工人正往货柜车里装纸箱。', 'At dusk, looking down through an upstairs office window along a machining workshop\'s central aisle to the open loading door, where two workers load cartons into a container truck under warm light.'],
  'b02-one-workflow': ['安静的包装车间里，一条空的滚筒输送线斜穿画面，上面只有一个贴着透明胶带的空白牛皮纸箱，背景是虚化的深灰色设备。', 'A single blank kraft carton sealed with clear tape on an otherwise empty roller conveyor that runs diagonally through a quiet, dim packing hall, with blurred grey machinery behind.'],
  'b03-inquiry-to-quote': ['深色旧桌面的俯拍：一张对折过的询盘纸、一个黄铜球阀样品、一叠印着空表格的报价单和一支黑色钢笔，从左到右排成一行。', 'Overhead view of a dark worn desk with a folded inquiry sheet, a brass ball valve sample, a stack of blank quote forms and a black pen laid out in a row from left to right.'],
  'b04-approval-handover': ['一只穿深色工作服的手把一把黄铜挂锁锁在车间深灰色电源隔离开关的手柄上，锁上挂着一枚空白的浅灰色吊牌，背景是虚化的厂房。', 'A hand in a dark work sleeve locks a brass padlock onto the handle of a dark grey isolator switch in a factory. A blank light grey tag hangs from the lock, and the workshop behind is out of focus.'],
  'b05-288-relay': ['电机装配线上，一名工人戴灰色针织手套的手把带铜线绕组的定子递向另一名工人张开的手，两侧是虚化的定子工位。', 'On a motor assembly line, a worker\'s grey-gloved hand passes a copper-wound stator to another worker\'s open hand, with blurred stator stations on either side.'],
  'b06-browser-os': ['傍晚无人的办公室，深色木桌中央放着一台打开的笔记本电脑，背面朝向镜头，屏幕冷光从两侧漏到桌面；落地窗外是灰蓝天空下的厂房屋顶和亮着一排琥珀色钠灯的集装箱堆场。', 'An empty office at dusk: an open laptop seen from behind on a dark wooden desk, its screen light spilling onto the desk at both sides, in front of floor-to-ceiling windows overlooking factory roofs and a container yard lit by a row of amber sodium lamps under a grey-blue sky.'],
  'b07-knowledge-library': ['一整面深色方格样品柜，每格放着一件五金或小家电样品和一个深色资料夹，只有正中一格被顶光照亮，里面是一只黄铜水龙头。', 'A dark wall of square cubbies, each holding a hardware or small-appliance sample beside a dark binder, with only the centre cubby lit from above to show a brass faucet.'],
  'i01-observe-process': ['夜班昏暗的车间里，一位穿深色夹克的工程师背对镜头站在通道中，手拿记录板，望向右侧一盏琥珀色吊灯下正在低头装配的女工。', 'In a dim factory hall on the night shift, an engineer in a dark jacket stands with his back to the camera holding a clipboard, watching a woman assemble parts under a single amber pendant lamp on the right.'],
  'i02-keep-or-revert': ['质检台上并排放着两只金属浅盘，左盘是五个光亮的黄铜接头，右盘是三个发暗的旧铜接头，一只戴灰色针织手套的手正把一个亮铜接头放进左盘。', 'Two shallow metal trays side by side on an inspection bench. The left tray holds five bright brass fittings and the right tray three tarnished ones, while a hand in a grey knit glove places another bright fitting into the left tray.'],
  'i03-hand-phone-blank': ['车间背景虚化，一只穿藏青色工作服袖口的手竖着拿着一部黑色手机，屏幕熄灭朝向镜头，左上方有一个暖色灯斑。', 'A hand in a navy work-shirt cuff holds a black phone upright, its dark screen facing the camera, against a blurred factory floor with one warm lamp glow at upper left.'],
  /* O01, the share card (tools/imagegen/prepare-share-card.mjs): not an <img>;
     tools/chrome.mjs writes it as og:image:alt and twitter:image:alt. */
  'o01-share-cover': ['蓝调时分平静的海面上，一艘满载集装箱的货船向左缓缓驶离，船尾驾驶楼亮着一排琥珀色灯光并在水面拖出倒影，右侧远处岸边有几台龙门吊剪影，左半边是大片空旷的深色天空和海面。', 'At blue hour, a fully loaded container ship moves slowly left across calm water, a row of amber lights on its stern bridge reflected in the sea, with small gantry crane silhouettes on the far right shore and a wide, empty dark sky and sea on the left.'],
};
/* What each photograph slot draws, so the browser fetches the width it needs.
   The pictures are 16:9 and fill their box with object-fit: cover, so a box
   taller than 16:9 needs a file wider than the box: the sizes below are the
   width of the cover-cropped picture, not of the box.
   - The homepage grid tiles (theatre): the grid zooms out as the reader
     scrolls, and an outer tile is on screen from ~130vw wide at 1440 (up to
     ~2300 px while it is still off screen) down to ~55vw. Measured halfway
     through, the cover crop is ~105vw wide at 992 and up, ~160vw at 768 and
     ~250vw on a 390 phone, whose tiles are much taller than they are wide.
   - The capability ring's card: 22rem x 20rem (12.5 x 11.9rem below 768),
     i.e. a ~560px (~330px) cover crop.
   - The side-menu card: at most 220px wide (.contact-info). */
function photoSizes(tag, before) {
  if (/video-bg-animation/.test(before)) return '(max-width: 767px) 250vw, (max-width: 991px) 160vw, 105vw';
  if (/\bcn-video\b/.test(before)) return '(max-width: 767px) 330px, 560px';
  if (/stargo-menu-photo/.test(tag)) return '220px';
  const blog = blogPhotoSizes(tag);
  if (blog) return blog;
  throw new Error(`Photograph in a slot with no declared size: ${tag.slice(0, 120)}`);
}
/* The blog's and the intelligence page's photographs (group "blog",
   2026-10-21; tools/replaceables.mjs BLOG_COVERS and INTEL_PHOTOS), measured
   on the built page from 320 to 1920 wide. As above, each value is the width
   of the cover-cropped picture, not of the box.
   - The article hero (`lx-blog-image lx-details`) is a 3:2 box, the covers'
     own ratio: 358px at 390, 704 at 768, 928 at 992 and 1180 from 1280 up.
     Its sizes are the ones the old cover had.
   - The cards of the blog index and of every article's 「更多文章」 list
     (`lx-blog-image`) are 1:1, so a 3:2 cover is drawn 1.5 times as wide as
     its box: one column below 768 (box 100vw - 32px), two to 991 (336-448px,
     ~44vw), three from 992 (277-395px, ~28vw), 395px from 1440 up.
   - I01 (`lx-gradient-section-image`) fills the viewport (a sticky 100vw x
     100vh box): a 3:2 picture covers it at 150vh wide when the viewport is
     narrower than 3:2, and at 100vw otherwise.
   - I02 (`lx-cta-image`), a square picture: the closing card's picture box is
     1:1 on phones (100vw - 32px), 296x595 at 768 and 389x429 at 991, and
     about 512x387 from 1280 up.
   - I03 (`img.lx-no-writing-image`), a 2:3 portrait: the phone box is 358x418
     at 390 and 68vw wide at 480-767 (it keeps the template picture's
     1262:1474 there), 819px tall (a 546px picture) at 768-1279, 531x720 at
     1440 and 531x864 at 1920 (576px). */
function blogPhotoSizes(tag) {
  if (/\blx-blog-image lx-details\b/.test(tag)) return '(max-width: 991px) 100vw, 1180px';
  if (/\blx-blog-image\b/.test(tag)) return '(max-width: 767px) calc(150vw - 48px), (max-width: 991px) 68vw, (max-width: 1439px) 44vw, 593px';
  if (/\blx-gradient-section-image\b/.test(tag)) return '(max-aspect-ratio: 3/2) 150vh, 100vw';
  if (/\blx-cta-image\b/.test(tag)) return '(max-width: 767px) calc(100vw - 32px), (max-width: 991px) 600px, 512px';
  if (/\blx-no-writing-image\b/.test(tag)) return '(max-width: 479px) calc(100vw - 32px), (max-width: 767px) 68vw, 580px';
  return null;
}
/** A photograph's alt text in the page's language, by registry id (or OG.id,
 *  the share card's), for the places that are not an <img>. */
export function photoAlt(id, lang) {
  const text = photoText[id]?.[lang === 'zh' ? 0 : 1];
  if (!text) throw new Error(`Photograph without alt text: ${id}`);
  return text;
}
export function editorialImages(html, lang) {
  // Also covers inline backgrounds and absolute Open Graph URLs.
  let out = html.replaceAll('assets/stargo/', 'assets/stargo-editorial/');
  out = out.replace(/<img\b[^>]*>/g, (tag, offset, page) => {
    const photoSrc = tag.match(/\bsrc="(assets\/stargo-photo\/[^"]+\.webp)"/)?.[1];
    if (photoSrc) {
      const photo = photoBySrc.get(photoSrc);
      if (!photo) throw new Error(`Unregistered photograph: ${photoSrc}`);
      const text = photoText[photo.id]?.[lang === 'zh' ? 0 : 1];
      if (!text) throw new Error(`Photograph without alt text: ${photo.id}`);
      const alt = /\balt=""/.test(tag) ? '' : text;
      const sizes = photoSizes(tag, page.slice(Math.max(0, offset - 160), offset));
      const variants = [...photo.variants, photo];
      const result = tag.replace(/\s(?:alt|srcset|sizes|width|height|decoding)="[^"]*"/g, '');
      const attrs = [`alt="${alt}"`, `width="${photo.width}"`, `height="${photo.height}"`, 'decoding="async"', `srcset="${variants.map(v => `${v.src} ${v.width}w`).join(', ')}"`, `sizes="${sizes}"`];
      return result.replace(/\s*\/?>(\s*)$/, ` ${attrs.join(' ')}/>$1`);
    }
    const id = tag.match(/\bsrc="assets\/(?:stargo-editorial|stargo-product)\/([^"/]+)\.(?:webp|png)"/)?.[1];
    if (!id) return tag;
    const asset = byId.get(id);
    if (!asset) throw new Error(`Unregistered editorial image: ${id}`);
    const product = productText[id];
    const decorative = /\balt=""/.test(tag) || id.startsWith('avatar-');
    const text = (product ?? descriptions[id])?.[lang === 'zh' ? 0 : 1];
    const suffix = product
      ? (lang === 'zh' ? `。${PRODUCT_CAPTION.zh}` : ` — ${PRODUCT_CAPTION.en}`)
      : (lang === 'zh' ? '（AI 概念图）' : ' (AI concept illustration)');
    const alt = decorative || !text ? '' : `${text}${suffix}`;
    let result = tag.replace(/\s(?:alt|srcset|sizes|width|height|decoding)="[^"]*"/g, '');
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
      /* Boxes that stay small at every width: the homepage stage card (340px
         at most), the enterprise column's pictures and the capability rows.
         `for-service` is on the wrapper around the picture, not on the picture,
         so the test reads the markup immediately before the tag as well. */
      const card = /for-service|work-image-cover|qx-all-image-cover/.test(page.slice(Math.max(0, offset - 160), offset) + result);
      /* The capability rows' thumbnail: a fixed box, 12rem x 10rem from 992 and
         16rem x 12rem from 1440 (cinery.cn2.css), and not drawn below 992. */
      const thumb = /cn-service-thumbnail/.test(result);
      /* The capability hero's six 3D cards (tools/blocks/rk-hero.mjs): each
         <img> is a 16:9 box of 128px (phone), 240px (768), 320px (992–1919)
         and 480px (1920 up), drawn up to ~1.4x larger by the card's
         perspective. renok's own sizes said 100vw, which fetched the widest file
         for every card. */
      const before = page.slice(Math.max(0, offset - 160), offset);
      const rkCard = /rk-rt-portfolio-v2-image-wrapper/.test(before);
      /* renok's insight rows (tools/blocks/rk-insight.mjs): a thumbnail of
         200px (992–1439) and 300px (1440 up), not drawn below 992. */
      const rkThumb = /rk-rt-insights-item-image/.test(before);
      /* The product screens in the intelligence page's phone mockups: at most
         325px wide. The editorial screens beside them keep the general rule. */
      const phone = /lx-integrations-image/.test(result) && /stargo-product/.test(result);
      /* Gallery tiles are ~18–20rem after the curated-asset pass; the core-system
         dashboard plate may grow to 1040px on desktop (css/stargo-fusion.css). */
      attrs.push(`sizes="${rkCard ? '(max-width: 767px) 180px, (max-width: 991px) 340px, (max-width: 1919px) 440px, 660px' : rkThumb ? '(max-width: 1439px) 200px, 300px' : phone ? '(max-width: 767px) 280px, 330px' : tile ? '(max-width: 1439px) 288px, 320px' : dashboard ? '(max-width: 991px) 92vw, (max-width: 1439px) 70vw, 1040px' : thumb ? '(max-width: 1439px) 186px, 250px' : card ? '(max-width: 767px) 45vw, 360px' : small ? '(max-width: 767px) 50vw, 400px' : '(max-width: 767px) 100vw, (max-width: 991px) 75vw, 60vw'}"`);
    }
    return result.replace(/\s*\/?>(\s*)$/, ` ${attrs.join(' ')}/>$1`);
  });
  return out;
}
