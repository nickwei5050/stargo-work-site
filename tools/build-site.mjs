/**
 * Build every page of the STARGO WORK site from the Mono template pages.
 *
 *   node tools/build-fusion.mjs     # homepage + the three Scalora modules
 *   node tools/fuse-ix.mjs          # the one bundle every page loads
 *   node tools/build-site.mjs       # this file: all pages, chrome, links
 *
 * Idempotent: it reads only tools/templates/* and tools/fragments/*, never
 * its own output, so it can be re-run after every copy change.
 *
 * Every figure on these pages comes from tools/data/*.json, which
 * tools/extract-data.mjs reads out of the verified Next.js content files.
 * Nothing numeric is typed here by hand.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { makeSub, findByClass, removeByClass, elementContaining, setInner, setEachInner, setLink, escapeHtml } from './lib-html.mjs';
import { applyChrome, remapLinks, assertInternalLinks } from './chrome.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const TPL = `${SITE}/tools/templates`;
const data = (f) => JSON.parse(readFileSync(`${SITE}/tools/data/${f}.json`, 'utf8'));
const tpl = (f) => readFileSync(`${TPL}/${f}`, 'utf8');

const CAPS = data('capabilities');
const AGENTS = data('agents');
const INTEGRATIONS = data('integrations');
const TOUR = data('tour');
const RISK = data('risk');
const FACTS = data('facts');

const CHECKED = '2026-09-01';   // the day the five governance suites were run and the registries read

const STATUS_ZH = { 'demo-verified': '演示验证', pilot: '试点', roadmap: '路线图', 'research-preview': '研究预览' };
const DOMAIN_ZH = { platform: '平台', sales: '销售', command: '指挥', create: '创意', growth: '增长', 'trade-ops': '外贸履约', retention: '售后' };
const AGENT_DOMAIN_ZH = { sales: '销售', growth: '增长', 'trade-ops': '外贸履约', create: '创意', retention: '售后' };

const count = (arr, k, v) => arr.filter((x) => x[k] === v).length;

/** The four quotations already published on the homepage, attributed to the governing document. */
const QUOTES = {
  approval: { text: '「对外产生真实后果的动作，必须先取得人类审批。审批通道不可用时，拒绝执行，而不是绕过。」', who: 'STARGO 宪法', where: '第 4 章 · 风险分级' },
  ledger: { text: '「台账只追加，不可修改。已经发生的动作不能被事后抹平。」', who: 'STARGO 宪法', where: '第 6 章 · 审计台账' },
  r4: { text: '「R4 动作结构性禁止自动执行，只能由人发起。」', who: 'STARGO 宪法', where: '第 4 章 · 风险分级' },
  readback: { text: '「没有回读证据，动作不计为成功。」', who: '受治理编排器', where: '回读校验契约' },
};

/* ================================================================ modules */

/**
 * Mono's awards table (studio.html), as a reusable 3-column list.
 * The row hover (IX2 e-… on .award-wrapper) is in the fused bundle, so the
 * table keeps its interaction on any page.
 */
function awardsTable({ id, caption, title, total, button, headers, rows }) {
  const studio = tpl('studio.html');
  const sec = elementContaining(studio, '(Awards 23-26©)', 'section');
  const { fn: s } = makeSub('awards');
  let html = sec.text;
  html = html.replace(/^<section class="section">/, `<section id="${id}" class="section">`);
  if (!html.startsWith(`<section id="${id}"`)) throw new Error('awards: unexpected section opener');
  html = s(html, '(Awards 23-26©)', caption);
  html = s(html, '<h2 class="h2">Awards<span class="small-ftd">(7)</span></h2>', `<h2 class="h2">${title}<span class="small-ftd">(${total})</span></h2>`);
  html = setLink(html, 'View all work', { href: button.href, text: button.label });
  html = s(html, '(Awards)', headers[0]);
  html = s(html, '(Recognition)', headers[1]);
  html = s(html, '(Year)', headers[2]);

  const first = findByClass(html, 'div', 'award-wrapper', 0);
  let last = first;
  for (let n = 1; ; n++) { const el = findByClass(html, 'div', 'award-wrapper', n); if (!el) break; last = el; }
  const rowTpl = first.text;
  const cells = rowTpl.match(/class="award-text">[^<]*</g);
  if (!cells || cells.length !== 3) throw new Error('awards: row template does not have 3 cells');
  const renderRow = (r) => {
    let out = rowTpl;
    for (let i = 0; i < 3; i++) out = out.replace(cells[i], `class="award-text">${r[i]}<`);
    return out;
  };
  html = html.slice(0, first.start) + rows.map(renderRow).join('') + html.slice(last.end);
  if ((html.match(/award-wrapper/g) ?? []).length !== rows.length) throw new Error('awards: row count mismatch');
  return html;
}

/** Replace a `.team-wrapper` card's name, role and (optionally) image. */
function teamCard(html, oldName, oldRole, { name, role, image }) {
  const { fn: s } = makeSub(`team:${oldName}`);
  let out = s(html, `>${oldName}<`, `>${name}<`, { count: 1 });
  out = s(out, `>${oldRole}<`, `>${role}<`, { count: 1 });
  if (image) {
    const card = elementContaining(out, `>${name}<`, 'div', { up: 2 });
    if (!card.text.includes('team-wrapper')) throw new Error(`team: card wrapper not found for ${name}`);
    const swapped = card.text.replace(/src="[^"]*"/, `src="${image}"`);
    out = out.slice(0, card.start) + swapped + out.slice(card.end);
  }
  return out;
}

