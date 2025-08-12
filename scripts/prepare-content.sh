#!/bin/bash
set -e

# Ensure script runs from project root
cd "$(dirname "$0")/.."

echo "🔄 Preparing content..."

# Remove existing content
rm -rf content

# Clone blog repo into /content
git clone https://github.com/yanncotineau/blog content

# Remove .git folder to avoid nested repo issues
rm -rf content/.git

echo "✅ Content ready"