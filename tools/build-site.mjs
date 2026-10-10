/**
 * Build every page of the STARGO WORK site, in Chinese (root) and English
 * (/en/), from three Webflow templates:
 *
 *   Mono      — shell (nav, overlay menu, footer, the FAQ accordion and the
 *               demo form) for every page; since 2026-10-09 its homepage
 *               skeleton carries every page (owShell + tools/ow-blocks: the
 *               product pages in pages.mjs, pricing, about, contact, the
 *               legal pages and 404 in site-pages.mjs, the blog index and the
 *               articles in blog.mjs — the lifelogx blog layout was retired
 *               in the review fixes of the same day)
 *
 *   node tools/fuse-ix.mjs            # the one bundle every page loads
 *   node tools/build-site.mjs         # this file
 *
 * Idempotent: reads only tools/templates/*, tools/fragments/* and
 * tools/copy.mjs. Every replacement is asserted — a template string that
 * stops matching fails the build rather than shipping an agency's copy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { makeSub, findByClass, escapeHtml } from './lib-html.mjs';
import { applyChrome, remapLinks, relocateAssets, relocateLinks, assertInternalLinks } from './chrome.mjs';
import * as C from './copy.mjs';
import { POSTS, postPath } from './blog.mjs';
import { capTitle } from './block-lib.mjs';
import { renderHome, lightbox as owLightbox, stickyBar as owStickyBar } from './ow-blocks/index.mjs';
import { renderProduct, renderWorkforce, renderReminders, renderSecurity } from './ow-blocks/pages.mjs';
import { renderPricing, renderAbout, renderContact, renderLegal, renderNotFound } from './ow-blocks/site-pages.mjs';
import { renderBlogIndex, renderPost } from './ow-blocks/blog.mjs';
import { DEMO_PHONE_MEDIA } from './ow-blocks/demo-video.mjs';
import { SITE } from './paths.mjs';
import { Script } from 'node:vm';
import { stripHtml } from './strip-comments.mjs';
import { versionAssets, unversionedAssets } from './asset-version.mjs';

const TPL = `${SITE}/tools/templates`;
const tpl = (f) => readFileSync(`${TPL}/${f}`, 'utf8');

/* The homepage's opening animation ships its behaviour as a file of its own.
   tools/capability-donors.mjs concatenates a block's `<id>.js` into
   js/capability-blocks.js, which only the capability page loads; this one plays
   on the homepage, so it is written out here as its own script and attached by
   tools/chrome.mjs wherever the overlay's marker appears. (It still rides along
   in capability-blocks.js, where it finds no `[data-og-intro]` and returns.) */
writeFileSync(`${SITE}/js/stargo-intro.js`,
  `/* The homepage's opening animation. Written by tools/build-site.mjs from
   tools/blocks/og-intro.js. Do not edit by hand. */
${readFileSync(`${SITE}/tools/blocks/og-intro.js`, 'utf8')}`, 'utf8');

