export function CategoryGrid(categories) {
  if (!categories.length) {
    return `<div class="empty-state">No hay categorías disponibles.</div>`;
  }

  return `
    <div class="category-grid">
      ${categories.map((category) => `
        <button class="category-card" data-category-id="${category.id}">
          <img src="${category.image}" alt="${category.name}">

          <div class="category-overlay">
            <strong>${category.name}</strong>
            <span>Ver productos</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;
}