import type { ReactNode } from 'react';
import type { BenchCase, BenchCode, PageBench } from '../content/bench/types';
import { BenchView, type BenchViewCase, type BenchViewSection } from './BenchView';
import { CodeBlock } from './CodeBlock';
import { Seal, VerdictTag } from './Seal';
import { Trail } from './Trail';

function Panes({ panes }: { panes: BenchCode[] }) {
  return (
    <div className="bench-code">
      {panes.map((pane) => (
        <CodeBlock key={pane.title} code={pane.code} lang={pane.lang} title={pane.title} wrap flush />
      ))}
    </div>
  );
}

// Marks the engine's Portuguese strings with lang="pt" so they are read in
// the right language; the text itself is left exactly as printed.
function withPortuguese(text: string, portuguese: string[] = []): ReactNode[] {
  let parts: ReactNode[] = [text];
  portuguese.forEach((phrase, n) => {
    parts = parts.flatMap((part): ReactNode[] => {
      if (typeof part !== 'string' || !part.includes(phrase)) return [part];
      const pieces = part.split(phrase);
      return pieces.flatMap((piece, i) =>
        i === 0
          ? [piece]
          : [
              <span lang="pt" key={`${n}-${i}`}>
                {phrase}
              </span>,
              piece,
            ],
      );
    });
  });
  return parts;
}

function Output({ output }: { output: NonNullable<BenchCase['output']> }) {
  const lines = output.text.split('\n').length;
  return (
    <details className="bench-out" open={output.open ?? true}>
      <summary>
        <span className="bench-label">{output.label ?? 'Output'}</span>
        <span className="bench-out-hint">{output.hint ?? `JSON, ${lines} lines`}</span>
      </summary>
      <pre tabIndex={0}>{withPortuguese(output.text, output.portuguese)}</pre>
    </details>
  );
}

function caseView(c: BenchCase): BenchViewCase {
  return {
    id: c.id,
    before: (
      <>
        {c.question || c.verdict ? (
          <div className="bench-q">
            {c.question ? <p className="bench-question">{c.question}</p> : null}
            {c.verdict ? <Seal verdict={c.verdict} reason={c.reason} /> : null}
          </div>
        ) : null}
        {c.trail ? (
          <div className="bench-block">
            <Trail steps={c.trail.steps} label="Resource path, specific to broad" foot={c.trail.foot} />
          </div>
        ) : null}
      </>
    ),
    rust: c.code ? <Panes panes={c.code.rust} /> : null,
    node: c.code?.node ? <Panes panes={c.code.node} /> : undefined,
    after: (
      <>
        {c.output ? <Output output={c.output} /> : null}
        {c.note ? <p className="bench-note">{c.note}</p> : null}
      </>
    ),
  };
}

// The bench: the example of the section in view, beside the text. Every
// section and case is rendered here, on the server; the client only chooses
// which one shows.
export function Bench({ bench }: { bench: PageBench }) {
  const sections: BenchViewSection[] = bench.sections.map((section) => {
    const cases = bench.cases.filter((c) => c.section === section.id);
    return {
      id: section.id,
      title: section.title,
      file: section.file,
      tabsLabel: section.tabsLabel ?? 'Examples in this section',
      tabs:
        cases.length > 1
          ? cases.map((c) => ({
              id: c.id,
              label: (
                <>
                  {c.verdict ? <VerdictTag verdict={c.verdict} /> : null}
                  <span>{c.tab}</span>
                </>
              ),
            }))
          : [],
      languages: cases.some((c) => c.code?.node !== undefined),
      cases: cases.map(caseView),
      tail: (
        <>
          {section.note ? <p className="bench-note">{section.note}</p> : null}
          {section.policy ? (
            <Panes panes={[{ title: section.policy.file, code: section.policy.code, lang: section.policy.lang }]} />
          ) : null}
        </>
      ),
    };
  });
  return <BenchView sections={sections} />;
}
