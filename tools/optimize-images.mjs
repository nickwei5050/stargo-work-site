/**
 * Write a WebP copy of every heavy JPEG/PNG the pages and stylesheets load.
 *
 *   STARGO_TOOL_PACKAGE=<a package.json whose install has sharp> node tools/optimize-images.mjs
 *
 * Run it after adding or replacing images and rebuilding, then rebuild again:
 * tools/image-refs.mjs swaps each reference for its copy through
 * tools/data/image-webp.json. Originals stay where they are (Open Graph cards,
 * icons and JSON-LD keep pointing at them).
 *
 * The copy has the original's exact pixel size, so nothing on a page moves.
 * Photographs (JPEG) are encoded at quality 82; PNGs are tried both lossless
 * and at quality 90 with untouched alpha, and the lossless one wins unless it
 * is clearly larger. A copy is only kept when it saves at least 15%.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { SITE, req } from './paths.mjs';

const sharp = req('sharp');
const MIN_BYTES = 20 * 1024;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const pages = [...readdirSync(SITE).filter((f) => f.endsWith('.html')).map((f) => `${SITE}/${f}`), ...['en', 'blog'].flatMap((d) => walk(`${SITE}/${d}`)).filter((f) => f.endsWith('.html'))];
const sheets = readdirSync(`${SITE}/css`).filter((f) => f.endsWith('.css')).map((f) => `${SITE}/css/${f}`);

const refs = new Set();
const add = (u) => {
  const clean = decodeURIComponent(u.trim().split(/\s+/)[0].split('?')[0].replace(/^(\.\.\/)+/, ''));
  if (/^assets\/.+\.(jpe?g|png)$/i.test(clean)) refs.add(clean);
};
for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/\s(?:src|data-src|poster|data-poster-url)="([^"]+)"/g)) add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach(add);
  for (const m of html.matchAll(/url\((?:&quot;|["'])?([^"')&]+)/g)) add(m[1]);
}
for (const f of sheets) for (const m of readFileSync(f, 'utf8').matchAll(/url\(["']?([^"')]+)/g)) add(m[1]);

const images = {};
let before = 0, after = 0;
for (const rel of [...refs].sort()) {
  const abs = `${SITE}/${rel}`;
  if (!existsSync(abs)) continue;
  const size = statSync(abs).size;
  if (size < MIN_BYTES) continue;
  const input = readFileSync(abs);
  let out;
  if (/\.jpe?g$/i.test(rel)) {
    out = await sharp(input).rotate().webp({ quality: 82, effort: 6, smartSubsample: true }).toBuffer();
  } else {
    const lossless = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
    const lossy = await sharp(input).webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true }).toBuffer();
    out = lossless.length <= lossy.length * 1.15 ? lossless : lossy;
  }
  if (out.length > size * 0.85) continue;
  const to = `${rel}.webp`;
  writeFileSync(`${SITE}/${to}`, out);
  images[rel] = to;
  before += size; after += out.length;
}
writeFileSync(`${SITE}/tools/data/image-webp.json`, JSON.stringify({ note: 'Written by tools/optimize-images.mjs: each heavy JPEG/PNG a page or stylesheet loads, and the same-size WebP it is served as.', images }, null, 2) + '\n');
console.log(`${Object.keys(images).length} of ${refs.size} images: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
