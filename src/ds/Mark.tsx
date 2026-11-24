import { useId } from 'react';
import { WORDMARK_PATH, WORDMARK_TRANSFORM, WORDMARK_VIEWBOX } from './wordmark-path';

// Corte: a full moon with a bite taken out, the fangs being the missing piece.
// The colour is --c-mark, which is the brand primary of the active theme.
const FANGS =
  'M19.5 -1H28.5C28.5 15.5 27.3 26.72 25.5 32C23.7 26.72 19.5 15.5 19.5 -1Z M35.5 -1H44.5C44.5 15.5 40.3 26.72 38.5 32C36.7 26.72 35.5 15.5 35.5 -1Z';

export function Mark({ size = 32 }: { size?: number }) {
  const maskId = useId();
  return (
    <svg className="mark" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="-2" width="64" height="66">
          <rect x="0" y="-2" width="64" height="66" fill="#fff" />
          <path d={FANGS} fill="#000" />
        </mask>
      </defs>
      <circle className="mark-disc" cx="32" cy="32" r="29" mask={`url(#${maskId})`} />
    </svg>
  );
}

export function Wordmark({ height = 18 }: { height?: number }) {
  return (
    <svg className="wordmark" viewBox={WORDMARK_VIEWBOX} height={height} role="img" aria-label="Strig">
      <path d={WORDMARK_PATH} transform={WORDMARK_TRANSFORM} />
    </svg>
  );
}
