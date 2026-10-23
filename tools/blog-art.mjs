/**
 * The blog's covers, drawn in code (lane "blog", 2026-10-23).
 *
 * Each article's cover was an AI photograph (tools/replaceables.mjs
 * BLOG_COVERS, B01–B07). Since 2026-10-23 every place that showed one draws
 * an editorial cover instead: the article hero, the blog index card, every
 * article's 「更多文章」 card, the homepage's 最新文章 cards and workforce's
 * 文章 cards, zh and en. One cover per article, built from that article's own
 * idea in the chart language of its figures (tools/blog.mjs figure.sgc: the
 * near-black panel with the plum glow, hairlines, the pink accent, the
 * 「图 n」 pill, two-digit indices):
 *
 *   stargo-work-visual-guide          the nine figures of the guide, as a contact sheet
 *   start-with-one-workflow           one line lit among many, through five steps
 *   from-inquiry-to-quote             询盘 → 报价 → 批准 → PI, a gate before 发送: 批准 ≠ 发送
 *   approval-gates-for-ai-in-trade    看得见 / 管得住 / 查得清 (the owner chart)
 *   ai-operating-system-for-global-trade  the business loop inside one browser window
 *   288-ai-employees-not-288-chatbots 288 dots, one per role, in the ten groups; five form a team
 *   enterprise-ontology-explained     the relationship map answering 「价格该用哪一版？」
 *
 * Many show at once, so they are static: inline SVG for the art (vector, sharp
 * at any size; no ids, so no clash when several sit on one page) and two HTML
 * labels — the article's number and section, and the 「示意 / Illustration」
 * pill — whose size has a legible floor (css/stargo-blog-art.css). Nothing
 * ticks; the only motion is a CSS hover on the art layer.
 *
 * The art is composed for the box it fills, so nothing is cropped away:
 *   hero  3:2      the article page's hero (`.lx-blog-image.lx-details`)
 *   card  1:1      blog index, 「更多文章」, workforce (`.lx-blog-image`)
 *   home  3 / 2.3  the homepage's article cards (`.testimonials-photo`)
 * `preserveAspectRatio="xMidYMid slice"` absorbs the few pixels a box may
 * differ from its ratio. The homepage card keeps its top-right corner calm:
 * Mono draws its arrow badge there.
 *
 * Every Latin word on a Chinese cover is a product or trade name. Text widths
 * are estimated (cjk 1em, Latin ~0.56em) and checked against the room each
 * line has; a line that would not fit stops the build.
 */
import { WORKFORCE_ROLE_GROUPS } from './copy.mjs';

