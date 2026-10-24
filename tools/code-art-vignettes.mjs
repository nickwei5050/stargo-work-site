/**
 * 代码小景 — the trade-business vignettes (lane "vignettes", 2026-10-24).
 *
 * The owner: 「你看看整个网站还有什么是可以图片改成代码的地方全部做好」. Two
 * slots showed the owner's AI photographs H01–H10, P03, C08 and W02, many at
 * once and inside moving containers:
 *   - the homepage's opening mosaic that the white hero card shrinks to reveal
 *     (`.hero-photo-wrapper` up and down; tools/chrome.mjs writes the tiles
 *     through tools/replaceables.mjs HOME_MOSAIC), 20 tiles that scroll;
 *   - the capability page's 「每项 工作」 ring (tools/blocks/cn-produce.mjs,
 *     RING_STILLS), 27 tilted cards on a turning wheel.
 * Each photograph is now one static vignette drawn in code, one per picture,
 * telling the same moment in the product's demo cast (Müller Energie's
 * 200 × 48V 100Ah order SO-2041, DAP Hamburg; quote Q-1042 waiting for
 * approval; 柳州工厂):
 *
 *   h01 港口蓝调   a quay crane at blue hour and the ETA board for Hamburg
 *   h02 深夜询盘   02:14, a new RFQ from Müller Energie, a reply drafted for you to confirm
 *   h03 样品墙     a sample wall of lithium packs, one tagged
 *   h04 卡尺质检   a caliper on a pack terminal, the readout inside its tolerance band
 *   h05 装配线     line throughput and station status
 *   h06 打包       a carton with its shipping mark and the packing list ticking
 *   h07 老板巡厂   the owner's phone with today's numbers
 *   h08 产品拍摄   AI 创作: four product-shot variants, one picked, waiting for you
 *   h09 装柜       the 40HQ load plan filling
 *   h10 视频展示   视频制作: a player and its storyboard
 *   p03 履约       SO-2041's milestones
 *   c08 产品参考   reference pictures → a generated main image
 *   w02 车间       the workshop floor plan with each machine's state
 *
 * Why static: up to 27 show at once inside a scrolling mosaic and a turning
 * wheel, so nothing ticks — no script, no CSS animation. Each vignette is
 * drawn once per page into a hidden SVG sprite (`<g id="sgv-<key>">`); every
 * tile is a host `<div role="img">` holding two `<svg><use/></svg>` windows
 * onto that drawing (css/stargo-vignettes.css shows one):
 *   far   viewBox 0 0 800 500, the whole picture (a box wider than ~440px)
 *   near  viewBox 190 60 420 380, the middle of it, for the small boxes
 *         (the phone mosaic, the tablet's narrow column and the ring cards),
 *         so the drawing is shown larger where the box is small.
 * Both are `xMidYMid slice`, so a tile is always covered (the tiles run from
 * 2.3:1 to 0.5:1). Everything that names the vignette sits in the centre
 * 284 × 236 (x 258–542, y 132–368), which every crop of either window keeps;
 * the rest of the canvas is context that wide tiles show.
 *
 * Honesty: every host is role="img" with a short sentence that starts
 * 「示意：」/ "Illustration: ", and carries the 示意 / Illustration pill. The
 * pictures claim nothing the pages around them do not; the products are the
 * site's own (AI 创作, 视频制作, 客户会话) and no third-party name appears.
 */

import { RING_STILLS } from './replaceables.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------ palette -- */
const BG = '#15110e';
const PANEL = '#1f1813';
const RAISE = '#2a2019';
const INK = '#f4eee8';
const OR = '#ec6f10';
const OR2 = '#ff8a3d';
const PEACH = '#ffb37a';
const OK = '#9fe0b0';
const HAIR = 'rgba(255,236,220,.09)';
const MUTE = 'rgba(244,238,232,.56)';
const DIM = 'rgba(244,238,232,.34)';

