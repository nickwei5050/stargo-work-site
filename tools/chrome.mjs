/**
 * Site chrome shared by every page: navigation, overlay menu, floating pill,
 * footer, head metadata (canonical, hreflang, Open Graph, structured data),
 * script tags, the brand wordmark, the language switch, link hygiene and the
 * template's shared English strings — in both languages.
 *
 * Links are REGENERATED from one list, not edited in place. The Mono export
 * carries three copies of its navigation on every page (top bar, overlay
 * menu, bottom pill) plus a footer "Pages" grid, and each page was exported
 * with a different subset. Rewriting text in place would leave whichever copy
 * did not match pointing at a template page that no longer exists.
 *
 * Pages may live one folder down (blog/<slug>.html, en/blog/<slug>.html). Every
 * page is generated with root-relative names (contact.html, assets/…) and the
 * build relocates links and assets with relocateLinks / relocateAssets.
 */
import { makeSub, findByClass, extractElement } from './lib-html.mjs';
import { editorialImages } from './editorial-images.mjs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { CAP_JUMPS, NAV, NAV_CTA, SECONDARY, MORE, LANG_SWITCH, CHROME, META, CONTACT_INFO, SITE_URL } from './copy.mjs';
import { POSTS, BLOG_UI, postPath, coverShareSrc, coverAlt, faqEntities, wordCount } from './blog.mjs';
import { OG, OS_ART } from './replaceables.mjs';
import { versionAssets } from './asset-version.mjs';

/** Every page the build produces, as root-relative names. */
export const SITE_PAGES = [...NAV, ...SECONDARY, ...MORE].map((n) => n.href).concat(POSTS.map(postPath));
export const ALL_PAGES = new Set([...SITE_PAGES, '404.html']);
export const WORDMARK = 'assets/brand/stargo-wordmark-600.png';
const AVATAR = 'assets/stargo/avatar-core.png';
/** Share cover. Token is rewritten to OG.file (og-cover.png, 1200×630). See tools/replaceables.mjs. */
const OG_IMAGE = OG.token;
/* What the share image shows, for og:image:alt / twitter:image:alt (screen readers and link previews).
   Articles describe their own cover (tools/blog.mjs coverAlt). */
const OG_ALT = {
  zh: 'STARGO WORK：外贸工厂的 AI 工作台。窗口里是 OPEN WORK 分析询盘、起草英文回复的界面，演示数据。',
  en: 'STARGO WORK, the AI workspace for export manufacturers: the OPEN WORK screen analyzing an inquiry and drafting a reply. Demo data, interface shown in Chinese.',
};
const attr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Product screens that replace the template's photo strips (overlay menu) and image rotator (contact band).
    Not the retired desktop (os-desktop, 「系统地图」) or the creative-studio mock-up with a stock
    portrait as its user (os-boot): phase C2, 2026-10-09 (tools/build-site.mjs STOCK). Since C2 pass 2
    not the two the image catalogue rates weak for painted English slogans either (os-trade-execution:
    「GLOBAL CONNECTIONS」 on containers and a crane; os-sales-desk: a slogan on the wall). */
export const SCREENS = Object.entries(OS_ART).filter(([k]) => !['desktop', 'boot', 'tradeExecution', 'salesDesk'].includes(k)).map(([, n]) => `assets/stargo/${n}.webp`);

/** Template pages that no longer exist and where each now lives. Real pages are never listed here. */
const LEGACY = {
  'studio.html': 'enterprise.html',
  'work_work-1.html': 'capabilities.html', 'work_work-2.html': 'capabilities.html', 'work_work-3.html': 'workforce.html',
  'blog_blog-1.html': 'blog.html', 'blog_blog-2.html': 'blog.html', 'blog_blog-3.html': 'blog.html',
  'contact_contact-1.html': 'contact.html', 'contact_contact-2.html': 'contact.html', 'contact_contact-3.html': 'contact.html',
  'project_forma-digital.html': 'index.html', 'project_nero-vision.html': 'index.html',
  'project_one-step.html': 'index.html', 'project_bold-moves.html': 'index.html',
  '401.html': 'index.html',
  'post_the-power-of-simplicity-in-modern-brand-design.html': 'blog.html',
  'post_from-idea-to-execution-building-products-that-last.html': 'blog.html',
  'post_why-great-brands-are-built-on-clarity-not-complexity.html': 'blog.html',
  'post_designing-digital-systems-that-scale-with-your-business.html': 'blog.html',
  'company.html': 'enterprise.html', 'feature.html': 'capabilities.html',
};

const postOf = (current) => POSTS.find((p) => postPath(p) === current);

/* ------------------------------------------------------------ helpers -- */

function firstLink(block) {
  const m = block.match(/<a\b[^>]*>[\s\S]*?<\/a>/);
  if (!m) throw new Error('chrome: no <a> template in block');
  return extractElement(block, m.index, 'a').text;
}

