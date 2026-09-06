# STARGO WORK — 英文文案包执行报告

来源包：`STARGO_WORK_Claude_Complete_Pack_20260906`（START_HERE.md → 04_CLAUDE_CODE_MASTER_PROMPT.md → 01_WEBSITE_COPY_EN.md → 03_TEMPLATE_SLOT_MAP.md → 00_README）
执行日期：2026-09-07
范围：**仅英文站文字**。中文文案、设计、图片、动效、交互、组件顺序、路由与表单行为未改动。
**未部署。** 本轮全部改动只在本地仓库与 Git 提交中。

---

## 一、按页替换清单

### 全站（G01 / G02 / G03）

| 位置 | 原英文 | 新英文 |
| --- | --- | --- |
| 导航标签 | 已是 Trade OS · Intelligence · Capabilities · AI Workforce · Pricing · Enterprise · Contact · About · Blog | 与包内 G01 建议一致，**未改动** |
| 页脚产品行 | The AI Operating System for Global Trade. | Cloud AI software for manufacturers and export teams. |
| 页脚支撑行 | 288 AI Employees. One Operating System. | 288 specialized AI employees. One connected business workflow. |
| 订阅标题 | Be the first to know what's new. | Stay close to practical AI work. |
| 订阅说明 | No noise. Just product updates. | Receive STARGO WORK product notes and practical workflow guides. |

**九页 SEO title 与 description 全部替换为 G03 版本。** 一处适配：构建器会给非首页标题自动追加 “ — STARGO WORK”，因此包内标题里的品牌前缀被去掉，避免品牌出现两次。例：包内 `STARGO WORK Pricing — Software & Growth Services` → 站内 `Pricing — Software & Growth Services — STARGO WORK`。

### PAGE 01 — Trade OS / Home

| 槽位 | 新英文（来源） |
| --- | --- |
| Hero 眉标 | (AI for manufacturers & export teams) — H01 |
| Hero 大字三行 | Find buyers. / Follow through to / orders. — H01 headline |
| 定价阶梯标题 | One system. The right level of support. — H12 / P01 |
| 定价阶梯说明 | An annual software subscription, with optional website, content and acquisition services. Service prices are first-year totals and already include the subscription. — P01 price note |
| 阶梯首档眉标 | (Standard)（原 (Foundation)） |
| 阶梯首档说明 | A 12-month workspace, core trade workflows and self-service lead discovery. |
| 阶梯首档署名行 | Standard · the annual subscription |
| 「包含前一档」行 | The annual Standard subscription, plus: |

### PAGE 05 — Pricing（改动最多，含事实修正）

- 档位名 **Foundation → Standard**（卡片、对比表列头、文章正文中的一处引用）。
- 五张卡片的定位句、CTA、五条 included 列表全部替换为 P02–P05 内容。
- 计费单位：`/ first year` → `/ first year total`；页签 `Platform plans` → `Software & launch`，`Acquisition & Enterprise` → `Growth & enterprise`。
- **关键事实修正**：原英文把主动获客写成 Global Acquisition 才有（“Give the company its own AI acquisition engine.”、FAQ「Global Acquisition builds on Growth…」）。按 P02 与 P08，Standard 已包含自助获客；Global Acquisition 增加的是**三个月配置后获客运行与三份月报**。相关卡片文案与 FAQ 已改写。
- FAQ 另外三条改写：首年之后续费口径、Standard 包含什么、288 是能力目录而非并发上限。

### PAGE 04 — AI Workforce

| 槽位 | 新英文 |
| --- | --- |
| Hero 粉色行 | Give the work to a team. |
| Hero 白色行 | Not another chat window. |
| Hero 说明 | STARGO WORK brings 288 specialized AI employees into one cloud workspace. Assign a goal, bring the right roles together and follow their progress. |
| 能力区标题 | Every AI employee needs more than a name.（W02） |

### PAGE 07 — About

| 槽位 | 新英文 |
| --- | --- |
| 主标题 | Built from the work of running an export business.（A01） |
| 首段 | STARGO WORK grew from a practical question… （A01 body） |
| 三条产品原则 | Keep people responsible. / Keep the business connected. / Improve with evidence.（A04） |

### PAGE 09 — Contact

联系页的失败提示原文已符合 CT05 要求（不假成功、给出真实邮箱与 WhatsApp 备选），**保留未改**。

---

## 二、修改的文件

| 文件 | 改动 |
| --- | --- |
| `tools/copy.mjs` | 全部英文串替换（导航标签未动） |
| `tools/blog.mjs` | 一篇文章正文里的档位名 Foundation → Standard |
| 生成产物 | `en/*.html`、`en/blog/*.html`、`dist/` 重新构建 |

