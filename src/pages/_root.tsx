import type { ReactNode } from 'react';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/code.css';
import '../styles/shell.css';
import '../styles/design-system.css';
import '../styles/doc.css';
import '../styles/home.css';
import { THEME_INIT_SCRIPT } from '../ds/theme';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>Strig</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Constant string, no external input: sets the theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
