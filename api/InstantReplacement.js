export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    const customerData = extractCustomerData(req.body);
    const customer = await createOrUpdateCustomer(customerData);
    await checkForRecentReplacementOrders(customer);
    const orderData = extractOrderData(req.body, customer);
    const order = await createOrder(orderData);

    return res.status(200).json({ message: 'Customer and order created successfully.', customer, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
}

function extractCustomerData(body) {
  const { firstName, lastName, phone, email, address1, address2, city, state, zipcode } = body;
  
  return {
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
  };
}

async function createOrUpdateCustomer(data) {
  const baseUrl = process.env.SHOPIFY_URL;
  const customerUrl = `${baseUrl}/customers.json`;

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customer: data })
  };

  const response = await fetch(customerUrl, options);
  const responseData = await response.json();

  if (!response.ok) {
    return handleCustomerErrors(responseData, data.email, data.phone);
  }

  return responseData.customer;
}

async function handleCustomerErrors(responseData, email, phone) {
  if (responseData.errors) {
    if (responseData.errors.email && responseData.errors.email.includes("has already been taken")) {
      return findExistingCustomerByEmail(email);
    }

    if (responseData.errors.phone && responseData.errors.phone.includes("Phone has already been taken")) {
      return findExistingCustomerByPhone(phone);
    }
  }

  throw new Error('Error creating customer.');
}

async function findExistingCustomerByEmail(email) {
  const baseUrl = process.env.SHOPIFY_URL;
  const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=email:${email}`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  const searchResult = await searchResponse.json();

  if (searchResult.customers.length > 0) {
    return searchResult.customers[0];
  }

  throw new Error('Server error. Unable to locate existing customer.');
}

async function findExistingCustomerByPhone(phone) {
  const baseUrl = process.env.SHOPIFY_URL;
  const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=phone:${phone}`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  const searchResult = await searchResponse.json();

  if (searchResult.customers.length > 0) {
    return searchResult.customers[0];
  }

  throw new Error('Server error. Unable to locate existing customer.');
}

async function checkForRecentReplacementOrders(customer) {
  const baseUrl = process.env.SHOPIFY_URL;
  const oneDayAgo = new Date(Date.now() - 24*60*60*1000).toISOString();
  const ordersUrl = `${baseUrl}/orders.json?status=any&created_at_min=${oneDayAgo}&tag=Instant Replacement`;

  const options = {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(ordersUrl, options);
  const responseData = await response.json();

  const customerOrders = responseData.orders.filter(order => order.customer && order.customer.id === customer.id);

  if (customerOrders.length > 0) {
    throw new Error('Customer has already placed a replacement order in the last 24 hours.');
  }
}

function extractOrderData(body, customer) {
  const { firstName, lastName, phone, address1, address2, city, state, zipcode, variantId } = body;

  return {
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
}

async function createOrder(orderData) {
  const baseUrl = process.env.SHOPIFY_URL;
  const orderUrl = `${baseUrl}/orders.json`;

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
    throw new Error('Error creating order.');
  }

  return orderResponseData;
}
