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
import { makeSub, findByClass, extractElement, escapeHtml } from './lib-html.mjs';
import { editorialImages, photoAlt } from './editorial-images.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { CAP_JUMPS, NAV, SECONDARY, MORE, LANG_SWITCH, CHROME, META, CONTACT_INFO, CONTACT_UI, SITE_URL } from './copy.mjs';
import { POSTS, BLOG_UI, postPath, coverSrc, faqEntities, wordCount } from './blog.mjs';
import { OG, OS_ART, MENU_CARD, HOME_MOSAIC } from './replaceables.mjs';

/** Every page the build produces, as root-relative names. */
export const SITE_PAGES = [...NAV, ...SECONDARY, ...MORE].map((n) => n.href).concat(POSTS.map(postPath));
export const ALL_PAGES = new Set([...SITE_PAGES, '404.html']);
export const WORDMARK = 'assets/brand/stargo-wordmark-600.png';
/** The owner's A-arrow app icon (2026-10-21), the square mark for tabs, home screens and structured data. */
const ICON = (n) => `assets/brand/stargo-a-icon-${n}.png`;
/** The name as the owner writes it on stargowork.com (2026-10-21): the full
    Chinese product name on Chinese pages, the brand alone on English ones. */
export const BRAND = { zh: 'Stargo Work星贸智能AI外贸操作系统', en: 'Stargo Work' };
const AVATAR = 'assets/stargo/avatar-core.png';
/** Share cover: the owner's photograph O01 as a 1200×630 JPEG since 2026-10-21
    (tools/replaceables.mjs OG, tools/imagegen/prepare-share-card.mjs). */
const OG_IMAGE = OG.token;

/** Product screens that replace the template's photo strips (overlay menu) and image rotator (contact band). */
export const SCREENS = Object.values(OS_ART).map((n) => `assets/stargo/${n}.webp`);

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

/** A `w-background-video` block becomes a still image (same box, same interactions, no video).
 *  `cls` names the still; a slot that needs its own size or crop adds a class after `stargo-still`. */
export function stillImage(html, videoId, src, alt = '', cls = 'stargo-still') {
  const i = html.indexOf(`id="${videoId}-video"`);
  if (i === -1) throw new Error(`still: video ${videoId} not found`);
  const vStart = html.lastIndexOf('<video', i);
  const vEnd = html.indexOf('</video>', i) + '</video>'.length;
  const wrapStart = html.lastIndexOf('<div', vStart);
  let wrap = html.slice(wrapStart, vStart).replace(/\s*data-(video-urls|poster-url|autoplay|loop)="[^"]*"/g, '');
  return html.slice(0, wrapStart) + wrap + `<img src="${src}" alt="${alt}" loading="lazy" class="${cls}"/>` + html.slice(vEnd);
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
  return { nav, more, secondary, swap, capJumps };
}

function topNav(html, L, current) {
  const m = html.match(/<nav role="navigation" class="nav-menu first w-nav-menu">[\s\S]*?<\/nav>/);
  if (!m) throw new Error('chrome: top nav not found');
  const tpl = firstLink(m[0]);
  const items = [...L.nav.slice(1), ...L.more, L.swap];   // the wordmark is the home link; About and Blog sit after the product pages
  const out = items.map((n) => renderLink(tpl, n, isCurrent(n.href, current))).join('');
  return html.replace(m[0], `<nav role="navigation" class="nav-menu first w-nav-menu" data-lenis-prevent="">${out}</nav>`);
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
  const byHref = (h) => L.nav.find((n) => n.href === h);
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
  const n = L.nav;
  const cols = [[n[0], n[1], n[2], n[3]], [n[4], n[5], n[6], L.swap], [...L.more, ...L.secondary]];
  const inner = cols.map((c) => `<div class="flex-item">${c.map((x) => renderLink(tpl, x, isCurrent(x.href, current))).join('')}</div>`).join('');
  return replaceInner(html, grid, inner);
}

