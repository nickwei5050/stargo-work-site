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
import { loadBlocks, art, capTitle, DONORS } from './block-lib.mjs';

import { SITE } from './paths.mjs';

/** The capability page's donor blocks, one module each in tools/blocks. */
const CAP_BLOCKS = await loadBlocks();
const TPL = `${SITE}/tools/templates`;
const FRAG = `${SITE}/tools/fragments`;
const tpl = (f) => readFileSync(`${TPL}/${f}`, 'utf8');
const frag = (f) => readFileSync(`${FRAG}/${f}`, 'utf8');

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

/**
 * Lifelogx closes every page with a full-bleed wordmark above its footer: a filled
 * headline, a gradient wash over it and a stroked copy that slides across on scroll
 * (two SCROLL_INTO_VIEW interactions, kept as the template wrote them). We use Mono's
 * footer, so tools/lifelogx-prepare.mjs rescues the block on its own; here it goes
 * back where it belongs — the last thing in the body, directly above the footer —
 * carrying STARGO's name.
 */
const bigMark = () => {
  let b = frag('lx-bigmark.html').split('>Lifelogx</h1>').join('>STARGO</h1>');
  if (/Lifelogx/.test(b)) throw new Error('bigmark: template brand survives');
  if ((b.match(/>STARGO<\/h1>/g) ?? []).length !== 2) throw new Error('bigmark: expected the filled and the stroked headline');
  // Lifelogx tags both copies of the wordmark as <h1>. On its own pages that is the page's
  // only heading; here it closes an article or an About page that already has one, and two
  // more "STARGO" level-one headings would compete with it. The type, the gradient wash and
  // both scroll interactions are class- and data-w-id-driven, so the tag can go.
  b = b.replace(/<h1(?=[ >])/g, '<div').replace(/<\/h1>/g, '</div>');
  if (/<h1/.test(b)) throw new Error('bigmark: heading tags remain');
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
/* V7-LX: the last clause of a Chinese paragraph as one unit.
   Several paragraphs end with an availability clause (「高级改进仍在完善。」,
   「更深入的团队交流仍在完善。」). Chinese may break between any two
   characters, and `text-wrap: pretty` did not stop 「…仍在」/「完善。」 at 390 or
   「…高级」/「改进仍在完善。」 at 1024. The clause after the last Chinese
   punctuation mark is wrapped in `.lx-v7-tail`, which css/stargo-fusion.css
   (V7-LX) sets as an inline-block on the Chinese pages: it moves to the next
   line whole when it does not fit, and wraps inside itself only if it is
   longer than a whole line. Whatever the clause says, it is never split at
   its end. English is returned unchanged. */
function zhTail(text, lang) {
  if (lang !== 'zh') return text;
  const m = text.match(/^([\s\S]*[，。；：])([^，。；：<>]+。)$/);
  return m ? `${m[1]}<span class="lx-v7-tail">${m[2]}</span>` : text;
}
/* V7-LX: an English display line of two or more short sentences, one
   `.lx-v7-sentence` span each (inline-block, balanced; css/stargo-fusion.css
   V7-LX), so a line break falls between sentences before it falls inside
   one: "Know the / company. Keep / work moving." became "Know the company." /
   "Keep work moving.". Chinese and one-sentence lines are returned as they
   are. */
function enSentences(text, lang) {
  if (lang !== 'en') return text;
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.length < 2 ? text : parts.map((p) => `<span class="lx-v7-sentence">${p}</span>`).join(' ');
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
  /* The studio layout has fixed places: four sticky hero panels, three stat
     rows and five team cards. Checked by count up front, so a list that grows
     or shrinks in copy.mjs fails here by name instead of as an undefined
     deep inside a replacement. */
  [['story', 4], ['stats', 3], ['cards', 5]].forEach(([k, n]) => {
    if (spec[k]?.length !== n) throw new Error(`${spec.name}: ${k} needs ${n} entries, has ${spec[k]?.length}`);
  });
  if (!spec.approach?.length) throw new Error(`${spec.name}: approach has no lines`);
  /* A stat that lists its items must count them (V6 §8: the number in front
     of 「项管理控制：…」 is the number of controls the sentence names), and
     each item must actually be in the sentence on both pages. The sentence
     joins the items with 「、」 and with commas, so an item that holds one of
     those reads as two and the figure would look wrong to anyone counting. */
  spec.stats.forEach((st, i) => {
    if (!st.items) return;
    if (st.value !== String(st.items.length)) throw new Error(`${spec.name}: stat ${i} says ${st.value} but lists ${st.items.length}`);
    for (const lng of ['zh', 'en']) {
      const missing = st.items.filter((x) => !st.text[lng].includes(x[lng]));
      if (missing.length) throw new Error(`${spec.name}: stat ${i} (${lng}) does not name ${missing.map((x) => x[lng]).join(', ')}`);
      const split = st.items.filter((x) => /[、，,；;]/.test(x[lng]));
      if (split.length) throw new Error(`${spec.name}: stat ${i} (${lng}) item reads as two: ${split.map((x) => x[lng]).join(' | ')}`);
    }
  });
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
  /* Mono's approach block is one paragraph of four short <br/>-separated
     lines. The enterprise page (the only caller) puts its numbered delivery
     order there: six steps, each a name and what it involves, which run to
     two lines in the paragraph's 121 + 363px grid at 1440 (fewer than 15
     characters a line). As bare lines the second line of a step started under
     its number and the next step's number was lost in the text, so each step
     is its own <span class="ent-step">: the number in one track, the words in
     the next (stargo-fusion.css, V6-F block). Spans, not blocks, because a
     <p> may only hold phrasing content. The paragraph is still split into
     words and letters by the Webflow/GSAP reveal; that split keeps nested
     elements, so the reveal is unchanged — checked in the browser. */
  const steps = spec.approach.map((x) => {
    const m = /^(\d{2}) (\S[\s\S]*)$/.exec(t(x));
    if (!m) throw new Error(`${spec.name}: approach line "${t(x)}" does not start with a two-digit step number`);
    return `<span class="ent-step"><span class="ent-step-n">${m[1]}</span><span class="ent-step-t">${m[2]}</span></span>`;
  });
  h = s(h, 'Think clearly. <br/>Design precisely. <br/>Build intelligently. <br/>Refine continuously.<br/>', steps.join(''), { count: 1 });
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
    /* The five stages, in order (V6 §4.6): prospecting — an opportunity path
       through a port district; trade sales — conversation becoming shared
       customer context; fulfillment — inspection to dispatch; collection and
       service — trade signals carried to a customer's destination; retain and
       improve — an observed, reversible feedback path. The last three changed
       with the stages: a quotation or command-centre picture no longer matches
       what those stages now say. */
    const scenes = [['Scene%20%239.webp', OS.desk], ['Scene%20%235.webp', OS.inquiries], ['Scene%20%2310%20(Light)', OS.trade], ['Scene%20%238.webp', BRAND.family(1)], ['Scene%2018.webp', BRAND.loop]];
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
    // The section heading is eight characters a line on desktop and ten on
    // phones; the two languages' strings are shaped for those widths, and the
    // phone form travels the same data-mobile-text route as the hero copy.
    const title = t(C.HOME_SC_PRODUCTS[1][1]);
    const before = products;
    products = products.replace(`<h2>${title}</h2>`, `<h2 data-mobile-text="${escapeHtml(t(C.HOME_MOBILE.products))}">${title}</h2>`);
    if (products === before) throw new Error('index: core-systems heading not found for the mobile variant');
  }
  {
    // four Scalora dashboard drawings → the four product slots, desktop and mobile variants alike.
    // Keyed on the start of each slot's name (V6 §4.7), in both languages: the
    // two engines keep their product names, the two business areas are named
    // ERP and AI 创作 / AI Creative. Each slot's picture matches what the slot
    // now says: an opportunity path (prospecting), shared customer context
    // (sales), components, packaging and fulfillment handoff (operations), and
    // a camera-like aperture (images and video).
    const bySystem = {
      'Growth OS': OS.desk,
      'Sales Desk': OS.inquiries,
      'ERP': BRAND.family(2),
      'AI 创作': OS.boot, 'AI Creative': OS.boot,
    };
    const used = new Set();
    let slots = 0;
    products = products.replace(/<div class="products-cards-dashboard-block[^"]*">[\s\S]*?<h3 class="heading-style-h4">([^<]*)<\/h3>/g, (block, title) => {
      const key = Object.keys(bySystem).find((k) => title.startsWith(k));
      if (!key) throw new Error(`index: unknown product slot ${title}`);
      used.add(bySystem[key]); slots++;
      // `title` is already HTML text (it may carry &amp;), so it is not escaped a second time.
      return block.replace(/<img[^>]*class="prodect-dashboard-image"\/>/, `<img src="${bySystem[key]}" loading="lazy" alt="${title.replace(/"/g, '&quot;')}" class="prodect-dashboard-image"/>`);
    });
    if (slots !== 8 || used.size !== 4) throw new Error(`index: expected 8 product panels (4 desktop + 4 phone) showing 4 pictures, found ${slots} showing ${used.size}`);
    if (/prodect-dashboard-0\d\.svg/.test(products)) throw new Error('index: Scalora dashboard drawing survives');
  }
  const integration = addRootClass(sub('sc-integration', frag('integration.html'), C.HOME_SC_INTEGRATION), 'sc-scope');
  const insertBefore = (html, anchor, fragment, label) => { const i = html.indexOf(anchor); if (i === -1) throw new Error(`insertion anchor not found for ${label}`); return html.slice(0, i) + fragment + '\n' + html.slice(i); };
  h = insertBefore(h, '<section class="section with-minus"', hero, 'four-layer stack');
  h = insertBefore(h, '<section class="video-section"', products + integration, 'switcher + channels band');
  /* 旋转图片展示 — rototo's rotating gallery, in the empty band of the hero's own
     footer: after the four dots and above 「© 2026 STARGO WORK」, which is the box
     the owner drew in red. It goes in as a third child of `.hero`; that element's
     other two children are position:absolute with explicit offsets and so is the
     block, so nothing on the page moves — measured with and without it at
     390/768/991/1366/1920 in both languages, every rect identical. The cut, and
     why each of rototo's three animations had to be replayed as CSS rather than
     carried, is documented in tools/blocks/ro-gallery.mjs. */
  {
    const dots = `${'<div class="circle-divider"></div>'.repeat(4)}</div></div>`;
    const copyright = '<div class="container-bottom bottom add-max-cnt">';
    const at = h.indexOf(dots + copyright);
    if (at === -1) throw new Error('index: the hero band between the four dots and the copyright row is not where it was');
    h = h.slice(0, at + dots.length) + renderBlock('ro-gallery', lang) + h.slice(at + dots.length);
  }
  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  /* offgrid's sheet carries the opening animation's block (see homeIntro below)
     and has to be in the <head>: the overlay must be opaque on the first paint,
     or the page it introduces flashes past underneath it. It goes before
     scalora's and before stargo-fusion.css, the same order the capability page
     puts the donor sheets in. */
  h = h.replace(monoLink, (m) => `${m}\n<link href="css/${DONORS.offgrid.sheet}" rel="stylesheet" type="text/css"/>\n<link href="css/${DONORS.rototo.sheet}" rel="stylesheet" type="text/css"/>\n<link href="css/scalora-modules.sc.css" rel="stylesheet" type="text/css"/>\n<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>`);
  h = homeIntro(h, lang);
  return h;
};

