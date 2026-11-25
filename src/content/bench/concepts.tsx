import type { BenchCode, PageBench } from './types';

// The bench of Concepts (content/docs/concepts.mdx). Policies, code and
// outputs come from Strig 0.6.1, run through the program of "The program";
// keep them byte for byte.

const PERMS = `language rules

kinds project, document
broad org

permission document.view on project, document
permission document.edit on project, document depends_on document.view
permission document.export on project, document
permission document.invoice.export on document implied by document.export

user:ana
user:bob

g-edit: allow user bob to document.edit on project in org:acme
g-export: allow user ana to document.export on project in org:acme`;

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

const PREC = `language rules

kinds project, document
broad org

permission document.edit on project, document

role editor

user:ana has role editor in org:acme

g-edit: allow role editor to document.edit on document:spec in org:acme
g-freeze: deny anyone to document.edit on project in org:acme`;

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

// The request of a case: the subject, then the resource path, then the question.
function request(user: string, permission: string, doc: string, project: string): BenchCode {
  return {
    title: 'Request · Rust',
    lang: 'rust',
    code: `let ${user} = policy.subjects.iter()
    .find(|s| s.id.as_deref() == Some("${user}")).expect("subject");
let ${doc} = Resource::new("document", "${doc}")
    .within("project", "${project}")
    .within("org", "acme");

let decision = engine.decide(
    &context,
    &Request::new(${user}, "${permission}", &${doc}),
);`,
  };
}

function terminal(command: string): BenchCode {
  return { title: 'Terminal', lang: 'text', code: `$ ${command}` };
}

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

const PROGRAM_ARGS = 'perms.strig bob document.edit document:spec project:apollo org:acme';