/** The metallic STARGO wordmark replaces the template's two-word text logo. */
function wordmark(html) {
  const img = (cls) => `<img src="${WORDMARK}" alt="Stargo Work" class="stargo-wordmark ${cls}"/>`;
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
  const title = current === 'index.html' ? meta.title[lang] : `${meta.title[lang]}${lang === 'zh' ? '｜' : ' — '}${BRAND[lang]}`;
  const description = meta.description[lang];
  const self = cleanUrl(lang, current);
  const zh = cleanUrl('zh', current);
  const en = cleanUrl('en', current);
  const inLanguage = lang === 'zh' ? 'zh-CN' : 'en';
  const ogImage = post ? `${SITE_URL}/${coverSrc(post)}` : `${SITE_URL}/${OG_IMAGE}`;
  const pageType = current === 'about.html' ? 'AboutPage' : current === 'blog.html' ? 'CollectionPage' : current === 'contact.html' ? 'ContactPage' : 'WebPage';
  const blogUrl = cleanUrl(lang, 'blog.html');
  const graph = [
    { '@type': 'Organization', '@id': ORG_ID, name: 'Stargo Work', alternateName: '星贸智能', url: `${SITE_URL}/`, logo: `${SITE_URL}/${ICON(512)}`, email: CONTACT_INFO.email, telephone: CONTACT_INFO.phone, contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: CONTACT_INFO.phone, email: CONTACT_INFO.email, availableLanguage: ['zh-CN', 'en'] }, address: { '@type': 'PostalAddress', addressLocality: 'Liuzhou', addressRegion: 'Guangxi', addressCountry: 'CN' }, sameAs: [CONTACT_INFO.siteHref] },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${SITE_URL}/`, name: BRAND[lang], alternateName: lang === 'zh' ? 'Stargo Work' : BRAND.zh, inLanguage: ['zh-CN', 'en'], publisher: { '@id': ORG_ID } },
    { '@type': pageType, '@id': self, url: self, name: title, description, inLanguage, isPartOf: { '@id': SITE_ID }, ...(post ? { primaryImageOfPage: ogImage } : {}) },
  ];
  if (current === 'index.html') {
    graph.push({ '@type': 'SoftwareApplication', name: BRAND[lang], applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: `${SITE_URL}/`, description, offers: { '@type': 'AggregateOffer', priceCurrency: 'CNY', lowPrice: '10000', highPrice: '40000', offerCount: 4 }, provider: { '@id': ORG_ID } });
  }
  if (current === 'blog.html') {
    graph.push({
      '@type': 'Blog', '@id': `${blogUrl}#blog`, url: blogUrl, name: `Stargo Work ${BLOG_UI.section[lang]}`, description, inLanguage, publisher: { '@id': ORG_ID },
      blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', '@id': `${cleanUrl(lang, postPath(p))}#article`, headline: p.title[lang], url: cleanUrl(lang, postPath(p)), datePublished: p.date, dateModified: p.modified ?? p.date, image: `${SITE_URL}/${coverSrc(p)}` })),
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
      about: { '@type': 'SoftwareApplication', name: BRAND[lang], applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: `${SITE_URL}/` },
      ...(post.mentions?.length ? { mentions: post.mentions.map((name) => ({ '@type': 'Thing', name })) } : {}),
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'Stargo Work' }, publisher: { '@id': ORG_ID }, isPartOf: { '@id': `${blogUrl}#blog` },
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
    `<meta property="og:site_name" content="${BRAND[lang]}"/>`,
    `<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}"/>`,
    `<meta property="og:image" content="${ogImage}"/>`,
    post ? '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="800"/>' : '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>',
    /* The share card is the owner's photograph: it carries the owner's own
       sentence for it and the AI caption (photoAlt), as the photographs on the
       pages do. An article's cover has none here (its card and hero carry
       theirs). */
    ...(post ? [] : [`<meta property="og:image:alt" content="${escapeHtml(photoAlt(OG.id, lang))}"/>`]),
    ...(post ? [`<meta property="article:published_time" content="${post.date}"/>`, `<meta property="article:modified_time" content="${post.modified ?? post.date}"/>`, `<meta property="article:section" content="${(post.section ?? BLOG_UI.section)[lang]}"/>`, ...post.keywords[lang].map((k) => `<meta property="article:tag" content="${k}"/>`)] : []),
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:image" content="${ogImage}"/>`,
    ...(post ? [] : [`<meta name="twitter:image:alt" content="${escapeHtml(photoAlt(OG.id, lang))}"/>`]),
    '<meta name="theme-color" content="#0d0906"/>',
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
    .replace(/<meta property="og:type" content="website"\/>/, '')                // regenerated above (article for posts)
    /* The tab icon. It pointed at the wordmark, which is a 139:22 lozenge: in a
       16px tab that is an unreadable smear, which is what the owner saw. The
       brand's square mark is used instead, cut to the sizes browsers actually
       ask for — 16 and 32 for the tab, 48 for Windows' shortcut, 180 for iOS's
       home screen. `shortcut icon` stays for browsers that only read that.
       Since 2026-10-21 the mark is the owner's A-arrow app icon, under new file
       names because /assets is cached for a year; the 180 is opaque, since iOS
       fills a transparent corner with black. relocateAssets() prefixes ../ for
       pages below the root. */
    .replace(/<link href="[^"]*" rel="shortcut icon" type="image\/x-icon"\/>/,
      `<link href="${ICON(32)}" rel="shortcut icon" type="image/png"/>`
      + `<link href="${ICON(16)}" rel="icon" type="image/png" sizes="16x16"/>`
      + `<link href="${ICON(32)}" rel="icon" type="image/png" sizes="32x32"/>`
      + `<link href="${ICON(48)}" rel="icon" type="image/png" sizes="48x48"/>`)
    .replace(/<link href="[^"]*" rel="apple-touch-icon"\/>/, `<link href="${ICON(180)}" rel="apple-touch-icon" sizes="180x180"/>`);
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
  /* The homepage's opening animation (tools/blocks/og-intro.*) attaches no
     script here: tools/build-site.mjs writes it inline, in the <head> and
     straight after the overlay, because it has to decide and start before the
     first paint rather than after the page bundle. */
  if (!out.includes('js/stargo-forms.js')) out = out.replace('</body>', '<script src="js/stargo-forms.js"></script></body>');
  if (!out.includes('js/stargo-tabs.js')) out = out.replace('</body>', '<script src="js/stargo-tabs.js"></script></body>');
  if (out.includes('id="stargo-side-menu"') && !out.includes('js/stargo-side-menu.js')) out = out.replace('</body>', '<script src="js/stargo-side-menu.js"></script></body>');
  if (out.includes('data-stargo-video') && !out.includes('js/stargo-media.js')) out = out.replace('</body>', '<script src="js/stargo-media.js"></script></body>');
  /* Every template clip waits until the reader is near it, on every page.
     The about and capability pages did this first for their donor bands
     (tools/build-site.mjs explains the measurements); the Mōno background
     videos on the other pages still loaded at once — the homepage alone
     started ten `<video autoplay>` elements, eight of them the same orb clip,
     before the opening animation had finished. Same mechanism here: the
     `<source src>` waits in `data-src`, Webflow's runtime is kept from
     re-adding it by renaming `data-video-urls`, and js/stargo-video-defer.js
     restores both a quarter-screen before the clip scrolls into view. The
     brand film keeps its own player (js/stargo-media.js). */
  const menu = elementSpan(out, '<div class="menu-wrapper" id="stargo-side-menu"');
  out = out.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, (v, at) => {
    if (/^<video[^>]*\sdata-stargo-video\b/.test(v)) return v;
    v = videoSources(v, menu && at > menu[0] && at < menu[1]);
    if (!/<source[^>]*\ssrc=/.test(v) || /^<video[^>]*\sdata-defer\b/.test(v)) return v;
    return v
      .replace('<video', '<video data-defer')
      .replace(/\spreload="[^"]*"/, ' preload="none"')
      .replace(/(<source[^>]*?)\ssrc=/g, '$1 data-src=');
  });
  out = out.replace(/\sdata-video-urls=/g, ' data-defer-video-urls=');
  if (out.includes('<video data-defer') && !out.includes('js/stargo-video-defer.js')) out = out.replace('</body>', '<script src="js/stargo-video-defer.js" defer></script></body>');
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
  whatsapp: { zh: '通过 WhatsApp 联系 STARGO WORK', en: 'Message STARGO WORK on WhatsApp' },
  site: { zh: 'STARGO 企业官网', en: 'STARGO corporate website' },
  phone: { zh: `${CONTACT_UI.call.zh} STARGO WORK`, en: `${CONTACT_UI.call.en} STARGO WORK` },
};
const socialKind = (href) => (href.startsWith('mailto:') ? 'mail' : href.startsWith('tel:') ? 'phone' : href.includes('wa.me/') ? 'whatsapp' : 'site');

