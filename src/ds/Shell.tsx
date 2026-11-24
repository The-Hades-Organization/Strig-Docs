import type { ReactNode } from 'react';
import { Header } from './Header';

// Three regions: sidebar, content, toc. Narrow screens fold the sidebar into
// the header menu and drop the toc below the title.
export function Shell({
  sidebar,
  toc,
  top,
  panel,
  children,
}: {
  sidebar?: ReactNode;
  toc?: ReactNode;
  // A row between the header and the body, such as the documentation tabs.
  top?: ReactNode;
  // The right column holds a wide panel instead of the table of contents.
  panel?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header nav={sidebar} />
      {top}
      <div
        className="shell-body"
        data-has-sidebar={sidebar ? 'true' : 'false'}
        data-has-toc={toc ? 'true' : 'false'}
        data-aside={panel ? 'panel' : undefined}
      >
        {sidebar ? <aside className="shell-sidebar">{sidebar}</aside> : null}
        <main id="content" className="shell-main">
          {children}
        </main>
        {toc ? <aside className="shell-toc">{toc}</aside> : null}
      </div>
    </div>
  );
}