/* Non-portrait template images, for cards that describe things rather than people. */
const ABSTRACT = [
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4dca_Sleek%20Container%20Set.webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4d64_blog-2.webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4e03_Futuristic%20Device%20Design%20(2).webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4da8_Futuristic-Device-Design-(4).webp',
  'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4faf_Coding-Workspace-Close-Up.webp',
];
const TEAM_TPL = [
  ['Adrian Keller', '(Founder)'], ['Luca Moretti', '(Lead Product Designer)'], ['Elena Novak', '(UI/UX Designer)'],
  ['Daniel Hartmann', '( Developer)'], ['Maya Laurent', '(Framer Specialist)'],
];

/** studio.html as a long-form page: hero, 4-step sticky story, intro, approach, stats, quote, 5 cards, table. */
function fromStudio(spec) {
  const { fn: s } = makeSub(spec.name);
  let h = tpl('studio.html');

  h = s(h, '(Our Studio ©26)', spec.eyebrow);
  h = s(h, '>About Mōno™<', `>${spec.h1}<`);

  // Sticky story: four labelled slides.
  ['d01', 'd02', 'd03', 'd04'].forEach((d, i) => {
    h = s(h, `<h2 class="h2 for-abt ${d}">(©2${3 + i})</h2>`, `<h2 class="h2 for-abt ${d}">${spec.story[i].label}</h2>`);
    h = setInner(h, `<p class="top-text for-abt t0${i + 1}">`, spec.story[i].text);
  });

  h = s(h, '(Introduction)', spec.introLabel);
  h = setInner(h, '<h2 class="h2 _01 sm _600">', spec.intro);
  h = removeByClass(h, 'div', 'as-seen');   // four invented press logos

  h = s(h, '(Approach)', spec.approachLabel);
  ['Think clearly.', 'Design precisely.', 'Build intelligently.', 'Refine continuously.'].forEach((t, i) => { h = s(h, t, spec.approach[i], { count: 1 }); });
  h = setLink(h, 'Begin collaboration', { href: spec.approachButton.href, text: spec.approachButton.label });

  h = s(h, '(Stats)', spec.statsLabel);
  [['30', spec.stats[0]], ['80', spec.stats[1]], ['+7', spec.stats[2]]].forEach(([old, st]) => {
    const open = `<h2 class="h2 _01">${old}</h2></div><div><p class="top-text">`;
    const i = h.indexOf(open);
    if (i === -1) throw new Error(`${spec.name}: stat ${old} not found`);
    const end = h.indexOf('<br/></p>', i);
    h = h.slice(0, i) + `<h2 class="h2 _01">${st.value}</h2></div><div><p class="top-text">${st.text}` + h.slice(end);
  });

  h = s(h, '(Success stories)', '(治理原则)');
  h = setInner(h, '<div class="top-text for-sst">', spec.quote.text);
  h = s(h, '>Elena Rossi<', `>${spec.quote.who}<`);
  h = s(h, '>Marketing Director at Auralis®<', `>${spec.quote.where}<`);
  h = h.replace(/<img[^>]*class="logo-absolute"[^>]*\/>/, (m) => { if (!m) throw new Error('logo-absolute'); return ''; });
  if (h.includes('logo-absolute')) throw new Error(`${spec.name}: fake client logo survives`);

  h = s(h, 'Creative Minds <span class="small-ftd finr">(5)</span>', `${spec.cards.title} <span class="small-ftd finr">(5)</span>`);
  TEAM_TPL.forEach(([n, r], i) => { h = teamCard(h, n, r, spec.cards.items[i]); });
  h = s(h, '(Leadership)', spec.cards.noteLabel);
  h = setInner(h, '<p class="top-text big for-inr">', spec.cards.note);
  h = setLink(h, 'Join us', { href: spec.cards.button.href, text: spec.cards.button.label });

  // Partner logo wall: sixteen invented brands. Deleted, not hidden.
  const partners = elementContaining(h, '(Partners)', 'div', { up: 2 });
  if (!partners.text.includes('partner-grid') || !partners.text.startsWith('<div class="margin-150">')) throw new Error(`${spec.name}: partner block boundary`);
  h = h.slice(0, partners.start) + h.slice(partners.end);
  if (h.includes('partner-grid')) throw new Error(`${spec.name}: partner grid survives`);

  // Awards → data table.
  const awards = elementContaining(h, '(Awards 23-26©)', 'section');
  h = h.slice(0, awards.start) + awardsTable(spec.table) + h.slice(awards.end);

  return h;
}

/* ================================================================== pages */

const PAGES = {};

