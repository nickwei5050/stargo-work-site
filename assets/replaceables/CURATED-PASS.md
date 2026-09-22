# Curated asset pass (2026-09-22)

Owner-supplied WebP set wired into the reserved slots. Paths stay the same;
width variants were regenerated. Optional unused files live in
`assets/replaceables/alternates/`.

## Pure-UI module cards (follow-up)

Three owner pure-UI stills (1280×720 JPEG uploads named `.png`) overwrite the
marketing composites previously wired for ERP / 数字员工 / AI 创作. Growth OS
and Sales Desk are unchanged. Rebuild regenerates blog covers that source
`sw006-expert-teams`.

| Upload | Slot | Overwrites |
| --- | --- | --- |
| `module-erp-pure-ui.png` | 模块卡 ERP | `assets/stargo-editorial/brand-family-02.webp` (+400/800/1200) |
| `module-agents-pure-ui.png` | 模块卡 数字员工 | `assets/stargo-product/sw006-expert-teams.webp` (+480/768/1024) |
| `module-ai-pure-ui.png` | 模块卡 AI 创作 | `assets/stargo-editorial/os-boot.webp` (+400/800/1200) |

| Curated file | Wired to | Why |
| --- | --- | --- |
| `product-cockpit.webp` (cleaner) | `assets/stargo-motion/orbit-poster.webp` | Hero film poster / About large still. Prefer cockpit over busy home (`hero.webp` / 首页). Orbit film unchanged. |
| ~~`hero.webp`~~ | kept as `alternates/hero-home-v1.webp` | Previous busy home poster — not used for hero after design feedback |
| `module-growth-os.webp` | `assets/stargo-product/gos10-growth-control-tower.webp` (+480/768/1024) | Growth OS core-system card |
| `module-sales-desk.webp` | `assets/stargo-product/sw028-sales-desk-inquiry-reply.webp` (+variants) | Sales Desk core-system card + stage 002 |
| `module-erp.webp` → **pure-UI** | `assets/stargo-editorial/brand-family-02.webp` (+400/800/1200) | ERP core-system card |
| `module-ai-studio.webp` → **pure-UI** | `assets/stargo-editorial/os-boot.webp` (+variants) | AI 创作 / AI Creative core-system card |
| `module-digital-workforce.webp` → **pure-UI** | `assets/stargo-product/sw006-expert-teams.webp` (+variants) | 数字员工 / workforce tile + team card |
| `product-cockpit.webp` | `sw003-ai-workspace-home.webp` + `os-cockpit.webp` | 总控制 / workspace home + Growth OS story still |
| `product-sales.webp` | `assets/stargo-editorial/os-sales-desk.webp` | Second sales workbench → capability Sales Desk story (sw028 already used by the module) |
| `product-crm.webp` | `gos05-buying-committee.webp` | 客户管理 → buying-committee / account roles |
| `product-inbox.webp` | `os-inquiries.webp` | 客户对话 → inquiries still |
| `product-apps.webp` | `sw004-experts-library.webp` | 应用库 → experts / role library |
| `product-system-map.webp` | `os-desktop.webp` | 系统地图 → desktop / connections still |
| `product-workflow.webp` | `sw008-workflow-library.webp` | 工作流引擎 → workflow library |
| `og-cover.png` | `assets/stargo-editorial/og-cover.png` | 1200×630 share cover (path unchanged) |

## Alternates (not wired)

| File | Note |
| --- | --- |
| `alternates/hero-home-v1.webp` | Previous busy home poster — not used for the hero after design feedback |
| `alternates/og-cover.webp` | WebP twin of the PNG cover |

## Leftover prior-pass stills (2026-09-22 follow-up)

gos01, gos09, gos11 and sw033 were still the older 1268×714 screens. They now
use curated pack files. Paths and slot wiring did not change; width variants
were regenerated. Blog covers do not source these four, so they were left as
they were.

| Kept filename | Pack file | Narrative | Where it shows |
| --- | --- | --- | --- |
| `gos01-market-thesis.webp` | `product-growth.webp` (增长分析) | Growth | Homepage stage 001; capability trade-intelligence thumbnail |
| `gos09-reorder-radar.webp` | `alt-control.webp` (控制中心) | Cockpit / control | Capability reorder thumbnail |
| `gos11-dormant-reactivation.webp` | `alt-home.webp` (首页工作台) | Workspace home | Homepage stage 005 |
| `sw033-sales-desk-document-pack.webp` | `product-sales.webp` (销售工作台2) | Sales | Homepage stage 003, hero gallery, notices card. Same pixels as `os-sales-desk.webp` |

`product-growth.webp` is the growth-analytics composite. Its own copy says the
analytics runtime is not started on the demonstration host. `alt-control.webp`
is the control-centre composite; the application table includes a register-token
column and an `sslip.io` host. Both were placed because this pass was asked to
use the remaining pack files. They are illustrative demonstration screens.

### Scan of the other product and editorial stills

Already on the curated chrome or the pure-UI follow-up (unchanged this pass):
Growth OS card, Sales Desk card, ERP card, AI studio card, digital-workforce
card, workspace/experts, workflow library, buying committee, inbox, system map,
hero poster, Open Graph cover.

Left as atmosphere, not replaced: full-bleed concept stills whose frames are
`object-fit: cover` (quote studio, dispatch bay, agent lanes, login, loading,
ontology, loop, brand family, glows) and the silo, phone and avatar sets. No
remaining pack still is a collection, approval-gate or knowledge-model screen,
and a 16:9 interface cropped into those full-bleed frames only shows the middle
third. Stage 004 (回款与服务) stays `brand-family-01` for the same reason.

## Display size

`css/stargo-fusion.css` raises the core-system dashboard plate from 700px to
`min(1040px, 100%)`, eases the sticky-panel `max-height`, and enlarges hero
gallery tiles to 18–20rem so the new screenshots read clearly.
