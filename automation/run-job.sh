#!/usr/bin/env bash
# Runs one scheduled job on the automation box and emails the result.
#
#   automation/run-job.sh health           daily: live-site checks, no changes made
#   automation/run-job.sh content          weekly: Claude writes one new guide, then build, check, commit, push, deploy
#   automation/run-job.sh search-console   monthly: Search Console report, then Claude tunes titles/descriptions and deploys
#   automation/run-job.sh aeo              monthly: asks AI answer engines about SLC's searches, no changes made
#
# Secrets come from SSM Parameter Store under /slc/ (see automation/README.md).
# Jobs never overlap: they share one checkout, so they take a lock.
set -uo pipefail

JOB="${1:?usage: run-job.sh <health|content|search-console|aeo>}"
ROOT="${SLC_ROOT:-/opt/slc}"
REPO="$ROOT/repo"
STATE="$ROOT/state"
WORK="$REPO/automation/.work"
STAMP="$(date +%F-%H%M)"
LOG="$STATE/logs/$JOB-$STAMP.log"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://www.slccarrentals.com.pk}"
export SLC_STATE="$STATE"

mkdir -p "$STATE/logs"
exec 9>"$STATE/job.lock"
flock -w 3600 9 || { echo "could not get the job lock" >&2; exit 1; }
exec > >(tee -a "$LOG") 2>&1
find "$STATE/logs" -name '*.log' -mtime +90 -delete

param() { aws ssm get-parameter --name "/slc/$1" --with-decryption --query Parameter.Value --output text 2>/dev/null || true; }
EMAIL="$(param report-email)"
# Claude subscription token from `claude setup-token` (preferred), or an API key.
export CLAUDE_CODE_OAUTH_TOKEN="$(param claude-oauth-token)"
[ -n "$CLAUDE_CODE_OAUTH_TOKEN" ] || unset CLAUDE_CODE_OAUTH_TOKEN
export ANTHROPIC_API_KEY="$(param anthropic-api-key)"
[ -n "$ANTHROPIC_API_KEY" ] || unset ANTHROPIC_API_KEY
export OPENAI_API_KEY="$(param openai-api-key)"
export PERPLEXITY_API_KEY="$(param perplexity-api-key)"
export GEMINI_API_KEY="$(param gemini-api-key)"
GITHUB_TOKEN="$(param github-token)"

# mail <subject> <body file>
mail() {
  [ -n "$EMAIL" ] || { echo "no /slc/report-email set, skipping email"; return; }
  node "$REPO/automation/notify.mjs" "$EMAIL" "[SLC $JOB] $1" "$2" || echo "email failed"
}

fail() {
  local why="$1"
  { echo "$why"; echo; echo "Nothing was published. Last 60 lines of the log ($LOG):"; echo; tail -n 60 "$LOG"; } > "$STATE/fail.txt"
  git -C "$REPO" reset -q --hard origin/main
  mail "FAILED: $why" "$STATE/fail.txt"
  exit 1
}

echo "== $JOB $(date -Is)"

# Fresh copy of main: picks up anything pushed from a laptop since the last run.
git -C "$REPO" fetch -q origin main || fail "git fetch failed"
git -C "$REPO" reset -q --hard origin/main
git -C "$REPO" clean -qfd -e automation/.work
mkdir -p "$WORK"
rm -f "$WORK"/summary.md "$WORK"/commit-msg.txt
cd "$REPO"
npm ci --no-audit --no-fund --loglevel=error || fail "npm ci failed"

# Ask Claude Code (headless) to do the job described in automation/jobs/<job>.md.
run_claude() {
  [ -n "${CLAUDE_CODE_OAUTH_TOKEN:-}${ANTHROPIC_API_KEY:-}" ] || fail "no /slc/claude-oauth-token (or /slc/anthropic-api-key) set"
  claude -p "$(cat "automation/jobs/$JOB.md")" \
    --model "${CLAUDE_MODEL:-sonnet}" \
    --permission-mode acceptEdits \
    --allowedTools "Read,Edit,Write,Glob,Grep,Bash(npm run typecheck),Bash(npm run build),Bash(npm run seo:check),Bash(node scripts/seo-check.mjs*)" \
    --max-turns 80 \
    --output-format text > "$WORK/claude.txt" || fail "Claude Code exited with an error"
}

# Verify, commit, push and deploy whatever Claude changed.
publish() {
  if git diff --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    { cat "$WORK/summary.md" 2>/dev/null || cat "$WORK/claude.txt"; echo; echo "No site changes this run."; } > "$STATE/mail.txt"
    mail "no changes" "$STATE/mail.txt"
    exit 0
  fi
  npm run typecheck || fail "typecheck failed after Claude's edits"
  npm run build || fail "build failed after Claude's edits"
  npm run seo:check > "$WORK/seo.txt" || { cat "$WORK/seo.txt"; fail "SEO check failed after Claude's edits"; }

  local msg; msg="$(cat "$WORK/commit-msg.txt" 2>/dev/null || echo "automation: $JOB $STAMP")"
  git add -A -- . ':!automation/.work'
  git -c user.name="SLC automation" -c user.email="automation@slccarrentals.com.pk" \
    commit -q -m "$msg" -m "Automated $JOB run on $STAMP." || fail "git commit failed"
  [ -n "$GITHUB_TOKEN" ] || fail "no /slc/github-token set, cannot push"
  git -c credential.helper= \
    -c "credential.helper=!f() { echo username=x-access-token; echo password=$GITHUB_TOKEN; }; f" \
    push -q origin HEAD:main || fail "git push was rejected (someone pushed at the same time? it will retry next run)"

  bash deploy.sh || fail "deploy failed (the commit is on GitHub; the next run or a manual deploy will publish it)"

  {
    cat "$WORK/summary.md" 2>/dev/null || cat "$WORK/claude.txt"
    echo; echo "---"; echo "Published to $NEXT_PUBLIC_SITE_URL"
    echo "Commit: https://github.com/gitmann-ayt/SLC-website/commit/$(git rev-parse --short HEAD)"
    echo; head -n 1 "$WORK/seo.txt"
  } > "$STATE/mail.txt"
  mail "published: $(head -n 1 <<<"$msg")" "$STATE/mail.txt"
}

case "$JOB" in
  health)
    if node automation/health.mjs > "$STATE/mail.txt"; then mail "all OK" "$STATE/mail.txt"
    else mail "PROBLEMS FOUND" "$STATE/mail.txt"; fi
    ;;
  aeo)
    node automation/aeo.mjs > "$STATE/mail.txt" || fail "AEO check failed"
    mail "monthly AI answer check" "$STATE/mail.txt"
    ;;
  content)
    run_claude
    publish
    ;;
  search-console)
    node automation/gsc.mjs "$WORK/gsc.json" > "$WORK/gsc.txt" || fail "Search Console API call failed"
    run_claude
    { cat "$WORK/gsc.txt"; echo; } > "$WORK/gsc-head.txt"
    # Put the raw report on top of whatever Claude summarised.
    [ -f "$WORK/summary.md" ] && cat "$WORK/gsc-head.txt" "$WORK/summary.md" > "$WORK/s.tmp" && mv "$WORK/s.tmp" "$WORK/summary.md"
    publish
    ;;
  *) echo "unknown job $JOB"; exit 2 ;;
esac
echo "== done $(date -Is)"
