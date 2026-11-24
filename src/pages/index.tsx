import { CodeBlock } from '../ds/CodeBlock';
import { Header } from '../ds/Header';
import { Icon } from '../ds/icons';
import { Mark } from '../ds/Mark';
import { Seal, VerdictTag, type Verdict } from '../ds/Seal';
import { Tab, Tabs } from '../ds/Tabs';
import { ASK_SAMPLE, HOME_SYNTAXES } from '../ds/syntaxes';
import { LINKS } from '../ds/links';

const STEPS = [
  'A permission that is not in the catalog is denied.',
  'Overrides answer first, in order. The first one that answers decides.',
  'Strig collects the grants that apply: permission, scope, target, subject and condition all match.',
  'The strategy picks the deciding grant. With no candidate, the answer is deny.',
];

type Strength = { title: string; text: string; example?: { verdict: Verdict; text: string } };

const STRENGTHS: Strength[] = [
  {
    title: 'It fails closed',
    text: 'A condition that cannot be evaluated, a grant with a time window and no clock, or a decision server that does not answer never opens access. The Rust client turns a timeout, a 503 or an unreadable reply into a deny.',
  },
  {
    title: 'Three models, one set of grants',
    text: 'RBAC with role inheritance and scoped roles. ABAC with serializable conditions on subject, resource and environment, including CIDR ranges, time of day and weekday in UTC. ReBAC with relation tuples and per-type rewrite rules.',
  },
  {
    title: 'Changes are governed and audited',
    text: 'A grant change applies only if every invariant passes, and the outcome goes to the audit trail whether it was applied or refused. At the forensic level each record carries the hash of the previous one, so an edited or removed record shows.',
  },
  {
    title: 'Decisions explain themselves',
    text: 'A decision names its reason, the grants that matched and any warnings. The inspector shows the trace of each decision, simulates grant changes, draws the access matrix and re-reads the audit trail.',
    example: {
      verdict: 'deny',
      text: 'g2 denies on the invoice type, a more specific step than the organization where g1 allows.',
    },
  },
  {
    title: 'A core that does no IO',
    text: 'The engine has no async runtime and compiles to WebAssembly. The same engine runs in Node, Bun and the browser through the npm package, and policies are checked while your crate compiles.',
  },
  {
    title: 'Changes reach the client',
    text: 'A grant change fans out over Redis, Postgres or your own transport to the other instances and to browsers over SSE or WebSocket, so the interface decides with the same engine and the current grants.',
  },
];

const ELSEWHERE = [
  {
    href: LINKS.docs,
    title: 'Documentation',
    text: 'Concepts, the policy language and the reference.',
  },
  {
    href: LINKS.playground,
    title: 'Playground',
    text: 'Runs the engine in the browser. There is no hosted copy yet: two commands build it locally.',
  },
  { href: LINKS.github, title: 'GitHub', text: 'Source, issues and the changelog.' },
  { href: LINKS.crate, title: 'crates.io', text: 'The strig crate, with API docs on docs.rs.' },
  { href: LINKS.npm, title: 'npm', text: 'The strig package for Node, Bun and the browser.' },
];

