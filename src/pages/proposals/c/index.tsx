import { CodeBlock } from '../../../ds/CodeBlock';
import { Header } from '../../../ds/Header';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { SYNTAXES } from '../../../proposals/samples';

// Sintaxe primeiro: the same grant written three ways, side by side.
export default function HomeC() {
  return (
    <ProposalFrame direction="c" page="home">
      <div className="shell">
        <Header />
        <main id="content" className="home-c">
          <h1>One policy. Three ways to write it.</h1>
          <p className="prose-lead">
            The same grant in each syntax. Pick the one your team reads fastest.
          </p>
          <div className="home-c-syntaxes">
            {SYNTAXES.map((s) => (
              <CodeBlock key={s.lang} code={s.code} lang={s.lang} />
            ))}
          </div>
          <p>
            <a href="/proposals/c/doc">Learn the syntaxes</a>
          </p>
        </main>
      </div>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
