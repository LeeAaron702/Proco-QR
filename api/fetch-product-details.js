// Serverless function: /api/fetch-variant-id

export default async function handler(req, res) {
  const baseUrl = process.env.SHOPIFY_URL;

  try {
    const { productId } = req.query;

    // Make a request to Shopify's API
    const response = await fetch(`${baseUrl}/products/${productId}.json`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SHOPIFY_API_TOKEN', // Replace with your actual Shopify API token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product details.');
    }

    const data = await response.json();
    const product = data.product;

    // Extract the variant ID and title
    const variantId = product.variants[0].id;
    const productTitle = product.title;

    // Send the variant ID and title as the response
    res.status(200).json({ variantId, productTitle });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
}