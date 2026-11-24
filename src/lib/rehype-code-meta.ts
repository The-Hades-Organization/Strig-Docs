// The markdown compiler keeps the text after the language of a code fence
// (```rules title="a.rules") in node.data.meta, which never reaches React.
// This plugin copies it to a data-meta attribute on the code element.

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  data?: { meta?: string };
  children?: HastNode[];
};

function visit(node: HastNode) {
  if (node.type === 'element' && node.tagName === 'code' && node.data?.meta) {
    node.properties = { ...node.properties, 'data-meta': node.data.meta };
  }
  node.children?.forEach(visit);
}

export function rehypeCodeMeta() {
  return (tree: HastNode) => visit(tree);
}
