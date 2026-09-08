/**
 * 能力图谱开篇 + 第一个成果 — the chapter opening and story-01 in one block.
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
 * The photographs are cinery's own — the clapperboard and the lenses in the
 * review screenshot. Nothing is mapped, so `mirror` (the default,
 * assets/cinery) keeps every thumbnail and every crossfade background and
 * try-block fetches them into place. The brief is a perfect port with only the
 * words changed, so each title slot gets the shortest name the register has —
 * the Chinese name on the Chinese page, the product name on the English page —
 * and the type stays at the donor's 8vw nowrap wherever that name fits it.
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

/** Every image in the cut carries this one alt string. */
const DONOR_ALT = 'alt="Image - Cinery Template"';
/** The donor's button goes to a page this site does not have. */
const DONOR_HREF = 'href="services.html"';

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[0];
  if (!story) throw new Error('cn-service: CAPABILITY_SHOWCASE.stories has no entry 0');

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

  let open = setText(head.slice(0, splitAt), 'cn-heading-style-h2', escapeHtml(t(S.headlineTop)))
    + setText(head.slice(splitAt), 'cn-heading-style-h2', escapeHtml(t(S.headlineBottom)));

  /* cinery's pill holds two words ("OU SOLUTIONS", 81px) inside an
     `overflow: hidden` box set solid at `line-height: 1`, so it holds one short
     line and nothing more. The chapter's own eyebrow is that line; the story's
     label is 350px of text and would need the pill rebuilt to carry it. */
  open = setText(open, 'cn-subtitle', escapeHtml(t(S.eyebrow)));

  /* A roll-over button: two copies of the word, kept in step. */
  open = setTextAll(open, 'cn-button-text', escapeHtml(t(S.cardButton)));

  if (!open.includes(DONOR_HREF)) throw new Error(`cn-service: the opening button no longer carries ${DONOR_HREF}`);
  open = open.split(DONOR_HREF).join('href="contact.html"');

  /* ----------------------------------------------------------- the rows -- */

  /* The one name each row is about — Chinese on the Chinese page, the product
     name on the English page — for the title and for the alt text of the row's
     two photographs. */
  const plain = [];

  const filled = units.map((unit, i) => {
    const cap = capability(C, story.picks[i]);
    const title = capTitle(cap.name, cap.zhName ?? '');
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
    if (overWide) u = u.replace(/class="cn-service-title-wrap/g, `class="cn-service-title-wrap ${overNarrow ? 'cn-long-title' : 'cn-long-title-wide'}`);

    /* The kicker's `▶︎` is part of the donor's copy, not of its markup; keep the
       marker and its spacing exactly as drawn and change only the words after
       it. All four capabilities here are registered under one catalogue group,
       and naming it is what the kicker is for. */
    const sub = /class="[^"]*cn-service-subitle[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(unit);
    if (!sub) throw new Error(`cn-service: row ${i + 1} has no .service-subitle`);
    const marker = sub[1].replace(/[A-Za-z][\s\S]*$/, '');
    if (!marker.trim()) throw new Error(`cn-service: row ${i + 1} lost the ▶ marker its kicker is drawn with`);
    u = setText(u, 'cn-service-subitle', marker + escapeHtml(t(cap.group.name)));

    /* The register's own gloss, so this page cannot describe a capability
       differently from the catalogue below it. */
    u = setText(u, 'cn-service-description', escapeHtml(t(cap.gloss)));

    if (!u.includes(DONOR_ALT)) throw new Error(`cn-service: row ${i + 1} has no ${DONOR_ALT} to replace`);
    return u.split(DONOR_ALT).join(`alt="${escapeHtml(plain[i])}"`);
  });

  /* -------------------------------------------- the crossfade backgrounds -- */

  /* Four `.service-bg-image._0N`, one per row and in row order. */
  let n = 0;
  const back = tail.replace(/alt="Image - Cinery Template"/g, () => `alt="${escapeHtml(plain[n++] ?? '')}"`);
  if (n !== 4) throw new Error(`cn-service: expected four background images behind the rows, found ${n}`);

  const html = open + filled.join('') + back;
  if (html.includes('Cinery')) throw new Error('cn-service: donor copy survives in the rendered block');
  if (lang === 'zh' && /[A-Za-z]{3,}/.test(html.replace(/<[^>]+>/g, ' '))) {
    throw new Error('cn-service: Latin words on the Chinese page — a capability without a zhName leaked its product name');
  }
  return html;
}
