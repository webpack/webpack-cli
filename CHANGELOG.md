 <a name="2.0.14"></a>
# 2.0.14 (2018-04-05)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.13...2.0.14)

## New Features

* use npm ci for tests (#367) ([#368](https://github.com/webpack/webpack-cli/pull/368))
* add envinfo as `webpack-cli info` command ([51ab19f](https://github.com/webpack/webpack-cli/commit/51ab19f))
* --entry should override config.entry (#155) ([#358](https://github.com/webpack/webpack-cli/pull/358))

## Chore

* coverage: added reporters inside package.json ([c7d80fb](https://github.com/webpack/webpack-cli/commit/c7d80fb))
* upgrade: webpack 4.2 and other dependencies ([#362](https://github.com/webpack/webpack-cli/pull/362))
* version: v.2.0.13 ([2222f1d](https://github.com/webpack/webpack-cli/commit/2222f1d))

## CLI

* refactor: improve folder structure ([#371](https://github.com/webpack/webpack-cli/pull/371))

## Fix

* loader,plugin: fix generators path bug ([b4bfafb](https://github.com/webpack/webpack-cli/commit/b4bfafb))

 <a name="2.0.13"></a>
# 2.0.13 (2018-03-22)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.12...2.0.13)

## Chore

* pkg: explicitly include files for release ([#349](https://github.com/webpack/webpack-cli/pull/349))

## CLI

* init: add webpack-cli dep ([#347](https://github.com/webpack/webpack-cli/pull/347))

 <a name="2.0.12"></a>
# 2.0.12 (2018-03-14)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.11...v2.0.12)

## New Features

* support --build-delimiter for opt-in output delimiter (#192) ([#340](https://github.com/webpack/webpack-cli/pull/340))

## Chore

* gitignore: add vim swap files to gitignore ([3448fb5](https://github.com/webpack/webpack-cli/commit/3448fb5))
* scaffolding: update docs ([#336](https://github.com/webpack/webpack-cli/pull/336))

## Fix

* removes debug in migrate ([#342](https://github.com/webpack/webpack-cli/pull/342))

## Tests

* snapshot: update snapshot ([bd8ccda](https://github.com/webpack/webpack-cli/commit/bd8ccda))

## Misc

* cz: fix type description ([#339](https://github.com/webpack/webpack-cli/pull/339))
* init: fix global-modules require statement in package-manager ([610aa02](https://github.com/webpack/webpack-cli/commit/610aa02))
* init-generator: cleanup ([b8c3145](https://github.com/webpack/webpack-cli/commit/b8c3145))

 <a name="2.0.11"></a>
# 2.0.11 (2018-03-10)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.10...v2.0.11)

## Chore

* bundlesize: change threshold ([2aedfda](https://github.com/webpack/webpack-cli/commit/2aedfda))
* deps: upgrade deps ([#319](https://github.com/webpack/webpack-cli/pull/319))
* docs: update docs ([3307e3b](https://github.com/webpack/webpack-cli/commit/3307e3b))
* es6: changed 'var' into 'const' where convenient ([#325](https://github.com/webpack/webpack-cli/pull/325))
* test: updated tests file names ([#324](https://github.com/webpack/webpack-cli/pull/324))

## CLI

* init: Refactor Yeoman ([#323](https://github.com/webpack/webpack-cli/pull/323))
* tapable: Remove Tapable#apply calls ([#305](https://github.com/webpack/webpack-cli/pull/305))

## Docs

* update README to remove inconsistent CLI messaging (#327) ([#328](https://github.com/webpack/webpack-cli/pull/328))

## Fix

* migrate: move options to use ([#308](https://github.com/webpack/webpack-cli/pull/308))
* adding 'fix' to whitelist ([10a00df](https://github.com/webpack/webpack-cli/commit/10a00df))

## Misc

* deps: clean up dependencies ([7078282](https://github.com/webpack/webpack-cli/commit/7078282))
* generator: Allow local paths to generators ([#265](https://github.com/webpack/webpack-cli/pull/265))
* grammar: revise spelling and incorrect syntax ([#293](https://github.com/webpack/webpack-cli/pull/293))
* readme: add npm badge ([#303](https://github.com/webpack/webpack-cli/pull/303))

 <a name="2.0.10"></a>
# 2.0.10 (2018-03-02)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.10)

## New Features

* show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
* chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Ast

* init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## Chore

* .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
* .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
* add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
* changelog: v.2.0.7 changelog ([a165269](https://github.com/webpack/webpack-cli/commit/a165269))
* clean: remove unused dependency ([4a395d7](https://github.com/webpack/webpack-cli/commit/4a395d7))
* deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))
* packager: remove yarn ([#302](https://github.com/webpack/webpack-cli/pull/302))
* pkg.json: remove commitmsg cmd ([4dff074](https://github.com/webpack/webpack-cli/commit/4dff074))
* refactor: update supports-color usage ([4566fde](https://github.com/webpack/webpack-cli/commit/4566fde))
* refactor: update supports-color usage ([97b2df3](https://github.com/webpack/webpack-cli/commit/97b2df3))
* revert: revert yargs to 9.0.1 ([7ef13ef](https://github.com/webpack/webpack-cli/commit/7ef13ef))
* upgrade: update all dependencies, devDependencies ([4bf64bf](https://github.com/webpack/webpack-cli/commit/4bf64bf))
* version: v.2.0.9 ([4cf5e17](https://github.com/webpack/webpack-cli/commit/4cf5e17))

## CLI

* devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
* version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Fix

* generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))
* yeoman-generator fork issue ([#294](https://github.com/webpack/webpack-cli/pull/294))
* Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
* change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

* add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

* convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

* run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

* add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))
* mode: add mode tests ([#285](https://github.com/webpack/webpack-cli/pull/285))
* update: migrate snapshot ([3c4e6f7](https://github.com/webpack/webpack-cli/commit/3c4e6f7))
* update: migrate snapshot ([c322067](https://github.com/webpack/webpack-cli/commit/c322067))

## Misc

* refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))
* [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
* Commitlint ([#300](https://github.com/webpack/webpack-cli/pull/300))
* Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
* Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
* strict Promise configuration validation ([#298](https://github.com/webpack/webpack-cli/pull/298))
* Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
* Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
* remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
* Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
* 2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
* v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
* fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
* binTestCases: remove obsolete snapshot ([42301d7](https://github.com/webpack/webpack-cli/commit/42301d7))
* dep: add webpack 4 as peer dependency ([#297](https://github.com/webpack/webpack-cli/pull/297))
* migrate: prettify output ([#281](https://github.com/webpack/webpack-cli/pull/281))
* revert: revert supports-color usage ([f8e819a](https://github.com/webpack/webpack-cli/commit/f8e819a))
* revert: revert supports-color usage ([75f706b](https://github.com/webpack/webpack-cli/commit/75f706b))
* syntax: prettify ([5cb146f](https://github.com/webpack/webpack-cli/commit/5cb146f))
* yargs: add description for module-bind-* args ([#286](https://github.com/webpack/webpack-cli/pull/286))

 <a name="2.0.9"></a>
# 2.0.9 (2018-02-25)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.9)

## Ast

* init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## Chore

* .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
* .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
* add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
* changelog: v.2.0.7 changelog ([a165269](https://github.com/webpack/webpack-cli/commit/a165269))
* deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))
* pkg.json: remove commitmsg cmd ([4dff074](https://github.com/webpack/webpack-cli/commit/4dff074))

## CLI

* devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
* version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Feat

* show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
* chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

* Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
* change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))
* generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))

## Improvement

* add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

* convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

* run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

* add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

* remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
* Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
* v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
* fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
* 2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
* Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
* Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
* Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
* Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
* [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
* refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

 <a name="2.0.7"></a>
# 2.0.7 (2018-02-24)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.7)

## Chore

* .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
* .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
* add: temp remove add from cli ([f663215](https://github.com/webpack/webpack-cli/commit/f663215))
* deps: bump uglify dep and cli version ([81a9f1e](https://github.com/webpack/webpack-cli/commit/81a9f1e))

## Feat

* show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
* chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

* Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
* change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

* add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

* convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

* run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

* add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

* remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
* Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
* v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
* fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
* 2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
* Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
* Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
* Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
* Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
* [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
* refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

 <a name="2.0.6"></a>
# 2.0.6 (2018-02-20)
[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.6)

## Chore

* .gitignore: ignore .vscode ([ab0eacc](https://github.com/webpack/webpack-cli/commit/ab0eacc))
* .gitignore: ignore .vscode ([a322505](https://github.com/webpack/webpack-cli/commit/a322505))
* add new items to chore: adds chore command ([db243b6](https://github.com/webpack/webpack-cli/commit/db243b6))
* linting: lint added files ([6dc12af](https://github.com/webpack/webpack-cli/commit/6dc12af))
* remove cmd: removes f command ([7adfdcf](https://github.com/webpack/webpack-cli/commit/7adfdcf))

## Feat

* show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))

## Fix

* Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
* change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

* add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

* convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

* run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Tests

* add test for showing help on no options ([cf43939](https://github.com/webpack/webpack-cli/commit/cf43939))

## Misc

* remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
* [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
* v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
* fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
* 2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
* Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
* Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
* Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
* Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
* add commitlinting: adds commit linting to the cli ([7e4dd3d](https://github.com/webpack/webpack-cli/commit/7e4dd3d))
* add eslint ignore items: adds build folder and commit linter to ignore ([a400809](https://github.com/webpack/webpack-cli/commit/a400809))

<a name="2.0.0"></a>
## 2.0.0 (2017-12-21)

* Adds add
* Remove some mocks
* Remove validationschema and ajv dependencies
* Update Jest & Jest-cli
* Remove unused dependencies
* Creator is now init
* Using env preset ([#197](https://github.com/webpack/webpack-cli/pull/197))
* Using Yarn ([#203](https://github.com/webpack/webpack-cli/pull/203))
* Using peer dep of webpack
* Transformations is now migrate
* Init has its own generator
* Commands are refactored into a HOC and sent to a folder for each command with an helper for scaffolding aliases
* Using RawList instead of List for better usability ([82c64db](https://github.com/webpack/webpack-cli/commit/541ba62f02c4a1fcc807eac62a551fcae3f2d2c3))
* lib/transformations/util is now in lib/utils/ast-utils
* Each AST module now has an extra argument that specifies action to be done
* FindPluginsByRoot is now FindRootByName and more generalistic
* Added ast util function createEmptyCallableFunctionWithArguments
* Refactor for readability ([#214](https://github.com/webpack/webpack-cli/pull/214))
* Remove dist from repo ([#215](https://github.com/webpack/webpack-cli/pull/215))
* Remove entry and output validation ([#217](https://github.com/webpack/webpack-cli/pull/217))
* topScope now checks if the import already is present
* Updated test errors/issue-5576, remember to sync with webpack/next
* User friendly startup message ([#218](https://github.com/webpack/webpack-cli/pull/218))
* Migrate now uses prettier ([88aaaa2](https://github.com/webpack/webpack-cli/commit/972d4cd90061644aa2f4aaac33d2d80cb4a56d57)
* Added transform for mode ([972d4cd](https://github.com/webpack/webpack-cli/commit/e1f512c9bb96694dd623562dc4cef411ed004c2c)
* Remove recast fork ([fba04da](https://github.com/webpack/webpack-cli/commit/b416d9c50138ef343b8bac6e3f66fdd5b917857d))
* New transforms ([b416d9c](https://github.com/webpack/webpack-cli/commit/28680c944dca0860ca59a38910840a641b418d18))
* JSdocs are added ([47de46a](https://github.com/webpack/webpack-cli/commit/285846a4cb1f976edcdb36629cf247d8017ff956))
* Added serve alias ([#204](https://github.com/webpack/webpack-cli/pull/204))
* Migrate has new validate logic ([c4c68e8](https://github.com/webpack/webpack-cli/commit/5d4430a6a5531cd8084e5a591f7884e746e21b2f))
* webpack serve logic ([5d4430a](https://github.com/webpack/webpack-cli/commit/992bfe2b08b98aebb43c68d5e5a92320ba3e32a8))
* webpack --config-register and webpack -r is added ([1f24d19](https://github.com/webpack/webpack-cli/commit/ab9421136887b7e9e10f25a39b59fb32f07b5037))
* work on makefile generation ([d86e1ce](https://github.com/webpack/webpack-cli/commit/4f9a4f88a8bd113762a54c05b3b9fe6f459855db))
* Appveyor is added ([9b2f6f5](https://github.com/webpack/webpack-cli/commit/c5c97462d6ccfa4c02fd79206fa075815520cd88))
* Remove commit-validate from docs ([#222](https://github.com/webpack/webpack-cli/pull/222))
* Added transform ResolveLoader ([7c713ce](https://github.com/webpack/webpack-cli/commit/3c90e83fa7b8dd5fbecaee5d1b9d8f0279600096))
* Using v8-compile-cache ([7e57314](https://github.com/webpack/webpack-cli/commit/0564ceb77a995239d0be7a022b948cbd727773a4))
* Adds webpack-cli bot ([#224](https://github.com/webpack/webpack-cli/pull/224))

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
