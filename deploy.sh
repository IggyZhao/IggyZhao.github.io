#!/usr/bin/env bash
# Usage: ./deploy.sh ["commit message"]
# Auto-bumps ?v=N in index.html for any changed src/*.{js,jsx,css}, commits, pushes.
set -euo pipefail

cd "$(dirname "$0")"

for f in $(git diff --name-only -- 'src/*.js' 'src/*.jsx' 'src/*.css'); do
  base=$(basename "$f")
  current=$(sed -n "s|.*src/${base}?v=\([0-9]*\).*|\1|p" index.html | head -1)
  if [ -n "$current" ]; then
    next=$((current + 1))
    sed -i '' "s|src/${base}?v=${current}|src/${base}?v=${next}|" index.html
    echo "Bumped ${base}: v${current} -> v${next}"
  fi
done

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to deploy."
  exit 0
fi

git add -A
git commit -m "${1:-Update site}"
git push origin main
echo "Pushed. Site rebuilds in ~1 min: https://iggyzhao.github.io/"