/* WeChat has no web link, so wherever the site lists it the ID is copied
   instead: a <button> carrying these attributes, which js/stargo-forms.js arms
   (copies `data-stargo-copy`, shows and announces `data-stargo-copied`). A
   control that is ONLY a copy action (an icon, a 「复制」 pill) ships `hidden`
   and the script reveals it, so a page without the script never shows a
   button that does nothing; where the ID is printed as text, the text stays. */
export const wechatCopy = (lang) => ({
  attrs: `data-stargo-copy="${CONTACT_INFO.wechat}" data-stargo-copied="${CONTACT_UI.wechatCopied[lang]}"`,
  label: `${CONTACT_UI.copyWechat[lang]} ${CONTACT_INFO.wechat}`,
});

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
   point for point, so the site draws one icon set.
   Since 2026-10-21 the rows also carry the phone (a handset, a tel: link that
   rings on a phone) and WeChat (two speech bubbles, a button that copies the
   ID — see wechatCopy above), appended after the three; socialIcons() adds
   them. After a copy, js/stargo-forms.js shows a check mark for two seconds. */
/** The two glyphs added on 2026-10-21, shared with tools/blocks/cn-about.mjs. */
export const GLYPH_PATHS = {
  phone: '<path d="M5.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2z"/>',
  wechat: '<path d="M15.8 9.2C15.3 6 12.3 3.5 8.7 3.5 4.8 3.5 1.8 6.2 1.8 9.5c0 1.9 1 3.6 2.6 4.7l-.6 2.3 2.6-1.4c.8.2 1.5.3 2.3.3"/><path d="M22.2 14.6c0-2.8-2.8-5.1-6.2-5.1s-6.2 2.3-6.2 5.1 2.8 5.1 6.2 5.1c.7 0 1.4-.1 2-.3l2.4 1.3-.5-2.2c1.4-.9 2.3-2.3 2.3-3.9z"/><path d="M6.3 8.3h.01M11 8.3h.01M13.8 13.9h.01M18.2 13.9h.01"/>',
};
const SOCIAL_GLYPH = (paths) => `<svg class="social-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const SOCIAL_ICONS = {
  site: SOCIAL_GLYPH('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z"/>'),
  whatsapp: SOCIAL_GLYPH('<path d="M20.5 11.6a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/>'),
  mail: SOCIAL_GLYPH('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
  phone: SOCIAL_GLYPH(GLYPH_PATHS.phone),
  wechat: SOCIAL_GLYPH(GLYPH_PATHS.wechat),
};
const TEMPLATE_SOCIAL_ART = /instagram%20|twitter%20|_contra\.png/;

function socialIcons(html, lang) {
  let out = html.replace(/<a\b[^>]*\bclass="social-wrapper\b[^"]*"[^>]*>[\s\S]*?<\/a>/g, (a) => {
    const href = (a.match(/href="([^"]*)"/) || [])[1] || '';
    const img = /<img\b[^>]*\bclass="social-icon\b[^"]*"[^>]*\/>/;
    if (!img.test(a)) throw new Error('chrome: a social button has no icon to replace');
    return a.replace(/class="social-wrapper sq /, 'class="social-wrapper ').replace(img, SOCIAL_ICONS[socialKind(href)]);
  });
  if (TEMPLATE_SOCIAL_ART.test(out)) throw new Error('chrome: a template social-network icon survives');
  /* Phone and WeChat after the three, in every row (the footer's and the side
     menu card's). Each row is three adjacent links and nothing else, so it
     closes on the first </div> after it opens. */
  const phone = SOCIAL_LABELS.phone[lang];
  const wechat = wechatCopy(lang);
  out = out.replace(/(<div class="social-content\b[^"]*">)([\s\S]*?)(<\/div>)/g, (m, open, row, close) => {
    const kinds = [...row.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*class="social-wrapper\b/g)].map((x) => socialKind(x[1]));
    if (kinds.join() !== 'site,whatsapp,mail') throw new Error(`chrome: a social row is not website, WhatsApp, e-mail (${kinds.join()})`);
    return open + row
      + `<a aria-label="${phone}" title="${phone}" href="${CONTACT_INFO.phoneHref}" class="social-wrapper w-inline-block">${SOCIAL_ICONS.phone}</a>`
      + `<button type="button" aria-label="${wechat.label}" title="${wechat.label}" ${wechat.attrs} class="social-wrapper stargo-copy-icon" hidden="">${SOCIAL_ICONS.wechat}</button>`
      + close;
  });
  return out;
}

/**
 * The footer's 「(商务合作)」 list: e-mail and WhatsApp come from the template
 * (copy.mjs CHROME), and the phone and WeChat rows are that WhatsApp row again —
 * same component, same arrow, same hover — one a tel: link, the other a
 * <button> that copies the WeChat ID (wechatCopy). The WeChat row prints the
 * ID, so it is not hidden without the script; the script only adds the copy.
 * Their channel words sit in `.stargo-ch`, not `.stargo-wa`: the 768-1279px
 * rule that drops WhatsApp's number (css/stargo-fusion.css) must not touch them.
 */
function footerContact(html, lang) {
  const L = CONTACT_INFO.labels;
  const mark = `<span class="stargo-wa">WhatsApp </span><span class="stargo-wa-num">${CONTACT_INFO.whatsapp}</span>`;
  const n = html.split(mark).length - 1;
  if (n !== 1) throw new Error(`chrome: expected one footer WhatsApp row, found ${n}`);
  const at = html.lastIndexOf('<a ', html.indexOf(mark));
  const row = extractElement(html, at, 'a');
  if (!row.text.includes(`href="${CONTACT_INFO.whatsappHref}"`) || !/\bclass="button-link\b/.test(row.text)) throw new Error('chrome: the footer WhatsApp row is not a button-link to WhatsApp');
  const phoneRow = row.text
    .replace(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.phoneHref}"`)
    .replace(mark, `<span class="stargo-ch">${L.phoneShort[lang]} </span>${CONTACT_INFO.phone}`);
  const wechat = wechatCopy(lang);
  const wechatRow = row.text
    .replace(/^<a /, '<button type="button" ')
    .replace(`href="${CONTACT_INFO.whatsappHref}"`, `aria-label="${L.wechat[lang]} ${CONTACT_INFO.wechat}${CONTACT_UI.copyHint[lang]}" ${wechat.attrs} data-stargo-copied-short="${CONTACT_UI.copiedInline[lang]}"`)
    .replace(/<\/a>$/, '</button>')
    .replace(/<(\/?)div\b/g, '<$1span')   // a <button> holds phrasing content only; the classes keep their display: flex
    .replace(mark, `<span class="stargo-ch">${L.wechat[lang]} </span><span data-stargo-copy-label="">${CONTACT_INFO.wechat}</span>`);
  return html.slice(0, row.end) + phoneRow + wechatRow + html.slice(row.end);
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
/* [start, end) of the element whose opening tag begins with `open`, or null. */
function elementSpan(html, open) {
  const start = html.indexOf(open);
  if (start < 0) return null;
  const tag = open.match(/^<([a-z]+)/)[1];
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start + 1;
  for (let depth = 1, m; (m = re.exec(html));) if ((depth += m[0][1] === '/' ? -1 : 1) === 0) return [start, re.lastIndex];
  throw new Error(`chrome: ${open} is never closed`);
}

