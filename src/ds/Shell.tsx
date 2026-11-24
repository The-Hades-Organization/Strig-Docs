import type { ReactNode } from 'react';
import { Header } from './Header';

// Three regions: sidebar, content, toc. Narrow screens fold the sidebar into
// the header menu and drop the toc below the title.
export function Shell({
  sidebar,
  toc,
  children,
}: {
  sidebar?: ReactNode;
  toc?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header nav={sidebar} />
      <div className="shell-body" data-has-sidebar={sidebar ? 'true' : 'false'} data-has-toc={toc ? 'true' : 'false'}>
        {sidebar ? <aside className="shell-sidebar">{sidebar}</aside> : null}
        <main id="content" className="shell-main">
          {children}
        </main>
        {toc ? <aside className="shell-toc">{toc}</aside> : null}
      </div>
    </div>
  );
}
