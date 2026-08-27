import { defineConfig } from "vite";

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
      importSource: "react",
    },
  },

  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },

    rolldownOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
