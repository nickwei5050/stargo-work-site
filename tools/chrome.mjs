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
import { CAP_JUMPS, NAV, SECONDARY, MORE, LANG_SWITCH, CHROME, META, CONTACT_INFO, SITE_URL } from './copy.mjs';
import { POSTS, BLOG_UI, postPath, coverSrc } from './blog.mjs';

/** Every page the build produces, as root-relative names. */
export const SITE_PAGES = [...NAV, ...SECONDARY, ...MORE].map((n) => n.href).concat(POSTS.map(postPath));
export const ALL_PAGES = new Set([...SITE_PAGES, '404.html']);
export const WORDMARK = 'assets/brand/stargo-wordmark-600.png';
const AVATAR = 'assets/stargo/avatar-core.png';
const OG_IMAGE = 'assets/stargo/og-cover.png';

/** Product screens that replace the template's photo strips (overlay menu) and image rotator (contact band). */
export const SCREENS = ['os-cockpit', 'os-sales-desk', 'os-inquiries', 'os-agent-center', 'os-quote-studio', 'os-trade-execution', 'os-desktop', 'os-login', 'os-boot', 'os-loading'].map((n) => `assets/stargo/${n}.webp`);

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
  return html.replace(m[0], `<nav role="navigation" class="nav-menu first w-nav-menu">${out}</nav>`);
}

