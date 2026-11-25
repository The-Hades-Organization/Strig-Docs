'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { BenchLang } from '../content/bench/types';
import type { Verdict } from './Seal';

// What the client knows of each bench case: enough to draw a Run button and
// to find the case's section.
export type CaseMeta = {
  id: string;
  section: string;
  verdict?: Verdict;
  run?: { command: string; tag?: string };
};

type DocState = {
  // The id of the section in view, for the "On this page" bar.
  location: string | null;
  // The case the bench shows.
  shown: string | null;
  lang: BenchLang;
  cases: Record<string, CaseMeta>;
  pick: (caseId: string) => void;
  setLang: (lang: BenchLang) => void;
};

const NOOP = () => undefined;

const DocContext = createContext<DocState>({
  location: null,
  shown: null,
  lang: 'rust',
  cases: {},
  pick: NOOP,
  setLang: NOOP,
});

export function useDoc(): DocState {
  return useContext(DocContext);
}

// Two columns from 80rem up (src/styles/doc.css); below, the bench follows the text.
const WIDE_QUERY = '(min-width: 80.0625rem)';

function subscribeWide(onChange: () => void) {
  const media = matchMedia(WIDE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
const readWide = () => matchMedia(WIDE_QUERY).matches;
const readWideOnServer = () => false;

// A heading counts as in view once its top passes the line where targeted
// headings land: its own scroll-margin-top under the header and the bar.
function sectionInView(targets: HTMLElement[]): string | null {
  const first = targets[0];
  if (!first) return null;
  const root = document.documentElement;
  // At the end of the page the last sections never reach the line: the last one wins.
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
    return targets[targets.length - 1]?.id ?? null;
  }
  let found = first.id;
  for (const target of targets) {
    const line = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    if (target.getBoundingClientRect().top - line <= 1) found = target.id;
    else break;
  }
  return found;
}

// Holds the section in view (scroll-spy) and the case the bench shows. From
// 80rem up the bench follows the section in view; below, it keeps the case
// picked last. Before scripts run, the first case of the first section shows.
export function DocProvider({
  spy,
  cases,
  children,
}: {
  // Ids of the elements the "On this page" bar and the bench follow.
  spy: string[];
  cases: CaseMeta[];
  children: ReactNode;
}) {
  const byId = useMemo(() => Object.fromEntries(cases.map((c) => [c.id, c])), [cases]);
  const firstOf = useMemo(() => {
    const out: Record<string, string> = {};
    for (const c of cases) out[c.section] ??= c.id;
    return out;
  }, [cases]);
  const firstCase = cases[0]?.id ?? null;

  const [location, setLocation] = useState<string | null>(spy[0] ?? null);
  const [benchSection, setBenchSection] = useState<string | null>(cases[0]?.section ?? null);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [last, setLast] = useState<string | null>(null);
  const [lang, setLang] = useState<BenchLang>('rust');
  const wide = useSyncExternalStore(subscribeWide, readWide, readWideOnServer);

  const spyKey = spy.join(' ');

  // The scroll listener has an owner: removed, and its frame cancelled, on unmount.
  useEffect(() => {
    const targets = spyKey
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (targets.length === 0) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const id = sectionInView(targets);
      if (id === null) return;
      setLocation(id);
      if (id in firstOf) setBenchSection(id);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [spyKey, firstOf]);

  const pick = useCallback(
    (caseId: string) => {
      const meta = byId[caseId];
      if (!meta) return;
      setPicked((current) => ({ ...current, [meta.section]: caseId }));
      setLast(caseId);
      setBenchSection(meta.section);
    },
    [byId],
  );

  const shown = wide
    ? benchSection === null
      ? firstCase
      : (picked[benchSection] ?? firstOf[benchSection] ?? firstCase)
    : (last ?? firstCase);

  const value = useMemo<DocState>(
    () => ({ location, shown, lang, cases: byId, pick, setLang }),
    [location, shown, lang, byId, pick],
  );

  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
}
