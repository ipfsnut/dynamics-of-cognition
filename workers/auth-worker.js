/**
 * Cloudflare Worker for Dynamics of Cognition Authentication
 * 
 * This worker handles password verification and serves encrypted content
 * only to authenticated users.
 */

// Configuration
const PASSWORD_HASH = '71481adf33f5c9e5e7b69353b7e221901bd500458c63357de39f4367b847e2b0';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // In production, set to your specific domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Parse URL
    const url = new URL(request.url);
    
    // Route: POST /auth - Verify password and return token
    if (url.pathname === '/auth' && request.method === 'POST') {
      return handleAuth(request, env);
    }
    
    // Route: GET /content - Get protected content with valid token
    if (url.pathname === '/content' && request.method === 'GET') {
      return handleContent(request, env);
    }
    
    // 404 for other routes
    return new Response('Not Found', { status: 404 });
  },
};

/**
 * Handle authentication requests
 */
async function handleAuth(request, env) {
  try {
    const body = await request.json();
    const { password } = body;
    
    if (!password) {
      return jsonResponse({ error: 'Password required' }, 400);
    }
    
    // Hash the provided password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Verify password
    if (hashedInput !== PASSWORD_HASH) {
      return jsonResponse({ error: 'Invalid password' }, 401);
    }
    
    // Generate a session token
    const token = await generateToken();
    
    // Store token in KV with 24-hour expiry
    await env.AUTH_TOKENS.put(token, 'valid', { expirationTtl: 86400 });
    
    return jsonResponse({ 
      success: true, 
      token,
      expiresIn: 86400 
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return jsonResponse({ error: 'Authentication failed' }, 500);
  }
}

/**
 * Handle content requests
 */
async function handleContent(request, env) {
  // Check for authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.slice(7); // Remove 'Bearer ' prefix
  
  // Verify token exists in KV
  const tokenValid = await env.AUTH_TOKENS.get(token);
  if (!tokenValid) {
    return jsonResponse({ error: 'Invalid or expired token' }, 401);
  }
  
  // Get encrypted content from KV
  // In production, you'd store your actual encrypted content here
  const content = await env.CONTENT_STORE.get('protected-content');
  
  if (!content) {
    // For initial setup, return a placeholder
    return jsonResponse({
      content: {
        paper: 'Your paper content would be stored here',
        documents: {
          'h-omega': 'H(ω) synthesis document',
          'config-dynamics': 'Configuration dynamics document'
        }
      }
    });
  }
  
  // Return the decrypted content
  return jsonResponse({ content: JSON.parse(content) });
}

/**
 * Generate a secure random token
 */
async function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS
    }
  });
}