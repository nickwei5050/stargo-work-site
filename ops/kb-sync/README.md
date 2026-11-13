# stargowork 知识库同步（运维机定时任务）

这里是 Growth OS 运维机（Scott 电脑上的 WSL Ubuntu-24.04，用户 stargo）上给 stargowork 跑的定时任务的源码。2026-11-11 从系统仓库 website-SEO- 挪到这里（Scott 决定：品牌专属配置放品牌仓库，系统仓库只放通用代码）。

- `stargowork-kb-sync.sh`：安装到 `~/searchos/bin/`，由 `growthos-kb-sync-stargowork.timer` 触发；导出网站内容，再调用 website-SEO- 的 `scripts/maxkb-kb-sync.mjs --apply` 更新 MaxKB 知识库。
- `growthos-kb-sync-stargowork.service/.timer`：安装到 `/etc/systemd/system/`，系统级单元，`User=stargo`。失败告警的 drop-in（`50-ops-alert.conf`）在 website-SEO- 的 `integrations/ops/systemd/dropins/`。
- 不含任何密钥：MaxKB 管理员凭证只在运行时从 `~/searchos/secrets/maxkb-admin.env` 读取。

## 2026-11-11 相对线上旧版的改动（Codex 审核）

- 本仓库的导出/构建代码放进一次性 Docker 容器跑（只挂载临时目录，没有密钥、没有 Docker socket、没有家目录），读不到运维机上的密钥。镜像用 `KB_SANDBOX_IMAGE`，默认 `node:22-bookworm-slim`。（会跑本仓库代码的才有：stargogrowth、stargomoto、lzsansong。）
- bridge 需要重启时先写一个待重启标记，重启成功才删；重启失败让任务以失败结束（告警），下一轮会重试。（会重启 bridge 的才有：stargogrowth、stargomoto、lzsansong、zbcarbon。）
- zbcarbon 导出遇到 sitemap 页面抓取失败会整轮退出，不再把那页的知识库文档当成删除。

## 安装

```bash
for f in ops/kb-sync/*.sh ops/kb-sync/*.mjs; do [ -e "$f" ] && install -m 755 "$f" ~/searchos/bin/; done
sudo install -m 644 ops/kb-sync/*.service ops/kb-sync/*.timer /etc/systemd/system/
sudo systemctl daemon-reload
```
