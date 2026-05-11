import { AppShell } from '../components/AppShell.js';
import { ProductGrid } from '../components/ProductGrid.js'; //Vista de como se ve cada producto
import { CartPanel } from '../components/CartPanel.js'; //Vista del carrito
import { CustomerModal } from '../components/CustomerModal.js';
import { PaymentModal } from '../components/PaymentModal.js'; // Modal de pago
import { getProducts } from '../services/productService.js';
import { getCustomers } from '../services/customerService.js';
import { createSale } from '../services/saleService.js';
import {
  state,
  addToCart,
  clearCart,
  getTotals,
  removeFromCart,
  resetCustomer,
  setCustomer,
  setSearch,
  updateCartQty,
} from '../store/posStore.js';
import { money } from '../utils/format.js';
import { showToast } from '../utils/toast.js';

let productsCache = [];
let customersCache = [];

export function PosView() {
  return {
    html: AppShell(`
      <section class="pos-layout">
        <div class="sales-area">
          <div class="sales-toolbar">
            <div>
              <h1>Nueva venta</h1>
              <p class="muted">
                Cliente actual: <strong>${state.customer.name}</strong>
                · Almacén: <strong>${state.activeProfile?.id_almacen || 1}</strong>
              </p>
            </div>

            <button class="btn btn-light" id="btnResetCustomer">Cliente mostrador</button>
          </div>

          <div class="search-row">
            <input class="input input-lg" id="productSearch" value="${state.search}" placeholder="Buscar artículo por descripción o código...">
          </div>

          <div class="section-label" id="productsTitle">
            ${state.search.trim() ? 'Resultados de búsqueda' : 'Más vendidos'}
          </div>

          <section id="productGridContainer">
            <div class="loader">Cargando artículos...</div>
          </section>
        </div>

        ${CartPanel()}
      </section>

      ${CustomerModal([])}
      ${PaymentModal()}
    `),
    afterRender() {
      wirePosView();
    }
  };
}

async function wirePosView() {
  await renderProducts();
  await loadCustomers();

  document.querySelector('#productSearch').addEventListener('input', async (event) => {
    setSearch(event.target.value);
    document.querySelector('#productsTitle').textContent = state.search.trim()
      ? 'Resultados de búsqueda'
      : 'Más vendidos';
    await renderProducts();
  });

  document.querySelector('#productGridContainer').addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;

    const product = productsCache.find((item) => item.id === Number(button.dataset.addProduct));
    addToCart(product, 1);
  });

  document.querySelector('.cart-panel').addEventListener('click', async (event) => {
    const dec = event.target.closest('[data-dec]');
    const inc = event.target.closest('[data-inc]');
    const remove = event.target.closest('[data-remove]');

    if (dec) {
      const item = state.cart.find((cartItem) => cartItem.product.id === Number(dec.dataset.dec));
      updateCartQty(dec.dataset.dec, item.qty - 1);
    }

    if (inc) {
      const item = state.cart.find((cartItem) => cartItem.product.id === Number(inc.dataset.inc));
      updateCartQty(inc.dataset.inc, item.qty + 1);
    }

    if (remove) {
      removeFromCart(remove.dataset.remove);
    }
  });

  document.querySelector('.cart-panel').addEventListener('change', (event) => {
    const input = event.target.closest('[data-qty]');
    if (!input) return;
    updateCartQty(input.dataset.qty, input.value);
  });

  document.querySelector('#btnClearCart').addEventListener('click', () => {
    if (state.cart.length === 0) return;
    if (confirm('¿Limpiar carrito?')) clearCart();
  });

  document.querySelector('#btnOpenPayment').addEventListener('click', () => {
    document.querySelector('#paymentModal').showModal();
  });

  document.querySelector('#btnChangeCustomer').addEventListener('click', () => {
    document.querySelector('#customerModal').showModal();
  });

  // document.querySelector('#btnResetCustomer').addEventListener('click', resetCustomer);
  document.querySelector('#btnResetCustomer').addEventListener('click', () => {
    document.querySelector('#customerModal').showModal();
  });

  document.body.addEventListener('click', closeModalHandler);
  document.querySelector('#customerSearch').addEventListener('input', renderCustomerList);

  document.querySelector('#customerList').addEventListener('click', (event) => {
    const row = event.target.closest('[data-customer-id]');
    if (!row) return;

    const customer = customersCache.find((item) => item.id === Number(row.dataset.customerId));
    setCustomer(customer);
    document.querySelector('#customerModal').close();
  });

  wirePayment();
}

