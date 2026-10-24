/**
 * 代码动画 — the homepage theatre under 「一个工作台，管好每天的生意。」.
 *
 * The template's seven-cell grid zooms out of the owner's brand film (cell 3,
 * assets/stargo-motion/orbit.mp4, kept with its pause button). The six cells
 * around it showed the owner's photographs W01–W06 until 2026-10-23; each is
 * now a code-drawn window of the STARGO WORK desktop (tools/replaceables.mjs
 * HERO.code), and the six windows tell one demo deal on one clock
 * (js/stargo-motion-desk.js, css/stargo-motion-desk.css).
 *
 * The host goes where the still went — inside the cell's
 * `.w-background-video` box, which keeps its size, radius, clipping and the
 * template's TV-dot layer above it — so the grid, its zoom and its reveal are
 * unchanged. Each host is role="img" with its MOTION_LABEL sentence.
 *
 * `theatreTiles` runs on the page after `stillImage` has written the markers
 * (`<img src="<HERO.theatre[i]>" alt="STARGO OS" loading="lazy" class="stargo-still"/>`)
 * and before the page's motion engine is added, so the scene file it puts in
 * front of </body> loads before js/stargo-motion.js, as the engine requires.
 */
import { HERO } from './replaceables.mjs';
import { motionHost, motionAssets, MOTION_CSS } from './motion-scenes.mjs';

/* Each window is drawn for its place in the ring (js/stargo-motion-desk.js
   gives it an app rail on the outer side, a status bar at the bottom in the
   top row, its tag in the title bar in the bottom row), so the cells must keep
   this order: top right, top left, middle left, the film, middle right,
   bottom right, bottom left. */
const RING = ['desk-sales', 'desk-growth', 'desk-cockpit', null, 'desk-quote', 'desk-erp', 'desk-creative'];

export function theatreTiles(h, lang) {
  if (HERO.code.join() !== RING.join()) throw new Error('index: the theatre windows are drawn for the ring order ' + RING.join());
  const scenes = [];
  HERO.code.forEach((scene, i) => {
    if (!scene) return;
    const marker = `<img src="${HERO.theatre[i]}" alt="STARGO OS" loading="lazy" class="stargo-still"/>`;
    const n = h.split(marker).length - 1;
    if (n !== 1) throw new Error(`index: theatre cell ${i} still marker found ${n} times`);
    h = h.replace(marker, () => motionHost(scene, lang, 'sgd-host'));
    scenes.push(scene);
  });
  if (scenes.length !== 6) throw new Error(`index: expected six code-drawn theatre windows, placed ${scenes.length}`);
  // only the desk files: the page links the engine's own sheet and scripts itself
  const { css, js } = motionAssets(scenes);
  // the windows are 20,000 px down the page and stay empty until they near the screen,
  // so their sheet loads without holding up the first paint
  const sheet = css.split('\n').filter((tag) => !tag.includes(`"${MOTION_CSS}"`)).join('\n')
    .replace(' rel="stylesheet"', ` rel="stylesheet" media="print" onload="this.media='all'"`);
  const script = js.replace('<script src="js/stargo-motion.js" defer></script>', '');
  if (!sheet.includes('stargo-motion-desk.css') || !script.includes('stargo-motion-desk.js') || script.includes('stargo-motion.js"')) throw new Error('index: theatre scene files');
  for (const [anchor, tag] of [['</head>', sheet], ['</body>', script]]) {
    if (h.split(anchor).length !== 2) throw new Error(`index: cannot place the theatre's ${anchor}`);
    h = h.replace(anchor, `${tag}${anchor}`);
  }
  return h;
}
