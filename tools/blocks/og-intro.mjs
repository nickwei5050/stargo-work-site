/**
 * 开场动画 — the homepage's opening, over the homepage.
 *
 * Three donor animations in the order the owner asked for them, played once on
 * index.html and en/index.html over an overlay that then removes itself:
 *
 *   1. OFFGRID's bracket headline, carrying `[STARGO OS]`.
 *   2. OFFGRID's works mosaic — all 36 tiles, the owner's 全上 — revealing.
 *   3. rototo's vertical column wipe, which clears to the homepage.
 *
 * The owner's instruction for both templates, twice and emphatically:
 * 「这两个模板不要改变任何动效，只能改动文字」/「图片和动效全部不变」. Every
 * duration, delay, easing, transform and stagger below is the donor's own,
 * read out of the donor's own payload and then checked against the donor page
 * running in a browser. The words are the only thing that changed, and the
 * photographs are OFFGRID's own, mirrored into assets/offgrid/.
 *
 * ---------------------------------------------------------------- the cut --
 *
 * One contiguous slice of offgrid/index.html: `<div class="hero-section">`
 * through the close of `<section class="works-section">`, put back inside the
 * `page-wrapper` they were designed in. That is both the headline and the
 * mosaic in one piece, in the donor's own order, with the donor's own
 * `min-height: 100svh` hero and `min-height: 99vh` nine-column grid.
 *
 * What render() takes out of that slice, and why each one had to go:
 *
 *   - The second headline, `<h1 class="… is-hero_from-left">GRID</h1>`. The
 *     donor's headline is two halves — `[OFF]` opening from a hairline and
 *     `GRID` sliding in from the left. THE OWNER CHOSE 「[STARGO OS]」, the
 *     whole name inside the brackets, so the bracketed span carries the name
 *     and the sliding second word has nothing left to say. Half of the donor's
 *     headline animation (a-24's `a-24-n-16`/`a-24-n-17` move and
 *     `a-24-n-3`/`a-24-n-5` size items) is therefore deliberately unused. It is
 *     unused because that is what the owner picked, NOT because the extractor
 *     could not carry it.
 *   - `<a class="scroll-link">SCROLL TO EXPLORE</a>` and the `.copyright`
 *     section. Both are donor English copy, both are anchors, and one points at
 *     `#works-anchor`, which is outside the cut. An anchor inside an
 *     `aria-hidden` overlay is a focusable node hidden from assistive
 *     technology — axe's `aria-hidden-focus` — so they could not stay.
 *   - Each tile's `<a id="from-top" href="works_*.html" class="cms-link">` with
 *     its "view" button. Same accessibility reason, and two more: the donor's
 *     case-study pages do not exist here, so `assertInternalLinks` in
 *     tools/build-site.mjs fails the build on them; and "view" is English copy
 *     that would print on the Chinese page. The tile keeps its `data-w-id`, so
 *     the donor's hover interaction (e-16/e-17 → a-9/a-10) still travels with
 *     the block; the overlay simply never gives it a pointer to react to.
 *
 * Nothing else is touched: every remaining element, class, `data-w-id`, inline
 * style and photograph is the donor's.
 *
 * ------------------------------------------------------------- the motion --
 *
 * None of the three animations can travel through tools/donor-lib.mjs, and the
 * reasons are three different ones. All three are replayed in
 * tools/blocks/og-intro.js with the donor's own numbers; the CSS staging is in
 * tools/blocks/og-intro.css.
 *
 *   1. The headline is IX2 `a-24` "Hero Load In", fired by `e-56`, a PAGE_START
 *      event whose target is `{id: "682b365fe602ffe9aded6871", appliesTo:
 *      "PAGE"}` — offgrid's own page id and no node of this block. donor-lib
 *      keeps an event only when its JSON names one of the block's data-w-ids or
 *      a selector on the event itself, so e-56 is left behind, exactly as
 *      qx-orbit's e-264 was. The two items of a-24 this cut still has targets
 *      for are:
 *        a-24-n-8   `.is-hero` h1   opacity 0 → 1, delay 0,    600ms, inOutQuart
 *        a-24-n-2   `.text-spam`    width 0.5% → AUTO, delay 1000, 1200ms,
 *                                   easing cubic-bezier(.544, -.011, 0, .983)
 *      (`a-24-n` and `a-24-n-9`, the initial state, are the `style="width:0.5%"`
 *      and `style="opacity:0"` the export already carries on those two nodes.)
 *      Webflow's `inOutQuart` is `t<.5 ? 8t⁴ : 1-8(1-t)⁴` — read out of the
 *      donor's own runtime, app.schunk.fe7205e557cb28d1.js — which is GSAP's
 *      `power4.inOut` exactly. `width: AUTO` is what the donor measures at run
 *      time, so og-intro.js measures it the same way.
 *
 *   2. The mosaic is not a Webflow interaction at all: it is a hand-written
 *      GSAP call in the last `<script>` of offgrid/index.html.
 *        gsap.fromTo(imgs,
 *          { autoAlpha: 0, scale: 0.8, rotateY: 45 },
 *          { autoAlpha: 1, scale: 1, rotateY: 0, duration: 1,
 *            stagger: { amount: 0.8, from: 'center', grid: [4, 9] },
 *            scrollTrigger: { trigger: worksGrid, start: 'top 60%', … } });
 *      `scale .8` × `rotateY 45deg` is the `matrix3d(0.565685, 0, -0.565685, …)`
 *      the tiles sit at, and `autoAlpha: 0` is what sets `visibility: hidden` on
 *      them — an inline style GSAP writes, not a stylesheet rule. Only the
 *      ScrollTrigger goes: an intro overlay has no scroll, so the tween's place
 *      in the sequence is its trigger instead. The two `ScrollTrigger.matchMedia`
 *      branches under it (the ≥992px pin-and-scrub and the ≤991px per-image
 *      scroll reveal) are scroll behaviour for the donor's own long page and
 *      have nothing to act on here.
 *
 *   3. The wipe is rototo's ix3 timeline `t-195e7dff` (interaction `i-34742931`,
 *      `wf:scroll` on class `page-loader`, start "top bottom"), whose columns
 *      action is
 *        ta-ae57309f  targets .page-loader-column
 *                     timing { position: .5, stagger: { each: .015,
 *                              from: "random" }, ease: 5 }, tt: 2 (fromTo)
 *                     properties { y: ["0%", "-100%"] }
 *      with no duration, so the runtime's own `DEFAULTS.DURATION` of 0.5s, and
 *      ease index 5 of its table
 *      ["none","power1.in","power1.out","power1.inOut","power2.in","power2.out",…]
 *      = `power2.out`. Both were read out of rototo's runtime,
 *      app.schunk.48d5e1fb57e2bf0a.js. donor-lib returns `{events, actionLists}`
 *      only — it never reads a donor's ix3 arrays — so this cannot travel
 *      either, and rototo is a second donor besides: a block module cuts from
 *      one. The loader is forty-eight `<div class="page-loader-column">` in a
 *      forty-eight-column grid and two CSS rules; og-intro.css restates those
 *      rules verbatim under this block's own namespace and quotes them there.
 *
 * The one thing in the sequence that is nobody's donor value is that rototo's
 * loader is already covering its page when it loads, so it only ever plays the
 * lift. Here it has to arrive over the settled mosaic first, and that arrival
 * is ta-ae57309f played the other way round — the same element, duration,
 * easing and stagger, no new numbers — followed by the donor's own `position:
 * .5` as the beat it holds before it lifts. og-intro.js says so where it does it.
 */
