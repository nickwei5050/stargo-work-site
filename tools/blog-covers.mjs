/**
 * Blog covers, re-encoded as 1200/800/500px WebP with plain file names in
 * assets/blog/. One entry per article slug; the article data in tools/blog.mjs
 * refers to the slug.
 *
 * Source: this site's own editorial artwork in assets/stargo-editorial/. The
 * covers used to be the Mono template's product photography — earbuds, a grey
 * tool on red — which said nothing about what the articles are about. Each
 * article now carries the STARGO surface it actually describes: the quote
 * studio for the inquiry-to-quote piece, the relationship artwork for the
 * enterprise-knowledge piece, the workforce centre for the one about 288 AI
 * employees, the loop artwork for the long-form visual guide. Our own images,
 * so no third-party licence or attribution is involved. Each source is used by
 * one cover only.
 *
 * Without sharp the same files can be written with Pillow: centre crop to 3:2,
 * resize to 1200×800, 800×533 and 500×333 (Lanczos), WebP quality 82 — that is
 * how stargo-work-visual-guide*.webp were made (2026-09-17).
 *
 *   node tools/blog-covers.mjs        # idempotent; skips covers that exist
 */
import { existsSync, mkdirSync } from 'node:fs';
import { SITE, req } from './paths.mjs';

/* sharp is not installed by this repository (native, ~30 MB, and only the
   re-encode steps need it). Install it here, or point STARGO_TOOL_PACKAGE at
   an install that has it. */
const sharp = req('sharp');
const SRC = `${SITE}/assets/stargo-editorial`;
const OUT = `${SITE}/assets/blog`;
const COVERS = {
  'stargo-work-visual-guide': 'brand-loop.webp',                  // the whole loop, from the first customer to the next cycle
  'start-with-one-workflow': 'os-boot.webp',                      // a system coming up, one step at a time
  'from-inquiry-to-quote': 'os-quote-studio.webp',                // the surface the article walks through
  'approval-gates-for-ai-in-trade': 'os-cockpit.webp',            // the view an approver works from
  'ai-operating-system-for-global-trade': 'os-desktop.webp',      // the operating system itself
  '288-ai-employees-not-288-chatbots': 'os-agent-center.webp',    // the roster the article explains
  'enterprise-ontology-explained': 'brand-ontology.webp',         // the model of the business
};
mkdirSync(OUT, { recursive: true });
let written = 0;
for (const [slug, file] of Object.entries(COVERS)) {
  const src = `${SRC}/${file}`;
  if (!existsSync(src)) throw new Error(`cover source missing: ${file}`);
  for (const w of [1200, 800, 500]) {
    const target = `${OUT}/${slug}${w === 1200 ? '' : `-${w}`}.webp`;
    if (existsSync(target)) continue;
    // 3:2 crop, the ratio the homepage cards (3 / 2.3) and the blog grid (1:1, object-fit cover) both crop from.
    await sharp(src).resize(w, Math.round(w * 2 / 3), { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(target);
    written++;
  }
}
console.log(`blog covers: ${Object.keys(COVERS).length} articles, ${written} files written to assets/blog/`);
