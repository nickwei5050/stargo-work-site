/**
 * 定价页的开篇 — cinery's pricing header, lifted whole onto this site's
 * pricing page.
 *
 * WHAT IS TAKEN
 *   `<header class="section-service-header">` out of
 *   tools/templates/cinery/pricing.html, whole. It is a small piece — 1 216
 *   bytes of markup, no image, no link, no video — and it is the entire top of
 *   cinery's pricing page:
 *
 *     header.section-service-header
 *       .padding-global > .container-large > .padding-top-header   (10rem top,
 *                                                                   8rem ≤991)
 *         .heading-wrap.is-center                 flex column, centred, z-index 5
 *           .subtitle-block   ← the pill          data-w-id="3293326a-…a808"
 *             .subtitle                           "All In One", 12px, uppercase
 *             .subtitle-blur                      the 1.5rem blurred square that
 *                                                 crosses the pill, parked at
 *                                                 translate3d(-400%,null,0)
 *           .title-wrapper > h2.heading-style-h2  ← "Visual"
 *           .title-wrapper > h2.heading-style-h2  ← "Package"
 *         .spacer-small                           1rem
 *         .max-width-medium.align-center          32rem, centred
 *           .text-align-center > p.text-size-medium.text-color-secondary
 *
 *   Two line boxes is what cinery draws and two is what this wordmark needs, so
 *   nothing is cloned and splitRepeat() is not used: each `.title-wrapper` is
 *   filled where it stands, keeping its own box, its `overflow: hidden` and its
 *   place in the centred column.
 *
 * THE TWO LINE BOXES ARE NOT THE ONES ON CINERY'S OTHER PAGES — read this
 *   before assuming this block is cn-produce's heading again. On index.html and
 *   in the FAQ, a `.title-wrapper` wraps a `.top-title` / `.bottom-title` DIV
 *   around the `<h2>`; here the `<h2>` is the wrapper's only child. That is not
 *   cosmetic, it is what decides the block's motion — see MOTION below — so
 *   render() asserts it rather than trusting it.
 *
 * MOTION — why this block ships no keyframes
 *   cinery drives two things that could touch this header, and exactly one of
 *   them reaches us:
 *
 *   1. THE PILL'S BLUR, and it travels. IX2 event `e-341` (SCROLL_INTO_VIEW,
 *      `loop: true`) is bound by element id to the pill's own
 *      `data-w-id="3293326a-dd63-e57b-150e-ef2893e8a808"`, and runs action list
 *      `a-33`, which moves `.subtitle-blur` by xValue -400% over 500ms and back.
 *      tools/donor-lib.mjs matches an event by the block's `data-w-id`s, strips
 *      the `<pageId>|<nodeId>` scope and namespaces the list, so the loop
 *      arrives in tools/fragments/cn-cap-ix.json and tools/fuse-ix.mjs merges it
 *      into the bundle. Nothing to re-declare; the inline `transform` on
 *      `.subtitle-blur` is that event's own initial state and is left untouched.
 *
 *   2. THE HEADING REVEAL, and it does NOT apply here. ix3 interaction
 *      `i-9f439e20` is site-scoped and fires on any `.heading-wrap` (wf:scroll,
 *      start "top 85%", enter "play"), so it does reach this element — but the
 *      timeline it runs, `t-864fc814`, has exactly two actions and both address
 *      a selector *within* the trigger:
 *
 *        ta-7549a871  .top-title      y 110% → 0%, stagger .5, ease 6, splitText lines
 *        ta-f06a78d6  .bottom-title   y 110% → 0%, position .3, stagger .8, ease 6
 *
 *      This header has no `.top-title` and no `.bottom-title` (the only pair on
 *      pricing.html is in the FAQ block further down, "Quick / Answers"), so the
 *      timeline animates nothing and cinery's own pricing wordmark simply stands
 *      there. Replaying it here as CSS would be adding motion the donor does not
 *      have. tools/blocks/cn-produce.css carries that reveal because cn-produce
 *      cut a heading that does have the two DIVs; this one must not. The
 *      assertion in render() is what keeps the two cases apart if cinery is ever
 *      re-cut.
 *
 *   cinery's anti-FOUC rule — `html.w-mod-js:not(.w-mod-ix3) :is(.text-size-large,
 *   .top-title, .bottom-title) { visibility: hidden !important }`, an inline
 *   `<style>` in its `<head>` — names none of this block's classes either, which
 *   is the same fact from the other side: nothing in this cut is hidden waiting
 *   for an animation, so the header is drawn whatever the runtime does.
 *
 * THE WORDS
 *   Three slots, and every one of them is resolved against tools/copy.mjs rather
 *   than typed here:
 *
 *     the pill        NAV's own label for this page, found by href, exactly as
 *                     tools/blocks/cn-produce.mjs names its pill. 定价 /
 *                     "Pricing" — the donor's `text-transform: uppercase` makes
 *                     it PRICING on the English page, as it made ALL IN ONE.
 *     the two lines   two words of this page's own promise, PRICING.title (V5
 *                     P08: 「从需要解决的业务，确定合适的配置与服务。」 / "Match
 *                     configuration and support to the work you need done."),
 *                     one word per line box: 合适 / 配置, Work / Done. They are
 *                     written out below because the title is a sentence with
 *                     markup in it and these are two words; the assertion binds
 *                     each back to it, so a rewritten promise fails the build
 *                     instead of quietly leaving a wordmark that no longer says
 *                     what the page says.
 *     the paragraph   PRICING.introBody — V5 P08's supporting sentence, applied
 *                     with the title on the owner's instruction of 2026-09-17.
 *                     (It used to print META['pricing.html'].description, which
 *                     remains the page's search description.) It names no
 *                     price, level or quantity. It sets more lines than
 *                     cinery's sentence in the donor's 32rem box; the box has
 *                     no fixed height, so the header grows and nothing clips.
 *
 *   No price, plan name, metric, date or customer appears in this block. The
 *   ladder is 200 lines further down the page and is built by tools/build-site.mjs
 *   from PRICING.panes; this header only opens it.
 *
 * DOES IT FIT? Measured in the browser with cinery's own Overused Grotesk
 *   SemiBold at the donor's `letter-spacing: .1rem`, against the column
 *   `.container-large` (max 100rem) leaves inside `.padding-global` (2.5rem,
 *   1.25rem ≤767) at the narrowest viewport each h2 size covers:
 *
 *     h2 size   applies      narrowest column   PACKAGE   SYSTEM   ONE   系统
 *      192px    ≥1440        1360 px at 1440      844.9    720.6   362.9  387.2
 *      160px    992–1439      912 px at  992      705.9    602.1   303.2  323.2
 *      128px    768–991       688 px at  768      567.0    483.6   243.5  259.2
 *       96px    480–767       440 px at  480      428.0    365.1   183.8  195.2
 *       56px    ≤479          280 px at  320      254.4    217.0   109.3  115.2
 *
 *   Every line this block prints is narrower than cinery's own longest line at
 *   every width, so no `.title-wrapper` has to wrap and the donor's geometry is
 *   untouched — the line box measures exactly 192px at `line-height: 100%` for
 *   both the Latin and the CJK line, i.e. the mask clips nothing. The pill is
 *   the same story: cinery's "ALL IN ONE" is 59.2px of 12px type, 定价 is 24.8
 *   and PRICING 43.7.
 */
