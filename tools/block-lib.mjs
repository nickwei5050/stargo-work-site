/**
 * The pieces every capability-page block module shares.
 *
 * Blocks live one per file in tools/blocks so they can be written independently.
 * This module is what they are given to work with, and what the build uses to
 * load them: keeping the loader here means tools/capability-donors.mjs (which
 * extracts) and tools/build-site.mjs (which renders) agree on one contract.
 */
import { readdirSync } from 'node:fs';
export { escapeHtml } from './lib-html.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const TPL = `${SITE}/tools/templates`;

/**
 * The donor templates, with the class prefix that keeps each one's styles off
 * the rest of the site and the stylesheet name the capability page links.
 */
export const DONORS = {
  renok: { ns: 'rk-', sheet: 'renok.rk.css', dir: `${TPL}/renok` },
  qubix: { ns: 'qx-', sheet: 'qubix.qx.css', dir: `${TPL}/qubix` },
  cinery: { ns: 'cn-', sheet: 'cinery.cn2.css', dir: `${TPL}/cinery` },
  lumenis: { ns: 'lm2-', sheet: 'lumenis.lm2.css', dir: `${TPL}/lumenis` },
};

/**
 * A capability's name as this site writes it. The review was explicit: the
 * Chinese page carries Chinese only and the English page English only —
 * "不是所有的观众都能看得懂英文" — so no bilingual subtitle. A capability
 * with no Chinese name yet falls back to its product name rather than to
 * nothing.
 */
export const capTitle = (lang) => (name, zhName) => (lang === 'zh' ? (zhName || name) : name);

/**
 * Resolve a capability name against the register, so a block can print the
 * catalogue's own gloss and a renamed capability fails the build instead of
 * quietly disappearing from the page.
 */
export function capability(C, name) {
  for (const g of C.CAPABILITY_GROUPS) {
    for (const [item, gloss, zhName] of g.items) if (item === name) return { name: item, gloss, zhName, group: g };
  }
  throw new Error(`capability "${name}" is not in CAPABILITY_GROUPS`);
}

/** Every block module, by id, in a stable order. */
export async function loadBlocks() {
  const out = new Map();
  for (const f of readdirSync(`${SITE}/tools/blocks`).filter((n) => n.endsWith('.mjs')).sort()) {
    const m = await import(`file:///${encodeURI(`${SITE}/tools/blocks/${f}`)}`);
    if (!m.donor?.id) throw new Error(`tools/blocks/${f}: no donor.id export`);
    if (typeof m.render !== 'function') throw new Error(`tools/blocks/${f}: no render export`);
    if (out.has(m.donor.id)) throw new Error(`two block modules claim id ${m.donor.id}`);
    out.set(m.donor.id, m);
  }
  return out;
}

/** This site's own editorial artwork, standing in for a donor's stock photos. */
export const art = (name) => `assets/stargo-editorial/${name}.webp`;

/**
 * Cut one repeating unit out of a fragment and return {head, unit, tail}.
 * `open` must be the exact substring each unit starts with.
 */
export function splitRepeat(frag, open, closeAt) {
  const starts = [];
  for (let i = frag.indexOf(open); i >= 0; i = frag.indexOf(open, i + 1)) starts.push(i);
  if (starts.length < 2) throw new Error(`splitRepeat: found ${starts.length} units for ${open.slice(0, 50)}`);
  const end = closeAt ?? starts[starts.length - 1] + (starts[1] - starts[0]);
  return {
    head: frag.slice(0, starts[0]),
    units: starts.map((at, i) => frag.slice(at, starts[i + 1] ?? end)),
    tail: frag.slice(end),
  };
}

/**
 * Replace the text inside the first element matching a class, keeping the tag
 * and every attribute on it. Throws when the element is not there, because a
 * silent miss ships the donor's own copy.
 */
const textRe = (cls, flags) =>
  new RegExp('(<([a-z0-9]+)[^>]*class="[^"]*(?<![-\\w])' + cls + '(?![-\\w])[^"]*"[^>]*>)([\\s\\S]*?)(</\\2>)', flags);

export function setText(html, cls, text) {
  const re = textRe(cls, '');
  if (!re.test(html)) throw new Error(`setText: no element with class ${cls}`);
  return html.replace(re, (m, open, tag, inner, close) => `${open}${text}${close}`);
}

/** Every occurrence, for the copies a roll-over button keeps in sync. */
export function setTextAll(html, cls, text) {
  let n = 0;
  const out = html.replace(textRe(cls, 'g'), (m, open, tag, inner, close) => { n++; return `${open}${text}${close}`; });
  if (!n) throw new Error(`setTextAll: no element with class ${cls}`);
  return out;
}
