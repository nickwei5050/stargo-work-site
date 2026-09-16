/**
 * 一条业务主线 — the nine steps of HOME_LOOP_TABLE, as renok's insight list.
 *
 * Donor: renok's `.rt-insight` (index.html). Full-bleed rows between hairlines:
 * a number, a two-line description, a large title and an arrow, with a
 * thumbnail parked absolutely at the row's left edge. renok ships three rows and
 * this block needs nine, so the three are cloned in rotation — row 4 is row 1
 * again, row 5 is row 2 again — each clone keeping its `data-w-id`, its own
 * thumbnail and its own `.rt-image-N` / `.rt-line-N` pair.
 *
 * ---- how the thumbnails behave, because the review screenshot shows them ----
 *
 * Rows 1 and 3 carry a MOUSE_OVER/MOUSE_OUT pair (a-31/a-32, a-33/a-34); row 2
 * carries none. Both hover lists start from an initial group that puts
 * `.rt-image-one` / `.rt-image-three` at scale 0 and `.rt-image-two` at scale 1,
 * and draws `.rt-line-two` at 100% width. So at rest the middle row's picture
 * is the one showing, and hovering row 1 (or 3) swaps: its own picture grows
 * to 1, the middle row's shrinks to 0, and its own black line draws across the
 * bottom. The review screenshot is exactly that moment on row 01. renok's own
 * design is therefore "exactly one thumbnail on screen at a time".
 *
 * That is what the rotation broke, and what `hoverHooks` below repairs. The
 * steps that address a row's OWN picture and line carry
 * `useEventTarget: CHILDREN`, so a clone that shares a `data-w-id` animates its
 * own picture and nobody else's. The steps that address the middle row are bare
 * global selectors — `.rt-image-two`, `.rt-line-two`, no event target — because
 * in a three-row list there is only one middle row to address. Cloned to nine,
 * three rows answer that selector, so every hover lit and dimmed rows 2, 5 and 8
 * together and leaving row 1 brought all three back at once. The owner saw it:
 * "点击到第二栏的时候第五栏也会跟着显示，应该是一个接着一个显示".
 *
 * The repair is to leave exactly one row wearing the middle row's hooks, and to
 * re-hook the other two onto the FIRST row's pair — its `data-w-id`, its
 * `.rt-image-one` / `.rt-line-one` classes — so their hover drives their own
 * subtree through the CHILDREN-scoped steps. The bare selectors then match one
 * element again and renok's "one at a time" reading is restored across nine
 * rows. Nothing visual moves: `.rt-image-*` and `.rt-line-*` carry no
 * declarations anywhere in renok's stylesheet, they exist only as interaction
 * hooks, and the first row's entrance (e-156, slideInBottom) is byte-identical
 * to the middle row's (e-158) apart from its target. Every picture stays where
 * it was; nothing here hides or swaps a thumbnail.
 *
 * Copy: the description slot is `.rt-insights-text`, `max-width: 14.375rem`
 * (230px). renok fills it with one ~60-character sentence over two lines. The
 * rows' long `what happens` descriptions (rows[i][1]) run to 100–200 characters
 * and would stack six or eight lines in that box, so every row prints its
 * shorter `point` (rows[i][2]) instead — two lines in Chinese, two or three in
 * English, inside a row whose height the 100px title already sets.
 *
 * The title slot is `.rt-text-style-h1`, 7vw capped at 100px, `flex: 0 50.89%`
 * beside a 66px arrow. The register writes the stage words in capitals
 * ("04 · UNDERSTAND"); measured in the donor at 1280–1440px, UNDERSTAND in caps
 * is 645px and fills the column with the arrow pressed against its last letter.
 * renok's own titles are Title case ("Photography"), so the same words are set
 * the same way — "Understand" — and fit with the arrow where renok put it.
 */
import { setText } from '../block-lib.mjs';

export const donor = {
  id: 'rk-insight',
  donor: 'renok',
  scope: '.rk-insight',
  page: 'index.html',
  start: '<section class="rt-insight rt-overflow-hidden"><div class="rt-insights-main">',
  end: '<div class="rt-insights-item-line rt-line-three rt-tab-display-off"></div></a></div></section>',
  /* Every word in the block is `rt-text-color-black` and every hairline is
     black at 20%; the white they sit on was renok's `body`, which a cut section
     leaves behind (`.rt-insight` only paints itself white under 991px). */
  ground: '#fff',
};