import { setText, DONORS } from '../block-lib.mjs';

export const donor = {
  id: 'cn-price-hero',
  donor: 'cinery',
  scope: '.cn-price-hero',
  page: 'pricing.html',

  /* `<header class="section-service-header">` occurs once in pricing.html, and
     `section-service-header` occurs nowhere else in the file — the class carries
     no rules of its own, it is only the hook the export gave this element. */
  start: '<header class="section-service-header">',

  /* The header's own closing run: the paragraph, then out through
     .text-align-center / .max-width-medium / .padding-top-header /
     .container-large / .padding-global. Markup only, deliberately — an anchor
     written on the donor's sentence would break the cut the day cinery is
     re-exported with different copy. `</header>` appears exactly once in
     pricing.html, so this string can match in exactly one place. */
  end: '</p></div></div></div></div></div></header>',

  /* NO `ground`, unlike tools/blocks/cn-service.mjs and cn-produce.mjs, and the
     difference is the page, not the block. Those two are dropped on the
     capability page, which is Mono's white, so without cinery's `body` black
     their white type was white on white. This block lands on pricing.html, which
     is already dark at every layer it could sit in — `body.stargo-dark-page`
     #1b1a19 and, inside the Scalora wrapper, `.sc-scope` #161616 — so the type
     reads as drawn. Painting the block #000 anyway would draw a seam cinery
     never had: a black band the full width of the viewport against #161616, a
     22/255 step. The one thing the ground is load-bearing for is the h2's
     gradient, `linear-gradient(180deg, white 40%, #000 100%)` clipped to the
     text, whose feet are meant to dissolve into the page; against #161616 they
     land 22 levels under it, which is the same effect and not a seam. */
};

