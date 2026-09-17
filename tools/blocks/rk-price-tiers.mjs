/**
 * 定价层级 — renok's "Pricing/Plan" band, carrying this site's five tiers.
 *
 * Donor: the `.rt-pricing-v1` section of renok's index.html. A heading and a
 * paragraph on the left; on the right a Monthly/Annual pill toggle with a
 * "Save 30% with annual" line under it; then two card grids stacked in
 * `.rt-pricing-v1-main` — `.rt-monthly-wrapper` and `.rt-yearly-wrapper` —
 * each holding three `.rt-pricing-card`s. A card is a name, a sentence, a
 * 60px price with a "/ Month" unit, a "What's included" list of six ticked
 * lines, a roll-over button and a period note. One of the three carries an
 * absolutely-positioned "Most popular" pill.
 *
 * WHAT DRIVES THE TOGGLE (and why nothing here touches it)
 *   IX2 event e-1700 (MOUSE_CLICK on `.rt-toggle`, data-w-id …3065dd80) runs
 *   action list a-35 "Toggle ball tap in"; e-1701 runs a-36 "Toggle ball tap
 *   out". a-35 carries `useFirstGroupAsInitialState: true`, so its first group
 *   is the state the page loads in:
 *
 *     group 1 (initial)  .rt-yearly-wrapper  display none    .rt-monthly-wrapper display block
 *                        .rt-monthly  #fff   .rt-yearly  #fff at 50% alpha
 *                        .rt-toggle-ball.rt-one scale 1     .rt-two scale .2
 *                        .rt-monthly-line width 100%        .rt-yearly-lin width 0%
 *     group 2 (click)    the same eight, swapped, 500ms
 *
 *   Every one of those targets is addressed by CLASS, not by node id, and
 *   tools/donor-lib.mjs rewrites the selectors in the payload with the `rk-`
 *   namespace exactly as it rewrites the markup. So the toggle keeps working
 *   with any number of cards inside the two wrappers: this module never
 *   touches `.rt-monthly-wrapper`, `.rt-yearly-wrapper`, `.rt-toggle` or the
 *   entrance reveal on `.rt-pricing-toggle-wrap` (e-1698 → a-25). renok has no
 *   ix3 timeline and no inline GSAP on this page — checked, `gsap` does not
 *   appear in index.html — so nothing has to be replayed as keyframes and
 *   tools/blocks/rk-price-tiers.css ships no motion.
 *
 * WHAT THE TWO STATES BECOME
 *   The donor's toggle switches a price *period*. So does ours, and copy.mjs
 *   already names both states: PRICING.toggleA 首年价格 / First-year total and
 *   PRICING.toggleB 续费 / Renewal. tools/build-site.mjs maps Scalora's own
 *   "Pay monthly" / "Pay yearly (save 30%)" onto exactly that pair for
 *   pricing.html, and the renewal figures come out of PRICING by the same rule
 *   that page already uses (see `renewPrice`/`renewUnit` below), so the two
 *   pricing surfaces cannot disagree. renok's "Save 30% with annual" is a
 *   discount this company does not offer; the three cells that drew it now
 *   carry PRICING.faq's own sentence about renewal — 「软件订阅按年续费」 —
 *   split across them, with the numeral in the numeral's pill.
 *
 * FIVE TIERS IN A GRID DRAWN FOR THREE
 *   PRICING.panes holds six entries; five of them are priced tiers (标准版,
 *   上线版, 增长版, 全球获客版, 企业版) and the sixth, 「从一条流程开始」, is a
 *   demo card, not a level — it is filtered out by `unit === 'demo'` and the
 *   count is asserted. splitRepeat() cuts the donor's three cards out of each
 *   grid and the five are emitted from those three units:
 *
 *     tier 0 标准版    plain card, border-right      donor card 1
 *     tier 1 上线版    plain card, border-right      donor card 1
 *     tier 2 增长版    featured, at a row's edge     donor card 2, border dropped
 *     tier 3 全球获客版 featured, border-right        donor card 2
 *     tier 4 企业版    plain card, at the row's edge donor card 3
 *
 *   `.rt-pricing-card.rt-border-right` is renok's own positional class — its
 *   own card 3 is the borderless form — so the only thing decided here is
 *   which of the two class lists a card gets, by the donor's own rule: every
 *   card except the one at its row's right edge carries the border.
 *
 *   The list inside a card repeats too: renok writes six `.rt-pricing-card-items`
 *   and every tier in PRICING has five, so five of the six donor rows are
 *   emitted and the sixth is dropped. Same mechanism, same splitRepeat().
 *
 * WHERE THE GRID ITSELF HAD TO BE TOLD OUR COUNT
 *   `.rt-pricing-cards-grid { grid-template-columns: 1fr 1fr 1fr }` is the one
 *   rule in the donor that encodes how many plans renok ships. Five cards in it
 *   wrap 3 + 2 and leave the sixth cell of the bordered box empty — measured at
 *   1440 that is a 464px × 772px hole with the grid's own border down its right
 *   side. tools/blocks/rk-price-tiers.css re-states that one rule with our
 *   count (six tracks; the first three cards span two, the last two span three)
 *   so the first row keeps the donor's exact 464.44px card and the second row
 *   fills the box. Nothing else about the card changes. See that file for the
 *   measurements.
 *
 * WHAT WAS MEASURED BEFORE THE WORDS WERE CHOSEN
 *   Every slot below was measured in renok's own page, at 1440 with renok's own
 *   Inter Tight, against the box it has to sit in:
 *     "Most popular"   68.0px  in `.rt-popular-wrapper`, a fixed 86.4px pill.
 *                      推荐方案 is 48.0px and fits; PRICING.featuredBadge's
 *                      English, "Our recommendation", is 109.3px and does not,
 *                      so the English page takes the shorter form of the same
 *                      claim (see WORDS.badgeEn).
 *     price row        `.rt-card-price` = price + .7rem + unit, in 404.44px of
 *                      card (464.44 less 2 × 1.875rem). Worst first-year row is
 *                      ¥40,000 (222.3px) + 11.2 + "/ first year total"
 *                      (102.2px) = 335.7px; worst renewal row is 联系我们
 *                      (232.8px) + 11.2 + "/ 年" (24.7px) = 268.7px. Both hold.
 *     "// Basic"       `.rt-text-style-h4`, 24px/600. Longest name is
 *                      "// Global Acquisition" at 200.8px, and that tier sits
 *                      in the second row where the card is 636px wide.
 *     the save line    `.rt-pricing-save-wrapper` in a 35% column (488px at
 *                      1440): 184.3 + 7 + 35.4 + 7 + 39.1 = 272.8px in English.
 *                      The pill is a fixed 2.21rem/35.36px box and renok fills
 *                      it with "30%" at 23.2px; "12" is 11.0px.
 *
 * ONE LANGUAGE PER PAGE
 *   「不是所有的观众都能看得懂英文」. Every string is resolved through ctx.t and
 *   the render throws if a mixed-case Latin word reaches the Chinese page —
 *   the all-caps product tokens PRICING itself uses (AI, CRM, SKU, SEO, GEO,
 *   FAQ) are the only Latin allowed there — or if a Han character reaches the
 *   English one.
 */
