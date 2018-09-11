# webpack-cli make (Work in Progress, not yet published)

## Description

This package contains the logic to run a makefile command similar to C in webpack. 

## Installation

```bash
npm i -D webpack-cli @webpack-cli/make
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node
```js
const make = require("@webpack-cli/make");
make();
```

### CLI (via `webpack-cli`)
```bash
npx webpack-cli make
```