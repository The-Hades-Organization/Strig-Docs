import type { PageBench } from './types';

// The bench of the docs home (content/docs/index.mdx). Code and outputs come
// from Strig 0.6.1; keep them byte for byte.

const POLICY = `language rules

kinds document, folder, project
broad org

permission document.view on project, folder, document
permission document.edit on project, folder, document depends_on document.view

role viewer
role editor inherits viewer

user:bruno has role editor in project:apollo

g-view: allow role viewer to document.view on project in org:acme
g-edit: allow role editor to document.edit on project in org:acme
g-seal: deny role editor to document.edit on folder:legal in org:acme`;

const PLANS = `let plans = Resource::new("document", "spec")
    .within("folder", "plans")
    .within("project", "apollo")
    .within("org", "acme");

let decision = engine.decide(&ctx, &Request::new(bruno, "document.edit", &plans));
assert!(decision.is_allowed());`;

const LEGAL = `let legal = Resource::new("document", "spec")
    .within("folder", "legal")
    .within("project", "apollo")
    .within("org", "acme");

let decision = engine.decide(&ctx, &Request::new(bruno, "document.edit", &legal));
assert!(!decision.is_allowed());
assert!(matches!(&decision.reason, Reason::Grant { grant_id, .. } if grant_id == "g-seal"));`;

const ZEPHYR = `let zephyr = Resource::new("document", "spec")
    .within("project", "zephyr")
    .within("org", "acme");

let decision = engine.decide(&ctx, &Request::new(bruno, "document.edit", &zephyr));
assert!(!decision.is_allowed());
assert!(matches!(decision.reason, Reason::NoApplicableGrant));`;

const NO_GRANT = 'No grant on this step.';

export const bench: PageBench = {
  sections: [
    {
      id: 'three-questions',
      onPage: 'Three questions',
      title: 'Three questions',
      file: 'documents.strig',
      tabsLabel: 'Questions on this page',
      note: (
        <>
          <code>engine</code>, <code>ctx</code> and <code>bruno</code> come from Ask it, on the left.
        </>
      ),
      policy: { file: 'documents.strig', code: POLICY, lang: 'rules' },
    },
  ],
  cases: [
    {
      id: 'plans',
      section: 'three-questions',
      tab: 'Plans folder',
      question: "Can Bruno edit a document in Apollo's plans folder?",
      verdict: 'allow',
      reason: 'Granted by g-edit, on project:apollo at rank 2.',
      trail: {
        steps: [
          { step: 'document:spec', rank: 'rank 0', quiet: true, fate: NO_GRANT },
          {
            step: 'folder:plans',
            rank: 'rank 1',
            quiet: true,
            fate: (
              <>
                No grant on this step. <code>g-seal</code> sits on <code>folder:legal</code>, which is not on this
                path.
              </>
            ),
          },
          {
            step: 'project:apollo',
            rank: 'rank 2',
            decides: 'allow',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to <code>editor</code>, and Bruno is an
                editor here. <strong>Decides.</strong>
              </>
            ),
          },
          { step: 'org:acme', rank: 'rank 3', quiet: true, fate: NO_GRANT },
          { step: 'global', rank: 'rank 4', quiet: true, fate: NO_GRANT },
        ],
        foot: (
          <>
            <code>document.view</code> comes from <code>g-view</code>, written for <code>viewer</code>, which{' '}
            <code>editor</code> inherits.
          </>
        ),
      },
      code: { rust: [{ title: 'Request · Rust', code: PLANS, lang: 'rust' }] },
    },
    {
      id: 'legal',
      section: 'three-questions',
      tab: 'Legal folder',
      question: "Can Bruno edit a document in Apollo's legal folder?",
      verdict: 'deny',
      reason: 'Denied by g-seal, on folder:legal at rank 1.',
      trail: {
        steps: [
          { step: 'document:spec', rank: 'rank 0', quiet: true, fate: NO_GRANT },
          {
            step: 'folder:legal',
            rank: 'rank 1',
            decides: 'deny',
            fate: (
              <>
                <code>g-seal</code> denies <code>document.edit</code> to <code>editor</code>. The closest step with a
                grant. <strong>Decides.</strong>
              </>
            ),
          },
          {
            step: 'project:apollo',
            rank: 'rank 2',
            fate: (
              <>
                <code>g-edit</code> allows <code>document.edit</code> to <code>editor</code>. Matched, outranked.
              </>
            ),
          },
          { step: 'org:acme', rank: 'rank 3', quiet: true, fate: NO_GRANT },
          { step: 'global', rank: 'rank 4', quiet: true, fate: NO_GRANT },
        ],
        foot: (
          <>
            Strategy: <code>most_specific</code>, the default.
          </>
        ),
      },
      code: { rust: [{ title: 'Request · Rust', code: LEGAL, lang: 'rust' }] },
    },
    {
      id: 'zephyr',
      section: 'three-questions',
      tab: 'Zephyr',
      question: 'Can Bruno edit a document in Zephyr?',
      verdict: 'deny',
      reason: 'No grant applies.',
      trail: {
        steps: [
          { step: 'document:spec', rank: 'rank 0', quiet: true, fate: NO_GRANT },
          {
            step: 'project:zephyr',
            rank: 'rank 1',
            fate: (
              <>
                <code>g-view</code> and <code>g-edit</code> are written for <code>viewer</code> and{' '}
                <code>editor</code>. Bruno holds <code>editor</code> only in <code>project:apollo</code>.
              </>
            ),
          },
          { step: 'org:acme', rank: 'rank 2', quiet: true, fate: NO_GRANT },
          { step: 'global', rank: 'rank 3', quiet: true, fate: NO_GRANT },
        ],
        foot: (
          <>
            Nothing applied: <code>no_applicable_grant</code>, so the answer is <code>deny</code>.
          </>
        ),
      },
      code: { rust: [{ title: 'Request · Rust', code: ZEPHYR, lang: 'rust' }] },
    },
  ],
};
