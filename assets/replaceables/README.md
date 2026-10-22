# Visual replaceables — STARGO WORK (`stargo.pages.dev`)

Reserved slots for the image pass. The machine-readable list is [`tools/replaceables.mjs`](../../tools/replaceables.mjs). The pages are generated; do not hunt paths through `index.html`.

The 2026-09-22 curated WebP set is wired in place (same filenames + regenerated width variants). A follow-up on the same day replaced the four older 1268px leftovers (`gos01`, `gos09`, `gos11`, `sw033`) with the remaining pack stills. See [`CURATED-PASS.md`](./CURATED-PASS.md) for both tables. Unused alternates under `alternates/` are the busy home poster and the WebP twin of the share cover.

This site is the WORK marketing site. It is not `www.stargomoto.com`.

## How to swap

1. Prefer **overwriting the file named below**, same filename, same pixel size.
2. Product screenshots also have width variants (`-480`, `-768`, `-1024`) next to the full file. Editorial stills have `-400`, `-800`, `-1200`. Replace every variant of that id, or a smaller `srcset` candidate will still show the old picture.
3. The share card is the owner's photograph O01, a **1200×630** JPEG (see Open Graph below). A new card gets a new file name; never overwrite it.
4. Rebuild with `npm run build`. Do not deploy from this branch until the new pixels are reviewed.

A slot whose value in `tools/replaceables.mjs` starts with `assets/stargo/` and is **not** `stargo-editorial`, `stargo-product`, or `stargo-motion` is a generator token. `tools/editorial-images.mjs` rewrites `assets/stargo/` to `assets/stargo-editorial/` when the page is written. Edit the token in `tools/replaceables.mjs` if you must point the slot at a different **already registered** id. A new product id also needs an entry in `tools/imagegen/product-assets.json` and alt text in `tools/editorial-images.mjs`.

Blog covers in `assets/blog/` are generated from the sources in `tools/blog-covers.mjs` (those sources read this list). After a screenshot overwrite, rerun `node tools/blog-covers.mjs` so the covers pick up the new bytes. Since 2026-10-21 the blog index and the articles show the owner's cover photographs instead (`BLOG_COVERS`, below); the `assets/blog/` covers remain what the articles share (`og:image`) and what the homepage and workforce cards show until those slots are placed.

## Hero

The opening overlay (`tools/blocks/og-intro.mjs`) has no image file. The picture slots are the sticky video grid.

| Slot | File on disk | Notes |
| --- | --- | --- |
| `HERO.film` | `assets/stargo-motion/orbit.mp4` | Centre cell. H.264, no audio. See `assets/stargo-motion/SOURCE.md`. |
| `HERO.poster` | `assets/stargo-motion/orbit-poster.webp` | Poster for that film. Also the About page large still (`ABOUT.bigImage`). |
| `HERO.theatre[0]` | `assets/stargo-photo/w01-trade-office-2048.webp` | Grid still (W01, owner photograph). |
| `HERO.theatre[1]` | `assets/stargo-photo/w02-workshop-2048.webp` | Grid still (W02). |
| `HERO.theatre[2]` | `assets/stargo-photo/w03-warehouse-2048.webp` | Grid still (W03). |
| `HERO.theatre[3]` | *(not shown)* | Replaced by `HERO.film` / `HERO.poster`. The unused token is `os-desktop`. |
| `HERO.theatre[4]` | `assets/stargo-photo/w04-qc-lab-2048.webp` | Grid still (W04). |
| `HERO.theatre[5]` | `assets/stargo-photo/w05-owner-office-2048.webp` | Grid still (W05). |
| `HERO.theatre[6]` | `assets/stargo-photo/w06-showroom-2048.webp` | Grid still (W06). |
| `GALLERY_TILES` | six `assets/stargo-product/sw*.webp` | Rotating gallery in the hero footer. Stems: `sw003`, `sw004`, `sw006`, `sw008`, `sw028`, `sw033`. Each is shown four times. |

## Module cards

Homepage core systems (`HOME_MODULES`) and the five business stages (`HOME_STAGES`).

| Slot | File on disk |
| --- | --- |
| Growth OS | `assets/stargo-product/gos10-growth-control-tower.webp` |
| Sales Desk | `assets/stargo-product/sw028-sales-desk-inquiry-reply.webp` |
| ERP | `assets/stargo-editorial/brand-family-02.webp` |
| AI 创作 / AI Creative | `assets/stargo-editorial/os-boot.webp` |
| 001 主动获客 | `assets/stargo-photo/p01-prospecting-480.webp` (owner photograph P01) |
| 002 外贸销售 | `assets/stargo-photo/p02-sales-480.webp` (P02) |
| 003 企业履约 | `assets/stargo-photo/p03-fulfilment-768.webp` (+ `-480`, P03) |
| 004 回款与服务 | `assets/stargo-photo/p04-payment-docs-480.webp` (P04) |
| 005 复购与改进 | `assets/stargo-photo/p05-reorder-480.webp` (P05) |

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
| Knowledge | `assets/stargo-editorial/brand-ontology.webp` |
| Improvement | `assets/stargo-editorial/brand-loop.webp` |

