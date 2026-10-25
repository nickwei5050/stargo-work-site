/**
 * The blog's covers, drawn in code (lane "blog", 2026-10-23).
 *
 * Each article's cover was an AI photograph (tools/replaceables.mjs
 * BLOG_COVERS, B01–B07). Since 2026-10-23 every place that showed one draws
 * an editorial cover instead: the article hero, the blog index card, every
 * article's 「更多文章」 card, the homepage's 最新文章 cards and workforce's
 * 文章 cards, zh and en. One cover per article, built from that article's own
 * idea in the chart language of its figures (tools/blog.mjs figure.sgc: the
 * near-black panel with the glow, hairlines, the accent, two-digit indices):
 *
 *   stargo-work-visual-guide          9 张图: the guide's nine figures as a contact sheet
 *   start-with-one-workflow           1 条流程: one line lit among waiting ones, through five steps
 *   from-inquiry-to-quote             询盘 → 报价 → 批准 → PI, a gate before 发送: 批准 ≠ 发送
 *   approval-gates-for-ai-in-trade    看得见 / 管得住 / 查得清 (the owner chart)
 *   ai-operating-system-for-global-trade  the business loop inside one browser window
 *   288-ai-employees-not-288-chatbots 288 个专业岗位: one dot per role, in the ten groups; five form a team
 *   enterprise-ontology-explained     the relationship map answering 「价格该用哪一版？」
 *
 * Many show at once, so they are static: inline SVG for the art (vector, sharp
 * at any size; no ids, so no clash when several sit on one page) and two HTML
 * labels — the article's number and section, and the 「示意 / Illustration」
 * pill (css/stargo-blog-art.css, never below 12px). Nothing ticks; the only
 * motion is a CSS hover on the art layer.
 *
 * Every composition is drawn for the box it fills, at a viewBox close to the
 * size it shows at, so its type stays readable instead of being scaled away:
 *   hero   1200 x 800  the article hero from 690px of box width (tablet, desktop)
 *   heroN   360 x 240  the article hero below 690px (phones): its own composition
 *   card    360 x 360  the 1:1 cards: blog index, 「更多文章」, workforce
 *   home    360 x 276  the homepage's article cards (3 / 2.3)
 * Each variant has a type floor (`min`, in viewBox units) that is 12 CSS px
 * at the box width it is drawn for — 690px for the hero, 288px (a 320px
 * phone, and the 1024 desktop row) for heroN and the cards, 266px (the 1280
 * desktop row) for the homepage card — and a line set smaller stops the build. No text is ever
 * hidden for being small, so no drawn container is left empty. The one
 * exception is the homepage card on 992–1100px desktops, where Mono's row
 * makes it ~200px wide: its secondary labels (`k-sm`) step aside below 240px
 * and the cover's big type carries it.
 * `preserveAspectRatio="xMidYMid slice"` absorbs the few pixels a box may
 * differ from its ratio. The homepage card keeps its top-right corner calm:
 * Mono draws its arrow badge there (50 x 40 px, 10px in).
 *
 * Every Latin word on a Chinese cover is a product or trade name. Text widths
 * are estimated (cjk 1em, Latin ~0.56em) and checked against the room each
 * line has; a line that would not fit stops the build.
 */
import { WORKFORCE_ROLE_GROUPS } from './copy.mjs';

const VARIANTS = {
  hero: { W: 1200, H: 800, m: 64, min: 21 },     // 12px at 690px
  heroN: { W: 360, H: 240, m: 20, min: 15 },     // 12px at 288px (a 320px phone), 13.7px at 328px
  card: { W: 360, H: 360, m: 20, min: 15 },      // 12px at 288px (also the 1024 desktop row)
  home: { W: 360, H: 276, m: 20, min: 16.3 },    // 12px at 266px (the 1280 desktop row), 14.5px at 321px
};
/** The compositions each slot draws (the hero switches at 690px of box width). */
const SLOT_VARIANTS = { hero: ['hero', 'heroN'], card: ['card'], home: ['home'] };

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

/* The type floor of the composition being drawn (VARIANTS[v].min). */
let MIN = 0, WHERE = '';
const floor = (size, s) => { if (size < MIN - 1e-9) throw new Error(`blog-art: ${WHERE}: 「${s}」 at ${size} is under the ${MIN} floor (12 CSS px)`); };

/* SVG primitives. Classes carry colour and weight (css/stargo-blog-art.css). */
const T = (x, y, s, size, cls, anchor) => { floor(size, s); return `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}"${anchor ? ` text-anchor="${anchor}"` : ''} class="${cls}">${s}</text>`; };
const L = (x1, y1, x2, y2, cls) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" class="${cls}"/>`;
const C = (cx, cy, r, cls) => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" class="${cls}"/>`;
const R = (x, y, w, h, rx, cls) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(rx)}" class="${cls}"/>`;
const P = (d, cls) => `<path d="${d}" class="${cls}"/>`;
/** A check mark centred on (x, y), `s` wide. */
const check = (x, y, s, cls) => P(`M${r1(x - s / 2)} ${r1(y)}l${r1(s * 0.32)} ${r1(s * 0.3)}l${r1(s * 0.68)} ${r1(-s * 0.62)}`, cls);
/** A small chevron pointing right at (x, y). */
const chev = (x, y, s, cls) => P(`M${r1(x - s / 2)} ${r1(y - s)}L${r1(x + s / 2)} ${r1(y)}L${r1(x - s / 2)} ${r1(y + s)}`, cls);
/** The same, pointing down. */
const chevD = (x, y, s, cls) => P(`M${r1(x - s)} ${r1(y - s / 2)}L${r1(x)} ${r1(y + s / 2)}L${r1(x + s)} ${r1(y - s / 2)}`, cls);
/** The cap height of Inter / PingFang, as a share of the font size. */
const CAP = 0.73;

