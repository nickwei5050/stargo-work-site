// Vendored from nickwei5050/website-SEO- integrations/site-kit/crawler-log (version 1.0.2). Do not edit here; update there and re-copy.
// Growth OS crawler log (site-kit, version in VERSION): a pass-through Cloudflare Worker for brand sites that are
// proxied by Cloudflare but do not run their own Worker (WordPress, static hosts, SaaS builders).
//
// Attach it as a Worker ROUTE on the zone (e.g. `example.com/*` and `www.example.com/*`). Every request goes to the
// origin unchanged (`fetch(request)`); the Worker only notes who asked:
//   - search crawlers, AI crawlers and AI assistants (self-declared User-Agent token, see bots.mjs)
//   - people who arrive from an AI answer (Referer or utm_source)
// into Workers Analytics Engine (binding VISITS), and answers `GET /api/crawlers?days=N` with aggregated counts read
// through the Analytics SQL binding (ANALYTICS_SQL). The console traffic page reads that endpoint.
//
// Same data shape as the stargogrowth.com Worker (telemetry.js there), so the console needs no change.
// Ordinary human visits are not recorded (Umami covers people). No IPs or User-Agent strings are stored or returned.
// If anything here throws, the visitor still gets the origin response.
import { BOTS } from './bots.mjs';

// Tokens too generic to identify a crawler on their own ("Code" would match VSCode, "nbot" msnbot): skipped.
export const AMBIGUOUS_TOKENS = new Set(['code', 'muse', 'trae', 'nbot', 'spider', 'operator', 'instinct', 'cursor']);
const escapeRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longest token first (bots.mjs is sorted that way), matched as a whole word: not preceded or followed by a letter
// or digit, so "Claude-SearchBot" wins over "Claude" and "LinkedInBot" never matches "nbot".
const MATCHERS = BOTS
  .filter(([token]) => !AMBIGUOUS_TOKENS.has(token.toLowerCase()))
  .map(([token, operator, category]) => [new RegExp(`(?:^|[^a-z0-9])${escapeRe(token.toLowerCase())}(?![a-z0-9])`), token, operator, category]);

const AI_REFERRER_HOSTS = [
  ['chatgpt.com', 'ChatGPT'], ['chat.openai.com', 'ChatGPT'], ['perplexity.ai', 'Perplexity'], ['claude.ai', 'Claude'],
  ['gemini.google.com', 'Gemini'], ['copilot.microsoft.com', 'Copilot'],
  ['chat.deepseek.com', 'DeepSeek'], ['kimi.com', 'Kimi'], ['kimi.moonshot.cn', 'Kimi'], ['doubao.com', 'Doubao'],
  ['yuanbao.tencent.com', 'Yuanbao'], ['tongyi.aliyun.com', 'Qwen'], ['chat.qwen.ai', 'Qwen'], ['grok.com', 'Grok'],
  ['meta.ai', 'Meta AI'], ['you.com', 'You.com'], ['poe.com', 'Poe'], ['phind.com', 'Phind'], ['metaso.cn', 'Metaso'],
];
// utm_source values AI apps add to links (chatgpt.com, perplexity, …) → one canonical name each, never the raw value.
const AI_UTM = [
  [/^chatgpt/, 'ChatGPT'], [/^perplexity/, 'Perplexity'], [/^claude/, 'Claude'], [/^gemini/, 'Gemini'],
  [/^copilot/, 'Copilot'], [/^deepseek/, 'DeepSeek'], [/^kimi/, 'Kimi'], [/^doubao/, 'Doubao'],
];

export function classifyAgent(ua) {
  const u = String(ua || '').toLowerCase();
  if (!u) return null;
  for (const [re, token, operator, category] of MATCHERS) if (re.test(u)) return { name: token, operator, category };
  return null;
}

const hostMatches = (host, domain) => host === domain || host.endsWith(`.${domain}`);

/** AI answer engine a visitor came from, by Referer hostname or utm_source; a canonical name or null. */
export function aiReferral(referer, utmSource) {
  let ref = null;
  try { ref = referer ? new URL(String(referer)) : null; } catch { ref = null; }
  if (ref) {
    const host = ref.hostname.toLowerCase().replace(/\.$/, '');
    for (const [domain, name] of AI_REFERRER_HOSTS) if (hostMatches(host, domain)) return name;
    if ((host === 'bing.com' || host === 'www.bing.com') && /^\/chat(\/|$)/.test(ref.pathname)) return 'Copilot';
  }
  const utm = String(utmSource || '').trim().toLowerCase();
  if (utm) {
    for (const [domain, name] of AI_REFERRER_HOSTS) if (utm === domain) return name;
    for (const [re, name] of AI_UTM) if (re.test(utm)) return name;
  }
  return null;
}

/** 'page' for documents, md/txt/xml/json for machine-readable files, null for images, css, js, fonts, video. */
export function formatOf(pathname) {
  if (pathname === '/mcp' || pathname === '/mcp/') return 'mcp';
  const last = pathname.split('/').pop() || '';
  const m = /\.([a-z0-9]+)$/i.exec(last);
  if (!m) return 'page';
  const ext = m[1].toLowerCase();
  if (['html', 'htm', 'php', 'asp', 'aspx'].includes(ext)) return 'page';
  return ['md', 'txt', 'xml', 'json'].includes(ext) ? ext : null;
}

