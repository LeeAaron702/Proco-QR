export async function createOrder(customerId, lineItems) {
  const SHOPIFY_BASE_URL = process.env.SHOPIFY_URL
    const response = await fetch(`${SHOPIFY_BASE_URL}/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
      body: JSON.stringify({
        order: {
          customer: {
            id: customerId,
          },
          line_items: lineItems,
        },
      }),
    });
  
    const data = await response.json();
    return data.order;
  }
  