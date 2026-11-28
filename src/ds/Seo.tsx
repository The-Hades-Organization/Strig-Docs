import { SITE_NAME, absoluteUrl } from '../lib/site';

type SeoProps = {
  /** Page title without the site suffix; omit to use the site name alone. */
  title?: string;
  /** Whole title, used as is (the home page). Wins over `title`. */
  fullTitle?: string;
  description: string;
  /** Site path, e.g. `/docs/audit`. Becomes the canonical and `og:url`. */
  path: string;
  type?: 'website' | 'article';
};

// Rendered inside a page: React hoists these elements into <head>.
export function Seo({ title, fullTitle, description, path, type = 'article' }: SeoProps) {
  const full = fullTitle ?? (title ? `${title} · ${SITE_NAME}` : SITE_NAME);
  const url = absoluteUrl(path);
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
