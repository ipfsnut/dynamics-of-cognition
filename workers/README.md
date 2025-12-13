# Cloudflare Workers Authentication

This directory contains the Cloudflare Worker that provides secure authentication for the Dynamics of Cognition site.

## How It Works

1. **Worker API** validates passwords and issues JWT-like tokens
2. **KV Storage** stores:
   - Valid authentication tokens (24-hour expiry)
   - Encrypted content (papers and documents)
3. **React App** fetches content only with valid token

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespaces

```bash
# Create production KV namespaces
wrangler kv:namespace create "AUTH_TOKENS"
wrangler kv:namespace create "CONTENT_STORE"

# Create preview KV namespaces (for testing)
wrangler kv:namespace create "AUTH_TOKENS" --preview
wrangler kv:namespace create "CONTENT_STORE" --preview
```

Copy the IDs from the output and update them in `wrangler.toml`.

### 4. Upload Protected Content

```bash
# Generate content.json from your markdown files
node upload-content.js

# Upload to KV store
wrangler kv:key put --binding=CONTENT_STORE "protected-content" "$(cat content.json)"
```

### 5. Deploy the Worker

```bash
# Deploy to production
wrangler deploy

# Or test locally first
wrangler dev
```

### 6. Update React App

After deployment, update the `WORKER_URL` in `src/PasswordProtectAPI.jsx`:

```javascript
const WORKER_URL = 'https://dynamics-auth.YOUR-SUBDOMAIN.workers.dev';
```

## Testing Locally

1. Run the worker locally:
   ```bash
   wrangler dev
   ```

2. The worker will be available at `http://localhost:8787`

3. Test authentication:
   ```bash
   curl -X POST http://localhost:8787/auth \
     -H "Content-Type: application/json" \
     -d '{"password":"GoodRegulator-Theorem2025!"}'
   ```

## Security Features

- **Server-side validation**: Password never stored in client code
- **Token-based auth**: Short-lived tokens (24 hours)
- **Content encryption**: Content stored encrypted in KV
- **CORS protection**: Configure for your domain only in production

## API Endpoints

### POST /auth
Verify password and get authentication token.

Request:
```json
{
  "password": "your-password"
}
```

Response:
```json
{
  "success": true,
  "token": "...",
  "expiresIn": 86400
}
```

### GET /content
Get protected content with valid token.

Headers:
```
Authorization: Bearer YOUR_TOKEN
```

Response:
```json
{
  "content": {
    "paper": "...",
    "documents": {...}
  }
}
```

## Production Checklist

- [ ] Update CORS headers to specific domain
- [ ] Set strong password
- [ ] Upload all content to KV
- [ ] Configure custom domain (optional)
- [ ] Monitor usage in Cloudflare dashboard