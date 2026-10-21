/**
 * Write a WOFF2 copy of every .ttf/.otf font a stylesheet in css/ loads.
 *
 *   node tools/optimize-fonts.mjs        # needs fonttools (pyftsubset) with brotli
 *
 * Run it after adding or replacing a font, then rebuild: tools/font-refs.mjs
 * points the stylesheets at the copies through tools/data/font-woff2.json.
 *
 * Each copy keeps every glyph the site can show in that face: the Latin,
 * Latin-1 and Latin Extended blocks, general punctuation, currency, arrows and
 * maths signs, plus every other character found in the built pages, the page
 * scripts and the copy sources, wherever the font itself has it. All OpenType
 * layout features and hinting are kept, so text shapes and renders exactly as
 * it did from the .ttf. Byte-identical source files (the template exports carry
 * InterDisplay twice) share one copy.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { SITE } from './paths.mjs';

const css = readdirSync(`${SITE}/css`).filter((f) => f.endsWith('.css')).map((f) => readFileSync(`${SITE}/css/${f}`, 'utf8')).join('\n');
const refs = new Set();
for (const m of css.matchAll(/url\(["']?(?:\.\.\/)?(assets\/[^"')]+?\.(?:ttf|otf))["']?\)/gi)) refs.add(decodeURI(m[1]));

/* Every character the site can put on screen. */
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const sources = [
  ...readdirSync(SITE).filter((f) => f.endsWith('.html')).map((f) => `${SITE}/${f}`),
  ...['en', 'blog'].flatMap((d) => walk(`${SITE}/${d}`)).filter((f) => f.endsWith('.html')),
  ...readdirSync(`${SITE}/js`).filter((f) => f.endsWith('.js')).map((f) => `${SITE}/js/${f}`),
  `${SITE}/tools/copy.mjs`, `${SITE}/tools/blog.mjs`,
];
const chars = new Set();
for (const f of sources) for (const ch of readFileSync(f, 'utf8')) chars.add(ch.codePointAt(0));
const BASE = [[0x20, 0x7e], [0xa0, 0x24f], [0x2b0, 0x2ff], [0x300, 0x36f], [0x1e00, 0x1eff], [0x2000, 0x206f], [0x2070, 0x209f], [0x20a0, 0x20cf], [0x2100, 0x214f], [0x2150, 0x218f], [0x2190, 0x21ff], [0x2200, 0x22ff], [0x2300, 0x23ff], [0x25a0, 0x25ff], [0x2600, 0x26ff], [0xfb00, 0xfb06], [0xfeff, 0xfeff], [0xfffd, 0xfffd]];
for (const [a, b] of BASE) for (let c = a; c <= b; c++) chars.add(c);
const unicodes = [...chars].filter((c) => c >= 0x20).sort((a, b) => a - b).map((c) => c.toString(16)).join(',');
const listFile = `${SITE}/tools/data/.font-unicodes.txt`;

const canonical = new Map(); // md5 -> woff2 path
const fonts = {};
for (const rel of [...refs].sort()) {
  const abs = `${SITE}/${rel}`;
  if (!existsSync(abs)) { console.warn(`missing ${rel}`); continue; }
  const md5 = createHash('md5').update(readFileSync(abs)).digest('hex');
  if (!canonical.has(md5)) {
    const out = rel.replace(/\.(ttf|otf)$/i, '.woff2');
    writeFileSync(listFile, unicodes);
    execFileSync('pyftsubset', [abs, `--unicodes-file=${listFile}`, '--layout-features=*', '--name-IDs=*', '--name-languages=*', '--notdef-outline', '--flavor=woff2', `--output-file=${SITE}/${out}`], { stdio: ['ignore', 'ignore', 'inherit'] });
    canonical.set(md5, out);
    console.log(`${rel}  ${Math.round(statSync(abs).size / 1024)} KB -> ${Math.round(statSync(`${SITE}/${out}`).size / 1024)} KB`);
  }
  fonts[rel] = canonical.get(md5);
}
try { execFileSync('rm', ['-f', listFile]); } catch {}
mkdirSync(`${SITE}/tools/data`, { recursive: true });
writeFileSync(`${SITE}/tools/data/font-woff2.json`, JSON.stringify({ note: 'Written by tools/optimize-fonts.mjs: each .ttf/.otf a stylesheet loads, and the subset WOFF2 it is served as.', fonts }, null, 2) + '\n');
console.log(`${Object.keys(fonts).length} font references, ${canonical.size} WOFF2 files`);
