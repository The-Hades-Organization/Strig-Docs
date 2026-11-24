import { Clip } from '../ds/Clip';
import { ThemedImage } from '../ds/ThemedImage';
import { CodeBlock } from '../ds/CodeBlock';
import { CopyLine } from '../ds/CopyLine';
import { Header } from '../ds/Header';
import { Icon, type IconName } from '../ds/icons';
import { Mark } from '../ds/Mark';
import { Reveal } from '../ds/Reveal';
import { Seal } from '../ds/Seal';
import { Tab, Tabs } from '../ds/Tabs';
import { ASK_SAMPLE, HOME_SYNTAXES } from '../ds/syntaxes';
import { LINKS, NPM_PACKAGE } from '../ds/links';

const STEPS = [
  'A permission that is not in the catalog is denied.',
  'Overrides answer first, in order.',
  'Strig collects the grants that match.',
  'The strategy picks one. No candidate means deny.',
];

type Shot = { label: string; icon: IconName; src: string; alt: string; caption: string };

const PLAYGROUND_SHOTS: Shot[] = [
  {
    label: 'Deny',
    icon: 'circle-x',
    src: '/media/pg-deny',
    alt: 'The playground answering deny for Bruno in project Zephyr, with the reason beside it.',
    caption: 'Bruno is an editor in Apollo, not in Zephyr. The answer says so.',
  },
  {
    label: 'Actors',
    icon: 'terminal',
    src: '/media/pg-actors',
    alt: 'The same policy written in the Actors syntax, still compiling.',
    caption: 'Switch syntax. The policy is the same and the answer does not move.',
  },
  {
    label: 'A typo',
    icon: 'circle-alert',
    src: '/media/pg-typo',
    alt: 'An unknown permission underlined, with its line, column and a did-you-mean hint.',
    caption: 'A mistake comes with its line, its column and a hint.',
  },
  {
    label: 'Order',
    icon: 'arrow-right',
    src: '/media/pg-order',
    alt: 'Two grants swapped in the editor and the ruling changing with them.',
    caption: 'Swap two lines and the ruling changes. The trace shows which one decided.',
  },
];

const INSPECTOR_SHOTS: Shot[] = [
  {
    label: 'Decision',
    icon: 'circle-check',
    src: '/media/inspector-evaluate',
    alt: 'Strig Inspect showing a denied decision, the resource path and every grant with its fate.',
    caption: 'Every grant, and what became of it. The one that decided is marked.',
  },
  {
    label: 'Matrix',
    icon: 'panel-top',
    src: '/media/inspector-matrix',
    alt: 'Strig Inspect showing who can do what on one resource, as a grid.',
    caption: 'Who can do what on a resource, in one grid. Click a cell for its trace.',
  },
  {
    label: 'Audit trail',
    icon: 'shield-check',
    src: '/media/inspector-audit',
    alt: 'Strig Inspect listing audit records, a verified hash chain and a re-evaluation.',
    caption: 'The hash chain is checked, then each record is decided again with today’s grants.',
  },
];

function ShotTabs({ shots, width, height }: { shots: Shot[]; width: number; height: number }) {
  return (
    <Tabs>
      {shots.map((shot) => (
        <Tab key={shot.label} label={shot.label} icon={shot.icon}>
          <figure className="shot">
            <ThemedImage name={shot.src} alt={shot.alt} width={width} height={height} />
            <figcaption>{shot.caption}</figcaption>
          </figure>
        </Tab>
      ))}
    </Tabs>
  );
}

type Strength = { icon: IconName; title: string; text: string };

const STRENGTHS: Strength[] = [
  {
    icon: 'shield-check',
    title: 'It fails closed',
    text: 'A condition that cannot be evaluated, or a server that does not answer, never opens access.',
  },
  {
    icon: 'panel-top',
    title: 'Three models, one set of grants',
    text: 'RBAC with inheritance, ABAC with conditions, ReBAC with relation tuples.',
  },
  {
    icon: 'circle-check',
    title: 'Changes are governed and audited',
    text: 'A grant change applies only if every invariant passes. Forensic records are hash-chained.',
  },
  {
    icon: 'search',
    title: 'Decisions explain themselves',
    text: 'The reason, the grants that matched and the warnings travel with every answer.',
  },
  {
    icon: 'terminal',
    title: 'A core that does no IO',
    text: 'The same engine runs in Rust, Node, Bun and the browser, through WebAssembly.',
  },
  {
    icon: 'arrow-right',
    title: 'Changes reach the client',
    text: 'Grant changes fan out over Redis, Postgres or SSE, so the interface decides with current grants.',
  },
];

