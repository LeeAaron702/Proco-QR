export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { firstName, lastName, phone, email, address1, address2, city, state, zipcode, shopifyID } = req.body;

  const url = 'https://professor-color.myshopify.com/admin/api/2022-01/customers.json';

  const data = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        addresses: [
          {
            address1,
            address2,
            city,
            province: state,
            zip: zipcode,
            country: "US"
          },
        ],
      },
    };

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      handleErrors(response, responseData);
    }

    const customer = responseData.customer;
    const orderUrl = `https://professor-color.myshopify.com/admin/api/2022-01/orders.json`;
    const orderData = {
      order: {
        customer: {
          id: customer.id
        },
        line_items: [
          {
            variant_id: shopifyID,
            quantity: 1,
            price: "0.00"
          }
        ]
      }
    };
    const orderOptions = {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    };

    const orderResponse = await fetch(orderUrl, orderOptions);
    const orderResponseData = await orderResponse.json();

    if (!orderResponse.ok) {
      handleErrors(orderResponse, orderResponseData);
    }

    return res.status(200).json({ message: 'Customer and order created successfully.', customer: responseData, order: orderResponseData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
}

function handleErrors(response, responseData) {
  if (responseData.errors && responseData.errors.email && responseData.errors.email.length > 0) {
    const errorMessage = responseData.errors.email[0];
    return res.status(response.status).json({ message: 'Error creating customer.', error: errorMessage });
  }

  if (responseData.errors && responseData.errors.phone && responseData.errors.phone.length > 0) {
    const errorMessage = responseData.errors.phone[0];
    return res.status(response.status).json({ message: 'Error creating customer.', error: errorMessage });
  }

  // Handle other error cases
  const errorResponse = responseData.error || { message: 'Unknown error from Shopify API.' };
  return res.status(response.status).json({ message: 'Error creating customer.', error: errorResponse });
}
