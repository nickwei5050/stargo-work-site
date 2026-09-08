/**
 * 成果 03 — 在商务可控的前提下出报价 / Prepare quotations with commercial control.
 *
 * Donor: renok's statistics band. A display number and a heading on the left, a
 * photograph beside three odometer counters, and a closing paragraph under them.
 *
 * ---- how the counters actually work, because the digits are the mechanism ----
 *
 * Each `.rt-counter-box` is a 3.5rem window with `overflow:hidden` holding two
 * `.rt-counter` columns (each a stack of two five-digit `.rt-counter-train`
 * strips) and a suffix. Nothing counts: IX2 action list a-37 ("Counter Box",
 * `useFirstGroupAsInitialState`) slides the strips and the window crops one
 * digit out of each column.
 *
 *   group 1 (initial)  every `.rt-counter-train` → y 0%, then `.train-two` → -100%
 *   group 2 (3000ms)   every `.rt-counter-train` → y -100%, then `.train-two` → 0%
 *
 * A column's two strips sit one under the other, so in a plain column the first
 * strip fills the window at 0% and the SECOND strip fills it at -100%; in a
 * `.train-two` column it is the other way round. The number the reel lands on is
 * therefore the first cell of the second strip in a plain column and the first
 * cell of the first strip in a `.train-two` column — everything else is the blur
 * that scrolls past. Read against the donor's own three reels this predicts
 * 15k / 98% / 25+, which is exactly what renok publishes, so the model holds.
 *
 * That means a figure can be set truthfully without touching the mechanism: one
 * cell per column changes, the strips, the transforms and the ids stay. What it
 * does not license is inventing a metric, so the three reels carry the only
 * numbers this page can stand behind — arithmetic over CAPABILITY_GROUPS, which
 * the catalogue further down the same page lists item by item. A renamed
 * capability fails the build rather than quietly changing a published figure.
 *
 * Columns repeat: a three-digit figure gets a third `.rt-counter` cloned from
 * the first. a-37 addresses its targets by selector under `useEventTarget:
 * CHILDREN`, so a cloned column animates with the rest and carries no id of its
 * own (the only `data-w-id` in a counter is on the box).
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

export const donor = {
  id: 'rk-stats',
  donor: 'renok',
  scope: '.rk-stats',
  page: 'index.html',
  start: '<section class="rt-statistics rt-overflow-hidden"><div class="w-layout-blockcontainer rt-container-xl w-container">',
  end: '40 countries and millions of users worldwide.</p></div></div></div></div></section>',
  /* One photograph, shipped by Webflow as five responsive variants of one stem.
     It is renok's own (the visor portrait in the review screenshot) and it stays:
     `mirror` defaults to assets/renok and try-block fetches every variant. The
     brief is a perfect port with only the words changed, so no imageStems here. */
  /* Every word in this block is `rt-text-color-black`; the ground that made that
     legible was the donor's own white `body`, which does not travel with a cut
     section. Painted on the scope root so the band is readable wherever it is
     dropped — including beside the capability map, which is black. */
  ground: '#fff',
};

/* ----------------------------------------------------------- markup tools -- */

