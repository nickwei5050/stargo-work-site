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
 *
 * What ships (round 2, 2026-10-10): the pages the build produces (both
 * languages, from tools/chrome.mjs ALL_PAGES — a stale page left in the tree,
 * such as the retired notices.html, is not published) and exactly the files
 * they reach: every assets/, css/ and js/ path a page names (src, srcset,
 * href, data-*, poster, url(), absolute Open Graph URLs), followed through the
 * stylesheets, scripts, SVG and JSON it reaches — as they ship: without
 * comments, and without the stylesheet rules that draw a picture for a block
 * no page renders (tools/css-prune.mjs), so a file named only there does not
 * ship. A few files ship under neutral names (tools/dist-names.mjs), with
 * every reference rewritten. Retired template and
 * screenshot files that nothing references (the old sw0xx and gos0x desktop shots,
 * template icons) stay in the repository and are no longer published. Then
 * every shipped file — name, text, and the readable strings of a binary
 * (the films must not name their encoder either) — is checked against
 * tools/copy.mjs UPSTREAM (no upstream software names, open-source wording or
 * licence listings on the site; owner, 2026-10-10), and the build stops on a
 * hit. dist/_redirects sends retired addresses (the notices page, the old
 * address of the AI Staff article) to their clean replacements (RETIRED_PAGES).
 */
import { mkdirSync, copyFileSync, readdirSync, readFileSync, writeFileSync, unlinkSync, rmdirSync, chmodSync, existsSync, statSync } from 'node:fs';
import { SITE_URL, META, NAV, MORE, SECONDARY, WORKFORCE_ROLE_GROUPS, CONTACT_INFO, UPSTREAM } from './copy.mjs';
import { SITE_PAGES, ALL_PAGES, cleanUrl } from './chrome.mjs';
import { POSTS, postPath } from './blog.mjs';

import { SITE } from './paths.mjs';
import { Script } from 'node:vm';
import { stripCss, stripJs } from './strip-comments.mjs';
import { pruneDeadImageRules } from './css-prune.mjs';
import { DIST_NAMES, distPath, distText, TEMPLATE_NAMES, RETIRED_PAGES } from './dist-names.mjs';
import { versionAssets, unversionedAssets } from './asset-version.mjs';
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
/* the built pages, both languages */
for (const page of ALL_PAGES) {
  for (const rel of [page, `en/${page}`]) {
    if (!existsSync(`${SITE}/${rel}`)) throw new Error(`dist: ${rel} has not been built (npm run build)`);
    wanted.add(rel);
  }
}
const pageRels = [...wanted];

/* What a shipped stylesheet or script says (owner, 2026-10-10: nothing about
   upstream software; review, round 2: nor about the purchased templates, their
   vendors or the retired notices page). The source files keep their notes for
   whoever maintains them; the shipped copies do not:
   - every stylesheet loses its comments (tools/strip-comments.mjs), and so
     does every script of this site (js/stargo-*.js), which must still
     compile afterwards; licence banners (`/*! … *\/`) stay;
   - a stylesheet also loses the rules that would draw a picture for a block
     no page renders (tools/css-prune.mjs): a rule with a file in url() whose
     every selector names a class or id that is on no page and in no script.
     The templates' stock photographs those rules named stop shipping;
   - the third-party scripts (jQuery, GSAP, Lenis, the Webflow runtime) are
     minified and carry only their banners; a block comment in them that
     matches UPSTREAM is emptied;
   - the Webflow runtime's own test hook, `window.PLAYWRIGHT_TEST`, checked
     only inside the Webflow designer ("edit" module), is renamed — no
     visitor's page defines either name, so behaviour is unchanged.
   References are followed in what ships, not in the source: a file named
   only in a comment does not ship. The ?v= cache keys are computed from the
   source files and stay valid. */
