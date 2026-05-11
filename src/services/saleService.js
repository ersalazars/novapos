import { db } from '../db/localDb.js';
import { getPriceRangeByQty, getUnitPriceByQty } from '../utils/pricing.js';

export async function createSale({ profile, customer, cart, payment, totals }) {
  const now = new Date();
  const folio = `V-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-5)}`;

  const sale = {
    folio,
    createdAt: now.toISOString(),
    profileId: profile.id,
    profileName: profile.name,
    warehouseId: profile.id_almacen || 1,
    customerId: customer.id,
    customerName: customer.name,
    items: cart.map((item) => {
      const unitPrice = getUnitPriceByQty(item.product, item.qty);
      const priceRange = getPriceRangeByQty(item.product, item.qty);

      return {
        productId: item.product.id,
        barcode: item.product.barcode,
        name: item.product.name,
        price: unitPrice,
        qty: item.qty,
        priceRange: priceRange ? `${priceRange.min}-${priceRange.max}` : '',
        total: unitPrice * item.qty,
      };
    }),
    subtotal: totals.subtotal,
    iva: totals.iva,
    total: totals.total,
    paymentMethod: payment.method,
    cashReceived: payment.cashReceived || 0,
    change: payment.change || 0,
    cardOperationNumber: payment.cardOperationNumber || '',
  };

  await db.sales.add(sale);
  return sale;
}

export async function getSales() {
  return db.sales.orderBy('createdAt').reverse().toArray();
}