function renderLink(tpl, { href, label, lang }, current) {
  let out = tpl
    .replace(/\s*aria-current="page"/, '')
    .replace(/ w--current\b/, '')
    .replace(/href="[^"]*"/, `href="${href}"`)
    .replace(/(<div class="navigation-text-main[^"]*">)[^<]*(<\/div>)/, `$1${label}$2`)
    .replace(/(<div class="button-text[^"]*">)[^<]*(<\/div>)/g, `$1${label}$2`);
  if (lang) out = out.replace(/<a\b/, `<a hreflang="${lang}" lang="${lang}"`);
  if (current) out = out.replace(/<a\b/, '<a aria-current="page"').replace(/class="([^"]*)"/, 'class="$1 w--current"');
  return out;
}

function replaceInner(html, el, inner) {
  const openEnd = el.text.indexOf('>') + 1;
  const closeLen = el.text.length - el.text.lastIndexOf('</');
  return html.slice(0, el.start + openEnd) + inner + html.slice(el.end - closeLen);
}

/** A `w-background-video` block becomes a still image (same box, same interactions, no video). */
export function stillImage(html, videoId, src, alt = '') {
  const i = html.indexOf(`id="${videoId}-video"`);
  if (i === -1) throw new Error(`still: video ${videoId} not found`);
  const vStart = html.lastIndexOf('<video', i);
  const vEnd = html.indexOf('</video>', i) + '</video>'.length;
  const wrapStart = html.lastIndexOf('<div', vStart);
  let wrap = html.slice(wrapStart, vStart).replace(/\s*data-(video-urls|poster-url|autoplay|loop)="[^"]*"/g, '');
  return html.slice(0, wrapStart) + wrap + `<img src="${src}" alt="${alt}" loading="lazy" class="stargo-still"/>` + html.slice(vEnd);
}

/* -------------------------------------------------------------- parts -- */

/** An article page counts as being inside the blog for the navigation's current-page marker. */
const isCurrent = (href, current) => href === current || (href === 'blog.html' && current.startsWith('blog/'));

function links(lang, current) {
  const t = (p) => p[lang];
  const other = lang === 'zh' ? `en/${current}` : `../${current}`;
  const nav = NAV.map((n) => ({ href: n.href, label: t(n.label) }));
  const more = MORE.map((n) => ({ href: n.href, label: t(n.label) }));
  const secondary = SECONDARY.map((n) => ({ href: n.href, label: t(n.label) }));
  const cta = { href: NAV_CTA.href, label: t(NAV_CTA.label) };
  const swap = { href: other, label: t(LANG_SWITCH), swap: true, lang: lang === 'zh' ? 'en' : 'zh-CN' };
  /* The four stages a buyer looks for, jumping straight to their block on the
     capability page. They take the pill's middle slot, where a wordmark that
     linked home used to sit. From the capability page itself they are in-page
     anchors; from anywhere else they carry the page with them. */
  const onCaps = current === 'capabilities.html';
  const capJumps = CAP_JUMPS.map((c) => ({
    href: onCaps ? `#${c.anchor}` : `capabilities.html#${c.anchor}`,
    label: t(c.label),
  }));
  /* any page by its address, whichever list it sits in */
  const byHref = (h) => {
    const hit = [...nav, ...more, ...secondary].find((n) => n.href === h);
    if (!hit) throw new Error(`chrome: ${h} is in no navigation list`);
    return hit;
  };
  return { nav, more, secondary, cta, swap, capJumps, byHref };
}

function topNav(html, L, current) {
  const m = html.match(/<nav role="navigation" class="nav-menu first w-nav-menu">[\s\S]*?<\/nav>/);
  if (!m) throw new Error('chrome: top nav not found');
  const tpl = firstLink(m[0]);
  /* buyer-plan S0: 产品 · 安全与接入 · 定价 · 关于, the language switch and one
     【预约演示】 button. The wordmark is the home link. The MORE pages (数字员工,
     提醒与记忆, 博客) are in the same list as `.stargo-nav-more`: hidden in the
     desktop bar (css/stargo-fusion.css), shown in the phone menu, which is this
     list collapsed (Webflow, below 992px) and the only menu a phone has. */
  const main = L.nav.slice(1).map((n) => renderLink(tpl, n, isCurrent(n.href, current))).join('');
  const more = L.more.filter((n) => n.href !== L.cta.href)
    .map((n) => renderLink(tpl, n, isCurrent(n.href, current)).replace(/class="button-link /, 'class="button-link stargo-nav-more ')).join('');
  const swap = renderLink(tpl, L.swap, false);
  const cur = isCurrent(L.cta.href, current);
  const cta = `<a href="${L.cta.href}" class="button-link stargo-nav-cta w-inline-block${cur ? ' w--current' : ''}"${cur ? ' aria-current="page"' : ''}><div class="navigation-text-main">${L.cta.label}</div></a>`;
  if ((more.match(/stargo-nav-more/g) ?? []).length !== L.more.length - 1) throw new Error('chrome: top nav "more" links not marked');
  return html.replace(m[0], `<nav role="navigation" class="nav-menu first w-nav-menu">${main}${more}${swap}${cta}</nav>`);
}

/** Overlay menu: the product pages, About and Blog, and the language switch. Legal pages sit in its bottom row and in the footer. */
function overlayMenu(html, L, current) {
  const flex = findByClass(html, 'div', 'nav-top-flex');
  if (!flex) {
    /* A header with no side menu behind it: the 404 page, whose Mono template
       ships the header alone. Its two-line icon has nothing to open (a plain
       <div> that ignored clicks and could not be focused), so it goes. The
       header's own menu button stays: it is Webflow's collapsed navigation, the
       same button every other page uses below 992px, and without it a phone
       or tablet had no way off the 404 page but the logo. */
    if (!html.includes('menu-wrapper')) {
      const icon = /<div data-w-id="[^"]*" class="circle-wrap">(?:<div class="line-divider-menu [^"]*"><\/div>)+<\/div>/g;
      const n = (html.match(icon) ?? []).length;
      if (n !== 1) throw new Error(`chrome: expected one side menu icon on a page without a side menu, found ${n}`);
      if (!html.includes('<div class="menu-button w-nav-button">')) throw new Error('chrome: header menu button not found');
      return html.replace(icon, '');
    }
    throw new Error('chrome: overlay menu not found');
  }
  const item = findByClass(flex.text, 'div', 'menu-item');
  const linkTpl = firstLink(item.text);
  const items = [...L.nav, ...L.more, L.swap].map((n, i) =>
    `<div class="menu-item _${String(i + 1).padStart(2, '0')}">${renderLink(linkTpl, n, isCurrent(n.href, current))}</div>`).join('');
  return replaceInner(html, flex, items);
}

/**
 * The floating pill. It used to read 能力 · 数字员工 · [STARGO] · 定价 · 联系, with
 * the wordmark taking the middle slot — a logo that goes nowhere, in the one
 * place on screen a reader can always reach. The wordmark is gone and the four
 * capabilities a buyer actually looks for take its place, jumping straight to
 * their block on the capability page from wherever the reader happens to be.
 */
function bottomPill(html, L, current) {
  const pill = findByClass(html, 'div', 'menu-bottom');
  if (!pill) return html;
  let text = pill.text;
  const left = findByClass(text, 'div', 'menu-first-bottom', 0);
  const tpl = firstLink(left.text);
  const render = (list) => list.map((n) => renderLink(tpl, n, isCurrent(n.href, current))).join('');
  const byHref = L.byHref;
  text = text.slice(0, left.start) + `<div class="menu-first-bottom">${render([byHref('capabilities.html'), byHref('workforce.html')])}</div>` + text.slice(left.end);
  const right = findByClass(text, 'div', 'menu-first-bottom', 1);
  text = text.slice(0, right.start) + `<div class="menu-first-bottom right">${render([byHref('pricing.html'), byHref('contact.html')])}</div>` + text.slice(right.end);
  /* the wordmark in the middle becomes the capability jumps */
  const mark = findByClass(text, 'div', 'logo-bottom-menu', 0);
  if (mark) {
    const jumps = L.capJumps.map((j) => renderLink(tpl, j, false)).join('');
    text = text.slice(0, mark.start) + `<div class="menu-first-bottom caps">${jumps}</div>` + text.slice(mark.end);
  }
  return html.slice(0, pill.start) + text + html.slice(pill.end);
}

function footerPages(html, L, current) {
  const grid = findByClass(html, 'div', 'footer-small-grid');
  if (!grid) throw new Error('chrome: footer pages grid not found');
  const tpl = firstLink(grid.text);
  /* the main pages, the MORE pages with the language switch, the legal pages */
  const cols = [L.nav, [...L.more, L.swap], L.secondary];
  const inner = cols.map((c) => `<div class="flex-item">${c.map((x) => renderLink(tpl, x, isCurrent(x.href, current))).join('')}</div>`).join('');
  return replaceInner(html, grid, inner);
}

/** The metallic STARGO wordmark replaces the template's two-word text logo. */
function wordmark(html) {
  const img = (cls) => `<img src="${WORDMARK}" alt="STARGO WORK" class="stargo-wordmark ${cls}"/>`;
  return html
    .replace(/<p class="top-text logo">(?:Mōno™|STARGO)<\/p><p class="top-text logo z-inxed">(?:Studio|WORK)<\/p>/g, img('in-nav'))
    .replace(/<p class="top-text logo inv">(?:Mōno™|STARGO)<\/p><p class="top-text logo z-inxed nrm">(?:Studio|WORK)<\/p>/g, img('in-footer'))
    .replace(/<p class="top-text logo no-bg">(?:Mōno™|STARGO)<\/p>/g, img('in-pill'))
    .replace(/<p class="top-text logo nbg">(?:Mōno™|STARGO)<\/p>/g, img('in-card'));
}

/** Clean URL of a page as Cloudflare Pages serves it. */
export const cleanUrl = (lang, page) => {
  const p = page === 'index.html' ? '' : page.replace(/\.html$/, '');
  return lang === 'zh' ? `${SITE_URL}/${p}` : `${SITE_URL}/en/${p}`;
};

const ORG_ID = `${SITE_URL}/#org`;
const SITE_ID = `${SITE_URL}/#site`;

function head(html, lang, current) {
  const post = postOf(current);
  const meta = META[current] ?? (post && { title: post.title, description: post.description });
  if (!meta) throw new Error(`chrome: no metadata for ${current}`);
  const title = current === 'index.html' ? meta.title[lang] : `${meta.title[lang]} — STARGO WORK`;
  const description = meta.description[lang];
  const self = cleanUrl(lang, current);
  const zh = cleanUrl('zh', current);
  const en = cleanUrl('en', current);
  const inLanguage = lang === 'zh' ? 'zh-CN' : 'en';
  const ogImage = post ? `${SITE_URL}/${coverShareSrc(post)}` : `${SITE_URL}/${OG_IMAGE}`;
  const pageType = current === 'about.html' ? 'AboutPage' : current === 'blog.html' ? 'CollectionPage' : current === 'contact.html' ? 'ContactPage' : 'WebPage';
  const blogUrl = cleanUrl(lang, 'blog.html');
  const graph = [
    { '@type': 'Organization', '@id': ORG_ID, name: 'STARGO WORK', legalName: CONTACT_INFO.company, url: `${SITE_URL}/`, logo: `${SITE_URL}/${WORDMARK}`, email: CONTACT_INFO.email, telephone: CONTACT_INFO.phone, address: { '@type': 'PostalAddress', addressLocality: 'Liuzhou', addressRegion: 'Guangxi', addressCountry: 'CN' }, sameAs: [CONTACT_INFO.siteHref] },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${SITE_URL}/`, name: 'STARGO WORK', inLanguage: ['zh-CN', 'en'], publisher: { '@id': ORG_ID } },
    { '@type': pageType, '@id': self, url: self, name: title, description, inLanguage, isPartOf: { '@id': SITE_ID }, ...(post ? { primaryImageOfPage: ogImage } : {}) },
  ];
  if (current === 'index.html') {
    graph.push({ '@type': 'SoftwareApplication', name: 'STARGO WORK', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: `${SITE_URL}/`, description, offers: { '@type': 'AggregateOffer', priceCurrency: 'CNY', lowPrice: '10000', highPrice: '40000', offerCount: 4 }, provider: { '@id': ORG_ID } });
  }
  if (current === 'blog.html') {
    graph.push({
      '@type': 'Blog', '@id': `${blogUrl}#blog`, url: blogUrl, name: `STARGO WORK ${BLOG_UI.section[lang]}`, description, inLanguage, publisher: { '@id': ORG_ID },
      blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', '@id': `${cleanUrl(lang, postPath(p))}#article`, headline: p.title[lang], url: cleanUrl(lang, postPath(p)), datePublished: p.date, dateModified: p.modified ?? p.date, image: `${SITE_URL}/${coverShareSrc(p)}` })),
    });
  }
  if (post) {
    /* BlogPosting. `wordCount` is tools/blog.mjs wordCount() over the printed
       article (body, takeaways, FAQ): words on English pages, characters on
       Chinese pages (each Han character one, each Latin or numeric run one).
       `about` is the product the blog explains; `mentions` names the product
       engines an article is about (schema.org Thing), where it lists any. */
    graph.push({
      '@type': 'BlogPosting', '@id': `${self}#article`, headline: post.title[lang], description, image: ogImage, url: self, mainEntityOfPage: { '@id': self },
      datePublished: post.date, dateModified: post.modified ?? post.date, inLanguage, keywords: post.keywords[lang].join(', '),
      ...(post.section ? { articleSection: post.section[lang] } : {}),
      wordCount: wordCount(post, lang),
      about: { '@type': 'SoftwareApplication', name: 'STARGO WORK', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: `${SITE_URL}/` },
      ...(post.mentions?.length ? { mentions: post.mentions.map((name) => ({ '@type': 'Thing', name })) } : {}),
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'STARGO WORK' }, publisher: { '@id': ORG_ID }, isPartOf: { '@id': `${blogUrl}#blog` },
    });
    /* The article's visible 「常见问题」 section (tools/blog.mjs renderFaq) as
       structured data: the same questions and answers, word for word. */
    if (post.faq?.length) {
      graph.push({ '@type': 'FAQPage', '@id': `${self}#faq`, url: self, inLanguage, isPartOf: { '@id': self }, mainEntity: faqEntities(post, lang) });
    }
    graph.push({
      '@type': 'BreadcrumbList', '@id': `${self}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: NAV[0].label[lang], item: cleanUrl(lang, 'index.html') },
        { '@type': 'ListItem', position: 2, name: BLOG_UI.section[lang], item: blogUrl },
        { '@type': 'ListItem', position: 3, name: post.title[lang], item: self },
      ],
    });
  }
  const ld = { '@context': 'https://schema.org', '@graph': graph };
  const extra = [
    `<link rel="canonical" href="${self}"/>`,
    `<link rel="alternate" hreflang="zh-CN" href="${zh}"/>`,
    `<link rel="alternate" hreflang="en" href="${en}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${zh}"/>`,
    `<meta property="og:url" content="${self}"/>`,
    `<meta property="og:type" content="${post ? 'article' : 'website'}"/>`,
    '<meta property="og:site_name" content="STARGO WORK"/>',
    `<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}"/>`,
    `<meta property="og:image" content="${ogImage}"/>`,
    `<meta property="og:image:alt" content="${attr(post ? coverAlt(post, lang) : OG_ALT[lang])}"/>`,
    post ? '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="600"/>' : '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>',
    ...(post ? [`<meta property="article:published_time" content="${post.date}"/>`, `<meta property="article:modified_time" content="${post.modified ?? post.date}"/>`, `<meta property="article:section" content="${(post.section ?? BLOG_UI.section)[lang]}"/>`, ...post.keywords[lang].map((k) => `<meta property="article:tag" content="${k}"/>`)] : []),
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:image" content="${ogImage}"/>`,
    `<meta name="twitter:image:alt" content="${attr(post ? coverAlt(post, lang) : OG_ALT[lang])}"/>`,
    '<meta name="theme-color" content="#f8faff"/>',
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,   // no "</script>" can end the block early
  ].join('');
  let out = html
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')   // the template's own structured data
    .replace(/<html([^>]*)lang="en"/, `<html$1lang="${inLanguage}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>${extra}`)
    .replace(/<meta content="[^"]*" (name|property)="(description|og:description|twitter:description)"\/>/g, `<meta content="${description}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" (name|property)="(og:title|twitter:title)"\/>/g, `<meta content="${title}" $1="$2"/>`)
    /* The templates' own share images. Both spellings: Mono's exported CMS post
       writes `name="twitter:image"`, and only `property=` was matched, so
       notices, privacy and terms — the six pages built from that template —
       kept a second twitter:image pointing at the template's studio-table
       photograph while the one written above named our cover. */
    .replace(/<meta content="[^"]*" (?:name|property)="og:image"\/>/g, '')
    .replace(/<meta content="[^"]*" (?:name|property)="twitter:image"\/>/g, '')
    .replace(/<meta content="[^"]*" (?:name|property)="twitter:card"\/>/g, '')   // regenerated above: the template's own copy made it appear twice
    .replace(/<meta property="og:type" content="website"\/>/, '')                // regenerated above (article for posts)
    /* The tab icon. It pointed at the wordmark, which is a 139:22 lozenge: in a
       16px tab that is an unreadable smear, which is what the owner saw. The
       brand's square mark is used instead, cut to the sizes browsers actually
       ask for — 16 and 32 for the tab, 48 for Windows' shortcut, 180 for iOS's
       home screen. `shortcut icon` stays for browsers that only read that.
       relocateAssets() prefixes ../ for pages below the root. */
    .replace(/<link href="[^"]*" rel="shortcut icon" type="image\/x-icon"\/>/,
      '<link href="assets/brand/stargo-icon-32.png" rel="shortcut icon" type="image/png"/>'
      + '<link href="assets/brand/stargo-icon-16.png" rel="icon" type="image/png" sizes="16x16"/>'
      + '<link href="assets/brand/stargo-icon-32.png" rel="icon" type="image/png" sizes="32x32"/>'
      + '<link href="assets/brand/stargo-icon-48.png" rel="icon" type="image/png" sizes="48x48"/>')
    .replace(/<link href="[^"]*" rel="apple-touch-icon"\/>/, '<link href="assets/brand/stargo-icon-180.png" rel="apple-touch-icon" sizes="180x180"/>');
  const headText = out.slice(0, out.indexOf('<body')).replace(/<link[^>]*>/g, '');
  if (/Mōno|monostudio|Scalora|Lifelogx/i.test(headText)) throw new Error(`chrome: template metadata survives in <head> of ${current}`);
  return out;
}

