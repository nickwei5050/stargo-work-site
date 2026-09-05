/**
 * Render the STARGO OS mocks (tools/visuals/*.html) to WebP under assets/stargo/.
 *
 *   node tools/visuals/render.mjs            # everything
 *   node tools/visuals/render.mjs os- silo   # only jobs whose name starts with one of the prefixes
 *
 * Each page is opened from disk in headless Chromium at its design viewport
 * with a device scale factor of 2, screenshotted, then resized/encoded with
 * sharp. Idempotent; outputs are overwritten.
 */
import { createRequire } from 'node:module';
import { mkdirSync, statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const require = createRequire('F:/stargo 网站/stargo-work-website/package.json');
const { chromium } = require('@playwright/test');
const sharp = require('sharp');

const SITE = 'F:/stargo 网站/stargo-site';
const SRC = `${SITE}/tools/visuals`;
const OUT = `${SITE}/assets/stargo`;
mkdirSync(OUT, { recursive: true });

/** name → [page, viewport w, viewport h, output width, format, quality] */
const JOBS = [
  ['os-boot', 'os-boot.html', 1600, 1000, 2400],
  ['os-loading', 'os-loading.html', 1600, 1000, 2400],
  ['os-login', 'os-login.html', 1600, 1000, 2400],
  ['os-desktop', 'os-desktop.html', 1600, 1000, 2400],
  ['os-cockpit', 'os-cockpit.html', 1600, 1000, 2400],
  ['os-sales-desk', 'os-sales-desk.html', 1600, 1000, 2400],
  ['os-inquiries', 'os-inquiries.html', 1600, 1000, 2400],
  ['os-agent-center', 'os-agent-center.html', 1600, 1000, 2400],
  ['os-quote-studio', 'os-quote-studio.html', 1600, 1000, 2400],
  ['os-trade-execution', 'os-trade-execution.html', 1600, 1000, 2400],
  ['mobile-approvals', 'mobile.html?v=approvals', 642, 1311, 1284],
  ['mobile-agents', 'mobile.html?v=agents', 642, 1311, 1284],
  ['mobile-inquiry', 'mobile.html?v=inquiry', 642, 1311, 1284],
  ['mobile-core', 'mobile.html?v=core', 642, 1311, 1284],
  ['silo-email', 'silo.html?v=email', 1500, 1000, 2400],
  ['silo-whatsapp', 'silo.html?v=whatsapp', 1500, 1000, 2400],
  ['silo-excel', 'silo.html?v=excel', 1500, 1000, 2400],
  ['silo-erp', 'silo.html?v=erp', 1500, 1000, 2400],
  ['brand-glow-wide', 'brand.html?v=wide', 1500, 1000, 2400],
  ['brand-glow-square', 'brand.html?v=square', 1200, 1200, 2400],
  ['brand-glow-tall', 'brand.html?v=tall', 1200, 1500, 2400],
  ['brand-ontology', 'brand.html?v=ontology', 1500, 1000, 2400],
  ['brand-loop', 'brand.html?v=loop', 1500, 1000, 2400],
  ['brand-family-01', 'brand.html?v=family&n=1', 1500, 1000, 2400],
  ['brand-family-02', 'brand.html?v=family&n=2', 1500, 1000, 2400],
  ['brand-family-03', 'brand.html?v=family&n=3', 1500, 1000, 2400],
  ['brand-family-04', 'brand.html?v=family&n=4', 1500, 1000, 2400],
  ['phone-approvals', 'phone.html?v=approvals', 1262, 1474, 1262],   // composited phone, needs mobile-approvals first
  ['phone-agents', 'phone.html?v=agents', 1262, 1474, 1262],
  ['og-cover', 'brand.html?v=og', 1200, 630, 1200, 'png'],
  ['avatar-core', 'avatar.html?v=core', 240, 240, 240, 'png'],
  ...Array.from({ length: 12 }, (_, i) => [`avatar-${String(i + 1).padStart(2, '0')}`, `avatar.html?v=${i + 1}`, 114, 114, 228, 'png']),
];

const only = process.argv.slice(2);
const jobs = JOBS.filter(([n]) => !only.length || only.some((p) => n.startsWith(p)));

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('  page error:', String(e).slice(0, 200)));
const rows = [];
for (const [name, file, w, h, outW, fmt = 'webp', q = 82] of jobs) {
  await page.setViewportSize({ width: w, height: h });
  const [f, query] = file.split('?');
  await page.goto(pathToFileURL(`${SRC}/${f}`).href + (query ? `?${query}` : ''), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: w, height: h }, omitBackground: fmt === 'png' && name.startsWith('avatar') });
  const out = `${OUT}/${name}.${fmt}`;
  let img = sharp(png).resize({ width: outW, withoutEnlargement: true });
  img = fmt === 'png' ? img.png({ compressionLevel: 9 }) : img.webp({ quality: q, effort: 5 });
  await img.toFile(out);
  const meta = await sharp(out).metadata();
  rows.push([`${name}.${fmt}`, `${meta.width}×${meta.height}`, `${Math.round(statSync(out).size / 1024)} KB`]);
}
await browser.close();
for (const r of rows) console.log(r[0].padEnd(24), r[1].padEnd(12), r[2]);
console.log(`rendered ${rows.length} file(s) → ${OUT}`);
