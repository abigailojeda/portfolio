# Project overview

## Product vision and architectural direction

A senior frontend developer portfolio demonstrating frontend architecture,
reusable components, multi-framework integration, UI engineering, customization,
testing, and professional AI-assisted engineering with Codex and Superpowers.

One React application will contain two primary sections: a professional portfolio
landing page and a unified interactive component showcase. The experience should
be modern, minimal, accessible, responsive, visually consistent, and interactive.
Customization is a fundamental long-term requirement across both sections.

Follow a library-first approach: portfolio-specific functionality stays in
`apps/portfolio`; generic reusable components belong in their framework libraries.
React, Vue, and Angular libraries should be idiomatic, independently maintainable,
and reusable outside the portfolio, sharing a visual contract through
`packages/design-tokens`. npm publication is optional future work.

The showcase must run Vue and Angular implementations in their native runtimes
inside the React shell, providing one browsing experience. The integration
mechanism remains undecided. Do not introduce iframes, microfrontend orchestration,
or other infrastructure by default. Evaluate maintainability, necessary runtime
isolation, performance, independent development, and minimal complexity when the
feature is specified.

## Implemented: verified repository state

This inventory describes source and configuration, not a claim that checks or
deployment have succeeded. Exact versions, commands, and compiler options remain
authoritative in the referenced configuration files.

| Area                    | Current implementation and source of truth                                                                                                                                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace               | Private pnpm monorepo; `pnpm-workspace.yaml` includes `apps/*` and `packages/*`. Root `package.json` provides shared scripts and tooling.                                                                                                                                                                                     |
| Application             | `apps/portfolio`: React, TypeScript, and Vite. `src/App.tsx` composes the Coming Soon page from shared StatusScreen and an app-owned inline ComingSoonIllustration inside one main landmark. `src/main.tsx` uses React StrictMode.                                                                                            |
| Compilation and styling | The app's `vite.config.ts` configures React, Tailwind CSS v4, and React Compiler through the Babel preset. `src/index.css` imports shared tokens and their Tailwind mapping and scans React library sources.                                                                                                                  |
| Design tokens           | `packages/design-tokens` exports CSS and a Tailwind mapping. Semantic color variables cover background, foreground, surface, primary, muted, and border roles. The global status palette includes blob roles. Unoverridden roots follow the system with light fallback; nearest explicit `data-theme` scopes take precedence. |
| React library           | `packages/ui-react` exports Button and the typed reusable StatusScreen with decorative shapes. Its Vite library build emits ES modules and externalizes React runtimes; package exports currently point to TypeScript source. Library styles use the shared Tailwind mapping.                                                 |
| Tests                   | Root `vitest.config.ts` defines app and React library projects using jsdom. `test/setup.ts` installs jest-dom matchers and cleanup. React Testing Library tests cover Button, StatusScreen semantics/content, inline SVG geometry/props, and app composition.                                                                 |
| Static checks           | Root `eslint.config.js` targets app/library TypeScript with React Hooks rules and app React Refresh rules. Each project has TypeScript app/node configurations. Prettier scripts and `.prettierignore` exist; no dedicated Prettier configuration is present.                                                                 |
| Commit conventions      | Husky runs formatting, lint, type checks, and tests before commits; commit-msg uses Conventional Commits validation. Commitizen is configured in root `package.json`.                                                                                                                                                         |
| CI                      | `.github/workflows/ci.yml` handles pushes and pull requests targeting `dev` and `main`, with frozen-lockfile installation, dependency audit, formatting, lint, type checks, tests, and build.                                                                                                                                 |
| Releases                | After quality checks, pushes to `main` trigger release-it. `release-it.config.js` requires a clean `main`, configures release commits/tags, pushes, GitHub releases, and conventional changelog generation; npm publishing is disabled.                                                                                       |

## Gaps and discrepancies with the intended architecture

- The app currently presents the Coming Soon status page. Landing-page sections, navigation,
  internationalization, and the component explorer do not yet exist.
- System-responsive light/dark tokens and explicit/nested theme scopes exist, but there is no application theme selection,
  preference persistence, or implemented customization system. Token files alone
  do not constitute the planned foundational theming feature.
- `packages/ui-vue` and `packages/ui-angular` do not exist. Cross-framework runtime
  integration, equivalent components, and shared-theme behavior remain unbuilt.
- The React library currently has Button and StatusScreen and consumes workspace source.
  Independent distribution and consumption outside the portfolio have not been
  established. All existing packages are private; publication is not configured.
