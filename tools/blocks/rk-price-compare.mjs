/**
 * 方案对比 — renok's feature-comparison chart, carrying this site's five levels.
 *
 * WHAT THIS BLOCK USED TO BE, AND WHY IT IS NOT THAT ANY MORE
 *   It used to cut `<div class="rt-monthly-wrapper">` out of renok's index.html.
 *   That is the pricing *card* grid — the very wrapper tools/blocks/rk-price-
 *   tiers.mjs already builds from — so pricing.html drew the five tier cards
 *   twice, one set under the other, and renok's own Monthly/Annual toggle
 *   (rk-e-1700 → rk-a-35, whose targets are `.rt-monthly-wrapper` and
 *   `.rt-yearly-wrapper` BY CLASS) showed and hid both of them at once.
 *   index.html has no comparison table in it at all: "Per month", the words the
 *   owner's 图四 shows under every plan's price, do not occur in that file.
 *
 *   They occur in tools/templates/renok/pricing.html, in
 *   `<section class="rt-pricing-v1-list rt-background-black">` — renok's real
 *   chart, and the section tools/build-site.mjs:866 names in the owner's own
 *   reading order ("renok's comparison table (图四)"). That is what is cut here,
 *   and cutting it also ends the collision above: nothing in this block is
 *   inside a `.rt-monthly-wrapper` any more, so the toggle in the band above
 *   can no longer reach it.
 *
 * WHAT THE DONOR SHIPS
 *   `.rt-pricing-chart` holds ten `.rt-pricing-chart-rows`, each one a grid of
 *   `1.2fr 1fr 1fr 1fr 1fr` (renok.app.shared.b851cf614.css:5213) with a
 *   .0625rem rule under it:
 *
 *     row 0     an empty left cell (`#w-node-…532ba3`) and four
 *               `.rt-chart-top-tag`s, each a plan name in `.rt-text-style-h6` —
 *               Free / Basic plan / Standard plan / Premium plan.
 *     row 1     `.rt-chart-left-col` carrying "Features" in `.rt-text-style-h5`,
 *               then four `.rt-chart-columns.rt-chart-col-1`, each holding a
 *               `.rt-pricing-chart-price` of `<h2 class="rt-gap-off">$0</h2>`
 *               over an unclassed `<div>Per month</div>` — $0/$99/$149/$199.
 *     rows 2-9  one feature each: `.rt-chart-left-col` > `.rt-features-point` >
 *               the words in `.rt-text-color-premium-grey`, then four
 *               `.rt-chart-columns`, each holding either a 17×14 tick
 *               (…_pricing-check.svg) or a 22×3 dash
 *               (…_pricing-three-line.svg).
 *
 *   Every row carries its own `data-w-id` and its own SCROLL_INTO_VIEW event —
 *   e-1526→a-24 (100ms delay), e-1517→a-25 (200), e-1531→a-28 (300),
 *   e-1522→a-93 (400), e-1516 and e-1524→a-89 (500), e-1530→a-94 (600),
 *   e-1533→a-90 (800), e-1515→a-92 (900), e-1520→a-91 (1000) — a staggered
 *   slide-up-and-unblur, with e-1521→a-25 on the chart itself. Every one of
 *   those action lists moves `useEventTarget: true`, the event element itself,
 *   so rows emitted from the same donor unit reveal independently and a repeated
 *   `data-w-id` is safe, exactly as tools/blocks/README.md says. That is why the
 *   feature rows below are re-used in renok's own order (`i % DONOR_ROWS`)
 *   rather than one unit being cloned: the donor's stagger repeats instead of
 *   flattening onto a single delay.
 *
 * FIVE PLAN COLUMNS OUT OF FOUR
 *   PRICING.panes holds six entries. Five are levels — 标准版 ¥10,000 / 年,
 *   上线版 ¥20,000, 增长版 ¥30,000, 全球获客版 ¥40,000 (those three priced for the
 *   first year) and 企业版 at 定制 — and the sixth, 从一条流程开始, is the demo
 *   invitation (`unit: 'demo'`), not a level; it is filtered out exactly as
 *   tools/blocks/rk-price-tiers.mjs filters it, and the count is asserted.
 *   splitRepeat() cuts the donor's four header tags, its four price cells and
 *   each row's four tick cells out of the fragment, and five of each are emitted
 *   from those units — the fifth is donor unit 0 again. Nothing is hand-written,
 *   and the units are asserted identical apart from the one text node each
 *   carries (see `assertClones`), so re-using one is exact.
 *
 *   renok's chart has no promoted-column treatment — no pill, no accent, no
 *   second class list — so `featured`, which two of our levels carry, is not
 *   drawn here. The band above (rk-price-tiers) already badges them; inventing
 *   an emphasis this donor does not draw would be restyling, not porting.
 *
 *   Five plan columns need a sixth track. That is placement, it is the one rule
 *   in the donor that counts renok's plans rather than describing them, and it
 *   is restated — with the measurements that justify it, and only from 768px up —
 *   in tools/blocks/rk-price-compare.css. Nothing about how a single column is
 *   drawn changes.
 *
 * WHAT A CELL SAYS, AND WHY IT IS NOT ALWAYS A TICK (owner's decision,
 * 2026-09-15 — 「走 A 方案」)
 *   This chart used to draw a tick or a dash in every cell, reading one row per
 *   distinct line of the levels' `items`. That MISREPRESENTED this site's
 *   pricing. The items are per-level prose carrying different NUMBERS —
 *   「官网 3 个核心页面」 in 上线版 against 「官网 4 个核心页面」 in 增长版 — so two
 *   sentences about the same capability became two rows, and a tick matrix
 *   turned "a bigger number" into "does not have it": the ¥30,000 level read as
 *   lacking what the ¥20,000 level has, and 企业版, the dearest, carried a dash
 *   on every row in the chart.
 *
 *   So the cells carry VALUES, out of the numbers PRICING already states.
 *   PRICING.compareMatrix is where they live, one row per capability:
 *
 *     valueRows   官网核心页面 / SKU 模板页 / 官网语种 / SKU 图片内容 /
 *                 实拍短视频 / AI 视频. Each cell holds `v` (the words drawn in
 *                 the cell) and `from` (the exact fragment of that level's own
 *                 items sentence they come out of), or 'custom' for a level the
 *                 declared `customScope` rule covers, or null for a capability
 *                 that is not part of that level at all.
 *     tickRows    the lines that really are yes-or-no, each one the exact
 *                 sentence a level states it in. WHICH levels tick is not in the
 *                 matrix and is never hand-written: it is derived here, out of
 *                 the level's own `items` and PRICING.inherits — see below.
 *
 * TWO DEFECTS FIXED ON 2026-09-15, BOTH OF THEM OWNER'S DECISIONS
 *
 *   THE LADDER USED TO INVERT — 「包含 —— 高档位全部继承」. A tick row was derived
 *   by matching its sentence against each level's own `items`, and a higher
 *   level states only what it ADDS: it never restates what it already carries,
 *   because a price list that repeated every lower line would be unreadable. So
 *   the chart printed a dash wherever a level was merely SILENT, and silence
 *   read as absence. Confirmed in the built page: 上线版's own line 「基础站内
 *   SEO、一年域名与托管、最多 3 轮修改」 ticked one column and dashed four, so
 *   ¥30,000 增长版 and ¥40,000 全球获客版 read as having no domain, no hosting and
 *   no SEO that ¥20,000 上线版 has — while 增长版 ticked the SEO row immediately
 *   under it. One tier, two opposite verdicts, on the same page.
 *
 *   The answer is NOT a looser sentence match here — "nearly the same line" is a
 *   guess, and the next person cannot read a guess back. What a level contains
 *   is a fact about the product and the owner's to state, so it is stated, as
 *   data, in PRICING.inherits: one { level, from } step per pair, composing into
 *   标准版 → 上线版 → 增长版 → 全球获客版. `ladder()` below follows those steps and
 *   does nothing else, and 企业版, which PRICING declares no inclusion for,
 *   inherits nothing.
 *
 *   企业版's 定制 USED TO BE A BACK DOOR — 「写「定制」—— 它本来就是全定制」. On the
 *   six value rows that column prints 定制 / Custom, and the check behind it read
 *   the level's `price` and stopped: it was the one path in the matrix never
 *   checked against the level's own `items`, so the file's own rule — where a
 *   level's items are silent, nothing is invented — was not true of the code.
 *   The value stays, because the level really is scoped per company, and it is
 *   made legitimate instead: PRICING.compareMatrix.customScope declares, as a
 *   test rather than a name, that a level whose `unit` is 'none' and whose price
 *   is 定制 is scoped individually and therefore reads its own price on every
 *   value row. The branch below now accepts a 定制 cell BECAUSE that rule covers
 *   it — unit, price, the level's silence about the row, and the whole column at
 *   once — not because the check was skipped.
 *
 *   Nothing about the donor changes for a value cell. It is the donor's own cell
 *   — same element, same classes, same inner `w-layout-hflex`, inside a row that
 *   keeps its `data-w-id` and its stagger — with the words standing where the
 *   tick's `<img>` stood. A tick row keeps the tick `<img>` verbatim, a dash
 *   keeps the donor's own dash, and the grid, the row height, the borders and
 *   the motion are untouched.
 *
 * WHERE EVERY WORD COMES FROM
 *   PRICING, and nowhere else.
 *     plan names     PRICING.panes[…].name
 *     prices         .price, verbatim (¥10,000 … 定制)
 *     the period     .unit through PRICING.unitYear / unitFirst, by the same
 *                    rule tools/build-site.mjs:756-764 applies to this site's
 *                    own pricing cards, so the two surfaces on one page cannot
 *                    quote different terms. 企业版 is `unit: 'none'`: its price
 *                    is 定制 and no period is true of it, so that cell is
 *                    emptied rather than filled, as it is there.
 *     left column    PRICING.compareFeatures — 能力 / Capability, this site's own
 *                    word for the header renok writes "Features" in.
 *     row labels     compareMatrix: a value row's `label`, a tick row's own
 *                    sentence.
 *     cells          the levels' own `items`, quoted or counted — see below.
 *
 *   The donor's h2 above the chart ("Discover the best payment plan for your
 *   business") is NOT in the cut. PRICING's own heading for a comparison,
 *   compareTitle, reads 所选方案对比 / "Compare selected plans", and this chart
 *   shows every level rather than a selection; nothing else in PRICING titles a
 *   table. So the cut begins below the heading rather than filling that slot
 *   with a claim that is not true — the same reading this block's predecessor
 *   took of renok's "Save 30%" pill. PRICING.title already stands over the tier
 *   cards immediately above, and renok's own section rhythm (8.75rem over,
 *   9.375rem under) still separates the two.
 *
 * WHAT IS ASSERTED, WHICH IS THE POINT OF THE FILE
 *   Every cell is traced back into PRICING before it is drawn, and a cell that
 *   cannot be traced throws:
 *
 *     · compareMatrix.tiers must be PRICING.panes' own five levels, in order,
 *       in both languages — the columns cannot drift from the prices above them.
 *     · a value cell's `from` must occur VERBATIM inside one of that level's own
 *       items, in both languages; and every word and number of the cell's own
 *       text must occur inside that `from`, in order (`traces`). "20 条" cannot
 *       be written against a sentence that says 10, and no cell can name a
 *       capability its sentence does not.
 *     · 'custom' is allowed only where PRICING's own `customScope` rule covers
 *       the level: its `unit` is the rule's, its `price` is the rule's in both
 *       languages, its items are SILENT about that row's `key` — the same
 *       silence a dash requires — and it holds for the whole column, every value
 *       row or none. The cell then prints the level's own price, verbatim.
 *       企业版 is the only level of PRICING.panes that the rule reaches.
 *     · a dash on a value row is allowed only where the row's `key` is absent
 *       from that level's items AND from the items of every level it declares it
 *       contains. A level that states a capability, or inherits one, can never
 *       be shown as lacking it.
 *     · a tick row's sentence must be stated verbatim by at least one level, in
 *       both languages, and ticks that level.
 *     · EVERY TICK TRACES. A tick is in a cell for one of exactly two reasons:
 *       the level's own items state the line, or a declared step of
 *       PRICING.inherits carries it from a level that does. Which one is
 *       recorded per cell and re-derived after the rows are built, so a tick can
 *       never arrive from anywhere else — nothing is hand-written into
 *       compareMatrix and no sentence is matched loosely.
 *     · the declared ladder is checked before it is followed: both names of each
 *       step are levels of `panes` in both languages, no level inherits itself,
 *       and `from` always stands below `level` in PRICING's own order, so
 *       inheritance runs up the price list and can never cycle.
 *     · 上线版, 增长版 and 全球获客版 each open their items with 「含标准版年度软件
 *       订阅，另加：」 / "The annual Standard subscription, plus:". That is not a
 *       feature, it is PRICING saying in prose what PRICING.inherits says as
 *       data, so it is not a row — it is the CROSS-CHECK between the two:
 *       exactly the levels the ladder carries up to 标准版 must be the levels
 *       whose own first sentence says so. The marker is asserted as well — it
 *       must be the first item, exactly three levels may state it, 标准版 must
 *       not state it, and the level it names must be the first column. Reword it
 *       in copy.mjs, or drop a step of the ladder, and this block stops rather
 *       than guessing.
 *     · COVERAGE, in the other direction: every item of every level (bar that
 *       inclusion sentence) must be carried by some row — as a tick row's
 *       sentence, or as a value cell whose `from` is inside it. A deliverable
 *       PRICING sells cannot silently fall off the chart.
 *     · and the shape: five columns, one cell per column per row, no two rows
 *       with the same label, no row that says nothing in any level, no level
 *       that says nothing in any row, the rendered counts of header tags, price
 *       cells, rows, cells, ticks, dashes and values, and no donor copy left.
 *
 * WHERE THE DATA IS SILENT, NOTHING IS WRITTEN
 *   A dash means "not part of this level, and not inherited by it". It is drawn
 *   on a value row only where the row's `key` is absent from that level's items
 *   and from every level it declares it contains — 标准版 sells no website, no
 *   SKU pages, no photography and no video, inherits nothing, and dashes all
 *   six; 上线版's video sentence names filmed video only, and 标准版 below it names
 *   none, so it dashes AI 视频 — and on a tick row wherever the level neither
 *   states the line nor inherits a level that does.
 *
 *   Silence is still silence. What changed on 2026-09-15 is only that a declared
 *   inheritance is no longer silence: 全球获客版's items say nothing about SEO,
 *   but PRICING declares that it contains 增长版 and 上线版, which do, so it ticks
 *   both SEO rows — the declaration being read, not a claim invented here. Take
 *   the step out of PRICING.inherits and the tick goes with it.
 *
 *   One place is worth naming, because it is the only cell-block in the chart
 *   where a dash may read as harder than the company means it. 企业版 is in no
 *   step of PRICING.inherits and states no inclusion of 标准版, so it dashes
 *   标准版's five subscription rows. On the value rows it reads 定制 / Custom,
 *   which is what `customScope` declares of a level priced that way, so it is
 *   not a column of dashes; but on those five it still reads as absence where
 *   PRICING is merely silent. The honest fix is a line in PRICING — a step of
 *   the ladder for 企业版, or an inclusion sentence like the three middle
 *   levels' — not a tick invented here. `customScope` deliberately does not
 *   reach a tick row: a tick is a yes, and 定制 is not one.
 *
 * ONE LANGUAGE PER PAGE
 *   「不是所有的观众都能看得懂英文」. Every string is resolved through ctx.t, and
 *   the render throws if a mixed-case Latin word reaches the Chinese page — the
 *   all-caps product tokens PRICING itself writes into Chinese sentences (AI,
 *   CRM, ERP, SKU, SEO, GEO, SLA, FAQ) are the only Latin allowed there — or if
 *   a Han character reaches the English one.
 *
 * WHAT WAS MEASURED BEFORE THE WORDS WERE CHOSEN
 *   Type measured in renok's own Inter Tight (css/donor-fonts.css →
 *   assets/fonts/donor/InterTight-{400,600}.woff2) at renok's own sizes, in a
 *   headless Chromium; Han runs fall back to the system CJK face, as they do on
 *   renok's own stack, which carries none (`"Inter Tight", sans-serif`). Boxes
 *   measured on the rendered block at a 1440 viewport, where the container is
 *   1440px and the chart 1410px (`.rt-container-xl`: a 114.375rem ceiling it
 *   does not reach, less 2 × .9375rem of gutter). With the sixth track that is
 *   a 272.9px label column — 262.9px of content, less .625rem of
 *   `.rt-chart-left-col` padding-right — and five 227.4px plan columns, 207.4px
 *   of content each, less 2 × .625rem of `.rt-chart-columns` padding:
 *
 *     slot          box      renok's widest        ours (zh)     ours (en)
 *     price        207.4   $199          93.9   ¥40,000 151.0  ¥40,000 151.0
 *                                               定制      77.6  Custom  147.4
 *     plan name    207.4   Premium plan 120.5   全球获客版 87.3  Global
 *                                                              Acquisition
 *                                                                      156.3
 *     the period   207.4   Per month     79.9   / 首年    43.6  / first year
 *                                                              total   117.9
 *     left header  262.9   Features      80.7   能力      38.8  Capability
 *                                                                       94.5
 *     a feature    262.9   Unlimited e-mail      widest 413.5  widest  521.9
 *                          notification 219.7    → 2 lines     → 3 lines
 *
 *   Those are the measurements of the tick-matrix build, and every box in them
 *   is renok's own and unchanged. What changed on 2026-09-15 is what stands
 *   inside a plan cell on six of the rows: body-size words instead of a 17×14
 *   glyph. The widest of them is the 增长版 language cell — 「中英文 + 3 个语种」,
 *   ten characters, and "Chinese and English + 3 languages", 33 — against the
 *   207.4px of content a plan column holds and the 219.7px renok itself fits in
 *   a narrower slot; the English one wraps to two lines, every other value cell
 *   is one short line, and none of them is near the 3-line left-hand labels that
 *   actually set a row's height. The block was NOT rebuilt for this change, so
 *   nothing above was re-measured in a browser: the numbers are renok's own CSS
 *   and the measurements already recorded, and the mobile floor — which the
 *   price row sets and this change does not touch — is re-derived in
 *   tools/blocks/rk-price-compare.css, where it has always been recorded.
 */
