import { unstable_notFound } from 'waku/router/server';
import { Breadcrumbs } from '../../ds/Breadcrumbs';
import { mdxComponents } from '../../ds/mdx';
import { Pager } from '../../ds/Pager';
import { Shell } from '../../ds/Shell';
import { Sidebar } from '../../ds/Sidebar';
import { Toc } from '../../ds/Toc';
import { source } from '@/lib/source';

export default async function DocPage({ slugs }: { slugs: string[] }) {
  const page = source.getPage(slugs);
  if (!page) unstable_notFound();
  const tree = source.getPageTree();
  const Body = page.data.body;
  return (
    <Shell sidebar={<Sidebar tree={tree} current={page.url} />} toc={<Toc items={page.data.toc} />}>
      <article className="prose">
        <Breadcrumbs tree={tree} current={page.url} />
        <h1>{page.data.title}</h1>
        {page.data.description ? <p className="prose-lead">{page.data.description}</p> : null}
        <Body components={mdxComponents} />
        <Pager tree={tree} current={page.url} />
      </article>
    </Shell>
  );
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: source.generateParams().map((p) => p.slug ?? []),
  }) as const;
