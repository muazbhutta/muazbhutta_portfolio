export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "ci/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        document: "readonly", window: "readonly", console: "readonly",
        localStorage: "readonly", fetch: "readonly", setTimeout: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  }
];
