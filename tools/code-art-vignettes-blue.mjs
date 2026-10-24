/**
 * 首页蓝 — the homepage's opening mosaic in the homepage palette (lane blueB, 2026-10-24).
 *
 * The owner (2026-10-24 13:28 UTC): 「首页你做的那些我希望色彩可以统一高级点的渐变蓝色就像首页的
 * 审批示意流程这个板块这样子」. The ten mosaic vignettes (tools/code-art-vignettes.mjs, ART) are drawn
 * in the product's warm palette, and the same helpers draw the capability page's ring cards, which
 * keep that look. So the homepage's sprite is drawn as before and then re-painted here, colour by
 * colour, from the homepage tokens (css/stargo-blue.css, read at build time): every colour in the
 * result is a token or a mix of two tokens, with the original's alpha.
 *
 *   - the ground is the host's calm aurora (css/stargo-vignettes.css): the drawings' flat ground is
 *     dropped, their soft glow turns violet and the port's dusk sky lets the aurora through;
 *   - warm darks and greys become an ink → deep → indigo → violet → lilac → ice ramp by lightness,
 *     cool greys (steel, sea, glass) an ink → deep → indigo → blue → cyan → ice ramp, so the
 *     materials stay told apart;
 *   - the orange accent becomes the ice-blue accent, dark oranges violet, lamp light ice, greens
 *     --sgb-ok, warm whites --sgb-text, black shadows ink;
 *   - a pill that waits for a person (待你确认 / Your call) becomes the reference card's white
 *     bubble with dark words;
 *   - small words are never fainter than --sgb-muted's .72.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SHEET = fileURLToPath(new URL('../css/stargo-blue.css', import.meta.url));

function tokens() {
  const css = readFileSync(SHEET, 'utf8');
  const tk = {};
  for (const m of css.matchAll(/--sgb-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)) tk[m[1]] = hex(m[2]);
  for (const k of ['ink', 'deep', 'indigo', 'plum', 'blue', 'cyan', 'violet', 'lilac', 'ice', 'text', 'accent', 'accent-2', 'ok', 'warn', 'bubble', 'bubble-text']) {
    if (!tk[k]) throw new Error(`vignettes-blue: css/stargo-blue.css has no --sgb-${k} as #rrggbb`);
  }
  return tk;
}
function hex(h) { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const fmt = (c, a = 1) => {
  const [r, g, b] = c.map((v) => Math.round(Math.max(0, Math.min(255, v))));
  if (a >= 0.999) return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  return `rgba(${r},${g},${b},${+a.toFixed(3)})`;
};
function parse(s) {
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (m) { const h = m[1].length === 3 ? m[1].replace(/./g, (x) => x + x) : m[1]; return { c: hex('#' + h), a: 1 }; }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(s);
  if (m) return { c: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}
function hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return { h: (h + 360) % 360, s, l };
}
function ramp(stops, l) {
  if (l <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) if (l <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], (l - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  return stops[stops.length - 1][1];
}

/** The homepage's mosaic sprite (vignetteSprite's output), re-painted in the homepage tokens. */
export function homeBlueSprite(svg) {
  const K = tokens();
  const warm = [[0.03, K.ink], [0.1, K.deep], [0.22, K.indigo], [0.42, mix(K.indigo, K.violet, 0.6)], [0.62, mix(K.violet, K.lilac, 0.6)], [0.88, K.ice]];
  const cool = [[0.03, K.ink], [0.1, K.deep], [0.2, K.indigo], [0.34, mix(K.indigo, K.blue, 0.55)], [0.55, mix(K.blue, K.cyan, 0.5)], [0.75, mix(K.cyan, K.ice, 0.5)], [0.9, K.ice]];
  const memo = new Map();
  const paint = (s, isText) => {
    const key = s + (isText ? '|t' : '');
    if (memo.has(key)) return memo.get(key);
    const p = parse(s);
    let out = s;
    if (p) {
      const { h, s: sat, l } = hsl(p.c);
      let c, a = p.a;
      if (p.c.every((v) => v >= 250)) c = K.bubble;                                     // white stays white
      else if (p.c.every((v) => v === 0)) c = K.ink;                                    // shadows
      else if (h >= 80 && h <= 170 && sat > 0.3 && l > 0.3) c = K.ok;                   // the greens: done, pass
      else if (h >= 12 && h <= 42 && sat > 0.55 && l >= 0.45 && l < 0.8) c = K.accent;   // the orange accent and its peach
      else if (h >= 12 && h <= 42 && sat > 0.55 && l < 0.45) c = mix(K.indigo, K.violet, Math.min(1, l / 0.38)); // dark oranges
      else if (l >= 0.8 && sat > 0.5 && h < 60) c = K.ice;                              // lamp light
      else if (l >= 0.85) c = K.text;                                                   // warm whites
      else if (h >= 185 && h <= 250 && sat > 0.08) c = ramp(cool, l);                   // steel, sea, glass
      else c = ramp(warm, l);                                                           // warm darks, browns, greys
      if (isText && a < 0.72) a = 0.72;                                                 // small words: never under --sgb-muted
      out = fmt(c, a);
    }
    memo.set(key, out);
    return out;
  };
  let s = svg;
  // the drawings' flat ground goes: the host's aurora is the ground (css/stargo-vignettes.css)
  s = s.split('<rect x="0" y="0" width="800" height="500" fill="#15110e"/>').join('');
  // the soft glow turns violet; the port's dusk sky lets the aurora through above the sea
  s = s.replace(/<radialGradient id="sgv-glow">.*?<\/radialGradient>/,
    `<radialGradient id="sgv-glow"><stop offset="0" stop-color="${fmt(K.violet)}" stop-opacity=".34"/><stop offset="1" stop-color="${fmt(K.violet)}" stop-opacity="0"/></radialGradient>`);
  s = s.replace(/<linearGradient id="sgv-dusk"[^>]*>.*?<\/linearGradient>/,
    `<linearGradient id="sgv-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fmt(K.ink)}" stop-opacity="0"/><stop offset=".5" stop-color="${fmt(K.deep)}" stop-opacity=".2"/><stop offset=".66" stop-color="${fmt(K.indigo)}" stop-opacity=".55"/><stop offset=".66" stop-color="${fmt(K.ink)}" stop-opacity=".9"/><stop offset="1" stop-color="${fmt(K.ink)}" stop-opacity=".94"/></linearGradient>`);
  // a pill that waits for a person: the white bubble
  s = s.replace(/<rect ([^>]*?)\/>(<text ([^>]*?)>([^<]*(?:待你确认|[Yy]our call)[^<]*)<\/text>)/g, (all, ra, _t, ta, words) => {
    if (!/\brx="/.test(ra)) return all;
    const r = ra.replace(/\s*fill="[^"]*"/, '').replace(/\s*stroke="[^"]*"/, '');
    const t = ta.replace(/\s*fill="[^"]*"/, '');
    return `<rect ${r} fill="BUBBLE"/><text ${t} fill="BUBBLE-TEXT">${words}</text>`;   // painted last
  });
  // every other colour, text fills kept at --sgb-muted's .72 or more
  s = s.replace(/<text\b[^>]*>/g, (tag) => tag.replace(/\b(fill)="([^"]+)"/g, (m, k, v) => `${k}="${paint(v, true)}"`));
  s = s.replace(/<(?!text\b)[a-zA-Z]+\b[^>]*>/g, (tag) => tag.replace(/\b(fill|stroke|stop-color)="([^"]+)"/g, (m, k, v) => `${k}="${paint(v, false)}"`));
  return s.split('fill="BUBBLE-TEXT"').join(`fill="${fmt(K['bubble-text'])}"`).split('fill="BUBBLE"').join(`fill="${fmt(K.bubble)}"`);
}
