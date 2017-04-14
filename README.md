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

This project intends to be the main cli package of webpack. Here we will encapsulate all the features and code related to the command line. From sending options to the compiler, to initialize and migrate from version to version. To avoid breaking changes and making people unhappy, we are keeping the old features. While we keep the old features, we've added some other, `init`and `migrate`. 

**Note** The package is still in work in progress. In case you want to contribute, reach to us, so we can point you out how and when you can help us.

## Migration from webpack v1 to v2

The `migrate` feature aims to ease the transition version 1, to version 2 of webpack. This feature will allow users to switch to the new version of webpack, without having to refactor themselves.

`webpack --migrate <config>`

[Read more about migrating]()

## Creating new webpack projects

The `init` feature allows users to get started with webpack, fast. Through scaffolding, people can create their own configuration in order to faster initialize new projects for various of use cases.

`webpack --init [webpack-addons-<package>]`

[Read more about scaffolding]()
