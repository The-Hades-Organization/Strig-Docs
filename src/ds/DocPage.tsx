import type { ComponentType } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import { Breadcrumbs } from './Breadcrumbs';
import { DocTabs } from './DocTabs';
import { mdxComponents } from './mdx';
import { Pager } from './Pager';
import { Shell } from './Shell';
import { SyntaxPanel } from './SyntaxPanel';

type DocPageProps = {
  tree: Root;
  url: string;
  title: string;
  description?: string;
  Body: ComponentType<{ components?: typeof mdxComponents }>;
  // Pages about the policy language pin the three syntaxes beside the text.
  withSyntaxPanel?: boolean;
};

// The layout of every documentation page: section tabs, one wide column and,
// on the language pages, the syntax panel.
export function DocPage({ tree, url, title, description, Body, withSyntaxPanel }: DocPageProps) {
  return (
    <Shell>
      <DocTabs tree={tree} current={url} />
      <div className="doc-body" data-has-panel={withSyntaxPanel ? 'true' : 'false'}>
        <article className="prose doc-article">
          <Breadcrumbs tree={tree} current={url} />
          <h1>{title}</h1>
          {description ? <p className="prose-lead">{description}</p> : null}
          <Body components={mdxComponents} />
          <Pager tree={tree} current={url} />
        </article>
        {withSyntaxPanel ? <SyntaxPanel /> : null}
      </div>
    </Shell>
  );
}
