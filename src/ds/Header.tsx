import type { ReactNode } from 'react';
import { Mark, Wordmark } from './Mark';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';

export function Header({ nav }: { nav?: ReactNode }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Strig, home">
        <Mark size={28} />
        <Wordmark height={16} />
      </a>
      <nav className="site-nav" aria-label="Site">
        <a href="/docs">Docs</a>
      </nav>
      <div className="site-tools">
        <Search />
        <ThemeToggle />
      </div>
      {nav ? (
        <details className="mobile-nav">
          <summary aria-label="Menu">Menu</summary>
          <div className="mobile-nav-body">{nav}</div>
        </details>
      ) : null}
    </header>
  );
}
