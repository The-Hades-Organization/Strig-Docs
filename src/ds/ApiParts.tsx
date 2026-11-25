import type { ReactNode } from 'react';

// A list of API items (src/ds/ApiItem.tsx), ruled between items.
export function ApiGroup({ children }: { children: ReactNode }) {
  return <ul className="api-group">{children}</ul>;
}

// A reference table too wide for the text column: it keeps its width and
// scrolls inside its own box, and code in its cells does not break.
export function ApiWide({ children }: { children: ReactNode }) {
  return <div className="api-wide">{children}</div>;
}

// What an item returns, or holds, under its example in the bench. Rendered
// inside the bench note, so it is phrasing content only.
export function ApiReturns({ label = 'Returns', children }: { label?: string; children: ReactNode }) {
  return (
    <span className="api-returns">
      <span className="bench-label">{label}</span>
      <span>{children}</span>
    </span>
  );
}
