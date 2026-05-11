import Dexie from 'dexie';

export const db = new Dexie('pos_soriana_demo');

db.version(1).stores({
  profiles: '++id, name, role',
  customers: '++id, name, rfc',
  products: '++id, barcode, name, status, soldCount',
  sales: '++id, folio, createdAt, paymentMethod, customerId, profileId, total'
});
