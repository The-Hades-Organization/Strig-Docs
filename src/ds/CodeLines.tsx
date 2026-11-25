import { highlight, resolveLanguage } from './highlight';

// Highlighted code for a frame the page draws itself, with no caption or copy button of its own.
// The words take the same roles and colours as in CodeBlock, and the text is rendered as given.
export function CodeLines({ code, lang, label }: { code: string; lang: string; label?: string }) {
  const lines = highlight(code, resolveLanguage(lang));
  return (
    <pre className="code-lines" tabIndex={0} aria-label={label}>
      <code>
        {lines.map((tokens, index) => (
          <span key={index}>
            {index > 0 ? '\n' : null}
            {tokens.map((token, i) =>
              token.role === 'plain' ? (
                token.text
              ) : (
                <span className={`t-${token.role}`} key={i}>
                  {token.text}
                </span>
              ),
            )}
          </span>
        ))}
      </code>
    </pre>
  );
}
