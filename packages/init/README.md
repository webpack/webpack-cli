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
const init = require("@webpack-cli/init");

// this will run the default init instance
init();

 // we're slicing node.process, ...myPacakges is a webpack-scaffold name/path
init([null, null, ...myPacakges]);
```

### CLI (via `webpack-cli`)
```bash
npx webpack-cli init
```