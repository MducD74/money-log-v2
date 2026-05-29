export function EmptyState({ title, note }: { title: string; note?: string }) {
  return (
    <div className="emptyState">
      <div className="emptyIcon">∅</div>
      <strong>{title}</strong>
      {note && <span>{note}</span>}
    </div>
  );
}
