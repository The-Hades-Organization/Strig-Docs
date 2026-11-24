import type { ReactNode } from 'react';
import { Icon, type IconName } from './icons';

export type CalloutKind = 'note' | 'warning' | 'breaking';

const META: Record<CalloutKind, { icon: IconName; title: string }> = {
  note: { icon: 'info', title: 'Note' },
  warning: { icon: 'warn', title: 'Warning' },
  breaking: { icon: 'break', title: 'Breaking change' },
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
  return (
    <aside className="callout" data-kind={kind}>
      <p className="callout-title">
        <Icon name={meta.icon} size={18} />
        {title ?? meta.title}
      </p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
