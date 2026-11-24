# Strig docs

Documentation site for [Strig](https://github.com/The-Hades-Organization/Strig), a generic Rust
authorization library with a policy language in three syntaxes (Blocks, Rules and Actors).

The site is static. It is built with [Waku](https://waku.gg) (React Server Components), MDX through
`fumadocs-mdx`, and `fumadocs-core` for the page tree, table of contents and search index. There is
no `fumadocs-ui`: every component comes from the site's own design system.

The pages under `content/docs` are structural sample content. The real documentation is not written yet.

## Run it

Requires Node.js 22 or newer.

```sh
npm install
npm run dev       # development server with hot reload
npm run build     # static build into dist/
npm run preview   # serve the build on http://localhost:21331
```

Other scripts: `npm run typecheck` (`tsc --noEmit`) and `npm run lint` (ESLint).

## Layout of the repository

```text
content/docs/        MDX pages and meta.json files that define the page tree
public/fonts/        self-hosted fonts (OFL), with their licenses
src/pages/           routes: home, 404, /docs/*, /design-system, search API
src/ds/              the design system: components, highlighting, tokens data
src/styles/          tokens.css and the CSS of each area
src/lib/             page source and the code-fence meta plugin
DESIGN.md            visual rules of the site
PRODUCT.md           audience, purpose and constraints
```

## Design system

The design system lives in `src/ds` (components) and `src/styles/tokens.css` (the single source of
colour, type, space, radius, layer and motion tokens, in light and dark). Every component reads those
custom properties. `DESIGN.md` describes the rules, and the `/design-system` page shows every token
and component in both themes.

## Policy language pages

Pages under `content/docs/policy-language` pin the same grant written in Blocks, Rules and Actors
beside the text. Other pages use the same layout without the panel.

## License

MIT. Fonts keep their own licenses in `public/fonts`.
