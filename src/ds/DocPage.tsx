import type { ComponentType, ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import type { PageBench } from '../content/bench/types';
import { Bench } from './Bench';
import { DocProvider, type CaseMeta } from './DocState';
import { DocTabs } from './DocTabs';
import { mdxComponents } from './mdx';
import { OnPage, type OnPageItem } from './OnPage';
import { PageTree } from './PageTree';
import { Shell } from './Shell';
import { SyntaxPanel } from './SyntaxPanel';

export type TocItem = { title: ReactNode; url: string; depth: number };

type DocPageProps = {
  tree: Root;
  url: string;
  title: string;
  description?: string;
  toc: TocItem[];
  Body: ComponentType<{ components?: typeof mdxComponents }>;
  // The example beside the text, when the page has one.
  bench?: PageBench;
  // Pages about the policy language pin the three syntaxes beside the text.
  withSyntaxPanel?: boolean;
};

// The layout of every documentation page (direction "the bench"): the header
// with the Pages menu, a bar with the section tabs and the page contents, then
// the text on the left and, beside it, the bench (or the syntax panel). A page
// with neither is one reading column, centred, with no room kept for a bench.
export function DocPage({ tree, url, title, description, toc, Body, bench, withSyntaxPanel }: DocPageProps) {
  const headings: OnPageItem[] = toc
    .filter((item) => item.depth === 2)
    .map((item) => ({ id: item.url.replace(/^#/, ''), title: item.title }));
  const anchored: OnPageItem[] = (bench?.sections ?? [])
    .filter((section) => section.onPage !== undefined && !headings.some((h) => h.id === section.id))
    .map((section) => ({ id: section.id, title: section.onPage }));
  const items = [...anchored, ...headings];
  const spy = [...items.map((item) => item.id), ...(bench?.sections ?? []).map((s) => s.id)].filter(
    (id, index, all) => all.indexOf(id) === index,
  );
  const cases: CaseMeta[] = (bench?.cases ?? []).map((c) => ({
    id: c.id,
    section: c.section,
    tab: c.tab,
    verdict: c.verdict,
    run: c.run,
  }));

  const aside = bench ? <Bench bench={bench} /> : withSyntaxPanel ? <SyntaxPanel /> : null;

  return (
    <DocProvider spy={spy} cases={cases}>
      <Shell
        ownMain
        pages={<PageTree tree={tree} current={url} />}
        bar={
          <div className="doc-bar" data-rows={items.length > 0 ? '2' : '1'}>
            <DocTabs tree={tree} current={url} />
            <OnPage title={title} items={items} />
          </div>
        }
      >
        <div className="doc-body" data-aside={aside ? '' : undefined}>
          <main id="content" className="doc-main">
            <article className="prose doc-article">
              <h1>{title}</h1>
              {description ? <p className="prose-lead">{description}</p> : null}
              <Body components={mdxComponents} />
            </article>
          </main>
          {aside}
        </div>
      </Shell>
    </DocProvider>
  );
}
