# 第 2 轮设计自检 — stargowork-com — 2026-11-09

预览：https://stargowork.com/　页面：/ /capabilities /pricing /contact

自动检查只会压低上限，审美判断由代理看截图打分（写进 round-N.json 的 scores，再跑 verdict）。

| 维度 | 自动上限 | 代理评分 | 自动发现 |
| --- | --- | --- | --- |
| 排版 | 3 | 待填 | note: 18 档字号，层级可能过多（/ desktop）<br>note: 17 档字号，层级可能过多（/ tablet）<br>note: 17 档字号，层级可能过多（/ mobile）<br>issue: 用了 5 个字族：Inter, Inter Tight, Instrument Serif Roman, Overused Grotesk, Interdisplay（/capabilities desktop）<br>note: 22 档字号，层级可能过多（/capabilities desktop）<br>issue: 用了 5 个字族：Inter, Inter Tight, Instrument Serif Roman, Overused Grotesk, Interdisplay（/capabilities tablet）<br>note: 21 档字号，层级可能过多（/capabilities tablet）<br>issue: 用了 5 个字族：Inter, Inter Tight, Instrument Serif Roman, Overused Grotesk, Interdisplay（/capabilities mobile）<br>note: 22 档字号，层级可能过多（/capabilities mobile）<br>issue: 用了 4 个字族：Inter, Overused Grotesk, Inter Tight, Interdisplay（/pricing desktop）<br>note: 11 档字号，层级可能过多（/pricing desktop）<br>issue: 用了 4 个字族：Inter, Overused Grotesk, Inter Tight, Interdisplay（/pricing tablet）<br>note: 11 档字号，层级可能过多（/pricing tablet）<br>issue: 用了 4 个字族：Inter, Overused Grotesk, Inter Tight, Interdisplay（/pricing mobile）<br>note: 12 档字号，层级可能过多（/pricing mobile） |
| 留白 | 5 | 待填 | — |
| 视觉层级 | 5 | 待填 | — |
| 色彩 | 2 | 待填 | blocker: axe color-contrast（serious）× 10（/ desktop）<br>blocker: axe color-contrast（serious）× 9（/ tablet）<br>blocker: axe color-contrast（serious）× 6（/ mobile）<br>blocker: axe color-contrast（serious）× 6（/capabilities desktop）<br>blocker: axe color-contrast（serious）× 1（/capabilities tablet）<br>blocker: axe color-contrast（serious）× 1（/capabilities mobile） |
| 动效 | 2 | 待填 | blocker: 加载 + 滚动期间 CLS = 1.312（> 0.1）（/ desktop）<br>issue: 长任务合计 1329ms，动效可能卡顿（/ desktop）<br>blocker: 减少动态效果模式下 24 块文字仍不可见（/ desktop）<br>issue: 关掉 JavaScript 后 12 块文字不可见（/ desktop）<br>blocker: 加载 + 滚动期间 CLS = 1.227（> 0.1）（/ tablet）<br>issue: 长任务合计 1412ms，动效可能卡顿（/ tablet）<br>blocker: 加载 + 滚动期间 CLS = 0.976（> 0.1）（/ mobile）<br>issue: 长任务合计 1739ms，动效可能卡顿（/ mobile）<br>blocker: 加载 + 滚动期间 CLS = 0.696（> 0.1）（/capabilities desktop）<br>issue: 长任务合计 881ms，动效可能卡顿（/capabilities desktop）<br>blocker: 减少动态效果模式下 10 块文字仍不可见（/capabilities desktop）<br>issue: 关掉 JavaScript 后 4 块文字不可见（/capabilities desktop）<br>blocker: 加载 + 滚动期间 CLS = 0.291（> 0.1）（/capabilities tablet）<br>issue: 长任务合计 1033ms，动效可能卡顿（/capabilities tablet）<br>blocker: 加载 + 滚动期间 CLS = 0.316（> 0.1）（/capabilities mobile）<br>issue: 长任务合计 1406ms，动效可能卡顿（/capabilities mobile）<br>issue: 长任务合计 482ms，动效可能卡顿（/pricing desktop）<br>blocker: 减少动态效果模式下 3 块文字仍不可见（/pricing desktop）<br>issue: 关掉 JavaScript 后 8 块文字不可见（/pricing desktop）<br>issue: 长任务合计 666ms，动效可能卡顿（/pricing tablet）<br>issue: 长任务合计 508ms，动效可能卡顿（/pricing mobile）<br>note: CLS = 0.052（/contact desktop）<br>blocker: 减少动态效果模式下 4 块文字仍不可见（/contact desktop）<br>issue: 关掉 JavaScript 后 3 块文字不可见（/contact desktop）<br>note: CLS = 0.060（/contact tablet）<br>issue: 长任务合计 765ms，动效可能卡顿（/contact tablet）<br>blocker: 加载 + 滚动期间 CLS = 0.107（> 0.1）（/contact mobile）<br>issue: 长任务合计 902ms，动效可能卡顿（/contact mobile） |
| 微交互 | 2 | 待填 | blocker: axe aria-prohibited-attr（serious）× 8（/ desktop）<br>blocker: axe aria-prohibited-attr（serious）× 8（/ tablet）<br>blocker: axe aria-prohibited-attr（serious）× 8（/ mobile）<br>blocker: 1 个元素键盘聚焦时没有可见焦点：input#Subscribe.subscribe-field-main（/pricing tablet）<br>blocker: 1 个元素键盘聚焦时没有可见焦点：input#Subscribe.subscribe-field-main（/pricing mobile）<br>blocker: 2 个元素键盘聚焦时没有可见焦点：button.stargo-copy, input#Subscribe.subscribe-field-main（/contact tablet）<br>blocker: 2 个元素键盘聚焦时没有可见焦点：button.stargo-copy, input#Subscribe.subscribe-field-main（/contact mobile） |
| 响应式 | 2 | 待填 | issue: 42 个可点击元素小于 24px：a.stargo-skip 40×1, a.button-link 79×18, a.button-link 48×18（/ desktop）<br>issue: 78 张图片没写 width/height（会跳布局）（/ desktop）<br>blocker: axe target-size（serious）× 18（/ desktop）<br>issue: 5 个可点击元素小于 24px：a.stargo-skip 40×1, a.logo-first 550×21, a.button-with-line 86×21（/ tablet）<br>issue: 60 张图片没写 width/height（会跳布局）（/ tablet）<br>issue: 5 个可点击元素小于 24px：a.stargo-skip 40×1, a.logo-first 374×21, a.button-with-line 96×21（/ mobile）<br>issue: 41 张图片没写 width/height（会跳布局）（/ mobile）<br>issue: 48 个可点击元素小于 24px：a.stargo-skip 40×1, a.button-link 79×18, a.button-link 48×18（/capabilities desktop）<br>issue: 76 张图片没写 width/height（会跳布局）（/capabilities desktop）<br>blocker: axe target-size（serious）× 18（/capabilities desktop）<br>issue: 11 个可点击元素小于 24px：a.stargo-skip 40×1, a.rk-testimonials-link 105×19, a.rk-testimonials-link 105×19（/capabilities tablet）<br>issue: 58 张图片没写 width/height（会跳布局）（/capabilities tablet）<br>issue: 11 个可点击元素小于 24px：a.stargo-skip 40×1, a.rk-testimonials-link 98×17, a.rk-testimonials-link 98×17（/capabilities mobile）<br>issue: 44 张图片没写 width/height（会跳布局）（/capabilities mobile）<br>issue: 39 个可点击元素小于 24px：a.stargo-skip 40×1, a.button-link 79×18, a.button-link 48×18（/pricing desktop）<br>issue: 66 张图片没写 width/height（会跳布局）（/pricing desktop）<br>blocker: axe target-size（serious）× 18（/pricing desktop）<br>issue: 2 个可点击元素小于 24px：a.stargo-skip 40×1, input 218×23（/pricing tablet）<br>issue: 48 张图片没写 width/height（会跳布局）（/pricing tablet）<br>issue: 2 个可点击元素小于 24px：a.stargo-skip 40×1, input 218×23（/pricing mobile）<br>issue: 29 张图片没写 width/height（会跳布局）（/pricing mobile）<br>issue: 39 个可点击元素小于 24px：a.stargo-skip 40×1, a.button-link 79×18, a.button-link 48×18（/contact desktop）<br>issue: 40 张图片没写 width/height（会跳布局）（/contact desktop）<br>blocker: axe target-size（serious）× 18（/contact desktop）<br>issue: 2 个可点击元素小于 24px：a.stargo-skip 40×1, input 218×23（/contact tablet）<br>issue: 22 张图片没写 width/height（会跳布局）（/contact tablet）<br>issue: 2 个可点击元素小于 24px：a.stargo-skip 40×1, input 218×23（/contact mobile）<br>issue: 3 张图片没写 width/height（会跳布局）（/contact mobile） |
| 原创性 | 5 | 待填 | — |