const SLOTS = {
  hero: { W: 1200, H: 800, m: 64 },
  card: { W: 800, H: 800, m: 56 },
  home: { W: 1040, H: 800, m: 60 },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = (v) => Math.round(v * 10) / 10;

/* Rough advance widths: enough to keep a line inside its room. */
function textWidth(s, size, weight = 500) {
  let w = 0;
  for (const ch of String(s)) {
    if (/\p{Script=Han}|[，。：；？！、（）「」]/u.test(ch)) w += 1;
    else if (ch === ' ') w += 0.28;
    else if (/[0-9]/.test(ch)) w += 0.62;
    else if (/[A-Z]/.test(ch)) w += 0.68;
    else if (/[ilj.,'’·]/.test(ch)) w += 0.3;
    else if (/[tfr]/.test(ch)) w += 0.4;
    else if (/[mw]/.test(ch)) w += 0.86;
    else if (/[a-z]/.test(ch)) w += 0.56;
    else if (ch === '≠' || ch === '→') w += 0.7;
    else w += 0.6;
  }
  return w * size * (weight >= 600 ? 1.04 : 1);
}
function fits(where, s, size, room, weight) {
  const w = textWidth(s, size, weight);
  if (w > room) throw new Error(`blog-art: ${where}: 「${s}」 is ~${Math.round(w)} wide at ${size}, room ${Math.round(room)}`);
}

/* Legibility: a line that would be drawn smaller than ~9.5 CSS px in the box
   it is in is not drawn at all. The box width it needs is known at build time
   (its size against the slot's viewBox width), so each such line carries the
   class of the narrowest box that still shows it, and a container query in
   css/stargo-blog-art.css hides it below that width. Nothing turns to mush. */
export const LEGIBLE_STEP = 20;   // px of box width per class: v200, v220 … v1200
let VIEW_W = 1200;
const legible = (size) => {
  const need = 9.5 * VIEW_W / size;
  if (need <= 196) return '';
  const step = Math.ceil(need / LEGIBLE_STEP) * LEGIBLE_STEP;
  if (step > 1200) throw new Error(`blog-art: text at ${size} is never legible`);
  return ` v${step}`;
};
/* SVG primitives. Classes carry colour and weight (css/stargo-blog-art.css). */
const T = (x, y, s, size, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}"${anchor ? ` text-anchor="${anchor}"` : ''} class="${cls}${legible(size)}">${s}</text>`;
const L = (x1, y1, x2, y2, cls) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" class="${cls}"/>`;
const C = (cx, cy, r, cls) => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" class="${cls}"/>`;
const R = (x, y, w, h, rx, cls) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(rx)}" class="${cls}"/>`;
const P = (d, cls) => `<path d="${d}" class="${cls}"/>`;
/** A check mark centred on (x, y), `s` wide. */
const check = (x, y, s, cls) => P(`M${r1(x - s / 2)} ${r1(y)}l${r1(s * 0.32)} ${r1(s * 0.3)}l${r1(s * 0.68)} ${r1(-s * 0.62)}`, cls);
/** A small chevron pointing right at (x, y). */
const chev = (x, y, s, cls) => P(`M${r1(x - s / 2)} ${r1(y - s)}L${r1(x + s / 2)} ${r1(y)}L${r1(x - s / 2)} ${r1(y + s)}`, cls);

/* ------------------------------------------------------------------ covers */

/* 1 · The guide: its nine figures as a contact sheet, in reading order from
   acquisition to operations, beside a big 「9」. */
const GLYPHS = [
  // loop: a ring of five stages, the first lit
  () => C(50, 35, 24, 'k-ln') + [0, 1, 2, 3, 4].map((k) => { const a = (-90 + 72 * k) * Math.PI / 180; return C(50 + 24 * Math.cos(a), 35 + 24 * Math.sin(a), 5, k ? 'k-dot' : 'k-hot'); }).join(''),
  // pipeline: two lanes and the hand-off between them
  () => R(6, 12, 36, 46, 7, 'k-ln') + R(58, 12, 36, 46, 7, 'k-ln') + L(42, 35, 58, 35, 'k-pk') + chev(55, 35, 4, 'k-pk') + [22, 32, 42].map((y) => L(13, y, 33, y, 'k-ln2') + L(65, y, 85, y, 'k-ln2')).join(''),
  // video: portrait, landscape and square frames
  () => R(8, 10, 24, 46, 4, 'k-ln') + R(38, 20, 38, 24, 4, 'k-pk') + R(82, 24, 14, 14, 3, 'k-ln'),
  // roles: the five largest groups as bars
  () => [129, 50, 20, 19, 16].map((c, i) => R(10, 9 + i * 11, Math.max(6, 80 * c / 129), 6, 3, i ? 'k-fill2' : 'k-fillp')).join(''),
  // team: a hub and five members
  () => [0, 1, 2, 3, 4].map((k) => { const a = (-90 + 72 * k) * Math.PI / 180; const x = 50 + 27 * Math.cos(a), y = 35 + 27 * Math.sin(a); return L(50, 35, x, y, 'k-ln2') + C(x, y, 4.5, 'k-dot'); }).join('') + C(50, 35, 8, 'k-hot'),
  // proactive: six steps round a ring
  () => C(50, 35, 25, 'k-ln') + [0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return C(50 + 25 * Math.cos(a), 35 + 25 * Math.sin(a), 4.5, k === 2 ? 'k-hot' : 'k-dot'); }).join(''),
  // owner: three panels, the middle one held
  () => [0, 1, 2].map((i) => R(12 + i * 27, 12, 22, 46, 5, i === 1 ? 'k-pk' : 'k-ln')).join('') + R(43.5, 28, 3, 14, 1, 'k-fillp') + R(49.5, 28, 3, 14, 1, 'k-fillp'),
  // start: five numbered rows, the first lit
  () => [0, 1, 2, 3, 4].map((i) => C(14, 11 + i * 12, 3, i ? 'k-dot' : 'k-hot') + R(24, 9 + i * 12, 64 - i * 6, 4, 2, i ? 'k-fill2' : 'k-fillp')).join(''),
  // status: four columns of items
  () => [0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => R(10 + c * 21, 12 + r * 15, 16, 9, 3, c === 0 ? 'k-fillp' : 'k-fill2')).join('')).join(''),
];
function coverGuide(ctx) {
  const { W, H, m, slot, zh } = ctx;
  const n = ctx.figures;
  if (n !== GLYPHS.length) throw new Error(`blog-art: the guide prints ${n} figures, the contact sheet draws ${GLYPHS.length}`);
  const grid = slot === 'hero' ? { x: 520, y: 112, w: W - m - 520, h: H - m - 112 }
    : slot === 'card' ? { x: m, y: 112, w: W - 2 * m, h: 452 }
    : { x: 470, y: 168, w: W - m - 470, h: H - m - 168 };
  const gap = slot === 'home' ? 12 : 16;
  const tw = (grid.w - 2 * gap) / 3, th = (grid.h - 2 * gap) / 3;
  const label = slot !== 'home';
  let out = '';
  GLYPHS.forEach((g, i) => {
    const x = grid.x + (i % 3) * (tw + gap), y = grid.y + Math.floor(i / 3) * (th + gap);
    out += R(x, y, tw, th, slot === 'home' ? 12 : 16, i === 0 ? 'k-tile k-tile-on' : 'k-tile');
    const top = label ? 40 : 14;
    const s = Math.min((tw - 36) / 100, (th - top - 22) / 70);
    out += `<g transform="translate(${r1(x + (tw - 100 * s) / 2)} ${r1(y + top + (th - top - 8 - 70 * s) / 2)}) scale(${r1(s * 100) / 100})">${g()}</g>`;
    if (label) out += T(x + 16, y + 30, zh ? `图 ${i + 1}` : `Fig. ${i + 1}`, slot === 'hero' ? 17 : 19, i === 0 ? 'k-acc w5' : 'k-mut w5');
  });
  // the numeral and its words
  const big = slot === 'hero' ? 380 : slot === 'card' ? 200 : 300;
  const base = H - m - (slot === 'hero' ? 76 : slot === 'card' ? 0 : 64);
  const word = zh ? '张图' : 'figures';
  const sub = zh ? '从获客到经营' : (slot === 'card' ? 'acquisition → operations' : 'acquisition →|operations');
  const wSize = slot === 'hero' ? (zh ? 64 : 46) : slot === 'card' ? (zh ? 50 : 42) : (zh ? 54 : 40);
  const sSize = slot === 'hero' ? 30 : slot === 'card' ? 26 : 26;
  const numW = textWidth(String(n), big, 600);
  if (slot === 'card') {
    const x = m + numW + 22;
    fits('guide card word', word, wSize, W - m - x, 500);
    fits('guide card sub', sub, sSize, W - m - x - 150, 500);
    out += T(m - 6, base, String(n), big, 'k-txt w6 k-num');
    out += T(x, base - 4, word, wSize, 'k-txt w5') + T(x, base - wSize - 18, sub, sSize, 'k-acc w5');
  } else {
    out += T(m - 10, base, String(n), big, 'k-txt w6 k-num');
    const x = m + numW + 14;
    fits(`guide ${slot} word`, word, wSize, (slot === 'hero' ? 520 : 470) - 24 - x, 500);
    out += T(x, base - 6, word, wSize, 'k-txt w5');
    const lines = sub.split('|');
    lines.forEach((l, i) => { fits(`guide ${slot} sub`, l, sSize, (slot === 'hero' ? 520 : 470) - 24 - m, 500); out += T(m, base + (slot === 'hero' ? 62 : 52) + i * (sSize + 10), l, sSize, 'k-acc w5'); });
  }
  return out;
}

