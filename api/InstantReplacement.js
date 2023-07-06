// export default async function handler(req, res) {

//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed.' });
//   }

//   const { firstName, lastName, phone, email, address1, address2, city, state, zipcode, shopifyID, variantId } = req.body;
  

//   const baseUrl = process.env.SHOPIFY_URL;
  
//   const customerUrl = `${baseUrl}/customers.json`;
//   const data = {
//     customer: {
//       first_name: firstName,
//       last_name: lastName,
//       phone,
//       email,
//       addresses: [
//         {
//           address1,
//           address2,
//           city,
//           province: state,
//           zip: zipcode,
//           country: "US"
//         },
//       ],
//       "accepts_marketing": true, 
//     },
//   };

//   const options = {
//     method: 'POST',
//     headers: {
//       'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data)
//   };

//   let customer;

//   try {
//     const response = await fetch(customerUrl, options);
//     const responseData = await response.json();

//     if (!response.ok) {
//       if (responseData.errors && responseData.errors.email && responseData.errors.email.includes("has already been taken")) {
//         // If the email is already in use, search for the existing customer
//         const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=email:${email}`, {
//           method: 'GET',
//           headers: {
//             'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//             'Content-Type': 'application/json',
//           },
//         });
//         const searchResult = await searchResponse.json();
//         if (searchResult.customers.length > 0) {
//           customer = searchResult.customers[0];
//         } else {
//           return res.status(500).json({ message: 'Server error. Unable to locate existing customer.' });
//         }
//       } else if (responseData.errors && responseData.errors.phone && responseData.errors.phone.includes("Phone has already been taken")) {
//         // If the phone number is already in use, search for the existing customer
//         const searchResponse = await fetch(`${baseUrl}/customers/search.json?query=phone:${phone}`, {
//           method: 'GET',
//           headers: {
//             'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//             'Content-Type': 'application/json',
//           },
//         });
//         const searchResult = await searchResponse.json();
//         if (searchResult.customers.length > 0) {
//           customer = searchResult.customers[0];
//         } else {
//           return res.status(500).json({ message: 'Server error. Unable to locate existing customer.' });
//         }
//       } else {
//         handleErrors(response, responseData);
//       }
//     } else {
//       customer = responseData.customer;
//     }

//     const orderUrl = `${baseUrl}/orders.json`;
//     const orderData = {
//       order: {
//         customer: {
//           id: customer.id
//         },
//         shipping_address: {
//           first_name: firstName,
//           last_name: lastName,
//           address1,
//           address2,
//           city,
//           province: state,
//           zip: zipcode,
//           country: "US",
//           phone
//         },
//         line_items: [
//           {
//             variant_id: variantId,
//             quantity: 1,
//             price: "0.00"
//           }
//         ],
//         "tags": 'Instant Replacement' 
//       }
//     };
    
    
//     const orderOptions = {
//       method: 'POST',
//       headers: {
//         'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData)
//     };

//     const orderResponse = await fetch(orderUrl, orderOptions);
//     const orderResponseData = await orderResponse.json();

//     if (!orderResponse.ok) {
//       return res.status(orderResponse.status).json({ message: 'Error creating order.', error: orderResponseData });
//     }

//     return res.status(200).json({ message: 'Customer and order created successfully.', customer, order: orderResponseData });
//   }catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// }

// function handleErrors(response, responseData) {
//   if (responseData.errors && responseData.errors.email && responseData.errors.email.length > 0) {
//     const errorMessage = responseData.errors.email[0];
//     return res.status(response.status).json({ message: 'Error creating customer.', error: errorMessage });
//   }

//   if (responseData.errors && responseData.errors.phone && responseData.errors.phone.length > 0) {
//     const errorMessage = responseData.errors.phone[0];
//     return res.status(response.status).json({ message: 'Error creating customer.', error: errorMessage });
//   }

//   // Handle other error cases
//   const errorResponse = responseData.error || { message: 'Unknown error from Shopify API.' };
//   return res.status(response.status).json({ message: 'Error creating customer.', error: errorResponse });
// }




export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    const customerData = extractCustomerData(req.body);
    console.log("🚀 ~ file: InstantReplacement.js:164 ~ handler ~ customerData:", customerData)
    const customer = await createOrUpdateCustomer(customerData);
    console.log("🚀 ~ file: InstantReplacement.js:166 ~ handler ~ customer:", customer)
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
