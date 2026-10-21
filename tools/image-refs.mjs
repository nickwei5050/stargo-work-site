/**
 * Swap heavy JPEG/PNG references for their same-size WebP copies.
 *
 * tools/optimize-images.mjs writes the copies and tools/data/image-webp.json;
 * this rewrites, in a page or a stylesheet, the places a browser fetches an
 * image from: src, srcset, data-src, poster, data-poster-url and CSS url().
 * Everything else that names an image (og:image, twitter:image, icons,
 * JSON-LD) keeps the original, because some link-preview crawlers still do not
 * read WebP. The copies have the originals' pixel sizes, so layout is
 * untouched.
 */
import { readFileSync, existsSync } from 'node:fs';
import { SITE } from './paths.mjs';

const MANIFEST = `${SITE}/tools/data/image-webp.json`;
let map = null;
const load = () => (map ??= existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')).images : {});

function swap(url) {
  const images = load();
  const m = url.match(/^((?:\.\.\/)*)(assets\/[^?#]+)(.*)$/);
  if (!m) return url;
  const [, up, path, rest] = m;
  let plain;
  try { plain = decodeURIComponent(path); } catch { return url; }
  const to = images[plain];
  if (!to) return url;
  return up + (path.includes('%') ? encodeURI(to) : to) + rest;
}

/** Rewrite the image URLs a browser fetches in an HTML page. */
export function webpPage(html) {
  if (!Object.keys(load()).length) return html;
  return html
    .replace(/(\s(?:src|data-src|poster|data-poster-url)=")([^"]+)(")/g, (_, a, u, b) => a + swap(u) + b)
    .replace(/(\ssrcset=")([^"]+)(")/g, (_, a, list, b) => a + list.split(',').map((c) => {
      const lead = c.match(/^\s*/)[0];
      const [u, ...d] = c.trim().split(/\s+/);
      return lead + [swap(u), ...d].join(' ');
    }).join(',') + b)
    .replace(/url\((&quot;|["']?)([^"')&]+)/g, (_, q, u) => `url(${q}${swap(u)}`);
}

/** Rewrite the image URLs in a stylesheet. */
export function webpSheet(css) {
  if (!Object.keys(load()).length) return css;
  return css.replace(/url\((["']?)([^"')]+)/g, (_, q, u) => `url(${q}${swap(u)}`);
}
