/**
 * 关于页的场景栏 — cinery's HOME-page testimonial band, carrying four
 * illustrative scenarios instead of four customers.
 *
 * WHY THIS BLOCK EXISTS AT ALL, NEXT TO cn-reviews
 *   cinery ships no about.html — only index.html and pricing.html — so the
 *   About page is composed out of cinery's home page. The owner chose its
 *   composition on 2026-09-15: the intro band (tools/blocks/cn-about.mjs) + the
 *   projects grid + this testimonial band. tools/blocks/cn-reviews.mjs already
 *   ports cinery's PRICING-page testimonial component; this is the HOME-page
 *   section, which is a different cut. READ THE "TWO BANDS" NOTE AT THE FOOT OF
 *   THIS COMMENT BEFORE SHIPPING BOTH: their cards are the same cut and will
 *   draw the same.
 *
 * WHAT IS CUT
 *   `section.section-home-testimonial` out of tools/templates/cinery/index.html
 *   — unique in that file (checked: one occurrence). Its shape, outermost
 *   first, with the donor's own numbers:
 *
 *     section.section-home-testimonial     no css rule of its own at all
 *                                          (checked: the class appears zero
 *                                          times in cinery's stylesheet), so
 *                                          only <body> ever stood behind it —
 *                                          which is why `ground` is set below
 *       .padding-global                    2.5rem side gutters (1.25rem ≤767)
 *         .container-large                 100% wide, max 100rem, centred
 *           .padding-section-large         8rem top AND bottom (6rem ≤767,
 *                                          5rem ≤479) — the block's own air,
 *                                          which is why this file's .css needs
 *                                          no placement rule
 *             .top-content-grid            a `w-layout-grid`, i.e. 1fr 1fr,
 *                                          2rem gaps, one explicit row
 *               .heading-wrap              #w-node-…c0f, column flex, z-index 5
 *                 .subtitle-block          the pill, 8px radius, #232324,
 *                                          1px #2f2f30 on two edges, .5/1rem
 *                                          padding, `overflow: hidden`
 *                   .subtitle              .75rem, uppercase, line-height 1
 *                   .subtitle-blur         the 1.5rem blurred square IX2 slides
 *                                          across the pill (see MOTION)
 *                 .title-wrapper           `position: relative; overflow:hidden`
 *                   .top-title             ← "Client"
 *                     h2.heading-style-h2  10rem (12rem ≥1440, 8rem ≤991,
 *                                          6rem ≤767, 3.5rem ≤479), uppercase,
 *                                          .1rem tracking, white→#000 gradient
 *                                          painted per line box with
 *                                          `background-clip: text`
 *                 .title-wrapper
 *                   .bottom-title          ← "Stories"
 *                     h2.heading-style-h2
 *               .content-item              #w-node-…c18, `place-self: end`
 *                 a.main-button            href="contact.html" already
 *                   …the same five-layer glow button cn-about ports…
 *                   .button-text-wrap      1.125rem tall, `overflow: hidden`
 *                     p.button-text ×2     ← "Share Feedback", twice, for the
 *                                          roll
 *             .spacer-xlarge               4rem (3rem ≤479)
 *             .testimonial-component       the slider — IDENTICAL to the one
 *                                          cn-reviews cuts out of pricing.html
 *                                          (diffed: the only difference inside
 *                                          it is that the home portraits carry
 *                                          `sizes`/`srcset` and the pricing
 *                                          ones do not, plus the generated ids
 *                                          and the two arrows' `data-w-id`s)
 *           .dividing-line                 a 1px hairline, `.container-large`
 *                                          wide, OUTSIDE .padding-section-large
 *                                          — the rule cinery draws between this
 *                                          band and whatever follows it
 *
 *   Nothing is wrapped: the cut is a whole `<section>` and carries its own
 *   gutters, measure and air.
 *
 * WHAT THE WORDS BECOME — and why none of them is a customer
 *   This company has no public customer testimonials and no public case
 *   studies, so not one word in this band may read as one. Every string below
 *   comes out of tools/copy.mjs, and the two that carry the honesty label are
 *   asserted against it so they cannot drift.
 *
 *     .subtitle (the pill)   "Testimonials" → 「示例场景」 / "Illustrative
 *                            scenarios". The donor put the band's NAME here, so
 *                            this site's name for it goes here: the label
 *                            copy.mjs already uses for these four cards. Taken
 *                            as a substring of HOME_MONO's own eyebrow for a
 *                            testimonial band — 「(智能层 · 四个示例场景)」 /
 *                            "(Intelligence · four illustrative scenarios)" —
 *                            and asserted against it.
 *     .top-title    h2       "Client"  → 「四个」 / "Four"
 *     .bottom-title h2       "Stories" → 「岗位」 / "Roles"
 *                            cinery's heading names who speaks and what they
 *                            give. Ours names how many speak and who they are:
 *                            the four cards are four roles in an example trade
 *                            company (外贸业务员, 外贸经理, 销售总监, 总经理).
 *                            「四个」 / "four" is a substring of the same
 *                            eyebrow; 「岗位」 / "Roles" is
 *                            LX_FEATURE_WORKFORCE.answerTabs[0] verbatim. Both
 *                            asserted. A heading is the one slot in this band
 *                            that could be read as a claim, so it states a
 *                            count and a job title and nothing else.
 *     a.main-button ×2       "Share Feedback" → ABOUT.button.label
 *                            (「预约演示」 / "Book a demo"). Two copies because
 *                            the hover rolls one out and the other in; write
 *                            one and the roll shows the donor's word. The href
 *                            is NOT rewritten — cinery already points this
 *                            button at contact.html, which is exactly
 *                            ABOUT.button.href, so the module asserts it
 *                            instead of replacing it.
 *     .rating-wrap's score   "4.9/5" / "5.0/5" → 「(示例场景)」 /
 *                            "(Illustrative scenario)". A score is a claim
 *                            about customers. The label is what
 *                            tools/blocks/cn-reviews.mjs puts in this slot and
 *                            what CONTACT.quoteLabel does to the same kind of
 *                            slot on the contact page, where `★★★★★` became a
 *                            label too — 「(先从一条业务开始)」 since V6
 *                            (2026-09-16), 「(我们的承诺)」 before it. It
 *                            repeats the pill deliberately:
 *                            a label that cannot be missed is the point.
 *     .rating-wrap's "-"     kept. cinery's separator glyph, the way cn-service
 *                            keeps its `◉` and its `▶︎`.
 *     p.text-size-large      the scenario's quote
 *     .text-size-medium      the speaker: 「外贸业务员 · 示例场景」
 *     .text-size-regular     the concept the scenario shows — since V6
 *                            (2026-09-16) 理解企业 · 业务背景, 按业务落地,
 *                            主动提醒, 从结果改进
 *     .slide-text ×4         「上一条」/「下一条」 (the English page keeps
 *                            cinery's Previous / Next, which are already the
 *                            plain English for a previous/next control and
 *                            carry nothing of the template's voice). Same two
 *                            words cn-reviews uses on the same control.
 *
 *   The four alt attributes are handled in ALTS below.
 *
 * THE HEADING FITS — MEASURED, NOT CHOSEN
 *   The two h2 line boxes are the only slot in this band where a longer word
 *   changes the layout, because `.top-content-grid` is `1fr 1fr` = two
 *   `minmax(auto, 1fr)` tracks: an unbreakable Latin word wider than half the
 *   grid raises the first track's automatic minimum and takes the room from the
 *   button's track. Measured in the browser on cinery's own index.html served
 *   locally, with cinery's own Overused Grotesk SemiBold loaded (the harness
 *   reproduces tools/blocks/cn-produce.mjs's recorded numbers exactly —
 *   "Produce" 837px, "Every" 573px, "Job" 321px, 每一项 581px, 工作 387px at
 *   192px — so it is measuring the same thing that block measured):
 *
 *     viewport   h2     donor CLIENT/STORIES    ours FOUR/ROLES   ours 四个/岗位
 *     1440      192px   603 / 737  tracks       471 / 564         387 / 387
 *                                  737+575.5    656 + 656         656 + 656
 *     1024      160px   504 / 616  616+280.5    394 / 472         323 / 323
 *                                                471.7+425        448.3+448.3
 *      992      160px   504 / 616  616+248.5    394 / 472         323 / 323
 *                                                471.7+393        432.3+432.3
 *      768      128px   405 / 495                316 / 379        259 / 259
 *      375       56px   183 / 223                142 / 170        115 / 115
 *
 *   Every line is ONE line box tall at every width (measured: 192/160/128/56px
 *   high, never doubled), `document.documentElement.scrollWidth` never exceeds
 *   the viewport, and both of our lines are NARROWER than the donor's own at
 *   every width — so unlike cinery's own heading, which blows its first track
 *   out to 737px at 1440 and 616px at 992, ours leaves the two tracks even.
 *   The button is narrower than the donor's too (「预约演示」 128px, "BOOK A
 *   DEMO" 163.1px, against "SHARE FEEDBACK" 190.4px), so nothing is tighter
 *   here than cinery drew it. Nothing in tools/blocks/cn-about-reviews.css
 *   changes a type size to make this true.
 *
 *   WHAT WAS REJECTED, and why, so nobody re-tries it: "Four / Scenarios",
 *   the literal English of 「四个示例场景」. "SCENARIOS" is 841.6px at 160px,
 *   which raises the first track to 841.6px and leaves 163.1px for the button —
 *   more than the grid has. Measured at a 1024 viewport it pushes
 *   `scrollWidth` to 1077 against a 1009 page: 68px of horizontal page scroll,
 *   from 992 up to about 1132. 「四个 / 示例场景」 does not overflow (CJK breaks
 *   between characters) but wraps the bottom line onto two lines — measured 320
 *   px tall against the donor's 160px — which is a layout change, not a word
 *   change. copy.mjs has no shorter English plural for these cards, which is
 *   why the heading names the speakers instead of the cards and the cards'
 *   own label is carried by the pill and by all four rating lines.
 *
 * WHAT THE PICTURES ARE
 *   The four portraits, the 6rem quotation glyph and the star paths are
 *   cinery's own and stay — `mirror` keeps its default (assets/cinery) and
 *   every file is already on disk, pulled in by cn-reviews, which cuts the same
 *   four slides. The four logoipsum marks do NOT stay: a client logo in a
 *   client-logo slot asserts a customer. They are replaced by this site's own
 *   wordmark, exactly as tools/blocks/cn-reviews.mjs does it and for the same
 *   reason — replaced rather than dropped, so the card keeps the donor's
 *   three-part bottom row.
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
 * MOTION — four things move, and only one of them travels
 *   travels     THE PILL'S BLUR. IX2 `e-246` (SCROLL_INTO_VIEW, `loop: true`,
 *               action list `a-33`, which moves `.subtitle-blur` by xValue
 *               -400% over 500ms and back) is bound by element id to the pill's
 *               own `data-w-id="5ff8cede-17dc-e41f-3894-39badfa11c10"` — the
 *               only `data-w-id` in this whole cut. tools/donor-lib.mjs matches
 *               an event by the block's `data-w-id`s, strips the
 *               `<pageId>|<nodeId>` scope and namespaces the list, so it
 *               arrives on its own. The inline `transform` on `.subtitle-blur`
 *               is that event's initial state and is left untouched.
 *   travels     `.main-button { transition: all .35s }` with
 *               `:hover { transform: scale(.95) }` — plain css in cinery's own
 *               sheet.
 *   does NOT    THE BUTTON LABEL'S ROLL (ix3 i-84a682e6 → t-bf9e6807) and
 *               BOTH ARROWS' WORD ROLLS (ix3 i-d68dbd1d → t-e56d8ac2 and
 *               i-d5b715fb → t-96695666). All three are ix3 (GSAP) data and
 *               donor-lib returns `{events, actionLists}` (IX2) only. They are
 *               replayed as css transitions in
 *               tools/blocks/cn-about-reviews.css with the donor's own numbers.
 *               *** NOTE FOR ANYONE COMPARING THIS WITH cn-reviews: on
 *               pricing.html the two arrows' rolls are IX2 (a-45 … a-48 fired
 *               by e-248 … e-251, bound to `data-w-id`s the pricing arrows
 *               carry) and DO travel, which is why cn-reviews.css writes no
 *               motion at all. On the home page the same two rolls are ix3
 *               interactions scoped to the page id 695c47e4e7da0bba805165a1 and
 *               the arrows carry no `data-w-id` — checked in the cut: zero.
 *               Same visible roll, different machinery, opposite conclusion. ***
 *   does NOT    THE HEADING REVEAL (ix3 i-9f439e20, site-scoped on class
 *               `heading-wrap` → t-864fc814: `.top-title` y 110% → 0% at
 *               position 0, `.bottom-title` at position .3, both ease 6 =
 *               power2.inOut, duration the runtime's 0.5s default). Same
 *               timeline tools/blocks/cn-produce.css and cn-produce.js replay
 *               for the one other cinery cut that owns a `.top-title` /
 *               `.bottom-title` pair; replayed here the same way.
 *   does NOT    THE QUOTES' LINE REVEAL (ix3 i-7405f602, site-scoped on class
 *               `text-size-large` → t-a0ad7ea5: y 110% → 0%, stagger .1,
 *               ease 5 = power2.out, splitText lines, masked). It is NOT
 *               replayed, and that is a decision rather than an omission:
 *               it animates LINE BOXES, so it needs SplitText to rewrite the
 *               quote into spans, which is DOM structure and the brief is
 *               「仅仅针对文字进行改动」; and all four quotes sit in one scroll
 *               band, so on cinery's own page the three cards waiting behind
 *               `.w-slider-mask { overflow: hidden }` play their reveal while
 *               they are off-stage and arrive already revealed. Replaying it
 *               faithfully would therefore buy the reader the first card's
 *               line-rise and nothing else. Nothing hides the quotes in the
 *               meantime: cinery's anti-FOUC rule
 *               (`html.w-mod-js:not(.w-mod-ix3) :is(.text-size-large,
 *               .top-title, .bottom-title) { visibility: hidden !important }`)
 *               lives in an inline `<style>` in the donor's `<head>`, and
 *               donor-lib reads only `css/<sheet>.css`, so it does not travel.
 *
 * THE SLIDER DOES NOT TURN BY ITSELF — read this before deleting
 * tools/blocks/cn-about-reviews.js
 *   `.w-slider` is a Webflow COMPONENT, not an interaction: its behaviour lives
 *   in the `slider` module of Webflow's runtime and this site does not ship it.
 *   The whole argument, with the evidence, is at the head of
 *   tools/blocks/cn-reviews.js; it applies here unchanged. cn-reviews.js cannot
 *   drive this band — it selects `.cn-reviews .cn-testimonial-slider` and this
 *   band's root is `.cn-about-reviews` — so the driver is repeated, scoped to
 *   this block's own root, in tools/blocks/cn-about-reviews.js. One file per
 *   block is the rule (tools/blocks/README.md); the duplication is its price.
 *
 *   *** WIRING. tools/capability-donors.mjs concatenates every
 *   tools/blocks/<id>.js into js/capability-blocks.js, so whatever page carries
 *   this band has to link `css/cinery.cn2.css` AND `js/capability-blocks.js`.
 *   The script tag is the one whose absence is silent: without the stylesheet
 *   nothing is drawn and you see it at once, but without the script the band
 *   still renders cinery's first card exactly as drawn, with three scenarios
 *   clipped behind `.w-slider-mask { overflow: hidden }`, two dead arrows and a
 *   heading that never rises. about.html is built by tools/build-site.mjs,
 *   which this block may not edit — whoever wires the rebuilt About page must
 *   add both tags. ***
 *
 * THE TWO BANDS — cn-reviews and this one, on the same site
 *   Diffed, normalised for generated ids and `data-w-id`s: cinery's pricing
 *   `.testimonial-component` and its home one are the SAME markup apart from
 *   `sizes`/`srcset` on the home portraits. Same four portraits in the same
 *   order (client-04, -02, -03, -01), same two ratings, same four logos, same
 *   four names. Both blocks then fill them from the same four HOME_MONO
 *   scenarios. So the CARDS of the two bands are identical — same faces, same
 *   quotes, same speakers, same wordmark — and a reader who visits both pages
 *   sees the same slider twice.
 *
 *   What differs is everything around the cards, and it is not nothing: this
 *   band is a whole `<section>` and opens on a pill, a two-line 192px gradient
 *   heading and a glow button, closes on a 1px hairline, and carries 8rem of
 *   its own air top and bottom on cinery's black; cn-reviews is the bare
 *   component with no heading, no pill and no button, sitting in a
 *   `.padding-bottom.padding-xhuge` column on the pricing page's #1b1a19 with a
 *   top padding its own .css had to supply. Above the fold they read as
 *   different sections; at the cards they read as the same one.
 *
 *   That is a judgement for the owner, not for this module, so it is stated
 *   here rather than papered over: if both are to ship, the honest fixes are
 *   (a) ship only one of them, or (b) give this band its own four scenarios in
 *   copy.mjs — there are only four labelled 示例場景 today and both blocks read
 *   the same four. Re-ordering or re-cutting the slides here would be changing
 *   structure, which the brief forbids, so this block does neither.
 */
