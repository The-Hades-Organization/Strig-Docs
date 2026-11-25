import type { ReactNode } from 'react';
import { Header } from './Header';

// The page frame: skip link, header, an optional bar pinned under it, then the
// body. By default the body is one centred column inside <main>; a layout that
// places its own <main id="content"> passes `ownMain`.
export function Shell({
  pages,
  bar,
  ownMain,
  children,
}: {
  // The page tree, shown by the header's Pages menu.
  pages?: ReactNode;
  // Pinned under the header, such as the section tabs and page contents.
  bar?: ReactNode;
  ownMain?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header pages={pages} />
      {bar}
      {ownMain ? (
        children
      ) : (
        <div className="shell-body">
          <main id="content" className="shell-main">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
