import { findNeighbour, type Root } from 'fumadocs-core/page-tree';
import { Icon } from './icons';

export function Pager({ tree, current }: { tree: Root; current: string }) {
  const { previous, next } = findNeighbour(tree, current);
  if (!previous && !next) return null;
  return (
    <nav className="pager" aria-label="Previous and next page">
      {previous ? (
        <a className="pager-link" data-dir="previous" href={previous.url} rel="prev">
          <span className="pager-dir">
            <Icon name="chevron-left" size={14} />
            Previous
          </span>
          <span className="pager-title">{previous.name}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className="pager-link" data-dir="next" href={next.url} rel="next">
          <span className="pager-dir">
            Next
            <Icon name="chevron-right" size={14} />
          </span>
          <span className="pager-title">{next.name}</span>
        </a>
      ) : null}
    </nav>
  );
}
