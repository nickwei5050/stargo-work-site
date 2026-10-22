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
const walk = (dir, rel, out) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(`${dir}/${e.name}`, r, out); else out.add(r);
  }
};
for (const f of readdirSync(SITE)) if (f.endsWith('.html')) wanted.add(f);
for (const d of ['en', 'blog', 'assets', 'css', 'js']) if (existsSync(`${SITE}/${d}`)) walk(`${SITE}/${d}`, d, wanted);
const GENERATED = ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'llms.txt'];
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
  // Every page links its stylesheets and scripts with a content hash (?v=…), so
  // a changed file is a new URL and the old one can be kept for good.
  '/css/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/js/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/api/*',
  '  ! Cache-Control',
  '  Cache-Control: no-store',
  // llms.txt carries Chinese as well as English: say it is UTF-8 text.
  '/llms.txt',
  '  Content-Type: text/plain; charset=utf-8',
  '',
].join('\n'));

// The pages stargowork.com served before this site, sent to the page that now
// covers the same ground, so old links and search results do not end in a 404.
writeFileSync(`${DIST}/_redirects`, [
  '/features /capabilities 301',
  '/features.html /capabilities 301',
  '/security /enterprise 301',
  '/security.html /enterprise 301',
  '/en/features /en/capabilities 301',
  '/en/security /en/enterprise 301',
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
    '> A browser-based desktop AI operating system for manufacturing and global trade enterprises. 面向制造业与外贸企业的网页桌面级 AI 企业操作系统。',
    '',
    'STARGO WORK brings disconnected business work into one browser-based desktop. Growth OS (proactive customer acquisition) and Sales Desk (trade sales) are the two core engines; ERP and fulfillment, AI creative work, 288 specialized AI roles, enterprise knowledge and the business relationship map, proactive work and memory, the browser desktop and the owner’s cockpit with its controls support them. Principle: delegate the work, keep the authority. Each company’s capabilities are enabled to match its configuration and agreed delivery scope.',
    '',
    'STARGO WORK 把公司里分散的日常工作收进一个网页桌面。Growth OS 主动获客和 Sales Desk 外贸销售是两大核心引擎；ERP 与履约、AI 创作、288 个 AI 员工、企业知识与业务关系图、主动工作与记忆、网页桌面、老板驾驶舱与管理控制，都配合这两大引擎运转。原则：把工作交给 AI，把决定权留在企业。各项能力按每家公司的配置和约定的交付范围开通。',
    '',
    '## Key facts',
    '',
    '- Growth OS finds dealers, importers, wholesalers and target accounts, researches them, ranks opportunities and prepares outreach plans; approved prospects move into Sales Desk with their context. Data and outreach channels connect only with authorization.',
    '- Sales Desk brings inquiries and messages into one intake and carries customer records, product fit, replies, follow-up, quotes and PI to the order handoff. The workspace is live, and channel messaging and business handoffs work through the company’s own accounts.',
    '- Quotes and PI follow company-approved prices, discount permissions and margin guardrails. Live prices, contracts, signatures and documents come from the company’s own systems; approval and sending are separate steps.',
    '- ERP and commerce applications are live, and so are cross-system work and AI actions. Fulfillment, finance, logistics and service run through connected systems; filings, payments and professional reviews are confirmed by authorized people.',
    `- The role directory lists 288 specialized AI roles in ten enterprise functions: ${groups.map((g) => `${g.name.en} ${g.count}`).join(', ')} (total ${total}). It is not a claim to replace 288 people; the employees enabled, the size of a collaboration and permitted actions follow the company’s configuration, budget and access.`,
    '- AI teamwork is available: several AI employees form a team for one task, message each other, work in parallel, and a coordinating role checks and consolidates one result for a person to confirm. Collaboration rounds, budgets and permitted actions are capped, and work can be stopped at any time. Human approval, pause and takeover always remain; sharing task context does not share permissions, and external actions need an approver’s sign-off.',
    '- One-click AI video is available: brief, script, storyboard, visuals, voiceover, captions and export of a playable, exportable file in portrait, landscape or square, with a production plan reviewed before generation, failed shots redone individually and every version and cost recorded. Finished videos are reviewed by people before publishing; generation runs within the services and credits the company enables; assets must be ones the company may use.',
    '- Viral creative adaptation is available: an authorized reference video is analyzed for structure and rebuilt around your product and brand as three original directions. It never copies footage, faces, voices, music, logos or watermarks, and viral performance is not guaranteed.',
    '- AI images and brand content: the creative workspace is live, with one-click marketing-kit production and local checks; publishing to external channels needs separate authorization.',
    '- Enterprise knowledge and the business relationship map are live, and the enterprise templates are ready; the more sources you connect, the richer the relationships. Proactive work, unified long-term memory and advanced improvement are live too; proactive work is not consciousness or unrestricted autonomy.',
    '- The browser desktop is the main way in; voice, automation, external actions, native clients, mobile and mini-programs are supported too. Owner dashboards show metrics only from connected data.',
    '- Human control: authorized people approve quotes, outreach, important commitments, official filings and payments. Approved is not sent, and sent is not received or done.',
    '',
    // The same facts in Chinese, in the site's own terms: most buyers ask in Chinese.
    '## 要点（中文）',
    '',
    '- Growth OS 找经销商、进口商、批发商和目标客户，做背调、判断商机、准备开发计划；确认后的客户连同背景资料转入 Sales Desk。数据和客户联系渠道，经企业授权后接入。',
    '- Sales Desk 把各渠道的询盘和消息收进一个入口，客户资料、产品匹配、回复、跟进、报价、PI 一路跟到订单交接。工作台已上线；各渠道收发和业务交接，接上企业自己的账号就能用。',
    '- 报价和 PI 按企业定好的价格、折扣权限和利润底线起草。实际价格、合同、签章和单证，对接企业自己的业务系统；批准不等于发出，两步分开把关。',
    '- ERP 和商城应用已经上线，跨系统联动和 AI 操作也都能用；履约、财务、物流和服务，通过已接入的系统来做。正式申报、付款和专业审阅，由有审批权的人把关。',
    `- 岗位目录共有 288 个岗位，分属十类职能：${groups.map((g) => `${g.name.zh} ${g.count}`).join('、')}（合计 ${total}）。这不等于替代 288 名真人；具体启用哪些员工、协作规模多大、能做哪些操作，由企业的配置、预算和权限决定。`,
    '- AI 团队协作现已可用：多位 AI 员工为同一任务组队、互发消息、并行处理，由统筹角色检查并汇总成一个结果交人确认。协作轮数、预算和能做的操作都有上限，随时可以叫停。人工审批、暂停和接管一直保留；共享任务信息不等于共享权限，对外操作要经审批人批准。',
    '- AI 一键生成视频现已可用：从制作需求、脚本、分镜、画面、配音、字幕一路做到导出，交付竖版、横版或方版的视频文件，能直接播放；生成前先审阅制作方案，失败镜头单独重做，版本与成本有记录。成片经人工审核后发布；生成按企业开通的服务与额度运行；所用素材须是企业有权使用的。',
    '- 爆款结构再创作现已可用：拆解参考视频（须有使用权）的结构，结合自家产品和品牌，给出三个原创方向。不复制原片、人脸、声音、音乐、标志或水印，不承诺必成爆款。',
    '- AI 作图与品牌内容：创意工作室已上线，商品营销套件能一键编排、局部检查；发布到外部渠道需单独授权。',
    '- 企业知识和业务关系图已经上线，企业资料模板也已备好，接入的资料越多，关联越丰富。主动工作、统一长期记忆和高级改进也都已上线；主动工作不是人的意识，也不是无限制的自主决定。',
    '- 以网页桌面为主，打开浏览器就能用；语音、自动化、对外操作、原生客户端、移动端和小程序也都已支持。老板驾驶舱的指标只来自已接入的数据。',
    '- 决定权在人：报价、联系客户、重要承诺、正式申报和付款，都由有审批权的人批准。已批准不等于已发送，已发送不等于已收到或已办完。',
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
