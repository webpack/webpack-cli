# webpack-cli generate-plugin

## Description

This package contains the logic to initiate new plugin projects.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/generate-plugin
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node
```js
const generatePlugin = require("@webpack-cli/generate-plugin");
generatePlugin();
```

### CLI (via `webpack-cli`)
```bash
npx webpack-cli generate-plugin
```