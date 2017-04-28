<a href="https://gitter.im/webpack/webpack">
<div align="center"><a href="https://github.com/webpack/webpack-cli">
  <img width="200" heigth="200" src="https://webpack.js.org/assets/icon-square-big.svg">
</a>
</div>

[![Build Status](https://travis-ci.org/webpack/webpack-cli.svg)](https://travis-ci.org/webpack/webpack-cli)
[![Dependency Status](https://david-dm.org/webpack/webpack-cli.svg)](https://david-dm.org/webpack/webpack-cli)
[![Code Climate](https://codeclimate.com/github/webpack/webpack-cli/badges/gpa.svg)](https://codeclimate.com/github/webpack/webpack-cli)
[![chat on gitter](https://badges.gitter.im/webpack/webpack.svg)](https://gitter.im/webpack/webpack)

# Webpack CLI

Webpack CLI encapsulates all code related to CLI handling. It captures options and sends them to webpack compiler. You can also find functionality for initializing a project and migrating between versions. For the time being, it is backwards-compatible with the CLI included in webpack itself.

**Note** The package is still in work in progress. In case you want to contribute, reach to us, so we can point you out how and when you can help us.

## Migration from webpack v1 to v2

The `migrate` feature eases the transition from [version 1](http://webpack.github.io/docs/) to [version 2](https://gist.github.com/sokra/27b24881210b56bbaff7). `migrate` also allows users to switch to the new version of webpack without having to extensively [refactor](https://webpack.js.org/guides/migrating/).

`webpack --migrate <config>`

[Read more about migrating](MIGRATE.md)

## Creating new webpack projects

The `init` feature allows users to get started with webpack, fast. Through scaffolding, people can create their own configuration in order to faster initialize new projects for various of use cases.

`webpack --init [webpack-addons-<package>]`

[Read more about scaffolding](SCAFFOLDING.md)
