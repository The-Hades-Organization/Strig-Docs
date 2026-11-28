import { absoluteUrl } from '../../lib/site';

// Everything is allowed, AI crawlers included.
export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });

export const getConfig = async () => ({ render: 'static' }) as const;
