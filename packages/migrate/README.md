# webpack-cli migrate

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
---
[Back to Packages](https://github.com/webpack/webpack-cli/tree/master/packages)