/**
 * 开场动画 — the opening the owner asked for, over the homepage.
 *
 * OFFGRID's bracket headline reading `[STARGO OS]`, then OFFGRID's thirty-six
 * tile mosaic revealing, then rototo's column wipe clearing to the page. It is
 * one block, tools/blocks/og-intro.mjs, and everything about how it was cut and
 * why each animation had to be replayed rather than carried is in that file's
 * header.
 *
 * It is an overlay, not a section: the first child of <body>, `position: fixed`,
 * so not one box of the homepage moves because of it, and it removes itself
 * from the document when the sequence ends. It runs on index.html and
 * en/index.html only — this function is called from the homepage builder and
 * from nowhere else, so the other thirty-six pages never carry the markup, the
 * script or offgrid's stylesheet.
 *
 * `aria-hidden` because it is decoration announcing nothing, and it holds
 * nothing focusable: og-intro.mjs takes the donor's anchors out for exactly
 * that reason. tools/chrome.mjs attaches js/stargo-intro.js when it sees
 * `data-og-intro`, and og-intro.css decides whether the overlay is ever shown
 * (never without JavaScript, never under prefers-reduced-motion).
 */
/**
 * A donor block, one module each in tools/blocks.
 *
 * Each module knows how to cut its block out of its donor template (used by
 * tools/capability-donors.mjs) and how to fill it with this site's words. Here
 * we only compose them: read the fragment the extraction wrote, hand it the
 * copy, and put it inside the root class its stylesheet is scoped under.
 *
 * It sat inside the capability page's own builder until the homepage's opening
 * animation became a block too; it never used anything of that closure, so it
 * moved out here rather than being written twice.
 */
function renderBlock(id, lang, extra) {
  const mod = CAP_BLOCKS.get(id);
  if (!mod) throw new Error(`no block module ${id}`);
  const frag = readFileSync(`${SITE}/tools/fragments/${id}.html`, 'utf8');
  const t = (v) => (typeof v === 'string' ? v : v[lang]);
  const html = mod.render(frag, { C, lang, t, escapeHtml, capTitle: capTitle(lang), art, ...extra });
  return `<div class="${mod.donor.scope.replace(/^\./, '')}">${html}</div>`;
}

function homeIntro(html, lang) {
  const intro = renderBlock('og-intro', lang);
  const OPEN = '<div class="og-intro">';
  if (!intro.startsWith(OPEN)) throw new Error('index: the intro block did not come back wrapped in its scope');
  const overlay = `<div class="og-intro" data-og-intro="" aria-hidden="true">${intro.slice(OPEN.length)}`;
  if (!html.includes('<body>')) throw new Error('index: no <body> to put the opening animation in front of');
  return html.replace('<body>', `<body>${overlay}`);
}

/* ---- the enterprise ontology list inside the lifelogx sticky section -------
   THE DEFECT: the page shipped six objects (客户 / 询盘 / 报价 / 订单 / 出货 /
   任务) but no viewport ever showed more than three of them. Measured on the
   served page before this change, walking DOWN only (these templates reverse
   their reveal on upward scroll, so a frame taken after scrolling back up is a
   half-closed animation, not the layout):

       width   客户    询盘    报价    订单    出货    任务
       390     358x42 358x42 358x42  0x0    0x0    0x0
       430     398x42 398x42 398x42  0x0    0x0    0x0     <- 412/430 were the
       768      0x0    0x0    0x0   224x42 224x42 224x42      widths no earlier
       1024     0x0    0x0    0x0   309x42 309x42 309x42      pass measured at
       1440     0x0    0x0    0x0   416x42 416x42 416x42

   The 0x0 boxes are not a reveal mid-frame: those headings sit under an
   ancestor at display:none. Half the catalogue was unreachable at every single
   width, while every card's eyebrow already promised 「客户 ▪ 报价 ▪ 订单」.

   WHY IT HAPPENED: the donor ships the SAME three texts twice, in two sibling
   wrappers that css/lifelogx.lx.css switches at 767px —

     .lx-home-features-texts.lx-hide-desktop   display:none,  flex below 768
     .lx-hero-home-text-holder.lx-hide-mobile-landscape   flex,  none below 768

   — so Lifelogx can show its three features inline between the picture cards on
   a phone and in the scroll-synced right-hand column on a desktop. It is a
   REPOSITIONING device for one list, not a way to carry two. This build read
   the six slots as six distinct objects (spec.cards.slice(0, 6) fed straight
   into both wrappers), which silently cut the list in half at the breakpoint.

   THE FIX, and why it is shaped this way: each wrapper now carries the whole
   list, which is exactly what the donor does — the two wrappers are mutually
   exclusive, so nothing is ever on screen twice.

     - 客户 / 询盘 / 报价 lose the `lx-hide-desktop` breakpoint switch and stand
       in the left column at every width. Nothing binds to that class but the
       display rule above; the interactions bind to .lx-expandable-item.lx-_N
       and .lx-home-features-texts.lx-_N, which are untouched here.
     - 订单 / 出货 / 任务 stay in the donor's right-hand sticky column, still
       driven by lx-a-39 / lx-a-65 (STYLE_OPACITY + TRANSFORM_MOVE at y=±100%
       of each block's own height), so the desktop cross-fade is byte-for-byte
       the donor's.
     - and three clones of the donor's own mobile unit — the same markup, the
       same `lx-hide-desktop` class the donor uses for precisely this purpose —
       mirror that trio inline below 768, where the right-hand column is gone.

   Rejected: simply deleting both `lx-hide-*` switches. It measures green (all
   six get a box at all five widths) but it puts the donor's overlapping
   opacity carousel on a phone, where .lx-sitcky-section is height:auto instead
   of 300vh. Measured at 430x900: 订单 and 出货 never reach opacity 0.95 while
   fully inside the viewport — the scroll range is too short for a three-step
   cross-fade — and below 479px .lx-hero-home-text-holder picks up the donor's
   `text-align:center`, so that trio would be centred while the trio above it
   stays ranged left. Cloning the unit the donor already wrote for phones keeps
   the phone layout the donor's plain inline list.

   AFTER, same downward walk, every heading's widest box and the number of
   copies of it that are not under a display:none ancestor:

       width   客户    询盘    报价    订单    出货    任务     copies visible
       320    288x42 288x42 288x42 288x42 288x42 288x42   1 each
       360    328x42 328x42 328x42 328x42 328x42 328x42   1 each
       375    343x42 343x42 343x42 343x42 343x42 343x42   1 each
       390    358x42 358x42 358x42 358x42 358x42 358x42   1 each
       393    361x42 361x42 361x42 361x42 361x42 361x42   1 each
       412    380x42 380x42 380x42 380x42 380x42 380x42   1 each
       430    398x42 398x42 398x42 398x42 398x42 398x42   1 each
       768    224x42 224x42 224x42 224x42 224x42 224x42   1 each
       834    246x42 246x42 246x42 246x42 246x42 246x42   1 each
       1024   309x42 309x42 309x42 309x42 309x42 309x42   1 each
       1440   416x42 416x42 416x42 416x42 416x42 416x42   1 each

   Also walked at the three breakpoint edges the donor switches on — 479/480,
   767/768 and 991/992 — and on en/intelligence.html, with the same result. The
   three phone clones carry the only second DOM copy of 订单 / 出货 / 任务 and
   it is display:none from 768 up, so nothing is ever on screen twice.

   The desktop cross-fade is untouched: sampling the walk every 40px, the
   sticky trio peaks at opacity 0.94 / 0.92 / 1.00 at 1024 with this change and
   at 0.98 / 0.91 / 1.00 with the new left-column texts forced back to
   display:none. Same numbers, so the sub-1.0 readings are the sampling step
   landing beside a continuous cross-fade, not anything this change caused. */
function lxOntologyList(b, spec, t, name, lang) {
  const PLAIN = '<div class="lx-home-features-texts">';
  const MOBILE = '<div class="lx-home-features-texts lx-hide-desktop">';
  const found = b.split(MOBILE).length - 1;
  if (found !== 3) throw new Error(`${name}: expected 3 ${MOBILE} units in the donor, found ${found}`);
  if (b.includes(PLAIN)) throw new Error(`${name}: the donor already has an unswitched features-texts unit`);

  // Off with the breakpoint switch: these three now stand at every width.
  b = b.split(MOBILE).join(PLAIN);

  // Clone the last one three times, switch back on, for the phone mirror of the
  // right-hand column. Same unit, same markup — cloning a unit is how this repo
  // repeats a donor row, and nothing in it carries a data-w-id to collide.
  const unit = extractElement(b, b.lastIndexOf(PLAIN), 'div');
  const clone = MOBILE + unit.text.slice(PLAIN.length);
  for (const marker of ['<h3 class="lx-heading-style-h3 lx-home-feature">', '<div class="lx-text-size-regular lx-text-weight-light">']) {
    if (clone.split(marker).length - 1 !== 1) throw new Error(`${name}: the cloned ontology unit does not hold exactly one ${marker}`);
  }
  b = b.slice(0, unit.end) + clone.repeat(3) + b.slice(unit.end);

  /* Slot order down the document: three unswitched units in the left column,
     three phone-only clones after them, the donor's three sticky units in the
     right column, then the story card, which shares these two classes. */
  const objects = spec.cards.slice(0, 6);
  const inLeftColumn = objects.slice(0, 3);          // 客户 / 询盘 / 报价
  const inStickyColumn = objects.slice(3, 6);        // 订单 / 出货 / 任务
  const slots = [...inLeftColumn, ...inStickyColumn, ...inStickyColumn];
  b = setEachInner(b, '<h3 class="lx-heading-style-h3 lx-home-feature">', [...slots.map((c) => t(c.title)), t(spec.feat2Card.title)]);
  b = setEachInner(b, '<div class="lx-text-size-regular lx-text-weight-light">', [...slots.map((c) => t(c.text)), zhTail(t(spec.feat2Card.text), lang)]);

  // Every object once in each wrapper, and the wrappers never overlap.
  for (const c of objects) {
    const n = b.split(`<h3 class="lx-heading-style-h3 lx-home-feature">${t(c.title)}</h3>`).length - 1;
    if (n !== (inLeftColumn.includes(c) ? 1 : 2)) throw new Error(`${name}: ${t(c.title)} appears ${n} times`);
  }
  return b;
}

