import { state } from '../store/posStore.js';

export function AppShell(content) {
  const profileName = state.activeProfile?.name || 'Sin perfil';

  return `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <strong class="brand">
            <i class="fa-solid fa-bolt"></i>
            Nova POS
          </strong>

          <span class="muted">
            Touch Sales Platform
          </span>
        </div>

        <nav class="topbar-actions">
          <span class="profile-pill">${profileName}</span>
          <a href="/pos" data-link class="top-link">Venta</a>
          <a href="/history" data-link class="top-link">Historial</a>
          <a href="/profiles" data-link class="top-link danger">Cambiar perfil</a>
        </nav>
      </header>

      <main class="main-content">
        ${content}
      </main>
    </div>
  `;
}
