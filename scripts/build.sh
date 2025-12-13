#!/bin/bash
set -e

# Source .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

npm run fetch-vault
npx vite build

echo ""
echo "=== Build complete! ==="
echo "The dist/ folder is ready for deployment."
echo "Password protection is now built into the React app."