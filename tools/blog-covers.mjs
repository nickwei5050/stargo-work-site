/**
 * Blog covers: the Mono template's product photographs (licensed template
 * assets, already mirrored under assets/) re-encoded as 1200/800/500px WebP
 * with plain file names in assets/blog/. One entry per article slug; the
 * article data in tools/blog.mjs refers to the slug.
 *
 *   node tools/blog-covers.mjs        # idempotent; skips covers that exist
 */
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const sharp = createRequire('F:/stargo 网站/stargo-work-website/package.json')('sharp');

const SITE = 'F:/stargo 网站/stargo-site';
const SRC = `${SITE}/assets/699b6466d5f19893993a4c2c`;
const OUT = `${SITE}/assets/blog`;
const COVERS = {
  'start-with-one-workflow': '699b6466d5f19893993a4dca_Sleek Container Set.webp',
  'from-inquiry-to-quote': '699b6466d5f19893993a4d64_blog-2.webp',
  'approval-gates-for-ai-in-trade': '699b6466d5f19893993a4e03_Futuristic Device Design (2).webp',
  'ai-operating-system-for-global-trade': '699b6466d5f19893993a4de3_blog-1.webp',
  '288-ai-employees-not-288-chatbots': '699b6466d5f19893993a4e5f_Modern-Metallic-Design-(2).webp',
  'enterprise-ontology-explained': '699b6466d5f19893993a4da8_Futuristic-Device-Design-(4).webp',
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
