'use client';

import { useTheme } from './useTheme';

// An image that exists in a light and a dark variant (`<name>-light.webp`, `<name>-dark.webp`).
// Only the variant of the active theme is requested; a theme change swaps the src in place.
export function ThemedImage({
  name,
  alt,
  width,
  height,
  priority = false,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const theme = useTheme();
  return (
    <>
      <img
        src={theme ? `${name}-${theme}.webp` : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      <noscript>
        <img src={`${name}-light.webp`} alt={alt} width={width} height={height} />
      </noscript>
    </>
  );
}