import { setText, setTextAll, splitRepeat } from '../block-lib.mjs';

export const donor = {
  id: 'rk-price-tiers',
  donor: 'renok',
  scope: '.rk-price-tiers',
  page: 'index.html',
  /* The whole section. `.rt-pricing-v1 rt-background-black` occurs once in
     index.html, and `.rt-background-black` paints the section itself
     (`background-color: var(--black)`), so unlike rk-stats this block needs no
     `ground` — it brings its own. The end anchor is the last card's period
     note and the seven closers behind it; it too occurs once in the page. */
  start: '<section class="rt-pricing-v1 rt-background-black">',
  end: '<div>Billed yearly</div></div></div></div></div></div></div></section>',
  /* renok ships one stylesheet, so `css` can be inferred; the only image in the
     cut is the tick beside every feature line (`…_pricing-arrow.svg`, 36 uses,
     one file). It is renok's own and it stays: `mirror` keeps its default and
     try-block fetches it, so there is no `imageStems` here. */
};

/* ------------------------------------------------------- the donor's shape -- */

/* Written against the PREFIXED classes, because render() is handed the
   fragment after tools/donor-lib.mjs has namespaced it. `donor.start` and
   `donor.end` above are the opposite: they are matched against renok's raw
   html, before the prefix exists. */
