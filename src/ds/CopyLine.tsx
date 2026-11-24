'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './icons';

const COPIED_RESET_MS = 1800;

// One install command with a button that copies it.
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
      <button type="button" onClick={copy} aria-label={`Copy the ${label} command`} aria-live="polite">
        <Icon name={copied ? 'check' : 'copy'} size={16} />
      </button>
    </div>
  );
}
