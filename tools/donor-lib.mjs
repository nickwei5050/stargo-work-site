/**
 * Lift a block out of a Webflow template export, with its styles and its motion.
 *
 * Four donors have now been transplanted one bespoke script at a time
 * (lifelogx, cinery, lumenis, renok) and each one rediscovered the same traps.
 * The capability page needs nine more blocks across four donors, so the method
 * lives here once and the per-block scripts become configuration.
 *
 * What the traps were, and what this does about them:
 *
 *   Page-scoped ids. IX2 writes an event target as "<pageId>|<nodeId>" and the
 *   runtime returns null unless that pageId equals the document's data-wf-page:
 *       if (r !== document.documentElement.getAttribute('data-wf-page')) return null
 *   A transplanted block therefore never animates, and whatever inline
 *   `opacity:0` the export carries becomes its permanent state. The prefix is
 *   stripped; the bare node id is what the markup carries.
 *
 *   Runtime preset names. `slideInBottom`, `fadeIn` and friends name action
 *   lists the host page's own payload already defines. Left alone, the donor's
 *   motion is silently swapped for the host's, so they are namespaced with
 *   everything else and the donor's own copy travels with the block.
 *
 *   Element rules. Webflow puts much of a template's identity on bare tags --
 *   `h1 { color: var(--white); font-size: 6.25rem }` with no class anywhere.
 *   A class-only filter drops all of it and the block inherits the host's
 *   typography instead of the donor's.
 *
 *   Runtime layout classes. `w-layout-vflex` is not decoration: it is
 *   `display:flex`. Skipping `w-` classes as "not the donor's" collapses
 *   centred rows to the left edge.
 *
 *   Custom properties. Donor rules resolve through the donor's `:root`. Without
 *   it every colour computes to nothing and the block renders black on black.
 *
 *   The background parent. Cutting just the `<section>` can leave behind the
 *   ancestor that supplies its ground, putting white type on white.
 *
 * Everything is namespaced and scoped: class names take a per-donor prefix and
 * every rule is scoped under one root class, so a donor can never repaint the
 * rest of the site.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

/** Action-list names the Webflow runtime owns; both payloads define them. */
const PRESETS = new Set(['fadeIn', 'fadeOut', 'slideInBottom', 'slideInTop', 'slideInLeft', 'slideInRight']);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The one css file in a donor's css/ directory, unless one is named. */
function donorCss(srcDir, name) {
  if (name) return `${srcDir}/css/${name}`;
  const files = readdirSync(`${srcDir}/css`).filter((f) => f.endsWith('.css')).sort();
  if (files.length !== 1) throw new Error(`donor: name the stylesheet, ${files.length} found in ${srcDir}/css`);
  return `${srcDir}/css/${files[0]}`;
}

/** Every Webflow bundle in a donor's js/ directory. */
function donorBundles(srcDir) {
  let files;
  try { files = readdirSync(`${srcDir}/js`).sort(); } catch { return []; }   // sorted: readdir order is the filesystem's
  return files.filter((f) => /^app[.\w]*\.js$/.test(f)).map((f) => `${srcDir}/js/${f}`);
}

/**
 * @param {object} o
 * @param {string} o.srcDir   donor root, e.g. <repo>/tools/templates/renok
 * @param {string} o.page     html file inside it
 * @param {string} [o.css]    stylesheet name; inferred when the donor ships one
 * @param {string} o.ns       class prefix, e.g. 'qx-'
 * @param {string} o.scope    root class every rule is scoped under, e.g. '.qx-intro'
 * @param {string} o.start    exact substring where the cut begins
 * @param {string} o.end      exact substring where the cut ends (included)
 * @param {string} [o.wrap]   class list for a wrapper to put the block back inside
 * @param {Record<string,string>} [o.images]      exact donor src -> local path
 * @param {Record<string,string>} [o.imageStems]  filename stem -> local path, for
 *   a photograph and all of its responsive variants at once
 * @param {string} [o.mirror]  local directory (e.g. 'assets/renok') that keeps the
 *   donor's own artwork; every CDN url not otherwise mapped is rewritten there
 *   and listed in the returned `assets` for tools/mirror-donor-assets.mjs
 */