/* ------------------------------------------------------------------ covers */

/* 1 · The guide: 「9 张图」, its nine figures as a contact sheet, in the order
   the article prints them, each drawn by its kind (tools/blog.mjs sgc--kind). */
const GLYPHS = {
  // a ring of five stages, the first lit
  loop: () => C(50, 35, 24, 'k-ln') + [0, 1, 2, 3, 4].map((k) => { const a = (-90 + 72 * k) * Math.PI / 180; return C(50 + 24 * Math.cos(a), 35 + 24 * Math.sin(a), 5, k ? 'k-dot' : 'k-hot'); }).join(''),
  // two lanes and the hand-off between them
  pipeline: () => R(6, 12, 36, 46, 7, 'k-ln') + R(58, 12, 36, 46, 7, 'k-ln') + L(42, 35, 58, 35, 'k-pk') + chev(55, 35, 4, 'k-pk') + [22, 32, 42].map((y) => L(13, y, 33, y, 'k-ln2') + L(65, y, 85, y, 'k-ln2')).join(''),
  // portrait, landscape and square frames
  video: () => R(8, 10, 24, 46, 4, 'k-ln') + R(38, 20, 38, 24, 4, 'k-pk') + R(82, 24, 14, 14, 3, 'k-ln'),
  // the five largest role groups as bars
  roles: () => [129, 50, 20, 19, 16].map((c, i) => R(10, 9 + i * 11, Math.max(6, 80 * c / 129), 6, 3, i ? 'k-fill2' : 'k-fillp')).join(''),
  // a hub and five members
  team: () => [0, 1, 2, 3, 4].map((k) => { const a = (-90 + 72 * k) * Math.PI / 180; const x = 50 + 27 * Math.cos(a), y = 35 + 27 * Math.sin(a); return L(50, 35, x, y, 'k-ln2') + C(x, y, 4.5, 'k-dot'); }).join('') + C(50, 35, 8, 'k-hot'),
  // six steps round a ring
  proactive: () => C(50, 35, 25, 'k-ln') + [0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return C(50 + 25 * Math.cos(a), 35 + 25 * Math.sin(a), 4.5, k === 2 ? 'k-hot' : 'k-dot'); }).join(''),
  // three panels, the middle one held
  owner: () => [0, 1, 2].map((i) => R(12 + i * 27, 12, 22, 46, 5, i === 1 ? 'k-pk' : 'k-ln')).join('') + R(43.5, 28, 3, 14, 1, 'k-fillp') + R(49.5, 28, 3, 14, 1, 'k-fillp'),
  // five numbered rows, the first lit
  start: () => [0, 1, 2, 3, 4].map((i) => C(14, 11 + i * 12, 3, i ? 'k-dot' : 'k-hot') + R(24, 9 + i * 12, 64 - i * 6, 4, 2, i ? 'k-fill2' : 'k-fillp')).join(''),
  // four columns of items
  status: () => [0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => R(10 + c * 21, 12 + r * 15, 16, 9, 3, c === 0 ? 'k-fillp' : 'k-fill2')).join('')).join(''),
};
const GUIDE = {
  // grid: the contact sheet; num: the numeral's size and baseline; unit, sub: sizes; subY: the eyebrow's last baseline
  hero: { grid: [520, 112, 616, 624], gap: 16, rx: 16, label: 21, num: 380, base: 736, unit: { zh: 64, en: 46 }, sub: 30, subY: 420 },
  card: { grid: [20, 58, 320, 150], gap: 7, rx: 8, num: 120, base: 340, unit: { zh: 28, en: 26 }, sub: 15, subY: 234 },
  heroN: { grid: [184, 58, 156, 162], gap: 6, rx: 7, num: 104, base: 220, unit: { zh: 22, en: 20 }, sub: 15, subY: 126 },
  home: { grid: [192, 86, 148, 170], gap: 6, rx: 7, num: 110, base: 256, unit: { zh: 26, en: 21 }, sub: 16.3, subY: 146 },
};
function coverGuide(ctx) {
  const { W, m, v, zh } = ctx;
  const kinds = ctx.figures;
  if (kinds.length !== 9) throw new Error(`blog-art: the guide prints ${kinds.length} figures; its contact sheet is 3 x 3`);
  const missing = kinds.filter((k) => !GLYPHS[k]);
  if (missing.length) throw new Error(`blog-art: the guide's contact sheet has no glyph for figure kind(s) ${missing.join(', ')}`);
  const G = GUIDE[v];
  const [gx, gy, gw, gh] = G.grid;
  const tw = (gw - 2 * G.gap) / 3, th = (gh - 2 * G.gap) / 3;
  let out = '';
  kinds.forEach((kind, i) => {
    const x = gx + (i % 3) * (tw + G.gap), y = gy + Math.floor(i / 3) * (th + G.gap);
    out += R(x, y, tw, th, G.rx, i === 0 ? 'k-tile k-tile-on' : 'k-tile');
    const top = G.label ? 40 : 6;
    const s = Math.min((tw - (G.label ? 36 : 14)) / 100, (th - top - (G.label ? 22 : 6)) / 70);
    out += `<g transform="translate(${r1(x + (tw - 100 * s) / 2)} ${r1(y + top + (th - top - (G.label ? 8 : 0) - 70 * s) / 2)}) scale(${r1(s * 100) / 100})">${GLYPHS[kind]()}</g>`;
    if (G.label) out += T(x + 16, y + 31, zh ? `图 ${i + 1}` : `Fig. ${i + 1}`, G.label, i === 0 ? 'k-acc w5' : 'k-mut w5');
  });
  // the eyebrow, then 「9 张图」 / "9 figures" on one baseline
  const n = String(kinds.length);
  const word = zh ? '张图' : 'figures';
  const left = gx > m ? gx - 24 : W - m;
  // wrapped, the arrow leads the second line rather than hanging at the end of the first
  const subLines = zh ? ['从获客到经营'] : (left - m >= textWidth('acquisition → operations', G.sub) ? ['acquisition → operations'] : ['acquisition', '→ operations']);
  subLines.forEach((l, i) => { fits(`guide ${v} sub`, l, G.sub, left - m, 500); out += T(m, G.subY - (subLines.length - 1 - i) * G.sub * 1.3, l, G.sub, 'k-acc w5' + (v === 'home' ? ' k-sm' : '')); });
  const numW = textWidth(n, G.num, 600) * 0.92;
  const uS = G.unit[ctx.lang];
  fits(`guide ${v} unit`, word, uS, left - (m + numW + 10), 500);
  out += T(m - G.num * 0.03, G.base, n, G.num, 'k-txt w6 k-num');
  out += T(m + numW + 10, G.base - G.num * 0.02, word, uS, 'k-txt w5');
  return out;
}

