/**
 * Google tag for GTM container GTM-MCGTFDLR (snippet as Google gives it, 2026-11-11). Google asks for it right after
 * <head>, once per page. This writes it into every published page (root *.html, en/, blog/), replacing any earlier
 * copy so it is never doubled; `--check` only reports pages that lack it or carry it more than once. It runs at the
 * end of `npm run build` and as a check in make-dist, so a rebuilt page cannot ship without it. GA4 and any other
 * Google tag are configured inside the GTM container, never as a second tag on the page.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { SITE } from './paths.mjs';

export const GTM_ID = 'GTM-MCGTFDLR';
export const GOOGLE_TAG = `<!-- Google tag (${GTM_ID}) --><script async src="https://www.googletagmanager.com/gtm.js?id=${GTM_ID}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());</script><!-- /Google tag -->`;
const BLOCK = /<!-- Google tag \(GTM-[A-Z0-9]+\) -->[\s\S]*?<!-- \/Google tag -->/g;

export function pages() {
  const out = readdirSync(SITE).filter((f) => f.endsWith('.html'));
  const walk = (dir) => {
    if (!existsSync(`${SITE}/${dir}`)) return;
    for (const e of readdirSync(`${SITE}/${dir}`, { withFileTypes: true })) {
      if (e.isDirectory()) walk(`${dir}/${e.name}`);
      else if (e.name.endsWith('.html')) out.push(`${dir}/${e.name}`);
    }
  };
  walk('en'); walk('blog');
  return out;
}

export function withTag(html) {
  const clean = html.replace(BLOCK, '');
  if (!/<head>/.test(clean)) throw new Error('google-tag: page has no <head>');
  return clean.replace('<head>', `<head>${GOOGLE_TAG}`);
}

export function problems(rel, html) {
  const n = html.split(`gtm.js?id=${GTM_ID}`).length - 1;
  if (n !== 1) return `${rel}: Google tag appears ${n} times`;
  if (!html.includes(`<head>${GOOGLE_TAG}`)) return `${rel}: Google tag is not right after <head>`;
  if (/googletagmanager\.com\/gtag\/js/.test(html)) return `${rel}: a separate gtag.js tag is present`;
  return null;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('google-tag.mjs')) {
  const check = process.argv.includes('--check');
  const bad = [];
  let changed = 0;
  for (const rel of pages()) {
    const html = readFileSync(`${SITE}/${rel}`, 'utf8');
    if (check) { const p = problems(rel, html); if (p) bad.push(p); continue; }
    const next = withTag(html);
    if (next !== html) { writeFileSync(`${SITE}/${rel}`, next); changed++; }
  }
  if (check) {
    if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
    console.log(`google-tag: ${pages().length} pages carry ${GTM_ID} once, right after <head>`);
  } else console.log(`google-tag: ${changed} pages updated`);
}

/**
 * For the browser checks: answer the GTM request with an empty script so a run neither depends on reaching Google
 * (blocked in mainland China, where these checks also run) nor sends test visits into the live container. Returns
 * the list of GTM URLs the page asked for, so a check can require exactly one. The host is then not an off-origin
 * request the page made on its own: callers leave GTM_HOST out of their "external" list.
 */
export const GTM_HOST = 'www.googletagmanager.com';
export async function stubGoogleTag(page) {
  const seen = [];
  await page.route(`https://${GTM_HOST}/**`, (route) => { seen.push(route.request().url()); return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }); });
  return seen;
}