/* ------------------------------------------------------------ helpers -- */
const n = (v) => Math.round(v * 10) / 10;
/** A line's width in canvas units: CJK 1em, Latin about .58em. */
const est = (str, size) => [...str].reduce((w, c) => w + (/[\u2e80-\uffff]/.test(c) ? 1 : 0.58), 0) * size;
const attrs = (o = {}) => Object.entries(o).map(([k, v]) => ` ${k}="${v}"`).join('');
const rect = (x, y, w, h, fill, o = {}) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}"${attrs(o)}/>`;
const rr = (x, y, w, h, r, fill, o = {}) => rect(x, y, w, h, fill, { rx: r, ...o });
const circ = (cx, cy, r, fill, o = {}) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${attrs(o)}/>`;
const path = (d, o = {}) => `<path d="${d}"${attrs(o)}/>`;
const line = (x1, y1, x2, y2, stroke = HAIR, w = 1, o = {}) => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${w}"${attrs(o)}/>`;
/** Text: size in canvas units; `w` weight, `a` anchor, `f` fill, `ls` letter-spacing. */
const text = (x, y, size, s, { f = INK, w, a, ls, o } = {}) => `<text x="${n(x)}" y="${n(y)}" font-size="${size}"${f !== INK ? ` fill="${f}"` : ''}${w ? ` font-weight="${w}"` : ''}${a ? ` text-anchor="${a}"` : ''}${ls ? ` letter-spacing="${ls}"` : ''}${o ? ` opacity="${o}"` : ''}>${esc(s)}</text>`;
const tick = (x, y, s = 1, stroke = OK) => path(`M${n(x - 5 * s)} ${n(y)}l${n(3.6 * s)} ${n(3.6 * s)} ${n(6.8 * s)}-${n(7.6 * s)}`, { fill: 'none', stroke, 'stroke-width': n(1.9 * s), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
/** An app bar: a panel's top strip with the S-dot, the app name and an optional right label. */
const appBar = (x, y, w, name, right, { h = 34, r = 12, fill = RAISE } = {}) =>
  path(`M${x} ${y + h}V${y + r}q0-${r} ${r}-${r}h${w - 2 * r}q${r} 0 ${r} ${r}V${y + h}z`, { fill })
  + circ(x + 18, y + h / 2, 4.5, OR)
  + text(x + 32, y + h / 2 + 5, 14, name, { w: 600 })
  + (right ? text(x + w - 14, y + h / 2 + 5, 13, right, { f: MUTE, a: 'end' }) : '');
/** A lithium pack seen from the front: case, two terminals, a label band. */
function pack(x, y, w, h, label, { hot = false, body = '#2c221b', band = '#3a2d24' } = {}) {
  const t = Math.max(4, h * 0.09);
  return rect(x + w * 0.18, y - t, w * 0.12, t + 2, '#5b4a3e', { rx: 2 })
    + rect(x + w * 0.70, y - t, w * 0.12, t + 2, hot ? OR : '#5b4a3e', { rx: 2 })
    + rr(x, y, w, h, Math.min(8, h * 0.14), body, { stroke: hot ? OR2 : HAIR, 'stroke-width': hot ? 2 : 1 })
    + rect(x, y + h * 0.56, w, h * 0.2, band)
    + rect(x + w * 0.08, y + h * 0.18, w * 0.06, h * 0.22, hot ? OR : 'rgba(236,111,16,.55)', { rx: 1.5 })
    + (label ? text(x + w / 2, y + h * 0.56 + h * 0.2 * 0.5 + Math.min(14, h * 0.18) * 0.36, Math.min(14, h * 0.18), label, { a: 'middle', w: 600, f: hot ? INK : MUTE }) : '');
}
/** A pill: rounded box with centred text. */
const pill = (x, y, w, h, s, { fill = 'rgba(236,111,16,.16)', f = PEACH, stroke = 'rgba(236,111,16,.45)', size = 13, wt = 600 } = {}) =>
  rr(x, y, w, h, h / 2, fill, stroke ? { stroke } : {}) + text(x + w / 2, y + h / 2 + size * 0.36, size, s, { a: 'middle', f, w: wt });
/** The shared ground: warm near-black, a hairline grid and a soft light. */
const ground = (glowX = 400, glowY = 250, sky) =>
  (sky ? rect(0, 0, 800, 500, `url(#${sky})`) : rect(0, 0, 800, 500, BG))
  + rect(0, 0, 800, 500, 'url(#sgv-grid)')
  + `<ellipse cx="${glowX}" cy="${glowY}" rx="380" ry="260" fill="url(#sgv-glow)"/>`;

/* --------------------------------------------------------- the drawings -- */
/* Each takes the language's strings (z for zh, e for en) and returns the
   group's inner SVG on the 800 × 500 canvas. */

const ART = {
  /* H01 港口蓝调: a quay crane at blue hour, a box hanging under its lamp,
     a ship alongside and the sailing board for Hamburg. */
  port: (T) => {
    let s = rect(0, 0, 800, 500, 'url(#sgv-dusk)');
    // far terminal lights along the horizon
    for (let i = 0; i < 40; i++) s += rect(8 + i * 20 + ((i * 7) % 9), 318 - ((i * 13) % 5), 6 + (i % 3) * 3, 2, i % 5 ? 'rgba(255,214,170,.32)' : 'rgba(255,179,122,.7)');
    s += rect(0, 330, 800, 170, '#0d0e12') + rect(0, 334, 800, 3, 'rgba(236,111,16,.35)');
    s += rect(0, 362, 800, 2, 'rgba(180,196,220,.12)') + rect(0, 372, 800, 2, 'rgba(180,196,220,.08)');
    for (let i = 0; i < 9; i++) s += rect(30 + ((i * 97) % 700), 392 + i * 11, 60 + ((i * 41) % 90), 1.2, 'rgba(180,196,220,.09)');
    for (let i = 0; i < 6; i++) s += rect(470 + i * 52, 342 + (i % 3) * 9, 3, 14 + (i % 2) * 8, 'rgba(255,214,170,.12)');
    // the ship alongside, to the right
    s += path('M430 300h370v34H452z', { fill: '#0a0c10' }) + rect(430, 300, 370, 3, 'rgba(236,111,16,.55)');
    const box = ['#3b2f27', '#2b3442', '#7a3d12', '#4a3a2e', '#233040', '#5c4536'];
    for (let c = 0; c < 9; c++) for (let r = 0; r < 3 - (c % 4 === 3 ? 1 : 0); r++) s += rect(450 + c * 30, 278 - r * 20, 28, 18, box[(c * 3 + r) % box.length]);
    s += rect(730, 226, 46, 74, '#171b22') + rect(736, 236, 34, 4, 'rgba(255,214,170,.55)') + rect(736, 248, 34, 4, 'rgba(255,214,170,.3)');
    // the quay crane
    const steel = '#3a4150';
    s += path('M236 332l28-176h10l-24 176zM354 332l-28-176h-10l24 176z', { fill: steel });
    s += rect(250, 262, 92, 6, steel) + rect(258, 206, 76, 5, steel);
    s += rect(150, 146, 480, 12, '#454d5e') + path('M300 146l-30-46h8l34 46zM292 100h10v46h-10z', { fill: steel });
    s += line(300, 100, 150, 146, '#454d5e', 3) + line(300, 100, 600, 146, '#454d5e', 3);
    s += rect(282, 158, 34, 16, '#2a303c') + rect(286, 162, 10, 6, 'rgba(255,214,170,.6)');
    s += line(293, 174, 293, 226, '#6b7385', 1.5) + line(305, 174, 305, 226, '#6b7385', 1.5);
    s += rect(262, 226, 74, 6, '#555e70') + rr(262, 232, 74, 30, 2, '#b4561a') + rect(262, 232, 74, 30, 'url(#sgv-ribs)');
    s += `<ellipse cx="299" cy="270" rx="90" ry="60" fill="url(#sgv-lamp)"/>` + circ(299, 266, 4, PEACH);
    s += rect(296, 336, 6, 90, 'rgba(255,179,122,.22)') + rect(297, 340, 4, 40, 'rgba(255,179,122,.3)');
    // the sailing board
    s += rr(404, 178, 140, 98, 12, 'rgba(31,24,19,.94)', { stroke: HAIR });
    s += text(418, 201, 13, T('船期 · ETA', 'Sailing · ETA'), { f: MUTE });
    s += circ(530, 197, 4, OK);
    s += text(418, 236, 30, T('11·18', '18 Nov'), { w: 600 });
    s += text(418, 260, 13, T('汉堡 · SO-2041', 'Hamburg · SO-2041'), { f: PEACH });
    return s;
  },

  /* H02 深夜询盘: 02:14 in 客户会话, a new RFQ, a reply drafted for approval. */
  inquiry: (T) => {
    let s = ground(420, 230);
    // the window of the building across the street, left
    s += rr(24, 70, 150, 300, 6, '#0e0c0a', { stroke: HAIR });
    for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) if ((r * 5 + c * 3) % 4) s += rect(40 + c * 32, 90 + r * 38, 20, 22, (r + c) % 3 ? 'rgba(255,200,140,.10)' : 'rgba(255,190,120,.42)');
    s += rr(206, 76, 400, 352, 14, PANEL, { stroke: HAIR });
    s += appBar(206, 76, 400, T('客户会话', 'Conversations'), T('深夜 · 1 条新消息', 'Overnight · 1 new'));
    s += text(262, 168, 46, '02:14', { w: 600, ls: '-1' });
    s += text(392, 164, 13, T('德国 · 当地 19:14', 'Germany · 19:14 local'), { f: MUTE });
    // the new RFQ
    s += rr(256, 184, 300, 120, 10, RAISE, { stroke: 'rgba(236,111,16,.5)' }) + rect(256, 196, 3, 96, OR);
    s += text(274, 208, 13, T('新询盘 · RFQ', 'New RFQ'), { f: PEACH, w: 600 });
    s += text(274, 234, 18, 'Müller Energie GmbH', { w: 600 });
    s += text(274, 258, 14, '200 pcs 48V 100Ah, DAP Hamburg?', { f: MUTE });
    s += pill(274, 272, 168, 22, T('回复已起草 · 待你确认', 'Reply drafted · your call'), { size: 12 });
    // earlier threads
    s += line(226, 330, 586, 330) + circ(240, 356, 9, '#3a2d24') + text(258, 361, 14, 'Ahmed Al-Rashid', { f: MUTE }) + text(586, 361, 12, T('72V · 50 套', '72V · 50 units'), { f: DIM, a: 'end' });
    s += line(226, 380, 586, 380) + circ(240, 404, 9, '#3a2d24') + text(258, 409, 14, 'PT Surya Energi', { f: DIM }) + text(586, 409, 12, T('补货', 'Restock'), { f: DIM, a: 'end' });
    return s;
  },

  /* H03 样品墙: shelves of 48V / 60V / 72V packs and rack storage, one tagged. */
  samples: (T) => {
    let s = ground(400, 240);
    const shelf = (y) => rect(30, y, 740, 7, '#3a2e25') + rect(30, y + 7, 740, 2, 'rgba(0,0,0,.4)');
    for (const x of [34, 396, 760]) s += rect(x, 40, 6, 440, '#2e241d');
    s += shelf(176) + shelf(306) + shelf(436);
    const row1 = [[52, 110, 112, 66, '48V'], [178, 96, 96, 80, '60V'], [290, 100, 110, 76, '72V'], [576, 92, 84, 84, '72V'], [672, 116, 80, 60, '48V']];
    for (const [x, y, w, h, l] of row1) s += pack(x, y, w, h, l);
    const row3 = [[54, 360, 120, 76, '48V'], [190, 372, 100, 64, '72V'], [414, 350, 140, 86, T('48V 机架', '48V rack')], [570, 366, 90, 70, '60V'], [674, 376, 76, 60, '72V']];
    for (const [x, y, w, h, l] of row3) s += pack(x, y, w, h, l);
    // the middle shelf: the tagged sample in the centre
    s += pack(70, 236, 100, 70, '48V') + pack(186, 244, 70, 62, '60V');
    s += `<ellipse cx="380" cy="262" rx="150" ry="70" fill="url(#sgv-lamp)" opacity=".7"/>`;
    s += pack(300, 214, 150, 92, '72V 40Ah', { hot: true, body: '#3a2c22', band: '#4a382b' });
    s += pack(590, 240, 110, 66, '48V');
    s += line(452, 214, 470, 196, MUTE, 1.2) + circ(452, 214, 2.5, MUTE);
    s += rr(464, 150, 92, 64, 8, '#efe6dc') + circ(476, 162, 3, BG);
    s += text(476, 186, 12, T('样品 A-12', 'Sample A-12'), { f: '#6b5a4c', w: 600 });
    s += text(476, 205, 15, T('72V 锂电', '72V Li-ion'), { f: '#1f1813', w: 700 });
    return s;
  },

  /* H04 卡尺质检: a caliper on a pack terminal, the readout inside ±0.05. */
  qc: (T) => {
    let s = ground(400, 300);
    s += rect(0, 330, 800, 170, '#100d0b') + line(0, 330, 800, 330, 'rgba(255,236,220,.12)');
    // the part: a terminal block under the jaws
    s += rr(248, 226, 154, 104, 6, '#3a2d24', { stroke: HAIR }) + rect(248, 290, 154, 16, '#4a382b');
    s += rect(278, 208, 26, 20, '#8a7766', { rx: 2 }) + rect(346, 208, 26, 20, OR, { rx: 2 });
    s += text(325, 302, 12, '48V 100Ah', { f: MUTE, a: 'middle', w: 600 });
    // the caliper beam and its scale
    s += rr(110, 160, 600, 30, 4, '#9aa0a8') + rect(110, 160, 600, 4, '#c4c8cd');
    let ticks = '';
    for (let i = 0; i <= 120; i++) ticks += `M${n(130.5 + i * 4.8)} 160v${i % 10 ? (i % 5 ? 7 : 11) : 16}`;
    s += path(ticks, { stroke: '#2b2f35', 'stroke-width': 1, fill: 'none' });
    // fixed jaw (left) and sliding jaw with the display (right)
    s += path('M226 190h22v112h-10l-12-14z', { fill: '#8d939b' }) + path('M226 160v-28h22v28z', { fill: '#8d939b' });
    s += path('M402 190h22v98l-12 14h-10z', { fill: '#8d939b' });
    s += rr(392, 118, 166, 84, 10, '#22262c', { stroke: 'rgba(255,255,255,.12)' });
    s += rr(404, 128, 142, 50, 6, '#0f1a14');
    s += text(538, 166, 34, '100.02', { f: OK, w: 600, a: 'end', ls: '1' });
    s += text(410, 194, 11, 'mm', { f: DIM }) + text(546, 194, 11, 'ZERO · HOLD', { f: DIM, a: 'end' });
    // the tolerance band
    s += rr(268, 344, 276, 58, 10, 'rgba(31,24,19,.94)', { stroke: HAIR });
    s += text(282, 366, 13, T('公差 100.00 ±0.05', 'Tolerance 100.00 ±0.05'), { f: MUTE });
    s += rect(282, 380, 248, 6, 'rgba(244,238,232,.1)', { rx: 3 }) + rect(344, 380, 124, 6, 'rgba(159,224,176,.45)', { rx: 3 });
    s += rect(406 + 0.02 / 0.05 * 62 - 1.5, 374, 3, 18, INK, { rx: 1.5 });
    s += pill(586, 352, 92, 30, T('合格', 'Pass'), { fill: 'rgba(159,224,176,.14)', f: OK, stroke: 'rgba(159,224,176,.45)', size: 14 });
    s += text(632, 404, 12, T('抽检 20 组', 'Sample 20'), { f: DIM, a: 'middle' });
    return s;
  },

  /* H05 装配线: packs moving down the line, five stations, today's rate. */
  line: (T) => {
    let s = ground(400, 260);
    s += rect(0, 318, 800, 20, '#2a211b') + rect(0, 318, 800, 3, '#3d3128');
    s += rect(0, 338, 800, 16, 'url(#sgv-roll)');
    for (let i = 0; i < 10; i++) { const x = 6 + i * 82; s += pack(x, 284, 56, 34, '', { hot: i === 4 }); }
    const st = [[T('来料', 'Intake'), OK], [T('组装', 'Build'), OK], [T('测试', 'Test'), OR2], [T('老化', 'Burn-in'), OK], [T('包装', 'Pack'), DIM]];
    st.forEach(([name, c], i) => {
      const x = 80 + i * 160;
      s += line(x, 244, x, 284, 'rgba(255,236,220,.16)', 1.2, { 'stroke-dasharray': '3 3' });
      s += rr(x - 46, 214, 92, 30, 8, i === 2 ? 'rgba(236,111,16,.16)' : RAISE, { stroke: i === 2 ? 'rgba(236,111,16,.55)' : HAIR });
      s += circ(x - 32, 229, 4, c) + text(x - 22, 234, 13, `S${i + 1} ${name}`, { f: i === 2 ? PEACH : MUTE, w: 600 });
    });
    s += `<ellipse cx="410" cy="300" rx="70" ry="40" fill="url(#sgv-lamp)"/>`;
    // the rate card
    s += rr(270, 86, 260, 110, 12, 'rgba(31,24,19,.95)', { stroke: HAIR });
    s += text(288, 112, 13, T('A 线 · 48V 100Ah · 今日', 'Line A · 48V 100Ah · today'), { f: MUTE });
    s += text(288, 160, 44, '126', { w: 600, ls: '-1' }) + text(372, 160, 14, T('组 / 小时', 'packs / h'), { f: MUTE });
    const bars = [18, 24, 22, 30, 28, 34, 31, 36];
    bars.forEach((h, i) => { s += rect(452 + i * 8, 176 - h, 5, h, i === bars.length - 1 ? OR : 'rgba(244,238,232,.22)', { rx: 1 }); });
    s += text(288, 184, 12, T('良率 99.2% · S3 排队 4 组', 'Yield 99.2% · 4 queued at S3'), { f: DIM });
    return s;
  },

  /* H06 打包: a carton with Müller Energie's shipping mark, the packing list. */
  packing: (T) => {
    let s = ground(360, 240);
    s += path('M0 0h300L120 500H0z', { fill: 'rgba(255,226,190,.035)' });
    // a second carton, top left, and a third at the bottom right
    s += rr(40, 40, 170, 140, 4, '#5a4130') + rect(40, 104, 170, 12, '#6e5240');
    s += rr(620, 330, 170, 150, 4, '#5a4130') + rect(696, 330, 14, 150, '#6e5240');
    // the carton being packed
    s += rr(226, 108, 236, 284, 5, '#6f5139', { stroke: 'rgba(0,0,0,.3)' });
    s += rect(332, 108, 24, 284, '#86684d') + rect(226, 238, 236, 2, 'rgba(0,0,0,.25)');
    const ink = '#21170f';
    s += rr(244, 128, 80, 92, 3, 'none', { stroke: ink, 'stroke-width': 1.6 });
    s += text(284, 152, 12, 'MÜLLER', { f: ink, a: 'middle', w: 700 }) + text(284, 167, 12, 'ENERGIE', { f: ink, a: 'middle', w: 700 });
    s += text(284, 188, 11, 'HAMBURG', { f: ink, a: 'middle', w: 600 }) + text(284, 208, 11, 'C/NO. 12/40', { f: ink, a: 'middle' });
    s += text(250, 270, 12, '48V 100Ah', { f: ink, w: 700 }) + text(250, 288, 11, 'N.W. 46 KG', { f: ink }) + text(250, 304, 11, 'MADE IN CHINA', { f: ink });
    s += path('M400 270l10-14 10 14zM400 290h20M410 290v-20', { fill: 'none', stroke: ink, 'stroke-width': 1.6 }) + text(410, 312, 9, 'THIS SIDE UP', { f: ink, a: 'middle' });
    // the packing list
    s += rr(400, 134, 196, 230, 12, 'rgba(31,24,19,.96)', { stroke: HAIR });
    s += text(416, 160, 14, T('装箱单 · SO-2041', 'Packing list · SO-2041'), { w: 600 });
    const rows = [[T('电池组 × 5', 'Packs × 5'), 1], [T('说明书 · 合格证', 'Manual · cert.'), 1], [T('唛头照片', 'Mark photo'), 1], [T('封箱 · 称重', 'Seal · weigh'), 0]];
    rows.forEach(([l, d], i) => {
      const y = 182 + i * 34;
      s += rr(416, y, 18, 18, 5, d ? 'rgba(159,224,176,.16)' : 'none', { stroke: d ? 'rgba(159,224,176,.6)' : 'rgba(244,238,232,.3)' });
      if (d) s += tick(425, y + 9, 0.9);
      s += text(444, y + 14, 13, l, { f: d ? INK : MUTE });
    });
    s += rect(416, 330, 164, 5, 'rgba(244,238,232,.1)', { rx: 2.5 }) + rect(416, 330, 49, 5, OR, { rx: 2.5 });
    s += text(416, 352, 12, T('第 12 / 40 箱', 'Carton 12 of 40'), { f: MUTE });
    return s;
  },

  /* H07 老板巡厂: the owner's phone in the workshop aisle, today's numbers. */
  owner: (T) => {
    let s = ground(400, 200);
    s += path('M0 500L330 250h140L800 500z', { fill: '#1b1511' });
    for (let i = 0; i < 4; i++) s += path(`M${120 + i * 150} 500L${372 + i * 18} 260h10L${190 + i * 150} 500z`, { fill: 'rgba(255,214,170,.035)' });
    for (let i = 0; i < 4; i++) {
      const k = 1 - i * 0.2;
      s += rect(40 + i * 64, 330 - 120 * k, 54 * k, 120 * k, '#211a15', { stroke: HAIR });
      s += rect(706 - i * 64, 330 - 120 * k, 54 * k, 120 * k, '#211a15', { stroke: HAIR });
    }
    s += circ(640, 196, 5, OR2) + `<ellipse cx="640" cy="196" rx="34" ry="26" fill="url(#sgv-lamp)"/>`;
    // the phone
    s += rr(318, 56, 164, 392, 28, '#0b0908', { stroke: 'rgba(255,255,255,.14)' });
    s += rr(326, 64, 148, 376, 22, PANEL);
    s += rr(380, 72, 40, 10, 5, '#0b0908');
    s += text(338, 104, 11, '07:40', { f: MUTE }) + text(462, 104, 11, T('巡厂', 'Walk'), { f: MUTE, a: 'end' });
    s += text(338, 132, 13, T('今日 · 柳州工厂', 'Today · Liuzhou'), { f: MUTE });
    s += text(338, 176, 36, '1,240', { w: 600, ls: '-1' });
    s += text(338, 196, 12, T('组 · 已下线', 'packs off the line'), { f: DIM });
    const bars = [30, 42, 38, 52, 46, 60, 34];
    bars.forEach((h, i) => { s += rect(340 + i * 18, 270 - h, 11, h, i === 5 ? OR : 'rgba(244,238,232,.2)', { rx: 2 }); });
    s += line(338, 284, 462, 284);
    s += text(338, 306, 13, T('出货', 'Shipped'), { f: MUTE }) + text(462, 306, 13, T('2 柜', '2 boxes'), { a: 'end', w: 600 });
    s += text(338, 330, 13, T('在制', 'In work'), { f: MUTE }) + text(462, 330, 13, T('6 单', '6 orders'), { a: 'end', w: 600 });
    s += rr(336, 346, 128, 40, 10, 'rgba(236,111,16,.14)', { stroke: 'rgba(236,111,16,.5)' });
    s += text(346, 363, 12, T('待你审批', 'Your approval'), { f: PEACH, w: 600 }) + text(346, 379, 11, 'Q-1042', { f: MUTE });
    s += rr(372, 420, 56, 4, 2, 'rgba(244,238,232,.3)');
    return s;
  },

  /* H08 产品拍摄: AI 创作 — four product shots of one pack, one picked. */
  shoot: (T) => {
    let s = ground(400, 220);
    s += path('M40 30h150l40 90H0z', { fill: 'rgba(255,240,225,.06)' }) + rect(108, 120, 4, 300, '#2a211b');
    s += path('M610 30h150l40 90H570z', { fill: 'rgba(255,240,225,.04)' });
    const cell = [
      ['#e9e2da', '#cfc5ba', '#2c221b', T('白底', 'White')],
      ['#3b2414', '#7a3d12', '#2c221b', T('暖光', 'Warm')],
      ['#141010', '#2a2019', '#3a2d24', T('暗调', 'Dark')],
      ['#24303c', '#3f4b55', '#2c221b', T('场景', 'Scene')],
    ];
    cell.forEach(([a, b, body, name], i) => {
      const x = 254 + (i % 2) * 150;
      const y = 104 + Math.floor(i / 2) * 150;
      s += `<defs><linearGradient id="sgv-c${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
      s += rr(x, y, 142, 142, 10, `url(#sgv-c${i})`, i === 0 ? { stroke: OR, 'stroke-width': 3 } : { stroke: HAIR });
      s += `<ellipse cx="${x + 71}" cy="${y + 112}" rx="46" ry="7" fill="rgba(0,0,0,.28)"/>`;
      s += pack(x + 30, y + 50, 82, 60, '48V', { body, band: i === 0 ? '#3a2d24' : '#4a382b' });
      s += text(x + 12, y + 132, 11, name, { f: i === 0 ? '#5a4a3e' : MUTE, w: 600 });
      if (i === 0) s += circ(x + 126, y + 16, 10, OR) + tick(x + 126, y + 16, 0.85, INK);
    });
    s += pill(254, 64, 160, 28, T('AI 创作 · 产品图 4 张', 'AI Creative · 4 shots'), { size: 13 });
    s += pill(424, 64, 122, 28, T('待你确认', 'Your call'), { fill: RAISE, f: INK, stroke: HAIR, size: 13 });
    return s;
  },

  /* H09 装柜: the 40HQ load plan, 14 of 20 pallets in. */
  load: (T) => {
    let s = ground(400, 260);
    s += rect(0, 360, 800, 140, '#0f0c0a');
    // the container's side section
    s += rr(92, 196, 616, 150, 6, '#1c1713', { stroke: 'rgba(255,236,220,.22)', 'stroke-width': 2 });
    let ribs = '';
    for (let i = 0; i < 31; i++) ribs += `M${96.5 + i * 20} 200v142`;
    s += path(ribs, { stroke: 'rgba(255,236,220,.04)', fill: 'none' });
    for (let c = 0; c < 10; c++) for (let r = 0; r < 2; r++) {
      const k = c * 2 + r;
      const x = 104 + c * 58;
      const y = 206 + r * 68;
      if (k < 14) s += rr(x, y, 52, 62, 3, k >= 12 ? '#9a6b43' : '#6f5139', { stroke: 'rgba(0,0,0,.35)' }) + rect(x, y + 54, 52, 8, '#3a2d24') + rect(x + 6, y + 10, 40, 1.5, 'rgba(0,0,0,.25)') + rect(x + 6, y + 30, 40, 1.5, 'rgba(0,0,0,.25)');
      else s += rr(x, y, 52, 62, 3, 'none', { stroke: 'rgba(255,236,220,.2)', 'stroke-dasharray': '4 4' });
    }
    s += path('M708 196l52-22v194l-52-22z', { fill: '#241d17', stroke: 'rgba(255,236,220,.16)' });
    s += `<ellipse cx="560" cy="270" rx="130" ry="80" fill="url(#sgv-lamp)" opacity=".8"/>`;
    // the plan's numbers
    s += text(270, 124, 13, T('装柜方案 · 1 × 40HQ', 'Load plan · 1 × 40HQ'), { f: MUTE });
    s += text(270, 170, 42, '14', { w: 600 }) + text(320, 170, 22, T('/ 20 托', '/ 20 pallets'), { f: MUTE, w: 500 });
    s += pill(452, 146, 92, 28, 'SO-2041', { size: 13 });
    s += rect(270, 372, 274, 6, 'rgba(244,238,232,.1)', { rx: 3 }) + rect(270, 372, 192, 6, OR, { rx: 3 });
    s += text(270, 400, 12, T('70% · 约 9.2 t', '70% · about 9.2 t'), { f: MUTE }) + text(544, 400, 12, T('前重后轻 · 已核', 'Heavy forward · checked'), { f: DIM, a: 'end' });
    return s;
  },

  /* H10 视频展示: 视频制作 — the product film's player and its storyboard. */
  video: (T) => {
    let s = ground(400, 200);
    s += rr(168, 64, 464, 270, 14, '#0d0b09', { stroke: HAIR });
    s += `<ellipse cx="400" cy="200" rx="210" ry="120" fill="url(#sgv-lamp)" opacity=".9"/>`;
    // the product in frame: 48V rack storage
    s += rr(338, 128, 124, 150, 8, '#2c221b', { stroke: 'rgba(255,179,122,.4)' });
    for (let i = 0; i < 4; i++) s += rr(348, 140 + i * 34, 104, 26, 4, '#3a2d24') + rect(356, 150 + i * 34, 18, 6, i === 1 ? OR : 'rgba(236,111,16,.5)', { rx: 1.5 });
    s += `<ellipse cx="400" cy="286" rx="90" ry="8" fill="rgba(0,0,0,.4)"/>`;
    s += pill(184, 80, 92, 26, T('视频制作', 'Video'), { fill: 'rgba(21,17,14,.8)', f: INK, stroke: HAIR, size: 12 });
    s += text(616, 98, 12, T('48V 机架储能 · 产品片', '48V rack storage · film'), { f: MUTE, a: 'end' });
    s += circ(400, 206, 28, 'rgba(21,17,14,.62)', { stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1.5 }) + path('M392 192l24 14-24 14z', { fill: INK });
    s += rect(190, 312, 420, 4, 'rgba(244,238,232,.18)', { rx: 2 }) + rect(190, 312, 168, 4, OR, { rx: 2 }) + circ(358, 314, 6, INK);
    s += text(190, 302, 12, '0:18 / 0:45', { f: MUTE });
    // the storyboard
    const shots = [T('开场', 'Open'), T('细节', 'Detail'), T('应用', 'In use'), T('联系', 'Contact')];
    shots.forEach((l, i) => {
      const x = 168 + i * 118;
      s += rr(x, 352, 110, 64, 8, i === 1 ? 'rgba(236,111,16,.14)' : PANEL, { stroke: i === 1 ? OR : HAIR, 'stroke-width': i === 1 ? 2 : 1 });
      s += rr(x + 32, 364, 46, 30, 4, i === 1 ? '#4a382b' : '#2c221b');
      s += text(x + 10, 410, 11, `0${i + 1} ${l}`, { f: i === 1 ? PEACH : MUTE, w: 600 });
    });
    return s;
  },

  /* P03 履约: SO-2041's milestones, at 装柜 today. */
  fulfil: (T) => {
    let s = ground(400, 250);
    s += pack(54, 196, 130, 94, '48V 100Ah', { body: '#271e18' });
    s += rr(610, 180, 160, 100, 12, 'rgba(31,24,19,.9)', { stroke: HAIR });
    s += text(626, 206, 12, 'ETA', { f: MUTE }) + text(626, 240, 26, T('11·18', '18 Nov'), { w: 600 }) + text(626, 264, 12, T('汉堡 · DAP', 'Hamburg · DAP'), { f: PEACH });
    s += rr(232, 104, 336, 290, 16, PANEL, { stroke: HAIR });
    s += appBar(232, 104, 336, 'ERP', T('履约', 'Fulfilment'));
    s += text(256, 170, 22, 'SO-2041', { w: 700 });
    s += text(256, 194, 13, 'Müller Energie GmbH', { f: MUTE });
    s += text(544, 170, 13, '200 × 48V', { f: MUTE, a: 'end' });
    const st = [[T('下单', 'Order'), '10·08'], [T('备货', 'Stock'), '10·15'], [T('质检', 'QC'), '10·21'], [T('装柜', 'Load'), T('今天', 'Today')], [T('到港', 'Arrive'), '11·18']];
    const x0 = 270;
    const dx = 65;
    s += rect(x0, 268, dx * 3, 3, OR) + rect(x0 + dx * 3, 268, dx, 3, 'rgba(244,238,232,.16)');
    st.forEach(([l, d], i) => {
      const x = x0 + i * dx;
      s += text(x, 244, 11, d, { f: i === 3 ? PEACH : DIM, a: 'middle' });
      if (i < 3) s += circ(x, 269, 10, OR) + tick(x, 269, 0.8, INK);
      else if (i === 3) s += circ(x, 269, 15, 'rgba(236,111,16,.18)') + circ(x, 269, 9, BG, { stroke: OR2, 'stroke-width': 3 });
      else s += circ(x, 269, 8, BG, { stroke: 'rgba(244,238,232,.3)', 'stroke-width': 2 });
      s += text(x, 302, 13, l, { f: i <= 3 ? INK : MUTE, a: 'middle', w: i === 3 ? 700 : 500 });
    });
    s += pill(256, 334, 288, 28, T('抽检 20 组 · 电压 / 内阻 · 通过', 'Sample 20 · voltage / IR · passed'), { fill: 'rgba(159,224,176,.1)', f: OK, stroke: 'rgba(159,224,176,.35)', size: 12 });
    return s;
  },

  /* C08 产品参考: three reference pictures → one generated main image. */
  refs: (T) => {
    let s = ground(470, 240);
    const ref = (x, y, rot, bg, i) => `<g transform="rotate(${rot} ${x + 60} ${y + 70})">${rr(x, y, 120, 140, 8, '#efe6dc')}${rect(x + 8, y + 8, 104, 100, bg)}${pack(x + 28, y + 44, 64, 46, '', { body: '#2c221b' })}${text(x + 10, y + 128, 11, `${T('参考', 'Ref')} ${i}`, { f: '#6b5a4c', w: 600 })}</g>`;
    s += ref(130, 120, -8, '#cfc6bb', 1) + ref(176, 150, 4, '#b9b0a6', 2) + ref(222, 190, -3, '#d8d0c6', 3);
    [['#8a8f96', 196], ['#efe9e1', 222], ['#191512', 248]].forEach(([c, x]) => { s += circ(x, 368, 9, c, { stroke: 'rgba(255,255,255,.25)' }); });
    s += text(268, 372, 11, T('灰 · 白 · 黑', 'Grey · ivory · black'), { f: DIM });
    // the arrow through AI 创作
    s += path('M362 260h52', { stroke: OR2, 'stroke-width': 2, fill: 'none' }) + path('M410 253l10 7-10 7z', { fill: OR2 });
    s += text(392, 246, 12, T('AI 创作', 'AI Creative'), { f: PEACH, a: 'middle', w: 600 });
    // the generated main image
    s += `<defs><linearGradient id="sgv-gen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2414"/><stop offset=".62" stop-color="#6a3612"/><stop offset=".62" stop-color="#2a1a10"/><stop offset="1" stop-color="#160f0a"/></linearGradient></defs>`;
    s += rr(430, 96, 236, 280, 14, 'url(#sgv-gen)', { stroke: 'rgba(255,179,122,.45)', 'stroke-width': 1.5 });
    s += `<ellipse cx="548" cy="270" rx="90" ry="12" fill="rgba(0,0,0,.4)"/>`;
    s += pack(488, 190, 120, 82, '48V', { body: '#2a2019', band: '#3a2d24', hot: true });
    s += pill(446, 112, 108, 24, T('生成 · 主图', 'Main image'), { fill: 'rgba(21,17,14,.75)', f: INK, stroke: HAIR, size: 12 });
    s += pill(446, 336, 98, 26, T('待你确认', 'Your call'), { size: 12 });
    return s;
  },

  /* W02 车间: the workshop floor plan, each machine's state. */
  floor: (T) => {
    let s = ground(400, 250);
    s += rr(52, 56, 696, 388, 10, 'rgba(31,24,19,.55)', { stroke: 'rgba(255,236,220,.18)', 'stroke-width': 1.5 });
    s += rect(52, 228, 696, 44, 'rgba(255,236,220,.04)') + line(60, 250, 740, 250, 'rgba(255,236,220,.16)', 1.5, { 'stroke-dasharray': '10 8' });
    const state = ['run', 'run', 'run', 'wait', 'run', 'idle', 'run', 'run', 'wait', 'run', 'run', 'run'];
    const col = { run: OK, wait: OR2, idle: DIM };
    state.forEach((k, i) => {
      const row = i < 6 ? 0 : 1;
      const c = i % 6;
      const x = 74 + c * 112;
      const y = row ? 290 : 100;
      const hot = i === 8;
      s += rr(x, y, 92, 112, 10, hot ? 'rgba(236,111,16,.12)' : '#231b15', { stroke: hot ? OR : HAIR, 'stroke-width': hot ? 2 : 1 });
      s += rr(x + 14, y + 16, 64, 44, 6, '#2e241d') + circ(x + 46, y + 38, 12, 'none', { stroke: 'rgba(255,236,220,.14)', 'stroke-width': 1.5 });
      s += text(x + 14, y + 92, 14, `${row ? 'B' : 'A'}${c + 1}`, { f: MUTE, w: 600 });
      s += circ(x + 76, y + 87, 6, col[k]);
    });
    s += line(344, 272, 344, 290, OR, 1.5);
    const note = T('B3 待料 12 分钟 · 已通知仓库', 'B3 waiting for stock · 12 min');
    s += rr(300, 234, est(note, 13) + 48, 34, 10, 'rgba(21,17,14,.96)', { stroke: 'rgba(236,111,16,.55)' }) + circ(318, 251, 4, OR2);
    s += text(330, 256, 13, note, { f: PEACH, w: 600 });
    s += text(70, 46, 13, T('柳州工厂 · 2 号车间', 'Liuzhou plant · Workshop 2'), { f: MUTE });
    s += text(730, 46, 13, T('运行 9 · 待料 2 · 停机 1', 'Running 9 · waiting 2 · idle 1'), { f: MUTE, a: 'end' });
    return s;
  },
};

/* --------------------------------------------------------- the catalogue -- */

/** Photograph stem → vignette key. These are the pictures the two slots showed. */
export const VIGNETTE_OF = {
  'h01-port-blue-hour': 'port',
  'h02-night-inquiry': 'inquiry',
  'h03-sample-wall': 'samples',
  'h04-caliper-qc': 'qc',
  'h05-assembly-line': 'line',
  'h06-packing': 'packing',
  'h07-owner-walk': 'owner',
  'h08-product-shoot': 'shoot',
  'h09-container-loading': 'load',
  'h10-video-showing': 'video',
  'p03-fulfilment': 'fulfil',
  'c08-product-references': 'refs',
  'w02-workshop': 'floor',
};

/** Each host's name for a screen reader: what the picture is, said once. */
const LABEL = {
  port: ['蓝调时分的集装箱码头：岸桥吊着一个货柜，船期看板显示 SO-2041 发往汉堡。', 'A container quay at blue hour: a crane lifts a box, and the sailing board shows SO-2041 bound for Hamburg.'],
  inquiry: ['凌晨 02:14，客户会话里来了 Müller Energie 的新询盘，回复已起草，等你确认。', 'At 02:14 a new RFQ from Müller Energie arrives in Conversations; a reply is drafted and waits for you.'],
  samples: ['样品墙上摆着 48V、60V、72V 锂电池组，一组 72V 样品挂着标签。', 'A sample wall of 48V, 60V and 72V lithium packs, one 72V sample tagged.'],
  qc: ['卡尺量电池组端子：读数 100.02 mm，在 ±0.05 公差内，合格。', 'A caliper on a pack terminal reads 100.02 mm, inside the ±0.05 tolerance: pass.'],
  line: ['装配线：五个工位的状态，A 线今日每小时 126 组。', 'The assembly line: five stations and their state, line A at 126 packs an hour today.'],
  packing: ['打包：纸箱上印着 Müller Energie 的唛头，装箱单逐项打勾。', 'Packing: a carton with Müller Energie’s shipping mark and the packing list being ticked off.'],
  owner: ['老板在车间里看手机：今日产出、出货、在制，和一张待他审批的报价。', 'The owner on the shop floor checks his phone: today’s output, shipments, open orders and one quote for his approval.'],
  shoot: ['AI 创作生成的四张产品图，选中一张，等你确认。', 'AI Creative’s four product shots, one picked, waiting for your call.'],
  load: ['40HQ 装柜方案：20 托已装 14 托。', 'The 40HQ load plan: 14 of 20 pallets in.'],
  video: ['视频制作：产品片的播放器和四个分镜。', 'Video: the product film’s player and its four storyboard shots.'],
  fulfil: ['订单 SO-2041 的履约节点：下单、备货、质检已完成，今天装柜。', 'Order SO-2041’s milestones: ordered, stocked and inspected, loading today.'],
  refs: ['三张产品参考图经 AI 创作生成一张主图，等你确认。', 'Three reference pictures become one main image in AI Creative, waiting for your call.'],
  floor: ['柳州工厂 2 号车间平面图：每台设备的运行状态，B3 待料。', 'The floor plan of workshop 2 at the Liuzhou plant: each machine’s state, B3 waiting for stock.'],
};

const TAG = { zh: '示意', en: 'Illustration' };
const PREFIX = { zh: '示意：', en: 'Illustration: ' };

/** The shared paint every drawing refers to (ids are unique on the page). */
const DEFS = '<pattern id="sgv-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,236,220,.045)" stroke-width="1"/></pattern>'
  + '<radialGradient id="sgv-glow"><stop offset="0" stop-color="#ec6f10" stop-opacity=".13"/><stop offset="1" stop-color="#ec6f10" stop-opacity="0"/></radialGradient>'
  + '<radialGradient id="sgv-lamp"><stop offset="0" stop-color="#ffb37a" stop-opacity=".34"/><stop offset="1" stop-color="#ffb37a" stop-opacity="0"/></radialGradient>'
  + '<linearGradient id="sgv-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1420"/><stop offset=".5" stop-color="#1a1b25"/><stop offset=".66" stop-color="#2b211d"/><stop offset=".66" stop-color="#0c0e13"/><stop offset="1" stop-color="#0c0e13"/></linearGradient>'
  + '<pattern id="sgv-roll" x="-1" y="338" width="30" height="16" patternUnits="userSpaceOnUse"><circle cx="15" cy="8" r="7" fill="#1d1712" stroke="rgba(255,236,220,.09)"/></pattern>'
  + '<pattern id="sgv-ribs" width="6" height="30" patternUnits="userSpaceOnUse"><rect width="2" height="30" fill="rgba(0,0,0,.22)"/></pattern>';

/** The page's sprite: every vignette `keys` names, drawn once, hidden. */
export function vignetteSprite(lang, keys) {
  const T = (zh, en) => (lang === 'zh' ? zh : en);
  const groups = [...new Set(keys)].map((k) => {
    if (!ART[k]) throw new Error(`vignettes: no drawing for ${k}`);
    return `<g id="sgv-${k}" fill="${INK}">${ART[k](T)}</g>`;
  }).join('');
  return `<svg class="sgv-sprite" aria-hidden="true" focusable="false" width="0" height="0"><defs>${DEFS}</defs>${groups}</svg>`;
}

/** One tile: the host, its two windows onto the drawing, its tag. */
export function vignetteHost(key, lang, cls = '') {
  if (!LABEL[key]) throw new Error(`vignettes: no label for ${key}`);
  const label = PREFIX[lang] + LABEL[key][lang === 'zh' ? 0 : 1];
  const win = (c, vb) => `<svg class="${c}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#sgv-${key}"/></svg>`;
  return `<div class="sgv sgv-${key}${cls ? ` ${cls}` : ''}" role="img" aria-label="${esc(label)}">${win('sgv-far', '0 0 800 500')}${win('sgv-near', '190 60 420 380')}<span class="sgv-tag" aria-hidden="true">${TAG[lang]}</span></div>`;
}

/* ---------------------------------------------------- placing them -- */

const PHOTO_SRC = /assets\/stargo-photo\/([a-z]\d\d[a-z0-9]*-[a-z-]+?)-\d+\.webp/;
/* the mosaic photographs' own sizes (tools/imagegen/photo-assets.json), which
   the left column draws whole: the tile keeps that ratio */
const PHOTO_RATIO = {
  'h01-port-blue-hour': 'sgv-r16', 'h02-night-inquiry': 'sgv-r16', 'h05-assembly-line': 'sgv-r16', 'h08-product-shoot': 'sgv-r16', 'h10-video-showing': 'sgv-r16',
  'h04-caliper-qc': 'sgv-r3', 'h06-packing': 'sgv-r3',
  'h03-sample-wall': 'sgv-r1', 'h07-owner-walk': 'sgv-r1', 'h09-container-loading': 'sgv-r1',
};

/**
 * The page pass (tools/build-site.mjs, after the chrome has written the
 * mosaic): on the homepage every mosaic picture, and on the capability page
 * every ring card, becomes its vignette host; the sprite goes in after
 * <body> and the sheet after stargo-fusion.css. Any other page is returned
 * as it is.
 */
export function vignettePage(html, lang, name) {
  const keys = [];
  const swap = (img, cls) => {
    const m = img.match(PHOTO_SRC);
    const key = m && VIGNETTE_OF[m[1]];
    if (!key) throw new Error(`vignettes: ${name}: no vignette for ${img.slice(0, 120)}`);
    keys.push(key);
    return vignetteHost(key, lang, cls(m[1]));
  };
  let out = html;
  if (name === 'index.html') {
    const a = out.indexOf('class="hero-photo-wrapper up"');
    const b = out.indexOf('class="hero-photo-wrapper down"');
    const end = b < 0 ? -1 : out.indexOf('</section>', b);
    if (a < 0 || b < 0 || end < 0) throw new Error('vignettes: index: the opening mosaic is not where it was');
    const seg = out.slice(a, end).replace(/<img\b[^>]*\bclass="(stargo-mosaic|photo-hero)"[^>]*\/>/g, (img, cl) => swap(img, (id) => (cl === 'photo-hero' ? 'photo-hero' : `stargo-mosaic ${PHOTO_RATIO[id] || 'sgv-r16'}`)));
    out = out.slice(0, a) + seg + out.slice(end);
    if (keys.length !== 20) throw new Error(`vignettes: index: expected 20 mosaic tiles, drew ${keys.length}`);
  } else if (name === 'capabilities.html') {
    const a = out.indexOf('class="cn-produce');
    const end = a < 0 ? -1 : out.indexOf('</section>', a);
    if (a < 0 || end < 0) throw new Error('vignettes: capabilities: the 每项 工作 ring is not where it was');
    const seg = out.slice(a, end).replace(/<img\b[^>]*\bclass="stargo-still"[^>]*\/>/g, (img) => swap(img, () => 'sgv-card'));
    out = out.slice(0, a) + seg + out.slice(end);
    const cards = Object.keys(RING_STILLS).length;
    if (keys.length !== cards) throw new Error(`vignettes: capabilities: expected ${cards} ring cards (RING_STILLS), drew ${keys.length}`);
  } else {
    return html;
  }
  const body = out.match(/<body\b[^>]*>/);
  if (!body) throw new Error(`vignettes: ${name}: no <body>`);
  out = out.replace(body[0], `${body[0]}${vignetteSprite(lang, keys)}`);
  const fusion = '<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>';
  if (out.split(fusion).length !== 2) throw new Error(`vignettes: ${name}: no single stargo-fusion.css link`);
  return out.replace(fusion, `${fusion}\n<link href="css/stargo-vignettes.css" rel="stylesheet" type="text/css"/>`);
}

/** For a preview page: every vignette, in catalogue order. */
export const VIGNETTE_KEYS = Object.values(VIGNETTE_OF);