The quote band's picture and the creative section still (`STORY_ART.quoteBand` and `PLACED.creativePicture` until 2026-10-21) are owner photographs now: `CAP_PHOTOS.quote` and `CAP_PHOTOS.creative`, below.

Growth OS row hover shots (`GROWTH_ROWS`): row 1 keeps `brand-family-01`; rows 2–4 use `gos01-market-thesis`, `gos09-reorder-radar`, `gos05-buying-committee`. The rows' full-bleed backgrounds are owner photographs since 2026-10-21 (`CAP_PHOTOS.growth`, below).

Sales Desk rows (`SALES_ROWS`): `c05-unified-inbox` (owner photograph), `live52-mobile-case-needs`, `c06-customer-360` (owner photograph).

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

## Owner photographs

Graded pictures from the owner's image thread (`site-images/batch-1` to `batch-8`, 2026-10-21), in `assets/stargo-photo/`, registered in `tools/imagegen/photo-assets.json` (source file, SHA-256, pixels, every width) by `tools/imagegen/prepare-photos.mjs`. "Photograph" is the registry's name: they are AI-generated images (an image model working from a prompt brief, then graded), not documentary photographs, so their alt ends with the site's （AI 概念图） / " (AI concept illustration)" caption, which `tools/editorial-images.mjs` adds to every registered photograph and `verify-editorial` requires. The sentence before it is in `tools/editorial-images.mjs`, crop points in `css/stargo-fusion.css`. Every file name carries its width and is never overwritten (`/assets` is cached immutable for a year): a new picture gets a new id, and `prepare-photos.mjs` refuses to replace a file with different bytes or to re-register an id from a different original.

| Slot | File on disk |
| --- | --- |
| Homepage grid (`HERO.theatre`, above) | `w01-trade-office` … `w06-showroom`, 480/768/1024/1600/2048 |
| Capability ring, all 27 cards (`RING_STILLS`, by video id): the outer ring's 13 clips in DOM order, the inner ring repeating them | `h01`-`h10`, `p03-fulfilment`, `c08-product-references`, `w02-workshop` |
| Capability page, 四个板块 area cards (`CAP_PHOTOS.areas`) | `c01-command-growth` … `c04-team-management`, 480-2048 |
| Capability page, 一条业务主线 orbit thumbnails (`CAP_PHOTOS.orbit`, by the qubix file replaced) | `p01`, `h10`, `c05`, `h02`, `c07`, `h09`, `d02`, `p05` (steps 01, 03-09) |
| Capability page, Growth OS full-bleed backgrounds (`CAP_PHOTOS.growth`) | `c11-company-research` … `c14-decision-makers`, 480-2048 |
| Capability page, Sales Desk cards 1 and 3 (`CAP_PHOTOS.inbox`, `.customer360`, via `SALES_ROWS`) | `c05-unified-inbox`, `c06-customer-360` |
| Capability page, quote band (`CAP_PHOTOS.quote`, via `CAP_V6A.quote.image`) | `c07-quote-approval` |
| Capability page, 图片 / 视频 portrait (`CAP_PHOTOS.creative`) | `c08-product-references` |
| Capability page, AI team cards 1 and 2 (`CAP_PHOTOS.team`, via `CAP_V6A.team.cards`) | `c09-288-flatlay`, `c10-progress-board` |
| Side-menu 预约企业演示 card, every page with the menu (`MENU_CARD`) | `g02-menu-harbour-night-768.webp` (+ `-480`) |
| Demo band background behind the form (`.photo-section`, CSS) | `g01-cta-loading-bay-dusk-2048.webp` |
| Enterprise page, four sticky story panels 决定 / 核对 / 连接 / 经营 (`.image-about._01`…`_04`, CSS; batch 7) | `e01-decide-2048.webp`, `e02-verify-2048.webp`, `e03-connect-2048.webp`, `e04-operate-2048.webp` |
| Enterprise page, (老板驾驶舱) column, three pictures (`ENTERPRISE_PHOTOS.cockpit`) | `e05-cockpit-overview`, `e06-cockpit-blocker`, `e07-cockpit-budget`, 480/768/1024 |
| Enterprise page, (原则) picture (`ENTERPRISE_PHOTOS.principle`) | `e08-emergency-stop`, 480/768/1024 |
| Enterprise page, 五个管理组件 cards (`ENTERPRISE_PHOTOS.modules`) | `e09-capabilities`, `e10-access`, `e11-approval`, `e12-records`, `e13-key-cabinet`, 480 |

