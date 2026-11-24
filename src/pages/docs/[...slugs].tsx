import { unstable_notFound } from 'waku/router/server';
import { DocPage } from '../../ds/DocPage';
import { source } from '@/lib/source';

export default async function DocRoute({ slugs }: { slugs: string[] }) {
  const page = source.getPage(slugs);
  if (!page) unstable_notFound();
  return (
    <DocPage
      tree={source.getPageTree()}
      url={page.url}
      title={page.data.title}
      description={page.data.description}
      toc={page.data.toc.map((item) => ({ title: item.title, url: item.url, depth: item.depth }))}
      Body={page.data.body}
      withSyntaxPanel={page.slugs[0] === 'policy-language'}
    />
  );
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: source.generateParams().map((p) => p.slug ?? []),
  }) as const;