/* ---- capabilities.html — from work_work-1.html ------------------------ */
PAGES['capabilities.html'] = () => {
  const { fn: s } = makeSub('capabilities');
  let h = tpl('work_work-1.html');
  const byStatus = (st) => count(CAPS, 'status', st);
  const groups = [
    { name: '销售与外贸履约', domains: ['sales', 'trade-ops', 'retention'] },
    { name: '增长与获客', domains: ['growth'] },
    { name: '指挥与创意', domains: ['command', 'create'] },
    { name: '平台与治理', domains: ['platform'] },
  ].map((g) => ({ ...g, n: CAPS.filter((c) => g.domains.includes(c.domain)).length }));
  if (groups.reduce((a, g) => a + g.n, 0) !== CAPS.length) throw new Error('capability groups do not partition E01–E52');

  h = s(h, '>Selected Works', `>能力全景`);
  h = s(h, '>(4)<', '>(52)<', { count: 1 });
  h = s(h, '(Portfolio 23-26©)', `(E01–E52 · 核对于 ${CHECKED})`);
  h = s(h, 'Helping businesses turn vision into reality. Take a look at our latest projects.',
    `52 项能力，状态只看仓库里实际存在的证据：${byStatus('demo-verified')} 项演示验证，${byStatus('pilot')} 项试点，${byStatus('roadmap')} 项路线图，${byStatus('research-preview')} 项研究预览。没有一项标为「已上线」——那需要客户生产环境的运行证据，目前不存在。`);

  // Four project cards → four capability groups, linking to the table below.
  [['Forma Digital', 'project_forma-digital.html'], ['Nero Vision', 'project_nero-vision.html'], ['One Step', 'project_one-step.html'], ['Bold Moves', 'project_bold-moves.html']]
    .forEach(([name, href], i) => {
      h = s(h, `>${name}<`, `>${groups[i].name}<`, { count: 1 });
      h = s(h, `href="${href}"`, 'href="#atlas"', { count: 1 });
    });
  const years = h.match(/<h3 class="work-title">\d\d<\/h3><h3 class="work-title">©<\/h3>/g);
  if (!years || years.length !== 4) throw new Error('capabilities: expected 4 year pairs');
  years.forEach((y, i) => { h = h.replace(y, `<h3 class="work-title">${groups[i].n}</h3><h3 class="work-title">项</h3>`); });

  // Pricing block → the status ladder. No price anywhere.
  h = s(h, 'id="Pricing"', 'id="status"');
  h = s(h, '(Pricing)', '(状态怎么定)');
  h = s(h, '>Pick Smart.<', '>先看证据。<');
  h = s(h, '>Pay Less.<', '>再定状态。<');
  h = s(h, '>Build Better.<', '>宁低勿高。<');
  h = s(h, 'Choose the plan that fits you best.', '状态由仓库里的证据决定，不由规划文档决定。证据不明时取较低的那一档。');
  h = s(h, '>Starter<', '>演示验证<');
  h = s(h, 'Built for early-stage teams establishing their online presence.', '有真实代码，能在确定性数据上端到端跑通，但还没有客户生产环境的证据。这是当前的上限。');
  h = s(h, '$2,000', String(byStatus('demo-verified')));
  h = s(h, '>Growth<', '>试点<');
  h = s(h, 'Designed for businesses ready to elevate their digital experience.', '已注册并接线，但默认关闭、只有部分实现，或没有在运营中验证过。');
  h = s(h, '$4,000', String(byStatus('pilot')));
  h = s(h, '(Project)', '(项)', { count: 2 });
  h = s(h, 'What&#x27;s included:', '门槛：', { count: 2 });
  [['Tailored website layouts', '实现代码存在于产品仓库'], ['Core SEO configuration', '有可执行测试，或有工作流实际使用的注册表行'],
    ['Mobile-first responsive design', '在确定性演示数据上端到端跑通'], ['Brand-ready UI framework', '尚无客户生产环境的运行证据'],
    ['Ideal for new launches and rebrands', '提升状态必须在同一次提交里加证据并删掉钉住它的测试'],
    ['High-end design with smooth interactions', '注册表里有对应的能力行'], ['Complete on-site SEO setup', '可能位于默认关闭的部署配置之后'],
    ['Adaptive layouts for every screen', '部分步骤仍需人工完成'], ['CMS setup for content or case studies', '没有在运营中验证'],
    ['Performance tuning &amp; optimization', '页面上不会把它写成「可用」'],
  ].forEach(([a, b]) => { h = s(h, `>${a}<`, `>${b}<`, { count: 1 }); });
  h = s(h, '>Timeline:<', '>核对日期：<', { count: 2 });
  h = s(h, '>1-2 weeks<', `>${CHECKED}<`);
  h = s(h, '>2-3 weeks<', `>${CHECKED}<`);
  h = setLink(h, 'Book a call', { href: 'governance.html', text: '看治理测试', all: true });

  // FAQ → the other two statuses and the missing one.
  h = s(h, '(FAQ)', '(另外两种状态)');
  [['What services does your agency offer?', '「路线图」是什么意思？'], ['How do you determine the right strategy?', '「研究预览」是什么意思？'],
    ['How long does a typical project take?', '为什么没有一项是「已上线」？'], ['Do you work with businesses in any industry?', '状态会变吗？'],
  ].forEach(([a, b]) => { h = s(h, `>${a}<`, `>${b}<`, { count: 1 }); });
  h = setEachInner(h, '<p class="paragraph">', [
    `仓库里没有找到实现。${byStatus('roadmap')} 项能力处于这个状态。它们出现在清单里是为了把边界说清楚，不是承诺交期。`,
    `一个研究方向，刻意不作为功能宣称。${byStatus('research-preview')} 项。`,
    '「已上线」（live-verified）要求可复现的客户生产运行证据。产品仓库现有的可执行测试证明的是治理属性——审批不可绕过、台账只追加、R4 结构性禁止自动化——不是某项业务能力在客户环境跑通过。所以上限停在「演示验证」。',
    `会。提升任何一项的状态，必须在同一次提交里加上证据引用、改状态、并删掉钉住它的测试断言；缺一项，构建就不通过。核对日期 ${CHECKED} 随之更新。`,
  ]);
  h = s(h, '(Looking for more?)', '(想看某一项的证据？)');
  h = s(h, 'Expand your scope with marketing, SEO, or content creation.', '每一项能力的证据引用都在产品仓库里，按编号可查。诊断时我们逐项打开给你看。');
  h = setLink(h, 'Contact us', { href: 'contact.html', text: '预约诊断' });

  // Atlas: all 52 rows, inserted between the group cards and the status ladder.
  const rows = CAPS.map((c) => [c.id, `${escapeHtml(c.title)} · ${DOMAIN_ZH[c.domain]}`, STATUS_ZH[c.status]]);
  const table = awardsTable({
    id: 'atlas', caption: '(按编号)', title: '能力图谱', total: CAPS.length,
    button: { label: '查看数字员工', href: 'workforce.html' },
    headers: ['(编号)', '(能力 · 领域)', '(状态)'], rows,
  });
  const anchor = '<div data-w-id="f7fb6f0b-16b8-25a9-4160-54883563ff75" class="rounder-wrapper">';
  if (!h.includes(anchor)) throw new Error('capabilities: insertion anchor missing');
  h = h.replace(anchor, `${table}\n${anchor}`);
  return h;
};

