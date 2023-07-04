export async function getCustomer(email) {
  const SHOPIFY_BASE_URL = process.env.SHOPIFY_URL
    const response = await fetch(`${SHOPIFY_BASE_URL}/customers/search.json?query=email:${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
    });
  
    const data = await response.json();
    return data.customers[0];
  }
  