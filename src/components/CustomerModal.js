export function CustomerModal(customers) {
  return `
    <dialog class="modal" id="customerModal">
      <div class="modal-card">
        <header class="modal-header">
          <h2>Seleccionar cliente</h2>
          <button class="icon-btn" data-close-modal="customerModal">×</button>
        </header>

        <div class="modal-body">
          <input class="input" id="customerSearch" placeholder="Buscar por nombre o RFC">
          <div class="customer-list" id="customerList">
            ${customers.map((customer) => `
              <button class="customer-row" data-customer-id="${customer.id}">
                <strong>${customer.name}</strong>
                <span>${customer.rfc}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </dialog>
  `;
}
