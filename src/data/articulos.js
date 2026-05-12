export const articulos = [
  {
    id: 1,
    id_categoria: 1,
    descripcion: 'BULTOS DE AZÚCAR',
    id_usuario: 1,
    usuario: 'DESARROLLO ESDM',
    fecha: '2026-05-07',
    hora: '10:28:52',
    estado: 1
  },
  {
    id: 2,
    id_categoria: 1,
    descripcion: 'BOLSA DE AZÚCAR 1 KG',
    id_usuario: 1,
    usuario: 'DESARROLLO ESDM',
    fecha: '2026-05-07',
    hora: '17:45:56',
    estado: 1
  }
];

export const articulosPrecios = [
  {
    id_precio: 1,
    id_articulo: 1,
    cant_minIMA: 1,
    cant_maxIMA: 10,
    precio_unitario: 500.00
  },
  {
    id_precio: 2,
    id_articulo: 1,
    cant_minIMA: 11,
    cant_maxIMA: 20,
    precio_unitario: 480.00
  },
  {
    id_precio: 3,
    id_articulo: 1,
    cant_minIMA: 21,
    cant_maxIMA: 30,
    precio_unitario: 460.00
  },
  {
    id_precio: 4,
    id_articulo: 2,
    cant_minIMA: 1,
    cant_maxIMA: 10,
    precio_unitario: 30.00
  },
  {
    id_precio: 5,
    id_articulo: 2,
    cant_minIMA: 11,
    cant_maxIMA: 50,
    precio_unitario: 20.00
  }
];

export const articulosAlmacenes = [
  {
    id_relacion: 1,
    id_articulo: 1,
    id_almacen: 1,
    stock_actual: 100
  },
  {
    id_relacion: 2,
    id_articulo: 2,
    id_almacen: 1,
    stock_actual: 200
  }
];

export const articulosMasVendidos = [
  {
    id_articulo: 2,
    total_vendido: 180
  },
  {
    id_articulo: 1,
    total_vendido: 75
  }
];