const SCALORA_CDN = /https:\/\/cdn\.prod\.website-files\.com\/([^"'\s,]+)/g;
const localise = (s) => s.replace(SCALORA_CDN, (_, rel) => `assets/${rel.replace(/%2F/g, '/')}`);

/* ================================================================== pages */

const PAGES = {};

/* ---- index.html — the OPEN WORK homepage inside the Mono chrome ---------
   Since 2026-10-09 the homepage sells the product with its own screens
   (owner: 「图片好小，根本看不清楚系统的东西…把我们系统卖出去」; the round's
   spec supersedes the old "change the words only" rule for this page — see
   tools/blocks/README.md). What stays of the Mono homepage is the chrome
   tools/chrome.mjs rewrites (top navigation, overlay menu, floating pill,
   footer), the FAQ accordion and the demo form. Everything between the
   navigation and the footer is tools/ow-blocks: hero → pain → product showcase
   → approvals → outcomes → 15 apps → pricing → FAQ → demo band.

   Gone from the page, with their stylesheets and scripts: the giant wordmark
   hero with its photo strips and rotating gallery (rototo, offgrid), the
   template logo wall (no wall at all unless assets/brands/ holds real logos),
   the scenario portraits and their film, the fashion banner, the black
   letter-by-letter marquee, the video theatre, the five small stage pictures,
   the core-systems switcher and channel band (Scalora), the 288 card, the
   approval glass card and the blog grid (the blog stays in the navigation and
   the footer). */
function owShell(lang, where, render, bodyClass) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub(where === 'index' ? 'home' : where);
  let h = tpl('index.en.html');

  // The raw export fetches fonts from Google and every asset from Webflow's CDN.
  // This site makes no request that leaves its origin: Inter is self-hosted
  // (css/inter.css) and the assets were mirrored under assets/.
  h = h.replace(/<link href="https:\/\/(?:cdn\.prod\.website-files\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)" rel="preconnect"\/>/g, '');
  h = h.replace(/<script src="js\/webfont\.js" type="text\/javascript"><\/script>/, '');
  h = h.replace(/<script type="text\/javascript">WebFont\.load\([\s\S]*?<\/script>/, '');
  if (/webfont|WebFont\.load|googleapis/.test(h)) throw new Error(`${where}: Google Fonts loader survives`);
  h = localise(h);

  // ---- template residue: the "Pages / Get Template" navigator and its dropdown
  {
    const nav = findByClass(h, 'div', 'template-navigator');
    if (!nav) throw new Error(`${where}: template navigator not found`);
    h = h.slice(0, nav.start) + h.slice(nav.end);
    if (/template-navigator|Get Template/.test(h)) throw new Error(`${where}: template navigator survives`);
  }

  // ---- the page body: the template's hero track goes, and of its page content
  // only the footer stays; the FAQ accordion and the demo form are lifted out of
  // the sections they sat in and handed to the new blocks.
  {
    const track = findByClass(h, 'div', 'hero-track');
    if (!track) throw new Error(`${where}: hero track not found`);
    h = h.slice(0, track.start) + h.slice(track.end);
    const page = findByClass(h, 'div', 'page-content');
    if (!page) throw new Error(`${where}: page content not found`);
    const footer = findByClass(page.text, 'div', 'footer');
    const faqWrapper = findByClass(page.text, 'div', 'faq-wrapper');
    const contactBand = findByClass(page.text, 'section', 'ctc');
    const form = contactBand && findByClass(contactBand.text, 'div', 'w-form');
    if (!footer || !faqWrapper || !form) throw new Error(`${where}: footer, FAQ accordion or demo form not found in the template`);
    // Brand wall: real logos from assets/brands/, or no wall at all.
    const brands = existsSync(`${SITE}/assets/brands`) ? readdirSync(`${SITE}/assets/brands`).filter((f) => /\.(svg|png|webp|jpg|jpeg)$/i.test(f)).sort() : [];
    const ctx = { lang, t, C, faqWrapper: faqWrapper.text, formHtml: form.text, brands };
    h = h.slice(0, page.start) + `<div class="page-content">${render(ctx)}${footer.text}</div>` + h.slice(page.end);
    // The lightbox sits outside .main-content, whose transform would otherwise
    // be the containing block of anything fixed inside it.
    h = s(h, '<div class="preloader">', `${owLightbox(ctx)}${owStickyBar(ctx)}<div class="preloader">`, { count: 1 });
  }
  /* Two template decorations the new page does not use: the full-screen
     crosshair that stood in for the mouse pointer (css/stargo-ow.css gives the
     pointer back) and the "view work / read more" cursor label of the removed
     project and article cards, with the stills it carried. */
  for (const cls of ['plus-line-wrapper', 'text-tool-tip']) {
    const el = findByClass(h, 'div', cls);
    if (!el) throw new Error(`${where}: ${cls} not found`);
    h = h.slice(0, el.start) + h.slice(el.end);
  }
  /* The orb beside the wordmark becomes a still in tools/chrome.mjs
     (applyChrome → orbStills), on every page. The only other film is the
     OPEN WORK demo video (round 2), on the two pages that carry it. */
  assertVideos(h, where, lang);
  /* The footer's button says what every other demo button on this page says
     (the shared chrome calls it 「预约演示」 elsewhere). */
  h = s(h, '<p class="top-text for-b">Let’s Collaborate</p>', `<p class="top-text for-b">${escapeHtml(t(C.HOME_OW.demoLabel))}</p>`, { count: 1 });
  h = h.replace(/(class="(?:top-text logo[^"]*|h1)">)Studio(<)/g, '$1WORK$2');
  h = h.replace(/<title>Mōno™<\/title>/, '<title>STARGO</title>');
  h = s(h, '© 2026 Mōno™ Studio', '© 2026 STARGO WORK');   // the footer line; tools/copy.mjs CHROME drops its trailing " -"
  h = h.split('Mōno™').join('STARGO');

  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  if (!monoLink.test(h)) throw new Error(`${where}: Mono stylesheet link not found`);
  h = h.replace(monoLink, (m) => `${m}\n<link href="css/inter.css" rel="stylesheet" type="text/css"/>\n<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>\n<link href="css/stargo-ow.css" rel="stylesheet" type="text/css"/>`);
  /* Smooth scrolling follows the visitor's motion setting: with reduced
     motion, Lenis moves the page as far as the wheel says, at once. */
  h = s(h, 'const lenis = new Lenis({\n smooth: true,\n lerp: 0.08,', 'const owStill = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;\nconst lenis = new Lenis({\n smooth: !owStill,\n smoothWheel: !owStill,\n lerp: owStill ? 1 : 0.08,', { count: 1 });
  /* the template footer is a <div>: name it as the page's footer landmark */
  h = s(h, '<div data-wf--footer--variant="base" class="footer">', '<div data-wf--footer--variant="base" class="footer" role="contentinfo">', { count: 1 });
  h = s(h, '<body>', `<body class="${bodyClass}">`, { count: 1 });
  h = s(h, '</body>', '<script src="js/stargo-ow.js" defer></script></body>', { count: 1 });
  return h;
}

/* Films on a page. The template's orb (made a still by tools/chrome.mjs), and
   the OPEN WORK demo video (tools/ow-blocks/demo-video.mjs) — on the homepage
   and the product page only, once, in the page's language, exactly as that
   block writes it: data-ow-demo, muted, playsinline, loop, preload="none",
   never autoplay (the first load must not fetch the film), data-start, no
   poster attribute (the still is the <picture> right before it: the phone
   cut's still for DEMO_PHONE_MEDIA, the desktop one otherwise), and the films
   of tools/openwork/video.mjs: the desktop MP4 + WebM first — what a browser
   that ignores `media` on a video source plays without the script — then the
   phone cut's MP4 + WebM for DEMO_PHONE_MEDIA (js/stargo-ow.js puts only one
   pair in the video). Any other <video> fails the build. */
const DEMO_VIDEO_PAGES = new Set(['index', 'capabilities']);
function assertVideos(h, where, lang) {
  const orbs = (h.match(/class="logo-bg[^"]*\bw-background-video\b[^"]*"><video /g) ?? []).length;
  const demos = [...h.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)].filter((m) => /\sdata-ow-demo(?=[\s>=])/.test(` ${m[1]}`));
  const all = (h.match(/<video\b/g) ?? []).length;
  if (all !== orbs + demos.length) throw new Error(`${where}: a video other than the orb and the demo video is on the page`);
  if (!demos.length) return;
  if (!DEMO_VIDEO_PAGES.has(where)) throw new Error(`${where}: the demo video belongs on ${[...DEMO_VIDEO_PAGES].join(' and ')} only`);
  if (demos.length !== 1) throw new Error(`${where}: ${demos.length} demo videos (one per page)`);
  const [whole, attrs, inner] = demos[0];
  const file = (ext) => `assets/stargo-product/ow-demo-${lang}${ext}(?:\\?v=[0-9a-f]{12})?`;
  const M = `media="${DEMO_PHONE_MEDIA.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}"`;
  const need = [/\smuted(?=[\s>])/, /\splaysinline(?=[\s>])/, /\sloop(?=[\s>])/, /\spreload="none"/, /\sdata-start="\d+(?:\.\d+)?"/, /\swidth="1440" height="900"/, /\saria-label="[^"]*(?:演示数据|demo data)[^"]*"/];
  const missing = need.filter((re) => !re.test(` ${attrs}`));
  if (missing.length) throw new Error(`${where}: the demo video lacks ${missing.join(', ')}`);
  if (/\sautoplay\b/.test(attrs)) throw new Error(`${where}: the demo video may not autoplay (it must not load before it is on screen)`);
  if (/\sposter=/.test(attrs)) throw new Error(`${where}: the demo video's still is the <picture> before it, not a poster attribute (a poster cannot follow the screen width)`);
  const sources = [...inner.matchAll(/<source\b([^>]*?)\s*\/?>/g)].map((m) => m[1].trim());
  const want = [
    new RegExp(`^src="${file('\\.mp4')}" type="video/mp4; codecs=avc1\\.640028"$`), new RegExp(`^src="${file('\\.webm')}" type="video/webm; codecs=vp9"$`),
    new RegExp(`^${M} src="${file('-phone\\.mp4')}" type="video/mp4; codecs=avc1\\.640028"$`), new RegExp(`^${M} src="${file('-phone\\.webm')}" type="video/webm; codecs=vp9"$`),
  ];
  if (sources.length !== 4 || !want.every((re, i) => re.test(sources[i]))) throw new Error(`${where}: the demo video's sources are not the ${lang} MP4 + WebM, then the phone cut's MP4 + WebM: ${sources.join(' | ')}`);
  const still = new RegExp(`<picture class="ow-demo-poster" aria-hidden="true"><source ${M} srcset="${file('-phone-poster\\.webp')}" width="720" height="1200" type="image/webp"/><img src="${file('-poster\\.webp')}" width="1440" height="900" alt="[^"]*(?:演示数据|demo data)[^"]*" decoding="async"/></picture>$`);
  if (!still.test(h.slice(0, h.indexOf(whole)))) throw new Error(`${where}: the demo video is not preceded by its still (<picture class="ow-demo-poster">, phone then desktop, in ${lang})`);
}

PAGES['index.html'] = (lang) => homeIntro(owShell(lang, 'index', renderHome, 'ow-home'), lang);

/* ---- the four product pages, built like the homepage (2026-10-09, C2) ----
   capabilities (「产品」), workforce, intelligence (「主动提醒与记忆」) and
   enterprise (「安全与接入」) used to be four different donor templates
   (Mono work-1 with a dozen renok/qubix/cinery blocks, the lifelogx
   homepage and feature pages, Mono studio): black or pink grounds, fashion
   and lifestyle photographs, an astronaut, the retired desktop screenshots,
   the HOLD TO TALK phone, and 9,000 to 31,000px of scroll. Since this round
   they are the homepage's shell (owShell: Mono navigation, overlay menu,
   footer, the template's FAQ accordion and demo form) around
   tools/ow-blocks/pages.mjs, with OPEN WORK renders as the only pictures.
   The anchors other pages link to are kept (see that file). */
const OW_PAGES = { 'capabilities.html': renderProduct, 'workforce.html': renderWorkforce, 'intelligence.html': renderReminders, 'enterprise.html': renderSecurity };
for (const [name, render] of Object.entries(OW_PAGES)) {
  PAGES[name] = (lang) => owShell(lang, name.replace(/\.html$/, ''), (ctx) => render({ ...ctx, capTitle }), 'ow-page');
}

/**
 * The opening overlay is not part of the page.
 *
 * It used to be the first child of <body>: offgrid's bracketed `[STARGO WORK]`
 * on `.og-hero-section`, then rototo's `.og-intro-wipe` columns. Hiding that
 * node in css/offgrid.og.css (`display: none`) still left the markup in the
 * document, so the first paint was the white wordmark whenever the sheet had
 * not applied yet, failed to load, or a later rule showed the node. The
 * homepage builder does not emit the overlay, the hero section, or the wipe.
 * tools/blocks/og-intro.mjs still knows how the donor cut was made; nothing
 * in this build inserts its HTML.
 *
 * An inline rule in the head hides those selectors anyway. It does not depend
 * on css/offgrid.og.css or on js/stargo-intro.js, so a stale fragment cannot
 * cover the orbit poster or the cockpit stills. The rule is on the two
 * homepages only — this function is called from the homepage builder and from
 * nowhere else.
 */

/* Markers of the retired splash. Checked on the document before the kill
   rule is inserted, because that rule names the same classes. */
const INTRO_MARKERS = [
  'data-og-intro',
  'class="og-intro"',
  'og-hero-section',
  'og-intro-wipe',
  'og-intro-column',
  'og-text-spam',
  'og-is-hero',
];

function homeIntro(html, lang) {
  for (const token of INTRO_MARKERS) {
    if (html.includes(token)) throw new Error(`index (${lang}): opening splash is still in the page (${token})`);
  }
  if (html.includes('>[') && html.includes('>STARGO WORK</span>]')) {
    throw new Error(`index (${lang}): the bracketed STARGO WORK splash is still in the page`);
  }
  if (!html.includes('</head>')) throw new Error('index: no </head> for the intro kill rule');
  if (html.includes('id="og-intro-kill"')) throw new Error('index: intro kill rule already present');
  /* Inline, and last in <head>, so it applies on the first paint even when
     css/offgrid.og.css is slow, cached stale, or missing. !important beats a
     later `display: block` that does not itself use !important. */
  const kill = '<style id="og-intro-kill">.og-intro,.og-intro *,.og-hero-section,.og-intro-wipe,.og-intro-column,.og-text-spam{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;overflow:hidden!important}</style>';
  return html.replace('</head>', `${kill}</head>`);
}

function assertNoOpeningSplash(html, where) {
  if (html.includes('data-og-intro') || /class="[^"]*\bog-intro\b/.test(html) || html.includes('>STARGO WORK</span>]')) {
    throw new Error(`${where}: the opening splash is in the generated page`);
  }
  if (!html.includes('id="og-intro-kill"')) throw new Error(`${where}: the intro kill rule is missing`);
}


