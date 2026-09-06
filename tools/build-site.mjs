/**
 * Build every page of the STARGO WORK site, in Chinese (root) and English
 * (/en/), from three Webflow templates:
 *
 *   Mono      — shell (nav, footer), homepage skeleton, capabilities,
 *               enterprise, contact, notices, 404
 *   Scalora   — three homepage modules and the pricing page
 *   lifelogx  — the Intelligence and AI Workforce pages, About, Blog and the articles
 *
 *   node tools/lifelogx-prepare.mjs   # once per template change
 *   node tools/fuse-ix.mjs            # the one bundle every page loads
 *   node tools/build-site.mjs         # this file
 *
 * Idempotent: reads only tools/templates/*, tools/fragments/* and
 * tools/copy.mjs. Every replacement is asserted — a template string that
 * stops matching fails the build rather than shipping an agency's copy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { makeSub, findByClass, removeByClass, elementContaining, extractElement, setInner, setEachInner, setLink, escapeHtml } from './lib-html.mjs';
import { applyChrome, remapLinks, relocateAssets, relocateLinks, assertInternalLinks, stillImage, WORDMARK } from './chrome.mjs';
import * as C from './copy.mjs';
import { POSTS, BLOG_UI, postPath, featured, others, coverSrc, coverSrcset, formatDate } from './blog.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const TPL = `${SITE}/tools/templates`;
const FRAG = `${SITE}/tools/fragments`;
const tpl = (f) => readFileSync(`${TPL}/${f}`, 'utf8');
const frag = (f) => readFileSync(`${FRAG}/${f}`, 'utf8');

/**
 * Lifelogx closes every page with a full-bleed wordmark above its footer: a filled
 * headline, a gradient wash over it and a stroked copy that slides across on scroll
 * (two SCROLL_INTO_VIEW interactions, kept as the template wrote them). We use Mono's
 * footer, so tools/lifelogx-prepare.mjs rescues the block on its own; here it goes
 * back where it belongs — the last thing in the body, directly above the footer —
 * carrying STARGO's name.
 */
const bigMark = () => {
  const b = frag('lx-bigmark.html').split('>Lifelogx</h1>').join('>STARGO</h1>');
  if (/Lifelogx/.test(b)) throw new Error('bigmark: template brand survives');
  if ((b.match(/>STARGO<\/h1>/g) ?? []).length !== 2) throw new Error('bigmark: expected the filled and the stroked headline');
  return b;
};

