/**
 * Prepare the third template (lifelogx, a Webflow export) for use inside the
 * Mono shell, the same way the Scalora modules were prepared:
 *
 *   1. mirror every remote asset it references (images, the 42 Dotsans font)
 *      into assets/ — this site must make no request that leaves its origin;
 *   2. namespace its author-layer CSS with an `lx-` prefix and scope its
 *      body/:root/bare-element rules to `.lx-scope`, so it cannot restyle
 *      Mono (they collide on `button`, `section`, `navbar`, …);
 *   3. cut the homepage body (hero → closing CTA) into a fragment with the
 *      same renamed classes, minus the invented "trusted by 600,000" logo
 *      wall, and wrap it in `.lx-scope`;
 *   4. export its interaction data (IX2 events/action lists, IX3 GSAP
 *      timelines) with ids and selectors renamed, for tools/fuse-ix.mjs to
 *      merge into the one bundle every page loads.
 *
 * Idempotent. Inputs: the unpacked template. Outputs: css/lifelogx.lx.css,
 * tools/fragments/lx-home.html, tools/fragments/lx-ix.json, assets/…
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

const SRC = process.env.LIFELOGX_SRC ?? 'C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/lifelogx';
const SITE = 'F:/stargo 网站/stargo-site';
const NS = 'lx-';
const SCOPE = 'lx-scope';
const CDN = 'https://cdn.prod.website-files.com/';
const LX_PAGE = '6929b6c693cb856e01ef7bfc';
const MONO_PAGE = '699b6466d5f19893993a4bf1';

const html = readFileSync(`${SRC}/index.html`, 'utf8');
const cssAll = readFileSync(`${SRC}/css/az-lifelogx.app.shared.0ad6c3188.css`, 'utf8');
const bundleFile = html.match(/js\/(app\.[0-9a-f]{8}\.[0-9a-f]+\.js)/)[1];
const bundle = readBundle(readFileSync(`${SRC}/js/${bundleFile}`, 'utf8'));

/* ------------------------------------------------------------ 1. assets -- */

/** A CDN path as it appears in markup or CSS. File names may contain "(10)",
    so a closing bracket ends the match only when it closes a CSS url(). */
