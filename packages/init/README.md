# webpack-cli init

[![NPM Downloads][downloads]][downloads-url]

## Description

This package contains the logic to create a new webpack configuration.

## Installation

```bash
npm i -D webpack-cli @webpack-cli/init
```

## Usage

### CLI (via `webpack-cli`)

**Via defaults**

```bash
npx webpack-cli init
```

**To generate default configs**

```bash
npx webpack-cli init --auto
```

**To scaffold in a specified path**

```bash
npx webpack-cli init --generation-path [path]
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
