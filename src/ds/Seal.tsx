import { Icon } from './icons';
import { Mark } from './Mark';

export type Verdict = 'allow' | 'deny';

const WORD: Record<Verdict, string> = { allow: 'Allow', deny: 'Deny' };

// Verdict seal. The word comes first, then the icon,
// then the colour, so the decision never depends on colour alone.
export function Seal({ verdict, reason }: { verdict: Verdict; reason?: string }) {
  return (
    <div className="seal" data-verdict={verdict}>
      <Mark size={44} />
      <div className="seal-text">
        <p className="seal-word">
          <Icon name={verdict === 'allow' ? 'check' : 'x'} size={20} />
          {WORD[verdict]}
        </p>
        {reason ? <p className="seal-reason">{reason}</p> : null}
      </div>
    </div>
  );
}

// Compact inline form for tables and prose.
export function VerdictTag({ verdict }: { verdict: Verdict }) {
  return (
    <span className="verdict-tag" data-verdict={verdict}>
      <Icon name={verdict === 'allow' ? 'check' : 'x'} size={14} />
      {WORD[verdict]}
    </span>
  );
}
