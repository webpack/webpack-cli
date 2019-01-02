# webpack-cli generators

## Description

This package contains all webpack-cli related yeoman generators. 

## Installation

```bash
npm i -D webpack-cli @webpack-cli/generators
```

## Usage

To run the package programmatically, install it as a dependency. When using the package programmatically, one does not have to install webpack-cli.

### Node

```js
const { addGenerator, addonGenerator, initGenerator, loaderGenerator, 
        pluginGenerator, removeGenerator, updateGenerator 
    } = require("@webpack-cli/generators");
    // ... compose with yeoman env or add a generator to your own yeoman project
```
## Generators

- [**Plugin Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/plugin-generator.ts) : Creates a webpack plugin project, add starter plugin code and runs `webpack-defaults`
- [**Remove Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/remove-generator.ts) : Removes properties from webpack configurations
- [**Update Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/update-generator.ts) : [WIP] Updates properties of webpack configurations
- [**Loader Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/loader-generator.ts) : Creates a webpack loader project, add starter loader code and runs `webpack-defaults`
- [**Init Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/init-generator.ts)   : Generates new webapck configuration as per user requirements
- [**Add Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/add-generator.ts)    : Add properties to webpack configurations
- [**Addon Generator**](https://github.com/webpack/webpack-cli/blob/master/packages/generators/addon-generator.ts)  : Generates a webpack project conforming to `webpack-defaults`
---
[Back to Packages](https://github.com/webpack/webpack-cli/tree/master/packages)
