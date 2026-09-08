# STARGO WORK · 恢复原模板设计、新增 About/Blog — 修复与验收记录

日期：2026-09-06。基线：`7251bf0`（分支 `release/website-qa-fixes-20260905`，线上部署 `3fbf697e`）。用户要求以 Lifelogx、Mōno 原始模板为基准恢复配色、图片、排版与完整动效，只适配 STARGO 文案；删除公开的“网站模板”说明；增加 Lifelogx 的 Blog / About 页面并接入中英导航与 SEO。

本文记录实际修改与实际测量到的结果。数字来自本次运行的脚本输出；没有运行的项目明确标为未测。

## 一、七张截图缺陷的处理

| # | 截图问题 | 根因（生成源） | 修复 | 验收 |
| --- | --- | --- | --- | --- |
| 1 | 首页定价阶梯标题：彩色球 Logo 与文字重叠 | Mōno 把球固定在标题块左侧 50px 并给首行 60px 缩进，只对模板自己那一行英文成立 | `tools/build-site.mjs` 把球移入 `<h2>` 内成为首字前的行内元素；`css/stargo-fusion.css` 去掉缩进 | verify-restore 在 390/768/1280/1440、中英测量球与每个字形矩形的交集 < 40px²，标题 ≤ 2–3 行 |
| 2 | 智能层：手机遮住中文大标题；色彩非原版 | `stargo-fusion.css` 用铜橙色覆盖 Lifelogx 粉色变量、渐变与背景图；把大标题锚到渐变容器并用 22vw/320px；`lxPage()` 替换全部原图 | 删除全部调色与背景覆盖；大标题按原模板锚定到页面容器，仅用 80px（手机 72px）补足 Lifelogx 原本在文档流中的导航高度；中文字号按 CJK 字面高度换算（≤226px，即 20rem“Lifelogx”的字面高度）；不再替换任何原图 | 1280：大字 y=80、手机 y=326，与原模板一致；verify-restore 用字号计算字面底边并要求手机顶边不高于它 |
| 3 | 左侧动效卡片文字裁切 | `tools/copy.mjs` 三张卡片文案远超模板固定高度（24rem / 21.5rem）容量 | 按原模板密度重写为 4 行 / 3 行以内的文案，保留业务含义；未改字号，未加 `!important` | 1024–1920 测量：每张卡片都存在文案与标题完整位于卡片内的滚动状态 |
| 4 | 大幅滚动渐变文字显示不完整 | `image 24.png` 透明叠图被换成不透明 AI 雕塑；渐变被改色 | 恢复原图与原渐变 | verify-restore 在 5 个滚动位置检查四个标题至少 3 个状态可读且不越界 |
| 5 | 横向滚动胶囊头像被换成机械雕塑 | `lxPage()` 用 AI 角色图替换 Ellipse / Team Image | 恢复全部 48 个原头像（构建断言数量） | 截图对照 |
| 6 | “不再……”文字被中央图片挡住 | `no-writing-sc.avif` 被换成不透明宽图；粉色渐变被改色；此外 `.lx-scope h3` 提升了元素选择器优先级，使 `.big-gradient-text` 的 9vw 字号被 Mōno 的 `h3` 覆盖为 40px | 恢复原图与渐变；`tools/lifelogx-prepare.mjs` 改用 `:where(.lx-scope)` 作用域，元素规则保持模板原有优先级 | 计算样式对照原模板：字号 115.2px 一致；桌面端文字矩形与手机图不相交 |
| 7 | 公开的“网站模板”标题与三套模板说明 | `tools/copy.mjs` NOTICES | 中英同步删除该段；保留运行时库、字体、图片素材、上游软件与隐私 / 条款；图片素材一节补充“人物照片、示例 Logo 墙为已授权设计素材，不代表真实客户、员工、合作伙伴或客户评价” | 构建断言 + 页面检查 |

## 二、按 Mōno 原设计恢复的四个区域

