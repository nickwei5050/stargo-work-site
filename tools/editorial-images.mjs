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
   site-images/batch-3 of 2026-10-21). They are photographs of places, not
   product screens and not concept art, so their alt is the owner's own
   sentence from the batch manifest with no caption after it: neither
   PRODUCT_CAPTION nor （AI 概念图）. G01 is a CSS background
   (css/stargo-fusion.css) and so has no alt to carry. */
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
  throw new Error(`Photograph in a slot with no declared size: ${tag.slice(0, 120)}`);
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
