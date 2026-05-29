type StatCardProps = {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'bad';
};

export function StatCard({ label, value, tone = 'neutral' }: StatCardProps) {
  return (
    <article className={`statCard ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