/* 2 · Start with one workflow: a hairline 「1」, and from its stem the one
   line that is lit, through the five steps; the other lines wait. */
const START_STEPS = { zh: ['选流程', '备资料', '连账号', '定审批', '验效果'], en: ['Choose', 'Prepare', 'Connect', 'Assign', 'Validate'] };
function coverStart(ctx) {
  const { W, H, m, slot, lang, zh } = ctx;
  const stem = slot === 'hero' ? 210 : slot === 'card' ? 128 : 170;
  const top = slot === 'home' ? 176 : 132, bottom = slot === 'card' ? 610 : 640;
  const lines = 9, lit = 5;
  const gapY = (bottom - top) / (lines - 1);
  const x0 = stem + (slot === 'card' ? 64 : 90), x1 = W - m;
  const steps = START_STEPS[lang];
  const first = slot === 'card' ? stem + 112 : stem + 160;
  const last = x1 - (slot === 'card' ? 44 : 56);
  const at = (k) => first + k * (last - first) / 4;
  let out = '';
  // the other workflows: drawn, waiting, their steps not started
  for (let i = 0; i < lines; i++) {
    const y = top + i * gapY;
    if (i === lit) continue;
    out += L(x0, y, x1, y, 'k-dash');
    for (let k = 0; k < 5; k++) out += C(at(k), y, 3.5, 'k-dot2');
  }
  // the numeral: flag, stem and foot in one hairline
  const flag = slot === 'card' ? 46 : 60;
  out += P(`M${stem - flag} ${top + flag}L${stem} ${top}L${stem} ${bottom}M${stem - flag} ${bottom}H${stem + flag}`, 'k-pk k-w3');
  const ly = top + lit * gapY;
  out += L(stem, ly, x1, ly, 'k-pk k-w3');
  const span = last - first;
  const lab = slot === 'hero' ? (zh ? 28 : 24) : slot === 'card' ? (zh ? 26 : 22) : (zh ? 30 : 26);
  const idx = slot === 'hero' ? 19 : slot === 'card' ? 18 : 22;
  steps.forEach((s, k) => {
    const x = at(k);
    fits(`start ${slot} step`, s, lab, span / 4 - 8, 500);
    out += C(x, ly, slot === 'card' ? 11 : 13, k ? 'k-node' : 'k-hot');
    out += T(x, ly - 30, `0${k + 1}`, idx, 'k-acc w5 k-num', 'middle');
    out += T(x, ly + 30 + lab * 0.8, s, lab, 'k-txt w5', 'middle');
  });
  const key = zh ? '一条流程，五个步骤' : 'One workflow, five steps';
  const kSize = slot === 'hero' ? 40 : slot === 'card' ? 34 : 40;
  fits(`start ${slot} key`, key, kSize, W - 2 * m, 500);
  out += T(m, H - m, key, kSize, 'k-txt w5');
  if (slot === 'hero') {
    const motto = zh ? '把工作交给 AI，把决定权留在企业。' : 'Delegate the work. Keep the authority.';
    fits('start motto', motto, 24, W - 2 * m - textWidth(key, kSize) - 60, 400);
    out += T(m + textWidth(key, kSize) + 36, H - m, motto, 24, 'k-mut w4');
  }
  return out;
}

