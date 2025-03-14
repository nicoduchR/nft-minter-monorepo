// eslint.config.js
module.exports = {
  ignores: [
    "node_modules/**",
    ".next/**",
    "**/.next/**",
    "out/**",
    "build/**",
    "dist/**",
    "public/**",
    "next.config.js",
    "next.config.mjs",
    "postcss.config.js",
    "tailwind.config.js",
    "postcss.config.cjs",
    "tailwind.config.cjs",
    "*.d.ts"
  ],
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  rules: {
    "no-console": ["warn"],
    "@typescript-eslint/no-unused-vars": ["warn"]
  }
}; 