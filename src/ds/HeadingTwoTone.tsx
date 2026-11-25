import type { ReactNode } from 'react';

// A heading in two tones: the claim in ink, then a quieter clause that qualifies it.
// Both are one heading, so a screen reader reads them as one sentence pair.
export function HeadingTwoTone({
  level,
  id,
  claim,
  quiet,
}: {
  level: 1 | 2;
  id?: string;
  claim: ReactNode;
  quiet?: ReactNode;
}) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag className="heading-two-tone" data-level={level} id={id}>
      {claim}
      {quiet ? (
        <>
          {' '}
          <span className="heading-quiet">{quiet}</span>
        </>
      ) : null}
    </Tag>
  );
}
