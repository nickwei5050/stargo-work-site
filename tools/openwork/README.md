# tools/openwork — OPEN WORK product images

STARGO WORK's core app is **OPEN WORK**, a chat workspace. The product images
on the site (`assets/stargo-product/ow*.webp`) and the share cover
(`assets/stargo-editorial/og-cover.png`) are rendered from an HTML rebuild of
that interface, so they stay sharp at any size and can be re-rendered when the
interface or the story changes.

**Everything inside a conversation is demonstration data.** Buyers, companies,
prices, counts and dates are made up for the picture (Nordhem Living, Fjällvik
Outdoor AB, US$ 3.85, 38 inquiries …). What is real: the layout, the sidebar
and its 15 apps, the five quick actions, 「选择后只填入输入框，不会自动发送」 and the
composer footnote 「工具操作遵循当前授权；外部客户发送未启用。」. The pages that
show these images carry a 「演示数据」 / "Demo data" badge and an alt text that
says so (`tools/editorial-images.mjs`, checked by `tools/verify-editorial.mjs`).
Do not add real customer names, logos or measured results to a scene.

## Files

- `scenes.mjs` — the CSS and the HTML of every scene (full app, phone cards,
  crops). Edit copy and demo data here.
- `render.mjs` — writes the scenes to `.wrangler/openwork/` (git-ignored),
  screenshots them in Chromium, encodes WebP into `assets/stargo-product/`,
  registers each image in `tools/imagegen/product-assets.json`, writes the
  share cover and its entry in `tools/imagegen/assets-manifest.json`, and
  writes `hotspots.json`.
- `hotspots.json` — generated: where the marked elements (`data-hot`) sit in
  each image, in percent, for callouts placed over a shot.

## Re-render

```sh
STARGO_TOOL_PACKAGE=/path/to/toolpkg/package.json node tools/openwork/render.mjs
node tools/openwork/render.mjs --only ow02-inquiry,ow12-inquiry-card   # some images
node tools/openwork/render.mjs --only og-cover                          # the share cover only (needs ow02 rendered)
npm run build:pages
```

`sharp`, `lucide-static`, `@fontsource/noto-sans-sc` and
`@fontsource-variable/inter` are not dependencies of this repository; point
`STARGO_TOOL_PACKAGE` at a `package.json` of an install that has them (see
`tools/paths.mjs`). Chromium is this repository's `@playwright/test`
(`PLAYWRIGHT_BROWSERS_PATH`, or `OPENWORK_CHROMIUM=/path/to/chrome`).

The script fails instead of writing an image when a scene does not fit its
frame: the thread overflows the 880px app window (the question at the top
would be cut off), a button or tag wraps, or text is truncated.

## What is rendered

| id | scene | render | files |
|---|---|---|---|
| `ow01-home` … `ow06-follow` | full app: home, inquiry, quote/PI, outreach, weekly brief, follow-up | 1280×880 CSS px @2x = 2560×1760 | main 1600w (q85) + 800/1200/2400 |
| `ow32-inquiry-focus` … `ow35-brief-focus` | the chat column of ow02–ow05 alone (no sidebar, title bar or composer), for the desktop showcase | 800 CSS px wide @3x = 2400w | main 1600w + 1200/1800/2400 |
| `ow12-inquiry-card` … `ow16-follow-card` | phone cards, no sidebar, 15px phone type | 390 CSS px wide @3x = 1170w | main 1170w + 780 |
| `ow20-apps` | sidebar, brand row through New API（AI 网关） | @3x (705w) | main + 520 |
| `ow21-pi-check` | close-up: price-check steps + the PI's number and its 审批中 bar | 380 CSS px in phone type @3x = 1140w | main + 760 |
| `ow22-approval-bar` | close-up: the reply draft's first lines and 对外发送需要你确认 + 批准 | 380 CSS px in phone type @3x | main + 760 |
| `ow24-step-log` | close-up: 哪些客户该跟进了？ and the three steps AI wrote down | 380 CSS px in phone type @3x | main + 760 |
| `ow23-quick-actions` | message box, footnote and the quick actions (not placed on the homepage since 2026-10-09 review) | @2x | main + 720/1200 |

The reply bars say 「对外发送需要你确认」 only. Which app sends a message
after approval, and what the composer footnote means, is on the owner's list;
do not add either to a scene until the owner confirms it.

Never upscaled: every main file and variant is at most the render's width.
