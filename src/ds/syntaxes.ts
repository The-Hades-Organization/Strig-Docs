// The same grant written in each syntax of the policy language. Shown in the
// pinned panel of the language pages and as the home example.

export type SyntaxSample = { lang: 'blocks' | 'rules' | 'actors'; code: string };

export const SYNTAXES: SyntaxSample[] = [
  {
    lang: 'blocks',
    code: `language blocks

role editor {
  inherits = [viewer]
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

role editor inherits viewer

g-edit: allow role editor to document.edit on project in org:acme
`,
  },
  {
    lang: 'actors',
    code: `language actors

role editor
  in org:acme
    allow document.edit on project as g-edit
`,
  },
];

export const ASK_SAMPLE = `let ruling = engine.check(&bruno, "document.edit", &apollo)?;
assert!(ruling.is_allowed());
`;
