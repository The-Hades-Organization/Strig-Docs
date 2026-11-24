import type { IconName } from './icons';

// One icon per documentation section, keyed by URL. A page the map does not
// know shows no icon.
const DOC_ICONS: Record<string, IconName> = {
  '/docs': 'book',
  '/docs/getting-started': 'play',
  '/docs/concepts': 'layers',
  '/docs/policy-language': 'code',
  '/docs/policy-language/blocks': 'code',
  '/docs/policy-language/rules': 'code',
  '/docs/policy-language/actors': 'code',
  '/docs/reference': 'terminal',
};

export function docIcon(url: string): IconName | undefined {
  return DOC_ICONS[url];
}