/* 2 · Start with one workflow: 「1 条流程」, and beside it the workflows a
   company could start with, drawn as faint dashed columns; one is lit and
   runs through the five steps (the article's figure 「如何开始」). */
const START_STEPS = { zh: ['选流程', '备资料', '连账号', '定审批', '验效果'], en: ['Choose', 'Prepare', 'Connect', 'Assign', 'Validate'] };
const START = {
  // num: numeral size and baseline; unit/sub baselines; rows: first and last step's y; lit: the lit column's x; wait: the waiting columns' x
  hero: { num: 560, base: 590, unitS: { zh: 60, en: 56 }, unitY: 676, subS: 30, subY: 736, rows: [170, 630], lit: 760, wait: [430, 496, 562, 628, 694], node: 13, idx: 22, lab: { zh: 38, en: 34 }, motto: true },
  card: { num: 230, base: 262, unitS: { zh: 28, en: 25 }, unitY: 304, subS: 16, subY: 336, rows: [80, 324], lit: 226, wait: [164, 184, 204], node: 7, idx: 15, lab: { zh: 17, en: 15.5 } },
  heroN: { num: 150, base: 166, unitS: { zh: 22, en: 21 }, unitY: 196, subS: 15, subY: 220, rows: [72, 212], lit: 222, wait: [168, 186, 204], node: 6, idx: 15, lab: { zh: 15.5, en: 15 } },
  home: { num: 160, base: 190, unitS: { zh: 24, en: 22 }, unitY: 224, subS: 16.3, subY: 254, rows: [94, 250], lit: 224, wait: [170, 188, 206], node: 6.5, idx: 16.3, lab: { zh: 16.5, en: 16.3 } },
};
function coverStart(ctx) {
  const { W, H, m, v, lang, zh } = ctx;
  const S = START[v];
  const steps = START_STEPS[lang];
  const [y0, y1] = S.rows;
  const at = (k) => y0 + k * (y1 - y0) / 4;
  const top = y0 - (v === 'hero' ? 40 : 18), bottom = y1 + (v === 'hero' ? 40 : 14);
  let out = '';
  // the other workflows: drawn, waiting, their steps not started
  S.wait.forEach((x) => {
    out += L(x, top, x, bottom, 'k-dash');
    for (let k = 0; k < 5; k++) out += C(x, at(k), v === 'hero' ? 3.5 : 2.2, 'k-dot2');
  });
  // the one that is lit
  out += L(S.lit, top, S.lit, bottom, 'k-pk k-w3');
  const ix = S.lit + S.node + (v === 'hero' ? 22 : 9);
  const nx = ix + textWidth('00', S.idx) + (v === 'hero' ? 18 : 7);
  const lab = S.lab[lang];
  steps.forEach((s, k) => {
    const y = at(k);
    fits(`start ${v} step`, s, lab, W - m - nx, 500);
    out += C(S.lit, y, S.node, k ? 'k-node' : 'k-hot');
    out += T(ix, y + S.idx * 0.36, `0${k + 1}`, S.idx, 'k-acc w5 k-num' + (v === 'home' ? ' k-sm' : ''));
    out += T(nx, y + lab * 0.36, s, lab, 'k-txt w5' + (v === 'home' ? ' k-sm' : ''));
  });
  // 「1 条流程」: the numeral, the unit under it, then the five steps in the accent
  const room = S.wait[0] - (v === 'hero' ? 40 : 14) - m;
  const unit = zh ? '条流程' : 'workflow';
  const sub = zh ? '五个步骤' : 'five steps';
  fits(`start ${v} unit`, unit, S.unitS[lang], room, 500);
  fits(`start ${v} sub`, sub, S.subS, room, 500);
  out += T(m - S.num * 0.045, S.base, '1', S.num, 'k-txt w6');
  out += T(m, S.unitY, unit, S.unitS[lang], 'k-txt w5');
  out += T(m, S.subY, sub, S.subS, 'k-acc w5' + (v === 'home' ? ' k-sm' : ''));
  if (S.motto) {
    const motto = zh ? '把工作交给 AI，把决定权留在企业。' : 'Delegate the work. Keep the authority.';
    fits(`start ${v} motto`, motto, 22, W - m - S.wait[0], 400);
    out += T(S.wait[0] - 4, H - m, motto, 22, 'k-mut w4');
  }
  return out;
}

/* 3 · From inquiry to quote: the track 询盘 → 报价 → 批准 → PI, then a gate,
   and 发送 on its own; under it the article's point, 批准 ≠ 发送. */
