/**
 * The retired host stargo.pages.dev (the site's address from 2026-09-05 to
 * 2026-10-21) answers every page with a permanent redirect to the same page
 * on https://stargowork.com, so search engines move its rankings to the one
 * domain and old links still land (Z17).
 *
 * Only that exact host is redirected. stargowork.com, www and every preview
 * deployment (<hash>.stargo.pages.dev, preview.stargowork.pages.dev, …) are
 * served as before. The contact endpoint (/api/) is never redirected: a 301 on
 * a POST would turn the submission into a GET and lose it. A `.html` address
 * goes straight to its clean URL, so the move is one hop.
 *
 * dist/_routes.json (tools/make-dist.mjs) keeps /assets, /css and /js out of
 * Functions, so this runs for pages and the API only.
 */
const RETIRED_HOST = 'stargo.pages.dev';
const SITE = 'https://stargowork.com';

export function canonicalLocation(url) {
  const u = new URL(url);
  if (u.hostname.toLowerCase() !== RETIRED_HOST) return null;
  if (u.pathname === '/api' || u.pathname.startsWith('/api/')) return null;
  const path = u.pathname
    .replace(/(^|\/)index\.html$/, '$1')
    .replace(/\.html$/, '');
  return `${SITE}${path}${u.search}`;
}

export async function onRequest({ request, next }) {
  const to = (request.method === 'GET' || request.method === 'HEAD') && canonicalLocation(request.url);
  if (to) return new Response(null, { status: 301, headers: { location: to, 'cache-control': 'public, max-age=3600' } });
  return next();
}
