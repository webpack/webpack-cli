module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: ["eslint:recommended", "plugin:n/recommended", "prettier"],
  parserOptions: { ecmaVersion: 2018, sourceType: "script" },
  plugins: ["n"],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    "no-process-exit": "off",
    "n/no-process-exit": "off",
    "no-template-curly-in-string": "error",
    "no-caller": "error",
    "no-extra-bind": "error",
    "no-loop-func": "error",
    "no-undef": "error",
    "prefer-const": "error",
  },
  overrides: [
    {
      settings: {
        n: {
          tryExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
      files: ["**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true,
          },
        ],
        "n/no-unsupported-features/es-syntax": "off",
        "n/no-process-exit": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },
    {
      files: ["**/packages/create-webpack-app/**/*.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
  ],
};