import { setText, splitRepeat } from '../block-lib.mjs';
import { zhWbr } from '../lib-html.mjs';

export const donor = {
  id: 'rk-price-compare',
  donor: 'renok',
  scope: '.rk-price-compare',
  /* renok draws this chart on its pricing page, not on its home page. */
  page: 'pricing.html',
  /* The chart, and only the chart. `.rt-pricing-chart` opens on the one element
     carrying data-w-id …532ba1 — that exact opening tag occurs once in
     pricing.html — and closes four `</div>`s after the last tick's `<img>`: the
     tick's own wrapper, its cell, its row, and the chart. Every earlier row
     closes with three and is followed by `<div data-w-id="…`, so the first run
     of four after the start anchor is the chart's own end; the whole end string
     occurs once in the file. The cut is div-balanced (checked: 12528 bytes, 10
     rows, 9 left cells, 32 plan cells, 32 images, depth back to zero). */
  start: '<div data-w-id="cacecf34-e427-8fd7-d839-092b3e532ba1"',
  end: '_pricing-check.svg" loading="lazy"/></div></div></div></div>',
  /* Outermost first, in renok's own class names so donor-lib namespaces them
     and carries their rules (wrapping after namespacing would leave them
     unstyled — that is how renok's hero first arrived as white type on a white
     page): the section that paints the ground (`.rt-background-black`) and sets
     the page rhythm (`.rt-pricing-v1-list`, :5236 — 8.75rem over, 9.375rem
     under, which is exactly the gap renok itself leaves between its plan cards
     and this chart), the block container that gives the chart its 114.375rem
     ceiling and .9375rem gutters, and the flex column the chart is the only
     child of. Same idiom as tools/blocks/qx-orbit.mjs. */
  wrap: [
    'rt-pricing-v1-list rt-background-black',
    'w-layout-blockcontainer rt-container-xl w-container',
    'w-layout-vflex rt-pricing-v1-content-2',
  ],
  /* No `ground`: `.rt-background-black` is inside the cut and paints the block
     itself. The six declarations renok keeps on `body` are restored in
     tools/blocks/rk-price-compare.css, where every renok block restores them. */
  /* No image map. The chart draws two Webflow svgs — …_pricing-check.svg and
     …_pricing-three-line.svg — and both are renok's own, so `mirror` keeps its
     default (assets/renok) and tools/mirror-donor-assets.mjs fetches them. */
};

