import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MonthPicker } from '../components/MonthPicker';
import { StatCard } from '../components/StatCard';
import { useBudgets, useCategories, useExpenses } from '../hooks/useMoneyData';
import { currentMonth, daysInMonth, formatDate } from '../utils/date';
import { formatVnd } from '../utils/money';
import { sumBudgets, sumExpenses, summarizeCategories, summarizeDaily } from '../utils/stats';

export function StatsPage() {
  const [month, setMonth] = useState(currentMonth());
  const categories = useCategories();
  const budgets = useBudgets(month);
  const expenses = useExpenses(month);
  const totalBudget = sumBudgets(budgets);
  const totalExpense = sumExpenses(expenses);
  const averageDailyExpense = totalExpense / daysInMonth(month);
  const dailyRows = useMemo(() => summarizeDaily(month, totalBudget, expenses), [month, totalBudget, expenses]);
  const categoryRows = useMemo(
    () => summarizeCategories(categories, budgets, expenses).filter((row) => row.budget > 0 || row.expense > 0),
    [categories, budgets, expenses],
  );
  const maxDailyExpense = Math.max(1, ...dailyRows.map((row) => row.expense));
  const maxCategoryExpense = Math.max(1, ...categoryRows.map((row) => row.expense));
  const topDay = dailyRows.reduce((max, row) => (row.expense > max.expense ? row : max), dailyRows[0]);
  const topCategory = categoryRows.reduce(
    (max, row) => (row.expense > max.expense ? row : max),
    categoryRows[0],
  );

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Thống kê</h2>
          <p>Đọc nhanh thói quen chi tiêu trong tháng.</p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="statsGrid twoByTwo">
        <StatCard label="Tổng chi" value={formatVnd(totalExpense)} />
        <StatCard label="Trung bình/ngày" value={formatVnd(averageDailyExpense)} />
        <StatCard label="Ngày chi nhiều nhất" value={topDay?.expense ? formatDate(topDay.date).slice(0, 5) : '—'} />
        <StatCard label="Hạng mục nhiều nhất" value={topCategory?.category.name ?? '—'} />
      </div>

      <div className="chartPanel">
        <div className="sectionTitleRow">
          <h3>Chi theo ngày</h3>
          <span>{formatVnd(totalExpense)}</span>
        </div>
        <div className="dailyChart">
          {dailyRows.map((row) => (
            <article className="dailyBar" key={row.date}>
              <div className="dailyBarTrack">
                <i style={{ height: `${Math.max(4, (row.expense / maxDailyExpense) * 100)}%` }} />
              </div>
              <span>{row.date.slice(-2)}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="chartPanel">
        <div className="sectionTitleRow">
          <h3>Âm/dương theo ngày</h3>
          <span>Budget TB/ngày</span>
        </div>
        <div className="barList">
          {dailyRows.map((row) => (
            <article className="barRow" key={row.date}>
              <span>{formatDate(row.date).slice(0, 5)}</span>
              <div className="barTrack">
                <i style={{ width: `${Math.min(100, (row.expense / maxDailyExpense) * 100)}%` }} />
              </div>
              <b className={row.balance >= 0 ? 'positive' : 'negative'}>{formatVnd(row.balance)}</b>
            </article>
          ))}
        </div>
      </div>

      <div className="chartPanel">
        <div className="sectionTitleRow">
          <h3>Theo hạng mục</h3>
          <span>{categoryRows.length} mục</span>
        </div>
        {categoryRows.length === 0 ? (
          <EmptyState title="Chưa có dữ liệu thống kê" note="Nhập chi tiêu hoặc budget để xem phân tích." />
        ) : (
          <div className="barList">
            {categoryRows.map((row) => (
              <article className="categoryStat" key={row.category.id}>
                <div className="categoryStatTop">
                  <strong>{row.category.name}</strong>
                  <b>{formatVnd(row.expense)}</b>
                </div>
                <div className="barTrack large">
                  <i style={{ width: `${Math.min(100, (row.expense / maxCategoryExpense) * 100)}%` }} />
                </div>
                <p className={row.remaining >= 0 ? 'positive' : 'negative'}>
                  Tháng này {row.remaining >= 0 ? 'còn' : 'vượt'} {formatVnd(Math.abs(row.remaining))}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
