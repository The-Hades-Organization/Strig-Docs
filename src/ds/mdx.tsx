import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Callout } from './Callout';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Kbd } from './Kbd';
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

// Components available to every MDX page without an import.
export const mdxComponents = {
  pre: Pre,
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
