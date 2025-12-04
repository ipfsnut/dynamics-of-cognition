#!/bin/bash
set -e

npm run fetch-vault
npx vite build

echo "=== Before staticrypt ==="
ls -la dist/index.html
cat dist/index.html

if [ -n "$SITE_PASSWORD" ]; then
  echo "=== Running staticrypt ==="
  npx staticrypt dist/index.html -p "$SITE_PASSWORD" -o dist/index.html
  echo "=== After staticrypt ==="
  ls -la dist/index.html
  head -50 dist/index.html
else
  echo "WARNING: SITE_PASSWORD not set!"
fi