/**
 * cinery's own words in this header — all four of them — and the template's name
 * after them, which appears nowhere in this cut and is checked for the same
 * reason every cinery block checks for it.
 *
 * Each of the four carries enough of its own markup that the check cannot fire
 * on one of ours: this site's English description of the pricing page ends
 * "…service packages.", and a bare `Package` would have failed the build on it.
 */
const DONOR_WORDS = ['>All In One<', '>Visual</h2>', '>Package</h2>', 'A complete video package', 'Cinery'];

/**
 * The wordmark, one word per line box.
 *
 * Both words are taken from PRICING.title (V5 P08) — 「…确定合适的配置与服务。」 /
 * "…the work you need done." — and render() checks the title, tags removed,
 * still contains each of them. Written out rather than sliced off the title
 * because the title is a full sentence that carries a
 * `<span class="sub-title-text">` for Scalora's own h1 treatment, and because a
 * wordmark is chosen, not derived: cinery sets these two boxes at 192px and
 * never wraps them, so the slot takes a word and not a clause. 合适 / 配置 are
 * two characters each, like the 系统 measured below; Work and Done are
 * narrower than PACKAGE at every size.
 */
const WORDMARK = {
  zh: { top: '合适', bottom: '配置' },
  en: { top: 'Work', bottom: 'Done' },
};

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-price-hero: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-price-hero: donor ${donor.donor} is not registered`);

  /* ------------------------------------------------------------- the cut -- */

  /* Two line boxes, in order. Matched on the wrapper rather than on the `<h2>`
     so that a cut which lost one of the wrappers — and with it the mask the
     donor's geometry depends on — fails here instead of quietly stacking both
     words in one box. */
  const wraps = [...frag.matchAll(/<div class="cn-title-wrapper">/g)];
  if (wraps.length !== 2) {
    throw new Error(`cn-price-hero: cinery's pricing header stacks two .title-wrapper line boxes, found ${wraps.length}`);
  }
  const headings = (frag.match(/class="cn-heading-style-h2"/g) ?? []).length;
  if (headings !== 2) throw new Error(`cn-price-hero: expected two .heading-style-h2, one per line box, found ${headings}`);

  /* See MOTION in the header comment. If a re-cut ever brings `.top-title` /
     `.bottom-title` into this header, cinery's ix3 timeline t-864fc814 starts
     applying to it and the block needs the masked line reveal that
     tools/blocks/cn-produce.css carries — which this block deliberately does not
     ship. Fail rather than silently drop the donor's motion. */
  if (/cn-top-title|cn-bottom-title/.test(frag)) {
    throw new Error(
      'cn-price-hero: this cut now carries .top-title/.bottom-title, which cinery\'s ix3 timeline '
      + 't-864fc814 animates (y 110% → 0% behind the .title-wrapper mask). The block was written for '
      + 'the pricing header, whose h2 is the wrapper\'s only child and which therefore has no reveal; '
      + 'replay it as cn-produce.css does before removing this check.');
  }

  /* The pill and its blurred square. `e-341` binds to the one data-w-id in the
     cut and `a-33` addresses `.subtitle-blur` by class, so both have to be here
     or the loop animates nothing. */
  const wids = (frag.match(/data-w-id="/g) ?? []).length;
  if (wids !== 1) throw new Error(`cn-price-hero: expected one data-w-id (the pill's, e-341), found ${wids}`);
  if (!/data-w-id="[^"]+" class="cn-subtitle-block"/.test(frag)) {
    throw new Error('cn-price-hero: the interaction id is no longer on .subtitle-block — e-341 would bind to nothing');
  }
  if (!frag.includes('class="cn-subtitle-blur"')) {
    throw new Error('cn-price-hero: .subtitle-blur is missing — a-33 has nothing to move across the pill');
  }

  /* cinery ships no picture, no link and no clip in this header: it is type on
     the page's own ground. Anything else means the cut ran past `</header>`. */
  for (const [what, re] of [['an image', /<img\b/], ['a link', /<a\b/], ['a video', /<video\b/]]) {
    if (re.test(frag)) throw new Error(`cn-price-hero: the cut contains ${what}; cinery's pricing header has none`);
  }

  /* --------------------------------------------------------- the wordmark -- */

  const P = C.PRICING;
  if (!P?.title) throw new Error('cn-price-hero: PRICING.title is what this wordmark opens; it is missing');
  const mark = WORDMARK[lang];
  /* The wordmark cannot drift from the sentence it is the opening of. */
  const plainTitle = t(P.title).replace(/<[^>]+>/g, '');
  for (const word of [mark.top, mark.bottom]) {
    if (!plainTitle.toLowerCase().includes(word.toLowerCase())) {
      throw new Error(
        `cn-price-hero: the ${lang} wordmark says "${mark.top} ${mark.bottom}" but PRICING.title no longer contains `
        + `"${word}" — it now reads "${plainTitle}". Rewrite the two line boxes to `
        + 'match the page\'s own promise, keeping each one to a word the donor\'s 192px box can hold.');
    }
  }

  /* One `<h2>` per line box, filled where it stands — the split is at the second
     wrapper so each setText sees exactly one heading. Same shape as
     tools/blocks/cn-produce.mjs, which splits its own two-line heading at
     `.bottom-title`; here the wrapper is the only landmark there is. */
  let html = setText(frag.slice(0, wraps[1].index), 'cn-heading-style-h2', escapeHtml(mark.top))
    + setText(frag.slice(wraps[1].index), 'cn-heading-style-h2', escapeHtml(mark.bottom));

  /* -------------------------------------------------------------- the pill -- */

  /* cinery's pill is one short uppercase line in an `overflow: hidden` box set
     solid at `line-height: 1`. What belongs in it here is the name of the page
     it opens, and the navigation is where this site keeps that name — resolved
     by href, not by position, exactly as cn-produce.mjs resolves its own. */
  const nav = C.NAV.find((n) => n.href === donor.page);
  if (!nav) throw new Error(`cn-price-hero: NAV has no ${donor.page} entry to name the pill`);
  html = setText(html, 'cn-subtitle', escapeHtml(t(nav.label)));

  /* --------------------------------------------------------- the paragraph -- */

  /* V5 P08's supporting sentence, the introduction the owner approved for this
     page (2026-09-17). */
  if (!P.introBody) throw new Error('cn-price-hero: PRICING.introBody is what the paragraph says; it is missing');
  html = setText(html, 'cn-text-size-medium', escapeHtml(t(P.introBody)));

  /* ------------------------------------------------------------- the guard -- */

  for (const w of DONOR_WORDS) {
    if (html.includes(w)) throw new Error(`cn-price-hero: donor copy survives in the rendered block: "${w}"`);
  }

  /* 「不是所有的观众都能看得懂英文」. Product names are allowed in both languages
     and this site writes them in capitals (STARGO WORK, CRM, AI, SKU, SEO), so a
     run of lower-case Latin letters in the rendered text is English prose that
     has no business on the Chinese page — which is what would happen if one of
     the three slots above ever resolved to an English string. */
  if (lang === 'zh') {
    const words = (html.replace(/<[^>]+>/g, ' ').match(/[A-Za-z]{2,}/g) ?? []);
    const prose = words.filter((w) => w !== w.toUpperCase());
    if (prose.length) throw new Error(`cn-price-hero: English prose on the Chinese page: ${prose.join(', ')}`);
  }

  return html;
}
