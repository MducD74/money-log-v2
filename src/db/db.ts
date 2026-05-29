import Dexie, { type Table } from 'dexie';
import type { Budget, Category, Expense } from '../types';

class MoneyLogDatabase extends Dexie {
  categories!: Table<Category, number>;
  budgets!: Table<Budget, number>;
  expenses!: Table<Expense, number>;

  constructor() {
    super('moneylog_v2');
    this.version(1).stores({
      categories: '++id, &name, createdAt',
      budgets: '++id, &[month+categoryId], month, categoryId',
      expenses: '++id, month, date, categoryId, createdAt',
    });
  }
}

export const db = new MoneyLogDatabase();
