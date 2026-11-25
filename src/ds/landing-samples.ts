// The landing's code, as the board shows it: the two hero requests, the hero's grants in the
// three syntaxes (printed by the strig 0.6.1 parser) and the first program in Rust.
// Keep every sample byte-identical to what the engine accepts.

export const REQUEST_DENY = `let dave = Subject::user("dave")
    .with_role_in("member", Anchor::new("org", "acme"));
let invoice = Resource::new("document", "d1")
    .within("doc_type", "invoice")
    .within("project", "p1")
    .within("org", "acme");

let decision = engine.decide(
    &Context::new(&grants),
    &Request::new(&dave, "document.invoice.export", &invoice),
);
assert!(!decision.is_allowed());`;

export const REQUEST_ALLOW = `let dave = Subject::user("dave")
    .with_role_in("member", Anchor::new("org", "acme"));
let report = Resource::new("document", "d2")
    .within("doc_type", "report")
    .within("project", "p1")
    .within("org", "acme");

let decision = engine.decide(
    &Context::new(&grants),
    &Request::new(&dave, "document.export", &report),
);
assert!(decision.is_allowed());`;

export const POLICY_RULES = `language rules

kinds doc_type, document, project
broad org

permission document.export on project, document
permission document.invoice.export on doc_type, document implied by document.export

role member

user:dave has role member in org:acme

g1: allow role member to document.export on org in org:acme
g2: deny anyone to document.invoice.export on doc_type:invoice`;

export const POLICY_BLOCKS = `language blocks

target_kinds = [doc_type, document, project]
broad_targets = [org]

permission document.export {
  targets = [project, document]
}

permission document.invoice.export {
  targets = [doc_type, document]
  implied_by = [document.export]
}

role member {
}

subject user:dave {
  assign member {
    scope = org:acme
  }
}

grant g1 {
  effect = allow
  subject = role member
  permission = document.export
  target = org
  scope = org:acme
}

grant g2 {
  effect = deny
  subject = anyone
  permission = document.invoice.export
  target = doc_type:invoice
}`;

export const POLICY_ACTORS = `language actors

role member
  in org:acme
    allow document.export on org as g1

anyone
  deny document.invoice.export on doc_type:invoice as g2

subject user:dave
  role member in org:acme

catalog
  kinds doc_type, document, project
  broad org
  document.export on project, document
  document.invoice.export on doc_type, document implied by document.export`;

export const FIRST_DECISION = `use strig::{dsl::fs::read_file, Context, Request, Resource};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let policy = read_file("policy.strig")?.policy;
    let engine = policy.engine_spec().build()?;
    let dave = policy.subjects.iter()
        .find(|s| s.id.as_deref() == Some("dave"))
        .expect("dave is in the policy");
    let d1 = Resource::new("document", "d1")
        .within("doc_type", "invoice")
        .within("project", "p1")
        .within("org", "acme");

    let decision = engine.decide(
        &Context::new(&policy.grants),
        &Request::new(dave, "document.invoice.export", &d1),
    );
    assert!(!decision.is_allowed());
    Ok(())
}`;
