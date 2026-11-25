import type { ReactNode } from 'react';
import { Icon, type IconName } from './icons';

export type CalloutKind = 'note' | 'warning' | 'breaking';

const META: Record<CalloutKind, { icon: IconName; title: string }> = {
  note: { icon: 'info', title: 'Note' },
  warning: { icon: 'triangle-alert', title: 'Warning' },
  breaking: { icon: 'circle-x', title: 'Breaking change' },
};

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}) {
  const meta = META[kind];
  // A note, not a landmark: a page with several callouts should not grow several regions.
  return (
    <aside className="callout" data-kind={kind} role="note">
      <p className="callout-title">
        <Icon name={meta.icon} size={18} />
        {title ?? meta.title}
      </p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