/* 3 · From inquiry to quote: the track 询盘 → 报价 → 批准 → PI, then a gate,
   and 发送 on its own; under it the article's point, 批准 ≠ 发送. */
const QUOTE_TRACK = { zh: ['询盘', '报价', '批准', 'PI', '发送'], en: ['Inquiry', 'Quote', 'Approve', 'PI', 'Send'] };
function coverQuote(ctx) {
  const { W, H, m, slot, lang, zh } = ctx;
  const y = slot === 'card' ? 236 : slot === 'hero' ? 288 : 260;
  const names = QUOTE_TRACK[lang];
  const xs = slot === 'hero' ? [120, 340, 560, 780, 1060] : slot === 'card' ? [96, 236, 376, 516, 704] : [104, 284, 464, 644, 900];
  const gate = slot === 'hero' ? 900 : slot === 'card' ? 604 : 772;
  const lab = slot === 'hero' ? (zh ? 28 : 24) : slot === 'card' ? (zh ? 26 : 22) : (zh ? 30 : 26);
  let out = '';
  out += L(xs[0], y, xs[3], y, 'k-pk k-w3');
  out += L(xs[3] + 16, y, gate - 12, y, 'k-ln');
  out += L(gate + 12, y, xs[4] - 18, y, 'k-dash');
  out += L(gate - 5, y - 38, gate - 5, y + 38, 'k-pk k-w3') + L(gate + 5, y - 38, gate + 5, y + 38, 'k-pk k-w3');
  names.forEach((s, k) => {
    const x = xs[k];
    if (k < 2) out += C(x, y, 12, 'k-fillp');
    else if (k === 2) out += R(x - 22, y - 22, 44, 44, 11, 'k-fillh') + check(x, y + 1, 20, 'k-ink k-w3');
    else if (k === 3) out += C(x, y, 15, 'k-node');
    else out += C(x, y, 15, 'k-node2');
    out += T(x, y - 40, `0${k + 1}`, slot === 'card' ? 18 : 19, k < 4 ? 'k-acc w5 k-num' : 'k-mut w5 k-num', 'middle');
    out += T(x, y + 36 + lab * 0.8, s, lab, k < 4 ? 'k-txt w5' : 'k-mut w5', 'middle');
  });
  if (slot === 'hero') out += T(xs[4], y + 36 + lab * 0.8 + 32, zh ? '另行授权' : 'signed off separately', 19, 'k-mut w4', 'middle');
  // 批准 ≠ 发送
  const a = zh ? '批准' : 'Approved', b = zh ? '发送' : 'sent';
  if (slot === 'card') {
    const big = zh ? 200 : 128;
    fits('quote card a', a, big, W - 2 * m, 600);
    fits('quote card b', `≠ ${b}`, big, W - 2 * m, 600);
    out += T(m - 6, H - m - big * 1.02, a, big, 'k-txt w6');
    out += `<text x="${m - 4}" y="${H - m + 4}" font-size="${big}" class="w6"><tspan class="k-acc">≠ </tspan><tspan class="k-dim">${b}</tspan></text>`;
  } else {
    const big = slot === 'hero' ? (zh ? 176 : 124) : (zh ? 150 : 100);
    fits(`quote ${slot}`, `${a} ≠ ${b}`, big, W - 2 * m, 600);
    out += `<text x="${m - 6}" y="${H - m - 8}" font-size="${big}" class="w6"><tspan class="k-txt">${a} </tspan><tspan class="k-acc">≠ </tspan><tspan class="k-dim">${b}</tspan></text>`;
  }
  return out;
}

