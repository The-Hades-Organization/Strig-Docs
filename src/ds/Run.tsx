'use client';

import type { ReactNode } from 'react';
import { useDoc } from './DocState';
import { Icon } from './icons';
import { VerdictTag } from './Seal';

// A line in the prose that switches the bench to its case:
// <Run case="c3" />. Shows the case's verdict (or its tag) and its short
// label; the command itself is in the bench.
export function Run({ case: id }: { case: string }) {
  const { cases, shown, pick } = useDoc();
  const meta = cases[id];
  if (!meta?.run) return null;
  return (
    <button type="button" className="run" aria-pressed={shown === id} onClick={() => pick(id)}>
      {meta.verdict ? (
        <VerdictTag verdict={meta.verdict} />
      ) : (
        <span className="run-tag">
          <Icon name="terminal" size={14} />
          {meta.run.tag ?? 'Rust'}
        </span>
      )}
      <span className="run-label">{meta.tab}</span>
      <span className="run-where">In the bench</span>
    </button>
  );
}

// A question in a table cell that switches the bench to its case:
// <CellPick case="legal">A document in Apollo's `legal` folder</CellPick>.
export function CellPick({ case: id, children }: { case: string; children: ReactNode }) {
  const { shown, pick } = useDoc();
  return (
    <button type="button" className="cell-pick" aria-pressed={shown === id} onClick={() => pick(id)}>
      {children}
    </button>
  );
}
