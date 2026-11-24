import { unstable_notFound } from 'waku/router/server';
import { source } from '@/lib/source';

export default async function DocPage({ slugs }: { slugs: string[] }) {
  const page = source.getPage(slugs);
  if (!page) unstable_notFound();
  const Body = page.data.body;
  return (
    <article>
      <h1>{page.data.title}</h1>
      <Body />
    </article>
  );
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: source.generateParams().map((p) => p.slug ?? []),
  }) as const;
