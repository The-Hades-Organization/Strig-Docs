import type { BenchCase, BenchCode, PageBench } from './types';

// The bench of Concepts (content/docs/concepts.mdx). Policies, code and
// outputs come from Strig 0.6.1, run through the program of "The question";
// keep them byte for byte.

const QUESTION = `language rules

kinds project, document
broad org

permission document.view on project, document

user:ana
user:bob

g-view: allow user ana to document.view on project in org:acme`;

const PERMS = `language rules

kinds project, document
broad org

permission document.view on project, document
permission document.export on project, document
permission document.invoice.export on document implied by document.export

user:ana
user:cara

g-export: allow user ana to document.export on project in org:acme
g-invoice: allow user cara to document.invoice.export on document in org:acme`;

const TARGETS = `language rules

kinds project, document
broad org

permission document.view on document
permission project.rename on project

role member

user:dan has role member

g-view: allow role member to document.view on org in org:acme`;

const BAD = `language rules

kinds project, document
broad org

permission project.rename on project

role member

g-rename: allow role member to project.rename on document in org:acme`;

const ROLES = `language rules

kinds project, document
broad org

permission document.view on project, document
permission document.edit on project, document depends_on document.view

role viewer
role editor inherits viewer

user:ana has role editor in project:apollo

g-view: allow role viewer to document.view on project in org:acme
g-edit: allow role editor to document.edit on project in org:acme`;

const ROLES_ACTORS = `language actors

role editor inherits viewer

role viewer
  in org:acme
    allow document.view on project as g-view

role editor
  in org:acme
    allow document.edit on project as g-edit

subject user:ana
  role editor in project:apollo

catalog
  kinds document, project
  broad org
  document.view on project, document
  document.edit on project, document depends_on document.view`;

const COND = `language rules

kinds project, document
broad org

permission document.edit on project, document

role editor

user:ana has role editor in org:acme
user:ana has attr dept = "legal"
user:bob has role editor in org:acme
user:bob has attr dept = "sales"
user:eve has role editor in org:acme

g-legal: allow role editor to document.edit on project in org:acme when subject.dept == "legal"`;

const PREREQ = `language rules

kinds project, document
broad org

permission document.view on project, document
permission document.edit on project, document depends_on document.view

user:ana
user:bob

g-view: allow user ana to document.view on project in org:acme
g-edit-ana: allow user ana to document.edit on project in org:acme
g-edit-bob: allow user bob to document.edit on project in org:acme`;

const STRATEGY = `language rules

kinds project, document
broad org

permission document.edit on project, document

role editor

user:ana has role editor in org:acme

g-edit: allow role editor to document.edit on document:spec in org:acme
g-freeze: deny anyone to document.edit on project in org:acme`;

const REASON = `/// Why the decision came out the way it did.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Reason {
    /// An override decided before the grants.
    Override { name: String },
    /// A grant decided, chosen by the strategy.
    Grant {
        grant_id: String,
        permission: String,
        rank: usize,
        strategy: String,
    },
    /// No grant applied: default-deny.
    NoApplicableGrant,
    /// The requested permission is not in the catalog.
    UnknownPermission,
    /// The permission would be allowed, but a prerequisite (\`depends_on\`) is not allowed on the
    /// same resource.
    MissingPrerequisite { permission: String, prerequisite: String },
}`;

const MAIN_RS = `use strig::dsl::fs::read_file;
use strig::{Context, Request, Resource};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = std::env::args().collect();
    let policy = read_file(&args[1])?.policy;
    let engine = policy.engine_spec().build()?;
    let context = Context::new(&policy.grants);

    let who = policy
        .subjects
        .iter()
        .find(|s| s.id.as_deref() == Some(args[2].as_str()))
        .expect("subject");
    let (kind, id) = args[4].split_once(':').expect("kind:id");
    let mut resource = Resource::new(kind, id);
    for step in &args[5..] {
        let (kind, id) = step.split_once(':').expect("kind:id");
        resource = resource.within(kind, id);
    }

    let decision = engine.decide(&context, &Request::new(who, &args[3], &resource));
    println!("{}", serde_json::to_string_pretty(&decision)?);
    Ok(())
}`;

