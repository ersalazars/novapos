import { money, dateTime } from '../utils/format.js';

export function showCashCutModal(cashCut) {
  const existing = document.getElementById('cashCutOverlay');

  if (existing) {
    existing.remove();
  }

  const methods = ['EFECTIVO', 'TARJETA', 'VALE'];

  const rows = methods.map((method) => {
    const item = cashCut.summary[method] || {
      count: 0,
      subtotal: 0,
      total: 0
    };

    return `
      <tr>
        <td>${method}</td>
        <td>${item.count}</td>
        <td>${money(item.subtotal)}</td>
        <td>${money(item.total)}</td>
      </tr>
    `;
  }).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="ticket-overlay" id="cashCutOverlay">
      <div class="ticket-modal">
        <div class="ticket-header">
          <h2>Corte de caja</h2>
          <p>Resumen generado correctamente</p>
        </div>

        <div class="ticket-info">
          <div><strong>Folio:</strong> ${cashCut.folio}</div>
          <div><strong>Fecha:</strong> ${dateTime(cashCut.createdAt)}</div>
          <div><strong>Ventas:</strong> ${cashCut.salesCount}</div>
        </div>

        <table class="ticket-table">
          <thead>
            <tr>
              <th>Pago</th>
              <th>Ventas</th>
              <th>Subtotal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="ticket-total">
          <div>
            <span>Subtotal general</span>
            <strong>${money(cashCut.subtotal)}</strong>
          </div>

          <div class="grand-total">
            <span>Total general</span>
            <strong>${money(cashCut.total)}</strong>
          </div>
        </div>

        <div class="ticket-actions">
          <button id="btnCloseCashCut" class="ticket-btn primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `);

  document
    .getElementById('btnCloseCashCut')
    ?.addEventListener('click', () => {
      document.getElementById('cashCutOverlay')?.remove();
    });
}