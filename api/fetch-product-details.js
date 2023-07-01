// Serverless function: /api/fetch-variant-id

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const productId = req.query.productId;

  // Base URL for Shopify API requests
  const baseUrl = process.env.SHOPIFY_URL;

  // Endpoint to fetch product details (including variants)
  const productUrl = `${baseUrl}/products/${productId}.json`;

  const options = {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(productUrl, options);
    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching product.', error: responseData });
    }

    const product = {
      title: responseData.product.title,
      variantId: responseData.product.variants[0].sku,
      shopifyLink: `${baseUrl}/products/${responseData.product.handle}`,
  };

    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
}
