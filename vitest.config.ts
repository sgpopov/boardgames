import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@games": path.resolve(__dirname, "src/games"),
      "@core": path.resolve(__dirname, "src/core"),
      "@app": path.resolve(__dirname, "src/app"),
    },
  },
});
