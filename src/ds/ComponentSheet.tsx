import type { Root } from 'fumadocs-core/page-tree';
import { Breadcrumbs } from './Breadcrumbs';
import { Callout } from './Callout';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Icon, type IconName } from './icons';
import { Kbd } from './Kbd';
import { Mark, Wordmark } from './Mark';
import { Pager } from './Pager';
import { Seal, VerdictTag } from './Seal';
import { Sidebar } from './Sidebar';
import { Tab, Tabs } from './Tabs';
import { Table } from './Table';
import { Toc, type TocItem } from './Toc';
import { VersionBadge } from './VersionBadge';

const ICON_NAMES: IconName[] = [
  'check', 'x', 'bang', 'dash', 'search', 'copy', 'chevron-right', 'chevron-left', 'menu', 'info',
  'warn', 'break', 'arrow-right',
];

const SAMPLE_TOC: TocItem[] = [
  { title: 'Permissions', url: '#permissions', depth: 2 },
  { title: 'Roles', url: '#roles', depth: 2 },
  { title: 'Inheritance', url: '#inheritance', depth: 3 },
];

const BLOCKS_SAMPLE = `permission document.edit {
  depends_on = [document.view]  // never alone
}

grant g-edit {
  effect = allow
  subject = role editor
  scope = org:acme
}`;

const RULES_SAMPLE = `user:bruno has role editor in project:apollo
g-edit: allow role editor to document.edit on project in org:acme`;

const ACTORS_SAMPLE = `role editor
  in org:acme
    allow document.edit on project as g-edit`;

const RUST_SAMPLE = `use themis::Engine;

fn main() {
    let engine = Engine::default();
    println!("{}", engine.is_empty());
}`;

const TS_SAMPLE = `import { compile } from 'themis';

const policy = compile(source); // 3 permissions
console.log(policy.permissions.length);`;

const JSON_SAMPLE = `{
  "subject": "user:bruno",
  "permission": "document.edit",
  "allowed": true
}`;

// Every component, in every variant, on the current theme. The page renders this
// twice, once under each theme, so both are visible side by side.
export function ComponentSheet({ tree, current }: { tree: Root; current: string }) {
  return (
    <div className="ds-stack" style={{ width: '100%' }}>
      <div className="ds-row">
        <Mark size={40} />
        <Mark state="open" size={40} />
        <Mark state="closed" size={40} />
        <Wordmark height={20} />
      </div>

      <div className="ds-row">
        {ICON_NAMES.map((name) => (
          <Icon key={name} name={name} size={22} label={name} />
        ))}
      </div>

      <div className="ds-row">
        <Seal verdict="allow" reason="Granted by g-edit" />
        <Seal verdict="deny" reason="No grant covers this" />
      </div>

      <div className="ds-row">
        <VerdictTag verdict="allow" />
        <VerdictTag verdict="deny" />
        <VersionBadge version="0.5.0" />
        <VersionBadge version="0.4.0" kind="changed" />
        <VersionBadge version="0.3.0" kind="deprecated" />
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </div>

      <Callout kind="note">A note explains without raising the stakes.</Callout>
      <Callout kind="warning">A warning names the problem and the way out.</Callout>
      <Callout kind="breaking">A breaking change names what stopped working.</Callout>

      <Tabs>
        <Tab label="Blocks">
          <CodeBlock code={BLOCKS_SAMPLE} lang="blocks" />
        </Tab>
        <Tab label="Rules">
          <CodeBlock code={RULES_SAMPLE} lang="rules" />
        </Tab>
        <Tab label="Actors">
          <CodeBlock code={ACTORS_SAMPLE} lang="actors" />
        </Tab>
      </Tabs>

      <CodeBlock code={RUST_SAMPLE} lang="rust" />
      <CodeBlock code={TS_SAMPLE} lang="ts" />
      <CodeBlock code={JSON_SAMPLE} lang="json" title="Answer" />

      <Table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Verdict</th>
            <th>Grant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bruno edits in Apollo</td>
            <td>
              <VerdictTag verdict="allow" />
            </td>
            <td>
              <code>g-edit</code>
            </td>
          </tr>
          <tr>
            <td>Bruno edits in Zephyr</td>
            <td>
              <VerdictTag verdict="deny" />
            </td>
            <td>none</td>
          </tr>
        </tbody>
      </Table>

      <CardLink href="/docs/concepts" title="Concepts">
        A link card with a short description.
      </CardLink>

      <Breadcrumbs tree={tree} current={current} />
      <Toc items={SAMPLE_TOC} />
      <Sidebar tree={tree} current={current} />
      <Pager tree={tree} current={current} />
    </div>
  );
}
