import { db } from '../db/localDb.js';

export async function getProducts({ search = '', onlyBestSellers = false } = {}) {
  const value = search.trim().toLowerCase();
  const products = await db.products.toArray();

  return products
    .filter((product) => Number(product.status) === 1)
    .filter((product) => {
      const matchSearch = !value
        || product.name.toLowerCase().includes(value)
        || product.barcode.toLowerCase().includes(value);

      const matchBestSeller = !onlyBestSellers || Number(product.soldCount || 0) > 0;

      return matchSearch && matchBestSeller;
    })
    .sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0));
}
