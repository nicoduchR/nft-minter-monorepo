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
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "no-console": "warn"
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.mjs"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "**/.next/**/*",
    "out/",
    "public/",
    "next.config.js",
    "*.d.ts",
    "build/",
    "dist/"
  ]
}; 