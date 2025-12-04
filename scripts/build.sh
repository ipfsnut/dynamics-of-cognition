#!/bin/bash
# scripts/build.sh - Build with password protection

set -e

# Run vault fetch
npm run fetch-vault

# Build with Vite
npx vite build

# Apply password protection if SITE_PASSWORD is set
if [ -n "$SITE_PASSWORD" ]; then
  echo "Applying password protection..."
  npx staticrypt dist/index.html -p "$SITE_PASSWORD" --short
  echo "Password protection applied."
else
  echo "WARNING: SITE_PASSWORD not set, site will be unprotected!"
fi