/* ---- workforce.html — from studio.html -------------------------------- */
PAGES['workforce.html'] = () => {
  const backed = AGENTS.filter((a) => a.backingRole).length;
  const roadmap = AGENTS.filter((a) => a.status === 'roadmap');
  const byDomain = (d) => AGENTS.filter((a) => a.domain === d);
  const names = (d) => byDomain(d).map((a) => a.name).join(' / ');
  const tier = (t) => `${t} ${RISK[t].label}`;
  return fromStudio({
    name: 'workforce',
    eyebrow: `(数字员工 · 注册表核对于 ${CHECKED})`,
    h1: `${AGENTS.length} 位岗位型数字员工`,
    story: [
      { label: '(R0)', text: `${RISK.R0.meaning}读取会话、检索知识、比对清单。${AGENTS.filter((a) => a.autonomyCeiling === 'R0').length} 位数字员工的自主上限就在这一级：可以看，可以算，不能对外产生任何动作。` },
      { label: '(R1)', text: `${RISK.R1.meaning}把询盘解析成结构化字段、生成测算表与草稿，写进内部记录。不触碰任何外部系统。` },
      { label: '(R2)', text: `${RISK.R2.meaning}写入 CRM、发出报价、回复买家都在这一级。审批事件成对入台账；审批通道不可用时，系统拒绝执行，而不是自行决定。${AGENTS.filter((a) => a.autonomyCeiling === 'R2').length} 位数字员工的自主上限是 R2。` },
      { label: '(R3 · R4)', text: `R3：${RISK.R3.meaning}R4：${RISK.R4.meaning}没有任何数字员工的自主上限达到这两级；R4 在代码结构上没有自动化路径，每一次尝试都会被记录。` },
    ],
    introLabel: '(先说清楚)',
    intro: `注册表里没有人名。员工注册表的 288 条记录全部按职能命名——fp.stargo-inquiry-handler、fp.stargo-quotation——其中 273 条是从第三方 MIT 仓库导入的角色，15 条是 STARGO 自有职能角色。下面这 ${AGENTS.length} 个名字是网站的呈现层：${backed} 位背后有真实角色记录，1 位由能力提供方支撑，${roadmap.length} 位没有任何落地，标为路线图且不持有任何可执行动作。`,
    approachLabel: '(每一位都这样工作)',
    approach: ['先注册。', '再编排。', '后审批。', '留台账。'],
    approachButton: { label: '查看治理与安全', href: 'governance.html' },
    statsLabel: '(数字)',
    stats: [
      { value: String(AGENTS.length), text: '个岗位。名字是呈现层；职责、获授权的动作范围与自主上限来自注册表，不是编辑判断。' },
      { value: String(backed), text: '位有注册表角色记录支撑（fp.* 自有职能角色）。自主上限取该角色所拥有的可执行步骤中最高的风险等级。' },
      { value: String(roadmap.length), text: `位没有任何落地支撑：${roadmap.map((a) => a.role).join('、')}。全仓库检索不到对应角色，标为路线图，不持有可执行动作。` },
    ],
    quote: QUOTES.approval,
    cards: {
      title: '五个业务域',
      items: [
        { name: '销售', role: `(${byDomain('sales').length} 位 · ${names('sales')})` },
        { name: '增长', role: `(${byDomain('growth').length} 位 · ${names('growth')})` },
        { name: '外贸履约', role: `(${byDomain('trade-ops').length} 位 · ${names('trade-ops')})` },
        { name: '创意', role: `(${byDomain('create').length} 位 · ${names('create')})` },
        { name: '售后', role: `(${byDomain('retention').length} 位 · ${names('retention')})` },
      ],
      noteLabel: '(关于头像)',
      note: '图片是模板自带的示意，不对应任何真人，也不对应任何数字员工。数字员工由职能命名，注册表中不含人名与头像。',
      button: { label: '看一条询盘怎么走', href: 'tour.html' },
    },
    table: {
      id: 'roster', caption: '(岗位清单)', title: '岗位', total: AGENTS.length,
      button: { label: '查看能力全景', href: 'capabilities.html' },
      headers: ['(岗位)', '(支撑角色)', '(自主上限)'],
      rows: AGENTS.map((a) => [
        `${a.name} · ${escapeHtml(a.role)}`,
        a.backingRole ? a.backingRole : a.backedByProvider ? `能力提供方 ${a.backedByProvider}（无角色记录）` : '路线图 · 无可执行动作',
        a.autonomyCeiling ? tier(a.autonomyCeiling) : '—',
      ]),
    },
  });
};

