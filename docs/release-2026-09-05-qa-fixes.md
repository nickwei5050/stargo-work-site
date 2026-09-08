# STARGO WORK · 修复版生产发布记录

验收完成：2026-09-05 21:24（Asia/Shanghai）。用户授权创建分支、推送并上线，暂不配置邮件密钥。

## 已发布版本

- 正式网站：https://stargo.pages.dev/
- 源码分支：`release/website-qa-fixes-20260905`
- 网站内容提交：`1ca1c94ea5e26a8edb7dbdb305dcca71449019ab`
- Cloudflare 项目：`stargo`；环境：Production。
- 部署 ID：`3fbf697e-14a6-4d98-954b-71d2ffb25a7b`
- 固定版本地址：https://3fbf697e.stargo.pages.dev/
- Git main 保留在 `4086ebb`；没有合并 main、强制推送或创建 PR。

本项目没有 Git 自动部署集成。Wrangler 的 `--branch main` 用于选择 Cloudflare 的生产环境，不是把 Git 发布分支合并进 main。本记录是部署后的纯文档补充，不改变上述网站内容提交。

## 本轮发布范围

41 个文件的代码、生成页面与回归测试：深色导航可读性、手机/平板标题与表单布局、锚点、定价键盘操作、FAQ 状态、重复 ID、SplitText 可访问性及表单验证/错误/重试处理。中英隐私页同步实际的数据处理与主动邮件链接行为。详见 [逐项修复报告](qa-fixes-2026-09-05.md)。

保留已有四模板视觉体系、图片、首页视频及 Webflow/GSAP/Lenis/Lottie 动效。本次没有新生成图片、改变产品定价或配置外部服务密钥。

## 发布前复验

重新构建 22 页，生成发布目录 1094 个文件；重复构建内容一致。发布目录的页面与运行时文件和源文件一致，没有将工具、文档、Git 或函数源代码作为静态资源上传。Functions 单独编译成功。

| 测试 | 结果 |
| --- | --- |
| 22 页完整加载、滚动、错误和链接 | 22/22 |
| 中英 7 个核心页面 × 320/390/768/1440px | 56/56 |
| 已修复缺陷回归 | 28/28 |
| 页面结构及定价页定向 axe | 24/24 |
| FAQ、语言菜单、锚点、短表单 | 16/16 组合场景 |
| 转化、重复提交和 resize | 5/5 |
| 视频、四栏切换、减少动态和媒体失败 | 10/10 |
| 联系处理器 | 22/22 子用例（含父测试为 23） |
| Cloudflare 本地路由和错误状态 | 26/26 |
| 安装的 Edge，手机和桌面 | 20/20 |

隐私说明在末轮复核中补正后，再次构建并复测两页加载、24 项结构检查、5 项转化和 26 项本地运行时检查。语法、Git diff 检查通过；IX 合并 0 冲突。

## 正式域名验收

不是仅检查固定版本预览地址：以下测试均针对 `https://stargo.pages.dev`。

| 验收 | 结果 |
| --- | --- |
| 文件逐字节一致性 | 169/169：22 HTML、123 图片、视频和封面、22 CSS/JS/Lottie 文件 |
| 中英首页 390/1440px、能力页 390px | 6/6：菜单、四栏点击、视频播放/暂停、图片对应关系；场景内无 JS 或资源 HTTP 错误 |
| 本轮缺陷线上回归 | 28/28：定价键盘、标题边界、平板遮挡、表单列宽等 |
| 部署端点和配置 | 6/6：安全响应头、robots/sitemap 与构建一致、规范地址跳转、GET 405、非法 POST 400/no-store |
| 不存在页面 | 返回真实 404 |

线上文件检查发生 2 次网络传输重试；未放宽 HTTP 状态或文件哈希断言。人工复查线上平板 Intelligence、手机联系表单、桌面四栏和手机视频截图。

证据：`.wrangler/production-20260905/release/report.json`、`focused/focused-results.json`、`endpoint.json` 及同目录截图。QA 文件不进入生产静态目录。

可重复的主要线上命令：设置 `BASE_URL=https://stargo.pages.dev`，分别运行 `node tools/verify-release.mjs` 和 `node tools/verify-fixes.mjs`。可用 `QA_OUT` 指定证据目录；本机网络使用 `BROWSER_PROXY=http://127.0.0.1:10808`。

## 明确保留的限制

- 按用户要求不配置邮件密钥。真实邮件投递没有启用或收件验收，不声称表单已具备生产投递能力。
- 线上缺陷套件使用真实页面，但在测试浏览器内拦截表单请求，运行本地处理器并模拟邮件服务边界；它不是生产邮件投递证明。
- 生产函数仅发送了无法形成有效表单的 `null` 测试请求，确认受控 400；没有提交有效销售线索，没有发送测试邮件。缺配置时的 503 与页面备选链接已在本地和隔离测试中验证。
- Safari/WebKit、Firefox、移动真机、Lighthouse 和人工屏幕阅读器不在本次已验证范围内。无障碍检查不是整站 WCAG 认证。

## 回退记录

上一生产部署：`107581fd-67e2-4d64-b3b2-71812c5d4b62`，内容提交 `1351a61`，固定版本 https://107581fd.stargo.pages.dev/ 。如需回退，在 Cloudflare Pages 的该部署记录执行生产回退；本次仅保存记录，没有执行回退或删除旧部署。

方法：按 finishing-a-development-branch 和 verification-before-completion 先复验再提交、推送、发布与线上核验；末轮说明遗漏按 systematic-debugging 与 test-driven-development 的纯文案规则处理，不为人类阅读文案添加机械字符串测试。
