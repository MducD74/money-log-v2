import type { Budget, Category, CategorySummary, DailySummary, Expense } from '../types';
import { datesOfMonth, daysInMonth } from './date';

export function summarizeCategories(categories: Category[], budgets: Budget[], expenses: Expense[]) {
  return categories.map<CategorySummary>((category) => {
    const budget = budgets.find((item) => item.categoryId === category.id)?.amount ?? 0;
    const expense = expenses
      .filter((item) => item.categoryId === category.id)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      category,
      budget,
      expense,
      remaining: budget - expense,
    };
  });
}

export function sumBudgets(budgets: Budget[]) {
  return budgets.reduce((sum, item) => sum + item.amount, 0);
}

export function sumExpenses(expenses: Expense[]) {
  return expenses.reduce((sum, item) => sum + item.amount, 0);
}

export function summarizeDaily(month: string, totalBudget: number, expenses: Expense[]) {
  const dailyBudget = totalBudget / daysInMonth(month);

  return datesOfMonth(month).map<DailySummary>((date) => {
    const expense = expenses
      .filter((item) => item.date === date)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      date,
      expense,
      budgetAverage: dailyBudget,
      balance: dailyBudget - expense,
    };
  });
}
