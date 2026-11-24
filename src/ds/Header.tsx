import type { ReactNode } from 'react';
import { Mark, Wordmark } from './Mark';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';

export function Header({ nav }: { nav?: ReactNode }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Themis, home">
        <Mark size={28} />
        <Wordmark height={16} />
      </a>
      <nav className="site-nav" aria-label="Site">
        <a href="/docs">Docs</a>
        <a href="/design-system">Design system</a>
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
