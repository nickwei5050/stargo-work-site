# STARGO WORK — official site (static)

Bilingual (中文 at `/`, English at `/en/`) marketing site for STARGO WORK, the
AI Operating System for Global Trade. Nineteen pages per language (ten
product/legal pages, About, the blog index and seven articles), built from
licensed Webflow templates with their layouts, palettes, imagery, animations and
interactions kept intact; the words and the information architecture are STARGO's.

| Page | Role in the story | Template used |
|---|---|---|
| `index.html` — Home | sells OPEN WORK with its own screens (2026-10-09): the promise and the inquiry screen with three callouts → the problem → four everyday jobs in tabs (inquiry, quote/PI, outreach, weekly brief) with a lightbox → approvals and records → three outcomes → 15 apps → pricing teaser → FAQ → demo band | Mono homepage chrome (navigation, side menu, pill, footer), its FAQ accordion and demo form; everything in between is `tools/ow-blocks/` + `css/stargo-ow.css` + `js/stargo-ow.js` |
| `intelligence.html` | why it is not a chatbot: ontology → FDE → proactive → teams → long-horizon → governed evolution | Lifelogx homepage |
| `capabilities.html` | the nine-stage loop, then 14 capability groups | Mono work page + two tables |
| `workforce.html` | who is on the AI team: roles, what each one owns, what the team gets done | Lifelogx **feature** page |
| `about.html` | what STARGO WORK is, where it comes from, how it is built; five workflow entry points | Lifelogx about page |
| `blog.html`, `blog/<slug>.html` | articles (data in `tools/blog.mjs`, one structure: answer, key takeaways, sections, FAQ with matching FAQPage data): the illustrated STARGO WORK guide with its web charts, starting with one workflow, Sales Desk from inquiry to PI, who decides, the browser-based AI operating system, 288 AI roles and teamwork, enterprise knowledge and the relationship map | OPEN WORK design (`tools/ow-blocks/blog.mjs`, since 2026-10-09; was the Lifelogx blog and article pages) |
| `pricing.html` | the AI ladder: Standard → Launch → Growth → Global Acquisition → Enterprise, with a first-year / renewal switch, the plan comparison and ten pricing questions | cinery pricing header and price card, renok tier band and comparison chart, cinery reviews, Scalora closing band and FAQ |
| `enterprise.html` | delegate the work, keep the authority | Mono studio page |
| `contact.html` | start with one workflow | Mono contact page |
| `privacy.html`, `terms.html`, `404.html` | utility; both legal pages name the operator, 广西博韦尔传媒科技有限公司, and the terms carry the imagery note (the third-party notices page was removed on 2026-10-10 at the owner's request; `dist/_redirects` answers its old addresses with a 301 to `/terms`) | OPEN WORK design (`tools/ow-blocks/site-pages.mjs`) |

## Build

```bash
node tools/imagegen/prepare-assets.mjs # only after new generated originals: encode responsive artwork + manifest
NODE_USE_ENV_PROXY=1 node tools/lifelogx-prepare.mjs   # no page uses the Lifelogx layout since 2026-10-09 (the blog moved to the OPEN WORK design); kept for history. Only after changing tools/templates/lifelogx: mirrors assets, namespaces CSS, cuts five page fragments plus two snippets (the closing wordmark, the pricing block), exports interactions
python3 tools/subset-42dot.py       # no page loads css/lifelogx.lx.css since 2026-10-09; only after re-mirroring the 42dot Sans TTFs: writes the Hangul-free WOFF2 faces css/lifelogx.lx.css loads (assets/fonts/42dotsans-*-latin.woff2, ~37 KB each instead of 2.5 MB); needs fonttools + brotli
node tools/blog-covers.mjs           # only after adding an article or re-rendering its OPEN WORK scene: crops its 2:1 cover (tools/blog.mjs COVER_RENDER + the region in BOX) into assets/blog/ — the pages' 1200/800/500 files, and <slug>-share.webp with its own 「演示数据 · Demo data」 chip for og:image; needs python + Pillow (and Chromium for the chip)
node tools/openwork/render.mjs       # only after changing an OPEN WORK scene (tools/openwork/scenes.mjs): renders the ow* product images and the share cover, registers them; needs STARGO_TOOL_PACKAGE for sharp/fonts/icons (tools/openwork/README.md)
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
node tools/verify-release.mjs       # after npm run dist: dist/ is the current build, every file it ships matches BASE_URL byte for byte, routes (clean URLs, 404, notices 301), demo video + product pictures in a browser; dry run: node tools/serve.mjs --root dist --port 4390 & BASE_URL=http://127.0.0.1:4390; optional BROWSER_PROXY, NAV_TIMEOUT=120000 through a slow proxy
```

Serve the folder with any static server (for example `python -m http.server 4200`).

## npm scripts and CI

The chain above also has npm scripts, which is what CI calls and what keeps the
two in step:

```bash
npm ci                 # install (pinned: @playwright/test, axe-core)
npm run browsers       # one-off: download the Chromium the verifiers drive
npm run build          # mirror-donor-assets -> capability-donors -> fuse-ix -> build-site
npm run serve          # static server on 127.0.0.1:4200 serving the repo root (PORT/HOST/ROOT env)
npm run verify         # verify-site -> verify-integrity -> verify-interactions, against BASE_URL
npm run verify:ci      # the same three, but runs all of them even if one fails
```

Every script resolves its own location, so the repository builds from any
checkout directory on Windows, macOS or Linux. Nothing depends on a sibling
project any more; `tools/paths.mjs` is the single place that answers "where is
the site".

`.github/workflows/site-verification.yml` runs on every pull request to `main`
and every push to a `release/**` branch. It rebuilds all 38 pages and asserts
the rebuild is byte-identical to what the branch committed, then serves the tree
and loads every page in Chromium. **Green means the committed pages are exactly
what the build produces and a browser found nothing wrong with them.** A check
that runs but verifies nothing is deliberately red, not green — see
`.github/workflows/README.md`, which explains each failure in plain language.
The workflow deploys nothing and uses no secret; deployment stays manual.

Because the built pages are committed and served from the repo root, the
reproducibility assertion is the check that matters most here: it catches a page
edited by hand, and a source change that was never rebuilt.

## Release process

Every change to this site goes the same way. Nothing is deployed straight from a
working tree.

1. **Build and verify locally.** Run the build chain above, then serve the folder
   and look at the pages that changed:
   `python -m http.server 4200 --protocol HTTP/1.1` → http://127.0.0.1:4200/.
   `verify-site`, `verify-integrity` and `verify-interactions` must all be clean.
2. **Commit and push the branch** to `origin`
   (github.com/nickwei5050/stargo-work-site).
3. **Open a pull request against `main`** and let the code scanner review it.
   The PR body says what changed, what a reviewer should look at, what was
   checked, and what is a known deliberate compromise.
4. **Read the scan.** Fix what it finds; push again; let it re-scan.
5. **Only when the scan is clean, deploy** — `node tools/make-dist.mjs` then
   `wrangler pages deploy dist --project-name stargo --branch main`, and verify
   production with `BASE_URL=https://stargo.pages.dev node tools/verify-release.mjs`
   (byte-for-byte comparison of every file in `dist/`, plus routes and browser scenarios).

Note that `stargo.pages.dev` is where this site is published. `stargomoto.com`
currently serves a different application (a Vercel/Supabase app) and is not
attached to this Cloudflare Pages project; pointing it here would replace what
is live there, so it is the owner's call, not the build's.

## Where things live

- **All copy, both languages:** `tools/copy.mjs`. Every entry is keyed by the template string it replaces; a key that no longer matches fails the build instead of leaving the template's own words on the page. The homepage narrative and the legal pages are at the top and bottom of that file; the About page content is `ABOUT` at the end.
- **Articles:** `tools/blog.mjs` — one entry per article (slug, date, modified, cover, section, per-language keywords, bilingual title/description/takeaways/body as HTML, FAQ pairs; charts come from its chart helpers). Its header lists the limits the build checks (title and description lengths, takeaways and FAQ counts, banned wording, language purity). The build writes `blog/<slug>.html` and `en/blog/<slug>.html`, fills the blog index, the four homepage cards (newest first), the sitemap, `llms.txt`, canonical/hreflang/Open Graph (`og:type` article, cover as image) and JSON-LD (`BlogPosting` with an Organization author, `dateModified`, `articleSection` and `wordCount`, `BreadcrumbList`, and a `FAQPage` with the article's visible questions; the index carries a `Blog` node). To publish: add the entry, add its cover mapping in `tools/blog-covers.mjs`, run the two scripts, rebuild. Content rule: product explanation only — no invented customers, credentials or ranking claims.
- **Navigation, footer, metadata (canonical, hreflang, Open Graph, JSON-LD), language switch, wordmark, link hygiene:** `tools/chrome.mjs`. Internal links never open a new tab; external ones carry `rel="noopener"`; placeholder `#` legal links are rewritten to the real pages.
- **Own product imagery (owner instruction, 2026-09-18):** brand, product and feature pictures may be replaced with the owner's own product screenshots from the 2026-09-18 handoff. The supplied PNG originals stay outside the repository; the web derivatives (480/768/1024 and the original width, never upscaled, never cropped) live in `assets/stargo-product/` and are registered in `tools/imagegen/product-assets.json` with the source file, its SHA-256 and its pixels. `tools/editorial-images.mjs` gives each one bilingual alt text ending in 「产品界面示意（演示数据）」 / "Illustrative product interface · demo data", and `verify-editorial` asserts that wording, the unique sources and the files on disk. What this authorisation does NOT cover: layout, type scale, colours, responsive behaviour, the opening animation, the hero rotating gallery's motion, navigation, tabs, scrolling, hover, CTAs, forms, prices or business copy — those stay as they are. Images that carry personal or account identifiers, internal hostnames, money figures, named customers, error or unverified states, or a count that contradicts the published 288 are held for the owner's decision instead of being cropped to hide them; the held list is in the round's record.
- **OPEN WORK product images (owner decision, 2026-10-09):** the system is STARGO WORK and its core app OPEN WORK. `assets/stargo-product/ow*.webp` and the share cover are rendered by `tools/openwork/` from an HTML rebuild of the real OPEN WORK chat workspace; every conversation in them is demonstration data and the pages badge them 「演示数据」 / "Demo data". Full-app shots are 2560×1760 renders served at up to 2400w; phone cards are 390 CSS px @3x renders. See `tools/openwork/README.md`.
- **Imagery (owner decision, 2026-09-06; homepage superseded 2026-10-09 — it no longer carries the partner wall, the scenario portraits and film, the fashion band or the contact-band photograph):** the templates' own licensed imagery is kept wherever it carries the composition — the Lifelogx pages (phone frames, translucent overlays of the gradient and "no writing" sections, closing-card image, avatars in the scenario bubbles, pink palette), the Mono homepage partner wall (eight sample logos, shown without a caption since 2026-09-10 and disclosed as a sample on the notices page), the scenario cards (portraits and the portrait film), the contact band photograph behind the glass form and the contact page quote card. Two exceptions since V7 (2026-09-17): the phone screens on the intelligence page, Chinese and English (the four screens in the three phone mockups and the screen of the hand-held phone in the "no writing" band), are the site's text-free editorial phone art, because the template screens showed third-party product names; and the blog covers are the site's own editorial artwork, re-encoded into `assets/blog/` by `tools/blog-covers.mjs`. The 40 AI-generated editorial images that are placed (homepage, capabilities, enterprise, the intelligence phone screens, the shared menu and the share cover, among others) live in `assets/stargo-editorial/` with responsive sizes; `tools/editorial-images.mjs` maps them and supplies bilingual conceptual alt text. The 3 unused generated images are retained on disk and reported by `verify-editorial`.
- **Generation provenance:** after the owner explicitly authorized the built-in image tool, all 43 images were generated individually. The exact model ID is not exposed by that tool. `tools/imagegen/generated-sources.json` records actual prompts and output filenames; `assets-manifest.json` records dimensions, variants and original hashes. Full-resolution originals are retained locally in ignored `output/imagegen/originals/`. `docs/visual-upgrade-brief.md` documents the art direction. No API key is required to build from committed web assets; only re-encoding requires the retained originals and Sharp.
- **One repaired donor asset (2026-09-08):** `assets/6929b6c693cb856e01ef7c05/6943ffd9d600184a67b62dff_crosshair-simple-fill 1 (1).png` and its `-p-500` sibling differ deliberately from the copies on the Lifelogx CDN. The donor ships that icon at 768×609 with its ink box at y 72…608, x 72…695 — 72px of margin on the top, left and right and **zero** at the bottom, where the ring is sliced flat mid-arc. The ring is 624px wide, so a circle with those margins needs a 768px canvas: 159px of arc is missing from the file, which is why no CSS could show it whole. The glyph is symmetric about y = 383.5 (measured: mean channel difference 6.78 there against 19.5 one pixel either side — a clean minimum; alpha-only mean 1.57), so every missing row already exists in the file at `767 - y` and the arc was restored by mirroring, not redrawn. The join is cut at row 602 rather than at the file's own last row, because row 608 *is* the crop edge and carries antialiasing with no counterpart; at 602 the seam measures 12.07 against a local row-to-row baseline of 13.73, i.e. below the image's own variation. `tools/lifelogx-prepare.mjs` skips files already on disk (line 128), so a re-run will not undo this; delete the two files first if you ever want the donor's originals back. The crown and bar-chart icons in the same block are **not** touched — their bottoms are flat by design and nothing proves their canvas was ever taller.
- **OPEN WORK demo video (2026-10-10):** a 16 s silent loop, one inquiry from arrival to 「已批准 · 已发送」 with the 「演示数据」 badge in every frame, rendered from our own HTML by `tools/openwork/video.mjs` into `assets/stargo-product/ow-demo-{zh,en}.{mp4,webm}` + `-poster.webp`, plus a one-column phone cut `ow-demo-{zh,en}-phone.*` (720×1200) that a phone held upright plays instead (chosen by `js/stargo-ow.js`, not by `<source media>`, which older browsers ignore); `tools/ow-blocks/demo-video.mjs` places it under the homepage hero and under the product page's jump links (`preload="none"`, no autoplay attribute: `js/stargo-ow.js` plays it only while it is on screen, from 2 s the first time, never by itself under reduced motion or with the data saver on, with a play/pause button). Re-render: `PLAYWRIGHT_BROWSERS_PATH=… STARGO_TOOL_PACKAGE=… node tools/openwork/video.mjs` (~4 min; see `tools/openwork/README.md`), then `npm run build` — the pages' `?v=` keys follow the files, so the year-long cache of `/assets/*` never serves an old film.
- **Restored video:** (no longer placed: the homepage theatre it played in was removed on 2026-10-09; the files stay for a later page.) `assets/stargo-motion/` contains the fourth template's orbital film and a frame-derived poster; see its `SOURCE.md`. `js/stargo-media.js` controls lazy playback, pause/resume, offscreen suspension and reduced-motion preference, leaving the original grid/zoom structure intact.
- **Visual replaceables:** hero film, module cards, product screenshots and the Open Graph cover are named in `assets/replaceables/README.md` and `tools/replaceables.mjs`. Overwrite the named file (and its width variants) and rebuild. Leave `og-cover.png` at 1200×630.
- **Page scripts:** `js/stargo-forms.js`, `js/stargo-tabs.js` and `js/stargo-ix-arrival.js` (reveals animated elements a reader has already passed when arriving on an anchor or a restored scroll position) load everywhere; `js/stargo-side-menu.js` loads on every page with the desktop side menu (all but 404) and makes it keyboard-operable; `js/stargo-anchor-glide.js` loads on the intelligence page (the homepage dropped it with its sticky sections on 2026-10-09) and re-aims same-page glides whose target moves while the page scrolls. `js/stargo-pricing.js` loads only on the pricing page; its GSAP scroll motion (headline and cards arrive, prices count up, the promoted plan breathes once, comparison rows fade in) is written for the Scalora plan cards, which the rebuilt pricing page no longer draws. Motion is skipped under `prefers-reduced-motion`. `js/stargo-ow.js` loads on the two homepages only: the showcase tabs (WAI-ARIA, arrows/Home/End) and the product-shot lightbox; the homepages load no Scalora, rototo or offgrid stylesheet and no stage-hold, anchor-glide or media script, and draw the navigation orb as a still (`assets/brand/stargo-orb-still.webp`, one frame of the template's orb film) instead of the 6.6 MB film.
- **Which plan is promoted:** `featured: true` on a plan in `PRICING.panes` gives it renok's badged card (推荐方案 / Recommended) in the pricing tier band, while the ladder stays in price order. Today it sits on Growth and on Global Acquisition.
- **Pricing periods:** the tier band's switch shows 首年价格 / First-year total or 续费 / Renewal. The first-year grid lists each plan's own items. On the renewal grid, Standard and Enterprise keep their items, and the three first-year packages (Launch, Growth, Global Acquisition) list `PRICING.renewalTerms` instead, not their first-year deliverables: under 「首年之后怎么算？」, the same three statements of the pricing FAQ's answer to that question on each of them (the Standard software subscription renews annually; domain, hosting and ongoing production follow the renewal proposal or third-party charges; a first-year package is not a promise of repeated annual content production), each marked with a neutral dot instead of the tick used for included items. `tools/blocks/rk-price-tiers.mjs` checks every renewal line against that answer and the plan's own items. The comparison chart does not follow the switch and states first-year inclusions.
- **Site overrides:** `css/stargo-fusion.css` — the only hand-written stylesheet (full-bleed loop hero, the 80px offset that stands in for the Lifelogx in-flow navigation, CJK sizing of the Lifelogx hero word, the inline pricing-ladder orb, still images in former video boxes, focus rings). It no longer recolours the Lifelogx palette or its gradients. The Lifelogx author stylesheet is scoped with `:where(.lx-scope)` so its element rules keep the template's own specificity next to Mono's.
- **Behaviour:** `js/stargo-tabs.js` (Webflow tabs and the homepage core-system switcher — one ScrollTrigger controller for click/scroll with the original card design and crossfade; the conflicting IX2 event alone is removed by `fuse-ix.mjs`), `js/stargo-forms.js` (form submission), `js/stargo-mobile-copy.js` (shorter copy on phones, swapped in before the text animations split lines), `js/stargo-splittext-cjk.js` (Chinese word segmentation for SplitText). The pricing period switch is renok's own interaction, made keyboard- and screen-reader-operable by `tools/blocks/rk-price-tiers.js` (shipped in `js/capability-blocks.js`).
- **Forms:** submissions POST to `/api/contact` — `functions/api/contact.js`, a Cloudflare Pages Function that relays them by e-mail through Resend. It needs `RESEND_API_KEY` (and optionally `CONTACT_TO`, `CONTACT_FROM`) in the Pages project's environment variables. Until that key is set the endpoint answers 503 and the page falls back to the visitor's mail client, saying so — it never shows a fake "thank you". A honeypot field and a busy lock guard against bots and double submits.
- **Brand wall on the homepage:** drop real logo files (svg/png/webp/jpg) into `assets/brands/` and rebuild; a wall then shows them under the caption (我们服务过的品牌) / (Brands we have served) (`tools/ow-blocks/logos.mjs`). With the folder empty (as now) there is no wall at all: the template's sample marks are not on the page (since 2026-10-09).

## Rules the build enforces

- No request leaves the origin: fonts, images and videos are all under `assets/` and `css/`.
- Every internal link resolves to a page the build produces.
- No template brand, invented client, placeholder price in dollars, template navigator, YouTube embed, or template stock photograph survives into a page.
- No page names the upstream software behind the product, says "open source" / 「开源」 or lists licences (owner, 2026-10-10: 「网站不要写任何这种开源的东西！我不想被爬取到」). The list is `UPSTREAM` in `tools/copy.mjs` (the names are stored base64-encoded there, so that this public repository does not spell them out either); `tools/build-site.mjs` checks every generated page against it (the whole page, not only its visible text) and `tools/make-dist.mjs` checks every file it ships, names included.
- No page calls a feature unfinished, still being built or to be confirmed one by one (owner, 2026-10-10: every feature is live). Connecting a company's own mailbox, channels and systems needs its authorization; the pages say that plainly. The English staff term is "AI Staff".
- The owner's bank, account, clearing number and taxpayer ID are never published; `CONTACT_INFO` in `tools/copy.mjs` holds only the company name, phone / WhatsApp, WeChat, e-mail, website and city.

## Deploy (Cloudflare Pages, project `stargo`)

```bash
node tools/make-dist.mjs
node "F:/stargo 网站/stargo-work-website/node_modules/wrangler/bin/wrangler.js" pages deploy dist --project-name stargo --branch main --commit-dirty=true
```

`dist/` carries the pages the build produces, exactly the files under `assets/`,
`css/` and `js/` that they reach (followed through stylesheets, scripts, SVG and
JSON as they ship — without comments, and without the template rules that draw
a picture for a block no page renders, `tools/css-prune.mjs`; retired,
unreferenced files stay in the repository and are not published; the few files
whose repository names carry a template's or vendor's name ship under neutral
names, `tools/dist-names.mjs`),
`_headers` (cache + security headers: `/assets/*` immutable for a year,
which is safe because every asset URL a page or stylesheet writes carries
`?v=<sha256-12>` of its file, `tools/asset-version.mjs`; the build and
`make-dist` stop on one without it), `_redirects` (retired addresses, listed in
`tools/dist-names.mjs` `RETIRED_PAGES` — the notices page and the old
`288-ai-employees-…` article address — answer 301 with their replacement's
clean URL; `tools/serve.mjs` honours the file, so `verify-release` checks it
locally too), `robots.txt`, `sitemap.xml` and `llms.txt` (a
Markdown summary of the product, its pages and articles for AI answer engines,
served as UTF-8 text). `make-dist` stops if any shipped file names upstream
software (see the rules above) — in its name, its text, or the readable strings
of a binary such as the demo films, which must not name their encoder either. Run the deployment command from this
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
