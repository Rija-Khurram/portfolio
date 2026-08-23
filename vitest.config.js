import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "next-jsx-in-js",
      enforce: "pre",
      async transform(code, id) {
        if (/\/app\/.*\.js$/.test(id)) {
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        }
      },
    },
    react({ include: /app\/.*\.[jt]sx?$/ }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
    pool: "threads",
    fileParallelism: false,
    maxWorkers: 1,
  },
});