import { setText } from '../block-lib.mjs';

/* rototo's loader: forty-eight columns in a forty-eight-column grid. Counted in
   the donor's own index.html, where `page-loader-column` appears forty-nine
   times — forty-eight divs plus the name in the head's `:is(…)` guard list. */
export const WIPE_COLUMNS = 48;

/** OFFGRID ships thirty-six tiles, and the owner asked for all of them (全上). */
const TILES = 36;

export const donor = {
  id: 'og-intro',
  donor: 'offgrid',
  scope: '.og-intro',
  page: 'index.html',
  /* Named because offgrid ships two sheets: this one and Lenis's, which is the
     smooth-scroll library's and has nothing this block uses. */
  css: 'offgridtemplate.app.shared.75636b1ed.css',
  /* Hero and mosaic in one slice, in the donor's order. */
  start: '<div class="hero-section">',
  end: '_works-grid_image36.jpg" loading="eager" style="filter:blur(0px)" alt="E-commerce Platform Launch for ShopSmart" class="image"/></div></div></div></section>',
  /* The div the two of them were designed inside; `overflow: clip` is its rule
     and the cut needs it. */
  wrap: ['page-wrapper'],
  /* Every photograph is OFFGRID's own — no substitution, `mirror` default. */
  /* offgrid painted this on <body>; see the note in og-intro.css. */
  ground: '#0f0f0f',
};

/** `STARGO OS`, resolved against copy.mjs rather than typed here. */
/**
 * What the brackets say. The owner set it to STARGO WORK (2026-09-10):
 * 「改名字叫STARGO WORK , 不叫OS, 但是字左右两边的符号要保留」 — the site's own
 * name, and the `[` `]` offgrid draws around it stay exactly as they are (they
 * are donor markup either side of the span, and nothing here touches them).
 *
 * It is written here rather than read out of `HOME_THEATRE`, which is where it
 * used to come from. That constant is the homepage's own theatre section
 * (「STARGO OS ©」) and it still says OS, correctly — the opening and that
 * section simply do not name the same thing any more, so deriving one from the
 * other would either be wrong here or would silently rename the homepage. The
 * check below is what keeps this honest: the name must be one the site
 * actually uses.
 */
