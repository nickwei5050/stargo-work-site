/**
 * 定价页的评价栏 — cinery's testimonial slider, carrying four illustrative
 * scenarios instead of four customers.
 *
 * Donor: cinery's `.testimonial-component`, the band that closes the pricing
 * page's plan column (tools/templates/cinery/pricing.html, between the
 * `.spacer-small` under the last plan card and the `.dividing-line` above the
 * FAQ). It is a Webflow slider of four slides. Each slide is one card:
 *
 *   .testimonial-content-wrap            #232324 panel, 2.5rem radius, 10px pad
 *     .testimonial-grid                  two columns, 3rem gap, 100% height
 *       .testimonial-image-wrap          a portrait, `cover-image`, 2rem radius
 *       .testimonial-content-block       2rem/2.5rem padding, position:relative
 *         .testimonial-content-grid      two rows, auto auto
 *           .testimonial-content         the rating line, a hairline, the quote
 *             .rating-wrap                 "4.9/5" · "-" · five 1rem stars
 *             .dividing-line
 *             p.text-size-large            the pull quote, 2rem
 *           .testimonial-content          `align-self: end` (a #w-node rule)
 *             img.cliente-logo             a client logo at opacity .5
 *             .testimonial-info            a name (1.25rem) over a role (1rem)
 *         img.quote-icon                 a 6rem “ at opacity .03, bottom right
 *
 * and under the slider sit two half-width bars — `.left-arrow` / `.right-arrow`,
 * `inset: auto … -5rem …`, each a rolling arrow beside a rolling word.
 *
 * WHAT THE WORDS BECOME — and why none of them is a customer
 *   This company has no public customer testimonials, so not one word in this
 *   band may read as one. copy.mjs already solved the same problem once: the
 *   Mono homepage keeps its template's testimonial design and fills it with
 *   four scenarios in an example trade company, each labelled 「示例场景」 /
 *   "illustrative scenario" on the speaker's own line (HOME_MONO, the block of
 *   entries under the comment "sticky cards → the intelligence layer as four
 *   illustrative scenarios"). Those four are read straight out of HOME_MONO
 *   here — quote, speaker, concept — so this page cannot say anything the site
 *   does not already say, and a change there changes both pages at once.
 *
 *     .rating-wrap's score   → the band's own label, `(示例场景)`, in the site's
 *                              parenthesised eyebrow form ((定价), (联系)). A
 *                              score is a claim about customers; the label is
 *                              what CONTACT.quoteLabel does to the same slot on
 *                              the contact page, where `★★★★★` became a
 *                              label too — `(先从一条业务开始)` since V6
 *                              (2026-09-16), `(我们的承诺)` before it.
 *     .rating-wrap's "-"     → kept. cinery's separator glyph, the way
 *                              cn-service keeps its `◉` and its `▶︎`.
 *     p.text-size-large      → the scenario's quote
 *     .text-size-medium      → the speaker: `外贸业务员 · 示例场景`
 *     .text-size-regular     → the concept the scenario shows — since V6
 *                              (2026-09-16) 理解企业 · 业务背景, 按业务落地,
 *                              主动提醒, 从结果改进
 *     .slide-text ×4         → 上一条 / 下一条 (English keeps Previous / Next,
 *                              which are the plain words for the control and
 *                              carry nothing of cinery's)
 *
 * WHAT THE PICTURES BECOME
 *   The four portraits are cinery's own and stay — the imagery decision is a
 *   perfect port, so `mirror` keeps its default (assets/cinery) and try-block
 *   fetches client-01..04 and the quote glyph into place. The four logoipsum
 *   marks do NOT stay: a client logo in a client-logo slot asserts a customer.
 *   They are replaced by this site's own wordmark, exactly as
 *   tools/blocks/rk-testimonials.mjs replaces renok's "Cairo" — replaced rather
 *   than dropped, so the card keeps the donor's three-part bottom row.
 *
 * FOUR AND FOUR
 *   cinery draws four slides and copy.mjs carries four illustrative scenarios,
 *   so nothing is cloned: the units are cut with splitRepeat() and filled where
 *   they stand, each keeping its own `#w-node-…` ids (which are what place the
 *   portrait and stack it on phones) and its own portrait. If the two counts
 *   ever disagree the block throws rather than re-emitting a unit, because a
 *   cloned slide would repeat a face — the one thing in this band that is not
 *   interchangeable.
 *
 * THE SLIDER DOES NOT TURN BY ITSELF — read this before deleting cn-reviews.js
 *   `.w-slider` is a Webflow COMPONENT, not an IX2 interaction: its behaviour
 *   lives in the `slider` module of Webflow's runtime, and this site does not
 *   ship it. Checked: `define("slider"` appears in none of js/app.fused.js,
 *   js/app.schunk.25099a4fefa544e6.js or js/app.schunk.e0c428ff9737f919.js
 *   (which between them define brand, dropdown, edit, focus, forms, lightbox,
 *   links, lottie, navbar, scroll and touch), and `w-slider` appears in none of
 *   them either. cinery's own exported bundle does not carry it. Left alone the
 *   band would show slide 1 and clip the other three behind
 *   `.w-slider-mask { overflow: hidden }`, and both arrows would be dead.
 *   tools/blocks/cn-reviews.js replays the component from the slider element's
 *   own `data-*` attributes — the numbers asserted at the foot of render() —
 *   and this module changes no attribute it reads. It cannot be a CSS keyframe
 *   replay: four slides in one nowrap row cannot wrap forward from the fourth
 *   to the first without a fifth box to slide in from, so the donor's
 *   `data-infinite="true"` has nowhere to land, and `data-hide-arrows="false"`
 *   is a control, which no keyframe can be.
 *
 *   *** WIRING, and why it has to stay. tools/capability-donors.mjs
 *   concatenates every tools/blocks/<id>.js into js/capability-blocks.js, so
 *   the page that carries this band has to link that file as well as
 *   css/cinery.cn2.css. Both tags are on pricing.html today (verified
 *   2026-09-15: `css/cinery.cn2.css` in <head>, `js/capability-blocks.js`
 *   `defer` at the foot, and the block itself under `.cn-reviews`), and the
 *   script tag is the one of the two whose absence is silent — without the
 *   stylesheet nothing is drawn and you see it immediately, but without the
 *   script the band still renders cinery's first card exactly as drawn, and
 *   only three scenarios clipped behind `.w-slider-mask { overflow: hidden }`
 *   and two dead arrows say anything is wrong. If this block is ever moved to
 *   another page, move both tags with it. ***
 */