/** End index (exclusive) of the `<div>` element beginning at `start`. */
function divEnd(html, start, what) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { if (--depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  throw new Error(`rk-stats: ${what} is never closed`);
}

/** A `<div>` element split into its own tags and its direct children. */
function split(el, what) {
  const openEnd = el.indexOf('>') + 1;
  const closeAt = el.length - '</div>'.length;
  if (!el.startsWith('<div') || el.slice(closeAt) !== '</div>') throw new Error(`rk-stats: ${what} is not a div`);
  const kids = [];
  for (let i = openEnd; i < closeAt;) {
    if (el[i] !== '<') throw new Error(`rk-stats: loose text inside ${what}`);
    const end = divEnd(el, i, what);
    kids.push(el.slice(i, end));
    i = end;
  }
  return { open: el.slice(0, openEnd), kids, close: el.slice(closeAt) };
}

/** Replace the text of an element that holds nothing but text. */
function fill(el, text, what) {
  const m = /^(<div\b[^>]*>)([^<]*)(<\/div>)$/.exec(el);
  if (!m) throw new Error(`rk-stats: ${what} is not a plain text cell`);
  return `${m[1]}${text}${m[3]}`;
}

/** Replace the text of the n-th element opened by this exact tag. */
function fillNth(html, openTag, n, text, what) {
  const at = [];
  for (let i = html.indexOf(openTag); i >= 0; i = html.indexOf(openTag, i + 1)) at.push(i);
  if (at.length !== 3) throw new Error(`rk-stats: expected three ${what}, found ${at.length}`);
  const start = at[n];
  const end = html.indexOf('</div>', start);
  if (end < 0) throw new Error(`rk-stats: ${what} ${n} is never closed`);
  return html.slice(0, start + openTag.length) + text + html.slice(end);
}

/* ------------------------------------------------------------- the reels -- */

const TRAIN = '<div style=';                       // every strip carries its own transform
const PLAIN = 'class="rk-rt-counter-train"';
const TWO = 'class="rk-rt-counter-train rk-train-two"';

/**
 * Land one column on `digit`. `kind` says which strip fills the window when the
 * action list has finished: the second one in a plain column, the first in a
 * `.train-two` column (see the note at the top of this file).
 */
function land(col, kind, digit) {
  const c = split(col, 'counter column');
  if (c.kids.length !== 2) throw new Error(`rk-stats: a counter column holds two strips, found ${c.kids.length}`);
  const marker = kind === 'two' ? TWO : PLAIN;
  for (const k of c.kids) {
    if (!k.startsWith(TRAIN) || !k.includes(marker)) throw new Error(`rk-stats: a ${kind} strip is not where a-37 expects it`);
  }
  const idx = kind === 'two' ? 0 : 1;
  const train = split(c.kids[idx], 'digit strip');
  if (train.kids.length !== 5) throw new Error(`rk-stats: a digit strip holds five cells, found ${train.kids.length}`);
  train.kids[0] = fill(train.kids[0], digit, 'a digit cell');
  c.kids[idx] = train.open + train.kids.join('') + train.close;
  return c.open + c.kids.join('') + c.close;
}

/** Set one counter box to `value`, repeating a column when the figure is longer. */
function reel(box, value) {
  const b = split(box, 'counter box');
  if (b.kids.length !== 3) throw new Error(`rk-stats: a counter box holds two columns and a suffix, found ${b.kids.length}`);
  const [plain, two, suffix] = b.kids;
  if (!plain.includes(PLAIN) || !two.includes(TWO)) throw new Error('rk-stats: the counter columns are not the pair a-37 drives');
  const cols = [...String(value)].map((d, i) => (i % 2 ? land(two, 'two', d) : land(plain, 'plain', d)));
  /* The donor's suffixes are its own units (k, % and +). Ours are plain counts,
     so the cell stays — a-37 and the flex row expect three children — and empties. */
  return b.open + cols.join('') + fill(suffix, '', 'the counter suffix') + b.close;
}

/* --------------------------------------------------------------- render --- */

export function render(frag, ctx) {
  const { C, t, escapeHtml } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const n = 2;                                     // outcome 03, "quote with commercial control"
  const story = S.stories[n];
  if (!story) throw new Error('rk-stats: CAPABILITY_SHOWCASE.stories has no third outcome');

  /* Every capability this outcome names is resolved against the register, both
     because the block must not drift from the catalogue and because the group it
     labels below is derived from them rather than asserted here. */
  const groups = story.picks.map((name) => capability(C, name).group);
  const home = groups[0];
  if (groups.some((g) => g !== home)) throw new Error('rk-stats: outcome 03 no longer sits in one capability group');
  if (!story.groups?.includes(home.n)) throw new Error(`rk-stats: group ${home.n} is not among the outcome's own groups`);
  const otherN = story.groups.find((g) => g !== home.n);
  const other = C.CAPABILITY_GROUPS.find((g) => g.n === otherN);
  if (!other) throw new Error(`rk-stats: the outcome's second group ${otherN} is not in CAPABILITY_GROUPS`);
  const total = C.CAPABILITY_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  /* Three counts, three labels, in the order the donor draws them.

     Each label names, in the catalogue's own words, the set its figure counts,
     and carries the group number so the same group is not called "10" here and
     "07" in the accordion further down the page. It is the group's label and
     nothing else because the slot is one line of 24px type 296px wide, which
     renok fills with "Project completed" (184px): "07 Quote & Commercial"
     measures 239px and holds that line, while the earlier "capabilities in 07
     Quote & Commercial" measured 379px and wrapped every label onto two, which
     grew the band 138px past renok's and pushed the photograph off the top of
     its row. What the figures count is said once, in the sentence under them. */
  const inGroup = (g) => `${g.n} ${t(g.name)}`;
  const figures = [
    [home.items.length, inGroup(home)],
    [other.items.length, inGroup(other)],
    [total, t(S.catalogueLabel)],
  ];
  for (const [v] of figures) {
    if (!Number.isInteger(v) || v < 1 || v > 999) throw new Error(`rk-stats: ${v} does not fit a counter`);
  }

  let html = frag;

  /* ---- the reels ---- */
  const boxes = [];
  const open = /<div [^>]*class="rk-rt-counter-box"[^>]*>/g;
  let m;
  while ((m = open.exec(html))) boxes.push([m.index, divEnd(html, m.index, 'a counter box')]);
  if (boxes.length !== 3) throw new Error(`rk-stats: renok draws three counters, found ${boxes.length}`);
  for (let i = boxes.length - 1; i >= 0; i--) {
    const [a, b] = boxes[i];
    html = html.slice(0, a) + reel(html.slice(a, b), figures[i][0]) + html.slice(b);
  }

  /* ---- what each counter counts ---- */
  const label = '<div class="rk-rt-text-style-h4 rk-rt-text-color-black">';
  figures.forEach((f, i) => { html = fillNth(html, label, i, escapeHtml(f[1]), 'counter labels'); });

  /* ---- the words around them ---- */
  /* The display slot is the number the capability map already gives this
     outcome (its card reads 03 and its anchor is #story-3), so the band reads as
     that card enlarged. Latin digits, which is what this 150px face has. */
  html = setText(html, 'rk-rt-big-text', String(n + 1).padStart(2, '0'));
  html = setText(html, 'rk-rt-text-style-h2', escapeHtml(t(story.label)));
  /* The promise, then the scope note: a band of counts drawn from the register
     has to say that the register is what it is counting. */
  html = setText(html, 'rk-rt-gap-off', `${escapeHtml(t(story.promise))} ${escapeHtml(t(S.scopeNote))}`);
  /* The button keeps two copies of its label, one rolling up behind the other. */
  html = setTextAll(html, 'rk-rt-button-text', escapeHtml(t(S.cardButton)));

  /* ---- the two words that live in attributes ---- */
  for (const [from, to] of [
    ['href="contact-two.html"', 'href="contact.html"'],
    ['alt="Home-one-branding-identity"', `alt="${escapeHtml(t(story.label))}"`],
  ]) {
    if (!html.includes(from)) throw new Error(`rk-stats: ${from} is not in the fragment`);
    html = html.split(from).join(to);
  }

  /* Fail loudly rather than ship a slot that quietly missed. */
  const donorWords = ['Awards', 'Creative solutions', 'Let&#x27;s talk', 'Project completed',
    'Client satisfaction', 'Years of experice', 'Osmo', 'Home-one', 'contact-two'];
  const left = donorWords.filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-stats: donor copy survived: ${left.join(', ')}`);

  return html;
}