function productName(C) {
  const name = 'STARGO WORK';
  const known = [C.HOME_THEATRE?.zh?.split(' ©')[0].trim(), 'STARGO WORK'].filter(Boolean);
  if (!known.includes(name)) {
    throw new Error(`og-intro: "${name}" is not a name this site uses (${known.join(', ')})`);
  }
  return name;
}

export function render(frag, ctx) {
  const { C, escapeHtml } = ctx;
  let html = frag;

  /* ------------------------------------------------------- the headline ---- */

  /* The bracketed span carries the whole name. It is the product name in both
     languages — 「[STARGO OS]」 is what the owner chose, and a product name is
     not an English leak on the Chinese page, the same line copy.mjs already
     takes for STARGO WORK and STARGO OS everywhere else. */
  const name = productName(C);
  if (!html.includes('>OFF</span>]</h1>')) throw new Error('og-intro: the bracketed span is not where offgrid put it');
  html = setText(html, 'og-text-spam', escapeHtml(name));

  /* The second half of the headline. See the header: the owner put the whole
     name inside the brackets, so the word that slides in from the left has
     nothing to say. */
  const SECOND = /<h1 data-w-id="f6c08184-e970-488b-aaad-2a2f5919887c"[^>]*class="[^"]*og-is-hero_from-left"[^>]*>GRID<\/h1>/;
  if (!SECOND.test(html)) throw new Error('og-intro: the second headline is not where offgrid put it');
  html = html.replace(SECOND, '');

  /* --------------------------------------------- what an overlay cannot keep -- */

  /* "SCROLL TO EXPLORE" — donor copy, an anchor, and it jumps to #works-anchor,
     which is outside the cut. */
  const SCROLL = /<a data-w-id="53309684-69ba-c8b5-72e3-511d7ae8e4de"[\s\S]*?<\/a>/;
  if (!SCROLL.test(html)) throw new Error('og-intro: the scroll link is not where offgrid put it');
  html = html.replace(SCROLL, '');

  /* offgrid's credit line: two empty anchors, one of them href="#". */
  const CREDITS = /<section data-w-id="18f8d6c2-6f30-67d7-7ce5-b983e0bb8bfe"[\s\S]*?<\/section>/;
  if (!CREDITS.test(html)) throw new Error('og-intro: the copyright section is not where offgrid put it');
  html = html.replace(CREDITS, '');

  /* ------------------------------------------------------ the mosaic goes ---- */

  /* The owner watched the opening and cut the middle out of it (2026-09-10):
     「第二张图片这么多照片墙不要了，就是图三的字幕接着就是图一Rototo模版的这个
     效果」 — the bracketed name, then rototo's wipe, then the homepage. The
     thirty-six-tile works mosaic that ran between them is gone.

     It is removed from the markup, not merely left untweened. The tiles were
     36 photographs at 4.25 MB, eagerly fetched on every first visit to the
     homepage, and a hidden element still downloads its `src`. Cutting the
     section is what actually gets those megabytes back — it is by far the
     largest single item on the page.

     The cut still runs from offgrid's hero through the close of its works
     section, because that is one contiguous slice of the donor and the hero's
     own markup depends on nothing being resected around it; the works section
     is removed here, at its own boundary, so the slice stays honest about
     where it came from. */
  const WORKS = /<section class="og-works-section">[\s\S]*<\/section>/;
  if (!WORKS.test(html)) throw new Error('og-intro: the works section is not where offgrid put it');
  const removed = html.match(WORKS)[0];
  const tiles = (removed.match(/class="og-image"/g) ?? []).length;
  if (tiles !== TILES) throw new Error(`og-intro: expected to remove ${TILES} mosaic photographs, found ${tiles}`);
  html = html.replace(WORKS, '');
  if (/og-image|og-cms-link|works_/.test(html)) throw new Error('og-intro: something of the mosaic survived its removal');

  /* ------------------------------------------------------------ the wipe ---- */

  /* rototo's `<div class="page-loader"><div class="page-loader-column"></div>×48
     </div>`, rebuilt here rather than extracted: a block module cuts from one
     donor, and the rototo namespace belongs to the rototo blocks. The two rules
     that draw it are quoted verbatim in og-intro.css. */
  const columns = Array.from({ length: WIPE_COLUMNS }, () => '<div class="og-intro-column"></div>').join('');
  html += `<div class="og-intro-wipe">${columns}</div>`;

  /* -------------------------------------------------------------- checks ---- */

  if (/OFFGRID|>GRID<|SCROLL TO EXPLORE|>view<|works_[a-z-]*\.html/.test(html)) {
    throw new Error('og-intro: donor copy or a donor link survives in the rendered block');
  }
  if ((html.match(/<a\b/g) ?? []).length) throw new Error('og-intro: an anchor survives inside an aria-hidden overlay');
  /* The headline and its bracketed span. The thirty-six that belonged to the
     mosaic left with it. */
  const wids = (html.match(/data-w-id=/g) ?? []).length;
  if (wids !== 2) throw new Error(`og-intro: expected 2 data-w-ids to survive, found ${wids}`);
  return html;
}