import { setText, setTextAll, splitRepeat, DONORS } from '../block-lib.mjs';

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
  if (parts.join('') !== text) throw new Error('cn-about-reviews: word segmentation changed the quote');
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
 * The donor key of the one HOME_MONO row that is this site's own name for a
 * testimonial band. Its value —
 *   zh 「(智能层 · 四个示例场景)」
 *   en "(Intelligence · four illustrative scenarios)"
 * — is where the pill and the heading's words are taken from, and every one of
 * them is asserted to still be inside it.
 */
const EYEBROW_KEY = '(Testimonials)';

/**
 * The band's label, in the slot cinery used for the band's name. Both halves
 * are substrings of the eyebrow above (case-insensitively: the donor's
 * `.subtitle` is `text-transform: uppercase`, so the case written here is never
 * the case drawn).
 */
const PILL = { zh: '示例场景', en: 'Illustrative scenarios' };

/**
 * The two heading line boxes. `top` is a substring of the eyebrow; `bottom` is
 * LX_FEATURE_WORKFORCE.answerTabs[0], this site's own word for the job someone
 * holds. Both are asserted against those sources in render(). See "THE HEADING
 * FITS" in the header for the measurements that chose them.
 */
const HEADING_TOP = { zh: '四个', en: 'Four' };
const HEADING_BOTTOM_FROM = 0;          // index into LX_FEATURE_WORKFORCE.answerTabs

