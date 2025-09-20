import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    viewportWidth: 1000,
    viewportHeight: 1000,
  },
});
