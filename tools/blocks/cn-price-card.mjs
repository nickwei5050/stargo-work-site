/**
 * 定价页的方案总览卡 — cinery's dark rounded package card, on this site's
 * pricing page.
 *
 * Donor: cinery's `.package-component-grid`, the single block that opens
 * pricing.html's `.section-service-content`. Two columns on a `.5fr 1fr` grid
 * (one column below 992), each a `.package-content-block` — 1px border on the
 * top and left only, `--_sizes---border-radius--xlarge` corners,
 * `--primary-color--dark` (#232324) ground, 2rem of padding (1.5rem ≤479):
 *
 *   LEFT   a one-line heading (`◉ All Features Covered`), a hairline, six
 *          ticked `.pricing-feature-item` rows, a second hairline, a 7rem
 *          `.feature-spacer`, and a closing line behind a refund glyph.
 *   RIGHT  a `.package-inner-grid` of three rows —
 *            row 1  four overlapping `.client-avatar` portraits, five
 *                   `.star-rating` glyphs with a figure after them, a secondary
 *                   line under those, and a `◉` pushed to the far right by
 *                   `.package-content-item { justify-content: space-between }`;
 *                   then a hairline and the price: a struck `.price-text`
 *                   baseline-aligned against a 4rem `h2.prcing-title`, and a
 *                   small unit after it
 *            row 2  four `.benefit-block` lines, each a bold `◉ Name` span and
 *                   a normal-weight `– gloss` after it
 *            row 3  a starred `*` footnote
 *          and beside that grid, a full-width `.main-button`.
 *
 * NOTHING IS CLONED EXCEPT THE TICKED ROW. The donor draws six of them and this
 * site's own list of what the annual subscription contains has five entries
 * (PRICING.panes[0][0].items), so `splitRepeat` re-emits the first row five
 * times rather than five copies being typed out. Every other repeating thing —
 * four portraits, five stars, four benefit lines, two `.button-text` copies —
 * is drawn in the number the donor draws it in and is filled in place.
 *
 * THE PHOTOGRAPHS ARE CINERY'S OWN. `mirror` keeps its default (assets/cinery)
 * and every one of the four portraits is fetched into place unchanged: the
 * brief is a perfect port with only the words changed. What their words say
 * does change — see "the four portraits" in render() — because an `alt` that
 * names a person beside a rating is a customer this company does not have.
 *
 * WHAT THE WORDS BECOME. Every slot is filled from tools/copy.mjs, and every
 * figure in the card is a figure copy.mjs already publishes on this same page:
 * the price and its unit are 标准版's own (`¥10,000`, `/ 年`), the renewal line
 * is 标准版's own renewal, the workforce figure is PRICING.cardStat, and the
 * footnote is the pricing FAQ's own answer about model cost. No price, metric,
 * date, customer or testimonial is invented anywhere in this block. Two slots
 * have no copy.mjs source and are written plain, in the site's register, saying
 * nothing that needs supporting: the struck price line and nothing else — see
 * STRUCK below.
 *
 * ONE LANGUAGE PER PAGE. Everything comes from a `B(zh, en)` pair or from a
 * figure, so the Chinese page carries Chinese and the English page English.
 * STARGO WORK, CRM, AI, SKU and SEO are product names and stand in both.
 *
 * THE CARD'S GROUND IS ITS OWN. `.package-content-block` paints
 * `--primary-color--dark` (#232324) and this site's pricing page paints
 * `--beckground-color--bg-color-02` (#161616) on `.sc-scope.sc-page`
 * (css/stargo-fusion.css:144), so the two columns read as raised panels exactly
 * as they do on cinery's own black. No `ground` is declared: cinery's `body`
 * black is not needed here and painting it would put a black slab across a page
 * that is already dark, in a different dark.
 *
 * WHAT DOES NOT TRAVEL is in tools/blocks/cn-price-card.css: cinery's `body`
 * typography, the five `#w-node-…` grid rules Webflow keeps off the class list,
 * this site's own `p` rule leaking into the button label, where the card sits
 * on our page, and the one hover cinery drives from ix3 — which
 * tools/donor-lib.mjs does not carry. Each is measured and cited there.
 */