中文半边（`B(zh, en)` 的第一个参数）**一个字未改**。

---

## 三、未放入的文案

以下内容包内有稿，但现有模板没有对应槽位，或需要新增组件才能承载。按包内规则登记，不强塞、不改设计：

| 编号 | 内容 | 原因 |
| --- | --- | --- |
| H03 | 四张问题卡的引言与四段卡片文案 | 现有四卡文案为中英对照的场景卡，替换需逐卡核对槽位长度，本轮未做 |
| H04 / H05 | 连接闭环引言、五阶段的 Output label | 现有五阶段只有标题与说明两个槽位，没有 Output label 槽位 |
| H06A–D | 四个核心板块的 Output line、Screenshot 说明、Connection note | 现有板块无独立的 output/note 槽位 |
| H07 / H07A / H08 / H09 / H10 / H11 | 员工协作、审批示例、渠道条、传统对比、四场景卡、首页 FAQ | 本轮未逐槽替换 |
| I01–I08 | Intelligence 全部八节 | 未替换 |
| C01–C03 | Capabilities 十四组业务语言改写 | 未替换 |
| W02 四卡 / W03 团队示例 / W04 团队会话 / W05 云端与移动 / W06 控制与容量 | Workforce 细节 | 仅替换了 Hero 与一个区标题 |
| E01–E07 | Enterprise 七节 | 未替换 |
| P06 / P07 / P08 部分 / P09 | Enterprise 卡片、对比表 12 行、剩余 FAQ、收尾 CTA | 对比表行需与现有 12 行逐行核对 |
| B01 / B02 / B03 | 博客 Hero、四条文章卡描述、未来选题 | 现有文章描述是真实文章摘要，按包内要求「核对正文后再改」，本轮未改 |
| CT01–CT04 | 联系页 Hero、表单引言、下一步三段 | 未替换 |

**建议新增板块（ADD-01 ~ ADD-04）：按包内默认，未实施。** 需要单独批准。

---

## 四、需要确认的事项

1. **中英不一致（最重要）**：本包只授权改英文。中文定价页仍写 `Foundation`，并且仍把主动获客表述为最高档带来的能力。英文页现在写 `Standard` 且说明自助获客已包含在 Standard。**在中文文案获批修改前，站点存在中英事实不一致。** 需要一份获批的中文改写稿。
2. **价格与服务量需商业批准**：¥10,000 / ¥20,000 / ¥30,000 / ¥40,000 与各档交付数量取自包内恢复的 2026-08-27 V2.0 服务包，包内明确要求发布前重新确认。
3. **合同主体未定**：页脚、隐私政策、条款与表单中的软件合同主体未确认。包内要求不得从出行业务的公司名推定。当前站点未写主体名，保持原状。
4. **stargomoto.com 链接**：包内要求标注为 “STARGO mobility business / Our trade background”。当前页脚仍是纯网址，未加标注（属未放入项）。
5. **能力状态标签**：包内要求 Available / Pilot / Planned / Research Preview 四档标注。当前站点未使用状态标签，本轮未新增（需要新增组件或改设计）。
6. **示例 Logo 墙**：仍带「示意 Logo · 非真实客户」披露。图片授权问题无法靠文字解决，需单独决策。

---

## 五、实际运行的检查

| 检查 | 结果 |
| --- | --- |
| `node tools/build-site.mjs` | 38 页构建通过 |
| `node tools/make-dist.mjs` | dist 1161 个文件 |
| `verify-site` | 38 页，0 JS 错误 / 0 失败请求 / 0 跨域 / 0 死链 |
| `verify-integrity` | 40 项通过 |
| `verify-fixes` | 28 项通过 |
| `verify-editorial` | 60/60 响应式场景通过 |
| `verify-restore`（模板轮，全宽度） | **298/298 通过** |
| 英文页事实核对脚本 | 288 一致、无 Foundation 残留、Standard 出现、首年总价表述存在、自助获客在 Standard、无虚构评分、示例仍标注、联系方式正确 |
| 中文混入检查 | 英文页无中文正文 |

**限制**：本轮没有访问 STARGO WORK 业务后台，没有核实任何能力的实际上线状态，没有测试真实邮件投递（`RESEND_API_KEY` 未配置，表单在缺配置时返回真实 503）。WebKit 与 Firefox 未在本轮重跑。

---

## 六、部署状态

**未部署。** 改动已提交到分支 `release/website-qa-fixes-20260905`，未推送到 Cloudflare Pages，线上站点仍是上一版本。