const MONTHLY = '<div class="rk-rt-monthly-wrapper">';
const YEARLY = '<div class="rk-rt-yearly-wrapper">';
const GRID = '<div class="rk-rt-pricing-cards-grid">';
const ITEM = '<div class="w-layout-vflex rk-rt-pricing-card-items">';
/* The two class lists renok gives a card. The trailing space in CARD_BORDERED
   is what keeps it off `.rt-pricing-card-v3-top`, `-v3-list`, `-items` and
   `-bottom`, every one of which also opens `w-layout-vflex rk-rt-pricing-card…`. */
const CARD_BORDERED = '<div class="w-layout-vflex rk-rt-pricing-card rk-rt-border-right">';
const CARD_PLAIN = '<div class="w-layout-vflex rk-rt-pricing-card">';
const CARD_OPEN = /^<div class="w-layout-vflex rk-rt-pricing-card( rk-rt-border-right)?">/;

/** How many cards stand in the first row; tools/blocks/rk-price-tiers.css agrees. */
const PER_ROW = 3;
/** The number of tiers that grid rule is written for. */
const TIERS = 5;
/** renok's own count of feature rows per card. */
const DONOR_ROWS = 6;

/* The three labels copy.mjs has no entry for, because its own pricing page
   draws them differently. None of them states a fact about the product:
   `included` names the list under it, and `save` is PRICING.faq's sentence
   about renewal — 「软件订阅按年续费」 / "The software subscription follows its
   annual renewal terms" — split across the three cells renok drew "Save",
   "30%" and "with annual" in, with the numeral kept in the numeral's pill.
   `badgeEn` is PRICING.featuredBadge said short enough to fit an 86.4px pill;
   see the measurements at the top of this file. */
const WORDS = {
  included: { zh: '包含内容', en: 'What’s included' },
  save: {
    zh: ['软件订阅每', '12', '个月续费'],
    en: ['Software subscription renews every', '12', 'months'],
  },
  badgeEn: 'Recommended',
};

/* ------------------------------------------------------------ markup tools -- */

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
  throw new Error(`rk-price-tiers: ${what} is never closed`);
}

/** Replace an exact donor string that must appear exactly `n` times. */
function swap(html, from, to, what, n = 1) {
  const found = html.split(from).length - 1;
  if (found !== n) throw new Error(`rk-price-tiers: expected ${n} × ${what} (${from}), found ${found}`);
  return html.split(from).join(to);
}

/** Put a card into one of renok's own two class lists. */
function border(card, on) {
  const m = CARD_OPEN.exec(card);
  if (!m) throw new Error(`rk-price-tiers: a card does not open on renok's card class list: ${card.slice(0, 90)}`);
  return (on ? CARD_BORDERED : CARD_PLAIN) + card.slice(m[0].length);
}

