export type VersionKind = 'added' | 'changed' | 'deprecated';

const LABEL: Record<VersionKind, string> = {
  added: 'Added in',
  changed: 'Changed in',
  deprecated: 'Deprecated in',
};

export function VersionBadge({ version, kind = 'added' }: { version: string; kind?: VersionKind }) {
  return (
    <span className="version-badge" data-kind={kind}>
      {LABEL[kind]} <span className="version-badge-num">{version}</span>
    </span>
  );
}