| 区域 | 恢复内容 | 文案边界 |
| --- | --- | --- |
| 8 个 Logo 翻转网格 | 模板网格、8 张示例 Logo、翻转动画（IX2 `a-227`）原样保留；`assets/brands/` 放入真实 Logo 后自动替换 | 标题“(合作伙伴墙 · 示例)”，右侧“示意 Logo · 非真实客户” |
| 四张 Blog 卡片 | 模板卡片、原图（Mōno 产品摄影重新编码为 `assets/blog/`）、悬停动画；四张卡片是最新四篇文章，“全部文章”进入博客 | 文章为真实产品内容 |
| 多人合照 + 玻璃表单 | `.photo-section` 原照片、`backdrop-filter` 玻璃卡片恢复；删除深色不透明底 | 表单验证、错误提示、邮件备选链接不变 |
| 人物照片 + 底部渐变评价卡片 | 首页四张粘性卡片恢复原肖像与人物影片；联系页引用卡恢复人物影片 | 四张卡片改为“示例场景”：角色化说话人（外贸业务员 / 外贸经理 / 销售总监 / 总经理）+“示例场景”标注，引语为产品能说明的内容；客户 Logo 位置改为 STARGO 字标；不出现客户名、公司名、星级、业绩 |

## 三、About / Blog / 文章

- 模板来源：`tools/templates/lifelogx/` 新增 `about.html`、`blog.html`、`post.html` 与三个页面 bundle（来自用户上传的原包，`index.html` 与仓库原有文件字节一致）。`tools/lifelogx-prepare.mjs` 默认从仓库读取，切出四个片段，导出四页 IX3 时间线（类名全部加 `lx-` 前缀；About/Blog 的加载动画改指向页面专有类，避免全站共用页面 ID 时误触发）。
- 路由：`about.html`、`blog.html`、`blog/<slug>.html`，英文在 `en/` 下同结构；`tools/chrome.mjs` 的 `SITE_PAGES` 是唯一登记表，`relocateLinks` / `relocateAssets` 按目录深度重写链接与资源路径；文章不进入主导航，进入悬浮菜单与页脚“页面”栅格。
- 数据入口：`tools/blog.mjs`（每篇文章一条：slug、日期、封面、中英标题 / 摘要 / 正文 HTML）+ `tools/blog-covers.mjs`（封面编码）。6 篇文章：全球贸易 AI 操作系统、从询盘到报价、288 个 AI 员工、审批闸门、企业本体、从一条流程开始。全部为产品说明，无客户故事、无作者资历、无排名承诺。
- SEO：每页 `title`、`description`、canonical、zh-CN / en / x-default hreflang、Open Graph（文章为 `article` 类型并携带发布时间、封面）、Twitter card、JSON-LD（文章 `BlogPosting` + `BreadcrumbList`，博客首页 `Blog` 列出全部文章，About 为 `AboutPage`）；`dist/sitemap.xml` 由 `tools/make-dist.mjs` 从 `SITE_PAGES` 生成，文章 `lastmod` 取文章日期。
- 文章页：一个 `<h1>`，正文 `<h3>` 分节，日期 + 署名（“STARGO WORK 团队”）+ 返回全部文章；右栏“相关文章”为其余文章链接；下方“更多文章”三张卡片；模板的滚动淡入交互保留。
- About：模板版式保留；四个圆形改为 AI 员工岗位（STARGO 自有角色图，非人像）；“Our Story”为 STARGO 真实来历与做法；三张价值卡片为产品原则；“careers”列表改为五条流程入口，全部指向联系页。

## 四、其他修复（验收中发现）

