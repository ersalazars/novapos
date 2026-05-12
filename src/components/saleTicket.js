export function renderSaleTicket(sale) {

  const totalPieces = sale.items.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const itemsHtml = sale.items.map(item => `
    <tr>

      <td class="qty">
        ${item.qty}x
      </td>

      <td class="desc">
        <div>${item.name}</div>

        <small>
          $${item.price.toFixed(2)} c/u
        </small>
      </td>

      <td class="amount">
        $${item.total.toFixed(2)}
      </td>

    </tr>
  `).join('');

  return `
    <div class="ticket-overlay" id="ticketOverlay">

      <div class="ticket-modal">

        <div class="ticket-header">

          <h2>NOVA POS</h2>

          <p class="store-name">
            ESDM PUNTO DE VENTA
          </p>

          <p class="store-address">
            Av. Central #1450<br>
            Col. Centro Comercial<br>
            Veracruz, Veracruz<br>
            C.P. 93230
          </p>

          <p class="store-rfc">
            RFC: XAXX010101000
          </p>

        </div>

        <hr>

        <div class="ticket-info">

          <div>
            <strong>Folio:</strong>
            ${sale.folio}
          </div>

          <div>
            <strong>Fecha:</strong>
            ${new Date(sale.createdAt).toLocaleString()}
          </div>

          <div>
            <strong>Cajero:</strong>
            ${sale.profileName}
          </div>

          <div>
            <strong>Cliente:</strong>
            ${sale.customerName}
          </div>

          <div>
            <strong>Método:</strong>
            ${sale.paymentMethod}
          </div>

        </div>

        <hr>

        <table class="ticket-table">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <hr>

        <div class="ticket-total">

          <div>
            <span>ARTÍCULOS</span>
            <strong>${sale.items.length}</strong>
          </div>

          <div>
            <span>PIEZAS</span>
            <strong>${totalPieces}</strong>
          </div>

          <div>
            <span>SUBTOTAL</span>
            <strong>$${sale.subtotal.toFixed(2)}</strong>
          </div>

          <div>
            <span>IVA</span>
            <strong>$${sale.iva.toFixed(2)}</strong>
          </div>

          <div class="grand-total">
            <span>TOTAL</span>
            <strong>$${sale.total.toFixed(2)}</strong>
          </div>

        </div>

        ${
          sale.paymentMethod === 'EFECTIVO'
            ? `
              <hr>

              <div class="ticket-payment">

                <div>
                  <span>RECIBIDO</span>
                  <strong>
                    $${sale.cashReceived.toFixed(2)}
                  </strong>
                </div>

                <div>
                  <span>CAMBIO</span>
                  <strong>
                    $${sale.change.toFixed(2)}
                  </strong>
                </div>

              </div>
            `
            : ''
        }

        ${
          sale.cardOperationNumber
            ? `
              <div class="ticket-card">
                <strong>OPERACIÓN:</strong>
                ${sale.cardOperationNumber}
              </div>
            `
            : ''
        }

        <hr>

        <div class="ticket-footer">

          <p>
            Gracias por su compra
          </p>

          <p>
            Conserve su ticket
          </p>

          <p class="footer-small">
            NOVA POS DEMO v1.0
          </p>

        </div>

        <div class="ticket-actions">

          <button id="btnPrintTicket" class="ticket-btn primary">
            <i class="fa-solid fa-print"></i>
            Imprimir
          </button>

          <button id="btnCloseTicket" class="ticket-btn">
            Cerrar
          </button>

        </div>

      </div>

    </div>
  `;
}

export function showSaleTicket(sale) {
  const existing = document.getElementById('ticketOverlay');

  if (existing) {
    existing.remove();
  }

  document.body.insertAdjacentHTML(
    'beforeend',
    renderSaleTicket(sale)
  );

  document
    .getElementById('btnCloseTicket')
    ?.addEventListener('click', () => {
      document.getElementById('ticketOverlay')?.remove();
    });

  document
    .getElementById('btnPrintTicket')
    ?.addEventListener('click', () => {
      window.print();
    });
}