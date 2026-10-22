/**
 * Content-hash cache keys for every local file a page loads (Z18).
 *
 * /assets, /css and /js are served `max-age=31536000, immutable`
 * (tools/make-dist.mjs). A browser that once fetched a URL keeps that copy for
 * a year, so a file overwritten in place under the same name — the 29 product
 * screenshots blurred in 550c052, say — reached nobody who had already seen
 * it. Every local URL a page loads therefore carries `?v=<12 hex of sha256>`
 * of the file it names: change a file and its URL changes with it, and pages
 * (cached for 10 minutes) point at the new URL soon after a deploy.
 *
 *   - Pages: images (src, srcset, poster, data-src, data-poster-url, the
 *     comma lists of clip URLs), inline style url(), icons, the share image
 *     (og:image / twitter:image), Lottie JSON under js/, and the stylesheets
 *     and scripts themselves (tools/build-site.mjs calls versionPage last,
 *     before the page's links and assets are moved up for its folder).
 *   - Stylesheets: their url() references (fonts, backgrounds) are versioned
 *     too, in the copy tools/make-dist.mjs writes to dist/ (the sources in
 *     css/ stay as written, so other edits merge cleanly). A stylesheet's own
 *     token is taken over that versioned text, so a font or background that
 *     changes also changes the stylesheet's URL.
 *
 * The token depends on the file's content only: text files (css, js, json,
 * svg) are hashed with CRLF folded to LF, as tools/chrome.mjs always did for
 * stylesheets and scripts, so a Windows checkout builds the same pages. The
 * value is a cache key; what the browser loads is the same file.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE } from './paths.mjs';
import { SITE_URL } from './copy.mjs';

const TEXT = /\.(?:css|js|json|svg|txt)$/i;
const EXT = 'webp|png|jpe?g|gif|svg|avif|ico|mp4|webm|woff2?|ttf|otf|json|css|js|pdf|txt';
const tokens = new Map();

const fileText = (rel) => readFileSync(`${SITE}/${rel}`, 'latin1').replace(/\r\n/g, '\n');

/** The 12-hex token of a site file, by its path from the site root (decoded or not). */
export function assetToken(rel) {
  let key = rel.replace(/^(?:\.\.\/)+|^\//g, '');
  if (!existsSync(`${SITE}/${key}`)) {
    try { key = decodeURIComponent(key); } catch { /* keep it as written */ }
  }
  if (tokens.has(key)) return tokens.get(key);
  if (!existsSync(`${SITE}/${key}`)) throw new Error(`asset-version: no such file ${rel}`);
  const content = /\.css$/i.test(key)
    ? Buffer.from(versionCss(fileText(key)), 'latin1')
    : TEXT.test(key) ? Buffer.from(fileText(key), 'latin1') : readFileSync(`${SITE}/${key}`);
  const token = createHash('sha256').update(content).digest('hex').slice(0, 12);
  tokens.set(key, token);
  return token;
}

/** `path` + `?v=token`, keeping a #fragment last; a URL that already has a query is left alone. */
const withToken = (url, rel) => {
  const hash = url.indexOf('#');
  const [path, frag] = hash === -1 ? [url, ''] : [url.slice(0, hash), url.slice(hash)];
  if (path.includes('?')) return url;
  return `${path}?v=${assetToken(rel ?? path)}${frag}`;
};

/**
 * A stylesheet's text with each url(../assets/…) given its token. Paths in
 * css/ resolve one level up, so `../assets/x` is the site's `assets/x`.
 * Quoted and bare forms; data: URIs, #fragments and remote URLs stay.
 */
export function versionCss(css) {
  return css
    .replace(/url\(\s*(["'])(\.\.\/assets\/[^"']+?)\1\s*\)/g, (_, q, url) => `url(${q}${withToken(url, url.split(/[?#]/)[0].slice(3))}${q})`)
    .replace(/url\(\s*(\.\.\/assets\/[^)"'\s]+)\s*\)/g, (_, url) => `url(${withToken(url, url.split(/[?#]/)[0].slice(3))})`);
}

/**
 * A page with every local asset URL versioned. Paths are still the ones the
 * build writes for a page at the site root (`assets/…`, `css/…`, `js/…`);
 * tools/chrome.mjs relocateAssets moves them up afterwards. A URL counts when
 * it starts an attribute value, a srcset/list entry or a url(); words in the
 * text that merely contain "assets/" do not. The share image's absolute
 * SITE_URL form is versioned in the meta tags only (JSON-LD names the image,
 * it does not load it).
 */
export function versionPage(html) {
  const local = new RegExp(`(^|["'(,\\s]|&quot;)((?:assets|css|js)\\/[^"'\\s,?#&<>]+?\\.(?:${EXT}))(?![\\w.%-])(?!\\?)`, 'gi');
  const site = SITE_URL.replace(/[.]/g, '\\.');
  const meta = new RegExp(`(<meta\\b[^>]*\\scontent=")${site}\\/(assets\\/[^"?#]+)"`, 'g');
  return html
    .replace(meta, (_, a, rel) => `${a}${SITE_URL}/${rel}?v=${assetToken(rel)}"`)
    .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->/g, (m) => `\u0000${Buffer.from(m).toString('base64')}\u0000`)
    .replace(local, (_, pre, url) => `${pre}${withToken(url)}`)
    .replace(/\u0000([A-Za-z0-9+/=]*)\u0000/g, (_, b) => Buffer.from(b, 'base64').toString());
}