/* ---- the plain-explanations section on intelligence.html (V6 §7) ----------
   V6 asks for readable places for enterprise knowledge, the relationship map,
   one customer across systems, proactive work, long-running tasks and memory,
   with the knowledge base and the relationship map explained apart. The
   Lifelogx homepage has no slot that holds a paragraph — its text lives in
   headlines, fixed-height cards and marquee bubbles — so this adds ONE section
   (an approved V6 type-B addition) with the copy in
   C.LX_INTELLIGENCE_CONTEXT.

   Built from the page's own vocabulary: .lx-section / .lx-padding-global /
   .lx-container-medium / .lx-padding-section-medium for the frame, the h2 and
   h4 heading styles, the eyebrow (.lx-home-features-small-texts .lx-subtext)
   and the regular text style. Its grid and card outline are in the V6-E block
   of css/stargo-fusion.css and copy .lx-story-grid (gap, top margin) and
   .lx-story-grid-item.lx-_3 (1px #262627, 23px radius).

   Deliberately static. Nothing in it carries a class that the Lifelogx
   interactions bind to (tools/fragments/lx-ix.json binds .lx-fade-in-*,
   .lx-content, .lx-sitcky-section and others by class), so the IX engine never
   starts it at opacity 0, and it reads the same without JavaScript. It also
   avoids `.lx-home-feature` and `.lx-home-features-texts`: lxOntologyList()
   counts the first, and the sticky cross-fade styles the second.

   It goes in front of the 288-roles section: after 「不再 等提醒 / 等回复 /
   丢上下文」, before the team card and the closing card on improvement, which
   is the one topic of the seven this section leaves to its existing slot. */
function lxContextSection(ctx, t) {
  if (ctx?.items?.length !== 6) throw new Error(`intelligence: expected 6 context items, found ${ctx?.items?.length}`);
  const items = ctx.items.map((it) => {
    for (const k of ['group', 'title', 'text']) if (!t(it[k])) throw new Error(`intelligence: context item without ${k}`);
    // A no-break space before each arrow, so a line never starts with "→".
    if (it.flow && !t(it.flow).includes(' → ')) throw new Error('intelligence: context flow without " → " steps');
    const flow = it.flow ? `<p class="lx-text-size-regular lx-context-flow">${t(it.flow).replaceAll(' → ', '\u00a0→ ')}</p>` : '';
    return `<div class="lx-context-item"><div class="lx-home-features-small-texts"><div class="lx-subtext">${t(it.group)}</div></div>`
      + `<h3 class="lx-heading-style-h4">${t(it.title)}</h3>`
      + `<p class="lx-text-size-regular lx-text-weight-light">${t(it.text)}</p>${flow}</div>`;
  }).join('');
  return `<div id="lx-context" class="lx-section lx-context"><div class="lx-padding-global"><div class="lx-container-medium"><div class="lx-padding-section-medium">`
    + `<div class="lx-context-head"><h2 class="lx-heading-style-h2 lx-context-title"><span class="lx-context-pink">${t(ctx.title)}</span><span>${t(ctx.titleSub)}</span></h2>`
    + `<p class="lx-text-size-medium lx-context-lede">${t(ctx.lede)}</p></div>`
    + `<div class="lx-context-grid">${items}</div>`
    + `<div class="lx-context-note"><div class="lx-home-features-small-texts"><div class="lx-subtext">${t(ctx.noteLabel)}</div></div>`
    + `<p class="lx-text-size-regular lx-text-color-grey">${t(ctx.note)}</p></div>`
    + `</div></div></div></div>`;
}

