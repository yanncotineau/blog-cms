#!/bin/bash
set -e

# Ensure script runs from project root
cd "$(dirname "$0")/.."

echo "🔄 Preparing content..."

# Remove existing content
rm -rf content

# Clone blog repo into /content
git clone https://github.com/yanncotineau/blog content

# build commit map before removing .git
node scripts/build-commit-map.js

# Remove .git folder to avoid nested repo issues
rm -rf content/.git

echo "✅ Content ready"