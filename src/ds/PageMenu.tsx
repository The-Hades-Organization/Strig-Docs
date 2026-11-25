'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from './icons';

// The Pages button in the header and the page tree it opens under the header.
// Escape or a click outside closes it; Escape returns focus to the button.
export function PageMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);

  // The listeners have an owner: added while the menu is open, removed when it closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as globalThis.Node | null;
      if (target && (panel.current?.contains(target) || button.current?.contains(target))) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="menu-button"
        aria-label="Pages"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="menu" size={18} />
        <span className="menu-button-label">Pages</span>
      </button>
      <nav ref={panel} id={panelId} className="page-menu" aria-label="Pages" hidden={!open}>
        <div className="page-menu-in">{children}</div>
      </nav>
    </>
  );
}
