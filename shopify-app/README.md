# Fitpass Shopify App

A Shopify App with App Proxy to securely call the Fitpass API from your Shopify store.

## How It Works

```
[Shopify Store] → [App Proxy: /apps/fitpass/*] → [This Server] → [Fitpass API]
```

## Setup Instructions

### Step 1: Create a Shopify App

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Create a partner account (if you don't have one)
3. Go to **Apps** → **Create app**
4. Choose **Create app manually**
5. Enter app name: `Fitpass Integration`

### Step 2: Configure App URLs

In your app settings, set:

| Field | Value |
|-------|-------|
| App URL | `https://your-server.com/` |
| Allowed redirection URL(s) | `https://your-server.com/auth/callback` |

### Step 3: Set Up App Proxy

1. In your app settings, go to **App proxy**
2. Configure:

| Field | Value |
|-------|-------|
| Subpath prefix | `apps` |
| Subpath | `fitpass` |
| Proxy URL | `https://your-server.com/` |

This creates the route: `https://your-store.myshopify.com/apps/fitpass/*`

### Step 4: Deploy This Server

#### Option A: Deploy to Railway (Easiest)

1. Go to [railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub**
3. Connect this repository
4. Add environment variables (see below)
5. Deploy!

#### Option B: Deploy to Render

1. Go to [render.com](https://render.com/)
2. Create a new **Web Service**
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

#### Option C: Deploy to Heroku

```bash
heroku create fitpass-shopify-app
heroku config:set FITPASS_API_URL=https://services.fitpass.dev/cred/order-confirmation
heroku config:set FITPASS_AUTH_TOKEN=your_token
heroku config:set FITPASS_APP_KEY=your_key
git push heroku main
```

#### Option D: Run Locally with ngrok (For Testing)

```bash
# Install dependencies
cd shopify-app
npm install

# Copy environment file
cp env.sample .env
# Edit .env with your values

# Start the server
npm run dev

# In another terminal, expose with ngrok
ngrok http 3000
```

Use the ngrok URL as your App Proxy URL.

### Step 5: Environment Variables

Set these environment variables on your server:

```
PORT=3000
FITPASS_API_URL=https://services.fitpass.dev/cred/order-confirmation
FITPASS_AUTH_TOKEN=l9xGmxeF6GU4djgsMDBWG9ui0xeDhvR7qxbWq1M9
FITPASS_APP_KEY=fhskjdhfkjsdahgkjadsfmgbasdiughdiag
SHOPIFY_API_KEY=<from Shopify Partners>
SHOPIFY_API_SECRET=<from Shopify Partners>
SHOP_DOMAIN=your-store.myshopify.com
```

### Step 6: Install App on Your Store

1. In Shopify Partners, go to your app
2. Click **Select store** and choose your development store
3. Install the app

### Step 7: Update Theme Code

In your `fitpass-banner.liquid`, update the fetch URL to use the App Proxy:

```javascript
const response = await fetch("/apps/fitpass/order-confirmation", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/order-confirmation` | Process Fitpass order |

## Testing

### Test the server locally:

```bash
curl http://localhost:3000/
```

### Test order confirmation:

```bash
curl -X POST http://localhost:3000/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{"customer_mobile": "9212613245", "customer_name": "Test"}'
```

### Test via Shopify App Proxy:

```bash
curl -X POST https://your-store.myshopify.com/apps/fitpass/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{"customer_mobile": "9212613245", "customer_name": "Test"}'
```

## Troubleshooting

### "404 Not Found" on App Proxy

- Make sure the app is installed on your store
- Verify App Proxy settings match exactly
- Check that your server is running and accessible

### "CORS Error"

- Ensure `SHOP_DOMAIN` env variable is set correctly
- Check the server logs for errors

### "Unauthorized" from Fitpass

- Verify `FITPASS_AUTH_TOKEN` and `FITPASS_APP_KEY` are correct
- Check if the credentials have expired

## Security Notes

1. **Never expose API credentials in frontend code**
2. **Enable signature verification** in production by uncommenting the verification code
3. **Use HTTPS** in production
4. **Restrict CORS** to your specific Shopify domain

