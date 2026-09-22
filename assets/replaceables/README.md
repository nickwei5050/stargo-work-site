# Visual replaceables — STARGO WORK (`stargo.pages.dev`)

Reserved slots for the image pass. The machine-readable list is [`tools/replaceables.mjs`](../../tools/replaceables.mjs). The pages are generated; do not hunt paths through `index.html`.

The 2026-09-22 curated WebP set is wired in place (same filenames + regenerated width variants). A follow-up on the same day replaced the four older 1268px leftovers (`gos01`, `gos09`, `gos11`, `sw033`) with the remaining pack stills. See [`CURATED-PASS.md`](./CURATED-PASS.md) for both tables. Unused alternates under `alternates/` are the busy home poster and the WebP twin of the share cover.

This site is the WORK marketing site. It is not `www.stargomoto.com`.

## How to swap

1. Prefer **overwriting the file named below**, same filename, same pixel size.
2. Product screenshots also have width variants (`-480`, `-768`, `-1024`) next to the full file. Editorial stills have `-400`, `-800`, `-1200`. Replace every variant of that id, or a smaller `srcset` candidate will still show the old picture.
3. Leave `og-cover.png` named `og-cover.png` at **1200×630**. The meta tags already point at `assets/stargo-editorial/og-cover.png`.
4. Rebuild with `npm run build`. Do not deploy from this branch until the new pixels are reviewed.

A slot whose value in `tools/replaceables.mjs` starts with `assets/stargo/` and is **not** `stargo-editorial`, `stargo-product`, or `stargo-motion` is a generator token. `tools/editorial-images.mjs` rewrites `assets/stargo/` to `assets/stargo-editorial/` when the page is written. Edit the token in `tools/replaceables.mjs` if you must point the slot at a different **already registered** id. A new product id also needs an entry in `tools/imagegen/product-assets.json` and alt text in `tools/editorial-images.mjs`.

Blog covers in `assets/blog/` are generated from the sources in `tools/blog-covers.mjs` (those sources read this list). After a screenshot overwrite, rerun `node tools/blog-covers.mjs` so the covers pick up the new bytes.

## Hero

The opening overlay (`tools/blocks/og-intro.mjs`) has no image file. The picture slots are the sticky video grid.

| Slot | File on disk | Notes |
| --- | --- | --- |
| `HERO.film` | `assets/stargo-motion/orbit.mp4` | Centre cell. H.264, no audio. See `assets/stargo-motion/SOURCE.md`. |
| `HERO.poster` | `assets/stargo-motion/orbit-poster.webp` | Poster for that film. Also the About page large still (`ABOUT.bigImage`). |
| `HERO.theatre[0]` | `assets/stargo-editorial/os-boot.webp` | Grid still. Token `assets/stargo/os-boot.webp`. |
| `HERO.theatre[1]` | `assets/stargo-editorial/os-loading.webp` | Grid still. |
| `HERO.theatre[2]` | `assets/stargo-editorial/os-login.webp` | Grid still. |
| `HERO.theatre[3]` | *(not shown)* | Replaced by `HERO.film` / `HERO.poster`. The unused token is `os-desktop`. |
| `HERO.theatre[4]` | `assets/stargo-editorial/os-cockpit.webp` | Grid still. |
| `HERO.theatre[5]` | `assets/stargo-editorial/os-agent-center.webp` | Grid still. |
| `HERO.theatre[6]` | `assets/stargo-editorial/os-inquiries.webp` | Grid still. |
| `GALLERY_TILES` | six `assets/stargo-product/sw*.webp` | Rotating gallery in the hero footer. Stems: `sw003`, `sw004`, `sw006`, `sw008`, `sw028`, `sw033`. Each is shown four times. |

## Module cards

Homepage core systems (`HOME_MODULES`) and the five business stages (`HOME_STAGES`).

