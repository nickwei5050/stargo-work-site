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
 *   Three wheels of eight, 24 tiles, offset -15° / -30° / 0°. The cut still
 *   arrives carrying rototo's own 24 photographs, and it still mirrors them:
 *   `donor.mirror` keeps its default and tools/mirror-donor-assets.mjs fetches
 *   all 111 files (24 `src` + their -p-500/800/1080/1600/2000 variants;
 *   5.62 MB) into assets/rototo/, so the extraction stays reproducible and the
 *   fragment on disk still resolves. Nothing here deletes them.
 *
 *   What the built page shows is no longer those photographs. The owner's
 *   handoff of 2026-09-18 supplied six screenshots of STARGO WORK's own
 *   product and authorised them for brand, product and feature imagery, and
 *   render() stands those six on the 24 spokes — four appearances each, every
 *   wheel showing all six, no picture twice in a row around a wheel (LAYOUT,
 *   below, which checks all three of those at module load). Nothing else about
 *   the block changes: same elements, same classes, same transforms, same
 *   attributes, same motion. Only each `<img>`'s `src`, and the `srcset`/`sizes`
 *   pair that named the donor's files, are touched.
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

/** The six screenshots the owner approved (handoff of 2026-09-18), registered in
    tools/imagegen/product-assets.json. LAYOUT indexes this list. */
const TILES = [
  'sw003-ai-workspace-home',
  'sw004-experts-library',
  'sw006-expert-teams',
  'sw008-workflow-library',
  'sw028-sales-desk-inquiry-reply',
  'sw033-sales-desk-document-pack',
];

/* WHICH PICTURE STANDS ON WHICH SPOKE.

   Three wheels of eight is 24 places for six pictures, so each shows four
   times. Each row below is one wheel, in the DOM's own order, which inside a
   wheel is the angular order: 0°, −45°, −90°, −135°, −180°, −225°, −270°, −315°
   (rototo's class names skip `fifth`; SPOKES holds the sequence and render()
   asserts the markup still comes in it). Eight places and six pictures means
   two of the six repeat inside a wheel; a different two repeat in each wheel,
   which is what makes the totals come out at four each while every wheel still
   shows all six.

   BUT A WHEEL IS NOT WHAT A READER SEES. The three wheels are coaxial and are
   offset from each other — `.ro-first` rotate(−15deg), `.ro-second`
   rotate(−30deg), `.ro-third` rotate(0) in css/rototo.ro.css, which is also
   where rototo's own unwind lands them — so their spokes interleave. Reading
   round the screen from 0° the tiles come:

       third[0] (0°) · first[0] (−15°) · second[0] (−30°) · third[1] (−45°) …

   which is RING below: 24 tiles, three per 45° cluster, closing back on
   third[0]. Neighbours on one wheel are 45° and two other tiles apart; the
   tiles actually beside each other on screen belong to different wheels. So the
   repeat to avoid is a repeat in RING, and the check below asks for more than
   that: no picture twice within any three consecutive tiles, i.e. never twice
   inside one 45° cluster and never in two touching ones. That is what the
   checks below assert; the gaps between one picture's four appearances run from
   5 to 8 tiles, which no rule here constrains further. */
const LAYOUT = [
  [2, 4, 2, 0, 5, 4, 3, 1],   // .ro-first,  −15°
  [5, 0, 5, 4, 3, 1, 2, 0],   // .ro-second, −30°
  [3, 1, 3, 1, 2, 0, 5, 4],   // .ro-third,    0°
];

/** rototo's spoke order inside a wheel. There is no `fifth`: the donor skips it. */
const SPOKES = ['', 'ro-first', 'ro-second', 'ro-third', 'ro-fourth', 'ro-sixth', 'ro-seventh', 'ro-eighth'];

/** The 24 tiles in the order a reader meets them: third, first, second, spoke by spoke. */
const RING = Array.from({ length: SPOKES.length * 3 }, (_, i) => LAYOUT[[2, 0, 1][i % 3]][Math.floor(i / 3)]);

