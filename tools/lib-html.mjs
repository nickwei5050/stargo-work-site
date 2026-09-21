/**
 * String-level HTML surgery for Webflow exports.
 *
 * Everything here is deliberately assertive: a replacement that finds nothing
 * throws. On this site a silent no-op is not a cosmetic problem — it leaves a
 * template agency's English claim, price or client name on a Chinese
 * enterprise page. The build must fail loudly instead.
 */

export function makeSub(label) {
  const state = { edits: 0 };
  const fn = (html, old, next, opts = {}) => {
    const n = html.split(old).length - 1;
    if (n === 0) throw new Error(`[${label}] no match: ${JSON.stringify(old).slice(0, 100)}`);
    if (opts.count != null && n !== opts.count) {
      throw new Error(`[${label}] ${JSON.stringify(old).slice(0, 70)}: expected ${opts.count}, found ${n}`);
    }
    if (opts.nth != null) {
      const parts = html.split(old);
      if (parts.length - 1 <= opts.nth) throw new Error(`[${label}] occurrence ${opts.nth} missing`);
      state.edits += 1;
      return parts.slice(0, opts.nth + 1).join(old) + next + parts.slice(opts.nth + 1).join(old);
    }
    state.edits += n;
    return html.split(old).join(next);
  };
  /** Same, but a missing string is fine (shared chrome already localised on some pages). */
  const opt = (html, old, next) => (html.includes(old) ? fn(html, old, next) : html);
  return { fn, opt, state };
}

/** Balanced extraction of the element that opens at `openIdx`. */
export function extractElement(html, openIdx, tagName) {
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
    if (depth === 0) return { start: openIdx, end: c.index + c[0].length, text: html.slice(openIdx, c.index + c[0].length) };
    i = c.index + 1;
  }
  throw new Error(`unbalanced <${tagName}> from ${openIdx}`);
}

/** The nth element `<tag … class="… cls …">` (exact class token), or null. */
export function findByClass(html, tag, cls, nth = 0) {
  const re = new RegExp(`<${tag}\\b[^>]*\\bclass="([^"]*)"`, 'g');
  let m;
  let seen = 0;
  while ((m = re.exec(html))) {
    if (m[1].split(/\s+/).includes(cls)) {
      if (seen === nth) return extractElement(html, m.index, tag);
      seen++;
    }
  }
  return null;
}

export function removeByClass(html, tag, cls, label = cls) {
  const el = findByClass(html, tag, cls);
  if (!el) throw new Error(`[${label}] nothing to remove: <${tag} class~=${cls}>`);
  return html.slice(0, el.start) + html.slice(el.end);
}

/** Element that contains `marker`, found by walking back to the nearest `<tag`. */
export function elementContaining(html, marker, tag, opts = {}) {
  const i = html.indexOf(marker);
  if (i === -1) throw new Error(`marker not found: ${marker}`);
  let from = i;
  for (let hops = 0; hops <= (opts.up ?? 0); hops++) {
    const start = html.lastIndexOf(`<${tag}`, from - 1);
    if (start === -1) throw new Error(`no enclosing <${tag}> for ${marker}`);
    const el = extractElement(html, start, tag);
    if (el.end > i) {
      if (hops === (opts.up ?? 0)) return el;
      from = start;
    } else {
      from = start;   // that element closed before the marker; keep walking back
      hops--;
    }
  }
  throw new Error('unreachable');
}

/** Replace the inner HTML of the single element matched by `openTag` (a literal). */
export function setInner(html, openTag, inner, label = openTag) {
  const n = html.split(openTag).length - 1;
  if (n !== 1) throw new Error(`[${label}] setInner expected 1 match, found ${n}`);
  const i = html.indexOf(openTag);
  const tag = openTag.match(/^<([a-z0-9]+)/)[1];
  const el = extractElement(html, i, tag);
  return html.slice(0, el.start) + openTag + inner + `</${tag}>` + html.slice(el.end);
}

/** Replace the inner HTML of every element opened by `openTag`, in order. */
export function setEachInner(html, openTag, inners, label = openTag) {
  const n = html.split(openTag).length - 1;
  if (n !== inners.length) throw new Error(`[${label}] expected ${inners.length} elements, found ${n}`);
  const tag = openTag.match(/^<([a-z0-9]+)/)[1];
  let out = '';
  let rest = html;
  for (const inner of inners) {
    const i = rest.indexOf(openTag);
    const el = extractElement(rest, i, tag);
    out += rest.slice(0, el.start) + openTag + inner + `</${tag}>`;
    rest = rest.slice(el.end);
  }
  return out + rest;
}

