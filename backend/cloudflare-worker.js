/**
 * Cloudflare Worker - Fitpass API Proxy
 * 
 * Deploy this to Cloudflare Workers to proxy API calls from your Shopify store.
 * 
 * Setup:
 * 1. Go to https://workers.cloudflare.com/
 * 2. Create a new worker
 * 3. Paste this code
 * 4. Deploy and get your worker URL (e.g., https://fitpass-proxy.your-subdomain.workers.dev)
 * 5. Update the CORS_ORIGIN to your Shopify store domain
 */

// Configuration
const FITPASS_API_URL = 'https://services.fitpass.dev/cred/order-confirmation';
const FITPASS_AUTH_TOKEN = 'l9xGmxeF6GU4djgsMDBWG9ui0xeDhvR7qxbWq1M9';
const FITPASS_APP_KEY = 'fhskjdhfkjsdahgkjadsfmgbasdiughdiag';

// Add your Shopify store domain here
const CORS_ORIGIN = '*'; // Change to your store: 'https://your-store.myshopify.com'

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': CORS_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': CORS_ORIGIN,
        },
      });
    }

    try {
      // Parse the incoming request body
      const requestBody = await request.json();

      // Build the payload for Fitpass API
      const payload = {
        user_id: requestBody.user_id || 191919193174,
        fitpass_id: requestBody.fitpass_id || 98765789,
        app_version: requestBody.app_version || '8.1.2',
        device_os: requestBody.device_os || '15',
        device_id: requestBody.device_id || '45231',
        device_type: requestBody.device_type || 'android',
        device_name: requestBody.device_name || 'android',
        access_source: requestBody.access_source || 'customer-android-app',
        customer_mobile: requestBody.customer_mobile,
        customer_name: requestBody.customer_name,
        action: requestBody.action || 'activate',
        latitude: requestBody.latitude,
        longitude: requestBody.longitude,
        merchant_transaction_number: requestBody.merchant_transaction_number,
      };

      // Call the Fitpass API
      const response = await fetch(FITPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': FITPASS_AUTH_TOKEN,
          'X_FITPASS_APP_KEY': FITPASS_APP_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Return the response with CORS headers
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': CORS_ORIGIN,
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Proxy error', 
        message: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': CORS_ORIGIN,
        },
      });
    }
  },
};

