import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useCategories() {
  return useLiveQuery(() => db.categories.orderBy('name').toArray(), [], []);
}

export function useBudgets(month: string) {
  return useLiveQuery(() => db.budgets.where('month').equals(month).toArray(), [month], []);
}

export function useExpenses(month?: string) {
  return useLiveQuery(
    async () => {
      const rows = month ? await db.expenses.where('month').equals(month).toArray() : await db.expenses.toArray();
      return rows.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare || b.createdAt.localeCompare(a.createdAt);
      });
    },
    [month],
    [],
  );
}
