# Capstone

will i graduate

## `devStart`

For now, this is a [server-side-rendered](https://vite.dev/guide/ssr) (SSR) web app (React, TypeScript, and Vite). Use Node.js 18+ with any package manager (`npm`, `pnpm`, etc.) E.g.

```bash
npm install     # Install deps
npm run dev     # Start dev server with hot reload
```

Use your package manager's usual script command for `build` and `preview` as well.

Our major deps are Chakra UI (UI primitives, prefer over vanilla HTML and CSS), XYFlow (graph/node UI), and Web Audio API.

### Checks

Run `pnpm check` before opening a pull request. It runs TypeScript, ESLint, Prettier's read-only check, and the unit tests. Individual commands are `pnpm compile`, `pnpm lint`, `pnpm format:check`, and `pnpm test`; use `pnpm test:watch` during development and `pnpm format` to write formatting changes.

CI runs the same checks and builds the site. Pushes to `staging` and `main` deploy the build to the corresponding Cloudflare Workers environment; deployment requires the configured Cloudflare secrets.
