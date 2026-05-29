import { db } from './db';

const defaultCategories = ['Ăn uống', 'Đi lại', 'Học tập', 'Mua sắm', 'Giải trí', 'Khác'];

export async function ensureDefaultCategories() {
  const count = await db.categories.count();
  if (count > 0) return;

  const now = new Date().toISOString();
  await db.categories.bulkAdd(defaultCategories.map((name) => ({ name, createdAt: now })));
}
