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

#npx
npx webpack info [options]

```

## Usage

### Args / Flags

#### Output format

| Flag                | Description                   | Type        |
| ------------------- | ----------------------------- | ----------- |
| `--output-json`     | To get the output as JSON     | [ boolean ] |
| `--output-markdown` | To get the output as markdown | [ boolean ] |

_Not supported for config_

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
const info = require('@webpack-cli/info').default;

async function wrapperFunc() {
    await info({
        /* Custom Config */
    });
}
wrapperFunc();
```

#### Custom config

> Config has higher precedence than system flags

```json
// Config's relative path
{

    "config": [string]
}
    // System info
{
    "binaries": [boolean],
    "system": [boolean],
    "browsers": [boolean],
    "npmg": [boolean],
    "npmPackages": [boolean],
}
```

The function returns `string` for `system` info, and returns an array of strings (`string[]`) for `config`

### CLI (via `webpack-cli`)

```bash
webpack-cli info --FLAGS #Flags are optional for custom output
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/info.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/info