/**
 * The label in the rating slot, per card. `示例场景` is copy.mjs's own word for
 * a card of this kind; the parentheses are the site's eyebrow form ((定价),
 * (联系), (Pricing), (Contact)). Identical to tools/blocks/cn-reviews.mjs's,
 * because it is the same slot in the same component and the two must not label
 * the same four scenarios two different ways.
 */
const LABEL = { zh: '(示例场景)', en: '(Illustrative scenario)' };

/**
 * The two slider controls. copy.mjs has no words for them — nothing else on the
 * site is a slider — so these are the plain words for the control, in the
 * register: 「条」 counts entries, which is what these are. The English page
 * keeps cinery's own two words because they are already the correct English for
 * a previous/next control and carry nothing of the template's voice. Same pair
 * as cn-reviews, on the same control.
 */
const PREV = { zh: '上一条', en: 'Previous' };
const NEXT = { zh: '下一条', en: 'Next' };

/** cinery's alt text, and what each becomes. Counts are asserted. */
const ALTS = {
  /* The portraits. The card's own speaker and concept lines say what it is
     about, so the face beside them is decoration — the line rk-testimonials
     takes with renok's avatars and qx-orbit with its eight orbit photographs. */
  'Image - Cinery Template': '',
  /* A 6rem quotation glyph at `opacity: .03` behind the corner of the card. */
  'Quote Icon - Cinery Template': '',
  /* Now this site's wordmark; see `imageStems` below. */
  'Partner Logo - Cinery Template': 'STARGO',
};

