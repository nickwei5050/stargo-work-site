#!/usr/bin/env bash
# Refresh the MaxKB knowledge base "stargowork.com" from the site repo (stargo-work-site main):
# shallow clone -> split growthos/kb-draft into one file per section -> maxkb-kb-sync.mjs --apply -> delete the clone.
# Does not touch the bridge: documents carry one source URL each, so letting the sync rewrite approvedSourceUrls would drop
# reviewed URLs such as /about. Change that list by hand. Run by growthos-kb-sync-stargowork.timer.
# Pass --plan to read only. One-off override for a deliberate renumbering: KB_SYNC_MAX_REMOVE_RATIO=1.
set -euo pipefail
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"
CODE="$HOME/searchos/code"
STATE_DIR="$HOME/searchos/runtime/kb-sync"
KB_ID="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).knowledgeId)' "$STATE_DIR/stargowork-ids.json")"
LOG="$HOME/searchos/logs/kb-sync-stargowork.log"
APPLY=--apply; [ "${1:-}" = --plan ] && APPLY=
mkdir -p "$STATE_DIR" "$(dirname "$LOG")"
tmp="$(mktemp -d)"; trap 'rm -rf -- "$tmp"' EXIT
export GIT_TERMINAL_PROMPT=0
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' clone -q --depth 1 --branch main https://github.com/nickwei5050/stargo-work-site.git "$tmp/site"
node "$HOME/searchos/bin/stargowork-export-kb.mjs" "$tmp/site" "$tmp/kb" >/dev/null
set -a; . "$HOME/searchos/secrets/maxkb-admin.env"; set +a
status=0
node "$CODE/scripts/maxkb-kb-sync.mjs" --kb-dir "$tmp/kb" --knowledge-id "$KB_ID" --state "$STATE_DIR/stargowork-com.json" \
  --max-remove-ratio "${KB_SYNC_MAX_REMOVE_RATIO:-0.3}" $APPLY >"$tmp/result.json" 2>"$tmp/error.json" || status=$?
summary="$(node -e '
const fs = require("fs"); let r = {}; try { r = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); } catch {}
let e = {}; try { e = JSON.parse(fs.readFileSync(process.argv[2], "utf8")); } catch {}
console.log(JSON.stringify({ status: r.status ?? "error", error: e.error, message: e.message ? String(e.message).replace(/[A-Za-z0-9_-]{32,}/g, "<redacted>").slice(0, 300) : undefined, files: r.files, create: r.create?.length, update: r.update?.length, remove: r.remove?.length,
  adopt: r.adopt?.length, unmanaged: r.unmanaged?.length, uploaded: r.uploaded, deleted: r.deleted, urls: r.sourceUrls, urlsChanged: r.urlsChanged, bridgeRestartNeeded: r.bridgeRestartNeeded }));
' "$tmp/result.json" "$tmp/error.json")"
restart=no
echo "{\"at\":\"$(date -u +%FT%TZ)\",\"mode\":\"${APPLY:-plan}\",\"bridgeRestarted\":\"$restart\",\"result\":$summary}" >>"$LOG"
tail -1 "$LOG"
exit "$status"