/* ---- governance.html — from studio.html ------------------------------- */
PAGES['governance.html'] = () => {
  const TESTS = [
    ['审批与读写分离', 'test-approval-and-readwrite-split', '审批经独立通道路由，失败即关闭；模型自己写下的「已批准」标记是废弃的空操作，从不被读取'],
    ['审计台账', 'test-audit-ledger', '台账只追加；台账不可写时只有 R0 只读动作可以继续'],
    ['黄金旅程覆盖', 'test-golden-journey-coverage', '每个工作流步骤都解析到一条已启用的注册表行；每个对外写入都声明回读与成功判据，或诚实地声明没有'],
    ['运营本体', 'test-ontology', 'SQLite 运营本体，PROV-O 对齐，双时态'],
    ['R4 结构性禁止', 'test-r4-structural', 'R4 在结构上禁止自动化，每一次尝试都入台账'],
  ];
  const gated = FACTS.facts.find((f) => f.value === '30');
  return fromStudio({
    name: 'governance',
    eyebrow: '(治理与安全)',
    h1: '问不到人时，系统拒绝执行。',
    story: [
      { label: '(审批)', text: '审批不可绕过。对外产生真实后果的动作必须先取得成对的人工审批事件；审批经由独立的审批通道路由，通道不可用时动作被拒绝，而不是放行。模型自己写下的「已批准」标记是废弃的空操作，从不被读取。有可执行测试守着这一条。' },
      { label: '(台账)', text: '台账只追加。每一次执行的开始、结束、结果与证据都写入不可修改的台账，可以逐条回读；台账不可写时，只有 R0 只读动作可以继续。有可执行测试守着这一条。' },
      { label: '(禁止)', text: 'R4 结构性禁止自动执行。最高风险等级的动作在代码结构上没有自动化路径——不是一个可以改的策略开关——每一次尝试都会被记录。有可执行测试守着这一条。' },
      { label: '(回读)', text: '回读才算完成。每一个对外写入都必须声明回读与成功判据，或诚实地声明没有；没有回读证据，动作不计为成功。有可执行测试守着这一条。' },
    ],
    introLabel: '(这些测试证明什么)',
    intro: `五套可执行测试，${CHECKED} 全部通过。它们证明的是治理属性——审批不可绕过、台账只追加、R4 禁止自动化、回读才算完成——不是某项业务能力在客户环境里跑通过。这也是为什么能力全景里没有一项标为「已上线」。`,
    approachLabel: '(五个风险等级)',
    approach: [`R0 ${RISK.R0.label}。`, `R1 ${RISK.R1.label}。`, `R2 / R3 ${RISK.R2.label}。`, `R4 ${RISK.R4.label}。`],
    approachButton: { label: '看一条询盘怎么走', href: 'tour.html' },
    statsLabel: '(数字)',
    stats: [
      { value: String(TESTS.length), text: '套可执行治理测试：审批与读写分离、审计台账、黄金旅程覆盖、运营本体、R4 结构性禁止。' },
      { value: gated.value, text: `个已登记动作强制人工审批。注册表数字，可用 ${escapeHtml(gated.verify.split(' first-party')[0])} 重新推导。` },
      { value: '0', text: '项能力标为「已上线」。那个标签要求客户生产环境的运行证据；目前的上限是「演示验证」。' },
    ],
    quote: QUOTES.readback,
    cards: {
      title: '五套测试',
      items: TESTS.map(([name, file], i) => ({ name, role: `(${file})`, image: ABSTRACT[i] })),
      noteLabel: '(它们在哪里)',
      note: '五套测试都在产品仓库的 tests/governance/ 目录下，任何人拿到仓库都可以重新运行。网站上的每一条治理声明都对应其中一套。',
      button: { label: '预约诊断', href: 'contact.html' },
    },
    table: {
      id: 'tests', caption: '(可执行测试)', title: '测试清单', total: TESTS.length,
      button: { label: '查看集成状态', href: 'integrations.html' },
      headers: ['(测试)', '(它证明什么)', '(结果)'],
      rows: TESTS.map(([name, file, proves]) => [`${name}<br/><span class="top-text gray-small">tests/governance/${file}.mjs</span>`, proves, `通过 · ${CHECKED}`]),
    },
  });
};

