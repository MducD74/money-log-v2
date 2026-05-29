import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MonthPicker } from '../components/MonthPicker';
import { ProgressBar } from '../components/ProgressBar';
import { useBudgets, useCategories, useExpenses } from '../hooks/useMoneyData';
import { currentMonth } from '../utils/date';
import { formatVnd } from '../utils/money';
import { sumBudgets, sumExpenses, summarizeCategories } from '../utils/stats';

export function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());
  const categories = useCategories();
  const budgets = useBudgets(month);
  const expenses = useExpenses(month);

  const totalBudget = sumBudgets(budgets);
  const totalExpense = sumExpenses(expenses);
  const remaining = totalBudget - totalExpense;
  const spentPercent = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0;
  const rows = useMemo(
    () => summarizeCategories(categories, budgets, expenses),
    [categories, budgets, expenses],
  );

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Tổng quan</h2>
          <p>Nhìn nhanh ngân sách và chi tiêu trong tháng.</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <article className={`heroCard ${remaining < 0 ? 'overBudget' : ''}`}>
        <div className="heroTop">
          <div>
            <span className="heroLabel">Còn lại tháng này</span>
            <strong>{formatVnd(remaining)}</strong>
          </div>
          <span className={`statusPill ${remaining >= 0 ? 'good' : 'bad'}`}>
            {remaining >= 0 ? 'Còn tiền' : 'Vượt ngân sách'}
          </span>
        </div>

        <div className="heroMetrics">
          <div>
            <span>Tổng budget</span>
            <b>{formatVnd(totalBudget)}</b>
          </div>
          <div>
            <span>Đã chi</span>
            <b>{formatVnd(totalExpense)}</b>
          </div>
        </div>

        <div className="progressBlock">
          <div className="progressMeta">
            <span>Đã dùng</span>
            <b>{spentPercent}%</b>
          </div>
          <ProgressBar value={totalExpense} max={totalBudget} warning={remaining < 0} />
        </div>
      </article>

      <div className="sectionTitleRow">
        <h3>Hạng mục</h3>
        <span>{rows.length} mục</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Chưa có hạng mục" note="Thêm hạng mục để bắt đầu lập budget." />
      ) : (
        <div className="categoryCardGrid">
          {rows.map((row) => {
            const isWarning = row.budget > 0 && row.expense > row.budget;
            return (
              <article className={`categorySummaryCard ${isWarning ? 'warningCard' : ''}`} key={row.category.id}>
                <div className="cardTitleLine">
                  <strong>{row.category.name}</strong>
                  <span className={row.remaining >= 0 ? 'positive' : 'negative'}>{formatVnd(row.remaining)}</span>
                </div>
                <div className="miniMetrics">
                  <span>Budget {formatVnd(row.budget)}</span>
                  <span>Chi {formatVnd(row.expense)}</span>
                </div>
                <ProgressBar value={row.expense} max={row.budget} warning={isWarning} />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
