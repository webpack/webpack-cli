# webpack-cli info

[![NPM Downloads][downloads]][downloads-url]

## Description

This package returns a set of information related to the local environment.

## Installation

```bash
#npm
npm i -D @webpack-cli/info

#yarn
yarn add @webpack-cli/info -D
```

## Usage

### Args / Flags

#### Output format

| Flag                | Description                   | Type        |     |     |
| ------------------- | ----------------------------- | ----------- | --- | --- |
| `--output-json`     | To get the output as JSON     | [ boolean ] |     |     |
| `--output-markdown` | To get the output as markdown | [ boolean ] |     |     |

#### Options

| Flag                | Description                                                     | Type        |
| ------------------- | --------------------------------------------------------------- | ----------- |
| `--help`            | Show help                                                       | [ boolean ] |
| `--version`         | Show version number of `webpack-cli`                            | [ boolean ] |
| `--system` , `-s`   | System information ( OS, CPU )                                  | [ boolean ] |
| `--binaries` , `-b` | Installed binaries (Node, yarn, npm)                            | [ boolean ] |
| `--browsers`        | Installed web browsers                                          | [ boolean ] |
| `--npmg`            | Globally installed NPM packages ( webpack & webpack-cli only )  | [ boolean ] |
| `--npmPackages`     | Info about packages related to webpack installed in the project | [ boolean ] |

### Node

```js
const info = require("webpack-cli/packages/info").default;

async function wrapperFunc() {
	let envinfo = await info({
		/* Custom Config */
	});
}
wrapperFunc();
```

**Custom Config** => Custom arguments are key pair boolean values.

### CLI (via `webpack-cli`)

```bash
webpack-cli info --FLAGS #Flags are optional for custom output
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/info.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/info
