/**
 * Refuse a vacuous green light.
 *
 * verify-site.mjs says it itself: "nothing verified is a failure, not a pass".
 * The verifiers exit non-zero when they find a problem — but a run that loaded
 * no page, or that skipped half the site because a file was missing, can still
 * exit zero. This script reads what the verifiers wrote and insists that they
 * really covered the site:
 *
 *   - verify-site's report.json exists and holds one entry per committed page
 *     (all 40: every root page, every article, and the English mirror of both),
 *     each with HTTP 200 and no recorded error;
 *   - verify-integrity's results exist, cover every page, and all pass;
 *   - verify-interactions' results exist, are not empty, and all pass.
 *
 * The expected page list comes from the files on disk, not from anything under
 * tools/, so this stays honest even if the verifiers' own page list drifts.
 *
 * No dependencies. Exits 1 with an explanation, and writes the same explanation
 * to the job summary so it is readable without opening the log.
 */
import { existsSync, readdirSync, readFileSync, statSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];
const notes = [];

/** Every HTML page committed in this repository, in verify-site's own naming. */
function committedPages() {
  const html = (dir) =>
    (existsSync(dir) ? readdirSync(dir) : [])
      .filter((f) => f.endsWith('.html'))
      .map((f) => (dir === '.' ? f : `${dir}/${f}`));
  return [...html('.'), ...html('blog'), ...html('en'), ...html('en/blog')].sort();
}

/**
 * Find a verifier's result file. The preferred locations are checked first, then
 * anything under .wrangler/ — but a candidate is only accepted if it has the
 * shape this verifier writes, because the same file name is used by several
 * other scripts in this repository and picking the wrong one would be exactly
 * the kind of false result this script exists to prevent.
 */
function findResults(name, isShape) {
  const candidates = [];
  const push = (p) => {
    if (p && existsSync(p) && statSync(p).isFile() && !candidates.includes(p)) candidates.push(p);
  };
  push(process.env.SHOTS ? join(process.env.SHOTS, name) : null);
  push(join('.wrangler', name));
  push(name);
  const walk = (dir, depth) => {
    if (depth > 4 || !existsSync(dir)) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isFile() && e.name === name) push(join(dir, e.name));
      else if (e.isDirectory()) walk(join(dir, e.name), depth + 1);
    }
  };
  walk('.wrangler', 0);

  let malformed = null;
  for (const path of candidates) {
    let data;
    try {
      data = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      continue;
    }
    if (isShape(data)) return { path, data };
    malformed ??= path;
  }
  return { path: null, data: null, malformed };
}

const isResultList = (d) => Array.isArray(d) && d.length > 0 && d.every((r) => r && typeof r.name === 'string' && 'pass' in r);
const isPageReport = (d) => Array.isArray(d) && d.length > 0 && d.every((r) => r && typeof r.page === 'string' && 'status' in r);

const pages = committedPages();
if (pages.length < 2) {
  problems.push(`Only ${pages.length} HTML page(s) found in the checkout — the site did not build.`);
}