export default function HomePage() {
  return (
    <div className="shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header />
      <main id="content" className="home">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-mark" aria-hidden="true">
            <Mark size={320} />
          </div>
          <h1 id="home-title">Authorization that says why.</h1>
          <p className="home-lead">
            Strig is an authorization library for Rust. It checks a validated permission catalog and
            answers who may do what to which resource, with the reason for every answer.
          </p>
          <div className="home-actions">
            <a className="button" data-kind="primary" href={LINKS.docs}>
              Read the docs
              <Icon name="arrow-right" size={16} />
            </a>
            <a className="button" href={LINKS.playground}>
              Try the playground
            </a>
          </div>
          <ul className="home-install-line" aria-label="Install">
            <li>
              <code>cargo add strig</code>
            </li>
            <li>
              <code>npm install strig</code>
            </li>
          </ul>
          <div className="home-seals">
            <Seal
              verdict="allow"
              reason="bruno edits a document in project apollo. He is an editor there, and g-edit allows it."
            />
            <Seal
              verdict="deny"
              reason="bruno edits a document in project zephyr. His editor role is scoped to apollo, so no grant reaches it."
            />
          </div>
        </section>

        <section className="home-section home-ask" aria-labelledby="ask-title">
          <div className="home-copy">
            <h2 id="ask-title">One question, asked the same way every time</h2>
            <p>
              A check names a subject, a permission and a resource. Strig returns a decision: allowed or
              denied, the reason, the grants that matched and any warnings. The resource is a path from
              the most specific step to the broadest, and by default the most specific step with any grant
              decides.
            </p>
            <h3 id="steps-title">How a decision is made</h3>
            <ol className="home-steps" aria-labelledby="steps-title">
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="home-code">
            <CodeBlock code={ASK_SAMPLE} lang="rust" title="Rust" />
          </div>
        </section>

        <section className="home-section home-syntax" aria-labelledby="syntax-title">
          <div className="home-copy">
            <h2 id="syntax-title">One policy, three syntaxes</h2>
            <p>
              Write the policy as text, in the syntax that reads best for the people who maintain it.
              Blocks is explicit and suits generated files. Rules is one statement per line, written to be
              read aloud. Actors groups the policy by who acts, so it answers what an editor can do.
            </p>
            <p>
              All three parse to the same policy, and <code>convert</code> rewrites one into another. A
              mistake is reported with its file, line, column and a hint, and a name that is a slip away
              from a declared one gets a <em>did you mean</em>. The validated JSON stays the source of
              truth.
            </p>
            <p>
              <a href="/docs/policy-language">Read the policy language</a>
            </p>
          </div>
          <div className="home-code">
            <Tabs>
              {HOME_SYNTAXES.map((syntax) => (
                <Tab key={syntax.lang} label={syntax.lang.charAt(0).toUpperCase() + syntax.lang.slice(1)}>
                  <CodeBlock code={syntax.code} lang={syntax.lang} />
                </Tab>
              ))}
            </Tabs>
          </div>
        </section>

        <section className="home-section" aria-labelledby="strengths-title">
          <h2 id="strengths-title">What you get</h2>
          <ul className="home-strengths">
            {STRENGTHS.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.example ? (
                  <p className="home-strength-example">
                    <VerdictTag verdict={item.example.verdict} />
                    <span>{item.example.text}</span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section home-install" aria-labelledby="install-title">
          <div className="home-copy">
            <h2 id="install-title">Install</h2>
            <p>
              The crate is <code>strig</code>, so you write <code>use strig::*;</code>. The npm package has
              the same name and loads the native module on Node and Bun, or WebAssembly in the browser.
            </p>
            <p>
              Strig is pre-1.0 and the API can still change between minor versions. Release 0.5 renames{' '}
              <code>needs</code> to <code>depends_on</code> in the Rules and Actors syntaxes; the{' '}
              <a href={LINKS.changelog}>changelog</a> has the details.
            </p>
          </div>
          <div className="home-code home-install-code">
            <CodeBlock code={'cargo add strig\n'} lang="text" title="cargo" />
            <CodeBlock code={'npm install strig\n'} lang="text" title="npm, for Node, Bun and the browser" />
          </div>
        </section>

        <section className="home-section home-exits" aria-labelledby="elsewhere-title">
          <h2 id="elsewhere-title">Where to go next</h2>
          <ul className="home-links">
            {ELSEWHERE.map((item) => (
              <li key={item.title}>
                <a href={item.href}>
                  <span className="home-link-title">
                    {item.title}
                    <Icon name="arrow-right" size={16} />
                  </span>
                  <span className="home-link-text">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="home-footer">
        <p>Strig is released under the MIT license.</p>
      </footer>
    </div>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
