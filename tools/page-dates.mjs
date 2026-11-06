/**
 * Real last-changed dates for sitemap.xml (review items Z17 and Z15, "sitemap lastmod").
 *
 * tools/make-dist.mjs used to write the build day as <lastmod> for every page
 * that is not an article, so each deploy told search engines that the whole
 * site had changed today, and they learn to ignore the field. A date has to
 * come from somewhere the build can read the same way every time: not the clock
 * (two runs on two days would differ), not git (CI checks out a shallow
 * history). So the dates are committed data, tools/data/page-dates.json:
 *
 *   "pricing.html": {"date":"2026-11-05","hash":"a1b2c3d4e5f6"}
 *
 * `hash` is a fingerprint of the page's content (contentHash below: words,
 * title and description, links, image files and alt text, JSON-LD; not tags,
 * classes, aria attributes, scripts, styles or the ?v=<hash> cache keys),
 * `date` the day that fingerprint first appeared. A build that changes none of
 * those changes no date.
 *
 *   node tools/page-dates.mjs                 update: a page whose fingerprint
 *                                             changed (or is new) gets today's
 *                                             date; nothing else is touched.
 *                                             Runs at the end of `npm run build`,
 *                                             so the date is committed with the
 *                                             change it describes, and CI's
 *                                             "a second build changes nothing"
 *                                             check fails if someone forgot.
 *   node tools/page-dates.mjs --check         read-only: exit 1 when a page's date
 *                                             is missing or out of date.
 *   node tools/page-dates.mjs --seed-from-git one-off: set every date to the day
 *                                             the page's fingerprint last changed
 *                                             in the git history (for the first
 *                                             commit of this file, or to
 *                                             re-derive after a history rewrite).
 *
 * tools/make-dist.mjs only reads the file (readPageDates / pageDateFor); it
 * never looks at the clock or at git. SOURCE_DATE_EPOCH, the reproducible-builds
 * convention, pins "today" for update mode so a run can be compared byte for byte.
 *
 * Articles are not in this file: each carries its own date in tools/blog.mjs.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { SITE } from './paths.mjs';
import { SITE_PAGES } from './chrome.mjs';
import { POSTS, postPath } from './blog.mjs';

export const PAGE_DATES_FILE = `${SITE}/tools/data/page-dates.json`;

/** The page files in the sitemap that are not articles, as paths from the site root (both languages). */
export function datedPages() {
  const articles = new Set(POSTS.map(postPath));
  const pages = SITE_PAGES.filter((p) => !articles.has(p));
  return [...pages, ...pages.map((p) => `en/${p}`)];
}

/**
 * 12 hex of the page's content: what a reader or a crawler gets, not how it is
 * marked up. The title, description and share tags, the canonical and language
 * links, the JSON-LD, the visible words, the link targets, the image files and
 * their alt text, in document order. Tags, classes, roles, aria-* attributes,
 * inline styles, scripts, comments and the ?v=<hash> cache keys do not count:
 * retagging a heading, a contrast fix or a stylesheet edit is not a change of
 * the page, and the sitemap must not say it was.
 */
export function contentHash(html) {
  const cut = html.search(/<body[\s>]/);
  const head = cut === -1 ? html : html.slice(0, cut);
  const unstamp = (v) => v.replace(/\?v=[0-9a-f]{16}/g, '');
  const parts = [];
  for (const m of head.matchAll(/<title>([^<]*)<\/title>/g)) parts.push(`title ${m[1]}`);
  for (const m of head.matchAll(/<meta\b[^>]*>/g)) if (/\s(?:name|property)="(?:description|robots|og:[a-z:]+|twitter:[a-z:]+)"/.test(m[0])) parts.push(`meta ${unstamp(m[0])}`);
  for (const m of head.matchAll(/<link\b[^>]*\brel="(?:canonical|alternate)"[^>]*>/g)) parts.push(`link ${m[0]}`);
  for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) parts.push(`ld ${unstamp(m[1]).replace(/\s+/g, ' ')}`);
  const body = (cut === -1 ? '' : html.slice(cut))
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
  parts.push(`text ${body.replace(/<[^>]+>/g, '\n').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')}`);
  for (const m of body.matchAll(/\s(href|src|srcset|poster|data-src|alt)="([^"]*)"/g)) parts.push(`${m[1]} ${unstamp(m[2])}`);
  return createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 12);
}