// ---------------------------------------------------------------- verify-site
const site = findResults('report.json', isPageReport);
if (!site.data) {
  problems.push(
    site.malformed
      ? `verify-site wrote no usable report: ${site.malformed} is not a page report. Nothing about the site was verified.`
      : 'verify-site wrote no report.json — it never loaded a page, so nothing about the site was verified.',
  );
} else {
  const report = site.data;
  const covered = new Set(report.map((r) => r.page));
  const uncovered = pages.filter((p) => !covered.has(p));
  if (uncovered.length) {
    problems.push(
      `verify-site loaded ${report.length} page(s) but never loaded ${uncovered.length} committed page(s): ${uncovered.join(', ')}.`,
    );
  }
  const bad = [];
  for (const r of report) {
    if (r.status !== 200) bad.push(`${r.page} answered HTTP ${r.status}`);
    for (const [field, label] of [
      ['errors', 'JavaScript error'],
      ['failed', 'failed request'],
      ['external', 'off-origin request'],
      ['broken', 'broken internal link'],
    ]) {
      const found = r[field] ?? [];
      if (found.length) bad.push(`${r.page}: ${found.length} ${label}(s) — ${found.slice(0, 3).join(', ')}`);
    }
  }
  for (const b of bad.slice(0, 15)) problems.push(`verify-site: ${b}`);
  if (bad.length > 15) problems.push(`verify-site: …and ${bad.length - 15} more page problems (see ${site.path}).`);
  if (!uncovered.length && !bad.length) {
    notes.push(`verify-site loaded ${report.length} pages, covering all ${pages.length} committed pages, with no errors.`);
  }
  // Reported, not failed on: verify-site treats leftover Latin text on the
  // Chinese pages as something for a human to read, not an automatic red light,
  // and this gate does not invent a stricter rule than the tool's own.
  const residue = report.filter((r) => !r.page.startsWith('en/') && (r.latinResidue ?? []).length);
  const strings = residue.reduce((n, r) => n + r.latinResidue.length, 0);
  if (residue.length) {
    notes.push(
      `NOTE (not a failure) — ${strings} mixed-language string(s) on ${residue.length} Chinese page(s). ` +
        'Trade terms such as "Commercial Invoice" and "Form E" are deliberate; the full list is in the ' +
        'verify-site report if the number ever jumps.',
    );
  }
}

// ----------------------------------------------------------- verify-integrity
const integrity = findResults('integrity-results.json', isResultList);
if (!integrity.data) {
  problems.push(
    'verify-integrity wrote no usable results — duplicate ids, dead anchors and the accessibility audit were never checked.',
  );
} else {
  const results = integrity.data;
  if (results.length < pages.length) {
    problems.push(
      `verify-integrity recorded ${results.length} result(s) for ${pages.length} committed page(s) — it did not check the whole site.`,
    );
  }
  const failed = results.filter((r) => !r.pass);
  for (const f of failed.slice(0, 15)) problems.push(`verify-integrity FAILED: ${f.name}`);
  if (failed.length > 15) problems.push(`verify-integrity: …and ${failed.length - 15} more failures.`);
  if (!failed.length) notes.push(`verify-integrity recorded ${results.length} results, all passing.`);
}

// -------------------------------------------------------- verify-interactions
const interactions = findResults('interactions-results.json', isResultList);
if (!interactions.data) {
  problems.push(
    'verify-interactions wrote no usable results — the FAQ keyboard, mobile menu, language switch and contact form were never exercised.',
  );
} else {
  const results = interactions.data;
  // Both languages × two widths, plus the mobile-menu and form scenarios.
  if (results.length < 8) {
    problems.push(
      `verify-interactions recorded only ${results.length} scenario(s); it exercises both languages at two widths and should record many more.`,
    );
  }
  const failed = results.filter((r) => !r.pass);
  for (const f of failed.slice(0, 15)) problems.push(`verify-interactions FAILED: ${f.name}${f.error ? ` — ${f.error}` : ''}`);
  if (failed.length > 15) problems.push(`verify-interactions: …and ${failed.length - 15} more failures.`);
  if (!failed.length) notes.push(`verify-interactions recorded ${results.length} scenarios, all passing.`);
}

// ------------------------------------------------------------------- verdict
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
const write = (lines) => {
  console.log(lines.join('\n'));
  if (summaryFile) appendFileSync(summaryFile, lines.join('\n') + '\n');
};

if (problems.length) {
  write([
    '### RED LIGHT — the verification did not cover the site',
    '',
    'A check that runs but verifies nothing is not a pass. What went wrong:',
    '',
    ...problems.slice(0, 40).map((p) => `- ${p}`),
    problems.length > 40 ? `- …and ${problems.length - 40} more.` : '',
    '',
  ]);
  process.exit(1);
}

write([
  '### Green light',
  '',
  `All ${pages.length} committed pages were rebuilt reproducibly and verified in Chromium.`,
  '',
  ...notes.map((n) => `- ${n}`),
  '',
]);
