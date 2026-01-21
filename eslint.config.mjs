import { defineConfig, globalIgnores } from "eslint/config";
import config from "eslint-config-webpack";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
  globalIgnores([
    "packages/*/lib/**/*",
    "test/**/dist/**/*",
    "test/**/bin/**/*",
    "test/**/binary/**/*",
    "test/**/index.js",
    "test/build/config/error-commonjs/syntax-error.js",
    "test/build/config/error-mjs/syntax-error.mjs",
    "test/build/config/error-array/webpack.config.js",
    "test/build/config-format/esm-require-await/webpack.config.js",
    "test/configtest/with-config-path/syntax-error.config.js",
    "test/build/config-format/esm-require/webpack.config.js",
    "packages/create-webpack-app/templates/init/webpack-defaults/",
  ]),
  {
    extends: [config],
    ignores: ["./packages/create-webpack-app/**/*"],
    rules: {
      // We are CLI, so using `console.log` is normal
      "no-console": "off",
      strict: "off",
      "n/no-process-exit": "off",
    },
  },
  {
    files: ["./packages/create-webpack-app/**/*"],
    extends: [configs["recommended-module"]],
    rules: {
      // We are CLI, so using `console.log` is normal
      "no-console": "off",
      "n/no-process-exit": "off",
    },
  },
]);
