# STARGO WORK 官网客服上线清单

状态：草稿。本仓库里的代码和配置都不会自动上线。

**下面每一步动的都是线上系统，每一步开始前都要老板在对话里打字确认。一步的确认不能用到下一步。**

机密只写变量名，不写值。不要把令牌写进仓库、工单或聊天记录（网页聊天的 website token 是公开值，除外）。

已知信息：Chatwoot account 1，inbox 10，website token `rrhJo1Fr2h7XXBYuMkzs2raY`。老板已决定上 AI 客服，价格和付款转人工。

## 0. 先合并官网 PR，并确认邮件不会断

- [ ] 老板确认后合并官网的聊天和表单 PR，由 `deploy.yml` 发布。合并后全站显示 sales@stargogrowth.com，聊天按钮出现。
- [ ] **合并前先确认 Resend 能投递到新地址。** 默认发件人 `onboarding@resend.dev` 只能投递给 Resend 账号本人的邮箱。如果账号不是用 sales@stargogrowth.com 开的，表单会收到 403，访客看到“提交失败”。合并前要在 Resend 验证发件域名，并把 `CONTACT_FROM` 设成该域名下的地址。
- [ ] 检查 Pages 变量 `CONTACT_TO`：如果还是原来的个人邮箱，要改成 sales@stargogrowth.com 或删除，否则通知仍发到旧地址。

确认：老板打字同意合并 ______；同意改 Resend 和 `CONTACT_*` ______

## 1. Chatwoot 收件箱和令牌

- [ ] 收件箱 10 的允许域名只留 stargowork.com 和 www.stargowork.com。
- [ ] 分配接待同事，确认收件邮箱和通知。
- [ ] 真机打开官网，点聊天按钮，确认消息进入收件箱 10。

确认：老板打字同意 ______

## 2. Pages 环境变量

- [ ] 在 Cloudflare Pages 项目（名称以 `.github/workflows/deploy.yml` 为准）的生产环境设置 `CHATWOOT_WEBSITE_TOKEN = rrhJo1Fr2h7XXBYuMkzs2raY`。
- [ ] 变量要下一次部署才生效，需要重新部署一次。
- [ ] 提交一条开头带 `[TEST Growth OS]` 的测试表单，确认邮件和 Chatwoot 会话都到了，再清理测试会话。
- [ ] 订阅表单提交一次，确认**没有**新会话。

确认：老板打字同意 ______

## 3. MaxKB 知识库和应用

- [ ] 老板审核 `growthos/kb-draft/zh.md`、`en.md`、`missing.md`，改定后才导入。
- [ ] 新建知识库，每段保留该节的“来源”行。
- [ ] 新建应用，模型选 DeepSeek（在 MaxKB 里配置，不写进桥接配置）。提示词要求：只按知识库回答；回答末尾原样带一个来源网址；价格、付款和知识库没有的内容只输出 `[HUMAN_REQUIRED]`；用访客的语言回答。
- [ ] 记下 application id，生成应用 key，放进桥接环境变量 `STARGOWORK_MAXKB_APPLICATION_KEY`。

确认：老板打字同意 ______

## 4. Chatwoot AgentBot

- [ ] 新建 AgentBot，绑定到收件箱 10，webhook 指向桥接程序的租户地址。
- [ ] 记下 bot id；bot token 放进 `STARGOWORK_CHATWOOT_BOT_TOKEN`；生成不少于 32 字符的 webhook 密钥，放进 `STARGOWORK_CHATWOOT_WEBHOOK_SECRET`。
- [ ] AgentBot 绑定后访客消息会先到机器人，所以第 5 步完成前不要留着绑定，否则访客没有回应。

确认：老板打字同意 ______

## 5. 桥接容器

- [ ] 确认运行中的桥接版本支持 `handoffNotice`、`holdNotice`、`formReceipt`、`greetingReply`（这些字段在 website-SEO- 的 `codex/searchos-system` 分支上，`main` 没有）。
- [ ] 把 `growthos/bridge-tenant.draft.json` 里的租户加入线上配置，填好 `botId`（整数）和 `applicationId`（UUID），`knowledgeVersion` 改成审核后的版本。
- [ ] 用 `validateBridgeConfig` 校验通过后，打开线上配置的开关并重启桥接容器。

确认：老板打字同意 ______

## 6. 询盘漏斗和 CRM 品牌配置

- [ ] 把收件箱 10 接入询盘漏斗，配置品牌 stargowork-com 的归属。
- [ ] 确认 `lead_type: contact_form` 的表单线索按品牌进入 CRM，公司名进公司字段，联系人只保留姓名。

确认：老板打字同意 ______

## 7. PushPlus 通知

- [ ] 转人工和新表单推送到老板指定的 PushPlus 渠道，用一条测试消息验证。

确认：老板打字同意 ______

## 8. 检查 DeepSeek 共用余额

- [ ] DeepSeek 账号是预付费，和其他品牌的客服共用。测试和上线前先看余额，按 `maxMessagesPerDay`（200）估算用量，余额不够就先充值或停下，不要挤占其他客服。

确认：老板打字同意 ______

## 9. 测试问题

用真实访客路径各问一遍，结果记下来。测试完清理测试会话。

| 问题 | 预期 |
|---|---|
| 你好 / Hi | 固定问候语，不转人工 |
| STARGO WORK 是做什么的？ / What is STARGO WORK? | 回答并带来源网址 |
| 核心版包含什么？ / What does Core include? | 按方案内容回答，不提价格 |
| 能做报价和 PI 吗？ | 回答功能，不转人工（不要被价格规则误伤） |
| 支持私有化部署吗？ / Is private deployment available? | 回答并带来源网址 |
| 288 个 AI 员工是无限使用吗？ | 回答“不是”，并说明按配置 |
| 多少钱？ / How much is it? | 转人工，发 `handoffNotice`，AI 不报数字 |
| 付款方式和账期？ / What are the payment terms? | 转人工 |
| 多久能上线？ / How long does delivery take? | 知识库没有，转人工，不编造 |
| 你们支持人工智能吗？ | 不能因为“人工”二字转人工 |
| 转人工 / talk to a human | 转人工，机器人停止回答 |
| 提交联系表单 | 发 `formReceipt`，转给同事 |

确认：老板打字同意开始测试 ______；测试通过后同意正式开放 ______

## 回退

- 停 AI：解除收件箱 10 的 AgentBot 绑定，访客消息回到人工。
- 停表单推送：删除 `CHATWOOT_WEBSITE_TOKEN` 并重新部署。
- 停聊天按钮：把 `js/stargo-chat.js` 里的 `WEBSITE_TOKEN` 清空，运行 `npm run build`，提交并发布。
