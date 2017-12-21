# Change Log

<a name="2.0.0"></a>
## 2.0.0 (2017-12-21)

* Adds add
* Remove some mocks
* Remove validationschema and ajv dependencies
* Update Jest & Jest-cli
* Remove unused dependencies
* Creator is now init
* Using env preset ( #197 )
* Using yarn ( #203 )
* Using peer dep of webpack
* Transformations is now migrate
* Init has its own generator
* Commands are refactored into a HOC and sent to a folder for each command with an helper for scaffolding aliases
* Using RawList instead of List for better usability ( 541ba62 )
* lib/transformations/util is now in lib/utils/ast-utils
* Each AST module now has an extra argument that specifies action to be done
* FindPluginsByRoot is now FindRootByName and more generalistic
* Added ast util function createEmptyCallableFunctionWithArguments
* #214
* #215 ( Committed directly to master )
* #217
* topScope now checks if the import already is present
* Updated test errors/issue-5576, remember to sync with webpack/next
* #218
* Migrate now uses prettier ( 972d4cd )
* Added transform for mode (e1f512c)
* Remove recast fork (b416d9c)
* New Transforms ( 28680c9 )
* JSdocs are added (285846a)
* Adds serve alias ( #204 )
* Migrate has new config validation logic ( 5d4430a)
* webpack serve is added ( 992bfe2 )
* webpack --config-register and webpack -r is added (ab94211)
* Adds webpack make for makefile generation (4f9a4f8)
* Added appveyor ( c5c9746 )
* Remove commit-validate from docs ( #222 )
* Added transform resolveLoader (3c90e83)
* Using v8-compile-cache ( 0564ceb )
* Adds webpack-cli bot #224

<a name="1.3.2"></a>
## 1.3.2 (2017-05-15)


### Bug Fixes

* add css-loader appropriately ([#141](https://github.com/webpack/webpack-cli/issues/141)) ([a71600e](https://github.com/webpack/webpack-cli/commit/a71600e))
* Deps 'webpack' and 'uglifyjs-webpack-plugin' not installed when user answers yes to 'using ES2015' ([#135](https://github.com/webpack/webpack-cli/issues/135)). ([#136](https://github.com/webpack/webpack-cli/issues/136)) ([524f035](https://github.com/webpack/webpack-cli/commit/524f035))
* Install correct (`es2015`) babel preset to match generated config ([#138](https://github.com/webpack/webpack-cli/issues/138)) ([b0af53f](https://github.com/webpack/webpack-cli/commit/b0af53f))
* use correct test function ([#129](https://github.com/webpack/webpack-cli/issues/129)) ([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))


<a name="1.3.1"></a>

## 1.3.1 (2017-05-02)

### Bug Fixes

* add safe traverse to loaderoptionsplugin ([#77](https://github.com/webpack/webpack-cli/issues/77)) ([4020043](https://github.com/webpack/webpack-cli/commit/4020043))
* Do not create LoaderOptionsPlugin if loaderOptions is empty ([#72](https://github.com/webpack/webpack-cli/issues/72)) ([b9d22c9](https://github.com/webpack/webpack-cli/commit/b9d22c9))
([68a2dfd](https://github.com/webpack/webpack-cli/commit/68a2dfd))
* Upgrade to Jest 19 ([#71](https://github.com/webpack/webpack-cli/issues/71)) ([fe62523](https://github.com/webpack/webpack-cli/commit/fe62523))
* Use `safeTraverse` where appropriate ([#94](https://github.com/webpack/webpack-cli/issues/94)) ([dcde2b6](https://github.com/webpack/webpack-cli/commit/dcde2b6))
([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))
* Use real paths from argvs instead of dummy hard-coded file ([#65](https://github.com/webpack/webpack-cli/issues/65)) ([a46edbb](https://github.com/webpack/webpack-cli/commit/a46edbb))


### Features

* Add beautifier config for JS code ([64c88ea](https://github.com/webpack/webpack-cli/commit/64c88ea))
* Add commit validation and commits template ([d0cbfc0](https://github.com/webpack/webpack-cli/commit/d0cbfc0))
* Add editorconfig settings from core webpack ([89809de](https://github.com/webpack/webpack-cli/commit/89809de))
* Add yarn settings to handle dependencies ([34579c7](https://github.com/webpack/webpack-cli/commit/34579c7))
* Adds a resolved path for output ([#80](https://github.com/webpack/webpack-cli/issues/80)) ([37a594d](https://github.com/webpack/webpack-cli/commit/37a594d))
* Introduce reserve and timestamps ([#24](https://github.com/webpack/webpack-cli/issues/24)) ([ed267b4](https://github.com/webpack/webpack-cli/commit/ed267b4))
* Webpack-CLI version 1([#105](https://github.com/webpack/webpack-cli/pull/105))
* Feature: Use listr to display progress and errors for transformations([#92](https://github.com/webpack/webpack-cli/pull/92))
* Feature: Jscodeshift Transformations for --migrate ([#40](https://github.com/webpack/webpack-cli/pull/40))
