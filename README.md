# POS Soriana Demo

Demo SPA de punto de venta táctil hecho con Vite + Vanilla JS + CSS + Dexie/IndexedDB.

## Requisitos

- Node.js 20 o superior recomendado.
- npm incluido con Node.js.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre:

```txt
http://localhost:5173
```

## Compilar para producción

```bash
npm run build
```

El resultado queda en:

```txt
dist/
```

## Previsualizar compilado

```bash
npm run preview
```

Abre:

```txt
http://localhost:4173
```

## Flujo incluido

- Selección de perfil/cajero.
- Cliente por defecto: MOSTRADOR.
- Artículos basados en las tablas:
  - `articulos`
  - `articulos_precios`
  - `articulos_almacenes`
- Pantalla principal con artículos más vendidos.
- Búsqueda por descripción o código interno.
- Carrito con precio unitario dinámico por rango de cantidad.
- Pago efectivo/tarjeta.
- Número de operación para tarjeta.
- Historial de ventas local.
- Persistencia local con IndexedDB.
- Diseño responsive pensado para tablet.

## Nota sobre precios por rango

El precio se recalcula al cambiar cantidad en el carrito.

Ejemplo:

```txt
1 - 10 piezas    = $30
10 - 50 piezas   = $20
```

En tu SQL actual hay un rango duplicado en la cantidad 10 para `BOLSA DE AZÚCAR 1 KG`.
Lo recomendable es dejarlo así:

```txt
1 - 10 piezas    = $30
11 - 50 piezas   = $20
```

## Nota sobre almacén

El demo ya guarda `id_almacen` en el perfil y muestra stock por almacén.
Por ahora todos los perfiles apuntan al almacén 1.

Cuando conectes backend, esto debería salir de la sesión/perfil/caja.
