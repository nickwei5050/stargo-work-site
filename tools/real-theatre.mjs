/**
 * 真实截图 — the homepage theatre under 「一个工作台，管好每天的生意。」.
 *
 * The template's seven-cell grid zooms out of the owner's brand film (cell 3,
 * assets/stargo-motion/orbit.mp4, kept with its pause button). The six cells
 * around it showed the owner's photographs W01–W06 until 2026-10-23, then six
 * code-drawn windows of the STARGO WORK desktop that told one demo deal on
 * one clock (js/stargo-motion-desk.js, css/stargo-motion-desk.css; this file
 * was tools/code-art-theatre.mjs). The owner, 2026-10-24 17:27 UTC:
 * 「你现在也全是代码了，我系统的画面都没有了！我需要真实系统截图放在特定的地方」.
 * A cell that shows the product shows the product's own screen, so since that
 * day each of the six is a slot with a crop of his captures
 * (tools/real-screens/theatre.json, tools/real-screens.mjs realShot), and its
 * tag says 真实界面 · 演示数据. tools/replaceables.mjs HERO.real records which
 * crop each cell shows; HERO keeps the windows and the photographs as history.
 *
 * The slot goes where the still went — inside the cell's `.w-background-video`
 * box, which keeps its size, radius, clipping and the template's TV-dot layer
 * above it — so the grid, its zoom and its reveal are unchanged. The slot is
 * not role="img": its <img> carries the alt (the page's editorial pass writes
 * it, with width, height and srcset).
 *
 * `theatreTiles` runs on the page after `stillImage` has written the markers
 * (`<img src="<HERO.theatre[i]>" alt="STARGO OS" loading="lazy" class="stargo-still"/>`).
 */
import { HERO } from './replaceables.mjs';
import { realShot, withRealCss } from './real-screens.mjs';

/* The ring is cut by the screen. At rest (the grid's last scale, 1.1) the outer
   ~9% of a row cell, the outer ~14% of a middle cell and the top ~11% of the
   top row are past the viewport's edge on every screen from 768px up, and stay
   there while the section scrolls away; the bottom row is seen whole once it
   does. The crops keep expendable ground in those bands, and each frame below
   says, per cell: which side of the crop a narrower or wider cell gives up
   (pos / uprightPos, toward the outer side), and the slot's sizes. During the
   zoom a cell is drawn up to ~3x its box, so a row cell asks for a picture as
   wide as the screen (the 1600 file on a desktop) and a middle cell for two
   thirds of it. Below 768px (Z10 in css/stargo-fusion.css) the grid is not
   zoomed, so a cell needs about its own width. */
const ROW = '(max-width: 767px) 50vw, 100vw';
const MID = '(max-width: 767px) 33vw, 66vw';
const FRAME = {
  tr: { sizes: ROW, pos: '0% 0%', uprightPos: '0% 0%' },     // Sales Desk: keep the conversation, give up the assistant's far edge
  tl: { sizes: ROW, pos: '50% 100%', uprightPos: '0% 0%' },  // Growth OS: the two cards and the AI line under them; in portrait the 开始找客户 card
  ml: { sizes: MID, pos: '100% 0%', uprightPos: '0% 0%' },   // board: keep the 等你审批 panel, give up the empty left of the board; in portrait the phone board's left column
  mr: { sizes: MID, pos: '0% 0%', uprightPos: '0% 0%' },     // quotes: keep 报价 · 金额 · 有效期, give up 下一步
  br: { sizes: ROW, pos: '0% 0%', uprightPos: '0% 0%' },     // ERP: keep the item names and status
  bl: { sizes: ROW, pos: '50% 60%', uprightPos: '50% 0%' },  // canvas: the title, its line and the buttons stay together
};
/* RING order of the cells in the DOM (the template's): top right, top left,
   middle left, the film, middle right, bottom right, bottom left. */
const RING = ['tr', 'tl', 'ml', null, 'mr', 'br', 'bl'];

export const THEATRE_CSS = '<link href="css/stargo-theatre.css" rel="stylesheet" type="text/css"/>';

export function theatreTiles(h, lang) {
  if (HERO.real.map((c) => c && c.at).join() !== RING.join()) throw new Error('index: the theatre cells are framed for the ring order ' + RING.join());
  let placed = 0;
  HERO.real.forEach((cell, i) => {
    if (!cell) return;
    const marker = `<img src="${HERO.theatre[i]}" alt="STARGO OS" loading="lazy" class="stargo-still"/>`;
    const n = h.split(marker).length - 1;
    if (n !== 1) throw new Error(`index: theatre cell ${i} still marker found ${n} times`);
    const f = FRAME[cell.at];
    h = h.replace(marker, () => realShot(cell.id, lang, {
      sizes: f.sizes, upright: cell.upright || undefined, uprightSizes: f.sizes,
      pos: f.pos, uprightPos: f.uprightPos, cls: `sg-th sg-th-${cell.at}`,
    }));
    placed++;
  });
  if (placed !== 6) throw new Error(`index: expected six real screens round the film, placed ${placed}`);
  // the shared slot sheet, then the theatre's own: which corner the tag takes in each cell, the
  // ground under a crop before it loads, and the Growth OS cell's offset from the cut edge
  h = withRealCss(h);
  if (h.split('</head>').length !== 2) throw new Error('index: cannot place the theatre sheet');
  return h.replace('</head>', `${THEATRE_CSS}\n</head>`);
}
