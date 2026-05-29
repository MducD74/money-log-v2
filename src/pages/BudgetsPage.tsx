import { FormEvent, useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MonthPicker } from '../components/MonthPicker';
import { ProgressBar } from '../components/ProgressBar';
import { db } from '../db/db';
import { useBudgets, useCategories, useExpenses } from '../hooks/useMoneyData';
import { currentMonth } from '../utils/date';
import { formatVnd, parseMoneyInput } from '../utils/money';

export function BudgetsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [savingId, setSavingId] = useState<number | null>(null);
  const categories = useCategories();
  const budgets = useBudgets(month);
  const expenses = useExpenses(month);

  const budgetByCategoryId = useMemo(
    () => new Map(budgets.map((budget) => [budget.categoryId, budget])),
    [budgets],
  );

  const expenseByCategoryId = useMemo(() => {
    const totals = new Map<number, number>();
    expenses.forEach((expense) => {
      totals.set(expense.categoryId, (totals.get(expense.categoryId) ?? 0) + expense.amount);
    });
    return totals;
  }, [expenses]);

  async function saveBudget(event: FormEvent<HTMLFormElement>, selectedCategoryId: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsedAmount = parseMoneyInput(String(formData.get('amount') ?? ''));
    if (!selectedCategoryId || parsedAmount < 0) return;

    setSavingId(selectedCategoryId);
    const existing = await db.budgets.where('[month+categoryId]').equals([month, selectedCategoryId]).first();
    const payload = {
      month,
      categoryId: selectedCategoryId,
      amount: parsedAmount,
      updatedAt: new Date().toISOString(),
    };

    if (existing?.id) {
      await db.budgets.update(existing.id, payload);
    } else {
      await db.budgets.add(payload);
    }
    setSavingId(null);
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Budget tháng</h2>
          <p>Chỉnh ngân sách từng hạng mục ngay trên card.</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Chưa có hạng mục" note="Tạo hạng mục trước khi đặt budget." />
      ) : (
        <div className="budgetCardList">
          {categories.map((category) => {
            const budget = budgetByCategoryId.get(category.id!);
            const spent = expenseByCategoryId.get(category.id!) ?? 0;
            const amount = budget?.amount ?? 0;
            const remaining = amount - spent;
            const isWarning = amount > 0 && spent > amount;

            return (
              <form
                className={`budgetEditCard ${isWarning ? 'warningCard' : ''}`}
                key={`${month}-${category.id}`}
                onSubmit={(event) => saveBudget(event, category.id!)}
              >
                <div className="cardTitleLine">
                  <strong>{category.name}</strong>
                  <span className={remaining >= 0 ? 'positive' : 'negative'}>
                    {remaining >= 0 ? 'Còn ' : 'Vượt '}
                    {formatVnd(Math.abs(remaining))}
                  </span>
                </div>

                <label className="inlineMoneyInput">
                  <span>Budget</span>
                  <input name="amount" inputMode="numeric" defaultValue={amount || ''} placeholder="0" />
                </label>

                <div className="miniMetrics">
                  <span>Đã chi {formatVnd(spent)}</span>
                  <span>{month}</span>
                </div>
                <ProgressBar value={spent} max={amount} warning={isWarning} />

                <button className="primaryButton smallButton" type="submit" disabled={savingId === category.id}>
                  {savingId === category.id ? 'Đang lưu...' : 'Lưu budget'}
                </button>
              </form>
            );
          })}
        </div>
      )}
    </section>
  );
}