/* A clip's <source>s: the smaller H.264 copy from tools/encode-video.mjs where
   one exists (tools/data/video-h264.json), the 360 px orb wherever the logo
   orb is drawn at logo size (the navbar logo and the pricing cards; the
   side-menu card, the one place it was drawn large, has shown the G02 still
   instead since 2026-10-21, so only a clip put back inside the menu would keep
   the full-size orb), and an explicit type, so a browser that cannot play
   H.264 skips the mp4 instead of downloading it first to find out. */
let videoManifest = null;
function videoSources(video, inMenu) {
  videoManifest ??= existsSync(new URL('./data/video-h264.json', import.meta.url))
    ? JSON.parse(readFileSync(new URL('./data/video-h264.json', import.meta.url), 'utf8')) : { clips: {} };
  const { clips, orb, orbSmall } = videoManifest;
  return video.replace(/<source\b([^>]*?)\s(data-src|src)="([^"]+)"([^>]*)>/g, (m, pre, attr, url, post) => {
    const [, up, path] = url.match(/^((?:\.\.\/)*)(.*)$/);
    let plain;
    try { plain = decodeURIComponent(path); } catch { return m; }
    let to = clips[plain];
    if (orbSmall && !inMenu) to = plain === orb ? orbSmall.mp4 : plain === orb.replace(/_mp4\.mp4$/, '_webm.webm') ? orbSmall.webm : to;
    const src = to ? up + (path.includes('%') ? encodeURI(to) : to) : url;
    const type = /\stype=/.test(pre + post) ? '' : /\.mp4$/i.test(plain) ? ' type="video/mp4"' : /\.webm$/i.test(plain) ? ' type="video/webm"' : '';
    return `<source${pre} ${attr}="${src}"${type}${post}>`;
  });
}

