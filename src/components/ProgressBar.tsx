type ProgressBarProps = {
  value: number;
  max: number;
  warning?: boolean;
};

export function ProgressBar({ value, max, warning = false }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={`progressBar ${warning ? 'warning' : ''}`} aria-label={`Đã dùng ${percent}%`}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}
