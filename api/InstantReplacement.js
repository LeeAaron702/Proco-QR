export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { firstName, lastName, phone, email, address1, address2, city, state, zipcode, shopifyID, variantId } = req.body;
  const baseUrl = process.env.SHOPIFY_URL;

  const customerUrl = `${baseUrl}/customers.json`;
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
      "accepts_marketing": true,
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
        const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=email:${email}`, {
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
      } else if (responseData.errors && responseData.errors.phone && responseData.errors.phone.includes("Phone has already been taken")) {
        // If the phone number is already in use, search for the existing customer
        const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=phone:${phone}`, {
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

// Now that the customer exists, check for recent replacement orders

// Calculate the date and time 3 days ago in ISO format
const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

// Construct the URL for the Shopify API call to fetch recent orders
const recentOrdersUrl = `${baseUrl}/orders.json?created_at_min=${oneDayAgo}&status=any&limit=250&tag=Instant%20Replacement`;

// Make the API call
const recentOrdersResponse = await fetch(recentOrdersUrl, {
  method: 'GET',
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

// Parse the response data
const recentOrdersData = await recentOrdersResponse.json();

// Define the current customer's address
const customerAddress = {
  first_name: firstName,
  last_name: lastName,
  address1,
  address2,
  city,
  province: state,
  zip: zipcode,
  country: "US",
  phone
};



// Filter the orders to find any that match the customer's address
const recentReplacementOrders = recentOrdersData.orders.filter(order => {
  const orderAddress = order.shipping_address;
  return orderAddress.address1 === customerAddress.address1
    && orderAddress.address2 === customerAddress.address2
    && orderAddress.city === customerAddress.city
    && orderAddress.province === customerAddress.province
    && orderAddress.zip === customerAddress.zip
});

// If any matching orders are found, respond with an error message
if (recentReplacementOrders.length > 0) {
  return res.status(403).json({ message: 'Recent replacement order already exists for this address in the past 30 days.' });
}

    const orderUrl = `${baseUrl}/orders.json`;
    const orderData = {
      order: {
        customer: {
          id: customer.id
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1,
          address2,
          city,
          province: state,
          zip: zipcode,
          country: "US",
          phone
        },
        line_items: [
          {
            variant_id: variantId,
            quantity: 1,
            price: "0.00"
          }
        ],
        "tags": 'Instant Replacement'
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

    return res.status(200).json({ message: 'Customer and order created successfully.', customer, order: orderResponseData.order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
}

function handleErrors(response, responseData) {
  if (responseData.errors && responseData.errors.email && responseData.errors.email.length > 0) {
    const errorMessage = responseData.errors.email[0];
    return { status: response.status, message: 'Error creating customer.', error: errorMessage };
  }

  if (responseData.errors && responseData.errors.phone && responseData.errors.phone.length > 0) {
    const errorMessage = responseData.errors.phone[0];
    return { status: response.status, message: 'Error creating customer.', error: errorMessage };
  }

  // Handle other error cases
  const errorResponse = responseData.error || { message: 'Unknown error from Shopify API.' };
  return { status: response.status, message: 'Error creating customer.', error: errorResponse };
}