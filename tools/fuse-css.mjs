/**
 * Build css/scalora-modules.sc.css from the Scalora export.
 *
 * The two Webflow stylesheets share a byte-identical 36,118-byte prefix (the
 * Webflow framework layer). Mono's copy already ships it, so only Scalora's
 * AUTHOR layer is extracted - everything from byte 36118 on.
 *
 * Three separate hazards are neutralised here, and only the third is about the
 * class names people usually worry about:
 *
 *   1. Bare element selectors. Both author layers redefine body, h1-h5, p, a,
 *      ul, ol. Appended after Mono, Scalora's would win globally and retype
 *      the whole site. Every one is scoped under .sc-scope.
 *
 *   2. Design tokens on `body`. Scalora declares all of its custom properties
 *      in three body{} rules rather than :root, including two inside media
 *      queries. Rewriting those selectors to .sc-scope turns the entire token
 *      system into an inheritable island and keeps the responsive re-valuing
 *      intact.
 *
 *   3. Fourteen colliding class names, renamed with an `sc-` prefix.
 *
 * Plus @keyframes: animation names are global, and a duplicate name silently
 * takes over the other template's animation. Scalora's are prefixed too.
 *
 * The same NS/COLLIDE constants drive the HTML rewrite in extract-modules.mjs,
 * so the two sides cannot drift.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const NS = 'sc-';

/**
 * Class names defined in BOTH author layers. Note what is absent:
 * wf-layout-layout and gm-style-iw live only in the shared framework prefix,
 * which is not copied, so they are not collisions.
 */
export const COLLIDE = [
  'button-text', 'color-block', 'contact-card', 'container', 'error-message',
  'faq-item', 'footer', 'hero', 'menu-button', 'navbar', 'pricing-card',
  'utility-page-content', 'utility-page-wrap', 'white',
];

const SHARED_PREFIX_LEN = 36118;

/** Bare elements Scalora restyles. Left unscoped they would retype the site. */
const BARE = ['html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'img', 'blockquote'];

const CDN = 'https://cdn.prod.website-files.com/';
const CDN_RE = /https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>\\,)]+/g;

function localiseUrl(url) {
  // Matches mirror-assets.mjs: decoded on disk, percent-encoded in the sheet.
  const u = new URL(url);
  const raw = decodeURIComponent(u.pathname.replace(/%2F/gi, '/'));
  const parts = raw.split('/').filter(Boolean);
  const file = parts.pop();
  const site = parts.pop() ?? 'misc';
  return `../assets/${site}/${encodeURIComponent(file)}`;
}

function localise(css) {
  let n = 0;
  const out = css.replace(CDN_RE, (raw) => {
    let url = raw;
    // Only a ")" with no opener of its own belongs to the CSS url() wrapper.
    while (url.endsWith(')') && (url.split('(').length < url.split(')').length)) url = url.slice(0, -1);
    n++;
    return localiseUrl(url) + raw.slice(url.length);
  });
  return { css: out, count: n };
}

/** Rewrite one selector list. */
function scopeSelectorList(list) {
  return list.split(',').map((sel) => {
    const s = sel.trim();
    if (!s) return sel;
    // `body`, `body.x`, `body .x` -> the island root.
    if (s === 'body' || s === 'html') return `.${NS}scope`;
    const lead = s.match(/^(html|body)(?=[\s.:[>+~])/);
    if (lead) return `.${NS}scope${s.slice(lead[1].length)}`;
    // A selector whose first compound is a bare element gets scoped.
    const first = s.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
    if (first && BARE.includes(first[1])) return `.${NS}scope ${s}`;
    return s;
  }).join(', ');
}

/**
 * Walk the sheet, rewriting only selector positions.
 *
 * A regex over the whole file cannot tell a selector from a declaration value,
 * and `@font-face` / `@keyframes` bodies must be left alone entirely.
 */
function scopeSelectors(css) {
  let out = '';
  let i = 0;
  let chunkStart = 0;
  const stack = [];           // at-rule names we are inside
  let scoped = 0;

  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const raw = css.slice(chunkStart, i);
      const trimmed = raw.trim();
      if (trimmed.startsWith('@')) {
        const name = trimmed.slice(1).split(/[\s(]/)[0].toLowerCase();
        stack.push(name);
        out += raw;
      } else if (stack.some((a) => a === 'keyframes' || a === '-webkit-keyframes' || a === 'font-face')) {
        out += raw;                                   // percentage keys, not selectors
        stack.push('block');
      } else {
        const lead = raw.slice(0, raw.length - raw.trimStart().length);
        out += lead + scopeSelectorList(trimmed);
        scoped++;
        stack.push('rule');
      }
      out += '{';
      i++;
      chunkStart = i;
      continue;
    }
    if (ch === '}') {
      out += css.slice(chunkStart, i) + '}';
      stack.pop();
      i++;
      chunkStart = i;
      continue;
    }
    i++;
  }
  out += css.slice(chunkStart);
  return { css: out, scoped };
}

