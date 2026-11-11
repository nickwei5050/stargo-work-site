# AI 交叉审核 2026-11-11

- 审核：agy CLI（gemini-4-argon-high）
- 范围：`6f811078c8bfebd6a477e330cb729a51ec98d161...4a40afb8`
- 结论：**通过**（approve，阻断项 0）
- 分片：5 片，1=agy、2=agy、3=agy、4=agy、5=agy

[1/5] The Round 2 cross-review archive files (ai-cross-review-r2.json and ai-cross-review-r2.md) are well-formed, consistent with each other, properly escape pipe characters inside the Markdown table, and contain no secrets or issues.
[2/5] Reviewed en/privacy.html (slice 2 of 5). The Google Tag Manager and Consent Mode v2 initialization script in <head>, the effective date update, and the privacy policy disclosures regarding GTM-MCGTFDLR, cookieless pings prior to consent, gos-consent in localStorage, the #cookie-settings link, and third-party sharing with Google are accurate, well-formed, and match the stated purpose.
[3/5] js/consent-banner.js and package.json are clean, safe from XSS, and match the stated Consent Mode v2 behavior and EEA/UK/CH timezone scope. Only two minor/nit improvements are noted regarding subdomain cookie deletion and keyboard focus when reopening the banner via #cookie-settings.
[4/5] privacy.html 的 Google Tag / Consent Mode v2 注入代码与隐私政策正文说明一致：ad_storage、ad_user_data、ad_personalization 全局默认 denied，analytics_storage 在 EEA/GB/CH（32 个地区代码）默认 denied 并通过 gos-consent 更新，gtm.start 事件在加载 GTM 容器前推入 dataLayer，且隐私政策已如实披露 GTM-MCGTFDLR、无 Cookie 统计信号、gos-consent 存储及 #cookie-settings 重新打开入口。未发现功能、无障碍、SEO 或安全问题。
[5/5] Reviewed slice 5 of 5 (tools/copy.mjs, tools/data/page-dates.json, tools/google-tag.mjs, tools/make-dist.mjs, tools/verify-restore.mjs, tools/verify-site.mjs). Consent Mode v2 defaults (ad_* globally denied, analytics_storage denied for EEA/UK/CH), localStorage gos-consent replay, gtm.start event push, bilingual privacy policy disclosures, #cookie-settings trigger link, dist build gate, and Playwright verification stubs are all consistent and free of defects.

| 级别 | 位置 | 问题 | 建议 |
| --- | --- | --- | --- |
| nit | [3] js/consent-banner.js:22-28 | clearGaCookies() only strips a leading 'www.' when constructing parent domain attributes. Because GA4 defaults cookie_domain to 'auto' (setting _ga on the registrable/apex domain), rejecting on a non-www subdomain (e.g. work.* or growth.*) will not expire a _ga cookie scoped to the parent domain, and '.' + host is duplicated when the hostname does not start with 'www.'. | Derive candidate domain suffixes by splitting location.hostname on '.' (e.g. walking from the full hostname up to 2-label suffixes, with and without a leading dot) so _ga cookies set on a parent domain are also cleared. |
| nit | [3] js/consent-banner.js:62-68 | When a user activates a[href$='#cookie-settings'] via keyboard, e.preventDefault() stops anchor navigation and show() appends the dialog at the end of document.body without moving focus into it, leaving focus on the trigger link far from the newly opened controls. | In the #cookie-settings click handler after calling show(), move focus into the banner (e.g. var btn = box && box.querySelector('button'); if (btn) btn.focus();). |
