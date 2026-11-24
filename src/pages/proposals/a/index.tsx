import { CodeBlock } from '../../../ds/CodeBlock';
import { Header } from '../../../ds/Header';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { INSTALL_SAMPLE } from '../../../proposals/samples';
import { source } from '@/lib/source';

// Livro: the home reads like the opening of a reference book.
export default async function HomeA() {
  const pages = source.getPages();
  return (
    <ProposalFrame direction="a" page="home">
      <div className="shell">
        <Header />
        <main id="content" className="home-a">
          <header className="home-a-title">
            <h1>Themis</h1>
            <p className="prose-lead">
              An authorization engine that decides without looking at who is asking. One policy,
              three syntaxes.
            </p>
            <CodeBlock code={INSTALL_SAMPLE} lang="text" title="Install" />
          </header>
          <nav aria-label="Contents" className="home-a-contents">
            <h2>Contents</h2>
            <ol>
              {pages.map((page) => (
                <li key={page.url}>
                  <a href={page.url}>{page.data.title}</a>
                  <span>{page.data.description}</span>
                </li>
              ))}
            </ol>
          </nav>
        </main>
      </div>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
