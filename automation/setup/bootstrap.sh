#!/bin/bash
# Sets up the SLC automation box (Amazon Linux 2023, arm64). Runs as EC2 user
# data on first boot; `bootstrap.sh update` re-runs the safe parts weekly.
set -euxo pipefail

NODE_VERSION=v22.14.0
ROOT=/opt/slc
REPO_URL=https://github.com/gitmann-ayt/SLC-website.git

if [ "${1:-}" = "update" ]; then
  # Called from the slc user's crontab: refresh Claude Code and the schedule.
  sudo /usr/local/bin/npm install -g @anthropic-ai/claude-code@latest --loglevel=error || true
  git -C $ROOT/repo fetch -q origin main && git -C $ROOT/repo reset -q --hard origin/main
  crontab $ROOT/repo/automation/setup/crontab
  exit 0
fi

dnf install -y git cronie tar xz util-linux
systemctl enable --now crond

# 2 GB swap: `next build` can exceed the t4g.small's 2 GB of RAM.
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
fi

curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-arm64.tar.xz" | tar -xJ -C /usr/local --strip-components=1
npm install -g @anthropic-ai/claude-code --loglevel=error

id slc >/dev/null 2>&1 || useradd -m slc
echo 'slc ALL=(root) NOPASSWD: /usr/local/bin/npm install -g @anthropic-ai/claude-code*' > /etc/sudoers.d/slc
mkdir -p $ROOT/state/logs
[ -d $ROOT/repo/.git ] || git clone -q $REPO_URL $ROOT/repo
chown -R slc:slc $ROOT

if [ -f $ROOT/repo/automation/setup/crontab ]; then
  sudo -u slc crontab $ROOT/repo/automation/setup/crontab
else
  echo "automation/ is not on main yet: schedule not installed (run: sudo -u slc crontab $ROOT/repo/automation/setup/crontab)"
fi
echo "SLC automation box ready"
