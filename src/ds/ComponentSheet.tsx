import type { Root } from 'fumadocs-core/page-tree';
import { Callout } from './Callout';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Icon, type IconName } from './icons';
import { Kbd } from './Kbd';
import { Mark, Wordmark } from './Mark';
import { Seal, VerdictTag } from './Seal';
import { PageTree } from './PageTree';
import { Tab, Tabs } from './Tabs';
import { Table } from './Table';
import { OnPage, type OnPageItem } from './OnPage';
import { VersionBadge } from './VersionBadge';

const ICON_NAMES: IconName[] = [
  'check', 'x', 'search', 'copy', 'chevron-right', 'chevron-left', 'chevron-down', 'arrow-right', 'menu', 'info',
  'triangle-alert', 'circle-alert', 'circle-check', 'circle-x', 'circle-minus', 'minus', 'sun', 'moon',
  'external-link', 'book-open', 'play', 'terminal', 'shield-check', 'panel-top', 'github',
  'play-solid', 'pause-solid', 'triangle-alert-solid', 'info-solid', 'circle-alert-solid', 'circle-check-solid', 'circle-x-solid',
];

const SAMPLE_ON_PAGE: OnPageItem[] = [
  { id: 'permissions', title: 'Permissions' },
  { id: 'roles', title: 'Roles' },
  { id: 'inheritance', title: 'Inheritance' },
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

const RUST_SAMPLE = `use strig::dsl;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let parsed = dsl::parse("policy.strig", SOURCE)?;
    println!("{}", parsed.policy.to_json()?);
    Ok(())
}`;

const TS_SAMPLE = `import { load } from '@the-hades-organization/strig';

const strig = await load();
const policy = strig.compile(source, { file: 'policy.strig' }); // canonical JSON
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

      <OnPage title="Concepts" items={SAMPLE_ON_PAGE} />
      <PageTree tree={tree} current={current} />
    </div>
  );
}