/* ------------------------------------------------------ the donor's shape -- */

/* Written against the PREFIXED classes: render() is handed the fragment after
   tools/donor-lib.mjs has namespaced it (`rt-x` → `rk-rt-x`; `w-layout-*` and
   `id=` are left alone). `donor.start` and `donor.end` above are the opposite —
   they match renok's raw html, before the prefix exists. */
const ROW_OPEN = /<div data-w-id="[0-9a-f-]+" class="rk-rt-pricing-chart-rows rk-rt-desktop-text-center">/g;
const TAG = '<div class="w-layout-vflex rk-rt-chart-top-tag">';
const PRICE_CELL = '<div class="w-layout-vflex rk-rt-chart-columns rk-rt-chart-col-1">';
const CELL = '<div class="w-layout-vflex rk-rt-chart-columns">';
const LEFT_COL = /<div id="w-node-[\w-]+" class="rk-rt-chart-left-col">/;
const EMPTY_CELL = '<div id="w-node-cacecf34-e427-8fd7-d839-092b3e532ba3-a96158b4"></div>';
const PER_MONTH = '<div>Per month</div>';
const CLOSE = '</div>';
const TICK_SVG = '_pricing-check.svg';
const DASH_SVG = '_pricing-three-line.svg';
/** The glyph inside a cell — what a value row's words stand in place of. */
const IMG = /<img\b[^>]*>/;

