'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './icons';

const COPIED_RESET_MS = 1800;

// One install command with a button that copies it. The button reads "Copy", then "Copied" for a
// moment; it keeps one width so the line never moves, and a live region beside it announces the copy.
export function CopyLine({ command, icon, label }: { command: string; icon: IconName; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <div className="copy-line">
      <Icon name={icon} size={16} />
      <code>{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy the ${label} command`}
        data-copied={copied ? '' : undefined}
      >
        <Icon name={copied ? 'check' : 'copy'} size={16} />
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  );
}