- Lifelogx IX3 导出从未给 `wf:class` 目标加前缀：首页入场动画（大字、手机、按钮、渐变）在线上从未生效，Lifelogx 的按钮悬停动画反而作用到 Mōno 的 `.button` 元素上。已修正，`tools/lifelogx-prepare.mjs` 会断言不再出现未加前缀的类目标。
- 英文顶部导航在 992–1279px 下标签折行到月亮图标下方并被 16px 位移裁切（“telligence”“apabilities”）；1024–1100px 英文页关闭状态的悬浮菜单宽于视口，页面可横向滚动 34–39px。已在 `stargo-fusion.css` 修正（图标与标签不换行、该区间略小字号、悬浮菜单标签按视口取字号、法律链接行允许换行）。
- 页脚：模板的“页面”栅格是四等分列放五个单词链接，STARGO 三列较长标签在 1024–1280px 被裁切（“AI Workforce”“企业与治理”）；联系列的 `sales@stargomoto.com` 与 “WhatsApp +86 187 7512 7878” 在 768–1024px 超出列宽。页面栅格改为三列；页脚链接在 1280px 以下用 15px 并隐藏 WhatsApp 前缀（链接为 wa.me，图标链接保留 WhatsApp 无障碍名称）。1280px 及以上，“WhatsApp”与号码之间的空格被 Mōno 的 flex 文本容器裁掉，用 0.3em 外边距补回。
- 智能层 / 数字员工的三张动效卡片在 768–991px（三列各 224px）容不下四行 2rem 文字，模板自己的英文文案在该宽度同样被裁切；该区间改为 1.5rem。992–1279px 英文卡片标题改为 1.6rem 并把 “Teams in seconds” 改为 “Instant teams”、“Forward Deployed” 改为 “Embedded FDE”，避免标题折行把正文顶出卡片。
- “不再 / 等提示” 大字：CJK 可在任意字间断行，模板 1fr/2.5fr/1fr 栅格把“等提示”压成两行；改为不换行，列宽随词伸缩，与模板拉丁词行为一致。
- Webflow 海报地址中的 `%2F` 现在按真实路径分隔符输出；视频备用 webm 地址也全部本地化。
- Mōno 的元素级排版（`p`/`li` 0.7 不透明度、-0.5px 字距、500 字重；`h4` 字距）曾渗入 Lifelogx 区域，按同等优先级重置。

## 五、验收矩阵

（数字见本文末尾“运行结果”一节；未列出的浏览器或项目未测。）

- `node tools/verify-restore.mjs`：中英 19 页 × 320/390/768/1024/1280/1440/1920；每页整页滚动、真实横向可滚动检查、文本裁切 / 越界 / 遮挡审计、语言切换与 Logo 链接、控制台与失败请求、跨域请求；智能层 / 数字员工两页粘性区、渐变区、“不再”区的进入 / 中间 / 离开 / 反向 / resize 状态；首页阶梯标题、Logo 墙、四张卡片、联系带、示例场景卡片；About / Blog / 文章结构与 SEO 头；嵌套页面导航与真实语言切换；与两套原模板同视口同状态的并排截图（`.wrangler/restore-qa/<engine>/compare-*.png`）。
- 既有套件：`verify-site`、`verify-integrity`、`verify-interactions`、`verify-conversion`、`verify-visual-upgrade`、`verify-fixes`、`verify-editorial`（页面清单改为随构建生成；生成图“全部使用”改为“已放置的必须完整”）。
- WebKit：`ENGINE=webkit node tools/verify-restore.mjs`（Playwright WebKit 26.5）。

## 六、表单与发布边界

- 未配置、未生成、未提交任何邮件密钥。真实邮件投递仍未启用；缺配置时保留真实的 503 错误提示与访客主动点击的邮件链接。
- 发布：`node tools/make-dist.mjs` + Wrangler `pages deploy dist --project-name stargo --branch main`（选择 Cloudflare 生产环境，不是合并 Git main）。代理仅在部署命令进程内取消。

## 运行结果

发布前最终构建：`node tools/build-site.mjs` 输出 38 页（中英各 19 页）；完整链路（lifelogx-prepare → blog-covers → fuse-ix → build-site → make-dist）重跑后 1188 个生成文件逐字节一致；`dist` 1135 个文件。