/** Retarget the `<a>` whose content includes `>label<`; optionally relabel it. */
export function setLink(html, label, { href, text, all = false } = {}) {
  const needle = `>${label}<`;
  let idx = html.indexOf(needle);
  if (idx === -1) throw new Error(`setLink: label not found: ${label}`);
  let out = html;
  let guard = 0;
  while (idx !== -1) {
    const aStart = out.lastIndexOf('<a ', idx);
    if (aStart === -1 || out.lastIndexOf('</a>', idx) > aStart) throw new Error(`setLink: ${label} is not inside an <a>`);
    const tagEnd = out.indexOf('>', aStart);
    let tag = out.slice(aStart, tagEnd + 1);
    if (href) tag = tag.replace(/href="[^"]*"/, `href="${href}"`);
    const el = extractElement(out, aStart, 'a');
    let body = el.text.slice(tagEnd + 1 - aStart);
    if (text != null) body = body.split(needle).join(`>${text}<`);
    out = out.slice(0, aStart) + tag + body + out.slice(el.end);
    if (!all) break;
    idx = out.indexOf(needle, aStart + tag.length + body.length);
    if (++guard > 50) throw new Error('setLink runaway');
  }
  return out;
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---- Chinese line breaks between words ------------------------------------
   A browser may break Chinese text between any two characters, so a heading
   narrower than its sentence can split a word across lines (「询盘」 as
   「询 / 盘」). These helpers cut a Chinese string into pieces that a line must
   not break inside, so a page can allow breaks only between them:

     zhWbr(text)   escaped text with <wbr> between the pieces — for text laid
                   out as one run and styled `word-break: keep-all` (which
                   removes every other break between characters);
     zhKeep(text)  escaped text with each piece of two or more characters in
                   <span class="zh-keep">, styled `white-space: nowrap` — for
                   text a script splits into one box per character, where
                   keep-all cannot reach.

   The pieces are ICU's word segments (Intl.Segmenter, built into Node), with
   two repairs. The dictionary leaves some two-character trade words as two
   single characters (询|盘, 获|客, 商|机, 营|销, 账|号, 逐|项), so a single
   character that is not a function word of its own joins the single
   character after it, or else the word before it, or else the word after it.
   Punctuation stays with the piece it closes (、，：…) or opens (「（…), and
   so do the structural particles 的 地 得 之 了 着 过, which a line should not
   start with. Spaces stay spaces: they are break points already. A piece is
   a word or a short phrase, so it always fits a phone's line. */
const ZH_CHAR = /^\p{Script=Han}$/u;
const ZH_ANY = /\p{Script=Han}/u;
/** Characters that are words on their own; a line may break before or after them. */
const ZH_FREE = new Set([...'与和及或并而在于按把被对从向往给让将由为以就都也还又再更最很不仍已']);
/** Particles that belong to the word before them. */
const ZH_TAIL = new Set([...'的地得之了着过']);
const ZH_CLOSE = /^[、，。；：！？）》」』〉】”’…·—%]+$/;
const ZH_OPEN = /^[（《「『〈【“‘]+$/;
const ZH_TRIM = /^[（《「『〈【“‘]+|[、，。；：！？）》」』〉】”’…·—%]+$/g;
let zhSegmenter = null;

export function zhPieces(text) {
  const src = String(text);
  zhSegmenter ??= new Intl.Segmenter('zh-CN', { granularity: 'word' });
  const raw = [...zhSegmenter.segment(src)].map((s) => s.segment);
  const space = (p) => /^\s+$/.test(p);
  /* punctuation onto its neighbour */
  const glued = [];
  let open = '';
  for (const p of raw) {
    if (ZH_OPEN.test(p)) { open += p; continue; }
    const prev = glued[glued.length - 1];
    if (ZH_CLOSE.test(p) && glued.length && !space(prev)) { glued[glued.length - 1] += p; continue; }
    /* 的 on its own, or joined by the dictionary to a locative (建设|中的) */
    const tail = ZH_TAIL.has(p) || /^[中上下里内外前后间][的地得之]$/u.test(p);
    if (tail && glued.length && !space(prev) && ZH_ANY.test(prev) && !ZH_CLOSE.test(prev.slice(-1))) { glued[glued.length - 1] += p; continue; }
    glued.push(open + p);
    open = '';
  }
  if (open) glued.push(open);
  /* lone characters onto a neighbouring word */
  const bare = (p) => p.replace(ZH_TRIM, '');
  const closed = (p) => /[、，。；：！？）》」』〉】”’…·—%]$/.test(p);
  const single = (p) => p !== undefined && ZH_CHAR.test(bare(p)) && !ZH_FREE.has(bare(p));
  const word = (p) => p !== undefined && !space(p) && ZH_ANY.test(p) && !ZH_FREE.has(bare(p));
  const out = [];
  for (let i = 0; i < glued.length; i++) {
    const p = glued[i];
    const next = glued[i + 1];
    const prev = out[out.length - 1];
    if (!single(p)) out.push(p);
    else if (!closed(p) && single(next)) { out.push(p + next); i++; }
    else if (word(prev) && !closed(prev)) out[out.length - 1] = prev + p;
    else if (!closed(p) && word(next)) glued[i + 1] = p + next;
    else out.push(p);
  }
  if (out.join('') !== src) throw new Error(`zhPieces changed the text of "${src}"`);
  return out;
}

export function zhWbr(text) {
  const pieces = zhPieces(text);
  const space = (p) => /^\s+$/.test(p);
  return pieces.map((p, i) => (i && !space(p) && !space(pieces[i - 1]) ? '<wbr>' : '') + escapeHtml(p)).join('');
}

export function zhKeep(text, cls = 'zh-keep') {
  return zhPieces(text).map((p) => (/^\s+$/.test(p) || [...p].length < 2 ? escapeHtml(p) : `<span class="${cls}">${escapeHtml(p)}</span>`)).join('');
}