/* 4 · Who decides: the owner chart's three words, each with its sign —
   an eye, a held pause, a checked record. */
const TRIO = { zh: ['看得见', '管得住', '查得清'], en: ['Visible', 'Controllable', 'Traceable'] };
function coverTrio(ctx) {
  const { W, H, m, slot, lang, zh } = ctx;
  const top = slot === 'home' ? 136 : 120, bottom = H - m + 8;
  const band = (bottom - top) / 3;
  const size = slot === 'card' ? (zh ? 120 : 70) : slot === 'hero' ? (zh ? 132 : 104) : (zh ? 124 : 90);
  const gx = slot === 'hero' ? W - m - 110 : slot === 'card' ? W - m - 70 : W - m - 90;
  const Rg = slot === 'card' ? 46 : 56;
  const wx = m + (slot === 'card' ? 62 : 84);
  let out = '';
  for (let i = 0; i <= 3; i++) out += L(m, top + i * band, W - m, top + i * band, i === 0 || i === 3 ? 'k-ln' : 'k-ln2');
  TRIO[lang].forEach((word, i) => {
    const cy = top + band * (i + 0.5);
    fits(`trio ${slot}`, word, size, gx - Rg - 30 - wx, 500);
    out += T(m, cy - size * 0.18, `0${i + 1}`, slot === 'card' ? 26 : 24, 'k-acc w5 k-num');
    out += T(wx - 4, cy + size * 0.36, word, size, 'k-txt w5');
    if (i === 0) {
      out += P(`M${gx - Rg} ${r1(cy)}Q${gx} ${r1(cy - Rg * 0.95)} ${gx + Rg} ${r1(cy)}Q${gx} ${r1(cy + Rg * 0.95)} ${gx - Rg} ${r1(cy)}Z`, 'k-ln k-w3');
      out += C(gx, cy, Rg * 0.34, 'k-fillh') + C(gx, cy, Rg * 0.13, 'k-ink');
    } else if (i === 1) {
      out += C(gx, cy, Rg * 0.92, 'k-ln k-w3');
      out += R(gx - Rg * 0.3, cy - Rg * 0.38, Rg * 0.18, Rg * 0.76, 3, 'k-fillh') + R(gx + Rg * 0.12, cy - Rg * 0.38, Rg * 0.18, Rg * 0.76, 3, 'k-fillh');
    } else {
      out += R(gx - Rg * 0.78, cy - Rg * 0.95, Rg * 1.56, Rg * 1.9, 10, 'k-ln k-w3');
      [-0.45, 0, 0.45].forEach((d, k) => { out += check(gx - Rg * 0.38, cy + d * Rg, Rg * 0.32, k === 2 ? 'k-pk k-w3' : 'k-ln k-w3') + L(gx - Rg * 0.08, cy + d * Rg, gx + Rg * 0.5, cy + d * Rg, 'k-ln2 k-w3'); });
    }
  });
  return out;
}

/* 5 · A browser-desktop operating system: one window, and in it the loop
   the article's figure draws — acquisition round to reorders. */
