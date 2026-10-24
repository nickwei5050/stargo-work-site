/**
 * 真实截图 — the system's own screens where the site had drawn the system in code.
 *
 * The owner, 2026-10-24 17:27 UTC: 「你现在也全是代码了，我系统的画面都没有了！我需要
 * 真实系统截图放在特定的地方」. The crops are cut by tools/real-screens.py from the
 * owner's captures (site-screens/raw and site-screens/mobile, 2026-10-21, already
 * masked by the owner: demo customers, example.com mail, amounts × 0.87), one
 * spec file per group of slots in tools/real-screens/. This module reads them:
 *
 *   REAL_ASSETS  registry rows in the shape of tools/imagegen/product-assets.json,
 *                which tools/editorial-images.mjs and tools/verify-editorial.mjs
 *                add to the product images;
 *   REAL_TEXT    each crop's [zh, en] sentence (the build adds 真实界面截图（演示数据）);
 *   realShot()   the markup of one slot: the picture (a second crop for upright
 *                screens when the slot changes shape there) and the small tag
 *                that says what it is, 真实界面 · 演示数据 / Real screen · demo data;
 *   REAL_CSS     the sheet the slot needs (css/stargo-real.css), and withRealCss(),
 *                which links it once before </head>.
 *
 * The <img> is written bare (src, class, loading). The page's editorial pass
 * (tools/editorial-images.mjs) gives it alt, width, height and srcset like every
 * product image, and takes its sizes from data-sizes. The <source> for upright
 * screens is written here, since that pass reads only <img>.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { escapeHtml } from './lib-html.mjs';

const DIR = new URL('./real-screens/', import.meta.url);
const P = 'assets/stargo-product/';

const specs = (existsSync(DIR) ? readdirSync(DIR) : []).filter((f) => f.endsWith('.json')).sort()
  .map((f) => ({ file: f, ...JSON.parse(readFileSync(new URL(f, DIR), 'utf8')) }));

/* read before the loop below: a crop cut from a published crop ("asset:<id>") names that crop's capture */
const REGISTRY = JSON.parse(readFileSync(new URL('./imagegen/product-assets.json', import.meta.url), 'utf8')).assets;
export const REAL_ASSETS = [];
export const REAL_TEXT = {};
for (const spec of specs) {
  for (const s of spec.shots) {
    if (!s.out) throw new Error(`real-screens/${spec.file}: ${s.id} is not cut yet (python3 tools/real-screens.py)`);
    if (REAL_TEXT[s.id]) throw new Error(`real-screens: ${s.id} is listed twice`);
    if (!Array.isArray(s.alt) || s.alt.length !== 2 || /演示数据|demo data/i.test(s.alt.join(' '))) throw new Error(`real-screens/${spec.file}: ${s.id} needs [zh, en] alt text without the demo-data note (the build adds it)`);
    const parent = s.src.startsWith('asset:') ? s.src.slice(6) : null;
    REAL_ASSETS.push({
      id: s.id,
      src: `${P}${s.id}.webp`,
      width: s.out.width,
      height: s.out.height,
      bytes: s.out.bytes,
      // the capture it was cut from, in the owner's folder names; a cut of a published crop names that crop's capture
      sourceFile: parent ? parentSource(parent) : `site-screens/${s.src}`,
      sourceSha256: s.out.sha256,
      sourcePixels: s.out.sourcePixels,
      crop: `x${s.crop[0]} y${s.crop[1]} w${s.crop[2]} h${s.crop[3]} of ${s.src}${s.what ? ` (${s.what})` : ''}`,
      upscaled: false,
      variants: s.out.variants.map(({ src, width, bytes }) => ({ src, width, bytes })),
    });
    REAL_TEXT[s.id] = s.alt;
  }
}

function parentSource(id) {
  const a = REGISTRY.find((x) => x.id === id);
  if (!a) throw new Error(`real-screens: asset:${id} is not a registered product image`);
  return a.sourceFile;
}

/* A slot may also show a capture already published before this pass (live05-growth-home-16x9 and the
   other live and m rows of tools/imagegen/product-assets.json): the same clean captures. */
const byId = new Map([...REGISTRY.filter((a) => /^(?:live|m)\d{2}-/.test(a.id)), ...REAL_ASSETS].map((a) => [a.id, a]));
export const realAsset = (id) => {
  const a = byId.get(id);
  if (!a) throw new Error(`real-screens: no crop ${id}`);
  return a;
};
const srcset = (a) => [...a.variants, a].map((v) => `${v.src} ${v.width}w`).join(', ');

/* The tag's two parts: a slot too narrow for both keeps the second (css/stargo-real.css). */
export const REAL_TAG = { zh: ['真实界面 · ', '演示数据'], en: ['Real screen · ', 'demo data'] };

/**
 * One slot. `id` is the crop for landscape screens; `opts`:
 *   upright   a second crop for screens taller than wide (<source media="(orientation: portrait)">)
 *   sizes     the slot's sizes attribute (required: the slot knows its own width)
 *   cls       classes added to the wrapper
 *   pos       object-position of the landscape crop (default 50% 0%: a screen reads from its top)
 *   uprightPos  object-position of the upright crop
 *   tag       false leaves the tag out (a slot whose page already says so beside it)
 *   loading   'lazy' (default) or 'eager'
 */
export function realShot(id, lang, opts = {}) {
  const a = realAsset(id);
  if (!opts.sizes) throw new Error(`realShot ${id}: sizes`);
  const style = [opts.pos && `--sg-real-pos:${opts.pos}`, opts.uprightPos && `--sg-real-pos-up:${opts.uprightPos}`].filter(Boolean).join(';');
  let source = '';
  if (opts.upright) {
    const u = realAsset(opts.upright);
    source = `<source media="(orientation: portrait)" srcset="${srcset(u)}" sizes="${escapeHtml(opts.uprightSizes || opts.sizes)}" width="${u.width}" height="${u.height}"/>`;
  }
  const img = `<img src="${a.src}" loading="${opts.loading || 'lazy'}" data-sizes="${escapeHtml(opts.sizes)}" class="sg-real-img"/>`;
  const tag = opts.tag === false ? '' : `<span class="sg-real-tag" aria-hidden="true"><b>${REAL_TAG[lang][0]}</b><i>${REAL_TAG[lang][1]}</i></span>`;
  return `<div class="sg-real${opts.cls ? ` ${opts.cls}` : ''}"${style ? ` style="${style}"` : ''} data-real="${id}"><picture>${source}${img}</picture>${tag}</div>`;
}

export const REAL_CSS = '<link href="css/stargo-real.css" rel="stylesheet" type="text/css"/>';
/** Link css/stargo-real.css once, before </head>. */
export function withRealCss(h) {
  if (h.includes('css/stargo-real.css')) return h;
  if (h.split('</head>').length !== 2) throw new Error('real-screens: cannot place the sheet');
  return h.replace('</head>', `${REAL_CSS}\n</head>`);
}
