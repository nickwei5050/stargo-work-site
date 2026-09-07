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
  const files = readdirSync(`${srcDir}/css`).filter((f) => f.endsWith('.css'));
  if (files.length !== 1) throw new Error(`donor: name the stylesheet, ${files.length} found in ${srcDir}/css`);
  return `${srcDir}/css/${files[0]}`;
}

/** Every Webflow bundle in a donor's js/ directory. */
function donorBundles(srcDir) {
  let files;
  try { files = readdirSync(`${srcDir}/js`); } catch { return []; }
  return files.filter((f) => /^app[.\w]*\.js$/.test(f)).map((f) => `${srcDir}/js/${f}`);
}

/**
 * @param {object} o
 * @param {string} o.srcDir   donor root, e.g. F:/stargo 网站/tpl4/renok
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

  /* Off-origin assets: this site makes none, so every one must be accounted for.
     Webflow ships each photograph five times (-p-500, -p-800, -p-1080, -p-1600
     and the original) across src and srcset, so matching on the stem replaces a
     whole family at once instead of listing every variant. */
  for (const [from, to] of Object.entries(o.images ?? {})) frag = frag.split(from).join(to);
  for (const [stem, to] of Object.entries(o.imageStems ?? {})) {
    frag = frag.replace(/https?:\/\/[^\s"]+/g, (url) => (url.includes(stem) ? to : url));
  }
  const remote = [...frag.matchAll(/(?:src|srcset|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  if (remote.length) throw new Error(`donor ${o.page}: unmapped off-origin assets:\n  ${[...new Set(remote)].join('\n  ')}`);

  /* --------------------------------------------------------------- css -- */
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
    if (!(wanted.test(sel) || isElementRule(sel) || isRuntimeRule(sel))) continue;
    const scoped = sel.split(',').map((s) => {
      let t = s.trim();
      for (const c of CLASSES) t = t.replace(new RegExp(`\\.${esc(c)}\\b`, 'g'), `.${o.ns}${c}`);
      return `${o.scope} ${t}`;
    }).join(', ');
    rules.push({ media, css: `${scoped} { ${body} }` });
  }

  /* Stylesheets reference the donor's CDN too, and a background-image there is
     just as much an off-origin request as an <img>. The renok hero's backdrop
     hid here for a while: the markup was clean and the page still fetched from
     Webflow on every load. Same maps as the markup; `none` drops a declaration
     the site has no artwork for. */
  const cssMap = { ...(o.images ?? {}), ...(o.cssImages ?? {}) };
  const paint = (url) => {
    if (cssMap[url] !== undefined) return cssMap[url];
    for (const [stem, to] of Object.entries(o.imageStems ?? {})) if (url.includes(stem)) return to;
    return null;
  };
  for (const r of rules) {
    r.css = r.css.replace(/url\((["']?)(https?:\/\/[^"')]+)\1\)/g, (m, q, url) => {
      const to = paint(url);
      if (to === null) throw new Error(`donor ${o.page}: unmapped off-origin asset in css: ${url}\n  map it in images/cssImages/imageStems, or map it to 'none' to drop the declaration`);
      return to === 'none' ? 'none' : `url("${to}")`;
    });
  }

  let sheet = `${o.scope} {\n${vars}\n}\n`;
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
      if (/^(e|a)-\d+/.test(t) || PRESETS.has(t)) t = o.ns + t;
      return t;
    };
    const deep = (n) => {
      if (typeof n === 'string') return rename(n);
      if (Array.isArray(n)) return n.map(deep);
      if (n && typeof n === 'object') return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, deep(v)]));
      return n;
    };

    for (const [k, v] of hits) events[o.ns + k] = deep(v);
    for (const [k, v] of Object.entries(P.actionLists)) {
      if (hits.some(([, e]) => JSON.stringify(e).includes(`"${k}"`))) actionLists[o.ns + k] = deep(v);
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