/** Plan columns renok draws, and feature rows it draws. */
const DONOR_PLANS = 4;
const DONOR_ROWS = 8;
/** Levels PRICING sells. tools/blocks/rk-price-compare.css agrees. */
const PLANS = 5;

/** copy.mjs is bilingual; every assertion below is made in both languages. */
const LANGS = ['zh', 'en'];

/**
 * PRICING's own PROSE statement that a level carries everything 标准版 carries:
 * 「含标准版年度软件订阅，另加：」, which opens the item list of 上线版, 增长版 and
 * 全球获客版. Matched on the Chinese, the language copy.mjs is authored in; the
 * English pair is "The annual Standard subscription, plus:".
 *
 * Since 2026-09-15 this is no longer what DERIVES a tick — PRICING.inherits is
 * (see `ladder` below). It is kept as the cross-check between the two: exactly
 * the levels that carry up to 标准版 through the declared ladder must be the
 * levels whose own first sentence says they do, so the declaration and the
 * prose cannot drift apart in either direction.
 */
const INCLUDES_BASE = '含标准版年度软件订阅';
/** The level that sentence names — and the level it has to be. */
const BASE_NAME = '标准版';
/** How many levels may say it. */
const BASE_CARRIERS = 3;

/* ------------------------------------------------------------ markup tools -- */