const ASK_MJS = `import { readFileSync } from 'node:fs';
import { load } from '@the-hades-organization/strig';

const [file, user, permission, ...steps] = process.argv.slice(2);
const { compile, Engine, Context } = await load();
const policy = compile(readFileSync(file, 'utf8'), { file });
const { catalog, roles, strategy } = policy;
const engine = new Engine({ catalog, roles, strategy });
const context = new Context({ grants: policy.grants });

const subject = policy.subjects.find((s) => s.id === user);
const path = steps.map((step) => {
  const [kind, id] = step.split(':');
  return { kind, id };
});

const decision = engine.decide(context, { subject, permission, resource: { path } });
console.log(JSON.stringify(decision, null, 2));`;

// The request of a case: the subject, then the resource path, then the question.
function request(user: string, permission: string, doc: string, project: string, org = 'acme'): BenchCode {
  return {
    title: 'Request · Rust',
    lang: 'rust',
    code: `let ${user} = policy.subjects.iter()
    .find(|s| s.id.as_deref() == Some("${user}")).expect("subject");
let ${doc} = Resource::new("document", "${doc}")
    .within("project", "${project}")
    .within("org", "${org}");

let decision = engine.decide(
    &context,
    &Request::new(${user}, "${permission}", &${doc}),
);`,
  };
}

function terminal(command: string): BenchCode {
  return { title: 'Terminal', lang: 'text', code: `$ ${command}` };
}

// The arguments of the program: policy file, user, permission, then the path.
function args(file: string, user: string, permission: string, doc: string, project: string, org = 'acme') {
  return `${file} ${user} ${permission} document:${doc} project:${project} org:${org}`;
}

// A case whose code is the request and the command, and whose answer is run.
function ask(file: string, user: string, permission: string, doc: string, project: string, org = 'acme') {
  const line = args(file, user, permission, doc, project, org);
  return {
    code: { rust: [request(user, permission, doc, project, org), terminal(`cargo run -- ${line}`)] },
    run: { command: line },
  } satisfies Pick<BenchCase, 'code' | 'run'>;
}

const NO_GRANT = 'No grant on this step.';
const quiet = (step: string, rank: string) => ({ step, rank, quiet: true, fate: NO_GRANT });
const MOST_SPECIFIC = (
  <>
    Strategy: <code>most_specific</code>, the default.
  </>
);
const NOTHING_APPLIED = (
  <>
    Nothing applied: <code>no_applicable_grant</code>, so the answer is <code>deny</code>.
  </>
);

