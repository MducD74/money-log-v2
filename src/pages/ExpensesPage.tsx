import { FormEvent, useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MonthPicker } from '../components/MonthPicker';
import { db } from '../db/db';
import { useCategories, useExpenses } from '../hooks/useMoneyData';
import type { Expense } from '../types';
import { currentMonth, formatDate, toMonth, todayInputValue } from '../utils/date';
import { formatVnd, parseMoneyInput } from '../utils/money';

export function ExpensesPage() {
  const [date, setDate] = useState(todayInputValue());
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [toast, setToast] = useState('');
  const categories = useCategories();
  const expenses = useExpenses(filterMonth);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const groupedExpenses = useMemo(() => {
    return expenses.reduce<Record<string, Expense[]>>((groups, expense) => {
      groups[expense.date] = groups[expense.date] ?? [];
      groups[expense.date].push(expense);
      return groups;
    }, {});
  }, [expenses]);

  async function saveExpense(event: FormEvent) {
    event.preventDefault();
    const selectedCategoryId = Number(categoryId);
    const parsedAmount = parseMoneyInput(amount);
    if (!date || parsedAmount <= 0 || !selectedCategoryId) return;

    await db.expenses.add({
      date,
      month: toMonth(date),
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    setAmount('');
    setNote('');
    setToast('Đã lưu chi tiêu');
    window.setTimeout(() => setToast(''), 1800);
  }

  async function deleteExpense(id: number) {
    if (!confirm('Xóa chi tiêu này?')) return;
    await db.expenses.delete(id);
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Thêm chi tiêu</h2>
          <p>Nhập nhanh khoản chi mới, dữ liệu lưu offline.</p>
        </div>
      </div>

      <form className="expenseFormPanel" onSubmit={saveExpense}>
        <label className="moneyField">
          <span>Số tiền</span>
          <input
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0 VND"
          />
        </label>

        <label className="field">
          <span>Ngày chi</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <div className="field">
          <span>Hạng mục</span>
          <div className="chipGrid">
            {categories.map((category) => (
              <button
                className={`categoryChip ${categoryId === String(category.id) ? 'active' : ''}`}
                key={category.id}
                type="button"
                onClick={() => setCategoryId(String(category.id))}
              >
                <i>{category.name.slice(0, 1).toUpperCase()}</i>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <label className="field">
          <span>Ghi chú</span>
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: cà phê sáng" />
        </label>

        <button className="primaryButton stickyAction" type="submit">
          Lưu chi tiêu
        </button>
        {toast && <div className="toastMessage">{toast}</div>}
      </form>

      <div className="pageHeader compact">
        <div>
          <h2>Lịch sử</h2>
          <p>Giao dịch mới nhất trước.</p>
        </div>
        <MonthPicker value={filterMonth} onChange={setFilterMonth} />
      </div>

      {expenses.length === 0 ? (
        <EmptyState title="Chưa có chi tiêu" note="Các khoản chi trong tháng sẽ xuất hiện tại đây." />
      ) : (
        <div className="timelineList">
          {Object.entries(groupedExpenses).map(([groupDate, group]) => (
            <section className="timelineGroup" key={groupDate}>
              <div className="timelineDate">{formatDate(groupDate)}</div>
              {group.map((expense) => (
                <article className="timelineItem" key={expense.id}>
                  <div className="timelineDot" />
                  <div className="transactionCard">
                    <div>
                      <strong>{categoryNameById.get(expense.categoryId) ?? 'Hạng mục đã xóa'}</strong>
                      <span>{expense.note || 'Không có ghi chú'}</span>
                    </div>
                    <div className="transactionAmount">
                      <b>{formatVnd(expense.amount)}</b>
                      <button type="button" onClick={() => deleteExpense(expense.id!)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
