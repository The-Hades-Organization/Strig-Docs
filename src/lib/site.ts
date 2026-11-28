// The site's public identity, in one place. Change SITE_URL to move domains:
// canonical links, Open Graph URLs, the sitemap and robots.txt all follow it.
export const SITE_URL = 'https://strig.vercel.app';
export const SITE_NAME = 'Strig';
export const SITE_LOCALE = 'en';

// Short description of the library (home title line, social cards).
export const SITE_TAGLINE =
  'Authorization library: RBAC, ABAC and ReBAC in one decision engine for Rust, Node, Bun, browser, Python, Go and JVM, with governance and audit.';

// Long description: the home page's meta description.
export const SITE_DESCRIPTION =
  'Strig is an open-source authorization library. You declare a permission catalog, give the engine your grants, and ask whether a subject may do something to a resource. RBAC, ABAC and ReBAC are evaluated over the same grants. It explains denials (why not), audits every grant change with a hash chain, applies approval, separation-of-duties and temporary-elevation rules, and can push changes to other instances and to the browser in real time. The core does no IO and compiles to WebAssembly; there are bindings for Rust, Node/Bun/browser, Python, Go and JVM, all driven by the same JSON policy spec. MIT licensed.';

/** Absolute URL for a site path such as `/docs/audit` (or `/` for the home). */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean.replace(/\/+$/, '')}`;
}
