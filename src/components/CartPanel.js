import { state, getTotals } from '../store/posStore.js';
import { money } from '../utils/format.js';
import { getPriceRangeByQty, getUnitPriceByQty } from '../utils/pricing.js';

export function CartPanel() {
  const totals = getTotals();

  return `
    <aside class="cart-panel">
      <div class="cart-header">
        <div>
          <span class="muted">Cliente</span>
          <h2>${state.customer.name}</h2>
        </div>
        <button class="btn btn-light btn-sm" id="btnChangeCustomer">Cambiar</button>
      </div>

      <div class="cart-items">
        ${state.cart.length === 0 ? `
          <div class="empty-state">
            Agrega productos al carrito.
          </div>
        ` : state.cart.map((item) => {
          const unitPrice = getUnitPriceByQty(item.product, item.qty);
          const range = getPriceRangeByQty(item.product, item.qty);

          return `
            <div class="cart-item">
              <div>
                <strong>${item.product.name}</strong>
                <span>${money(unitPrice)} c/u · rango ${range ? `${range.min}-${range.max}` : 'sin rango'}</span>
              </div>

              <div class="qty-controls">
                <button data-dec="${item.product.id}">−</button>
                <input type="number" min="1" value="${item.qty}" data-qty="${item.product.id}">
                <button data-inc="${item.product.id}">+</button>
                
              <button class="icon-btn danger" data-remove="${item.product.id}">×</button>
              </div>
              <b>${money(unitPrice * item.qty)}</b>
            </div>
          `;
        }).join('')}
      </div>

      <div class="totals">
        <div><span>Productos</span><strong>${totals.items}</strong></div>
        <div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
        <div class="grand-total"><span>Total</span><strong>${money(totals.total)}</strong></div>
      </div>

      <div class="cart-actions">
        <button class="btn btn-light" id="btnClearCart">Limpiar</button>
        <button class="btn btn-primary" id="btnOpenPayment" ${state.cart.length === 0 ? 'disabled' : ''}>
          Cobrar ${money(totals.total)}
        </button>
      </div>
    </aside>
  `;
}
