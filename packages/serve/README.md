# webpack-cli serve

[![NPM Downloads][downloads]][downloads-url]

## Description

This package contains the logic to run [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to serve your webpack app and provide live reloading.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/serve
```

## Usage

To run the scaffolding instance programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const serve = require("@webpack-cli/serve").default;
serve();
```

### CLI (via `webpack-cli`)

```bash
npx webpack-cli serve
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/serve.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/serve