const QUOTE_TRACK = { zh: ['询盘', '报价', '批准', 'PI', '发送'], en: ['Inquiry', 'Quote', 'Approve', 'PI', 'Send'] };
const QUOTE = {
  // y: the track; xs: its five stops; gate: the gate's x; k: node scale; idx: index size (0 = none); lab: label sizes; big: the headline
  hero: { y: 288, xs: [120, 340, 560, 780, 1060], gate: 900, k: 1, idx: 22, lab: { zh: 30, en: 26 }, note: 22, big: { zh: 176, en: 124 }, lines: 1 },
  card: { y: 100, xs: [46, 112, 178, 244, 322], gate: 283, k: 0.5, idx: 15, lab: { zh: 16, en: 15 }, big: { zh: 96, en: 62 }, lines: 2 },
  heroN: { y: 94, xs: [46, 112, 178, 244, 322], gate: 283, k: 0.5, idx: 15, lab: { zh: 16, en: 15 }, big: { zh: 56, en: 38 }, lines: 1 },
  home: { y: 98, xs: [50, 113, 177, 240, 318], gate: 279, k: 0.5, idx: 0, lab: { zh: 17, en: 16.3 }, big: { zh: 58, en: 39 }, lines: 1 },
};
function coverQuote(ctx) {
  const { W, H, m, v, lang, zh } = ctx;
  const Q = QUOTE[v];
  const { y, xs, gate, k: q } = Q;
  const names = QUOTE_TRACK[lang];
  const lab = Q.lab[lang];
  let out = '';
  out += L(xs[0], y, xs[3], y, 'k-pk k-w3');
  out += L(xs[3] + 16 * q, y, gate - 12 * q, y, 'k-ln');
  out += L(gate + 12 * q, y, xs[4] - 18 * q, y, 'k-dash');
  out += L(gate - 5 * q, y - 38 * q, gate - 5 * q, y + 38 * q, 'k-pk k-w3') + L(gate + 5 * q, y - 38 * q, gate + 5 * q, y + 38 * q, 'k-pk k-w3');
  names.forEach((s, k) => {
    const x = xs[k];
    if (k < 2) out += C(x, y, 12 * q, 'k-fillp');
    else if (k === 2) out += R(x - 22 * q, y - 22 * q, 44 * q, 44 * q, 11 * q, 'k-fillh') + check(x, y + q, 20 * q, 'k-ink k-w3');
    else if (k === 3) out += C(x, y, 15 * q, 'k-node');
    else out += C(x, y, 15 * q, 'k-node2');
    if (Q.idx) out += T(x, y - 40 * q - (q < 1 ? 6 : 0), `0${k + 1}`, Q.idx, k < 4 ? 'k-acc w5 k-num' : 'k-mut w5 k-num', 'middle');
    out += T(x, y + 36 * q + (q < 1 ? 6 : 0) + lab * 0.8, s, lab, (k < 4 ? 'k-txt w5' : 'k-mut w5') + (v === 'home' ? ' k-sm' : ''), 'middle');
  });
  // the labels keep 6 units apart and inside the margins
  names.forEach((s, k) => {
    const w = textWidth(s, lab);
    if (k === 0 && xs[0] - w / 2 < m - 2) throw new Error(`blog-art: quote ${v}: 「${s}」 crosses the left margin`);
    if (k === 4 && xs[4] + w / 2 > W - m + 2) throw new Error(`blog-art: quote ${v}: 「${s}」 crosses the right margin`);
    if (k < 4 && (w + textWidth(names[k + 1], lab)) / 2 + 6 > xs[k + 1] - xs[k]) throw new Error(`blog-art: quote ${v}: 「${s}」 and 「${names[k + 1]}」 touch`);
  });
  if (Q.note) {
    const note = zh ? ['另行授权'] : ['authorized', 'separately'];
    note.forEach((l, i) => { fits(`quote ${v} note`, l, Q.note, 2 * (W - m - xs[4]), 400); out += T(xs[4], y + 36 + lab * 0.8 + 34 + i * Q.note * 1.25, l, Q.note, 'k-mut w4', 'middle'); });
  }
  // 批准 ≠ 发送
  const a = zh ? '批准' : 'Approved', b = zh ? '发送' : 'sent';
  const big = Q.big[lang];
  if (Q.lines === 2) {
    fits(`quote ${v} a`, a, big, W - 2 * m, 600);
    fits(`quote ${v} b`, `≠ ${b}`, big, W - 2 * m, 600);
    out += T(m - big * 0.03, H - m - big * 1.02, a, big, 'k-txt w6');
    floor(big, b);
    out += `<text x="${r1(m - big * 0.02)}" y="${H - m}" font-size="${big}" class="w6"><tspan class="k-acc">≠ </tspan><tspan class="k-dim">${b}</tspan></text>`;
  } else {
    fits(`quote ${v}`, `${a} ≠ ${b}`, big, W - 2 * m, 600);
    floor(big, b);
    out += `<text x="${r1(m - big * 0.035)}" y="${H - m - (v === 'hero' ? 8 : 0)}" font-size="${big}" class="w6"><tspan class="k-txt">${a} </tspan><tspan class="k-acc">≠ </tspan><tspan class="k-dim">${b}</tspan></text>`;
  }
  return out;
}

/* 4 · Who decides: the owner chart's three words, each with its sign —
   an eye, a held pause, a checked record. */