import { setText, setTextAll, splitRepeat } from '../block-lib.mjs';

/* V7-LX: the Chinese quote's word boundaries. The scenario quotes are shared
   copy (HOME_MONO) and are not reworded here; the band only marks where a
   word ends, with a <wbr> between two words that are both Chinese (ICU's
   word segmentation, at build time), and css/stargo-fusion.css (V7-LX) lets
   the line break only there and at punctuation. Before, the quotes split
   「资/料」 at 1440 and left 「进。」」 alone at 390. English is unchanged. */
const ZH_WORDS = new Intl.Segmenter('zh', { granularity: 'word' });
const HAN = /[\u3400-\u9fff]/;
function zhQuote(text, escapeHtml) {
  const parts = [...ZH_WORDS.segment(text)].map((s) => s.segment);
  if (parts.join('') !== text) throw new Error('cn-reviews: word segmentation changed the quote');
  /* Only two words of two or more characters may part. A one-character word
     stays with its neighbours — ICU reads 负责人 as 负责 + 人 and 放在一起 as
     放 + 在一起, and 「负责」/「人、」 or 「放」/「在一起」 is not a break. */
  const joins = (i) => HAN.test(parts[i - 1].slice(-1)) && HAN.test(parts[i][0])
    && parts[i - 1].length > 1 && parts[i].length > 1;
  return parts.map((p, i) => (i && joins(i) ? '<wbr>' : '') + escapeHtml(p)).join('');
}

/** This site's own mark, in the slot cinery filled with a client's. */
const WORDMARK = 'assets/brand/stargo-wordmark.png';

/**
 * The band's label, in the rating slot cinery filled with a score.
 * `示例场景` is copy.mjs's own word for a card of this kind; the parentheses are
 * the site's eyebrow form ((定价), (联系), (Pricing), (Contact)). Asserted
 * against every speaker line below, so it cannot drift from copy.mjs.
 */
const LABEL = { zh: '(示例场景)', en: '(Illustrative scenario)' };

/**
 * The two slider controls. copy.mjs has no words for them — nothing else on the
 * site is a slider — so these are the plain words for the control, in the
 * register: 「条」 counts entries, which is what these are. The English page
 * keeps cinery's own two words because they are already the correct English for
 * a previous/next control and carry nothing of the template's voice.
 */
