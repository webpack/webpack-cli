# webpack-cli update

[![NPM Downloads][downloads]][downloads-url]

## Description

This package contains the logic to update properties in a webpack configuration file. It will run a generator that prompts the user for questions of which property to update in their webpack configuration file.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/update
```

## Usage

To run the scaffolding instance programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const update = require("@webpack-cli/update").default;
update();
```

### CLI (via `webpack-cli`)

```bash
npx webpack-cli update
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/update.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/update