/** The donor's own copy, exactly as the cut ships it. */
const DONOR_PILL = 'Testimonials';
const DONOR_TOP = 'Client';
const DONOR_BOTTOM = 'Stories';
const DONOR_BUTTON_LABEL = 'Share Feedback';
const DONOR_BUTTON_HREF = 'href="contact.html"';
/** The pill's own interaction id — the only `data-w-id` in the cut. */
const PILL_WID = '5ff8cede-17dc-e41f-3894-39badfa11c10';

export const donor = {
  id: 'cn-about-reviews',
  donor: 'cinery',
  scope: '.cn-about-reviews',
  page: 'index.html',

  /* donor-lib matches these against the RAW donor page, before the `cn-`
     namespace is applied, so they are cinery's own class names; every selector
     inside render() below is the prefixed form the fragment actually carries.

     `start` is unique in index.html (checked: one occurrence). `end` is taken
     as the first occurrence AFTER start, and the short form
     `<div class="dividing-line"></div></div></div></section>` appears four
     times in the file — so the anchor is written long enough to be unique in
     the whole page (checked: one occurrence), which also documents exactly
     which four elements close here: the slider nav, then the slider, the
     component and `.padding-section-large`, then the hairline, then
     `.container-large` and `.padding-global`, then the section. */
  start: '<section class="section-home-testimonial">',
  end: '<div class="slide-nav w-slider-nav"></div></div></div></div>'
    + '<div class="dividing-line"></div></div></div></section>',

  /* Four different logoipsum marks, one per card, all of them a client's logo
     in a client-logo slot. A stem catches all four and any responsive variant
     in one line. Nothing else is mapped: the four portraits, their -p-500 and
     -p-800 variants and the quote glyph are cinery's own and `mirror` (the
     default, assets/cinery) keeps them — all of them are already on disk,
     fetched when cn-reviews cut the same four slides. */
  imageStems: { logoipsum: WORDMARK },

  /* `.section-home-testimonial` carries no rule in cinery's stylesheet at all
     (checked: the class appears zero times in
     tools/templates/cinery/css/cinery.app.shared.3e3418b8f.css), and nothing
     inside the cut paints a full-bleed ground: the slider is
     `var(--border-color--transparent)` = #0000 and the card inside it is
     `--primary-color--dark` (#232324) with a #ffffff1a hairline on two edges.
     The only ground this band ever had is cinery's
     `body { background-color: var(--background-color--primary-background) }`
     = #000, and every word in the band is white. So the donor's own black goes
     back under it, exactly as cn-service, cn-produce and cn-reviews do it.

     On the About page as it stands that black is invisible — `.lx-scope` is
     #000002 inside `body.lx-page` #000002 (css/stargo-fusion.css:137, :153),
     two parts in 255 of blue away — and the band above it (cn-about) closes on
     an `.intro-opacity.is-bottom` that fades to this same #000, so the two
     meet without a seam. It is declared anyway, because it is what keeps this
     block legible on whatever ground the rebuilt About page ends up with,
     which is decided outside this file. */
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
 *
 * This is the same reader tools/blocks/cn-reviews.mjs uses, repeated here
 * rather than shared: one file per block is the rule, and a block that imported
 * another block's private helper would couple two files the README keeps
 * apart. If the shape of HOME_MONO ever changes, BOTH readers must change.
 */
function scenarios(C) {
  const rows = C.HOME_MONO;
  if (!Array.isArray(rows)) throw new Error('cn-about-reviews: copy.mjs no longer exports HOME_MONO');
  const out = [];
  rows.forEach((row, i) => {
    const who = row?.[1];
    if (!who || typeof who.en !== 'string' || !/ · illustrative scenario$/.test(who.en)) return;
    const quote = rows[i - 1]?.[1];
    const concept = rows[i + 1]?.[1];
    const where = `HOME_MONO entry ${i} (${who.zh})`;
    if (!quote || typeof quote.zh !== 'string' || typeof quote.en !== 'string') {
      throw new Error(`cn-about-reviews: ${where} is not preceded by a quote pair`);
    }
    /* The quote is the one slot whose shape is checked, because a wrong
       neighbour here would print a role line as a pull quote and nothing else
       would notice. copy.mjs writes these quotes with the corner brackets on
       the Chinese page and curly quotes on the English one. */
    if (!/^「[\s\S]*」$/.test(quote.zh) || !/^“[\s\S]*”$/.test(quote.en)) {
      throw new Error(`cn-about-reviews: ${where} is preceded by ${JSON.stringify(quote.zh)}, which is not a quotation`);
    }
    if (!concept || typeof concept.zh !== 'string' || typeof concept.en !== 'string') {
      throw new Error(`cn-about-reviews: ${where} is not followed by a concept pair`);
    }
    if (!who.zh.endsWith('示例场景')) {
      throw new Error(`cn-about-reviews: ${where} carries the English label but not the Chinese one`);
    }
    out.push({ quote, who, concept });
  });
  return out;
}

/**
 * This site's own eyebrow for a testimonial band, out of HOME_MONO. Returned as
 * the pair so every word taken from it can be checked against it.
 */
function eyebrow(C) {
  const rows = C.HOME_MONO;
  if (!Array.isArray(rows)) throw new Error('cn-about-reviews: copy.mjs no longer exports HOME_MONO');
  const row = rows.find((r) => r?.[0] === EYEBROW_KEY);
  if (!row?.[1]?.zh || !row?.[1]?.en) {
    throw new Error(`cn-about-reviews: HOME_MONO has no ${EYEBROW_KEY} row to take the pill and the heading from`);
  }
  return row[1];
}

/** `part` must still be inside `whole`, in both languages. Case-insensitive on
 *  the English page because the donor draws both slots uppercase. */
function assertInside(part, whole, what) {
  for (const lang of ['zh', 'en']) {
    const hay = lang === 'en' ? whole[lang].toLowerCase() : whole[lang];
    const needle = lang === 'en' ? part[lang].toLowerCase() : part[lang];
    if (!hay.includes(needle)) {
      throw new Error(`cn-about-reviews: ${what} is "${part[lang]}", which is no longer part of `
        + `copy.mjs's own "${whole[lang]}" (${lang})`);
    }
  }
}

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-about-reviews: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-about-reviews: donor ${donor.donor} is not registered`);

  /* ----------------------------------------------------------- the words -- */

  const cards = scenarios(C);
  if (!cards.length) throw new Error('cn-about-reviews: copy.mjs carries no 示例场景 / illustrative scenario cards');

  /* The label in the rating slot is the same word every speaker line ends with,
     so it cannot go stale while copy.mjs's own labels change. */
  for (const c of cards) {
    if (!c.who.zh.includes('示例场景')) throw new Error(`cn-about-reviews: ${c.who.zh} is not labelled 示例场景`);
    if (!c.who.en.includes('illustrative scenario')) throw new Error(`cn-about-reviews: ${c.who.en} is not labelled an illustrative scenario`);
  }

  const brow = eyebrow(C);
  assertInside(PILL, brow, 'the pill');
  assertInside(HEADING_TOP, brow, "the heading's first line");

  const tabs = C.LX_FEATURE_WORKFORCE?.answerTabs;
  const bottom = tabs?.[HEADING_BOTTOM_FROM];
  if (!bottom?.zh || !bottom?.en) {
    throw new Error(`cn-about-reviews: LX_FEATURE_WORKFORCE.answerTabs[${HEADING_BOTTOM_FROM}] is gone; `
      + "the heading's second line has nothing to say");
  }

  const A = C.ABOUT;
  if (!A?.button?.label || !A?.button?.href) {
    throw new Error('cn-about-reviews: copy.mjs ABOUT needs button {label, href}');
  }

  /* ----------------------------------------------------------- the shape -- */

  /* Assert the cut is what this module was written against, before a single
     word is replaced. A silent miss here ships cinery's own words — a score, a
     name, a company — to production, which is the one failure
     tools/blocks/README.md names. */
  const slides = (frag.match(/class="cn-testimonial-slide w-slide"/g) ?? []).length;
  if (slides !== 4) throw new Error(`cn-about-reviews: cinery draws four slides, found ${slides}`);
  const headings = (frag.match(/class="cn-heading-style-h2"/g) ?? []).length;
  if (headings !== 2) throw new Error(`cn-about-reviews: the split heading is two h2 line boxes, found ${headings}`);
  const labels = (frag.match(/class="cn-button-text"/g) ?? []).length;
  if (labels !== 2) throw new Error(`cn-about-reviews: the roll-over button stacks two .button-text copies, found ${labels}`);
  /* Both copies must already say the same thing, or setTextAll below is
     replacing two different words with one and the donor's roll is not what we
     think it is. */
  const said = (frag.match(new RegExp(`>${DONOR_BUTTON_LABEL}<`, 'g')) ?? []).length;
  if (said !== 2) throw new Error(`cn-about-reviews: expected both button copies to read "${DONOR_BUTTON_LABEL}", found ${said}`);
  for (const [what, word] of [['pill', DONOR_PILL], ['first heading line', DONOR_TOP], ['second heading line', DONOR_BOTTOM]]) {
    if (!frag.includes(`>${word}</div>`) && !frag.includes(`>${word}</h2>`)) {
      throw new Error(`cn-about-reviews: the ${what} no longer reads "${word}" — the cut is not the one this block was written for`);
    }
  }
  /* The pill's blurred square and the id IX2 `e-246` binds to. `a-33` addresses
     `.subtitle-blur` by class, so both have to be in the cut. */
  if (!frag.includes(`data-w-id="${PILL_WID}" class="cn-subtitle-block"`)) {
    throw new Error(`cn-about-reviews: ${PILL_WID} is no longer on .subtitle-block — e-246 would bind to nothing`);
  }
  if (!frag.includes('class="cn-subtitle-blur"')) {
    throw new Error('cn-about-reviews: .subtitle-blur is missing — a-33 has nothing to move across the pill');
  }
  /* It is the ONLY interaction id in the cut, which is what says the two
     arrows' rolls are ix3 here and must be replayed in the .css. If a re-cut
     ever brings a `data-w-id` onto an arrow, this block is looking at the
     pricing markup and the css would be doubling an interaction that travels. */
  const wids = [...new Set([...frag.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]))];
  if (wids.length !== 1 || wids[0] !== PILL_WID) {
    throw new Error(`cn-about-reviews: expected exactly one data-w-id (the pill's ${PILL_WID}), found ${wids.join(', ') || 'none'}. `
      + 'On cinery\'s home page the two arrows carry none — their word rolls are ix3 and are replayed in cn-about-reviews.css.');
  }
  if (!frag.includes('class="cn-dividing-line"></div></div></div></section>')) {
    throw new Error('cn-about-reviews: the hairline cinery closes this section with is not at the end of the cut');
  }
  /* Same shape donor-lib checks, and for the same reason: this site fetches
     nothing off-origin. Attribute-scoped rather than a bare url test, because
     the twenty star glyphs and the four arrow glyphs are inline
     `<svg xmlns="http://www.w3.org/2000/svg">` and that is a namespace name,
     not a request. */
  const remote = frag.match(/(?:src|srcset|href|poster|data-src)="(https?:\/\/[^"]+)"/);
  if (remote) throw new Error(`cn-about-reviews: an off-origin url survived the cut: ${remote[1]}`);

  /* ------------------------------------------------------------- the cut -- */

  /* The slides end where the arrows begin. Six characters before the left arrow
     is the mask's own closing tag; assert that, because splitting one tag early
     would hand the last card an unbalanced `</div>`. (cn-reviews finds this
     point by the first `data-w-id`; here there is none to find, because the
     home arrows carry none — see the assertion above.) */
  const SLIDE = '<div class="cn-testimonial-slide w-slide">';
  const LEFT = '<div class="cn-left-arrow w-slider-arrow-left">';
  const arrowAt = frag.indexOf(LEFT);
  if (arrowAt < 0) throw new Error('cn-about-reviews: the left-hand arrow is not in the cut — the slider has lost its controls');
  const MASK_CLOSE = '</div>';
  const closeAt = arrowAt - MASK_CLOSE.length;
  if (frag.slice(closeAt, arrowAt) !== MASK_CLOSE) {
    throw new Error(`cn-about-reviews: expected the mask to close as "${MASK_CLOSE}" before the first arrow, found ${JSON.stringify(frag.slice(closeAt, arrowAt))}`);
  }
  const { head, units, tail } = splitRepeat(frag, SLIDE, closeAt);

  if (units.length !== cards.length) {
    throw new Error(`cn-about-reviews: cinery draws ${units.length} slides and copy.mjs carries ${cards.length} illustrative scenarios. `
      + 'They are filled one for one and never cloned: every slide holds a different portrait, so re-emitting a unit would print the same face twice.');
  }

  /* --------------------------------------------------------- the opening -- */

  /* Everything above the first slide: the pill, the two heading line boxes and
     the button. Two h2s carry the same class, one per line box; the gradient is
     painted on each line separately with `background-clip: text` and the ix3
     reveal masks each `.title-wrapper` on its own, so the two lines are filled
     where they stand rather than restructured into one. */
  const BOTTOM = 'cn-bottom-title';
  const splitAt = head.indexOf(BOTTOM);
  if (splitAt < 0) throw new Error('cn-about-reviews: .bottom-title is not in the cut — the split heading needs both lines');
  if (!head.slice(0, splitAt).includes('cn-top-title')) {
    throw new Error('cn-about-reviews: .top-title is not in the cut before .bottom-title');
  }

  let open = setText(head.slice(0, splitAt), 'cn-heading-style-h2', escapeHtml(t(HEADING_TOP)))
    + setText(head.slice(splitAt), 'cn-heading-style-h2', escapeHtml(t(bottom)));

  /* The pill. `.subtitle` is .75rem/1 uppercase inside an `overflow: hidden`
     box, so it holds one short line and nothing more; measured on the donor's
     own page the pill draws 82px wide in Chinese and 175px in English against
     cinery's own 113px, shrink-wrapped, one line, nothing clipped. */
  open = setText(open, 'cn-subtitle', escapeHtml(t(PILL)));

  /* The button: two stacked copies inside a 1.125rem `overflow: hidden` window,
     the hover rolling the first out and the second in, so both have to carry
     the same word. Write one and the roll shows the donor's. */
  if (!open.includes(DONOR_BUTTON_HREF)) {
    throw new Error(`cn-about-reviews: the button no longer carries ${DONOR_BUTTON_HREF}`);
  }
  /* Not rewritten, asserted: cinery already points this button where copy.mjs
     points ABOUT's, so there is nothing to change and a drift in either would
     be worth failing on. */
  if (DONOR_BUTTON_HREF !== `href="${A.button.href}"`) {
    throw new Error(`cn-about-reviews: the donor's button goes to ${DONOR_BUTTON_HREF} and ABOUT.button.href is `
      + `"${A.button.href}"; they used to be the same page. Rewrite the href here if that is intended.`);
  }
  open = setTextAll(open, 'cn-button-text', escapeHtml(t(A.button.label)));

  /* --------------------------------------------------------- the slides -- */

  const filled = units.map((unit, i) => fillSlide(unit, cards[i], i));

  /* --------------------------------------------------------- the arrows -- */

  /* Two bars, `Previous` and `Next`, each saying its word twice inside a
     `.slide-text-wrap` that is `overflow: hidden` and one word high: the second
     copy is the one the hover roll brings up, so both have to say the same
     thing. Split at the right-hand bar and fill each side whole. */
  const RIGHT = '<div class="cn-right-arrow w-slider-arrow-right">';
  const at = tail.indexOf(RIGHT);
  if (at < 0) throw new Error('cn-about-reviews: the right-hand arrow is not in the cut');
  let left = tail.slice(0, at);
  let right = tail.slice(at);
  /* `class="cn-slide-text"` and not the class name alone: the wrap around the
     two copies is `cn-slide-text-wrap`, and only the exact attribute tells them
     apart when counting. */
  const copies = (s) => (s.match(/class="cn-slide-text"/g) ?? []).length;
  if (copies(left) !== 2) throw new Error(`cn-about-reviews: the left arrow rolls two copies of its word, found ${copies(left)}`);
  if (copies(right) !== 2) throw new Error(`cn-about-reviews: the right arrow rolls two copies of its word, found ${copies(right)}`);
  left = setTextAll(left, 'cn-slide-text', escapeHtml(t(PREV)));
  right = setTextAll(right, 'cn-slide-text', escapeHtml(t(NEXT)));

  let html = open + filled.join('') + left + right;

  /* --------------------------------------------- the words in attributes -- */

  for (const [from, to] of Object.entries(ALTS)) {
    const found = (html.match(new RegExp(`alt="${from}"`, 'g')) ?? []).length;
    if (found !== units.length) throw new Error(`cn-about-reviews: expected ${units.length} × alt="${from}", found ${found}`);
    html = html.split(`alt="${from}"`).join(`alt="${to}"`);
  }

  /* ------------------------------------------------------- what is left -- */

  /* The numbers tools/blocks/cn-about-reviews.js reads back off the slider.
     They are cinery's own, and this module changes none of them; asserting them
     here is what keeps the comments in that file honest. */
  for (const attr of ['data-delay="4000"', 'data-duration="500"', 'data-easing="ease"',
    'data-animation="slide"', 'data-autoplay="true"', 'data-autoplay-limit="0"',
    'data-infinite="true"', 'data-disable-swipe="false"']) {
    if (!html.includes(attr)) throw new Error(`cn-about-reviews: the slider has lost ${attr}, which cn-about-reviews.js replays`);
  }

  /* A silent miss ships an agency's customers as ours, so the donor's own
     people, companies, scores and section words are named and refused. The
     image attributes are read out first: the mirrored portraits keep cinery's
     own file names, which contain the word "client". */
  const spoken = html.replace(/ (?:src|srcset|sizes)="[^"]*"/g, '');
  const donorWords = ['Cinery', 'Sophia Turner', 'Ethan Brooks', 'Amelia Wright', 'Daniel Morris',
    'Horizon', 'Beyond', 'Stride', 'Visage', 'logoipsum', '4.9/5', '5.0/5',
    DONOR_PILL, DONOR_TOP, DONOR_BOTTOM, DONOR_BUTTON_LABEL];
  const survived = donorWords.filter((w) => spoken.includes(w));
  if (survived.length) throw new Error(`cn-about-reviews: donor copy survives in the rendered block: ${survived.join(', ')}`);

  /* 「不是所有的观众都能看得懂英文」. The two-letter product words the register
     writes inside Chinese sentences (AI, PI) are shorter than the run this
     looks for; a whole English word is not. Same test, same threshold, as
     tools/blocks/cn-reviews.mjs, which prints the same four cards. `alt="STARGO"`
     is the wordmark's accessible name — a product name, allowed in both
     languages — and it is inside a tag, so the tag strip takes it out before
     the text is read. */
  if (lang === 'zh') {
    const text = html.replace(/<[^>]+>/g, ' ');
    const stray = [...new Set(text.match(/[A-Za-z]{3,}/g) ?? [])];
    if (stray.length) throw new Error(`cn-about-reviews: English on the Chinese page: ${stray.join(', ')}`);
  }

  return html;

  /**
   * One card. The slide splits at `.testimonial-info`, which is the only place
   * `.text-size-regular` means something different on either side of it: above
   * it the first one is cinery's score, below it the only one is the role line.
   * Identical treatment to tools/blocks/cn-reviews.mjs, because it is the same
   * component filled from the same four scenarios.
   */
  function fillSlide(unit, card, i) {
    const INFO = '<div class="cn-testimonial-info">';
    const infoAt = unit.indexOf(INFO);
    if (infoAt < 0) throw new Error(`cn-about-reviews: slide ${i + 1} has no .testimonial-info to name its speaker`);
    let top = unit.slice(0, infoAt);
    let bot = unit.slice(infoAt);

    /* Above the fold of the card: the rating line and the quote. cinery's
       rating line is three things — a score, a separator and five 1rem stars —
       and only the first two are words. */
    const scores = (top.match(/class="[^"]*cn-text-size-regular[^"]*"/g) ?? []).length;
    if (scores !== 2) throw new Error(`cn-about-reviews: slide ${i + 1}: cinery's rating line is a score and a separator, found ${scores} text slots above the quote`);
    top = setText(top, 'cn-text-size-regular', escapeHtml(t(LABEL)));
    if (!/>-<\/div>/.test(top)) {
      throw new Error(`cn-about-reviews: slide ${i + 1} lost the "-" cinery sets between the rating and its stars`);
    }
    top = setText(top, 'cn-text-size-large', lang === 'zh' ? zhQuote(t(card.quote), escapeHtml) : escapeHtml(t(card.quote)));

    /* Below it: the mark, the speaker, and what the scenario shows. */
    const names = (bot.match(/class="[^"]*cn-text-size-medium[^"]*"/g) ?? []).length;
    const roles = (bot.match(/class="[^"]*cn-text-size-regular[^"]*"/g) ?? []).length;
    if (names !== 1 || roles !== 1) {
      throw new Error(`cn-about-reviews: slide ${i + 1}: expected one name and one role line under the logo, found ${names} and ${roles}`);
    }
    bot = setText(bot, 'cn-text-size-medium', escapeHtml(t(card.who)));
    bot = setText(bot, 'cn-text-size-regular', escapeHtml(t(card.concept)));

    return top + bot;
  }
}