function sideMenu(html, lang) {
  if (!html.includes('<div class="menu-wrapper">')) return html;
  const one = (out, from, to, what) => {
    const n = out.split(from).length - 1;
    if (n !== 1) throw new Error(`chrome: expected one ${what}, found ${n}`);
    return out.replace(from, to);
  };
  let out = html;
  out = one(out, '<div class="menu-wrapper">', '<div class="menu-wrapper" id="stargo-side-menu" inert="" data-lenis-prevent="">', 'side menu');
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

function formMarkup(html, lang) {
  return html.replace(/<form\b[^>]*>[\s\S]*?<\/form>/g, form => {
    const isNews = /id="Subscribe"/.test(form);
    /* data-stargo-to / -wa: the e-mail and WhatsApp the script's fallback
       notice names when a submission cannot be confirmed (copy.mjs
       CONTACT_INFO), so the script itself carries no address. */
    form = form.replace(/<form\b/, `<form data-stargo-form="${isNews ? 'newsletter' : 'contact'}" data-stargo-to="${CONTACT_INFO.email}" data-stargo-wa="${CONTACT_INFO.whatsapp}"`).replace(/method="get"/, 'method="post" action="/api/contact"');
    if (!form.includes('name="website"')) form = form.replace(/(<form[^>]*>)/, '$1<div class="stargo-hp" aria-hidden="true"><input aria-label="Website" name="website" type="text" tabindex="-1" autocomplete="off"/></div>');
    form = form.replace(/<input\b[^>]*>/g, tag => {
      if (/type="email"/.test(tag)) return tag.replace('<input ', `<input autocomplete="email" aria-label="${lang === 'zh' ? '邮箱' : 'Email'}" `);
      if (/name="[Nn]ame"/.test(tag)) return tag.replace('<input ', `<input autocomplete="name" aria-label="${lang === 'zh' ? '姓名' : 'Name'}" `);
      if (/name="(?:Subject|Last-Name)"/.test(tag)) return tag.replace('<input ', `<input autocomplete="organization" aria-label="${lang === 'zh' ? '公司' : 'Company'}" `);
      return tag;
    });
    const consent = lang === 'zh' ? '提交前请阅读<a href="privacy.html">隐私政策</a>。这些信息只用于处理你的申请。' : 'Please read our <a href="privacy.html">Privacy Policy</a> before submitting. We use these details only to respond to your request.';
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
        /* The photo strips are the homepage's opening mosaic (index only),
           whose stills are the owner's photographs since 2026-10-21: each
           os-* still the cycle would put here becomes the photograph
           tools/replaceables.mjs HOME_MOSAIC names for it, so the cycle and
           the rotator after it are unchanged. The strips' unclassed pictures
           get `stargo-mosaic` so tools/editorial-images.mjs can size them;
           `photo-hero` (the cover-cropped column) stays as it is. The alt is
           a marker that tools/editorial-images.mjs replaces with the
           photograph's own sentence. */
        if (cls !== 'image-text-rotator') {
          const photo = HOME_MOSAIC[src.match(/\/(os-[\w-]+)\.webp$/)?.[1]];
          if (!photo) throw new Error(`chrome: no mosaic photograph for ${src}`);
          return `<img src="${photo}" loading="lazy" alt="STARGO WORK" class="${cl || 'stargo-mosaic'}"/>`;
        }
        return `<img src="${src}" loading="lazy" alt=""${cl ? ` class="${cl}"` : ''}/>`;
      });
      out = out.slice(0, el.start) + inner + out.slice(el.end);
    }
  }
  /* The side menu's 预约企业演示 card: the owner's harbour picture (G02,
     tools/replaceables.mjs MENU_CARD) where the magical-orb clip played. The
     clip's whole background-video block goes and one still fills the card
     under its dark wash and its text (css/stargo-fusion.css). The orb is
     `logo-bg ab` only here; the navbar and pricing orbs (`logo-bg`) stay
     clips. The still is a backdrop inside the card's link, so it is
     decorative (alt="" and aria-hidden): the link keeps the name its own text
     gives it, the same as when the card held the clip.
     tools/editorial-images.mjs keeps an empty alt empty. */
  const orb = 'class="logo-bg ab w-background-video w-background-video-atom"';
  const at = out.indexOf(orb);
  if (at === -1) {
    if (out.includes('<div class="menu-wrapper">')) throw new Error('chrome: the side-menu card has no orb to replace');
  } else {
    if (out.indexOf(orb, at + 1) !== -1) throw new Error('chrome: expected one side-menu card orb');
    const el = extractElement(out, out.lastIndexOf('<div', at), 'div');
    if (!/^<div\b[^>]*>\s*<video\b[\s\S]*<\/video>\s*<\/div>$/.test(el.text)) throw new Error('chrome: the side-menu card orb is not a background video');
    out = out.slice(0, el.start) + `<img src="${MENU_CARD}" alt="" aria-hidden="true" loading="lazy" class="stargo-menu-photo"/>` + out.slice(el.end);
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
                      : /声明|Notices|Licens/i.test(text) ? 'notices.html'
                        : /首页|Home|Trade OS/i.test(text) ? 'index.html'
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

/**
 * Internal page links as the clean, root-relative URLs the site is served at
 * (Z17): `/contact`, `/en/pricing#plans`, `/blog/<slug>`, `/` and `/en/`.
 * Cloudflare Pages answers `….html` with a redirect to the clean URL, so a
 * link written as `contact.html` cost every first click a round trip. The
 * build keeps writing `.html` links (assertInternalLinks checks them against
 * the pages it produces); this runs last, resolving each relative link from
 * the page's own path (`en/blog/x.html`). Absolute, anchor-only, mailto: and
 * tel: links, and anything that is not one of the site's pages, stay as they
 * are.
 */
export function cleanLinks(html, pagePath) {
  const base = new URL(pagePath, 'https://site.invalid/');
  return html.replace(/(\shref=")((?![a-z][a-z0-9+.-]*:|\/|#)[^"#?]*?\.html)((?:[?#][^"]*)?)"/gi, (whole, attr, path, rest) => {
    const rel = new URL(path, base).pathname.slice(1);
    const page = rel.replace(/^en\//, '');
    if (!ALL_PAGES.has(page)) return whole;
    return `${attr}/${rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}${rest}"`;
  });
}

/* --------------------------------------------------------------- main -- */

export function applyChrome(html, { lang, current }) {
  const { opt } = makeSub('chrome');
  const L = links(lang, current);
  let out = html;
  out = head(out, lang, current);
  out = topNav(out, L, current);
  out = overlayMenu(out, L, current);
  out = bottomPill(out, L, current);
  out = footerPages(out, L, current);
  for (const [a, b] of CHROME) out = opt(out, a, b[lang]);
  out = footerContact(out, lang);
  out = wordmark(out);
  out = chromeImagery(out);
  out = sideMenu(out, lang);
  out = scripts(out);
  out = linkHygiene(out, lang);
  out = socialIcons(out, lang);
  out = formMarkup(out, lang);
  if (lang === 'zh') out = zhRuntimeNames(zhFullStops(out));
  out = uniqueLayoutIds(out);
  out = editorialImages(out, lang);
  /* Stylesheets and scripts get their content-hash ?v= in
     tools/asset-version.mjs versionPage, with every other local asset the
     page loads (Z18); tools/build-site.mjs runs it once the page is final. */
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
