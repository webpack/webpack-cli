module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  parserOptions: { ecmaVersion: 2018, sourceType: "script" },
  plugins: ["node"],
  settings: {
    node: {
      allowModules: ["@webpack-cli/generators"],
    },
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    "no-process-exit": "off",
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
        node: {
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
        "node/no-unsupported-features/es-syntax": "off",
      },
    },
  ],
};
