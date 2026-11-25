import { Clip } from '../ds/Clip';
import { CodeLines } from '../ds/CodeLines';
import { CopyLine } from '../ds/CopyLine';
import { CourtPanel, type CourtCase } from '../ds/CourtPanel';
import { Exits, type Exit } from '../ds/Exits';
import { Facts, type Fact } from '../ds/Facts';
import { HeadingTwoTone } from '../ds/HeadingTwoTone';
import { Icon, type IconName } from '../ds/icons';
import { LandingHeader } from '../ds/LandingHeader';
import { SwapTabs } from '../ds/Tabs';
import { ThemedImage } from '../ds/ThemedImage';
import {
  FIRST_DECISION,
  POLICY_ACTORS,
  POLICY_BLOCKS,
  POLICY_RULES,
  REQUEST_ALLOW,
  REQUEST_DENY,
} from '../ds/landing-samples';
import { LINKS, NPM_PACKAGE } from '../ds/links';

const NO_GRANT = 'No grant on this step.';

// Both questions were run against strig 0.6.1 with the same two grants.
const CASES: CourtCase[] = [
  {
    id: 'deny',
    question: 'Export invoice d1',
    request: REQUEST_DENY,
    verdict: 'deny',
    reason: (
      <>
        <code>g2</code> denies on <code>doc_type:invoice</code>, the most specific step with a grant.
      </>
    ),
    steps: [
      {
        step: 'org:acme',
        fate: (
          <>
            <code>g1</code> allows <code>document.export</code>, which implies the request. Candidate, outranked.
          </>
        ),
      },
      { step: 'project:p1', fate: NO_GRANT, quiet: true },
      {
        step: 'doc_type:invoice',
        decides: 'deny',
        fate: (
          <>
            <code>g2</code> denies <code>document.invoice.export</code> to anyone. <strong>Decides.</strong>
          </>
        ),
      },
      { step: 'document:d1', fate: NO_GRANT, quiet: true },
    ],
    foot: (
      <>
        Strategy: <code>MostSpecific</code>, the default. On the deciding step, <code>deny</code> wins.
      </>
    ),
  },
  {
    id: 'allow',
    question: 'Export report d2',
    request: REQUEST_ALLOW,
    verdict: 'allow',
    reason: (
      <>
        <code>g1</code> allows on <code>org:acme</code>, the only step with a grant.
      </>
    ),
    steps: [
      {
        step: 'org:acme',
        decides: 'allow',
        fate: (
          <>
            <code>g1</code> allows <code>document.export</code> to role <code>member</code> in <code>org:acme</code>.{' '}
            <strong>Decides.</strong>
          </>
        ),
      },
      { step: 'project:p1', fate: NO_GRANT, quiet: true },
      {
        step: 'doc_type:report',
        quiet: true,
        fate: (
          <>
            No grant on this step. <code>g2</code> sits on <code>doc_type:invoice</code> only.
          </>
        ),
      },
      { step: 'document:d2', fate: NO_GRANT, quiet: true },
    ],
    foot: (
      <>
        Strategy: <code>MostSpecific</code>, the default.
      </>
    ),
  },
];

const SYNTAXES = [
  { id: 'rules', label: 'Rules', code: POLICY_RULES },
  { id: 'blocks', label: 'Blocks', code: POLICY_BLOCKS },
  { id: 'actors', label: 'Actors', code: POLICY_ACTORS },
];

type Shot = { id: string; label: string; icon: IconName; src: string; alt: string; caption: string };

const INSPECTOR_SHOTS: Shot[] = [
  {
    id: 'decision',
    label: 'Decision',
    icon: 'circle-check',
    src: '/media/inspector-evaluate',
    alt: 'Strig Inspect showing a denied decision, the resource path and every grant with its fate.',
    caption: 'Every grant, and what became of it. The one that decided is marked.',
  },
  {
    id: 'matrix',
    label: 'Matrix',
    icon: 'panel-top',
    src: '/media/inspector-matrix',
    alt: 'Strig Inspect showing who can do what on one resource, as a grid.',
    caption: 'Who can do what on a resource, in one grid. Click a cell for its trace.',
  },
  {
    id: 'audit',
    label: 'Audit trail',
    icon: 'shield-check',
    src: '/media/inspector-audit',
    alt: 'Strig Inspect listing audit records, a verified hash chain and a re-evaluation.',
    caption: 'The hash chain is checked, then each recorded decision is run again against the current policy.',
  },
];

const FACTS: Fact[] = [
  {
    title: 'It fails closed',
    text: 'A condition or relation that cannot be evaluated never opens access. The allow is dropped and the deny applies.',
  },
  {
    title: 'Three models, one set of grants',
    text: 'RBAC with inheritance, ABAC with conditions, ReBAC with relation tuples.',
  },
  {
    title: 'A core that does no IO',
    text: 'The same engine runs in Rust, in Node and Bun, and in the browser through WebAssembly.',
  },
];