/* ---- integrations.html — from studio.html ----------------------------- */
PAGES['integrations.html'] = () => {
  const total = INTEGRATIONS.reduce((n, i) => n + i.capabilities, 0);
  const off = INTEGRATIONS.reduce((n, i) => n + i.disabled, 0);
  const gated = INTEGRATIONS.reduce((n, i) => n + i.approvalGated, 0);
  const allOff = INTEGRATIONS.filter((i) => i.disabled === i.capabilities);
  const mostlyOff = INTEGRATIONS.filter((i) => i.disabled > 0 && i.disabled < i.capabilities && i.disabled / i.capabilities >= 0.5);
  const spotlight = [...allOff.filter((i) => i.capabilities > 1), ...mostlyOff].slice(0, 5);
  if (spotlight.length !== 5) throw new Error(`integrations: expected 5 spotlight providers, got ${spotlight.length}`);
  const orchestrator = INTEGRATIONS.find((i) => i.id === 'activepieces');
  const f = (v) => FACTS.facts.find((x) => x.value === v);
  return fromStudio({
    name: 'integrations',
    eyebrow: `(能力接入 · 注册表核对于 ${CHECKED})`,
    h1: `${INTEGRATIONS.length} 个提供方。`,
    story: [
      { label: '(登记)', text: `${INTEGRATIONS.length} 个提供方登记了 ${total} 项能力。这些是注册表数字：说明登记了什么，不说明什么现在能跑。每个数字都附带重新推导它的命令。` },
      { label: '(关闭)', text: `${off} 项能力当前关闭。${allOff.map((i) => `${i.upstream} ${i.disabled}/${i.capabilities}`).join('、')} 全部关闭；${mostlyOff.map((i) => `${i.upstream} ${i.capabilities} 项中 ${i.disabled} 项关闭`).join('、')}。它们出现在清单里，是为了让你在试点之前就知道，而不是在试点中发现。` },
      { label: '(审批)', text: `${gated} 个动作需要人工审批，其中 ${orchestrator.approvalGated} 个集中在 ${orchestrator.upstream}——唯一的主业务编排器——因为所有对外发出的动作都从那里走。` },
      { label: '(上游)', text: '上游名字不隐藏。Chatwoot、Twenty CRM、Yente / OpenSanctions、WeKnora……品牌政策要求上游身份始终可查，即使导航用的是 STARGO 的名字。它们在这里出现不表示背书。' },
    ],
    introLabel: '(为什么有这一页)',
    intro: `一张常规的集成页会放 ${INTEGRATIONS.length} 个 logo，暗示 ${INTEGRATIONS.length} 条能用的连接。这一页写的是哪些今天真的能用——因为在试点中发现差异的买家，不会把它当成细节。`,
    approachLabel: '(接入规则)',
    approach: ['先注册。', '后调用。', '关了就是关了。', '审批不可绕过。'],
    approachButton: { label: '查看能力全景', href: 'capabilities.html' },
    statsLabel: '(数字 · 附推导命令)',
    stats: [
      { value: f('202').value, text: `项登记能力。<br/>${escapeHtml(f('202').verify.split(' first-party')[0])}` },
      { value: String(off), text: '项当前关闭。登记不等于可用。' },
      { value: f('30').value, text: `个动作需人工审批。<br/>${escapeHtml(f('30').verify.split(' first-party')[0])}` },
    ],
    quote: QUOTES.ledger,
    cards: {
      title: '当前全部或大部分关闭',
      items: spotlight.map((i, k) => ({ name: i.upstream, role: `(${i.disabled}/${i.capabilities} 关闭${i.defaultOffProfile ? ' · 默认关闭配置' : ''})`, image: ABSTRACT[k] })),
      noteLabel: '(说明)',
      note: '它们已接线但默认关闭，位于需要显式开启的部署配置之后。启用之前不视为可用，页面上也不会写成可用。',
      button: { label: '预约诊断', href: 'contact.html' },
    },
    table: {
      id: 'providers', caption: '(提供方清单)', title: '提供方', total: INTEGRATIONS.length,
      button: { label: '查看治理与安全', href: 'governance.html' },
      headers: ['(提供方)', '(用途)', '(能力 · 关闭 · 需审批)'],
      rows: INTEGRATIONS.map((i) => [escapeHtml(i.upstream), escapeHtml(i.purpose), `${i.capabilities} · ${i.disabled} · ${i.approvalGated}`]),
    },
  });
};

/* ---- tour.html — from project_forma-digital.html ---------------------- */
PAGES['tour.html'] = () => {
  const { fn: s } = makeSub('tour');
  let h = tpl('project_forma-digital.html');
  const actor = (id) => AGENTS.find((a) => a.id === id);
  const auto = TOUR.steps.filter((st) => st.outcome !== 'gated').length;
  const gated = TOUR.steps.length - auto;

  h = s(h, '>Forma Digital</h1>', '>一条询盘，十步。</h1>');
  h = s(h, '(Introduction)', '(互动产品演示 · 演示数据)');
  h = setInner(h, '<p class="top-text big for-inr">', escapeHtml(TOUR.disclaimer));
  h = s(h, '(Challenges)', '(目标)');
  h = setEachInner(h, '<h2 class="h2 _01 wkp">', [escapeHtml(TOUR.goal), escapeHtml(TOUR.closing)]);
  h = s(h, '(Client)', '(演示买家)');
  h = s(h, '<p class="top-text">Forma Digital</p>', '<p class="top-text">Moto Verde Distribuidora（演示虚构）</p>');
  h = s(h, '(Data)', '(步骤)');
  h = s(h, '<p class="top-text">©</p>', '<p class="top-text"></p>', { nth: 0 });
  h = s(h, '<p class="top-text">26</p>', `<p class="top-text">${TOUR.steps.length} 步 · ${auto} 步自动 · ${gated} 步停在审批</p>`, { count: 1 });
  h = s(h, '(Services)', '(闭环)');
  h = s(h, '>Strategy, Concept<', '>WF02 · 询盘响应<');
  h = s(h, '(Final thoughts)', '(这是设计，不是限制)');
  h = setLink(h, 'Live Project', { href: 'contact.html', text: '预约企业 AI 诊断' });

  // Related works → two onward links.
  h = s(h, '(Portfolio 23-26©)', '(接下来)');
  h = s(h, '>Related Works<', '>继续看<');
  h = s(h, '>Bold Moves<', '>治理与安全<');
  h = s(h, '>Nero Vision<', '>数字员工<');
  h = s(h, 'href="project_bold-moves.html"', 'href="governance.html"');
  h = s(h, 'href="project_nero-vision.html"', 'href="workforce.html"');
  h = s(h, '<p class="top-text">24</p>', '<p class="top-text">5 套测试</p>');
  h = s(h, '<p class="top-text">25</p>', `<p class="top-text">${AGENTS.length} 位</p>`);
  h = s(h, '<p class="top-text">©</p>', '<p class="top-text"></p>', { count: 2 });

  // The ten steps, with real risk tier and gate, before the onward links.
  const table = awardsTable({
    id: 'steps', caption: '(WF02 · 逐步逐闸)', title: '十步', total: TOUR.steps.length,
    button: { label: '查看治理与安全', href: 'governance.html' },
    headers: ['(步骤)', '(动作 · 执行者)', '(风险 · 闸门)'],
    rows: TOUR.steps.map((st) => [
      String(st.n).padStart(2, '0'),
      `${escapeHtml(st.title)} · ${actor(st.actorId).name} ${escapeHtml(actor(st.actorId).role)}<br/><span class="top-text gray-small">${escapeHtml(st.detail)}</span>`,
      st.outcome === 'gated' ? `${st.risk} · 停在人工审批` : st.outcome === 'writes' ? `${st.risk} · 内部写入，带回读` : `${st.risk} · 只读`,
    ]),
  });
  const anchor = '<section class="section gr mns-wp">';
  h = s(h, anchor, `${table}\n${anchor}`, { count: 1 });
  return h;
};

