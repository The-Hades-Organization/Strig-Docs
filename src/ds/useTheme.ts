'use client';

import { useSyncExternalStore } from 'react';
import type { ThemeChoice } from './theme';

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function read(): ThemeChoice {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

// The active theme as the site resolved it (stored choice, then the system preference), kept in
// step with the toggle. It is null on the server and during hydration, so the markup matches.
export function useTheme(): ThemeChoice | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
