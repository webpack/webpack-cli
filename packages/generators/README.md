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

- **Plugin Generator** : Creates a webpack plugin project, add starter plugin code and runs `webpack-defaults`
- **Remove Generator** : Removes properties from webpack configurations
- **Update Generator** : [WIP] Updates properties of webpack configurations
- **Loader Generator** : Creates a webpack loader project, add starter loader code and runs `webpack-defaults`
- **Init Generator**   : Generates new webapck configuration as per user requirements
- **Add Generator**    : Add properties to webpack configurations
- **Addon Generator**  : Generates a webpack project conforming to `webpack-defaults`
