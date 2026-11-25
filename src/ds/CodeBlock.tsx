'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { highlight, resolveLanguage } from './highlight';

// How long the button reads "Copied" before it goes back to "Copy".
const COPIED_RESET_MS = 2000;

const LANGUAGE_LABEL = {
  blocks: 'Blocks',
  rules: 'Rules',
  actors: 'Actors',
  rust: 'Rust',
  ts: 'TypeScript',
  json: 'JSON',
  text: 'Text',
} as const;

export function CodeBlock({
  code,
  lang,
  title,
  wrap = false,
  flush = false,
}: {
  code: string;
  lang?: string;
  title?: string;
  /** Wrap long lines instead of scrolling sideways. For narrow columns read beside the text. */
  wrap?: boolean;
  /** Drop the outer margin, side borders and radius, for a block that sits inside a panel. */
  flush?: boolean;
}) {
  const language = resolveLanguage(lang);
  const lines = highlight(code, language);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The reset timer has an owner: it is cleared on unmount.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.replace(/\n$/, ''));
    } catch {
      setCopied(false);
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <figure
      className="code-block"
      data-lang={language}
      data-wrap={wrap ? '' : undefined}
      data-flush={flush ? '' : undefined}
    >
      <figcaption className="code-head">
        <span className="code-label">{title ?? LANGUAGE_LABEL[language]}</span>
        <button type="button" className="code-copy" onClick={copy} data-copied={copied ? '' : undefined}>
          {/* Both labels share one grid cell, so the button keeps its width when the label swaps. */}
          <span className="code-copy-swap">
            <span data-hidden={copied ? '' : undefined} aria-hidden={copied ? true : undefined}>
              <Icon name="copy" size={16} />
              Copy
            </span>
            <span data-hidden={copied ? undefined : ''} aria-hidden={copied ? undefined : true}>
              <Icon name="check" size={16} />
              Copied
            </span>
          </span>
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>
          {lines.map((tokens, index) => (
            <span className="code-line" key={index}>
              {tokens.map((token, i) =>
                token.role === 'plain' ? (
                  token.text
                ) : (
                  <span className={`t-${token.role}`} key={i}>
                    {token.text}
                  </span>
                ),
              )}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
      {/* Announces the copy without changing the caption's accessible name. */}
      <span className="sr-only" role="status">
        {copied ? 'Copied' : ''}
      </span>
    </figure>
  );
}
