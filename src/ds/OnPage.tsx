'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useDoc } from './DocState';
import { Icon } from './icons';

export type OnPageItem = { id: string; title: ReactNode };

// The page contents in the bar under the header: one control that names the
// section in view in full, and opens the list of every section with its whole
// label. It is a native disclosure (details), so the list opens without
// scripts too; with scripts, Escape or a click outside closes it and Escape
// returns focus to the control.
export function OnPage({ title, items }: { title: string; items: OnPageItem[] }) {
  const { location } = useDoc();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLElement | null>(null);
  const disclosure = useRef<HTMLDetailsElement | null>(null);

  const close = () => {
    if (disclosure.current) disclosure.current.open = false;
    setOpen(false);
  };

  // The listeners have an owner: added while the list is open, removed when it closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as globalThis.Node | null;
      if (target && root.current?.contains(target)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
    // close only touches refs and a setter, so it stays out of the deps.
  }, [open]);

  if (items.length === 0) return null;
  const currentId = location ?? items[0]?.id;
  const current = items.find((item) => item.id === currentId) ?? items[0];

  return (
    <nav ref={root} className="on-page" aria-label="On this page">
      <details
        ref={disclosure}
        className="on-page-menu"
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary ref={button} className="on-page-button">
          <span className="on-page-kicker">{title}</span>
          <span className="on-page-current">{current?.title}</span>
          <Icon name="chevron-down" size={16} />
        </summary>
        <div className="on-page-list">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === currentId ? 'location' : undefined}
                  onClick={close}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </nav>
  );
}
