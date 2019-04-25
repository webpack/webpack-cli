# webpack-cli migrate

[![npm][downloads]][downloads-url]

## Description

This package contains the logic to migrate a project from one version to the other.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/migrate
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const migrate = require("@webpack-cli/migrate").default;

// add null to mock process.env
migrate(null, null, inputPath, outputPath);
```

### CLI (via `webpack-cli`)

```bash
npx webpack-cli migrate
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/migrate.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/migrate
