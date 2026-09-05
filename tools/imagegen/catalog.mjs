/** Art direction for 43 images generated with the built-in tool after explicit
 * user authorization. Exact submitted prompts: generated-sources.json.
 * The built-in tool does not expose its model ID; cliModel below is ONLY
 * the optional API/CLI configuration, not a claim about generated provenance.
 * Compile for the bundled imagegen CLI:
 *   node tools/imagegen/catalog.mjs --write
 *   node tools/imagegen/catalog.mjs --write --sample
 * Then use imagegen's scripts/image_gen.py generate-batch with the JSONL file.
 * Review outputs before integrating; this script never overwrites site images.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const direction = `Create one premium editorial image for STARGO WORK, an enterprise AI operating system for global trade. The existing website has oversized editorial typography, black and warm white surfaces, restrained copper accents, rounded image masks and cinematic scroll reveals. Complement that established design; do not introduce another design system. Render the specified business idea with a single purposeful composition, believable physical materials, refined industrial photography or precise sculptural CGI as specified. Palette: graphite, brushed titanium, porcelain white, very restrained copper signal accents. Controlled reflections, realistic contact shadows, clear silhouette, confident negative space. Text is typeset separately in HTML: include no words, numbers, labels, interface text, logos or watermarks. No generic robot, AI brain, cyberpunk neon, holographic dashboard, fake software screenshot, stock-business handshake, invented customer evidence, or excessive lens flare. One standalone finished image, never a contact sheet or collage of multiple outputs.`;

const rows = [
  ['os-cockpit', '首页 / 指挥与全局视图', 'A precision-engineered circular command instrument, viewed from a restrained three-quarter overhead angle. Several physical tracks and small industrial components converge at one clear copper-lit centre. Show operational coordination, not a globe or an interface. Dark stone surface, grazing studio light, strong focal hierarchy.', 'landscape'],
  ['os-sales-desk', '首页 / Growth OS / 发现买家', 'Photorealistic aerial view of a working container terminal at blue hour, organized lanes and a distant manufacturing district. A single restrained copper light path traces one opportunity from quay to warehouse. Actual industrial textures and human scale, no logos or legible markings, documentary realism with editorial composition.', 'landscape'],
  ['os-inquiries', '首页 / Customer 360 / 理解询盘', 'Sculptural editorial still life: several translucent curved glass layers surround one brushed-metal customer-context core. Each layer carries a different nonverbal physical texture, representing conversation, product interest and history. They align cleanly into one readable whole. Charcoal backdrop with soft warm side light.', 'landscape'],
  ['os-agent-center', 'Workforce / 编排与并行协作', 'A team of eight distinct miniature precision-machined instruments arranged in three parallel work lanes around one modest central coordinator. Each tool has a specialized functional silhouette, not a robot face. Thin copper rails connect the lanes. Dark industrial tabletop, museum-grade macro CGI, calm organized composition.', 'landscape'],
  ['os-quote-studio', '首页 / Quote Studio / 商业报价', 'High-end macro product photography of an exploded precision mechanical assembly on a pale stone table: three compatible components align with a calibrated metal measuring fixture and one copper decision marker. Express exact matching, cost discipline and commercial precision through real material and fit. No currency, paperwork text or software UI.', 'landscape'],
  ['os-trade-execution', '首页 / Trade Execution / 订单到交付', 'Cinematic realistic photograph of a clean manufacturing dispatch bay opening toward a cargo loading area. Finished unbranded industrial products in careful packaging progress through inspection and shipping. One warm copper-toned light line follows the route. Physically plausible logistics, atmospheric depth, no heroic robot or fictional customers.', 'landscape'],
  ['os-desktop', '跨设备 / 企业工作空间', 'An architectural still life of four precise dark-metal work surfaces connected by one continuous brushed silver track, each surface holding a different industrial object. Unified enterprise workspace made tangible. Three-quarter overhead camera, warm white ground, subtle copper at connection points, premium editorial minimalism.', 'landscape'],
  ['os-login', 'Enterprise / 权限与安全边界', 'A refined architectural section of two concentric graphite enclosures with one deliberately controlled copper-lit passage. Several small silver carriers approach, but only one passes the gate. Show authorization and boundaries through physical space, not a padlock or shield icon. Beautiful restrained studio lighting.', 'landscape'],
  ['os-boot', '首页视频网格 / AI 开始工作', 'Extreme close-up of a precisely fitted titanium aperture beginning to open around a narrow warm light. Brushed metal, visible machining grain, deep black negative space, no glowing orb. The image should suggest a capable system becoming operational, with one unambiguous focal point.', 'landscape'],
  ['os-loading', '首页视频网格 / 上下文就绪', 'Sequential translucent glass lamellae slot into a single silver framework, the final copper-edged layer nearly in place. Ordered assembly of enterprise context. Low angled side view with tactile edges and crisp contact shadows on a dark matte surface; no UI loading indicators.', 'landscape'],
  ['brand-glow-wide', '品牌 / 共享菜单与空间连接', 'A single sophisticated interlocking titanium orbital sculpture suspended just above a warm-white surface. Faint copper reflections only at intersections. Match the clean metallic orbital film supplied in the fourth website template. Broad horizontal breathing room, no purple neon, no typography.', 'landscape'],
  ['brand-glow-square', '品牌 / 主动运行', 'One asymmetrical kinetic titanium sculpture with three interlocking curved blades and a restrained copper inner seam. Large elegant silhouette, black gallery backdrop, soft rim light and tactile metal. It must look like a purposeful object, not a generic glowing AI sphere.', 'square'],
  ['brand-glow-tall', 'Intelligence / 长期执行', 'A slender continuous silver track rises through several vertically separated graphite terraces, carrying one copper signal upward without interruption. Clear beginning, continuity and destination. Tall architectural composition, dark gallery lighting, elegant negative space, physically credible structure.', 'portrait'],
  ['brand-ontology', 'Intelligence / Ontology', 'Six clearly distinct tangible business objects on a dark architectural plane: a precision component, an unmarked account dossier, a glass conversation capsule, a blank folded commercial sheet, a small packing crate and a task token. Thin solid copper joints connect their relationships into one coherent network. Sophisticated physical still life, no diagrams with labels.', 'landscape'],
  ['brand-loop', 'Intelligence / Governed Evolution', 'A sculptural silver feedback track with three distinct stations: observation prism, evaluation aperture and a reversible gate. One copper marker passes through the stations and returns to an improved lane; an alternate return path remains visibly available. Ordered gallery CGI, not an infinite-neon-loop cliché.', 'landscape'],
  ['brand-family-01', 'Capabilities / 增长与客户', 'Cinematic industrial landscape at dawn: a precise network of shipping channels meets a compact cluster of warehouses. One restrained copper signal links an opportunity at the edge to a central customer destination. Realistic manufacturing-trade context, clean silhouette and purposeful geography.', 'landscape'],
  ['brand-family-02', 'Capabilities / 商业与履约', 'A high-end editorial still life tracing one manufactured component from an exact-fit assembly to protected packaging and a clean dispatch platform. Three objects in a clear directional composition, brushed metal and kraft material, warm-white background, subtle copper joining seam.', 'landscape'],
  ['brand-family-03', 'Capabilities / 员工与执行', 'Five distinct precision-made tools working along parallel physical rails that meet at a common output platform. One tool assesses, one aligns, one packages, one carries, one checks. Sculptural miniature, graphite and titanium, clear teamwork rather than humanoid robot imagery.', 'landscape'],
  ['brand-family-04', 'Capabilities / 上下文、治理与进化', 'A cutaway of a sophisticated layered architectural core. Glass context layer, controlled metal access layer and an outer reversible evaluation track are visibly distinct and connected. One small copper decision gate. Ordered depth, black background, strong legibility at card size.', 'landscape'],
  ['mobile-approvals', '移动端 / 人工审批', 'Tall close-up of a precise silver gate holding one small copper marker at a decision point, with a clear protected path beyond it. Human authority expressed as a deliberate pause, no hand or phone UI. Dark matte backdrop, confident centered silhouette and top/bottom breathing room.', 'narrow'],
  ['mobile-agents', '移动端 / 并行任务', 'Three compact titanium instruments travel on distinct vertical rails and coordinate at one copper junction. Clear parallel activity, tall uncluttered composition, black background, realistic machining texture. Not a phone screenshot; no text.', 'narrow'],
  ['mobile-inquiry', '移动端 / 客户沟通', 'Two elegantly curved translucent glass shells relay a small copper pulse into a third stable silver context holder. A physical metaphor for conversation retained as knowledge. Vertical editorial composition, black background, clean edges and restrained reflections.', 'narrow'],
  ['mobile-core', '移动端 / 企业上下文', 'A vertical stack of five aligned frosted-glass plates, each containing a different small geometric metal object, connected through a single copper spine. Enterprise context remains shared from layer to layer. Tall dark studio composition with a clear silhouette.', 'narrow'],
  ['phone-approvals', 'Enterprise / 随时审批', 'A beautifully engineered standing titanium decision gate on a small graphite plinth, with one controlled copper-lit crossing and a reversible path. Portrait product-photography composition, subtle ground shadow, black background. Do not draw a mobile device or fake app UI.', 'portrait'],
  ['phone-agents', 'Workforce / 随时调度', 'A standing sculptural group of three specialized titanium instruments on a single shared graphite base, linked by one elegant copper rail. Coordinated work visible from a three-quarter angle, portrait editorial product shot, no robot faces or fake phone UI.', 'portrait'],
  ['silo-email', '首页 / 分散的邮件上下文', 'A quiet editorial still life of three separate open metal letter trays with blank paper fragments, each disconnected from the others. Paper fibres, brushed grey metal, off-white table, long soft shadows. Represent fragmented email knowledge without any written text, interface or chaos.', 'landscape'],
  ['silo-whatsapp', '首页 / 分散的客户对话', 'Three separate translucent glass conversation capsules on different small platforms, each holding an isolated copper fleck with no connecting path. Refined graphite tabletop, calm photographic lighting, visible separation. No speech-bubble icon, branded messenger logo, or text.', 'landscape'],
  ['silo-excel', '首页 / 分散的表格记录', 'Several meticulous unmarked gridded sheets overlap out of alignment on a dark industrial desk, with one precision component resting between them. Tactile paper and exact rectangular geometry, no numbers or fake spreadsheet UI. Communicate reconciliation work, not messy-office comedy.', 'landscape'],
  ['silo-erp', '首页 / 分散的订单状态', 'Four closed graphite archive blocks sit on independent tracks that stop before meeting, each with one unmarked brass status tab. High-end miniature architecture photography, clear disconnected structure, pale studio background, no logo, paperwork text or padlocks.', 'landscape'],
  ['og-cover', '社交分享 / 品牌封面', 'A refined titanium orbital sculpture on the right third of a nearly black landscape frame, restrained copper intersections and physically convincing brushed surfaces. Leave the left half exceptionally quiet for HTML-independent brand typesetting by the site. Elegant editorial brand artwork, no text or logos.', 'og'],
];

const symbols = [
  ['lens', 'market research', 'a small faceted optical lens with a copper focal point'],
  ['prism', 'importer intelligence', 'an asymmetrical triangular titanium prism with one frosted window'],
  ['fork', 'dealer discovery', 'a precise branching three-way silver instrument'],
  ['cluster', 'buying committee', 'three interlocking distinct rounded metal blocks'],
  ['fit', 'product matching', 'two complementary machined parts fitting together'],
  ['caliper', 'quote preparation', 'a compact geometric precision measuring instrument'],
  ['gate', 'approval', 'a small controlled arch with one copper passage'],
  ['crate', 'trade execution', 'an elegant nested metal packing volume'],
  ['relay', 'follow-up', 'two parallel silver arcs linked by a small copper marker'],
  ['spine', 'knowledge', 'four frosted plates aligned around a titanium spine'],
  ['reversible', 'evaluation', 'a compact double-path loop with a distinct return gate'],
  ['conductor', 'orchestration', 'a central silver hub with four restrained radial connectors'],
  ['core', 'shared enterprise context', 'three interlocking titanium rings with one copper joining seam'],
];
for (let i = 0; i < symbols.length; i++) {
  const [, role, shape] = symbols[i];
  rows.push([i === 12 ? 'avatar-core' : `avatar-${String(i + 1).padStart(2, '0')}`, `数字角色标识 / ${role}`,
    `One standalone sculptural emblem representing ${role}: ${shape}. Premium macro CGI, brushed titanium and one tiny copper accent, solid near-black background. Large centered object with 18 percent safe margins on every side; silhouette must remain distinct when displayed as a tiny circular avatar. No person, face, eyes, robot, text or badge border.`, 'square']);
}
const sizes = { landscape: '2048x1280', square: '1024x1024', portrait: '1280x1600', narrow: '1024x2048', og: '2048x1088' };
export const catalog = rows.map(([id, placement, scene, format]) => ({
  id, placement, replaces: `assets/stargo/${id}.${id.startsWith('avatar-') || id === 'og-cover' ? 'png' : 'webp'}`,
  cliModel: 'gpt-image-2', size: sizes[format], quality: 'high',
  prompt: `${direction}\n\nUse: ${placement}.\nScene: ${scene}\nComposition: ${format}; keep the main subject crop-safe with at least 12 percent outer breathing room.`,
}));
if (catalog.length !== 43 || new Set(catalog.map(x => x.id)).size !== 43) throw new Error('Expected 43 unique image jobs');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sample = process.argv.includes('--sample');
  const chosen = sample ? catalog.filter(x => ['os-sales-desk', 'brand-ontology', 'avatar-01'].includes(x.id)) : catalog;
  if (process.argv.includes('--write')) {
    const dir = fileURLToPath(new URL('../../tmp/imagegen/', import.meta.url));
    mkdirSync(dir, { recursive: true });
    const path = resolve(dir, sample ? 'sample.jsonl' : 'all.jsonl');
    // Generated job artifact, consumed by the bundled CLI. This is not an SDK runner.
    writeFileSync(path, chosen.map(({ id, prompt, cliModel, size, quality }) => JSON.stringify({ prompt, model: cliModel, size, quality, out: `${id}.png` })).join('\n') + '\n');
    console.log(`${chosen.length} jobs prepared (not generated): ${path}`);
  } else console.log(JSON.stringify({ status: 'generated-with-authorized-built-in-tool', provenance: 'tools/imagegen/generated-sources.json', jobs: chosen.length, assets: chosen.map(({ id, placement, size }) => ({ id, placement, size })) }, null, 2));
}
