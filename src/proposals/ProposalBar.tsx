import { DIRECTIONS } from './samples';

// Slim switcher shown above every direction so they can be compared in place.
export function ProposalBar({ current, page }: { current: 'a' | 'b' | 'c'; page: 'home' | 'doc' }) {
  const suffix = page === 'doc' ? '/doc' : '';
  return (
    <nav className="proposal-bar" aria-label="Directions">
      <a className="proposal-bar-all" href="/proposals">
        All directions
      </a>
      <ul>
        {DIRECTIONS.map((d) => (
          <li key={d.id}>
            <a
              href={`/proposals/${d.id}${suffix}`}
              aria-current={d.id === current ? 'page' : undefined}
            >
              {d.id.toUpperCase()} · {d.name}
            </a>
          </li>
        ))}
      </ul>
      <a className="proposal-bar-switch" href={`/proposals/${current}${page === 'doc' ? '' : '/doc'}`}>
        {page === 'doc' ? 'Home' : 'Doc page'}
      </a>
    </nav>
  );
}