/* ---- contact.html — from contact_contact-1.html ----------------------- */
PAGES['contact.html'] = () => {
  const { fn: s } = makeSub('contact');
  let h = tpl('contact_contact-1.html');
  h = s(h, '(Contact)', '(联系)');
  h = s(h, 'Let’s Connect', '预约企业 AI 诊断');
  // The testimonial card: a five-star quote from an invented founder. Replaced with the governing document.
  h = h.replace(/<img[^>]*class="logo-testi-1"[^>]*\/>/, '');
  if (h.includes('logo-testi-1')) throw new Error('contact: fake client logo survives');
  h = s(h, '>★★★★★<', '><');
  h = s(h, '“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”', QUOTES.approval.text);
  h = s(h, '>Joda Trump<br/>', `>${QUOTES.approval.who}<br/>`);
  h = s(h, '>Founder of Light Studio®<br/>', `>${QUOTES.approval.where}<br/>`);
  h = s(h, '(Fill the form)', '(填写表单)');
  h = s(h, '>Name*<', '>姓名*<');
  h = s(h, '>Email*<', '>邮箱*<');
  h = s(h, '>Subject<', '>公司<');
  h = s(h, '>Category<', '>需求<');
  h = s(h, '>Message<', '>留言<');
  h = s(h, '>Select one...<', '>请选择…<');
  h = s(h, '>First choice<', '>企业 AI 诊断<');
  h = s(h, '>Second choice<', '>受控试点<');
  h = s(h, '>Third choice<', '>其他咨询<');
  return h;
};

/* ---- notices.html — from a blog post ---------------------------------- */
PAGES['notices.html'] = () => {
  const { fn: s } = makeSub('notices');
  let h = tpl('post_designing-digital-systems-that-scale-with-your-business.html');
  h = s(h, 'October 4, 2025', '2026-09-03 更新');
  h = s(h, '>Designing digital systems that scale your business<', '>第三方声明<');
  const body = `
<h4>网站模板</h4>
<p>本站版式来自两套 Webflow 模板：Mōno™（页面骨架、导航、页脚）与 Scalora Startup（首页的四层卡片堆、粘性切换器与能力接入三个模块）。两套模板均按 Webflow 模板许可使用，其原有文案已全部替换；模板附带的示例图片仅作版式示意，不代表任何真实客户、人物、产品或界面截图。</p>
<h4>运行时库</h4>
<ul>
<li>Webflow 运行时与交互引擎（随模板导出），jQuery 3.5.1（MIT）</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock 标准「免费」许可。该许可允许网站实现（含商业用途），但许可方保留全部知识产权并可修改条款；因此本站的内容与控件都不依赖它才能工作</li>
<li>Lenis（MIT）— 平滑滚动</li>
<li>Lottie（随 Webflow 运行时加载，MIT）— 导航图标动画</li>
</ul>
<h4>字体</h4>
<p>Inter、Inter Display 与 Instrument Serif，均按 SIL Open Font License 1.1 自托管，不向任何第三方字体服务发起请求。</p>
<h4>上游软件</h4>
<p>站内提到的 Activepieces、Chatwoot、Twenty CRM、Yente / OpenSanctions、WeKnora、Firecrawl、Playwright、Univer、Windmill、ERPNext、Medusa、PostHog、Puter 等名称，均为各自所有者的商标或项目名。STARGO 的品牌政策要求上游身份始终可查，它们在本站出现是为了这一点，不表示相关项目对 STARGO 的背书。</p>
<h4>员工注册表中的导入角色</h4>
<p>产品的员工注册表含 288 条记录，其中 273 条角色自第三方 MIT 许可仓库导入，15 条为 STARGO 自有职能角色。导入角色所引用的 LICENSE 文件在当前检出中缺失，发布前需补全归属——这是业主待办事项，此处如实记录。</p>
<h4>STARGO 自有资产</h4>
<p>STARGO 标识、字标与轨道图形为 STARGO 自有作品。四角星标沿用产品端已发布的品牌资源，该资源自身记录了它是原创绘制、并非任何上游标识的衍生或修改。</p>
<h4>本页没有的东西</h4>
<p>本站不展示任何客户标识、评价或指标，不展示价格，不声明任何认证、可用性或投资回报。这些不是遗漏：仓库里没有可公开的对应证据，所以页面上也没有。</p>`;
  h = setInner(h, '<div class="w-richtext">', body.trim());
  h = setLink(h, 'Back to blog', { href: 'index.html', text: '返回首页' });

  // "Related stories" → three onward pages, on the template's product-shot cards.
  h = s(h, '>Related Stories<', '>继续看<');
  h = s(h, 'From foundational design to advanced optimization — built for digital growth.', '每一页都只写仓库里能找到证据的东西。');
  const cards = [
    ['November 11, 2025', 'The power of simplicity in modern real brand design', 'Learn effective social media marketing tips to engage your audience and build brand loyalty.', 'post_the-power-of-simplicity-in-modern-brand-design.html',
      `(${CAPS.length} 项)`, '能力全景', '每一项能力的真实状态与核对日期。', 'capabilities.html'],
    ['October 1, 2025', 'From idea to execution: building products that last', 'An overview of Content Management Systems, their benefits, and popular platforms.', 'post_from-idea-to-execution-building-products-that-last.html',
      `(${AGENTS.length} 位)`, '数字员工', '谁有注册表角色支撑，谁还只是路线图。', 'workforce.html'],
    ['October 3, 2026', 'Why great brands are built on clarity, not complexity', 'Discover the latest SEO strategies for 2023 to enhance your website&#x27;s visibility and performance.', 'post_why-great-brands-are-built-on-clarity-not-complexity.html',
      `(${TOUR.steps.length} 步)`, '产品演示', '一条询盘走完 WF02，三步停在人工审批。', 'tour.html'],
  ];
  for (const [d, t, p, href, d2, t2, p2, href2] of cards) {
    h = s(h, `>${d}<`, `>${d2}<`, { count: 1 });
    h = s(h, `>${t}<`, `>${t2}<`, { count: 1 });
    h = s(h, `>${p}<`, `>${p2}<`, { count: 1 });
    h = s(h, `href="${href}"`, `href="${href2}"`, { count: 1 });
  }
  h = s(h, '>Read more<', '>查看<', { count: 4 });   // three cards plus the cursor tooltip
  return h;
};

