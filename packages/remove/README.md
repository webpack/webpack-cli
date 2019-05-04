# webpack-cli remove

[![NPM Downloads][downloads]][downloads-url]

## Description

This package contains the logic to remove properties of a webpack configuration file. It will run a generator that prompts the user for questions of which property to remove in their webpack configuration file.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/remove
```

## Usage

To run the scaffolding instance programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const remove = require("@webpack-cli/remove").default;
remove();
```

### CLI (via `webpack-cli`)

```bash
npx webpack-cli remove
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/remove.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/remove