export function recordVisit(env, request, url, status) {
  try {
    if (!env || !env.VISITS) return;
    const format = formatOf(url.pathname);
    if (!format) return;
    const country = (request.cf && request.cf.country) || '';
    const bot = classifyAgent(request.headers.get('User-Agent'));
    if (bot) {
      env.VISITS.writeDataPoint({
        indexes: [bot.name.slice(0, 96)],
        blobs: ['bot', bot.name, bot.operator, bot.category, url.pathname.slice(0, 300), format, country, 'claimed'],
        doubles: [1, status],
      });
      return;
    }
    if (format !== 'page') return;
    const ref = aiReferral(request.headers.get('Referer'), url.searchParams.get('utm_source'));
    if (ref) {
      env.VISITS.writeDataPoint({
        indexes: [`ref:${ref}`.slice(0, 96)],
        blobs: ['ai-referral', ref, '', 'ai-referral', url.pathname.slice(0, 300), format, country, ''],
        doubles: [1, status],
      });
    }
  } catch { /* never break the page */ }
}

/** Dataset name from env.CRAWLER_DATASET: lower-case letters, digits and underscores only. */
export function datasetOf(env) {
  const name = String((env && env.CRAWLER_DATASET) || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  return name || '';
}

// Public, aggregated: counts only. Needs the Analytics SQL binding ANALYTICS_SQL.
export async function crawlerSummary(env, days, nowMs = Date.now()) {
  const dataset = datasetOf(env);
  if (!dataset) return { available: false, note: 'CRAWLER_DATASET is not set on this Worker.' };
  if (!env.ANALYTICS_SQL) return { available: false, note: 'Analytics SQL binding not configured on this deployment.' };
  const start = new Date(nowMs - days * 86400000).toISOString();
  const table = `events.analyticsEngine.${dataset}`;
  const q = async (query) => {
    const r = await env.ANALYTICS_SQL.query({ query, params: { start } });
    return (r && r.data) || [];
  };
  const where = `FROM ${table} WHERE timestamp >= $start`;
  const jobs = {
    agents: () => q(`SELECT blob1 AS kind, blob2 AS name, blob3 AS operator, blob4 AS category, COUNT(*) AS hits ${where} GROUP BY blob1, blob2, blob3, blob4 ORDER BY hits DESC LIMIT 100`),
    topPaths: () => q(`SELECT blob4 AS category, blob5 AS path, COUNT(*) AS hits ${where} AND blob1 = 'bot' GROUP BY blob4, blob5 ORDER BY hits DESC LIMIT 50`),
    byCategory: () => q(`SELECT blob1 AS kind, blob4 AS category, COUNT(*) AS hits ${where} GROUP BY blob1, blob4`),
    formats: () => q(`SELECT blob6 AS format, COUNT(*) AS hits ${where} GROUP BY blob6 ORDER BY hits DESC LIMIT 20`),
    daily: () => q(`SELECT toStartOfDay(timestamp) AS day, blob1 AS kind, blob4 AS category, blob2 AS name, COUNT(*) AS hits ${where} GROUP BY day, blob1, blob4, blob2 ORDER BY day DESC, hits DESC LIMIT 500`)
      .catch(() => q(`SELECT date_trunc('day', timestamp) AS day, blob1 AS kind, blob4 AS category, blob2 AS name, COUNT(*) AS hits ${where} GROUP BY day, blob1, blob4, blob2 ORDER BY day DESC, hits DESC LIMIT 500`)),
  };
  const names = Object.keys(jobs);
  const settled = await Promise.allSettled(names.map((n) => jobs[n]()));
  const out = { available: true, days, since: start };
  const errors = {};
  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') out[names[i]] = s.value;
    else { out[names[i]] = []; errors[names[i]] = 'query_failed'; } // the SQL error text stays out of this public answer
  });
  if (Object.keys(errors).length === names.length) return { available: false, days, since: start, errors, note: 'All Analytics SQL queries failed.' };
  if (Object.keys(errors).length) out.errors = errors;
  // Totals come from the per-category query (every row), falling back to the top-100 agents list.
  const rows = errors.byCategory ? (out.agents || []) : (out.byCategory || []);
  delete out.byCategory;
  const sum = (f) => rows.filter(f).reduce((a, r) => a + Number(r.hits || 0), 0);
  out.totals = {
    botHits: sum((r) => r.kind === 'bot'),
    aiSearchHits: sum((r) => r.kind === 'bot' && r.category === 'ai-search'),
    aiUserHits: sum((r) => r.kind === 'bot' && r.category === 'ai-user'),
    aiTrainingHits: sum((r) => r.kind === 'bot' && r.category === 'training'),
    searchEngineHits: sum((r) => r.kind === 'bot' && r.category === 'search-engine'),
    aiReferralVisits: sum((r) => r.kind === 'ai-referral'),
  };
  out.note = 'Self-declared User-Agents (not verified). Sampled counts from Workers Analytics Engine.';
  return out;
}

export async function handleCrawlers(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  const days = Math.min(Math.max(Math.trunc(Number(url.searchParams.get('days'))) || 7, 1), 90); // whole days: one cache key each
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = new Request(`https://${url.hostname}/api/crawlers?days=${days}`);
  const hit = cache && (await cache.match(key));
  if (hit) return hit;
  let body;
  let status = 200;
  try { body = await crawlerSummary(env, days); } catch { body = { available: false, error: 'internal_error' }; status = 502; }
  const ok = status === 200 && body.available === true && !body.errors; // a partial answer is served but not cached
  const res = new Response(JSON.stringify(body), {
    status,
    // Only a real answer is cached (here and by browsers / proxies); a failure is retried on the next request.
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': ok ? 'public, max-age=600' : 'no-store', 'Access-Control-Allow-Origin': '*', 'X-Robots-Tag': 'noindex' },
  });
  if (cache && ok) await cache.put(key, res.clone());
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/crawlers') return handleCrawlers(request, env);
    const res = await fetch(request); // to the origin, unchanged
    recordVisit(env, request, url, res.status);
    return res;
  },
};
