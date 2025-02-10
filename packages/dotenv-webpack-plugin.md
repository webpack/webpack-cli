# Dotenv Webpack Plugin

`DotenvWebpackPlugin` is a webpack plugin to allow consumers to load environment variables from `.env` files. It does a text replace in the resulting bundle for any instances of `process.env` and `import.meta.env`.

## Installation

```bash
npm install dotenv-webpack-plugin --save-dev
```

```bash
yarn add dotenv-webpack-plugin --dev
```

```bash
pnpm add dotenv-webpack-plugin -D
```

## Basic Usage

`DotenvWebpackPlugin` exposes env variables under `process.env` and `import.meta.env` objects as strings automatically.

To prevent accidentally leaking env variables to the client, only variables prefixed with `WEBPACK_` are exposed to Webpack-bundled code. e.g. for the following `.env` file:

```bash
WEBPACK_SOME_KEY=1234567890
SECRET_KEY=abcdefg
```

Only `WEBPACK_SOME_KEY` is exposed to Webpack-bundled code as `import.meta.env.WEBPACK_SOME_KEY` and `process.env.WEBPACK_SOME_KEY`, but `SECRET_KEY` is not.

```javascript
const DotenvWebpackPlugin = require("dotenv-webpack-plugin");

module.exports = {
  // Existing configuration options...
  plugins: [new DotenvWebpackPlugin()],
};
```

## `.env` Files

Environment variables are loaded from the following files in your [environment directory]():

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

> Mode-specific env variables (e.g., `.env.production`) will override conflicting variables from generic environment files (e.g., `.env`). Variables that are only defined in `.env` or `.env.local` will remain available to the client.

## Using a configuration

You can pass a configuration object to `dotenv-webpack-plugin` to customize its behavior.

### `dir`

Type:

```ts
type dir = string;
```

Default: `""`

Specifies the directory where the plugin should look for environment files. By default, it looks in the root directory.

```js
new DotenvWebpackPlugin({
  dir: "./config/env",
});
```

### `prefix`

Type:

```ts
type prefix = string | string[];
```

Default: `undefined`

Defines which environment variables should be exposed to the client code based on their prefix. This is a critical security feature to prevent sensitive information from being exposed.

```js
// Single prefix
new DotenvWebpackPlugin({
  prefix: "PUBLIC_",
});

// Multiple prefixes
new DotenvWebpackPlugin({
  prefix: ["PUBLIC_", "SHARED_"],
});
```
