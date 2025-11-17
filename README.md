# gomokuu

This project is a SvelteKit application configured with TypeScript, ESLint, Prettier, Tailwind CSS, and Skeleton UI.

## Live Demo

The latest build is available on GitHub Pages: https://<your-github-username>.github.io/gomokuu/

## What You Can Do

- Play a full Gomoku match on a 13×13, 15×15, 17×17, or 19×19 board.
- Enable or disable Renju-style forbidden move rules with a single toggle.
- Track the current turn, wins, draws, and forbidden move reasons at a glance.
- Review every move in the running game log, including coordinates and notes.

## Available Scripts

- `npm install` – install project dependencies. If you see a `403 Forbidden` for scoped packages (for example `@skeletonlabs/skeleton`), use the provided `.npmrc` or run `npm config set registry https://registry.npmmirror.com` to route through the mirrored registry used in CI.
- `npm run dev` – start the development server.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint against the codebase.
- `npm run check` – run Svelte Check for type safety.
- `npm run format` – format files with Prettier.

## Sandbox install checklist

If you are installing dependencies inside the sandbox used for automated tests, verify these steps before running `npm install`:

1. Export the proxy variables provided by the sandbox (replace the URLs with the values documented by the environment):
   ```bash
   export HTTP_PROXY="http://<sandbox-proxy-host>:<port>"
   export HTTPS_PROXY="http://<sandbox-proxy-host>:<port>"
   export NO_PROXY="localhost,127.0.0.1"
   ```
   The project `.npmrc` automatically reads these variables and relaxes SSL to accept the sandbox MITM certificate.
2. Point npm to the public mirror used in CI (already configured in `.npmrc`, but you can force it locally if your global npm config differs):
   ```bash
   npm config set registry https://registry.npmmirror.com
   npm config set @skeletonlabs:registry https://registry.npmmirror.com
   ```
3. Clear any cached metadata that might reference the blocked default registry:
   ```bash
   npm cache clean --force
   npm ping
   ```
4. Re-run installation:
   ```bash
   npm install
   ```
If the install still returns `403 Forbidden`, double-check that the proxy values are exported in the current shell and that no per-user `.npmrc` overrides the registry settings listed above.

## Project Structure

- `src/lib/` – shared utilities and reusable logic.
- `src/lib/components/` – shared UI components.
- `src/routes/` – application routes powered by SvelteKit.
- `static/` – static assets served at the site root.

Tailwind CSS and Skeleton UI are configured globally via `src/app.postcss` and applied in the root layout (`src/routes/+layout.svelte`).
