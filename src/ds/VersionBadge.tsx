import type { ReactNode } from 'react';

export type VersionKind = 'added' | 'changed' | 'deprecated';

const LABEL: Record<VersionKind, string> = {
  added: 'Added in',
  changed: 'Changed in',
  deprecated: 'Deprecated in',
};

// Draw a badge only for a version the changelog gives; with none, draw nothing.
export function VersionBadge({ version, kind = 'added' }: { version: string; kind?: VersionKind }) {
  return (
    <span className="version-badge" data-kind={kind}>
      {LABEL[kind]} <span className="version-badge-num">{version}</span>
    </span>
  );
}

// Keeps an "Added in" and a "Changed in" badge side by side, wrapping when the row is narrow.
export function VersionBadges({ children }: { children: ReactNode }) {
  return <span className="version-badges">{children}</span>;
}