| Slot | File on disk |
| --- | --- |
| Growth OS | `assets/stargo-product/gos10-growth-control-tower.webp` |
| Sales Desk | `assets/stargo-product/sw028-sales-desk-inquiry-reply.webp` |
| ERP | `assets/stargo-editorial/brand-family-02.webp` |
| AI 创作 / AI Creative | `assets/stargo-editorial/os-boot.webp` |
| 001 主动获客 | `assets/stargo-product/gos01-market-thesis.webp` |
| 002 外贸销售 | `assets/stargo-product/sw028-sales-desk-inquiry-reply.webp` |
| 003 企业履约 | `assets/stargo-product/sw033-sales-desk-document-pack.webp` |
| 004 回款与服务 | `assets/stargo-editorial/brand-family-01.webp` |
| 005 复购与改进 | `assets/stargo-product/gos11-dormant-reactivation.webp` |

Capability-page story pictures (`STORY_ART`, editorial ids):

| Slot | File on disk |
| --- | --- |
| Growth OS | `assets/stargo-editorial/os-cockpit.webp` |
| Sales Desk | `assets/stargo-editorial/os-sales-desk.webp` |
| Quote | `assets/stargo-editorial/os-quote-studio.webp` |
| ERP | `assets/stargo-editorial/os-trade-execution.webp` |
| Creative | `assets/stargo-editorial/brand-family-01.webp` |
| AI team | `assets/stargo-editorial/os-agent-center.webp` |
| Connections | `assets/stargo-editorial/os-desktop.webp` |
| Approvals | `assets/stargo-editorial/os-login.webp` |
| Quote band | `assets/stargo-editorial/os-quote-studio.webp` |
| Knowledge | `assets/stargo-editorial/brand-ontology.webp` |
| Improvement | `assets/stargo-editorial/brand-loop.webp` |
| Creative section still (`PLACED.creativePicture`) | `assets/stargo-editorial/os-boot.webp` |

Growth OS row hover shots (`GROWTH_ROWS`): row 1 keeps `brand-family-01`; rows 2–4 use `gos01-market-thesis`, `gos09-reorder-radar`, `gos05-buying-committee`.

Sales Desk rows (`SALES_ROWS`): `os-desktop`, `sw028-sales-desk-inquiry-reply`, `os-inquiries`.

Notices “keep reading” cards (`NOTICES_CARDS`): `sw003-ai-workspace-home`, `sw004-experts-library`, `sw033-sales-desk-document-pack`.

Workforce tile and the capability team card (`PLACED.workforceTile`, `PLACED.teamCard`): `assets/stargo-product/sw006-expert-teams.webp`.

## Product screenshots

All released screens live in `assets/stargo-product/`. Ids:

| Id | Full file |
| --- | --- |
| `sw003-ai-workspace-home` | `assets/stargo-product/sw003-ai-workspace-home.webp` |
| `sw004-experts-library` | `assets/stargo-product/sw004-experts-library.webp` |
| `sw006-expert-teams` | `assets/stargo-product/sw006-expert-teams.webp` |
| `sw008-workflow-library` | `assets/stargo-product/sw008-workflow-library.webp` |
| `sw028-sales-desk-inquiry-reply` | `assets/stargo-product/sw028-sales-desk-inquiry-reply.webp` |
| `sw033-sales-desk-document-pack` | `assets/stargo-product/sw033-sales-desk-document-pack.webp` |
| `gos01-market-thesis` | `assets/stargo-product/gos01-market-thesis.webp` |
| `gos05-buying-committee` | `assets/stargo-product/gos05-buying-committee.webp` |
| `gos09-reorder-radar` | `assets/stargo-product/gos09-reorder-radar.webp` |
| `gos10-growth-control-tower` | `assets/stargo-product/gos10-growth-control-tower.webp` |
| `gos11-dormant-reactivation` | `assets/stargo-product/gos11-dormant-reactivation.webp` |

`sw*` and `gos*` files above are the only product screens this site places. There is no motorcycle-category set.

## Open Graph

| | |
| --- | --- |
| File | `assets/stargo-editorial/og-cover.png` |
| Generator token | `assets/stargo/og-cover.png` (`OG.token`) |
| Size | 1200×630 |
| Meta | `og:image`, `og:image:width`, `og:image:height`, `twitter:image` on every non-article page |

Article pages use that article’s cover in `assets/blog/` instead. Do not point those at `og-cover.png`.