import { setText, setTextAll, splitRepeat, DONORS } from '../block-lib.mjs';

export const donor = {
  id: 'cn-price-card',
  donor: 'cinery',
  scope: '.cn-price-card',
  page: 'pricing.html',

  /* The grid, not the section. `.section-service-content` also holds the
     testimonial slider that follows this card — four `.testimonial-slide`s of
     named people at named companies ("Sophia Turner · Marketing Manager at
     Horizon", "Ethan Brooks · Brand Strategist at Beyond", …), which is a wall
     of customers this site does not have — so the cut stops at the grid's own
     closing tag. Both anchors are verified unique in
     tools/templates/cinery/pricing.html: the start string occurs once in the
     file, at byte 13 204, and the end string once, ending at byte 23 894, whose
     last six bytes are exactly the `</div>` that closes
     `.package-component-grid`. The end anchor's four `</div>`s are, in order,
     `.button-text-wrap` (before the `</a>`), then `.price-button`,
     `.package-content-grid` and the grid itself. */
  start: '<div class="w-layout-grid package-component-grid">',
  end: '<p button-text="" class="button-text">Get Started</p></div></a></div></div></div>',

  /* The two ancestors the card's geometry is measured against, outermost first.
     `.package-component-grid` is `width: 100%` with `grid-template-columns:
     .5fr 1fr`, so without them it would be drawn edge to edge at whatever width
     the host hands it — a shape cinery never draws. Put back, the card gets
     cinery's own frame: `.container-large { max-width: 100rem }` (1600px, which
     is to the pixel this site's own `.sc-container` max-width,
     css/scalora-modules.sc.css:343) and `.padding-global { padding-left:
     2.5rem; padding-right: 2.5rem }` (1.25rem ≤767). Wrapping happens before
     namespacing, so both classes are prefixed and both rules are extracted. */
  wrap: ['padding-global', 'container-large'],
};

/* ---------------------------------------------------------- the donor's own --

   Every word the cut ships, in DOM order, so a slot that is missed fails the
   build instead of publishing cinery's copy. `◉` and `*` are markers, not
   words — they are part of the donor's typography and are kept exactly where
   they are drawn, so they are not in this list. */
const DONOR_WORDS = [
  'All Features Covered',
  'Full video production', 'Creative direction', 'Advanced editing',
  'Color grading', 'Final delivery files', 'Professional cinematography',
  '7-day money-back guarantee',
  '4.9/5', 've helped +1k companies',
  '$2999', '$1500', '/ Month',
  'Cinematic Quality', 'High-end visual production',
  'Creative Vision', 'Clear artistic direction',
  'Brand Impact', 'Strong visual brand presence',
  'Smooth Process', 'Organized collaborative workflow',
  'A complete video solution designed to deliver cinematic visuals',
  'Get Started',
];

/** cinery's alt text, on all four portraits. */
const DONOR_ALT = 'alt="Image - Cinery Template"';

/** The donor's CTA points at the page it is drawn on; ours cannot. */
const DONOR_HREF = 'href="pricing.html"';

/**
 * The struck line beside the price. cinery draws a former price there
 * (`$2999`, `text-decoration: line-through`) and this site has no former price:
 * copy.mjs publishes one figure per level and no discount, and inventing a
 * "was" figure is inventing a price. What a struck line can say truthfully is
 * what the price is NOT charged by, and the site already says that in its own
 * words further down this page — PRICING.ctaTitle, 「别买 AI 工具。建 AI 产能。」
 * That headline is printed by the page's own CTA section (tools/build-site.mjs)
 * and must not be printed twice, so the slot carries the same thought in plain
 * register instead: struck 「按工具计价」 against 「¥10,000 / 年」 reads as "not
 * priced per tool — ¥10,000 a year". It asserts no figure, no comparison and no
 * saving. The one slot in this block with no copy.mjs source of its own.
 */
const STRUCK = { zh: '按工具计价', en: 'Priced per tool' };

