import type { Node, Root } from 'fumadocs-core/page-tree';
import { docIcon } from './doc-icons';
import { Icon } from './icons';

function PageLink({ url, name, current }: { url: string; name: Node['name']; current: string }) {
  const icon = docIcon(url);
  return (
    <a href={url} aria-current={url === current ? 'page' : undefined}>
      {icon ? <Icon name={icon} size={16} /> : null}
      {name}
    </a>
  );
}

function Entry({ node, current }: { node: Node; current: string }) {
  if (node.type === 'separator') {
    return <li className="page-tree-sep">{node.name}</li>;
  }
  if (node.type === 'page') {
    return (
      <li>
        <PageLink url={node.url} name={node.name} current={current} />
      </li>
    );
  }
  return (
    <li>
      {node.index ? (
        <PageLink url={node.index.url} name={node.name} current={current} />
      ) : (
        <span className="page-tree-sep">{node.name}</span>
      )}
      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child, index) => (
            <Entry key={`${child.type}-${index}`} node={child} current={current} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

// Every documentation page, as a tree: sections, then their pages indented.
// Lives in the header's Pages menu.
export function PageTree({ tree, current }: { tree: Root; current: string }) {
  return (
    <ul className="page-tree">
      {tree.children.map((node, index) => (
        <Entry key={`${node.type}-${index}`} node={node} current={current} />
      ))}
    </ul>
  );
}
