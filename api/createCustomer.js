export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed.' });
    }
  
    const { firstName, lastName, phone, email, address1, address2, city, state, zipcode } = req.body;
  
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
    
      return res.status(200).json({ message: 'Customer created successfully.', customer: responseData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
    }
  }