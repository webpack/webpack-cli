# webpack-scaffold

[![NPM Downloads][downloads]][downloads-url]

This is the utility suite for creating a webpack `scaffold`, it contains utility functions to help you work with [Inquirer](https://github.com/SBoudrias/Inquirer.js/) prompting and scaffolding.

# Installation

```bash
npm i -D webpack-cli @webpack-cli/webpack-scaffold
```

# API

-   [parseValue](#parsevalue)
-   [createArrowFunction](#createarrowfunction)
-   [createRegularFunction](#createregularfunction)
-   [createDynamicPromise](#createdynamicpromise)
-   [createAssetFilterFunction](#createassetfilterfunction)
-   [createExternalFunction](#createexternalfunction)
-   [createRequire](#createrequire)
-   [Inquirer](#inquirer)
    -   [List](#list)
    -   [RawList](#rawlist)
    -   [CheckList](#checklist)
    -   [Input](#input)
    -   [InputValidate](#inputvalidate)
    -   [Confirm](#confirm)

## parseValue

Param: `String`

Used when you cannot use regular conventions. Handy for examples like `RegExp` or `output.sourcePrefix`

```js
const parseValue = require("@webpack-cli/webpack-scaffold").parseValue;

this.configuration.myScaffold.webpackOptions.output.sourcePrefix = parseValue("\t");
// sourcePrefix: '\t'
```

## createArrowFunction

Param: `String`

Generally used when dealing with an entry point as an arrow function

```js
const createArrowFunction = require("@webpack-cli/webpack-scaffold").createArrowFunction;

this.configuration.myScaffold.webpackOptions.entry = createArrowFunction("app.js");
// entry: () => 'app.js'
```

## createRegularFunction

Param: `String`

Used when creating a function that returns a single value

```js
const createRegularFunction = require("@webpack-cli/webpack-scaffold").createRegularFunction;

this.configuration.myScaffold.webpackOptions.entry = createRegularFunction("app.js");
// entry: function() { return 'app.js' }
```

## createDynamicPromise

Param: `Array` | `String`

Used to create a dynamic entry point

```js
const createDynamicPromise = require("@webpack-cli/webpack-scaffold").createDynamicPromise;

this.confguration.myScaffold.webpackOptions.entry = createDynamicPromise("app.js");
// entry: () => new Promise((resolve) => resolve('app.js'))

this.configuration.myScaffold.webpackOptions.entry = createDynamicPromise(["app.js", "index.js"]);
// entry: () => new Promise((resolve) => resolve(['app.js','index.js']))
```

## createAssetFilterFunction

Param: `String`

Used to create an [assetFilterFunction](https://webpack.js.org/configuration/performance/#performance-assetfilter)

```js
const createAssetFilterFunction = require("@webpack-cli/webpack-scaffold").createAssetFilterFunction;

this.configuration.myScaffold.webpackOptions.performance.assetFilter = createAssetFilterFunction("js");
// assetFilter: function (assetFilename) { return assetFilename.endsWith('.js'); }
```

## createExternalFunction

Param: `String`

Used to create an [general function from Externals](https://webpack.js.org/configuration/externals/#function)

```js
const createExternalFunction = require("@webpack-cli/webpack-scaffold").createExternalFunction;

this.configuration.myScaffold.webpackOptions.externals = [createExternalFunction("^yourregex$")];
/*
externals: [
  function(context, request, callback) {
    if (/^yourregex$/.test(request)){
      return callback(null, 'commonjs ' + request);
    }
    callback();
  }
*/
```

## createRequire

Param: `String`

Used to create a module in `topScope`

```js
const createRequire = require("@webpack-cli/webpack-scaffold").createRequire;

this.configuration.myScaffold.topScope = [createRequire("webpack")];
// const webpack = require('webpack')
```

## [Inquirer](https://github.com/SBoudrias/Inquirer.js/#prompt-types)

### List

Param: `name<String>, message<String>, choices<Array>`

Creates a List from Inquirer

```js
const List = require("@webpack-cli/webpack-scaffold").List;

List("entry", "what kind of entry do you want?", ["Array", "Function"]);
```

### RawList

Param: `name<String>, message<String>, choices<Array>`

Creates a RawList from Inquirer

```js
const RawList = require("@webpack-cli/webpack-scaffold").RawList;

RawList("entry", "what kind of entry do you want?", ["Array", "Function"]);
```

### CheckList

Param: `name<String>, message<String>, choices<Array>`

Creates a CheckList(`checkbox`) from Inquirer

```js
const CheckList = require("@webpack-cli/webpack-scaffold").CheckList;

CheckList("entry", "what kind of entry do you want?", ["Array", "Function"]);
```

### Input

Param: `name<String>, message<String>, [default<String>]`

Creates an Input from Inquirer

```js
const Input = require("@webpack-cli/webpack-scaffold").Input;

Input("entry", "what is your entry point?", "src/index");
```

### InputValidate

Param: `name<String>, message<String>, [validate<Function>, default<String>]`

Creates an Input from Inquirer

```js
const InputValidate = require("@webpack-cli/webpack-scaffold").InputValidate;

const validation = value => {
	if (value.length > 4) {
		return true;
	} else {
		return "Your answer must be longer than 4 characters, try again";
	}
};
InputValidate("entry", "what is your entry point?", validation, "src/index");
```

### Confirm

Param: `name<String>, message<String>, [default<Boolean>]`

Creates an Input from Inquirer

```js
const Confirm = require("@webpack-cli/webpack-scaffold").Confirm;

Confirm("contextConfirm", "Is this your context?");
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/webpack-scaffold.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/webpack-scaffold
