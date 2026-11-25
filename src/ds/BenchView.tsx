'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { BenchLang } from '../content/bench/types';
import { useDoc } from './DocState';
import { Icon } from './icons';
import { VerdictTag } from './Seal';

export type BenchViewCase = {
  id: string;
  before: ReactNode;
  rust: ReactNode;
  node?: ReactNode;
  after: ReactNode;
};

export type BenchViewSection = {
  id: string;
  title: string;
  file?: string | Record<BenchLang, string>;
  tabsLabel: string;
  // Empty when the section has a single case.
  tabs: { id: string; label: ReactNode }[];
  // The section has Node code: the head shows the Rust/Node switch.
  languages: boolean;
  cases: BenchViewCase[];
  tail: ReactNode;
};

const LANGS: { id: BenchLang; label: string }[] = [
  { id: 'rust', label: 'Rust' },
  { id: 'node', label: 'Node' },
];

function LangTabs({ panelOf }: { panelOf: (lang: BenchLang) => string }) {
  const { lang, setLang } = useDoc();
  const base = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const index = LANGS.findIndex((l) => l.id === lang);
    const next = (index + step + LANGS.length) % LANGS.length;
    const target = LANGS[next];
    if (!target) return;
    setLang(target.id);
    buttons.current[next]?.focus();
  };

  return (
    <div className="bench-tabs" role="tablist" aria-label="Language" onKeyDown={move}>
      {LANGS.map((l, index) => (
        <button
          key={l.id}
          ref={(element) => {
            buttons.current[index] = element;
          }}
          id={`${base}-${l.id}`}
          type="button"
          role="tab"
          className="bench-tab"
          aria-selected={lang === l.id}
          aria-controls={panelOf(l.id)}
          tabIndex={lang === l.id ? 0 : -1}
          onClick={() => setLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

// Cases of a section share one grid cell, and so do the Rust and Node panes of
// a case: switching shows another layer in place, so the bench never changes
// height on a switch. Layers not shown are inert and invisible.
export function BenchView({ sections }: { sections: BenchViewSection[] }) {
  const { shown, lang, cases, pick, wide, sheetOpen, setSheetOpen } = useDoc();
  const base = useId();
  const bodyId = useId();
  // Scripts run: below 78rem the bench becomes a sheet at the foot of the
  // screen. Without them it stays a block after the text, all of it visible.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const sheet = ready && !wide;
  const now = shown ? cases[shown] : undefined;
  const shownSection = (shown ? cases[shown]?.section : undefined) ?? sections[0]?.id;

  return (
    <aside
      className="bench"
      aria-label="The example for this page"
      data-sheet={sheet ? (sheetOpen ? 'open' : 'closed') : undefined}
    >
      {sheet ? (
        <button
          type="button"
          className="bench-toggle"
          aria-expanded={sheetOpen}
          aria-controls={bodyId}
          onClick={() => setSheetOpen(!sheetOpen)}
        >
          <span className="bench-label">Bench</span>
          {now?.verdict ? <VerdictTag verdict={now.verdict} /> : null}
          <span className="bench-toggle-case">{now?.tab}</span>
          <span className="bench-toggle-chevron">
            <Icon name="chevron-down" size={16} />
          </span>
        </button>
      ) : null}
      <div id={bodyId} className="bench-body">
        {sections.map((section) => {
          const current = section.cases.find((c) => c.id === shown) ?? section.cases[0];
          const file =
            typeof section.file === 'string' || section.file === undefined
              ? section.file
              : section.file[lang];
          const panelOf = (l: BenchLang) => `${base}-${current?.id ?? section.id}-${l}`;
          return (
            <div key={section.id} className="bench-section" hidden={section.id !== shownSection}>
              <div
                className="bench-head"
                data-flat={section.tabs.length === 0 && !section.languages ? '' : undefined}
              >
                <p className="bench-title">
                  <span>{section.title}</span>
                  {file ? <span className="bench-file">{file}</span> : null}
                </p>
                {section.tabs.length > 0 ? (
                  <div className="bench-tabs" role="group" aria-label={section.tabsLabel}>
                    {section.tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className="bench-tab"
                        aria-pressed={tab.id === current?.id}
                        onClick={() => pick(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                {section.languages ? <LangTabs panelOf={panelOf} /> : null}
              </div>
              <div className="bench-stack">
                {section.cases.map((c) => {
                  const on = c.id === current?.id;
                  const showNode = lang === 'node' && c.node !== undefined;
                  return (
                    <div key={c.id} className="bench-case" data-on={on ? '' : undefined} inert={!on}>
                      {c.before}
                      {c.node !== undefined ? (
                        <div className="bench-stack">
                          <div
                            className="bench-layer"
                            id={`${base}-${c.id}-rust`}
                            role="tabpanel"
                            aria-label="Rust"
                            data-on={showNode ? undefined : ''}
                            inert={showNode}
                          >
                            {c.rust}
                          </div>
                          <div
                            className="bench-layer"
                            id={`${base}-${c.id}-node`}
                            role="tabpanel"
                            aria-label="Node"
                            data-on={showNode ? '' : undefined}
                            inert={!showNode}
                          >
                            {c.node}
                          </div>
                        </div>
                      ) : (
                        c.rust
                      )}
                      {c.after}
                    </div>
                  );
                })}
              </div>
              {section.tail}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