async function renderProducts() {
  productsCache = await getProducts({
    search: state.search,
    onlyBestSellers: !state.search.trim(),
  });

  document.querySelector('#productGridContainer').innerHTML = ProductGrid(
    productsCache,
    state.activeProfile?.id_almacen || 1
  );
}

async function loadCustomers() {
  customersCache = await getCustomers();
  renderCustomerList();
}

async function renderCustomerList() {
  const search = document.querySelector('#customerSearch')?.value || '';
  customersCache = await getCustomers(search);

  document.querySelector('#customerList').innerHTML = customersCache.map((customer) => `
    <button class="customer-row" data-customer-id="${customer.id}">
      <strong>${customer.name}</strong>
      <span>${customer.rfc}</span>
    </button>
  `).join('');
}

function closeModalHandler(event) {
  const closeButton = event.target.closest('[data-close-modal]');
  if (!closeButton) return;

  const modal = document.querySelector(`#${closeButton.dataset.closeModal}`);
  modal?.close();
}

function wirePayment() {
  const form = document.querySelector('#paymentForm');
  const cashFields = document.querySelector('#cashFields');
  const cardFields = document.querySelector('#cardFields');
  const cashReceived = document.querySelector('#cashReceived');
  const cashChange = document.querySelector('#cashChange');
  const cardOperationNumber = document.querySelector('#cardOperationNumber');

  form.addEventListener('change', (event) => {
    if (event.target.name !== 'paymentMethod') return;

    const method = form.paymentMethod.value;
    cashFields.classList.toggle('hidden', method !== 'efectivo');
    cardFields.classList.toggle('hidden', method !== 'tarjeta');
  });

  cashReceived.addEventListener('input', () => {
    const total = getTotals().total;
    const received = Number(cashReceived.value || 0);
    const change = Math.max(received - total, 0);
    cashChange.textContent = money(change);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const totals = getTotals();
    const method = form.paymentMethod.value;

    if (state.cart.length === 0) {
      // alert('No puedes cobrar una venta sin artículos.');
      showToast({
        type: 'warning',
        title: 'Venta vacía',
        message: 'Agrega al menos un artículo antes de cobrar.'
      });
      return;
    }

    const payment = {
      method,
      cashReceived: 0,
      change: 0,
      cardOperationNumber: '',
    };

    if (method === 'efectivo') {
      payment.cashReceived = Number(cashReceived.value || 0);

      if (payment.cashReceived < totals.total) {
        // alert('El efectivo recibido no cubre el total.');
        showToast({
          type: 'error',
          title: 'Pago insuficiente',
          message: 'El efectivo recibido no cubre el total de la venta.',
          container: paymentModal
        });
        return;
      }

      payment.change = payment.cashReceived - totals.total;
    }

    if (method === 'tarjeta') {
      payment.cardOperationNumber = cardOperationNumber.value.trim();

      if (!payment.cardOperationNumber) {
        // alert('Captura el número de operación de la terminal.');
        showToast({
          type: 'warning',
          title: 'Falta operación',
          message: 'Captura el número de operación de la terminal.'
        });
        return;
      }
    }

    const sale = await createSale({
      profile: state.activeProfile,
      customer: state.customer,
      cart: state.cart,
      payment,
      totals,
    });

    clearCart();
    form.reset();
    document.querySelector('#paymentModal').close();

    // alert(`Venta finalizada: ${sale.folio}`);
    showToast({
      type: 'success',
      title: 'Venta finalizada',
      message: `Folio generado: ${sale.folio}`
    });

  });
}