/** How many rows renok draws; the stage list is laid over them in rotation. */
const DONOR_ROWS = 3;

/** The donor row whose hover list drives its own subtree (CHILDREN-scoped). */
const HOVER_ROW = 0;

/** The donor row addressed by bare selector — the picture showing at rest.
 *  Exactly one row in the built list may wear its hooks; see the header. */
const RESTING_ROW = 1;

/** The `.rt-image-N` / `.rt-line-N` pair a donor row's interactions address. */
function hooks(unit, which) {
  const image = /class="rk-rt-insights-item-image (rk-rt-image-\w+)/.exec(unit);
  const line = /class="rk-rt-insights-item-line (rk-rt-line-\w+)/.exec(unit);
  const id = /^<a data-w-id="([0-9a-f-]+)"/.exec(unit);
  if (!image || !line || !id) throw new Error(`rk-insight: donor row ${which} lost an interaction hook`);
  return { id: id[1], image: image[1], line: line[1] };
}

/** renok's own "not the first row" class, and the first-row class it replaces. */
const FIRST = 'rk-rt-top-border';
const NEXT = 'rk-rt-top-margin';

/** "UNDERSTAND" → "Understand", "FOLLOW-UP" → "Follow-up": renok sets its
    titles in Title case. */
const titleCase = (w) => w.charAt(0) + w.slice(1).toLowerCase();

