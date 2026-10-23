# STARGO WORK app icons

- Source: the owner's mobile-app repository `stargo-work-app`, commit `d46c4fc`, folder `wechat-miniprogram/assets/icons/` (22 RGBA PNGs, 512 × 512).
- These are the app tiles of the STARGO WORK desktop. 21 are navy tiles with a white outline glyph and a short bar in their category's colour (core #8ddaf5, business #72ddca, creative #b8baf6, automation #b1c2df). The voice assistant (`voice-128.webp`) is the product's own bright-blue waveform tile, the icon the real desktop shows for 语音助手 (`assets/stargo-product/live01-desktop-home-16x9.webp`); it is kept exactly as supplied, not redrawn to match the others.
- Export: each tile cropped to its own edge (the transparent margin removed), resized to 128 × 128 with Lanczos, WebP quality 85 (Pillow). No retouching or recolouring. 55.3 KB for all 22.
- Written by `tools/imagegen/prepare-app-icons.py`, which also holds the map from the source file names to these names. Files are named by the app's STARGO name, never by the open-source project an app was built on.
- Used by the capability page's app band (`#apps`, `tools/app-suite.mjs`), shown at 64 / 56 / 48 CSS px.
- The icons are entry points of the desktop, not evidence that an app is deployed or connected for any customer; the page says so beside them.

| File | App (zh / en) |
|---|---|
| brain-128.webp | 智脑 / AI Brain |
| knowledge-128.webp | 知识库 / Knowledge Base |
| voice-128.webp | 语音助手 / Voice Assistant |
| notes-128.webp | 笔记 / Notes |
| browser-128.webp | 浏览器 / Browser |
| ai-browser-128.webp | AI 浏览器 / AI Browser |
| enterprise-128.webp | 企业管理 / Enterprise Management |
| conversations-128.webp | 客户会话 / Customer Chat |
| ai-staff-128.webp | 数字员工 / AI Staff |
| search-128.webp | 智搜 / Smart Search |
| outreach-128.webp | 拓客 / Outreach |
| due-diligence-128.webp | 合规尽调 / Due Diligence |
| cockpit-128.webp | 经营驾驶舱 / Business Cockpit |
| canvas-128.webp | 无限画布 / Infinite Canvas |
| video-editor-128.webp | 视频编辑 / Video Editor |
| reference-video-128.webp | 参考视频 / Reference Videos |
| video-studio-128.webp | 视频制作 / Video Studio |
| cad-128.webp | 3D CAD / 3D CAD |
| workflows-128.webp | 流程编排 / Workflows |
| scripts-128.webp | 脚本执行 / Scripts |
| connections-128.webp | 应用连接 / App Connections |
| model-gateway-128.webp | 模型网关 / Model Gateway |
