import { db } from '../db/db';
import type { BackupPayload } from '../types';

export async function createBackup(): Promise<BackupPayload> {
  const [categories, budgets, expenses] = await Promise.all([
    db.categories.toArray(),
    db.budgets.toArray(),
    db.expenses.toArray(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    budgets,
    expenses,
  };
}

export function downloadJson(payload: BackupPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `moneylog-backup-${payload.exportedAt.slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function restoreBackup(payload: BackupPayload) {
  if (payload.version !== 1 || !Array.isArray(payload.categories) || !Array.isArray(payload.budgets)) {
    throw new Error('File backup không hợp lệ.');
  }

  await db.transaction('rw', db.categories, db.budgets, db.expenses, async () => {
    await Promise.all([db.categories.clear(), db.budgets.clear(), db.expenses.clear()]);
    await db.categories.bulkAdd(payload.categories);
    await db.budgets.bulkAdd(payload.budgets);
    await db.expenses.bulkAdd(payload.expenses);
  });
}
