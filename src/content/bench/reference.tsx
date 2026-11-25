import type { ReactNode } from 'react';
import { ApiReturns } from '../../ds/ApiParts';
import type { BenchCase, BenchCode, BenchSection, PageBench } from './types';

// The bench of the reference page (content/docs/reference.mdx). Each item with
// a pick in the text has one section here, holding one case: its signature,
// examples copied from the published crate strig 0.6.1 (the caption names the
// file and lines, relative to the crate root), and what it returns. Keep the
// code byte for byte; the examples call the helpers of the test they come from.
//
// A section's id names no element of the page, so scrolling never moves the
// bench: it shows the item picked last, Engine::decide until then.

type Item = {
  // The case id, which <ApiItem pick="..."> names.
  id: string;
  name: string;
  // Where the item is declared, relative to the crate's src/.
  at: string;
  sig: string;
  examples: BenchCode[];
  returns: ReactNode;
  label?: string;
};

const example = (source: string, code: string): BenchCode => ({ title: `Example · ${source}`, code, lang: 'rust' });

const ITEMS: Item[] = [
  {
    id: 'decide',
    name: 'Engine::decide',
    at: 'engine.rs:214',
    sig: "pub fn decide(&self, ctx: &Context<'_>, request: &Request<'_>) -> Decision",
    examples: [
      example(
        'tests/decisions.rs:103-117',
        `#[test]
fn owner_can_everything() {
    let owned = project().with_attr("owner", "u1");
    let decision = engine().decide(
        &Context::new(&Vec::new()),
        &Request::new(&member(), "project.delete", &owned),
    );
    assert_eq!(decision.effect, Effect::Allow);
    assert_eq!(
        decision.reason,
        Reason::Override {
            name: "resource_owner".into()
        }
    );
}`,
      ),
    ],
    returns: (
      <>
        <code>Decision</code>, always: a deny is an answer, not an error. Here <code>effect</code> is{' '}
        <code>Effect::Allow</code> and <code>reason</code> is <code>{'Reason::Override { name: "resource_owner" }'}</code>.
        The test&apos;s engine has a <code>ResourceOwner::new(&quot;owner&quot;)</code> override, and <code>u1</code>{' '}
        owns the project, so no grant was needed.
      </>
    ),
  },
  {
    id: 'builder',
    name: 'Engine::builder',
    at: 'engine.rs:188',
    sig: 'pub fn builder(catalog: impl Into<Arc<Catalog>>) -> EngineBuilder',
    examples: [
      example(
        'README.md:71-73',
        `let engine = Engine::builder(catalog)
    .override_with(ResourceOwner::new("owner"))
    .build()?;`,
      ),
      example(
        'tests/models.rs:166',
        'let engine = Engine::builder(catalog()).strategy(DenyOverrides).build().unwrap();',
      ),
    ],
    returns: (
      <>
        <code>EngineBuilder</code>. Its <code>build</code> returns <code>{'Result<Engine, EngineError>'}</code>.
      </>
    ),
  },
  {
    id: 'check',
    name: 'Engine::check',
    at: 'engine.rs:210',
    sig: "pub fn check(&self, ctx: &Context<'_>, request: &Request<'_>) -> bool",
    examples: [
      example(
        'tests/decisions.rs:14-16',
        `fn can(grants: &[Grant], subject: &Subject, key: &str, resource: &Resource) -> bool {
    engine().check(&Context::new(&grants), &Request::new(subject, key, resource))
}`,
      ),
    ],
    returns: (
      <>
        <code>bool</code>: <code>decide(..).is_allowed()</code>. The reason is dropped; call <code>decide</code> when you
        need it.
      </>
    ),
  },
  {
    id: 'explain',
    name: 'Engine::explain',
    at: 'engine.rs:232',
    sig: "pub fn explain(&self, ctx: &Context<'_>, request: &Request<'_>) -> Explanation",
    examples: [
      example(
        'tests/catalog_prerequisites.rs:95-110',
        `let engine = engine();
let grants = vec![allow("g1", "ana", "doc.publish"), allow("g2", "ana", "doc.edit")];
let ana = Subject::user("ana");
let resource = project();
let request = Request::new(&ana, "doc.publish", &resource);
let explanation = engine.explain(&Context::new(&grants), &request);
assert!(matches!(
    explanation.decision.reason,
    Reason::MissingPrerequisite { ref prerequisite, .. } if prerequisite == "doc.view"
));
let steps: Vec<_> = explanation
    .prerequisites
    .iter()
    .map(|s| (s.permission.as_str(), s.allowed))
    .collect();
assert!(steps.contains(&("doc.view", false)));`,
      ),
    ],
    returns: (
      <>
        <code>Explanation</code>: the same <code>Decision</code> in <code>explanation.decision</code>, plus the path,
        the roles in force, each override and each grant&apos;s fate, and the prerequisite steps.
      </>
    ),
  },
  {
    id: 'checkfor',
    name: 'Engine::check_for',
    at: 'query.rs:1951',
    sig: "pub fn check_for(&self, ctx: &QueryContext<'_>, resolver: &dyn SubjectResolver, subject: &SubjectRef, permission: &str, resource: &Resource) -> Result<CheckAnswer, QueryError>",
    examples: [
      example(
        'tests/query_prerequisites.rs:79-81, 93-94',
        `let qctx = QueryContext::new(&grants);
let me = SubjectRef::User { id: "u1".into() };
let resolver = InMemorySubjects::new().with(Subject::user("u1"));
let answer = engine.check_for(&qctx, &resolver, &me, "doc.edit", &resource).unwrap();
assert_eq!(answer.decision.is_allowed(), checked);`,
      ),
    ],
    returns: (
      <>
        <code>{'Result<CheckAnswer, QueryError>'}</code>. <code>CheckAnswer</code> has <code>subject</code>,{' '}
        <code>decision</code>, <code>via: AccessVia</code> (the path that decided) and <code>explanation</code>. A
        subject the resolver cannot load is <code>QueryError::UnknownSubject</code>, never an allow.
      </>
    ),
  },
  {
    id: 'list',
    name: 'Engine::list',
    at: 'query.rs:1181',
    sig: "pub fn list(&self, ctx: &QueryContext<'_>, subject: &Subject, permission: &str, kind: &str) -> AccessFilter",
    examples: [
      example(
        'tests/query_listing.rs:296, 300-302',
        `let qctx = QueryContext::new(&grants).with_tuples(&store);
let subject = Subject::user("u1").with_role_in("member", org());
let filter = engine.list(&qctx, &subject, "document.view", "document");
assert!(filter.is_exact(&layout));`,
      ),
    ],
    returns: (
      <>
        <code>AccessFilter</code>: what of <code>kind</code> the subject reaches. When it is not exact, its{' '}
        <code>residual()</code> must be checked row by row.
      </>
    ),
  },
  {
    id: 'whocan',
    name: 'Engine::who_can_on',
    at: 'query.rs:1836',
    sig: "pub fn who_can_on(&self, ctx: &QueryContext<'_>, permission: &str, resource: &Resource) -> Result<WhoCan, QueryError>",
    examples: [
      example(
        'tests/query_prerequisites.rs:87-91',
        `let listed = engine
    .who_can_on(&qctx, "doc.edit", &resource)
    .unwrap()
    .subjects()
    .any(|s| *s == me);`,
      ),
    ],
    returns: (
      <>
        <code>{'Result<WhoCan, QueryError>'}</code>: who holds the permission on this resource, overrides included. In
        this test it agrees with <code>check</code> for every resource.
      </>
    ),
  },
  {
    id: 'decision',
    name: 'Decision',
    at: 'decision.rs:48',
    sig: 'pub struct Decision { pub effect: Effect, pub reason: Reason, pub matched: Vec<String>, pub warnings: Vec<String> }',
    examples: [
      example(
        'README.md:87-88',
        `let decision = engine.decide(&Context::new(&grants), &Request::new(&dave, "document.invoice.export", &invoice));
assert!(!decision.is_allowed()); // g2 sits on a more specific step than g1`,
      ),
    ],
    label: 'Holds',
    returns: (
      <>
        <code>effect</code>, <code>reason</code>, <code>matched</code> (every grant id that applied, in source order)
        and <code>warnings</code>. <code>matched</code> and <code>warnings</code> are left out of the JSON when empty.
      </>
    ),
  },
  {
    id: 'reason',
    name: 'Reason',
    at: 'decision.rs:28',
    sig: 'pub enum Reason',
    examples: [
      example(
        'tests/catalog_prerequisites.rs:69-83',
        `#[test]
fn allow_without_prerequisite_is_denied_with_its_own_reason() {
    let engine = engine();
    let grants = vec![allow("g", "ana", "doc.edit")];
    let ana = Subject::user("ana");
    let decision = engine.decide(&Context::new(&grants), &Request::new(&ana, "doc.edit", &project()));
    assert_eq!(decision.effect, Effect::Deny);
    assert_eq!(
        decision.reason,
        Reason::MissingPrerequisite {
            permission: "doc.edit".into(),
            prerequisite: "doc.view".into()
        }
    );
}`,
      ),
    ],
    label: 'Holds',
    returns: (
      <>
        Here <code>Reason::MissingPrerequisite</code>: the grant allowed <code>doc.edit</code>, but{' '}
        <code>doc.view</code>, which it depends on, was not allowed on the same resource.
      </>
    ),
  },
  {
    id: 'request',
    name: 'Request::new',
    at: 'decision.rs:16',
    sig: "pub fn new(subject: &'a Subject, permission: &'a str, resource: &'a Resource) -> Self",
    examples: [
      example(
        'README.md:81-87',
        `let dave = Subject::user("dave").with_role_in("member", Anchor::new("org", "acme"));
let invoice = Resource::new("document", "d1")
    .within("doc_type", "invoice")
    .within("project", "p1")
    .within("org", "acme");

let decision = engine.decide(&Context::new(&grants), &Request::new(&dave, "document.invoice.export", &invoice));`,
      ),
    ],
    returns: (
      <>
        <code>{"Request<'a>"}</code>, which borrows the subject, the permission and the resource. It owns nothing.
      </>
    ),
  },
  {
    id: 'grant',
    name: 'Grant::allow',
    at: 'grant.rs:137',
    sig: 'pub fn allow(id: impl Into<String>, subject: SubjectMatcher, permission: impl Into<String>, target: TargetSelector) -> Self',
    examples: [
      example(
        'README.md:75-79',
        `let grants = vec![
    Grant::allow("g1", SubjectMatcher::role("member"), "document.export", TargetSelector::kind("org"))
        .scoped(Anchor::new("org", "acme")),
    Grant::deny("g2", SubjectMatcher::Any, "document.invoice.export", TargetSelector::exact("doc_type", "invoice")),
];`,
      ),
    ],
    returns: (
      <>
        <code>Grant</code>, an allow. Chain <code>scoped</code>, <code>when</code> or <code>valid_between</code> to
        narrow it. <code>Engine::validate_grant</code> checks it before you store it.
      </>
    ),
  },
  {
    id: 'strategy',
    name: 'Strategy',
    at: 'strategy.rs:23',
    sig: "pub trait Strategy: Send + Sync { fn name(&self) -> &'static str; fn combine(&self, candidates: &[Candidate]) -> Option<usize>; fn native(&self) -> Option<NativeStrategy> { None } }",
    examples: [
      example(
        'tests/models.rs:166',
        'let engine = Engine::builder(catalog()).strategy(DenyOverrides).build().unwrap();',
      ),
      { title: 'The same, in a policy', code: 'strategy deny_overrides', lang: 'rules' },
    ],
    label: 'Effect',
    returns: (
      <>
        Any deny among the applicable grants wins. In JSON configuration it is{' '}
        <code>&quot;strategy&quot;: &quot;deny_overrides&quot;</code>.
      </>
    ),
  },
];

const sectionId = (id: string) => `bench-${id}`;

const sections: BenchSection[] = ITEMS.map((item) => ({
  id: sectionId(item.id),
  title: item.name,
  file: item.at,
}));

const cases: BenchCase[] = ITEMS.map((item) => ({
  id: item.id,
  section: sectionId(item.id),
  tab: item.name,
  code: {
    rust: [{ title: 'Signature', code: item.sig, lang: 'rust' }, ...item.examples],
  },
  note: <ApiReturns label={item.label}>{item.returns}</ApiReturns>,
}));

export const bench: PageBench = { sections, cases };
