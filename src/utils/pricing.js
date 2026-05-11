export function getPriceRangeByQty(product, qty) {
  const quantity = Number(qty || 0);
  const ranges = [...(product?.priceRanges || [])].sort((a, b) => {
    if (Number(a.min) !== Number(b.min)) return Number(a.min) - Number(b.min);
    return Number(a.max) - Number(b.max);
  });

  if (quantity <= 0 || ranges.length === 0) return null;

  const exactRange = ranges.find((range) => {
    return quantity >= Number(range.min) && quantity <= Number(range.max);
  });

  if (exactRange) return exactRange;

  // Si la cantidad supera el último rango, se conserva el último precio.
  // Esto evita bloquear una venta mayor, pero en backend conviene validarlo.
  return ranges[ranges.length - 1];
}

export function getUnitPriceByQty(product, qty) {
  const range = getPriceRangeByQty(product, qty);
  return Number(range?.price || 0);
}

export function getFirstPrice(product) {
  const ranges = [...(product?.priceRanges || [])].sort((a, b) => Number(a.min) - Number(b.min));
  return Number(ranges[0]?.price || 0);
}

export function formatRanges(product) {
  const ranges = [...(product?.priceRanges || [])].sort((a, b) => Number(a.min) - Number(b.min));

  return ranges.map((range) => {
    return `${range.min}-${range.max}`;
  }).join(' · ');
}

export function getStockByWarehouse(product, warehouseId = 1) {
  const row = (product?.warehouses || []).find((warehouse) => {
    return Number(warehouse.warehouseId) === Number(warehouseId);
  });

  return Number(row?.stock || 0);
}
