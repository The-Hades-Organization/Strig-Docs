import { EXTRA_PATHS } from './icon-extra';
import { ICON_PATHS } from './icon-paths';

const PATHS = { ...ICON_PATHS, ...EXTRA_PATHS };

export type IconName = keyof typeof PATHS;

// Sharp set from the design system: filled polygons, no stroke, colour inherited.
// Sizes: 14 tags, 16 code captions, 18 buttons and callouts, 20 the seal, 24 emphasis.
// Use the -solid variant where the icon sits on a filled control.
export function Icon({ name, size = 18, label }: { name: IconName; size?: number; label?: string }) {
  const decorative = label === undefined;
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