/* ------------------------------------------------------------ markup tools -- */

/** End index (exclusive) of the `<div>` element beginning at `at`. */
function divEnd(html, at, what) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = at;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { if (--depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  throw new Error(`cn-price-card: ${what} is never closed`);
}

/**
 * The one element opened by this exact tag, and where it ends. Unique by
 * construction: a second copy means the cut is not the shape this module was
 * written against, and filling the first of two silently ships the donor's
 * words in the other.
 */
function region(html, open, what) {
  const at = html.indexOf(open);
  if (at < 0) throw new Error(`cn-price-card: ${what} is not in the cut — expected ${open}`);
  if (html.indexOf(open, at + 1) >= 0) throw new Error(`cn-price-card: ${what} is in the cut twice; expected one`);
  return { at, end: divEnd(html, at, what) };
}

/** Put a rewritten region back. Regions are located one at a time, after the
    previous replacement, so no index outlives the string it was measured in. */
function put(html, r, text) { return html.slice(0, r.at) + text + html.slice(r.end); }

/* ----------------------------------------------------------------- render -- */

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-price-card: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-price-card: donor ${donor.donor} is not registered`);

  const P = C.PRICING;

  /* -------------------------------------------------- what the card is about --

     标准版 — the annual software subscription. It is the one level every priced
     level above it contains ("含标准版年度软件订阅，另加：" opens 上线版, 增长版
     and 全球获客版 in copy.mjs), so it is the only plan whose price can head a
     card that also lists the whole ladder underneath. Located by its own
     shape rather than by index, so a reordered pane fails here instead of
     quietly repricing the card. */
  const base = P.panes?.[0]?.[0];
  if (!base) throw new Error('cn-price-card: PRICING.panes[0][0] is missing');
  if (base.unit !== 'year') throw new Error(`cn-price-card: the entry plan is priced per "${base.unit}", not per year; the unit slot beside the price would be wrong`);
  if (typeof base.price !== 'string' || !/^¥[\d,]+$/.test(base.price)) throw new Error(`cn-price-card: the entry plan's price is ${JSON.stringify(base.price)}, which is not a figure this card can print`);
  if (typeof base.renewal !== 'string' || !/^¥[\d,]+$/.test(base.renewal)) throw new Error(`cn-price-card: the entry plan renews at ${JSON.stringify(base.renewal)}, which is not a figure; the line behind the refund glyph would be an invented one`);

  let html = frag;

  /* =============================================================== the left ==

     `.package-content-block`, addressed by the `#w-node-…` Webflow gave it —
     the only thing that tells the two columns apart, since both carry the same
     class. */
  const LEFT = '<div id="w-node-_28ea525f-125d-38fb-5355-ec1f6c3bb978-6c3bb977" class="cn-package-content-block">';
  {
    const r = region(html, LEFT, 'the left column');
    let left = html.slice(r.at, r.end);

    /* ---- the heading ----------------------------------------------------
       cinery's `◉ All Features Covered` is one line of `.text-size-regular`
       (1rem) at the top of a card whose content box is 437px at 1440
       (501px column − 2 × 2rem padding). It names what the ticks below it are,
       and this site names the same set in its own comparison table further down
       this page: PRICING.compareGroups[0] is titled 「软件订阅」 and its first
       row is 「年度 STARGO WORK 软件订阅」 — measured 235px in Chinese and 296px
       in English, so the line holds at the donor's size in both. Taken from the
       table rather than written here so the card cannot name the subscription
       one way and the table another. The `◉` is cinery's own and is kept. */
    const group = P.compareGroups?.[0];
    if (!group?.rows?.length) throw new Error('cn-price-card: PRICING.compareGroups[0] has no rows');
    const subscription = group.rows[0]?.[0];
    if (!subscription) throw new Error('cn-price-card: PRICING.compareGroups[0].rows[0] has no label');
    left = setText(left, 'cn-text-size-regular', `◉ ${escapeHtml(t(subscription))}`);

    /* ---- the ticked rows ------------------------------------------------
       cinery draws six `.pricing-feature-item`s inside `.pricing-feature-wrap`;
       this site's own list of what the subscription contains has five entries.
       The row is re-emitted five times from the first one rather than five
       copies being written out: each carries a `.check-icon w-embed` holding an
       inline SVG, and a hand-typed copy is a place for the glyph to drift.

       A seventh `.pricing-feature-item` — the refund line — sits OUTSIDE this
       wrap with a different icon, which is why the split is taken inside the
       wrap's own element and not over the whole column. */
    {
      const w = region(left, '<div class="cn-pricing-feature-wrap">', 'the ticked feature list');
      const open = '<div class="cn-pricing-feature-wrap">';
      const inner = left.slice(w.at + open.length, w.end - '</div>'.length);

      const ROW = '<div class="cn-pricing-feature-item">';
      const { head, units, tail } = splitRepeat(inner, ROW, inner.length);
      if (head || tail) throw new Error('cn-price-card: the feature wrap holds something besides its rows');
      if (units.length !== 6) throw new Error(`cn-price-card: cinery ticks six features, found ${units.length}`);

      /* Are the six rows the same row with different words? If they are, one of
         them is a safe template for the other four; if they are not, cloning
         the first would drop whatever the others carry. Compared with their one
         text cell blanked, so only the markup is under test. */
      const skeleton = (u) => u.replace(/(<div class="cn-text-size-regular">)[^<]*(<\/div>)/, '$1$2');
      const shape = skeleton(units[0]);
      units.forEach((u, i) => {
        if (skeleton(u) !== shape) throw new Error(`cn-price-card: ticked row ${i + 1} is not the same markup as row 1; it cannot be cloned from it`);
      });

      const items = base.items ?? [];
      if (!items.length) throw new Error('cn-price-card: the entry plan lists nothing for the ticks to say');
      const rows = items.map((item) => setText(units[0], 'cn-text-size-regular', escapeHtml(t(item))));
      left = put(left, w, open + rows.join('') + '</div>');
    }

    /* ---- the line behind the refund glyph --------------------------------
       cinery puts a guarantee there ("7-day money-back guarantee", 195px), and
       a guarantee is exactly the kind of promise this block may not invent. The
       glyph itself is `.refund-icon`, a circular arrow around a currency mark —
       a renewing payment as much as a returned one — and the site does publish
       one thing about this plan's renewal: PRICING.toggleB names the mode
       (「续费」/"Renewal"), `base.renewal` is its figure and PRICING.unitYear its
       unit, all three straight out of the pricing table this page already
       draws. 「续费 ¥10,000 / 年」 measures ~130px, "Renewal ¥10,000 / year"
       ~160px: both shorter than the line they replace.

       `.text-color-secondary` is on this element and on nothing else in the
       left column, which is what makes it addressable. */
    const renewal = `${t(P.toggleB)} ${base.renewal} ${t(P.unitYear)}`;
    left = setText(left, 'cn-text-color-secondary', escapeHtml(renewal));

    html = put(html, r, left);
  }

  /* ============================================================== the right ==

     Filled region by region. Each region is located immediately before it is
     rewritten, so an index is never carried across a replacement. */

  /* ---- the four portraits ------------------------------------------------
     They stay: they are cinery's own photographs, mirrored into assets/cinery,
     and the brief is a perfect port. Their WORDS do not. cinery announces each
     as "Image - Cinery Template" beside five stars and a customer count, and on
     this site a named portrait in that position asserts a customer that does
     not exist. They are announced as what they are here — decoration behind the
     card's own figures — exactly as tools/blocks/ro-gallery.mjs and
     tools/blocks/qx-orbit.mjs empty theirs. */
  {
    const found = (html.match(new RegExp(DONOR_ALT, 'g')) ?? []).length;
    if (found !== 4) throw new Error(`cn-price-card: cinery draws four portraits, found ${found} × ${DONOR_ALT}`);
    html = html.split(DONOR_ALT).join('alt=""');
  }

  /* ---- the figure beside the stars, and the line under it -----------------
     cinery writes a rating ("4.9/5") and a customer count ("We 've helped +1k
     companies"). Both are metrics about customers, and this block invents
     neither. What the site does publish, and can stand behind, is the size of
     its AI workforce and the sentence it always attaches to that number:
     PRICING.cardStat is `{ value: '288', text: '个 AI 员工，在企业设定的权限
     范围内工作。' / 'AI employees, working inside the permissions the company
     sets.' }` (it used to be read from ENTERPRISE.stats[0]; the enterprise page
     now words its own line differently, and the owner keeps this one). The stat's own comma is where the site itself divides the figure
     from its qualifier, so the figure and its noun go on the star line and the
     qualifier goes on the secondary line under it — which is the shape cinery
     draws. Measured: 「288 个 AI 员工」 ~112px on a star row with ~600px free,
     and the secondary line ~208px in Chinese / ~330px in English against the
     donor's own ~200px.

     The five `.star-rating` glyphs are drawn artwork, not words, and stay where
     they are drawn. Beside a workforce count rather than a score they read as
     ornament, which is the most that can be done without touching markup. */
  {
    const r = region(html, '<div class="cn-client-rating-wrap">', 'the portrait and rating row');
    let row = html.slice(r.at, r.end);

    const stat = P.cardStat;
    if (!stat || !/^\d+$/.test(String(stat.value ?? ''))) throw new Error(`cn-price-card: PRICING.cardStat is ${JSON.stringify(stat?.value)}, not a figure`);
    const said = t(stat.text);
    const split = /^([^，,]+)[，,]\s*([\s\S]+)$/.exec(said);
    if (!split) throw new Error(`cn-price-card: PRICING.cardStat.text no longer divides at a comma — "${said}"`);
    const [, noun, qualifier] = split;

    /* The qualifier is written by copy.mjs as the tail of a sentence, so on the
       English page it begins in lower case. It stands alone here, and cinery's
       own line in this slot is sentence case, so its first letter is raised.
       Chinese has no case and is printed exactly as copy.mjs writes it. */
    const standalone = lang === 'en' ? qualifier[0].toUpperCase() + qualifier.slice(1) : qualifier;

    row = setText(row, 'cn-text-size-regular', escapeHtml(`${stat.value} ${noun}`));
    row = setText(row, 'cn-text-color-secondary', escapeHtml(standalone));
    html = put(html, r, row);
  }

  /* ---- the price ---------------------------------------------------------
     `.price-text` is struck through, `h2.prcing-title` is 4rem (3.5rem ≤991,
     3rem ≤767) and `.text-size-small` is the unit after it. The two figures are
     the entry plan's own, from the same table this page prints below the card;
     the struck line is the one slot with no copy.mjs source and is explained at
     STRUCK above. `¥10,000` carries no letters, so cinery's `h2 {
     text-transform: uppercase }` has nothing to change. */
  {
    const r = region(html, '<div class="cn-price-wrap">', 'the price');
    let price = html.slice(r.at, r.end);
    price = setText(price, 'cn-price-text', escapeHtml(STRUCK[lang]));
    price = setText(price, 'cn-prcing-title', escapeHtml(base.price));
    price = setText(price, 'cn-text-size-small', escapeHtml(t(P.unitYear)));
    html = put(html, r, price);
  }

  /* ---- the four bolded lines ---------------------------------------------
     cinery writes `<span class="text-weight-semibold">◉ Name </span>– gloss`
     four times, and its own spacing is not uniform: line 1 closes the span
     after the name and puts the space before the dash outside it, lines 2–4
     keep a trailing space inside the span. Both patterns are preserved byte for
     byte — the `◉`, the whitespace on either side of the span's close and the
     dash and its spaces are lifted out of each line and put back around the new
     words, so only the words change.

     The four are the four priced levels, in the order copy.mjs prices them —
     标准版 ¥10,000, 上线版 ¥20,000, 增长版 ¥30,000, 全球获客版 ¥40,000 — each with
     the one-line "who it is for" the pricing table already gives it. 企业版
     (定制) and 从一条流程开始 (演示) are not priced in figures and are left to the
     page's own cards. Longest measured line, "◉ Global Acquisition – For teams
     adding three months of configured AI acquisition operation.", is ~720px in
     a 939px row; the Chinese lines run ~380px. */
  {
    const r = region(html, '<div class="cn-benefit-block">', 'the benefit lines');
    const open = '<div class="cn-benefit-block">';
    let block = html.slice(r.at + open.length, r.end - '</div>'.length);

    const LEVELS = [P.panes?.[0]?.[0], P.panes?.[0]?.[1], P.panes?.[0]?.[2], P.panes?.[1]?.[0]];
    LEVELS.forEach((lv, i) => {
      if (!lv) throw new Error(`cn-price-card: priced level ${i + 1} is missing from PRICING.panes`);
      if (typeof lv.price !== 'string' || !/^¥[\d,]+$/.test(lv.price)) throw new Error(`cn-price-card: level ${i + 1} is priced ${JSON.stringify(lv.price)}, not a figure; the four bolded lines are the four priced levels`);
      if (!lv.name || !lv.desc) throw new Error(`cn-price-card: level ${i + 1} has no name or no description`);
    });

    const LINE = /^(<div class="cn-text-size-regular"><span class="cn-text-weight-semibold">)(◉\s*)([^<]*?)(\s*)(<\/span>)(\s*–\s*)([\s\S]*?)(<\/div>)$/;
    const parts = [];
    for (let at = 0; at < block.length;) {
      const next = block.indexOf('<div class="cn-text-size-regular">', at + 1);
      const stop = next < 0 ? block.length : next;
      parts.push(block.slice(at, stop));
      at = stop;
    }
    if (parts.length !== 4) throw new Error(`cn-price-card: cinery writes four benefit lines, found ${parts.length}`);

    block = parts.map((line, i) => {
      const m = LINE.exec(line);
      if (!m) throw new Error(`cn-price-card: benefit line ${i + 1} is not "<span>◉ name</span> – gloss"; found ${line.slice(0, 120)}`);
      const [, openDiv, marker, , pad, closeSpan, dash, , closeDiv] = m;
      return openDiv + marker + escapeHtml(t(LEVELS[i].name)) + pad + closeSpan + dash + escapeHtml(t(LEVELS[i].desc)) + closeDiv;
    }).join('');

    html = put(html, r, open + block + '</div>');
  }

  /* ---- the footnote ------------------------------------------------------
     cinery's `* A complete video solution designed to …` is the card's small
     print, 114 characters of `.text-size-small.text-color-secondary` pinned to
     the foot of its grid row. A card that shows a price and a workforce figure
     needs exactly one piece of small print on this site, and the pricing FAQ
     already writes it: "模型费用包含在内吗？" / "Are model costs included?".
     Looked up by its question rather than by index, so a reordered or reworded
     FAQ fails here instead of silently changing the footnote. The `*` is
     cinery's marker and is kept.

     Addressed by its `#w-node-…` id because `.text-size-small` is also the
     price's unit, three elements above it. */
  {
    const NOTE = '<div id="w-node-_28ea525f-125d-38fb-5355-ec1f6c3bb9d8-6c3bb977" class="cn-text-size-small cn-text-color-secondary">';
    const at = html.indexOf(NOTE);
    if (at < 0) throw new Error('cn-price-card: the footnote element is not in the cut');
    const close = html.indexOf('</div>', at);
    if (close < 0) throw new Error('cn-price-card: the footnote is never closed');

    const asked = { zh: '模型费用包含在内吗？', en: 'Are model costs included?' };
    const pair = (P.faq ?? []).find(([q]) => q?.zh === asked.zh && q?.en === asked.en);
    if (!pair) throw new Error(`cn-price-card: PRICING.faq no longer asks "${asked.zh}"; the card's small print has no source`);
    html = html.slice(0, at + NOTE.length) + `* ${escapeHtml(t(pair[1]))}` + html.slice(close);
  }

  /* ---- the button --------------------------------------------------------
     Two `.button-text` copies stacked in a 1.125rem `overflow: hidden` window,
     which is the roll cinery drives on hover; both say the same thing, so both
     are set. The label is the site's own demo CTA — the plan copy.mjs prices as
     「演示」/"Demo" carries it — because tools/build-site.mjs already sends every
     plan button on this page to the same place ("every plan button books a
     demo"), and this card should not be the one that goes somewhere else.
     `.button-text { text-transform: uppercase }` renders it BOOK A DEMO. */
  {
    const demo = (P.panes ?? []).flat().find((p) => p?.unit === 'demo');
    if (!demo?.cta) throw new Error('cn-price-card: PRICING.panes has no demo plan to take the button label from');
    html = setTextAll(html, 'cn-button-text', escapeHtml(t(demo.cta)));
  }

  /* ---- where the button goes ---------------------------------------------
     cinery's card sits on cinery's pricing page and its button points at
     pricing.html — a link to the page it is drawn on. Ours is drawn on this
     site's pricing page too, so keeping the href would ship a CTA that goes
     nowhere; tools/blocks/cn-service.mjs and tools/blocks/rk-stats.mjs both
     repoint their donor's button the same way.

     `aria-current="page"` goes with it. Webflow writes that attribute (and the
     `w--current` class) only because the href equalled the current page; once
     the href is contact.html the attribute states something false to a screen
     reader, and cinery's own three other `.main-button`s — all href="contact
     .html" — carry neither. The CLASS is kept, because a class is what the
     brief says never to strip and because `w--current` is inert here: it is
     styled nowhere in css/cinery.cn2.css and only in combination with other
     classes (`.w-nav-link`, `.w-tab-link`, `.pricing-tab-link`, …) in this
     site's own sheets, none of which this anchor carries. */
  if (!html.includes(DONOR_HREF)) throw new Error(`cn-price-card: the button no longer carries ${DONOR_HREF}`);
  html = html.split(DONOR_HREF).join('href="contact.html"');
  if (!html.includes(' aria-current="page"')) throw new Error('cn-price-card: aria-current="page" is not on the button; the shape this module was written against has changed');
  html = html.split(' aria-current="page"').join('');

  /* ------------------------------------------------------------- the marks --
     `◉` leads the heading and each bolded line, and one more sits alone in
     `.horizontal-flex` at the far right of the top row. They are cinery's
     typography, not its copy, so nothing above touches them — checked here so a
     rewrite that eats one is caught. cinery draws six: one heading, one alone,
     four bolded. */
  {
    const marks = (html.match(/◉/g) ?? []).length;
    if (marks !== 6) throw new Error(`cn-price-card: cinery draws six ◉ marks, ${marks} survive`);
    if (!/<div class="cn-horizontal-flex"><div class="cn-text-size-medium">◉<\/div><\/div>/.test(html)) {
      throw new Error('cn-price-card: the lone ◉ in .horizontal-flex is not where cinery draws it');
    }
    if (!html.includes('>* ')) throw new Error('cn-price-card: the footnote lost its * marker');
  }

  /* ------------------------------------------------------------ the sweep --
     A slot filled with a regex that did not match is a slot still carrying
     cinery's words, and nothing downstream would notice. */
  for (const word of DONOR_WORDS) {
    if (html.includes(word)) throw new Error(`cn-price-card: donor copy survives — "${word}"`);
  }
  if (html.includes('Cinery')) throw new Error('cn-price-card: the donor is still named in the block');
  /* Only the attributes that FETCH something. `xmlns="http://www.w3.org/2000/svg"`
     is on all eight inline SVGs in this card — the six ticks, the refund glyph
     and the five stars — and is a namespace name, not an address: nothing is
     ever requested from it, and stripping it would break the icons. */
  const offOrigin = html.match(/(?:src|srcset|href)="https?:\/\/[^"]*/) ?? html.match(/url\(["']?https?:\/\/[^)"']*/);
  if (offOrigin) throw new Error(`cn-price-card: an off-origin url survived the cut: ${offOrigin[0]}`);

  return html;
}
