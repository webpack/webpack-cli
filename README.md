<div align="center">
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

<h1 align="center">webpack CLI</h1>

<p align="center">
  The official Command Line Interface of webpack
</p>
<br>

[![npm][npm]][npm-url]
[![Build Status][build-status]][build-status-url]
[![codecov][codecov-badge]][codecov-url]
[![Install Size][size]][size-url]
[![Chat on gitter][chat]][chat-url]

## Table of Contents

- [About](#about)
  - [How to install](#how-to-install)
- [Supported arguments and commands](#supported-arguments-and-commands)
- [Packages](#packages)
  - [Commands](#commands)
- [Getting started](#getting-started)
- [Exit codes and their meanings](#exit-codes-and-their-meanings)
- [Contributing and Internal Documentation](#contributing-and-internal-documentation)
- [Funding](#funding)

## About

Webpack CLI provides the interface of options webpack uses in its configuration file. The CLI options override options passed in the configuration file.

The CLI provides a rich set of commands that helps you develop your application faster.

### How to install

If you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack then webpack CLI is already installed!

Otherwise `npm install --save-dev webpack-cli`, `yarn add webpack-cli --dev` or `pnpm add --D webpack-cli` will install it.

## Supported arguments and commands

Get to know what are the available commands and arguments [here](./packages/webpack-cli/README.md).

## Packages

We organize webpack CLI as a multi-package repository using [lerna](https://github.com/lerna/lerna). The main CLI logic using options, resides in [`packages/webpack-cli`](https://github.com/webpack/webpack-cli/tree/master/packages/webpack-cli), while commands supported by the CLI, has dedicated subfolders in the folder [`packages`](https://github.com/webpack/webpack-cli/tree/master/packages).

A summary of supported commands is described below.

### Commands

Supporting developers is an important task for webpack CLI.
Thus, webpack CLI provides different commands for many common tasks.

- [`build|bundle|b [entries...] [options]`](https://webpack.js.org/api/cli/#build) - Run webpack (default command, can be omitted).
- [`configtest|t [config-path]`](https://webpack.js.org/api/cli/#configtest) - Validate a webpack configuration.
- [`help|h [command] [option]`](https://webpack.js.org/api/cli/#help) - Display help for commands and options.
- [`init|create|new|c|n [generation-path] [options]`](https://webpack.js.org/api/cli/#init) - Create a new webpack project.
- [`info|i [options]`](https://webpack.js.org/api/cli/#info) - Returns information related to the local environment.
- [`plugin|p [output-path] [options]`](https://webpack.js.org/api/cli/#plugin) - Initiate new plugin project.
- [`loader|l [output-path] [options]`](https://webpack.js.org/api/cli/#loader) - Initiate new loader project.
- [`serve|server|s [entries...] [options]`](https://webpack.js.org/api/cli/#serve) - Use webpack with a development server that provides live reloading.
- [`version|v [commands...]`](https://webpack.js.org/api/cli/#version) - Output the version number of `webpack`, `webpack-cli`, `webpack-dev-server`, and commands.
- [`watch|w [entries...] [options]`](https://webpack.js.org/api/cli/#watch) - Run webpack and watch for files changes.

## Getting started

If you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack, then webpack CLI is already installed!

Otherwise, you would need to install webpack CLI and the packages you want to use.

If you want to create a fresh webpack project, the `init` command will guide you through setting up a project. Run the command as stated below.

```sh
npm i webpack-cli @webpack-cli/init
```

```sh
npx webpack-cli init
```

You will then be prompted for some questions about which features you want to use, such as `scss`, `typescript`, `PWA` support or other features.

## Exit codes and their meanings

| Exit Code | Description                                        |
| --------- | -------------------------------------------------- |
| `0`       | Success                                            |
| `1`       | Errors from webpack                                |
| `2`       | Configuration/options problem or an internal error |

## Contributing and Internal Documentation

The webpack family welcomes any contributor, small or big. We are happy to elaborate, guide you through the source code and find issues you might want to work on! To get started have a look at our [contribution documentation](./.github/CONTRIBUTING.md).

## Funding

If you like **webpack**, please consider donating through [Open Collective](https://opencollective.com/webpack) to help us maintain it.

[npm]: https://img.shields.io/npm/v/webpack-cli.svg
[npm-url]: https://www.npmjs.com/package/webpack-cli
[build-status]: https://github.com/webpack/webpack-cli/workflows/webpack-cli/badge.svg?branch=master
[build-status-url]: https://github.com/webpack/webpack-cli/actions
[codecov-badge]: https://codecov.io/gh/webpack/webpack-cli/branch/master/graph/badge.svg?token=6B6NxtsZc3
[codecov-url]: https://codecov.io/gh/webpack/webpack-cli
[size]: https://packagephobia.com/badge?p=webpack-cli
[size-url]: https://packagephobia.com/result?p=webpack-cli
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

## Code of Conduct

Guidelines to how the webpack organization expects you to behave is documented under [Code of Conduct](./CODE_OF_CONDUCT.md)
