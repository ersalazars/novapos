import { db } from '../db/localDb.js';
import { categorias } from '../data/categorias.js';

export async function getCategories() {
  return categorias;
}

export async function getProducts({ search = '', categoryId = null, onlyBestSellers = false } = {}) {
  const value = search.trim().toLowerCase();
  const products = await db.products.toArray();

  return products
    .filter((product) => Number(product.status) === 1)
    .filter((product) => {
      const matchSearch = !value
        || product.name.toLowerCase().includes(value)
        || product.barcode.toLowerCase().includes(value);

      const matchCategory = categoryId === null
        || Number(product.categoryId) === Number(categoryId);

      const matchBestSeller = !onlyBestSellers
        || Number(product.soldCount || 0) > 0;

      return matchSearch && matchCategory && matchBestSeller;
    })
    .sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0));
}