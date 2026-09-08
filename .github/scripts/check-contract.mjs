/**
 * Pre-flight for the site-verification workflow.
 *
 * The gate is built on four commands — `npm ci`, `npm run build`,
 * `npm run serve`, `npm run verify`. If any of them is missing, the run must
 * stop here with a sentence a human can read, rather than fail later inside
 * setup-node's cache step or, worse, appear to pass having checked nothing.
 *
 * No dependencies: this runs before `npm ci`, on whatever Node the runner ships.
 */
import { existsSync, readFileSync } from 'node:fs';

const problems = [];

if (!existsSync('package.json')) {
  problems.push('package.json is missing — nothing defines how to build or verify this site.');
}
if (!existsSync('package-lock.json')) {
  problems.push('package-lock.json is missing — `npm ci` requires a lockfile.');
}

if (existsSync('package.json')) {
  let scripts = {};
  try {
    scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts ?? {};
  } catch (e) {
    problems.push(`package.json is not valid JSON: ${e.message}`);
  }
  for (const name of ['build', 'serve', 'verify']) {
    if (!scripts[name]) problems.push(`package.json has no "${name}" script.`);
  }
}

// The verifiers read the repository root: the pages, the English mirror, the
// articles and the Pages Function the contact form posts to. If any of those is
// absent the run cannot mean anything.
for (const path of ['index.html', 'en/index.html', 'blog', 'en/blog', 'tools', 'functions/api/contact.js']) {
  if (!existsSync(path)) problems.push(`${path} is missing from the checkout.`);
}

if (problems.length) {
  console.error('RED LIGHT — this checkout cannot be verified:');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  console.error('The gate needs all four of: npm ci / npm run build / npm run serve / npm run verify.');
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    const { appendFileSync } = await import('node:fs');
    appendFileSync(
      summary,
      ['### RED LIGHT — the checkout is missing what the gate needs', '', ...problems.map((p) => `- ${p}`), ''].join('\n'),
    );
  }
  process.exit(1);
}

console.log('package.json, package-lock.json, the build/serve/verify scripts and the site tree are all present.');
