import { CodeBlock } from '../../../ds/CodeBlock';
import { Header } from '../../../ds/Header';
import { Seal } from '../../../ds/Seal';
import { ProposalFrame } from '../../../proposals/ProposalFrame';
import { ASK_SAMPLE } from '../../../proposals/samples';

// Faixa: the verdict is the demonstration, set on the 9° band.
export default function HomeB() {
  return (
    <ProposalFrame direction="b" page="home">
      <div className="shell">
        <Header />
        <main id="content" className="home-b">
          <section className="home-b-hero">
            <h1>Every ruling is a word first.</h1>
            <p className="prose-lead">
              Themis answers one question, can this subject do this to that, and says why.
            </p>
            <div className="home-b-seals">
              <Seal verdict="allow" reason="Role editor holds document.edit on project Apollo." />
              <Seal verdict="deny" reason="No grant reaches project Zephyr." />
            </div>
          </section>
          <section className="home-b-ask">
            <h2>Ask it in a line</h2>
            <CodeBlock code={ASK_SAMPLE} lang="rust" />
            <p>
              <a href="/proposals/b/doc">Read the policy language</a>
            </p>
          </section>
        </main>
      </div>
    </ProposalFrame>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
