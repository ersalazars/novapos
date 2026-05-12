import { getTotals } from "../store/posStore.js";
import { money } from "../utils/format.js";

export function PaymentModal() {
  const totals = getTotals();

  return `
    <dialog class="modal" id="paymentModal">
      <form method="dialog" class="modal-card payment-card" id="paymentForm">
        <header class="modal-header">
          <h2>Cobrar venta</h2>
          <button type="button" class="icon-btn" data-close-modal="paymentModal">×</button>
        </header>

        <div class="modal-body">
          <div class="payment-total">
            <span>Total a pagar</span>
            <strong>${money(totals.total)}</strong>
          </div>

          <div class="payment-methods">
            <label class="method-card">
              <input type="radio" name="paymentMethod" value="efectivo" checked>
              <span>Efectivo</span>
            </label>

            <label class="method-card">
              <input type="radio" name="paymentMethod" value="tarjeta">
              <span>Tarjeta</span>
            </label>

            <label class="method-card">
              <input type="radio" name="paymentMethod" value="vales">
              <span>Vales</span>
            </label>
          </div>

          <div id="cashFields">
            <label class="field">
              <span>Recibido</span>
              <input class="input input-lg" type="number" id="cashReceived" min="0" step="0.01" placeholder="0.00">
            </label>
            <div class="change-box">
              Cambio: <strong id="cashChange">$0.00</strong>
            </div>
          </div>

          <div id="cardFields" class="hidden">
            <label class="field">
              <span>Número de operación</span>
              <input class="input input-lg" id="cardOperationNumber" placeholder="Ej. 839201">
            </label>
          </div>

          <div id="valFields" class="hidden">
            <label class="field">
              <span>Codigo de vale</span>
              <input class="input input-lg" id="CodeOperationVale" placeholder="Ej. 123-165-987">
            </label>
          </div>



        </div>

        <footer class="modal-footer">
          <button type="button" class="btn btn-light" data-close-modal="paymentModal">Cancelar</button>
          <button type="submit" class="btn btn-success">Finalizar venta</button>
        </footer>
      </form>
    </dialog>
  `;
}
