import { flattenTree, type Root } from 'fumadocs-core/page-tree';

// Sections as a row of tabs under the header: the page tree, flattened in
// reading order. The row scrolls on its own when it outgrows the width.
export function DocTabs({ tree, current }: { tree: Root; current: string }) {
  const pages = flattenTree(tree.children);
  return (
    <nav className="doc-tabs" aria-label="Sections">
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            <a href={page.url} aria-current={page.url === current ? 'page' : undefined}>
              {page.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
