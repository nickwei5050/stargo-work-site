/**
 * Assemble dist/ — the site files only (no tools/, no templates, no .git) —
 * plus Cloudflare Pages `_headers`, robots.txt, sitemap.xml and llms.txt (a
 * Markdown summary of the product, its pages and its articles for AI answer
 * engines, generated from tools/copy.mjs and tools/blog.mjs). Wrangler
 * compiles the root functions/ directory separately; never publish its source
 * in the static output directory. Deploy with:
 *
 *   node tools/make-dist.mjs
 *   node <wrangler> pages deploy dist --project-name stargo --branch main --commit-dirty=true
 *
 * Deploy with the local proxy bypassed (HTTP_PROXY/HTTPS_PROXY/ALL_PROXY
 * unset): through the proxy the upload API times out; direct works.
 *
 * dist/ is synchronised in place rather than deleted and recreated: on this
 * Windows volume Node's recursive remove intermittently fails on an open or
 * just-copied file. Files are overwritten, and anything in dist/ that no
 * longer exists in the source tree is removed one by one.
 */
import { mkdirSync, copyFileSync, readdirSync, writeFileSync, unlinkSync, rmdirSync, chmodSync, existsSync } from 'node:fs';
import { SITE_URL, META, NAV, MORE, SECONDARY, WORKFORCE_ROLE_GROUPS } from './copy.mjs';
import { SITE_PAGES, cleanUrl } from './chrome.mjs';
import { POSTS, postPath } from './blog.mjs';

import { SITE } from './paths.mjs';
const DIST = `${SITE}/dist`;
mkdirSync(DIST, { recursive: true });

const wanted = new Set();
// Source files kept in the repo but never requested by a page: the five 2.5 MB 42dot Sans TTFs
// (the pages load the Hangul-free WOFF2 subsets that tools/subset-42dot.py writes into assets/fonts/).
const SOURCE_ONLY = /42dotsans-(light|regular|medium|bold|extrabold)\.ttf$/;
const walk = (dir, rel, out) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(`${dir}/${e.name}`, r, out);
    else if (out !== wanted || !SOURCE_ONLY.test(e.name)) out.add(r);   // the prune pass lists dist as it is, source-only files included
  }
};
for (const f of readdirSync(SITE)) if (f.endsWith('.html')) wanted.add(f);
for (const d of ['en', 'blog', 'assets', 'css', 'js']) if (existsSync(`${SITE}/${d}`)) walk(`${SITE}/${d}`, d, wanted);
const GENERATED = ['_headers', 'robots.txt', 'sitemap.xml', 'llms.txt'];
for (const g of GENERATED) wanted.add(g);

for (const rel of wanted) {
  if (GENERATED.includes(rel)) continue;
  const to = `${DIST}/${rel}`;
  mkdirSync(to.slice(0, to.lastIndexOf('/')), { recursive: true });
  // copyFileSync after an explicit unlink: cpSync's own overwrite intermittently
  // fails on this volume with a spurious "operation completed successfully".
  if (existsSync(to)) { try { chmodSync(to, 0o666); unlinkSync(to); } catch (e) { console.warn(`could not replace ${rel}: ${e.message}`); } }
  copyFileSync(`${SITE}/${rel}`, to);
}