/* Everything LAYOUT promises, checked where LAYOUT is written rather than
   trusted, because none of it is visible by reading the rows: every wheel shows
   all six pictures, no picture stands on two cyclically neighbouring spokes of
   a wheel, each picture appears exactly four times over the 24, and no picture
   appears twice within any three consecutive tiles of RING. Editing the rows
   above without keeping all four fails the build. */
{
  const count = new Map();
  LAYOUT.forEach((wheel, w) => {
    if (wheel.length !== SPOKES.length) throw new Error(`ro-gallery: wheel ${w} has ${wheel.length} spokes, not ${SPOKES.length}`);
    wheel.forEach((tile, i) => {
      if (!TILES[tile]) throw new Error(`ro-gallery: wheel ${w} spoke ${i} names picture ${tile}, which is not one of the six`);
      if (tile === wheel[(i + 1) % wheel.length]) throw new Error(`ro-gallery: ${TILES[tile]} stands on neighbouring spokes ${i} and ${(i + 1) % wheel.length} of wheel ${w}`);
      count.set(tile, (count.get(tile) ?? 0) + 1);
    });
    if (new Set(wheel).size !== TILES.length) throw new Error(`ro-gallery: wheel ${w} shows ${new Set(wheel).size} of the ${TILES.length} pictures`);
  });
  TILES.forEach((id, tile) => { if (count.get(tile) !== 4) throw new Error(`ro-gallery: ${id} stands on ${count.get(tile) ?? 0} spokes, not 4`); });
  RING.forEach((tile, i) => {
    for (const step of [1, 2]) {
      const j = (i + step) % RING.length;
      if (tile === RING[j]) throw new Error(`ro-gallery: ${TILES[tile]} is ${step} tile(s) from itself on screen, at ring positions ${i} and ${j}`);
    }
  });
}

