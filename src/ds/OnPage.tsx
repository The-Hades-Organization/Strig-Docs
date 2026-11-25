'use client';

import type { ReactNode } from 'react';
import { useDoc } from './DocState';

export type OnPageItem = { id: string; title: ReactNode };

// The page contents as one row in the bar under the header: the page title,
// then a link per section. The section in view is aria-current="location".
export function OnPage({ title, items }: { title: string; items: OnPageItem[] }) {
  const { location } = useDoc();
  if (items.length === 0) return null;
  const current = location ?? items[0]?.id;
  return (
    <nav className="on-page" aria-label="On this page">
      <p>{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={item.id === current ? 'location' : undefined}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
