# Cross-review: Chatwoot chat and form delivery (2026-11-09)

Reviewer: Cursor CLI, model grok-4.7-xhigh, ask mode. Scope: the source diff of this branch against main, with generated pages omitted. Reviewed commit: 003f95f3.

| Round | Blocker | Major | Minor | Verdict |
|---|---|---|---|---|
| 1 | 0 | 0 | 2 | PASS |

## Round 1 output

> No blocker or major bugs.
> 
> minor README.md:135 the shared-sender note still says the mail lands in the live.cn (Outlook) junk folder, so mail for sales@stargogrowth.com is looked for in the old mailbox and missed.
> minor js/stargo-chat.js:37 once `chatwootSDK.run` has set `ran`, the 15s timeout keeps the script node and still shows 暂时连不上，点击重试 / Could not connect. Try again, so the next press returns at `load` and neither fetches the SDK again nor opens the chat.
> 
> VERDICT: PASS

## Disposition

- README.md:135: fixed. The note no longer names the old mailbox.
- js/stargo-chat.js:37: left as is. Once the SDK has started, a second start would draw the widget twice. The next press waits again and `chatwoot:ready` still opens the window.