export function extractBlock(o) {
  const html = readFileSync(`${o.srcDir}/${o.page}`, 'utf8');
  const css = readFileSync(donorCss(o.srcDir, o.css), 'utf8');

  /* ------------------------------------------------------------- cut ---- */
  const a = html.indexOf(o.start);
  if (a < 0) throw new Error(`donor ${o.page}: start anchor not found: ${o.start.slice(0, 60)}`);
  if (html.indexOf(o.start, a + 1) >= 0) throw new Error(`donor ${o.page}: start anchor is not unique: ${o.start.slice(0, 60)}`);
  const b = html.indexOf(o.end, a);
  if (b < 0) throw new Error(`donor ${o.page}: end anchor not found after start: ${o.end.slice(0, 60)}`);
  let frag = html.slice(a, b + o.end.length);

  /* The ancestors the block was designed inside: the one that supplies its
     ground, and the section/container chain that gives it its margins. Named in
     the donor's own class names so they are namespaced and their rules are
     extracted with everything else -- wrapping after namespacing would leave
     them unstyled, which is how renok's hero first arrived as white type on a
     white page. Outermost first. */
  for (const cls of [o.wrap ?? []].flat().reverse()) frag = `<div class="${cls}">${frag}</div>`;

  /* --------------------------------------------------------- namespace -- */
  const all = [...frag.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
  const CLASSES = [...new Set(all.filter((c) => !c.startsWith('w-')))];
  const WCLASSES = [...new Set(all.filter((c) => c.startsWith('w-')))];
  const TAGS = new Set([...frag.matchAll(/<([a-z][a-z0-9]*)/g)].map((m) => m[1]));
  const known = new Set(CLASSES);

  frag = frag.replace(/class="([^"]+)"/g, (m, list) =>
    `class="${list.split(/\s+/).filter(Boolean).map((c) => (known.has(c) ? o.ns + c : c)).join(' ')}"`);

  const leaked = [...frag.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))
    .filter((c) => c && !c.startsWith(o.ns) && !c.startsWith('w-'));
  if (leaked.length) throw new Error(`donor ${o.page}: un-namespaced classes survive: ${[...new Set(leaked)].join(', ')}`);

  /* Off-origin assets: this site makes none at runtime, so every one must end up
     local. Two ways to get there:

       `images` / `imageStems` / `cssImages` substitute a specific file (or drop
       a declaration with 'none'). Webflow ships each photograph five times
       (-p-500, -p-800, -p-1080, -p-1600 and the original) across src and srcset,
       so a stem replaces the whole family at once.

       `mirror` keeps the donor's own artwork: every remaining CDN url is rewritten
       to `<mirror>/<file>` and recorded in `assets`, and tools/mirror-donor-
       assets.mjs fetches the files into place. This is what "只改文字，图片都
       要保留" requires — the review's screenshots are the templates' own photos. */
  const assets = {};
  const localName = (url) => {
    const file = decodeURIComponent(url.split('?')[0].split('/').pop()).replace(/[^\w.\-]+/g, '_');
    return `${o.mirror}/${file}`;
  };
  const rewrite = (url) => {
    if (!o.mirror) return url;
    const to = localName(url);
    assets[url] = to;
    return to;
  };

  for (const [from, to] of Object.entries(o.images ?? {})) frag = frag.split(from).join(to);
  for (const [stem, to] of Object.entries(o.imageStems ?? {})) {
    frag = frag.replace(/https?:\/\/[^\s"]+/g, (url) => (url.includes(stem) ? to : url));
  }
  frag = frag.replace(/https?:\/\/cdn\.prod\.website-files\.com\/[^\s"')]+/g, rewrite);
  const remote = [...frag.matchAll(/(?:src|srcset|href|poster|data-src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (remote.length) throw new Error(`donor ${o.page}: unmapped off-origin assets (set mirror, or map them):\n  ${[...new Set(remote)].join('\n  ')}`);

  /* --------------------------------------------------------------- css -- */

  /* Stylesheets reference the donor's CDN too, and a background-image or a
     webfont there is just as much an off-origin request as an <img>. The renok
     hero's backdrop hid here for a while: the markup was clean and the page
     still fetched from Webflow on every load. Same maps as the markup; `none`
     drops a declaration the site has no artwork for. */
  const cssMap = { ...(o.images ?? {}), ...(o.cssImages ?? {}) };
  const paint = (url) => {
    if (cssMap[url] !== undefined) return cssMap[url];
    for (const [stem, to] of Object.entries(o.imageStems ?? {})) if (url.includes(stem)) return to;
    return null;
  };
  /* A stylesheet lives in css/, so a site-relative path needs one step up. */
  const cssUrl = (url) => {
    let to = paint(url);
    if (to === null && o.mirror && /cdn\.prod\.website-files\.com/.test(url)) to = rewrite(url);
    if (to === null) throw new Error(`donor ${o.page}: unmapped off-origin asset in css: ${url}\n  set mirror, map it in images/cssImages/imageStems, or map it to 'none' to drop the declaration`);
    return to === 'none' ? 'none' : `url("${/^(\/|\.\.\/|https?:|data:)/.test(to) ? to : `../${to}`}")`;
  };

  /* The donor's own typefaces. Webflow serves them from the same CDN as its
     photography, so they mirror the same way — and without them a block falls
     back to whatever the host page happens to load: cinery's Overused Grotesk
     became Arial, which draws its titles 15% wider, which is why they would not
     fit their slot. `@font-face` is not a scoped rule — it only declares a
     family — so these are emitted as they are, above the scoped rules. */
  const faces = [];
  for (const m of css.matchAll(/@font-face\s*\{([^{}]*)\}/g)) {
    faces.push(`@font-face {${m[1].replace(/url\((["']?)(https?:\/\/[^"')]+)\1\)/g, (u, q, url) => cssUrl(url))}}`);
  }

  const rootBlock = /(?:^|\})\s*:root[^{]*\{([^{}]*)\}/.exec(css);
  const vars = rootBlock
    ? [...rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map((m) => `  ${m[1]}: ${m[2].trim()};`).join('\n')
    : '';

  const wanted = CLASSES.length ? new RegExp(`\\.(?:${CLASSES.map(esc).join('|')})\\b`) : /$^/;
  const isElementRule = (sel) => sel.split(',').some((p) => TAGS.has(p.trim()));
  const isRuntimeRule = (sel) => WCLASSES.some((c) => sel.includes(`.${c}`));

  const rules = [];
  let media = null;
  const re = /(@media[^{]+\{)|([^{}]+)\{([^{}]*)\}|(\})/g;
  let m;
  while ((m = re.exec(css))) {
    if (m[1]) { media = m[1].trim(); continue; }
    if (m[4]) { media = null; continue; }
    const sel = (m[2] || '').trim();
    const body = (m[3] || '').trim();
    if (!sel || !body || sel.startsWith('@')) continue;
    /* A donor re-tunes its custom properties per breakpoint on `:root` or
       `body` -- renok's extra-big-text is 10vw as a base and 15vw from 1280px
       up. The base :root is carried above; without these the block draws at
       the base value at every width. They go onto the scope root. */
    if (media && /^(:root|body|html)(\s*,\s*(:root|body|html))*$/.test(sel)) {
      const vars = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map((m) => `${m[1]}: ${m[2].trim()};`);
      if (vars.length) rules.push({ media, css: `${o.scope} { ${vars.join(' ')} }` });
      continue;
    }
    if (!(wanted.test(sel) || isElementRule(sel) || isRuntimeRule(sel))) continue;
    const scoped = sel.split(',').map((s) => {
      let t = s.trim();
      for (const c of CLASSES) t = t.replace(new RegExp(`\\.${esc(c)}\\b`, 'g'), `.${o.ns}${c}`);
      return `${o.scope} ${t}`;
    }).join(', ');
    rules.push({ media, css: `${scoped} { ${body} }` });
  }

  for (const r of rules) {
    r.css = r.css.replace(/url\((["']?)(https?:\/\/[^"')]+)\1\)/g, (m, q, url) => cssUrl(url));
  }

  let sheet = `${faces.join('\n')}${faces.length ? '\n' : ''}${o.scope} {\n${vars}\n}\n`;
  let open = null;
  for (const r of rules) {
    if (r.media !== open) {
      if (open) sheet += '}\n';
      if (r.media) sheet += `${r.media}\n`;
      open = r.media;
    }
    sheet += `${r.media ? '  ' : ''}${r.css}\n`;
  }
  if (open) sheet += '}\n';

  /* --------------------------------------------------------------- ix2 -- */
  const wids = [...new Set([...frag.matchAll(/data-w-id="([^"]+)"/g)].map((x) => x[1]))];
  const events = {};
  const actionLists = {};
  const scopesStripped = new Set();

  /* An id written "<pageId>|<nodeId>" only binds on the page it was authored
     on; the transplanted markup carries the bare node id, so the scope goes.
     Matching the shape rather than one known page id matters because a donor
     ships one bundle per page and the same block can appear in several. */
  const PAGE_SCOPED_ID = /^([0-9a-f]{16,})\|([0-9a-f-]+)$/;

  for (const file of donorBundles(o.srcDir)) {
    let P;
    try { P = readBundle(readFileSync(file, 'utf8')).ix2Payload; } catch { continue; }
    if (!P?.events) continue;

    /* Two ways an event reaches this block: by element id (appliesTo ELEMENT)
       or by class selector (appliesTo CLASS, which is what lets a block repeat
       freely -- the action list addresses CHILDREN of whatever was clicked). */
    const hits = Object.entries(P.events).filter(([, v]) => {
      const s = JSON.stringify(v);
      return wids.some((w) => s.includes(w)) || CLASSES.some((c) => s.includes(`"selector":".${c}"`));
    });
    if (!hits.length) continue;

    const rename = (s) => {
      let t = s;
      const scoped = PAGE_SCOPED_ID.exec(t);
      if (scoped) { scopesStripped.add(scoped[1]); t = scoped[2]; }
      for (const c of CLASSES) t = t.replace(new RegExp(`\\.${esc(c)}\\b`, 'g'), `.${o.ns}${c}`);
      if (/^(e|a)-\d+/.test(t)) t = o.ns + t;
      return t;
    };
    const deep = (n) => {
      if (typeof n === 'string') return rename(n);
      if (Array.isArray(n)) return n.map(deep);
      if (n && typeof n === 'object') {
        const out = Object.fromEntries(Object.entries(n).map(([k, v]) => [k, deep(v)]));
        /* A colour step names a global swatch *and* carries the literal rgb it
           resolved to. The swatch is looked up in the payload's `site` table,
           which on this page is the host template's — a donor's swatch id is not
           in it, the lookup fails, and the step lands on the wrong colour. That
           is what left cinery's rows white at rest instead of grey, so its
           grey→white hover did nothing visible. Dropping the name leaves the
           donor's own resolved values, which are what the swatch meant. */
        if (out.globalSwatchId && ['rValue', 'gValue', 'bValue'].every((k) => typeof out[k] === 'number')) {
          delete out.globalSwatchId;
        }
        return out;
      }
      return n;
    };

    for (const [k, v] of hits) {
      const ev = deep(v);
      /* The list an event runs is referenced by name, and a donor may call one
         anything -- renok ships `growIn`, `slideInBottom`, even `a`. Whatever the
         name, if the donor defines it the copy travels with the block under the
         namespace, and the reference follows; only a name the donor does NOT
         define is left alone, to resolve against the host runtime's presets. */
      const id = v.action?.config?.actionListId;
      if (id && id in P.actionLists) ev.action.config.actionListId = o.ns + id;
      events[o.ns + k] = ev;
    }
    for (const [k, v] of Object.entries(P.actionLists)) {
      if (hits.some(([, e]) => e.action?.config?.actionListId === k || JSON.stringify(e).includes(`"${k}"`))) actionLists[o.ns + k] = deep(v);
    }
  }

  /* An event pointing at an action list nobody carried animates nothing. */
  for (const [k, v] of Object.entries(events)) {
    const id = v.action?.config?.actionListId;
    if (id && !(id in actionLists)) throw new Error(`donor ${o.page}: event ${k} needs missing action list ${id}`);
  }

  return {
    html: frag,
    css: sheet,
    ix: { events, actionLists },
    assets,
    stats: {
      bytes: frag.length,
      classes: CLASSES.length,
      runtimeClasses: WCLASSES.length,
      interactionIds: wids.length,
      cssRules: rules.length,
      ix2Events: Object.keys(events).length,
      ix2Lists: Object.keys(actionLists).length,
      pageScopesStripped: [...scopesStripped],
    },
  };
}
