/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "react/display-name": "off"
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.mjs"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    {
      files: [".next/**/*", "**/.next/**/*"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "**/node_modules/**",
    ".next/",
    "**/.next/**/*",
    "out/",
    "build/",
    "dist/",
    "public/",
    "next.config.js",
    "next.config.mjs",
    "postcss.config.js",
    "tailwind.config.js",
    "postcss.config.cjs",
    "tailwind.config.cjs",
    "*.d.ts"
  ]
}; 