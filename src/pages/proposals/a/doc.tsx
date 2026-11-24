import { unstable_notFound } from 'waku/router/server';
import { Breadcrumbs } from '../../../ds/Breadcrumbs';
import { mdxComponents } from '../../../ds/mdx';
import { Pager } from '../../../ds/Pager';
import { Shell } from '../../../ds/Shell';
import { Sidebar } from '../../../ds/Sidebar';
import { Toc } from '../../../ds/Toc';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { source } from '@/lib/source';

// Livro: sidebar tree, running contents and a narrow, quiet column.
export default async function DocA() {
  const page = source.getPage(['policy-language', 'blocks']);
  if (!page) unstable_notFound();
  const tree = source.getPageTree();
  const Body = page.data.body;
  return (
    <ProposalFrame direction="a" page="doc">
      <Shell sidebar={<Sidebar tree={tree} current={page.url} />} toc={<Toc items={page.data.toc} />}>
        <article className="prose">
          <Breadcrumbs tree={tree} current={page.url} />
          <h1>{page.data.title}</h1>
          {page.data.description ? <p className="prose-lead">{page.data.description}</p> : null}
          <Body components={mdxComponents} />
          <Pager tree={tree} current={page.url} />
        </article>
      </Shell>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
