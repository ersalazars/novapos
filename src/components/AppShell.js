import { state } from '../store/posStore.js';

export function AppShell(content) {
  const profileName = state.activeProfile?.name || 'Sin perfil';

  // Fecha y hora actual
  const now = new Date();

  const fecha = now.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const hora = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <div class="app-shell">
      <header class="topbar">
        
        <div>
          <strong class="brand">
            <i class="fa-solid fa-bolt"></i>
            Nova POS
          </strong>

          <div class="muted muted-titulo">
            ESDM Punto de venta
          </div>

          <div class="muted muted-hora-titulo small-text">
            <i class="fa-regular fa-calendar"></i>
            ${fecha}

            &nbsp;•&nbsp;

            <i class="fa-regular fa-clock"></i>
            ${hora}
          </div>
        </div>

        <nav class="topbar-actions">
          <span class="profile-pill">${profileName}</span>

          <a href="/pos" data-link class="top-link">
            Venta
          </a>

          <a href="/history" data-link class="top-link">
            Historial
          </a>

          <a href="/profiles" data-link class="top-link danger">
            Cambiar perfil
          </a>
        </nav>

      </header>

      <main class="main-content">
        ${content}
      </main>
    </div>
  `;
}