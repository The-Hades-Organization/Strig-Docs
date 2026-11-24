import { type Config, defineConfig } from 'waku/config';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import type { UserConfig } from 'vite';

export default defineConfig({
  vite: {
    plugins: [fumadocsMdx()],
    resolve: {
      tsconfigPaths: true,
    },
  } satisfies UserConfig as Config['vite'],
});
