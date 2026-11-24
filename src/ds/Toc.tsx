'use client';

import { useEffect, useState, type ReactNode } from 'react';

export interface TocItem {
  title: ReactNode;
  url: string;
  depth: number;
}

const ROOT_MARGIN = '0px 0px -70% 0px';

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.url ?? null);

  // The observer has an owner: it is disconnected when the page unmounts.
  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: ROOT_MARGIN },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <ul>
        {items.map((item) => (
          <li key={item.url} data-depth={item.depth}>
            <a href={item.url} aria-current={item.url === active ? 'location' : undefined}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