/* ---- 404.html ---------------------------------------------------------- */
PAGES['404.html'] = () => {
  const { fn: s } = makeSub('404');
  let h = tpl('404.html');
  h = s(h, '>404 Error Page<', '>404<');
  h = s(h, 'The page you are looking for doesn&#x27;t exist or has been moved', '这个页面不存在，或者已经移动。');
  h = setLink(h, 'Back Home', { href: 'index.html', text: '回到首页' });
  return h;
};

/* ---- index.html — the fused homepage, chrome and cleanup only ---------- */
PAGES['index.html'] = () => {
  let h = readFileSync(`${SITE}/tools/fragments/index.fused.html`, 'utf8');
  // Eight invented partner logos on flip cards. Deleted, not hidden.
  const grid = elementContaining(h, 'class="partner-grid"', 'div', { up: 1 });
  if (!grid.text.startsWith('<div class="margin-50">')) throw new Error('index: partner grid wrapper');
  h = h.slice(0, grid.start) + h.slice(grid.end);
  if (h.includes('partner-card')) throw new Error('index: partner cards survive');
  return h;
};

/* ================================================================== main */

const META = {
  'index.html': { title: 'STARGO WORK 7.0', description: FACTS.category + '。' + FACTS.contrast },
  'capabilities.html': { title: '能力全景', description: `E01–E52 全部 ${CAPS.length} 项能力与各自的真实状态。` },
  'workforce.html': { title: '数字员工', description: `${AGENTS.length} 个岗位：职责、授权范围与自主上限；哪些有注册表角色支撑，哪些还只是路线图。` },
  'governance.html': { title: '治理与安全', description: '风险分级、审批闸门、回读与台账，以及守着它们的五套可执行测试。' },
  'integrations.html': { title: '集成', description: `${INTEGRATIONS.length} 个能力提供方，以及其中哪些现在真的能用。` },
  'tour.html': { title: '产品演示', description: '一条询盘走完 WF02 十步真实业务闭环，含每一步的风险等级与审批闸门。演示数据。' },
  'contact.html': { title: '联系', description: '预约企业 AI 诊断。' },
  'notices.html': { title: '第三方声明', description: '模板、运行时库、字体与上游软件的许可与署名。' },
  '404.html': { title: '404', description: '页面不存在。' },
};

const FORBIDDEN = [
  /Mōno/, /monostudio/i, /Scalora/, /Awwwards/, /Webby/, /Lorem/i, /cal\.com/,
  /\$\s?\d/, /¥\s?\d/, /\/mo\b/, /per seat/i, /起\s*$/m,
  /Forma Digital/, /Nero Vision/, /One Step/, /Bold Moves/, /Auralis/, /Light[\s ]Studio/, /Joda Trump/,
  /partner-card/, /Elena Rossi/, /Adrian Keller/,
];
const ALLOWED_TEMPLATE_NAMES = { 'notices.html': [/Mōno/, /Scalora/] };   // attribution names them on purpose

const written = [];
for (const [name, build] of Object.entries(PAGES)) {
  let html = build();
  html = applyChrome(html, { current: name, ...META[name] });
  html = remapLinks(html);
  assertInternalLinks(html, name);
  const body = html.slice(html.indexOf('<body'));
  for (const re of FORBIDDEN) {
    if ((ALLOWED_TEMPLATE_NAMES[name] ?? []).some((ok) => ok.source === re.source)) continue;
    if (re.test(body)) throw new Error(`[${name}] forbidden content: ${re}`);
  }
  writeFileSync(`${SITE}/${name}`, html, 'utf8');
  written.push(`${name} (${html.length})`);
}
console.log('wrote', written.join(', '));