const TRIO_WORDS = { zh: ['看得见', '管得住', '查得清'], en: ['Visible', 'Controllable', 'Traceable'] };
const TRIO = {
  // top/bottom: the rules; size: the words; idx: the index; Rg: the sign's radius; wx: the words' x; gx: the signs' x; rule: where the top rule stops short (Mono's badge)
  hero: { top: 128, bottom: 744, size: { zh: 132, en: 104 }, idx: 24, Rg: 56, wx: 148, gx: 1026 },
  card: { top: 64, bottom: 344, size: { zh: 58, en: 36 }, idx: 15, Rg: 22, wx: 54, gx: 316 },
  heroN: { top: 62, bottom: 226, size: { zh: 36, en: 28 }, idx: 15, Rg: 15, wx: 50, gx: 322 },
  home: { top: 76, bottom: 262, size: { zh: 42, en: 31 }, idx: 16.3, Rg: 17, wx: 54, gx: 320, rule: 76 },
};
function coverTrio(ctx) {
  const { W, m, v, lang } = ctx;
  const S = TRIO[v];
  const band = (S.bottom - S.top) / 3;
  const size = S.size[lang], Rg = S.Rg, gx = S.gx;
  const w3 = v === 'hero' ? 'k-w3' : 'k-w2';
  let out = '';
  for (let i = 0; i <= 3; i++) out += L(m, S.top + i * band, W - m - (i === 0 && S.rule ? S.rule : 0), S.top + i * band, i === 0 || i === 3 ? 'k-ln' : 'k-ln2');
  TRIO_WORDS[lang].forEach((word, i) => {
    const cy = S.top + band * (i + 0.5);
    fits(`trio ${v}`, word, size, gx - Rg - (v === 'hero' ? 30 : 12) - S.wx, 500);
    out += T(m, cy - size * CAP / 2 + S.idx * CAP, `0${i + 1}`, S.idx, 'k-acc w5 k-num' + (v === 'home' ? ' k-sm' : ''));
    out += T(S.wx - size * 0.03, cy + size * 0.36, word, size, 'k-txt w5');
    if (i === 0) {
      out += P(`M${r1(gx - Rg)} ${r1(cy)}Q${r1(gx)} ${r1(cy - Rg * 0.95)} ${r1(gx + Rg)} ${r1(cy)}Q${r1(gx)} ${r1(cy + Rg * 0.95)} ${r1(gx - Rg)} ${r1(cy)}Z`, `k-ln ${w3}`);
      out += C(gx, cy, Rg * 0.34, 'k-fillh') + C(gx, cy, Rg * 0.13, 'k-ink');
    } else if (i === 1) {
      out += C(gx, cy, Rg * 0.92, `k-ln ${w3}`);
      out += R(gx - Rg * 0.3, cy - Rg * 0.38, Rg * 0.18, Rg * 0.76, Rg * 0.06, 'k-fillh') + R(gx + Rg * 0.12, cy - Rg * 0.38, Rg * 0.18, Rg * 0.76, Rg * 0.06, 'k-fillh');
    } else {
      out += R(gx - Rg * 0.78, cy - Rg * 0.95, Rg * 1.56, Rg * 1.9, Rg * 0.18, `k-ln ${w3}`);
      [-0.45, 0, 0.45].forEach((d, k) => { out += check(gx - Rg * 0.38, cy + d * Rg, Rg * 0.32, k === 2 ? `k-pk ${w3}` : `k-ln ${w3}`) + L(gx - Rg * 0.08, cy + d * Rg, gx + Rg * 0.5, cy + d * Rg, `k-ln2 ${w3}`); });
    }
  });
  return out;
}

/* 5 · A browser-desktop operating system: one window, and in it the loop
   the article's figure draws — acquisition round to reorders. The hero
   names the stages round the ring; the smaller boxes list them beside a
   smaller ring, so every name stays readable. */
