import { CodeBlock } from './CodeBlock';
import { SYNTAXES } from './syntaxes';

// The same policy in Blocks, Rules and Actors, pinned beside the text of the
// pages that teach the policy language.
export function SyntaxPanel() {
  return (
    <aside className="doc-panel" aria-label="The same policy in each syntax">
      {SYNTAXES.map((syntax) => (
        <CodeBlock key={syntax.lang} code={syntax.code} lang={syntax.lang} />
      ))}
    </aside>
  );
}
