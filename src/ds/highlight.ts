// Syntax highlighting by the role of a word in the decision, not by token class.
// The DSL grammar shares one role scheme across its three syntaxes; Rust, TS and
// JSON use a smaller scheme with the same colours.

export type TokenRole =
  | 'kw'
  | 'rel'
  | 'ref'
  | 'id'
  | 'perm'
  | 'allow'
  | 'deny'
  | 'num'
  | 'str'
  | 'com'
  | 'op'
  | 'type'
  | 'plain';

export interface Token {
  role: TokenRole;
  text: string;
}

export type CodeLanguage = 'blocks' | 'rules' | 'actors' | 'rust' | 'ts' | 'json' | 'text';

const LANGUAGE_ALIASES: Record<string, CodeLanguage> = {
  blocks: 'blocks',
  rules: 'rules',
  actors: 'actors',
  rust: 'rust',
  rs: 'rust',
  ts: 'ts',
  typescript: 'ts',
  js: 'ts',
  javascript: 'ts',
  json: 'json',
};

export function resolveLanguage(name: string | undefined): CodeLanguage {
  if (!name) return 'text';
  return LANGUAGE_ALIASES[name.toLowerCase()] ?? 'text';
}

const DSL_DECLARES = new Set([
  'language', 'kinds', 'broad', 'strategy', 'depth', 'permission', 'role', 'subject', 'grant',
  'catalog', 'engine', 'override', 'always', 'tuple', 'relation', 'relations', 'target_kinds',
  'broad_targets', 'assign', 'attrs',
]);

const DSL_RELATES = new Set([
  'inherits', 'implied', 'by', 'implied_by', 'depends_on', 'when', 'and', 'or', 'not', 'on', 'in',
  'to', 'has', 'as', 'attr', 'principal', 'principals', 'anyone', 'label', 'targets', 'effect',
  'scope', 'target', 'user', 'blocks', 'rules', 'actors', 'deny_overrides', 'first_applicable',
]);

const RUST_KEYWORDS = new Set([
  'as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn', 'else', 'enum', 'extern',
  'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub',
  'ref', 'return', 'self', 'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe',
  'use', 'where', 'while',
]);

const TS_KEYWORDS = new Set([
  'as', 'async', 'await', 'break', 'case', 'class', 'const', 'continue', 'default', 'else',
  'export', 'extends', 'false', 'for', 'from', 'function', 'if', 'implements', 'import',
  'interface', 'let', 'new', 'null', 'of', 'return', 'switch', 'throw', 'true', 'try', 'type',
  'typeof', 'undefined', 'var', 'void', 'while',
]);

interface Rule {
  pattern: RegExp;
  classify: (match: string) => TokenRole;
}

// Every pattern is sticky; the scanner tries them in order at each position.
const sticky = (source: string) => new RegExp(source, 'y');

const DSL_RULES: Rule[] = [
  { pattern: sticky('//.*'), classify: () => 'com' },
  { pattern: sticky('"[^"\\n]*"'), classify: () => 'str' },
  {
    pattern: sticky('\\b(?:user|org|project|folder|document|doc|role|principal|group|team):[A-Za-z0-9_.-]+'),
    classify: () => 'ref',
  },
  { pattern: sticky('\\bg-[a-z0-9-]+'), classify: () => 'id' },
  { pattern: sticky('\\b[a-z_]+\\.[a-z_]+\\b'), classify: () => 'perm' },
  {
    pattern: sticky('\\b[A-Za-z_][A-Za-z_0-9]*\\b'),
    classify: (word) => {
      if (word === 'allow') return 'allow';
      if (word === 'deny') return 'deny';
      if (word === 'true' || word === 'false') return 'num';
      if (DSL_DECLARES.has(word)) return 'kw';
      if (DSL_RELATES.has(word)) return 'rel';
      return 'plain';
    },
  },
  { pattern: sticky('\\b\\d+\\b'), classify: () => 'num' },
  { pattern: sticky('==|>=|<=|!=|[<>]'), classify: () => 'op' },
];

function codeRules(keywords: Set<string>): Rule[] {
  return [
    { pattern: sticky('//.*'), classify: () => 'com' },
    { pattern: sticky('"(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`[^`\\n]*`'), classify: () => 'str' },
    { pattern: sticky('\\b\\d[\\d_]*(?:\\.\\d+)?\\b'), classify: () => 'num' },
    {
      pattern: sticky('\\b[A-Za-z_][A-Za-z_0-9]*\\b'),
      classify: (word) => {
        if (keywords.has(word)) return 'kw';
        const first = word.charAt(0);
        return first >= 'A' && first <= 'Z' ? 'type' : 'plain';
      },
    },
    { pattern: sticky('==|!=|>=|<=|=>|->|::|&&|\\|\\|'), classify: () => 'op' },
  ];
}

const JSON_RULES: Rule[] = [
  { pattern: sticky('"(?:[^"\\\\\\n]|\\\\.)*"(?=\\s*:)'), classify: () => 'kw' },
  { pattern: sticky('"(?:[^"\\\\\\n]|\\\\.)*"'), classify: () => 'str' },
  { pattern: sticky('-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?'), classify: () => 'num' },
  { pattern: sticky('\\b(?:true|false|null)\\b'), classify: () => 'num' },
];

const RULES_BY_LANGUAGE: Record<CodeLanguage, Rule[]> = {
  blocks: DSL_RULES,
  rules: DSL_RULES,
  actors: DSL_RULES,
  rust: codeRules(RUST_KEYWORDS),
  ts: codeRules(TS_KEYWORDS),
  json: JSON_RULES,
  text: [],
};

function pushToken(tokens: Token[], role: TokenRole, text: string) {
  const previous = tokens[tokens.length - 1];
  if (previous && previous.role === role) {
    previous.text += text;
    return;
  }
  tokens.push({ role, text });
}

export function highlightLine(line: string, language: CodeLanguage): Token[] {
  const rules = RULES_BY_LANGUAGE[language];
  const tokens: Token[] = [];
  let position = 0;
  while (position < line.length) {
    let matched = false;
    for (const rule of rules) {
      rule.pattern.lastIndex = position;
      const match = rule.pattern.exec(line);
      if (match && match[0].length > 0) {
        pushToken(tokens, rule.classify(match[0]), match[0]);
        position += match[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      pushToken(tokens, 'plain', line.charAt(position));
      position += 1;
    }
  }
  return tokens;
}

export function highlight(source: string, language: CodeLanguage): Token[][] {
  return source.replace(/\n$/, '').split('\n').map((line) => highlightLine(line, language));
}