const EXITS: Exit[] = [
  { href: LINKS.docs, title: 'Docs', text: 'Concepts, the policy language, the reference.', icon: 'book-open' },
  { href: LINKS.playground, title: 'Playground', text: 'Runs in your browser, the real engine in WebAssembly.', icon: 'play' },
  { href: LINKS.github, title: 'GitHub', text: 'Source, issues, changelog.', icon: 'github' },
  { href: LINKS.crate, title: 'crates.io', text: 'The crate, with API docs on docs.rs.', icon: 'external-link' },
  { href: LINKS.npm, title: 'npm', text: 'Node, Bun and the browser.', icon: 'external-link' },
];

export default function HomePage() {
  return (
    <div className="landing">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <LandingHeader />
      <main id="content" className="landing-wrap">
        <section className="landing-hero" aria-labelledby="landing-title">
          <HeadingTwoTone
            level={1}
            id="landing-title"
            claim="May dave export invoice d1?"
            quiet="No. Strig says which grant decided, and where."
          />
          <CourtPanel cases={CASES} note="Same grants: g1, g2" />
          <div className="landing-intro">
            <p className="lead">
              Strig is an authorization engine for Rust, with a policy language and a WebAssembly build. Every
              answer carries its reason.
            </p>
            <div className="landing-actions">
              <a className="button" data-kind="primary" href={LINKS.docs}>
                <Icon name="book-open" size={18} />
                Read the docs
              </a>
              <a className="button" href={LINKS.playground}>
                <Icon name="play-solid" size={18} />
                Open the playground
              </a>
            </div>
          </div>
        </section>

        <section className="landing-sec landing-two" aria-labelledby="landing-policy">
          <div className="landing-stack">
            <HeadingTwoTone
              level={2}
              id="landing-policy"
              claim="The same grants, written as policy."
              quiet="Three syntaxes, one result."
            />
            <p>
              Rules reads aloud, Blocks is explicit, Actors groups by who acts. All three parse to the same policy, so
              dave gets the same two answers.
            </p>
          </div>
          <SwapTabs
            label="Syntax"
            className="code-frame syntax"
            barClassName="code-tabs"
            aside={<span className="code-frame-file">policy.strig</span>}
            tabs={SYNTAXES.map((syntax) => ({
              id: syntax.id,
              label: syntax.label,
              panel: <CodeLines code={syntax.code} lang={syntax.id} label={`Policy in ${syntax.label}`} />,
            }))}
          />
        </section>

        <section className="landing-sec" aria-labelledby="landing-playground">
          <HeadingTwoTone
            level={2}
            id="landing-playground"
            claim="Change a line. Watch the ruling change."
            quiet="The playground runs the real engine."
          />
          <Clip
            name="/media/playground-tour"
            posterName="/media/playground-poster"
            title="Recording · the playground, the real engine in WebAssembly"
            label="Recording of the playground: choosing a case, reading an allow and a deny, switching syntax, fixing a typo."
            fallbackHref={LINKS.playground}
            fallbackLabel="Open the playground"
          />
        </section>

        <section className="landing-sec" aria-labelledby="landing-inspect">
          <HeadingTwoTone
            level={2}
            id="landing-inspect"
            claim="Read a decision after the fact."
            quiet="Strig Inspect, on the desktop."
          />
          <SwapTabs
            label="Strig Inspect views"
            className="shots"
            barClassName="swap-bar-ruled"
            tabs={INSPECTOR_SHOTS.map((shot) => ({
              id: shot.id,
              label: shot.label,
              icon: shot.icon,
              panel: (
                <figure className="shot">
                  <div className="shot-frame">
                    <ThemedImage name={shot.src} alt={shot.alt} width={1400} height={750} />
                  </div>
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ),
            }))}
          />
        </section>

        <section className="landing-sec" aria-label="What holds">
          <Facts items={FACTS} />
        </section>

        <section id="install" className="landing-sec landing-two" aria-labelledby="landing-install">
          <div className="landing-stack">
            <HeadingTwoTone
              level={2}
              id="landing-install"
              claim="Install."
              quiet="Rust first, then Node, Bun and the browser."
            />
            <p className="mute">
              Strig is pre-1.0: the API can still change between minor versions. The{' '}
              <a href={LINKS.changelog}>changelog</a> lists each change.
            </p>
            <div className="landing-copylines">
              <CopyLine command="cargo add strig" icon="terminal" label="cargo" />
              <CopyLine command={`npm install ${NPM_PACKAGE}`} icon="terminal" label="npm" />
            </div>
          </div>
          <div className="landing-stack" data-gap="tight">
            <div className="code-frame">
              <p className="code-frame-cap">
                First decision · Rust<span className="code-frame-file">src/main.rs</span>
              </p>
              <CodeLines code={FIRST_DECISION} lang="rust" />
            </div>
            <p className="landing-note">
              Reading a <code>.strig</code> file takes two features: <code>cargo add strig --features dsl,dsl-fs</code>.
              The policy is the one above.
            </p>
          </div>
        </section>

        <section className="landing-sec" aria-label="Where to go next">
          <Exits items={EXITS} />
        </section>
      </main>
      <footer className="landing-footer">
        <span>Strig · MIT license</span>
        <a href={LINKS.github}>GitHub</a>
      </footer>
    </div>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
