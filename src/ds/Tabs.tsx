'use client';

import { Icon, type IconName } from './icons';
import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

// Arrow keys move between tabs and select them; Home and End jump to the ends.
function nextIndex(key: string, active: number, count: number): number | null {
  if (key === 'ArrowRight') return (active + 1) % count;
  if (key === 'ArrowLeft') return (active - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

export function Tab({ children }: { label: string; icon?: IconName; children: ReactNode }) {
  return <>{children}</>;
}

// Tabs for prose (MDX `<Tabs>` with `<Tab label>` children): only the selected panel is shown.
export function Tabs({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children).filter(isValidElement<{ label: string; icon?: IconName; children: ReactNode }>);
  const [active, setActive] = useState(0);
  const base = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  if (panels.length === 0) return null;

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextIndex(event.key, active, panels.length);
    if (next === null) return;
    event.preventDefault();
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
            {panel.props.icon ? <Icon name={panel.props.icon} size={16} /> : null}
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

export type SwapTab = { id: string; label: string; icon?: IconName; panel: ReactNode };

// Tabs whose panels share one grid cell, so a switch never changes the height: the panels that are
// not selected stay in place, hidden. The first tab is selected on the server, which is what a
// reader without JavaScript sees; the bar hides itself in that case (see `.swap-bar`).
export function SwapTabs({
  label,
  tabs,
  aside,
  className,
  barClassName,
}: {
  label: string;
  tabs: SwapTab[];
  // Shown in the bar after the tabs, such as a file name.
  aside?: ReactNode;
  className?: string;
  barClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextIndex(event.key, active, tabs.length);
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div className={barClassName ? `swap-bar ${barClassName}` : 'swap-bar'}>
        <div className="swap-tabs" role="tablist" aria-label={label} onKeyDown={move}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${base}-${tab.id}-tab`}
              aria-selected={index === active}
              aria-controls={`${base}-${tab.id}-panel`}
              tabIndex={index === active ? 0 : -1}
              className="swap-tab"
              onClick={() => setActive(index)}
            >
              {tab.icon ? <Icon name={tab.icon} size={16} /> : null}
              {tab.label}
            </button>
          ))}
        </div>
        {aside}
      </div>
      <div className="swap">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${base}-${tab.id}-panel`}
            aria-labelledby={`${base}-${tab.id}-tab`}
            data-off={index === active ? undefined : ''}
            className="swap-panel"
          >
            {tab.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