const PREV = { zh: '上一条', en: 'Previous' };
const NEXT = { zh: '下一条', en: 'Next' };

/** cinery's alt text, and what each becomes. Counts are asserted. */
const ALTS = {
  /* The portraits. The card's own name and role line say what it is about, so
     the face beside them is decoration — the line rk-testimonials takes with
     renok's avatars, and qx-orbit with its eight orbit photographs. */
  'Image - Cinery Template': '',
  /* A 6rem quotation glyph at `opacity: .03` behind the corner of the card. */
  'Quote Icon - Cinery Template': '',
  /* Now this site's wordmark; see `imageStems` below. */
  'Partner Logo - Cinery Template': 'STARGO',
};

export const donor = {
  id: 'cn-reviews',
  donor: 'cinery',
  scope: '.cn-reviews',
  page: 'pricing.html',

  /* The component, not the section: cinery's `.section-service-content` runs
     from the plan cards at the top of its pricing page all the way down to this
     band, and cutting it would drag three pricing tables onto our own pricing
     page. Both anchors are unique in the donor file (checked: one
     `.testimonial-component`, one `.slide-nav`). The end anchor closes the nav,
     then the slider, then the component — the whole element, balanced. */
  start: '<div class="testimonial-component">',
  end: '<div class="slide-nav w-slider-nav"></div></div></div>',

  /* The ancestors that give the band its gutters, its measure and its foot,
     outermost first, in the donor's own nesting:
       .padding-global               padding-left/right 2.5rem (1.25rem ≤767)
       .container-large              width 100%, max-width 100rem, centred
       .padding-bottom.padding-xhuge padding 0 0 8rem (6rem ≤991, 5rem ≤767)
     The last one is what holds the arrows clear: they hang `-5rem` below a
     slider that already has `margin-bottom: 4rem`, so without a foot they would
     sit on whatever follows the block. `.section-service-content` is not
     wrapped back — it carries no rules at all in cinery's stylesheet, and the
     block's own root is the section here. */
  wrap: ['padding-global', 'container-large', 'padding-bottom padding-xhuge'],

  /* Four different logoipsum marks, one per card, all of them a client's logo
     in a client-logo slot. A stem catches all four and any responsive variant
     in one line. Nothing else is mapped: the four portraits and the quote glyph
     are cinery's own and `mirror` (the default, assets/cinery) keeps them. */
  imageStems: { logoipsum: WORDMARK },

  /* cinery's `body { background-color: var(--background-color--primary-background) }`
     is `#000`, and it is the only ground this band ever had: the slider itself
     is `var(--border-color--transparent)`, i.e. `#0000`. The card inside it is
     `--primary-color--dark` (#232324) with a `#ffffff1a` hairline on two edges,
     and both arrows are the same #232324 — a panel that only reads as a panel
     against cinery's black. This site's pricing page is `#1b1a19`
     (css/stargo-fusion.css, `body.stargo-dark-page`), which is 8% lighter than
     the card is dark, so on that ground the card's edge all but disappears.
     The donor's own black goes back under it. */
  ground: '#000',
};

/**
 * The four illustrative scenarios copy.mjs already carries, read out of
 * HOME_MONO by shape rather than by index.
 *
 * HOME_MONO is a list of `[donorString, {zh,en}]` replacements for the Mono
 * homepage, and its four scenarios sit in it as consecutive triples:
 *
 *     [<Mono's quote>,   the scenario's quote          ]
 *     ['John Doe',       '外贸业务员 · 示例场景'          ]   ← the label line
 *     [<Mono's role>,    '理解企业 · 业务背景'            ]
 *
 * so the label line is the anchor and its two neighbours are the rest of the
 * card. Found by the English label, which is the same string in every one of
 * them; the fifth quote in that list (the Enterprise card, '企业版 · 定制') is
 * not labelled a scenario and is therefore not one of these.
 */
