import { defineConfig } from "vitest/config";

const sharedTestConfig = {
  environment: "jsdom" as const,
  setupFiles: ["../../test/setup.ts"],
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          ...sharedTestConfig,
          name: "portfolio",
          root: "./apps/portfolio",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
      {
        test: {
          ...sharedTestConfig,
          name: "ui-react",
          root: "./packages/ui-react",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
    ],
  },
});
