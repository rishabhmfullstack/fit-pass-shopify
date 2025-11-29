require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for Shopify
app.use((req, res, next) => {
  const allowedOrigin = process.env.SHOP_DOMAIN 
    ? `https://${process.env.SHOP_DOMAIN}` 
    : '*';
  
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * Verify Shopify App Proxy signature
 * This ensures requests are coming from your Shopify store
 */
function verifyShopifyProxy(query) {
  if (!process.env.SHOPIFY_API_SECRET) {
    console.warn('SHOPIFY_API_SECRET not set - skipping signature verification');
    return true; // Skip verification in development
  }

  const { signature, ...params } = query;
  
  if (!signature) return false;

  // Sort parameters and create query string
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('');

  // Generate HMAC
  const calculatedSignature = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest('hex');

  return signature === calculatedSignature;
}

/**
 * Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Fitpass Shopify App is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * App Proxy endpoint for order confirmation
 * This is called from your Shopify theme via /apps/fitpass/order-confirmation
 */
app.post('/order-confirmation', async (req, res) => {
  try {
    // Verify the request is from Shopify (optional but recommended)
    // if (!verifyShopifyProxy(req.query)) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    console.log('Received request:', req.body);

    // Build payload for Fitpass API
    const payload = {
      user_id: req.body.user_id || 191919193174,
      fitpass_id: req.body.fitpass_id || 98765789,
      app_version: req.body.app_version || '8.1.2',
      device_os: req.body.device_os || '15',
      device_id: req.body.device_id || '45231',
      device_type: req.body.device_type || 'android',
      device_name: req.body.device_name || 'android',
      access_source: req.body.access_source || 'customer-android-app',
      customer_mobile: req.body.customer_mobile || '9212613245',
      customer_name: req.body.customer_name || 'Testing',
      action: req.body.action || 'activate',
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      merchant_transaction_number: req.body.merchant_transaction_number,
    };

    console.log('Calling Fitpass API with payload:', payload);

    // Call the Fitpass API
    const response = await fetch(process.env.FITPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.FITPASS_AUTH_TOKEN,
        'X_FITPASS_APP_KEY': process.env.FITPASS_APP_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Fitpass API response:', data);

    // Return the response
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Error calling Fitpass API:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

/**
 * GET endpoint (for App Proxy testing)
 */
app.get('/order-confirmation', (req, res) => {
  res.json({ 
    message: 'Fitpass Order Confirmation endpoint is working',
    method: 'Use POST to submit orders'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fitpass Shopify App running on port ${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  / - Health check`);
  console.log(`   POST /order-confirmation - Process order`);
});

