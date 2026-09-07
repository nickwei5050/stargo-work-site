/**
 * 订单与全球贸易执行 — story 04, "coordinate an order through to delivery".
 *
 * Donor: renok's home portfolio showcase. A right-aligned h2 with a paragraph
 * and a roll-up pill button, then five staggered cards over four animated
 * vertical lines. Each card is an `<a>` whose photograph un-blurs and settles
 * out of a 2× scale on scroll, with a hover chip over the image, a vertical
 * rail beside it and a title and body line beneath.
 *
 * Five cards is what the donor draws and five capabilities is what this story
 * puts on them, so nothing is cloned: the units are filled where they stand and
 * every data-w-id, inline transform and class travels untouched — the export
 * ships the images at `filter:blur(5px)` and `scale3d(2,2,1)` and only the
 * transplanted interaction brings them back.
 *
 * The donor's rail read "Year / 2025". Years beside a fulfilment story would be
 * read as delivery dates, so it carries the register reference instead: the
 * catalogue label over `08 · 01`, the group these five capabilities are
 * registered under and their place in this set. Each card links to that group's
 * row in the catalogue (`#g08`), which is the anchor build-site gives it.
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

export const donor = {
  id: 'rk-portfolio',
  donor: 'renok',
  scope: '.rk-portfolio',
  page: 'index.html',
  start: '<section class="rt-home-v1-protfolio rt-position-relative rt-overflow-hidden">',
  end: '-two"></div><div class="rt-bg-line-animation-line rt-two rt-second"></div></div></div></section>',
  /* The section paints `background-color: var(--black)` itself, so it needs no
     wrapper and no `ground` — unlike renok's hero, which was only black because
     of its parent.

     One stem per card: Webflow ships each photograph five times across src and
     srcset, and a stem replaces the whole family. This site's own editorial art,
     chosen for what each card is about — the loading dock for the order itself,
     the staged track for payment milestones, the metrology bench for production
     and QC, the packing bench for the invoice and packing list, the port at
     dusk for origin and export papers. */
  imageStems: {
    'home-one-Heroic-Silhouette-Glow': 'assets/stargo-editorial/os-trade-execution.webp',
    'home-one-Holographic-Phone': 'assets/stargo-editorial/brand-loop.webp',
    'home-one-Ethereal-Light': 'assets/stargo-editorial/os-quote-studio.webp',
    'home-one-Tennis-Ball': 'assets/stargo-editorial/brand-family-02.webp',
    'home-one-Transparent-Digital-Clock': 'assets/stargo-editorial/brand-family-01.webp',
  },
};

/** Replace one attribute's value on the block's `<img>`, loudly. */
function setAttr(unit, attr, value, where) {
  const re = new RegExp(` ${attr}="[^"]*"`);
  if (!re.test(unit)) throw new Error(`rk-portfolio: no ${attr}= on the image of ${where}`);
  return unit.replace(re, ` ${attr}="${value}"`);
}

