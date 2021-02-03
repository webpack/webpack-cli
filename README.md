<div align="center">
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

<h1 align="center">webpack CLI</h1>

<p align="center">
  The official CLI of webpack
</p>
<br>

[![npm][npm]][npm-url]
[![Build Status][build-status]][build-status-url]
[![codecov][codecov-badge]][codecov-url]
[![Dependencies][deps]][deps-url]
[![Install Size][size]][size-url]
[![Chat on gitter][chat]][chat-url]

## Table of Contents

-   [About](#about)
    -   [How to install](#how-to-install)
-   [Supported arguments and commands](#supported-arguments-and-commands)
-   [Packages](#packages)
    -   [Commands](#commands)
    -   [Utilities](#utilities)
-   [Getting started](#getting-started)
-   [webpack CLI Scaffolds](#webpack-cli-scaffolds)
-   [Exit codes and their meanings](#exit-codes-and-their-meanings)
-   [Contributing and Internal Documentation](#contributing-and-internal-documentation)
-   [Open Collective](#open-collective)

## About

webpack CLI provides a flexible set of commands for developers to increase speed when setting up a custom webpack project. As of webpack v4, webpack is not expecting a configuration file, but often developers want to create a more custom webpack configuration based on their use-cases and needs. webpack CLI addresses these needs by providing a set of tools to improve the setup of custom webpack configuration.

### How to install

When you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack then webpack CLI is already installed!

Otherwise `npm install --save-dev webpack-cli` or `yarn add webpack-cli --dev` will install it.

## Supported arguments and commands

Get to know what are the available commands and arguments [here](./packages/webpack-cli/README.md).

## Packages

We organize webpack CLI as a multi-package repository using [lerna](https://github.com/lerna/lerna). Every command has a dedicated subfolder in the `packages` folder. Here's a summary of commands provided by the CLI.

### Commands

Supporting developers is an important task for webpack CLI.
Thus, webpack CLI provides different commands for many common tasks.

-   `build|bundle|b [entries...] [options]` - Run webpack (default command, can be omitted).
-   [`configtest|t [config-path]`](./packages/configtest/README.md#webpack-cli-configtest) - Validate a webpack configuration.
-   `help|h [command] [option]` - Display help for commands and options.
-   [`init|c`](./packages/init/README.md#webpack-cli-init) - Create a new webpack configuration.
-   [`info|i`](./packages/info/README.md#webpack-cli-info) - Returns information related to the local environment.
-   [`migrate|m`](https://www.npmjs.com/package/@webpack-cli/migrate) - Migrate project from one version to another.
-   [`plugin|p`](./packages/generators#generators) - Initiate new plugin project.
-   [`loader|l`](./packages/generators#generators) - Initiate new loader project.
-   [`serve|s`](./packages/serve/README.md#webpack-cli-serve) - Use webpack with a development server that provides live reloading.
-   `version|v [commands...]` - Output the version number of `webpack`, `webpack-cli`, `webpack-dev-server`, and commands
-   `watch|w [entries...] [options]` - Run webpack and watch for files changes.

### Utilities

The project also has several utility packages which are used by other commands

-   [`generators`](./packages/generators/README.md) - Contains all webpack-cli related yeoman generators.

## Getting started

When you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack then webpack CLI is already installed! Otherwise, you would need to install webpack CLI and the packages you want to use. If you want to use the `init` command to create a new `webpack.config.js` configuration file:

```sh
npm i webpack-cli @webpack-cli/init
npx webpack-cli init
```

You will be prompted for some questions about what how you want to generate your config file when running the `init` command so webpack CLI can provide the best fitting configuration.

## webpack CLI Scaffolds

With v3 of webpack CLI, we introduced scaffolding as an integral part of the CLI. Our goal is to simplify the creation of webpack configurations for different purposes. Additionally, sharing such solutions with the community is beneficial and with webpack, we want to allow this. We provide `webpack-scaffold` as a utility suite for creating these scaffolds. It contains functions that could be of use for creating a scaffold yourself.

You can read more about [Scaffolding](https://webpack.js.org/guides/scaffolding), learn [How to compose a webpack-scaffold?](https://webpack.js.org/contribute/writing-a-scaffold) or generate one with [webpack-scaffold-starter](https://github.com/rishabh3112/webpack-scaffold-starter).

## Exit codes and their meanings

| Exit Code | Description                                        |
| --------- | -------------------------------------------------- |
| `0`       | Success                                            |
| `1`       | Errors from webpack                                |
| `2`       | Configuration/options problem or an internal error |

## Contributing and Internal Documentation

The webpack family welcomes any contributor, small or big. We are happy to elaborate, guide you through the source code and find issues you might want to work on! To get started have a look at our [documentation on contributing](./.github/CONTRIBUTING.md).

## Open Collective

If you like **webpack**, please consider donating to our [Open Collective](https://opencollective.com/webpack) to help us maintain it.

[npm]: https://img.shields.io/npm/v/webpack-cli.svg
[npm-url]: https://www.npmjs.com/package/webpack-cli
[build-status]: https://github.com/webpack/webpack-cli/workflows/webpack-cli/badge.svg?branch=master
[build-status-url]: https://github.com/webpack/webpack-cli/actions
[codecov-badge]: https://codecov.io/gh/webpack/webpack-cli/branch/master/graph/badge.svg?token=6B6NxtsZc3
[codecov-url]: https://codecov.io/gh/webpack/webpack-cli
[deps]: https://img.shields.io/david/webpack/webpack.svg
[deps-url]: https://david-dm.org/webpack/webpack-cli
[size]: https://packagephobia.com/badge?p=webpack-cli
[size-url]: https://packagephobia.com/result?p=webpack-cli
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
