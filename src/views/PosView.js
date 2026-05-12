import { AppShell } from "../components/AppShell.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { CategoryGrid } from "../components/CategoryGrid.js";
import { CartPanel } from "../components/CartPanel.js";
import { CustomerModal } from "../components/CustomerModal.js";
import { PaymentModal } from "../components/PaymentModal.js";

import { getProducts, getCategories } from "../services/productService.js";
import { getCustomers } from "../services/customerService.js";
import { createSale } from "../services/saleService.js";
import { showSaleTicket } from '../components/saleTicket.js';

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
} from "../store/posStore.js";

import { money } from "../utils/format.js";
import { showToast } from "../utils/toast.js";

let productsCache = [];
let customersCache = [];
let selectedCategory = null;

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

            <button class="btn btn-light" id="btnResetCustomer">
              Cliente mostrador
            </button>
          </div>

          <div class="search-row">
            <input 
              class="input input-lg" 
              id="productSearch" 
              value="${state.search}" 
              placeholder="Buscar artículo por descripción o código..."
            >
            <div class="upload-container">
              <input type="file" id="inputFotos" name="fotos" accept="image/*" capture="camera" multiple hidden>
              <label for="inputFotos" class="btn-camera">
                <i class="fas fa-camera"></i>
              </label>
            </div>
          </div>

          <div class="section-label" id="productsTitle">
            Categorías
          </div>

          <section id="productGridContainer">
            <div class="loader">Cargando menú...</div>
          </section>
        </div>

        ${CartPanel()}
      </section>

      ${CustomerModal([])}
      ${PaymentModal()}
    `),

    afterRender() {
      wirePosView();
    },
  };
}

async function wirePosView() {
  await renderMainMenu();
  await loadCustomers();

  document
    .querySelector("#productSearch")
    .addEventListener("input", async (event) => {
      setSearch(event.target.value);

      if (state.search.trim()) {
        selectedCategory = null;
        await renderSearchResults();
        return;
      }

      await renderMainMenu();
    });

  document
    .querySelector("#productGridContainer")
    .addEventListener("click", async (event) => {
      const categoryButton = event.target.closest("[data-category-id]");
      const productButton = event.target.closest("[data-add-product]");

      if (categoryButton) {
        selectedCategory = Number(categoryButton.dataset.categoryId);
        setSearch("");
        document.querySelector("#productSearch").value = "";
        await renderProductsByCategory();
        return;
      }

      if (productButton) {
        const product = productsCache.find((item) => {
          return item.id === Number(productButton.dataset.addProduct);
        });

        addToCart(product, 1);
      }
    });

  document
    .querySelector("#productsTitle")
    .addEventListener("click", async (event) => {
      const backButton = event.target.closest("#btnBackCategories");

      if (!backButton) return;

      selectedCategory = null;
      setSearch("");
      document.querySelector("#productSearch").value = "";
      await renderMainMenu();
    });

  document
    .querySelector(".cart-panel")
    .addEventListener("click", async (event) => {
      const dec = event.target.closest("[data-dec]");
      const inc = event.target.closest("[data-inc]");
      const remove = event.target.closest("[data-remove]");

      if (dec) {
        const item = state.cart.find((cartItem) => {
          return cartItem.product.id === Number(dec.dataset.dec);
        });

        if (!item) return;

        updateCartQty(dec.dataset.dec, item.qty - 1);
      }

      if (inc) {
        const item = state.cart.find((cartItem) => {
          return cartItem.product.id === Number(inc.dataset.inc);
        });

        if (!item) return;

        updateCartQty(inc.dataset.inc, item.qty + 1);
      }

      if (remove) {
        removeFromCart(remove.dataset.remove);
      }
    });

  document.querySelector(".cart-panel").addEventListener("change", (event) => {
    const input = event.target.closest("[data-qty]");

    if (!input) return;

    updateCartQty(input.dataset.qty, input.value);
  });

  document.querySelector("#btnClearCart").addEventListener("click", () => {
    if (state.cart.length === 0) return;

    if (confirm("¿Limpiar carrito?")) {
      clearCart();
    }
  });

  document.querySelector("#btnOpenPayment").addEventListener("click", () => {
    document.querySelector("#paymentModal").showModal();
  });

  document.querySelector("#btnChangeCustomer").addEventListener("click", () => {
    document.querySelector("#customerModal").showModal();
  });

  document.querySelector("#btnResetCustomer").addEventListener("click", () => {
    document.querySelector("#customerModal").showModal();
  });

  document.body.addEventListener("click", closeModalHandler);

  document
    .querySelector("#customerSearch")
    .addEventListener("input", renderCustomerList);

  document.querySelector("#customerList").addEventListener("click", (event) => {
    const row = event.target.closest("[data-customer-id]");

    if (!row) return;

    const customer = customersCache.find((item) => {
      return item.id === Number(row.dataset.customerId);
    });

    setCustomer(customer);
    document.querySelector("#customerModal").close();
  });

  wirePayment();
}

async function renderMainMenu() {
  selectedCategory = null;

  const categories = await getCategories();

  document.querySelector("#productsTitle").textContent = "Categorías";

  document.querySelector("#productGridContainer").innerHTML =
    CategoryGrid(categories);
}

async function renderProductsByCategory() {
  productsCache = await getProducts({
    search: "",
    categoryId: selectedCategory,
    onlyBestSellers: false,
  });

  document.querySelector("#productsTitle").innerHTML = `
    <div class="products-header-inline">

      <button class="back-category-btn" id="btnBackCategories">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div>
        <strong>Productos</strong>
        <small>Selecciona artículos</small>
      </div>

    </div>
  `;

  document.querySelector("#productGridContainer").innerHTML = ProductGrid(
    productsCache,
    state.activeProfile?.id_almacen || 1,
  );
}

async function renderSearchResults() {
  productsCache = await getProducts({
    search: state.search,
    categoryId: null,
    onlyBestSellers: false,
  });

  // document.querySelector('#productsTitle').innerHTML = `
  //   <button class="back-category-btn" id="btnBackCategories">
  //     ← Categorías
  //   </button>
  //   <span>Resultados de búsqueda</span>
  // `;
  document.querySelector("#productsTitle").innerHTML = `
    <div class="products-header-inline">

      <button class="back-category-btn" id="btnBackCategories">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div>
        <strong>Resultados</strong>
        <small>${productsCache.length} artículos encontrados</small>
      </div>

    </div>
  `;

  document.querySelector("#productGridContainer").innerHTML = ProductGrid(
    productsCache,
    state.activeProfile?.id_almacen || 1,
  );
}

