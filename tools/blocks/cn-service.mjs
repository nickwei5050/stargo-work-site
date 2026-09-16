/**
 * Growth OS 主动获客 — story-01 of the capability showcase (V6 §5.2).
 *
 * `<span id="story-1">` is an empty anchor in front of this block
 * (tools/build-site.mjs); the block itself is the whole Growth OS section: the
 * engine's name in the pill, 主动 / 获客 in the display heading, a lead that says
 * how thin evidence is treated and where approved prospects go, and V6's four
 * topics — company research, trade intelligence, reorder judgement, key
 * decision roles — as the four rows, with a button to the six-part detail in
 * the catalogue (#g02).
 *
 * Donor: cinery's "Video / Services" home section (index.html). It opens on a
 * gradient split heading — an eyebrow pill over two `.title-wrapper` lines, the
 * gradient painted with `background-clip:text` per line box — and then draws
 * four `.service-content-item` rows. Each row is a giant title that rolls on
 * hover (three stacked copies inside an `overflow:hidden` wrap), a short
 * `▶︎` kicker, a sentence, and a thumbnail that also crossfades one of four
 * full-bleed backgrounds sitting behind the whole section.
 *
 * Four rows is what the donor draws and four capabilities is what this story
 * leads with, so nothing is cloned here: the units are filled in place and each
 * keeps its own data-w-id, its `_0N` class and its inline transforms — the
 * roll, the crossfade and the scroll reveal are all bound to exactly those.
 *
 * The photographs were cinery's own — the clapperboard and the lenses in the
 * review screenshot. Since the V6 content (2026-09-16) each row's thumbnail and
 * crossfade background show this site's editorial art instead (ROW_ART below);
 * the <img> elements, their classes and their motion are the donor's. Each
 * title slot gets a short topic name (CAP_V6A.growth,
 * one language per page) and the type stays at the donor's 8vw nowrap wherever
 * that name fits it.
 *
 * The block paints no ground of its own: every word in it is white and only
 * cinery's `body { background-color: #000 }` stood behind it, so the ground is
 * declared in the donor config below and written onto `.cn-service`. The rest
 * of what <body> supplied — the typeface, the leading, the text colour — is
 * restated in tools/blocks/cn-service.css, together with the `#w-node-…` grid
 * placement Webflow keeps off the class list and the isolation the moved ground
 * needs so the four photographs still sit above it.
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

export const donor = {
  id: 'cn-service',
  donor: 'cinery',
  scope: '.cn-service',
  page: 'index.html',
  start: '<section class="section-home-service">',
  end: '<div class="service-image-opacity bottom-opacity"></div></div></div></div></section>',

  /* Only <body> painted this black, and the block is white type end to end.
     The two `.service-image-opacity` gradients fade to the same value, so the
     section still dissolves into its own ground at top and bottom. */
  ground: '#000',
};

/**
 * The four rows' pictures (V6 §5.2: a topic-matched picture in each existing
 * image position). cinery's own are film-set stock — a clapperboard, lenses —
 * and say nothing about finding customers, so each row's hover thumbnail and
 * its crossfade background take this site's own editorial art, in row order:
 * company research → trade signals carried to a customer's destination; trade
 * intelligence → an opportunity path through a port district; reorder
 * judgement → context assembling layer by layer; key decision roles → a key
 * decision held at an approval point. tools/editorial-images.mjs writes the
 * variants, sizes and descriptions for them.
 */
const ROW_ART = ['brand-family-01', 'os-sales-desk', 'os-loading', 'mobile-approvals'];

/** Swap one cinery photograph for editorial art, keeping every other attribute
 *  (class, data-w-id, inline transforms) exactly as the donor wrote it. */
