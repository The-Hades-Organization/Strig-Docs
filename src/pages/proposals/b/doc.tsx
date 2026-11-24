import { unstable_notFound } from 'waku/router/server';
import { Breadcrumbs } from '../../../ds/Breadcrumbs';
import { mdxComponents } from '../../../ds/mdx';
import { Pager } from '../../../ds/Pager';
import { Seal } from '../../../ds/Seal';
import { Shell } from '../../../ds/Shell';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { READING_ORDER } from '../../../proposals/samples';
import { source } from '@/lib/source';

// Faixa: no sidebar. Sections sit in a tab row, a verdict opens the page,
// the column is wide enough for code and tables.
export default async function DocB() {
  const page = source.getPage(['policy-language', 'blocks']);
  if (!page) unstable_notFound();
  const tree = source.getPageTree();
  const Body = page.data.body;
  const sections = [...source.getPages()].sort(
    (x, y) => READING_ORDER.indexOf(x.url) - READING_ORDER.indexOf(y.url),
  );
  return (
    <ProposalFrame direction="b" page="doc">
      <Shell>
        <nav className="doc-b-tabs" aria-label="Sections">
          <ul>
            {sections.map((p) => (
              <li key={p.url}>
                <a href={p.url} aria-current={p.url === page.url ? 'page' : undefined}>
                  {p.data.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose doc-b-article">
          <Breadcrumbs tree={tree} current={page.url} />
          <h1>{page.data.title}</h1>
          {page.data.description ? <p className="prose-lead">{page.data.description}</p> : null}
          <Seal verdict="allow" reason="Bruno may edit documents in Apollo." />
          <Body components={mdxComponents} />
          <Pager tree={tree} current={page.url} />
        </article>
      </Shell>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
