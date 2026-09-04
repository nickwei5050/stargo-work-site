/**
 * Assemble dist/ — the site files only (no tools/, no templates, no .git) —
 * plus Cloudflare Pages `_headers`. Deploy with:
 *
 *   node tools/make-dist.mjs
 *   node <wrangler> pages deploy dist --project-name stargo --branch main --commit-dirty=true
 *
 * Deploy with the local proxy bypassed (HTTP_PROXY/HTTPS_PROXY/ALL_PROXY
 * unset): through the proxy the upload API times out; direct works.
 */
import { rmSync, mkdirSync, cpSync, readdirSync, writeFileSync } from 'node:fs';

const SITE = 'F:/stargo 网站/stargo-site';
const DIST = `${SITE}/dist`;
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
for (const f of readdirSync(SITE)) {
  if (f.endsWith('.html')) cpSync(`${SITE}/${f}`, `${DIST}/${f}`);
}
for (const d of ['en', 'assets', 'css', 'js']) cpSync(`${SITE}/${d}`, `${DIST}/${d}`, { recursive: true });

// Long cache for the hashed template assets, short for pages, and the more
// specific rule must clear the general one first (Pages appends otherwise).
writeFileSync(`${DIST}/_headers`, [
  '/*',
  '  Cache-Control: public, max-age=600',
  '  X-Content-Type-Options: nosniff',
  '/assets/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/css/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '/js/*',
  '  ! Cache-Control',
  '  Cache-Control: public, max-age=86400',
  '',
].join('\n'));
let n = 0;
const count = (dir) => { for (const e of readdirSync(dir, { withFileTypes: true })) e.isDirectory() ? count(`${dir}/${e.name}`) : n++; };
count(DIST);
console.log(`dist: ${n} files`);
