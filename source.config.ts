import { defineConfig } from 'fumadocs-mdx/config';

// The core ships its own code and package-manager transforms that emit
// fumadocs-ui components. The site owns all UI, so they stay off.
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    remarkNpmOptions: false,
    remarkCodeTabOptions: false,
  },
});
