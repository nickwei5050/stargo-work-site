# STARGO WORK · 视觉升级执行基准

## 已确认的边界

用户认可现有官网和四个模板的整体效果。本轮是保留基础上的素材升级与局部完善，不是重新设计。

- 保留现有页面骨架、字体、黑白与铜色体系、动效节奏、菜单、滚动缩放、卡片翻转与 Lottie。
- 新图适应已有容器及裁切；不让一张新图迫使整页换版式。
- 效果增强集中在可点击性、视频播放、状态反馈和性能。不要叠加新的动画库、粒子层、第二套光标或全站色彩主题。
- 图片指内容视觉：43 个现有业务/品牌/数字角色资产。保留 STARGO 标识、功能图标、依法使用的渠道标志；视频海报从视频中提取。
- 中文和英文共用无内嵌文字的视觉；业务名称、价格、操作说明由 HTML 承载。
- 生成图是概念插画或场景示意，不能冒充真实产品截图、真实客户、真实交付现场或产品功能证据。

## 统一创意方向：真实业务，协同运转

从现有第四模板的银色轨道、Mono 的大字留白、Scalora 的铜色与 Lifelogx 的深色层次中提取材质。以石墨、钛银、乳白作为底色，铜色只指示信号和关键连接，不把每张图做成相同的发光球。

| 页面 / 位置 | 视觉应解释的内容 | 构图和效果契合 |
| --- | --- | --- |
| 首页：传统业务分散 | 邮件、沟通、表格、订单上下文分散 | 四幅同风格独立静物；适合原有翻转卡 |
| 首页：外贸操作链 | 找到机会、理解客户、准备报价、推进交付 | 工业场景与克制的信号轨迹，配合原有逐段揭示 |
| 首页：四大系统 | 获客、客户全貌、商业报价、贸易履约各自职责 | 四幅题材不同但材质统一的横幅；沿用滚动与点击淡入淡出 |
| 首页：视频区 | 多个部分协同成为一个系统 | 保留原始网格、中心缩放和叠字；中心恢复第四模板的真实轨道视频 |
| Intelligence | 企业对象关系、长期执行、可评估的进化 | 结构清晰的空间连接，不用抽象大脑或假数据大屏 |
| Workforce | 专业角色、编排、并行工作、人工审批 | 角色用不同形体区分，不生成假员工照片；手机空间用竖幅概念图 |
| Capabilities | 四组能力家族，再进入能力细项 | 家族有不同主体，不是同图改色；解释细节保留在网页文本里 |
| Enterprise | 权限边界、证据、审批、回退、既有系统协同 | 可读的层级、闸门、受保护的连接；避免盾牌/锁头素材堆叠 |
| Pricing / Contact / 共享菜单 | 能力逐步启用、从一条流程开始 | 小范围复用品牌视觉，防止图片抢走价格和表单的注意力 |

## 提示词母版

每张图组合统一美术约束和该图的独立业务主题；完整任务表见 `tools/imagegen/catalog.mjs`。

> Create a premium editorial image for STARGO WORK, an enterprise AI operating system for global trade. Make the assigned business idea legible through a single purposeful scene, not a software screenshot. Physical materials, believable scale, refined industrial photography or precise sculptural CGI as specified. Fit the existing monochrome editorial website with its restrained copper accents. Confident negative space, clear focal hierarchy, controlled reflections, realistic contact shadows. Avoid generic AI iconography, robots, brains, holographic dashboards, illegible interface text, stock-business handshakes, neon cyberpunk, watermarks, third-party branding, and invented customer evidence. All copy will be typeset in HTML, so include no letters or numbers in the artwork.

## 生成与上线门槛

1. 用户随后明确授权“使用内置生图”。本轮 43 张图已通过内置工具逐张生成；工具不暴露具体模型编号，因此不宣称已核实为 image2。无需额外 API Key。
2. 不存在名为“提示词大师”的已连接技能；本提示词方案为本次任务直接策划。
3. 先检查三类代表图：工业摄影、概念结构、数字角色；一致后按任务表生成剩余资产。
4. 每张原图人工检查：业务匹配、材质、画面瑕疵、裁切、是否与相邻板块重复。
5. 优化为 WebP，角色小图与分享封面为 PNG，生成 400/800/1200 宽度版本；按容器选图，保持原有懒加载。
6. 使用清单统一替换，保留生成原稿和原有素材，记录来源。不得以旧图复制、代码截图或随机图库冒充生成结果。
7. 在 390、768、1440 和 1920 宽度检查裁切、对比度、菜单、核心切换、表单及视频；移动端与减少动态效果模式可操作。
8. 新图片未完成时不宣称整站升级完成，也不发布半套混搭的新视觉。

## 本地实施记录

- 从第四模板导入银色轨道影片，压缩为可渐进播放的本地 MP4；中心恢复视频，外层动画结构不变。
- 视频增加暂停/播放、屏外暂停、减少动态效果默认静止与播放失败提示。
- 四大系统保留原卡片和淡入淡出；替换原先猜测滚动位置、反复抖动修正的控制代码，加入键盘切换与明确的当前状态。
- 43/43 张原图保存在 `output/imagegen/originals/`；网站版本在 `assets/stargo-editorial/`。原稿共 75.98 MB，主图共 4.28 MB，响应式版本共 2.21 MB。
- 完整实际提示词与内置生成来源在 `tools/imagegen/generated-sources.json`；尺寸、原图哈希及网页文件清单在 `tools/imagegen/assets-manifest.json`。
- 模板中所有原 STARGO 内容图片路径通过构建末端统一映射，CSS 背景同步更新；标志、功能图标及动效结构保持不变。新路径避免旧图片的长缓存。
- 最终逐屏审阅按内容重新分配：能力页四图依次为市场机会、客户上下文、包装履约、分层治理；专业工具协作图用于首页 AI Workforce 入口，避免按文件序号机械对应。