const SCRUB = [[/window\.PLAYWRIGHT_TEST/g, 'window.__E2E_TEST__']];
const OWN_JS = /^js\/stargo-[\w-]+\.js$/;
const alive = (() => {
  const classes = new Set(), ids = new Set();
  let scripts = '';
  for (const rel of pageRels) {
    const html = readFileSync(`${SITE}/${rel}`, 'utf8');
    for (const m of html.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
    for (const m of html.matchAll(/\sid="([^"]*)"/g)) ids.add(m[1]);
    for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) scripts += `${m[1]}\n`;
  }
  for (const f of readdirSync(`${SITE}/js`)) if (/\.(?:js|json)$/.test(f)) scripts += `${readFileSync(`${SITE}/js/${f}`, 'utf8')}\n`;
  /* an interaction's target list (["wf:class",["image-about._01"]]) looks for the class; it never adds it */
  scripts = scripts.replace(/\["wf:class",\[[^\]]*\]/g, '');
  return (kind, name) => (kind === 'class' ? classes : ids).has(name) || scripts.includes(name);
})();
const shippedText = new Map();
let stripped = 0;
const prunedRules = [];
/** The text a page, stylesheet, script, SVG or JSON file ships with. */
function textOf(rel) {
  if (shippedText.has(rel)) return shippedText.get(rel);
  const before = readFileSync(`${SITE}/${rel}`, 'utf8');
  let after = before;
  if (rel.endsWith('.css')) {
    const pruned = pruneDeadImageRules(stripCss(before), alive);
    after = versionAssets(pruned.css);   // url(…?v=<key>), as the pages' own asset URLs (tools/asset-version.mjs)
    prunedRules.push(...pruned.dropped.map((sel) => `${rel}: ${sel}`));
  } else if (OWN_JS.test(rel)) {
    after = stripJs(before);
    try { new Script(after, { filename: rel }); } catch (e) { throw new Error(`dist: ${rel} does not compile once its comments are stripped: ${e.message}`); }
  } else if (rel.endsWith('.js')) after = before.replace(/\/\*(?!!)[\s\S]*?\*\//g, (c) => (UPSTREAM.some((re) => re.test(c)) ? '/* */' : c));
  if (/\.(?:css|js)$/.test(rel)) for (const [re, to] of SCRUB) after = after.replace(re, to);
  if (after !== before) stripped++;
  shippedText.set(rel, after);
  return after;
}

/* …and every file they reach. A reference is any assets/, css/ or js/ path in
   a page, stylesheet, script, SVG or JSON file as it ships: relative
   (../assets/…), root-absolute (/assets/…) or inside an absolute URL
   (og:image). Paths are URL-decoded (%20) and kept only when the file exists;
   text files are followed in turn. */
const REF = /(?:^|[\s"'(=,/])((?:assets|css|js)\/[^"'()\s<>,?#\\]+)/g;
const FOLLOW = /\.(?:html|css|js|svg|json)$/i;
const queue = [...wanted];
while (queue.length) {
  const rel = queue.shift();
  const text = textOf(rel);
  for (const m of text.matchAll(REF)) {
    let ref = m[1].replace(/[.;:]+$/, '');
    try { ref = decodeURIComponent(ref); } catch { /* keep it as written */ }
    if (wanted.has(ref) || SOURCE_ONLY.test(ref) || !existsSync(`${SITE}/${ref}`) || !statSync(`${SITE}/${ref}`).isFile()) continue;
    wanted.add(ref);
    if (FOLLOW.test(ref)) queue.push(ref);
  }
}
const GENERATED = ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'llms.txt'];
{
  const all = new Set();
  for (const d of ['assets', 'css', 'js']) if (existsSync(`${SITE}/${d}`)) walk(`${SITE}/${d}`, d, all);
  const kept = [...all].filter((f) => wanted.has(f)).length;
  console.log(`dist: ${kept} of ${all.size} files under assets/, css/ and js/ are referenced and ship; ${all.size - kept} unreferenced stay in the repository only`);
}

/* Copy, under the shipped names (tools/dist-names.mjs: no template or vendor
   name in a shipped file name), with the shipped text. */
const shipped = new Set(GENERATED);
for (const rel of wanted) {
  const out = distPath(rel);
  if (TEMPLATE_NAMES.test(out)) throw new Error(`dist: ${out} would ship under a template's or vendor's name (tools/dist-names.mjs)`);
  if (shipped.has(out)) throw new Error(`dist: two files would ship as ${out}`);
  shipped.add(out);
  const to = `${DIST}/${out}`;
  mkdirSync(to.slice(0, to.lastIndexOf('/')), { recursive: true });
  // copyFileSync after an explicit unlink: cpSync's own overwrite intermittently
  // fails on this volume with a spurious "operation completed successfully".
  if (existsSync(to)) { try { chmodSync(to, 0o666); unlinkSync(to); } catch (e) { console.warn(`could not replace ${out}: ${e.message}`); } }
  if (FOLLOW.test(rel)) writeFileSync(to, distText(textOf(rel)), 'utf8');
  else copyFileSync(`${SITE}/${rel}`, to);
}
console.log(`dist: comments stripped from ${stripped} stylesheets and scripts (licence banners kept); ${prunedRules.length} picture rules for blocks on no page dropped; ${[...wanted].filter((rel) => distPath(rel) !== rel).length} files shipped under neutral names`);

// A year, immutable, for /assets/*: every asset URL a page or stylesheet
// writes carries ?v=<sha256-12 of the file> (tools/asset-version.mjs; the
// guard below and tools/verify-release.mjs fail on one without it), so a
// changed file is a new URL. A day for css/ and js/ (also versioned), ten
// minutes for pages. The specific rule clears the general one first,
// otherwise Pages appends both values.
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

/* Cloudflare Pages redirects: retired addresses, in both languages, with and
   without .html, answer 301 with the page that replaced them — at its clean
   URL, the one the sitemap and rel=canonical name (review, round 3: a target
   of /terms.html took a second hop, Pages' own 308 to /terms).
   - notices → terms: the third-party notices page was removed on 2026-10-10
     (owner: 「移到产品里，网站不要写任何这种开源的东西」); the terms page now
     carries the imagery note.
   - the article on the 288 AI Staff kept "ai-employees" in its address after
     the owner's "AI Staff everywhere" (2026-10-10); renamed in round 3.
   The pairs are tools/dist-names.mjs RETIRED_PAGES (tools/verify-release.mjs
   reads them too); every target must be a page this build publishes. */
{
  const path = (lang, page) => `/${lang === 'en' ? 'en/' : ''}${page === 'index.html' ? '' : page.replace(/\.html$/, '')}`;
  const lines = [];
  for (const [from, to] of RETIRED_PAGES) {
    if (!SITE_PAGES.includes(to)) throw new Error(`dist: _redirects target ${to} is not a page the build publishes`);
    if (ALL_PAGES.has(from)) throw new Error(`dist: _redirects would send ${from} away, but the build still publishes it`);
    for (const lang of ['zh', 'en']) {
      const target = path(lang, to);
      if (new URL(cleanUrl(lang, to)).pathname !== target) throw new Error(`dist: _redirects target ${target} is not the clean URL ${cleanUrl(lang, to)}`);
      lines.push(`${path(lang, from)}.html ${target} 301`, `${path(lang, from)} ${target} 301`);
    }
  }
  writeFileSync(`${DIST}/_redirects`, `${lines.join('\n')}\n`);
}

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
      `<priority>${p === 'index.html' ? '1.0' : /privacy|terms/.test(p) ? '0.2' : p.startsWith('blog/') ? '0.6' : '0.8'}</priority></url>`);
  }
}
writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);