const LOOP_NAMES = { zh: ['获客', '成交', '履约', '协同', '复购'], en: ['Acquire', 'Sell', 'Deliver', 'Coordinate', 'Reorder'] };
const LOOP = {
  // win: the window; bar: its title bar; ring: centre offset in the content and radius; list: x of the stage list (0 = round the ring); lab: name size
  hero: { win: [512, 112, 624, 624], bar: 56, pillT: 21, ring: [0.5, 0.29], list: 0, lab: { zh: 28, en: 23 }, centre: 26 },
  card: { win: [20, 58, 320, 184], bar: 30, pillT: 15, ring: [0.27, 46], list: 180, idx: true, lab: { zh: 16, en: 15 }, centre: 15, rowGap: 25 },
  heroN: { win: [168, 56, 172, 166], bar: 28, pillT: 15, ring: [0.24, 26], list: 244, lab: { zh: 15.5, en: 15 }, rowGap: 24 },
  home: { win: [160, 84, 180, 172], bar: 30, pillT: 16.3, ring: [0.24, 25], list: 236, lab: { zh: 16.5, en: 16.3 }, rowGap: 25 },
};
function coverLoop(ctx) {
  const { W, H, m, v, lang, zh } = ctx;
  const S = LOOP[v];
  const [wx, wy, ww, wh] = S.win;
  const bar = S.bar, hero = v === 'hero';
  let out = R(wx, wy, ww, wh, hero ? 20 : 10, 'k-win');
  out += L(wx, wy + bar, wx + ww, wy + bar, 'k-ln2');
  const dot = hero ? 6 : 3.2, dg = hero ? 20 : 10;
  [0, 1, 2].forEach((k) => { out += C(wx + (hero ? 26 : 13) + k * dg, wy + bar / 2, dot, k ? 'k-dot2' : 'k-fillp'); });
  // the address bar, with the product's name in it at a readable size
  const px = wx + (hero ? 100 : 42), pw = Math.min(wx + ww - px - (hero ? 40 : 10), hero ? 300 : 170);
  const track = hero ? ' k-track' : '';
  fits(`loop ${v} address`, 'STARGO WORK', S.pillT, pw - 12 - (hero ? 40 : 0), 500);
  const ph = hero ? 32 : bar - 8;
  out += R(px, wy + bar / 2 - ph / 2, pw, ph, ph / 2, 'k-pill');
  out += T(px + pw / 2, wy + bar / 2 + S.pillT * 0.36, 'STARGO WORK', S.pillT, `k-mut w5${track}`, 'middle');
  // the ring
  const ch = wh - bar;
  const cx = S.list ? wx + ww * S.ring[0] : wx + ww / 2, cy = wy + bar + ch / 2;
  const r = S.list ? S.ring[1] : Math.min(ww, ch) * S.ring[1];
  out += C(cx, cy, r, 'k-ln k-w2');
  const names = LOOP_NAMES[lang], lab = S.lab[lang];
  names.forEach((s, k) => {
    const a = (-90 + 72 * k) * Math.PI / 180;
    out += C(cx + r * Math.cos(a), cy + r * Math.sin(a), hero ? 13 : S.list ? 5 : 11, k ? 'k-node' : 'k-hot');
    if (S.list) return;
    const lx = cx + (r + 30) * Math.cos(a), ly = cy + (r + 30) * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    const dy = Math.sin(a) < -0.5 ? -8 : Math.sin(a) > 0.5 ? lab * 0.9 : lab * 0.35;
    out += T(lx, ly + dy, s, lab, k ? 'k-txt w5' : 'k-acc w6', anchor);
  });
  // direction: chevrons on the ring between stages, the closing one lit
  [36, 108, 180, 252, 324].forEach((deg, k) => {
    const a = (-90 + deg) * Math.PI / 180;
    out += `<g transform="translate(${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}) rotate(${r1(deg)})">${chev(0, 0, hero ? 6 : 3.5, k === 4 ? 'k-pk k-w3' : 'k-ln k-w2')}</g>`;
  });
  if (S.centre) {
    const c = zh ? ['业务循环'] : (hero ? ['Business loop'] : ['Business', 'loop']);
    c.forEach((l, i) => { fits(`loop ${v} centre`, l, S.centre, 2 * r - (hero ? 40 : 14), 500); out += T(cx, cy + S.centre * 0.36 + (i - (c.length - 1) / 2) * S.centre * 1.2, l, S.centre, 'k-mut w5', 'middle'); });
  }
  // the stage list beside the ring (small boxes)
  if (S.list) {
    const y0 = cy - 2 * S.rowGap;
    names.forEach((s, k) => {
      const y = y0 + k * S.rowGap;
      let x = S.list;
      if (S.idx) { out += T(x, y + lab * 0.36, `0${k + 1}`, MIN, k ? 'k-mut w5 k-num' : 'k-acc w5 k-num'); x += textWidth('00', MIN) + 8; }
      else { out += C(x + 2.5, y, 2.5, k ? 'k-dot' : 'k-hot'); x += 10; }
      fits(`loop ${v} list`, s, lab, wx + ww - 8 - x, 500);
      out += T(x, y + lab * 0.36, s, lab, k ? 'k-txt w5' : 'k-acc w6');
    });
  }
  // the words
  const w2 = zh ? 'AI 企业操作系统' : 'AI operating system';
  if (v === 'card') {
    const s1 = zh ? 52 : 36, s2 = 16;
    const line = zh ? '网页桌面' : 'Browser desktop';
    fits('loop card', line, s1, W - 2 * m, 500);
    fits('loop card sub', w2, s2, W - 2 * m, 500);
    out += T(m - s1 * 0.04, H - m - s2 - 20, line, s1, 'k-txt w5') + T(m, H - m, w2, s2, 'k-acc w5');
  } else {
    const room = wx - m - (hero ? 30 : 12);
    const s1 = hero ? (zh ? 100 : 92) : (zh ? 30 : 29), s2 = hero ? 34 : MIN;
    const big = zh ? ['网页桌面'] : ['Browser', 'desktop'];
    const sub = textWidth(w2, s2) <= room ? [w2] : (zh ? ['AI 企业', '操作系统'] : ['AI operating', 'system']);
    big.forEach((l) => fits(`loop ${v} word`, l, s1, room, 500));
    sub.forEach((l) => fits(`loop ${v} sub`, l, s2, room, 500));
    let y = H - m;
    for (let i = sub.length - 1; i >= 0; i--) { out += T(m, y, sub[i], s2, 'k-acc w5'); y -= s2 * 1.3; }
    y -= hero ? 30 - s2 * 0.3 + 4 : 8;
    for (let i = big.length - 1; i >= 0; i--) { out += T(m - s1 * 0.04, y, big[i], s1, 'k-txt w5'); y -= s1 * 1.05; }
  }
  return out;
}

/* 6 · 288 AI roles: one dot per role, filled group by group, largest first
   (WORKFORCE_ROLE_GROUPS, the counts the article's bar chart prints); five
   of them, from different groups, joined as one team. */