export function render(frag, ctx) {
  const { C, t, lang, escapeHtml } = ctx;
  const L = C.HOME_LOOP_TABLE;
  if (!Array.isArray(L?.rows) || L.rows.length !== 9) {
    throw new Error(`rk-insight: HOME_LOOP_TABLE.rows should hold nine stages, found ${L?.rows?.length}`);
  }

  /* ------------------------------------------------------------ split ---- */
  const OPEN = '<a data-w-id="';
  const starts = [];
  for (let i = frag.indexOf(OPEN); i >= 0; i = frag.indexOf(OPEN, i + 1)) starts.push(i);
  if (starts.length !== DONOR_ROWS) throw new Error(`rk-insight: renok ships ${DONOR_ROWS} rows, found ${starts.length}`);
  const close = frag.lastIndexOf('</a>');
  if (close < starts[DONOR_ROWS - 1]) throw new Error('rk-insight: the last row never closes');
  const end = close + '</a>'.length;
  const head = frag.slice(0, starts[0]);
  const tail = frag.slice(end);
  if (!tail.startsWith('</div></section>')) throw new Error('rk-insight: the list no longer closes with its main div and section');
  const units = starts.map((at, i) => frag.slice(at, starts[i + 1] ?? end));

  /* Each template must carry the thumbnail and the line its hover list drives. */
  units.forEach((u, i) => {
    if (!/class="rk-rt-insights-item-image rk-rt-image-(one|two|three) rk-rt-tab-display-off"/.test(u)) {
      throw new Error(`rk-insight: donor row ${i + 1} lost its thumbnail wrapper`);
    }
    if (!/class="rk-rt-insights-item-line rk-rt-line-(one|two|three) rk-rt-tab-display-off"/.test(u)) {
      throw new Error(`rk-insight: donor row ${i + 1} lost its line`);
    }
  });
  if (!units[0].includes(`class="rk-rt-insights-item-wrapper ${FIRST} w-inline-block"`)) {
    throw new Error('rk-insight: the first donor row no longer carries rt-top-border');
  }

  const hoverHooks = hooks(units[HOVER_ROW], HOVER_ROW + 1);
  const restHooks = hooks(units[RESTING_ROW], RESTING_ROW + 1);

  /* --------------------------------------------------------------- rows --- */
  const groups = new Set(C.CAPABILITY_GROUPS.map((g) => g.n));
  const rows = L.rows.map((r, i) => {
    const [key, , point, group] = r;
    const [num, name] = key.split(' · ');
    /* One hyphen is allowed: V5 names the eighth step "Follow up". */
    if (!/^\d\d$/.test(num) || !/^[A-Z]+(-[A-Z]+)?$/.test(name ?? '')) throw new Error(`rk-insight: stage "${key}" is not "NN · NAME"`);
    if (!point) throw new Error(`rk-insight: stage ${key} has no point`);
    if (!groups.has(group)) throw new Error(`rk-insight: stage ${key} names catalogue group "${group}", which CAPABILITY_GROUPS does not have`);

    let row = units[i % DONOR_ROWS];

    /* renok gives only its first row a top hairline; every later row instead
       tucks itself -.5rem under the row above. A clone of row 1 that is not
       first takes the class renok gives its own non-first rows. */
    if (i >= DONOR_ROWS && row.includes(FIRST)) {
      row = row.replace(`class="rk-rt-insights-item-wrapper ${FIRST} w-inline-block"`, `class="rk-rt-insights-item-wrapper ${NEXT} w-inline-block"`);
    }

    /* Only one row may wear the hooks renok addresses by bare selector; the
       other clones of its template take the first row's, whose steps are
       CHILDREN-scoped and so animate the row they are hovered on. See the
       header for why, and what it fixes. */
    if (i !== RESTING_ROW && i % DONOR_ROWS === RESTING_ROW) {
      row = row.replace(/^(<a data-w-id=")[0-9a-f-]+/, `$1${hoverHooks.id}`)
        .replace(restHooks.image, hoverHooks.image)
        .replace(restHooks.line, hoverHooks.line);
      if (row.includes(restHooks.image) || row.includes(restHooks.line) || !row.startsWith(`<a data-w-id="${hoverHooks.id}"`)) {
        throw new Error(`rk-insight: row ${i + 1} could not be re-hooked onto the first row's hover pair`);
      }
    }

    /* The number: the first `.rt-text-color-black` in the row is the bare
       numeral div (the description and title carry a second class). */
    row = setText(row, 'rk-rt-text-color-black', escapeHtml(num));

    /* The description: `.rt-insights-text > div`. The inner div stays. */
    const DESC = /(<div class="rk-rt-insights-text"><div class="rk-rt-text-color-black">)([\s\S]*?)(<\/div><\/div>)/;
    if (!DESC.test(row)) throw new Error(`rk-insight: row ${i + 1} has no description slot`);
    row = row.replace(DESC, (m, a, inner, b) => `${a}${escapeHtml(t(point))}${b}`);

    /* The title: the stage word -- its Chinese name on the Chinese page (the
       page shows Chinese only), the register's word on the English page. */
    const zhName = C.HOME_LOOP_TABLE.stageNames?.[name];
    if (lang === 'zh' && !zhName) throw new Error(`rk-insight: stage ${name} has no Chinese name in HOME_LOOP_TABLE.stageNames`);
    row = setText(row, 'rk-rt-text-style-h1', escapeHtml(lang === 'zh' ? zhName : titleCase(name)));

    /* The row is a link to renok's service page; ours name steps whose
       capabilities are in the catalogue, so each goes to the one group that
       step belongs to (the row's fourth field) — discover and qualify to 02,
       engage to 03, understand and respond to 04, quote to 07, execute to 08,
       follow-up to 05, learn to 14 — rather than to the top of the catalogue.
       Every group row is a closed accordion whose heading names the group, so
       the jump lands on a visible, labelled row the reader opens. */
    if (!row.includes('href="service.html"')) throw new Error(`rk-insight: row ${i + 1} no longer links to the donor's service page`);
    row = row.replace('href="service.html"', `href="#g${group}"`);

    /* Both images are decoration beside a title that already names the stage:
       renok's own alts are its file names. */
    const alts = row.match(/alt="Home-one-[^"]*"/g) ?? [];
    if (alts.length !== 2) throw new Error(`rk-insight: row ${i + 1} should carry two donor image alts, found ${alts.length}`);
    row = row.replace(/alt="Home-one-[^"]*"/g, 'alt=""');

    return row;
  });

  const html = head + rows.join('') + tail;

  /* The bug this block shipped once: three rows answering a step that was
     written for one. Count them, so it cannot come back unnoticed. */
  for (const hook of [restHooks.image, restHooks.line]) {
    const n = html.split(hook).length - 1;
    if (n !== 1) throw new Error(`rk-insight: ${n} rows answer the bare \`.${hook}\` selector; exactly one may`);
  }

  /* Fail loudly rather than ship a slot that quietly missed. */
  const donorWords = ['Branding', 'Photography', 'Design', 'Insights reveal', 'Optimization improves',
    'Analytics track', 'Home-one', 'service.html'];
  const left = donorWords.filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-insight: donor copy survived: ${left.join(', ')}`);

  return html;
}
