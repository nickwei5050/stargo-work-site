# STARGO WORK — official site (static)

Bilingual (中文 at `/`, English at `/en/`) marketing site for STARGO WORK, the
AI Operating System for Global Trade. Eleven pages per language, built from
three Webflow templates with their layouts, animations and interactions kept
intact; the words, the imagery and the information architecture are STARGO's.

| Page | Role in the story | Template used |
|---|---|---|
| `index.html` — Trade OS | one journey: OS → the problem → one loop → who runs it → five stages → four systems → channels → the interface → OS vs hiring → start with one workflow → what is underneath → pricing ladder → four doors → demo | Mono homepage + Scalora loop hero, core-system switcher, channel band |
| `intelligence.html` | why it is not a chatbot: ontology → FDE → proactive → teams → long-horizon → governed evolution | Lifelogx homepage |
| `capabilities.html` | the nine-stage loop, then 14 capability groups | Mono work page + two tables |
| `workforce.html` | what 288 AI employees actually do | Lifelogx homepage |
| `pricing.html` | the AI ladder: Foundation → Launch → Growth → Global Acquisition → Enterprise | Scalora pricing |
| `enterprise.html` | delegate the work, keep the authority | Mono studio page |
| `contact.html` | start with one workflow | Mono contact page |
| `privacy.html`, `terms.html`, `notices.html`, `404.html` | utility | Mono post / 404 |

## Build

```bash
node tools/imagegen/prepare-assets.mjs # only after new generated originals: encode responsive artwork + manifest
node tools/lifelogx-prepare.mjs      # only after changing the lifelogx template: mirrors assets, namespaces CSS, exports interactions
node tools/fuse-ix.mjs               # the one Webflow bundle every page loads (Mono + Scalora + lifelogx interaction data)
node tools/build-site.mjs            # all 22 pages from tools/templates + tools/fragments + tools/copy.mjs
node tools/verify-site.mjs           # loads every page in Chromium: JS errors, failed/external requests, dead links, leftover English
node tools/verify-visual-upgrade.mjs # bilingual 390/768/1440/1920: switcher, keyboard, video, reduced-motion
node tools/verify-editorial.mjs     # 43 originals + 80 variants, 42 responsive page scenarios
node tools/verify-conversion.mjs    # client fixtures, pricing and resize (no real mail)
node tools/verify-release.mjs       # production: 151 byte matches and 6 browser smoke scenarios; optional BROWSER_PROXY
```

Serve the folder with any static server (for example `python -m http.server 4200`).

## Where things live

- **All copy, both languages:** `tools/copy.mjs`. Every entry is keyed by the template string it replaces; a key that no longer matches fails the build instead of leaving the template's own words on the page. The homepage narrative and the legal pages are at the top and bottom of that file.
- **Navigation, footer, metadata (canonical, hreflang, Open Graph, JSON-LD), language switch, wordmark, link hygiene:** `tools/chrome.mjs`. Internal links never open a new tab; external ones carry `rel="noopener"`; placeholder `#` legal links are rewritten to the real pages.
- **Imagery:** 43 distinct AI-generated editorial images in `assets/stargo-editorial/`, with responsive WebP sizes, small PNG role emblems and a 1200×630 Open Graph cover. `tools/editorial-images.mjs` maps all legacy image slots while preserving template elements and supplies bilingual conceptual-image alt text. Legacy HTML/CSS mocks in `assets/stargo/` are retained for rollback but no longer referenced by generated pages or computed CSS overrides.
- **Generation provenance:** after the owner explicitly authorized the built-in image tool, all 43 images were generated individually. The exact model ID is not exposed by that tool. `tools/imagegen/generated-sources.json` records actual prompts and output filenames; `assets-manifest.json` records dimensions, variants and original hashes. Full-resolution originals are retained locally in ignored `output/imagegen/originals/`. `docs/visual-upgrade-brief.md` documents the art direction. No API key is required to build from committed web assets; only re-encoding requires the retained originals and Sharp.
- **Restored video:** `assets/stargo-motion/` contains the fourth template's orbital film and a frame-derived poster; see its `SOURCE.md`. `js/stargo-media.js` controls lazy playback, pause/resume, offscreen suspension and reduced-motion preference, leaving the original grid/zoom structure intact.
- **Site overrides:** `css/stargo-fusion.css` — the only hand-written stylesheet (full-bleed loop hero, lifelogx palette, still images in former video boxes, template CSS photos overridden, focus rings).
- **Behaviour:** `js/stargo-tabs.js` (pricing tabs, period toggle, and the homepage core-system switcher — one ScrollTrigger controller for click/scroll with the original card design and crossfade; the conflicting IX2 event alone is removed by `fuse-ix.mjs`), `js/stargo-forms.js` (form submission), `js/stargo-mobile-copy.js` (shorter copy on phones, swapped in before the text animations split lines), `js/stargo-splittext-cjk.js` (Chinese word segmentation for SplitText).
- **Forms:** submissions POST to `/api/contact` — `functions/api/contact.js`, a Cloudflare Pages Function that relays them by e-mail through Resend. It needs `RESEND_API_KEY` (and optionally `CONTACT_TO`, `CONTACT_FROM`) in the Pages project's environment variables. Until that key is set the endpoint answers 503 and the page falls back to the visitor's mail client, saying so — it never shows a fake "thank you". A honeypot field and a busy lock guard against bots and double submits.
- **Brand wall on the homepage:** drop real logo files (svg/png/webp/jpg) into `assets/brands/` and rebuild. With the folder empty the wall is not rendered.

## Rules the build enforces

- No request leaves the origin: fonts, images and videos are all under `assets/` and `css/`.
- Every internal link resolves to a page the build produces.
- No template brand, invented client, placeholder price in dollars, template navigator, YouTube embed, or template stock photograph survives into a page.

## Deploy (Cloudflare Pages, project `stargo`)

```bash
node tools/make-dist.mjs
node "F:/stargo 网站/stargo-work-website/node_modules/wrangler/bin/wrangler.js" pages deploy dist --project-name stargo --branch main --commit-dirty=true
```

`dist/` carries the pages, `assets/`, `css/`, `js/`, `_headers` (cache + security
headers), `robots.txt` and `sitemap.xml`. Run the deployment command from this
repository root: Wrangler compiles the root `functions/` directory separately
into the backend. Function source files are not copied into the public site.

Production URL: https://stargo.pages.dev (English at https://stargo.pages.dev/en/).
Pages serves clean URLs, so `/pricing.html` redirects to `/pricing`. The
canonical origin used in metadata and the sitemap is `SITE_URL` in
`tools/copy.mjs` — change it when a custom domain (for example
`work.stargomoto.com`) is bound.

Run the deploy with the local proxy variables unset (`HTTP_PROXY`, `HTTPS_PROXY`,
`ALL_PROXY`): through the proxy the upload API times out; a direct connection
uploads everything in a couple of minutes. Login once with `… wrangler.js login`.
`*.pages.dev` is generally unreachable from mainland China; bind a domain you own
under the project's Custom domains for a stable address.
