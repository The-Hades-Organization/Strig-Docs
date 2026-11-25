import type { ReactNode } from 'react';
import type { Verdict } from '../../ds/Seal';
import type { TrailStep } from '../../ds/Trail';

// The bench: the example beside the text of a doc page. A page lists its
// sections (each anchored to an id in the prose) and its cases (each one
// question the engine answers, shown in the bench of its section).

export type BenchLang = 'rust' | 'node';

// One code pane in the bench, rendered with CodeBlock.
export type BenchCode = {
  // Caption of the pane: "Request · Rust", "Terminal", "src/main.rs".
  title: string;
  code: string;
  // A language CodeBlock knows: rust, ts, json, rules, blocks, actors, text.
  lang: string;
};

export type BenchCase = {
  // Unique on the page; what <Run case="..."> and <CellPick case="..."> name.
  id: string;
  // The id of the BenchSection this case belongs to.
  section: string;
  // Label of the case tab in the bench head. Tabs show only when a section has
  // more than one case.
  tab: string;
  // The question, as a sentence: "Can Bruno edit a document in Zephyr?"
  question?: string;
  // The verdict, shown as the seal under the question and as the tag on the
  // case tab and on Run buttons.
  verdict?: Verdict;
  // The line under the seal's word: "Denied by g-seal, on folder:legal at rank 1."
  reason?: ReactNode;
  // The resource path, specific to broad, with the fate of each step.
  trail?: { steps: TrailStep[]; foot?: ReactNode };
  // Code panes per language. With `node`, the bench head shows a Rust/Node switch.
  code?: { rust: BenchCode[]; node?: BenchCode[] };
  // What the program prints, exactly as printed. Engine text in Portuguese
  // stays as printed; list those strings in `portuguese` so they carry lang="pt".
  output?: { text: string; label?: string; hint?: string; open?: boolean; portuguese?: string[] };
  // A short line after the case.
  note?: ReactNode;
  // What a <Run case="..."> button shows: the command, and the tag when the
  // case has no verdict (a verdict is shown as its own tag).
  run?: { command: string; tag?: string };
};

export type BenchSection = {
  // The id of the element in the prose this section explains: an h2, or any
  // element with that id. Scrolling it into view brings this section to the bench.
  id: string;
  // Title in the bench head.
  title: string;
  // File name beside the title, per language when it changes with the switch.
  file?: string | Record<BenchLang, string>;
  // Accessible name of the case tabs. Default: "Examples in this section".
  tabsLabel?: string;
  // Shared by every case of the section, after the case.
  note?: ReactNode;
  // The policy the cases run against, after the note.
  policy?: { file: string; code: string; lang: string };
  // Label in the "On this page" bar when `id` is not an h2 (the bar lists h2s
  // only). Such sections come first in the bar, before the headings.
  onPage?: string;
};

export type PageBench = {
  sections: BenchSection[];
  cases: BenchCase[];
};
