# STARGO WORK 知识库草稿

这里是给官网 AI 客服（MaxKB）准备的草稿，**老板审核前不能导入上线**。

- `zh.md`、`en.md`：两种语言的知识条目，每节写明来源网址。
- `missing.md`：官网上没有、AI 不能回答的内容。

**内容来源。** 只取本站页面：`/`、`/about`、`/contact`、`/capabilities`、`/workforce`、`/pricing`、`/enterprise`、`/privacy` 及对应英文页。第 3、4、5 节和第 8 节开头的产品说明，逐字取自站点的 `/llms.txt`（由 `tools/make-dist.mjs` 生成，它的要点与页面同源）；其余取自页面文字。

**故意不放进来的内容。** 页面上有续费周期、积分加购、语音按量计费这些商务条款，但老板已决定价格和付款转人工，所以知识库不写，由转人工处理。

**来源网址必须保留。** 客服桥接程序只放行带有已批准来源网址的回答（`approvedSourceUrls`，见 `../bridge-tenant.draft.json`），所以分段后每段都要带上该节的“来源”行，模型回答时要原样引用其中一个网址。

**联系方式。** 这里写的邮箱 sales@stargogrowth.com 与修改全站邮箱的那个 PR 一致，那个 PR 合并后页面才会显示同样的地址。