/** Overlay menu: the product pages, About and Blog, and the language switch. Legal pages sit in its bottom row and in the footer. */
function overlayMenu(html, L, current) {
  const flex = findByClass(html, 'div', 'nav-top-flex');
  if (!flex) {
    if (!html.includes('menu-wrapper')) return html.replace(/<div class="menu-button w-nav-button">[\s\S]*?<\/div><\/div>/, '');
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
  const ogImage = post ? `${SITE_URL}/${coverSrc(post)}` : `${SITE_URL}/${OG_IMAGE}`;
  const pageType = current === 'about.html' ? 'AboutPage' : current === 'blog.html' ? 'CollectionPage' : current === 'contact.html' ? 'ContactPage' : 'WebPage';
  const blogUrl = cleanUrl(lang, 'blog.html');
  const graph = [
    { '@type': 'Organization', '@id': ORG_ID, name: 'STARGO WORK', url: `${SITE_URL}/`, logo: `${SITE_URL}/${WORDMARK}`, email: CONTACT_INFO.email, telephone: CONTACT_INFO.whatsapp, address: { '@type': 'PostalAddress', addressLocality: 'Liuzhou', addressRegion: 'Guangxi', addressCountry: 'CN' }, sameAs: [CONTACT_INFO.siteHref] },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${SITE_URL}/`, name: 'STARGO WORK', inLanguage: ['zh-CN', 'en'], publisher: { '@id': ORG_ID } },
    { '@type': pageType, '@id': self, url: self, name: title, description, inLanguage, isPartOf: { '@id': SITE_ID }, ...(post ? { primaryImageOfPage: ogImage } : {}) },
  ];
  if (current === 'index.html') {
    graph.push({ '@type': 'SoftwareApplication', name: 'STARGO WORK', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: `${SITE_URL}/`, description, offers: { '@type': 'AggregateOffer', priceCurrency: 'CNY', lowPrice: '10000', highPrice: '40000', offerCount: 4 }, provider: { '@id': ORG_ID } });
  }
  if (current === 'blog.html') {
    graph.push({
      '@type': 'Blog', '@id': `${blogUrl}#blog`, url: blogUrl, name: `STARGO WORK ${BLOG_UI.section[lang]}`, description, inLanguage, publisher: { '@id': ORG_ID },
      blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', '@id': `${cleanUrl(lang, postPath(p))}#article`, headline: p.title[lang], url: cleanUrl(lang, postPath(p)), datePublished: p.date, image: `${SITE_URL}/${coverSrc(p)}` })),
    });
  }
  if (post) {
    graph.push({
      '@type': 'BlogPosting', '@id': `${self}#article`, headline: post.title[lang], description, image: ogImage, url: self, mainEntityOfPage: { '@id': self },
      datePublished: post.date, dateModified: post.modified ?? post.date, inLanguage, keywords: post.keywords.join(', '),
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'STARGO WORK' }, publisher: { '@id': ORG_ID }, isPartOf: { '@id': `${blogUrl}#blog` },
    });
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
    post ? '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="800"/>' : '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>',
    ...(post ? [`<meta property="article:published_time" content="${post.date}"/>`, `<meta property="article:modified_time" content="${post.modified ?? post.date}"/>`, `<meta property="article:section" content="${BLOG_UI.section[lang]}"/>`, ...post.keywords.map((k) => `<meta property="article:tag" content="${k}"/>`)] : []),
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:image" content="${ogImage}"/>`,
    '<meta name="theme-color" content="#0d0906"/>',
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].join('');
  let out = html
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')   // the template's own structured data
    .replace(/<html([^>]*)lang="en"/, `<html$1lang="${inLanguage}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>${extra}`)
    .replace(/<meta content="[^"]*" (name|property)="(description|og:description|twitter:description)"\/>/g, `<meta content="${description}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" (name|property)="(og:title|twitter:title)"\/>/g, `<meta content="${title}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" property="og:image"\/>/, '')
    .replace(/<meta content="[^"]*" property="twitter:image"\/>/, '')
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
  if (!out.includes('js/stargo-forms.js')) out = out.replace('</body>', '<script src="js/stargo-forms.js"></script></body>');
  if (!out.includes('js/stargo-tabs.js')) out = out.replace('</body>', '<script src="js/stargo-tabs.js"></script></body>');
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
function linkHygiene(html) {
  let out = html.replace(/<a\b([^>]*)href="#"([^>]*)>([\s\S]*?)<\/a>/g, (m, pre, post, body) => {
    const text = body.replace(/<[^>]+>/g, '');
    const href = /\blogo-first\b/.test(pre + post) ? 'index.html' : /隐私|Privacy/i.test(text) ? 'privacy.html' : /条款|Terms/i.test(text) ? 'terms.html' : null;
    return href ? `<a${pre}href="${href}"${post}>${body}</a>` : m;
  });
  out = out.replace(/<a\b[^>]*>/g, (tag) => {
    const href = (tag.match(/href="([^"]*)"/) || [])[1] || '';
    const external = /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
    if (/\bsocial-wrapper\b/.test(tag)) {
      const label = href.startsWith('mailto:') ? 'Email STARGO WORK' : href.includes('wa.me/') ? 'WhatsApp STARGO WORK' : 'STARGO corporate website';
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
    form = form.replace(/<form\b/, `<form data-stargo-form="${isNews ? 'newsletter' : 'contact'}"`).replace(/method="get"/, 'method="post" action="/api/contact"');
    if (!form.includes('name="website"')) form = form.replace(/(<form[^>]*>)/, '$1<div class="stargo-hp" aria-hidden="true"><input aria-label="Website" name="website" type="text" tabindex="-1" autocomplete="off"/></div>');
    form = form.replace(/<input\b[^>]*>/g, tag => {
      if (/type="email"/.test(tag)) return tag.replace('<input ', `<input autocomplete="email" aria-label="${lang === 'zh' ? '邮箱' : 'Email'}" `);
      if (/name="[Nn]ame"/.test(tag)) return tag.replace('<input ', `<input autocomplete="name" aria-label="${lang === 'zh' ? '姓名' : 'Name'}" `);
      if (/name="(?:Subject|Last-Name)"/.test(tag)) return tag.replace('<input ', `<input autocomplete="organization" aria-label="${lang === 'zh' ? '公司' : 'Company'}" `);
      return tag;
    });
    const consent = lang === 'zh' ? '提交前请阅读我们的 <a href="privacy.html">隐私政策</a>。我们仅用这些信息处理你的申请。' : 'Please read our <a href="privacy.html">Privacy Policy</a>. We use these details to respond to your request.';
    return form.replace('</form>', `<p class="stargo-form-consent">${consent}</p></form>`);
  });
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
  out = wordmark(out);
  out = chromeImagery(out);
  out = scripts(out);
  out = linkHygiene(out);
  out = formMarkup(out, lang);
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
  out = out.replace(/((?:src|href)=")((?:css|js)\/[^"?]+\.(?:css|js))"/g, (_, attr, path) => {
    const raw = readFileSync(new URL(`../${path}`, import.meta.url));
    const content = Buffer.from(raw.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
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
