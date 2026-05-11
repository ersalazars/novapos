import { AppShell } from '../components/AppShell.js';
import { getSales } from '../services/saleService.js';
import { dateTime, money } from '../utils/format.js';

export function HistoryView() {
  return {
    html: AppShell(`
      <section class="history-page">
        <div class="page-header">
          <div>
            <h1>Historial de ventas</h1>
            <p class="muted">Ventas guardadas localmente en IndexedDB.</p>
          </div>
        </div>

        <div id="salesHistory" class="sales-history">
          <div class="loader">Cargando ventas...</div>
        </div>
      </section>
    `),
    afterRender() {
      const container = document.querySelector('#salesHistory');

      getSales().then((sales) => {
        if (!sales.length) {
          container.innerHTML = `<div class="empty-state">Todavía no hay ventas registradas.</div>`;
          return;
        }

        container.innerHTML = sales.map((sale) => `
          <article class="sale-card">
            <header>
              <div>
                <strong>${sale.folio}</strong>
                <span>${dateTime(sale.createdAt)}</span>
              </div>
              <b>${money(sale.total)}</b>
            </header>

            <div class="sale-meta">
              <span>Cliente: ${sale.customerName}</span>
              <span>Perfil: ${sale.profileName}</span>
              <span>Pago: ${sale.paymentMethod}</span>
              ${sale.cardOperationNumber ? `<span>Operación: ${sale.cardOperationNumber}</span>` : ''}
            </div>

            <details>
              <summary>Ver productos</summary>
              <ul>
                ${sale.items.map((item) => `
                  <li>${item.qty} x ${item.name} — ${money(item.total)}</li>
                `).join('')}
              </ul>
            </details>
          </article>
        `).join('');
      });
    }
  };
}
