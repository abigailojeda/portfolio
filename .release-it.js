export default {
  hooks: {
    "after:@release-it/conventional-changelog:beforeRelease":
      "pnpm exec prettier --write package.json CHANGELOG.md",
  },

  git: {
    requireBranch: "main",
    requireCleanWorkingDir: true,
    commitMessage: "chore(release): v${version}",
    tagName: "v${version}",
    push: true,
    pushArgs: ["--follow-tags", "--atomic"],
  },

  github: {
    release: true,
  },

  npm: {
    publish: false,
  },

  plugins: {
    "@release-it/conventional-changelog": {
      preset: {
        name: "conventionalcommits",
      },
      infile: "CHANGELOG.md",
    },
  },
};
