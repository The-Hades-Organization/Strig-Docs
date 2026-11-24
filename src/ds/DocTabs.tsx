import type { Node, Root } from 'fumadocs-core/page-tree';
import { docIcon } from './doc-icons';
import { Icon } from './icons';

type Section = { name: string; url: string; current: boolean };

function sections(tree: Root, current: string): Section[] {
  const out: Section[] = [];
  for (const node of tree.children) {
    if (node.type === 'page') {
      out.push({ name: String(node.name), url: node.url, current: node.url === current });
    } else if (node.type === 'folder' && node.index) {
      out.push({
        name: String(node.name),
        url: node.index.url,
        current: current === node.index.url || holds(node.children, current),
      });
    }
  }
  return out;
}

function holds(nodes: Node[], url: string): boolean {
  return nodes.some((node) =>
    node.type === 'page' ? node.url === url : node.type === 'folder' ? holds(node.children, url) : false,
  );
}

// The top-level sections as a row of tabs, each with its icon. The row
// scrolls on its own when it outgrows the width.
export function DocTabs({ tree, current }: { tree: Root; current: string }) {
  return (
    <nav className="doc-tabs" aria-label="Sections">
      <ul>
        {sections(tree, current).map((section) => {
          const icon = docIcon(section.url);
          return (
            <li key={section.url}>
              <a href={section.url} aria-current={section.current ? 'page' : undefined}>
                {icon ? <Icon name={icon} size={16} /> : null}
                {section.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
