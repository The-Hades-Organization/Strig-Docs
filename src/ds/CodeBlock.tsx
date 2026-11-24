'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { highlight, resolveLanguage } from './highlight';

const COPIED_RESET_MS = 1800;

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
}: {
  code: string;
  lang?: string;
  title?: string;
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
    <figure className="code-block" data-lang={language}>
      <figcaption className="code-head">
        <span className="code-label">{title ?? LANGUAGE_LABEL[language]}</span>
        <button type="button" className="code-copy" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          <span>{copied ? 'Copied' : 'Copy'}</span>
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
    </figure>
  );
}