/* ---- pricing, about, contact, privacy, terms, 404 (C2 pass 2) ----------
   Built like the homepage and the product pages since 2026-10-09: owShell
   (the Mono navigation, overlay menu, footer, the template's demo form)
   around tools/ow-blocks/site-pages.mjs. They were a Scalora/renok/cinery
   pricing page with stock faces, ★★★★★ cards and two recommended plans, a
   cinery about page whose fashion films were labelled as AI employees, the
   Mono contact page with a stock portrait film as the company's voice, and
   Mono's post layout for the legal pages (a globe banner with baked-in
   English; the retired desktop and sw033, a screenshot with real-looking
   names, on notices). The 404 page is made position-independent below
   (absolutePaths), because Cloudflare Pages serves it at any depth.
   The third-party notices page is gone since round 2 (owner, 2026-10-10:
   「移到产品里，网站不要写任何这种开源的东西！我不想被爬取到」): the build no longer
   emits notices.html, its imagery note is a section of terms.html, and
   tools/make-dist.mjs writes a 301 for the old address into dist/_redirects. */
const SITE_PAGES_OW = {
  'pricing.html': renderPricing,
  'about.html': renderAbout,
  'contact.html': renderContact,
  'privacy.html': (ctx) => renderLegal(ctx, C.LEGAL.privacy, 'privacy.html'),
  'terms.html': (ctx) => renderLegal(ctx, C.LEGAL.terms, 'terms.html'),
  '404.html': renderNotFound,
};
for (const [name, render] of Object.entries(SITE_PAGES_OW)) {
  PAGES[name] = (lang) => owShell(lang, name.replace(/\.html$/, ''), render, 'ow-page');
}

