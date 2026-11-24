import type { ReactNode } from 'react';

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Themis</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
