/**
 * Mechanical web encoding of the owner's graded photographs; never retouches.
 *
 * Batch 3 of the owner's site photographs (site-images/batch-3, 2026-10-21):
 * eight graded finals, 2048 px on the long side, sRGB, each with the slots it
 * replaces, its crop point and its bilingual alt text in the batch's
 * manifest.json. "Photograph" is the registry's name for them: they are
 * AI-generated images (made with an image model from a prompt brief, then
 * graded), not documentary photographs, and tools/editorial-images.mjs gives
 * every one the site's （AI 概念图） caption. They are finished pictures, so
 * this only resizes (lanczos3) and writes WebP at quality 82: no crop, no
 * sharpening, no colour or tone change, never wider than the supplied file.
 * What each picture shows and where it is cropped live in
 * tools/editorial-images.mjs and css/stargo-fusion.css; where it goes, in
 * tools/replaceables.mjs.
 *
 * File names carry the width (`<id>-<width>.webp`) and are never overwritten:
 * /assets is served immutable for a year, so a changed picture needs a new
 * name. This script enforces it. A file that is already there is left alone
 * when the new encode has the same bytes, so a rerun changes nothing; when the
 * bytes differ the script stops with an error, and so it does for an id
 * already in photo-assets.json whose original now has another SHA-256. Every
 * file and id is checked before anything is written, so a refused run leaves
 * the folder and the registry as they were. Each id is the manifest's own id
 * (W01, G02 …) plus a slug of the supplied file name.
 *
 * Widths follow the slot. The six homepage grid tiles are drawn up to ~2300 px
 * wide at 1440 while the grid zooms, so they keep the full 2048 above the
 * usual steps (W02's smaller steps also serve its ring card on the capability
 * page). The demo band background (G01) is a CSS background that needs at
 * least ~1550 CSS px at every width, so it ships at 2048 only. The side-menu
 * card (G02) is at most 220 px wide.
 *
 *   STARGO_TOOL_PACKAGE=<an install with sharp>/package.json \
 *     node tools/imagegen/prepare-photos.mjs <folder holding site-images/>
 *
 * Writes assets/stargo-photo/ and tools/imagegen/photo-assets.json. The PNG
 * originals stay in the owner's shared folder; the registry keeps each one's
 * path, SHA-256 and pixels so a file can be traced back to its source.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from '../paths.mjs';
/* STARGO_TOOL_PACKAGE borrows another install's sharp; see tools/paths.mjs. */
const sharp = req('sharp');

const SOURCE = process.argv[2] ?? process.env.STARGO_PHOTO_SOURCE;
if (!SOURCE) throw new Error('usage: node tools/imagegen/prepare-photos.mjs <folder holding site-images/>');
const TARGET = 'assets/stargo-photo';
const TILE = [480, 768, 1024, 1600, 2048];
const BATCH3 = 'site-images/batch-3';

const PHOTOS = [
  { id: 'g01-cta-loading-bay-dusk', ref: 'G01', file: `${BATCH3}/site-cta-loading-bay-dusk.png`, widths: [2048] },
  { id: 'g02-menu-harbour-night', ref: 'G02', file: `${BATCH3}/site-menu-harbour-night.png`, widths: [480, 768] },
  { id: 'w01-trade-office', ref: 'W01', file: `${BATCH3}/home-space-01-trade-office.png`, widths: TILE },
  { id: 'w02-workshop', ref: 'W02', file: `${BATCH3}/home-space-02-workshop.png`, widths: TILE },
  { id: 'w03-warehouse', ref: 'W03', file: `${BATCH3}/home-space-03-warehouse.png`, widths: TILE },
  { id: 'w04-qc-lab', ref: 'W04', file: `${BATCH3}/home-space-04-qc-lab.png`, widths: TILE },
  { id: 'w05-owner-office', ref: 'W05', file: `${BATCH3}/home-space-05-owner-office.png`, widths: TILE },
  { id: 'w06-showroom', ref: 'W06', file: `${BATCH3}/home-space-06-showroom.png`, widths: TILE },
];

const REGISTRY = `${SITE}/tools/imagegen/photo-assets.json`;
/* What is already published, by id: an id names one picture for good. */
const registered = new Map(existsSync(REGISTRY)
  ? JSON.parse(readFileSync(REGISTRY, 'utf8')).assets.map((a) => [a.id, a]) : []);
const NEW_ID = 'give the new picture a new id (and slots) instead: /assets is cached immutable for a year, so a published file name never changes its bytes';

mkdirSync(`${SITE}/${TARGET}`, { recursive: true });
const assets = [];
const hashes = new Set();
/* New files only, written once every picture has passed. */
const writes = [];
for (const job of PHOTOS) {
  const input = readFileSync(`${SOURCE}/${job.file}`);
  const sourceSha256 = createHash('sha256').update(input).digest('hex');
  const before = registered.get(job.id);
  if (before && before.sourceSha256 !== sourceSha256) {
    throw new Error(`${job.id}: ${job.file} is not the original this id was published from (SHA-256 ${sourceSha256}, registered ${before.sourceSha256}); ${NEW_ID}`);
  }
  if (hashes.has(sourceSha256)) throw new Error(`${job.id}: the same original as another photograph`);
  hashes.add(sourceSha256);
  const meta = await sharp(input).metadata();
  if (meta.space !== 'srgb') throw new Error(`${job.id}: expected an sRGB original, got ${meta.space}`);
  const files = [];
  for (const w of [...job.widths].sort((a, b) => a - b)) {
    if (w > meta.width) throw new Error(`${job.id}: ${w}px would upscale a ${meta.width}px original`);
    const buffer = await sharp(input)
      .resize({ width: w, kernel: 'lanczos3', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    const out = await sharp(buffer).metadata();
    const src = `${TARGET}/${job.id}-${w}.webp`;
    const path = `${SITE}/${src}`;
    if (!existsSync(path)) writes.push([path, buffer]);
    else if (!readFileSync(path).equals(buffer)) {
      throw new Error(`${src} already exists with different bytes; nothing was written. Either the original or the encoder changed: ${NEW_ID}`);
    }
    files.push({ src, width: out.width, height: out.height, bytes: buffer.length });
  }
  const main = files.pop();
  assets.push({
    id: job.id, ref: job.ref, ...main,
    sourceFile: job.file, sourceSha256, sourcePixels: [meta.width, meta.height],
    upscaled: false,
    variants: files.map(({ src, width, bytes }) => ({ src, width, bytes })),
  });
}
for (const [path, buffer] of writes) writeFileSync(path, buffer);
writeFileSync(REGISTRY, JSON.stringify({
  note: 'Owner-supplied graded photographs: AI-generated images (made with an image model from a prompt brief, then graded), not documentary photographs; their alt carries the site\'s AI concept caption (tools/editorial-images.mjs). Written by tools/imagegen/prepare-photos.mjs: WebP q82 (lanczos3) resizes of the supplied sRGB originals, never cropped, retouched or upscaled; every file name carries its width. Alt text lives in tools/editorial-images.mjs, crop points in css/stargo-fusion.css, slots in tools/replaceables.mjs.',
  authorization: 'Owner image thread, site-images/batch-3 (2026-10-21): graded finals for the homepage workspace grid, the demo band background and the side-menu card; resize and convert only.',
  assets,
}, null, 1) + '\n');
for (const a of assets) console.log(`${a.id}: ${[...a.variants, a].map((v) => `${v.width}w ${Math.round(v.bytes / 1024)}k`).join(', ')}`);
console.log(`${writes.length} new file(s) written; every other file was already there with the same bytes`);