/* ---- blog.html and blog/<slug>.html — on the OPEN WORK design ----------
   Built like every other page since the review fixes of 2026-10-09
   (tools/ow-blocks/blog.mjs): the lifelogx layout they used to be — black
   ground, pink takeaways and charts, a giant STARGO wordmark over the footer,
   the template's crosshair in place of the pointer — read as a different site.
   The article body is still tools/blog.mjs renderBody(); the cover is the
   article's own 2:1 crop of an OPEN WORK render (tools/blog-covers.mjs). */
PAGES['blog.html'] = (lang) => {
  const h = owShell(lang, 'blog', renderBlogIndex, 'ow-page ow-blog-page');
  if ((h.match(/class="ow-postcard[ "]/g) ?? []).length !== POSTS.length) throw new Error('blog: not every article has a card');
  return h;
};
for (const post of POSTS) {
  PAGES[postPath(post)] = (lang) => {
    const h = owShell(lang, `post:${post.slug}`, (ctx) => renderPost(ctx, post), 'ow-page ow-post-page');
    if (!/<img\b[^>]*class="ow-postimg"[^>]*loading="eager" fetchpriority="high"/.test(h)) throw new Error(`post ${post.slug}: the cover is not the eager, priority image`);
    return h;
  };
}

/* ================================================================== main */

