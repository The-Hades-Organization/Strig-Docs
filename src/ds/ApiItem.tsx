'use client';

import type { ReactNode } from 'react';
import { useDoc } from './DocState';
import { Icon } from './icons';
import { VersionBadge, VersionBadges } from './VersionBadge';

// One item of the API reference: its name, its signature exactly as the crate
// declares it, a line on what it does, and version badges when the changelog
// gives them. With `pick`, the name is a button that shows the item's bench
// case (src/content/bench/*.tsx), pressed while the bench shows it.
//
// <ApiItem id="engine-decide" name="Engine::decide" pick="decide" sig={`pub fn decide(...) -> Decision`}>
//   Allows or denies the request and says why.
// </ApiItem>
export function ApiItem({
  id,
  name,
  sig,
  pick,
  added,
  changed,
  level = 3,
  children,
}: {
  // Anchor of the item, so a link can land on it.
  id: string;
  name: string;
  // The declaration, copied from the source. Several lines for several items.
  sig: string;
  // The id of the bench case that shows this item.
  pick?: string;
  // Versions from the changelog only; with none, no badge.
  added?: string;
  changed?: string;
  // 4 when the item sits under an h3 of the page.
  level?: 3 | 4;
  children: ReactNode;
}) {
  const { shown, pick: show } = useDoc();
  const selected = pick !== undefined && shown === pick;
  const Heading = level === 4 ? 'h4' : 'h3';

  return (
    <li className="api-item" id={id} data-selected={selected ? '' : undefined}>
      <div className="api-item-head">
        <Heading className="api-name">
          {pick !== undefined ? (
            <button
              type="button"
              className="api-pick"
              title="Show in the bench"
              aria-pressed={selected}
              onClick={() => show(pick)}
            >
              <span>{name}</span>
              <Icon name="chevron-right" size={16} />
            </button>
          ) : (
            name
          )}
        </Heading>
        {added !== undefined || changed !== undefined ? (
          <VersionBadges>
            {added !== undefined ? <VersionBadge version={added} /> : null}
            {changed !== undefined ? <VersionBadge version={changed} kind="changed" /> : null}
          </VersionBadges>
        ) : null}
      </div>
      <pre className="api-sig" tabIndex={0}>
        <code>{sig}</code>
      </pre>
      <div className="api-desc">{children}</div>
    </li>
  );
}