export function render(frag, ctx) {
  let html = frag;

  /* The cut is images and nothing else: three wheels of eight. If rototo is
     ever re-cut and that stops being true, fail here rather than ship a
     silently shorter gallery. */
  const wheels = (html.match(/class="ro-home-header-group /g) ?? []).length;
  if (wheels !== LAYOUT.length) throw new Error(`ro-gallery: rototo turns three wheels, found ${wheels}`);
  const spokes = (html.match(/class="ro-home-header-img-wrap/g) ?? []).length;
  if (spokes !== 24) throw new Error(`ro-gallery: expected 24 photographs (3 × 8), found ${spokes}`);
  if (/>[^<>\s][^<>]*</.test(html.replace(/<img[^>]*>/g, ''))) {
    throw new Error('ro-gallery: the cut has grown text; rototo ships none, and the owner asked for none');
  }

  /* Every image the cut arrives with is mirrored, none of it is a live url: the
     build refuses a reference that is not on disk, so a surviving CDN url is a
     build failure, not a runtime one. Checked here anyway because this block's
     whole content is images — and it runs before the substitution below, so it
     is rototo's own references that are checked, as it was written to do. */
  if (/https?:\/\//.test(html)) {
    throw new Error(`ro-gallery: an off-origin url survived the cut: ${html.match(/https?:\/\/[^"' ]+/)[0]}`);
  }

  /* THE WORDS. rototo's alt text names its own imagined products in English on
     a page that reads Chinese only, so it goes; and the tiles stay announced as
     nothing after the substitution below, for the reason they were emptied in
     the first place. Six pictures on 24 spokes is each one read out four times,
     behind the hero's own copy, by a wheel that is turning while it is read —
     decoration, whatever it is a picture of. Each of the six is announced in
     full where it is content: tools/editorial-images.mjs writes the registered
     sentence onto the five-stage and core-system slots further down this same
     page. Same line qx-orbit takes with its eight orbit photographs.

     `alt=""` is also what tells tools/editorial-images.mjs to leave them silent
     (its `decorative` test), so emptying them here is the whole decision. */
  for (const [alt, n] of Object.entries(ALTS)) {
    const found = (html.match(new RegExp(`alt="${alt}"`, 'g')) ?? []).length;
    if (found !== n) throw new Error(`ro-gallery: expected ${n} × alt="${alt}", found ${found}`);
    html = html.split(`alt="${alt}"`).join('alt=""');
  }
  const named = html.match(/alt="[^"]+"/g);
  if (named) throw new Error(`ro-gallery: an alt attribute still names something: ${named[0]}`);

  /* THE PICTURES. The owner's six screenshots replace rototo's 24 photographs,
     one spoke at a time, in LAYOUT's order.

     The donor's tag is edited, not rebuilt: whatever else rototo put on it —
     `loading`, its classes, any data attribute a later cut might carry — comes
     through untouched, and the wheel's own transforms live on the wrapping
     `<div>`, which is not rewritten at all. Three attributes are decided here:
     `src` becomes the approved file, and `srcset`/`sizes` go, because they name
     files that are no longer being shown.

     `.ro-gallery .ro-home-header-img` is `aspect-ratio: 16/9; object-fit: cover`
     inside a `width: 14rem` wrapper (css/rototo.ro.css) and all six screenshots
     are 1268×714 — 1.7759 against the box's 1.7778 — so `cover` scales them to
     the tile's width and takes 0.13px off the height, about a fifteenth of a
     pixel top and bottom on the 224px tile. Nothing is cropped in any sense a
     reader could see and no interface loses an edge, so the donor's `cover`
     stays and the box is not touched.

     The spoke's modifier class is checked against SPOKES as we go, because
     LAYOUT's "no two neighbours alike" is a claim about angular order and the
     only thing making DOM order equal angular order is that rototo emitted the
     wraps in it. */
  const hadSrcset = (html.match(/ srcset="[^"]*"/g) ?? []).length;
  const hadSizes = (html.match(/ sizes="[^"]*"/g) ?? []).length;
  if (hadSrcset !== 24 || hadSizes !== 24) throw new Error(`ro-gallery: expected 24 srcset and 24 sizes attributes to drop, found ${hadSrcset} and ${hadSizes}`);
  let n = 0;
  html = html.replace(/<div class="ro-home-header-img-wrap([^"]*)">(<img\b[^>]*class="ro-home-header-img"\/>)<\/div>/g, (whole, mod, img) => {
    const w = Math.floor(n / SPOKES.length), s = n % SPOKES.length;
    n += 1;
    if (mod.trim() !== SPOKES[s]) throw new Error(`ro-gallery: wheel ${w} spoke ${s} is "${mod.trim()}", expected "${SPOKES[s]}" — the wheels no longer come in angular order`);
    const src = `assets/stargo-product/${TILES[LAYOUT[w][s]]}.webp`;
    return `<div class="ro-home-header-img-wrap${mod}">${img.replace(/ (?:srcset|sizes)="[^"]*"/g, '').replace(/src="[^"]*"/, `src="${src}"`)}</div>`;
  });
  if (n !== 24) throw new Error(`ro-gallery: substituted ${n} of 24 tiles`);
  if (/assets\/rototo\//.test(html)) throw new Error('ro-gallery: a donor photograph survived the substitution');
  if ((html.match(/ sizes="[^"]*"/g) ?? []).length || (html.match(/ srcset="[^"]*"/g) ?? []).length) {
    throw new Error('ro-gallery: a donor srcset/sizes hint survived');
  }
  if ((html.match(/class="ro-home-header-img"/g) ?? []).length !== 24) {
    throw new Error('ro-gallery: a tile lost its `ro-home-header-img` class, which is what sizes it');
  }

  /* THE SIZE THE BROWSER IS TOLD TO FETCH — now decided in one place, with
     every other picture on the site. tools/editorial-images.mjs looks each
     product image up in its manifest and writes back `width`, `height`,
     `srcset` (480 / 768 / 1024 / 1268w) and a `sizes` it picks by class: the
     `ro-home-header-img` tiles get `sizes="224px"`, their own box, instead of a
     viewport fraction. That is why the class is asserted above, and it is what
     makes the tile fetch the 480-wide plate rather than the 1268-wide original.

     224px is 14rem, and the rem is rototo's own `--layout--size-font-base`
     (`clamp(768px,100vw,1920px) / (1440/unit)`, `unit` stepping 24/16/15/14 at
     991/1280/1440/1920). Evaluated at the top of each range that expression is
     constant over, the tile is 231px ≤991, 224px ≤1439, 280px ≤1919 and 261px
     from 1920 — measured on the built page it is 224.0px at 1440 and 261.3px at
     1920, which is those numbers. One hint has to serve all four, and 224px is
     it: every one of them selects the 480 plate, and 480 is wider than the
     widest the tile ever gets, so the picture is never resampled up at 1x. On a
     2x screen at 1920 the true box would ask for the 768 plate and gets the 480
     — a tile 261px across, behind the hero's own copy, on a wheel that is
     turning. The whole gallery is 24 of these; the 480s are ~25 KB each where
     the originals are ~90 KB. Below 768 the block is `display: none` and the
     tiles are never laid out at all. */

  /* ctx is unused: this block changes no words because it has none. Touch it
     so the contract in tools/blocks/README.md stays visible at the call site. */
  if (!ctx || (ctx.lang !== 'zh' && ctx.lang !== 'en')) throw new Error(`ro-gallery: unknown lang ${ctx?.lang}`);
  if (!DONORS[donor.donor]) throw new Error(`ro-gallery: donor ${donor.donor} is not registered`);

  return html;
}
