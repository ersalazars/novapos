import { db } from '../db/localDb.js';

export async function getProfiles() {
  return db.profiles.toArray();
}
