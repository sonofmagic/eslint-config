# Repository Guidelines

## Project Structure & Module Organization

Workspaces live under `apps/` and `packages/`. `packages/icebreaker` houses the primary ESLint presets, while `packages/stylelint` and `packages/commitlint` publish companion configs. Shared fixtures sit in `_fixtures/` folders; runtime demos reside in `apps/mock`. Keep source in each package's `src/` directory, emit builds to `dist/`, and place unit suites in `test/`. Root-level tooling files (`eslint.config.js`, `prettier.config.js`, `turbo.json`, `pnpm-workspace.yaml`) define settings that apply across the monorepo.

## Build, Test, and Development Commands

Install dependencies with `pnpm install` (enforced via `only-allow`). `pnpm build` runs `turbo run build` across all workspaces and must succeed before publishing. Use `pnpm dev` for parallel local development, and `pnpm sync` when workspace templates drift. Run `pnpm lint` to execute each package's lint targets, `pnpm test` for the Vitest suite, and `pnpm test:dev` to watch tests while iterating. Release flows go through `pnpm publish-packages` or ad-hoc `pnpm release` for managing Changesets.

## Coding Style & Naming Conventions

Prettier governs formatting (2-space indent, single quotes, no semicolons, 80-char print width). ESLint extends the local `@icebreakers/eslint-config` presets; pair rule overrides with comments that cite the rationale. Export config entry points as `*.config.ts`, and keep package entry files named `index.ts` or `preset.ts` for clarity. CSS-related rules rely on `@icebreakers/stylelint-config`, so co-locate style examples under `fixtures/` where needed.

## Testing Guidelines

Vitest powers tests, configured via `vitest.config.ts` to cover every workspace. Prefer colocated `*.test.ts` files under `test/`. Snapshot data and input fixtures belong in `_fixtures/`. Coverage uses the V8 provider with `skipFull` enabled; add targeted assertions instead of chasing 100%. Run `pnpm test` before pushing, and capture failing command output in the pull request when tests are unstable.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits (`@commitlint/config-conventional`); run `pnpm commit` to trigger the interactive prompt. Group multiple package changes within a single logical commit when possible. Pull requests should describe the affected configs, reference related issues, and call out new rules or breaking defaults. Include relevant test or lint output, and add a Changeset (`pnpm release`) for anything user-facing. Tag reviewers when altering shared presets so downstream packages can prepare.

## Tooling & Environment Notes

This repository targets Node >= 18 and pnpm 10.x. Husky hooks run on `prepare`; install dependencies before committing to ensure hooks exist locally. Use `npx @eslint/config-inspector` or `pnpm build:inspector` when you need a visual diff of rule changes.
