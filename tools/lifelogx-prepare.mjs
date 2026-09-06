/**
 * Prepare the third template (lifelogx, a Webflow export) for use inside the
 * Mono shell, the same way the Scalora modules were prepared:
 *
 *   1. mirror every remote asset the used pages reference (images, the
 *      42 Dotsans font) into assets/ — this site must make no request that
 *      leaves its origin;
 *   2. namespace its author-layer CSS with an `lx-` prefix and scope its
 *      body/:root/bare-element rules to `.lx-scope`, so it cannot restyle
 *      Mono (they collide on `button`, `section`, `navbar`, …);
 *   3. cut four page bodies into fragments with the same renamed classes:
 *        index.html  → lx-home.html   (hero → closing CTA, minus the invented
 *                                      "trusted by 600,000" logo wall)
 *        about.html  → lx-about.html
 *        blog.html   → lx-blog.html
 *        post.html   → lx-post.html   (one CMS article page; every STARGO
 *                                      article is built from it)
 *   4. export the interaction data: IX2 events/action lists (identical in all
 *      four page bundles — asserted) and every page's IX3 GSAP timelines, with
 *      ids, selectors and class targets renamed, for tools/fuse-ix.mjs to merge
 *      into the one bundle every page loads. Load-triggered timelines that
 *      targeted generic classes (`heading-style-h1`) are pointed at a class
 *      that exists only on their own page, because every page of this site
 *      shares one Webflow page id and would otherwise run them.
 *
 * Idempotent. Input: tools/templates/lifelogx (the unpacked template, checked
 * in), or LIFELOGX_SRC. Outputs: css/lifelogx.lx.css, tools/fragments/lx-*.html,
 * tools/fragments/lx-ix.json, assets/… Run with NODE_USE_ENV_PROXY=1 when the
 * CDN is only reachable through the local proxy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const SRC = process.env.LIFELOGX_SRC ?? `${SITE}/tools/templates/lifelogx`;
const NS = 'lx-';
const SCOPE = 'lx-scope';
const CDN = 'https://cdn.prod.website-files.com/';
const MONO_PAGE = '699b6466d5f19893993a4bf1';
/** Webflow CMS item images (blog covers): replaced by STARGO covers at build time, never mirrored. */
const CMS_FOLDER = '69417cf6925a82af26179b70';
/** Template people and the office photograph of the about page: replaced at build time, never mirrored. */
const REPLACED_AT_BUILD = /^6929b6c693cb856e01ef7c05\/(6943d80451564405defffaed|6943d80f46f426e739f71ec5|6943d84a7b3093c6e962c7dd|6943d8308925855adc2bcb5c|6943f43d1ea90943e43a09be)_/;

const FOOTER = /<div[^>]*class="[^"]*\bfooter_wrapper\b/;
const PAGES = {
  home: { file: 'index.html', start: /<div[^>]*class="[^"]*\bintegrations_wrapper\b/, end: FOOTER },
  about: { file: 'about.html', start: /<div class="section hero-about">/, end: FOOTER },
  blog: { file: 'blog.html', start: /<div class="section"><div class="padding-global">/, end: FOOTER },
  post: { file: 'post.html', start: /<div class="section"><div class="padding-global">/, end: FOOTER },
};
/** Load-timeline targets that are too generic for a site that shares one page id → page-only classes. */
const UNIQUE_TARGETS = {
  about: { 'heading-style-h1.pink': 'about-title-pink', 'heading-style-h1.white': 'about-title-white' },
  blog: { 'heading-style-h1': 'blog-hero-title' },
};

const cssAll = readFileSync(`${SRC}/css/az-lifelogx.app.shared.0ad6c3188.css`, 'utf8');
const pages = {};
for (const [name, spec] of Object.entries(PAGES)) {
  const html = readFileSync(`${SRC}/${spec.file}`, 'utf8');
  const bundleFile = html.match(/js\/(app\.[0-9a-f]{8}\.[0-9a-f]+\.js)/)?.[1];
  const pageId = html.match(/data-wf-page="([0-9a-f]{24})"/)?.[1];
  if (!bundleFile || !pageId) throw new Error(`lifelogx ${name}: bundle or page id not found`);
  const s = html.search(spec.start);
  const e = html.search(spec.end);
  if (s === -1 || e === -1 || e < s) throw new Error(`lifelogx ${name}: fragment boundaries`);
  pages[name] = { html, pageId, frag: html.slice(s, e), bundle: readBundle(readFileSync(`${SRC}/js/${bundleFile}`, 'utf8')) };
}

