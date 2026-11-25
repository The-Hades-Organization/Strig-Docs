import { useId, type ReactNode } from 'react';
import { Icon } from './icons';
import type { Verdict } from './Seal';

export type TrailStep = {
  // The step of the resource path, as the engine names it: `org:acme`.
  step: string;
  // What became of the grants on this step, in a sentence.
  fate: ReactNode;
  // Set on the one step whose grant decided the answer.
  decides?: Verdict;
  // A step with no grant: the fate is set in the muted colour.
  quiet?: boolean;
  // Optional second line under the step, such as its rank.
  rank?: ReactNode;
};

// The resource path, broad to specific, each step with the fate of its grants.
// The deciding step carries the verdict's tint, its icon and the word
// "Decides." in its fate, so it never relies on colour alone.
export function Trail({ steps, label, foot }: { steps: TrailStep[]; label?: ReactNode; foot?: ReactNode }) {
  const labelId = useId();
  return (
    <div className="trail">
      {label ? (
        <p className="trail-label" id={labelId}>
          {label}
        </p>
      ) : null}
      <ol className="trail-list" aria-labelledby={label ? labelId : undefined}>
        {steps.map((s) => (
          <li key={s.step} data-decides={s.decides} data-quiet={s.quiet ? '' : undefined}>
            <span className="trail-step">
              <span className="trail-step-name">
                {s.decides ? <Icon name={s.decides === 'allow' ? 'check' : 'x'} size={14} /> : null}
                {s.step}
              </span>
              {s.rank ? <span className="trail-rank">{s.rank}</span> : null}
            </span>
            <span className="trail-fate">{s.fate}</span>
          </li>
        ))}
      </ol>
      {foot ? <p className="trail-foot">{foot}</p> : null}
    </div>
  );
}
