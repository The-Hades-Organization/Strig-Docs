'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './icons';

// The Pages control in the header and the page tree it opens under the header.
// A native disclosure (details), so it opens without scripts; with scripts,
// Escape or a click outside closes it and Escape returns focus to the control.
export function PageMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDetailsElement | null>(null);

  const close = () => {
    if (root.current) root.current.open = false;
    setOpen(false);
  };

  // The listeners have an owner: added while the menu is open, removed when it closes.
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
    // close only touches a ref and a setter, so it stays out of the deps.
  }, [open]);

  return (
    <details ref={root} className="menu" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary ref={button} className="menu-button" aria-label="Pages">
        <Icon name="menu" size={18} />
        <span className="menu-button-label">Pages</span>
      </summary>
      <nav className="page-menu" aria-label="Pages">
        <div className="page-menu-in">{children}</div>
      </nav>
    </details>
  );
}
