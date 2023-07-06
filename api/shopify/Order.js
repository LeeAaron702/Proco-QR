import { getOrCreateCustomer } from '../utils/customer.js';
import { createOrder } from '../utils/order.js';
import { getProduct } from '../utils/product.js';
import { checkForPreviousOrders } from '../utils/order-checker.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { customer, shopifyID, variantId } = req.body;
  console.log("🚀 ~ file: Order.js:12 ~ handler ~ customer:", customer)

  try {
    let shopifyCustomer;

    // Try to get or create a new customer.
    shopifyCustomer = await getOrCreateCustomer(customer);

    // // Check for previous orders.
    // const hasPreviousOrders = await checkForPreviousOrders(shopifyCustomer.id);

    // // If a previous order is found, throw an error.
    // if (hasPreviousOrders) {
    //   return res.status(400).json({ message: 'An immediate replacement order has already been placed in the last 24 hours.' });
    // }

    // // Prepare line items for the order
    // const product = await getProduct(shopifyID);
    // const preparedItems = [{
    //   variant_id: variantId || product.variants[0].id,
    //   quantity: 1,
    // }];

    // // If no previous orders, create a new order.
    // const newOrder = await createOrder(shopifyCustomer.id, preparedItems);

    // // If order creation is successful, return a success response.
    // return res.status(200).json({ message: 'Order created successfully.', order: newOrder });

  } catch (error) {
    // If an error occurred, return an error response.
    return res.status(500).json({ message: error.message });
  }
}
