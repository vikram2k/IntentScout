import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  target: "node20",
  splitting: false,
  clean: true,
  outDir: "api",
  // Bundle all dependencies into a single self-contained file for Vercel
  noExternal: [/.*/],
})
