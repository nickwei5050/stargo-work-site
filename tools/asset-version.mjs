/**
 * Cache keys for asset URLs (review, round 3).
 *
 * dist/_headers serves /assets/* for a year, immutable (tools/make-dist.mjs):
 * a browser that has a file never asks for it again. Round 2 replaced 70
 * pictures in place — the blog covers, the product renders — under the same
 * names, so a returning visitor would have kept the old ones (covers without
 * the demo-data label, a sidebar render with an upstream name) for up to a
 * year. Since then every asset URL the site writes carries ?v=<the first 12
 * hex of the file's SHA-256>, the way tools/chrome.mjs has always versioned
 * css/ and js/ and tools/ow-blocks/demo-video.mjs the films: a changed file
 * is a new URL, an unchanged one keeps its cache.
 *
 * - tools/build-site.mjs versions every reference in a page (src, srcset,
 *   href, poster, data-*, og:image / twitter:image, the JSON-LD image and
 *   logo URLs, url() in inline styles) and fails the build on any that is
 *   left without its key.
 * - tools/make-dist.mjs versions url() in the stylesheets it ships, and
 *   tools/chrome.mjs folds those keys into the stylesheet's own ?v=, so a
 *   changed font or picture also gives the stylesheet a new URL.
 * - tools/verify-release.mjs checks that every asset reference in dist/
 *   carries the key of the file it names.
 *
 * The hash of a text file (SVG, JSON …) is taken with CRLF folded to LF, as
 * tools/chrome.mjs does for css/js, so a Windows checkout builds the same
 * pages; a binary file is hashed as it is.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE } from './paths.mjs';

const TEXT = /\.(?:svg|json|css|js|txt|xml|html?)$/i;
const hashes = new Map();

/** First 12 hex of the SHA-256 of `rel` (a path under the root: assets/…), or null when there is no such file. */
export function assetHash(rel, root = SITE) {
  const key = `${root}\n${rel}`;
  if (!hashes.has(key)) {
    const file = `${root}/${rel}`;
    if (!existsSync(file) || !statSync(file).isFile()) hashes.set(key, null);
    else {
      let bytes = readFileSync(file);
      if (TEXT.test(rel)) bytes = Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
      hashes.set(key, createHash('sha256').update(bytes).digest('hex').slice(0, 12));
    }
  }
  return hashes.get(key);
}

/* An asset reference: `assets/…` right after a quote, =, (, a comma, a space
   or the ; of &quot; — relative (../assets/), root-absolute (/assets/) or in
   an absolute URL (https://…/assets/) — up to the first character such a URL
   never holds here. Group 3 is what follows it. */
const REF = /(?<=[\s"'(=,;])((?:https?:\/\/[^/"'\s<>]+)?\/|(?:\.\.\/)*)(assets\/[^"'()\s<>,?#\\&]+)([?#][^"'()\s<>,\\&]*)?/g;
/** The repository path a reference names (percent-decoding as a server does), or the reference as written. */
const fileOf = (path) => { try { return decodeURIComponent(path); } catch { return path; } };

/**
 * `text` with ?v=<hash> after every reference to an existing asset file that
 * has no query yet; a reference that already carries ?v= gets the current
 * key. References to files that do not exist are left alone (the build's
 * missing-asset check reports those).
 */
export function versionAssets(text, root = SITE) {
  return text.replace(REF, (whole, prefix, path, rest = '') => {
    const v = assetHash(fileOf(path), root);
    if (!v) return whole;
    if (!rest) return `${prefix}${path}?v=${v}`;
    if (/^\?v=[0-9a-f]{12}(?=$|#)/.test(rest)) return `${prefix}${path}?v=${v}${rest.slice(15)}`;
    return whole;   // another query or a fragment: not ours to touch, and unversionedAssets() reports it
  });
}

/** Every reference to an existing asset file in `text` that does not carry the file's current ?v= key. */
export function unversionedAssets(text, root = SITE) {
  const bad = [];
  for (const m of text.matchAll(REF)) {
    const v = assetHash(fileOf(m[2]), root);
    if (v && (m[3] ?? '').slice(0, 15) !== `?v=${v}`) bad.push(`${m[1]}${m[2]}${m[3] ?? ''}`);
  }
  return bad;
}