// The "Loved & trusted by +600,000 businesses" wall of invented logos.
{
  const f = pages.home.frag;
  const logosStart = f.search(/<div[^>]*class="[^"]*\blogos_wrapper\b/);
  const logosEnd = f.search(/<div[^>]*class="[^"]*\bgradient-section\b/);
  if (logosStart === -1 || logosEnd === -1 || logosEnd < logosStart) throw new Error('lifelogx: logo wall boundaries');
  pages.home.frag = f.slice(0, logosStart) + f.slice(logosEnd);
}
// Page-only classes for the load timelines (see UNIQUE_TARGETS).
pages.about.frag = pages.about.frag
  .replace('<h1 class="heading-style-h1 pink">', '<h1 class="heading-style-h1 pink about-title-pink">')
  .replace('<h1 class="heading-style-h1 white">', '<h1 class="heading-style-h1 white about-title-white">');
pages.blog.frag = pages.blog.frag.replace('<h1 class="heading-style-h1">', '<h1 class="heading-style-h1 blog-hero-title">');
if (!pages.about.frag.includes('about-title-white') || !pages.blog.frag.includes('blog-hero-title')) throw new Error('lifelogx: unique title classes not applied');

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
for (const m of (Object.values(pages).map((p) => p.frag).join('\n') + cssAll).matchAll(URL_RE)) {
  const rel = trimUrl(m[1]);
  if (!rel.startsWith(CMS_FOLDER + '/') && !REPLACED_AT_BUILD.test(rel)) urls.add(rel);
}
const localPath = (rel) => `assets/${decodeURIComponent(rel)}`;
let downloaded = 0;
let present = 0;
for (const rel of urls) {
  const target = `${SITE}/${localPath(rel)}`;
  if (existsSync(target)) { present++; continue; }
  mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  let res;
  try { res = await fetch(CDN + rel); } catch (e) {
    throw new Error(`asset ${rel}: ${e.message}${process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY ? ' (a proxy is configured; run with NODE_USE_ENV_PROXY=1)' : ''}`);
  }
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
    // bare element selectors (p, h1, a …) become descendants of the scope. :where()
    // adds no specificity, so a bare `h3 {2.5rem}` keeps losing to the template's own
    // `.big-gradient-text {9vw}` exactly as it does in the original stylesheet.
    const first = s.match(/^([a-z][a-z0-9]*)\b/);
    if (first && BARE.test(first[1]) && !s.startsWith(`.${SCOPE}`)) s = `:where(.${SCOPE}) ${s}`;
    return ' ' + s;
  }).join(',');
}

// Stylesheet lives in css/, so its asset URLs are one level up.
let css = namespaceCss(localise(author)).split('url("assets/').join('url("../assets/').split("url('assets/").join("url('../assets/").split('url(assets/').join('url(../assets/');
css = `/* lifelogx author layer, namespaced "${NS}" and scoped to .${SCOPE} by tools/lifelogx-prepare.mjs. Do not edit by hand. */\n` + css;
mkdirSync(`${SITE}/css`, { recursive: true });
writeFileSync(`${SITE}/css/lifelogx.lx.css`, css, 'utf8');

/* ------------------------------------------------------ 3. HTML fragments -- */

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });
const fragmentBytes = {};
for (const [name, p] of Object.entries(pages)) {
  let frag = p.frag.replace(/class="([^"]*)"/g, (_, v) => `class="${v.split(/\s+/).filter(Boolean).map(rename).join(' ')}"`);
  frag = localise(frag);
  frag = frag.split(p.pageId).join(MONO_PAGE);
  frag = `<div class="${SCOPE}${name === 'home' ? '' : ' lx-page-body'}">\n${frag}\n</div>`;
  writeFileSync(`${SITE}/tools/fragments/lx-${name}.html`, frag, 'utf8');
  fragmentBytes[name] = frag.length;
}