function renameClasses(css) {
  let n = 0;
  for (const c of COLLIDE) {
    const re = new RegExp(`\\.${c}(?![A-Za-z0-9_-])`, 'g');
    css = css.replace(re, () => { n++; return `.${NS}${c}`; });
  }
  return { css, count: n };
}

function prefixKeyframes(css, monoCss) {
  const nameOf = (sheet) => new Set(
    [...sheet.matchAll(/@(?:-webkit-)?keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]),
  );
  const mono = nameOf(monoCss);
  const mine = nameOf(css);
  const clash = [...mine].filter((n) => mono.has(n));
  for (const name of clash) {
    css = css
      .replace(new RegExp(`(@(?:-webkit-)?keyframes\\s+)${name}\\b`, 'g'), `$1${NS}${name}`)
      .replace(new RegExp(`(animation(?:-name)?\\s*:[^;}]*?\\b)${name}\\b`, 'g'), `$1${NS}${name}`);
  }
  return { css, clash };
}

// ---------------------------------------------------------------------------
// Build only when run directly. extract-modules.mjs imports NS/COLLIDE from
// here so the HTML and CSS renames come from one list; importing must not
// rewrite the stylesheet as a side effect.
// fileURLToPath, not .pathname: on Windows the latter yields "/F:/a%20b/x.mjs",
// which never equals the resolved argv path, and the build silently no-ops.
const RUN_DIRECTLY = Boolean(process.argv[1])
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (!RUN_DIRECTLY) {
  // exported constants only
} else {

const SCALORA_CSS = process.argv[2]
  ?? 'C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/scalora/css/scalora-startup.app.shared.95e8543df.css';
const MONO_CSS = 'F:/stargo 网站/stargo-site/css/monof-template.app.shared.ed8969994.css';
const OUT = 'F:/stargo 网站/stargo-site/css/scalora-modules.sc.css';

const scaloraFull = readFileSync(SCALORA_CSS, 'utf8');
const monoFull = readFileSync(MONO_CSS, 'utf8');

// Guard the assumption the whole approach rests on. A re-export that changes
// the framework layer must stop the build, not silently duplicate 36 KB.
const pristineMono = readFileSync(
  'C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/tpl/css/monof-template.app.shared.ed8969994.css',
  'utf8',
);
if (pristineMono.slice(0, SHARED_PREFIX_LEN) !== scaloraFull.slice(0, SHARED_PREFIX_LEN)) {
  console.error('FAIL: the two stylesheets no longer share the framework prefix. Re-measure before building.');
  process.exit(1);
}

let css = scaloraFull.slice(SHARED_PREFIX_LEN);
const loc = localise(css); css = loc.css;
const scoped = scopeSelectors(css); css = scoped.css;
const renamed = renameClasses(css); css = renamed.css;
const kf = prefixKeyframes(css, monoFull); css = kf.css;

const header = `/* Generated by tools/fuse-css.mjs - do not edit by hand.
   Source: Scalora author layer (bytes ${SHARED_PREFIX_LEN}+ of the export).
   Every rule is scoped under .${NS}scope; ${COLLIDE.length} colliding class
   names carry the "${NS}" prefix. Regenerate instead of patching. */\n`;

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, header + css, 'utf8');

console.log(JSON.stringify({
  wrote: OUT,
  bytes: css.length,
  selectorsScoped: scoped.scoped,
  classRenames: renamed.count,
  cdnUrlsLocalised: loc.count,
  keyframeClashesPrefixed: kf.clash,
  remainingCdnRefs: (css.match(new RegExp(CDN, 'g')) ?? []).length,
}, null, 2));

}
