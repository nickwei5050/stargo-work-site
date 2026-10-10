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
composer footnote 「工具操作遵循当前授权；对外发送需有权人批准。」 (until round 2 it
read 「…外部客户发送未启用。」; the owner confirmed every feature is live, so it now
states the approval rule instead). The pages that
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
| `ow07-welcome` | full app: the real OPEN WORK home view (welcome hero 「你好，欢迎使用 OPEN WORK / 你的 AI 外贸业务执行系统」, 快速任务 tabs, six task cards, composer) | 1280×880 CSS px @2x | main 1600w + 800/1200/2400 |
| `ow08-crm` … `ow11-staff` | chat on the left, an app open in OPEN WORK's right-hand panel: 广交会名片 → 客户CRM, 报价未回复 → 自动化中心, 定金到账 → 企业ERP 生产工单, 新询盘派工 → 专家 (STARGO 数字员工 288 名) | 1280×880 CSS px @2x | main 1600w + 800/1200/2400 |
| `ow32-inquiry-focus` … `ow35-brief-focus` | the chat column of ow02–ow05 alone (no sidebar, title bar or composer), for the desktop showcase | 800 CSS px wide @3x = 2400w | main 1600w + 1200/1800/2400 |
| `ow12-inquiry-card` … `ow16-follow-card` | phone cards, no sidebar, 15px phone type | 390 CSS px wide @3x = 1170w | main 1170w + 780 |
| `ow17-crm-card`, `ow18-automation-card`, `ow19-erp-card`, `ow25-staff-card` | phone cards of ow08–ow11: the chat's steps and the app's content as one column (customer list, flow, work order and materials, roster), 15px phone type | 390 CSS px wide @3x = 1170w | main 1170w + 780 |
| `ow20-apps` | sidebar, brand row through AI 网关 | @3x (705w) | main + 520 |
| `ow21-pi-check` | close-up: price-check steps + the PI's number and its 审批中 bar | 380 CSS px in phone type @3x = 1140w | main + 760 |
| `ow22-approval-bar` | close-up: the reply draft's first lines and 对外发送需要你确认 + 批准 | 380 CSS px in phone type @3x | main + 760 |
| `ow24-step-log` | close-up: 哪些客户该跟进了？ and the three steps AI wrote down | 380 CSS px in phone type @3x | main + 760 |
| `ow23-quick-actions` | message box, footnote and the quick actions (not placed on the homepage since 2026-10-09 review) | @2x | main + 720/1200 |

The reply bars say 「对外发送需要你确认」 only; the composer footnote says the
same rule (对外发送需有权人批准). Which app sends a message after approval is not
named in any scene.

Never upscaled: every main file and variant is at most the render's width.

`ow24` is the step-record close-up (`ow24-step-log`); the digital-employee phone
card is therefore `ow25-staff-card`.

## Blog covers

The seven article covers (`assets/blog/*.webp`) are these renders fitted into a
1200×800 frame as a window on one plate colour: `node tools/blog-covers.mjs`
(Pillow; `tools/blog-covers.py` draws the frame). Which render belongs to which
article is the `COVERS` table in `tools/blog-covers.mjs`; its recipe records the
sha256 of the source render, so re-rendering a scene here and re-running that
script rebuilds exactly the covers made from it. A cover source must be an
`ow<nn>-` render registered by `render.mjs`.

## Demo video

A 16-second silent loop of the inquiry story, in Chinese and English, made
from the same OPEN WORK interface as the stills (the page loads the stills'
CSS from `scenes.mjs` and adds its own): a demo buyer's inquiry arrives → AI
reads it (key phrases highlighted, facts as chips, three steps) → an English
reply streams in while the PI fills in → the price check flags 「单价低于标准价
→ 需销售经理审批」 and the approval bar slides in → the sales manager's cursor
taps 批准 → 已批准 · 已发送 and the approval log gets its third line → end card
(the homepage headline + STARGO WORK) → the window dissolves back to the first
frame, so the loop has no seam. The 「演示数据」 / "Demo data" badge sits in the
window's title bar in every frame. Everything in it is demonstration data
(Nordhem Living, Erik, STARGO Demo Manufacturing, US$ 3.85, 14:32 …).

