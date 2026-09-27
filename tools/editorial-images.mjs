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
  'os-quote-studio': ['精密零件的匹配与校验', 'Precision components aligned and checked for fit'],
  'os-trade-execution': ['制造交付区从检验到装运的连续流程', 'A continuous path from inspection to dispatch'],
  'os-desktop': ['系统地图：连接不同业务工作空间的共享桌面', 'System map: one shared desktop connecting business workspaces'],
  'os-login': ['准入核验：受控通道只为确认过的身份开放', 'Admission checks: the controlled passage opens only for verified identities'],
  'os-boot': ['AI 创作工作室：图片与视频任务从同一创作台发起', 'AI creative studio: image and video work starts from one creative desk'],
  'os-loading': ['企业上下文逐层就位', 'Enterprise context assembling layer by layer'],
  'brand-glow-wide': ['相互连接的银色轨道雕塑', 'An interconnected silver orbital sculpture'],
  'brand-glow-square': ['三片相互协作的钛银曲面', 'Three coordinated titanium surfaces'],
  'brand-glow-tall': ['穿过多层空间的连续执行轨道', 'An uninterrupted execution track through successive levels'],
  'brand-ontology': ['客户、沟通、产品、报价、订单与任务的关系', 'Relationships among accounts, conversation, products, quotes, orders and tasks'],
  'brand-loop': ['观察、评估与可回退的反馈路径', 'An observation, evaluation and reversible feedback path'],
  'brand-family-01': ['从贸易市场信号到客户目的地', 'From trade signals to a customer destination'],
  'brand-family-02': ['企业资源计划：生产、库存与履约状态同屏可见', 'ERP: production, inventory and fulfillment status on one screen'],
  'brand-family-03': ['专业分工与并行执行', 'Specialized roles and parallel execution'],
  'brand-family-04': ['共享上下文、权限边界与可控进化', 'Shared context, permission boundaries and governed evolution'],
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
  'gos01-market-thesis': ['增长分析：从使用数据观察产品与业务的变化；演示环境里分析服务未在当前主机启动', 'Growth analytics: product and business movement read from usage data; in this demonstration the analytics runtime is not started on the current host'],
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
};
export const PRODUCT_CAPTION = { zh: '产品界面示意（演示数据）', en: 'Illustrative product interface · demo data' };
export function editorialImages(html, lang) {
  // Also covers inline backgrounds and absolute Open Graph URLs.
  let out = html.replaceAll('assets/stargo/', 'assets/stargo-editorial/');
  out = out.replace(/<img\b[^>]*>/g, (tag, offset, page) => {
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
      /* Gallery tiles are ~18–20rem after the curated-asset pass; the core-system
         dashboard plate may grow to 1040px on desktop (css/stargo-fusion.css). */
      attrs.push(`sizes="${tile ? '(max-width: 1439px) 288px, 320px' : dashboard ? '(max-width: 991px) 92vw, (max-width: 1439px) 70vw, 1040px' : thumb ? '(max-width: 1439px) 186px, 250px' : card ? '(max-width: 767px) 45vw, 360px' : small ? '(max-width: 767px) 50vw, 400px' : '(max-width: 767px) 100vw, (max-width: 991px) 75vw, 60vw'}"`);
    }
    return result.replace(/\s*\/?>(\s*)$/, ` ${attrs.join(' ')}/>$1`);
  });
  return out;
}
