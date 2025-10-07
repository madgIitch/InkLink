/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-require-imports": "off", // solo se activa en TS (override)
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "react/jsx-key": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "coverage/",
    "**/*.config.*",
    "**/*.d.ts",
  ],
  overrides: [
    // ✅ Reglas estrictas SOLO para TS/TSX
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
      },
    },
    // ✅ JS (Functions, SW, etc.): usar ESPREE y apagar reglas TS en JS
    {
      files: ["**/*.{js,cjs,mjs}"],
      parser: "espree", // <-- clave: evita que JS pase por @typescript-eslint/parser
      env: { node: true, browser: true, es2022: true, worker: true },
      extends: ["eslint:recommended"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};
