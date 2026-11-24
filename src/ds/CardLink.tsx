import type { ReactNode } from 'react';
import { Icon } from './icons';

export function CardLink({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <a className="card-link" href={href}>
      <span className="card-link-title">
        {title}
        <Icon name="arrow-right" size={16} />
      </span>
      {children ? <span className="card-link-text">{children}</span> : null}
    </a>
  );
}
