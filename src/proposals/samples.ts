// Structural sample material shared by the three directions. Not real
// documentation: it exists so every direction is judged on the same content.

export type SyntaxSample = { lang: 'blocks' | 'rules' | 'actors'; label: string; code: string };

export const SYNTAXES: SyntaxSample[] = [
  {
    lang: 'blocks',
    label: 'Blocks',
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
    label: 'Rules',
    code: `language rules

role editor inherits viewer

g-edit: allow role editor to document.edit on project in org:acme
`,
  },
  {
    lang: 'actors',
    label: 'Actors',
    code: `language actors

role editor
  in org:acme
    allow document.edit on project as g-edit
`,
  },
];

export const INSTALL_SAMPLE = `cargo add themis-engine
`;

export const ASK_SAMPLE = `let ruling = engine.check(&bruno, "document.edit", &apollo)?;
assert!(ruling.is_allowed());
`;

export type DirectionId = 'a' | 'b' | 'c';

export type Direction = {
  id: DirectionId;
  name: string;
  thesis: string;
  audience: string;
};

export const DIRECTIONS: Direction[] = [
  {
    id: 'a',
    name: 'Livro',
    thesis: 'A reference book: a contents list, three columns, dense and quiet.',
    audience: 'Integrators who come back to look things up.',
  },
  {
    id: 'b',
    name: 'Faixa',
    thesis: 'The ruling is the page: the 9° band and the verdict lead, one wide column.',
    audience: 'People evaluating or auditing the engine.',
  },
  {
    id: 'c',
    name: 'Sintaxe primeiro',
    thesis: 'The three syntaxes side by side, with code that stays in view while you read.',
    audience: 'Policy authors choosing and learning a syntax.',
  },
];
