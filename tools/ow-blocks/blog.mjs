/**
 * The blog on the OPEN WORK design (2026-10-09, review fixes):
 *
 *   blog.html         renderBlogIndex   the heading, one featured article and
 *                                       the other six as cards
 *   blog/<slug>.html  renderPost        title, date line, the cover in a
 *                                       window frame, the article body
 *                                       (tools/blog.mjs renderBody: answer,
 *                                       takeaways, sections, charts, FAQ),
 *                                       three more articles, the demo band
 *
 * They replace the lifelogx layout (black ground, pink takeaways and charts,
 * the giant STARGO wordmark above the footer, the template's crosshair
 * pointer), so the blog reads as the same site as the product pages: same
 * shell (tools/build-site.mjs owShell), same ground, type and blue, the same
 * macOS-style window frame round every OPEN WORK picture and the same
 * 「演示数据」/"Demo data" badge in its title bar — HTML, never over the
 * interface. The covers are 2:1 crops of OPEN WORK renders made by
 * tools/blog-covers.mjs. The article body keeps its own classes (.stargo-post,
 * .sgp-*, figure.sgc); css/stargo-fusion.css V7-BLOG styles them inside
 * `.ow-post-body`.
 */
import { escapeHtml } from '../lib-html.mjs';
import { heading, button, ICON, shotNoteFor } from './shared.mjs';
import * as contact from './contact.mjs';
import { POSTS, BLOG_UI, COVER_RENDER, postPath, others, coverSrc, coverSrcset, coverAlt, formatDate, renderBody, titleHtml } from '../blog.mjs';

const esc = escapeHtml;
/** Cover files are 2:1 (tools/blog-covers.mjs SIZES). */
const COVER_W = 1200;
const COVER_H = 600;

/** The window title bar every cover sits under: traffic lights, the app's name, the badge. */
const bar = (t, C, title = true) => `<div class="ow-frame-bar ow-postbar" aria-hidden="true"><span class="ow-lights"><i></i><i></i><i></i></span>`
  + `${title ? '<span class="ow-frame-title">OPEN WORK</span>' : ''}<span class="ow-badge">${esc(t(C.HOME_OW.badge))}</span></div>`;

function coverImg(post, { sizes, alt = '', load = 'lazy', priority = false }) {
  const loading = load === 'eager' ? ` loading="eager"${priority ? ' fetchpriority="high"' : ''}` : ' loading="lazy"';
  return `<img src="${coverSrc(post)}" srcset="${coverSrcset(post)}" sizes="${sizes}" width="${COVER_W}" height="${COVER_H}" alt="${esc(alt)}" class="ow-postimg"${loading}/>`;
}

/**
 * One article card: the cover in a small window, the section and date, the
 * title and the one-line description. The whole card is the link. The cover
 * is decorative here (alt=""): the title says where the link goes, and the
 * badge says the picture is demo data.
 */
function card(ctx, post, { level = 'h2', featured = false, load = 'lazy', priority = false } = {}) {
  const { lang, t, C } = ctx;
  const sizes = featured
    ? '(max-width: 767px) calc(100vw - 40px), (max-width: 991px) calc(100vw - 80px), 700px'
    : '(max-width: 767px) calc(100vw - 40px), (max-width: 991px) calc(50vw - 50px), 400px';
  return `<li class="ow-postcard${featured ? ' ow-postcard--featured' : ''}"><a href="${postPath(post)}">`
    + `<div class="ow-postshot">${bar(t, C, featured)}${coverImg(post, { sizes, load, priority })}</div>`
    + `<div class="ow-post-t"><p class="ow-post-kicker">${esc(t(post.section))} · <time datetime="${post.date}">${esc(formatDate(post.date, lang))}</time></p>`
    + `<${level} class="ow-post-title">${heading(lang, t(post.title))}</${level}>`
    + `<p class="ow-post-desc">${heading(lang, t(post.description))}</p>`
    + `<span class="ow-post-more">${esc(t(BLOG_UI.read))}${ICON.arrow}</span></div>`
    + `</a></li>`;
}

