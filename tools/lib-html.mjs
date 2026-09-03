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