const ROLES = {
  // p: dot pitch; dr: dot radius; at: the matrix's top-left; num: the numeral; base: its baseline; unit: size and lines; sub: the eyebrow's size and baseline
  hero: { p: 31, dr: 8.5, at: [415, 128], num: 300, base: 742, unit: { zh: 48, en: 40 }, sub: 28, subY: 484 },
  card: { p: 13, dr: 3.8, at: [30.5, 64], num: 96, base: 340, unit: { zh: 22, en: 20 }, sub: 15, subY: 246 },
  heroN: { p: 7.6, dr: 2.5, at: [162, 60], num: 80, base: 220, unit: { zh: 22, en: 18 }, sub: 15, subY: 112 },
  home: { p: 7.4, dr: 2.4, at: [167, 84], num: 84, base: 256, unit: { zh: 22, en: 19 }, sub: 16.3, subY: 142 },
};
function coverRoles(ctx) {
  const { W, m, v, lang, zh } = ctx;
  const S = ROLES[v];
  const groups = [...WORKFORCE_ROLE_GROUPS.groups].sort((a, b) => b.count - a.count);
  const total = groups.reduce((s, g) => s + g.count, 0);
  if (total !== 288) throw new Error(`blog-art: role groups add up to ${total}, not 288`);
  const cols = 24;
  const { p, dr } = S;
  const [xs, ys] = S.at;
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
  const hr = v === 'hero' ? 6 : dr * 0.8, hd = v === 'hero' ? 2.5 : dr * 0.55;
  pts.forEach(([x, y]) => { out += C(x, y, dr + hr, 'k-halo') + C(x, y, dr + hd, 'k-hot'); });
  // the eyebrow, then 「288 个专业岗位」 / "288 specialized roles" on one baseline
  const sub = zh ? ['十类职能 · 按任务组队'] : ['ten functions · teams by task'];
  const subRoom = (v === 'card' ? W - m : xs - 16) - m;
  // wrapped, the two halves take a line each and the ' · ' between them goes (it hung at the end of the first line)
  const subLines = textWidth(sub[0], S.sub) <= subRoom ? sub : (zh ? ['十类职能', '按任务组队'] : ['ten functions', 'teams by task']);
  subLines.forEach((l, i) => { fits(`roles ${v} sub`, l, S.sub, subRoom, 500); out += T(m, S.subY - (subLines.length - 1 - i) * S.sub * 1.3, l, S.sub, 'k-acc w5' + (v === 'home' ? ' k-sm' : '')); });
  const numW = textWidth('288', S.num, 600) * 0.96;
  out += T(m - S.num * 0.04, S.base, '288', S.num, 'k-txt w6 k-num');
  const x = m + numW + (v === 'hero' ? 18 : 8);
  const uS = S.unit[lang];
  const unit = zh ? ['个专业岗位'] : (textWidth('specialized roles', uS) <= W - m - x ? ['specialized roles'] : ['specialized', 'roles']);
  unit.forEach((l, i) => { fits(`roles ${v} unit`, l, uS, W - m - x, 500); out += T(x, S.base - S.num * 0.02 - (unit.length - 1 - i) * uS * 1.15, l, uS, 'k-txt w5'); });
  return out;
}

/* 7 · Knowledge and the relationship map: customer → opportunity → quote →
   order, the things linked to them, and the question the map answers. The
   hero draws the figure's six links round the chain; the smaller boxes stack
   the chain and keep only the quote's two links, the ones the question is
   about. */
const MAP = {
  core: { zh: ['客户', '商机', '报价', '订单'], en: ['Customer', 'Opportunity', 'Quote', 'Order'] },
  // [label, core index, above?] — the figure's six links (tools/blog.mjs CONTEXT.links)
  links: [
    [{ zh: '联系人', en: 'Contact' }, 0, true],
    [{ zh: '沟通历史', en: 'History' }, 0, false],
    [{ zh: '负责人', en: 'Owner' }, 1, true],
    [{ zh: '产品 / 价格', en: 'Product / pricing' }, 2, false],
    [{ zh: '审批 / 版本', en: 'Approval / version' }, 2, true],
    [{ zh: '任务 / 文件', en: 'Tasks / documents' }, 3, false],
  ],
  question: { zh: '价格该用哪一版？', en: 'Which approved price?' },
  questionLines: { zh: ['价格该用', '哪一版？'], en: ['Which approved', 'price?'] },
};
const MAP_STACK = {
  // pw/ph: pill size; lab: pill text; y0: first pill's centre; pitch; off: link dots' x from the pill; sl: link text; q: the question's size and lines
  card: { pw: { zh: 82, en: 112 }, ph: 28, lab: { zh: 16, en: 15 }, y0: 76, pitch: 40, off: 46, dy: 25, sl: 15, q: { zh: 46, en: 34 }, qLines: 2 },
  heroN: { pw: { zh: 70, en: 106 }, ph: 24, lab: { zh: 15.5, en: 15 }, y0: 68, pitch: 34, off: 42, dy: 21, sl: 15, q: { zh: 22, en: 22 }, qLines: 1 },
  home: { pw: { zh: 78, en: 114 }, ph: 26, lab: { zh: 16.5, en: 16.3 }, y0: 86, pitch: 33, off: 38, dy: 22, sl: 16.3, q: { zh: 26, en: 24 }, qLines: 1 },
};
function coverMap(ctx) {
  const { W, H, m, v, lang, zh } = ctx;
  const q = MAP.question[lang];
  let out = '';
  if (v === 'hero') {
    const y = 396, pw = zh ? 172 : 232, ph = 78, lab = zh ? 36 : 28, sl = zh ? 25 : 21, off = 172;
    const span = W - 2 * m - pw;
    const cx = [0, 1, 2, 3].map((i) => m + pw / 2 + i * span / 3);
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
      fits(`map ${v} link`, s, sl, span / 3 + pw / 2, 500);
      out += T(sx, above ? sy - 20 : sy + 20 + sl * 0.8, s, sl, lit ? 'k-acc w5' : 'k-soft w4', 'middle');
    });
    out += L(cx[0] + pw / 2, y, cx[3] - pw / 2, y, 'k-pk k-w3');
    for (let i = 1; i < 4; i++) out += chev(cx[i] - pw / 2 - 12, y, 7, 'k-pk k-w3');
    MAP.core[lang].forEach((s, i) => {
      fits(`map ${v} core`, s, lab, pw - 44, 500);
      out += R(cx[i] - pw / 2, y - ph / 2, pw, ph, ph / 2, i === 2 ? 'k-core k-core-on' : 'k-core');
      out += T(cx[i], y + lab * 0.36, s, lab, i === 2 ? 'k-ink w6' : 'k-txt w5', 'middle');
    });
    const qS = zh ? 64 : 56;
    fits(`map ${v} question`, q, qS, W - 2 * m, 500);
    out += T(m - 4, H - m, q, qS, 'k-txt w5');
    return out;
  }
  // the stacked chain
  const S = MAP_STACK[v];
  const pw = S.pw[lang], ph = S.ph, lab = S.lab[lang];
  const ys = [0, 1, 2, 3].map((i) => S.y0 + i * S.pitch);
  const px = m, cxp = px + pw / 2;
  // the quote's two links, the ones the question is about
  const qy = ys[2];
  [[MAP.links[4][0], -1], [MAP.links[3][0], 1]].forEach(([name, dir]) => {
    const sx = px + pw + S.off, sy = qy + dir * S.dy;
    out += P(`M${r1(px + pw)} ${r1(qy)}C${r1(px + pw + S.off * 0.55)} ${r1(qy)} ${r1(sx - S.off * 0.45)} ${r1(sy)} ${r1(sx)} ${r1(sy)}`, 'k-pk k-w2');
    out += C(sx, sy, 3.5, 'k-hot');
    fits(`map ${v} link`, name[lang], S.sl, W - m - (sx + 10), 500);
    out += T(sx + 10, sy + S.sl * 0.36, name[lang], S.sl, 'k-acc w5');
  });
  // the chain, top to bottom
  for (let i = 0; i < 3; i++) {
    const a = ys[i] + ph / 2, b = ys[i + 1] - ph / 2;
    out += L(cxp, a, cxp, b - 1.5, 'k-pk k-w2') + chevD(cxp, b - 2.5, 3, 'k-pk k-w2');
  }
  MAP.core[lang].forEach((s, i) => {
    fits(`map ${v} core`, s, lab, pw - 20, 500);
    out += R(px, ys[i] - ph / 2, pw, ph, ph / 2, i === 2 ? 'k-core k-core-on' : 'k-core');
    out += T(cxp, ys[i] + lab * 0.36, s, lab, i === 2 ? 'k-ink w6' : 'k-txt w5', 'middle');
  });
  const qS = S.q[lang];
  const lines = S.qLines === 2 ? MAP.questionLines[lang] : [q];
  lines.forEach((l, i) => { fits(`map ${v} question`, l, qS, W - 2 * m, 500); out += T(m - qS * 0.03, H - m - (lines.length - 1 - i) * qS * 1.12, l, qS, 'k-txt w5'); });
  return out;
}

