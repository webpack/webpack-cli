# webpack-cli init

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
const init = require("@webpack-cli/init").default;

// this will run the default init instance
init();

 // we're slicing node.process, ...myPacakges is a webpack-scaffold name/path
init([null, null, ...myPacakges]);
```

### CLI (via `webpack-cli`)
**Via defaults**

```bash
npx webpack-cli init
```
**Via custom scaffold**
1. Using package on `npm`

```bash
npx webpack-cli init webpack-scaffold-[name]
```
2. Using path to local directory

```bash
npx webpack-cli init [path]
```