const pageHash = (rel) => contentHash(readFileSync(`${SITE}/${rel}`, 'utf8'));

export function readPageDates() {
  if (!existsSync(PAGE_DATES_FILE)) return {};
  return JSON.parse(readFileSync(PAGE_DATES_FILE, 'utf8'));
}

/** One line per page, sorted, so two branches that change different pages merge without a conflict. */
function serialise(entries) {
  const keys = Object.keys(entries).sort();
  return `{\n${keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify({ date: entries[k].date, hash: entries[k].hash })}`).join(',\n')}\n}\n`;
}

/** For make-dist: the recorded date of a page file; stale entries warn, missing ones fail. */
export function pageDateFor(rel, dates = readPageDates()) {
  const entry = dates[rel];
  if (!entry) throw new Error(`page-dates: no recorded date for ${rel}. Run \`npm run build\` (tools/page-dates.mjs) and commit tools/data/page-dates.json.`);
  if (entry.hash !== pageHash(rel)) console.warn(`page-dates: ${rel} changed since its date (${entry.date}) was recorded; the sitemap keeps ${entry.date}. Run \`npm run build\` and commit tools/data/page-dates.json.`);
  return entry.date;
}

const today = () => new Date(process.env.SOURCE_DATE_EPOCH ? +process.env.SOURCE_DATE_EPOCH * 1000 : Date.now()).toISOString().slice(0, 10);

function gitDateOfLastChange(rel) {
  const git = (...args) => execFileSync('git', args, { cwd: SITE, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  const log = git('log', '--format=%H %cs', '--', rel).trim().split('\n').filter(Boolean).map((l) => l.split(' '));
  if (!log.length) return today();
  const now = pageHash(rel);
  for (let i = 0; i < log.length && i < 800; i++) {
    let h;
    try { h = contentHash(git('show', `${log[i][0]}:${rel}`)); } catch { h = null; }
    if (h !== now) return i === 0 ? today() : log[i - 1][1];
  }
  return log[log.length - 1][1];
}

const main = () => {
  const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--seed-from-git') ? 'seed' : 'update';
  const have = readPageDates();
  const next = {};
  const changed = [];
  for (const rel of datedPages()) {
    if (!existsSync(`${SITE}/${rel}`)) throw new Error(`page-dates: ${rel} is in the sitemap list but has not been built`);
    const hash = pageHash(rel);
    const old = have[rel];
    if (mode === 'seed') { next[rel] = { date: gitDateOfLastChange(rel), hash }; if (!old || old.hash !== hash || old.date !== next[rel].date) changed.push(rel); }
    else if (old && old.hash === hash) next[rel] = old;
    else { next[rel] = { date: mode === 'check' && old ? old.date : today(), hash }; changed.push(rel); }
  }
  const text = serialise(next);
  if (mode === 'check') {
    if (changed.length) {
      console.error(`page-dates: ${changed.length} page(s) have no current date in tools/data/page-dates.json:\n  ${changed.join('\n  ')}\nRun \`npm run build\` and commit the file.`);
      process.exit(1);
    }
    console.log(`page-dates: ${Object.keys(next).length} pages, all dates current`);
    return;
  }
  if (!existsSync(PAGE_DATES_FILE) || readFileSync(PAGE_DATES_FILE, 'utf8') !== text) writeFileSync(PAGE_DATES_FILE, text);
  console.log(`page-dates: ${Object.keys(next).length} pages, ${changed.length} dated ${mode === 'seed' ? 'from git history' : today()}${changed.length && changed.length <= 12 ? `: ${changed.join(', ')}` : ''}`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
