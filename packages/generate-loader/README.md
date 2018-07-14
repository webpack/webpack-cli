# webpack-cli generate-loader

## Description

This package contains the logic to initiate new loader projects.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/generate-loader
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const generateLoader = require("@webpack-cli/generate-loader");
generateLoader();
```

### CLI (via `webpack-cli`)
```bash
npx webpack-cli generate-loader
```