/**
 * One command a runner can call: serve the repository, wait for it, run the
 * three verifiers that gate a release, shut the server down again.
 *
 *   node tools/verify-all.mjs
 *   BASE_URL=https://stargo.pages.dev node tools/verify-all.mjs   # verify something already served
 *   node tools/verify-all.mjs verify-editorial.mjs                # a different set
 *
 * With BASE_URL set, no server is started — the site is assumed to be up at
 * that address. Without it, tools/serve.mjs is started on 127.0.0.1:4200 and
 * stopped again however this process ends, so a failed verifier never leaves a
 * port held on the runner.
 *
 * node: builtins only. Exit code is the first failure's, so `&&` chains and CI
 * steps behave the way they read.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { SITE } from './paths.mjs';

const DEFAULT = ['verify-site.mjs', 'verify-integrity.mjs', 'verify-interactions.mjs'];
const steps = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;

const external = Boolean(process.env.BASE_URL);
const PORT = Number(process.env.PORT || 4200);
const HOST = process.env.HOST || '127.0.0.1';
const BASE = process.env.BASE_URL || `http://${HOST}:${PORT}`;

const run = (args, env) => new Promise((resolve) => {
  const child = spawn(process.execPath, args, { cwd: SITE, stdio: 'inherit', env: { ...process.env, ...env } });
  child.on('exit', (code, signal) => resolve(signal ? 1 : code ?? 1));
});

let server = null;
const stop = () => { if (server && server.exitCode === null) server.kill(); server = null; };

if (!external) {
  server = spawn(process.execPath, [`${SITE}/tools/serve.mjs`], { cwd: SITE, stdio: 'inherit' });
  server.on('exit', (code) => { if (code) { console.error(`serve exited with ${code}`); process.exit(1); } });
  process.on('exit', stop);
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stop(); process.exit(1); });

  /* Ready when the homepage answers, not when listen() returns: the verifiers
     fail confusingly against a socket that is open but serving nothing. */
  let up = false;
  for (let i = 0; i < 100 && !up; i++) {
    try { up = (await fetch(`${BASE}/index.html`, { method: 'HEAD' })).ok; } catch { await sleep(100); }
  }
  if (!up) { console.error(`serve: ${BASE} did not come up`); stop(); process.exit(1); }
  console.log(`verify-all: ${BASE} is up`);
}

let failed = 0;
for (const step of steps) {
  const file = step.includes('/') ? step : `${SITE}/tools/${step}`;
  console.log(`\n=== ${step} ===`);
  const code = await run([file], { BASE_URL: BASE });
  if (code) { failed = failed || code; console.error(`FAIL ${step} (exit ${code})`); }
}

stop();
console.log(failed ? `\nverify-all: FAILED` : `\nverify-all: all ${steps.length} verifiers passed`);
process.exit(failed);