- `video-page.mjs` — the animation page: copy for both languages (`STR`), the
  timeline (`T`, in seconds), the CSS, and the in-page clock. Nothing moves by
  itself: `window.__seek(t)` sets every element for time `t`, and
  `window.__check(t)` lists clipped, wrapping or overlapping text.
- `video-phone.mjs` — the phone cut (review, round 2: the desktop film shown
  362px wide on a phone put its interface text at about 3.5 CSS px). Same
  story, copy, demo data and interface CSS, laid out as the app reads on a
  phone: one 360×600 CSS px column — the chat follows its newest card up, the
  Sales Workbench opens over it as a sheet with the PI and its approval bar,
  and a compact step rail spells out only the current step. Its own timeline
  (`TM`: the PI fills in after the reply) and its own `__check(t)`, which also
  fails on any text under 13 CSS px (so every text is 12 CSS px or more on a
  360px phone).
- `video.mjs` — opens each cut in Chromium (desktop: 1440×900 CSS px,
  deviceScaleFactor 1; phone: 360×600 at deviceScaleFactor 2), checks the
  layout at every beat, screenshots all 480 frames (30 fps) and encodes them
  with ffmpeg; writes `video.json` (sizes, durations, SHA-256 of the frames and
  of each file, per language and cut).

```sh
STARGO_TOOL_PACKAGE=/path/to/toolpkg/package.json node tools/openwork/video.mjs              # zh + en, both cuts, ~6 min
node tools/openwork/video.mjs --lang en                    # one language
node tools/openwork/video.mjs --cut phone                  # one cut (desktop | phone)
node tools/openwork/video.mjs --lang zh --still 3,10.9     # PNG stills of some seconds, to look at
node tools/openwork/video.mjs --check                      # layout checks only
```

Needs ffmpeg/ffprobe on PATH (`FFMPEG=` overrides) besides what `render.mjs`
needs. The script stops instead of encoding when the layout check fails.

| file | what |
|---|---|
| `assets/stargo-product/ow-demo-zh.mp4`, `ow-demo-en.mp4` | H.264 High, 1440×900, 30 fps, yuv420p BT.709, `+faststart`, no audio (CRF 24, `OW_VIDEO_CRF_MP4`) |
| `assets/stargo-product/ow-demo-zh.webm`, `ow-demo-en.webm` | VP9, two-pass constant quality (CRF 33, `OW_VIDEO_CRF_WEBM`), no audio |
| `assets/stargo-product/ow-demo-zh-poster.webp`, `ow-demo-en-poster.webp` | the frame at 10.9 s: everything filled in, the manager's cursor on 批准 / Approve |
| `assets/stargo-product/ow-demo-zh-phone.{mp4,webm}`, `ow-demo-en-phone.{mp4,webm}` | the phone cut, 720×1200, same encoders and settings |
| `assets/stargo-product/ow-demo-zh-phone-poster.webp`, `ow-demo-en-phone-poster.webp` | the phone cut at 10.9 s: the PI, its approval bar and the cursor on 批准 / Approve |

The served files name no encoder: each film is encoded into
`.wrangler/openwork/video/` and then copied, stream untouched, without x264's
banner (an SEI unit with its name, licence and web address) and without
ffmpeg's "Lavc …" stream tags; `tools/make-dist.mjs` checks the shipped films
for those strings.

The page plays the phone cut on a phone held upright (at most 640px wide and
no wider than 4:3: `DEMO_PHONE_MEDIA` in `tools/ow-blocks/demo-video.mjs`, a
`<picture>` still for each cut, and `js/stargo-ow.js` puts only that cut's
sources in the video, because browsers before Chrome/Firefox 120 ignore
`media` on a video's `<source>`), and the
first time it plays it starts at `START_T` (2 s: the inquiry is in and AI is
reading it), not at the near-empty first second.

Repeatable: the same command renders byte-identical frames and files. Chromium
runs with software raster on one thread (`--disable-gpu
--num-raster-threads=1 …`); without that a few anti-aliased edge pixels
differ between runs. The composer in the video shows the input box only,
without the footnote.
