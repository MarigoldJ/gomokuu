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

- `npm install` – install project dependencies.
- `npm run dev` – start the development server.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint against the codebase.
- `npm run check` – run Svelte Check for type safety.
- `npm run format` – format files with Prettier.

## Project Structure

- `src/lib/` – shared utilities and reusable logic.
- `src/lib/components/` – shared UI components.
- `src/routes/` – application routes powered by SvelteKit.
- `static/` – static assets served at the site root.

Tailwind CSS and Skeleton UI are configured globally via `src/app.postcss` and applied in the root layout (`src/routes/+layout.svelte`).