/** End index (exclusive) of the `<div>` element that begins at `at`. */
function divEnd(html, at, what) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = at;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === CLOSE) { if (--depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  throw new Error(`rk-price-compare: ${what} is never closed`);
}

/** Replace an exact donor string that must appear exactly once. */
function swap(html, from, to, what) {
  const found = html.split(from).length - 1;
  if (found !== 1) throw new Error(`rk-price-compare: expected one ${what} (${from}), found ${found}`);
  return html.split(from).join(to);
}

/**
 * A repeating unit with its text nodes emptied, so two units can be compared
 * for "identical apart from the words". A unit that differs anywhere else must
 * not be cloned: the clone would carry markup the donor did not write there,
 * which is the one thing this directory exists to prevent.
 */
const skeleton = (u) => u.replace(/>[^<>]+</g, '><');

/**
 * The same, for the cells of a feature row, which legitimately differ in one
 * more thing: a cell holds either the tick image or the dash image. Everything
 * around the `<img>` still has to match, or the two cells this block repeats
 * are not interchangeable.
 */
const iconless = (u) => skeleton(u).replace(/<img\b[^>]*>/g, '<img>');

function assertClones(units, what, norm) {
  const first = norm(units[0]);
  units.forEach((u, i) => {
    if (norm(u) !== first) {
      throw new Error(`rk-price-compare: renok's ${what} ${i + 1} is not the same markup as the first, so a fifth cannot be emitted from it`);
    }
  });
}

/**
 * Every `.rt-pricing-chart-rows` in the fragment, as {at, end, text}. The rows
 * differ only in their `data-w-id`, so they are found by shape.
 */
function chartRows(frag) {
  return [...frag.matchAll(ROW_OPEN)].map((m) => {
    const end = divEnd(frag, m.index, 'a chart row');
    return { at: m.index, end, text: frag.slice(m.index, end) };
  });
}

/**
 * Cut a row on its repeating cell: {head, units, tail}. The head is the row's
 * opening tag plus its left-hand cell; the tail is the row's own `</div>`.
 */
function rowCells(row, open, what, norm = skeleton) {
  const cut = splitRepeat(row, open, row.length - CLOSE.length);
  if (cut.units.length !== DONOR_PLANS) {
    throw new Error(`rk-price-compare: renok draws ${DONOR_PLANS} ${what} per row, found ${cut.units.length}`);
  }
  if (cut.tail !== CLOSE) {
    throw new Error(`rk-price-compare: a row does not end on its own </div>, found ${JSON.stringify(cut.tail.slice(0, 40))}`);
  }
  assertClones(cut.units, what, norm);
  return cut;
}

/**
 * Drop the Webflow node id from a left-hand cell.
 *
 * Webflow addresses these nine cells by generated id — `place-self: center
 * start` at …b851cf614.css:11327, and `grid-area: span 1 / span 4 …;
 * justify-self: center` at :11434 below 768px — and tools/donor-lib.mjs carries
 * class rules and element rules, not id rules (README, "rules Webflow wrote
 * against a generated node id, which is not a class and so is not extracted").
 * Both are therefore restated, by class, in tools/blocks/rk-price-compare.css,
 * which leaves the ids in the markup as decoration; and because this chart draws
 * more rows than renok has ids for, they would be *repeated* decoration, which
 * tools/verify-integrity.mjs:16 rejects outright ("duplicate id"). So the id
 * goes and nothing else does — the class, the structure, the row's `data-w-id`
 * and every inline style are untouched. The one node id this block keeps is the
 * empty cell at the head row's top-left: it is emitted once, it carries no class
 * at all, and its id is the only handle its own rule has.
 */
function dropNodeId(cell) {
  if (!LEFT_COL.test(cell)) throw new Error('rk-price-compare: a row has no #w-node-… .rt-chart-left-col to carry its label');
  return cell.replace(LEFT_COL, '<div class="rk-rt-chart-left-col">');
}

/* ------------------------------------------------------------ copy tools -- */

/** copy.mjs is authored in Chinese; a {zh,en} pair's Chinese is its identity. */
const zh = (v) => pick(v, 'zh');

/** One language out of a bilingual pair, or a string that is both. */
function pick(v, lang) {
  const s = typeof v === 'string' ? v : v?.[lang];
  if (typeof s !== 'string' || !s) throw new Error(`rk-price-compare: ${JSON.stringify(v)} is not a copy string`);
  return s;
}

/** Copy compared to copy: whitespace normalised, nothing else touched. */
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/** A word, a number or a run of Han — the pieces a cell's text is made of. */
const TOKEN = /[0-9]+|[A-Za-z]+|[㐀-䶿一-鿿]+/g;

/**
 * Is every word and number of `text` inside `from`, in that order?
 *
 * This is the assertion the whole task turns on. `from` is the fragment of a
 * level's own items sentence a cell is read out of, and a cell may only
 * SHORTEN it: 「20 条」 against 「20 条实拍短视频」, "18 languages" against
 * "18 system-translated languages". A number that is not in the sentence, or a
 * noun the sentence does not use, or the right words in the wrong order, all
 * fail. Numbers match whole: "20" is not found inside "200".
 */
function traces(text, from) {
  const hay = norm(from);
  const tokens = norm(text).match(TOKEN) ?? [];
  if (!tokens.length) return false;
  let at = 0;
  for (const token of tokens) {
    const number = /^[0-9]+$/.test(token);
    let i = hay.indexOf(token, at);
    while (i >= 0 && number
      && (/[0-9]/.test(hay[i - 1] ?? '') || /[0-9]/.test(hay[i + token.length] ?? ''))) {
      i = hay.indexOf(token, i + 1);
    }
    if (i < 0) return false;
    at = i + token.length;
  }
  return true;
}

/** The level's own item sentence that carries `text`, or undefined. */
const itemWith = (tier, text, lang) => tier.items.find((it) => norm(pick(it, lang)).includes(norm(pick(text, lang))));

/** Does this level state this line, word for word, in both languages? */
const states = (tier, line) => tier.items.some((it) => LANGS.every((l) => norm(pick(it, l)) === norm(pick(line, l))));

/* ------------------------------------------------- the declared ladder -- */

/**
 * PRICING.inherits, resolved against the five levels: for each level, the set
 * of level indices it contains, transitively.
 *
 * THIS IS THE WHOLE OF THE 2026-09-15 FIX, and it is deliberately dumb. It
 * follows declared steps and does nothing else — it never compares one level's
 * sentence to another's, so it can never decide on its own that two lines
 * "mean the same thing". A level contains another here only because
 * tools/copy.mjs says so, in words, with the owner's decision beside it.
 *
 * Every step is checked before it is followed: both names must be levels of
 * `panes`, in both languages, and `from` must stand BELOW `level` in PRICING's
 * own order — inheritance runs up the price list and never down, which is also
 * what makes a cycle impossible and lets one forward pass compose the steps.
 */
function ladder(P, tiers) {
  if (!Array.isArray(P.inherits)) {
    throw new Error('rk-price-compare: copy.mjs exports no PRICING.inherits. A higher level states what it ADDS and never restates what it already carries, so without a declared inheritance this chart reads every silence as an absence — 上线版’s own delivery line ticked one column and dashed four, and the ¥30,000 and ¥40,000 levels read as having no domain, no hosting and no SEO that ¥20,000 has');
  }
  const index = (pair, what, step) => {
    const at = tiers.findIndex((p) => LANGS.every((l) => norm(pick(p.name, l)) === norm(pick(pair, l))));
    if (at < 0) {
      throw new Error(`rk-price-compare: PRICING.inherits step ${step} names ${what} 「${zh(pair)}」, which is not one of the ${PLANS} levels PRICING.panes sells`);
    }
    return at;
  };
  const direct = tiers.map(() => new Set());
  P.inherits.forEach((step, si) => {
    if (!step?.level || !step?.from) {
      throw new Error(`rk-price-compare: PRICING.inherits step ${si + 1} is not {level, from}: ${JSON.stringify(step)}`);
    }
    const a = index(step.level, '`level`', si + 1);
    const b = index(step.from, '`from`', si + 1);
    if (a === b) {
      throw new Error(`rk-price-compare: PRICING.inherits step ${si + 1} has ${zh(step.level)} inheriting itself`);
    }
    if (b > a) {
      throw new Error(`rk-price-compare: PRICING.inherits step ${si + 1} has ${zh(step.level)} inheriting ${zh(step.from)}, which PRICING.panes sells ABOVE it; inheritance runs up the price list, never down`);
    }
    if (direct[a].has(b)) {
      throw new Error(`rk-price-compare: PRICING.inherits states ${zh(step.level)} inherits ${zh(step.from)} twice`);
    }
    direct[a].add(b);
  });
  const contains = tiers.map(() => new Set());
  tiers.forEach((p, i) => {
    for (const b of direct[i]) {
      contains[i].add(b);
      /* `b < i` always, so contains[b] is already complete: one pass composes
         the whole ladder, and 全球获客版 → 增长版 → 上线版 → 标准版 needs no
         second one. */
      for (const c of contains[b]) contains[i].add(c);
    }
  });
  return contains;
}

/* ----------------------------------------------------------------- render -- */

export function render(frag, ctx) {
  const { lang, t, escapeHtml } = ctx;
  const P = ctx.C.PRICING;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`rk-price-compare: unknown lang ${lang}`);
  if (!P?.panes) throw new Error('rk-price-compare: copy.mjs exports no PRICING.panes');

  const M = P.compareMatrix;
  if (!M || !Array.isArray(M.tiers) || !Array.isArray(M.valueRows) || !Array.isArray(M.tickRows) || !M.customScope) {
    throw new Error('rk-price-compare: copy.mjs exports no PRICING.compareMatrix {tiers, customScope, valueRows, tickRows}; this chart draws values, and there is nothing to draw');
  }
  /* The declared exception on a value row, as a test rather than a name — see
     the comment over compareMatrix in copy.mjs. Without it a 定制 cell would be
     a value written against no rule at all, which is what it was before
     2026-09-15. */
  const CUSTOM = M.customScope;
  if (!CUSTOM.unit || !CUSTOM.price) {
    throw new Error('rk-price-compare: compareMatrix.customScope is not {unit, price}; a level may only read 定制 because a declared rule says levels priced that way are scoped individually');
  }
  if (!M.valueRows.length) {
    throw new Error('rk-price-compare: compareMatrix has no value rows, which is the tick-only matrix this chart replaced on 2026-09-15 — the levels differ by quantity and a chart that can only tick reads those quantities as absences');
  }
  if (!M.tickRows.length) throw new Error('rk-price-compare: compareMatrix has no tick rows');

  /* ---------------------------------------------------- the five levels ---- */

  /* PRICING keeps its levels in two panes because this site's own pricing page
     draws them as two tabs. A chart has no tabs, so the panes are flattened;
     the `unit: 'demo'` entry is 从一条流程开始, an invitation rather than a level,
     and has no place in a row of prices. */
  const all = P.panes.flat();
  const tiers = all.filter((p) => p.unit !== 'demo');
  if (tiers.length !== PLANS) {
    throw new Error(`rk-price-compare: PRICING lists ${tiers.length} priced levels; this chart, and the track count in rk-price-compare.css, are written for ${PLANS}`);
  }
  if (all.length - tiers.length !== 1) {
    throw new Error(`rk-price-compare: ${all.length - tiers.length} demo entries in PRICING.panes, expected one`);
  }
  tiers.forEach((p, i) => {
    if (!Array.isArray(p.items) || !p.items.length) throw new Error(`rk-price-compare: level ${i + 1} lists no items, so it would head a column of nothing`);
    if (!['year', 'first', 'none'].includes(p.unit)) throw new Error(`rk-price-compare: level ${i + 1} has unit ${p.unit}`);
    if (!t(p.price)) throw new Error(`rk-price-compare: level ${i + 1} has no price`);
  });

  /* The matrix's columns are PRICING's own levels, in PRICING's own order. A
     renamed or re-ordered level has to be answered in copy.mjs, not guessed at
     here: a column of numbers standing under the wrong price is the failure
     this chart exists to prevent. */
  if (M.tiers.length !== PLANS) {
    throw new Error(`rk-price-compare: compareMatrix names ${M.tiers.length} columns, PRICING sells ${PLANS}`);
  }
  M.tiers.forEach((name, i) => {
    for (const l of LANGS) {
      if (norm(pick(name, l)) !== norm(pick(tiers[i].name, l))) {
        throw new Error(`rk-price-compare: compareMatrix column ${i + 1} is ${pick(name, l)}, PRICING.panes has ${pick(tiers[i].name, l)}`);
      }
    }
  });

  /* The period under a price, by tools/build-site.mjs:756-764. */
  const unitOf = (u) => (u === 'year' ? t(P.unitYear) : u === 'first' ? t(P.unitFirst) : '');

  /* ------------------------------------------ what a level contains, and
                                                 how this chart knows -------- */

  /* The declared ladder. Every tick that is not a level's own line is one of
     these steps being read; nothing else may put one in a cell. */
  const contains = ladder(P, tiers);

  /* 标准版 is the level PRICING's own inclusion sentence names. Asserted rather
     than assumed: the cross-check below is only honest while
     「含标准版年度软件订阅」 names the column the ladder's first step carries. */
  const base = tiers[0];
  if (zh(base.name) !== BASE_NAME) {
    throw new Error(`rk-price-compare: PRICING's first level is ${zh(base.name)}, but 「${INCLUDES_BASE}」 names ${BASE_NAME}; the chart cannot tell which column that sentence includes`);
  }

  const carries = tiers.map((p, i) => {
    const at = p.items.findIndex((it) => zh(it).startsWith(INCLUDES_BASE));
    if (at > 0) {
      throw new Error(`rk-price-compare: level ${i + 1} states 「${INCLUDES_BASE}」 as item ${at + 1}; it is the heading of the list under it and must come first`);
    }
    return at === 0;
  });
  if (carries[0]) throw new Error(`rk-price-compare: ${BASE_NAME} states that it includes itself`);
  const carrierCount = carries.filter(Boolean).length;
  if (carrierCount !== BASE_CARRIERS) {
    throw new Error(`rk-price-compare: ${carrierCount} levels state 「${INCLUDES_BASE}」; this cross-check was written for ${BASE_CARRIERS}`);
  }

  /* THE CROSS-CHECK. PRICING says the same thing twice about 标准版 — once in
     prose, at the head of three levels' item lists, and once as data, in
     PRICING.inherits. They have to agree: exactly the levels that reach 标准版
     up the declared ladder are the levels whose own first sentence says they
     include it. Neither may gain or lose a level without the other. */
  tiers.forEach((p, i) => {
    const declared = contains[i].has(0);
    if (declared === carries[i]) return;
    throw new Error(declared
      ? `rk-price-compare: PRICING.inherits carries ${zh(p.name)} up to ${BASE_NAME}, but ${zh(p.name)}'s items do not open with 「${INCLUDES_BASE}」; the declaration and PRICING's own prose disagree about what that level contains`
      : `rk-price-compare: ${zh(p.name)} states 「${INCLUDES_BASE}」, but PRICING.inherits does not carry it up to ${BASE_NAME}; the declaration and PRICING's own prose disagree about what that level contains`);
  });
  const inclusion = (it) => zh(it).startsWith(INCLUDES_BASE);

  /* -------------------------------------------------------- the value rows -- */

  /* A cell is `{kind}`: 'value' carries words, 'tick' the donor's tick, 'dash'
     the donor's dash. Every 'value' is traced back into the level's own items
     before it is built, and an untraceable one throws. */
  const valueRows = M.valueRows.map((row, ri) => {
    const where = `compareMatrix value row ${ri + 1} (${zh(row.label)})`;
    if (!Array.isArray(row.cells) || row.cells.length !== PLANS) {
      throw new Error(`rk-price-compare: ${where} holds ${row.cells?.length} cells, the chart draws ${PLANS} columns`);
    }
    if (!row.key) throw new Error(`rk-price-compare: ${where} has no \`key\`, so a dash in it could not be checked against the level's own words`);
    const cells = row.cells.map((cell, i) => {
      const tier = tiers[i];
      const who = `${zh(tier.name)} on ${where}`;

      /* Not part of this level — but only where the level itself says nothing
         of the kind, AND nothing it declares it contains does either. A level
         that states a capability, or inherits one, may never be drawn as
         lacking it.

         Inheritance is used HERE only to refuse a contradiction, never to copy
         a value upward: a level that inherits a lower one states its own,
         larger number in its own items, and drawing the lower level's smaller
         number in its cell would understate what it sells. */
      if (cell === null || cell === undefined) {
        for (const l of LANGS) {
          const said = itemWith(tier, row.key, l);
          if (said) {
            throw new Error(`rk-price-compare: ${who} is dashed, but ${zh(tier.name)} lists 「${pick(said, l)}」, which carries 「${pick(row.key, l)}」; a dash there would print the opposite of what PRICING says`);
          }
          for (const j of contains[i]) {
            const below = itemWith(tiers[j], row.key, l);
            if (below) {
              throw new Error(`rk-price-compare: ${who} is dashed, but PRICING.inherits declares that ${zh(tier.name)} contains ${zh(tiers[j].name)}, which lists 「${pick(below, l)}」; the cell would print the opposite of the inheritance`);
            }
          }
        }
        return { kind: 'dash' };
      }

      /* THE ONE DECLARED EXCEPTION — PRICING.compareMatrix.customScope, and
         every part of it checked against the level itself. Before 2026-09-15
         this branch read the level's `price` and stopped there, which made it
         the one cell in the chart never checked against the level's own words:
         a 定制 could stand anywhere a level happened to be priced that way,
         including over a quantity the level states. It cannot now. */
      if (cell === 'custom') {
        if (tier.unit !== CUSTOM.unit) {
          throw new Error(`rk-price-compare: ${who} is 'custom', which customScope declares for a level whose unit is '${CUSTOM.unit}'; ${zh(tier.name)} is priced per '${tier.unit}'`);
        }
        for (const l of LANGS) {
          if (norm(pick(tier.price, l)) !== norm(pick(CUSTOM.price, l))) {
            throw new Error(`rk-price-compare: ${who} is 'custom', which customScope declares for a level priced 「${pick(CUSTOM.price, l)}」; ${zh(tier.name)}'s price is 「${pick(tier.price, l)}」`);
          }
          /* The silence customScope requires, which is the same silence a dash
             requires: the rule covers a level that is scoped individually, not
             one that states a quantity and then hides it behind 定制. */
          const said = itemWith(tier, row.key, l);
          if (said) {
            throw new Error(`rk-price-compare: ${who} is 'custom', but ${zh(tier.name)} lists 「${pick(said, l)}」, which carries 「${pick(row.key, l)}」 — customScope covers a level whose items are silent about the row, and this one states it; the cell has to say what PRICING says`);
          }
        }
        /* The level's own price, verbatim: the cell prints the word PRICING
           already prints over that column, not a second word for it. */
        return { kind: 'value', text: tier.price, from: tier.price };
      }

      /* A value, and the sentence it is read out of. */
      if (!cell.v || !cell.from) throw new Error(`rk-price-compare: ${who} is neither null, 'custom', nor {v, from}: ${JSON.stringify(cell)}`);
      for (const l of LANGS) {
        const said = itemWith(tier, cell.from, l);
        if (!said) {
          throw new Error(`rk-price-compare: ${who} is drawn 「${pick(cell.v, l)}」 from 「${pick(cell.from, l)}」, and no item of ${zh(tier.name)} says that. Every value in this chart has to be a level's own words; this one is not, so nothing is drawn`);
        }
        if (!traces(pick(cell.v, l), pick(cell.from, l))) {
          throw new Error(`rk-price-compare: ${who} draws 「${pick(cell.v, l)}」, which is not inside 「${pick(cell.from, l)}」 — the cell claims something the sentence does not`);
        }
      }
      return { kind: 'value', text: cell.v, from: cell.from };
    });
    return { label: row.label, key: row.key, cells };
  });

  /* customScope is a rule about a LEVEL, not about a cell, so it is checked as
     one as well: a level that matches it reads its own price on EVERY value
     row, and a level that does not match it may read it on none. A 定制 in one
     cell of a column that states quantities in the others is exactly the back
     door this rule was written to close. */
  tiers.forEach((p, i) => {
    const scoped = p.unit === CUSTOM.unit
      && LANGS.every((l) => norm(pick(p.price, l)) === norm(pick(CUSTOM.price, l)));
    const written = M.valueRows.filter((row) => row.cells[i] === 'custom').length;
    const want = scoped ? M.valueRows.length : 0;
    if (written === want) return;
    throw new Error(scoped
      ? `rk-price-compare: ${zh(p.name)} matches customScope (unit '${CUSTOM.unit}', priced 「${zh(CUSTOM.price)}」), so it is scoped individually on every one of the ${M.valueRows.length} value rows; compareMatrix writes 'custom' on ${written} of them`
      : `rk-price-compare: ${zh(p.name)} reads 「${zh(CUSTOM.price)}」 on ${written} value rows, but it does not match customScope — it is priced 「${zh(p.price)}」 per '${p.unit}', so its cells have to come from its own items`);
  });

  /* --------------------------------------------------------- the tick rows -- */

  /* A tick is derived, never written. Two things can produce one, and they are
     both data in copy.mjs: the level states the line in its own `items`, or
     PRICING.inherits declares that it contains a level which does. `via` records
     which, so the provenance can be re-derived below rather than trusted. */
  const tickRows = M.tickRows.map((line, ri) => {
    const own = tiers.map((p) => states(p, line));
    if (!own.some(Boolean)) {
      throw new Error(`rk-price-compare: compareMatrix tick row ${ri + 1} 「${zh(line)}」 is stated by no level, in one language or the other; a row no level lists is a row this chart invented`);
    }
    const cells = tiers.map((p, i) => {
      if (own[i]) return { kind: 'tick', via: null };
      /* The lowest level this one declares it contains that states the line —
         which is the level the tick is inherited FROM, and the level the error
         messages below name. */
      const via = [...contains[i]].sort((a, b) => a - b).find((j) => own[j]);
      return via === undefined ? { kind: 'dash' } : { kind: 'tick', via };
    });
    return { label: line, cells };
  });

  /* EVERY TICK, RE-DERIVED — the assertion the 2026-09-15 decision turns on.
     Said a second time from the finished cells rather than from the loop that
     built them: a tick is in a cell because that level's own items state the
     line, or because a declared step of PRICING.inherits carries it from a
     level that does. There is no third way in. No tick is hand-written into
     compareMatrix, and no sentence is matched loosely to produce one. */
  tickRows.forEach((row, ri) => {
    row.cells.forEach((c, i) => {
      if (c.kind !== 'tick') return;
      const who = `${zh(tiers[i].name)} on compareMatrix tick row ${ri + 1} 「${zh(row.label)}」`;
      if (c.via === null) {
        if (!states(tiers[i], row.label)) {
          throw new Error(`rk-price-compare: ${who} is ticked as the level's own line, but no item of ${zh(tiers[i].name)} states it`);
        }
        return;
      }
      if (!contains[i].has(c.via)) {
        throw new Error(`rk-price-compare: ${who} is ticked from ${zh(tiers[c.via].name)}, and PRICING.inherits does not declare that ${zh(tiers[i].name)} contains it`);
      }
      if (!states(tiers[c.via], row.label)) {
        throw new Error(`rk-price-compare: ${who} is ticked from ${zh(tiers[c.via].name)}, whose own items do not state that line either`);
      }
    });
  });

  /* ------------------------------------------------------------- coverage -- */

  /* The other direction, and the one that keeps this chart honest about what is
     NOT on it: every line PRICING sells has to be carried by some row. */
  tiers.forEach((p, i) => {
    for (const item of p.items) {
      if (inclusion(item)) continue;
      const asTick = M.tickRows.some((line) => LANGS.every((l) => norm(pick(item, l)) === norm(pick(line, l))));
      const asValue = M.valueRows.some((row) => {
        const cell = row.cells[i];
        return cell && cell !== 'custom' && cell.from
          && LANGS.every((l) => norm(pick(item, l)).includes(norm(pick(cell.from, l))));
      });
      if (!asTick && !asValue) {
        throw new Error(`rk-price-compare: ${zh(p.name)} lists 「${zh(item)}」 and no row of compareMatrix carries it; a deliverable PRICING sells would fall off the chart`);
      }
    }
  });

  /* ------------------------------------------------------- the rows, drawn -- */

  const rows = [...valueRows, ...tickRows];
  const seen = new Map();
  for (const row of rows) {
    const key = zh(row.label);
    if (seen.has(key)) throw new Error(`rk-price-compare: two rows are labelled 「${key}」`);
    seen.set(key, true);
  }
  const mute = rows.filter((r) => r.cells.every((c) => c.kind === 'dash'));
  if (mute.length) throw new Error(`rk-price-compare: ${mute.length} rows are dashed in every level, starting 「${zh(mute[0].label)}」`);
  const empty = tiers.filter((p, i) => rows.every((r) => r.cells[i].kind === 'dash'));
  if (empty.length) throw new Error(`rk-price-compare: ${empty.map((p) => zh(p.name)).join(', ')} would stand as a column of dashes`);

  /* ------------------------------------------------------------- the cut --- */

  const parts = chartRows(frag);
  if (parts.length !== DONOR_ROWS + 2) {
    throw new Error(`rk-price-compare: renok's chart is a header row, a price row and ${DONOR_ROWS} feature rows; the cut holds ${parts.length} rows`);
  }
  const head = frag.slice(0, parts[0].at);
  const tail = frag.slice(parts[parts.length - 1].end);
  if (!head.includes('rk-rt-pricing-chart"')) throw new Error('rk-price-compare: the cut does not open on .rt-pricing-chart');
  /* Everything after the last row is closing tags: the chart's own, and one for
     each ancestor `donor.wrap` put back. Anything else means a row was dropped
     without anyone noticing, or the wrap chain no longer closes where it opens. */
  const closers = CLOSE.repeat(1 + donor.wrap.length);
  if (tail !== closers) {
    throw new Error(`rk-price-compare: the cut holds ${JSON.stringify(tail.slice(0, 60))} after its last row, expected the chart's </div> and ${donor.wrap.length} for the wrap chain`);
  }
  const [tagRow, priceRow] = parts;
  const donorRows = parts.slice(2);

  /* ---------------------------------------- the header row: one tag each --- */

  const tagCut = rowCells(tagRow.text, TAG, 'header tags');
  if (!tagCut.head.includes(EMPTY_CELL)) {
    throw new Error("rk-price-compare: the header row no longer opens on renok's empty top-left cell, which is the one node id this block keeps");
  }
  const tags = tiers.map((p, i) => setText(tagCut.units[i % DONOR_PLANS], 'rk-rt-text-style-h6', escapeHtml(t(p.name))));

  /* ------------------------ the price row: the header, then one price each -- */

  const priceCut = rowCells(priceRow.text, PRICE_CELL, 'price cells');
  let priceHead = setText(priceCut.head, 'rk-rt-text-style-h5', escapeHtml(t(P.compareFeatures)));
  priceHead = dropNodeId(priceHead);
  const prices = tiers.map((p, i) => {
    const cell = setText(priceCut.units[i % DONOR_PLANS], 'rk-rt-gap-off', escapeHtml(t(p.price)));
    /* The period carries no class of its own: it is drawn by the `body` rule
       tools/blocks/rk-price-compare.css restores. */
    return swap(cell, PER_MONTH, `<div>${escapeHtml(unitOf(p.unit))}</div>`, 'price period');
  });

  /* -------------------------- the three cells every feature row is built of -- */

  /* Taken verbatim out of the donor's last feature row — the one row that draws
     both a tick and a dash, two dashes then two ticks. renok spells its dash
     twice: `width="22" height="3"` in five cells and `width="17" height="14"`,
     the tick's own box, in three. The majority spelling is the one standing in
     this row, so that is the cell taken. renok's `img` rule (:2306) is
     `width: 100%; height: 100%`, which resolves against the cell's own
     shrink-to-fit wrapper, so those attributes are what actually size the glyph:
     taking the whole cell is the only way to keep it. */
  const sample = rowCells(donorRows[donorRows.length - 1].text, CELL, 'tick cells', iconless);
  const tickCell = sample.units.find((u) => u.includes(TICK_SVG) && !u.includes(DASH_SVG));
  const dashCell = sample.units.find((u) => u.includes(DASH_SVG) && !u.includes(TICK_SVG));
  if (!tickCell || !dashCell) {
    throw new Error("rk-price-compare: renok's last feature row no longer draws both a tick and a dash, so this chart has no cell to repeat for either");
  }
  if (!dashCell.includes('width="22" height="3"')) {
    throw new Error(`rk-price-compare: the dash cell is no longer renok's 22×3 spelling: ${dashCell.slice(0, 120)}`);
  }
  if ((tickCell.match(/<img\b/g) ?? []).length !== 1) {
    throw new Error(`rk-price-compare: renok's tick cell holds ${(tickCell.match(/<img\b/g) ?? []).length} images; a value cell is that cell with its one glyph replaced by words`);
  }

  /* The third cell: the donor's own cell, its element, its classes and its inner
     `w-layout-hflex` untouched, with the words standing exactly where the glyph
     stood. `.rt-chart-columns` centres its child and `.rt-desktop-text-center`
     centres the text inside it, so a value sits where a tick sat; the type is
     the body type tools/blocks/rk-price-compare.css restores, the same
     inheritance that draws the period under a price. */
  /* V7-HOME: on the Chinese page a label or a value marks its word boundaries
     (<wbr>, tools/lib-html.mjs zhWbr) and css/stargo-fusion.css (V7-HOME H23)
     breaks it only there and at its spaces: the 108-133px tracks had split
     「语/种」, 「工作/台」, 「标/准」, 「知/识」 and more. English is unchanged. */
  const cellWords = (text) => (lang === 'zh' ? zhWbr(text) : escapeHtml(text));
  const valueCell = (text) => {
    const out = tickCell.replace(IMG, cellWords(text));
    if (out === tickCell) throw new Error(`rk-price-compare: the tick cell has no <img> to put 「${text}」 in place of`);
    return out;
  };

  /* --------------------------------------------------- one row per feature -- */

  const drawn = rows.map((row, i) => {
    /* renok's own rows, re-used in renok's own order, so every emitted row keeps
       a real `data-w-id` and the donor's staggered reveal repeats. */
    const cut = rowCells(donorRows[i % DONOR_ROWS].text, CELL, 'tick cells', iconless);
    let left = setText(cut.head, 'rk-rt-text-color-premium-grey', cellWords(t(row.label)));
    left = dropNodeId(left);
    const cells = row.cells.map((c) => (c.kind === 'tick' ? tickCell : c.kind === 'dash' ? dashCell : valueCell(t(c.text))));
    return left + cells.join('') + cut.tail;
  });

  const html = head
    + tagCut.head + tags.join('') + tagCut.tail
    + priceHead + prices.join('') + priceCut.tail
    + drawn.join('')
    + tail;

  /* ------------------- nothing of renok's own may reach the page, and all of
                          ours must ------------------------------------------ */

  /* Every distinct string of donor copy in the cut. "Features" is in the list
     because this site's word for that header is 能力 / Capability, so renok's
     own has to be gone in both languages. */
  const donorWords = ['>Free<', 'Basic plan', 'Standard plan', 'Premium plan',
    '$0', '$99', '$149', '$199', 'Per month', '>Features<',
    'Unlimited e-mail notification', 'Display personalized message',
    'Send text message instant', 'Send live message notification',
    'Organize contacts into system', 'Create smart segment field policy',
    'Inbuilt malware scanner instant', '24x7 online outstanding support'];
  const left = donorWords.filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-price-compare: donor copy survived: ${left.join(' | ')}`);

  const n = (re) => (html.match(re) ?? []).length;
  const kinds = (k) => rows.reduce((sum, r) => sum + r.cells.filter((c) => c.kind === k).length, 0);
  const ticks = kinds('tick');
  const dashes = kinds('dash');
  const values = kinds('value');
  const check = [
    ['header tags', n(/rk-rt-chart-top-tag/g), PLANS],
    ['price cells', n(/rk-rt-chart-col-1/g), PLANS],
    ['chart rows', n(/rk-rt-pricing-chart-rows/g), M.valueRows.length + M.tickRows.length + 2],
    ['feature cells', n(/class="w-layout-vflex rk-rt-chart-columns"/g), rows.length * PLANS],
    ['cells accounted for', ticks + dashes + values, rows.length * PLANS],
    ['ticks', n(new RegExp(TICK_SVG, 'g')), ticks],
    ['dashes', n(new RegExp(DASH_SVG, 'g')), dashes],
    /* A value cell is the tick cell with its glyph replaced, so every cell that
       is neither tick nor dash has to have lost exactly one image. */
    ['cell images', n(/<img\b/g), ticks + dashes],
    /* The header row's empty cell, and no other: see dropNodeId. */
    ['Webflow node ids', n(/id="w-node-/g), 1],
  ];
  for (const [what, got, want] of check) {
    if (got !== want) throw new Error(`rk-price-compare: rendered ${got} ${what}, expected ${want}`);
  }
  const plain = html.replace(/<wbr>/g, '');   // the word marks are not part of what a cell says
  const unnamed = tiers.filter((p) => !plain.includes(`>${escapeHtml(t(p.name))}<`));
  if (unnamed.length) throw new Error(`rk-price-compare: no column is headed ${unnamed.map((p) => t(p.name)).join(', ')}`);
  const undrawn = rows.flatMap((r) => r.cells.filter((c) => c.kind === 'value').map((c) => t(c.text)))
    .filter((s) => !plain.includes(`>${escapeHtml(s)}<`));
  if (undrawn.length) throw new Error(`rk-price-compare: ${[...new Set(undrawn)].join(', ')} was traced but never reached a cell`);
  const unlabelled = rows.map((r) => t(r.label)).filter((s) => !plain.includes(`>${escapeHtml(s)}<`));
  if (unlabelled.length) throw new Error(`rk-price-compare: no row is labelled ${unlabelled.join(' | ')}`);

  const words = html.replace(/<[^>]+>/g, ' ');
  if (lang === 'zh') {
    /* PRICING's Chinese carries product tokens in capitals — AI, CRM, ERP, SKU,
       SEO, GEO, SLA — and nothing else in Latin belongs on this page. */
    const mixed = (words.match(/[A-Za-z]{2,}/g) ?? []).filter((w) => w !== w.toUpperCase());
    if (mixed.length) throw new Error(`rk-price-compare: English words on the Chinese page: ${[...new Set(mixed)].slice(0, 6).join(', ')}`);
  } else if (/[一-鿿]/.test(words)) {
    throw new Error(`rk-price-compare: Chinese on the English page: ${words.match(/[一-鿿]+/)[0]}`);
  }

  return html;
}
