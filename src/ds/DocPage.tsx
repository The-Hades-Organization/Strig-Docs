import type { ComponentType } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import { Breadcrumbs } from './Breadcrumbs';
import { DocTabs } from './DocTabs';
import { mdxComponents } from './mdx';
import { Pager } from './Pager';
import { Shell } from './Shell';
import { Sidebar } from './Sidebar';
import { SyntaxPanel } from './SyntaxPanel';
import { Toc, type TocItem } from './Toc';

type DocPageProps = {
  tree: Root;
  url: string;
  title: string;
  description?: string;
  toc: TocItem[];
  Body: ComponentType<{ components?: typeof mdxComponents }>;
  // Pages about the policy language pin the three syntaxes beside the text.
  withSyntaxPanel?: boolean;
};

// The layout of every documentation page: icon tabs for the sections, the page
// tree on the left, the text, and on the right the table of contents (or, on
// the language pages, the syntax panel).
export function DocPage({ tree, url, title, description, toc, Body, withSyntaxPanel }: DocPageProps) {
  return (
    <Shell
      top={<DocTabs tree={tree} current={url} />}
      sidebar={<Sidebar tree={tree} current={url} />}
      toc={withSyntaxPanel ? <SyntaxPanel /> : <Toc items={toc} />}
      panel={withSyntaxPanel}
    >
      <article className="prose doc-article">
        <Breadcrumbs tree={tree} current={url} />
        <h1>{title}</h1>
        {description ? <p className="prose-lead">{description}</p> : null}
        <Body components={mdxComponents} />
        <Pager tree={tree} current={url} />
      </article>
    </Shell>
  );
}
