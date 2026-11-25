'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useDoc } from './DocState';
import { Icon } from './icons';

export type OnPageItem = { id: string; title: ReactNode };

// The page contents in the bar under the header: one button that names the
// section in view in full, and opens the list of every section with its whole
// label. A row of tabs cut the labels of long pages; a list never does.
// Escape or a click outside closes it; Escape returns focus to the button.
export function OnPage({ title, items }: { title: string; items: OnPageItem[] }) {
  const { location } = useDoc();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement | null>(null);
  const root = useRef<HTMLElement | null>(null);

  // The listeners have an owner: added while the list is open, removed when it closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as globalThis.Node | null;
      if (target && root.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (items.length === 0) return null;
  const currentId = location ?? items[0]?.id;
  const current = items.find((item) => item.id === currentId) ?? items[0];

  return (
    <nav ref={root} className="on-page" aria-label="On this page">
      <button
        ref={button}
        type="button"
        className="on-page-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="on-page-kicker">{title}</span>
        <span className="on-page-current">{current?.title}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      <div id={panelId} className="on-page-list" hidden={!open}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === currentId ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
