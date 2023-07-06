import fetch from 'node-fetch';

export async function checkForPreviousOrders(customerId) {
  const SHOPIFY_BASE_URL = process.env.SHOPIFY_URL;
  const response = await fetch(`${SHOPIFY_BASE_URL}/orders.json?customer_id=${customerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
    },
  });

  const data = await response.json();
  
  // Find if there's any order within the last 24 hours.
  const last24Hours = Date.now() - 24*60*60*1000;
  return data.orders.some(order => new Date(order.created_at).getTime() > last24Hours && order.tags.includes('instant replacement'));
}
