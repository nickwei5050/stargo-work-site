/**
 * Build one capability-page block on its own: `node tools/try-block.mjs <id>`.
 *
 * Extracts it from its donor, writes the fragment and this donor's stylesheet
 * and interaction payload, then renders it in both languages and reports what
 * came out — enough to see that the cut is right, the interactions came along,
 * and every text slot was actually filled.
 *
 * With no id it lists the blocks that exist.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { extractBlock } from './donor-lib.mjs';
import { loadBlocks, art, escapeHtml, capTitle, DONORS } from './block-lib.mjs';
import * as C from './copy.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const id = process.argv[2];

const blocks = await loadBlocks();
if (!id) {
  console.log([...blocks.keys()].join('\n'));
  process.exit(0);
}
const mod = blocks.get(id);
if (!mod) throw new Error(`no block ${id}; have: ${[...blocks.keys()].join(', ')}`);

const b = mod.donor;
const d = DONORS[b.donor];
if (!d) throw new Error(`${id}: unknown donor ${b.donor}`);

const out = extractBlock({
  srcDir: d.dir, page: b.page, css: b.css, ns: d.ns, scope: b.scope,
  start: b.start, end: b.end, wrap: b.wrap, images: b.images, imageStems: b.imageStems,
});

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });
writeFileSync(`${SITE}/tools/fragments/${id}.html`, out.html, 'utf8');
console.log('extract', JSON.stringify(out.stats));

for (const lang of ['zh', 'en']) {
  const t = (v) => (typeof v === 'string' ? v : v[lang]);
  const html = mod.render(out.html, { C, lang, t, escapeHtml, capTitle: capTitle(lang), art });

  /* Anything the donor still says is a slot that was never filled. */
  const leftovers = ['Lorem', 'Qubix', 'Cinery', 'Renok', 'Lumenis', 'Algarve', 'Our Values',
    'Read All', 'See details', 'All Services', 'Ou Solutions', 'This is some text']
    .filter((s) => html.includes(s));

  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(lang, JSON.stringify({
    bytes: html.length,
    dataWIds: (html.match(/data-w-id=/g) ?? []).length,
    remoteAssets: (html.match(/https?:\/\//g) ?? []).length,
    donorCopyLeft: leftovers,
  }));
  console.log('   ', text.slice(0, 260));
}