export function renderBlogIndex(ctx) {
  const { lang, t } = ctx;
  /* The Chinese heading breaks after its comma; the second half is the blue one. */
  const h = t(BLOG_UI.heading);
  const cut = lang === 'zh' ? h.indexOf('，') + 1 : h.indexOf(' through ') + 1;
  if (cut <= 0) throw new Error('blog: the heading has no place to break');
  const intro = t(BLOG_UI.intro).replace(/<wbr>/g, '');
  const [first, ...rest] = POSTS;
  if (rest.length % 3) throw new Error(`blog: ${rest.length} cards after the featured one do not fill rows of three`);
  return `<main class="ow ow-inner ow-blog" id="main">`
    + `<section class="ow-hero ow-hero--blog" aria-labelledby="ow-hero-title"><div class="ow-wrap"><div class="ow-hero-head">`
    + `<p class="ow-eyebrow ow-eyebrow--pill"><span class="ow-spark" aria-hidden="true">${ICON.spark}</span>${esc(t(BLOG_UI.section))}</p>`
    + `<h1 id="ow-hero-title" class="ow-h1"><span>${heading(lang, h.slice(0, cut).trim())}</span> <span class="ow-h1-2">${heading(lang, h.slice(cut).trim())}</span></h1>`
    + `<p class="ow-lead">${heading(lang, intro)}</p></div></div></section>`
    + `<section class="ow-sec ow-sec--white ow-blog-list" aria-label="${esc(t(BLOG_UI.list))}"><div class="ow-wrap">`
    /* the first row on a desktop and the first card on a phone are in the first screen: eager */
    + `<ul class="ow-postcards ow-postcards--featured">${card(ctx, first, { featured: true, load: 'eager', priority: true })}</ul>`
    + `<ul class="ow-postcards">${rest.map((p, i) => card(ctx, p, { load: i < 3 ? 'eager' : 'lazy' })).join('')}</ul>`
    + `</div></section>`
    + contact.render(ctx)
    + `</main>`;
}

export function renderPost(ctx, post) {
  const { lang, t, C } = ctx;
  const alt = coverAlt(post, lang);
  if (!alt) throw new Error(`post ${post.slug}: the cover has no alt text`);
  const head = `<header class="ow-post-hero"><div class="ow-wrap ow-post-wrap">`
    + `<p class="ow-post-crumb"><a href="blog.html">${esc(t(BLOG_UI.section))}</a><span aria-hidden="true"> / </span><span>${esc(t(post.section))}</span></p>`
    + `<h1 id="ow-hero-title" class="ow-h1 ow-post-h1"><span>${titleHtml(post, lang, esc)}</span></h1>`
    + `<p class="ow-post-lead">${heading(lang, t(post.description))}</p>`
    /* the separators stay with the part before them (&nbsp;), so no line starts with 「·」 */
    + `<p class="ow-post-meta"><time datetime="${post.date}">${esc(formatDate(post.date, lang))}</time>&nbsp;· <span class="ow-post-by">${esc(t(BLOG_UI.byline))}</span>&nbsp;· <a href="blog.html">${esc(t(BLOG_UI.all))}</a></p>`
    + `</div></header>`;
  /* The cover is the article's largest picture and sits in the first screen: eager, and the priority image. */
  const cover = `<div class="ow-postcover-band"><div class="ow-wrap ow-postcover-wrap"><figure class="ow-postcover"><div class="ow-frame">${bar(t, C)}<div class="ow-frame-body">`
    + coverImg(post, { sizes: '(max-width: 767px) calc(100vw - 40px), (max-width: 1179px) calc(100vw - 80px), 1080px', alt, load: 'eager', priority: true })
    + `</div></div><figcaption class="ow-shot-note">${heading(lang, t(shotNoteFor(C.HOME_OW, COVER_RENDER[post.cover])))}</figcaption></figure></div></div>`;
  const body = `<div class="ow-wrap ow-post-wrap"><div class="ow-post-body"><div class="stargo-post">${renderBody(post, lang)}</div></div></div>`;
  const more = `<section class="ow-sec ow-sec--glow ow-post-more-sec" aria-labelledby="ow-more-title"><div class="ow-wrap">`
    + `<div class="ow-split"><h2 id="ow-more-title" class="ow-h2">${esc(t(BLOG_UI.more))}</h2><p class="ow-head-link">${button('blog.html', t(BLOG_UI.all), { kind: 'secondary', icon: 'arrow' })}</p></div>`
    + `<ul class="ow-postcards">${others(post, 3).map((p) => card(ctx, p, { level: 'h3' })).join('')}</ul>`
    + `</div></section>`;
  return `<main class="ow ow-inner ow-post" id="main"><article class="ow-article">${head}${cover}${body}</article>${more}${contact.render(ctx)}</main>`;
}
