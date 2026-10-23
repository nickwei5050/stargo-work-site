/**
 * One-off generator for the coarse land mask in js/stargo-motion-growth.js
 * (the 贸易情报 background of the capabilities page's Growth OS rows).
 *
 *   node tools/motion-map-coarse.mjs
 *
 * It resamples the dotted world map the homepage's radar already ships
 * (js/stargo-motion-map.js: Natural Earth land, public domain, via world-atlas,
 * ISC) onto a 3° grid centred on the Pacific — the way world maps printed in
 * China are drawn, so the lanes from Chinese ports run west to Europe and east
 * to the Americas without crossing the map's edge. One bit a cell, row by row,
 * base64: about 0.9 kB instead of the radar map's 25 kB. Paste the printed
 * line over MASK in the scene file.
 */
import { readFileSync } from 'node:fs';
import { SITE } from './paths.mjs';

const src = readFileSync(`${SITE}/js/stargo-motion-map.js`, 'utf8');
const map = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1).replace(/(\w+):/g, '"$1":'));
const W0 = -30, COLS = 120, ROWS = 45, STEP = 3, TOP = 78;
const bits = new Uint8Array(Math.ceil((COLS * ROWS) / 8));
for (let i = 0; i < map.dots.length; i += 2) {
  let lon = (map.dots[i] / map.w) * 360 - 180;
  const lat = map.top - (map.dots[i + 1] / map.h) * (map.top - map.bottom);
  if (lon < W0) lon += 360;
  const c = Math.floor((lon - W0) / STEP), r = Math.floor((TOP - lat) / STEP);
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
  const n = r * COLS + c;
  bits[n >> 3] |= 128 >> (n & 7);
}
console.log(`var MASK = { w0: ${W0}, top: ${TOP}, step: ${STEP}, cols: ${COLS}, rows: ${ROWS}, bits: '${Buffer.from(bits).toString('base64')}' };`);