const COVERS = {
  'stargo-work-visual-guide': { key: 'guide', draw: coverGuide, label: { zh: '示意图：这篇图文详解的九张图，从获客到经营排成一张索引。', en: 'Illustration: the nine figures of this guide, from acquisition to operations, laid out as an index.' } },
  'start-with-one-workflow': { key: 'start', draw: coverStart, label: { zh: '示意图：许多流程里先点亮一条，依次经过选流程、备资料、连账号、定审批、验效果五步。', en: 'Illustration: one workflow lit among many, through five steps: choose, prepare, connect, assign, validate.' } },
  'from-inquiry-to-quote': { key: 'quote', draw: coverQuote, label: { zh: '示意图：询盘、报价、批准、PI 依次推进，发送前另有一道关：批准不等于发送。', en: 'Illustration: inquiry, quote, approval and PI in sequence, with a separate gate before sending: approved is not sent.' } },
  'approval-gates-for-ai-in-trade': { key: 'trio', draw: coverTrio, label: { zh: '示意图：看得见、管得住、查得清。', en: 'Illustration: visible, controllable, traceable.' } },
  'ai-operating-system-for-global-trade': { key: 'loop', draw: coverLoop, label: { zh: '示意图：一个网页桌面窗口里，获客、成交、履约、协同、复购连成一个业务循环。', en: 'Illustration: one browser-desktop window holding the business loop of acquisition, sales, delivery, coordination and reorders.' } },
  '288-ai-employees-not-288-chatbots': { key: 'roles', draw: coverRoles, label: { zh: '示意图：288 个圆点代表 288 个专业岗位，按十类职能排列，其中五个连成一支团队。', en: 'Illustration: 288 dots for 288 specialized roles in ten functions, five of them joined as one team.' } },
  'enterprise-ontology-explained': { key: 'map', draw: coverMap, label: { zh: '示意图：客户、商机、报价、订单和它们关联的信息，回答“价格该用哪一版？”', en: 'Illustration: customer, opportunity, quote and order with the information linked to them, answering “which approved price?”' } },
};
export const BLOG_ART_SLUGS = Object.keys(COVERS);

/**
 * The cover of `post` for one slot ('hero' | 'card' | 'home').
 *   classes  the class list of the picture it replaces (kept: it sizes the box)
 *   attrs    the picture's own attributes to keep (data-w-id, style)
 *   no       the article's number in the series (oldest is 01)
 *   figures  the kinds of the figures the article prints, in order (the guide's contact sheet)
 * The hero is a labelled image; a card's cover is decorative (its link
 * carries the title).
 */
export function blogCover(post, lang, slot, { classes = '', attrs = '', no = 0, figures = [] } = {}) {
  const c = COVERS[post.slug];
  if (!c) throw new Error(`blog-art: no cover for ${post.slug}`);
  const variants = SLOT_VARIANTS[slot];
  if (!variants) throw new Error(`blog-art: slot ${slot}`);
  const zh = lang === 'zh';
  const svgs = variants.map((v) => {
    const V = VARIANTS[v];
    MIN = V.min; WHERE = `${c.key} ${v} ${lang}`;
    const art = c.draw({ ...V, v, lang, zh, figures });
    const cls = `sgcv-art${variants.length > 1 ? ` sgcv-art--${v === 'hero' ? 'w' : 'n'}` : ''}${zh ? ' sgcv-zh' : ''}`;
    return `<svg class="${cls}" viewBox="0 0 ${V.W} ${V.H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${art}</svg>`;
  }).join('');
  const a11y = slot === 'hero' ? `role="img" aria-label="${esc(c.label[lang])}"` : 'aria-hidden="true"';
  const section = post.section?.[lang] ?? '';
  return `<div class="${classes ? `${classes} ` : ''}sgcv sgcv--${slot} sgcv-${c.key}"${attrs ? ` ${attrs}` : ''} ${a11y}>`
    + svgs
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
