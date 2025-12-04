#!/bin/bash
set -e

npm run fetch-vault
npx vite build

echo "=== Password check ==="
echo "Password length: ${#SITE_PASSWORD}"
echo "Password set: $([ -n "$SITE_PASSWORD" ] && echo 'yes' || echo 'no')"

echo "=== Running staticrypt with verbose ==="
npx staticrypt dist/index.html -p "$SITE_PASSWORD" -o dist/encrypted.html --short 2>&1 || echo "STATICRYPT FAILED WITH CODE: $?"

echo "=== Check output ==="
ls -la dist/
cat dist/encrypted.html 2>/dev/null | head -20 || echo "encrypted.html not created"