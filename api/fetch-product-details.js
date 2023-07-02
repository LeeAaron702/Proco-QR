// Serverless function: /api/fetch-variant-id


export default async function handler(req, res) {
  const baseUrl = process.env.SHOPIFY_URL;


  function extractModelNumbers(title) {
    // Use the regular expression to match the model numbers
    let regex = /\b\d{3}R\d{5}\b/g;

    // Find matches in the title
    let matches = title.match(regex);

    // If there are matches, return them. Otherwise, return an empty array.
    return matches ? matches.join(" ") : "";
  }

  try {
    const { productId } = req.query;

    // Make a request to Shopify's API
    const response = await fetch(`${baseUrl}/products/${productId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
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
    const handle = product.handle;
    const modelNumber = extractModelNumbers(productTitle)
    const productImage = product.images.src

    // Send the variant ID and title as the response
    res.status(200).json({ variantId, productTitle, handle, modelNumber, productImage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
}