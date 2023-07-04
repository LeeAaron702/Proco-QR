export async function getProduct(productId) {
  const SHOPIFY_BASE_URL = process.env.SHOPIFY_URL
    const response = await fetch(`${SHOPIFY_BASE_URL}/products/${productId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
    });
  
    const data = await response.json();
    return data.product;
  }
  