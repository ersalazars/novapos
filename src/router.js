import { ProfileView } from './views/ProfileView.js';
import { PosView } from './views/PosView.js';
import { HistoryView } from './views/HistoryView.js';
import { state, subscribe } from './store/posStore.js';

const routes = {
  '/profiles': ProfileView,
  '/pos': PosView,
  '/history': HistoryView,
};

let currentViewCleanup = null;

export function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderRoute();
}

export function initRouter() {
  window.addEventListener('popstate', renderRoute);

  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]');
    if (!link) return;

    event.preventDefault();
    navigateTo(link.getAttribute('href'));
  });

  subscribe(renderRoute);
}

function renderRoute() {
  const app = document.querySelector('#app');
  const path = window.location.pathname;
  const View = routes[path] || routes['/profiles'];

  if (path !== '/profiles' && !state.activeProfile) {
    navigateTo('/profiles');
    return;
  }

  if (typeof currentViewCleanup === 'function') {
    currentViewCleanup();
  }

  const result = View();
  app.innerHTML = result.html;
  currentViewCleanup = result.afterRender?.() || null;
}