const FORBIDDEN = [
  /Mōno™ Studio/, /monostudio/i, /Awwwards/, /Lorem/i, /cal\.com/, /Tomato Store/, /Market Play/,
  /Forma Digital/, /Nero Vision/, /One Step/, /Bold Moves/, /Auralis/, /Light[\s\u00a0]Studio/, /Joda Trump/, /Elena Rossi/, /Adrian Keller/, /Camila Verga/,
  /* A template's dollar price ("$2,000", "$174M"). The OPEN WORK renders' demo
     prices are quoted on the homepage as "US$3.85" (always with the currency
     prefix the interface itself prints), so only a bare "$" is forbidden. */
  /(?<!US)\$\s?\d/, /logoipsum/i, /Get Template/, /template-navigator/, /youtube\.com/, /embedly/,
  // stock photography that shipped with the templates
  /Young%20Man%20Smiling/, /Sunset-Serenity/, /Joyful-Group/, /Red-Hat-Portrait/, /work-\d+\.webp/, /work7\.webp/, /Matcha-Latte/, /Party-Scene/, /Scene%20/, /Portrait-of-a-Man/, /Diverse-Group/, /Coding-Workspace/, /Sleek%20Container/, /Futuristic/, /blog-\d\.webp/, /about-6/,
  // lifelogx template people, its CMS article images and its brand
  /Vibrant%20Orange/, /Stylish%20Portrait/, /Metallic%20Jacket/, /Rectangle%2043/, /69417cf6925a82af26179b70/, /Lifelogx/i, /Lina Elsen/, /Amira Brik/, /Mila Eron/, /Oren Solis/,
];
const ALLOWED = {};

/* Pictures that must never stand in for the product, its staff, its customers
   or its reviewers (phase C2, 2026-10-09; impl-spec hard rule 5): the
   templates' stock people, fashion and lifestyle photographs and films, the
   lifelogx phone mock-up with its glowing orb, the analytics-vendor poster stills, the
   renok 3D cards cut from the retired desktop, the retired desktop itself
   (os-desktop, 「系统地图」) and sw033, a screenshot showing real-looking
   names and companies (a privacy risk). A page fails the build if one of
   them is in its markup OR in a rule of a stylesheet it links whose classes
   all occur on the page: the contact band's Joyful-Group photograph was a CSS
   background, which FORBIDDEN (markup only) never saw. */
