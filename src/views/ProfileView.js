import { getProfiles } from '../services/profileService.js';
import { setActiveProfile } from '../store/posStore.js';
import { navigateTo } from '../router.js';

export function ProfileView() {
  return {
    html: `
      <section class="profile-screen">
        <div class="profile-card">

          <div class="login-brand">
            <div class="login-logo">
              <i class="fa-solid fa-bolt"></i>
            </div>

            <div>
              <p class="eyebrow">ESDM POS - Punto de venta</p>
              <h1>Selecciona perfil</h1>
              <p class="muted">
                Elige la caja o usuario que iniciará la venta.
              </p>
            </div>
          </div>

          <div class="profiles-grid" id="profilesGrid">
            <div class="loader">Cargando perfiles...</div>
          </div>

        </div>
      </section>
    `,
    afterRender() {
      const grid = document.querySelector('#profilesGrid');

      getProfiles().then((profiles) => {
        grid.innerHTML = profiles.map((profile) => `
          <button class="profile-option" data-profile-id="${profile.id}">
            <div class="profile-icon">
              <i class="fa-solid fa-user-tie"></i>
            </div>

            <strong>${profile.name}</strong>
            <span>${profile.role}</span>
          </button>
        `).join('');

        grid.addEventListener('click', (event) => {
          const button = event.target.closest('[data-profile-id]');
          if (!button) return;

          const profile = profiles.find((item) => item.id === Number(button.dataset.profileId));

          setActiveProfile(profile);
          navigateTo('/pos');
        });
      });
    }
  };
}