export function render(frag, ctx) {
  const { C, t, escapeHtml, capTitle, lang } = ctx;
  const S = C.CAPABILITY_SHOWCASE;

  /* Story 04 of six: the order, its milestones and its paperwork. */
  const story = S.stories[3];
  if (!story) throw new Error('rk-portfolio: CAPABILITY_SHOWCASE.stories has no fourth outcome');

  /* Five cards, so the first five of the outcome's seven picks. Every one is
     resolved against the register, so a rename fails the build rather than
     leaving the donor's project names on the page. */
  const CARDS = 5;
  const picks = story.picks.slice(0, CARDS).map((name) => capability(C, name));
  if (picks.length !== CARDS) throw new Error(`rk-portfolio: the row holds ${CARDS}, the story offers ${story.picks.length}`);
  const group = picks[0].group;
  for (const p of picks) {
    if (p.group !== group) throw new Error(`rk-portfolio: "${p.name}" is in group ${p.group.n}, not ${group.n}; the rail names one group`);
  }
  if (group.n !== story.groups[0]) throw new Error(`rk-portfolio: story 04 names group ${story.groups[0]} but its picks are registered under ${group.n}`);

  /* ------------------------------------------------------------- head ---- */
  /* The heading, right-aligned in the donor's own `rt-gap-off rt-change-align`. */
  let out = setText(frag, 'rk-rt-change-align', escapeHtml(t(story.label)));

  /* The paragraph beside it carries no class of its own — it is addressed by
     the interaction id that fades it up, which is also the only handle it has. */
  const PARA = /(<div data-w-id="3a03ca6e-d43b-5200-d8f3-a8a42d045c77" style="opacity:0">)[\s\S]*?(<\/div>)/;
  if (!PARA.test(out)) throw new Error('rk-portfolio: the paragraph under the heading is not where its interaction id was');
  out = out.replace(PARA, (m, open, close) => `${open}${escapeHtml(t(story.promise))}${close}`);

  /* The pill keeps two identical copies of its label, one rolling up as the
     other rolls in; write both or the hover shows the donor's word. */
  out = setTextAll(out, 'rk-rt-button-text', escapeHtml(t(S.cardButton)));
  const BTN = 'href="portfolio-three.html"';
  if (!out.includes(BTN)) throw new Error('rk-portfolio: the pill button no longer points at portfolio-three.html');
  out = out.replace(BTN, 'href="contact.html"');

  /* ------------------------------------------------------------ cards ---- */
  const MARK = 'class="rk-rt-home-v1-protfolio-item w-inline-block">';
  const spans = [];
  for (let i = out.indexOf(MARK); i >= 0; i = out.indexOf(MARK, i + 1)) {
    const start = out.lastIndexOf('<a ', i);
    const end = out.indexOf('</a>', i);
    if (start < 0 || end < 0) throw new Error('rk-portfolio: a portfolio card is not a closed <a> element');
    spans.push([start, end + 4]);
  }
  if (spans.length !== CARDS) throw new Error(`rk-portfolio: renok ships ${CARDS} cards, found ${spans.length}`);

  const RAIL = /(<div class="rk-rt-portfolio-date-wrapper"><div class="[^"]*rk-rt-change-writing-mode">)[^<]*(<\/div><div class="[^"]*rk-rt-change-writing-mode">)[^<]*(<\/div>)/;
  const BODY = /(<div class="rk-rt-home-v1-protfolio-text"><div>)[\s\S]*?(<\/div>)/;
  const CHIP = '<div>See details</div>';

  const filled = picks.map((cap, i) => {
    const nth = String(i + 1).padStart(2, '0');
    const where = `card ${nth} (${cap.name})`;
    let unit = out.slice(spans[i][0], spans[i][1]);

    /* Into the catalogue row for this capability's register group. */
    const HREF = /href="[^"]*"/;
    if (!HREF.test(unit)) throw new Error(`rk-portfolio: no href on ${where}`);
    unit = unit.replace(HREF, `href="#g${group.n}"`);

    /* The extraction already put this site's artwork in src and srcset; the
       srcset it leaves is the same file five times, so it is rewritten to the
       widths this repository actually ships for that picture. The inline style
       that holds the image blurred and doubled until the interaction runs is
       left exactly as it is. */
    const src = /src="(assets\/stargo-editorial\/([a-z0-9-]+)\.webp)"/.exec(unit);
    if (!src) throw new Error(`rk-portfolio: ${where} still carries the donor's photograph — map its stem in donor.imageStems`);
    const stem = `assets/stargo-editorial/${src[2]}`;
    unit = setAttr(unit, 'srcset', `${stem}-400.webp 400w, ${stem}-800.webp 800w, ${stem}-1200.webp 1200w`, where);
    unit = setAttr(unit, 'alt', escapeHtml(lang === 'zh' ? cap.zhName : cap.name), where);

    /* The chip revealed over the photograph. It is drawn 5.25rem wide, so it
       takes the shortest name this site has for where the link goes. */
    if (!unit.includes(CHIP)) throw new Error(`rk-portfolio: the hover chip is missing from ${where}`);
    unit = unit.replace(CHIP, `<div>${escapeHtml(t(C.CAPABILITIES.h1))}</div>`);

    /* The vertical rail: the catalogue label over the group this capability is
       registered in.

       It used to print `${group.n} · ${nth}` — but `nth` is the card's position
       in THIS block, not the capability's position in the register, so four of
       the five rails pointed at a different capability than the card was about.
       A reference a reader can follow to the catalogue below has to be one the
       catalogue agrees with, so the rail now carries only the group, which is
       the part that is true. */
    if (!RAIL.test(unit)) throw new Error(`rk-portfolio: the vertical rail is missing from ${where}`);
    unit = unit.replace(RAIL, (m, a, b, c) =>
      `${a}${escapeHtml(t(S.inCatalogue))}${b}${escapeHtml(String(group.n))}${c}`);

    /* Title: the capability, Chinese-first on the Chinese page. */
    unit = setText(unit, 'rk-rt-text-style-h3', capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? '')));

    /* Body: the register's own gloss, so the card cannot drift from the
       catalogue it links to. */
    if (!BODY.test(unit)) throw new Error(`rk-portfolio: the body line is missing from ${where}`);
    return unit.replace(BODY, (m, open, close) => `${open}${escapeHtml(t(cap.gloss))}${close}`);
  });

  let html = '';
  let cursor = 0;
  spans.forEach(([start, end], i) => {
    html += out.slice(cursor, start) + filled[i];
    cursor = end;
  });
  return html + out.slice(cursor);
}