const ELSEWHERE: { href: string; title: string; text: string; icon: IconName }[] = [
  { href: LINKS.docs, title: 'Documentation', text: 'Concepts, the policy language, the reference.', icon: 'book-open' },
  { href: LINKS.playground, title: 'Playground', text: 'Runs in your browser, the real engine in WebAssembly.', icon: 'play' },
  { href: LINKS.github, title: 'GitHub', text: 'Source, issues, changelog.', icon: 'github' },
  { href: LINKS.crate, title: 'crates.io', text: 'The crate, with API docs on docs.rs.', icon: 'external-link' },
  { href: LINKS.npm, title: 'npm', text: 'Node, Bun and the browser.', icon: 'external-link' },
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
          <div className="home-hero-copy">
            <h1 id="home-title">Authorization that says why.</h1>
            <p className="home-lead">
              Ask who may do what to which resource. Strig answers, and names the grants behind it.
            </p>
            <div className="home-actions">
              <a className="button" data-kind="primary" href={LINKS.docs}>
                <Icon name="book-open" size={18} />
                Read the docs
              </a>
              <a className="button" href={LINKS.playground}>
                <Icon name="play-solid" size={18} />
                Open the playground
              </a>
              <a className="button" href={LINKS.github}>
                <Icon name="github" size={18} />
                GitHub
              </a>
            </div>
            <div className="home-install-line">
              <CopyLine command="cargo add strig" icon="terminal" label="cargo" />
              <CopyLine command={`npm install ${NPM_PACKAGE}`} icon="terminal" label="npm" />
            </div>
          </div>
          <div className="home-hero-demo">
            <Clip
              name="/media/playground-tour"
              posterName="/media/playground-poster"
              title="Playground, the real engine in WebAssembly"
              label="Recording of the playground: choosing a case, reading an allow and a deny, switching syntax, fixing a typo."
            />
          </div>
        </section>

        <Reveal className="home-section home-ask">
          <div className="home-copy">
            <h2 id="ask-title">One question. One answer, with its reason.</h2>
            <p>The same user asks about two projects. The answers differ, and each says why.</p>
            <div className="home-seals">
              <Seal verdict="allow" reason="bruno is an editor in apollo; g-edit allows it." />
              <Seal verdict="deny" reason="bruno’s editor role is scoped to apollo; no grant reaches zephyr." />
            </div>
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
        </Reveal>

        <Reveal className="home-section home-stage">
          <div className="home-stage-head">
            <h2 id="play-title">Write a policy. Watch it decide.</h2>
            <p>Nothing here is a mock-up. These are frames from the playground, which compiles your text with the engine itself.</p>
          </div>
          <div className="home-stage-body">
            <ShotTabs shots={PLAYGROUND_SHOTS} width={1280} height={760} />
          </div>
        </Reveal>

        <Reveal className="home-section home-syntax">
          <div className="home-copy">
            <h2 id="syntax-title">One policy, three syntaxes</h2>
            <p>Blocks is explicit, Rules reads aloud, Actors groups by who acts. All three parse to the same policy.</p>
            <p>
              <a className="home-inline-link" href="/docs/policy-language">
                Read the policy language
                <Icon name="arrow-right" size={16} />
              </a>
            </p>
          </div>
          <div className="home-code">
            <Tabs>
              {HOME_SYNTAXES.map((syntax) => (
                <Tab key={syntax.lang} label={syntax.lang.charAt(0).toUpperCase() + syntax.lang.slice(1)} icon="terminal">
                  <CodeBlock code={syntax.code} lang={syntax.lang} />
                </Tab>
              ))}
            </Tabs>
          </div>
        </Reveal>

        <Reveal className="home-section home-stage">
          <div className="home-stage-head">
            <h2 id="inspect-title">See why, in a window.</h2>
            <p>Strig Inspect is a desktop app. It reads a scenario and an audit trail and shows the decision, not just the verdict.</p>
          </div>
          <div className="home-stage-body">
            <ShotTabs shots={INSPECTOR_SHOTS} width={1400} height={750} />
          </div>
        </Reveal>

        <Reveal className="home-section" >
          <h2 id="strengths-title">What you get</h2>
          <ul className="home-strengths">
            {STRENGTHS.map((item) => (
              <li key={item.title}>
                <h3>
                  <Icon name={item.icon} size={20} />
                  {item.title}
                </h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="home-section home-install">
          <div className="home-copy">
            <h2 id="install-title">Install</h2>
            <p>
              Write <code>use strig::*;</code> in Rust, or import <code>{NPM_PACKAGE}</code> in Node, Bun and the
              browser.
            </p>
            <p>
              Strig is pre-1.0 and the API can still change between minor versions. The{' '}
              <a href={LINKS.changelog}>changelog</a> lists each change.
            </p>
          </div>
          <div className="home-code home-install-code">
            <CodeBlock code={'cargo add strig\n'} lang="text" title="cargo" />
            <CodeBlock code={`npm install ${NPM_PACKAGE}\n`} lang="text" title="npm" />
            <CodeBlock
              code={`import { compile } from '${NPM_PACKAGE}';\n`}
              lang="ts"
              title="TypeScript"
            />
          </div>
        </Reveal>

        <section className="home-section home-exits" aria-labelledby="elsewhere-title">
          <h2 id="elsewhere-title">Where to go next</h2>
          <ul className="home-links">
            {ELSEWHERE.map((item) => (
              <li key={item.title}>
                <a href={item.href}>
                  <span className="home-link-title">
                    <Icon name={item.icon} size={18} />
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
