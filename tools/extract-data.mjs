/**
 * Pull the verified, owner-reviewed content out of the Next.js site repository
 * into JSON that the static page builder can consume.
 *
 * The Next.js repository (STARGO_SITE_CONTENT, a sibling checkout's content/) is
 * where every claim on this site was checked against the STARGO registries
 * and pinned by tests. This static site must not become a second, looser
 * copy of those facts, so it does not retype them: it reads them from the
 * same files. Counts are asserted so a regex that silently stops matching
 * fails the build instead of shipping an empty roster.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SITE } from './paths.mjs';

/* The sibling Next.js checkout is not part of this repository; say where it is.
   Default: a sibling directory next to this one. */
const SRC = process.env.STARGO_SITE_CONTENT ?? `${SITE}/../stargo-work-website/content`;
const OUT = `${SITE}/tools/data`;
mkdirSync(OUT, { recursive: true });

const read = (f) => readFileSync(`${SRC}/${f}`, 'utf8');
const unescape = (s) => s.replace(/\\"/g, '"');

/** First `key: { zh: "..." }` inside `block`. */
function zh(block, key) {
  // Matches both `title: { zh: "…" }` and `export const X: Bilingual = { zh: "…" }`.
  const re = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*(?::\\s*Bilingual\\s*=|:)\\s*\\{\\s*zh:\\s*"((?:[^"\\\\]|\\\\.)*)"');
  const m = block.match(re);
  return m ? unescape(m[1]) : null;
}
function must(cond, msg) { if (!cond) throw new Error(`extract-data: ${msg}`); }

/* ---- capabilities ------------------------------------------------------ */
{
  const src = read('capabilities.ts');
  const caps = [];
  const re = /\{\s*id:\s*"(E\d\d)",\s*slug:\s*"([^"]+)",\s*version:\s*"([^"]+)",\s*domain:\s*"([^"]+)",([\s\S]*?)updatedAt/g;
  let m;
  while ((m = re.exec(src))) {
    const b = m[5];
    caps.push({
      id: m[1], slug: m[2], version: m[3], domain: m[4],
      title: zh(b, 'title'), value: zh(b, 'customerValue'),
      status: b.match(/status:\s*"([a-z-]+)"/)[1],
    });
  }
  must(caps.length === 52, `expected 52 capabilities, found ${caps.length}`);
  must(caps.every((c) => c.title && c.value && c.status), 'capability with missing zh fields');
  writeFileSync(`${OUT}/capabilities.json`, JSON.stringify(caps, null, 1));
  const by = (k) => caps.reduce((o, c) => ((o[c[k]] = (o[c[k]] ?? 0) + 1), o), {});
  console.log('capabilities', caps.length, by('status'), by('domain'));
}

/* ---- digital employees ------------------------------------------------- */
{
  const src = read('agents.ts');
  const out = [];
  const re = /\{\s*id:\s*"([a-z-]+)",\s*name:\s*"([^"]+)",\s*domain:\s*"([^"]+)",([\s\S]*?)workflowIds:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(src))) {
    const b = m[4];
    const br = b.match(/backingRole:\s*(null|"[^"]+")/)[1].replace(/"/g, '');
    const ac = b.match(/autonomyCeiling:\s*(null|"[^"]+")/)[1].replace(/"/g, '');
    const prov = b.match(/backedByProvider:\s*"([^"]+)"/);
    const permitted = b.match(/permittedCapabilities:\s*\{\s*zh:\s*\[([\s\S]*?)\]/);
    out.push({
      id: m[1], name: m[2], domain: m[3],
      role: zh(b, 'role'), goal: zh(b, 'goal'),
      permitted: permitted ? [...permitted[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [],
      backingRole: br === 'null' ? null : br,
      autonomyCeiling: ac === 'null' ? null : ac,
      status: b.match(/status:\s*"([a-z-]+)"/)[1],
      backedByProvider: prov ? prov[1] : null,
      capabilityIds: [...(b.split('capabilityIds')[1] ?? '').matchAll(/"(E\d\d)"/g)].map((x) => x[1]),
      workflowIds: [...m[5].matchAll(/"(WF\d\d)"/g)].map((x) => x[1]),
    });
  }
  must(out.length === 14, `expected 14 digital employees, found ${out.length}`);
  must(out.filter((a) => a.backingRole).length === 9, 'expected 9 backed personas');
  must(out.filter((a) => a.status === 'roadmap').length === 4, 'expected 4 roadmap personas');
  writeFileSync(`${OUT}/agents.json`, JSON.stringify(out, null, 1));
  console.log('agents', out.map((a) => `${a.name}:${a.backingRole ?? '-'}:${a.autonomyCeiling ?? '-'}`).join(' '));
}

/* ---- integrations ------------------------------------------------------ */
{
  const src = read('integrations.ts');
  const out = [];
  const re = /\{\s*id:\s*"([a-z0-9-]+)",\s*upstream:\s*"([^"]+)",\s*capabilities:\s*(\d+),\s*disabled:\s*(\d+),\s*approvalGated:\s*(\d+),\s*status:\s*"([a-z-]+)",(\s*defaultOffProfile:\s*true,)?\s*purpose:\s*\{\s*zh:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(src))) {
    out.push({ id: m[1], upstream: m[2], capabilities: +m[3], disabled: +m[4], approvalGated: +m[5], status: m[6], defaultOffProfile: !!m[7], purpose: m[8] });
  }
  must(out.length === 25, `expected 25 integrations, found ${out.length}`);
  const sum = (k) => out.reduce((n, i) => n + i[k], 0);
  must(sum('capabilities') === 202 && sum('disabled') === 26 && sum('approvalGated') === 30, 'integration totals drifted from 202 / 26 / 30');
  writeFileSync(`${OUT}/integrations.json`, JSON.stringify(out, null, 1));
  console.log('integrations', out.length, sum('capabilities'), sum('disabled'), sum('approvalGated'));
}

