/**
 * 首页英雄区的旋转图片展示 — rototo's rotating hero gallery, dropped into the
 * empty band of this site's own homepage hero.
 *
 * WHERE IT GOES
 *   index.html's `.hero` (`.grid-hero-agency > .hero`) holds exactly two
 *   children, both `position: absolute`:
 *
 *     .container-bottom.add-px            inset: 120px 0% auto   (top: 84px ≤479)
 *       … the hero copy, then .bottom-grid._3.mk-grd — the four dots
 *     .container-bottom.bottom.add-max-cnt inset: auto 0% 30px   (10px ≤767, 100px ≤479)
 *       … "© 2026 STARGO WORK", then the STARGO / WORK wordmark
 *
 *   The owner drew a red box on the band between them and asked for the
 *   rotating gallery there — 「图片三的文字上下排版都不变，仅仅在红白的地方加入
 *   旋转的图片展示」. build-site.mjs inserts this block as a third child of
 *   `.hero`, between those two. Neither of them can move: `.add-px` is pinned
 *   by an explicit `top`, `.bottom` by an explicit `bottom`, so neither takes
 *   its position from the static flow a new sibling would shift. The block's
 *   own root is `position: absolute` as well, and `.hero` already clips
 *   (`overflow: hidden`), so nothing it draws can reach the page around it.
 *   `.ro-gallery { z-index: 0 }` (tools/blocks/ro-gallery.css) puts it under
 *   both `.container-bottom` rows, which carry `z-index: 2` — the band is
 *   shallow at some viewport shapes (measured 15.5px at 1366×768 on the Chinese
 *   page), and behind the type is the one place the gallery can never cover a
 *   word.
 *
 * WHAT IS TAKEN
 *   `.home-main-section-wrap` out of tools/templates/rototo/index.html, whole:
 *
 *     .home-main-section-wrap            perspective: 2000px, overflow: clip
 *       .home-hero-wrapper               0 × 150rem, preserve-3d
 *         .home-header-group.first       ×3, absolute inset 0, base rotate
 *           .home-header-img-wrap        ×8, 14rem wide, origin 50% 100%,
 *                                        rotate(-45deg × n) — a 1200px wheel
 *             img.home-header-img        16/9, rotateX(-90deg) so it stands up
 *
 *   Three wheels of eight, 24 photographs, offset -15° / -30° / 0°. Every one
 *   of them is rototo's own — the owner asked for the template's pictures
 *   ("用 rototo 原图") — so `donor.mirror` keeps its default and
 *   tools/mirror-donor-assets.mjs fetches all 111 files (24 `src` +
 *   their -p-500/800/1080/1600/2000 variants; 5.62 MB) into assets/rototo/.
 *   No image is substituted and none is dropped.
 *
 * WHAT THE WORDS BECOME
 *   There are none. The block is 24 `<img>` elements and 28 `<div>`s; rototo
 *   ships no text inside `.home-main-section-wrap`, and the owner asked for
 *   nothing to be added — the hero's own copy above the band and the wordmark
 *   below it are what carry the page. The only words in the cut are the alt
 *   attributes ("hero image" ×23, "office" ×1). They describe photographs of
 *   rototo's imagined products, they are English on a page that must read
 *   Chinese-only, and inventing a Chinese description of a stock render would
 *   be inventing a fact about this company's work. They are emptied, exactly as
 *   tools/blocks/qx-orbit.mjs empties its eight orbit photographs: decorative
 *   images, announced as nothing. That is the whole of render().
 *
 * MOTION — read this before wondering why the block ships a .css
 *   None of the gallery's motion can travel with the cut. rototo drives it
 *   three ways, and tools/donor-lib.mjs carries only IX2 events:
 *
 *   1. The turn. An inline script in rototo's index.html:
 *          gsap.to(".home-hero-wrapper",
 *                  { rotateY: "360deg", duration: 50, ease: "linear", repeat: -1 });
 *      Not Webflow data at all — a hand-written GSAP tween on the page. No tool
 *      in this repo reads a donor's inline scripts.
 *   2. The approach. Another inline script:
 *          gsap.fromTo(".home-hero-wrapper", { z: "-1200rem" },
 *            { z: isMobile ? "60rem" : "100rem", duration: 3.5, ease: "cubic.inOut",
 *              scrollTrigger: { trigger: ".home-section", start: "top 80%",
 *                               toggleActions: "play none none none" } });
 *      `isMobile` is `matchMedia("(max-width: 490px)")`.
 *   3. The unwind and the tilt. Webflow ix3 timeline `t-dd507239`, fired by
 *      interaction `i-9cb16577` (wf:scroll on `.hero-section.home-hero`,
 *      start "top bottom", scrub null, enter "play" — so it plays once):
 *          ta-a08ed7c5  .home-header-group.first   rotation −15deg → −375deg  4s   pos 0    ease 12
 *          ta-33d0f24c  .home-header-group.second  rotation −30deg → −390deg  4s   pos 0    ease 12
 *          ta-254e77f4  .home-header-group.third   rotation   0deg → −360deg  4s   pos 0    ease 12
 *          ta-58dc173f  .home-hero-wrapper         rotationX 50deg →   90deg  4.5s pos 0    ease 12
 *          ta-eee06759  .home-main-section-wrap    opacity     0% →   100%    1.5s pos 0.5  ease 0
 *      ix3 is GSAP data; donor-lib returns `{events, actionLists}` (IX2) only.
 *      Ease 12 is index 12 of the ix3 runtime's own table in
 *      js/app.schunk.48d5e1fb57e2bf0a.js — ["none","power1.in",…] — i.e.
 *      `power4.inOut`; ease 0 is "none". Sampled in the donor's own page,
 *      gsap.parseEase("power4.inOut") is quintic in-out (0.00016 at t=0.1) and
 *      "cubic.inOut" is the same function object as "power2.inOut" (0.004 at
 *      t=0.1). tools/blocks/ro-gallery.css replays all three with those values.
 *
 *   Measured live in the donor at 1366×768, the resting state the three reach
 *   is `.home-hero-wrapper` at
 *       translate3d(0,0,100rem) rotateY(θ) rotateX(90deg),  θ = 7.2 deg/s
 *   (0.8064° at 231ms → 144.792° at 20 225ms — 360° in 50s, linear), with the
 *   three groups back on their authored −15/−30/0. The css writes exactly that,
 *   splitting the composite across `translate` / `rotate` / `transform` so the
 *   three tweens stay independent in the order GSAP itself emitted them.
 */
