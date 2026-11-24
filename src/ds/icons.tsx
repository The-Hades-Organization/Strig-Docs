import type { ReactNode } from 'react';

export type IconName =
  | 'check'
  | 'x'
  | 'bang'
  | 'dash'
  | 'search'
  | 'copy'
  | 'chevron-right'
  | 'chevron-left'
  | 'menu'
  | 'info'
  | 'warn'
  | 'break'
  | 'arrow-right';

// One stroke weight (1.8) and one grid (24) for every icon. Paths are authored here.
const PATHS: Record<IconName, ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  bang: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16.4v.1" />
    </>
  ),
  dash: <path d="M6 12h12" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </>
  ),
  'chevron-right': <path d="M9.5 5.5l6.5 6.5-6.5 6.5" />,
  'chevron-left': <path d="M14.5 5.5L8 12l6.5 6.5" />,
  menu: <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  warn: (
    <>
      <path d="M12 4.5l8.5 15h-17z" />
      <path d="M12 10v4.2M12 16.9v.1" />
    </>
  ),
  break: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5" />,
};

export function Icon({ name, size = 18, label }: { name: IconName; size?: number; label?: string }) {
  const decorative = label === undefined;
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
