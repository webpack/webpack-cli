# webpack-cli init

[![NPM Downloads][downloads]][downloads-url]

## Description

This package contains the logic to create a new webpack configuration.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/init
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const init = require('@webpack-cli/init').default;

// this will run the default init instance
init();

// we're slicing node.process, ...myPackages is a webpack-scaffold name/path
init([null, null, ...myPackages]);
```

### CLI (via `webpack-cli`)

**Via defaults**

```bash
npx webpack-cli init
```

**To generate default configs**

```bash
npx webpack-cli init --auto
```

**To force config generation**

```bash
npx webpack-cli init --force
```

**Via custom scaffold**

1. Using package on `npm`

```bash
npx webpack-cli init webpack-scaffold-[name]
```

2. Using path to a local directory

```bash
npx webpack-cli init [path]
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/init.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/init
