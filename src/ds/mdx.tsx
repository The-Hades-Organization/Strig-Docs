import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Callout } from './Callout';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Icon } from './icons';
import { Kbd } from './Kbd';
import { CellPick, Run } from './Run';
import { Table } from './Table';
import { Tab, Tabs } from './Tabs';
import { Seal, VerdictTag } from './Seal';
import { VersionBadge } from './VersionBadge';

function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textOf).join('');
  return '';
}

function Pre({ children }: ComponentPropsWithoutRef<'pre'>) {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    return <pre>{children}</pre>;
  }
  const props = children.props as { className?: string; children?: ReactNode; 'data-meta'?: string };
  const lang = /language-([\w-]+)/.exec(props.className ?? '')?.[1];
  const title = /title="([^"]*)"/.exec(props['data-meta'] ?? '')?.[1];
  return <CodeBlock code={textOf(props.children)} lang={lang} title={title} />;
}

// Headings carry a # link to themselves: shown on hover and focus, and the
// targeted heading lands under the header and the bar, tinted.
function H2({ id, children, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  if (!id) return <h2 {...rest}>{children}</h2>;
  return (
    <h2 {...rest} id={id} className="doc-h">
      {children}
      <a className="doc-anchor" href={`#${id}`} aria-label="Link to this section">
        #
      </a>
    </h2>
  );
}

function H3({ id, children, ...rest }: ComponentPropsWithoutRef<'h3'>) {
  if (!id) return <h3 {...rest}>{children}</h3>;
  return (
    <h3 {...rest} id={id} className="doc-h">
      {children}
      <a className="doc-anchor" href={`#${id}`} aria-label="Link to this section">
        #
      </a>
    </h3>
  );
}

// A line in the prose that points at the bench: <BenchRef>The policy is in the bench.</BenchRef>
function BenchRef({ children }: { children: ReactNode }) {
  return (
    <p className="bench-ref">
      <Icon name="chevron-right" size={14} />
      <span>{children}</span>
    </p>
  );
}

// Components available to every MDX page without an import.
export const mdxComponents = {
  pre: Pre,
  h2: H2,
  h3: H3,
  BenchRef,
  CellPick,
  Run,
  table: Table,
  Callout,
  CardLink,
  Kbd,
  Seal,
  Tab,
  Tabs,
  VerdictTag,
  VersionBadge,
};
