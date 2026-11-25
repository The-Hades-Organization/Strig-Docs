import type { ReactNode } from 'react';
import { CodeLines } from './CodeLines';
import { Seal, type Verdict } from './Seal';
import { SwapTabs } from './Tabs';
import { Trail, type TrailStep } from './Trail';

export type CourtCase = {
  id: string;
  // The question as the switcher names it: "Export invoice d1".
  question: string;
  // The request, in Rust.
  request: string;
  verdict: Verdict;
  reason: ReactNode;
  steps: TrailStep[];
  foot: ReactNode;
};

// One real decision: the request on the left, the ruling on the right (the seal, then the resource
// path with each grant's fate), and a switcher on top between questions asked of the same grants.
// The first case is the one shown without JavaScript, with no switcher.
export function CourtPanel({ cases, note, label = 'Question' }: { cases: CourtCase[]; note?: ReactNode; label?: string }) {
  return (
    <SwapTabs
      label={label}
      className="court"
      barClassName="court-bar"
      aside={note ? <span className="court-note">{note}</span> : null}
      tabs={cases.map((c) => ({
        id: c.id,
        label: c.question,
        panel: (
          <div className="court-body">
            <div className="court-request">
              <p className="code-frame-cap">Request · Rust</p>
              <CodeLines code={c.request} lang="rust" />
            </div>
            <div className="court-ruling">
              <div className="court-seal">
                <Seal verdict={c.verdict} reason={c.reason} />
              </div>
              <Trail steps={c.steps} label="Resource path, broad to specific" foot={c.foot} />
            </div>
          </div>
        ),
      }))}
    />
  );
}