const URL_RE = /https:\/\/cdn\.prod\.website-files\.com\/([^"'\s]+)/g;
const trimUrl = (rel) => {
  let r = rel;
  while (r.endsWith(')') && (r.split('(').length < r.split(')').length)) r = r.slice(0, -1);
  return r;
};
const urls = new Set();
for (const m of (html + cssAll).matchAll(URL_RE)) urls.add(trimUrl(m[1]));
const localPath = (rel) => `assets/${decodeURIComponent(rel)}`;
let downloaded = 0;
let present = 0;
for (const rel of urls) {
  const target = `${SITE}/${localPath(rel)}`;
  if (existsSync(target)) { present++; continue; }
  mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  const res = await fetch(CDN + rel);
  if (!res.ok) throw new Error(`asset ${rel}: HTTP ${res.status}`);
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  downloaded++;
}
/** Rewrite one CDN URL to its local mirror. Keeps %20-style encoding in the URL. */
// The URL keeps the template's own encoding (a doubly-encoded srcset entry
// such as "iPhone%252014%2520Pro-p-500.png" stays that way): the server decodes
// it once, which is exactly the file name the mirror wrote.
const localise = (s) => s.replace(URL_RE, (_, rel) => `assets/${rel}`);

/* --------------------------------------------------------- 2. CSS scope -- */

const authorStart = cssAll.search(/@font-face\s*\{\s*font-family:\s*"42 Dotsans"/);
if (authorStart === -1) throw new Error('lifelogx css: author layer start not found');
const author = cssAll.slice(authorStart);

const classSet = new Set();
for (const m of author.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classSet.add(m[1]);
const rename = (c) => (c.startsWith('w-') ? c : NS + c);

/**
 * Rewrite selectors only. Walks the stylesheet; text before a `{` that is not
 * an @-rule prelude is a selector list. Declaration blocks are never touched
 * (a `.5fr` inside a grid-template is not a class).
 */
function namespaceCss(css) {
  let out = '';
  let i = 0;
  let selStart = 0;
  const stack = [];
  while (i < css.length) {
    const c = css[i];
    if (c === '{') {
      const prelude = css.slice(selStart, i);
      const isAt = /^\s*@/.test(prelude);
      out += isAt ? prelude : rewriteSelectorList(prelude);
      out += '{';
      stack.push(isAt ? 'at' : 'rule');
      i++;
      if (!isAt) {
        // copy the declaration block verbatim (no nesting inside plain rules)
        const close = css.indexOf('}', i);
        out += css.slice(i, close + 1);
        stack.pop();
        i = close + 1;
      }
      selStart = i;
      continue;
    }
    if (c === '}') { out += css.slice(selStart, i) + '}'; stack.pop(); i++; selStart = i; continue; }
    i++;
  }
  return out + css.slice(selStart);
}

const BARE = /^(a|blockquote|body|button|fieldset|figcaption|figure|h[1-6]|img|label|li|ol|p|ul)$/;
function rewriteSelectorList(list) {
  return list.split(',').map((sel) => {
    let s = sel.trim();
    if (!s) return sel;
    if (/^html\b/.test(s)) return ' ' + s;                   // html.w-mod-… globals: keep
    // Rename classes first; the scope class is added afterwards so it is not
    // itself prefixed (".lx-lx-scope" would match nothing and every token and
    // body colour would silently fall back to Mono's black).
    s = s.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (_, cls) => '.' + rename(cls));
    if (/^(body|:root)\b/.test(s)) s = s.replace(/^(body|:root)\b/, `.${SCOPE}`);
    // bare element selectors (p, h1, a …) become descendants of the scope
    const first = s.match(/^([a-z][a-z0-9]*)\b/);
    if (first && BARE.test(first[1]) && !s.startsWith(`.${SCOPE}`)) s = `.${SCOPE} ${s}`;
    return ' ' + s;
  }).join(',');
}

// Stylesheet lives in css/, so its asset URLs are one level up.
let css = namespaceCss(localise(author)).split('url("assets/').join('url("../assets/').split("url('assets/").join("url('../assets/").split('url(assets/').join('url(../assets/');
css = `/* lifelogx author layer, namespaced "${NS}" and scoped to .${SCOPE} by tools/lifelogx-prepare.mjs. Do not edit by hand. */\n` + css;
mkdirSync(`${SITE}/css`, { recursive: true });
writeFileSync(`${SITE}/css/lifelogx.lx.css`, css, 'utf8');

/* ------------------------------------------------------ 3. HTML fragment -- */

function region(name) {
  const m = html.match(new RegExp(`<div[^>]*class="[^"]*\\b${name}\\b[^"]*"`));
  if (!m) throw new Error(`lifelogx: ${name} not found`);
  return m.index;
}
const start = region('integrations_wrapper');
const end = region('footer_wrapper');
let frag = html.slice(start, end);

// The "Loved & trusted by +600,000 businesses" wall of invented logos.
const logosStart = frag.search(/<div[^>]*class="[^"]*\blogos_wrapper\b/);
const logosEnd = frag.search(/<div[^>]*class="[^"]*\bgradient-section\b/);
if (logosStart === -1 || logosEnd === -1 || logosEnd < logosStart) throw new Error('lifelogx: logo wall boundaries');
frag = frag.slice(0, logosStart) + frag.slice(logosEnd);

frag = frag.replace(/class="([^"]*)"/g, (_, v) => `class="${v.split(/\s+/).filter(Boolean).map(rename).join(' ')}"`);
frag = localise(frag);
frag = frag.split(LX_PAGE).join(MONO_PAGE);
frag = `<div class="${SCOPE}">\n${frag}\n</div>`;
mkdirSync(`${SITE}/tools/fragments`, { recursive: true });
writeFileSync(`${SITE}/tools/fragments/lx-home.html`, frag, 'utf8');

/* --------------------------------------------------- 4. interaction data -- */

const idMap = new Map();
for (const k of [...Object.keys(bundle.ix2Payload.events), ...Object.keys(bundle.ix2Payload.actionLists)]) idMap.set(k, NS + k);
const renameSelector = (v) => v.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (_, cls) => '.' + rename(cls));
const renameString = (v, key) => {
  if (idMap.has(v)) return idMap.get(v);
  for (const [from, to] of idMap) if (v.startsWith(from + '-')) return to + v.slice(from.length);
  if (v.startsWith(LX_PAGE)) return MONO_PAGE + v.slice(LX_PAGE.length);
  if (key === 'selector' || key === 'target') return renameSelector(v);
  return v;
};
function deep(node, key) {
  if (typeof node === 'string') return renameString(node, key);
  if (Array.isArray(node)) return node.map((n) => deep(n, key));
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[renameString(k, k)] = deep(v, k);
    return o;
  }
  return node;
}
const ix = {
  events: deep(bundle.ix2Payload.events, 'events'),
  actionLists: deep(bundle.ix2Payload.actionLists, 'actionLists'),
  interactions: deep(bundle.ix3Interactions, 'interactions').map((i) => ({ ...i, scope: { type: 'pages', value: [MONO_PAGE] } })),
  timelines: deep(bundle.ix3Timelines, 'timelines'),
};
writeFileSync(`${SITE}/tools/fragments/lx-ix.json`, JSON.stringify(ix), 'utf8');

console.log(JSON.stringify({
  assets: { total: urls.size, downloaded, present },
  cssBytes: css.length, classes: classSet.size,
  fragmentBytes: frag.length,
  ix2Events: Object.keys(ix.events).length, ix2Lists: Object.keys(ix.actionLists).length,
  ix3: ix.interactions.length, timelines: ix.timelines.length,
}, null, 1));
