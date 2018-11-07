# webpack-cli make (Work in Progress, not yet published)

## Description

This package contains the logic to build only changed files and files depending on them in webpack.

#### Dependency tree
Package create dependency tree according to source files.
A typical dependency tree looks like
```json
	{
		"src/foo.js" : ["bar", "webpack", . . . , etc],
		"src/bar.js" : ["./utils/apple", . . . ,etc],
		"src/utils.apple.js" : ["path", . . . . , etc]
	}
```

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
