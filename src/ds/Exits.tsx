import { Icon, type IconName } from './icons';

export type Exit = { href: string; title: string; text: string; icon: IconName };

// Where to go next: one hairline grid of links, each a title with its icon and one line.
export function Exits({ items }: { items: Exit[] }) {
  return (
    <ul className="exits">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href}>
            <strong>
              <Icon name={item.icon} size={18} />
              {item.title}
            </strong>
            <span>{item.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
