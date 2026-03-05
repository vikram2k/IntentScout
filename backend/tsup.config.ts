import { defineConfig } from "tsup"

export default defineConfig({
  entry: { index: "server.ts" },
  format: ["esm"],
  target: "node20",
  splitting: false,
  clean: true,
  outDir: "api",
  // Bundle all dependencies into a single self-contained file for Vercel
  noExternal: [/.*/],
  // Shim for CJS packages (e.g. mammoth) that use dynamic require() inside ESM bundle
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
})