function toArt(tag, src) {
  if (!/src="assets\/cinery\//.test(tag)) throw new Error(`cn-service: expected a cinery photograph, found ${tag.slice(0, 80)}`);
  return tag.replace(/src="[^"]*"/, `src="${src}"`).replace(/\s(?:srcset|sizes)="[^"]*"/g, '');
}

/** Every image in the cut carries this one alt string. */
const DONOR_ALT = 'alt="Image - Cinery Template"';
/** The donor's button goes to a page this site does not have. */
const DONOR_HREF = 'href="services.html"';

/**
 * Product names the Chinese page writes in Latin letters on purpose (the owner's
 * positioning: Growth OS and Sales Desk are the two engines). Everything else
 * Latin on the Chinese page is still a leak and still fails the build.
 */
const ZH_PRODUCT_NAMES = /Growth OS|Sales Desk/g;

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, art } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[0];
  if (!story) throw new Error('cn-service: CAPABILITY_SHOWCASE.stories has no entry 0');
  /* V6 §5.2: this block is the Growth OS section (#story-1 is the empty anchor
     in front of it). Its own words — the pill, the heading, the four rows'
     titles and lines, the detail link — are CAP_V6A.growth; the lead is the
     story's promise and connection, the note under it its output and
     availability. */
  const G = C.CAP_V6A?.growth;
  if (!G?.eyebrow || !G.headTop || !G.headBottom || !G.button?.href || !G.rows) {
    throw new Error('cn-service: CAP_V6A.growth needs eyebrow, headTop, headBottom, button and rows');
  }
  for (const k of ['promise', 'connection', 'output', 'availability']) {
    if (!story[k]) throw new Error(`cn-service: story 0 has no ${k} — the section must say it`);
  }
  /* The rows are the story's first four picks, and G.rows words exactly those
     four: a pick that changed without its row (or the other way round) fails
     here rather than printing a register name the section never meant. */
  const rowKeys = Object.keys(G.rows);
  if (rowKeys.length !== 4 || rowKeys.some((k, i) => k !== story.picks[i])) {
    throw new Error(`cn-service: CAP_V6A.growth.rows (${rowKeys.join(' / ')}) must be story 0's first four picks (${story.picks.slice(0, 4).join(' / ')})`);
  }

  /* ------------------------------------------------------------ the cut -- */

  /* Each row opens on its own interaction id, so match the shape, not an id. */
  const rows = [...frag.matchAll(/<div data-w-id="[^"]*" class="cn-service-content-item">/g)];
  if (rows.length !== 4) throw new Error(`cn-service: cinery draws four .service-content-item rows, found ${rows.length}`);
  if (story.picks.length < 4) throw new Error(`cn-service: the block holds four capabilities, story-01 picks ${story.picks.length}`);

  /* The crossfade backgrounds live after the last row; everything from there on
     is tail, closing tags included. */
  const WRAP = '<div class="cn-service-image-wrapper">';
  const wrapAt = frag.indexOf(WRAP);
  if (wrapAt < 0) throw new Error('cn-service: .service-image-wrapper is not in the cut — the crossfade backgrounds are missing');

  const head = frag.slice(0, rows[0].index);
  const units = rows.map((m, i) => frag.slice(m.index, rows[i + 1]?.index ?? wrapAt));
  const tail = frag.slice(wrapAt);

  /* -------------------------------------------------------- the opening -- */

  /* Two h2s carrying the same class, one per line box. The gradient is applied
     to each line separately and the SplitText targets the wrapper DIVs, so the
     two lines are filled where they stand rather than restructured into one. */
  const BOTTOM = 'cn-bottom-title';
  const splitAt = head.indexOf(BOTTOM);
  if (splitAt < 0) throw new Error('cn-service: .bottom-title is not in the cut — the split heading needs both lines');

  /* The heading slot is the donor's 10–12rem display pair, two characters a
     line in Chinese (see CAPABILITY_SHOWCASE.headlineTop for the 992px
     measurement) and one short word in English: 主动 / 获客, Find / Leads. The
     "Every" / "Job" pair it used to carry stays with the break band further
     down the page (cn-produce), which still prints it. */
  if (lang === 'zh' && [t(G.headTop), t(G.headBottom)].some((s) => [...s].length > 2)) {
    throw new Error('cn-service: a Chinese heading line holds two characters at most');
  }
  let open = setText(head.slice(0, splitAt), 'cn-heading-style-h2', escapeHtml(t(G.headTop)))
    + setText(head.slice(splitAt), 'cn-heading-style-h2', escapeHtml(t(G.headBottom)));

  /* cinery's pill holds two words ("OU SOLUTIONS", 81px) inside an
     `overflow: hidden` box set solid at `line-height: 1`, so it holds one short
     line and nothing more. It names the engine: Growth OS. */
  open = setText(open, 'cn-subtitle', escapeHtml(t(G.eyebrow)));

  /* The lead. cinery's opening has a heading and a button and no sentence, but
     V6 §5.2 requires two statements in readable text — evidence that is too
     thin is marked for checking rather than guessed, and approved prospects go
     to Sales Desk with their research — plus what the section produces and
     what it depends on. They go where the donor's button already sits: the
     `.content-item` cell, bottom-right beside the heading from 992 up and
     under it below that, as two paragraphs above the button. Written in the
     block's own description type (tools/blocks/cn-service.css, section 5). */
  const CELL = '<div id="w-node-_41c40c61-fc21-de03-d653-91a5d71e76a4-805165a1" class="cn-content-item">';
  if (!open.includes(CELL)) throw new Error('cn-service: the button cell (.content-item) is not where the donor put it');
  const gap = lang === 'zh' ? '' : ' ';
  open = open.replace(CELL, `${CELL}<p class="cn-service-lede">${escapeHtml(`${t(story.promise)}${gap}${t(story.connection)}`)}</p>` +
    `<p class="cn-service-lede cn-service-lede-note">${escapeHtml(`${t(story.output)}${gap}${t(story.availability)}`)}</p>`);

  /* A roll-over button: two copies of the word, kept in step. It opens the
     full six-part Growth OS detail in the catalogue (#g02), not the contact
     form: the page's contact doors are the break band and the closing section. */
  open = setTextAll(open, 'cn-button-text', escapeHtml(t(G.button.label)));

  if (!open.includes(DONOR_HREF)) throw new Error(`cn-service: the opening button no longer carries ${DONOR_HREF}`);
  if (!C.CAPABILITY_GROUPS.some((g) => `#g${g.n}` === G.button.href)) throw new Error(`cn-service: ${G.button.href} is not a catalogue group`);
  open = open.split(DONOR_HREF).join(`href="${G.button.href}"`);

  /* ----------------------------------------------------------- the rows -- */

  /* The one name each row is about — Chinese on the Chinese page, the product
     name on the English page — for the title and for the alt text of the row's
     two photographs. */
  const plain = [];

  /* Do the four rows agree on whether their names fit? Decided here, before any
     row is drawn, because the answer belongs to the block and not to a row: see
     the note at the `uniform` branch below. `cn-uniform-title` only has to cover
     992 and up — below that the donor hands the title the whole grid and all
     four names fit at its own size — so a split that appears only below 992
     would need a second treatment; assert rather than ship it silently. */
  const names = units.map((_, i) => {
    capability(C, story.picks[i]);   // still a register entry: a renamed pick fails the build
    return t(G.rows[story.picks[i]].title);
  });
  const len = (s) => (lang === 'zh' ? [...s].length : s.length);
  const wideFlags = names.map((s) => (lang === 'zh' ? len(s) >= 6 : len(s) >= 11));
  const narrowFlags = names.map((s) => (lang === 'zh' ? len(s) >= 9 : len(s) >= 15));
  const uniform = wideFlags.some(Boolean) && !wideFlags.every(Boolean);
  if (narrowFlags.some(Boolean) && !narrowFlags.every(Boolean)) {
    throw new Error(`cn-service: the rows disagree below 992 too (${names.join(' / ')}); cn-uniform-title only covers 992 and up`);
  }

  const filled = units.map((unit, i) => {
    const cap = capability(C, story.picks[i]);
    const row = G.rows[story.picks[i]];
    const title = names[i];
    plain.push(title);

    /* Every title begins with the donor's own bullet; it is copied out of the
       row rather than retyped, so the glyph and its class travel unchanged. */
    const icon = /<span class="cn-service-icon">[^<]*<\/span>/.exec(unit);
    if (!icon) throw new Error(`cn-service: row ${i + 1} has no .service-icon to lead its title`);

    /* Three copies of the title stack inside one `overflow:hidden` wrap and the
       hover rolls them past the viewport, so all three say the same thing —
       two white, the third grey. Write one and the hover shows the donor word.
       The slot is the donor's: 8vw, nowrap, uppercase. Only the words change. */
    let u = setTextAll(unit, 'cn-service-title', `${icon[0]} ${escapeHtml(title)}`);
    /* cinery draws one-word titles at 7rem, nowrap. A name that cannot fit the
       column at that size -- "BUYING COMMITTEE INTELLIGENCE", 进口商补货雷达 -- is
       set as two lines at half the size inside the same 7rem window, so the
       row keeps the donor's geometry and the three-copy hover roll (which moves
       by -200% of a copy's own height) still lands on a copy.
       The thresholds are measured against the donor's own column. At 1440 the
       `◉` and its space cost 127px of the 768px on offer, a Chinese name runs
       at the full 112px per character (6 characters = 799px, over) and an
       uppercase Latin name at about 63px (11 characters = 823px, over): that is
       where a name stops fitting the two-column band, and `cn-long-title-wide`
       halves it there and nowhere else. Below 992 the donor gives the title the
       whole grid — 350px at 10vw on a 390px phone — which still holds eight
       Chinese characters (345px) or fourteen Latin ones, so only a name past
       those takes `cn-long-title`, which is halved at every width. */
    const chars = lang === 'zh' ? [...title].length : title.length;
    const overWide = lang === 'zh' ? chars >= 6 : chars >= 11;
    const overNarrow = lang === 'zh' ? chars >= 9 : chars >= 15;
    /* Shrinking only the names that do not fit is right when it lands on every
       row and wrong when it lands on some: four rows at two sizes read as a
       mistake, and the owner reported it as one — "这里有一行字调整成统一大小".
       `uniform` (decided once for the block, above) is that case, and it takes
       every row to one size instead. The English page is unaffected: all four
       of its names are long, so its rows already agree. */
    if (uniform) u = u.replace(/class="cn-service-title-wrap/g, 'class="cn-service-title-wrap cn-uniform-title');
    else if (overWide) u = u.replace(/class="cn-service-title-wrap/g, `class="cn-service-title-wrap ${overNarrow ? 'cn-long-title' : 'cn-long-title-wide'}`);

    /* The kicker's `▶︎` is part of the donor's copy, not of its markup; keep the
       marker and its spacing exactly as drawn and change only the words after
       it. All four capabilities here are registered under one catalogue group,
       and naming it is what the kicker is for. */
    const sub = /class="[^"]*cn-service-subitle[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(unit);
    if (!sub) throw new Error(`cn-service: row ${i + 1} has no .service-subitle`);
    const marker = sub[1].replace(/[A-Za-z][\s\S]*$/, '');
    if (!marker.trim()) throw new Error(`cn-service: row ${i + 1} lost the ▶ marker its kicker is drawn with`);
    u = setText(u, 'cn-service-subitle', marker + escapeHtml(t(cap.group.name)));

    /* The row's line in this section's story (CAP_V6A.growth): what the
       research is for here, two of them carrying V6's required statements —
       unsupported demand is marked for checking, approved prospects go to
       Sales Desk. The kicker above still names the catalogue group the entry
       sits in, where the register's own wording is. */
    u = setText(u, 'cn-service-description', escapeHtml(t(row.text)));

    if (!u.includes(DONOR_ALT)) throw new Error(`cn-service: row ${i + 1} has no ${DONOR_ALT} to replace`);
    /* The row's thumbnail — its one <img> — becomes the row's editorial art. */
    const thumbs = u.match(/<img\b[^>]*>/g) ?? [];
    if (thumbs.length !== 1) throw new Error(`cn-service: row ${i + 1} should hold one thumbnail, found ${thumbs.length}`);
    u = u.replace(thumbs[0], toArt(thumbs[0], art(ROW_ART[i])));
    return u.split(DONOR_ALT).join(`alt="${escapeHtml(plain[i])}"`);
  });

  /* -------------------------------------------- the crossfade backgrounds -- */

  /* Four `.service-bg-image._0N`, one per row and in row order; each shows the
     same editorial art as its row's thumbnail. */
  let n = 0;
  const back = tail.replace(/<img\b[^>]*alt="Image - Cinery Template"[^>]*>/g, (tag) => {
    const i = n++;
    return toArt(tag, art(ROW_ART[i] ?? ROW_ART[0])).replace(DONOR_ALT, `alt="${escapeHtml(plain[i] ?? '')}"`);
  });
  if (n !== 4) throw new Error(`cn-service: expected four background images behind the rows, found ${n}`);
  if (/assets\/cinery\//.test(back)) throw new Error('cn-service: a cinery photograph survived behind the rows');

  const html = open + filled.join('') + back;
  if (html.includes('Cinery')) throw new Error('cn-service: donor copy survives in the rendered block');
  /* Latin words on the Chinese page are a leak — except the two engine names,
     which the Chinese copy writes as they are (ZH_PRODUCT_NAMES, and only
     those two strings, not the words in them). */
  if (lang === 'zh' && /[A-Za-z]{3,}/.test(html.replace(/<[^>]+>/g, ' ').replace(ZH_PRODUCT_NAMES, ' '))) {
    throw new Error('cn-service: Latin words on the Chinese page — only Growth OS and Sales Desk may appear in Latin letters');
  }
  return html;
}
