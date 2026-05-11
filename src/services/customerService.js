import { db } from '../db/localDb.js';

export async function getCustomers(search = '') {
  const value = search.trim().toLowerCase();

  const customers = await db.customers.toArray();

  if (!value) return customers;

  return customers.filter((customer) => {
    return customer.name.toLowerCase().includes(value)
      || customer.rfc.toLowerCase().includes(value);
  });
}
