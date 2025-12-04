#!/bin/bash
set -e

# Source .env file if it exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

npm run fetch-vault
npx vite build

echo "=== Password check ==="
echo "Password length: ${#SITE_PASSWORD}"
echo "Password set: $([ -n "$SITE_PASSWORD" ] && echo 'yes' || echo 'no')"

echo "=== Running staticrypt ==="
npx staticrypt dist/index.html -p "$SITE_PASSWORD" --short
echo "Staticrypt completed successfully - index.html has been encrypted"