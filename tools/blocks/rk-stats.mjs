/**
 * 03 — 报价有依据，利润有边界，文件有版本 / Ground the price. Review the margin.
 * Keep the version. (V5 M04, V6 §5.4)
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
 * does not license is inventing a metric. The reels used to carry catalogue
 * counts (10 / 12 / 157), which beside a quotation heading still read like
 * results; V6 §5.4 asks for the band to explain the work instead, so they now
 * land on 01 / 02 / 03 — the three steps of the quotation sequence (draft,
 * check and approve, keep the approved version) named in the labels under
 * them. Two digits are exactly the donor's two columns, so nothing is cloned
 * and a-37 runs as shipped.
 *
 * Columns repeat: a three-digit figure would get a third `.rt-counter` cloned
 * from the first. a-37 addresses its targets by selector under `useEventTarget:
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
  const { C, lang, t, escapeHtml, art } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const n = 2;                                     // story 03, quotations
  const story = S.stories[n];
  if (!story) throw new Error('rk-stats: CAPABILITY_SHOWCASE.stories has no third outcome');
  const Q = C.CAP_V6A?.quote;
  if (!Q?.steps || !Q.image || !Q.button?.href || !Q.facts?.href) throw new Error('rk-stats: CAP_V6A.quote needs steps, image, button and facts');
  for (const k of ['promise', 'connection', 'availability']) {
    if (!story[k]) throw new Error(`rk-stats: story 3 has no ${k} — the quotation paragraph must say it`);
  }

  /* Every capability this story names is resolved against the register, both
     because the block must not drift from the catalogue and because the groups
     it links to below are derived from them rather than asserted here: the
     button goes to the group the picks sit in (07), the product-facts pointer
     to the story's other group (06). */
  const groups = story.picks.map((name) => capability(C, name).group);
  const home = groups[0];
  if (groups.some((g) => g !== home)) throw new Error('rk-stats: story 3 no longer sits in one capability group');
  if (!story.groups?.includes(home.n)) throw new Error(`rk-stats: group ${home.n} is not among the story's own groups`);
  const otherN = story.groups.find((g) => g !== home.n);
  if (!C.CAPABILITY_GROUPS.some((g) => g.n === otherN)) throw new Error(`rk-stats: the story's second group ${otherN} is not in CAPABILITY_GROUPS`);
  if (Q.button.href !== `#g${home.n}`) throw new Error(`rk-stats: the button should open #g${home.n}, CAP_V6A.quote says ${Q.button.href}`);
  if (Q.facts.href !== `#g${otherN}`) throw new Error(`rk-stats: the product-facts pointer should open #g${otherN}, CAP_V6A.quote says ${Q.facts.href}`);

  /* Three steps, three labels, in the order the donor draws them. The reels
     land on 01 / 02 / 03 — step numbers, not results (see the note at the top
     of this file). Each label is the step's name and nothing else because the
     slot is one line of 24px type, 296px wide at 1440 and 163px at 768, which
     renok fills with "Project completed": a label that wraps grows the band
     and pushed the photograph off the top of its row when it was tried. */
  if (Q.steps.length !== 3) throw new Error(`rk-stats: renok draws three counters, CAP_V6A.quote has ${Q.steps.length} steps`);
  const figures = Q.steps.map((label, i) => [String(i + 1).padStart(2, '0'), t(label)]);

  let html = frag;

  /* ---- the reels ---- */
  const boxes = [];
  const open = /<div [^>]*class="rk-rt-counter-box"[^>]*>/g;
  let m;
  while ((m = open.exec(html))) boxes.push([m.index, divEnd(html, m.index, 'a counter box')]);
  if (boxes.length !== 3) throw new Error(`rk-stats: renok draws three counters, found ${boxes.length}`);
  for (let i = boxes.length - 1; i >= 0; i--) {
    const [a, b] = boxes[i];
    const value = figures[i][0];
    if (!/^\d\d$/.test(value)) throw new Error(`rk-stats: step ${value} is not the two digits the donor's two columns hold`);
    html = html.slice(0, a) + reel(html.slice(a, b), value) + html.slice(b);
  }

  /* ---- what each step is ---- */
  const label = '<div class="rk-rt-text-style-h4 rk-rt-text-color-black">';
  figures.forEach((f, i) => { html = fillNth(html, label, i, escapeHtml(f[1]), 'counter labels'); });

  /* ---- the words around them ---- */
  /* The display slot is the section's own number — the third showcase, whose
     anchor is #story-3. Latin digits, which is what this 150px face has. */
  html = setText(html, 'rk-rt-big-text', String(n + 1).padStart(2, '0'));
  /* V6's heading has three clauses — 报价有依据，利润有边界，文件有版本 — and a
     line break anywhere else splits a word (the h2 holds nine characters a line
     at 992 and eleven on a phone), so each clause is its own line: split after
     each comma in Chinese and after each full stop in English, joined by the
     `<br/>` renok's own display lines use. */
  const clauses = t(story.label).split(lang === 'zh' ? /(?<=，)/ : /(?<=\.)\s+/);
  if (clauses.length !== 3) throw new Error(`rk-stats: the heading should read as three clauses, found ${clauses.length}`);
  html = setText(html, 'rk-rt-text-style-h2', clauses.map((c) => escapeHtml(c)).join('<br/>'));
  /* The paragraph (V5 M04): how a quote is prepared and controlled, that
     approval, sending and receipt are three separate facts, what still depends
     on connected systems, and the scope note — then a pointer to where the
     product facts behind a price live (#g06). */
  const gap = lang === 'zh' ? '' : ' ';
  const para = [story.promise, story.connection, story.availability, S.scopeNote].map((p) => escapeHtml(t(p))).join(gap);
  html = setText(html, 'rk-rt-gap-off',
    `${para}${gap}${escapeHtml(t(Q.facts.lead))}${lang === 'zh' ? '' : ' '}<a class="rk-stats-link" href="${Q.facts.href}">${escapeHtml(t(Q.facts.label))}</a>${lang === 'zh' ? '。' : '.'}`);
  /* The button keeps two copies of its label, one rolling up behind the other,
     and opens this section's detail in the catalogue. */
  html = setTextAll(html, 'rk-rt-button-text', escapeHtml(t(Q.button.label)));

  /* ---- the picture ----
     renok's branding portrait (a visor and a raincoat) said nothing about
     quoting. It becomes this site's own editorial art for the section —
     precision parts aligned and checked — through the same src the rest of the
     page uses (tools/editorial-images.mjs then writes its variants, sizes and
     description). The <img> keeps its inline blur/scale and the wrapper its
     data-w-id, so renok's reveal plays exactly as before. */
  const IMG = /<img src="assets\/renok\/69848bf2fc68c14ed4c0e5a6_home-one-branding-identity\.webp"[^>]*>/;
  const img = IMG.exec(html);
  if (!img) throw new Error('rk-stats: renok\'s branding photograph is not where the donor put it');
  if ((html.match(/<img /g) ?? []).length !== 1) throw new Error('rk-stats: the band should hold one photograph');
  html = html.replace(IMG, img[0]
    .replace(/src="[^"]*"/, `src="${art(Q.image)}"`)
    .replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
    .replace('alt="Home-one-branding-identity"', `alt="${escapeHtml(t(story.label))}"`));
  if (html.includes('home-one-branding-identity')) throw new Error('rk-stats: a variant of renok\'s photograph survived the swap');

  /* ---- the word that lives in an attribute ---- */
  if (!html.includes('href="contact-two.html"')) throw new Error('rk-stats: href="contact-two.html" is not in the fragment');
  html = html.split('href="contact-two.html"').join(`href="${Q.button.href}"`);

  /* Fail loudly rather than ship a slot that quietly missed. */
  const donorWords = ['Awards', 'Creative solutions', 'Let&#x27;s talk', 'Project completed',
    'Client satisfaction', 'Years of experice', 'Osmo', 'Home-one', 'contact-two'];
  const left = donorWords.filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-stats: donor copy survived: ${left.join(', ')}`);

  return html;
}
