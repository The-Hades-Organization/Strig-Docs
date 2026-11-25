export type Fact = { title: string; text: string };

// A few verified claims side by side, drawn as one grid with 1px hairlines between them.
export function Facts({ items, label }: { items: Fact[]; label?: string }) {
  return (
    <ul className="facts" aria-label={label}>
      {items.map((item) => (
        <li key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
