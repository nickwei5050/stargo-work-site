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
| `hero.webp` | `assets/stargo-motion/orbit-poster.webp` | Hero film poster / About large still. Orbit film unchanged. |
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
| `alternates/product-growth.webp` | 增长分析 — same conceptual slot as gos10; module-growth-os won the Growth OS card |
| `alternates/alt-home.webp` | Optional hero/home alternate |
| `alternates/alt-control.webp` | Optional control-centre alternate |
| `alternates/og-cover.webp` | WebP twin of the PNG cover |

## Display size

`css/stargo-fusion.css` raises the core-system dashboard plate from 700px to
`min(1040px, 100%)`, eases the sticky-panel `max-height`, and enlarges hero
gallery tiles to 18–20rem so the new screenshots read clearly.
