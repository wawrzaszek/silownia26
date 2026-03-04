export function MetricCard({ title, value, hint }: { title: string; value: string | number; hint: string }) {
  return (
    <div className="panel fade-in">
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>{title}</div>
      <div className="kpi">{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{hint}</div>
    </div>
  );
}
