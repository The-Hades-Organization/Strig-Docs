import { CodeBlock } from '../ds/CodeBlock';
import { Header } from '../ds/Header';
import { Seal } from '../ds/Seal';
import { ASK_SAMPLE } from '../ds/syntaxes';

// The verdict is the demonstration, set on the 9° band.
export default function HomePage() {
  return (
    <div className="shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header />
      <main id="content" className="home">
        <section className="home-hero">
          <h1>Every ruling is a word first.</h1>
          <p className="prose-lead">
            Themis answers one question, can this subject do this to that, and says why.
          </p>
          <div className="home-seals">
            <Seal verdict="allow" reason="Role editor holds document.edit on project Apollo." />
            <Seal verdict="deny" reason="No grant reaches project Zephyr." />
          </div>
        </section>
        <section className="home-ask">
          <h2>Ask it in a line</h2>
          <CodeBlock code={ASK_SAMPLE} lang="rust" />
          <p>
            <a href="/docs/policy-language">Read the policy language</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