const STOCK = [
  /Joyful-Group/, /Portrait[^"'\s)]*\.(?:webp|jpe?g|png|avif)/i, /Smiling-Man/, /Women-Relaxing/, /\bteam-\d\.webp/, /\babout-\d\.webp/, /\bwork-?\d+\.webp/, /pexels-/, /projector-theatre/,
  /qubix\/[0-9a-f]+_Rectangle_\d+\.png/, /cinery\/[0-9a-f]+_[0-9a-f]+_video-?\d+_/, /client-0\d/,
  /6929b6c693cb856e01ef7c05\/[0-9a-f]+_(?:Team%20Image|ChatGPT%20Image|iPhone%2014%20Pro|image%2026|no-writing-sc)/,
  /home-one-(?:insights|analytics)\.webp/, /hero-banner-3d-rotation-image-/,
  /stargo-editorial\/os-desktop/, /sw033-sales-desk-document-pack/,
];
/* Pages exempted from the check while C2 still had to clear them. Empty since
   C2 pass 2 (2026-10-09): every page fails the build on a stock picture. */
const STOCK_PENDING = new Set();
const cssCache = new Map();
/** Stock pictures a page shows: in its markup, or through a stylesheet rule whose classes are all on the page. */
function stockHits(html) {
  const hits = [];
  const body = html.slice(html.indexOf('<body'));
  for (const re of STOCK) { const m = body.match(re); if (m) hits.push(`markup: ${m[0]}`); }
  const classes = new Set([...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean));
  const sheets = [...html.matchAll(/<link href="(?:\.\.\/)*(css\/[^"?]+\.css)(?:\?v=[0-9a-f]+)?" rel="stylesheet"/g)].map((m) => m[1]);
  const inline = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  for (const [where, css] of [...sheets.map((f) => [f, cssCache.get(f) ?? cssCache.set(f, readFileSync(`${SITE}/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')).get(f)]), ['<style>', inline.replace(/\/\*[\s\S]*?\*\//g, '')]]) {
    for (const [, selectors, decls] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const urls = [...decls.matchAll(/url\(([^)]*)\)/g)].map((m) => m[1]);
      const bad = urls.find((u) => STOCK.some((re) => re.test(u)));
      if (!bad) continue;
      const used = selectors.split(',').some((sel) => [...sel.matchAll(/\.([A-Za-z0-9_-]+)/g)].every((c) => classes.has(c[1])));
      if (used) hits.push(`${where}: ${selectors.trim().slice(0, 80)} → ${bad.slice(0, 90)}`);
    }
  }
  return hits;
}
const stockPending = [];

/* Retired wording (phase C3, 2026-10-09; buyer-plan §5): the product is STARGO
   WORK with its core app OPEN WORK, an AI workspace for export manufacturers.
   The old names and the empty words around them may not come back in any
   visible text, attribute or structured-data string of any page, whichever
   file they enter through (tools/copy.mjs, tools/blog.mjs, a block, a
   template). tools/blog.mjs holds the same list for the articles' own source,
   which names the offender earlier. 「Form E」, 「补货窗口」 and 「聊天窗口」 are
   ordinary trade and interface words and are not on the list. */
const RETIRED = [
  /Growth OS/, /Sales Desk/, /Trade OS/, /StaffDeck/, /\bDSH\b/, /STARGO OS/, /智能层/,
  /网页桌面|桌面级/, /企业操作系统/, /AI operating system|browser[- ]based (?:desktop|AI)|browser desktop|web desktop/i,
  /两大(?:核心)?引擎|two (?:core )?engines/i, /AI 产能|AI capacity/i, /底座|闭环|全景|赋能/, /前置部署|forward[- ]deployed/i,
  /数字岗位/, /老板驾驶舱/, /示例场景|非客户评价/, /开放说明|登记范围|开放条件/, /批准≠|提交≠/, /不代表会议/, /★/,
  /\b298\b/, /OpenAI|ChatGPT/, /Open Work|OpenWork/,
  /* Hedges that piled up one per section (review, 2026-10-09; buyer-plan §5):
     what is not live yet is said once per page, in its status note, and as a
     plain statement (「要接入你公司的账号…，演示时逐项确认」). */
  /分阶段开放|分阶段完善|分阶段推进|按授权接入|持续完善|建设中|逐项接通|逐条接通|逐项连接|两大/, /continues? to evolve|(?:is|are) phased|in phases|being built out|validated one by one/i,
  /* Round 2 (owner, 2026-10-10: 「可以用了！全部都是完成了的！放心放上官网！」):
     the features are live, so no page may call them unfinished, still being
     built or to be confirmed one by one. Connecting a company's own accounts
     needs its authorization — that is said plainly, not as a hedge. */
  /仍在完善|还在建设|仍在建设|正在建设|逐项确认|演示时确认|已有基础|已有建设|按企业配置启用|开通到哪一步|按已开通|按已开放|资源配置开放|即将(?:上线|推出|开放)/,
  /being built|still evolving|still being|confirmed item by item|confirmed (?:in|during) the demo|(?:have|has) (?:working |established )?foundations|foundations exist|coming soon|where (?:voice services are |the capability is )?enabled|enabled by configuration/i,
];
/* The English staff term is 「AI Staff」 (owner, 2026-10-10), in the copy, the
   blog and the image alt texts (tools/editorial-images.mjs). Fatal, so the old
   terms cannot come back. */
const STAFF_TERM = /[Dd]igital employees?|AI employees?|AI staff\b|AI [Ww]orkforce/;
const STAFF_TERM_FATAL = true;
const staffTermHits = [];

/* Names of upstream software and open-source wording (owner, 2026-10-10:
   「网站不要写任何这种开源的东西！我不想被爬取到」), tools/copy.mjs UPSTREAM.
   Checked against the WHOLE generated page — text, attributes, data-* values,
   inline scripts and comments — not only its visible words: a crawler reads
   all of it. tools/make-dist.mjs runs the same list over every file it ships,
   file names included. */
function upstreamHits(html) {
  return C.UPSTREAM.flatMap((re) => { const m = html.match(re); return m ? [`${m[0]} … ${html.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}`] : []; });
}
/* The templates' hide list (`.buy-template-badge, .brix-badges-wrapper,
   .template-figma-info-wrapper … {display:none!important}`) named the template
   vendors' badges on every page, and none of those elements is on any page
   any more. A selector is kept only while an element on the page carries
   that class (or class prefix); an empty list goes. The Webflow runtime's own
   badge rule stays: the runtime adds that element itself. */
function pruneHides(html) {
  const classes = new Set([...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean));
  const has = (sel) => {
    const cls = /^\.([\w-]+)$/.exec(sel)?.[1];
    if (cls) return classes.has(cls);
    const pre = /^\[class\^=['"]([\w-]+)['"]\]$/.exec(sel)?.[1];
    if (pre) return [...classes].some((c) => c.startsWith(pre));
    return true;   // anything else is kept as written
  };
  return html.replace(/<style>([^<{}]+)\{display:none!important\}<\/style>/g, (m, list) => {
    if (/webflow-badge/.test(list)) return m;
    const keep = list.split(',').map((x) => x.trim()).filter(has);
    return keep.length ? `<style>${keep.join(',')}{display:none!important}</style>` : '';
  });
}

/** The words a visitor, a screen reader, a link preview or a search engine gets from a page. */
function visibleWords(html) {
  const keep = html.replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, ' ');
  const attrs = [...keep.matchAll(/\s(?:alt|title|aria-label|placeholder|content|data-alt|value)="([^"]*)"/g)].map((m) => m[1]);
  return `${keep.replace(/<[^>]+>/g, ' ')}\n${attrs.join('\n')}`;
}
function retiredHits(html) {
  const text = visibleWords(html);
  return RETIRED.flatMap((re) => { const m = text.match(re); return m ? [`${m[0]} … ${text.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' ')}`] : []; });
}

/**
 * The 404 page at any depth. Cloudflare Pages answers a missing address with
 * the nearest 404.html, under the address that was asked for (/blog/a/b,
 * /en/x/y), so a relative `css/…` or `pricing.html` resolved against that
 * address: the page came out unstyled and every link led to another 404.
 * Here every page link, asset and stylesheet is made root-absolute (/…,
 * /en/… for the English pages; in-page # links and external links stay),
 * the page asks not to be indexed, and it names no canonical address.
 */
function notFoundPage(html, lang) {
  const pageBase = lang === 'zh' ? '/' : '/en/';
  let out = html
    .replace(/<link rel="canonical"[^>]*\/>/, '')
    .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*"\/>/g, '')
    .replace(/<meta property="og:url"[^>]*\/>/, '')
    .replace('<title>', '<meta name="robots" content="noindex"/><title>');
  /* assets: (../)assets|css|js/… → /assets|css|js/… */
  const asset = (p) => p.replace(/^(?:\.\.\/)*(assets|css|js)\//, '/$1/');
  out = out
    .replace(/((?:src|href|data-src|data-poster-url|poster|data-mobile-src)=")((?:\.\.\/)*(?:assets|css|js)\/)/g, (_, a, p) => a + asset(p))
    .replace(/(srcset=")([^"]*)"/g, (_, a, v) => `${a}${v.replace(/(^|,\s*)((?:\.\.\/)*(?:assets)\/)/g, (m, sep, p) => sep + asset(p))}"`)
    .replace(/url\((&quot;|"|')?((?:\.\.\/)*assets\/)/g, (_, q = '', p) => `url(${q}${asset(p)}`);
  /* page links: x.html → /x.html (zh) or /en/x.html; the English page's switch ../x.html → /x.html */
  out = out.replace(/href="((?!(?:https?:)?\/\/|mailto:|tel:|\/|#|data:)[^"]*?\.html(?:[#?][^"]*)?)"/g, (_, h) => {
    if (h.startsWith('../')) return `href="/${h.replace(/^(?:\.\.\/)+/, '')}"`;
    return `href="${pageBase}${h}"`;
  });
  const left = [...out.matchAll(/(?:src|href)="(?!\/|#|https?:|mailto:|tel:|data:)([^"]+)"/g)].map((m) => m[1]);
  if (left.length) throw new Error(`[${lang}/404.html] relative paths remain: ${[...new Set(left)].slice(0, 6).join(', ')}`);
  return out;
}

mkdirSync(`${SITE}/en`, { recursive: true });
const written = [];
for (const lang of C.LANGS) {
  for (const [name, build] of Object.entries(PAGES)) {
    let html = build(lang);
    html = applyChrome(html, { lang, current: name });
    html = remapLinks(html);
    assertInternalLinks(html, `${lang}/${name}`);
    const body = html.slice(html.indexOf('<body'));
    {
      const hits = [];
      for (const re of FORBIDDEN) {
        if ((ALLOWED[name] ?? []).some((ok) => ok.source === re.source)) continue;
        const m = body.match(re);
        if (m) hits.push(re + ' @ ...' + body.slice(Math.max(0, m.index - 90), m.index + 60).replace(/\s+/g, ' ') + '...');
      }
      if (hits.length) throw new Error('[' + lang + '/' + name + '] forbidden content:\n  ' + hits.join('\n  '));
    }
    {
      const retired = retiredHits(html);
      if (retired.length) throw new Error(`[${lang}/${name}] retired wording:\n  ${retired.join('\n  ')}`);
      const staff = visibleWords(html).match(STAFF_TERM);
      if (staff && STAFF_TERM_FATAL) throw new Error(`[${lang}/${name}] English staff term must be 「AI Staff」: ${staff[0]}`);
      if (staff) staffTermHits.push(`${lang}/${name}: ${staff[0]}`);
      const upstream = upstreamHits(html);
      if (upstream.length) throw new Error(`[${lang}/${name}] upstream software or open-source wording:\n  ${upstream.join('\n  ')}`);
    }
    {
      const stock = stockHits(html);
      if (stock.length && STOCK_PENDING.has(name)) stockPending.push(`${lang}/${name} (${stock.length})`);
      else if (stock.length) throw new Error(`[${lang}/${name}] stock or retired imagery:\n  ${stock.join('\n  ')}`);
    }
    for (const m of html.matchAll(/(?:src|href|data-src|data-poster-url|poster)="(assets\/[^"]+)"/g)) {
      const rel = decodeURIComponent(m[1]).split('?')[0];
      if (!existsSync(`${SITE}/${rel}`) && !existsSync(`${SITE}/${m[1]}`)) throw new Error(`[${lang}/${name}] missing asset: ${m[1]}`);
    }
    for (const m of html.matchAll(/srcset="([^"]*)"/g)) {
      for (const part of m[1].split(',')) {
        const f = part.trim().split(/\s+/)[0];
        if (f.startsWith('assets/') && !existsSync(`${SITE}/${decodeURIComponent(f).split('?')[0]}`) && !existsSync(`${SITE}/${f}`)) throw new Error(`[${lang}/${name}] missing srcset asset: ${f}`);
      }
    }
    // Pages in a folder (blog/) link and load one level up; English pages one more.
    if (name === 'index.html') assertNoOpeningSplash(html, `${lang}/${name}`);
    const depth = name.split('/').length - 1;
    html = relocateLinks(html, '../'.repeat(depth));
    const assetUp = '../'.repeat(depth + (lang === 'en' ? 1 : 0));
    if (assetUp) html = relocateAssets(html, assetUp);
    if (name === '404.html') html = notFoundPage(html, lang);
    /* No comments ship in a page (review, round 2: they named the purchased
       templates and the libraries): HTML comments and the comments of inline
       scripts and styles go (tools/strip-comments.mjs); every stripped script
       must still compile. */
    html = stripHtml(html, (code, module) => { if (!module) new Script(code, { filename: `${lang}/${name} (inline script)` }); });
    html = pruneHides(html);
    /* Every asset URL carries its file's cache key (review, round 3:
       /assets/* is immutable for a year, and pictures replaced in place kept
       their URL): ?v=<sha256-12>, as css/ and js/ always have
       (tools/asset-version.mjs). A reference left without it fails the build. */
    html = versionAssets(html);
    {
      const left = unversionedAssets(html);
      if (left.length) throw new Error(`[${lang}/${name}] asset URLs without their ?v= cache key: ${[...new Set(left)].slice(0, 8).join(', ')}`);
    }
    const out = lang === 'zh' ? `${SITE}/${name}` : `${SITE}/en/${name}`;
    mkdirSync(out.slice(0, out.lastIndexOf('/')), { recursive: true });
    writeFileSync(out, html.replace(/[\t ]+$/gm, ''), 'utf8');
    written.push(`${lang}/${name}`);
  }
}
console.log(`wrote ${written.length} pages: ${written.join(', ')}`);
if (stockPending.length) console.log(`stock imagery on exempted pages (STOCK_PENDING): ${stockPending.join(', ')}`);
if (staffTermHits.length) console.log(`staff term other than 「AI Staff」 (not fatal yet, see STAFF_TERM): ${staffTermHits.join(', ')}`);
