import fetch from 'node-fetch';
export async function createCustomer(email, firstName, lastName, phone, address) {
  const SHOPIFY_BASE_URL = process.env.SHOPIFY_URL
    const response = await fetch(`${SHOPIFY_BASE_URL}/customers.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
      },
      body: JSON.stringify({
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          addresses: [{
            address1: address.address1,
            address2: address.address2 || null,
            city: address.city,
            province: address.province,
            country: address.country,
            zip: address.zip
          }]
        },
      }),
    });
  
    const data = await response.json();
    return data.customer;
  }
  