/* ----------------------------------------------------------------- render -- */

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  const P = C.PRICING;
  if (!P?.panes) throw new Error('rk-price-tiers: copy.mjs exports no PRICING.panes');

  /* ---- the tiers ---- */

  /* Five priced levels across the two panes copy.mjs groups them in; the sixth
     entry is the demo card (`unit: 'demo'`), which is an invitation rather than
     a level and has no place in a row of prices. */
  const tiers = P.panes.flat().filter((p) => p.unit !== 'demo');
  if (tiers.length !== TIERS) {
    throw new Error(`rk-price-tiers: PRICING lists ${tiers.length} priced tiers; the grid rule in rk-price-tiers.css is written for ${TIERS} (${PER_ROW} + ${TIERS - PER_ROW})`);
  }
  if (!tiers.some((p) => p.featured)) throw new Error('rk-price-tiers: no tier carries `featured`, so renok\'s badged card would go unused');

  /* The two columns, by the rule tools/build-site.mjs already applies to this
     site's pricing page: the first shows what a tier costs in year one, the
     second what it renews at — a figure, 联系我们 when the renewal is quoted,
     or the tier's own 定制 when the whole plan is custom. Reproduced here so
     the band and the page below it cannot state different money. A quoted
     renewal is a phrase, not a yearly figure, so it carries no 「/ 年」 unit
     (V7-HOME: it read 「联系我们 / 年」, "Ask us / year"). */
  const unitOf = (u) => (u === 'year' ? t(P.unitYear) : u === 'first' ? t(P.unitFirst) : '');
  const firstPrice = (p) => t(p.price);
  const firstUnit = (p) => unitOf(p.unit);
  const renewPrice = (p) => (p.renewal === 'ask' ? t(P.renewalPrice) : p.renewal === 'custom' ? t(p.price) : p.renewal);
  const renewUnit = (p) => (p.renewal === 'ask' ? '' : unitOf(p.unit === 'first' ? 'year' : p.unit));
  for (const p of tiers) {
    for (const [what, v] of [['price', firstPrice(p)], ['renewal', renewPrice(p)]]) {
      if (typeof v !== 'string' || !v) throw new Error(`rk-price-tiers: tier ${t(p.name)} has no ${what}`);
    }
  }

  const badge = lang === 'zh' ? t(P.featuredBadge) : WORDS.badgeEn;

  /* ---- the cut ---- */

  const monAt = frag.indexOf(MONTHLY);
  const yearAt = frag.indexOf(YEARLY);
  if (monAt < 0 || yearAt < 0) throw new Error('rk-price-tiers: the two toggle panes (.rt-monthly-wrapper / .rt-yearly-wrapper) are not both in the cut');
  if (monAt > yearAt) throw new Error('rk-price-tiers: renok draws the monthly pane first; the cut has them the other way round');

  let head = frag.slice(0, monAt);
  const panes = [frag.slice(monAt, yearAt), frag.slice(yearAt)];

  /* ---- the heading, the toggle and the line under it ---- */

  /* PRICING.title carries a `<span class="sub-title-text">` for the Scalora
     page's two-tone heading; renok's h2 is one text node and gains no element
     here, so the span is dropped and the words kept. */
  head = setText(head, 'rk-rt-gap-off', escapeHtml(t(P.title).replace(/<[^>]*>/g, '')));
  /* That heading is PRICING.title, the page's own promise, and the pricing page
     has no other h1 (cinery's 合适 / 配置 wordmark above it is two h2 line
     boxes). So it is the page's one h1. renok styles it through
     `.rk-price-tiers h2` element rules; tools/blocks/rk-price-tiers.css
     re-states those for this h1 so it draws exactly as before. */
  head = swap(head, '<h2 class="rk-rt-gap-off">', '<h1 class="rk-rt-gap-off">', 'the section heading');
  {
    const at = head.indexOf('<h1 class="rk-rt-gap-off">') + '<h1 class="rk-rt-gap-off">'.length;
    const close = head.indexOf('</h2>', at);
    if (close < 0 || head.slice(at, close).includes('<')) throw new Error('rk-price-tiers: the section heading does not close right after its text');
    head = head.slice(0, close) + '</h1>' + head.slice(close + '</h2>'.length);
  }

  /* The paragraph beside the heading is PRICING's own answer to 「我们该从哪一级
     开始？」 — the question a row of five levels puts to the reader. Found by the
     question rather than by index, so re-ordering the FAQ cannot silently change
     what this band says. */
  const startHere = P.faq?.find(([q]) => /哪一级/.test(q.zh));
  if (!startHere) throw new Error('rk-price-tiers: PRICING.faq no longer answers 我们该从哪一级开始 — that answer is this section\'s lead paragraph');
  head = setText(head, 'rk-rt-text-color-light-gray', escapeHtml(t(startHere[1])));

  head = swap(head, '>Monthly</div>', `>${escapeHtml(t(P.toggleA))}</div>`, 'the first toggle label');
  head = swap(head, '>Annual</div>', `>${escapeHtml(t(P.toggleB))}</div>`, 'the second toggle label');

  /* Three cells, and the middle one is a fixed 35.36px pill renok fills with a
     numeral. The `<br/>` is renok's own and stays inside it. */
  const [saveA, saveB, saveC] = WORDS.save[lang] ?? [];
  if (!saveC) throw new Error(`rk-price-tiers: no save line written for lang ${lang}`);
  head = swap(head, '>Save</div>', `>${escapeHtml(saveA)}</div>`, 'the save line\'s first cell');
  head = swap(head, '>30%<br/></div>', `>${escapeHtml(saveB)}<br/></div>`, 'the save line\'s pill');
  head = swap(head, '>with annual</div>', `>${escapeHtml(saveC)}</div>`, 'the save line\'s last cell');

  /* ---- one card ---- */

  const fillCard = (card, tier, price, unit, note) => {
    /* renok's six feature rows; ours are however many PRICING gives the tier,
       each row emitted from a donor row rather than hand-written. */
    const lastItem = card.lastIndexOf(ITEM);
    if (lastItem < 0) throw new Error(`rk-price-tiers: the ${t(tier.name)} card has no .rt-pricing-card-items to repeat`);
    const rows = splitRepeat(card, ITEM, divEnd(card, lastItem, 'a feature row'));
    if (rows.units.length !== DONOR_ROWS) throw new Error(`rk-price-tiers: renok writes ${DONOR_ROWS} feature rows per card, found ${rows.units.length}`);
    if (!tier.items?.length) throw new Error(`rk-price-tiers: tier ${t(tier.name)} lists no items`);

    let top = rows.head;

    /* renok leads every card name with its own `//`. The marker is copied out
       of the donor text rather than retyped, so its glyphs and its spacing
       travel unchanged — the same line cn-service takes with its `▶︎`. */
    const h4 = /<div class="rk-rt-text-style-h4">([^<]*)<\/div>/.exec(top);
    if (!h4) throw new Error(`rk-price-tiers: the ${t(tier.name)} card has no .rt-text-style-h4 to name it`);
    const marker = h4[1].replace(/[A-Za-z][\s\S]*$/, '');
    if (!marker.includes('//')) throw new Error(`rk-price-tiers: a card name lost the // renok draws it with (found ${JSON.stringify(h4[1])})`);
    top = setText(top, 'rk-rt-text-style-h4', marker + escapeHtml(t(tier.name)));

    /* The one `.rt-text-color-premium-grey` above the list is the card's
       sentence; the rest of them are feature lines and are filled below. */
    top = setText(top, 'rk-rt-text-color-premium-grey', escapeHtml(t(tier.desc)));

    top = setText(top, 'rk-rt-medium-text', escapeHtml(price));
    const units = (top.match(/class="[^"]*(?<![-\w])rk-rt-text-color-light-gray(?![-\w])/g) ?? []).length;
    if (units !== 1) throw new Error(`rk-price-tiers: a card should hold one price unit, found ${units}`);
    top = setText(top, 'rk-rt-text-color-light-gray', escapeHtml(unit));

    top = setText(top, 'rk-rt-text-style-h6', escapeHtml(t(WORDS.included)));

    /* The badge is an absolutely-positioned pill that only renok's middle card
       ships, so a featured tier must have been given that card and a plain one
       must not have been. */
    const badged = top.includes('rk-rt-popular-wrapper');
    if (Boolean(tier.featured) !== badged) {
      throw new Error(`rk-price-tiers: tier ${t(tier.name)} is ${tier.featured ? '' : 'not '}featured but was given the ${badged ? 'badged' : 'plain'} donor card`);
    }
    if (badged) top = setText(top, 'rk-rt-text-color-black', escapeHtml(badge));

    const lines = tier.items.map((line, i) => setText(rows.units[i % rows.units.length], 'rk-rt-text-color-premium-grey', escapeHtml(t(line))));

    /* The button keeps two copies of its label, one rolling up behind the
       other. Every plan button goes to contact.html, exactly as the plan
       buttons on this site's own pricing page do. */
    let bottom = setTextAll(rows.tail, 'rk-rt-button-text', escapeHtml(t(tier.cta)));
    bottom = swap(bottom, 'href="pricing.html"', 'href="contact.html"', 'the plan button\'s link');
    const notes = bottom.match(/<div>Billed\s+(?:monthly|yearly)<\/div>/g) ?? [];
    if (notes.length !== 1) throw new Error(`rk-price-tiers: a card should carry one period note, found ${notes.length}`);
    bottom = bottom.replace(notes[0], `<div>${escapeHtml(note)}</div>`);

    return top + lines.join('') + bottom;
  };

  /* ---- one pane ---- */

  const fillPane = (pane, price, unit, note) => {
    const gridAt = pane.indexOf(GRID);
    if (gridAt < 0) throw new Error('rk-price-tiers: a toggle pane has no .rt-pricing-cards-grid');
    const gridEnd = divEnd(pane, gridAt, 'the cards grid');
    const inner = pane.slice(gridAt + GRID.length, gridEnd - '</div>'.length);

    /* renok's three: two bordered, then the borderless one at the row's right
       edge. splitRepeat takes the two that share an open tag and hands the
       third back as the tail. */
    const plainAt = inner.indexOf(CARD_PLAIN);
    if (plainAt < 0) throw new Error('rk-price-tiers: a pane has no borderless last card');
    const cut = splitRepeat(inner, CARD_BORDERED, plainAt);
    if (cut.head !== '') throw new Error('rk-price-tiers: the cards grid holds something before its first card');
    if (cut.units.length !== 2) throw new Error(`rk-price-tiers: renok draws two bordered cards per grid, found ${cut.units.length}`);
    if (divEnd(inner, plainAt, 'the last card') !== inner.length) throw new Error('rk-price-tiers: the cards grid holds something after its last card');
    const donorCards = [...cut.units, cut.tail];

    const built = tiers.map((tier, i) => {
      /* renok's own rule: every card except the one at its row's right edge
         carries the divider. */
      const atEdge = i === PER_ROW - 1 || i === tiers.length - 1;
      const base = tier.featured ? donorCards[1] : atEdge ? donorCards[2] : donorCards[0];
      return fillCard(border(base, !atEdge), tier, price(tier), unit(tier), note);
    });

    return pane.slice(0, gridAt + GRID.length) + built.join('') + pane.slice(gridEnd - '</div>'.length);
  };

  const html = head
    + fillPane(panes[0], firstPrice, firstUnit, t(P.toggleA))
    + fillPane(panes[1], renewPrice, renewUnit, t(P.toggleB));

  /* ---- fail loudly rather than ship a slot that quietly missed ---- */

  /* "What’s included" is deliberately absent from this list: it is renok's own
     generic label for the list under it, it is what this site would write in
     English, and WORDS.included keeps it verbatim on the English page. */
  const donorWords = ['Basic plan', 'Standard plan', 'Premium plan', 'Select plan',
    'Most popular', 'Billed', 'with annual', 'custom-designed', 'Email support',
    'Simple animations', 'Speed optimization', 'pricing.html', '>Monthly<', '>Annual<'];
  const left = donorWords.filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-price-tiers: donor copy survived: ${left.join(', ')}`);
  if (/\$\d/.test(html)) throw new Error('rk-price-tiers: a donor dollar price survived');

  const words = html.replace(/<[^>]+>/g, ' ');
  if (lang === 'zh') {
    /* PRICING's Chinese carries product tokens in capitals — AI, CRM, SKU,
       SEO, GEO, FAQ — and nothing else in Latin belongs on this page. */
    const mixed = (words.match(/[A-Za-z]{2,}/g) ?? []).filter((w) => w !== w.toUpperCase());
    if (mixed.length) throw new Error(`rk-price-tiers: English words on the Chinese page: ${[...new Set(mixed)].slice(0, 6).join(', ')}`);
  } else if (/[一-鿿]/.test(words)) {
    throw new Error(`rk-price-tiers: Chinese on the English page: ${words.match(/[一-鿿]+/)[0]}`);
  }

  return html;
}
