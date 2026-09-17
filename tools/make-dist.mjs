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
   2026-09-17, the ten role groups and their counts, every main page with its
   meta description and every article with its description, both languages,
   clean URLs. Nothing here is new copy that the pages do not already say. */
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
    'STARGO WORK brings disconnected business work into one browser-based desktop. Growth OS (proactive customer acquisition) and Sales Desk (trade sales) are the two core engines; ERP and fulfillment, AI creative work, 288 specialized AI roles, enterprise knowledge and the business relationship map, proactive work and memory, the browser desktop and owner visibility and controls support them. Principle: delegate the work, keep the authority. Capabilities are enabled in phases according to each company’s configuration and agreed delivery scope.',
    '',
    'STARGO WORK 把企业日常经营中分散的工作放进同一个网页桌面：Growth OS 主动获客与 Sales Desk 外贸销售是两大核心引擎，ERP 与履约、AI 创作、288 个专业数字岗位、企业知识与业务关系图、主动工作与记忆、网页桌面，以及老板驾驶舱与管理控制围绕它们协同。原则：把工作交给 AI，把决定权留在企业。各项能力按企业配置与交付范围分阶段开放。',
    '',
    '## Key facts',
    '',
    '- Growth OS finds dealers, importers, wholesalers and target accounts, researches them, ranks opportunities and prepares outreach plans; approved prospects move into Sales Desk with their context. Core workflows are being built out; live data sources and outreach are connected by authorization.',
    '- Sales Desk brings inquiries and messages into one intake and carries customer records, product fit, replies, follow-up, quotes and PI to the order handoff. The workspace exists; live channel messaging and business handoffs are connected and validated one by one.',
    '- Quotes and PI follow company-approved prices, discount permissions and margin guardrails. Live prices, contracts, signatures and documents depend on connected enterprise systems; approval and sending are separate controls.',
    '- ERP and commerce application foundations exist; cross-system work and AI actions are configured and accepted per enterprise. Delivery, finance, logistics and service are delivered in stages through connected systems; filings, payments and professional reviews are confirmed by authorized people.',
    `- 288 is the size of a directory of specialized AI roles across ten enterprise role groups: ${groups.map((g) => `${g.name.en} ${g.count}`).join(', ')} (total ${total}). It is not a claim to replace 288 people; the employees enabled, the size of a collaboration and permitted actions follow the company’s configuration, budget and access.`,
    '- AI teamwork is available: several AI employees form a team for one task, message each other, work in parallel, and a coordinating role checks and consolidates one result for a person to confirm. Collaboration rounds, budgets and permitted actions are capped; work can be stopped at any time; human approval, pause and takeover remain; shared task context does not grant other employees’ permissions; external actions need an authorized approval.',
    '- One-click AI video is available: brief, script, storyboard, visuals, voiceover, captions and export of a playable, exportable file in portrait, landscape or square, with a reviewable production plan, individually redone shots and recorded versions and costs. Finished videos are reviewed by people before publishing; generation runs within the services and credits the company enables; assets must be ones the company may use.',
    '- Viral creative adaptation is available: an authorized reference video is analyzed for structure and rebuilt around your product and brand as three original directions. It never copies footage, faces, voices, music, logos or watermarks, and viral performance is not guaranteed.',
    '- AI images and brand content: the creative workspace is present; packaged marketing kits, local checks and one-click kit production are being integrated; publishing to external channels needs separate authorization.',
    '- Enterprise knowledge and the business relationship map have foundations; richer relationships and enterprise templates arrive in stages. Proactive work, unified long-term memory and advanced improvement are still evolving; proactive work is not consciousness or unrestricted autonomy.',
    '- The browser desktop comes first; voice, automation, external actions, native clients, mobile and mini-programs follow in phases by enabled scope. Owner dashboards show metrics only from connected data.',
    '- Human control: authorized people approve quotations, outreach, important commitments, official filings and payments. Approved is not sent, and sent is not received or done.',
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
