type MonthPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <label className="field compactField monthPicker">
      <span>Tháng</span>
      <input type="month" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