Homepage photographs (group "home", batches 1, 2, 4 and 8; `index.html` and `en/index.html` only; slots in `tools/replaceables.mjs`):

| Slot | File on disk |
| --- | --- |
| Opening mosaic the white hero card shrinks to reveal, `.photo-block` / `.photo-block-reverse` (`HOME_MOSAIC`, keyed by the os-* still each tile used to show; the cursor tooltip's picture rotator keeps the os-* stills) | `h01-port-blue-hour` … `h10-video-showing`, 480/768/1024 |
| 「工具很多，靠人连接」 cards 01–04 (`HOME_SILOS`) | `s01-inquiry-rework-1600`, `s02-scattered-chats-1600`, `s03-spreadsheet-memory-1600`, `s04-chasing-order-2048` |
| Five business stages 001–005 (`HOME_STAGES`, above) | `p01-prospecting` … `p05-reorder` |
| 「从哪里开始？」 band halves `.photo-half._01` / `._02` (CSS background, so no alt; hidden below 992px as before) | `r1-sales-rep-1639.webp` |
| Example-scenario card 03 (四个示例场景), in place of the Contemplative film (`HOME_ROLE_CARD`) | `r2-trade-manager-1024.webp` |
| 企业版 / Enterprise plan picture in the pricing section (`HOME_PRICING_CARD`) | `t01-enterprise-campus-1024.webp` |
| The four homepage blog cards (`HOME_BLOG_COVERS`, by article slug; the articles' share images keep `assets/blog/`) | `b01-visual-guide`, `b02-one-workflow`, `b03-inquiry-to-quote`, `b04-approval-handover`, all `-1600` |

About, contact, pricing and workforce photographs (group "pages", batches 4, 5 and 8; `about`, `contact`, `pricing` and `workforce`, zh and en, only; slots in `tools/replaceables.mjs`):

| Slot | File on disk |
| --- | --- |
| About introduction band behind 「从真实业务出发…」, `.cn-about .cn-intro-background` (CSS background, so no alt) | `a01-empty-workshop-2048.webp` |
| About 数字员工 tiles 1–4, a still in each case-study clip's box (`ABOUT_CASE_STILLS`, by the clip's video id: 市场信号, 报价, 跟进, 统筹) | `d01-market-research`, `d07-quotation`, `d02-follow-up`, `d05-coordination`, 480/768/1024 |
| Scenario slides 1–4 on about and pricing, `.cn-cover-image` (`ROLE_SLIDES`, by the cinery portrait; the pricing card's 56px avatars keep the portraits) | `r1-sales-rep-1639` (+ 480/768/1024), `r2-trade-manager-1024`, `r3-sales-director-1024`, `r4-general-manager-1024` |
| Contact quote card, in place of the Professional Portrait film (`CONTACT_CARD`) | `k01-meeting-table-768.webp` (+ `-480`) |
| Workforce role cards: the five marquee cards, each twice, and the collage card (`WORKFORCE_ROLES`, by the lifelogx asset id) | `d01-market-research-1024`, `d02-follow-up-1024`, `d03-product-spec-480`, `d04-finance-480`, `d05-coordination-1024`, `d06-reporting-480` |
| Workforce article cards under 文章 (`WORKFORCE_BLOG_COVERS`, by article slug; the articles' share images keep `assets/blog/`) | `b01-visual-guide`, `b02-one-workflow`, `b03-inquiry-to-quote`, all `-1600` |

### Blog and intelligence page (batch 8, 2026-10-21)

| Slot | File on disk |
| --- | --- |
| Article hero, blog index card and 「更多文章」 card of each article (`BLOG_COVERS`, by slug), zh and en | `b01-visual-guide` … `b07-knowledge-library`, 480/768/1024/1600 |
| intelligence.html, full-bleed picture under the four lines of `#lx-more` (`INTEL_PHOTOS.observe`) | `i01-observe-process`, 480 … 2048 |
| intelligence.html, closing card picture, `#lx-evolution` (`INTEL_PHOTOS.closing`) | `i02-keep-or-revert`, 480/768 |
| intelligence.html, hand-held phone of the "no writing" band (`INTEL_PHOTOS.phone`); the text-free screen stays laid over its glass | `i03-hand-phone-blank`, 480/768 |

## Open Graph

| | |
| --- | --- |
| File | `assets/stargo-photo/o01-share-cover-1200x630.jpg` (`OG.file`, written as is: no token) |
| Source | the owner's `site-images/batch-8/og-share-cover.png` (O01), resized and cut to its centre by `tools/imagegen/prepare-share-card.mjs`; record in `tools/imagegen/share-card.json` |
| Size | 1200×630, JPEG (link previews do not all read WebP) |
| Meta | `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, `twitter:image:alt` on every non-article page |

Article pages use that article’s cover in `assets/blog/` instead. Do not point those at the share card. The earlier generated card, `assets/stargo-editorial/og-cover.png`, stays on disk unused.