export const bench: PageBench = {
  sections: [
    {
      id: 'the-question',
      title: 'The question',
      file: { rust: 'question.strig', node: 'question.strig' },
      policy: { file: 'question.strig', code: QUESTION, lang: 'rules' },
    },
    {
      id: 'permissions',
      title: 'Permissions',
      file: 'perms.strig',
      policy: { file: 'perms.strig', code: PERMS, lang: 'rules' },
    },
    {
      id: 'targets-and-broad-targets',
      title: 'Targets and broad targets',
      file: 'targets.strig',
      policy: { file: 'targets.strig', code: TARGETS, lang: 'rules' },
    },
    {
      id: 'roles',
      title: 'Roles',
      file: 'roles.strig',
      policy: { file: 'roles.strig', code: ROLES, lang: 'rules' },
    },
    {
      id: 'conditions',
      title: 'Conditions',
      file: 'conditions.strig',
      policy: { file: 'conditions.strig', code: COND, lang: 'rules' },
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      file: 'prereq.strig',
      policy: { file: 'prereq.strig', code: PREREQ, lang: 'rules' },
    },
    {
      id: 'which-grant-decides',
      title: 'Which grant decides',
      file: 'strategy.strig',
      policy: { file: 'strategy.strig', code: STRATEGY, lang: 'rules' },
    },
    {
      id: 'reading-the-answer',
      title: 'Reading the answer',
      file: 'src/decision.rs',
    },
  ],
  cases: [
    {
      id: 'q1',
      section: 'the-question',
      tab: 'Ana views the spec',
      question: 'Can Ana view the spec in Apollo?',
      verdict: 'allow',
      reason: 'Granted by g-view, through document.view.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'allow',
            fate: (
              <>
                <code>g-view</code> allows <code>document.view</code> to ana. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('question.strig', 'ana', 'document.view', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-view",
    "permission": "document.view",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-view"
  ]
}`,
      },
    },
    {
      id: 'q2',
      section: 'the-question',
      tab: 'Bob views it',
      question: 'Can Bob view the same document?',
      verdict: 'deny',
      reason: 'No grant applies.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-view</code> is written for ana, not for bob.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: NOTHING_APPLIED,
      },
      ...ask('question.strig', 'bob', 'document.view', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  }
}`,
      },
    },
    {
      id: 'g1',
      section: 'the-question',
      tab: 'The program',
      code: {
        rust: [
          { title: 'src/main.rs', code: MAIN_RS, lang: 'rust' },
          terminal('cargo run -- question.strig ana document.view document:spec project:apollo org:acme'),
        ],
        node: [
          { title: 'ask.mjs', code: ASK_MJS, lang: 'ts' },
          terminal('node ask.mjs question.strig ana document.view document:spec project:apollo org:acme'),
        ],
      },
      note: (
        <>
          The policy file is the first argument. Save each policy of this page under the name its command uses. The
          outputs are the Rust program&apos;s: Node prints the same decision with the keys in alphabetical order and{' '}
          <code>grantId</code> for <code>grant_id</code>.
        </>
      ),
      run: { command: 'src/main.rs, then cargo run -- question.strig ana document.view …' },
    },
    {
      id: 'p1',
      section: 'permissions',
      tab: 'Implied by a grant',
      question: 'Can Ana export an invoice, with a grant for document.export?',
      verdict: 'allow',
      reason: 'Granted by g-export, through document.export.',
      trail: {
        steps: [
          quiet('document:d1', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'allow',
            fate: (
              <>
                <code>g-export</code> allows <code>document.export</code> to ana, which implies{' '}
                <code>document.invoice.export</code>. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('perms.strig', 'ana', 'document.invoice.export', 'd1', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-export",
    "permission": "document.export",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-export"
  ]
}`,
      },
    },
    {
      id: 'p2',
      section: 'permissions',
      tab: 'Not the other way',
      question: 'Can Cara export a document, with a grant for document.invoice.export?',
      verdict: 'deny',
      reason: 'No grant applies.',
      trail: {
        steps: [
          quiet('document:d1', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-invoice</code> is for <code>document.invoice.export</code>, which does not imply{' '}
                <code>document.export</code>.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: NOTHING_APPLIED,
      },
      ...ask('perms.strig', 'cara', 'document.export', 'd1', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  }
}`,
      },
    },
    {
      id: 'p3',
      section: 'permissions',
      tab: 'Not in the catalog',
      question: 'Can Ana delete a document, a permission the catalog does not declare?',
      verdict: 'deny',
      reason: 'document.delete is not in the catalog.',
      trail: {
        steps: [
          quiet('document:d1', 'rank 0'),
          quiet('project:apollo', 'rank 1'),
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            The engine stops before it reads any grant: <code>unknown_permission</code>.
          </>
        ),
      },
      ...ask('perms.strig', 'ana', 'document.delete', 'd1', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "unknown_permission"
  }
}`,
      },
    },
    {
      id: 't1',
      section: 'targets-and-broad-targets',
      tab: 'A grant on org',
      question: 'Can Dan view a document in Apollo, with a grant on org?',
      verdict: 'allow',
      reason: 'Granted by g-view, on org:acme at rank 2.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          quiet('project:apollo', 'rank 1'),
          {
            step: 'org:acme',
            rank: 'rank 2',
            decides: 'allow',
            fate: (
              <>
                <code>g-view</code> allows <code>document.view</code> to <code>member</code>. It sits on <code>org</code>,
                a broad target, though the permission lists only <code>document</code>. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('targets.strig', 'dan', 'document.view', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-view",
    "permission": "document.view",
    "rank": 2,
    "strategy": "most_specific"
  },
  "matched": [
    "g-view"
  ]
}`,
      },
    },
    {
      id: 't2',
      section: 'targets-and-broad-targets',
      tab: 'Outside the scope',
      question: 'Can Dan view the same document in another organization?',
      verdict: 'deny',
      reason: 'No grant applies: the path does not pass through org:acme.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          quiet('project:apollo', 'rank 1'),
          {
            step: 'org:globex',
            rank: 'rank 2',
            fate: (
              <>
                <code>g-view</code> is limited to <code>org:acme</code> by its scope. This path goes through{' '}
                <code>org:globex</code>.
              </>
            ),
          },
          quiet('global', 'rank 3'),
        ],
        foot: NOTHING_APPLIED,
      },
      ...ask('targets.strig', 'dan', 'document.view', 'spec', 'apollo', 'globex'),
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  }
}`,
      },
    },
    {
      id: 't3',
      section: 'targets-and-broad-targets',
      tab: 'A target the permission refuses',
      question: 'What happens to a grant of project.rename on a document?',
      code: {
        rust: [
          {
            title: 'Check · Rust',
            lang: 'rust',
            code: `if let Err(error) = strig::dsl::fs::read_file("bad.strig") {
    println!("{error}");
}`,
          },
          { title: 'bad.strig', lang: 'rules', code: BAD },
        ],
      },
      output: {
        label: 'Output: bad.strig',
        text: `bad.strig:10:50: \`project.rename\` does not accept the target \`document\`
  hint: accepted: project`,
      },
      note: (
        <>
          The file does not load, so no decision is made against it. <code>project.rename</code> lists{' '}
          <code>project</code> and <code>org</code> is broad, but <code>document</code> is neither.
        </>
      ),
      run: { command: 'read_file("bad.strig")', tag: 'Rust' },
    },
    {
      id: 'r1',
      section: 'roles',
      tab: 'Editor in Apollo',
      question: 'Can Ana, an editor in Apollo, edit a document there?',
      verdict: 'allow',
      reason: 'Granted by g-edit, through document.edit.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'allow',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to <code>editor</code>, and Ana is an editor
                here. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            <code>document.view</code> comes from <code>g-view</code>, written for <code>viewer</code>, which{' '}
            <code>editor</code> inherits.
          </>
        ),
      },
      ...ask('roles.strig', 'ana', 'document.edit', 'spec', 'apollo'),
      output: {
        label: 'Output: Apollo',
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-edit",
    "permission": "document.edit",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-edit"
  ]
}`,
      },
    },
    {
      id: 'r2',
      section: 'roles',
      tab: 'Same question in Zephyr',
      question: 'Can she edit the same document in Zephyr?',
      verdict: 'deny',
      reason: 'No grant applies.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:zephyr',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-edit</code> and <code>g-view</code> are written for <code>editor</code> and{' '}
                <code>viewer</code>. Ana holds no role in Zephyr.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: NOTHING_APPLIED,
      },
      ...ask('roles.strig', 'ana', 'document.edit', 'spec', 'zephyr'),
      output: {
        label: 'Output: Zephyr',
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  }
}`,
      },
    },
    {
      id: 'r3',
      section: 'roles',
      tab: 'The same policy, by actor',
      code: { rust: [{ title: 'roles.strig · Actors', code: ROLES_ACTORS, lang: 'actors' }] },
      note: (
        <>
          The Actors syntax groups the policy by who acts. This file decides exactly as <code>roles.strig</code>{' '}
          does, and <code>convert</code> wrote it from that file.
        </>
      ),
      run: { command: 'convert(roles.strig, Language::Actors)', tag: 'Rust' },
    },
    {
      id: 'c1',
      section: 'conditions',
      tab: 'Ana, in legal',
      question: 'Can Ana, whose dept is "legal", edit a document in Apollo?',
      verdict: 'allow',
      reason: 'Granted by g-legal: the condition holds.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'allow',
            fate: (
              <>
                <code>g-legal</code> allows <code>document.edit</code> to <code>editor</code> when{' '}
                <code>{'subject.dept == "legal"'}</code>. {"Ana's is."} <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            <code>reason.kind</code> is <code>grant</code>, by <code>g-legal</code>.
          </>
        ),
      },
      ...ask('conditions.strig', 'ana', 'document.edit', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-legal",
    "permission": "document.edit",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-legal"
  ]
}`,
      },
    },
    {
      id: 'c2',
      section: 'conditions',
      tab: 'Bob, in sales',
      question: 'Can Bob, whose dept is "sales", edit it?',
      verdict: 'deny',
      reason: 'No grant applies: the condition is false.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-legal</code> needs <code>{'subject.dept == "legal"'}</code>. {"Bob's is "}
                <code>{'"sales"'}</code>, so it does not apply.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: NOTHING_APPLIED,
      },
      code: {
        rust: [terminal('cargo run -- conditions.strig bob document.edit document:spec project:apollo org:acme')],
      },
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  }
}`,
      },
      run: { command: 'conditions.strig bob document.edit document:spec project:apollo org:acme' },
    },
    {
      id: 'c3',
      section: 'conditions',
      tab: 'Eve, no dept',
      question: 'Can Eve, who has no dept, edit it?',
      verdict: 'deny',
      reason: 'No grant applies: subject.dept is missing.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-legal</code> needs <code>subject.dept</code>, and Eve has none. The condition cannot be
                evaluated, so the grant does not apply.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            <code>no_applicable_grant</code>, with a warning. A condition that cannot be evaluated never opens
            access.
          </>
        ),
      },
      code: {
        rust: [terminal('cargo run -- conditions.strig eve document.edit document:spec project:apollo org:acme')],
      },
      output: {
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "no_applicable_grant"
  },
  "warnings": [
    "grant g-legal: atributo ausente: subject.dept"
  ]
}`,
        portuguese: ['"grant g-legal: atributo ausente: subject.dept"'],
      },
      note: 'The warning text is in Portuguese in 0.6.1.',
      run: { command: 'conditions.strig eve document.edit document:spec project:apollo org:acme' },
    },
    {
      id: 'd1',
      section: 'prerequisites',
      tab: 'Edit without view',
      question: 'Can Bob edit a document, with a grant for document.edit and none for document.view?',
      verdict: 'deny',
      reason: 'document.edit needs document.view on the same resource.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-edit-bob</code> allows <code>document.edit</code> to bob. It applies, and needs{' '}
                <code>document.view</code> too.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            <code>document.view</code> has no grant for bob at any step: <code>missing_prerequisite</code>.
          </>
        ),
      },
      ...ask('prereq.strig', 'bob', 'document.edit', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "missing_prerequisite",
    "permission": "document.edit",
    "prerequisite": "document.view"
  },
  "matched": [
    "g-edit-bob"
  ]
}`,
      },
    },
    {
      id: 'd2',
      section: 'prerequisites',
      tab: 'Edit with view',
      question: 'Can Ana edit it, holding both?',
      verdict: 'allow',
      reason: 'Granted by g-edit-ana, and document.view holds too.',
      trail: {
        steps: [
          quiet('document:spec', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'allow',
            fate: (
              <>
                <code>g-edit-ana</code> allows <code>document.edit</code>, and <code>g-view</code> allows{' '}
                <code>document.view</code> to ana. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('prereq.strig', 'ana', 'document.edit', 'spec', 'apollo'),
      output: {
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-edit-ana",
    "permission": "document.edit",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-edit-ana"
  ]
}`,
      },
    },
    {
      id: 'w1',
      section: 'which-grant-decides',
      tab: 'A frozen project, one document',
      question: 'Can Ana edit document:spec while the project is frozen?',
      verdict: 'allow',
      reason: 'Granted by g-edit, on document:spec at rank 0.',
      trail: {
        steps: [
          {
            step: 'document:spec',
            rank: 'rank 0',
            decides: 'allow',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to <code>editor</code>. The closest step with a
                grant. <strong>Decides.</strong>
              </>
            ),
          },
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-freeze</code> denies <code>document.edit</code> to anyone. Matched, outranked.
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('strategy.strig', 'ana', 'document.edit', 'spec', 'apollo'),
      output: {
        label: 'Output: document:spec',
        open: false,
        text: `{
  "effect": "allow",
  "reason": {
    "kind": "grant",
    "grant_id": "g-edit",
    "permission": "document.edit",
    "rank": 0,
    "strategy": "most_specific"
  },
  "matched": [
    "g-edit",
    "g-freeze"
  ]
}`,
      },
    },
    {
      id: 'w2',
      section: 'which-grant-decides',
      tab: 'Another document',
      question: 'Can she edit document:notes?',
      verdict: 'deny',
      reason: 'Denied by g-freeze, on project:apollo at rank 1.',
      trail: {
        steps: [
          quiet('document:notes', 'rank 0'),
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'deny',
            fate: (
              <>
                <code>g-freeze</code> denies <code>document.edit</code> to anyone. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: MOST_SPECIFIC,
      },
      ...ask('strategy.strig', 'ana', 'document.edit', 'notes', 'apollo'),
      output: {
        label: 'Output: document:notes',
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "grant",
    "grant_id": "g-freeze",
    "permission": "document.edit",
    "rank": 1,
    "strategy": "most_specific"
  },
  "matched": [
    "g-freeze"
  ]
}`,
      },
    },
    {
      id: 'w3',
      section: 'which-grant-decides',
      tab: 'Under deny_overrides',
      question: 'With deny_overrides, can she edit document:spec?',
      verdict: 'deny',
      reason: 'Denied by g-freeze, at any step.',
      trail: {
        steps: [
          {
            step: 'document:spec',
            rank: 'rank 0',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to <code>editor</code>. Matched, set aside: a
                deny at any step wins.
              </>
            ),
          },
          {
            step: 'project:apollo',
            rank: 'rank 1',
            decides: 'deny',
            fate: (
              <>
                <code>g-freeze</code> denies <code>document.edit</code> to anyone. <strong>Decides.</strong>
              </>
            ),
          },
          quiet('org:acme', 'rank 2'),
          quiet('global', 'rank 3'),
        ],
        foot: (
          <>
            Strategy: <code>deny_overrides</code>, added after <code>broad org</code>.
          </>
        ),
      },
      ...ask('strategy.strig', 'ana', 'document.edit', 'spec', 'apollo'),
      output: {
        label: 'Output: deny_overrides',
        open: false,
        text: `{
  "effect": "deny",
  "reason": {
    "kind": "grant",
    "grant_id": "g-freeze",
    "permission": "document.edit",
    "rank": 1,
    "strategy": "deny_overrides"
  },
  "matched": [
    "g-edit",
    "g-freeze"
  ]
}`,
      },
      note: (
        <>
          The policy below, with <code>strategy deny_overrides</code> added after <code>broad org</code>.
        </>
      ),
    },
    {
      id: 'y1',
      section: 'reading-the-answer',
      tab: 'Reason',
      code: { rust: [{ title: 'Reason · strig 0.6.1', code: REASON, lang: 'rust' }] },
      note: (
        <>
          <code>tag = &quot;kind&quot;</code> and <code>snake_case</code> are why <code>NoApplicableGrant</code> prints
          as <code>&quot;kind&quot;: &quot;no_applicable_grant&quot;</code>. Every field is public;{' '}
          <code>Decision::is_allowed</code> is the only method. The full list is in the{' '}
          <a href="/docs/reference#reason">reference</a>.
        </>
      ),
      run: { command: 'pub enum Reason, in src/decision.rs' },
    },
  ],
};