function scripts(html) {
  let out = html
    .replace(/js\/app\.[0-9a-f]{8}\.[0-9a-f]{16}\.js/g, 'js/app.fused.js')
    .replace(/js\/(gsap|SplitText|ScrollTrigger)\.min_1\.js/g, 'js/$1.min.js');
  if ((out.match(/js\/app\.fused\.js/g) ?? []).length !== 1) throw new Error('chrome: expected exactly one page bundle');
  out = out
    .replace(/data-wf-page="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page="699b6466d5f19893993a4bf1"')
    .replace(/data-wf-page-id="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page-id="699b6466d5f19893993a4bf1"')
    .replace(/\[\[\[&quot;699b6466d5f19893993a4[0-9a-f]{3}&quot;,/g, '[[[&quot;699b6466d5f19893993a4bf1&quot;,');
  /* Site overrides load on every page, after the template stylesheets — and
     that means after ALL of them, not just after Mono's. A donor block brings
     its own sheet, and its rules land at the same specificity as ours (both
     write `.cn-service .cn-service-title`), so whichever loads last wins.
     Anchored to the Mono link, this sheet slipped in front of the donor sheets
     and every fusion rule written against a transplanted block was inert. */
  if (!out.includes('css/stargo-fusion.css')) {
    const links = [...out.matchAll(/<link href="css\/[^"]+\.css" rel="stylesheet" type="text\/css"\/>/g)];
    if (!links.length) throw new Error('chrome: no template stylesheet to attach stargo-fusion.css after');
    const last = links[links.length - 1];
    const at = last.index + last[0].length;
    out = `${out.slice(0, at)}\n<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>${out.slice(at)}`;
  }
  // Chinese word segmentation for SplitText; must sit between SplitText and the engine's DOM-ready run.
  if (!out.includes('js/stargo-splittext-cjk.js')) {
    out = out.replace('<script src="js/SplitText.min.js" type="text/javascript"></script>', '<script src="js/SplitText.min.js" type="text/javascript"></script><script src="js/stargo-splittext-cjk.js"></script>');
    if (!out.includes('js/stargo-splittext-cjk.js')) throw new Error('chrome: SplitText script tag not found');
  }
  /* Elements Webflow animates on scroll ship at inline opacity:0, so arriving on
     an anchor — which the floating pill and the hero button both do — leaves
     everything above the landing point invisible for good. Runs after the
     runtime, so it must load after the bundle. */
  if (!out.includes('js/stargo-ix-arrival.js')) {
    out = out.replace('<script src="js/app.fused.js"', '<script src="js/stargo-ix-arrival.js" defer></script><script src="js/app.fused.js"');
    if (!out.includes('js/stargo-ix-arrival.js')) throw new Error('chrome: page bundle script tag not found');
  }
  // Shorter copy on phones must be in place before the page bundle splits the text.
  if (!out.includes('js/stargo-mobile-copy.js')) {
    out = out.replace('<script src="js/app.fused.js"', '<script src="js/stargo-mobile-copy.js"></script><script src="js/app.fused.js"');
    if (!out.includes('js/stargo-mobile-copy.js')) throw new Error('chrome: bundle script tag not found');
  }
  /* The homepage builder does not emit the opening overlay. If a stale
     `data-og-intro` node is ever present, this script removes it and does not
     play the wipe. `defer` keeps it after the classic scripts. */
  if (out.includes('data-og-intro') && !out.includes('js/stargo-intro.js')) {
    out = out.replace('</body>', '<script src="js/stargo-intro.js" defer></script></body>');
    if (!out.includes('js/stargo-intro.js')) throw new Error('chrome: no </body> to attach the opening animation to');
  }
  if (!out.includes('js/stargo-forms.js')) out = out.replace('</body>', '<script src="js/stargo-forms.js"></script></body>');
  if (!out.includes('js/stargo-tabs.js')) out = out.replace('</body>', '<script src="js/stargo-tabs.js"></script></body>');
  if (out.includes('id="stargo-side-menu"') && !out.includes('js/stargo-side-menu.js')) out = out.replace('</body>', '<script src="js/stargo-side-menu.js"></script></body>');
  if (out.includes('data-stargo-video') && !out.includes('js/stargo-media.js')) out = out.replace('</body>', '<script src="js/stargo-media.js"></script></body>');
  out = out.replace(
    'const nav = document.querySelector(".menu-bottom");',
    'const nav = document.querySelector(".menu-bottom");\n  if (!nav) return; // no pill on this page',
  );
  out = out.replace(
    'const overlay = document.querySelector(".blur-overlay");\n',
    'const overlay = document.querySelector(".blur-overlay");\n  if (!modal) return; // the template ships this markup removed\n',
  );
  return out;
}

/**
 * Link hygiene on every page:
 *  - the template's placeholder legal links (href="#") go to the real pages;
 *  - internal links never open a new tab;
 *  - external links that do open a new tab carry rel="noopener noreferrer".
 */
/* The footer's social links carry no text of their own (they are icons), so
   their names live in aria-label and title — in the page's language: a Chinese
   screen reader should not switch to English for three links. */
const SOCIAL_LABELS = {
  mail: { zh: '发邮件给 STARGO WORK', en: 'Email STARGO WORK' },
  whatsapp: { zh: '通过 WhatsApp 联系 STARGO WORK', en: 'WhatsApp STARGO WORK' },
  site: { zh: 'STARGO 企业官网', en: 'STARGO corporate website' },
};
const socialKind = (href) => (href.startsWith('mailto:') ? 'mail' : href.includes('wa.me/') ? 'whatsapp' : 'site');

/* The icon on each of those buttons says where it goes. The template drew an
   Instagram camera, an X logo and a third-party star on them; STARGO has no
   accounts there, and the buttons lead to the corporate website, WhatsApp and
   e-mail. Each now carries a plain line glyph for its destination — a globe, a
   speech bubble, an envelope — drawn in the template's icon style: white, 16px,
   centred in the same 40px round tile (the X tile's square `sq` variant goes,
   so the three match), and still the `.social-icon` the template's hover lift
   moves. The glyph is decoration; the button's name is its aria-label.
   The about page's intro card shows the same three channels (V7-LX,
   tools/blocks/cn-about.mjs CHANNELS): the paths below are that card's paths,
   point for point, so the site draws one icon set. */
const SOCIAL_GLYPH = (paths) => `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const SOCIAL_ICONS = {
  site: SOCIAL_GLYPH('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z"/>'),
  whatsapp: SOCIAL_GLYPH('<path d="M20.5 11.6a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/>'),
  mail: SOCIAL_GLYPH('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
};
const TEMPLATE_SOCIAL_ART = /instagram%20|twitter%20|_contra\.png/;

function socialIcons(html) {
  const out = html.replace(/<a\b[^>]*\bclass="social-wrapper\b[^"]*"[^>]*>[\s\S]*?<\/a>/g, (a) => {
    const href = (a.match(/href="([^"]*)"/) || [])[1] || '';
    const img = /<img\b[^>]*\bclass="social-icon\b[^"]*"[^>]*\/>/;
    if (!img.test(a)) throw new Error('chrome: a social button has no icon to replace');
    return a.replace(/class="social-wrapper sq /, 'class="social-wrapper ').replace(img, SOCIAL_ICONS[socialKind(href)]);
  });
  if (TEMPLATE_SOCIAL_ART.test(out)) throw new Error('chrome: a template social-network icon survives');
  return out;
}

/**
 * The desktop side menu (from 992px): the header's two-line icon opens it, the
 * round close button closes it — Webflow click interactions on plain <div>s.
 * The icon becomes a named button that says what it controls, the close button
 * a named button, and the menu and the close button start `inert`: the menu
 * sits behind the page while closed, and its links (at opacity 0) used to be
 * the first sixteen Tab stops of every desktop page. js/stargo-side-menu.js
 * lifts `inert` while the menu is open and handles Enter, Space and Escape.
 * The 404 page has no side menu; overlayMenu() takes its icon away and leaves it
 * the header's menu button below 992px.
 */
const SIDE_MENU_LABELS = { open: { zh: '菜单', en: 'Menu' }, close: { zh: '关闭菜单', en: 'Close menu' } };
function sideMenu(html, lang) {
  if (!html.includes('<div class="menu-wrapper">')) return html;
  const one = (out, from, to, what) => {
    const n = out.split(from).length - 1;
    if (n !== 1) throw new Error(`chrome: expected one ${what}, found ${n}`);
    return out.replace(from, to);
  };
  let out = html;
  out = one(out, '<div class="menu-wrapper">', '<div class="menu-wrapper" id="stargo-side-menu" inert="">', 'side menu');
  out = one(out, 'class="circle-wrap">', `class="circle-wrap" role="button" tabindex="0" aria-label="${SIDE_MENU_LABELS.open[lang]}" aria-expanded="false" aria-controls="stargo-side-menu">`, 'side menu icon');
  out = one(out, 'class="fixed-close-button">', `class="fixed-close-button" role="button" tabindex="0" aria-label="${SIDE_MENU_LABELS.close[lang]}" inert="">`, 'side menu close button');
  return out;
}
/* The honeypot input's accessible name (tools/blocks/cn-contact.mjs and
   formMarkup below both write it in English). The wrapper is aria-hidden and
   off-screen, but the name is still page text. */
const HONEYPOT_LABEL = { zh: '网站', en: 'Website' };

function linkHygiene(html, lang) {
  let out = html.replace(/<a\b([^>]*)href="#"([^>]*)>([\s\S]*?)<\/a>/g, (m, pre, post, body) => {
    const text = body.replace(/<[^>]+>/g, '');
    const href = /\blogo-first\b/.test(pre + post) ? 'index.html' : /隐私|Privacy/i.test(text) ? 'privacy.html' : /条款|Terms/i.test(text) ? 'terms.html' : null;
    return href ? `<a${pre}href="${href}"${post}>${body}</a>` : m;
  });
  out = out.replace(/<a\b[^>]*>/g, (tag) => {
    const href = (tag.match(/href="([^"]*)"/) || [])[1] || '';
    const external = /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
    if (/\bsocial-wrapper\b/.test(tag)) {
      const label = SOCIAL_LABELS[socialKind(href)][lang];
      tag = tag.replace('<a ', `<a aria-label="${label}" title="${label}" `);
    }
    if (!external) return tag.replace(/\s*target="_blank"/g, '');
    if (/target="_blank"/.test(tag) && !/\brel=/.test(tag)) return tag.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"');
    return tag;
  });
  // These are accordion controls, not links to the top of the page. The
  // retained IX2 listener is on .toggle-wrapper, so button clicks still bubble.
  return out.replace(/<a\b[^>]*href="#"[^>]*class="toggle-header w-inline-block"[^>]*>([\s\S]*?)<\/a>/g, '<button type="button" class="toggle-header w-inline-block">$1</button>');
}

function uniqueLayoutIds(html) {
  const seen = new Map();
  return html.replace(/\sid="(w-node-[^"]+)"/g, (attribute, id) => {
    const occurrence = seen.get(id) || 0; seen.set(id, occurrence + 1);
    return occurrence ? ` id="${id}-copy-${occurrence}" data-stargo-grid="${id}"` : attribute;
  });
}

/* An input's `autocomplete` token by what it collects (WCAG 1.3.5). The demo
   form's own fields (tools/ow-blocks/contact.mjs formFields) carry theirs; this
   covers the template's newsletter e-mail and any plain input without one. */
const autocompleteFor = (tag) => {
  const name = (tag.match(/\sname="([^"]*)"/) || [])[1] || '';
  if (/\stype="email"/.test(tag)) return 'email';
  if (/^name$/i.test(name)) return 'name';
  if (/^(?:company|organi[sz]ation|subject|last-name)$/i.test(name)) return 'organization';
  if (/^(?:phone|tel|mobile)$/i.test(name)) return 'tel';
  return null;
};
const FALLBACK_NAME = { email: { zh: '邮箱', en: 'Email' }, name: { zh: '姓名', en: 'Name' }, organization: { zh: '公司', en: 'Company' }, tel: { zh: '手机 / 微信', en: 'Mobile / WeChat' } };

function formMarkup(html, lang) {
  return html.replace(/<form\b[^>]*>[\s\S]*?<\/form>/g, form => {
    const isNews = /id="Subscribe"/.test(form);
    form = form.replace(/<form\b/, `<form data-stargo-form="${isNews ? 'newsletter' : 'contact'}"`).replace(/method="get"/, 'method="post" action="/api/contact"');
    if (!form.includes('name="website"')) form = form.replace(/(<form[^>]*>)/, '$1<div class="stargo-hp" aria-hidden="true"><input aria-label="Website" name="website" type="text" tabindex="-1" autocomplete="off"/></div>');
    /* Which form this is, for a post without the script (functions/api/contact.js
       refuses a body without it); js/stargo-forms.js skips hidden inputs and
       sends the same value in its JSON. */
    if (!/\sname="form"/.test(form)) form = form.replace(/(<form[^>]*>)/, `$1<input type="hidden" name="form" value="${isNews ? 'newsletter' : 'contact'}"/>`);
    /* An input with a visible <label for> is named by it: an aria-label on top
       would replace the label (and drop its 「（选填）」), so only a bare input,
       like the newsletter e-mail, gets one. */
    const labelled = new Set([...form.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map(m => m[1]));
    form = form.replace(/<input\b[^>]*>/g, tag => {
      const kind = autocompleteFor(tag);
      if (!kind) return tag;
      const id = (tag.match(/\sid="([^"]*)"/) || [])[1];
      const add = [];
      if (!/\sautocomplete=/.test(tag)) add.push(`autocomplete="${kind}"`);
      if (!/\saria-label=/.test(tag) && !(id && labelled.has(id))) add.push(`aria-label="${FALLBACK_NAME[kind][lang]}"`);
      return add.length ? tag.replace('<input ', `<input ${add.join(' ')} `) : tag;
    });
    const consent = lang === 'zh' ? '提交前请阅读我们的 <a href="privacy.html">隐私政策</a>。我们仅用这些信息处理你的申请。' : 'Please read our <a href="privacy.html">Privacy Policy</a>. We use these details to respond to your request.';
    return form.replace('</form>', `<p class="stargo-form-consent">${consent}</p></form>`);
  }).replace(/(<div class="stargo-hp" aria-hidden="true"><input )aria-label="Website"( name="website")/g, `$1aria-label="${HONEYPOT_LABEL[lang]}"$2`);
}

/**
 * Names the page's Webflow runtime writes in English when the markup has none:
 * the menu button ("menu") and each form, with its two notices ("<data-name>",
 * "… success", "… failure" — "Email Form", "Subscribe", "Contact Form"). The
 * runtime keeps a name that is already there (it tests the success notice's
 * name before naming the form), so the Chinese pages carry their own. The
 * English pages keep the runtime's names.
 */
const FORM_NAMES = {
  newsletter: { form: '订阅表单', done: '订阅成功提示', fail: '订阅失败提示' },
  contact: { form: '预约演示表单', done: '提交成功提示', fail: '提交失败提示' },
};
function zhRuntimeNames(html) {
  let out = html.replace(/<div class="menu-button w-nav-button">/g, '<div class="menu-button w-nav-button" aria-label="菜单">');
  const FORM = /<form\b[^>]*\sdata-stargo-form="(newsletter|contact)"[^>]*>/g;
  const parts = [];
  let last = 0;
  for (const m of out.matchAll(FORM)) {
    const names = FORM_NAMES[m[1]];
    const close = out.indexOf('</form>', m.index);
    const next = out.slice(close).search(/<form\b/);
    const end = next === -1 ? out.length : close + next;
    let tail = out.slice(close, end);
    const done = /(<div class="[^"]*\bw-form-done\b[^"]*")/;
    const fail = /(<div class="[^"]*\bw-form-fail\b[^"]*")/;
    if (!done.test(tail) || !fail.test(tail)) throw new Error('chrome: a form has no Webflow success/failure notice after it');
    tail = tail.replace(done, `$1 aria-label="${names.done}"`).replace(fail, `$1 aria-label="${names.fail}"`);
    parts.push(out.slice(last, m.index), m[0].replace(/^<form\b/, `<form aria-label="${names.form}"`), out.slice(m.index + m[0].length, close), tail);
    last = end;
  }
  parts.push(out.slice(last));
  out = parts.join('');
  return out;
}

/**
 * A Chinese sentence ends in 「。」. Two template lines keep an ASCII full stop
 * after text this site puts in front of it: the demo band's heading (Mono's
 * "Let's talk." with 「预约企业演示」 in place of the words) and its legal line
 * ("… Terms and Privacy Policy." with the two link texts swapped). On a phone
 * the "." even wrapped onto a line of its own. Only a stop that directly
 * follows a Han character — or the close of a link whose text ends in one —
 * and ends a text run is changed, and only in the body of a Chinese page.
 */
function zhFullStops(html) {
  const at = html.indexOf('<body');
  const body = html.slice(at)
    .replace(/([一-鿿])\.(?=<)/g, '$1。')
    .replace(/([一-鿿]<\/a>)\.(?=<)/g, '$1。');
  return html.slice(0, at) + body;
}

/** Template people and stock photos in the shared chrome → STARGO imagery. */
function chromeImagery(html) {
  let out = html;
  // The "Talk to Denis" avatar in the overlay menu.
  out = out.replace(/<img[^>]*class="photo-image"[^>]*\/>/g, `<img src="${AVATAR}" loading="lazy" alt="" class="photo-image"/>`);
  // Overlay menu photo strips and the contact band's image rotator (balanced
  // elements: the strips nest <div>s, so a lazy regex would stop early).
  let i = 0;
  for (const cls of ['photo-block', 'photo-block-reverse', 'image-text-rotator']) {
    for (let n = 0; ; n++) {
      const el = findByClass(out, 'div', cls, n);
      if (!el) break;
      const inner = el.text.replace(/<img[^>]*\/>/g, (img) => {
        const cl = (img.match(/class="([^"]*)"/) || [])[1];
        const src = SCREENS[i++ % SCREENS.length];
        return `<img src="${src}" loading="lazy" alt=""${cl ? ` class="${cl}"` : ''}/>`;
      });
      out = out.slice(0, el.start) + inner + out.slice(el.end);
    }
  }
  return out;
}

/** Legacy hrefs, resolved by what the link says rather than where it pointed. */
export function remapLinks(html) {
  return html.replace(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (whole, pre, href, post, body) => {
    if (!(href in LEGACY)) return whole;
    const text = body.replace(/<[^>]+>/g, '');
    const byText =
      /治理|安全|审批|Enterprise|governance|FDE/i.test(text) ? 'enterprise.html'
        : /定价|Pricing/i.test(text) ? 'pricing.html'
          : /智能|Intelligence/i.test(text) ? 'intelligence.html'
            : /数字员工|Workforce|AI 员工|AI employees/i.test(text) ? 'workforce.html'
              : /能力|Capabilit|全景/i.test(text) ? 'capabilities.html'
                : /博客|文章|Blog|Article/i.test(text) ? 'blog.html'
                  : /关于|About/i.test(text) ? 'about.html'
                    : /演示|Demo|联系|Contact|诊断|talk/i.test(text) ? 'contact.html'
                      : /声明|Notices|Licens|条款|Terms/i.test(text) ? 'terms.html'   // the notices page is gone (2026-10-10)
                        : /首页|Home/i.test(text) ? 'index.html'
                          : null;
    return `<a${pre}href="${byText ?? LEGACY[href]}"${post}>${body}</a>`;
  });
}

/** Pages one or two folders down: every root-relative asset path moves up by `up`. */
export function relocateAssets(html, up = '../') {
  return html
    .replace(/((?:src|href|data-src|data-poster-url|poster)=")(assets|css|js)\//g, `$1${up}$2/`)
    .replace(/(srcset=")([^"]*)"/g, (_, a, v) => `${a}${v.replace(/(^|,\s*)(assets\/)/g, `$1${up}$2`)}"`)
    .replace(/(data-video-urls=")([^"]*)"/g, (_, a, v) => `${a}${v.replace(/(^|,)(assets\/)/g, `$1${up}$2`)}"`)
    .replace(/(data-mobile-src=")(assets\/)/g, `$1${up}$2`)
    .replace(/url\((&quot;|"|')?assets\//g, `url($1${up}assets/`)
    .replace(/url\(assets\//g, `url(${up}assets/`);
}

/** Pages inside a folder (blog/): every relative page link moves up by `up`; absolute and anchor links stay. */
export function relocateLinks(html, up) {
  if (!up) return html;
  return html.replace(/href="((?!(?:https?:)?\/\/|mailto:|tel:|\/|#)[^"]*?\.html(?:[#?][^"]*)?)"/g, (_, h) => `href="${up}${h}"`);
}

/* --------------------------------------------------------------- main -- */

/* The small orb beside the wordmark (navigation, overlay menu, footer) is
   the template's looping film, 1.7 MB as MP4 plus 4.9 MB as WebM, to draw a
   30px circle. On every page it is one frame of that film, as a still (the
   film's own poster is its dark first frame, before the orb appears):
     ffmpeg -ss 2 -i assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4f47_magical_orb_remix_mp4.mp4 \
       -frames:v 1 -vf scale=132:132:flags=lanczos -c:v libwebp -quality 90 assets/brand/stargo-orb-still.webp
   132px is the orb box's 66px (.logo-bg, 220% of the 30px circle) at 2x.
   (Was done in tools/build-site.mjs for the OPEN WORK pages only until C2
   pass 2; the blog pages still fetched the film.) */
export const ORB_STILL = 'assets/brand/stargo-orb-still.webp';
const ORB_FILM = /class="logo-bg[^"]*\bw-background-video\b[^"]*"><video id="([^"]+)-video"/g;
function orbStills(html, current) {
  let out = html;
  for (const [, id] of [...html.matchAll(ORB_FILM)]) out = stillImage(out, id, ORB_STILL, '');
  if (ORB_FILM.test(out) || /magical_orb_remix/.test(out)) throw new Error(`chrome: the orb film survives on ${current}`);
  ORB_FILM.lastIndex = 0;
  return out;
}

/**
 * Skip link (tech audit #12): the first tab stop on every page, hidden until it has focus,
 * jumps past the navigation to the page's <main id="main"> (css/stargo-fusion.css `.stargo-skip`).
 */
function skipLink(html, lang) {
  if (!/\bid="main"/.test(html)) throw new Error('chrome: no <main id="main"> for the skip link');
  const label = lang === 'zh' ? '跳到正文' : 'Skip to content';
  return html.replace(/<body\b[^>]*>/, (open) => `${open}<a class="stargo-skip" href="#main">${label}</a>`);
}

export function applyChrome(html, { lang, current }) {
  const { opt } = makeSub('chrome');
  const L = links(lang, current);
  let out = orbStills(html, current);
  out = head(out, lang, current);
  out = topNav(out, L, current);
  out = overlayMenu(out, L, current);
  out = bottomPill(out, L, current);
  out = footerPages(out, L, current);
  for (const [a, b] of CHROME) out = opt(out, a, b[lang]);
  out = wordmark(out);
  out = chromeImagery(out);
  out = sideMenu(out, lang);
  out = skipLink(out, lang);
  out = scripts(out);
  out = linkHygiene(out, lang);
  out = socialIcons(out);
  out = formMarkup(out, lang);
  if (lang === 'zh') out = zhRuntimeNames(zhFullStops(out));
  out = uniqueLayoutIds(out);
  out = editorialImages(out, lang);
  // Unhashed local runtimes used to stay stale for a day after deployments.
  // Version the URL while retaining the original file and script ordering.
  //
  // The hash is taken over the file with CRLF folded to LF, not over the bytes
  // as they happen to sit in this working tree. Git checks these stylesheets
  // and scripts out with the platform's line endings (CRLF under Windows'
  // core.autocrlf, LF everywhere else), so hashing the raw bytes made twelve of
  // them — every hand-written script, and the donor sheets — hash differently
  // on Windows and on Linux. The pages then differed by their ?v= tokens alone,
  // from identical sources, which is precisely the thing a rebuild-and-diff
  // check in CI exists to catch. Folding first makes the token depend on the
  // file's content and nothing else, so the build is reproducible on any
  // checkout. The value is a cache key; what the browser loads is unchanged.
  //
  // A stylesheet ships with ?v= keys on the fonts and pictures it names
  // (tools/make-dist.mjs, tools/asset-version.mjs), and its own key is taken
  // over that text: a changed font or picture gives the stylesheet a new URL
  // too, so no cached stylesheet keeps asking for the old file.
  out = out.replace(/((?:src|href)=")((?:css|js)\/[^"?]+\.(?:css|js))"/g, (_, attr, path) => {
    const raw = readFileSync(new URL(`../${path}`, import.meta.url));
    let text = raw.toString('latin1').replace(/\r\n/g, '\n');
    if (path.endsWith('.css')) text = versionAssets(text);
    const content = Buffer.from(text, 'latin1');
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    return `${attr}${path}?v=${hash}"`;
  });
  if (/monostudio|Mōno™ Studio/i.test(out)) throw new Error(`chrome: template brand survives in ${current}`);
  return out;
}

/** Every internal href must resolve to a page this build produces. */
export function assertInternalLinks(html, name) {
  const bad = new Set();
  for (const m of html.matchAll(/href="([^"#?]+\.html)(?:[#?][^"]*)?"/g)) {
    if (/^(https?:)?\/\//.test(m[1])) continue;
    const h = m[1].replace(/^(\.\.\/)+/, '').replace(/^en\//, '');
    if (!ALL_PAGES.has(h)) bad.add(m[1]);
  }
  if (bad.size) throw new Error(`[${name}] links to pages that do not exist: ${[...bad].join(', ')}`);
}

export { CONTACT_INFO };
