# Dotenv Webpack Plugin

`dotenv-webpack-plugin` is a webpack plugin that enables consumers to load environment variables from dotenv files. This plugin simplifies the process of managing environment-specific configurations in your webpack projects.

## Features

- Loads environment variables from dotenv files
- Provides a convenient way to manage environment-specific configurations
- Fully configurable via an options API

## Installation

Install `dotenv-webpack-plugin` using npm:

```bash
npm install dotenv-webpack-plugin --save-dev
```

or using yarn:

```bash
yarn add dotenv-webpack-plugin --dev
```

or using pnpm:

```bash
pnpm add dotenv-webpack-plugin --save-dev
```

## Usage

To use `dotenv-webpack-plugin`, follow these steps:

1.  Create a `.env` file in the root directory of your project. Add each environment variable on a new lines in the form of `PUBLIC_NAME=VALUE`. By default only variables that are prefixed with `PUBLIC_` will be exposed to webpack. The prefix can be changed by passing the `envVarPrefix` option to the plugin.

1.  Import `dotenv-webpack-plugin` in your webpack configuration file:

    ```javascript
    const DotenvWebpackPlugin = require("dotenv-webpack-plugin");
    ```

1.  Add an instance of DotenvWebpackPlugin to your webpack plugins:

    ```javascript
    module.exports = {
      // Your webpack configuration options...
      plugins: [new DotenvWebpackPlugin()],
    };
    ```

## Configuration Options

DotenvWebpackPlugin accepts the following configuration options:

1. `envFiles`: An array of dotenv files to load. By default, DotenvWebpackPlugin will look for the following files in the root directory of your project:

   - `.env.[mode].local`
   - `.env.local`
   - `.env.[mode]`
   - `.env`
   - `.env.example`

   The `[mode]` placeholder will be replaced with the current webpack mode. For example, if the current webpack mode is `development`, DotenvWebpackPlugin will look for the following files:

   - `.env.development.local`
   - `.env.local`
   - `.env.development`
   - `.env`
   - `.env.example`

   If the same variable is defined in multiple files, the value from the file with the highest precedence will be used. The precedence order is same as the order of files listed above.

   While passing an array of dotenv files, the path towards the right of the array will have the highest precedence. For example, if you pass `["./.env", "./.env.local"]`, the value from `.env.local` will be used if the same variable is defined in both files.

1. `envVarPrefix`: The prefix to use when loading environment variables. By default, DotenvWebpackPlugin will look for variables prefixed with `PUBLIC_`.

1. `prefixes`: An array of prefixes to prepend to the names of environment variables. By default, DotenvWebpackPlugin will prepend `process.env.` and `import.meta.env.` to the names of environment variables.

You can pass these options when creating an instance of DotenvWebpackPlugin:

```javascript
new DotenvWebpackPlugin({
  envFiles: ["./.env", "./.env.local"],
  prefixes: ["process.env.", "import.meta.env."],
  envVarPrefix: "PUBLIC_",
});
```
