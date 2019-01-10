# webpack-cli add

## Description

This package contains the logic to add new properties in a webpack configuration file. It will run a generator that prompts the user for questions of which property to add to their webpack configuration file.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/add
```

## Usage

To run the scaffolding instance programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node
```js
const add = require("@webpack-cli/add").default;
add();
```

### CLI (via `webpack-cli`)
```bash
npx webpack-cli add
```
---
[Back to Packages](https://github.com/webpack/webpack-cli/tree/master/packages)