const SCALORA_CDN = /https:\/\/cdn\.prod\.website-files\.com\/([^"'\s,]+)/g;
const localise = (s) => s.replace(SCALORA_CDN, (_, rel) => `assets/${rel.replace(/%2F/g, '/')}`);
/** Scalora classes renamed when its stylesheet was namespaced (see css/scalora-modules.sc.css). */
const SC_RENAME = new Set(['container', 'hero', 'navbar', 'menu-button', 'footer', 'white', 'faq-item', 'error-message', 'contact-card', 'button-text', 'pricing-card', 'color-block', 'utility-page-wrap', 'utility-page-content']);
const scClasses = (html) => html.replace(/class="([^"]*)"/g, (_, v) => `class="${v.split(/\s+/).filter(Boolean).map((c) => (SC_RENAME.has(c) ? 'sc-' + c : c)).join(' ')}"`);
const addRootClass = (fragment, token) => fragment.replace(/^(<section\b[^>]*class=")/, `$1${token} `);

const ABSTRACT = [
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4dca_Sleek%20Container%20Set.webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4d64_blog-2.webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4e03_Futuristic%20Device%20Design%20(2).webp',
  'assets/699b6466d5f19893993a4c2c/699b6466d5f19893993a4da8_Futuristic-Device-Design-(4).webp',
  'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4faf_Coding-Workspace-Close-Up.webp',
];
/** STARGO's own imagery (tools/visuals → assets/stargo). */
const IMG = (n) => `assets/stargo/${n}`;
const OS = { cockpit: IMG('os-cockpit.webp'), desk: IMG('os-sales-desk.webp'), inquiries: IMG('os-inquiries.webp'), agents: IMG('os-agent-center.webp'), quote: IMG('os-quote-studio.webp'), trade: IMG('os-trade-execution.webp'), desktop: IMG('os-desktop.webp'), login: IMG('os-login.webp'), boot: IMG('os-boot.webp'), loading: IMG('os-loading.webp') };
const BRAND = { wide: IMG('brand-glow-wide.webp'), square: IMG('brand-glow-square.webp'), tall: IMG('brand-glow-tall.webp'), ontology: IMG('brand-ontology.webp'), loop: IMG('brand-loop.webp'), family: (n) => IMG(`brand-family-0${n}.webp`) };
const MOBILE = { approvals: IMG('mobile-approvals.webp'), agents: IMG('mobile-agents.webp'), inquiry: IMG('mobile-inquiry.webp'), core: IMG('mobile-core.webp'), phoneApprovals: IMG('phone-approvals.webp'), phoneAgents: IMG('phone-agents.webp') };
const SILO = ['email', 'whatsapp', 'excel', 'erp'].map((n) => IMG(`silo-${n}.webp`));
const AVATARS = Array.from({ length: 12 }, (_, i) => IMG(`avatar-${String(i + 1).padStart(2, '0')}.png`));
/** Replace the src/srcset/sizes of the nth <img> whose src contains `key` (all of them when nth is null). */
function swapImg(html, key, src, { nth = null, alt = '' } = {}) {
  let seen = 0, hit = false;
  const out = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (!tag.includes(key)) return tag;
    const idx = seen++;
    if (nth != null && idx !== nth) return tag;
    hit = true;
    return tag.replace(/\s*srcset="[^"]*"/g, '').replace(/\s*sizes="[^"]*"/g, '').replace(/src="[^"]*"/, `src="${src}"`).replace(/alt="[^"]*"/, `alt="${alt}"`);
  });
  if (!hit) throw new Error(`swapImg: no <img> with ${key}${nth != null ? ` #${nth}` : ''}`);
  return out;
}
const CHECK = 'assets/69a01660589c516ba5f0f917/69a9086623545093091785d8_check-icon.svg';
const CROSS = 'assets/69a01660589c516ba5f0f917/69a91f28a82e2c7b982d5703_cancel-circle-icon.svg';

/* ================================================================ modules */

/** Mono's awards table (studio.html) as a reusable 3-column list. */
function awardsTable({ id, caption, title, total, button, headers, rows }) {
  const studio = tpl('studio.html');
  const sec = elementContaining(studio, '(Awards 23-26©)', 'section');
  const { fn: s } = makeSub('awards');
  let html = sec.text.replace(/^<section class="section">/, `<section id="${id}" class="section">`);
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
  const renderRow = (r) => { let out = rowTpl; for (let i = 0; i < 3; i++) out = out.replace(cells[i], `class="award-text">${r[i]}<`); return out; };
  html = html.slice(0, first.start) + rows.map(renderRow).join('') + html.slice(last.end);
  if ((html.match(/award-wrapper/g) ?? []).length !== rows.length) throw new Error('awards: row count mismatch');
  return html;
}

function teamCard(html, oldName, oldRole, { name, role, image }) {
  const { fn: s } = makeSub(`team:${oldName}`);
  let out = s(html, `>${oldName}<`, `>${name}<`, { count: 1 });
  out = s(out, `>${oldRole}<`, `>${role}<`, { count: 1 });
  if (image) {
    const card = elementContaining(out, `>${name}<`, 'div', { up: 2 });
    if (!card.text.includes('team-wrapper')) throw new Error(`team: card wrapper not found for ${name}`);
    out = out.slice(0, card.start) + card.text.replace(/src="[^"]*"/, `src="${image}"`) + out.slice(card.end);
  }
  return out;
}
const TEAM_TPL = [['Adrian Keller', '(Founder)'], ['Luca Moretti', '(Lead Product Designer)'], ['Elena Novak', '(UI/UX Designer)'], ['Daniel Hartmann', '( Developer)'], ['Maya Laurent', '(Framer Specialist)']];

/** The Mono studio page as a long-form page. */
function fromStudio(spec, lang) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub(spec.name);
  let h = tpl('studio.html');
  h = s(h, '(Our Studio ©26)', t(spec.eyebrow));
  h = s(h, '>About Mōno™<', `>${t(spec.h1)}<`);
  ['d01', 'd02', 'd03', 'd04'].forEach((d, i) => {
    h = s(h, `<h2 class="h2 for-abt ${d}">(©2${3 + i})</h2>`, `<h2 class="h2 for-abt ${d}">${t(spec.story[i].label)}</h2>`);
    h = setInner(h, `<p class="top-text for-abt t0${i + 1}">`, t(spec.story[i].text));
  });
  h = s(h, '(Introduction)', t(spec.introLabel));
  h = setInner(h, '<h2 class="h2 _01 sm _600">', t(spec.intro));
  h = removeByClass(h, 'div', 'as-seen');
  h = s(h, '(Approach)', t(spec.approachLabel));
  ['Think clearly.', 'Design precisely.', 'Build intelligently.', 'Refine continuously.'].forEach((x, i) => { h = s(h, x, t(spec.approach[i]), { count: 1 }); });
  h = setLink(h, 'Begin collaboration', { href: spec.approachButton.href, text: t(spec.approachButton.label) });
  h = s(h, '(Stats)', t(spec.statsLabel));
  [['30', spec.stats[0]], ['80', spec.stats[1]], ['+7', spec.stats[2]]].forEach(([old, st]) => {
    const open = `<h2 class="h2 _01">${old}</h2></div><div><p class="top-text">`;
    const i = h.indexOf(open);
    if (i === -1) throw new Error(`${spec.name}: stat ${old} not found`);
    const end = h.indexOf('<br/></p>', i);
    h = h.slice(0, i) + `<h2 class="h2 _01">${st.value}</h2></div><div><p class="top-text">${t(st.text)}` + h.slice(end);
  });
  h = s(h, '(Success stories)', t(spec.quoteLabel));
  h = setInner(h, '<div class="top-text for-sst">', t(spec.quote.text));
  h = s(h, '>Elena Rossi<', `>${t(spec.quote.who)}<`);
  h = s(h, '>Marketing Director at Auralis®<', `>${t(spec.quote.where)}<`);
  h = h.replace(/<img[^>]*class="logo-absolute"[^>]*\/>/, '');
  if (h.includes('logo-absolute')) throw new Error(`${spec.name}: template client logo survives`);
  h = s(h, 'Creative Minds <span class="small-ftd finr">(5)</span>', `${t(spec.cardsTitle)} <span class="small-ftd finr">(5)</span>`);
  TEAM_TPL.forEach(([n, r], i) => { h = teamCard(h, n, r, { name: t(spec.cards[i].name), role: t(spec.cards[i].role), image: spec.images.cards[i] }); });
  // Stock photos (keyboard hands, portraits, a crowd, a face) → STARGO imagery; the four hero
  // backgrounds are CSS and are overridden in stargo-fusion.css (.image-about._01…_04).
  [['699b6466d5f19893993a4faf_Coding-Workspace-Close-Up', spec.images.work[0]], ['699b6466d5f19893993a4fa9_Portrait-of-a-Man', spec.images.work[1]], ['699b6466d5f19893993a4f9c_Diverse-Group-Portrait', spec.images.work[2]], ['699b6466d5f19893993a4fa0_about-6', spec.images.quote]]
    .forEach(([k, src]) => { h = swapImg(h, k, src); });
  h = s(h, '(Leadership)', t(spec.noteLabel));
  h = setInner(h, '<p class="top-text big for-inr">', t(spec.note));
  h = setLink(h, 'Join us', { href: spec.noteButton.href, text: t(spec.noteButton.label) });
  const partners = elementContaining(h, '(Partners)', 'div', { up: 2 });
  if (!partners.text.includes('partner-grid') || !partners.text.startsWith('<div class="margin-150">')) throw new Error(`${spec.name}: partner block boundary`);
  h = h.slice(0, partners.start) + h.slice(partners.end);
  const awards = elementContaining(h, '(Awards 23-26©)', 'section');
  const tb = spec.table;
  h = h.slice(0, awards.start) + awardsTable({
    id: 'table', caption: t(tb.caption), title: t(tb.title), total: tb.rows.length,
    button: { label: t(tb.button.label), href: tb.button.href }, headers: tb.headers.map(t),
    rows: tb.rows.map((r) => r.map((c) => escapeHtml(t(c)))),
  }) + h.slice(awards.end);
  return h;
}

/**
 * Fill a template card list with articles. `list`/`item` are class tokens of the
 * list and its repeated item; the item's image, date and title are located by
 * class. Extra template items are dropped, missing ones cloned from the first.
 */
function blogCards(html, list, item, posts, lang, cls) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const wrap = findByClass(html, 'div', list);
  if (!wrap) throw new Error(`cards: list ${list} not found`);
  const first = findByClass(wrap.text, 'div', item, 0);
  if (!first) throw new Error(`cards: item ${item} not found`);
  let last = first;
  for (let n = 1; ; n++) { const el = findByClass(wrap.text, 'div', item, n); if (!el) break; last = el; }
  const imgRe = new RegExp(`<img[^>]*class="${cls.image}"[^>]*/>`);
  const render = (p) => {
    let x = first.text;
    x = x.replace(/href="[^"]*"/, `href="${postPath(p)}"`);
    if (!imgRe.test(x)) throw new Error(`cards: image ${cls.image}`);
    // Keep the tag's own attributes (data-w-id and the interaction's initial inline state); swap only the image.
    x = x.replace(imgRe, (tag) => tag.replace(/\s*srcset="[^"]*"/g, '').replace(/\s*sizes="[^"]*"/g, '').replace(/\s*width="[^"]*"|\s*height="[^"]*"/g, '')
      .replace(/src="[^"]*"/, `src="${coverSrc(p)}" srcset="${coverSrcset(p)}" sizes="${cls.sizes}"`));   // no width/height: the template sizes these by CSS aspect-ratio
    const titleRe = new RegExp(`(<(h4|div)[^>]*class="${cls.title}">)[^<]*(</\\2>)`);
    if (!titleRe.test(x)) throw new Error(`cards: title ${cls.title}`);
    x = x.replace(titleRe, `$1${escapeHtml(t(p.title))}$3`);
    if (cls.date) {
      const dateRe = new RegExp(`(<p[^>]*class="${cls.date}">)[^<]*(</p>)`);
      if (!dateRe.test(x)) throw new Error(`cards: date ${cls.date}`);
      x = x.replace(dateRe, `$1<time datetime="${p.date}">${formatDate(p.date, lang)}</time>$2`);
    }
    if (cls.description) {
      const descRe = new RegExp(`(<div[^>]*class="${cls.description}">)[^<]*(</div>)`);
      if (!descRe.test(x)) throw new Error(`cards: description ${cls.description}`);
      x = x.replace(descRe, `$1${escapeHtml(t(p.description))}<span class="lx-post-date"><time datetime="${p.date}">${formatDate(p.date, lang)}</time></span>$2`);
    }
    return x;
  };
  const inner = wrap.text.slice(0, first.start) + posts.map(render).join('') + wrap.text.slice(last.end);
  return html.slice(0, wrap.start) + inner + html.slice(wrap.end);
}

/** Mono page shell (nav … footer) with a foreign body dropped in. */
function inMonoShell(body, extraCss) {
  const studio = tpl('studio.html');
  const heroAt = studio.search(/<div[^>]*class="hero for-inner/);
  const footerAt = studio.indexOf('<div data-wf--footer--variant="base" class="footer">');
  if (heroAt === -1 || footerAt === -1) throw new Error('shell: studio cut points');
  let html = studio.slice(0, heroAt) + body + studio.slice(footerAt);
  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  if (!monoLink.test(html)) throw new Error('shell: Mono stylesheet link not found');
  html = html.replace(monoLink, (m) => `${m}\n${extraCss.map((c) => `<link href="css/${c}" rel="stylesheet" type="text/css"/>`).join('\n')}`);
  return html;
}

/* ================================================================== pages */

const PAGES = {};

/* ---- index.html — Mono homepage + three Scalora modules --------------- */
PAGES['index.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub('home');
  let h = tpl('index.en.html');

  // The raw export fetches fonts from Google and every asset from Webflow's CDN.
  // This site makes no request that leaves its origin: Inter is self-hosted
  // (css/inter.css) and the assets were mirrored under assets/.
  h = h.replace(/<link href="https:\/\/(?:cdn\.prod\.website-files\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)" rel="preconnect"\/>/g, '');
  h = h.replace(/<script src="js\/webfont\.js" type="text\/javascript"><\/script>/, '');
  h = h.replace(/<script type="text\/javascript">WebFont\.load\([\s\S]*?<\/script>/, '');
  if (/webfont|WebFont\.load|googleapis/.test(h)) throw new Error('index: Google Fonts loader survives');
  h = localise(h);
  h = h.replace(/<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/, (m) => `${m}
<link href="css/inter.css" rel="stylesheet" type="text/css"/>`);

  // Hero list: the five pillars the page then walks through (loop, workforce,
  // ontology, approval, evolution). The template's five service names stay
  // only in the numbered stage list, where HOME_MONO turns them into stages.
  {
    const flex = findByClass(h, 'div', 'flex-top');
    if (!flex) throw new Error('index: hero list');
    const inner = C.HOME_HERO_LIST.map((l) => `<p class="top-text big">${t(l)}<!--$--><br/><!--/$--></p>`).join('');
    h = h.slice(0, flex.start) + `<div class="flex-top">${inner}</div>` + h.slice(flex.end);
  }
  for (const [old, pair, opts] of C.HOME_MONO) h = s(h, old, t(pair), opts);
  // Shorter hero copy on phones (swapped in before the text animation splits lines).
  h = h.replace(/<p class="top-text big nm">/, `<p class="top-text big nm" data-mobile-text="${escapeHtml(t(C.HOME_MOBILE.heroSupport))}">`);

  // ---- template residue: the "Pages / Get Template" navigator and its dropdown
  {
    const nav = findByClass(h, 'div', 'template-navigator');
    if (!nav) throw new Error('index: template navigator not found');
    h = h.slice(0, nav.start) + h.slice(nav.end);
    if (/template-navigator|Get Template/.test(h)) throw new Error('index: template navigator survives');
  }
  // The template's client logos on the sticky cards and the flip cards → the STARGO mark; the image card's logo goes.
  h = h.replace(/<img[^>]*class="logo-testi-1"[^>]*\/>/g, `<img src="${WORDMARK}" loading="lazy" alt="STARGO WORK" class="logo-testi-1 stargo-card-mark"/>`);
  h = h.replace(/<img[^>]*class="logo-absolute"[^>]*\/>/g, '');
  // "Meet the AI workforce" goes to the workforce page, not to a pricing anchor.
  h = s(h, 'href="#Pricing"', 'href="workforce.html"', { count: 1 });
  h = s(h, 'id="Pricing"', 'id="compare"', { count: 1 });
  // The stats block became the pricing ladder: its button goes to pricing.
  {
    const a = h.indexOf('<section class="section drk"'); const z = h.indexOf('<section class="section with-minus"', a);
    if (a === -1 || z === -1) throw new Error('index: stats section');
    let sec = h.slice(a, z);
    const label = t(C.HOME_MONO.find(([o]) => o === 'Let&#x27;s talk')[1]);
    sec = setLink(sec, label, { href: 'pricing.html', text: lang === 'zh' ? '查看定价' : 'See pricing' });
    sec = sec.replace('<p class="top-text half">', `<p class="top-text half" data-mobile-text="${escapeHtml(t(C.HOME_MOBILE.ladder))}">`);
    if (!sec.includes('data-mobile-text')) throw new Error('index: ladder paragraph');
    // The template pins its orb 50px from the left of a centred title and indents the first line
    // past it, which only works for the first line the template happened to have. Inline the orb
    // before the first character so it travels with the text in both languages and at every width.
    const orbOpen = '<div class="video-logo for-sct">';
    const orbAt = sec.indexOf(orbOpen);
    if (orbAt === -1) throw new Error('index: ladder orb');
    const orb = extractElement(sec, orbAt, 'div');
    sec = sec.slice(0, orb.start) + sec.slice(orb.end);
    const inline = `<span class="video-logo for-sct stargo-inline-orb">${orb.text.slice(orbOpen.length, -'</div>'.length)}</span>`;
    sec = sec.replace(/(<h2 id="[^"]*" class="h2 for-stats">)/, (m) => m + inline);
    if (!sec.includes('stargo-inline-orb')) throw new Error('index: ladder orb placement');
    h = h.slice(0, a) + sec + h.slice(z);
  }

  // ---- imagery: the problem cards, the five stages, the OS "theatre", the sticky card, the ladder card, the four doors
  {
    const cards = ['699b6466d5f19893993a4d79_work-1.webp', '699b6466d5f19893993a4d34_work-5.webp', '699b6466d5f19893993a4d1a_work-4.webp', '699b6466d5f19893993a4d8f_work-8.webp'];
    cards.forEach((k, i) => { h = swapImg(h, k, SILO[i]); });
    const scenes = [['Scene%20%239.webp', OS.desk], ['Scene%20%235.webp', OS.inquiries], ['Scene%20%2310%20(Light)', OS.cockpit], ['Scene%20%238.webp', OS.quote], ['Scene%2018.webp', OS.agents]];
    scenes.forEach(([k, src]) => { h = swapImg(h, k, src); });
    // Retain the original grid/zoom animation. The centre is a real video,
    // sourced from the owner's fourth template; surrounding imagery is separate.
    const theatre = [OS.boot, OS.loading, OS.login, OS.desktop, OS.cockpit, OS.agents, OS.inquiries];
    const ids = [...h.matchAll(/class="video-bg-animation w-background-video w-background-video-atom"><video id="([^"]+)-video"/g)].map((m) => m[1]);
    const inTheatre = ids.filter((id) => h.indexOf(`id="${id}-video"`) > h.indexOf('<section class="video-section"') && h.indexOf(`id="${id}-video"`) < h.indexOf('<section id="compare"'));
    if (inTheatre.length !== 7) throw new Error(`index: expected 7 theatre videos, found ${inTheatre.length}`);
    inTheatre.forEach((id, i) => {
      h = stillImage(h, id, theatre[i], 'STARGO OS');
      if (i === 3) {
        const marker = `<img src="${theatre[i]}" alt="STARGO OS" loading="lazy" class="stargo-still"/>`;
        if (!h.includes(marker)) throw new Error('index: centre media marker missing');
        h = h.replace(marker, `<video id="stargo-brand-film" data-stargo-video loop muted playsinline preload="none" poster="assets/stargo-motion/orbit-poster.webp" aria-label="${lang === 'zh' ? '银色轨道协同运转的品牌概念动画' : 'Brand film: silver orbital forms moving together'}"><source src="assets/stargo-motion/orbit.mp4" type="video/mp4"/></video>`);
      }
    });
    const mediaLabel = lang === 'zh' ? '播放视频' : 'Play video';
    h = h.replace('<div class="sticky-video-section">', `<div class="sticky-video-section"><button class="stargo-media-toggle" type="button" aria-controls="stargo-brand-film" aria-pressed="false" data-play-label="${mediaLabel}" data-pause-label="${lang === 'zh' ? '暂停视频' : 'Pause video'}">${mediaLabel}</button>`);
    const play = elementContaining(h, 'class="play-video w-inline-block w-lightbox"', 'a');
    h = h.slice(0, play.start) + h.slice(play.end);
    if (/youtube|embedly|w-lightbox/.test(h)) throw new Error('index: lightbox survives');
    // The sticky card's portrait film and the contact band's group photograph stay as the
    // template designed them (licensed template assets; the copy marks the cards as scenarios).
    const stickyVideo = [...h.matchAll(/<video id="([^"]+)-video"/g)].map((m) => m[1]).find((id) => h.slice(h.indexOf('<section class="testimonials-section"'), h.indexOf('<section class="section drk"')).includes(`id="${id}-video"`));
    if (!stickyVideo) throw new Error('index: sticky card video');
    h = swapImg(h, '699b6466d5f19893993a4f1a_Sunset-Serenity', BRAND.square);
    h = swapImg(h, '699b6466d5f19893993a4efc_Smiling%20Bearded', IMG('avatar-core.png'));   // the chat card's bearded-man avatar → the core orb
    // The blog grid: the template's four cards, filled with the four newest articles.
    h = blogCards(h, 'blog-grid', 'w-dyn-item', featured(4), lang, { image: 'testimonials-photo', date: 'data-text ab', title: 'blog-txt', sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw' });
  }
  const D = C.HOME_DUP_DESC;
  h = s(h, D.original, t(D.first), { nth: 0 });
  h = s(h, D.original, t(D.second), { nth: 0 });
  h = h.replace(/(class="(?:top-text logo[^"]*|h1)">)Studio(<)/g, '$1WORK$2');
  h = h.replace(/<title>Mōno™<\/title>/, '<title>STARGO</title>');
  h = s(h, '© 2026 Mōno™ Studio', '© 2026 STARGO WORK');
  h = h.split('Mōno™').join('STARGO');

  // Brand wall: real logos from assets/brands/, or no wall at all.
  const brands = existsSync(`${SITE}/assets/brands`) ? readdirSync(`${SITE}/assets/brands`).filter((f) => /\.(svg|png|webp|jpg|jpeg)$/i.test(f)).sort() : [];
  const grid = elementContaining(h, 'class="partner-grid"', 'div', { up: 1 });
  if (!grid.text.startsWith('<div class="margin-50">')) throw new Error('index: partner grid wrapper');
  if (brands.length) {
    const card = findByClass(grid.text, 'div', 'partner-card');
    const cards = brands.map((f, i) => card.text
      .replace(/card-wrapper _0\d/, `card-wrapper _0${(i % 8) + 1}`)
      .replace(/<img[^>]*class="front-logo-img"[^>]*\/>|(<div class="front-logo">)<img[^>]*\/>/, (m, open) => `${open ?? ''}<img src="assets/brands/${f}" loading="lazy" alt="" class="brand-logo"/>`)
      .replace(/(<div class="back-logo">)<img[^>]*\/>/, `$1<img src="assets/brands/${brands[(i + 1) % brands.length]}" loading="lazy" alt="" class="brand-logo"/>`));
    const inner = findByClass(grid.text, 'div', 'partner-grid');
    const rebuilt = grid.text.slice(0, inner.start) + inner.text.replace(/>[\s\S]*<\/div>$/, `>${cards.join('')}</div>`) + grid.text.slice(inner.end);
    h = h.slice(0, grid.start) + rebuilt + h.slice(grid.end);
    h = s(h, '(Partners)', t(C.HOME_BRAND_WALL.caption));
  } else {
    // Template wall kept (flip animation and all), labelled as a sample.
    h = s(h, '(Partners)', t(C.HOME_BRAND_WALL.captionSample));
  }

  // The "work" cards point at the loop table below.
  for (const p of ['project_forma-digital.html', 'project_one-step.html', 'project_nero-vision.html', 'project_bold-moves.html']) h = s(h, `href="${p}"`, 'href="#loop"');
  h = setLink(h, t(C.HOME_MONO.find(([o]) => o === 'View all work')[1]), { href: '#loop' });
  h = h.replace(/<h3 class="work-title">\d\d<\/h3><h3 class="work-title">©<\/h3>/g, (m, i) => m).replace(/<h3 class="work-title">(26|24|25)<\/h3><h3 class="work-title">©<\/h3>/g, (m) => m);
  {
    let n = 0;
    h = h.replace(/<h3 class="work-title">(?:26|25|24)<\/h3><h3 class="work-title">©<\/h3>/g, () => `<h3 class="work-title">0${++n}</h3><h3 class="work-title"></h3>`);
    if (n !== 4) throw new Error(`index: expected 4 work cards, found ${n}`);
  }

  // Scalora modules. The nine-stage table now lives on the capabilities page:
  // the homepage tells the loop once (five stages) and drills into four systems.
  const sub = (name, fragment, list) => { const { fn } = makeSub(name); let f = fragment; for (const [old, pair, opts] of list) f = fn(f, old, t(pair), opts); return f; };
  let hero = frag('hero.html').replace(/<h1 /g, '<h2 ').replace(/<\/h1>/g, '</h2>');
  hero = addRootClass(sub('sc-hero', hero, C.HOME_SC_HERO), 'sc-scope').replace(/^<section class="/, '<section id="loop" class="');
  hero = hero.replace(/<div class="hero-description-block"><div>/, `<div class="hero-description-block"><div data-mobile-text="${escapeHtml(t(C.HOME_MOBILE.scHero))}">`);
  let products = addRootClass(sub('sc-products', frag('products.html'), C.HOME_SC_PRODUCTS), 'sc-scope');
  {
    // four Scalora dashboard drawings → the four STARGO OS systems, desktop and mobile variants alike
    const bySystem = { 'Growth OS': OS.desk, 'Customer 360': OS.inquiries, 'Quote Studio': OS.quote, 'Trade Execution': OS.trade };
    products = products.replace(/<div class="products-cards-dashboard-block[^"]*">[\s\S]*?<h3 class="heading-style-h4">([^<]*)<\/h3>/g, (block, title) => {
      const key = Object.keys(bySystem).find((k) => title.startsWith(k));
      if (!key) throw new Error(`index: unknown system ${title}`);
      return block.replace(/<img[^>]*class="prodect-dashboard-image"\/>/, `<img src="${bySystem[key]}" loading="lazy" alt="${escapeHtml(title)}" class="prodect-dashboard-image"/>`);
    });
    if (/prodect-dashboard-0\d\.svg/.test(products)) throw new Error('index: Scalora dashboard drawing survives');
  }
  const integration = addRootClass(sub('sc-integration', frag('integration.html'), C.HOME_SC_INTEGRATION), 'sc-scope');
  const insertBefore = (html, anchor, fragment, label) => { const i = html.indexOf(anchor); if (i === -1) throw new Error(`insertion anchor not found for ${label}`); return html.slice(0, i) + fragment + '\n' + html.slice(i); };
  h = insertBefore(h, '<section class="section with-minus"', hero, 'four-layer stack');
  h = insertBefore(h, '<section class="video-section"', products + integration, 'switcher + channels band');
  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  h = h.replace(monoLink, (m) => `${m}\n<link href="css/scalora-modules.sc.css" rel="stylesheet" type="text/css"/>\n<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>`);
  return h;
};

/* ---- intelligence.html / workforce.html — lifelogx homepage ----------- */
function lxPage(spec, lang, name) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub(name);
  let b = frag('lx-home.html');
  b = s(b, '<div class="lx-hero-text">Lifelogx</div>', `<div class="lx-hero-text">${t(spec.heroWord)}</div>`);
  b = s(b, '>Tomato Store<', `>${t(spec.store1.name)}<`);
  b = s(b, 'Download on the Tomato Store', t(spec.store1.sub));
  b = s(b, '>Market Play<', `>${t(spec.store2.name)}<`);
  b = s(b, 'Get it on Market Play', t(spec.store2.sub));
  b = setLink(b, t(spec.store1.name), { href: spec.store1.href });
  b = setLink(b, t(spec.store2.name), { href: spec.store2.href });
  b = s(b, 'The friend who never forgets.', t(spec.heroDesc));
  b = s(b, 'Natural, human-like chats that keep users engaged and understood.', t(spec.features[0].text));
  b = s(b, '<h3 class="lx-expandable-text">Interaction</h3>', `<h3 class="lx-expandable-text">${t(spec.features[0].title)}</h3>`);
  b = s(b, 'Smooth, intuitive actions that make every tap feel effortless.', t(spec.features[1].text));
  b = s(b, '<h3 class="lx-expandable-text">Conversation</h3>', `<h3 class="lx-expandable-text">${t(spec.features[1].title)}</h3>`);
  b = s(b, 'Ready made features your users already expect.', t(spec.features[2].text));
  b = s(b, '<h3 class="lx-expandable-text">Organised</h3>', `<h3 class="lx-expandable-text">${t(spec.features[2].title)}</h3>`);
  for (const [k, v] of Object.entries(spec.tags)) b = s(b, `>${k}<`, `>${t(v)}<`);
  // six carousel cards plus the story card share these two classes
  b = setEachInner(b, '<h3 class="lx-heading-style-h3 lx-home-feature">', [...spec.cards.slice(0, 6).map((c) => t(c.title)), t(spec.feat2Card.title)]);
  b = setEachInner(b, '<div class="lx-text-size-regular lx-text-weight-light">', [...spec.cards.slice(0, 6).map((c) => t(c.text)), t(spec.feat2Card.text)]);
  spec.gradient.forEach((g, i) => {
    const re = new RegExp(`(class="lx-heading-style-h1 lx-_${i + 1}">)[^<]*(</h3>)`);
    if (!re.test(b)) throw new Error(`${name}: gradient heading ${i + 1}`);
    b = b.replace(re, `$1${t(g)}$2`);
  });
  b = s(b, '>Is this you<', `>${t(spec.bigText)}<`);
  const bubbleOriginals = ["I'll remember that for later", "It's too boring to document.", "I can't be bothered.", "I'll remember that", "No way I'm writing all that", 'Documenting can be a drag sometimes', 'IT Support', 'Logistics Analyst', "It's just not on my priority list", 'I prefer to keep it in my head..', "Maybe I'll get to it eventually.", "I'd rather focus on the fun parts."];
  const order = [7, 0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11]; // longest-first originals mapped back to the spec order
  bubbleOriginals.forEach((orig, i) => {
    const html = orig.replace(/'/g, '&#x27;');
    const target = t(spec.bubbles[order[i]]);
    if (b.includes(html)) b = s(b, html, target); else b = s(b, orig, target);
  });
  ['_1', '_2', '_3', '_4'].forEach((k, i) => {
    const re = new RegExp(`(class="lx-big-gradient-text lx-${k}">)[^<]*(</h3>)`, 'g');
    if (!re.test(b)) throw new Error(`${name}: gradient word ${k}`);
    b = b.replace(re, `$1${t(spec.words[i])}$2`);
  });
  b = s(b, '<h3 class="lx-heading-style-h1 lx-pink">Add your Notes in minutes</h3>', `<h3 class="lx-heading-style-h1 lx-pink">${t(spec.feat2Title)}</h3>`);
  b = s(b, '<h3 class="lx-heading-style-h1">As simple as talking</h3>', `<h3 class="lx-heading-style-h1">${t(spec.feat2Sub)}</h3>`);
  b = setLink(b, 'Get started', { href: spec.feat2Button.href, text: t(spec.feat2Button.label) });
  b = s(b, 'Your story, <br/>Your memories, <br/>Your moments', spec.feat2Lines.map(t).join(' <br/>'));
  b = s(b, '>Your AI companion<', `>${t(spec.ctaTitle)}<`);
  b = s(b, 'class="lx-cta-text lx-_2nd">As simple as talking</h4>', `class="lx-cta-text lx-_2nd">${t(spec.ctaSub)}</h4>`);
  b = s(b, 'class="lx-cta-logo-text">Lifelogx</div>', `class="lx-cta-logo-text">${t(spec.ctaLogo)}</div>`);
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  b = s(b, 'The smartest friend you’ll ever have.', t(spec.ctaDesc));
  // Imagery stays the template's own (owner decision, 2026-09-06): the phone screens, the
  // translucent overlays of the gradient and "no writing" sections, the closing card's image and
  // the avatars in the scenario bubbles are all part of the composition the pink palette was
  // designed around. Only their template alt text goes.
  if ((b.match(/lx-author-image-medium/g) ?? []).length !== 48) throw new Error(`${name}: avatar bubbles changed`);
  b = b.replace(/<div([^>]*)class="([^"]*\blx-gradient-section\b[^"]*)"/, '<div id="lx-more"$1class="$2"');
  b = b.replace(/<div class="lx-cta-wrapper">/, '<div id="lx-evolution" class="lx-cta-wrapper">');
  b = b.replace('class="lx-sitcky-section"', `id="${name === 'intelligence' ? 'lx-ontology' : 'lx-teams'}" class="lx-sitcky-section"`);
  if (!b.includes('id="lx-more"') || !b.includes('id="lx-evolution"')) throw new Error(`${name}: anchor ids`);
  if (/Lifelogx|Tomato|lifelog/i.test(b)) throw new Error(`${name}: template brand survives`);
  return inMonoShell(b + bigMark(), ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
}
PAGES['intelligence.html'] = (lang) => lxPage(C.LX_INTELLIGENCE, lang, 'intelligence');
/* ---- workforce.html — lifelogx feature page ----------------------------
   Intelligence keeps the Lifelogx homepage. The workforce page is built from the
   Lifelogx *feature* page instead, so the two no longer share a layout: a hero of
   floating role cards, a capability section, the answers block and the article
   strip, all with the template's own imagery and interactions. */
PAGES['workforce.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const W = C.LX_FEATURE_WORKFORCE;
  const { fn: s } = makeSub('workforce');
  let b = frag('lx-feature.html');

  /* hero */
  b = s(b, '>Think it once<', `>${t(W.heroPink)}<`);
  b = s(b, '>Remember it forever<', `>${t(W.heroWhite)}<`);
  b = s(b, 'Each feature focuses on reducing friction between thought and action.', t(W.heroDesc));
  b = s(b, '>Download<', `>${t(W.heroButton)}<`);

  /* the five role cards, repeated once for the marquee loop */
  const NAMES = ['Philip', 'Arlene', 'Marjorie', 'Collen', 'Greg'];
  const FIGURES = ['99.6M', '88.3', '16.2M', '73.7M', '125.5M'];
  NAMES.forEach((person, i) => {
    b = s(b, `<div class="lx-name-text">${person}</div>`, `<div class="lx-name-text">${t(W.roles[i].name)}</div>`, { count: 2 });
  });
  FIGURES.forEach((fig, i) => {
    b = b.split(`<div class="lx-text-size-tiny">${fig}</div>`).join(`<div class="lx-text-size-tiny">${t(W.roles[i].owns)}</div>`);
  });
  b = b.split('<div class="lx-text-size-tiny lx-text-color-grey">Views</div>')
    .join(`<div class="lx-text-size-tiny lx-text-color-grey">${t(W.roles[0].dept)}</div>`);
  // the template's cards link to the studio's own social accounts
  b = b.replace(/href="https:\/\/(?:www\.)?(?:linkedin|instagram|facebook|x|twitter|tiktok|youtube)\.com[^"]*"/g, 'href="contact.html"');
  // the fifth card and the panel button are placeholders in the template
  b = b.split('href="#"').join('href="contact.html"');

  /* what the team gets done */
  b = s(b, '>Here is what you can get done with Us<', `>${t(W.doTitle)}<`);
  [['Interaction', 'Instantly find what you need dates, notes, or activities without digging around.'],
   ['Conversation', 'Chat freely with your AI, your friends, or even your thoughts.'],
   ['Organized Mind', 'Stay on top of everything with a clear overview of your world.']]
    .forEach(([title, text], i) => {
      b = s(b, `>${title}<`, `>${t(W.abilities[i].title)}<`, { count: 1 });
      b = s(b, text, t(W.abilities[i].text));
    });
  ['See priorities at a glance', 'Track projects and people', 'Stay focused on what matters', 'Keep distractions out']
    .forEach((line, i) => { b = s(b, line, t(W.bullets[i])); });

  /* the two feature cards over the pink panel */
  b = s(b, '>Your Best Friend AI<', `>${t(W.cardA.title)}<`);
  b = s(b, 'More than an assistant—it’s the friend who listens, remembers, and keeps life simple.', t(W.cardA.text));
  b = s(b, '>Memory That Sticks<', `>${t(W.cardB.title)}<`);
  b = s(b, 'From quick notes to deep thoughts, nothing slips through the cracks.', t(W.cardB.text));

  /* the three rotating answer cards and the confirmation card they sit behind */
  b = s(b, 'Ready‑made features your usersalready expect.', t(W.stackedCard));
  b = s(b, '>Chatting on the fly with your AI companion<', `>${t(W.answersCards[0])}<`);
  b = s(b, '>Quickly capture and share ideas<', `>${t(W.answersCards[1])}<`);
  b = b.split('>An online account that means business<').join(`>${t(W.phoneTitle)}<`);
  b = b.split('>An online account thatmeans business<').join(`>${t(W.phoneTitle)}<`);
  b = s(b, '>Easy day-to-day banking<', `>${t(W.phoneSub)}<`);
  b = s(b, 'Easy day-to-day banking: local IBAN, freeMastercards, instant &amp; international transfers,financing solutions. All included in your plan.', t(W.answersBody));
  b = s(b, '<div class="lx-name-text">Dancing for you</div>', `<div class="lx-name-text">${t(W.extraRole.name)}</div>`);

  /* the answers block */
  b = s(b, '>All your answers here<', `>${t(W.answersTitle)}<`);
  ['CARDS', 'transfers', 'financing'].forEach((tab, i) => { b = s(b, `>${tab}<`, `>${t(W.answerTabs[i])}<`, { count: 1 }); });
  b = s(b, '>Get the app<', `>${t(W.answersButton)}<`);

  /* the article strip: our own posts */
  b = s(b, '>Stories<', `>${t(W.storiesTitle)}<`);
  b = s(b, '>we write and share<', `>${t(W.storiesSub)}<`);
  b = blogCards(b, 'lx-blog-list', 'lx-blog-item', POSTS.slice(0, 3), lang, LX_CARD);

  // The template's big square tile has "2.4M" painted into the artwork: a follower
  // count we have no basis for. STARGO's own brand image replaces it.
  b = swapImg(b, '6942c157beb8f897be077c01_Group', W.tile.src, { alt: t(W.tile.alt) });

  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  b = b.replace(/<div([^>]*)class="([^"]*\blx-section\b[^"]*)"/, '<div id="lx-roles"$1class="$2"');
  {
    const leftovers = [/Lifelogx/i, /Philip/, /Arlene/, /Marjorie/, /Collen/, /Greg/, /99\.6M/, />Views</, /Tomato/i,
      /Ready‑made/, /AI companion/i, /online account/i, /day-to-day banking/i, /Dancing for you/, /Organized Mind/, /your world/i]
      .filter((re) => re.test(b)).map((re) => String(re));
    if (leftovers.length) throw new Error(`workforce: template copy survives: ${leftovers.join(', ')}`);
  }
  return inMonoShell(b + bigMark(), ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
};

/* ---- about.html — lifelogx about page ---------------------------------- */
PAGES['about.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const A = C.ABOUT;
  const { fn: s } = makeSub('about');
  let b = frag('lx-about.html');
  b = s(b, '>Our approach<', `>${t(A.eyebrow)}<`);
  b = s(b, '>Simple tools for real thinking<', `>${t(A.title)}<`);
  b = s(b, 'We’re building tools that turn everyday conversations into clear, usable notes — so ideas don’t get lost and thinking feels effortless.', t(A.desc));
  // A bare <a>Label</a>: setLink only relabels wrapped labels, so replace the whole link.
  b = s(b, '<a href="contact.html" class="lx-button lx-is-secondary w-button">Download</a>', `<a href="${A.button.href}" class="lx-button lx-is-secondary w-button">${t(A.button.label)}</a>`, { count: 1 });
  // Four circles: the template's four named people → four AI-employee roles with the template's illustrated avatars.
  [['Lina Elsen', '6943d80451564405defffaed_Vibrant'], ['Amira Brik', '6943d80f46f426e739f71ec5_Stylish'], ['Mila Eron', '6943d84a7b3093c6e962c7dd_Futuristic'], ['Oren Solis', '6943d8308925855adc2bcb5c_Stylish']]
    .forEach(([person, key], i) => { b = s(b, `>${person}<`, `>${A.circles[i].label}<`, { count: 1 }); b = swapImg(b, key, A.circles[i].image); });
  b = swapImg(b, '6943f43d1ea90943e43a09be_Rectangle', A.bigImage.src, { alt: t(A.bigImage.alt) });
  b = s(b, '>Our Story<', `>${t(A.storyTitle)}<`);
  b = setInner(b, '<div class="lx-about-rich-text w-richtext">', t(A.story).trim());
  ['Prioritize customers in everything you do.', 'Own your part, get things done.', 'Always do what’s right, and respect people.'].forEach((x, i) => { b = s(b, x, t(A.values[i]), { count: 1 }); });
  b = s(b, '>We want to work with you<', `>${t(A.startTitle)}<`);
  [['Product Design', 'Remote | Full Time'], ['Web Developer', 'NYC | Full Time'], ['Data Analyst', 'Chicago | Part Time'], ['UX Researcher', 'San Francisco | Contract'], ['Marketing Specialist', 'Remote | Full Time']]
    .forEach(([job, place], i) => { b = s(b, `<div>${job}</div>`, `<div>${t(A.starts[i].name)}</div>`, { count: 1 }); b = s(b, `>${place}<`, `>${t(A.starts[i].sub)}<`, { nth: 0 }); });
  b = s(b, '<a href="#" class="lx-careers_01-item w-inline-block">', '<a href="contact.html" class="lx-careers_01-item w-inline-block">', { count: 5 });
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt="');
  b = b.replace(/alt="(?=[^"]*$)/g, 'alt=""');
  if (/Lifelogx|Lina Elsen|Amira|Mila Eron|Oren|Full Time|Part Time|Contract<|>Download</.test(b)) throw new Error('about: template copy survives');
  return inMonoShell(b + bigMark(), ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
};

/* ---- blog.html — lifelogx blog index ------------------------------------ */
const LX_CARD = { image: 'lx-blog-image', title: 'lx-blog-title', description: 'lx-blog-description', sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw' };
PAGES['blog.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub('blog');
  let b = frag('lx-blog.html');
  b = s(b, '>Discover Our Featured Stories<', `>${t(BLOG_UI.heading)}<`);
  b = blogCards(b, 'lx-blog-list', 'lx-blog-item', POSTS, lang, LX_CARD);
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  if (/Lifelogx|Companion|Moments in Motion|Conversational AI/.test(b)) throw new Error('blog: template copy survives');
  return inMonoShell(b + bigMark(), ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
};

/* ---- blog/<slug>.html — lifelogx article page --------------------------- */
function postPage(post, lang) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub(`post:${post.slug}`);
  let b = frag('lx-post.html');
  // Lists first (they repeat the template's title), then the title itself.
  b = blogCards(b, 'lx-blog-list', 'lx-blog-item', others(post, 3), lang, LX_CARD);
  {
    const list = findByClass(b, 'div', 'lx-related-list');
    if (!list) throw new Error('post: related list');
    const items = others(post, 5).map((p) => `<a role="listitem" href="${postPath(p)}" class="lx-related-item w-dyn-item"><div class="lx-text-size-regular">${escapeHtml(t(p.title))}</div><div class="lx-text-size-small lx-text-size-grey">${escapeHtml(t(p.description))}</div></a>`).join('');
    b = b.slice(0, list.start) + list.text.replace(/>[\s\S]*<\/div>$/, `>${items}</div>`) + b.slice(list.end);
  }
  b = s(b, '>How AI Companions Can Transform Your Life<', `>${escapeHtml(t(post.title))}<`, { count: 1 });
  b = s(b, '>Related Items<', `>${t(BLOG_UI.related)}<`, { count: 1 });
  b = s(b, '>More from blog<', `>${t(BLOG_UI.more)}<`, { count: 1 });
  b = swapImg(b, '6945522d9e13fa6b32ace3c9_Futuristic', coverSrc(post));
  b = b.replace(/(<img[^>]*class="lx-blog-image lx-details")\/>/, (m, tag) => `${tag} srcset="${coverSrcset(post)}" sizes="(max-width: 991px) 100vw, 1180px"/>`);
  if (!b.includes(coverSrcset(post))) throw new Error('post: hero image');
  {
    // The rich-text block carries the interaction's initial state inline (opacity 0, data-w-id): keep its tag, replace its content.
    const rich = findByClass(b, 'div', 'lx-text-rich-text');
    if (!rich) throw new Error('post: rich text block');
    b = b.slice(0, rich.start) + rich.text.slice(0, rich.text.indexOf('>') + 1) + t(post.body).trim() + '</div>' + b.slice(rich.end);
  }
  // Date and byline under the title; the template's CMS page shows neither.
  b = b.replace('<div class="lx-blog-details-image-holder">', `<p class="lx-post-meta"><time datetime="${post.date}">${formatDate(post.date, lang)}</time> · ${t(BLOG_UI.byline)} · <a href="blog.html">${t(BLOG_UI.all)}</a></p><div class="lx-blog-details-image-holder">`);
  if (!b.includes('lx-post-meta')) throw new Error('post: meta line');
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  if (/Lifelogx|Companion|Moments in Motion|Conversational AI|Small Support/.test(b)) throw new Error(`post ${post.slug}: template copy survives`);
  return inMonoShell(b + bigMark(), ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
}
for (const post of POSTS) PAGES[postPath(post)] = (lang) => postPage(post, lang);

/* ---- pricing.html — Scalora pricing page ------------------------------ */
PAGES['pricing.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const P = C.PRICING;
  const { fn: s } = makeSub('pricing');
  const src = tpl('scalora-pricing.html');
  const cut = (cls) => { const i = src.indexOf(`<section class="${cls}"`); if (i === -1) throw new Error(`pricing: section ${cls}`); return extractElement(src, i, 'section').text; };
  let hero = cut('pricing-hero');
  let plans = cut('plans');
  let cta = cut('cta');
  let faq = cut('faq');

  /* hero: caption, title, period toggle */
  hero = s(hero, '>Pricing plan<', `>${t(P.caption)}<`);
  hero = hero.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${t(P.title)}</h1>`);
  hero = s(hero, '>Pay monthly<', `>${t(P.toggleA)}<`);
  hero = s(hero, '>Pay yearly (save 30%)<', `>${t(P.toggleB)}<`);
  /* tabs: keep two of four */
  for (const n of [3, 4]) {
    hero = hero.replace(new RegExp(`<a data-w-tab="Tab ${n}"[^>]*>[\\s\\S]*?<\\/a>`), '');
    const pane = hero.indexOf(`<div data-w-tab="Tab ${n}"`);
    if (pane === -1) throw new Error(`pricing: pane ${n}`);
    const el = extractElement(hero, pane, 'div');
    hero = hero.slice(0, el.start) + hero.slice(el.end);
  }
  P.tabs.forEach((label, i) => { hero = hero.replace(new RegExp(`(<a data-w-tab="Tab ${i + 1}"[^>]*>)<div>[^<]*</div>`), `$1<div>${t(label)}</div>`); });
  /* cards */
  const unitOf = (u) => u === 'year' ? t(P.unitYear) : u === 'first' ? t(P.unitFirst) : u === 'demo' ? (lang === 'zh' ? '免费' : 'free') : '';
  const fillCard = (card, spec) => {
    let c = card;
    c = c.replace(/(<div class="heading-style-h5">)[^<]*(<\/div>)/, `$1${t(spec.name)}$2`);
    // price blocks: monthly = first year, year = renewal
    let k = 0;
    c = c.replace(/(class="pricing-card-price">)[^<]*(<)/g, (_, a, b) => `${a}${k++ === 0 ? t(spec.price) : spec.renewal === 'ask' ? t(P.renewalPrice) : spec.renewal === 'custom' ? t(spec.price) : spec.renewal === 'demo' ? t(spec.price) : spec.renewal}${b}`);
    let u = 0;
    c = c.replace(/(class="heading-style-h6">)[^<]*(<)/g, (_, a, b) => `${a}${u++ === 0 ? unitOf(spec.unit) : (spec.renewal === 'ask' ? t(P.unitYear) : unitOf(spec.unit === 'first' ? 'year' : spec.unit))}${b}`);
    const paras = [t(spec.desc), ...spec.items.map(t)];
    let pi = 0;
    c = c.replace(/(<div class="paragraph-p1">)[^<]*(<\/div>)/g, (_, a, b) => `${a}${paras[pi++] ?? ''}${b}`);
    if (pi !== 6) throw new Error(`pricing: card ${t(spec.name)} has ${pi} paragraphs`);
    c = c.replace(/(class="button-text">)[^<]*(<)/g, `$1${t(spec.cta)}$2`);
    c = c.replace(/href="contact\.html"/g, 'href="contact.html"');
    c = c.replace(/<a href="[^"]*"( class="button-)/g, '<a href="contact.html"$1');   // every plan button books a demo
    if (/href="#"/.test(c)) throw new Error('pricing: placeholder link in card ' + t(spec.name));
    return c;
  };
  P.panes.forEach((cards, pi) => {
    const paneAt = hero.indexOf(`<div data-w-tab="Tab ${pi + 1}"`);
    const pane = extractElement(hero, paneAt, 'div');
    let text = pane.text;
    for (let ci = 0; ci < 3; ci++) {
      const card = findByClass(text, 'div', 'pricing-card', ci);
      if (!card) throw new Error(`pricing: card ${ci} in pane ${pi + 1}`);
      text = text.slice(0, card.start) + fillCard(card.text, cards[ci]) + text.slice(card.end);
    }
    // Scalora hard-codes the raised card into the middle slot; STARGO promotes the
    // dearest plan in each pane, which is not always the middle one. Move the
    // treatment — the .growth-card frame, the .growth classes and the top border —
    // onto the plan that carries `featured`, and leave the ladder in price order.
    const want = cards.findIndex((c) => c.featured);
    if (want === -1) throw new Error(`pricing: pane ${pi + 1} promotes no plan`);
    const wrap = findByClass(text, 'div', 'pricing-cards-wrapper');
    if (!wrap) throw new Error(`pricing: cards wrapper in pane ${pi + 1}`);
    const slots = [];
    for (let ci = 0, from = 0; ci < 3; ci++) {
      const c = findByClass(wrap.text, 'div', 'pricing-card', ci);
      if (!c) throw new Error(`pricing: slot ${ci} in pane ${pi + 1}`);
      slots.push(c.text); from = c.end;
    }
    const rebuilt = slots.map((card, ci) => {
      let inner = card
        .replace(/class="pricing-card[^"]*"/, `class="pricing-card ${ci === want ? 'growth' : ci === 0 ? '_01' : '_03'}"`)
        .replace(/class="pricing-card-icon-block[^"]*"/, `class="pricing-card-icon-block${ci === want ? ' growth' : ''}"`)
        .replace(/<div class="top-border"><\/div>/g, '');
      if (ci !== want) return inner;
      const badge = `<div class="stargo-plan-badge">${t(P.featuredBadge)}</div>`;
      inner = inner.replace(/(<div class="pricing-card-top-block">)/, `$1${badge}`);
      return `<div class="growth-card">${inner.replace(/(<\/div>)$/, '<div class="top-border"></div>$1')}</div>`;
    }).join('');
    text = text.slice(0, wrap.start) + `<div class="pricing-cards-wrapper">${rebuilt}</div>` + text.slice(wrap.end);
    if ((text.match(/class="growth-card"/g) ?? []).length !== 1) throw new Error(`pricing: pane ${pi + 1} promotes ${(text.match(/class="growth-card"/g) ?? []).length} plans`);
    hero = hero.slice(0, pane.start) + text + hero.slice(pane.end);
  });
  /* comparison table */
  plans = plans.replace(/<h2>Compare all of our plans<\/h2>/, `<h2>${t(P.compareTitle)}</h2>`);
  plans = s(plans, '<div class="heading-style-h5">Features</div>', `<div class="heading-style-h5">${t(P.compareFeatures)}</div>`);
  {
    let i = 0;
    plans = plans.replace(/<div class="heading-style-h5">(Starter|Growth|Premium)<\/div><div class="plan-description-text">[^<]*<\/div>/g, () => { const p = P.comparePlans[i++]; return `<div class="heading-style-h5">${t(p.name)}</div><div class="plan-description-text">${t(p.desc)}</div>`; });
    if (i !== 3) throw new Error('pricing: plan headers');
    let g = 0;
    plans = plans.replace(/(<div class="company-plans-title-block"><div class="heading-style-h5">)[^<]*(<\/div>)/g, (_, a, b) => `${a}${t(P.compareGroups[g++].title)}${b}`);
    if (g !== 3) throw new Error('pricing: group titles');
    const rows = P.compareGroups.flatMap((grp) => grp.rows);
    let r = 0;
    plans = plans.replace(/<div class="company-plans-list-wrapper"><div id="[^"]*" class="company-plans-list-block title-block"><div class="paragraph-p1">[^<]*<\/div><\/div>((?:<div class="company-plans-list-block"><img[^>]*\/><\/div>){3})<\/div>/g, (whole) => {
      const [label, flags] = rows[r++];
      let cell = 0;
      return whole
        .replace(/(<div class="paragraph-p1">)[^<]*(<\/div>)/, `$1${t(label)}$2`)
        .replace(/<img[^>]*\/>/g, () => { const on = flags[cell++]; return `<img src="${on ? CHECK : CROSS}" loading="lazy" alt="${on ? 'included' : 'not included'}" class="icon-24px"/>`; });
    });
    if (r !== 12) throw new Error(`pricing: expected 12 comparison rows, matched ${r}`);
  }
  /* cta + faq */
  cta = cta.replace(/<h2>[\s\S]*?<\/h2>/, `<h2>${t(P.ctaTitle)}</h2>`);
  cta = cta.replace(/(<div class="paragraph-p1">)[^<]*(<\/div>)/, `$1${t(P.ctaDesc)}$2`);
  cta = cta.replace(/(class="button-text">)[^<]*(<)/g, `$1${t(P.ctaButton.label)}$2`).replace(/href="contact\.html"/, `href="${P.ctaButton.href}"`);
  faq = s(faq, '>Questions and Answers<', `>${t(P.faqCaption)}<`);
  faq = faq.replace(/<h2>Frequently asked questions<\/h2>/, `<h2>${t(P.faqTitle)}</h2>`);
  {
    let q = 0;
    faq = faq.replace(/(<div class="heading-style-h6">)[^<]*(<\/div>)/g, (_, a, b) => `${a}${t(P.faq[q++][0])}${b}`);
    if (q !== 10) throw new Error(`pricing: ${q} faq questions`);
    let an = 0;
    faq = faq.replace(/(<div class="paragraph-p2">)[^<]*(<\/div>)/g, (_, a, b) => `${a}${t(P.faq[an++][1])}${b}`);
    if (an !== 10) throw new Error(`pricing: ${an} faq answers`);
  }
  let body = [hero, plans, cta, faq].join('\n');
  body = localise(scClasses(body));
  body = body.replace(/alt="(Pricing Card Icon|Check Icon|Close Icon|Arrow Dowen)"/g, 'alt=""');
  if (/Scalora|\$\d/.test(body)) throw new Error('pricing: template copy or dollar price survives');
  body = `<div class="sc-scope sc-page">\n${body}\n</div>`;
  return inMonoShell(body, ['scalora-modules.sc.css', 'stargo-fusion.css'])
    .replace('<body ', '<body class="stargo-dark-page stargo-pricing-lx" ')
    .replace('</body>', '<script src="js/stargo-pricing.js"></script></body>');
};

/* ---- enterprise.html — Mono studio ------------------------------------ */
PAGES['enterprise.html'] = (lang) => fromStudio({
  name: 'enterprise', ...C.ENTERPRISE, cards: C.ENTERPRISE.cards,
  images: { work: [OS.agents, OS.login, OS.trade], quote: BRAND.square, cards: [OS.agents, OS.login, MOBILE.phoneApprovals, OS.trade, BRAND.ontology] },
}, lang);

/* ---- capabilities.html — Mono work-1 + table -------------------------- */
PAGES['capabilities.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const K = C.CAPABILITIES;
  const { fn: s } = makeSub('capabilities');
  let h = tpl('work_work-1.html');
  const groupByN = Object.fromEntries(C.CAPABILITY_GROUPS.map((g) => [g.n, g]));
  h = s(h, '>Selected Works', `>${t(K.h1)}`);
  h = s(h, '>(4)<', `>(${C.CAPABILITY_GROUPS.length})<`, { count: 1 });
  h = s(h, '(Portfolio 23-26©)', t(K.caption));
  h = s(h, 'Helping businesses turn vision into reality. Take a look at our latest projects.', t(K.intro));
  [['Forma Digital', 'project_forma-digital.html'], ['Nero Vision', 'project_nero-vision.html'], ['One Step', 'project_one-step.html'], ['Bold Moves', 'project_bold-moves.html']]
    .forEach(([name, href], i) => {
      h = s(h, `>${name}<`, `>${t(K.macro[i].name)}<`, { count: 1 });
      h = s(h, `href="${href}"`, `href="#g${K.macro[i].groups[0]}"`, { count: 1 });
    });
  const years = h.match(/<h3 class="work-title">\d\d<\/h3><h3 class="work-title">©<\/h3>/g);
  if (!years || years.length !== 4) throw new Error('capabilities: expected 4 year pairs');
  years.forEach((y, i) => { h = h.replace(y, `<h3 class="work-title">${K.macro[i].groups.length}</h3><h3 class="work-title">${t(K.unit)}</h3>`); });

  h = s(h, 'id="Pricing"', 'id="start"');
  h = s(h, '(Pricing)', t(K.ladderCaption));
  h = s(h, '>Pick Smart.<', `>${t(K.ladder[0])}<`);
  h = s(h, '>Pay Less.<', `>${t(K.ladder[1])}<`);
  h = s(h, '>Build Better.<', `>${t(K.ladder[2])}<`);
  h = s(h, 'Choose the plan that fits you best.', t(K.ladderDesc));
  const card = (c, name, desc, price, bullets, tl, btn) => {
    h = s(h, `>${name}<`, `>${t(c.name)}<`);
    h = s(h, desc, t(c.desc));
    h = s(h, price, c.big);
    bullets.forEach((b, i) => { h = s(h, `>${b}<`, `>${t(c.items[i])}<`, { count: 1 }); });
    h = s(h, `>${tl}<`, `>${t(c.tl)}<`);
  };
  card(K.card1, 'Starter', 'Built for early-stage teams establishing their online presence.', '$2,000', ['Tailored website layouts', 'Core SEO configuration', 'Mobile-first responsive design', 'Brand-ready UI framework', 'Ideal for new launches and rebrands'], '1-2 weeks');
  card(K.card2, 'Growth', 'Designed for businesses ready to elevate their digital experience.', '$4,000', ['High-end design with smooth interactions', 'Complete on-site SEO setup', 'Adaptive layouts for every screen', 'CMS setup for content or case studies', 'Performance tuning &amp; optimization'], '2-3 weeks');
  h = s(h, '(Project)', t(K.card1.unit), { nth: 0 });
  h = s(h, '(Project)', t(K.card2.unit), { nth: 0 });
  h = s(h, 'What&#x27;s included:', lang === 'zh' ? '包含：' : 'Included:', { count: 2 });
  h = s(h, '>Timeline:<', `>${t(K.card1.tlLabel)}<`, { nth: 0 });
  h = s(h, '>Timeline:<', `>${t(K.card2.tlLabel)}<`, { nth: 0 });
  h = setLink(h, 'Book a call', { href: K.card1.button.href, text: t(K.card1.button.label) });
  h = setLink(h, 'Book a call', { href: K.card2.button.href, text: t(K.card2.button.label) });
  h = s(h, '(FAQ)', t(K.faqCaption));
  [['What services does your agency offer?', 0], ['How do you determine the right strategy?', 1], ['How long does a typical project take?', 2], ['Do you work with businesses in any industry?', 3]]
    .forEach(([q, i]) => { h = s(h, `>${q}<`, `>${t(K.faq[i][0])}<`, { count: 1 }); });
  h = setEachInner(h, '<p class="paragraph">', K.faq.map((f) => t(f[1])));
  h = s(h, '(Looking for more?)', t(K.moreLabel));
  h = s(h, 'Expand your scope with marketing, SEO, or content creation.', t(K.more));
  h = setLink(h, 'Contact us', { href: 'contact.html', text: t(K.moreButton) });

  const rows = C.CAPABILITY_GROUPS.flatMap((g) => g.items.map(([item, gloss], i) => [
    i === 0 ? `<span id="g${g.n}">${g.n} · ${escapeHtml(t(g.name))}</span>` : '',
    escapeHtml(item),
    escapeHtml(t(gloss)),
  ]));
  const table = awardsTable({
    id: 'atlas', caption: t(K.table.caption), title: t(K.table.title), total: rows.length,
    button: { label: t(K.table.button.label), href: K.table.button.href }, headers: K.table.headers.map(t), rows,
  });
  const anchor = '<div data-w-id="f7fb6f0b-16b8-25a9-4160-54883563ff75" class="rounder-wrapper">';
  if (!h.includes(anchor)) throw new Error('capabilities: insertion anchor missing');
  // The nine-stage loop sits above the capability map: business mainline first, then the 14 groups.
  const L = C.HOME_LOOP_TABLE;
  const loop = awardsTable({
    id: 'loop', caption: t(L.caption), title: t(L.title), total: L.rows.length,
    button: { label: t(L.button), href: '#atlas' }, headers: L.headers.map(t),
    rows: L.rows.map(([a, b, c]) => [a, escapeHtml(t(b)), escapeHtml(t(c))]),
  });
  h = h.replace(anchor, `${loop}\n${table}\n${anchor}`);
  // Assign by buyer meaning, not image sequence: growth, customer context,
  // commercial fulfilment, workforce/governance. Parallel-team art belongs
  // at the homepage Workforce door, not beneath the Commercial label.
  const familyArt = [BRAND.family(1), OS.inquiries, BRAND.family(2), BRAND.family(4)];
  ['699b6466d5f19893993a4d79_work-1.webp', '699b6466d5f19893993a4d1a_work-4.webp', '699b6466d5f19893993a4d34_work-5.webp', '699b6466d5f19893993a4d8f_work-8.webp']
    .forEach((k, i) => { h = swapImg(h, k, familyArt[i]); });
  return h;
};

/* ---- contact.html ----------------------------------------------------- */
PAGES['contact.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const K = C.CONTACT;
  const { fn: s } = makeSub('contact');
  let h = tpl('contact_contact-1.html');
  h = s(h, '(Contact)', t(K.eyebrow));
  h = s(h, 'Let’s Connect', t(K.h1));
  // The quote card keeps the template design (portrait film, gradient, mark); the mark is STARGO's and the rating slot names the card.
  h = h.replace(/<img[^>]*class="logo-testi-1"[^>]*\/>/, `<img src="${WORDMARK}" loading="lazy" alt="STARGO WORK" class="logo-testi-1 stargo-card-mark"/>`);
  h = s(h, '>★★★★★<', `>${t(K.quoteLabel)}<`);
  h = s(h, '“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”', t(K.quote));
  h = s(h, '>Joda Trump<br/>', `>${t(K.quoteWho)}<br/>`);
  h = s(h, '>Founder of Light\u00a0Studio®<br/>', `>${t(K.quoteWhere)}<br/>`);
  h = s(h, '(Fill the form)', t(K.formLabel));
  h = s(h, '>Name*<', `>${t(K.fields.name)}<`);
  h = s(h, '>Email*<', `>${t(K.fields.email)}<`);
  h = s(h, '>Subject<', `>${t(K.fields.company)}<`);
  h = s(h, '>Category<', `>${t(K.fields.category)}<`);
  h = s(h, '>Message<', `>${t(K.fields.message)}<`);
  h = s(h, '>Select one...<', `>${t(K.selectPlaceholder)}<`);
  // twelve workflow entry points instead of the template's three options
  h = h.replace(/<option value="First">First choice<\/option><option value="Second">Second choice<\/option><option value="Third">Third choice<\/option>/,
    K.options.map((o, i) => `<option value="${i + 1}">${t(o)}</option>`).join(''));
  if (h.includes('First choice')) throw new Error('contact: select options');
  // five more fields, cloned from the company field
  const field = (id, label) => `<div><label for="${id}" class="field-name">${label}</label><input class="text-field-2 w-input" maxlength="256" name="${id}" data-name="${id}" placeholder="" type="text" id="${id}"/></div>`;
  const extra = ['whatsapp', 'industry', 'markets', 'team', 'systems'].map(id => field(id, t(K.fields[id]))).join('');
  const msgAt = h.indexOf('<label for="field-2"');
  if (msgAt === -1) throw new Error('contact: message field');
  const blockStart = h.lastIndexOf('<div>', msgAt);
  h = h.slice(0, blockStart) + extra + h.slice(blockStart);
  h = h.replace(/value="Contact Us"/, `value="${t(K.submit)}"`);
  // A honeypot field for the form endpoint. (The quote card's portrait film stays.)
  if (!/<video id="[^"]+-video"/.test(h)) throw new Error('contact: quote card video');
  h = h.replace(/(<form id="email-form"[^>]*>)/, '$1<div class="stargo-hp" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"/></div>');
  if (!h.includes('stargo-hp')) throw new Error('contact: form not found');
  return h.replace(/<body\b/, '<body class="stargo-contact-page"');
};

/* ---- privacy.html / terms.html — Mono post layout ---------------------- */
function legalPage(spec, lang) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub('legal');
  let h = tpl('post_designing-digital-systems-that-scale-with-your-business.html');
  h = s(h, 'October 4, 2025', t(spec.date));
  h = s(h, '>Designing digital systems that scale your business<', `>${t(spec.h1)}<`);
  h = setInner(h, '<div class="w-richtext">', t(spec.body).trim());
  h = setLink(h, 'Back to blog', { href: 'index.html', text: t(C.LEGAL.back) });
  h = h.replace(/url\(&quot;assets\/[^&]*blog-1\.webp&quot;\)/, `url(&quot;${BRAND.wide}&quot;)`);   // the post banner photo
  // No "related stories" on a legal page.
  const related = elementContaining(h, '>Related Stories<', 'section');
  h = h.slice(0, related.start) + h.slice(related.end);
  if (/Related Stories|blog-flex/.test(h)) throw new Error('legal: related block survives');
  return h;
}
PAGES['privacy.html'] = (lang) => legalPage(C.LEGAL.privacy, lang);
PAGES['terms.html'] = (lang) => legalPage(C.LEGAL.terms, lang);

/* ---- notices.html ----------------------------------------------------- */
PAGES['notices.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const N = C.NOTICES;
  const { fn: s } = makeSub('notices');
  let h = tpl('post_designing-digital-systems-that-scale-with-your-business.html');
  h = s(h, 'October 4, 2025', t(N.date));
  h = s(h, '>Designing digital systems that scale your business<', `>${t(N.h1)}<`);
  h = setInner(h, '<div class="w-richtext">', t(N.body).trim());
  h = setLink(h, 'Back to blog', { href: 'index.html', text: t(N.back) });
  h = h.replace(/url\(&quot;assets\/[^&]*blog-1\.webp&quot;\)/, `url(&quot;${BRAND.wide}&quot;)`);   // the post banner photo
  [['699b6466d5f19893993a4dca_Sleek', BRAND.loop], ['699b6466d5f19893993a4d64_blog-2', OS.agents], ['699b6466d5f19893993a4e03_Futuristic', OS.login]].forEach(([k, src]) => { h = swapImg(h, k, src); });
  h = s(h, '>Related Stories<', `>${t(N.relatedTitle)}<`);
  h = s(h, 'From foundational design to advanced optimization — built for digital growth.', t(N.relatedIntro));
  const cards = [
    ['November 11, 2025', 'The power of simplicity in modern real brand design', 'Learn effective social media marketing tips to engage your audience and build brand loyalty.', 'post_the-power-of-simplicity-in-modern-brand-design.html'],
    ['October 1, 2025', 'From idea to execution: building products that last', 'An overview of Content Management Systems, their benefits, and popular platforms.', 'post_from-idea-to-execution-building-products-that-last.html'],
    ['October 3, 2026', 'Why great brands are built on clarity, not complexity', 'Discover the latest SEO strategies for 2023 to enhance your website&#x27;s visibility and performance.', 'post_why-great-brands-are-built-on-clarity-not-complexity.html'],
  ];
  cards.forEach(([d, ti, p, href], i) => {
    const r = N.related[i];
    h = s(h, `>${d}<`, `>${t(r.tag)}<`, { count: 1 });
    h = s(h, `>${ti}<`, `>${t(r.title)}<`, { count: 1 });
    h = s(h, `>${p}<`, `>${t(r.desc)}<`, { count: 1 });
    h = s(h, `href="${href}"`, `href="${r.href}"`, { count: 1 });
  });
  h = s(h, '>Read more<', `>${t(N.view)}<`, { count: 4 });
  return h;
};

/* ---- 404.html --------------------------------------------------------- */
PAGES['404.html'] = (lang) => {
  const t = (p) => p[lang];
  const { fn: s } = makeSub('404');
  let h = tpl('404.html');
  h = s(h, '>404 Error Page<', `>${t(C.NOT_FOUND.title)}<`);
  h = s(h, 'The page you are looking for doesn&#x27;t exist or has been moved', t(C.NOT_FOUND.text));
  h = setLink(h, 'Back Home', { href: 'index.html', text: t(C.NOT_FOUND.back) });
  return h;
};

/* ================================================================== main */

const FORBIDDEN = [
  /Mōno™ Studio/, /monostudio/i, /Awwwards/, /Lorem/i, /cal\.com/, /Tomato Store/, /Market Play/,
  /Forma Digital/, /Nero Vision/, /One Step/, /Bold Moves/, /Auralis/, /Light[\s\u00a0]Studio/, /Joda Trump/, /Elena Rossi/, /Adrian Keller/, /Camila Verga/,
  /\$\s?\d/, /logoipsum/i, /Get Template/, /template-navigator/, /youtube\.com/, /embedly/,
  // stock photography that shipped with the templates
  /Young%20Man%20Smiling/, /Sunset-Serenity/, /Joyful-Group/, /Red-Hat-Portrait/, /work-\d+\.webp/, /work7\.webp/, /Matcha-Latte/, /Party-Scene/, /Scene%20/, /Portrait-of-a-Man/, /Diverse-Group/, /Coding-Workspace/, /Sleek%20Container/, /Futuristic/, /blog-\d\.webp/, /about-6/,
  // lifelogx template people, its CMS article images and its brand
  /Vibrant%20Orange/, /Stylish%20Portrait/, /Metallic%20Jacket/, /Rectangle%2043/, /69417cf6925a82af26179b70/, /Lifelogx/i, /Lina Elsen/, /Amira Brik/, /Mila Eron/, /Oren Solis/,
];
const ALLOWED = { 'notices.html': [/Mōno™ Studio/] };

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
    for (const m of html.matchAll(/(?:src|href|data-src|data-poster-url|poster)="(assets\/[^"]+)"/g)) {
      const rel = decodeURIComponent(m[1]).split('?')[0];
      if (!existsSync(`${SITE}/${rel}`) && !existsSync(`${SITE}/${m[1]}`)) throw new Error(`[${lang}/${name}] missing asset: ${m[1]}`);
    }
    for (const m of html.matchAll(/srcset="([^"]*)"/g)) {
      for (const part of m[1].split(',')) {
        const f = part.trim().split(/\s+/)[0];
        if (f.startsWith('assets/') && !existsSync(`${SITE}/${decodeURIComponent(f)}`) && !existsSync(`${SITE}/${f}`)) throw new Error(`[${lang}/${name}] missing srcset asset: ${f}`);
      }
    }
    // Pages in a folder (blog/) link and load one level up; English pages one more.
    const depth = name.split('/').length - 1;
    html = relocateLinks(html, '../'.repeat(depth));
    const assetUp = '../'.repeat(depth + (lang === 'en' ? 1 : 0));
    if (assetUp) html = relocateAssets(html, assetUp);
    const out = lang === 'zh' ? `${SITE}/${name}` : `${SITE}/en/${name}`;
    mkdirSync(out.slice(0, out.lastIndexOf('/')), { recursive: true });
    writeFileSync(out, html.replace(/[\t ]+$/gm, ''), 'utf8');
    written.push(`${lang}/${name}`);
  }
}
console.log(`wrote ${written.length} pages: ${written.join(', ')}`);
