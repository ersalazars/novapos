import { db } from './localDb.js';

import {
  articulos,
  articulosPrecios,
  articulosAlmacenes,
  articulosMasVendidos
} from '../data/articulos.js';

import { categorias } from '../data/categorias.js';

export async function seedLocalData() {
  const profileCount = await db.profiles.count();

  if (profileCount === 0) {
    await db.profiles.bulkAdd([
      { name: 'Caja 1', role: 'Cajero', pin: '1234', id_almacen: 1 },
      { name: 'Caja 2', role: 'Cajero', pin: '2222', id_almacen: 1 },
      { name: 'Supervisor', role: 'Administrador', pin: '9999', id_almacen: 1 },
    ]);
  }

  const customerCount = await db.customers.count();

  if (customerCount === 0) {
    await db.customers.bulkAdd([
      { name: 'MOSTRADOR', rfc: 'XAXX010101000', phone: '' },
      { name: 'ABARROTES LUNA', rfc: 'ALU010101AA1', phone: '' },
      { name: 'MINISUPER RÍO', rfc: 'MRI020202BB2', phone: '' },
      { name: 'TIENDA EL SOL', rfc: 'TES030303CC3', phone: '' },
      { name: 'DULCERÍA NENA', rfc: 'DNE040404DD4', phone: '' },
      { name: 'LOS REYES CARNICERIA', rfc: 'TRS030303CC3', phone: '' },
      { name: 'DULCERÍA TENTACION', rfc: 'DNW040404DD4', phone: '' },
    ]);
  }

  const productCount = await db.products.count();

  if (productCount === 0) {
    const products = articulos
      .filter((articulo) => Number(articulo.estado) === 1)
      .map((articulo) => {
        const categoryId = Number(articulo.id_categoria || 1);

        const category = categorias.find((cat) => {
          return Number(cat.id) === categoryId;
        });

        const priceRanges = articulosPrecios
          .filter((precio) => Number(precio.id_articulo) === Number(articulo.id))
          .sort((a, b) => Number(a.cant_minIMA) - Number(b.cant_minIMA))
          .map((precio) => ({
            id: Number(precio.id_precio),
            min: Number(precio.cant_minIMA),
            max: Number(precio.cant_maxIMA),
            price: Number(precio.precio_unitario),
          }));

        const warehouseRows = articulosAlmacenes
          .filter((almacen) => Number(almacen.id_articulo) === Number(articulo.id))
          .map((almacen) => ({
            relationId: Number(almacen.id_relacion),
            warehouseId: Number(almacen.id_almacen),
            stock: Number(almacen.stock_actual || 0),
          }));

        const bestSellerRow = articulosMasVendidos.find((item) => {
          return Number(item.id_articulo) === Number(articulo.id);
        });

        return {
          id: Number(articulo.id),

          categoryId,
          categoryName: category?.name || 'Sin categoría',

          barcode: `ART-${String(articulo.id).padStart(5, '0')}`,

          name: articulo.descripcion,
          description: articulo.descripcion,

          status: Number(articulo.estado),

          priceRanges,
          warehouses: warehouseRows,

          soldCount: Number(bestSellerRow?.total_vendido || 0),

          createdByUserId: Number(articulo.id_usuario),
          createdByUserName: articulo.usuario,
          createdAt: `${articulo.fecha} ${articulo.hora}`,
        };
      });

    await db.products.bulkAdd(products);
  }
}