function scenarios(C) {
  const rows = C.HOME_MONO;
  if (!Array.isArray(rows)) throw new Error('cn-reviews: copy.mjs no longer exports HOME_MONO');
  const out = [];
  rows.forEach((row, i) => {
    const who = row?.[1];
    if (!who || typeof who.en !== 'string' || !/ · illustrative scenario$/.test(who.en)) return;
    const quote = rows[i - 1]?.[1];
    const concept = rows[i + 1]?.[1];
    const where = `HOME_MONO entry ${i} (${who.zh})`;
    if (!quote || typeof quote.zh !== 'string' || typeof quote.en !== 'string') {
      throw new Error(`cn-reviews: ${where} is not preceded by a quote pair`);
    }
    /* The quote is the one slot whose shape is checked, because a wrong
       neighbour here would print a role line as a pull quote and nothing else
       would notice. copy.mjs writes these quotes with the corner brackets on
       the Chinese page and curly quotes on the English one. */
    if (!/^「[\s\S]*」$/.test(quote.zh) || !/^“[\s\S]*”$/.test(quote.en)) {
      throw new Error(`cn-reviews: ${where} is preceded by ${JSON.stringify(quote.zh)}, which is not a quotation`);
    }
    if (!concept || typeof concept.zh !== 'string' || typeof concept.en !== 'string') {
      throw new Error(`cn-reviews: ${where} is not followed by a concept pair`);
    }
    if (!who.zh.endsWith('示例场景')) {
      throw new Error(`cn-reviews: ${where} carries the English label but not the Chinese one`);
    }
    out.push({ quote, who, concept });
  });
  return out;
}

