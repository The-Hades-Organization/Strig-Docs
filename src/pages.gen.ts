// deno-fmt-ignore-file
// biome-ignore-all format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse, SearchCodecsForPages } from 'waku/router';

// prettier-ignore
import type { getConfig as File_404_getConfig } from './pages/404';
// prettier-ignore
import type { getConfig as File_DesignSystem_getConfig } from './pages/design-system';
// prettier-ignore
import type { getConfig as File_DocsSlugs_getConfig } from './pages/docs/[...slugs]';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';

// prettier-ignore
type Page =
| ({ path: '/404' } & GetConfigResponse<typeof File_404_getConfig>)
| ({ path: '/design-system' } & GetConfigResponse<typeof File_DesignSystem_getConfig>)
| ({ path: '/docs/[...slugs]' } & GetConfigResponse<typeof File_DocsSlugs_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
  interface SearchCodecsConfig extends SearchCodecsForPages<Page> {}
}