const NO_GRANT = 'No grant on this step.';
const QUIET_ORG = { step: 'org:acme', rank: 'rank 2', quiet: true, fate: NO_GRANT };
const QUIET_GLOBAL = { step: 'global', rank: 'rank 3', quiet: true, fate: NO_GRANT };
const QUIET_SPEC = { step: 'document:spec', rank: 'rank 0', quiet: true, fate: NO_GRANT };
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
      id: 'permissions',
      title: 'Permissions',
      file: 'perms.strig',
      policy: { file: 'perms.strig', code: PERMS, lang: 'rules' },
    },
    {
      id: 'roles',
      title: 'Roles',
      file: 'roles.strig',
      policy: { file: 'roles.strig', code: ROLES, lang: 'rules' },
    },
    {
      id: 'which-grant-wins',
      title: 'Which grant wins',
      file: 'prec.strig',
      policy: { file: 'prec.strig', code: PREC, lang: 'rules' },
    },
    {
      id: 'conditions',
      title: 'Conditions',
      file: 'cond.strig',
      policy: { file: 'cond.strig', code: COND, lang: 'rules' },
    },
    {
      id: 'why-an-answer-came-out-that-way',
      title: 'Why an answer came out that way',
      file: 'src/decision.rs',
    },
    {
      id: 'the-program',
      title: 'The program',
      file: { rust: 'src/main.rs', node: 'ask.mjs' },
    },
  ],
  cases: [
    {
      id: 'p1',
      section: 'permissions',
      tab: 'Bob edits the spec',
      question: 'Can Bob edit the spec with a grant for document.edit alone?',
      verdict: 'deny',
      reason: 'document.edit needs document.view on the same resource.',
      trail: {
        steps: [
          QUIET_SPEC,
          {
            step: 'project:apollo',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to bob. It applies, and needs{' '}
                <code>document.view</code> too.
              </>
            ),
          },
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: (
          <>
            <code>document.view</code> has no grant at any step: <code>missing_prerequisite</code>.
          </>
        ),
      },
      code: {
        rust: [
          request('bob', 'document.edit', 'spec', 'apollo'),
          terminal('cargo run -- perms.strig bob document.edit document:spec project:apollo org:acme'),
        ],
      },
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
    "g-edit"
  ]
}`,
      },
      run: { command: 'perms.strig bob document.edit document:spec project:apollo org:acme' },
    },
    {
      id: 'p2',
      section: 'permissions',
      tab: 'Ana exports an invoice',
      question: 'Can Ana export an invoice with a grant for document.export?',
      verdict: 'allow',
      reason: 'Granted by g-export, through document.export.',
      trail: {
        steps: [
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: MOST_SPECIFIC,
      },
      code: {
        rust: [
          request('ana', 'document.invoice.export', 'spec', 'apollo'),
          terminal('cargo run -- perms.strig ana document.invoice.export document:spec project:apollo org:acme'),
        ],
      },
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
      run: { command: 'perms.strig ana document.invoice.export document:spec project:apollo org:acme' },
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
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: (
          <>
            <code>document.view</code> comes from <code>g-view</code>, written for <code>viewer</code>, which{' '}
            <code>editor</code> inherits.
          </>
        ),
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'spec', 'apollo'),
          terminal('cargo run -- roles.strig ana document.edit document:spec project:apollo org:acme'),
        ],
      },
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
      run: { command: 'roles.strig ana document.edit document:spec project:apollo org:acme' },
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
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: NOTHING_APPLIED,
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'spec', 'zephyr'),
          terminal('cargo run -- roles.strig ana document.edit document:spec project:zephyr org:acme'),
        ],
      },
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
      run: { command: 'roles.strig ana document.edit document:spec project:zephyr org:acme' },
    },
    {
      id: 'w1',
      section: 'which-grant-wins',
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: MOST_SPECIFIC,
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'spec', 'apollo'),
          terminal('cargo run -- prec.strig ana document.edit document:spec project:apollo org:acme'),
        ],
      },
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
      run: { command: 'prec.strig ana document.edit document:spec project:apollo org:acme' },
    },
    {
      id: 'w2',
      section: 'which-grant-wins',
      tab: 'Another document',
      question: 'Can she edit document:notes?',
      verdict: 'deny',
      reason: 'Denied by g-freeze, on project:apollo at rank 1.',
      trail: {
        steps: [
          { step: 'document:notes', rank: 'rank 0', quiet: true, fate: NO_GRANT },
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: MOST_SPECIFIC,
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'notes', 'apollo'),
          terminal('cargo run -- prec.strig ana document.edit document:notes project:apollo org:acme'),
        ],
      },
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
      run: { command: 'prec.strig ana document.edit document:notes project:apollo org:acme' },
    },
    {
      id: 'w3',
      section: 'which-grant-wins',
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: (
          <>
            Strategy: <code>deny_overrides</code>, added after <code>broad org</code>.
          </>
        ),
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'spec', 'apollo'),
          terminal('cargo run -- prec.strig ana document.edit document:spec project:apollo org:acme'),
        ],
      },
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
      run: { command: 'prec.strig ana document.edit document:spec project:apollo org:acme' },
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
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: (
          <>
            <code>reason.kind</code> is <code>grant</code>, by <code>g-legal</code>.
          </>
        ),
      },
      code: {
        rust: [
          request('ana', 'document.edit', 'spec', 'apollo'),
          terminal('cargo run -- cond.strig ana document.edit document:spec project:apollo org:acme'),
        ],
      },
      run: { command: 'cond.strig ana document.edit document:spec project:apollo org:acme' },
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
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: NOTHING_APPLIED,
      },
      code: {
        rust: [terminal('cargo run -- cond.strig bob document.edit document:spec project:apollo org:acme')],
      },
      run: { command: 'cond.strig bob document.edit document:spec project:apollo org:acme' },
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
          QUIET_SPEC,
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
          QUIET_ORG,
          QUIET_GLOBAL,
        ],
        foot: (
          <>
            <code>no_applicable_grant</code>, with a warning. A condition that cannot be evaluated never opens
            access.
          </>
        ),
      },
      code: {
        rust: [terminal('cargo run -- cond.strig eve document.edit document:spec project:apollo org:acme')],
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
      run: { command: 'cond.strig eve document.edit document:spec project:apollo org:acme' },
    },
    {
      id: 'y1',
      section: 'why-an-answer-came-out-that-way',
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
    {
      id: 'g1',
      section: 'the-program',
      tab: 'The program',
      code: {
        rust: [
          { title: 'src/main.rs', code: MAIN_RS, lang: 'rust' },
          terminal(`cargo run -- ${PROGRAM_ARGS}`),
        ],
        node: [
          { title: 'ask.mjs', code: ASK_MJS, lang: 'ts' },
          terminal(`node ask.mjs ${PROGRAM_ARGS}`),
        ],
      },
      run: { command: `src/main.rs, then cargo run -- ${PROGRAM_ARGS}` },
    },
  ],
};
