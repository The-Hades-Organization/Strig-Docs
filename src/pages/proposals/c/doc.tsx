import { unstable_notFound } from 'waku/router/server';
import { CodeBlock } from '../../../ds/CodeBlock';
import { mdxComponents } from '../../../ds/mdx';
import { Pager } from '../../../ds/Pager';
import { Shell } from '../../../ds/Shell';
import { Sidebar } from '../../../ds/Sidebar';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { SYNTAXES } from '../../../proposals/samples';
import { source } from '@/lib/source';

// Sintaxe primeiro: prose on the left, the three syntaxes pinned on the right.
export default async function DocC() {
  const page = source.getPage(['concepts']);
  if (!page) unstable_notFound();
  const tree = source.getPageTree();
  const Body = page.data.body;
  return (
    <ProposalFrame direction="c" page="doc">
      <Shell sidebar={<Sidebar tree={tree} current={page.url} />}>
        <div className="doc-c-grid">
          <article className="prose">
            <h1>{page.data.title}</h1>
            {page.data.description ? <p className="prose-lead">{page.data.description}</p> : null}
            <Body components={mdxComponents} />
            <Pager tree={tree} current={page.url} />
          </article>
          <aside className="doc-c-pinned" aria-label="The grant in each syntax">
            {SYNTAXES.map((s) => (
              <CodeBlock key={s.lang} code={s.code} lang={s.lang} />
            ))}
          </aside>
        </div>
      </Shell>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
