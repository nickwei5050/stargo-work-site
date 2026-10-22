/**
 * The site's share card: the Open Graph / Twitter picture of every page that
 * has no picture of its own (the articles share their cover instead).
 *
 * Batch 8 of the owner's site photographs (site-images/batch-8, 2026-10-21)
 * supplies it as O01, og-share-cover.png: a graded final, 2048x1072 (1.91:1),
 * a container ship at blue hour, sRGB, with its bilingual alt text in the
 * batch's manifest.json. A share card is a fixed 1200x630 (1.905:1) and link
 * previews do not all read WebP (tools/image-refs.mjs keeps og:image off the
 * WebP copies for that reason), so this one picture is not written by
 * tools/imagegen/prepare-photos.mjs but here, as a JPEG:
 *
 *   - resized with lanczos3 to 630 px tall, which makes it 1204 px wide
 *     (2048 x 630 / 1072 = 1203.6), never upscaled;
 *   - then cut to 1200 x 630 at its centre (50% 50%, the manifest's crop point
 *     for the share card): 2 px off each side, nothing off the top or bottom;
 *   - written as a baseline JPEG at quality 85, sRGB as supplied, with no
 *     sharpening, no colour or tone change and no metadata.
 *
 * The file name carries the size and is never overwritten: /assets is served
 * immutable for a year, so a changed picture needs a new name. A file already
 * on disk must come out byte for byte the same, or the run stops.
 * tools/replaceables.mjs (OG) points the pages at it, tools/chrome.mjs writes
 * the meta tags, and tools/editorial-images.mjs holds its alt text, which
 * og:image:alt carries.
 *
 *   STARGO_TOOL_PACKAGE=<an install with sharp>/package.json \
 *     node tools/imagegen/prepare-share-card.mjs <folder holding site-images/>
 *
 * Writes the JPEG and tools/imagegen/share-card.json (the original's path,
 * SHA-256 and pixels, the recipe, and the bytes it produced).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from '../paths.mjs';
import { OG } from '../replaceables.mjs';
/* STARGO_TOOL_PACKAGE borrows another install's sharp; see tools/paths.mjs. */
const sharp = req('sharp');

const SOURCE = process.argv[2] ?? process.env.STARGO_PHOTO_SOURCE;
if (!SOURCE) throw new Error('usage: node tools/imagegen/prepare-share-card.mjs <folder holding site-images/>');
const CARD = { id: 'o01-share-cover', ref: 'O01', file: 'site-images/batch-8/og-share-cover.png' };
const QUALITY = 85;

const input = readFileSync(`${SOURCE}/${CARD.file}`);
const sourceSha256 = createHash('sha256').update(input).digest('hex');
const meta = await sharp(input).metadata();
if (meta.space !== 'srgb') throw new Error(`${CARD.id}: expected an sRGB original, got ${meta.space}`);
const { width: W, height: H } = OG;
/* Resize until both sides cover the card (the side that binds sets the
   scale; the other follows the picture's own ratio), then take the centre. */
const byHeight = H / meta.height >= W / meta.width;
if (Math.max(W / meta.width, H / meta.height) > 1) throw new Error(`${CARD.id}: a ${meta.width}x${meta.height} original would be upscaled to cover ${W}x${H}`);
const { data, info } = await sharp(input)
  .resize(byHeight ? { height: H, kernel: 'lanczos3' } : { width: W, kernel: 'lanczos3' })
  .raw()
  .toBuffer({ resolveWithObject: true });
const resized = [info.width, info.height];
const crop = { left: Math.floor((info.width - W) / 2), top: Math.floor((info.height - H) / 2), width: W, height: H };
const buffer = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .extract(crop)
  .jpeg({ quality: QUALITY })
  .toBuffer();
const out = await sharp(buffer).metadata();
if (out.width !== W || out.height !== H || out.format !== 'jpeg') throw new Error(`${CARD.id}: wrote ${out.width}x${out.height} ${out.format}`);
if (!OG.file.startsWith('assets/') || !OG.file.endsWith(`-${W}x${H}.jpg`)) throw new Error(`replaceables OG.file is not this card: ${OG.file}`);
/* Served immutable: a file that is already there may only be rewritten with
   the very same bytes. */
if (existsSync(`${SITE}/${OG.file}`)) {
  if (!readFileSync(`${SITE}/${OG.file}`).equals(buffer)) throw new Error(`${OG.file} exists with other bytes; a changed card needs a new name`);
} else writeFileSync(`${SITE}/${OG.file}`, buffer);
writeFileSync(`${SITE}/tools/imagegen/share-card.json`, JSON.stringify({
  note: 'The share card (og:image / twitter:image of every page without a picture of its own). Written by tools/imagegen/prepare-share-card.mjs: the supplied sRGB original resized with lanczos3 until it covers 1200x630, cut to 1200x630 at its centre, baseline JPEG; never upscaled, sharpened or recoloured.',
  authorization: 'Owner image thread, site-images/batch-8 O01 (2026-10-21): the social share cover.',
  id: CARD.id, ref: CARD.ref,
  src: OG.file, width: W, height: H, bytes: buffer.length,
  sha256: createHash('sha256').update(buffer).digest('hex'),
  sourceFile: CARD.file, sourceSha256, sourcePixels: [meta.width, meta.height],
  recipe: { resize: resized, kernel: 'lanczos3', crop, position: '50% 50%', format: 'jpeg', quality: QUALITY },
  upscaled: false,
}, null, 1) + '\n');
console.log(`${CARD.id}: ${meta.width}x${meta.height} -> ${resized.join('x')} -> ${W}x${H} at ${crop.left},${crop.top}, ${Math.round(buffer.length / 1024)}k`);
