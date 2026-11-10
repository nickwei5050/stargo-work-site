#!/usr/bin/env node
// Turn the reviewed knowledge drafts in stargo-work-site (growthos/kb-draft/{zh,en}.md) into one Markdown file per
// section, the shape scripts/maxkb-kb-sync.mjs expects: "Source: <first source URL>", the heading, the section body.
//   node stargowork-export-kb.mjs <site-checkout> <out-dir>
// Sections with no source line are skipped: the bridge only allows answers that carry an approved source URL.
import fs from 'node:fs';
import path from 'node:path';
const [site, out] = process.argv.slice(2);
if (!site || !out) { console.error('usage: stargowork-export-kb.mjs <site-checkout> <out-dir>'); process.exit(2); }
let written = 0;
for (const lang of ['zh', 'en']) {
  const lines = fs.readFileSync(path.join(site, 'growthos/kb-draft', `${lang}.md`), 'utf8').split(/\r?\n/);
  const starts = lines.flatMap((l, i) => (/^## \d+\.\s/.test(l) ? [i] : []));
  if (!starts.length) throw new Error(`${lang}.md has no numbered sections`);
  fs.mkdirSync(path.join(out, lang), { recursive: true });
  starts.forEach((start, n) => {
    const m = /^## (\d+)\.\s+(.*)$/.exec(lines[start]);
    const section = lines.slice(start + 1, starts[n + 1] ?? lines.length);
    const at = section.findIndex(l => /^(来源|Source|Sources)\s*[:：]/.test(l));
    if (at < 0) return;
    const url = /https?:\/\/\S+/.exec(section[at])?.[0];
    if (!url) throw new Error(`${lang} section ${m[1]}: source line has no URL`);
    const body = section.filter((_, i) => i !== at).join('\n').trim();
    fs.writeFileSync(path.join(out, lang, `${m[1].padStart(2, '0')}.md`), `Source: ${url}\n\n# ${m[2]}\n\n${body}\n`);
    written++;
  });
}
console.log(JSON.stringify({ written }));
