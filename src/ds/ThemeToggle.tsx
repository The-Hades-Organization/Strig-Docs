'use client';

import { useEffect, useState } from 'react';
import { THEME_KEY, type ThemeChoice } from './theme';

function readTheme(): ThemeChoice {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice | null>(null);

  useEffect(() => {
    setTheme(readTheme());
    const media = matchMedia('(prefers-color-scheme: dark)');
    const follow = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        stored = null;
      }
      if (stored) return;
      const next: ThemeChoice = event.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    media.addEventListener('change', follow);
    return () => media.removeEventListener('change', follow);
  }, []);

  const flip = () => {
    const next: ThemeChoice = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked; the choice then lasts for this page only.
    }
  };

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
