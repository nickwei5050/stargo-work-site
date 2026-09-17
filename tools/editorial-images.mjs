/** Final image pass: keep every template element/class/animation target intact. */
import { readFileSync } from 'node:fs';
const { assets } = JSON.parse(readFileSync(new URL('./imagegen/assets-manifest.json', import.meta.url), 'utf8'));
if (assets.length !== 43) throw new Error('All 43 editorial images must exist before building');
const byId = new Map(assets.map(a => [a.id, a]));
const descriptions = {
  'os-cockpit': ['多个工作轨道汇聚到一个指挥中心', 'Work lanes converge at a shared command centre'],
  'os-sales-desk': ['港口与制造园区间的一条市场机会路径', 'An opportunity path through a port and manufacturing district'],
  'os-inquiries': ['客户对话、兴趣与历史汇集成共享上下文', 'Conversation, interest and history form shared customer context'],
  'os-agent-center': ['专业工具沿并行轨道协作', 'Specialized instruments collaborate along parallel work lanes'],
  'os-quote-studio': ['精密零件的匹配与校验', 'Precision components aligned and checked for fit'],
  'os-trade-execution': ['制造交付区从检验到装运的连续流程', 'A continuous path from inspection to dispatch'],
  'os-desktop': ['连接不同业务工作空间的一条共享轨道', 'One shared track connects business workspaces'],
  'os-login': ['受控通道与清晰的权限边界', 'A controlled passage through explicit permission boundaries'],
  'os-boot': ['精密金属光圈开启', 'A precision metal aperture opening'],
  'os-loading': ['企业上下文逐层就位', 'Enterprise context assembling layer by layer'],
  'brand-glow-wide': ['相互连接的银色轨道雕塑', 'An interconnected silver orbital sculpture'],
  'brand-glow-square': ['三片相互协作的钛银曲面', 'Three coordinated titanium surfaces'],
  'brand-glow-tall': ['穿过多层空间的连续执行轨道', 'An uninterrupted execution track through successive levels'],
  'brand-ontology': ['客户、沟通、产品、报价、订单与任务的关系', 'Relationships among accounts, conversation, products, quotes, orders and tasks'],
  'brand-loop': ['观察、评估与可回退的反馈路径', 'An observation, evaluation and reversible feedback path'],
  'brand-family-01': ['从贸易市场信号到客户目的地', 'From trade signals to a customer destination'],
  'brand-family-02': ['零件匹配、包装与履约交接', 'Component matching, packaging and fulfillment handoff'],
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
export function editorialImages(html, lang) {
  // Also covers inline backgrounds and absolute Open Graph URLs.
  let out = html.replaceAll('assets/stargo/', 'assets/stargo-editorial/');
  out = out.replace(/<img\b[^>]*>/g, tag => {
    const id = tag.match(/\bsrc="assets\/stargo-editorial\/([^"/]+)\.(?:webp|png)"/)?.[1];
    if (!id) return tag;
    const asset = byId.get(id);
    if (!asset) throw new Error(`Unregistered editorial image: ${id}`);
    const decorative = /\balt=""/.test(tag) || id.startsWith('avatar-');
    const text = descriptions[id]?.[lang === 'zh' ? 0 : 1];
    const alt = decorative || !text ? '' : `${text}${lang === 'zh' ? '（AI 概念图）' : ' (AI concept illustration)'}`;
    let result = tag.replace(/\s(?:alt|srcset|sizes|width|height|decoding)="[^"]*"/g, '');
    const attrs = [`alt="${alt}"`, `width="${asset.width}"`, `height="${asset.height}"`, 'decoding="async"'];
    if (asset.variants.length) {
      const variants = [...asset.variants, asset];
      attrs.push(`srcset="${variants.map(v => `${v.src} ${v.width}w`).join(', ')}"`);
      // Do not use sizes=auto: CSS auto-width images in the supplied templates
      // acquire a 300px containment intrinsic size, collapsing wide card art.
      const small = /photo-image|image-rotator|image-text-rotator|author/.test(result);
      attrs.push(`sizes="${small ? '(max-width: 767px) 50vw, 400px' : '(max-width: 767px) 100vw, (max-width: 991px) 75vw, 60vw'}"`);
    }
    return result.replace(/\s*\/?>(\s*)$/, ` ${attrs.join(' ')}/>$1`);
  });
  return out;
}
