/**
 * Pull whole modules out of the Scalora export as insertable fragments.
 *
 * Extraction is by balanced-tag walk, not regex: these sections nest 8 levels
 * of divs and a regex would either stop at the first </section> inside them or
 * run to the end of the file.
 *
 * Each fragment is rewritten in three ways, all of which must match what
 * fuse-css.mjs did to the stylesheet:
 *   - class tokens are compared for EXACT equality after splitting on
 *     whitespace, never by substring: `footer` must not touch `footer-link`,
 *     and `container` must not touch `container-large`;
 *   - CDN urls are pointed at the local mirror;
 *   - the fragment is wrapped in .sc-scope, which is where Scalora's whole
 *     token system now lives.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { NS, COLLIDE } from './fuse-css.mjs';

const SRC_DIR = process.argv[2]
  ?? 'C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/scalora';
const OUT_DIR = 'F:/stargo 网站/stargo-site/tools/fragments';

const CDN_RE = /https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>\\,)]+/g;

function localiseUrl(url) {
  const u = new URL(url);
  const raw = decodeURIComponent(u.pathname.replace(/%2F/gi, '/'));
  const parts = raw.split('/').filter(Boolean);
  const file = parts.pop();
  const site = parts.pop() ?? 'misc';
  return `assets/${site}/${encodeURIComponent(file)}`;
}

/** Extract the element starting at `openIdx`, walking nested same-name tags. */
function extractElement(html, openIdx, tagName) {
  const openRe = new RegExp(`<${tagName}\\b`, 'g');
  const closeRe = new RegExp(`</${tagName}\\s*>`, 'g');
  let depth = 0;
  let i = openIdx;
  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) throw new Error(`unbalanced <${tagName}> from ${openIdx}`);
    if (o && o.index < c.index) { depth++; i = o.index + 1; continue; }
    depth--;
    if (depth === 0) return html.slice(openIdx, c.index + c[0].length);
    i = c.index + 1;
  }
  throw new Error(`unbalanced <${tagName}> from ${openIdx}`);
}

/** Find `<tag ... class="... cls ...">` and return the whole element. */
function findByClass(html, tag, cls) {
  const re = new RegExp(`<${tag}\\b[^>]*class="([^"]*)"`, 'g');
  let m;
  while ((m = re.exec(html))) {
    if (m[1].split(/\s+/).includes(cls)) return extractElement(html, m.index, tag);
  }
  throw new Error(`no <${tag} class="... ${cls} ...">`);
}

/** Rename only exact class tokens; leave every other attribute untouched. */
function renameClassTokens(fragment) {
  const set = new Set(COLLIDE);
  let renamed = 0;
  const out = fragment.replace(/class="([^"]*)"/g, (_all, value) => {
    const next = value.split(/(\s+)/).map((tok) => {
      if (set.has(tok)) { renamed++; return NS + tok; }
      return tok;
    }).join('');
    return `class="${next}"`;
  });
  return { html: out, renamed };
}

function localiseFragment(fragment) {
  let n = 0;
  const out = fragment.replace(CDN_RE, (raw) => {
    let url = raw;
    while (url.endsWith(')') && (url.split('(').length < url.split(')').length)) url = url.slice(0, -1);
    n++;
    return localiseUrl(url) + raw.slice(url.length);
  });
  return { html: out, localised: n };
}

const MODULES = [
  { id: 'products', file: 'index.html', tag: 'section', cls: 'products' },
  { id: 'integration', file: 'index.html', tag: 'section', cls: 'integration' },
  { id: 'hero', file: 'index.html', tag: 'section', cls: 'hero' },
];

mkdirSync(OUT_DIR, { recursive: true });
const report = [];

for (const mod of MODULES) {
  const html = readFileSync(`${SRC_DIR}/${mod.file}`, 'utf8');
  let frag = findByClass(html, mod.tag, mod.cls);
  const r1 = renameClassTokens(frag); frag = r1.html;
  const r2 = localiseFragment(frag); frag = r2.html;

  writeFileSync(`${OUT_DIR}/${mod.id}.html`, frag, 'utf8');

  const wIds = (frag.match(/data-w-id="[^"]*"/g) ?? []).length;
  report.push({
    id: mod.id,
    bytes: frag.length,
    classTokensRenamed: r1.renamed,
    cdnUrlsLocalised: r2.localised,
    dataWIds: wIds,
    images: (frag.match(/<img\b/g) ?? []).length,
    remainingCdn: (frag.match(CDN_RE) ?? []).length,
  });
}

console.log(JSON.stringify(report, null, 2));