- `packages/ui-react/src/index.ts` repeats the Button export. This existing
  duplication is recorded without changing it.
- Vercel is the intended deployment platform, but no tracked Vercel configuration
  or deployment workflow establishes its setup. External dashboard configuration
  and live deployment status were not verified; `.gitignore` alone is not proof.
- Local `dev` and `main` branches and CI triggers exist, and releases require
  `main`. Branch protection, PR approval rules, and the exact promotion procedure
  are not established by the inspected files; preserve existing practice and
  clarify before changing policy.
- No existing project documentation or repository AI instructions were found
  before these documents were added. Accessibility and responsive behavior remain
  requirements to verify per feature, not a completed project-wide audit.

## Planned functionality

### Portfolio and unified showcase

The landing page will include Hero, About Me, professional experience, technical
skills, projects, contact information, navigation, and relevant supporting UI.

The unified showcase will support browsing components, selecting their native
React/Vue/Angular implementation, live previews, supported property controls,
usage examples and documentation, equivalent-component comparison, and exploring
shared themes across frameworks. Each library will own appropriate framework
dependencies, build configuration, and tests.

### Progressive customization

1. **Predefined themes and styles:** establish persistent light/dark color modes
   first, using the already agreed `localStorage` persistence for the initial
   light/dark preference (not yet implemented), then dynamic switching among
   multiple themes and aesthetics such as
   minimalism and glassmorphism. Keep color mode and visual style conceptually
   separate where useful, enabling combinations such as dark glassmorphism.
   Apply shared tokens and CSS custom properties consistently to both sections.
2. **Custom themes:** enable real-time previews and creating, saving, loading,
   and resetting themes. Potential controls include palettes, text/background
   colors, typography, borders/radii, shadows/effects, and component appearance.
   Evaluate the theme data model, validation, and persistence during specification.
3. **Section and layout customization:** support section reordering via
   drag-and-drop, visibility, independent backgrounds/text colors, typography,
   spacing, alignment, layout, and component appearance, with interactive preview,
   persistence, and reset. Preserve accessibility, responsiveness, and usability.

Prefer incremental, configurable, data-driven solutions. Separate tokens, color
modes, visual styles, theme definitions, component implementations, and user
preferences where this provides practical value. Avoid duplicated visual values,
unnecessary state libraries, configuration engines, plugin systems, and speculative
abstractions. Evaluate contrast and performance alongside extensibility.

These are future capabilities, not instructions to implement them now. Specify,
plan, implement, and verify each independently using the applicable Superpowers
workflow and an approved feature specification.

## Pending decisions

The initial light/dark preference will use `localStorage`, as already agreed.
That choice does not determine persistence for custom user-created themes or
advanced layout customization; both remain undecided.

- **Native framework integration:** evaluate framework mounting strategies versus
  Web Components, including lifecycle cleanup, styling, runtime isolation,
  performance, and property/event boundaries.
- **Theme model:** determine how color modes, visual styles, theme definitions,
  and supported tokens compose without limiting future combinations.
- **Custom theme storage:** choose persistence, validation, accessibility
  constraints, loading/reset behavior, and any configuration versioning needed.
- **Layout model:** decide how section identities, ordering, visibility, local
  overrides, defaults, and layouts are represented and reset; the persistence
  strategy for advanced layout customization remains undecided.
- **Complex interactions:** determine whether additional libraries are justified
  for drag-and-drop, editing, previews, or other concrete requirements.
- **Product and delivery details:** specify English/Spanish language selection
  and content organization, showcase documentation/property APIs, external library
  consumption requirements, and verify Vercel setup when relevant.

Beyond the agreed `localStorage` choice for the initial light/dark preference,
custom-theme and advanced-layout persistence remain open. No integration mechanism
or extra framework is selected by this overview. Resolve pending decisions within
focused feature specifications and record approval before implementation or
changes to approved architecture.

## High-level roadmap

1. Foundational theming system and initial persistent light/dark modes.
2. Multiple predefined visual themes and styles.
3. Internationalization in English and Spanish.
4. Portfolio landing page and its main sections.
5. React component showcase.
6. Vue component library and integration.
7. Angular component library and integration.
8. User-defined themes and real-time visual customization.
9. Advanced section and layout customization, including drag-and-drop.
10. Advanced component documentation, property controls, and interactive previews.

This is a provisional direction, not a rigid schedule. Refine dependencies and
priorities during future specifications; do not pre-specify the entire roadmap.
See [AGENTS.md](../AGENTS.md) for operational development and verification rules.
