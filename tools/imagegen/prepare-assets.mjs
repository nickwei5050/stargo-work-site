/** Mechanical web encoding of the 43 built-in generations; never draws artwork. */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { catalog } from './catalog.mjs';
const require = createRequire(process.env.STARGO_TOOL_PACKAGE || 'F:/stargo 网站/stargo-work-website/package.json');
const sharp = require('sharp');
const root = fileURLToPath(new URL('../../', import.meta.url));
const target = 'assets/stargo-editorial';
mkdirSync(`${root}${target}`, { recursive: true });
mkdirSync(`${root}.wrangler/art-review`, { recursive: true });
const manifest = [];
const hashes = new Set();
for (const job of catalog) {
  const input = readFileSync(`${root}output/imagegen/originals/${job.id}.png`);
  const sha256 = createHash('sha256').update(input).digest('hex');
  if (hashes.has(sha256)) throw new Error(`Duplicate generation: ${job.id}`);
  hashes.add(sha256);
  const avatar = job.id.startsWith('avatar-');
  const og = job.id === 'og-cover';
  const ext = avatar || og ? 'png' : 'webp';
  const src = `${target}/${job.id}.${ext}`;
  let pipeline = sharp(input);
  if (og) pipeline = pipeline.resize(1200, 630, { fit: 'cover', position: 'centre' });
  else pipeline = pipeline.resize({ width: avatar ? 256 : 1600, withoutEnlargement: true });
  const buffer = await (ext === 'png' ? pipeline.png({ compressionLevel: 9 }) : pipeline.webp({ quality: 82, effort: 6 })).toBuffer();
  writeFileSync(`${root}${src}`, buffer);
  const { width, height } = await sharp(buffer).metadata();
  const variants = [];
  if (!avatar && !og) for (const w of [400, 800, 1200].filter(w => w < width)) {
    const path = `${target}/${job.id}-${w}.webp`;
    const resized = await sharp(input).resize({ width: w }).webp({ quality: 80, effort: 6 }).toBuffer();
    writeFileSync(`${root}${path}`, resized);
    variants.push({ src: path, width: w, bytes: resized.length });
  }
  manifest.push({ id: job.id, src, width, height, bytes: buffer.length, originalSha256: sha256, variants });
}
writeFileSync(`${root}tools/imagegen/assets-manifest.json`, JSON.stringify({ engine: 'built-in-image-gen', count: manifest.length, assets: manifest }, null, 2) + '\n');
// Inspection-only sheets, ordered exactly as the catalog. Raw originals remain untouched.
for (let start = 0; start < catalog.length; start += 12) {
  const group = catalog.slice(start, start + 12);
  const overlays = await Promise.all(group.map(async (j, i) => ({
    input: await sharp(`${root}output/imagegen/originals/${j.id}.png`).resize(350, 245, { fit: 'contain', background: '#777777' }).png().toBuffer(),
    left: (i % 4) * 360 + 5, top: Math.floor(i / 4) * 255 + 5,
  })));
  const sheet = `${root}.wrangler/art-review/sheet-${start / 12 + 1}.jpg`;
  await sharp({ create: { width: 1440, height: Math.ceil(group.length / 4) * 255, channels: 3, background: '#222222' } }).composite(overlays).jpeg({ quality: 90 }).toFile(sheet);
  console.log(`SHEET ${sheet}: ${group.map(j => j.id).join(', ')}`);
}
console.log(JSON.stringify({ generated: manifest.length, unique: hashes.size, originalsMB: +(catalog.reduce((sum, j) => sum + readFileSync(`${root}output/imagegen/originals/${j.id}.png`).length, 0) / 1e6).toFixed(2), mainMB: +(manifest.reduce((sum, a) => sum + a.bytes, 0) / 1e6).toFixed(2), variantsMB: +(manifest.flatMap(a => a.variants).reduce((sum, a) => sum + a.bytes, 0) / 1e6).toFixed(2) }));
