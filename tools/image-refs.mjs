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

/** Let the browser pick a lazy image's srcset candidate from the width it is
    actually laid out at (`sizes="auto"`, Chrome 126+), keeping the template's
    own `sizes` as the fallback for browsers that do not read `auto`. Webflow
    writes `sizes` for the widest the image can be — `(max-width: 1024px)
    100vw, 1024px` on testimonial avatars drawn 48 px wide — so a phone at 3x
    fetched the largest file for every one of them. Only lazy images qualify
    (the HTML rule); what is drawn does not change, only which file fills it. */
export function autoSizes(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    if (!/\sloading="lazy"/.test(tag) || !/\ssrcset="/.test(tag)) return tag;
    const m = tag.match(/\ssizes="([^"]*)"/);
    if (!m) return tag.replace('<img', '<img sizes="auto"');
    if (/^\s*auto\b/.test(m[1])) return tag;
    return tag.replace(m[0], ` sizes="auto, ${m[1]}"`);
  });
}
