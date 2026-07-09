import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "ci/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        SITE: "readonly",
        ABOUT: "readonly",
        CAREER_PATH: "readonly",
        SKILLS: "readonly",
        PROJECTS: "readonly",
        CREDENTIALS: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  }
];
