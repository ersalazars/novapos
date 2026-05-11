import { getUnitPriceByQty } from '../utils/pricing.js';

const defaultCustomer = {
  id: 1,
  name: 'MOSTRADOR',
  rfc: 'XAXX010101000',
};

export const state = {
  activeProfile: null,
  customer: defaultCustomer,
  cart: [],
  search: '',
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify() {
  listeners.forEach((listener) => listener());
}

export function setActiveProfile(profile) {
  state.activeProfile = profile;
  notify();
}

export function setCustomer(customer) {
  state.customer = customer || defaultCustomer;
  notify();
}

export function resetCustomer() {
  state.customer = defaultCustomer;
  notify();
}

export function setSearch(value) {
  state.search = value;
  notify();
}

export function addToCart(product, qty = 1) {
  const quantity = Number(qty);

  if (!product || quantity <= 0) return;

  const current = state.cart.find((item) => item.product.id === product.id);

  if (current) {
    current.qty += quantity;
    current.unitPrice = getUnitPriceByQty(current.product, current.qty);
  } else {
    state.cart.push({
      product,
      qty: quantity,
      unitPrice: getUnitPriceByQty(product, quantity),
    });
  }

  notify();
}

export function updateCartQty(productId, qty) {
  const quantity = Number(qty);

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = state.cart.find((cartItem) => cartItem.product.id === Number(productId));
  if (!item) return;

  item.qty = quantity;
  item.unitPrice = getUnitPriceByQty(item.product, quantity);
  notify();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.product.id !== Number(productId));
  notify();
}

export function clearCart() {
  state.cart = [];
  notify();
}

export function getTotals() {
  const subtotal = state.cart.reduce((acc, item) => {
    const unitPrice = getUnitPriceByQty(item.product, item.qty);
    return acc + unitPrice * item.qty;
  }, 0);

  // const iva = subtotal * 0.16;
  const iva = 0
  const total = subtotal + iva;

  return {
    subtotal,
    iva,
    total,
    items: state.cart.reduce((acc, item) => acc + item.qty, 0),
  };
}
