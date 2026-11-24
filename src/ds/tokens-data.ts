// The token names the design-system page documents. The values are never copied
// here: the page reads them from tokens.css through var(), so the page cannot drift.

export const COLOR_TOKENS = [
  { name: '--c-bg', role: 'Page' },
  { name: '--c-panel', role: 'Cards and controls' },
  { name: '--c-sunk', role: 'Editor and code well' },
  { name: '--c-line', role: 'Border, decorative' },
  { name: '--c-line-strong', role: 'Border, emphasis' },
  { name: '--c-ink', role: 'Text' },
  { name: '--c-mark', role: 'Mark and wordmark' },
  { name: '--c-mute', role: 'Secondary text' },
  { name: '--c-jade', role: 'Structure and allow' },
  { name: '--c-jade-bg', role: 'Allow surface' },
  { name: '--c-gold', role: 'Ornament and focus only' },
  { name: '--c-gold-ink', role: 'Who, where, numbers' },
  { name: '--c-gold-bg', role: 'Warning surface' },
  { name: '--c-deny', role: 'Deny' },
  { name: '--c-deny-bg', role: 'Deny surface' },
  { name: '--c-err', role: 'Defect in the text' },
  { name: '--c-comment', role: 'Comments' },
] as const;

export const SPACE_TOKENS = ['--s-1', '--s-2', '--s-3', '--s-4', '--s-5', '--s-6', '--s-7', '--s-8', '--s-9'] as const;
export const RADIUS_TOKENS = ['--r-1', '--r-2', '--r-3', '--r-pill'] as const;
export const SHADOW_TOKENS = ['--sh-1', '--sh-2', '--sh-3'] as const;
export const DURATION_TOKENS = ['--d-fast', '--d-base', '--d-seal'] as const;
export const TYPE_SIZE_TOKENS = ['--t-xs', '--t-sm', '--t-md', '--t-lg', '--t-xl', '--t-2xl', '--t-3xl'] as const;
export const LAYER_TOKENS = ['--z-base', '--z-sticky', '--z-overlay', '--z-modal', '--z-toast'] as const;
export const BREAKPOINT_TOKENS = ['--bp-sm', '--bp-md', '--bp-lg'] as const;
