export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { firstName, lastName, phone, email, address1, address2, city, state, zipcode, shopifyID } = req.body;
  
  // Define the base URL for the API requests
  const baseUrl = 'https://professor-color.myshopify.com/admin/api/2022-01';
  
  const customerUrl = `${baseUrl}/customers.json`;
  const searchUrl = `${baseUrl}/customers/search.json?query=email:${email}`;

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

  let customer;

  try {
    const response = await fetch(customerUrl, options);
    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.errors && responseData.errors.email && responseData.errors.email.includes("has already been taken")) {
        // If the email is already in use, search for the existing customer
        const searchResponse = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        });
        const searchResult = await searchResponse.json();
        if (searchResult.customers.length > 0) {
          customer = searchResult.customers[0];
        } else {
          return res.status(500).json({ message: 'Server error. Unable to locate existing customer.' });
        }
      } else {
        handleErrors(response, responseData);
      }
    } else {
      customer = responseData.customer;
    }

    const orderUrl = `${baseUrl}/orders.json`;
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
      return res.status(orderResponse.status).json({ message: 'Error creating order.', error: orderResponseData });
    }

    return res.status(200).json({ message: 'Customer and order created successfully.', customer, order: orderResponseData });
  }catch (error) {
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
