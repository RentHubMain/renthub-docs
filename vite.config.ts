import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*.{js,ts,tsx}": "vp check --fix",
    "**/*.md": "vp run format:md:check",
  },
  fmt: {
    ignorePatterns: [
      "**/*.md",
      "build/**",
      ".docusaurus/**",
      "_site/**",
      "legal_versioned_docs/**",
    ],
  },
  lint: {
    ignorePatterns: ["src/theme/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: false },
  },
});
