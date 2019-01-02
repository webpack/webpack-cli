# webpack-cli migrate

The `webpack-cli migrate` feature eases the transition from:
- `version 1` to `version 2`
- `version 2` to `version 4`

`webpack-cli migrate` also allows users to switch to the new version of webpack without having to do it extensively.

## Installation
> Requires installation of `webpack` and `webpack-cli`
### A. Local Setup
```shell
$ npm install --save-dev @webpack-cli/migrate
```
### B. Global Setup
```shell
$ npm install -g @webpack-cli/migrate
```

## Usage
To use `webpack-cli migrate`, run the following command, with the value of `<config>` being a path to an existing webpack configuration file. `<config>` can be `webpack.config.js` , `webpack.prod.js` or any webpack configuration.
### A. Local Setup
```bash
$ npx webpack-cli migrate <config>
```
### B. Global Setup
```bash
$ webpack-cli migrate <config>
```
### Usage Example
Given a basic configuration file like so:

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {

  entry: {
	index: './src/index.js',
	vendor: './src/vendor.js'
  },

  output: {
	filename: '[name].[chunkhash].js',
	chunkFilename: '[name].[chunkhash].js',
	path: path.resolve(__dirname, 'dist')
  },

  module: {
	loaders: [
	  {
		test: /\.js$/,
		exclude: /node_modules/,
		loader: 'babel',
		query: {
		  presets: ['@babel/preset-env']
		}
	  },
	  {
		test: /\.(scss|css)$/,
		loader: ExtractTextPlugin.extract('style', 'css!sass')
	  }
	]
  },

  plugins: [
	new UglifyJSPlugin(),

	new ExtractTextPlugin('styles-[contentHash].css'),

	new webpack.optimize.CommonsChunkPlugin({
	  name: 'common',
	  filename: 'common-[hash].min.js'
	}),

	new HtmlWebpackPlugin()
  ]

};
```

The `migrate` command, when run, will show the proposed changes to the config file in the terminal, prompting the user to
accept the changes or not:

```diff
$ webpack-cli migrate ./webpack.config.js
 ✔ Reading webpack config
 ✔ Migrating config from v1 to v2
-    loaders: [
+      rules: [
-        loader: 'babel',
-          query: {
+            use: [{
+              loader: 'babel-loader'
+            }],
+            options: {
-              loader: ExtractTextPlugin.extract('style', 'css!sass')
+              use: ExtractTextPlugin.extract({
+                fallback: 'style',
+                use: 'css!sass'
+              })
? Are you sure these changes are fine? Yes

 ✔︎ New webpack v2 config file is at /Users/obuckley/Workspace/github/repos/webpack-migrate-sandbox/webpack.config.js
```


After it has run, we have our new webpack config file!

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {

  entry: {
	index: './src/index.js',
	vendor: './src/vendor.js'
  },

  output: {
	filename: '[name].[chunkhash].js',
	chunkFilename: '[name].[chunkhash].js',
	path: path.resolve(__dirname, 'dist')
  },

  module: {
	rules: [
	  {
		test: /\.js$/,
		exclude: /node_modules/,
		use: [{
		  loader: 'babel-loader'
		}],
		options: {
		  presets: ['@babel/preset-env']
		}
	  },
	  {
		test: /\.(scss|css)$/,
		use: ExtractTextPlugin.extract({
		  fallback: 'style',
		  use: 'css!sass'
		})
	  }
	]
  },

  plugins: [
	new UglifyJSPlugin(),

	new ExtractTextPlugin('styles-[contentHash].css'),

	new webpack.optimize.CommonsChunkPlugin({
	  name: 'common',
	  filename: 'common-[hash].min.js'
	}),

	new HtmlWebpackPlugin()
  ]

};
```
## Changes reflected after migration
We can see the following changes after migration:
1.  The webpack schema for using loaders has changed
    - `loaders` is now `module.rules`
    -  `query` is now `options`
2.  All loaders now have to have the *loader* suffix, e.g. `babel` -> `babel-loader`
3.  `NamedModulesPlugin` migrated to `optimizations.namedModules`
4.  `NoEmitOnErrorsPlugin` migrated to `optimizations.noEmitOnErrors`
5.  `ModuleConcatenationPlugin` migrated to `optimizations.concatenateModules`
---
**Note: This command does NOT handle updating dependencies in _package.json_, it is only a migration tool for the config
file itself.  Users are expected to manage dependencies themselves.**