import { DONORS } from '../block-lib.mjs';

export const donor = {
  id: 'ro-gallery',
  donor: 'rototo',
  scope: '.ro-gallery',
  page: 'index.html',
  /* rototo ships two stylesheets — its own export and lenis's smooth-scroll
     helper — so donor-lib cannot infer which one holds the block's rules. */
  css: 'rototo.app.shared.47861eb30.min.css',
  /* The wrap, not the section: `.home-main-section-wrap` is `position:absolute;
     inset:0%` and carries the `perspective` the whole composition is seen
     through, so it needs a positioned ancestor and nothing else. `.ro-gallery`
     is that ancestor, so there is no `wrap` — pulling rototo's `.home-section`
     in would drag its 100vh height and its own hero copy along with it. */
  start: '<div class="home-main-section-wrap">',
  end: 'alt="hero image" class="home-header-img"/></div></div></div></div>',
  /* No `ground`: the gallery paints nothing of its own — it is 24 photographs
     on a transparent stage — and rototo's `body` colour would repaint this
     site's hero, which must not change. */
};

/** rototo's own alt text on the 24 wheel photographs, as the cut ships it. */
const ALTS = { 'hero image': 23, office: 1 };

export function render(frag, ctx) {
  let html = frag;

  /* The cut is images and nothing else: three wheels of eight. If rototo is
     ever re-cut and that stops being true, fail here rather than ship a
     silently shorter gallery. */
  const wheels = (html.match(/class="ro-home-header-group /g) ?? []).length;
  if (wheels !== 3) throw new Error(`ro-gallery: rototo turns three wheels, found ${wheels}`);
  const spokes = (html.match(/class="ro-home-header-img-wrap/g) ?? []).length;
  if (spokes !== 24) throw new Error(`ro-gallery: expected 24 photographs (3 × 8), found ${spokes}`);
  if (/>[^<>\s][^<>]*</.test(html.replace(/<img[^>]*>/g, ''))) {
    throw new Error('ro-gallery: the cut has grown text; rototo ships none, and the owner asked for none');
  }

  /* Every image is mirrored, none is substituted: the build refuses a
     reference that is not on disk, so a surviving CDN url is a build failure,
     not a runtime one. Checked here anyway because this block's whole content
     is images. */
  if (/https?:\/\//.test(html)) {
    throw new Error(`ro-gallery: an off-origin url survived the cut: ${html.match(/https?:\/\/[^"' ]+/)[0]}`);
  }

  /* The words. rototo's alt text names its own imagined products in English on
     a page that reads Chinese only, and no true Chinese caption exists for a
     stock render, so the photographs are announced as what they are here:
     decoration behind the hero's own copy. Same line qx-orbit takes with its
     eight orbit photographs. */
  for (const [alt, n] of Object.entries(ALTS)) {
    const found = (html.match(new RegExp(`alt="${alt}"`, 'g')) ?? []).length;
    if (found !== n) throw new Error(`ro-gallery: expected ${n} × alt="${alt}", found ${found}`);
    html = html.split(`alt="${alt}"`).join('alt=""');
  }
  const named = html.match(/alt="[^"]+"/g);
  if (named) throw new Error(`ro-gallery: an alt attribute still names something: ${named[0]}`);

  /* THE SIZE THE BROWSER IS TOLD TO FETCH.
     Every one of these images ships six variants (500/800/1080/1600/2000/2544w)
     and a `sizes` that rototo wrote for its own page, where the photograph is
     full-bleed: `(max-width: <n>px) 100vw, <n>px`. Here it is not. The tile is
     `.ro-home-header-img-wrap { width: 14rem }` — 261px at 1920, 224px at 1439
     — so `100vw` tells the browser it needs about seven times the pixels it
     will draw, and it duly fetches the 2000w file (85.2 KB) for a 261px box
     when the 500w one (16.4 KB) is the right plate. Measured over the 24
     photographs that is 1.59 MB where ~0.39 MB will do at 1x, ~0.74 MB at 2x.

     Nothing about the pictures or the motion changes: same files, same
     srcset, same wheel — only which of the six plates the browser is told to
     pick. The owner authorised this one attribute.

     The numbers are 14rem evaluated at the top of each range rototo's own
     `--layout--size-font-base` is constant over (it is
     `clamp(768px,100vw,1920px) / (1440/unit)`, and `unit` steps 24/16/15/14 at
     991/1280/1440/1920). The top of each range is used, never the middle, so
     the value never under-states the box and the browser is never talked into
     a plate coarser than the tile. Below 768 the block is `display: none` and
     the images are never laid out, so the first entry is academic.

       ≤991    14rem at 991  = 231px        ≤1439  14rem at 1439 = 224px
       ≤1919   14rem at 1919 = 280px        ≥1920  14rem at 1920 = 261px */
  const SIZES = '(max-width: 991px) 231px, (max-width: 1439px) 224px, (max-width: 1919px) 280px, 261px';
  const before = (html.match(/ sizes="[^"]*"/g) ?? []).length;
  if (before !== 24) throw new Error(`ro-gallery: expected 24 sizes attributes to retarget, found ${before}`);
  html = html.replace(/ sizes="[^"]*"/g, ` sizes="${SIZES}"`);
  if ((html.match(/100vw/g) ?? []).length) throw new Error('ro-gallery: a donor `100vw` sizes hint survived');

  /* ctx is unused: this block changes no words because it has none. Touch it
     so the contract in tools/blocks/README.md stays visible at the call site. */
  if (!ctx || (ctx.lang !== 'zh' && ctx.lang !== 'en')) throw new Error(`ro-gallery: unknown lang ${ctx?.lang}`);
  if (!DONORS[donor.donor]) throw new Error(`ro-gallery: donor ${donor.donor} is not registered`);

  return html;
}