const LOOP_NAMES = { zh: ['获客', '成交', '履约', '协同', '复购'], en: ['Acquire', 'Sell', 'Deliver', 'Coordinate', 'Reorder'] };
function coverLoop(ctx) {
  const { W, H, m, slot, lang, zh } = ctx;
  const win = slot === 'hero' ? { x: 512, y: 112, w: W - m - 512, h: H - m - 112 }
    : slot === 'card' ? { x: m, y: 112, w: W - 2 * m, h: 476 }
    : { x: 452, y: 176, w: W - m - 452 - 30, h: H - m - 176 };
  const bar = slot === 'card' ? 46 : 52;
  let out = R(win.x, win.y, win.w, win.h, 20, 'k-win');
  out += L(win.x, win.y + bar, win.x + win.w, win.y + bar, 'k-ln2');
  [0, 1, 2].map((k) => { out += C(win.x + 26 + k * 20, win.y + bar / 2, 6, k ? 'k-dot2' : 'k-fillp'); });
  const pillX = win.x + 100, pillW = Math.min(win.w - 140, 300);
  out += R(pillX, win.y + bar / 2 - 15, pillW, 30, 15, 'k-pill');
  out += T(pillX + pillW / 2, win.y + bar / 2 + 6, 'STARGO WORK', 16, 'k-mut w5 k-track', 'middle');
  const cx = win.x + win.w / 2, cy = win.y + bar + (win.h - bar) / 2;
  const r = Math.min(win.w, win.h - bar) * (slot === 'card' ? 0.27 : 0.29);
  out += C(cx, cy, r, 'k-ln k-w2');
  const lab = slot === 'card' ? (zh ? 26 : 21) : (zh ? 28 : 22);
  LOOP_NAMES[lang].forEach((s, k) => {
    const a = (-90 + 72 * k) * Math.PI / 180;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    out += C(x, y, slot === 'card' ? 11 : 13, k ? 'k-node' : 'k-hot');
    const lx = cx + (r + 30) * Math.cos(a), ly = cy + (r + 30) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    const dy = Math.sin(a) < -0.5 ? -8 : Math.sin(a) > 0.5 ? lab * 0.9 : lab * 0.35;
    out += T(lx, ly + dy, s, lab, k ? 'k-txt w5' : 'k-acc w6', anchor);
  });
  // direction: chevrons on the ring between stages, the closing one lit
  [36, 108, 180, 252, 324].forEach((deg, k) => {
    const a = (-90 + deg) * Math.PI / 180;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    out += `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})">${chev(0, 0, 6, k === 4 ? 'k-pk k-w3' : 'k-ln k-w2')}</g>`;
  });
  out += T(cx, cy + 9, zh ? '业务循环' : 'Business loop', slot === 'card' ? 24 : 26, 'k-mut w5', 'middle');
  // the words
  const w1 = zh ? '网页桌面' : 'Browser', w1b = zh ? '' : 'desktop';
  const w2 = zh ? 'AI 企业操作系统' : 'AI operating system';
  if (slot === 'card') {
    const s1 = zh ? 84 : 66, s2 = zh ? 30 : 28;
    const line = zh ? w1 : `${w1} ${w1b}`;
    fits('loop card', line, s1, W - 2 * m, 500);
    out += T(m - 4, H - m - s2 - 22, line, s1, 'k-txt w5') + T(m, H - m, w2, s2, 'k-acc w5');
  } else {
    const room = win.x - m - 30;
    const s1 = slot === 'hero' ? (zh ? 100 : 92) : (zh ? 84 : 76), s2 = slot === 'hero' ? 34 : 28;
    fits(`loop ${slot} w1`, w1, s1, room, 500); fits(`loop ${slot} w1b`, w1b, s1, room, 500); fits(`loop ${slot} w2`, w2, s2, room, 500);
    const yb = H - m - s2 - 30;
    if (zh) out += T(m - 4, yb, w1, s1, 'k-txt w5');
    else out += T(m - 4, yb - s1 * 1.05, w1, s1, 'k-txt w5') + T(m - 4, yb, w1b, s1, 'k-txt w5');
    out += T(m, H - m, w2, s2, 'k-acc w5');
  }
  return out;
}

/* 6 · 288 AI roles: one dot per role, filled group by group, largest first
   (WORKFORCE_ROLE_GROUPS, the counts the article's bar chart prints); five
   of them, from different groups, joined as one team. */
function coverRoles(ctx) {
  const { W, H, m, slot, zh } = ctx;
  const groups = [...WORKFORCE_ROLE_GROUPS.groups].sort((a, b) => b.count - a.count);
  const total = groups.reduce((s, g) => s + g.count, 0);
  if (total !== 288) throw new Error(`blog-art: role groups add up to ${total}, not 288`);
  const cols = 24, rows = 12;
  const p = slot === 'hero' ? 31 : slot === 'card' ? 28 : 31;
  const dr = slot === 'card' ? 7.5 : 8.5;
  const xs = slot === 'card' ? (W - (cols - 1) * p) / 2 : W - m - dr - (cols - 1) * p - (slot === 'home' ? 30 : 0);
  const ys = slot === 'home' ? 176 : 128;
  const groupOf = [];
  groups.forEach((g, gi) => { for (let k = 0; k < g.count; k++) groupOf.push(gi); });
  // the team: five roles, each from a different group, joined in a ring
  const team = [[11, 3], [18, 6], [15, 9], [9, 10], [3, 8]].map(([c, r]) => r * cols + c);
  if (new Set(team.map((i) => groupOf[i])).size !== team.length) throw new Error('blog-art: the team on the 288 cover must come from five groups');
  const pos = (i) => [xs + (i % cols) * p, ys + Math.floor(i / cols) * p];
  let out = '';
  for (let i = 0; i < 288; i++) {
    if (team.includes(i)) continue;
    const [x, y] = pos(i);
    out += C(x, y, dr, `k-g${Math.min(groupOf[i], 9)}`);
  }
  const pts = team.map(pos);
  const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
  pts.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
  out += P(`M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`, 'k-team');
  pts.forEach(([x, y]) => { out += C(x, y, dr + 6, 'k-halo') + C(x, y, dr + 2.5, 'k-hot'); });
  // 288 and its words
  const big = slot === 'hero' ? 300 : slot === 'card' ? 230 : 240;
  const base = H - m + 6;
  out += T(m - 12, base, '288', big, 'k-txt w6 k-num');
  const x = m + textWidth('288', big, 600) + (slot === 'card' ? 4 : 16);
  const unit = zh ? '个专业岗位' : 'specialized roles';
  const sub = zh ? '十类职能 · 按任务组队' : (slot === 'card' ? 'ten functions' : 'ten functions · teams by task');
  const uS = slot === 'hero' ? (zh ? 48 : 40) : slot === 'card' ? (zh ? 36 : 27) : (zh ? 42 : 34);
  const sS = slot === 'hero' ? 28 : slot === 'card' ? 24 : 26;
  fits(`roles ${slot} unit`, unit, uS, W - m - x, 500);
  fits(`roles ${slot} sub`, sub, sS, W - m - x, 500);
  const uy = slot === 'card' ? base - big * 0.42 : base - 8;
  out += T(x, uy, unit, uS, 'k-txt w5') + T(x, uy - uS - 18, sub, sS, 'k-acc w5');
  return out;
}

