import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import type { Root } from 'fumadocs-core/page-tree';
import { Icon } from './icons';

export function Breadcrumbs({ tree, current }: { tree: Root; current: string }) {
  const items = getBreadcrumbItems(current, tree, { includePage: true });
  if (items.length === 0) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={index}>
              {item.url && !last ? <a href={item.url}>{item.name}</a> : <span aria-current={last ? 'page' : undefined}>{item.name}</span>}
              {last ? null : <Icon name="chevron-right" size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