- `node tools/verify-restore.mjs`（Chromium）：**306/306 通过**。构成：38 页 × 7 个宽度（320/390/768/1024/1280/1440/1920）= 266 项整页检查，每项含真实横向可滚动检查、按 60% 视口高度分段滚动、结尾的文本裁切 / 越界 / 遮挡审计、语言切换与 Logo 链接、模板品牌残留、控制台错误 / 失败请求 / 跨域请求；智能层与数字员工两页 × 中英 × 6 个宽度 = 24 项粘性卡片区（15 个滚动位置）、渐变标题区（10 个位置）、“不再”区（进入 / 中间 / 离开 / 反向）与大字-手机关系检查；首页阶梯标题 / Logo 墙 / 四张卡片 / 联系带 / 示例场景卡片 × 中英 × 4 个宽度 = 8 项；About / Blog / 6 篇文章的结构与 SEO 头（中英）2 项；嵌套页面导航、悬浮菜单与真实语言切换（中英）2 项；与 Lifelogx、Mōno 原模板同视口同状态的并排对照 4 项（1280 与 390 各 15 张，共 30 张：`.wrangler/restore-qa/chromium/compare-*.png`）。
- `ENGINE=webkit node tools/verify-restore.mjs`（Playwright WebKit 26.5，Windows）：**302/302 通过**（同一套检查，不含需要原模板对照的 4 项）。第一次 WebKit 运行（脚本调整前、与 Chromium 并行）有 7 项失败，全部是时序：页脚版权行的 SplitText 行遮罩在滚动到底 1.5s 时仍在滑入，以及并行负载下大字入场淡入超过 8s；单独探测 3 轮确认每种情况在 4s 内自行完成、无需任何交互，脚本改为再等 2.5s 复查 / 淡入最多等 20s 后单独顺序重跑，无失败。
- 既有套件（最终构建）：`verify-site` 38 页，0 JS 错误 / 0 失败请求 / 0 跨域请求 / 0 死链（第一次运行时 `en/intelligence.html` 的脚本请求遇到 `ERR_NO_BUFFER_SPACE`：测试机上 HTTP/1.0 静态服务器在并行运行期间耗尽临时端口，属测试环境问题；改用 keep-alive 服务器后单独重跑，全部通过）；`verify-integrity` 40 项；`verify-interactions` 16 项；`verify-conversion` 5/5（未发送真实邮件）；`verify-visual-upgrade` 10/10；`verify-fixes` 28/28；`verify-editorial` 生成图 30 张已放置且完整、13 张保留未用，60/60 响应式页面场景。
- `verify-worker`（`wrangler pages dev dist`）：42/42 —— 38 页的干净 URL（含 `/blog/<slug>`、`/en/blog/<slug>`）、sitemap 36 条、404、表单在无邮件凭据时返回 503 而非假成功、GET 拒绝提交、畸形 JSON 返回 400。
- 未测：Firefox；真实 iOS / Android 设备与 macOS Safari（只跑了 Windows 上的 Playwright WebKit 26.5）；Lighthouse / 性能预算；完整 WCAG 审计（只有套件内的焦点、键盘、reduced-motion 检查）；真实邮件投递（按要求未配置 `RESEND_API_KEY`）。
- 正式域名验收：见下一节（发布后填写）。

## 正式域名验收（发布后）

