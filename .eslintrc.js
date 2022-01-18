module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: [
    /*
     * Always a good idea to start with sane defaults
     */
    "eslint:recommended",

    /*
     * Required to integrate prettier into eslint
     */
    "plugin:prettier/recommended",
  ],
  rules: {
    /*
     * This reads all definitions from a local prettier config file and applies the correct
     * eslint rules automatically.
     */
    "prettier/prettier": ["error"],

    /*
     * Named exports are almost always better because they break when the imported module changes
     */
    "import/prefer-default-export": "off",

    "object-curly-newline": "off",
    "max-len": [2, { code: 154, ignoreUrls: true }],

    "no-unused-vars": "off",

    /**
     * We find them quite useful actually.
     */
    "no-nested-ternary": "off",
  },
  globals: {
    fetch: "readonly",
    console: "readonly",
  },
};
