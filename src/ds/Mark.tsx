import { WORDMARK_PATH, WORDMARK_VIEWBOX } from './wordmark-path';

// The icon of the banner: split disc, band tilted by the band angle, gilt knot.
// `open` draws the allow state (gap open), `closed` the deny state (gap shut).
export type MarkState = 'rest' | 'open' | 'closed';

const GAP_SCALE: Record<MarkState, number> = { rest: 1, open: 1, closed: 0.1 };

export function Mark({ state = 'rest', size = 32 }: { state?: MarkState; size?: number }) {
  const scale = GAP_SCALE[state];
  return (
    <svg
      className="mark"
      viewBox="70 96 400 320"
      width={(size * 400) / 320}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <circle className="mark-disc" cx="236" cy="256" r="150" />
      <g transform="rotate(-9 256 256)">
        <rect
          className="mark-gap"
          x="70"
          y="222"
          width="340"
          height="64"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scaleY(${scale})` }}
        />
        <g className="mark-knot">
          <circle cx="400" cy="254" r="30" />
          <path d="M412 270 L456 360 L428 366 Z M396 278 L404 380 L376 372 Z" />
        </g>
      </g>
    </svg>
  );
}

export function Wordmark({ height = 18 }: { height?: number }) {
  return (
    <svg
      className="wordmark"
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      role="img"
      aria-label="Themis"
    >
      <path d={WORDMARK_PATH} />
    </svg>
  );
}
