import type { IconName } from './icons';

// One icon per documentation section, keyed by URL. A page the map does not
// know shows no icon.
const DOC_ICONS: Record<string, IconName> = {
  '/docs': 'book-open',
  '/docs/getting-started': 'play',
  '/docs/concepts': 'shield-check',
  '/docs/policy-language': 'terminal',
  '/docs/policy-language/blocks': 'terminal',
  '/docs/policy-language/rules': 'terminal',
  '/docs/policy-language/actors': 'terminal',
  '/docs/javascript': 'terminal',
  '/docs/web-frameworks': 'panel-top',
  '/docs/audit': 'shield-check',
  '/docs/approvals': 'circle-check',
  '/docs/reference': 'panel-top',
  '/docs/upgrading': 'arrow-right',
  '/docs/security': 'shield-check',
  '/docs/benchmarks': 'info',
};

export function docIcon(url: string): IconName | undefined {
  return DOC_ICONS[url];
}
