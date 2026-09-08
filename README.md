# STARGO WORK — official site (static)

Bilingual (中文 at `/`, English at `/en/`) marketing site for STARGO WORK, the
AI Operating System for Global Trade. Nineteen pages per language (eleven
product/legal pages, About, the blog index and six articles), built from three
licensed Webflow templates with their layouts, palettes, imagery, animations and
interactions kept intact; the words and the information architecture are STARGO's.

| Page | Role in the story | Template used |
|---|---|---|
| `index.html` — Trade OS | one journey: OS → the problem → one loop → who runs it → five stages → four systems → channels → the interface → OS vs hiring → start with one workflow → what is underneath → pricing ladder → four doors → demo | Mono homepage + Scalora loop hero, core-system switcher, channel band |
| `intelligence.html` | why it is not a chatbot: ontology → FDE → proactive → teams → long-horizon → governed evolution | Lifelogx homepage |
| `capabilities.html` | the nine-stage loop, then 14 capability groups | Mono work page + two tables |
| `workforce.html` | who is on the AI team: roles, what each one owns, what the team gets done | Lifelogx **feature** page |
| `about.html` | what STARGO WORK is, where it comes from, how it is built; five workflow entry points | Lifelogx about page |
| `blog.html`, `blog/<slug>.html` | articles: the AI operating system, AI employees, inquiry-to-quote, approval gates, the ontology, starting with one workflow | Lifelogx blog and article pages |
| `pricing.html` | the AI ladder: Foundation → Launch → Growth → Global Acquisition → Enterprise | Scalora pricing |
| `enterprise.html` | delegate the work, keep the authority | Mono studio page |
| `contact.html` | start with one workflow | Mono contact page |
| `privacy.html`, `terms.html`, `notices.html`, `404.html` | utility | Mono post / 404 |

## Build

```bash
node tools/imagegen/prepare-assets.mjs # only after new generated originals: encode responsive artwork + manifest
NODE_USE_ENV_PROXY=1 node tools/lifelogx-prepare.mjs   # only after changing tools/templates/lifelogx: mirrors assets, namespaces CSS, cuts five page fragments plus two snippets (the closing wordmark, the pricing block), exports interactions
node tools/blog-covers.mjs           # only after adding an article: re-encodes its cover into assets/blog/
node tools/mirror-donor-assets.mjs   # fetches the donor templates' own photography/video into assets/<donor>/ (Webflow exports never bundle images); idempotent, driven by tools/fragments/donor-assets.json
node tools/capability-donors.mjs     # only after changing a capability-page block: cuts each block out of its donor template (tools/blocks/*.mjs say which), writes tools/fragments/<id>.html, the reduced per-donor stylesheet, and the interaction payload
node tools/try-block.mjs <id>        # one capability-page block on its own: extract, render both languages, report unfilled slots
node tools/fuse-ix.mjs               # the one Webflow bundle every page loads (Mono + Scalora + every donor's interaction data)
node tools/build-site.mjs            # all 38 pages from tools/templates + tools/fragments + tools/copy.mjs + tools/blog.mjs
node tools/verify-site.mjs           # loads every page in Chromium: JS errors, failed/external requests, dead links, leftover English
node tools/verify-restore.mjs        # every page × 320…1920 × both languages, scroll states of the sticky sections, clipped/covered text, new-page SEO; ORIG_LX/ORIG_MONO add side-by-side sheets against the original templates; ENGINE=webkit; BASE_URL/BROWSER_PROXY/WIDTHS/NAV_TIMEOUT for a production run
node tools/verify-visual-upgrade.mjs # bilingual 390/768/1440/1920: switcher, keyboard, video, reduced-motion
node tools/verify-editorial.mjs     # generated imagery still placed carries alt/size data; responsive page scenarios
node tools/verify-conversion.mjs    # client fixtures, pricing and resize (no real mail)
node tools/verify-release.mjs       # production: byte matches for every page and referenced image, browser smoke scenarios; optional BROWSER_PROXY, NAV_TIMEOUT=120000 through a slow proxy
```

Serve the folder with any static server (for example `python -m http.server 4200`).

## Where things live