/* llms.txt (the llmstxt.org layout: a title, a one-line summary, then link
   lists). Everything a reader can check against the site: the product
   definition (V5 G01), the facts the owner confirmed on 2026-10-10 (every
   feature live, approvals set by the company, the operating company and its
   contact details; in English, then in Chinese), the ten role groups and their
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
    'STARGO WORK is the system; OPEN WORK is its core app. You ask in a chat, and AI works across the 15 apps in OPEN WORK’s sidebar — Owner Dashboard, Automation Center, Customer CRM, Knowledge Base, Prospecting, Sales Workbench, ERP, Growth Analytics, Workflow Engine, Channels, Store Admin (store orders and shipping), Control Center, Memory & Evolution, STARGO AI Digital Office and AI Gateway — to look things up and draft replies, quotes, PIs and outreach. Anything that goes to a customer waits for an authorized person. Principle: delegate the work, keep the authority. All 15 apps are available in OPEN WORK; connecting a company’s own mailbox, channels and systems needs its authorization, and STARGO helps set it up. Product images on the site are demonstration interfaces with demo data, shown in Chinese.',
    '',
    'STARGO WORK 是外贸工厂的 AI 工作台，核心应用是 OPEN WORK。在对话里交代任务，AI 去侧栏里的 15 个应用——老板看板、自动化中心、客户CRM、企业知识库、主动获客、销售工作台、企业ERP、增长分析、工作流引擎、渠道接入、商城后端管理（商城订单发货）、控制中心、记忆与进化、STARGO AI 数字办公室、AI 网关——查资料、写回复、报价、PI 和开发信；要发给客户的内容，先由有权人批准。原则：把工作交给 AI，把决定权留在企业。15 个应用都已在 OPEN WORK 里可用；接入企业自己的邮箱、渠道和系统需要企业授权，我们帮你配置。站内产品图是带演示数据的演示界面。',
    '',
    '## Key facts',
    '',
    '- Prospecting is available: it finds dealers, importers, wholesalers and target accounts, researches them, ranks opportunities and prepares outreach; approved prospects move into the Sales Workbench with their context. A company’s own data sources and outreach channels connect with its authorization.',
    '- The Sales Workbench is available: inquiries and messages arrive in one intake, and customer records, product fit, replies, follow-up, quotes and PI run through to the order handoff. A company’s own email, WhatsApp, Alibaba.com and website channels connect with its authorization.',
    '- Quotes and PI follow company-approved prices, discount permissions and margin guardrails. A unit price below the standard price goes automatically to the sales manager for approval; the company sets the approver and the price floor. Approval and sending are separate controls.',
    '- Follow-up reads the CRM timeline, quotes and sample status, lists who is due and why, and drafts each message for approval.',
    '- The ERP covers products, materials, purchasing, stock, production, quality, orders and invoices; Store Admin manages shipping for store orders. Official filings, payments and professional reviews are confirmed by authorized people.',
    `- STARGO WORK has 288 AI Staff across ten enterprise function groups: ${groups.map((g) => `${g.name.en} ${g.count}`).join(', ')} (total ${total}). 288 is the size of the roster, not a claim to replace 288 people; which AI Staff a company uses, how many work together and what they may do is set by the company, within its budget and permissions.`,
    '- AI teamwork is available: several AI Staff form a team for one task, message each other, work in parallel, and a coordinating role checks and consolidates one result for a person to confirm. Collaboration rounds, budgets and permitted actions are capped; work can be stopped at any time; human approval, pause and takeover remain; shared task context does not grant other AI Staff members’ permissions; external actions need an authorized approval.',
    '- One-click AI video is available: brief, script, storyboard, visuals, voiceover, captions and export of a playable, exportable file in portrait, landscape or square, with a reviewable production plan, individually redone shots and recorded versions and costs. Finished videos are reviewed by people before publishing; generation runs within the services and credits the company enables; assets must be ones the company may use.',
    '- Viral creative adaptation is available: an authorized reference video is analyzed for structure and rebuilt around your product and brand as three original directions. It never copies footage, faces, voices, music, logos or watermarks, and viral performance is not guaranteed.',
    '- AI images and brand content are available: product images, scenes, posters and multilingual copy from verified product facts; publishing to external channels needs separate authorization.',
    '- The Knowledge Base, the business relationship map, proactive reminders, long-term memory and continuous improvement (Memory & Evolution) are available. Proactive work is not consciousness or unrestricted autonomy; people keep the judgment calls.',
    '- OPEN WORK runs in the browser. Voice-to-task and authorized web operations are available. The Owner Dashboard shows metrics only from connected data.',
    '- Human control: authorized people approve quotations, outreach, important commitments, official filings and payments. Approved is not sent, and sent is not received or done.',
    '- Website operations is a service package: when a company works with STARGO, STARGO runs and manages its website. Quoted on request.',
    `- Operated by ${CONTACT_INFO.company} (brand STARGO), Liuzhou, Guangxi, China. Contact: ${CONTACT_INFO.email} · WeChat ${CONTACT_INFO.wechat} · phone / WhatsApp ${CONTACT_INFO.phone}. We reply within 12 hours; demos on-site or online.`,
    '',
    // The same facts in Chinese, in the site's own terms: most buyers ask in Chinese.
    '## 要点（中文）',
    '',
    '- 主动获客已可用：寻找经销商、进口商、批发商和目标企业，完成背调、判断商机并准备开发计划；确认后的客户连同背景转入销售工作台。企业自己的数据来源和触达渠道，经企业授权接入。',
    '- 销售工作台已可用：询盘与消息统一入口，客户资料、产品匹配、回复、跟进、报价和 PI 一直连到订单交接。企业自己的邮箱、WhatsApp、阿里国际站和网站渠道，经企业授权接入。',
    '- 报价与 PI 按企业确认的价格、折扣权限和利润边界起草；单价低于标准价，自动交销售经理审批，审批人和价格底线由企业自己设定；批准与发送分别受控。',
    '- 跟进客户时，AI 读取客户CRM 时间线、报价和寄样状态，列出该跟进的客户和原因，并起草跟进消息等你批准。',
    '- 企业ERP 覆盖产品物料、采购、库存、生产质检、订单与发票；商城后端管理负责商城订单的发货。正式申报、付款和专业审阅由有权人员确认。',
    `- STARGO WORK 有 288 名数字员工，覆盖十类企业职能：${groups.map((g) => `${g.name.zh} ${g.count}`).join('、')}（合计 ${total}）。288 是名册的规模，不代表替代 288 名真人；用哪些员工、几位一起协作、能做哪些动作，由企业按自己的预算和权限来定。`,
    '- 数字员工团队协作已可用：多名数字员工为同一任务组队、互发消息、并行处理，由统筹角色检查并汇总成一个结果交人确认。协作轮次、预算和可执行动作都有上限，随时可以叫停；人工审批、暂停与接管始终保留；共享任务信息不授予其他员工的权限；对外动作须经授权审批。',
    '- AI 一键生成视频已可用：制作需求、脚本、分镜、画面、配音、字幕到导出，交付竖版、横版或方版的可播放、可导出视频文件；生成前先审阅制作方案，失败镜头单独重做，版本与成本有记录。成片经人工审核后发布；生成按企业开通的服务与额度运行；所用素材须是企业有权使用的。',
    '- 爆款结构再创作已可用：拆解有权使用的参考视频的结构，结合自身产品与品牌形成三个原创方向。不复制原片、人脸、声音、音乐、标志或水印，不承诺必成爆款。',
    '- AI 作图与品牌内容已可用：从已核实的产品资料出发，产出产品图、场景图、海报和多语言文案；发布到外部渠道需单独授权。',
    '- 企业知识库、业务关系图、主动提醒、长期记忆与持续改进（记忆与进化）都已可用。主动工作不是人的意识，也不是无限制的自主决定，关键判断由人负责。',
    '- OPEN WORK 在浏览器里使用；语音转任务和授权网页操作都已可用。老板看板的指标只来自已接入的数据。',
    '- 人的决定权：报价、对外触达、重要承诺、正式申报和资金支付由有权人员批准。已批准不等于已发送，已发送不等于已收到或已办完。',
    '- 网站运营管理是我们的服务包：和我们合作，你的官网可以交给我们运营和管理。按需报价。',
    `- 运营方：${CONTACT_INFO.company}（品牌 STARGO，柳州 · 广西 · 中国）。联系：${CONTACT_INFO.email} · 微信 ${CONTACT_INFO.wechat} · 电话 / WhatsApp ${CONTACT_INFO.phone}。12 小时内回复，上门或远程演示均可。`,
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

/* The guard: no shipped file may carry an upstream software name, open-source
   wording or a licence listing — in its name, or in its text (pages, styles,
   scripts, SVG, JSON, sitemap, robots, llms.txt, _headers, _redirects), or in
   the readable strings of a binary file (what `strings` prints: runs of four
   or more printable ASCII characters). A film must not name its encoder
   either: x264 writes its name, licence and web address into the stream, and
   ffmpeg tags streams "Lavc …" (review, round 2; tools/openwork/video.mjs
   copies the films without them). Case-sensitive, so compressed bytes do not
   match by chance. */
{
  const hits = [];
  const TEXT = /\.(?:html|css|js|svg|json|xml|txt)$|^_(?:headers|redirects)$/;
  const ENCODER = /Copyleft|videolan|\bx264\b|libx264|libvpx|\bLavc\b/;
  for (const rel of shipped) {
    for (const re of UPSTREAM) if (re.test(rel)) hits.push(`${rel}: file name matches ${re}`);
    if (!TEXT.test(rel.split('/').pop())) {
      const strings = (readFileSync(`${DIST}/${rel}`).toString('latin1').match(/[\x20-\x7e]{4,}/g) ?? []).join('\n');
      for (const re of [...UPSTREAM, ...(/\.(?:mp4|webm|mov|m4v)$/i.test(rel) ? [ENCODER] : [])]) {
        const m = strings.match(re);
        if (m) hits.push(`${rel}: ${m[0]} … ${strings.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' ')}`);
      }
      continue;
    }
    const text = readFileSync(`${DIST}/${rel}`, 'utf8');
    for (const re of UPSTREAM) {
      const m = text.match(re);
      if (m) hits.push(`${rel}: ${m[0]} … ${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}`);
    }
    /* nor a renamed file under its repository name */
    for (const [from] of DIST_NAMES) if (text.includes(from)) hits.push(`${rel}: names ${from} (tools/dist-names.mjs)`);
    /* and a page or stylesheet names every asset with the key of the file that ships (tools/asset-version.mjs) */
    if (/\.(?:html|css)$/.test(rel)) for (const ref of unversionedAssets(text, DIST)) hits.push(`${rel}: ${ref} has no current ?v= cache key`);
  }
  if (hits.length) throw new Error(`dist: upstream software or open-source wording, or an unversioned asset URL, would ship:\n  ${hits.join('\n  ')}`);
}

// Prune what the source tree no longer has.
const present = new Set();
walk(DIST, '', present);
let pruned = 0;
for (const rel of present) {
  if (shipped.has(rel)) continue;
  const p = `${DIST}/${rel}`;
  try { chmodSync(p, 0o666); unlinkSync(p); pruned++; } catch (e) { console.warn(`could not remove stale ${rel}: ${e.message}`); }
}
const pruneDirs = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) pruneDirs(`${dir}/${e.name}`);
  if (dir !== DIST && readdirSync(dir).length === 0) rmdirSync(dir);
};
pruneDirs(DIST);
console.log(`dist: ${shipped.size} files (${pruned} stale removed)`);