export function render(frag, ctx) {
  const { lang, t, escapeHtml, C } = ctx;

  const cards = scenarios(C);
  if (!cards.length) throw new Error('cn-reviews: copy.mjs carries no 示例场景 / illustrative scenario cards');

  /* The label in the rating slot is the same word every speaker line ends with,
     so it cannot go stale while copy.mjs's own labels change. */
  for (const c of cards) {
    if (!c.who.zh.includes('示例场景')) throw new Error(`cn-reviews: ${c.who.zh} is not labelled 示例场景`);
    if (!c.who.en.includes('illustrative scenario')) throw new Error(`cn-reviews: ${c.who.en} is not labelled an illustrative scenario`);
  }

  /* ------------------------------------------------------------ the cut -- */

  /* The slides end where the first `data-w-id` begins: the four cards carry
     none (only `id="w-node-…"`), and the two arrows carry one each. Six
     characters before it is the mask's own closing tag; assert that, because
     splitting one tag early would hand the last card an unbalanced `</div>`. */
  const SLIDE = '<div class="cn-testimonial-slide w-slide">';
  const arrowAt = frag.indexOf('<div data-w-id="');
  if (arrowAt < 0) throw new Error('cn-reviews: neither arrow is in the cut — the slider has lost its controls');
  const MASK_CLOSE = '</div>';
  const closeAt = arrowAt - MASK_CLOSE.length;
  if (frag.slice(closeAt, arrowAt) !== MASK_CLOSE) {
    throw new Error(`cn-reviews: expected the mask to close as "${MASK_CLOSE}" before the first arrow, found ${JSON.stringify(frag.slice(closeAt, arrowAt))}`);
  }
  const { head, units, tail } = splitRepeat(frag, SLIDE, closeAt);

  if (units.length !== cards.length) {
    throw new Error(`cn-reviews: cinery draws ${units.length} slides and copy.mjs carries ${cards.length} illustrative scenarios. `
      + 'They are filled one for one and never cloned: every slide holds a different portrait, so re-emitting a unit would print the same face twice.');
  }

  /* --------------------------------------------------------- the slides -- */

  const filled = units.map((unit, i) => fillSlide(unit, cards[i], i));

  /* --------------------------------------------------------- the arrows -- */

  /* Two bars, `Previous` and `Next`, each saying its word twice inside a
     `.slide-text-wrap` that is `overflow: hidden` and exactly one word high:
     the second copy is the one the hover roll brings up, so both have to say
     the same thing. Split at the right-hand bar and fill each side whole. */
  const RIGHT = /<div data-w-id="[^"]*" class="cn-right-arrow /;
  const at = RIGHT.exec(tail);
  if (!at) throw new Error('cn-reviews: the right-hand arrow is not in the cut');
  let left = tail.slice(0, at.index);
  let right = tail.slice(at.index);
  /* `class="cn-slide-text"` and not the class name alone: the wrap around the
     two copies is `cn-slide-text-wrap`, and only the exact attribute tells them
     apart when counting. */
  const copies = (s) => (s.match(/class="cn-slide-text"/g) ?? []).length;
  if (copies(left) !== 2) throw new Error(`cn-reviews: the left arrow rolls two copies of its word, found ${copies(left)}`);
  if (copies(right) !== 2) throw new Error(`cn-reviews: the right arrow rolls two copies of its word, found ${copies(right)}`);
  left = setTextAll(left, 'cn-slide-text', escapeHtml(t(PREV)));
  right = setTextAll(right, 'cn-slide-text', escapeHtml(t(NEXT)));

  let html = head + filled.join('') + left + right;

  /* --------------------------------------------- the words in attributes -- */

  for (const [from, to] of Object.entries(ALTS)) {
    const found = (html.match(new RegExp(`alt="${from}"`, 'g')) ?? []).length;
    if (found !== units.length) throw new Error(`cn-reviews: expected ${units.length} × alt="${from}", found ${found}`);
    html = html.split(`alt="${from}"`).join(`alt="${to}"`);
  }

  /* ------------------------------------------------------- what is left -- */

  /* The numbers tools/blocks/cn-reviews.js reads back off the slider. They are
     cinery's own, and this module changes none of them; asserting them here is
     what keeps the comments in cn-reviews.js and cn-reviews.css honest. */
  for (const attr of ['data-delay="4000"', 'data-duration="500"', 'data-easing="ease"',
    'data-animation="slide"', 'data-autoplay="true"', 'data-autoplay-limit="0"',
    'data-infinite="true"', 'data-disable-swipe="false"']) {
    if (!html.includes(attr)) throw new Error(`cn-reviews: the slider has lost ${attr}, which cn-reviews.js replays`);
  }

  /* A silent miss ships an agency's customers as ours, so the donor's own
     people, companies and scores are named and refused. `src` is read out
     first: the mirrored portraits keep cinery's file names. */
  const spoken = html.replace(/ src="[^"]*"/g, '');
  const donorWords = ['Cinery', 'Sophia Turner', 'Ethan Brooks', 'Amelia Wright', 'Daniel Morris',
    'Horizon', 'Beyond', 'Stride', 'Visage', 'logoipsum', '4.9/5', '5.0/5'];
  const survived = donorWords.filter((w) => spoken.includes(w));
  if (survived.length) throw new Error(`cn-reviews: donor copy survives in the rendered block: ${survived.join(', ')}`);

  /* 「不是所有的观众都能看得懂英文」. The two-letter product words the register
     writes inside Chinese sentences (AI, PI, SEO) are shorter than the run this
     looks for; a whole English sentence is not. */
  if (lang === 'zh' && /[A-Za-z]{3,}/.test(html.replace(/<[^>]+>/g, ' '))) {
    throw new Error('cn-reviews: Latin words on the Chinese page');
  }

  return html;

  /**
   * One card. The slide splits at `.testimonial-info`, which is the only place
   * `.text-size-regular` means something different on either side of it: above
   * it the first one is cinery's score, below it the only one is the role line.
   */
  function fillSlide(unit, card, i) {
    const INFO = '<div class="cn-testimonial-info">';
    const infoAt = unit.indexOf(INFO);
    if (infoAt < 0) throw new Error(`cn-reviews: slide ${i + 1} has no .testimonial-info to name its speaker`);
    let top = unit.slice(0, infoAt);
    let bottom = unit.slice(infoAt);

    /* Above the fold of the card: the rating line and the quote. cinery's
       rating line is three things — a score, a separator and five 1rem stars —
       and only the first two are words. */
    const scores = (top.match(/class="[^"]*cn-text-size-regular[^"]*"/g) ?? []).length;
    if (scores !== 2) throw new Error(`cn-reviews: slide ${i + 1}: cinery's rating line is a score and a separator, found ${scores} text slots above the quote`);
    top = setText(top, 'cn-text-size-regular', escapeHtml(t(LABEL)));
    if (!/>-<\/div>/.test(top)) {
      throw new Error(`cn-reviews: slide ${i + 1} lost the "-" cinery sets between the rating and its stars`);
    }
    top = setText(top, 'cn-text-size-large', lang === 'zh' ? zhQuote(t(card.quote), escapeHtml) : escapeHtml(t(card.quote)));

    /* Below it: the mark, the speaker, and what the scenario shows. */
    const names = (bottom.match(/class="[^"]*cn-text-size-medium[^"]*"/g) ?? []).length;
    const roles = (bottom.match(/class="[^"]*cn-text-size-regular[^"]*"/g) ?? []).length;
    if (names !== 1 || roles !== 1) {
      throw new Error(`cn-reviews: slide ${i + 1}: expected one name and one role line under the logo, found ${names} and ${roles}`);
    }
    bottom = setText(bottom, 'cn-text-size-medium', escapeHtml(t(card.who)));
    bottom = setText(bottom, 'cn-text-size-regular', escapeHtml(t(card.concept)));

    return top + bottom;
  }
}
