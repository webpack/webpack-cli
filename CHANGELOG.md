# Change Log

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
