import { money } from '../utils/format.js';
import { formatRanges, getFirstPrice, getStockByWarehouse } from '../utils/pricing.js';

export function ProductGrid(products, warehouseId = 1) {

  if (!products.length) {
    return `<div class="empty-state">No se encontraron productos.</div>`;
  }

  return `
    <div class="product-grid">
      ${products.map((product) => {

        const stock = getStockByWarehouse(product, warehouseId);

        let stockClass = 'stock-bajo';

        if (stock > 100) {
          stockClass = 'stock-alto';
        } else if (stock > 30) {
          stockClass = 'stock-medio';
        }

        return `
          <button class="product-card" data-add-product="${product.id}">
            
            <div class="color_stock">
              <span class="product-category">
                Stock: ${stock}
              </span>

              <div class="color_producto ${stockClass}"></div>
            </div>

            <strong>${product.name}</strong>

            <small>${product.barcode}</small>

            <small>
              Rangos: ${formatRanges(product) || 'Sin precio'}
            </small>

            <small>
              Vendido: ${Number(product.soldCount || 0)}
            </small>

            <b>
              Desde ${money(getFirstPrice(product))}
            </b>

          </button>
        `;
      }).join('')}
    </div>
  `;
}