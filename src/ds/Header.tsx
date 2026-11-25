import type { ReactNode } from 'react';
import { Mark, Wordmark } from './Mark';
import { PageMenu } from './PageMenu';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';

// Brand, the Docs link, and the tools: the Pages menu (when a page tree is
// given), search and the theme toggle.
export function Header({ pages }: { pages?: ReactNode }) {
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
        {pages ? <PageMenu>{pages}</PageMenu> : null}
        <Search />
        <ThemeToggle />
      </div>
    </header>
  );
}
