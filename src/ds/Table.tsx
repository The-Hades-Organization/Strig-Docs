import type { ComponentPropsWithoutRef } from 'react';

// Scrolls inside its own box on narrow screens so the page never scrolls sideways.
export function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Table">
      <table {...props} />
    </div>
  );
}
