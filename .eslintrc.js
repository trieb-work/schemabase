module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
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

    "max-len": [2, { code: 100, ignoreUrls: true }],

    /**
     * We find them quite useful actually.
     */
    "no-nested-ternary": "off",

    /**
     * See https://github.com/typescript-eslint/typescript-eslint/issues/2621#issuecomment-701970389
     */
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
  ignorePatterns: ["**/generated/**/*.ts"],
};
