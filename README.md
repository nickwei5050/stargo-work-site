# STARGO WORK 7.0 — 官网（静态站）

Mōno™ Webflow 模板做页面骨架，Scalora Startup 模板贡献首页的三个模块（四层卡片堆、粘性切换器、能力接入带），全部文案替换为 STARGO WORK 的中文内容。**纯静态**：任何目录服务器都能跑，不发起任何跨域请求（国内可访问）。

```bash
python -m http.server 4200          # 然后打开 http://127.0.0.1:4200/index.html
```

## 页面

| 文件 | 内容 | 来源模板页 |
|---|---|---|
| `index.html` | 首页：Mōno 骨架 + Scalora 三个模块 | Mōno `index` + Scalora `index` |
| `capabilities.html` | 能力全景：E01–E52 全部 52 项与各自状态 | Mōno `work-1` + `studio` 的表格模块 |
| `workforce.html` | 数字员工：14 个岗位，9 位有角色记录，4 位路线图 | Mōno `studio` |
| `governance.html` | 治理与安全：R0–R4、五套可执行测试 | Mōno `studio` |
| `integrations.html` | 集成：25 个提供方，哪些现在真的能用 | Mōno `studio` |
| `tour.html` | 产品演示：WF02 十步，三步停在人工审批 | Mōno `project` + 表格模块 |
| `contact.html` | 联系 | Mōno `contact-1` |
| `notices.html` | 第三方声明 | Mōno `post` |
| `404.html` | 404 | Mōno `404` |

## 构建（改文案后必跑，按顺序）

```bash
node tools/extract-data.mjs     # 从 ../stargo-work-website/content/*.ts 抽取已核对的数据 → tools/data/*.json
node tools/build-fusion.mjs     # 首页：把 Scalora 三个模块插进 Mōno 首页 → tools/fragments/index.fused.html
node tools/fuse-ix.mjs          # 唯一的 Webflow bundle：Mōno 六个页面 bundle 的动效并集 + Scalora 动效数据 → js/app.fused.js
node tools/build-site.mjs       # 所有页面 + 统一导航/页脚/元数据 + 链接重定向 + 禁止内容检查 → *.html
node tools/verify-site.mjs      # 真实浏览器逐页加载：0 报错 / 0 失败请求 / 0 外部请求 / 0 断链，并截图
```

`tools/templates/` 是原始模板页（构建输入，不要直接改）；`tools/bundles/` 是 Mōno 的六个原始 bundle（只作 `fuse-ix` 的输入，不上线）。

**每一次替换都有断言**：模板字符串一旦对不上，构建直接失败，而不是把英文机构文案留在中文页面上。

## 事实来源

页面上的每一个数字（202 / 25 / 30 / 26 / 52 / 14 / 9 / 4 / 10）都不是手打的，全部由 `tools/extract-data.mjs` 从 Next.js 站点仓库 `stargo-work-website/content/*.ts` 读出——那里是对照 STARGO 注册表核对并被测试钉住的地方。那个仓库的漂移守卫（`scripts/verify-against-stargo.mjs`）改了数字，这里重跑一次构建就跟上。

## 刻意没有的东西

- 没有客户标识、评价、案例（模板的 partner 墙、testimonial、case study 已物理删除，不是隐藏）
- 没有价格（`build-site.mjs` 的 FORBIDDEN 列表会拦 `$` / `¥` / `/mo`）
- 没有任何「已上线」能力；上限是「演示验证」
- 没有认证、可用性、ROI 声明
- 表单没有接入收件端：`js/stargo-forms.js` 会明说，不假装成功
- 页脚的邮箱、电话、地址、隐私政策、使用条款均为「待定」占位——业主待办

## 为什么是一个 bundle

`window.Webflow` 是单例，两个运行时同时加载必然 TypeError。所以 Scalora 的运行时被丢弃，只保留它的动效**数据**并加 `sc-` 前缀合并进 Mōno 的 bundle。Mōno 自己的六个页面 bundle 经 `tools/ix-union-check.mjs` 证明动效数据逐字节相同（409 事件 / 140 动作列表 / 0 冲突），只有 GSAP 时间线因页而异，于是取并集。全站统一使用首页的 `data-wf-page` id，模块因此可以在任何页面之间搬动而不丢交互。

## 待业主决定（不阻塞开发，阻塞发布）

1. 正式域名与托管（Cloudflare Pages 之类的静态托管即可；`*.workers.dev` / `*.pages.dev` 在国内不稳定，需自有域名）
2. 联系邮箱、电话、法律主体与地址
3. 隐私政策与使用条款文本
4. 表单收件端（或改为邮箱直达）
5. 导入角色的 MIT LICENSE 归属（见 `notices.html`）
6. 首页粘性切换器里的四张界面图仍是模板示意图，页面上已标明「非真实截图」；换成真实系统截图后把标注去掉