/* 7 · Knowledge and the relationship map: customer → opportunity → quote →
   order, the six things around them, and the question the map answers. */
const MAP = {
  core: { zh: ['客户', '商机', '报价', '订单'], en: ['Customer', 'Opportunity', 'Quote', 'Order'] },
  // [label, core index, above?] — the figure's six links
  links: [
    [{ zh: '联系人', en: 'Contact' }, 0, true],
    [{ zh: '沟通历史', en: 'History' }, 0, false],
    [{ zh: '负责人', en: 'Owner' }, 1, true],
    [{ zh: '产品 / 价格', en: 'Product / price' }, 2, false],
    [{ zh: '审批 / 版本', en: 'Approval / version' }, 2, true],
    [{ zh: '任务 / 文件', en: 'Tasks / files' }, 3, false],
  ],
  question: { zh: '价格该用哪一版？', en: 'Which approved price?' },
};
function coverMap(ctx) {
  const { W, H, m, slot, lang, zh } = ctx;
  const y = slot === 'card' ? 376 : slot === 'home' ? 420 : 396;
  const pw = slot === 'hero' ? (zh ? 168 : 226) : slot === 'card' ? (zh ? 140 : 164) : (zh ? 164 : 206);
  const ph = slot === 'card' ? 60 : slot === 'hero' ? 76 : 70;
  const lab = slot === 'hero' ? (zh ? 36 : 31) : slot === 'card' ? (zh ? 28 : 23) : (zh ? 34 : 27);
  const span = W - 2 * m - pw;
  const cx = [0, 1, 2, 3].map((i) => m + pw / 2 + i * span / 3);
  const off = slot === 'card' ? 148 : slot === 'home' ? 150 : 170;
  const sl = slot === 'card' ? (zh ? 22 : 19) : (zh ? 25 : 21);
  let out = '';
  // satellites first, under the chain
  const seen = {};
  MAP.links.forEach(([name, ci, above], k) => {
    const key = `${ci}${above}`;
    const n = (seen[key] = (seen[key] ?? 0) + 1);
    const lit = k === 3 || k === 4;
    const sx = cx[ci] + (ci === 0 ? (above ? -0.18 : 0.24) : ci === 3 ? -0.22 : (above ? 0.3 : -0.3)) * pw + (n - 1) * 40;
    const sy = y + (above ? -off : off);
    out += P(`M${r1(cx[ci])} ${r1(y + (above ? -ph / 2 : ph / 2))}C${r1(cx[ci])} ${r1((y + sy) / 2)} ${r1(sx)} ${r1((y + sy) / 2)} ${r1(sx)} ${r1(sy)}`, lit ? 'k-pk k-w2' : 'k-ln');
    out += C(sx, sy, lit ? 8 : 6, lit ? 'k-hot' : 'k-dot');
    const s = name[lang];
    fits(`map ${slot} link`, s, sl, span / 3 + pw / 2, 500);
    out += T(sx, above ? sy - 20 : sy + 20 + sl * 0.8, s, sl, lit ? 'k-acc w5' : 'k-soft w4', 'middle');
  });
  // the chain
  out += L(cx[0] + pw / 2, y, cx[3] - pw / 2, y, 'k-pk k-w3');
  for (let i = 1; i < 4; i++) out += chev(cx[i] - pw / 2 - 12, y, 7, 'k-pk k-w3');
  MAP.core[lang].forEach((s, i) => {
    fits(`map ${slot} core`, s, lab, pw - 24, 500);
    out += R(cx[i] - pw / 2, y - ph / 2, pw, ph, ph / 2, i === 2 ? 'k-core k-core-on' : 'k-core');
    out += T(cx[i], y + lab * 0.36, s, lab, i === 2 ? 'k-ink w6' : 'k-txt w5', 'middle');
  });
  const q = MAP.question[lang];
  const qS = slot === 'hero' ? (zh ? 64 : 56) : slot === 'card' ? (zh ? 54 : 46) : (zh ? 58 : 50);
  fits(`map ${slot} question`, q, qS, W - 2 * m, 500);
  out += T(m - 4, H - m, q, qS, 'k-txt w5');
  return out;
}

