/**
 * Shipped names for files whose repository names carry a purchased template's
 * or a vendor's name (review, round 2: 「网站不要写任何这种开源的东西！我不想被爬取到」
 * covers template attributions too). The repository keeps its names — the
 * build, the donor tools and the verifiers all know them — and
 * tools/make-dist.mjs ships each file under the name on the right, with every
 * reference in every shipped page, stylesheet, script and JSON file rewritten
 * to match. tools/verify-release.mjs applies the same map when it compares
 * dist/ with the build.
 *
 * Only whole file names and one folder path, so no class name, selector or
 * word elsewhere changes.
 */
export const DIST_NAMES = [
  ['monof-template.app.shared.ed8969994.css', 'site-base.css'],
  ['699b6466d5f19893993a4e8f_icons8-menu-ffffff.json', '699b6466d5f19893993a4e8f_menu-icon-ffffff.json'],
  /* the italic display serif css/stargo-ow.css uses */
  ['assets/fonts/donor/', 'assets/fonts/display/'],
];
/** The shipped path of a repository path. */
export const distPath = (rel) => DIST_NAMES.reduce((p, [from, to]) => p.split(from).join(to), rel);
/** A shipped text with every reference to a renamed file rewritten. */
export const distText = (text) => DIST_NAMES.reduce((t, [from, to]) => t.split(from).join(to), text);
/** File names that must not ship (the templates' and vendors' names). */
export const TEMPLATE_NAMES = /monof|renok|cinery|donor|icons8|lifelogx|lumenis|offgrid|rototo|qubix|scalora|brix/i;

/* Retired page addresses and the page each now answers with (301, both
   languages, with and without .html; tools/make-dist.mjs writes dist/_redirects
   from this, at the target's clean URL, and tools/verify-release.mjs checks it):
   - the third-party notices page, removed on 2026-10-10 (owner:
     「移到产品里，网站不要写任何这种开源的东西」); the terms page carries the
     imagery note now;
   - the AI Staff article, whose address still said "ai-employees" after the
     owner's "AI Staff everywhere" (2026-10-10; renamed in review round 3). */
export const RETIRED_PAGES = [
  ['notices.html', 'terms.html'],
  ['blog/288-ai-employees-not-288-chatbots.html', 'blog/288-ai-staff-not-288-chatbots.html'],
];
