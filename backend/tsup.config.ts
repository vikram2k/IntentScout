import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  target: "node20",
  splitting: false,
  clean: true,
  outDir: "api",
  // Leave node_modules external — only bundle local source and resolve @/ aliases
})
