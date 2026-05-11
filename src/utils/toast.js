export function showToast({ type = 'success', title = '', message = '', container = document.body }) {
  document.querySelectorAll('.pos-toast').forEach((toast) => toast.remove());

  const toast = document.createElement('div');
  toast.className = `pos-toast ${type}`;

  toast.innerHTML = `
    <strong>${title}</strong>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}