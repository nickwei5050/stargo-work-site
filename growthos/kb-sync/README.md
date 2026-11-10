# 知识库定时同步

服务器上跑的脚本副本，线上位置是 `~/searchos/bin/`，定时任务是 `growthos-kb-sync-stargowork.timer`（每 6 小时）。

它把 `growthos/kb-draft/` 按节拆开同步到 MaxKB，不改客服允许引用的网址白名单。

回滚：`sudo systemctl disable --now growthos-kb-sync-stargowork.timer`。
