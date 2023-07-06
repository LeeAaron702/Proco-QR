import { createCustomer } from './createCustomer.js';
import { getCustomer } from './getCustomer.js';

export async function getOrCreateCustomer({ email, firstName, lastName, phone, address }) {
  let customer = await getCustomer(email);
  if (!customer) {
    customer = await createCustomer(email, firstName, lastName, phone, address);
  }
  return customer;
}
