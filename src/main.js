import './styles/app.css';
import { initRouter, navigateTo } from './router.js';
import { seedLocalData } from './db/seed.js';

document.addEventListener('DOMContentLoaded', async () => {
  await seedLocalData();
  initRouter();
  navigateTo('/profiles');
});
