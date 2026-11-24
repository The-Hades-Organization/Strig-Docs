// The same policy written in each syntax of the policy language. Shown in the
// pinned panel of the language pages and as the home example.

export type SyntaxSample = { lang: 'blocks' | 'rules' | 'actors'; code: string };

export const SYNTAXES: SyntaxSample[] = [
  {
    lang: 'blocks',
    code: `language blocks

target_kinds = [project, folder, document]
broad_targets = [org]

permission document.view {
  targets = [project, folder, document]
}

permission document.edit {
  targets = [project, folder, document]
  depends_on = [document.view]
}

role viewer {
}

role editor {
  inherits = [viewer]
}

subject user:bruno {
  assign editor {
    scope = project:apollo
  }
}

grant g-view {
  effect = allow
  subject = role viewer
  permission = document.view
  target = project
  scope = org:acme
}

grant g-edit {
  effect = allow
  subject = role editor
  permission = document.edit
  target = project
  scope = org:acme
}
`,
  },
  {
    lang: 'rules',
    code: `language rules

kinds document, folder, project
broad org

permission document.view on project, folder, document
permission document.edit on project, folder, document depends_on document.view

role editor inherits viewer
role viewer

user:bruno has role editor in project:apollo

g-view: allow role viewer to document.view on project in org:acme
g-edit: allow role editor to document.edit on project in org:acme
`,
  },
  {
    lang: 'actors',
    code: `language actors

role editor inherits viewer

role viewer
  in org:acme
    allow document.view on project as g-view

role editor
  in org:acme
    allow document.edit on project as g-edit

subject user:bruno
  role editor in project:apollo

catalog
  kinds document, folder, project
  broad org
  document.view on project, folder, document
  document.edit on project, folder, document depends_on document.view
`,
  },
];

// From the decision example in the library README.
export const ASK_SAMPLE = `let decision = engine.decide(
    &Context::new(&grants),
    &Request::new(&dave, "document.invoice.export", &invoice),
);

// g2 denies on the invoice type, a more specific
// step than the organization where g1 allows.
assert!(!decision.is_allowed());
`;