- 提交：`ea88964`（分支 `release/website-qa-fixes-20260905`，已推送到 origin）。
- 部署：Wrangler `pages deploy dist --project-name stargo --branch main`，部署 ID `33b6e097-ad40-4892-ba03-ba2ed7b153b6`，环境 Production，来源提交 ea88964，部署预览 https://33b6e097.stargo.pages.dev，正式域名 https://stargo.pages.dev 。第一次执行在 1134 个文件全部上传后、创建部署的请求 `fetch failed`（网络），重试一次成功（0 个文件重新上传）；代理只在部署命令进程内取消，未改系统配置。
- 回退：上一部署 `3fbf697e-14a6-4d98-954b-71d2ffb25a7b`（提交 1ca1c94，https://3fbf697e.stargo.pages.dev ）。回退方式：Cloudflare 仪表盘 Pages → stargo → Deployments → 3fbf697e → Rollback；或检出 `7251bf0` 后 `node tools/make-dist.mjs` 并用同一 Wrangler 命令重新部署。
- `BASE_URL=https://stargo.pages.dev BROWSER_PROXY=… NAV_TIMEOUT=120000 node tools/verify-release.mjs`：261 个文件（38 页、199 张被引用图片、视频与海报、22 个运行时文件）与本地构建逐字节一致；自定义 404 路由正确；6 个浏览器场景（中英 × 390/1440：首页 hero、菜单、视频播放 / 暂停、无 JS 或资源错误；能力页四个语义图片映射）通过。第一次运行暴露了脚本自身的两个问题，已修正：（1）srcset 中双重编码的 Webflow 响应式变体（`%2520`）被脚本先解码再请求而报 404，浏览器实际请求的 URL 在线上返回 200（curl 验证）；（2）30s 导航预算在代理链路上不够（实测同一页面通过代理加载 9–59s，一个 5KB 脚本曾等待 55s），加入 `NAV_TIMEOUT`。
- `BASE_URL=https://stargo.pages.dev WIDTHS=1280 NAV_TIMEOUT=120000 node tools/verify-restore.mjs`：46/48 —— 38 页整页检查、智能层 / 数字员工区域状态（中英）、首页区域（中英）、About / Blog / 文章（中英）全部通过；2 项 “navigation” 失败是脚本断言假定 URL 以 `.html` 结尾，而 Pages 使用干净 URL（`/en/blog/<slug>`），断言已修正。线上语言切换另用导航跟踪单独验证：文章页点击切换只发生一次主框架导航，落在 `/en/blog/from-inquiry-to-quote`（反向为 `/blog/from-inquiry-to-quote`），`<html lang>` 与 H1 正确，菜单 aria-expanded 打开 / Escape 关闭，悬浮菜单 7 个链接，无 ≥400 响应。
- 路由抽查：`/`、`/about`、`/blog`、`/blog/from-inquiry-to-quote`、`/en/`、`/en/about`、`/en/blog`、`/en/blog/enterprise-ontology-explained`、`/notices`、`/sitemap.xml` 200；`/pricing.html`、`/404.html` 308 → 干净 URL；不存在的路径 404；sitemap 36 条；notices 页无“网站模板”字样。
- 观察（不属于本次回归）：智能层页面在 1280 宽度的首屏资源约 10 MB（Lifelogx 原模板的图片与视频体量），通过代理的加载时间波动很大；如需瘦身属于后续工作。

## 七、第二轮：导航、模板去重、图片比例、定价改版（2026-09-06 晚）

用户看过线上站后提出的四件事，加上定价页要求。

| # | 要求 | 做法 | 验收 |
| --- | --- | --- | --- |
| 1 | 导航栏加「关于」「博客」 | `tools/chrome.mjs` 的 `topNav` 改为 `[...nav.slice(1), ...more, swap]`，顶栏与手机下拉同一元素，两处同时生效。Mōno 把导航栏做成四等分栅格、菜单只占中间两格（1280 时固定 629px），九项放不下；改为「两侧均分、中间按内容取宽」 | 992/1024/1100/1280/1440/1920 × 中英：9 项、0 裁切、0 换行、无横向滚动 |
| 2 | 智能层与数字员工不能共用同一模板 | 接入此前未使用的 Lifelogx **feature** 页（`tools/templates/lifelogx/feature.html` + 其 bundle）。智能层保留 Lifelogx 首页模板，数字员工改用 feature 页：浮动角色卡、能力粉色面板、旋转卡片、答案区、文章条 | 两页的 `lx-` 区块类各有 71 个独有、仅 29 个共有，重合率 17% |
| 3 | 企业与治理页长图畸形 | 根因不是那一页：生成图带 `width`/`height` 属性，模板只有 `max-width:100%` 没有 `height:auto`，宽度被压到列宽、高度仍是属性值。全站 28 张被拉成细条（首页也有），最严重的把 1.6 的比例拉成 0.11 | 全站 38 页 × 390/1280 扫描，拉伸实例从 28 降到 0；企业页团队栅格五张图比例全部 1.00 |
| 4 | 模板里的好设计拿回来（例：Lifelogx 底部大 Logo 改成 STARGO） | 该大字标在 Lifelogx 自己的页脚里，而我们用 Mōno 页脚，整段被裁掉。`lifelogx-prepare.mjs` 单独抢救成 `lx-bigmark` 片段，构建时接回四个 Lifelogx 页面的页脚之上，文字换成 STARGO，两条 SCROLL_INTO_VIEW 动效原样保留 | 1280 时字号 307px、粉色渐变扫光与描边副本都在；390 时 101px |
| 5 | 定价页改 Lifelogx 粉紫风格 | Scalora 的铜橙色几乎都走一个 token，按页重绑为 Lifelogx 洋红 `#f938a1`，另外重写三条写死橙色的规则（顶部渐变线、主推卡背景、主按钮阴影），眉标图标用 `hue-rotate` 转色 | 中英 390/1280 截图核对 |
| 6 | 主推最贵的方案 | 模板把「抬起的卡片」焊在中间格。改为按数据指定：`PRICING` 里 `featured: true` 的方案获得该处理，梯队仍按价格排列。平台方案组是 Growth ¥30,000，获客组是 **Global Acquisition ¥40,000** | 两组各一张主推卡，徽标「我们主推」独占一行，方案名不折行 |
| 7 | 用 GSAP 重做交互 | `js/stargo-pricing.js`（仅定价页加载）：标题与卡片入场、价格数字滚动到真实数值、主推卡一次缓慢粉色呼吸、对比表逐行淡入、切页签后重算触发点。全部叠加在既有 Webflow 时间线之上，`prefers-reduced-motion` 时整体跳过 | 无 JS 错误；价格最终停在 ¥10,000 / ¥20,000 / ¥30,000 / ¥40,000 / 联系我们 |