/* ---- intelligence.html — lifelogx homepage -----------------------------
   The only caller is PAGES['intelligence.html'] below; workforce.html moved to
   the Lifelogx feature template and no longer comes through here. */
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
  /* V7: the two hero buttons glide with js/stargo-anchor-glide.js, which
     re-measures the target on every frame. Webflow's own glide aimed at where
     the closing card was at click time, and below 768px the expandable cards
     collapse on the way, so #lx-evolution was reached ~888px too far down. */
  for (const { href } of [spec.store1, spec.store2]) {
    b = s(b, `<a href="${href}" class="lx-big-button`, `<a href="${href}" data-stargo-anchor="" class="lx-big-button`, { count: 1 });
  }
  b = s(b, 'The friend who never forgets.', enSentences(t(spec.heroDesc), lang));
  b = s(b, 'Natural, human-like chats that keep users engaged and understood.', t(spec.features[0].text));
  b = s(b, '<h3 class="lx-expandable-text">Interaction</h3>', `<h3 class="lx-expandable-text">${t(spec.features[0].title)}</h3>`);
  b = s(b, 'Smooth, intuitive actions that make every tap feel effortless.', t(spec.features[1].text));
  b = s(b, '<h3 class="lx-expandable-text">Conversation</h3>', `<h3 class="lx-expandable-text">${t(spec.features[1].title)}</h3>`);
  b = s(b, 'Ready made features your users already expect.', t(spec.features[2].text));
  b = s(b, '<h3 class="lx-expandable-text">Organised</h3>', `<h3 class="lx-expandable-text">${t(spec.features[2].title)}</h3>`);
  for (const [k, v] of Object.entries(spec.tags)) b = s(b, `>${k}<`, `>${t(v)}<`);
  b = lxOntologyList(b, spec, t, name, lang);
  /* V7-LX: each card's small caps label names that card (C.LX_INTELLIGENCE
     cardTags / teamTags). The template's label — the three LX_TAGS words with
     a dot between — sits above the six object cards (left column, phone
     clones of 订单 / 出货 / 任务, sticky column) and above the team card, in
     that document order; the team card's label also carries IX attributes,
     so it is matched by its class and its template words only. */
  {
    if (spec.cardTags?.length !== 6 || !spec.teamTags) throw new Error(`${name}: a small caps label for each of the six cards and the team card`);
    const [w1, w2, w3] = ['CARDS', 'transfers', 'financing'].map((k) => t(spec.tags[k]));
    const re = new RegExp(`(class="lx-home-features-small-texts">)<div class="lx-subtext">${w1}</div>(<img[^>]*>)<div class="lx-subtext">${w2}</div><img[^>]*><div class="lx-subtext">${w3}</div>`, 'g');
    const order = [0, 1, 2, 3, 4, 5, 3, 4, 5].map((i) => t(spec.cardTags[i])).concat([t(spec.teamTags)]);
    let k = 0;
    b = b.replace(re, (m, open, dot) => {
      const items = order[k++];
      if (!items) return m;
      return open + items.map((w) => `<div class="lx-subtext">${escapeHtml(w)}</div>`).join(dot);
    });
    if (k !== order.length) throw new Error(`${name}: expected ${order.length} template card labels, found ${k}`);
    if (b.includes(`<div class="lx-subtext">${w1}</div>`)) throw new Error(`${name}: a template card label survives`);
  }
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
  /* V7-LX: the left-moving marquee rows loop without overlap. IX2 (lx-a-35)
     moves each of a row's two copies by -100% of ITS OWN width over 60s, so
     the two copies must be equally wide. The template's second copy swapped
     one bubble for another (here 6 for 2), and with this copy the copies were
     3684 and 3895px wide at zh 1440: the second one slid 211px into the first
     over each loop and covered 「一份报价在等负责人批准。」. Both copies are now
     the same six bubbles, 0-4 and 6. Bubble 5, the quote waiting for approval,
     is not lost: the right-moving row ends every copy with it. There are two
     such rows (the section repeats its pair of rows), handled alike. */
  {
    const OPEN = '<div class="lx-cta-list-left">';
    const found = b.split(OPEN).length - 1;
    if (found !== 4) throw new Error(`${name}: expected two left-moving marquee rows of two copies, found ${found} copies`);
    const bubble = (i) => t(spec.bubbles[i]);
    const texts = (html) => [...html.matchAll(/<p class="lx-testimonial-text">([^<]*)<\/p>/g)].map((m) => m[1]);
    const expectA = [0, 1, 2, 3, 4, 5].map(bubble).join('|');
    const expectB = [0, 1, 6, 3, 4, 5].map(bubble).join('|');
    let from = 0;
    for (let row = 0; row < 2; row++) {
      const a = extractElement(b, b.indexOf(OPEN, from), 'div');
      if (b.indexOf(OPEN, a.end) !== a.end) throw new Error(`${name}: marquee row ${row + 1}: the two copies are not adjacent`);
      const second = extractElement(b, a.end, 'div');
      if (texts(a.text).join('|') !== expectA || texts(second.text).join('|') !== expectB) {
        throw new Error(`${name}: marquee row ${row + 1} no longer holds bubbles 0-5 / 0,1,6,3,4,5`);
      }
      const unit = s(a.text, `<p class="lx-testimonial-text">${bubble(5)}</p>`, `<p class="lx-testimonial-text">${bubble(6)}</p>`, { count: 1 });
      b = b.slice(0, a.start) + unit + unit + b.slice(second.end);
      from = a.start + unit.length * 2;
    }
  }
  ['_1', '_2', '_3', '_4'].forEach((k, i) => {
    const re = new RegExp(`(class="lx-big-gradient-text lx-${k}">)[^<]*(</h3>)`, 'g');
    if (!re.test(b)) throw new Error(`${name}: gradient word ${k}`);
    b = b.replace(re, `$1${t(spec.words[i])}$2`);
  });
  b = s(b, '<h3 class="lx-heading-style-h1 lx-pink">Add your Notes in minutes</h3>', `<h3 class="lx-heading-style-h1 lx-pink">${t(spec.feat2Title)}</h3>`);
  b = s(b, '<h3 class="lx-heading-style-h1">As simple as talking</h3>', `<h3 class="lx-heading-style-h1">${enSentences(t(spec.feat2Sub), lang)}</h3>`);
  b = setLink(b, 'Get started', { href: spec.feat2Button.href, text: t(spec.feat2Button.label) });
  b = s(b, 'Your story, <br/>Your memories, <br/>Your moments', spec.feat2Lines.map(t).join(' <br/>'));
  b = s(b, '>Your AI companion<', `>${t(spec.ctaTitle)}<`);
  b = s(b, 'class="lx-cta-text lx-_2nd">As simple as talking</h4>', `class="lx-cta-text lx-_2nd">${t(spec.ctaSub)}</h4>`);
  b = s(b, 'class="lx-cta-logo-text">Lifelogx</div>', `class="lx-cta-logo-text">${t(spec.ctaLogo)}</div>`);
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  b = s(b, 'The smartest friend you’ll ever have.', zhTail(t(spec.ctaDesc), lang));
  // The plain-explanations section (see lxContextSection) opens the 288-roles
  // section's slot in the document: after the "no writing" band, before the
  // team card. The marker is that section's own opening, which is unique.
  // The 288-roles section also gets a class of its own, `lx-team-section`:
  // workforce.html has a `.lx-flex-text-center` heading pair too (its article
  // strip), and the V6-E line-breaking rule for 「288 个岗位，」 must not reach it.
  {
    const TEAM = '<div class="lx-section"><div class="lx-padding-global"><div class="lx-container-medium"><div class="lx-padding-section-medium"><div class="w-layout-hflex lx-flex-text-center">';
    const at = b.indexOf(TEAM);
    if (at < 0 || b.split(TEAM).length !== 2) throw new Error(`${name}: expected one 288-roles section opening`);
    if (!(b.indexOf('lx-section lx-no-writing') < at && at < b.indexOf('class="lx-cta-wrapper"'))) throw new Error(`${name}: the 288-roles section is no longer between the "no writing" band and the closing card`);
    const tagged = TEAM.replace('<div class="lx-section">', '<div class="lx-section lx-team-section">');
    b = b.slice(0, at) + lxContextSection(C.LX_INTELLIGENCE_CONTEXT, t) + tagged + b.slice(at + TEAM.length);
  }
  // Imagery stays the template's own (owner decision, 2026-09-06): the phone screens, the
  // translucent overlays of the gradient and "no writing" sections, the closing card's image and
  // the avatars in the scenario bubbles are all part of the composition the pink palette was
  // designed around. Only their template alt text goes.
  if ((b.match(/lx-author-image-medium/g) ?? []).length !== 48) throw new Error(`${name}: avatar bubbles changed`);
  /* V7-LX, the one exception on the Chinese page: the four phone-screen
     pictures inside the three phone mockups (hero, team card, phone features)
     have the template's English interface painted in — "Danny Hopkins",
     "Messages", "Your wall collection", "New faces on here". STARGO's four
     phone-format concept pictures (887x1774, text-free) take those slots
     there: the screens are object-fit: cover in the same frame, so the crop
     and the cycling animation are unchanged, and they stay decorative
     (alt=""). The English page keeps the template's screens. The hand-held
     phone of the "no writing" band (no-writing-sc) is a cut-out composite
     with its own English text and has no text-free counterpart; it stays. */
  if (lang === 'zh') {
    const SCREENS = [
      ['iPhone%2013%20Pro%20Max%20-%203', MOBILE.inquiry],   // a chat → conversation becomes customer knowledge
      ['iPhone%2013%20Pro%20Max%20-%204', MOBILE.approvals], // a message list → a decision held at an approval gate
      ['iPhone%2016%20Pro%20-%201', MOBILE.agents],          // a card wall → parallel tasks at a shared junction
      ['iPhone%2016%20Pro%20-%202', MOBILE.core],            // the first screen → shared enterprise context
    ];
    for (const [key, src] of SCREENS) {
      if ((b.match(new RegExp(`<img\\b[^>]*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')) ?? []).length !== 3) throw new Error(`${name}: expected the phone screen ${key} in three mockups`);
      b = swapImg(b, key, src);
    }
  }
  b = b.replace(/<div([^>]*)class="([^"]*\blx-gradient-section\b[^"]*)"/, '<div id="lx-more"$1class="$2"');
  b = b.replace(/<div class="lx-cta-wrapper">/, '<div id="lx-evolution" class="lx-cta-wrapper">');
  b = b.replace('class="lx-sitcky-section"', `id="${name === 'intelligence' ? 'lx-ontology' : 'lx-teams'}" class="lx-sitcky-section"`);
  if (!b.includes('id="lx-more"') || !b.includes('id="lx-evolution"')) throw new Error(`${name}: anchor ids`);
  if (/Lifelogx|Tomato|lifelog/i.test(b)) throw new Error(`${name}: template brand survives`);
  // V6 §7: the page explains the layer in business terms. The architecture
  // labels it used to lead with must not come back through any slot.
  {
    const jargon = b.match(/企业本体|前置部署|调度中枢|自我进化|提示词|模型权重|Ontology|Embedded FDE|Orchestrator|Evolution|model weights|\bprompts?\b/);
    if (jargon) throw new Error(`${name}: architecture wording "${jargon[0]}" is back on the page`);
  }
  return inMonoShell(b + bigMark() + '<script src="js/stargo-anchor-glide.js" defer></script>', ['lifelogx.lx.css', 'stargo-fusion.css']).replace('<body ', '<body class="lx-page" ');
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
  b = s(b, '>Think it once<', `>${t(W.heroPink)}<`, { count: 1 });
  b = s(b, '>Remember it forever<', `>${t(W.heroWhite)}<`, { count: 1 });
  b = s(b, 'Each feature focuses on reducing friction between thought and action.', t(W.heroDesc), { count: 1 });
  b = s(b, '>Download<', `>${t(W.heroButton)}<`);

  /* The five role cards, repeated once for the marquee loop. They are examples
     (V6 §6.1): the grey label that was the template's "Views" says so on every
     card, so all five roles must carry the same label, and the figure slot
     carries the role group. The collage card in the desktop item below is a
     sixth example with its own group, and it shares the fifth card's template
     figure (125.5M), so it is written first, inside its own element, before
     the marquee's figures are replaced two by two. It also gets a class of its
     own: its name, 「报告 AI 员工」, wraps to two lines on a phone, and
     css/stargo-fusion.css (V6-D) parks that taller panel lower there. */
  if (W.roles.length !== 5) throw new Error(`workforce: the marquee has five role cards, copy has ${W.roles.length}`);
  for (const r of W.roles) {
    if (t(r.dept) !== t(W.roles[0].dept)) throw new Error(`workforce: role "${t(r.name)}" is labelled "${t(r.dept)}", the others "${t(W.roles[0].dept)}"`);
  }
  if (lang === 'zh' && t(W.roles[0].dept) !== '岗位示例') throw new Error('workforce: the role cards must be labelled 岗位示例 (V6 §6.1)');
  {
    const card = findByClass(b, 'a', 'lx-organized-mind-card');
    if (!card) throw new Error('workforce: the collage role card (.lx-organized-mind-card) is gone');
    let inner = s(card.text, '<div class="lx-text-size-tiny">125.5M</div>', `<div class="lx-text-size-tiny">${t(W.extraRole.owns)}</div>`, { count: 1 });
    inner = s(inner, 'class="lx-organized-mind-card w-inline-block"', 'class="lx-organized-mind-card lx-v6-collage-card w-inline-block"', { count: 1 });
    b = b.slice(0, card.start) + inner + b.slice(card.end);
  }
  const NAMES = ['Philip', 'Arlene', 'Marjorie', 'Collen', 'Greg'];
  const FIGURES = ['99.6M', '88.3', '16.2M', '73.7M', '125.5M'];
  NAMES.forEach((person, i) => {
    b = s(b, `<div class="lx-name-text">${person}</div>`, `<div class="lx-name-text">${t(W.roles[i].name)}</div>`, { count: 2 });
  });
  FIGURES.forEach((fig, i) => {
    b = s(b, `<div class="lx-text-size-tiny">${fig}</div>`, `<div class="lx-text-size-tiny">${t(W.roles[i].owns)}</div>`, { count: 2 });
  });
  b = s(b, '<div class="lx-text-size-tiny lx-text-color-grey">Views</div>',
    `<div class="lx-text-size-tiny lx-text-color-grey">${t(W.roles[0].dept)}</div>`, { count: 11 });
  // the template's cards link to the studio's own social accounts
  b = b.replace(/href="https:\/\/(?:www\.)?(?:linkedin|instagram|facebook|x|twitter|tiktok|youtube)\.com[^"]*"/g, 'href="contact.html"');
  // the fifth card and the panel button are placeholders in the template
  b = b.split('href="#"').join('href="contact.html"');

  /* The pink panel: what a role is, how work is handed to a team, and the
     browser desktop it happens in (M10, M14). The panel heading gets a class
     so the Chinese page can keep it from breaking inside a phrase
     (css/stargo-fusion.css, V6-D). */
  b = s(b, 'class="lx-heading-style-h3 lx-bold-black-text">Here is what you can get done with Us<',
    `class="lx-heading-style-h3 lx-bold-black-text lx-v6-panel-title">${t(W.doTitle)}<`, { count: 1 });
  [['Interaction', 'Instantly find what you need dates, notes, or activities without digging around.'],
   ['Conversation', 'Chat freely with your AI, your friends, or even your thoughts.'],
   ['Organized Mind', 'Stay on top of everything with a clear overview of your world.']]
    .forEach(([title, text], i) => {
      b = s(b, `>${title}<`, `>${t(W.abilities[i].title)}<`, { count: 1 });
      b = s(b, text, t(W.abilities[i].text), { count: 1 });
    });
  ['See priorities at a glance', 'Track projects and people', 'Stay focused on what matters', 'Keep distractions out']
    .forEach((line, i) => { b = s(b, line, t(W.bullets[i]), { count: 1 }); });

  /* the two feature cards over the pink panel */
  b = s(b, '>Your Best Friend AI<', `>${t(W.cardA.title)}<`);
  b = s(b, 'More than an assistant—it’s the friend who listens, remembers, and keeps life simple.', t(W.cardA.text));
  b = s(b, '>Memory That Sticks<', `>${t(W.cardB.title)}<`);
  b = s(b, 'From quick notes to deep thoughts, nothing slips through the cracks.', t(W.cardB.text));

  /* The three stacked cards: the team scenario in M11's order, each card
     labelled an illustration with its step number (V6 §6.3). */
  if (W.answersCards.length !== 2) throw new Error('workforce: two rotating cards follow the stacked one');
  [['Ready‑made features your usersalready expect.', W.stackedCard],
   ['Chatting on the fly with your AI companion', W.answersCards[0]],
   ['Quickly capture and share ideas', W.answersCards[1]]]
    .forEach(([orig, copy], i) => {
      b = s(b, `<h4 class="lx-heading-style-h4">${orig}</h4>`,
        `<div class="lx-subtext lx-v6-scene-label">${escapeHtml(t(W.sceneLabel))} · 0${i + 1}</div>`
        + `<h4 class="lx-heading-style-h4">${escapeHtml(t(copy))}</h4>`, { count: 1 });
    });
  /* The second card's picture was two chat bubbles with English words painted
     into the image ("That's correct", "Ok"), on both language pages. The
     bubbles are now page text — what the roles say to each other (P04) —
     beside the template's own text-free blob, which the icon loops on the
     other two cards already use. Same holder, same place in the card; the
     arrangement is css/stargo-fusion.css, V6-D. */
  {
    const bubbles = b.match(/<img\b[^>]*6942c7318ab7f0a234efab41_Group%2034\.png[^>]*>/g) ?? [];
    if (bubbles.length !== 1) throw new Error(`workforce: expected the one chat-bubble picture in the second card, found ${bubbles.length}`);
    if (W.chat.length !== 3) throw new Error('workforce: the second card carries P04\'s three messages');
    const BLOB = 'assets/6929b6c693cb856e01ef7c05/6942c685459bddbfc09cab06_Vector%20(7).png';
    if (!b.includes(`src="${BLOB}"`)) throw new Error('workforce: the blob artwork the chat reuses is no longer in the icon loops');
    b = s(b, bubbles[0], `<div class="lx-v6-chat"><img src="${BLOB}" loading="lazy" alt="" class="lx-v6-chat-blob"/>`
      + `<div class="lx-v6-chat-lines">${W.chat.map((m) => `<p class="lx-v6-chat-line">${escapeHtml(t(m))}</p>`).join('')}</div></div>`, { count: 1 });
  }
  /* The confirmation card and the team paragraph's heading were one template
     string in two spellings; they now say different things: the note beside
     the desktop item names the desktop, the heading closes the scenario. */
  b = s(b, '>An online account that means business<', `>${t(W.phoneTitle)}<`, { count: 1 });
  b = s(b, '<h3 class="lx-heading-style-h3">An online account thatmeans business</h3>',
    `<h3 class="lx-heading-style-h3 lx-v6-team-title">${t(W.teamTitle)}</h3>`, { count: 1 });
  b = s(b, '>Easy day-to-day banking<', `>${t(W.phoneSub)}<`, { count: 1 });
  b = s(b, 'Easy day-to-day banking: local IBAN, freeMastercards, instant &amp; international transfers,financing solutions. All included in your plan.', t(W.answersBody), { count: 1 });
  b = s(b, '<div class="lx-name-text">Dancing for you</div>', `<div class="lx-name-text">${t(W.extraRole.name)}</div>`, { count: 1 });

  /* The display line behind the cards. The template left it unbalanced (its
     own four words never needed it); the class lets the Chinese page balance
     its two five-character halves (css/stargo-fusion.css, V6-D). */
  b = s(b, '<div class="lx-big-text-on-gradient">All your answers here</div>',
    `<div class="lx-big-text-on-gradient lx-v6-team-display">${t(W.answersTitle)}</div>`, { count: 1 });
  ['CARDS', 'transfers', 'financing'].forEach((tab, i) => { b = s(b, `>${tab}<`, `>${t(W.answerTabs[i])}<`, { count: 1 }); });
  b = s(b, '>Get the app<', `>${t(W.answersButton)}<`);
  /* The team scenario is where capabilities #story-6 sends 「看团队协作」
     (V6 §12: a details link lands on its topic). */
  b = s(b, 'class="lx-section lx-answers-card-section-holder"', 'id="lx-team" class="lx-section lx-answers-card-section-holder"', { count: 1 });

  /* The ten role groups (V6 §6.2), the one block this page adds. It goes after
     the pink panel — after 「有岗位的 AI」, before the team scenario — and it
     is the template's own careers list from its About page (lx-about.html:
     .lx-careers_sticky-grid, a sticky heading beside .lx-careers_01-list), in
     the page's standard .lx-section shell. Rows are <div>s, not the template's
     <a>s: a role group is not a link. Every row shows the group and its count,
     which is what a phone keeps when the grid folds to one column. No IX
     attribute: the block is static, so nothing about the page's animation
     timeline changes. */
  {
    const R = C.WORKFORCE_ROLE_GROUPS;
    if (R.groups.length !== 10) throw new Error(`workforce: V6 §6.2 lists ten role groups, copy has ${R.groups.length}`);
    const sum = R.groups.reduce((n, g) => n + g.count, 0);
    if (!R.groups.every((g) => Number.isInteger(g.count) && g.count > 0)) throw new Error('workforce: every role group needs a positive whole count');
    if (sum !== R.total.count) throw new Error(`workforce: the role groups add up to ${sum}, the total row says ${R.total.count}`);
    if (R.total.count !== 288) throw new Error(`workforce: the role directory is 288 roles (V5 M10, V6 §6.2); the table totals ${R.total.count}`);
    if (R.titleChunks.zh.join('') !== '十类岗位，一个可按任务组织的数字团队。') throw new Error('workforce: the role-group heading is no longer P04\'s');
    if (!t(R.note).includes('288')) throw new Error('workforce: the note under the total must say what 288 counts');
    if (R.titleChunks.en.length !== 2) throw new Error('workforce: the English role-group heading is P04\'s two sentences, one chunk each');
    const title = lang === 'zh'
      ? R.titleChunks.zh.map(escapeHtml).join('<wbr>')
      : R.titleChunks.en.map((c) => `<span class="lx-v6-roster-chunk">${escapeHtml(c)}</span>`).join(' ');
    /* M10's five steps. The space before each arrow becomes a no-break space,
       so a line can end on "→" but never begin with one. */
    const steps = t(R.flow).split(' → ');
    if (steps.length !== 5) throw new Error(`workforce: the role-group flow is M10's five steps joined by " → ", found ${steps.length}`);
    const flow = steps.map(escapeHtml).join('&nbsp;→ ');
    const row = (name, count, extra = '') => `<div class="lx-careers_01-item lx-v6-roster-row${extra}" role="listitem">`
      + `<div class="lx-careers-item-name"><div>${escapeHtml(t(name))}</div></div>`
      + `<div class="lx-careers-item-name lx-v6-roster-count"><div>${count}</div><div class="lx-careers-text">${escapeHtml(t(R.unit))}</div></div></div>`;
    const block = '<div id="lx-role-groups" class="lx-careers_wrapper lx-v6-roster"><div class="lx-section"><div class="lx-padding-global">'
      + '<div class="lx-container-medium"><div class="lx-padding-section-medium"><div class="lx-careers_sticky-grid">'
      + '<div class="lx-grid-content"><div class="lx-sticky-content"><div class="lx-header-container-left"><div class="lx-text-align-left">'
      + `<h2 class="lx-heading-style-h2 lx-v6-roster-title">${title}</h2>`
      + `<p class="lx-careers-text lx-v6-roster-intro">${escapeHtml(t(R.intro))}</p>`
      + `<p class="lx-careers-text lx-v6-roster-flow">${flow}</p>`
      + '</div></div></div></div>'
      + '<div class="lx-grid-content"><div class="lx-careers_01-list" role="list">'
      + R.groups.map((g) => row(g.name, g.count)).join('')
      + row(R.total.name, R.total.count, ' lx-v6-roster-total')
      + `</div><p class="lx-careers-text lx-v6-roster-note">${escapeHtml(t(R.note))}</p></div>`
      + '</div></div></div></div></div></div>';
    const AT = '<div data-w-id="dc3f430b-880a-bd0a-232f-0f7008c64b95" class="lx-gradient-anim-holder-feature">';
    b = s(b, AT, block + AT, { count: 1 });
    const pos = { block: b.indexOf('id="lx-role-groups"'), panel: b.indexOf('lx-capabilites-section-bg'), cards: b.indexOf('lx-answers-card-section') };
    if (!(pos.panel < pos.block && pos.block < pos.cards)) throw new Error(`workforce: the role groups must sit between the pink panel and the team cards (${JSON.stringify(pos)})`);
  }

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
    .forEach(([person, key], i) => { b = s(b, `>${person}<`, `>${escapeHtml(t(A.circles[i].label))}<`, { count: 1 }); b = swapImg(b, key, A.circles[i].image); });
  b = swapImg(b, '6943f43d1ea90943e43a09be_Rectangle', A.bigImage.src, { alt: t(A.bigImage.alt) });
  b = s(b, '>Our Story<', `>${t(A.storyTitle)}<`);
  b = setInner(b, '<div class="lx-about-rich-text w-richtext">', t(A.story).trim());
  ['Prioritize customers in everything you do.', 'Own your part, get things done.', 'Always do what’s right, and respect people.'].forEach((x, i) => { b = s(b, x, t(A.values[i]), { count: 1 }); });
  b = s(b, '>We want to work with you<', `>${t(A.startTitle)}<`);
  [['Product Design', 'Remote | Full Time'], ['Web Developer', 'NYC | Full Time'], ['Data Analyst', 'Chicago | Part Time'], ['UX Researcher', 'San Francisco | Contract'], ['Marketing Specialist', 'Remote | Full Time']]
    .forEach(([job, place], i) => { b = s(b, `<div>${job}</div>`, `<div>${t(A.starts[i].name)}</div>`, { count: 1 }); b = s(b, `>${place}<`, `>${t(A.starts[i].sub)}<`, { nth: 0 }); });
  b = s(b, '<a href="#" class="lx-careers_01-item w-inline-block">', '<a href="contact.html" class="lx-careers_01-item w-inline-block">', { count: 5 });
  b = b.replace(/alt="Lifelogx[^"]*"/g, 'alt=""');
  if (/Lifelogx|Lina Elsen|Amira|Mila Eron|Oren|Full Time|Part Time|Contract<|>Download</.test(b)) throw new Error('about: template copy survives');

  /* The page the owner asked for (2026-09-10): 「about页面也拿cinery模版替换成我们
     现有的about模版，仅改变文字」, with its composition chosen on 2026-09-15:
     「介绍带 + 项目网格 + 评价」.

     cinery ships no About page — only index.html and pricing.html — so the
     three blocks below are cut from its HOME page, which is where its
     introduction band, its work grid and its testimonial band live.

     The Lifelogx page above is still built, and deliberately: every assertion
     it makes about that template keeps running, so a donor re-cut fails here
     rather than silently in some later release. What it can no longer do is
     carry copy cinery has no slot for — `ABOUT.storyTitle`/`story`,
     `ABOUT.values` and `ABOUT.startTitle`/`starts` are drawn by none of the
     three blocks. That is a real content loss, the owner has been told which
     entries it costs, and they stay in copy.mjs so the swap destroys nothing
     and putting them back is one block away. */
  void b;
  const aboutBody = [
    renderBlock('cn-about', lang),
    renderBlock('cn-about-projects', lang),
    renderBlock('cn-about-reviews', lang),
  ].join('\n');

  const aboutSheets = [...new Set(Object.values(DONORS).map((d) => d.sheet))]
    .filter((f) => existsSync(`${SITE}/css/${f}`));
  let out = inMonoShell(aboutBody + bigMark(), [...aboutSheets, 'donor-fonts.css', 'lifelogx.lx.css', 'stargo-fusion.css'])
    .replace('<body ', '<body class="stargo-dark-page" ')
    .replace('</body>', '<script src="js/stargo-video-defer.js" defer></script><script src="js/capability-blocks.js" defer></script>');

  /* The projects band is four of cinery's own case-study clips — the owner
     asked for them back on 2026-09-15 (「恢复原模版」) after a still-image
     version. They are `<video autoplay loop muted playsinline>` with no
     `preload`, so a browser takes the first playable source and starts it while
     the page is still parsing: measured, 4 posters + 4 mp4 = 4,193,766 bytes
     fetched before the reader has scrolled anywhere near the band, on a page
     that previously fetched almost nothing.

     This is the same mechanism the capability page already uses for cinery's
     27-card break band, applied here for the same reason. It changes no
     element, class, interaction id, poster or frame — the clips are the
     template's clips, drawn exactly as the template draws them; the url simply
     waits in `data-src` until js/stargo-video-defer.js restores it as the band
     comes near. One line to delete if the owner would rather they load at
     once. */
  {
    const sources = (out.match(/<source /g) ?? []).length;
    out = out.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, (v) => (v.includes('<source ') ? v
      .replace('<video', '<video data-defer')
      .replace(/\spreload="[^"]*"/, ' preload="none"')
      .replace(/(<source[^>]*?)\ssrc=/g, '$1 data-src=') : v));
    if (sources && !(out.match(/<source[^>]* data-src=/g) ?? []).length) {
      throw new Error('about: the projects clips were not deferred');
    }

    /* Deferring `<source src>` alone did NOT work here, and the measurement
       said so: with only that in place the live page still fetched 5.66 MB of
       video before the reader had scrolled, and the DOM showed four sources
       deferred and four live. The four live ones were put back by Webflow's
       own `w-background-video` runtime, which reads the wrapper's
       `data-video-urls` on init and sets a source itself — so the component
       re-added exactly what the build had just taken away.

       Renaming the attribute is what actually stops it: the runtime looks for
       `data-video-urls`, finds nothing, and leaves the element alone, so the
       `<video>` plays from its own two `<source>` children — which are the ones
       js/stargo-video-defer.js restores when the band comes near. The clips,
       their posters, the box, its classes and the hover are all untouched; the
       only thing that changes is who decides when the file is fetched.

       The poster attribute is deliberately left alone: the four posters are
       138,816 bytes in total and they are what the reader sees until the clip
       arrives. */
    const wrappers = (out.match(/\sdata-video-urls=/g) ?? []).length;
    out = out.replace(/\sdata-video-urls=/g, ' data-defer-video-urls=');
    if (wrappers && (out.match(/\sdata-video-urls=/g) ?? []).length) {
      throw new Error('about: a data-video-urls survived, Webflow will fetch the clip eagerly');
    }
  }
  return out;
};

/* ---- blog.html — lifelogx blog index ------------------------------------ */
const LX_CARD = { image: 'lx-blog-image', title: 'lx-blog-title', description: 'lx-blog-description', sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw' };
PAGES['blog.html'] = (lang) => {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const { fn: s } = makeSub('blog');
  let b = frag('lx-blog.html');
  /* The hero (V5 P09): the headline, then the one sentence that says what these
     articles are for.

     The headline breaks after its comma on the Chinese page, and only there.
     Chinese headings are balanced (css/stargo-fusion.css, `text-wrap: balance`
     on `.lx-scope .lx-heading-style-h1`), and balance treats every character
     as a break point: it evened this one into 「把 AI 放进真实业」/「务，看懂每一步。」
     at every width from 390 to 1920, splitting 业务 across the lines. The break
     keeps the two clauses whole. Where the first clause is wider than the
     measure (≤479, at 2.7rem) balance still evens that clause alone — 「把 AI
     放进」/「真实业务，」 over 「看懂每一步。」 — so no width splits a word. The
     English heading has spaces to break at and gets no <br>; its balance rule
     is the V6-G block in css/stargo-fusion.css.

     The paragraph is the template's own description pair — the
     `.lx-feature-description-holder` > `.lx-text-size-regular` that the
     Lifelogx about hero puts under its <h1> (tools/fragments/lx-about.html) —
     placed inside `.lx-blog-title-big`, which is already a centred column. Its
     spacing is the V6-G rule in css/stargo-fusion.css. One element, no new
     class of type, and the card grid below is untouched. */
  const heading = escapeHtml(t(BLOG_UI.heading));
  const headingHtml = lang === 'zh' ? heading.replace('，', '，<br/>') : heading;
  if (lang === 'zh' && (headingHtml.match(/<br\/>/g) ?? []).length !== 1) {
    throw new Error('blog: the Chinese heading must carry exactly one full-width comma to break after');
  }
  b = s(b, '>Discover Our Featured Stories</h1></div>', `>${headingHtml}</h1><div class="lx-feature-description-holder stargo-blog-intro"><div class="lx-text-size-regular">${escapeHtml(t(BLOG_UI.intro))}</div></div></div>`, { count: 1 });
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
  /* The page the owner asked for (2026-09-10): 「定价页面要重新做，现在这个模版和
     我们的主题不太搭，拿cinery模版和RENOK的模版来变成我们的」— cinery's styling
     as the page's voice, renok's tier grid as its structure, and cinery's
     review composition to close it.

     Scalora's own hero and plan cards are what that replaces, so they are no
     longer in the body. The code above still builds them, and deliberately:
     every assertion it makes about Scalora's markup keeps running, so the day
     that template changes shape the build says so here rather than in some
     later release where the cards are wanted again. `cta` and `faq` stay on the
     page — they are this site's own words (ten real questions and answers),
     not the template's, and the owner asked for a new pricing page, not a
     shorter one.

     Order is the owner's own reading order, image by image: the cinery header
     (图一), renok's toggle and five tier cards (图三), renok's comparison table
     (图四), cinery's all-features card (图二), then the reviews (图五). */
  const scPart = (() => {
    let sc = [cta, faq].join('\n');
    sc = localise(scClasses(sc));
    sc = sc.replace(/alt="(Pricing Card Icon|Check Icon|Close Icon|Arrow Dowen)"/g, 'alt=""');
    if (/Scalora|\$\d/.test(sc)) throw new Error('pricing: template copy or dollar price survives');
    return `<div class="sc-scope sc-page">\n${sc}\n</div>`;
  })();

  const body = [
    renderBlock('cn-price-hero', lang),
    renderBlock('rk-price-tiers', lang),
    renderBlock('rk-price-compare', lang),
    renderBlock('cn-price-card', lang),
    renderBlock('cn-reviews', lang),
    scPart,
  ].join('\n');

  /* Every donor sheet, the way the capability page does it, so adding a block
     to this page never means remembering to link its styles — that is exactly
     how the first cinery blocks shipped unstyled. js/capability-blocks.js is
     the concatenation of every tools/blocks/<id>.js; cn-reviews ships one, so
     this page needs it. */
  const donorSheets = [...new Set(Object.values(DONORS).map((d) => d.sheet))]
    .filter((f) => existsSync(`${SITE}/css/${f}`));
  return inMonoShell(body, [...donorSheets, 'donor-fonts.css', 'scalora-modules.sc.css', 'stargo-fusion.css'])
    .replace('<body ', '<body class="stargo-dark-page stargo-pricing-lx" ')
    .replace('</body>', '<script src="js/stargo-pricing.js"></script><script src="js/capability-blocks.js" defer></script></body>');
};

/* ---- enterprise.html — Mono studio ------------------------------------ */
/* Pictures by what sits beside them (V6 §8.2, §10). All are the site's own
   concept illustrations; editorialImages() gives each its alt and marks it as
   one. The three pictures in the column beside the text sit, in order, next
   to the owner cockpit (work lanes converging on one command centre), the six
   delivery steps (a track climbing level by level — the second slot is the
   tallest, about square at 1440, so a portrait picture loses less to the
   cover crop than a landscape one) and the numbers — roles, controls and the
   deployment options (one track joining separate workspaces). The five
   cards, in order: capabilities and apps (instruments laid out on one board),
   account and role permissions (specialized roles on a shared foundation),
   approvals (a controlled, reversible approval path), work and result
   records (business records linked together) and account connection and
   protection (a gated passage through explicit boundaries). No picture is
   used twice on the page, the four hero panels included (their pictures are
   CSS, in the V6-F block of stargo-fusion.css). The legacy UI mock-ups with
   invented figures are not used here. */
PAGES['enterprise.html'] = (lang) => fromStudio({
  name: 'enterprise', ...C.ENTERPRISE, cards: C.ENTERPRISE.cards,
  images: { work: [OS.cockpit, BRAND.tall, OS.desktop], quote: BRAND.square, cards: [OS.agents, MOBILE.phoneAgents, MOBILE.phoneApprovals, BRAND.ontology, OS.login] },
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
  /* The donor drops straight from the page intro into four photographs with a
     caption each, so the band did not say what it was — the owner asked for a
     heading that frames them as the four areas the groups below sit in. The
     title names both counts as Chinese numerals, so assert them here: a
     fifteenth group or a fifth area must fail the build, not ship a wrong
     number. Written with the page's own classes (.top-text, .h2, .spacer-*). */
  if (K.macro.length !== 4 || C.CAPABILITY_GROUPS.length !== 14) {
    throw new Error(`capabilities: macroTitle says four areas and fourteen groups; data has ${K.macro.length} and ${C.CAPABILITY_GROUPS.length}`);
  }
  {
    const WORK_MAIN = '<div class="work-main">';
    if (!h.includes(WORK_MAIN)) throw new Error('capabilities: .work-main not found for the macro heading');
    h = h.replace(WORK_MAIN, `<div class="macro-intro"><p class="top-text">${escapeHtml(t(K.macroCaption))}</p><h2 class="h2">${escapeHtml(t(K.macroTitle))}</h2><p class="top-text big">${escapeHtml(t(K.macroLede))}</p></div><div class="spacer-m"></div>${WORK_MAIN}`);
  }

  /* Each pair sits alone in the card panel's `.copy-flex` row. Each area's
     one-line description (V5 P02) follows that row inside the card's glass
     panel: without it the four cards named an area and a number and nothing
     about the work. `.macro-desc` exists on this page only and is styled in
     css/stargo-fusion.css (V6-A block); the homepage's cards share the panel
     rules and are untouched. */
  const years = h.match(/<div class="copy-flex"><h3 class="work-title">\d\d<\/h3><h3 class="work-title">©<\/h3><\/div>/g);
  if (!years || years.length !== 4) throw new Error('capabilities: expected 4 year pairs, each alone in its .copy-flex row');
  years.forEach((y, i) => {
    if (!K.macro[i].desc) throw new Error(`capabilities: area ${i + 1} has no description`);
    h = h.replace(y, `<div class="copy-flex"><h3 class="work-title">${K.macro[i].groups.length}</h3><h3 class="work-title">${t(K.unit)}</h3></div>` +
      `<p class="macro-desc">${escapeHtml(t(K.macro[i].desc))}</p>`);
  });

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


/* capabilityShowcase() builds the page's opening hero as well as the map; the
   page builder puts it where Mono's inner hero used to be. */
/**
 * 一个外贸闭环 — the nine stages, as the review drew them.
 *
 * Three template blocks in a row, each with its own imagery and motion kept:
 * renok's "Award winning /Studio" heading carries the section title, qubix's
 * orbit hero carries the intro with the nine stage words rolling through its
 * tag list, and renok's insight list carries the nine stages themselves.
 */
function loopSection(C, lang) {
  return `<div id="loop"></div>` + renderBlock('rk-award', lang) + renderBlock('qx-orbit', lang) + renderBlock('rk-insight', lang);
}

let showcaseHero = '';

/**
 * The Capability map.
 *
 * Ten blocks carry the story, each one a lumenis service card lifted whole by
 * tools/lumenis-prepare.mjs: a numbered heading, a paragraph, sub-items that
 * expand on click while their plus rotates, a closing line with a button, and a
 * full-height image beside it. Six are business outcomes, four are the
 * foundations they share. Beneath them the fourteen capability groups sit on
 * cinery's accordion (tools/cinery-prepare.mjs) as the complete catalogue.
 *
 * Both donors keep their own motion — Webflow IX2, merged into js/app.fused.js —
 * and their own styles, scoped under `.lm-capmap` and `.cn-capmap`. Only the
 * words and the images are ours; the images are this site's own editorial
 * artwork, one chosen for what each block is about.
 *
 * Every capability a block names is resolved against CAPABILITY_GROUPS and
 * printed with the register's own gloss, so the narrative cannot drift from the
 * catalogue and a renamed capability fails the build instead of disappearing.
 */
function capabilityShowcase(C, lang) {
  const t = (v) => (typeof v === 'string' ? v : v[lang]);
  const S = C.CAPABILITY_SHOWCASE;

  const cnFrag = readFileSync(`${SITE}/tools/fragments/cn-capmap.html`, 'utf8');

  /* ---- the chapters, each on the block the review's screenshot named ----

     The review went through the page section by section and pasted a screenshot
     of the template block each one should be. That mapping is this list; the
     screenshots are in F:/stargo 网站/.docx/word/media. A block knows how to
     fill itself (tools/blocks/<id>.mjs); here we only put them in order and hang
     the anchors the nav and the floating pill jump to. */
  /* `#atlas` used to hang on the first chapter, so every "complete catalogue"
     link on the page landed on the prospecting opener instead of the
     catalogue. It now sits on the catalogue section itself (below); this
     chapter is reached as #story-1, the zero-size anchor in front of it. */
  const CHAPTERS = [
    { id: 'cn-service' },                         // 找到买家 heading + 01 (image9, image11)
    { id: 'qx-news', anchor: 'story-2' },         // 02 把对话变成理解 (image13)
    { id: 'rk-stats', anchor: 'story-3' },        // 03 报价 (image15)
    /* image17 (the break: a small circle in a white band) and image18 (the cards
       over the marquee) are two frames of ONE renok section, its circular mask
       growing with scroll. The testimonials block is that whole section, so it
       is the break as well; a separate break block played it twice. */
    { id: 'rk-testimonials', anchor: 'story-4' }, // 04 订单, opened by the break (image17 → image18)
    { id: 'cn-faq', anchor: 'story-5' },          // 05 内容 (image20)
    { id: 'cn-produce' },                         // break (image21)
    { id: 'qx-projects', anchor: 'story-6' },     // 06 AI 团队 (image23)
    { id: 'qx-whatwedo', anchor: 'foundations' }, // 四个基础板块 (image28)
  ];
  const chapters = CHAPTERS.map(({ id, anchor }) => {
    const html = renderBlock(id, lang);
    if (!anchor) return html;
    if (!html.startsWith('<div class="')) throw new Error(`capabilities: ${id} did not come back wrapped in its scope`);
    return html.replace('<div class="', `<div id="${anchor}" class="`);
  }).join('');

  /* ---- the catalogue keeps cinery's accordion ---- */
  const rowTpl = cnFrag.slice(cnFrag.indexOf('<!-- row -->') + 12).trim();
  const catRow = (id, title, body) => rowTpl
    /* The row binds to cinery's accordion interaction by the donor's own node
       id: the cn-faq block on this page carries the same interaction under that
       id (tools/donor-lib.mjs keeps donor ids), and one event drives both. */
    .replace('<div data-w-id="cn-capmap-row"', `<div id="${id}" data-w-id="e9dfc491-ce9f-1abc-547e-929be71d3026"`)
    .replace(/<h2 class="cn-accordion-heading">[\s\S]*?<\/h2>/, `<h2 class="cn-accordion-heading">${escapeHtml(title)}</h2>`)
    .replace(/<div class="cn-accordion-content-block">[\s\S]*?<\/div><\/div><\/div>$/, `<div class="cn-accordion-content-block">${body}</div></div></div>`);
  /* Each group opens onto what it does before what it lists (V6 §5.8):
     its public one-line summary, then the V5 detail — per topic a lede, the
     detail items, the value / boundary line, the business outputs and that
     topic's availability note — and only then the register entries as the
     index. Everything stays inside the donor's answer block, which IX2 opens
     to its natural height, so a longer answer is never clipped; with no
     script at all the answers simply stand open.

     The donor answer is a <p>, and a list or a table cannot sit inside one,
     so the detail is its own block of <p>, <ul>, <table> and <h3> elements.
     Each of them, sub-headings and table included, carries the class the
     donor styles and animates (`cn-accordion-answer-text`): the row's hover
     interaction slides every element with that class sideways, and a block
     without it would be left behind. A list carries it on its items and a
     table on itself, never on a child as well, or that child would slide
     twice. cn-lede / cn-out / cn-note were reserved for this in
     css/stargo-fusion.css, and the V6-C rules there space the rest. */
  const TEXT = 'cn-accordion-answer-text';
  const L = C.CATALOGUE_LABELS;
  const DETAIL = C.CATALOGUE_DETAIL;
  {
    const groups = C.CAPABILITY_GROUPS.map((g) => g.n);
    const missing = groups.filter((n) => !DETAIL[n]);
    const extra = Object.keys(DETAIL).filter((n) => !groups.includes(n));
    if (missing.length || extra.length) {
      throw new Error(`capabilities: catalogue detail must match the groups (missing ${missing.join(',') || '-'}, unknown ${extra.join(',') || '-'})`);
    }
    /* Every V5 detail item the catalogue carries, exactly once: a topic
       moved between groups must not vanish from both or print twice. */
    const seen = Object.values(DETAIL).flatMap((d) => d.parts.flatMap((p) => p.points.map((x) => x.id)));
    const count = (id) => seen.filter((x) => x === id).length;
    const wrong = C.CATALOGUE_V5_ITEMS.filter((id) => count(id) !== 1);
    if (wrong.length) throw new Error(`capabilities: V5 items not placed exactly once in the catalogue: ${wrong.map((id) => `${id}×${count(id)}`).join(', ')}`);
    /* M02–M16 each have a home in at least one group (M01 is the homepage's). */
    const topics = new Set(Object.values(DETAIL).flatMap((d) => d.sources));
    const unplaced = Array.from({ length: 15 }, (_, i) => `M${String(i + 2).padStart(2, '0')}`).filter((m) => !topics.has(m));
    if (unplaced.length) throw new Error(`capabilities: V5 topics with no catalogue group: ${unplaced.join(', ')}`);
    for (const [n, d] of Object.entries(DETAIL)) {
      if (!d.summary || !d.parts.length) throw new Error(`capabilities: g${n} detail needs a summary and at least one part`);
      d.parts.forEach((p, i) => {
        if (!p.points.length) throw new Error(`capabilities: g${n} part ${i + 1} has no detail items`);
        if (d.parts.length > 1 && !p.heading) throw new Error(`capabilities: g${n} has several parts, so part ${i + 1} needs a sub-heading`);
      });
    }
  }
  /* The ten role groups add up to the 288 the sub-heading states — V6 §6.2,
     and the figure is a directory size, which the part's own availability
     note says. A changed count fails here instead of shipping a wrong sum. */
  for (const p of Object.values(DETAIL).flatMap((d) => d.parts)) {
    if (!p.roles) continue;
    const sum = p.roles.rows.reduce((n, [, k]) => n + k, 0);
    if (p.roles.rows.length !== 10 || sum !== p.roles.total) {
      throw new Error(`capabilities: role table has ${p.roles.rows.length} groups summing to ${sum}, expected 10 summing to ${p.roles.total}`);
    }
    for (const l of ['zh', 'en']) {
      if (!p.heading[l].includes(String(p.roles.total))) throw new Error(`capabilities: the role table's heading (${l}) must state ${p.roles.total}`);
    }
  }
  const txt = (v) => escapeHtml(t(v));
  const roleTable = (r) =>
    `<table class="${TEXT} cn-cat-table"><caption>${txt(r.caption)}</caption>` +
    `<thead><tr><th scope="col">${txt(r.head[0])}</th><th scope="col">${txt(r.head[1])}</th></tr></thead><tbody>` +
    r.rows.map(([name, k]) => `<tr><th scope="row">${txt(name)}</th><td>${k}</td></tr>`).join('') +
    `</tbody><tfoot><tr><th scope="row">${txt(r.sum)}</th><td>${r.total}</td></tr></tfoot></table>`;
  const part = (p) => [
    p.heading ? `<h3 class="${TEXT} cn-cat-sub">${txt(p.heading)}</h3>` : '',
    p.lede ? `<p class="${TEXT} cn-cat-lede">${txt(p.lede)}</p>` : '',
    p.roles ? roleTable(p.roles) : '',
    `<ul class="cn-cat-points">${p.points.map((x) =>
      `<li class="${TEXT}"><strong>${txt(x.title)}</strong> ${txt(x.text)}</li>`).join('')}</ul>`,
    p.value ? `<p class="${TEXT} cn-cat-value">${txt(p.value)}</p>` : '',
    p.outputs ? `<p class="${TEXT} cn-out"><strong>${txt(L.outputs)}</strong> ${txt(p.outputs)}</p>` : '',
    p.availability ? `<p class="${TEXT} cn-note"><strong>${txt(L.availability)}</strong> ${txt(p.availability)}</p>` : '',
  ].join('');
  const detail = (n) => `<div class="cn-cat-detail">` +
    `<p class="${TEXT} cn-lede">${txt(DETAIL[n].summary)}</p>` +
    DETAIL[n].parts.map(part).join('') + `</div>`;

  const catalogue = C.CAPABILITY_GROUPS.map((g) => catRow(`g${g.n}`, `${g.n} ${t(g.name)}`,
    detail(g.n) +
    `<h3 class="${TEXT} cn-cat-sub cn-cat-index">${txt(L.register)}</h3>` +
    g.items.map(([name, gloss, zhName]) =>
      `<p class="${TEXT}"><strong>${capTitle(lang)(name, zhName)}</strong> ${escapeHtml(t(gloss))}</p>`).join('')));
  /* Nothing that carries the class may sit inside another element that
     carries it (it would slide twice), and every text block of the answer
     must carry it (or it would not slide at all). */
  for (const row of catalogue) {
    const block = row.slice(row.indexOf('<div class="cn-accordion-content-block">'));
    if (/<(?:ul|caption|div)\b[^>]*class="[^"]*cn-accordion-answer-text/.test(block)) {
      throw new Error('capabilities: a catalogue container carries cn-accordion-answer-text as well as its children');
    }
    const loose = block.match(/<(?:p|h3|table|li)\b(?![^>]*cn-accordion-answer-text)[^>]*>/g);
    if (loose) throw new Error(`capabilities: catalogue blocks without cn-accordion-answer-text: ${loose.slice(0, 3).join(' ')}`);
  }

  /* The band states the register's size and what that size means: groups and
     entries in the register, not a count of live features (V6 §5.8). */
  const total = C.CAPABILITY_GROUPS.reduce((n, g) => n + g.items.length, 0);
  const count = L.count(C.CAPABILITY_GROUPS.length, total);
  if (!t(count.size).includes(String(total))) throw new Error('capabilities: the band count must state the register total');
  const band = (label, note) =>
    `<div class="cn-band"><div class="cn-band-label">${escapeHtml(label)}</div>` +
    `<div class="cn-band-note">${escapeHtml(note)} <span class="cn-band-count">` +
    `<span>${txt(count.size)}</span>${lang === 'zh' ? '' : ' '}<span>${txt(count.meaning)}</span></span></div></div>`;

  showcaseHero = renderBlock('rk-hero', lang);

  /* #story-1 (the floating pill) is a zero-size anchor in front of the first
     chapter. #atlas — the hero button, the stage rows and every "complete
     catalogue" link — is the catalogue section.

     js/stargo-catalogue.js opens a group when the address names it
     (capabilities.html#g08, from another page or a link on this one) through
     the row's own IX2 click, and keeps a click inside an open answer from
     closing it. It is attached here, beside the markup it drives, rather
     than in the page's script list; `defer` runs it after the parse like the
     page's other deferred scripts, and chrome.mjs versions and relocates its
     src like any other. */
  return `<span id="story-1"></span>` + chapters +
    `<section id="atlas" class="cn-capmap"><div class="cn-capmap-inner">` +
    band(t(S.catalogueLabel), t(S.catalogueNote)) +
    `<div class="cn-faq-container">${catalogue.join('')}</div>` +
    `</div></section><script src="js/stargo-catalogue.js" defer></script>`;
}

  const rows = C.CAPABILITY_GROUPS.flatMap((g) => g.items.map(([item, gloss], i) => [
    i === 0 ? `<span id="g${g.n}">${g.n} · ${escapeHtml(t(g.name))}</span>` : '',
    escapeHtml(item),
    escapeHtml(t(gloss)),
  ]));
  const table = capabilityShowcase(C, lang);
  const anchor = '<div data-w-id="f7fb6f0b-16b8-25a9-4160-54883563ff75" class="rounder-wrapper">';
  if (!h.includes(anchor)) throw new Error('capabilities: insertion anchor missing');
  // The nine-stage loop sits above the capability map: business mainline first, then the 14 groups.
  const loop = loopSection(C, lang);
  h = h.replace(anchor, `${loop}\n${table}\n${anchor}`);
  /* renok's hero opens the page in place of Mono's inner hero, as the review asked. */
  {
    /* Its black ground would swallow the nav, which is drawn in the page's own
       black. The nav scrolls away with the hero, so whitening it here costs
       the light sections below nothing. */
    if (!h.includes('<body>')) throw new Error('capabilities: body tag not where the dark-nav class goes');
    h = h.replace('<body>', '<body class="stargo-dark-nav">');
    const inner = findByClass(h, 'div', 'for-inner', 0);
    if (!inner) throw new Error('capabilities: Mono inner hero not found');
    if (!showcaseHero) throw new Error('capabilities: the showcase hero was not built');
    h = h.slice(0, inner.start) + showcaseHero + h.slice(inner.end);
  }
  {
    // the transplanted cinery block brings its own scoped stylesheet
    const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
    if (!monoLink.test(h)) throw new Error('capabilities: Mono stylesheet link not found');
    /* One sheet per donor, taken from the donor table rather than listed here,
       so adding a block never means remembering to link its styles — that is
       exactly how the new cinery blocks first rendered unstyled. `cinery.cn.css`
       is the older sheet for the catalogue accordion, which still comes from its
       own prepare script. */
    const sheets = [...new Set([...Object.values(DONORS).map((d) => d.sheet), 'cinery.cn.css'])]
      .filter((f) => existsSync(`${SITE}/css/${f}`))
      .map((f) => `<link href="css/${f}" rel="stylesheet" type="text/css"/>`)
      .join('\n');
    /* chrome.mjs attaches css/stargo-fusion.css after the last stylesheet on the
       page, so the donor sheets added here still load before the overrides. */
    h = h.replace(monoLink, (m) => `${m}\n${sheets}\n<link href="css/donor-fonts.css" rel="stylesheet" type="text/css"/>`);
    /* A donor block's video is fetched only once the reader is near it. cinery's
       break band is 27 `<video autoplay preload="metadata">` cards — 32 MB on
       first paint, before anyone has scrolled to them. Holding the url in
       `data-src` until js/stargo-video-defer.js restores it changes no element,
       class, interaction id or poster: the band is the template's band, it just
       does not arrive before the page does. */
    {
      const sources = (h.match(/<source /g) ?? []).length;
      h = h.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, (v) => (v.includes('<source ') ? v
        .replace('<video', '<video data-defer')
        .replace(/\spreload="[^"]*"/, ' preload="none"')
        .replace(/(<source[^>]*?)\ssrc=/g, '$1 data-src=') : v));
      if (sources && !(h.match(/<source[^>]* data-src=/g) ?? []).length) {
        throw new Error('capabilities: video sources were not deferred');
      }
    }

    /* Hand-written block behaviour (tools/blocks/<id>.js), after the Webflow bundle.
       At this point the page still carries Mono's own bundle name; chrome.mjs
       renames it to app.fused.js later, and the tags added here follow it. */
    const bundleTag = /(<script src="js\/app\.[0-9a-f]{8}\.[0-9a-f]{16}\.js"[^>]*><\/script>)/;
    if (!bundleTag.test(h)) throw new Error('capabilities: page bundle script tag not found');
    h = h.replace(bundleTag, '$1<script src="js/stargo-video-defer.js" defer></script><script src="js/capability-blocks.js" defer></script>');
  }
  // Assign by buyer meaning, not image sequence: growth, customer context,
  // commercial fulfillment, workforce/governance. Parallel-team art belongs
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
  /* V5 P07's question. The class is a hook for the V6-G balance rule in
     css/stargo-fusion.css: unbalanced, the English question left "first?" on a
     line of its own at 320, 390 and 1024. `h1.inner-title` is shared by other
     pages, so the rule is scoped to this one heading rather than to the class. */
  h = s(h, '<h1 class="inner-title">Let’s Connect</h1>', `<h1 class="inner-title stargo-contact-title">${t(K.h1)}</h1>`, { count: 1 });
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
  // V5 P07's nine interest labels instead of the template's three options
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

  /* The form column the owner asked for (2026-09-10): 「联系页面也拿cinery模版来
     改但我要保留原网站如图6的这个」, settled on 2026-09-15 as B2 — keep this
     page's own two columns and its quote card, and swap ONLY the right-hand
     form for cinery's card.

     So everything above still runs: Mono's form is built, its fields filled,
     its honeypot added and every assertion it makes kept — and then the whole
     `.w-form` element it lives in is replaced by tools/blocks/cn-contact.mjs,
     which renders exactly that shape (one `.w-form` root, the form, then
     `.w-form-done` and `.w-form-fail` as siblings after it). The block carries
     this site's own ten fields and every hook js/stargo-forms.js and
     functions/api/contact.js read; what it takes from cinery is the card.

     Scoped through `.form-amin` because `w-form` is Webflow's own class and
     the page carries more than one. */
  {
    const col = findByClass(h, 'div', 'form-amin');
    const card = findByClass(col.text, 'div', 'w-form');
    if (!card.text.includes('stargo-hp')) throw new Error('contact: the .w-form inside .form-amin is not the one holding the form');
    const rebuilt = col.text.slice(0, card.start) + renderBlock('cn-contact', lang) + col.text.slice(card.end);
    h = h.slice(0, col.start) + rebuilt + h.slice(col.end);
  }
  /* The block's styles. This page does not go through inMonoShell — it is the
     Mono contact template returned whole — so the donor sheets the other pages
     get there have to be linked here, after Mono's own. Without this the
     cinery card renders with Mono's default form styling and nothing says so:
     measured before this line existed, the card's background computed
     `rgba(0,0,0,0)` and the fields were Mono's white inputs. That is the same
     silent failure the first cinery blocks shipped with, and it is silent
     precisely because an unstyled form still submits. */
  {
    const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
    if (!monoLink.test(h)) throw new Error('contact: Mono stylesheet link not found, cannot attach the donor sheets');
    const sheets = [...new Set(Object.values(DONORS).map((d) => d.sheet))]
      .filter((f) => existsSync(`${SITE}/css/${f}`))
      .concat('donor-fonts.css')
      .map((f) => `<link href="css/${f}" rel="stylesheet" type="text/css"/>`)
      .join('\n');
    h = h.replace(monoLink, (m) => `${m}\n${sheets}`);
    if (!h.includes(`css/${DONORS.cinery.sheet}`)) throw new Error('contact: the cinery sheet did not attach; the form card would be unstyled');
  }

  /* The quote card is the other column and is untouched — 「图6」 is why B2 was
     chosen over replacing the page. Assert it survived the splice. */
  if (!/<video id="[^"]+-video"/.test(h)) throw new Error('contact: the quote card lost its portrait film in the swap');
  /* Not the number of forms on the page — the Mono shell carries a second one
     in its footer — but the number that reach this site's endpoint. Exactly
     one form may post to /api/contact, and it must be the one that came out of
     the block with its honeypot. */
  if ((h.match(/action="\/api\/contact"/g) ?? []).length !== 1) {
    throw new Error(`contact: expected exactly one form posting to /api/contact, found ${(h.match(/action="\/api\/contact"/g) ?? []).length}`);
  }
  if ((h.match(/name="website"/g) ?? []).length !== 1) throw new Error('contact: expected exactly one honeypot after the swap');

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
