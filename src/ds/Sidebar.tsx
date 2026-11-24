import type { Node, Root } from 'fumadocs-core/page-tree';

function Entry({ node, current }: { node: Node; current: string }) {
  if (node.type === 'separator') {
    return <li className="side-heading">{node.name}</li>;
  }
  if (node.type === 'page') {
    const active = node.url === current;
    return (
      <li>
        <a className="side-link" href={node.url} aria-current={active ? 'page' : undefined}>
          {node.name}
        </a>
      </li>
    );
  }
  const holdsCurrent = containsUrl(node.children, current) || node.index?.url === current;
  return (
    <li>
      <details className="side-folder" open={node.defaultOpen === true || holdsCurrent}>
        <summary>{node.name}</summary>
        <ul>
          {node.index ? (
            <li>
              <a
                className="side-link"
                href={node.index.url}
                aria-current={node.index.url === current ? 'page' : undefined}
              >
                {node.index.name}
              </a>
            </li>
          ) : null}
          {node.children.map((child, index) => (
            <Entry key={`${child.type}-${index}`} node={child} current={current} />
          ))}
        </ul>
      </details>
    </li>
  );
}

function containsUrl(nodes: Node[], url: string): boolean {
  return nodes.some((node) => {
    if (node.type === 'page') return node.url === url;
    if (node.type === 'folder') return node.index?.url === url || containsUrl(node.children, url);
    return false;
  });
}

export function Sidebar({ tree, current }: { tree: Root; current: string }) {
  return (
    <nav className="sidebar" aria-label="Documentation">
      <ul>
        {tree.children.map((node, index) => (
          <Entry key={`${node.type}-${index}`} node={node} current={current} />
        ))}
      </ul>
    </nav>
  );
}