/* ---- product tour ------------------------------------------------------ */
{
  const src = read('tour.ts');
  const steps = [];
  const re = /\{\s*n:\s*(\d+),\s*actorId:\s*"([a-z-]+)",\s*risk:\s*"(R\d)",\s*requiresApproval:\s*(true|false),\s*outcome:\s*"([a-z]+)",([\s\S]*?)\n  \},/g;
  let m;
  while ((m = re.exec(src))) {
    const b = m[6];
    const pr = b.match(/produces:\s*\{\s*zh:\s*\[([\s\S]*?)\]/);
    steps.push({ n: +m[1], actorId: m[2], risk: m[3], requiresApproval: m[4] === 'true', outcome: m[5], title: zh(b, 'title'), detail: zh(b, 'detail'), produces: pr ? [...pr[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [] });
  }
  must(steps.length === 10, `expected 10 tour steps, found ${steps.length}`);
  const tour = { goal: zh(src, 'TOUR_GOAL'), disclaimer: zh(src, 'TOUR_DISCLAIMER'), closing: zh(src, 'TOUR_CLOSING'), steps };
  must(tour.goal && tour.disclaimer && tour.closing, 'tour framing strings missing');
  writeFileSync(`${OUT}/tour.json`, JSON.stringify(tour, null, 1));
  console.log('tour', steps.length, 'gated', steps.filter((s) => s.outcome === 'gated').length);
}

/* ---- risk tiers, deployment facts -------------------------------------- */
{
  const src = read('types.ts');
  const label = src.split('RISK_LABEL')[1];
  const meaning = src.split('RISK_MEANING')[1];
  const risk = {};
  for (const t of ['R0', 'R1', 'R2', 'R3', 'R4']) {
    risk[t] = { label: label.match(new RegExp(t + ':\\s*\\{\\s*zh:\\s*"([^"]+)"'))[1], meaning: meaning.match(new RegExp(t + ':\\s*\\{\\s*zh:\\s*"([^"]+)"'))[1] };
  }
  writeFileSync(`${OUT}/risk.json`, JSON.stringify(risk, null, 1));

  const copy = read('copy.ts');
  const facts = [];
  const re = /value:\s*"(\d+)",\s*label:\s*\{\s*zh:\s*"([^"]+)"[^}]*\},\s*verify:\s*\n?\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(copy))) facts.push({ value: m[1], label: m[2], verify: m[3] });
  must(facts.length === 4, `expected 4 deployment facts, found ${facts.length}`);
  const caveat = zh(copy, 'DEPLOYMENT_FACTS_CAVEAT');
  must(caveat, 'caveat missing');
  writeFileSync(`${OUT}/facts.json`, JSON.stringify({ facts, caveat, category: zh(copy, 'CATEGORY'), headline: zh(copy, 'HERO_HEADLINE'), support: zh(copy, 'HERO_SUPPORT'), contrast: zh(copy, 'HERO_CONTRAST'), ctaPrimary: zh(copy, 'CTA_PRIMARY'), ctaSecondary: zh(copy, 'CTA_SECONDARY') }, null, 1));
  console.log('risk', Object.keys(risk).join(','), 'facts', facts.map((f) => f.value).join('/'));
}
