# STARGO WORK — official site (static)

Bilingual (中文 at `/`, English at `/en/`) marketing site for STARGO WORK, the
AI Operating System for Global Trade. Nine pages per language, built from three
Webflow templates with their layouts, animations and interactions kept intact
and only the words changed.

| Page | Template used |
|---|---|
| `index.html` — Trade OS | Mono homepage + three Scalora modules (loop card stack, core-system switcher, channel band) |
| `intelligence.html`, `workforce.html` | Lifelogx homepage (its own dark theme, inside the Mono nav/footer) |
| `capabilities.html`, `enterprise.html`, `contact.html`, `notices.html`, `404.html` | Mono inner pages |
| `pricing.html` | Scalora pricing page (Mono nav/footer) |

## Build

```bash
node tools/lifelogx-prepare.mjs   # only after changing the lifelogx template: mirrors assets, namespaces CSS, exports interactions
node tools/fuse-ix.mjs            # the one Webflow bundle every page loads (Mono + Scalora + lifelogx interaction data)
node tools/build-site.mjs         # all 18 pages from tools/templates + tools/fragments + tools/copy.mjs
node tools/verify-site.mjs        # loads every page in Chromium: JS errors, failed/external requests, dead links, leftover English
```

Serve the folder with any static server (for example `python -m http.server 4200`).

## Where things live

- **All copy, both languages:** `tools/copy.mjs`. Every entry is keyed by the template string it replaces; a key that no longer matches fails the build instead of leaving the template's own words on the page.
- **Navigation, footer, metadata, language switch, wordmark:** `tools/chrome.mjs`.
- **Site overrides (viewport-high bands, dark-page nav, table columns, wordmark sizes):** `css/stargo-fusion.css` — the only hand-written stylesheet.
- **Forms:** no backend; `js/stargo-forms.js` turns a submission into a pre-filled e-mail to sales@stargomoto.com and says so.
- **Pricing tabs and period toggle:** `js/stargo-tabs.js` (the Mono runtime has no tabs module).
- **Chinese word segmentation for text animations:** `js/stargo-splittext-cjk.js`.
- **Brand wall on the homepage:** drop real logo files (svg/png/webp/jpg) into `assets/brands/` and rebuild. With the folder empty the wall is not rendered.

## Rules the build enforces

- No request leaves the origin: fonts, images and videos are all under `assets/` and `css/`.
- Every internal link resolves to a page the build produces.
- No template brand, invented client, placeholder price in dollars, or `cal.com` link survives into a page.