const COVERS = {
  'stargo-work-visual-guide': { key: 'guide', draw: coverGuide, label: { zh: '示意图：这篇图文详解的九张图，从获客到经营排成一张索引。', en: 'Illustration: the nine figures of this guide, from acquisition to operations, laid out as an index.' } },
  'start-with-one-workflow': { key: 'start', draw: coverStart, label: { zh: '示意图：许多流程里先点亮一条，依次经过选流程、备资料、连账号、定审批、验效果五步。', en: 'Illustration: one workflow lit among many, through five steps: choose, prepare, connect, assign, validate.' } },
  'from-inquiry-to-quote': { key: 'quote', draw: coverQuote, label: { zh: '示意图：询盘、报价、批准、PI 依次推进，发送前另有一道关：批准不等于发送。', en: 'Illustration: inquiry, quote, approval and PI in sequence, with a separate gate before sending: approved is not sent.' } },
  'approval-gates-for-ai-in-trade': { key: 'trio', draw: coverTrio, label: { zh: '示意图：看得见、管得住、查得清。', en: 'Illustration: visible, controllable, traceable.' } },
  'ai-operating-system-for-global-trade': { key: 'loop', draw: coverLoop, label: { zh: '示意图：一个网页桌面窗口里，获客、成交、履约、协同、复购连成一个业务循环。', en: 'Illustration: one browser-desktop window holding the business loop of acquisition, sales, delivery, coordination and reorders.' } },
  '288-ai-employees-not-288-chatbots': { key: 'roles', draw: coverRoles, label: { zh: '示意图：288 个圆点代表 288 个专业岗位，按十类职能排列，其中五个连成一支团队。', en: 'Illustration: 288 dots for 288 specialized roles in ten functions, five of them joined as one team.' } },
  'enterprise-ontology-explained': { key: 'map', draw: coverMap, label: { zh: '示意图：客户、商机、报价、订单和它们关联的六类信息，回答“价格该用哪一版？”', en: 'Illustration: customer, opportunity, quote and order with six linked kinds of information, answering “which approved price?”' } },
};
export const BLOG_ART_SLUGS = Object.keys(COVERS);

/**
 * The cover of `post` for one slot ('hero' | 'card' | 'home').
 *   classes  the class list of the picture it replaces (kept: it sizes the box)
 *   attrs    the picture's own attributes to keep (data-w-id, style)
 *   no       the article's number in the series (oldest is 01)
 *   figures  how many figures the article prints (the guide's contact sheet)
 * The hero is a labelled image; a card's cover is decorative (its link
 * carries the title).
 */
export function blogCover(post, lang, slot, { classes = '', attrs = '', no = 0, figures = 0 } = {}) {
  const c = COVERS[post.slug];
  if (!c) throw new Error(`blog-art: no cover for ${post.slug}`);
  const S = SLOTS[slot];
  if (!S) throw new Error(`blog-art: slot ${slot}`);
  const zh = lang === 'zh';
  VIEW_W = S.W;
  const art = c.draw({ ...S, slot, lang, zh, figures });
  const a11y = slot === 'hero' ? `role="img" aria-label="${esc(c.label[lang])}"` : 'aria-hidden="true"';
  const section = post.section?.[lang] ?? '';
  return `<div class="${classes ? `${classes} ` : ''}sgcv sgcv--${slot} sgcv-${c.key}"${attrs ? ` ${attrs}` : ''} ${a11y}>`
    + `<svg class="sgcv-art${zh ? ' sgcv-zh' : ''}" viewBox="0 0 ${S.W} ${S.H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${art}</svg>`
    + `<span class="sgcv-meta" aria-hidden="true"><b>${String(no).padStart(2, '0')}</b><span class="sgcv-sec">${esc(section)}</span><span class="sgcv-tag">${zh ? '示意' : 'Illustration'}</span></span>`
    + '</div>';
}

/** The covers' sheet, after stargo-fusion.css, on every page that draws a cover (and only there). */
export function blogArtSheet(html, name) {
  if (!/\sclass="[^"]*\bsgcv\b/.test(html)) return html;
  const fusion = '<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>';
  if (html.split(fusion).length !== 2) throw new Error(`blog-art: ${name}: no single stargo-fusion.css link to put the covers' sheet after`);
  return html.replace(fusion, `${fusion}\n<link href="css/stargo-blog-art.css" rel="stylesheet" type="text/css"/>`);
}
