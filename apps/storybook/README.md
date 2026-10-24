# React Storybook

Run these commands from the repository root after `pnpm install`:

```sh
pnpm storybook
pnpm build-storybook
```

Development runs at `http://localhost:6006`. The build produces a static site in
`apps/storybook/storybook-static`. Root `pnpm check` includes Storybook lint,
type checking, and the static build.

Stories import components directly from `@portfolio/ui-react`; no library build
is required for development. Preview CSS imports `@portfolio/design-tokens` and
its Tailwind mapping, and Vite compiles the shared library's utility classes.
Canvas colors follow the shared tokens, including the system color preference.

`Components/Button` contains Default and Disabled stories. Controls expose
`children`, `disabled`, and native `type` options (`button`, `submit`, `reset`).
Enabled clicks appear in the Actions panel; disabled buttons retain native
disabled behavior. The component currently has one visual style, with no
variant, size, or loading API. The disabled story preserves its existing visual
appearance as well as its behavior.

This app configures React only. Vue and Angular Storybooks and Design System
expansion are separate future work.

## Authoring stories

Follow the [styling and Design System conventions](../../docs/design/DESIGN.md#styling-and-design-system-conventions).
Use typed stories to document existing reusable components, their supported
variants and states, and practical usage examples. Add foundation documentation
where it helps explain existing shared tokens.

Import the component from its library package and let it own its styling.
Keep preview CSS limited to the shared style setup and document defaults;
do not copy token values or component styles into stories. Page-only styling
belongs with the page, and undocumented future APIs must not be invented for
a story.
