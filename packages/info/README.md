# webpack-cli info

[![NPM Downloads][downloads]][downloads-url]

## Description

This package returns a set of information related to the local environment.

## Installation

```bash
npm i -D @webpack-cli/info
```

## Usage

### Node

```js
const envinfo = require("@webpack-cli/info").default;
envinfo();
```

### CLI (via `webpack-cli`)

```bash
npx webpack-cli info
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/info.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/info
