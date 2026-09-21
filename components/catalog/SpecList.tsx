export default function SpecList({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="grid grid-cols-1 gap-1 py-4 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
        >
          <dt className="type-eyebrow text-muted">{item.label}</dt>
          <dd className="type-body text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
