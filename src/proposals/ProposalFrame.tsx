import type { ReactNode } from 'react';
import { ProposalBar } from './ProposalBar';
import type { DirectionId } from './samples';

export function ProposalFrame({
  direction,
  page,
  children,
}: {
  direction: DirectionId;
  page: 'home' | 'doc';
  children: ReactNode;
}) {
  return (
    <div className="proposal" data-direction={direction} data-page={page}>
      <ProposalBar current={direction} page={page} />
      {children}
    </div>
  );
}
