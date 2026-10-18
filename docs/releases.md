# Release workflow

Releases run automatically from `.github/workflows/ci.yml` when a merge or push
updates `main`. Pull requests and pushes to `dev` run quality checks without
releasing. Keep the existing `dev`/`main` promotion workflow.

## Quality checks and release sequence

The release job requires the quality job to succeed: frozen-lockfile installation,
dependency audit, Prettier, ESLint, TypeScript, unit tests, and production build.
It checks out `main` with full history so Conventional Commits and previous tags
are available, then installs the same locked dependencies.

Immediately before releasing, the job fetches `main` and checks that both the
checkout and the remote branch match the triggering commit that passed CI. If
either differs, it skips the release; the newer push has its own quality checks
and release opportunity. This also skips reruns after a successful release has
advanced `main`.

The command is:

```sh
pnpm run release:ci
```

This invokes the existing `release-it --ci` script without prompts. pnpm forwards
arguments after a script name directly; do not insert an extra `--` before
release-it options.

release-it automatically discovers `.release-it.js`. The former
`release-it.config.js` filename was not automatically loaded. The configuration:

1. Requires a clean working tree on `main`.
2. Uses `@release-it/conventional-changelog` with the `conventionalcommits` preset
   to recommend the next version from commits since the latest release tag. The
   root `package.json` supplies the current version; before the first tag, the
   plugin considers the available history. No version or increment is forced.
3. Skips versioning and publishing when the preset recommends no bump.
4. Updates the root package version and `CHANGELOG.md`. After the changelog plugin
   writes the file, a hook formats both files with the existing Prettier defaults,
   before Git stages them. Husky remains enabled: pre-commit runs formatting,
   lint, type checks, and tests; commit-msg runs commitlint.
5. Creates `chore(release): v${version}` and an annotated `v${version}` tag.
6. Pushes the commit and tag atomically, then creates a GitHub Release with the
   generated changelog as its release notes. npm publishing is disabled.

The release job uses the `release-main` concurrency group with
`cancel-in-progress: false` and `queue: max`, so release jobs cannot run
simultaneously or interrupt an active release. Multiple pending jobs can wait;
an older commit's slower quality run cannot replace the newest commit's pending
release. GitHub allows up to 100 pending jobs in this mode. See
[GitHub's concurrency documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).
The atomic push prevents a concurrent update or permission failure from publishing
only the tag or only the version commit.

Checkout authentication and release-it use the built-in `GITHUB_TOKEN`. Events
created using that token do not trigger another push workflow, preventing a
release loop. Tag pushes are not workflow triggers either. Keep this token model;
replacing it with a personal access token or GitHub App token changes that behavior.

## Commit conventions

Use `<type>[optional scope][!]: <description>`. `pnpm commit` provides the existing
Commitizen prompt; Husky validates messages with the Conventional Commits config.

| Commit                                                                      | Release effect                                                  |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `fix(button): preserve focus after activation`                              | Patch                                                           |
| `perf(showcase): reduce preview rendering work`                             | Patch                                                           |
| `revert: restore the previous button behavior`                              | Patch for an eligible revert; the preset filters paired reverts |
| `feat(showcase): add a component preview`                                   | Minor                                                           |
| `feat(tokens)!: remove deprecated color names`                              | Major                                                           |
| Any type with a `BREAKING CHANGE: <description>` footer                     | Major                                                           |
| Non-breaking `docs`, `style`, `chore`, `refactor`, `test`, `build`, or `ci` | No release by themselves                                        |

The highest eligible change wins across the unreleased commits. Hidden types do
not appear in the generated changelog, but breaking changes still qualify. The
release commit's non-breaking `chore(release)` message does not trigger a bump.

For squash merges, use a Conventional Commit message for the resulting commit and
preserve any breaking-change footer. For merge commits, preserve the meaningful
Conventional Commit messages on the merged branch. A merge title alone does not
replace the commit history analyzed by the plugin.

## Safe validation

From a clean `main` with an upstream configured, preview the release without
writing files, creating commits or tags, pushing, or publishing:

```sh
pnpm run release:ci --dry-run --no-github --verbose
```

`--no-github` disables GitHub integration for local validation, so no token is
needed. In a review branch, use local-only overrides for the branch, working-tree,
and upstream preconditions:

```sh
pnpm run release:ci --dry-run --no-github --git.requireBranch fix/release-flow --no-git.requireCleanWorkingDir --no-git.requireUpstream --verbose
```

Replace the branch name with your review branch. These overrides are for dry runs
only; the workflow retains all release preconditions. A dry run prints write
operations and hooks instead of executing them, so it cannot prove that remote
permissions or the generated-file Husky checks will succeed in GitHub Actions.

## Required permissions and failure recovery

Only the release job requests `contents: write`; quality checks retain read-only
permissions. The repository's Actions policy must allow that permission. Branch
and tag protection or rulesets must allow the automation to push the version
commit to `main` and create `v*` tags. Required pull requests, signed commits, or
restricted tag creation can block this even with `contents: write`. Verify these
repository settings before relying on the first automatic release; do not weaken
them implicitly as part of a workflow change.

If a newer push wins during release preparation, the atomic push fails safely;
the newer push's CI can release after its quality checks pass. If the commit and
tag push succeeds but GitHub Release creation fails, a rerun will skip the old
commit. Inspect the existing tag and release state and arrange a targeted recovery
instead of forcing another version. Normal releases remain fully automatic.