内容边界：feature 模板自带的虚构数据全部替换——五个人名、五个「Views / 99.6M」指标、大方块图里烧进画面的「2.4M」（换成 STARGO 轨道品牌图）、社交外链（改为联系页）、占位 `href="#"`。全站 38 页扫描：模板品牌、模板人名、虚构指标、虚构评分四类命中 0。

验收脚本相应调整：`verify-restore` 新增第 2b 段（feature 页专属：不得再出现首页模板元素、必须有 feature 区块、角色卡无虚构指标、卡片不外链、收尾字标为 STARGO）；`verify-interactions` 的数字员工检查从锚点跳转改为 hero CTA 落到联系页；`verify-fixes` 增加 feature 页标题与角色卡断言。

## 八、第二次上线（2026-09-07）

- 提交：`a22cdc2`（导航 + 图片比例 + 抢救底部大字标 + 定价改版）、`c497b2b`（数字员工换用 Lifelogx feature 模板）、`3b90e80`（英文文案包）。三个提交已推送到 origin。
- 部署：Wrangler `pages deploy dist --project-name stargo --branch main`，部署 ID `613fc042-1014-4392-aad4-1fc73cd84bcd`，环境 Production，来源提交 `3b90e80`，预览 https://613fc042.stargo.pages.dev ，正式域名 https://stargo.pages.dev 。上传 67 个新文件（1093 个已存在），一次成功。
- 回退：上一部署 `33b6e097-ad40-4892-ba03-ba2ed7b153b6`（提交 `ea88964`，https://33b6e097.stargo.pages.dev ）。方式：Cloudflare 仪表盘 Pages → stargo → Deployments → 33b6e097 → Rollback；或检出 `9a16ac6` 后 `node tools/make-dist.mjs` 并用同一命令重新部署。
- 发布前验收：`verify-restore` 模板轮 298/298（320–1920 全宽度）、文案轮 180/180（390/768/1280/1440）；`verify-site`、`verify-integrity`、`verify-interactions`、`verify-conversion`、`verify-fixes`、`verify-editorial`、`verify-visual-upgrade` 全部 exit=0。构建可复现：重跑构建链后产物零差异。
- 线上核对：十个关键文件（中英首页、英文定价、中英数字员工、中英关于、fusion CSS、定价 GSAP 脚本、sitemap）与 dist 逐字节一致；干净 URL、`.html` 308 重定向、404 均正确；英文定价页确认 Standard 在、Foundation 已清零、自助获客写在 Standard、首年总价表述存在、主推徽标在 Global Acquisition。