/* --------------------------------------------------- 4. interaction data -- */

const home = pages.home.bundle;
for (const [name, p] of Object.entries(pages)) {
  if (JSON.stringify(p.bundle.ix2Payload) !== JSON.stringify(home.ix2Payload)) throw new Error(`lifelogx ${name}: IX2 payload differs from the homepage bundle; export it separately`);
}
const idMap = new Map();
for (const k of [...Object.keys(home.ix2Payload.events), ...Object.keys(home.ix2Payload.actionLists)]) idMap.set(k, NS + k);
const renameSelector = (v) => v.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (_, cls) => '.' + rename(cls));
const pageIds = Object.values(pages).map((p) => p.pageId);
const foldPage = (v) => { for (const id of pageIds) if (v.startsWith(id)) return MONO_PAGE + v.slice(id.length); return v; };
const renameString = (v, key) => {
  if (idMap.has(v)) return idMap.get(v);
  for (const [from, to] of idMap) if (v.startsWith(from + '-')) return to + v.slice(from.length);
  const folded = foldPage(v);
  if (folded !== v) return folded;
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
/** IX3 addresses elements as ["wf:class", ["a.b", …]]: every class in the list is renamed. */
const renameClassList = (v, unique) => v.split('.').map((c) => rename(unique[c] ?? c)).join('.');
function renameIx3(node, unique) {
  if (Array.isArray(node)) {
    if (node[0] === 'wf:class' && Array.isArray(node[1])) {
      const mapped = unique[node[1].join('.')];
      const classes = mapped ? [mapped].map((c) => renameClassList(c, {})) : node[1].map((c) => renameClassList(c, unique));
      return [node[0], classes, ...node.slice(2).map((n) => renameIx3(n, unique))];
    }
    return node.map((n) => renameIx3(n, unique));
  }
  if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, renameIx3(v, unique)]));
  return node;
}
const interactions = new Map();
const timelines = new Map();
for (const [name, p] of Object.entries(pages)) {
  const unique = UNIQUE_TARGETS[name] ?? {};
  for (const i of p.bundle.ix3Interactions) {
    const x = renameIx3({ ...i, scope: { type: 'pages', value: [MONO_PAGE] } }, unique);
    const j = JSON.stringify(x);
    if (interactions.has(x.id) && interactions.get(x.id) !== j) throw new Error(`lifelogx ix3 conflict ${x.id}`);
    interactions.set(x.id, j);
  }
  for (const t of p.bundle.ix3Timelines) {
    const x = renameIx3(t, unique);
    const j = JSON.stringify(x);
    if (timelines.has(x.id) && timelines.get(x.id) !== j) throw new Error(`lifelogx ix3 timeline conflict ${x.id}`);
    timelines.set(x.id, j);
  }
}
const ix = {
  events: deep(home.ix2Payload.events, 'events'),
  actionLists: deep(home.ix2Payload.actionLists, 'actionLists'),
  interactions: [...interactions.values()].map((j) => JSON.parse(j)),
  timelines: [...timelines.values()].map((j) => JSON.parse(j)),
};
const leaked = JSON.stringify(ix.interactions.concat(ix.timelines)).match(/"wf:class",\["(?!lx-)[^"]*"/g);
if (leaked) throw new Error(`lifelogx ix3: class targets not renamed: ${leaked.slice(0, 3).join(' ')}`);
writeFileSync(`${SITE}/tools/fragments/lx-ix.json`, JSON.stringify(ix), 'utf8');

console.log(JSON.stringify({
  assets: { total: urls.size, downloaded, present },
  cssBytes: css.length, classes: classSet.size,
  fragmentBytes,
  ix2Events: Object.keys(ix.events).length, ix2Lists: Object.keys(ix.actionLists).length,
  ix3: ix.interactions.length, timelines: ix.timelines.length,
}, null, 1));
