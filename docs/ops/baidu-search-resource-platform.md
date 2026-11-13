# 百度搜索资源平台（2026-11-12）

- 站点：`https://stargowork.com`（不带 www；www 和 http 都 301 到这里），百度站点 id 1433837861，领域「信息技术」「工具服务及在线查询」（验证后 30 天内只能改一次）。
- 验证方式：HTML 标签 `<meta name="baidu-site-verification" content="codeva-2TleHfaQK1" />`，由 `tools/build-site.mjs` 写进首页 `<head>`（PR #49）。**不要删**，百度会复查。
- 验证一开始连续失败（「无法连接到您网站的服务器」），原因是 Cloudflare zone stargowork.com 开着 **Bot Fight Mode** 和 **AI Labyrinth**。2026-11-12 两项都已关闭，和 stargogrowth.com / zbcarbon.com 一致；托管规则集和 DDoS 防护照常开着。以后不要再打开这两项，否则百度会再次连不上。
- 推送：Growth OS `scripts/china-readiness.mjs submit`，配置在运行数据 `project-runs/stargowork-com/china-readiness/submit.json`，token 在 VPS `~/searchos/secrets/baidu-push-token-stargowork`（600，不进仓库）。每天配额 10 条。2026-11-12 首页推送 accepted（success 1，remain 9）。没有定时推送。
