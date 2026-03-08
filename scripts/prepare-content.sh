#!/bin/bash
set -e

cd "$(dirname "$0")/.."

rm -rf content

if [ -d "/home/yann/dev/blog" ] && [ -z "$CI" ]; then
  cp -r /home/yann/dev/blog content
else
  git clone https://github.com/yanncotineau/blog content
fi

node scripts/build-commit-map.js
rm -rf content/.git

rm -rf public/images
find content -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.avif" \) | while read -r img; do
  rel="${img#content/}"
  dest="public/images/$(dirname "$rel")/$(basename "$rel")"
  mkdir -p "$(dirname "$dest")"
  ln -f "$img" "$dest" 2>/dev/null || cp "$img" "$dest"
done

echo "Content ready"