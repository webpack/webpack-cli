# webpack-cli info

[![npm](https://img.shields.io/npm/dm/@webpack-cli/info.svg)](https://www.npmjs.com/package/@webpack-cli/info)

## Description

This pacakge returns a set of information related to the local enviroment.

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