- **All copy, both languages:** `tools/copy.mjs`. Every entry is keyed by the template string it replaces; a key that no longer matches fails the build instead of leaving the template's own words on the page. The homepage narrative and the legal pages are at the top and bottom of that file; the About page content is `ABOUT` at the end.
- **Articles:** `tools/blog.mjs` — one entry per article (slug, date, cover, bilingual title/description/body as HTML). The build writes `blog/<slug>.html` and `en/blog/<slug>.html`, fills the blog index, the four homepage cards (newest first), the sitemap, canonical/hreflang/Open Graph (`og:type` article, cover as image) and JSON-LD (`BlogPosting` with an Organization author, `BreadcrumbList`; the index carries a `Blog` node). To publish: add the entry, add its cover mapping in `tools/blog-covers.mjs`, run the two scripts, rebuild. Content rule: product explanation only — no invented customers, credentials or ranking claims.
- **Navigation, footer, metadata (canonical, hreflang, Open Graph, JSON-LD), language switch, wordmark, link hygiene:** `tools/chrome.mjs`. Internal links never open a new tab; external ones carry `rel="noopener"`; placeholder `#` legal links are rewritten to the real pages.
- **Imagery (owner decision, 2026-09-06):** the templates' own licensed imagery is kept wherever it carries the composition — the whole of the Lifelogx pages (phone screens, translucent overlays of the gradient and "no writing" sections, closing-card image, avatars in the scenario bubbles, pink palette), the Mono homepage partner wall (eight sample logos, labelled as a sample), the scenario cards (portraits and the portrait film), the contact band photograph behind the glass form, the contact page quote card, and the blog covers (Mono product photographs re-encoded into `assets/blog/`). The 30 AI-generated editorial images that remain placed (homepage silos/OS scenes/theatre, capabilities, enterprise, About role emblems) live in `assets/stargo-editorial/` with responsive sizes; `tools/editorial-images.mjs` maps them and supplies bilingual conceptual alt text. The 13 unused generated images are retained on disk and reported by `verify-editorial`.
- **Generation provenance:** after the owner explicitly authorized the built-in image tool, all 43 images were generated individually. The exact model ID is not exposed by that tool. `tools/imagegen/generated-sources.json` records actual prompts and output filenames; `assets-manifest.json` records dimensions, variants and original hashes. Full-resolution originals are retained locally in ignored `output/imagegen/originals/`. `docs/visual-upgrade-brief.md` documents the art direction. No API key is required to build from committed web assets; only re-encoding requires the retained originals and Sharp.
- **Restored video:** `assets/stargo-motion/` contains the fourth template's orbital film and a frame-derived poster; see its `SOURCE.md`. `js/stargo-media.js` controls lazy playback, pause/resume, offscreen suspension and reduced-motion preference, leaving the original grid/zoom structure intact.
- **Page scripts:** `js/stargo-forms.js` and `js/stargo-tabs.js` load everywhere; `js/stargo-pricing.js` loads only on the pricing page and adds GSAP scroll motion (headline and cards arrive, prices count up, the promoted plan breathes once, comparison rows fade in). All of it is skipped under `prefers-reduced-motion`.
- **Which plan is promoted:** `featured: true` on a plan in `PRICING.panes` moves the raised card onto it. Scalora welds that treatment to the middle slot; the build relocates it, so the ladder can stay in price order. Today it sits on Growth and on Global Acquisition, the dearest plan.
- **Site overrides:** `css/stargo-fusion.css` — the only hand-written stylesheet (full-bleed loop hero, the 80px offset that stands in for the Lifelogx in-flow navigation, CJK sizing of the Lifelogx hero word, the inline pricing-ladder orb, still images in former video boxes, focus rings). It no longer recolours the Lifelogx palette or its gradients. The Lifelogx author stylesheet is scoped with `:where(.lx-scope)` so its element rules keep the template's own specificity next to Mono's.
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
Pages serves clean URLs, so `/pricing.html` redirects to `/pricing` and articles live at `/blog/<slug>`. The
canonical origin used in metadata and the sitemap is `SITE_URL` in
`tools/copy.mjs` — change it when a custom domain (for example
`work.stargomoto.com`) is bound.

Run the deploy with the local proxy variables unset (`HTTP_PROXY`, `HTTPS_PROXY`,
`ALL_PROXY`): through the proxy the upload API times out; a direct connection
uploads everything in a couple of minutes. Login once with `… wrangler.js login`.
`*.pages.dev` is generally unreachable from mainland China; bind a domain you own
under the project's Custom domains for a stable address.