// Long cache for the hashed template assets, short for pages; the specific
// rule clears the general one first, otherwise Pages appends both values.
writeFileSync(`${DIST}/_headers`, [
  '/*',
  '  Cache-Control: public, max-age=600',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  X-Frame-Options: SAMEORIGIN',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '/assets/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/css/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '/js/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '/api/*',
  '  ! Cache-Control',
  '  Cache-Control: no-store',
  // llms.txt carries Chinese as well as English: say it is UTF-8 text.
  '/llms.txt',
  '  Content-Type: text/plain; charset=utf-8',
  '',
].join('\n'));

// robots + sitemap (clean URLs, both languages, hreflang alternates).
const pages = SITE_PAGES;
const clean = (lang, p) => `${SITE_URL}/${lang === 'en' ? 'en/' : ''}${p === 'index.html' ? '' : p.replace(/\.html$/, '')}`;
/* SOURCE_DATE_EPOCH (the reproducible-builds convention) pins the fallback
   lastmod, so two runs of make-dist can be compared byte for byte. */
const today = new Date(process.env.SOURCE_DATE_EPOCH ? +process.env.SOURCE_DATE_EPOCH * 1000 : Date.now()).toISOString().slice(0, 10);
const postDate = Object.fromEntries(POSTS.map((post) => [postPath(post), post.modified ?? post.date]));
const urls = [];
for (const p of pages) {
  for (const lang of ['zh', 'en']) {
    urls.push(`  <url><loc>${clean(lang, p)}</loc><lastmod>${postDate[p] ?? today}</lastmod>` +
      `<xhtml:link rel="alternate" hreflang="zh-CN" href="${clean('zh', p)}"/><xhtml:link rel="alternate" hreflang="en" href="${clean('en', p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${clean('zh', p)}"/>` +
      `<priority>${p === 'index.html' ? '1.0' : /privacy|terms|notices/.test(p) ? '0.2' : p.startsWith('blog/') ? '0.6' : '0.8'}</priority></url>`);
  }
}
writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);

/* llms.txt (the llmstxt.org layout: a title, a one-line summary, then link
   lists). Everything a reader can check against the site: the product
   definition (V5 G01), the owner's current availability statuses of
   2026-09-17 (in English, then in Chinese), the ten role groups and their
   counts, every main page with its meta description and every article with
   its description, both languages, clean URLs. Nothing here is new copy that
   the pages do not already say. */
{
  const groups = WORKFORCE_ROLE_GROUPS.groups;
  const total = groups.reduce((s, g) => s + g.count, 0);
  const pageName = (lang, page) => (page === 'index.html' ? NAV[0].label[lang] : META[page].title[lang]);
  const pageLine = (lang, page) => `- [${pageName(lang, page)}](${cleanUrl(lang, page)}): ${META[page].description[lang]}`;
  const main = [...NAV, ...MORE].map((n) => n.href);
  const postLine = (lang, p) => `- [${p.title[lang]}](${cleanUrl(lang, postPath(p))}): ${p.description[lang]}`;
  const llms = [
    '# STARGO WORK',
    '',
    '> The AI workspace for export manufacturers. Its core app, OPEN WORK, works like a chat: analyze inquiries, draft replies, quotes and PIs, find new buyers and give the owner a weekly brief — AI drafts, you decide. 外贸工厂的 AI 工作台，核心应用 OPEN WORK 像聊天一样用。',
    '',
    'STARGO WORK is the system; OPEN WORK is its core app. You ask in a chat, and AI works across the 15 apps in OPEN WORK’s sidebar — Owner Dashboard, Automation Center, Customer CRM, Knowledge Base, Prospecting, Sales Workbench, ERP, Growth Analytics, Workflow Engine, Channels, Store Admin, Control Center, Memory & Evolution, STARGO AI Digital Office and New API (AI Gateway) — to look things up and draft replies, quotes, PIs and outreach. Anything that goes to a customer waits for an authorized person. Principle: delegate the work, keep the authority. Capabilities are enabled in phases according to each company’s configuration and agreed delivery scope. Product images on the site are demonstration interfaces with demo data, shown in Chinese.',
    '',
    'STARGO WORK 是外贸工厂的 AI 工作台，核心应用是 OPEN WORK。在对话里交代任务，AI 去侧栏里的 15 个应用——老板看板、自动化中心、客户CRM、企业知识库、主动获客、销售工作台、企业ERP、增长分析、工作流引擎、渠道接入、商城后端管理、控制中心、记忆与进化、STARGO AI 数字办公室、New API（AI 网关）——查资料、写回复、报价、PI 和开发信；要发给客户的内容，先由有权人批准。原则：把工作交给 AI，把决定权留在企业。各项能力按企业配置与交付范围分阶段开放。站内产品图是带演示数据的演示界面。',
    '',
    '## Key facts',
    '',
    '- Prospecting finds dealers, importers, wholesalers and target accounts, researches them, ranks opportunities and prepares outreach plans; approved prospects move into the Sales Workbench with their context. Core workflows are being built out; live data sources and outreach are connected by authorization.',
    '- The Sales Workbench brings inquiries and messages into one intake and carries customer records, product fit, replies, follow-up, quotes and PI to the order handoff. It exists; live channel messaging and business handoffs are connected and validated one by one.',
    '- Quotes and PI follow company-approved prices, discount permissions and margin guardrails. Live prices, contracts, signatures and documents depend on connected enterprise systems; approval and sending are separate controls.',
    '- ERP and commerce application foundations exist; cross-app work and AI actions are configured and accepted per enterprise. Delivery, finance, logistics and service coordination arrive in stages through connected systems; filings, payments and professional reviews are confirmed by authorized people.',
    `- STARGO WORK has 288 digital employees across ten enterprise function groups: ${groups.map((g) => `${g.name.en} ${g.count}`).join(', ')} (total ${total}). 288 is the size of the roster, not a claim to replace 288 people; the employees enabled, the size of a collaboration and permitted actions follow the company’s configuration, budget and access.`,
    '- AI teamwork is available: several digital employees form a team for one task, message each other, work in parallel, and a coordinating role checks and consolidates one result for a person to confirm. Collaboration rounds, budgets and permitted actions are capped; work can be stopped at any time; human approval, pause and takeover remain; shared task context does not grant other employees’ permissions; external actions need an authorized approval.',
    '- One-click AI video is available: brief, script, storyboard, visuals, voiceover, captions and export of a playable, exportable file in portrait, landscape or square, with a reviewable production plan, individually redone shots and recorded versions and costs. Finished videos are reviewed by people before publishing; generation runs within the services and credits the company enables; assets must be ones the company may use.',
    '- Viral creative adaptation is available: an authorized reference video is analyzed for structure and rebuilt around your product and brand as three original directions. It never copies footage, faces, voices, music, logos or watermarks, and viral performance is not guaranteed.',
    '- AI images and brand content: the creative workspace is present; one-click marketing-kit production and local checks are being integrated; publishing to external channels needs separate authorization.',
    '- The Knowledge Base and the business relationship map (Memory & Evolution) have foundations; richer relationships and enterprise templates arrive in stages. Proactive work, unified long-term memory and advanced improvement are still evolving; proactive work is not consciousness or unrestricted autonomy.',
    '- OPEN WORK runs in a browser; voice, automation, external actions, native clients, mobile and mini-programs follow in phases by enabled scope. The Owner Dashboard shows metrics only from connected data.',
    '- Human control: authorized people approve quotations, outreach, important commitments, official filings and payments. Approved is not sent, and sent is not received or done.',
    '',
    // The same facts in Chinese, in the site's own terms: most buyers ask in Chinese.
    '## 要点（中文）',
    '',
    '- 主动获客寻找经销商、进口商、批发商和目标企业，完成背调、判断商机并准备开发计划；确认后的客户连同背景转入销售工作台。核心流程建设中，真实数据与客户触达按授权接入。',
    '- 销售工作台统一询盘与消息入口，把客户资料、产品匹配、回复、跟进、报价和 PI 连到订单交接。工作台已经具备；各渠道真实收发与业务交接逐项连接、验证。',
    '- 报价与 PI 按企业确认的价格、折扣权限和利润边界起草；真实价格、合同、签章与单证按企业系统接通；批准与发送分别受控。',
    '- 已有 ERP 与商城应用基础，跨应用协同和 AI 操作按企业配置验收；履约、财务、物流与服务按已接入的系统分阶段交付；正式申报、付款和专业审阅由有权人员确认。',
    `- STARGO WORK 有 288 名数字员工，覆盖十类企业职能：${groups.map((g) => `${g.name.zh} ${g.count}`).join('、')}（合计 ${total}）。288 是名册的规模，不代表替代 288 名真人；实际启用的员工、协作规模与可执行动作，按企业配置、预算和权限确定。`,
    '- 数字员工团队协作现已可用：多名数字员工为同一任务组队、互发消息、并行处理，由统筹角色检查并汇总成一个结果交人确认。协作轮次、预算和可执行动作都有上限，随时可以叫停；人工审批、暂停与接管始终保留；共享任务信息不授予其他员工的权限；对外动作须经授权审批。',
    '- AI 一键生成视频现已可用：制作需求、脚本、分镜、画面、配音、字幕到导出，交付竖版、横版或方版的可播放、可导出视频文件；生成前先审阅制作方案，失败镜头单独重做，版本与成本有记录。成片经人工审核后发布；生成按企业开通的服务与额度运行；所用素材须是企业有权使用的。',
    '- 爆款结构再创作现已可用：拆解有权使用的参考视频的结构，结合自身产品与品牌形成三个原创方向。不复制原片、人脸、声音、音乐、标志或水印，不承诺必成爆款。',
    '- AI 作图与品牌内容：创意工作室已有基础；商品营销套件的一键编排与局部检查持续整合；发布到外部渠道需单独授权。',
    '- 企业知识库与业务关系图（记忆与进化）已有基础，更丰富的关联和企业资料模板逐步完善。主动工作、统一长期记忆与高级改进持续完善；主动工作不是人的意识，也不是无限制的自主决定。',
    '- OPEN WORK 在浏览器里使用；语音、自动化、对外动作、原生客户端、移动端和小程序按开放范围分阶段推进。老板看板的指标只来自已接入的数据。',
    '- 人的决定权：报价、对外触达、重要承诺、正式申报和资金支付由有权人员批准。已批准不等于已发送，已发送不等于已收到或已办完。',
    '',
    '## Pages',
    '',
    ...main.map((p) => pageLine('en', p)),
    '',
    '## 页面（中文）',
    '',
    ...main.map((p) => pageLine('zh', p)),
    '',
    '## Articles',
    '',
    ...POSTS.map((p) => postLine('en', p)),
    '',
    '## 文章（中文）',
    '',
    ...POSTS.map((p) => postLine('zh', p)),
    '',
    '## Optional',
    '',
    ...SECONDARY.map((n) => pageLine('en', n.href)),
    ...SECONDARY.map((n) => pageLine('zh', n.href)),
    `- [Sitemap](${SITE_URL}/sitemap.xml): every page in both languages with hreflang alternates.`,
    '',
  ].join('\n');
  if (total !== 288) throw new Error(`llms.txt: role groups add up to ${total}`);
  writeFileSync(`${DIST}/llms.txt`, llms);
}

// Prune what the source tree no longer has.
const present = new Set();
walk(DIST, '', present);
let pruned = 0;
for (const rel of present) {
  if (wanted.has(rel)) continue;
  const p = `${DIST}/${rel}`;
  try { chmodSync(p, 0o666); unlinkSync(p); pruned++; } catch (e) { console.warn(`could not remove stale ${rel}: ${e.message}`); }
}
const pruneDirs = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) pruneDirs(`${dir}/${e.name}`);
  if (dir !== DIST && readdirSync(dir).length === 0) rmdirSync(dir);
};
pruneDirs(DIST);
console.log(`dist: ${wanted.size} files (${pruned} stale removed)`);
