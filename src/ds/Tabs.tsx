'use client';

import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export function Tab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

export function Tabs({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children).filter(isValidElement<{ label: string; children: ReactNode }>);
  const [active, setActive] = useState(0);
  const base = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  if (panels.length === 0) return null;

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (active + step + panels.length) % panels.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="tabs">
      <div className="tab-list" role="tablist" onKeyDown={move}>
        {panels.map((panel, index) => (
          <button
            key={panel.props.label}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${base}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            className="tab"
            onClick={() => setActive(index)}
          >
            {panel.props.label}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div
          key={panel.props.label}
          role="tabpanel"
          id={`${base}-panel-${index}`}
          aria-labelledby={`${base}-tab-${index}`}
          hidden={index !== active}
          className="tab-panel"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
