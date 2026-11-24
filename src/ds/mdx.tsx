import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Callout } from './Callout';
import { CardLink } from './CardLink';
import { CodeBlock } from './CodeBlock';
import { Kbd } from './Kbd';
import { Table } from './Table';
import { Tab, Tabs } from './Tabs';
import { VerdictTag } from './Seal';
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
  const className = children.props.className ?? '';
  const lang = /language-([\w-]+)/.exec(className)?.[1];
  return <CodeBlock code={textOf(children.props.children)} lang={lang} />;
}

// Components available to every MDX page without an import.
export const mdxComponents = {
  pre: Pre,
  table: Table,
  Callout,
  CardLink,
  Kbd,
  Tab,
  Tabs,
  VerdictTag,
  VersionBadge,
};
