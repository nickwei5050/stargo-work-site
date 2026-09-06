/**
 * Assemble dist/ — the site files only (no tools/, no templates, no .git) —
 * plus Cloudflare Pages `_headers`, robots.txt and sitemap.xml. Wrangler
 * compiles the root functions/ directory separately; never publish its source
 * in the static output directory. Deploy with:
 *
 *   node tools/make-dist.mjs
 *   node <wrangler> pages deploy dist --project-name stargo --branch main --commit-dirty=true
 *
 * Deploy with the local proxy bypassed (HTTP_PROXY/HTTPS_PROXY/ALL_PROXY
 * unset): through the proxy the upload API times out; direct works.
 *
 * dist/ is synchronised in place rather than deleted and recreated: on this
 * Windows volume Node's recursive remove intermittently fails on an open or
 * just-copied file. Files are overwritten, and anything in dist/ that no
 * longer exists in the source tree is removed one by one.
 */
import { mkdirSync, copyFileSync, readdirSync, writeFileSync, unlinkSync, rmdirSync, chmodSync, existsSync } from 'node:fs';
import { SITE_URL } from './copy.mjs';
import { SITE_PAGES } from './chrome.mjs';
import { POSTS, postPath } from './blog.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const DIST = `${SITE}/dist`;
mkdirSync(DIST, { recursive: true });

const wanted = new Set();
const walk = (dir, rel, out) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(`${dir}/${e.name}`, r, out); else out.add(r);
  }
};
for (const f of readdirSync(SITE)) if (f.endsWith('.html')) wanted.add(f);
for (const d of ['en', 'blog', 'assets', 'css', 'js']) if (existsSync(`${SITE}/${d}`)) walk(`${SITE}/${d}`, d, wanted);
const GENERATED = ['_headers', 'robots.txt', 'sitemap.xml'];
for (const g of GENERATED) wanted.add(g);

for (const rel of wanted) {
  if (GENERATED.includes(rel)) continue;
  const to = `${DIST}/${rel}`;
  mkdirSync(to.slice(0, to.lastIndexOf('/')), { recursive: true });
  // copyFileSync after an explicit unlink: cpSync's own overwrite intermittently
  // fails on this volume with a spurious "operation completed successfully".
  if (existsSync(to)) { try { chmodSync(to, 0o666); unlinkSync(to); } catch (e) { console.warn(`could not replace ${rel}: ${e.message}`); } }
  copyFileSync(`${SITE}/${rel}`, to);
}

// Long cache for the hashed template assets, short for pages; the specific
// rule clears the general one first, otherwise Pages appends both values.
writeFileSync(`${DIST}/_headers`, [
  '/*',
  '  Cache-Control: public, max-age=600',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  X-Frame-Options: SAMEORIGIN',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '/assets/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/css/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '/js/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '/api/*',
  '  ! Cache-Control',
  '  Cache-Control: no-store',
  '',
].join('\n'));

// robots + sitemap (clean URLs, both languages, hreflang alternates).
const pages = SITE_PAGES;
const clean = (lang, p) => `${SITE_URL}/${lang === 'en' ? 'en/' : ''}${p === 'index.html' ? '' : p.replace(/\.html$/, '')}`;
const today = new Date().toISOString().slice(0, 10);
const postDate = Object.fromEntries(POSTS.map((post) => [postPath(post), post.modified ?? post.date]));
const urls = [];
for (const p of pages) {
  for (const lang of ['zh', 'en']) {
    urls.push(`  <url><loc>${clean(lang, p)}</loc><lastmod>${postDate[p] ?? today}</lastmod>` +
      `<xhtml:link rel="alternate" hreflang="zh-CN" href="${clean('zh', p)}"/><xhtml:link rel="alternate" hreflang="en" href="${clean('en', p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${clean('zh', p)}"/>` +
      `<priority>${p === 'index.html' ? '1.0' : /privacy|terms|notices/.test(p) ? '0.2' : p.startsWith('blog/') ? '0.6' : '0.8'}</priority></url>`);
  }
}
writeFileSync(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// Prune what the source tree no longer has.
const present = new Set();
walk(DIST, '', present);
let pruned = 0;
for (const rel of present) {
  if (wanted.has(rel)) continue;
  const p = `${DIST}/${rel}`;
  try { chmodSync(p, 0o666); unlinkSync(p); pruned++; } catch (e) { console.warn(`could not remove stale ${rel}: ${e.message}`); }
}
const pruneDirs = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) pruneDirs(`${dir}/${e.name}`);
  if (dir !== DIST && readdirSync(dir).length === 0) rmdirSync(dir);
};
pruneDirs(DIST);
console.log(`dist: ${wanted.size} files (${pruned} stale removed)`);
