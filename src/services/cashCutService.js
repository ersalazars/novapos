import { db } from '../db/localDb.js';

const normalizePaymentMethod = (method = '') => {

  const value = String(method)
    .trim()
    .toUpperCase();

  if (
    value === 'EFECTIVO'
  ) {
    return 'EFECTIVO';
  }

  if (
    value === 'TARJETA' ||
    value === 'CARD'
  ) {
    return 'TARJETA';
  }

  if (
    value === 'VALE' ||
    value === 'VALES'
  ) {
    return 'VALE';
  }

  return value;
};

export async function createCashCut() {
  const sales = await db.sales.toArray();

  if (!sales.length) {
    return {
      ok: false,
      msg: 'No hay ventas para hacer corte.'
    };
  }

  const now = new Date();

  const summary = {
    EFECTIVO: {
      count: 0,
      subtotal: 0,
      total: 0
    },
    TARJETA: {
      count: 0,
      subtotal: 0,
      total: 0
    },
    VALE: {
      count: 0,
      subtotal: 0,
      total: 0
    }
  };

  sales.forEach((sale) => {
    const method = normalizePaymentMethod(sale.paymentMethod);

    if (!summary[method]) {
      summary[method] = {
        count: 0,
        subtotal: 0,
        total: 0
      };
    }

    summary[method].count += 1;
    summary[method].subtotal += Number(sale.subtotal || 0);
    summary[method].total += Number(sale.total || 0);
  });

  const total = sales.reduce((acc, sale) => {
    return acc + Number(sale.total || 0);
  }, 0);

  const subtotal = sales.reduce((acc, sale) => {
    return acc + Number(sale.subtotal || 0);
  }, 0);

  const cashCut = {
    folio: `C-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-5)}`,
    createdAt: now.toISOString(),
    salesCount: sales.length,
    subtotal,
    total,
    summary
  };

  await db.cashCuts.add(cashCut);

  return {
    ok: true,
    cashCut
  };
}

export async function getCashCuts() {
  return db.cashCuts.orderBy('createdAt').reverse().toArray();
}