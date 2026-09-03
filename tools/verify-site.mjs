/**
 * Load every built page in a real browser and report what actually happened.
 *
 *   node tools/verify-site.mjs            # expects the site served at BASE_URL
 *
 * Checks, per page: JavaScript errors, failed requests, requests that leave
 * the origin (this site must make none — its audience is behind the GFW and
 * a blocked CDN means a broken page), internal links that resolve to
 * nothing, and Latin text that survived localisation. Also takes a full-page
 * screenshot for the human pass.
 *
 * Exits non-zero if any page could not be loaded: "nothing verified" is a
 * failure, not a pass.
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const require = createRequire('F:/stargo 网站/stargo-work-website/package.json');
const { chromium } = require('@playwright/test');

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4200';
const SITE = 'F:/stargo 网站/stargo-site';
const SHOTS = process.env.SHOTS ?? 'C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/shots-site';
mkdirSync(SHOTS, { recursive: true });

const NAMES = ['index.html', 'intelligence.html', 'capabilities.html', 'workforce.html', 'pricing.html', 'enterprise.html', 'contact.html', 'notices.html', '404.html'];
const PAGES = process.env.ONLY ? process.env.ONLY.split(',') : [...NAMES, ...NAMES.map((n) => `en/${n}`)];

/** Latin tokens that are supposed to be there. */
const ALLOWED = /^(STARGO|WORK|7\.0|AI|CRM|R[0-4]|E\d\d|WF\d\d|jq|json|fp\.[a-z-]+|tests?\/[\w./-]+|[\w.-]+\.(mjs|json)|Activepieces|Chatwoot|MoneyPrinterTurbo|WeKnora|Yente|OpenSanctions|Evolution|Console|Reddit|GEO|Identity|Spine|Playwright|Twenty|Firecrawl|Univer|ModLens|AgentTeams|Infinite|Canvas|Corey|Haines|Marketing|Skills|Puter|Windmill|ERPNext|Medusa|StaffDeck|PostHog|OpenAI|Codex|Channel|Plugin|SDK|Ava|Leo|Mia|Emma|Noah|Scout|Alex|Luna|Owen|Felix|Fiona|Sara|Tara|Moto|Verde|Distribuidora|Subscribe|CIF|Santos|IP67|INMETRO|SG-EM-750|Type-2|PROV-O|SQLite|MIT|OFL|SIL|GSAP|SplitText|ScrollTrigger|Lenis|Lottie|Webflow|jQuery|Inter|Display|Instrument|Serif|Mōno™?|Scalora|Startup|GreenSock|LICENSE|live-verified|demo-verified|pilot|roadmap|research-preview|test-[\w-]+|approval\/asked|DEMO-[\w-]+|first-party|registry|capabilities|workflows|providers|length|select|approvalRequired|true|campaign|DNA|GTM|KYC|MCP|ETL|provider|Open|Font|License|SIL|OFL|STARGO|Nothing|SG)$/;

const browser = await chromium.launch();
let failures = 0;
const summary = [];

for (const page of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.45 });
  const p = await ctx.newPage();
  const errors = [];
  const failed = [];
  const external = new Set();
  p.on('pageerror', (e) => errors.push(String(e).split('\n')[0]));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
  p.on('requestfailed', (r) => { if (!/\.(mp4|webm)$/.test(r.url())) failed.push(r.url()); });
  p.on('request', (r) => { const u = new URL(r.url()); if (u.origin !== new URL(BASE).origin) external.add(u.host); });

  let status = 0;
  try {
    const resp = await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle', timeout: 90000 });
    status = resp?.status() ?? 0;
  } catch (e) {
    console.log(`FAIL ${page}: could not load — ${String(e).split('\n')[0]}`);
    failures++;
    await ctx.close();
    continue;
  }
  await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(70); }
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${SHOTS}/${page.replace('.html', '').replace('/', '-')}.png`, fullPage: true });

  // Rendered text that still carries Latin words.
  const latin = await p.evaluate(() => {
    const out = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const parent = n.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) continue;
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (/[A-Za-z]{3,}/.test(t)) out.add(t.slice(0, 120));
    }
    return [...out];
  });
  const residue = page.startsWith('en/') ? [] : latin.filter((t) => !t.split(/[\s·（）()「」【】、，。：:；;/·—–-]+/).filter(Boolean).every((w) => !/[A-Za-z]{3,}/.test(w) || ALLOWED.test(w)));

  // Internal links must resolve to a file in the site root.
  const hrefs = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
  const dir = page.includes('/') ? `${SITE}/en` : SITE;
  const broken = [...new Set(hrefs.filter((h) => /\.html(#.*)?$/.test(h) && !/^https?:/.test(h)).map((h) => h.split('#')[0]).filter((h) => !existsSync(`${dir}/${h}`)))];
  const dangling = [...new Set(hrefs.filter((h) => h === '#' || h === ''))].length;

  const ok = status === 200 && errors.length === 0 && failed.length === 0 && external.size === 0 && broken.length === 0;
  if (!ok) failures++;
  summary.push({ page, status, height: H, errors, failed: failed.slice(0, 5), external: [...external], broken, hashLinks: dangling, latinResidue: residue.slice(0, 25) });
  await ctx.close();
}
await browser.close();

for (const s of summary) console.log(JSON.stringify(s));
console.log(failures ? `FAIL: ${failures} page(s) with problems` : `PASS: ${summary.length} pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links`);
process.exit(failures ? 1 : 0);
