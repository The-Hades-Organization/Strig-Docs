import { absoluteUrl } from './site';
import { source } from './source';

export type SitePage = {
  /** Path on the site, e.g. `/docs/audit`. */
  path: string;
  /** Absolute URL on the configured domain. */
  url: string;
  title: string;
  description: string;
};

/**
 * Every indexable page: the home plus each page under `content/docs`, in page
 * tree order. The sitemap reads this list; other generated files can reuse it.
 */
export function listPages(): SitePage[] {
  const docs = source.getPages().map((page) => ({
    path: page.url,
    url: absoluteUrl(page.url),
    title: page.data.title,
    description: page.data.description ?? '',
  }));
  return [{ path: '/', url: absoluteUrl('/'), title: 'Home', description: '' }, ...docs];
}
