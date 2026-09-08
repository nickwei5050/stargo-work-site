/**
 * Can the six Mono page bundles be merged into one?
 *
 * They must be, if a module is ever to move between pages: a Mono section
 * copied from studio.html onto a page that loads the blog bundle loses its
 * hover interaction, silently. The check: same event / action-list / ix3 id
 * in two bundles must carry byte-identical data. If it does, the union is a
 * safe superset; if it does not, merging would corrupt one of the pages.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

import { SITE } from './paths.mjs';
const dir = `${SITE}/tools/bundles/`;
const files = readdirSync(dir).filter((f) => /^app\.[0-9a-f]{8}\.[0-9a-f]+\.js$/.test(f)).sort();

const events = new Map();
const lists = new Map();
const ix3 = new Map();
let conflicts = 0;

for (const f of files) {
  const b = readBundle(readFileSync(dir + f, 'utf8'));
  const p = b.ix2Payload;
  console.log(f, 'events', Object.keys(p.events).length, 'lists', Object.keys(p.actionLists).length,
    'ix3', b.ix3Interactions.length, b.ix3Timelines.length, 'site', JSON.stringify(p.site).slice(0, 70));
  const check = (map, key, value, kind) => {
    const j = JSON.stringify(value);
    if (map.has(key) && map.get(key) !== j) { conflicts++; if (conflicts <= 10) console.log('CONFLICT', kind, key, f); }
    map.set(key, j);
  };
  for (const [k, v] of Object.entries(p.events)) check(events, k, v, 'event');
  for (const [k, v] of Object.entries(p.actionLists)) check(lists, k, v, 'list');
  for (const x of b.ix3Interactions) check(ix3, x.id, x, 'ix3');
}
console.log(JSON.stringify({ unionEvents: events.size, unionLists: lists.size, unionIx3: ix3.size, conflicts }));
process.exit(conflicts ? 1 : 0);
