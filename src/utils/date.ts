export function toMonth(date: string) {
  return date.slice(0, 7);
}

export function currentMonth() {
  return toMonth(new Date().toISOString());
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function daysInMonth(month: string) {
  const [year, monthIndex] = month.split('-').map(Number);
  return new Date(year, monthIndex, 0).getDate();
}

export function datesOfMonth(month: string) {
  const total = daysInMonth(month);
  return Array.from({ length: total }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}
