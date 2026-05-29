export function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function parseMoneyInput(value: string) {
  const normalized = value.replace(/[^\d]/g, '');
  return Number(normalized || 0);
}