## 动效清单（模板动效是否全开）

| 页面 | 视口 | 状态 | 引擎 | 插件 | ScrollTrigger | 时间线 | CSS 动画 | Webflow IX | 未接管标记 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | desktop | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 25 | 33 | 8 | 开 | 0 |
| / | tablet | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 24 | 33 | 8 | 开 | 0 |
| / | mobile | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 24 | 38 | 17 | 开 | 0 |
| /capabilities | desktop | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 4 | 27 | 23 | 开 | 0 |
| /capabilities | tablet | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 4 | 27 | 23 | 开 | 0 |
| /capabilities | mobile | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 4 | 28 | 31 | 开 | 0 |
| /pricing | desktop | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 3 | 17 | 0 | 开 | 0 |
| /pricing | tablet | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 3 | 25 | 0 | 开 | 0 |
| /pricing | mobile | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 3 | 25 | 0 | 开 | 0 |
| /contact | desktop | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 2 | 18 | 0 | 开 | 0 |
| /contact | tablet | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 2 | 26 | 0 | 开 | 0 |
| /contact | mobile | — | gsap 3.15.0 | ScrollTrigger SplitText Observer | 2 | 26 | 0 | 开 | 0 |

## 截图

> 整页截图是滚回顶部后拍的，滚动触发的内容可能显示成空白。看到大片空白先真实滚动复核，不要直接判成站点问题。

- round-2/home-hero-0ms.png
- round-2/home-hero-500ms.png
- round-2/home-hero-1500ms.png
- round-2/home-desktop.png
- round-2/home-tablet.png
- round-2/home-mobile.png
- round-2/home-nojs.png
- round-2/capabilities-desktop.png
- round-2/capabilities-tablet.png
- round-2/capabilities-mobile.png
- round-2/capabilities-nojs.png
- round-2/pricing-desktop.png
- round-2/pricing-tablet.png
- round-2/pricing-mobile.png
- round-2/pricing-nojs.png
- round-2/contact-desktop.png
- round-2/contact-tablet.png
- round-2/contact-mobile.png
- round-2/contact-nojs.png
