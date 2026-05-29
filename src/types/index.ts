export type Category = {
  id?: number;
  name: string;
  createdAt: string;
};

export type Budget = {
  id?: number;
  categoryId: number;
  month: string;
  amount: number;
  updatedAt: string;
};

export type Expense = {
  id?: number;
  date: string;
  month: string;
  amount: number;
  categoryId: number;
  note?: string;
  createdAt: string;
};

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
};

export type CategorySummary = {
  category: Category;
  budget: number;
  expense: number;
  remaining: number;
};

export type DailySummary = {
  date: string;
  expense: number;
  budgetAverage: number;
  balance: number;
};
