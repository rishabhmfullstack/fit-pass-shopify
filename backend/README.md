# Fitpass API Proxy Setup

Since Shopify doesn't allow direct API calls to external services from the frontend (due to CORS restrictions), you need to set up a proxy server.

## Quick Setup: Cloudflare Workers (Free)

### Step 1: Create a Cloudflare Account
1. Go to [https://workers.cloudflare.com](https://workers.cloudflare.com)
2. Sign up for a free account

### Step 2: Create a New Worker
1. Go to Workers & Pages in your Cloudflare dashboard
2. Click "Create Worker"
3. Give it a name like `fitpass-proxy`

### Step 3: Deploy the Code
1. Copy the contents of `cloudflare-worker.js`
2. Paste it into the Cloudflare Worker editor
3. **Important:** Update the `CORS_ORIGIN` variable with your Shopify store domain:
   ```js
   const CORS_ORIGIN = 'https://your-store.myshopify.com';
   ```
4. Click "Save and Deploy"

### Step 4: Get Your Worker URL
After deployment, you'll get a URL like:
```
https://fitpass-proxy.your-subdomain.workers.dev
```

### Step 5: Configure in Shopify
1. Go to your Shopify admin
2. Navigate to Online Store → Themes → Customize
3. Find the "Fitness Membership" section
4. Enter your Worker URL in the "Fitpass Proxy URL" field

## Security Notes

⚠️ **Important:** The current setup includes API credentials directly in the Worker code. For production:

1. Use Cloudflare Worker Environment Variables:
   ```js
   // In your worker, access env vars like:
   const FITPASS_AUTH_TOKEN = env.FITPASS_AUTH_TOKEN;
   ```

2. Set these in Cloudflare dashboard under Worker Settings → Variables

3. Restrict CORS to your specific Shopify domain

## Alternative: Vercel Serverless Function

If you prefer Vercel, create `api/fitpass-proxy.js`:

```javascript
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://your-store.myshopify.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://services.fitpass.dev/cred/order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.FITPASS_AUTH_TOKEN,
        'X_FITPASS_APP_KEY': process.env.FITPASS_APP_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}
```

## Testing

Test your proxy with curl:
```bash
curl -X POST https://fitpass-proxy.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"customer_mobile": "9212613245", "customer_name": "Test"}'
```

