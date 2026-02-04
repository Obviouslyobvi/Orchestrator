interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard = ({ title, value }: StatsCardProps) => (
  <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
    <p className="text-xs font-semibold uppercase text-muted">{title}</p>
    <p className="mt-3 text-2xl font-semibold text-content">{value}</p>
  </div>
);

export default StatsCard;
