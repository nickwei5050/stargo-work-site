/**
 * Fetch the donor templates' own artwork into this site.
 *
 * Webflow exports never bundle images: every photograph, poster and clip a
 * template uses stays on cdn.prod.website-files.com. This site makes no
 * off-origin request at runtime, and the review asked for the templates to be
 * ported with their imagery intact — so the files are mirrored once, here, into
 * assets/<donor>/, and the pages reference the local copies.
 *
 * Input is tools/fragments/donor-assets.json, written by
 * tools/capability-donors.mjs: every CDN url a block still points at, and the
 * local path it was rewritten to. Files already on disk are skipped, so this is
 * safe to re-run. Nothing is fetched that a block does not reference.
 *
 *   node tools/mirror-donor-assets.mjs            fetch what is missing
 *   node tools/mirror-donor-assets.mjs --list     only print what would be fetched
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const SITE = 'F:/stargo 网站/stargo-site';
const list = process.argv.includes('--list');

const assets = JSON.parse(readFileSync(`${SITE}/tools/fragments/donor-assets.json`, 'utf8'));
const todo = Object.entries(assets).filter(([, local]) => !existsSync(`${SITE}/${local}`));

console.log(`${Object.keys(assets).length} donor assets referenced, ${todo.length} to fetch`);
if (list) { for (const [url, local] of todo) console.log(`  ${local}  <-  ${url}`); process.exit(0); }

let bytes = 0, ok = 0;
const failed = [];
for (const [url, local] of todo) {
  const dest = `${SITE}/${local}`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'stargo-site mirror (build-time asset fetch)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    bytes += buf.length; ok++;
    console.log(`  ${(buf.length / 1024).toFixed(0).padStart(6)} KB  ${local}`);
  } catch (e) {
    failed.push([url, String(e.message ?? e)]);
    console.error(`  FAILED  ${local}  ${e.message ?? e}`);
  }
}
console.log(`fetched ${ok} files, ${(bytes / 1024 / 1024).toFixed(1)} MB${failed.length ? `, ${failed.length} failed` : ''}`);
if (failed.length) process.exit(1);