async function loadCustomers() {
  customersCache = await getCustomers();
  renderCustomerList();
}

async function renderCustomerList() {
  const search = document.querySelector("#customerSearch")?.value || "";

  customersCache = await getCustomers(search);

  document.querySelector("#customerList").innerHTML = customersCache
    .map(
      (customer) => `
    <button class="customer-row" data-customer-id="${customer.id}">
      <strong>${customer.name}</strong>
      <span>${customer.rfc}</span>
    </button>
  `,
    )
    .join("");
}

function closeModalHandler(event) {
  const closeButton = event.target.closest("[data-close-modal]");

  if (!closeButton) return;

  const modal = document.querySelector(`#${closeButton.dataset.closeModal}`);

  modal?.close();
}

function wirePayment() {
  const form = document.querySelector("#paymentForm");
  const cashFields = document.querySelector("#cashFields");
  const cardFields = document.querySelector("#cardFields");
  const cashReceived = document.querySelector("#cashReceived");
  const cashChange = document.querySelector("#cashChange");
  const cardOperationNumber = document.querySelector("#cardOperationNumber");
  const CodeOperationVale = document.querySelector("#CodeOperationVale");
  const paymentModal = document.querySelector("#paymentModal");

  form.addEventListener("change", (event) => {
    if (event.target.name !== "paymentMethod") return;

    const method = form.paymentMethod.value;

    cashFields.classList.toggle("hidden", method !== "efectivo");
    cardFields.classList.toggle("hidden", method !== "tarjeta");
    valFields.classList.toggle("hidden", method !== "vales");
  });

  cashReceived.addEventListener("input", () => {
    const total = getTotals().total;
    const received = Number(cashReceived.value || 0);
    const change = Math.max(received - total, 0);

    cashChange.textContent = money(change);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const totals = getTotals();
    const method = form.paymentMethod.value;

    if (state.cart.length === 0) {
      showToast({
        type: "warning",
        title: "Venta vacía",
        message: "Agrega al menos un artículo antes de cobrar.",
        container: paymentModal,
      });

      return;
    }

    const payment = {
      method,
      cashReceived: 0,
      change: 0,
      cardOperationNumber: "",
    };

    if (method === "efectivo") {
      payment.cashReceived = Number(cashReceived.value || 0);

      if (payment.cashReceived < totals.total) {
        showToast({
          type: "error",
          title: "Pago insuficiente",
          message: "El efectivo recibido no cubre el total de la venta.",
          container: paymentModal,
        });

        return;
      }

      payment.change = payment.cashReceived - totals.total;
    }

    if (method === "tarjeta") {
      payment.cardOperationNumber = cardOperationNumber.value.trim();

      if (!payment.cardOperationNumber) {
        showToast({
          type: "warning",
          title: "Falta operación",
          message: "Captura el número de operación de la terminal.",
          container: paymentModal,
        });

        return;
      }
    }

    if (method === "vales") {
      payment.CodeOperationVale = CodeOperationVale.value.trim();

      if (!payment.CodeOperationVale) {
        showToast({
          type: "warning",
          title: "Falta codigo",
          message: "Ingresa el codigo del vale.",
          container: paymentModal,
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

    showSaleTicket(sale);

    clearCart();
    form.reset();
    document.querySelector("#paymentModal").close();

    showToast({
      type: "success",
      title: "Venta finalizada",
      message: `Folio generado: ${sale.folio}`,
    });
  });
}

// CAMARA
