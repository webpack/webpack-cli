<a name="4.0.0-beta.9"></a>

# 4.0.0-beta.9 (2020-09-19)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v4.0.0-beta.2...v4.0.0-beta.9)

## New Features

-   add aliases to all available commands ([#1644](https://github.com/webpack/webpack-cli/pull/1644))
-   generate changelog and copy old CHANGEFILE ([#1805](https://github.com/webpack/webpack-cli/pull/1805))
-   allow using cjs as default config ([#1775](https://github.com/webpack/webpack-cli/pull/1775))
-   add support for merging multiple configurations ([#1768](https://github.com/webpack/webpack-cli/pull/1768))
-   add support to spawn multiple compilers with different configs ([#1765](https://github.com/webpack/webpack-cli/pull/1765))
-   add name flag ([#1757](https://github.com/webpack/webpack-cli/pull/1757))
-   add --config-name flag ([#1753](https://github.com/webpack/webpack-cli/pull/1753))
-   serve integration ([#1712](https://github.com/webpack/webpack-cli/pull/1712))
-   add support for .cjs config ([#1727](https://github.com/webpack/webpack-cli/pull/1727))
-   support multiple env params ([#1715](https://github.com/webpack/webpack-cli/pull/1715))
-   add stats detailed option ([#1359](https://github.com/webpack/webpack-cli/pull/1359))
-   add flag to force config ([f61e7e0](https://github.com/webpack/webpack-cli/commit/f61e7e0))
-   support command aliases with webpack-cli version ([#1664](https://github.com/webpack/webpack-cli/pull/1664))
-   add support for none config in dotfolder ([#1637](https://github.com/webpack/webpack-cli/pull/1637))
-   validate user input ([#1610](https://github.com/webpack/webpack-cli/pull/1610))
-   parse Number flags ([#1652](https://github.com/webpack/webpack-cli/pull/1652))
-   allow multiple types for --stats ([ca2d593](https://github.com/webpack/webpack-cli/commit/ca2d593))
-   show up cli flag aliases with webpack help <arg> ([#1647](https://github.com/webpack/webpack-cli/pull/1647))
-   allow multiple targets ([#1799](https://github.com/webpack/webpack-cli/pull/1799))
-   🎸 add support for env flag ([#1598](https://github.com/webpack/webpack-cli/pull/1598))
-   allow only specified negated flags ([#1613](https://github.com/webpack/webpack-cli/pull/1613))
-   add init to webpack-cli ([#1609](https://github.com/webpack/webpack-cli/pull/1609))
-   webpack-cli: webpack stats ([#1299](https://github.com/webpack/webpack-cli/pull/1299))
-   test case for passing in unknown flags ([#1214](https://github.com/webpack/webpack-cli/pull/1214))
-   webpack-cli: add mode argument validation ([#1290](https://github.com/webpack/webpack-cli/pull/1290))
-   webpack-cli: add --no-stats flag ([#1654](https://github.com/webpack/webpack-cli/pull/1654))
-   webpack-cli: --version for external packages ([#1421](https://github.com/webpack/webpack-cli/pull/1421))
-   webpack-cli: add alias for version ([#1405](https://github.com/webpack/webpack-cli/pull/1405))
-   webpack-cli: import flags from webpack core ([#1630](https://github.com/webpack/webpack-cli/pull/1630))
-   webpack-cli: allow multiple entry files ([#1619](https://github.com/webpack/webpack-cli/pull/1619))
-   webpack-cli: allow negative property for cli-flags ([#1668](https://github.com/webpack/webpack-cli/pull/1668))
-   webpack-cli: add no-mode flag ([#1276](https://github.com/webpack/webpack-cli/pull/1276))
-   webpack-cli: create a cli executer ([#1255](https://github.com/webpack/webpack-cli/pull/1255))
-   webpack-cli: added mode argument ([#1253](https://github.com/webpack/webpack-cli/pull/1253))
-   webpack-cli: add progress bar for progress flag ([#1238](https://github.com/webpack/webpack-cli/pull/1238))
-   webpack-cli: add --no-hot flag ([#1591](https://github.com/webpack/webpack-cli/pull/1591))

## Fix

-   webpack-cli: verbose flag functionality ([#1549](https://github.com/webpack/webpack-cli/pull/1549))
-   ci for webpack@beta.30 ([#1801](https://github.com/webpack/webpack-cli/pull/1801))
-   use compiler.apply for Progress Plugin ([#1772](https://github.com/webpack/webpack-cli/pull/1772))
-   remove yes ([279c43f](https://github.com/webpack/webpack-cli/commit/279c43f))
-   throw err when supplied config is absent ([#1760](https://github.com/webpack/webpack-cli/pull/1760))
-   allow unknown files to use default require as fallback ([#1747](https://github.com/webpack/webpack-cli/pull/1747))
-   use appropriate exit codes ([#1755](https://github.com/webpack/webpack-cli/pull/1755))
-   peer dependencies for `webpack serve` ([#1317](https://github.com/webpack/webpack-cli/pull/1317))
-   yarn.lock conflicts on setup ([#1367](https://github.com/webpack/webpack-cli/pull/1367))
-   conditionally install terser-webpack-plugin for webpack@next ([#1732](https://github.com/webpack/webpack-cli/pull/1732))
-   generated loader template ([#1720](https://github.com/webpack/webpack-cli/pull/1720))
-   supply argv to config with functions ([#1721](https://github.com/webpack/webpack-cli/pull/1721))
-   rename sourcemap flag to devtool ([#1723](https://github.com/webpack/webpack-cli/pull/1723))
-   generated plugin template ([#1717](https://github.com/webpack/webpack-cli/pull/1717))
-   warn about merge config resolution cases ([#1674](https://github.com/webpack/webpack-cli/pull/1674))
-   use fileTypes from interpret ([#1690](https://github.com/webpack/webpack-cli/pull/1690))
-   set mode=production by default ([#1688](https://github.com/webpack/webpack-cli/pull/1688))
-   promise support in config ([#1666](https://github.com/webpack/webpack-cli/pull/1666))
-   show version information for plugin and loader ([#1661](https://github.com/webpack/webpack-cli/pull/1661))
-   prevent info from running unnecessarily ([#1650](https://github.com/webpack/webpack-cli/pull/1650))
-   json flag, enable tests ([#1460](https://github.com/webpack/webpack-cli/pull/1460))
-   consistent webpack plugin name ([#1480](https://github.com/webpack/webpack-cli/pull/1480))
-   typo in Compiler.js ([#1580](https://github.com/webpack/webpack-cli/pull/1580))
-   🐛 do not apply own defaults while setting mode ([#1565](https://github.com/webpack/webpack-cli/pull/1565))
-   compatibility with webpack@next ([#1779](https://github.com/webpack/webpack-cli/pull/1779))
-   throw error for invalid args ([#1462](https://github.com/webpack/webpack-cli/pull/1462))
-   regression with migrate command ([7ebcbb8](https://github.com/webpack/webpack-cli/commit/7ebcbb8))
-   generators: fix generators init loader's test regex ([#1309](https://github.com/webpack/webpack-cli/pull/1309))
-   release beta ([f1f05d8](https://github.com/webpack/webpack-cli/commit/f1f05d8))
-   cli: fix file resolution inside group helper ([#1221](https://github.com/webpack/webpack-cli/pull/1221))
-   generators: fix and refactor entry util, add tests ([#1392](https://github.com/webpack/webpack-cli/pull/1392))
-   generators: fix small issues with generators ([#1385](https://github.com/webpack/webpack-cli/pull/1385))
-   info: throw an error if help or version is passed as an arg ([#1737](https://github.com/webpack/webpack-cli/pull/1737))
-   init: fix the invalid package name ([#1228](https://github.com/webpack/webpack-cli/pull/1228))
-   init: fix webpack config scaffold ([#1231](https://github.com/webpack/webpack-cli/pull/1231))
-   packages: make packages have correct main paths to index ([#1366](https://github.com/webpack/webpack-cli/pull/1366))
-   serve: merge CLI and devServer options correctly ([#1649](https://github.com/webpack/webpack-cli/pull/1649))
-   serve: supplying help or version as an arg should throw error ([#1694](https://github.com/webpack/webpack-cli/pull/1694))
-   utils: respect package-lock.json ([#1375](https://github.com/webpack/webpack-cli/pull/1375))
-   webpack-cli: to void defaultEntry override the webpack config entry ([#1289](https://github.com/webpack/webpack-cli/pull/1289))
-   webpack-cli: add configuration for mode option none ([#1303](https://github.com/webpack/webpack-cli/pull/1303))
-   webpack-cli: handle promise rejection with package installation ([#1284](https://github.com/webpack/webpack-cli/pull/1284))
-   webpack-cli: correct cli-flags usage ([#1441](https://github.com/webpack/webpack-cli/pull/1441))
-   webpack-cli: fixed support for SCSS entry points ([#1271](https://github.com/webpack/webpack-cli/pull/1271))
-   webpack-cli: handle promise rejection happening with cli-executor ([#1269](https://github.com/webpack/webpack-cli/pull/1269))
-   webpack-cli: prefer import local ([#1345](https://github.com/webpack/webpack-cli/pull/1345))
-   webpack-cli: remove invalid stats warning with json flag ([#1587](https://github.com/webpack/webpack-cli/pull/1587))
-   webpack-cli: add value none in mode usage ([#1411](https://github.com/webpack/webpack-cli/pull/1411))
-   webpack-cli: prefetch flag implementation ([#1583](https://github.com/webpack/webpack-cli/pull/1583))

## Perf

-   do not spawn new process for running webpack ([#1741](https://github.com/webpack/webpack-cli/pull/1741))

## Refactor

-   remove --dev and --prod flags ([#1693](https://github.com/webpack/webpack-cli/pull/1693))
-   remove duplicate invocation ([#1790](https://github.com/webpack/webpack-cli/pull/1790))
-   cliExecuter consumes runCLI ([#1754](https://github.com/webpack/webpack-cli/pull/1754))
-   remove --mode flag validation ([#1744](https://github.com/webpack/webpack-cli/pull/1744))
-   use console for logging ([#1740](https://github.com/webpack/webpack-cli/pull/1740))
-   use logger ([#1748](https://github.com/webpack/webpack-cli/pull/1748))
-   remove stale code ([#1670](https://github.com/webpack/webpack-cli/pull/1670))
-   remove plugin flag ([#1571](https://github.com/webpack/webpack-cli/pull/1571))
-   💡 remove defaults flag ([#1543](https://github.com/webpack/webpack-cli/pull/1543))
-   refactor info package ([#1382](https://github.com/webpack/webpack-cli/pull/1382))
-   webpack-cli: remove --no-mode flag ([#1503](https://github.com/webpack/webpack-cli/pull/1503))

## Misc

-   feat[utils]: opt to use config schema from core ([#1655](https://github.com/webpack/webpack-cli/pull/1655))
-   migrate to commander ([#1481](https://github.com/webpack/webpack-cli/pull/1481))
-   Fix loader-generator and plugin-generator tests ([#1250](https://github.com/webpack/webpack-cli/pull/1250))
-   Fixing the typos and grammatical errors in Readme files ([#1246](https://github.com/webpack/webpack-cli/pull/1246))
-   remove code: remove unused code ([#1800](https://github.com/webpack/webpack-cli/pull/1800))

<a name="3.3.12"></a>

# 3.3.12 (2020-06-03)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.11...v3.3.12)

<a name="3.3.11"></a>

# 3.3.11 (2020-02-11)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.10...v3.3.11)

<a name="3.3.10"></a>

# 3.3.10 (2019-10-31)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.9...v3.3.10)

## New Features

-   add new flag and patch sec dep ([#1102](https://github.com/webpack/webpack-cli/pull/1102))

<a name="3.3.9"></a>

# 3.3.9 (2019-09-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.8...v3.3.9)

## Fix

-   use process.exitCode instead of process.exit in compilerCallback ([ee001bd](https://github.com/webpack/webpack-cli/commit/ee001bd))

<a name="3.3.8"></a>

# 3.3.8 (2019-09-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.7...v3.3.8)

## Fix

-   support both webpack versions ([d28f9f5](https://github.com/webpack/webpack-cli/commit/d28f9f5))

## Tests

-   add schema tests ([70bf934](https://github.com/webpack/webpack-cli/commit/70bf934))

<a name="3.3.7"></a>

# 3.3.7 (2019-08-18)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.6...v3.3.7)

## Fix

-   resolve opts when no-config ([fb31cc4](https://github.com/webpack/webpack-cli/commit/fb31cc4))

<a name="3.3.6"></a>

# 3.3.6 (2019-07-14)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.5...v3.3.6)

## Docs

-   remove deprecated packages description ([#979](https://github.com/webpack/webpack-cli/pull/979))

## Fix

-   minor refactor ([a30a027](https://github.com/webpack/webpack-cli/commit/a30a027))
-   update comments ([7553ae7](https://github.com/webpack/webpack-cli/commit/7553ae7))
-   minor fix ([0d9aa9a](https://github.com/webpack/webpack-cli/commit/0d9aa9a))

<a name="3.3.5"></a>

# 3.3.5 (2019-06-23)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.4...v3.3.5)

## CLI

-   remove donation prompt ([a37477d](https://github.com/webpack/webpack-cli/commit/a37477d))

## Fix

-   deps: move prettier from dependencies to devDependencies ([#968](https://github.com/webpack/webpack-cli/pull/968))
-   change "usr strict" to "use strict" ([670efc7](https://github.com/webpack/webpack-cli/commit/670efc7))
-   update deps ([69f364e](https://github.com/webpack/webpack-cli/commit/69f364e))

<a name="3.3.4"></a>

# 3.3.4 (2019-06-11)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/3.3.3...3.3.4)

## New Features

-   add workbox + offline support ([589253e](https://github.com/webpack/webpack-cli/commit/589253e))
-   better defaults ([77bf564](https://github.com/webpack/webpack-cli/commit/77bf564))

## Docs

-   added auto flag in docs for init command ([dede7d8](https://github.com/webpack/webpack-cli/commit/dede7d8))

## Fix

-   module not found error ([a2062f2](https://github.com/webpack/webpack-cli/commit/a2062f2))
-   remove unused pkgs and refactor init generator ([7608d4b](https://github.com/webpack/webpack-cli/commit/7608d4b))

## Tests

-   fix failing ones ([d154d0e](https://github.com/webpack/webpack-cli/commit/d154d0e))

## Misc

-   finetune 0cjs ([bd2cd86](https://github.com/webpack/webpack-cli/commit/bd2cd86))
-   improve cjs ([60ecc02](https://github.com/webpack/webpack-cli/commit/60ecc02))

<a name="3.3.3"></a>

# 3.3.3 (2019-06-07)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.3.2...v3.3.3)

## New Features

-   chore: Added type definitions for the data returned by envinfo ([#921](https://github.com/webpack/webpack-cli/pull/921))
-   add htmlWebpackPlugin in development ([88fcfa8](https://github.com/webpack/webpack-cli/commit/88fcfa8))
-   add mergeHandler ([248b9cc](https://github.com/webpack/webpack-cli/commit/248b9cc))
-   generators: add generated file templates ([6be9291](https://github.com/webpack/webpack-cli/commit/6be9291))
-   init: generate README ([c090b17](https://github.com/webpack/webpack-cli/commit/c090b17))
-   init: generate tsconfig ([25ab7e6](https://github.com/webpack/webpack-cli/commit/25ab7e6))
-   init: support ts in configuration ([283e089](https://github.com/webpack/webpack-cli/commit/283e089))
-   init: wip typescript support ([093a36d](https://github.com/webpack/webpack-cli/commit/093a36d))
-   md: formats md before committing ([#851](https://github.com/webpack/webpack-cli/pull/851))
-   webpack-scaffold: adds Input defaults, doc & tests ([0a648f7](https://github.com/webpack/webpack-cli/commit/0a648f7))

## CLI

-   fix watch options for array config ([#892](https://github.com/webpack/webpack-cli/pull/892))

## Docs

-   contribute: adds section seperator ([cff0c55](https://github.com/webpack/webpack-cli/commit/cff0c55))
-   contribute: combines seperate sections for npm and yarn ([aefa8eb](https://github.com/webpack/webpack-cli/commit/aefa8eb))
-   contributing: updates the docs for the test ([7656637](https://github.com/webpack/webpack-cli/commit/7656637))
-   fix link to webpack-scaffold ([de0b4a0](https://github.com/webpack/webpack-cli/commit/de0b4a0))
-   init: improve description ([9856bab](https://github.com/webpack/webpack-cli/commit/9856bab))
-   utils: update prettier ([8b6d47b](https://github.com/webpack/webpack-cli/commit/8b6d47b))

## Fix

-   improve checking file permission ([de41351](https://github.com/webpack/webpack-cli/commit/de41351))
-   chore: Minor fix ([6810182](https://github.com/webpack/webpack-cli/commit/6810182))
-   use fork cause original repo is unmaintained ([383125a](https://github.com/webpack/webpack-cli/commit/383125a))
-   add: apply suggestions ([ccf0dce](https://github.com/webpack/webpack-cli/commit/ccf0dce))
-   add: add handling of merge option ([eb43443](https://github.com/webpack/webpack-cli/commit/eb43443))
-   add: add handling of merge option ([ce51a0a](https://github.com/webpack/webpack-cli/commit/ce51a0a))
-   ci: fixes linting error in ci ([cfc0117](https://github.com/webpack/webpack-cli/commit/cfc0117))
-   cli: updates err message ([b5e1913](https://github.com/webpack/webpack-cli/commit/b5e1913))
-   cli: removes the comment before err handling block ([ac5a53f](https://github.com/webpack/webpack-cli/commit/ac5a53f))
-   cli: --config-register resolves relative to root ([23375bd](https://github.com/webpack/webpack-cli/commit/23375bd))
-   cli: removes func return in catch instance ([7d31321](https://github.com/webpack/webpack-cli/commit/7d31321))
-   cli: sets stack trace limit ([869024f](https://github.com/webpack/webpack-cli/commit/869024f))
-   cli: err when no args passed, refactored nested conditional blocks ([a9bc0bd](https://github.com/webpack/webpack-cli/commit/a9bc0bd))
-   cli: shows error message based on package manager ([a3ce273](https://github.com/webpack/webpack-cli/commit/a3ce273))
-   cli: error when no webpack and args found ([2250af0](https://github.com/webpack/webpack-cli/commit/2250af0))
-   generator: fixed the support of native plugins in add command ([123a150](https://github.com/webpack/webpack-cli/commit/123a150))
-   infra: fixes npm run docs ([65c08e2](https://github.com/webpack/webpack-cli/commit/65c08e2))
-   formatting files ([eb3909b](https://github.com/webpack/webpack-cli/commit/eb3909b))
-   remove type from inherited type ([960e73a](https://github.com/webpack/webpack-cli/commit/960e73a))
-   remove type from inherited type ([0552f76](https://github.com/webpack/webpack-cli/commit/0552f76))
-   change parser options ([4e8bc76](https://github.com/webpack/webpack-cli/commit/4e8bc76))
-   json module resolve ([61697b8](https://github.com/webpack/webpack-cli/commit/61697b8))
-   cli: improves error handling with args ([cc64955](https://github.com/webpack/webpack-cli/commit/cc64955))
-   generator: generate correct module.rule for babel & ts ([263b83c](https://github.com/webpack/webpack-cli/commit/263b83c))
-   generator: using configFile in configPath to get the config file name ([#883](https://github.com/webpack/webpack-cli/pull/883))
-   genrators/utils/style: typo & fix ([f46f4e5](https://github.com/webpack/webpack-cli/commit/f46f4e5))

## Misc

-   update internal docs ([7071b5c](https://github.com/webpack/webpack-cli/commit/7071b5c))
-   add lerna publish cmnd ([5c8c6a1](https://github.com/webpack/webpack-cli/commit/5c8c6a1))
-   generators: remove comment ([bd06a69](https://github.com/webpack/webpack-cli/commit/bd06a69))
-   generators: refactor ([376dcbd](https://github.com/webpack/webpack-cli/commit/376dcbd))
-   generators: small text improvements ([782f56c](https://github.com/webpack/webpack-cli/commit/782f56c))
-   generators: improve prompts ([ac35a31](https://github.com/webpack/webpack-cli/commit/ac35a31))
-   generators: refactor init-generator ([d574846](https://github.com/webpack/webpack-cli/commit/d574846))
-   generators: refactor utils ([17e4511](https://github.com/webpack/webpack-cli/commit/17e4511))
-   generators/utils/style: refactor ([392fcfe](https://github.com/webpack/webpack-cli/commit/392fcfe))
-   init: refactor with async/await ([1b07d2b](https://github.com/webpack/webpack-cli/commit/1b07d2b))
-   init: small refactor ([4627ea1](https://github.com/webpack/webpack-cli/commit/4627ea1))
-   init-generator: improve readme ([f971632](https://github.com/webpack/webpack-cli/commit/f971632))
-   init-generator: small refactor ([dcf44c1](https://github.com/webpack/webpack-cli/commit/dcf44c1))
-   init-generator: use webpackOption types, improve test rules ([a650e0e](https://github.com/webpack/webpack-cli/commit/a650e0e))
-   init-generator: improve types & defaults ([fb23aa4](https://github.com/webpack/webpack-cli/commit/fb23aa4))
-   packages: complete rebase ([488b06c](https://github.com/webpack/webpack-cli/commit/488b06c))
-   types: correct types ([85ef3e7](https://github.com/webpack/webpack-cli/commit/85ef3e7))

<a name="3.3.2"></a>

# 3.3.2 (2019-05-04)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.5...v3.3.2)

## New Features

-   opencollective prompt: add option to disable it + doc ([d4643ae](https://github.com/webpack/webpack-cli/commit/d4643ae))
-   terser: clean old files ([89e6b74](https://github.com/webpack/webpack-cli/commit/89e6b74))
-   terser: remove leftover files ([27d5b4d](https://github.com/webpack/webpack-cli/commit/27d5b4d))
-   terser: replace after merging master ([c404655](https://github.com/webpack/webpack-cli/commit/c404655))
-   replace Uglify with Terser in generators ([2b8651b](https://github.com/webpack/webpack-cli/commit/2b8651b))
-   use terserPlugin in loaderOptionsPlugin ([14f5337](https://github.com/webpack/webpack-cli/commit/14f5337))
-   use terserJsPlugin for transformations during migrate ([33c6185](https://github.com/webpack/webpack-cli/commit/33c6185))
-   replace uglifyJsPlugin with terserPlugin in migrate ([d467f3b](https://github.com/webpack/webpack-cli/commit/d467f3b))
-   opencollective prompt: work on windows setting atime by code ([3af73a8](https://github.com/webpack/webpack-cli/commit/3af73a8))
-   opencollective prompt: fix typo ([c2351b1](https://github.com/webpack/webpack-cli/commit/c2351b1))
-   opencollective prompt: remove .lastocprint file from fs ([b96ad56](https://github.com/webpack/webpack-cli/commit/b96ad56))
-   opencollective prompt: extract weekday to variable ([790d27a](https://github.com/webpack/webpack-cli/commit/790d27a))
-   opencollective prompt: set terminal cols to 80 ([badc32d](https://github.com/webpack/webpack-cli/commit/badc32d))
-   opencollective prompt: fix azure ci ([ea0039a](https://github.com/webpack/webpack-cli/commit/ea0039a))
-   opencollective prompt: lint ([ea906d8](https://github.com/webpack/webpack-cli/commit/ea906d8))
-   opencollective prompt: clear package.json modifications ([f080733](https://github.com/webpack/webpack-cli/commit/f080733))
-   opencollective prompt: add prompt in postinstall script ([dd9d528](https://github.com/webpack/webpack-cli/commit/dd9d528))

## Ast

-   change tooltip property from uglify to terser ([ea9e4b8](https://github.com/webpack/webpack-cli/commit/ea9e4b8))
-   replace requires and inits for uglify with terser ([3011a6c](https://github.com/webpack/webpack-cli/commit/3011a6c))
-   replace UglifyJsPlugin with TerserPlugin ([21da35f](https://github.com/webpack/webpack-cli/commit/21da35f))

## Docs

-   code of conduct ([#873](https://github.com/webpack/webpack-cli/pull/873))
-   contribute: adds table of contents and info about dependencies. ([#842](https://github.com/webpack/webpack-cli/pull/842))
-   contributing: fixes dead link ([#835](https://github.com/webpack/webpack-cli/pull/835))
-   opencollective prompt: improve code clarity ([55992a4](https://github.com/webpack/webpack-cli/commit/55992a4))
-   packages: adds downloads/month shield ([6a0375a](https://github.com/webpack/webpack-cli/commit/6a0375a))
-   readme: fix typos, add summary of all commands ([#845](https://github.com/webpack/webpack-cli/pull/845))
-   readme: adds contributors shield ([958d064](https://github.com/webpack/webpack-cli/commit/958d064))
-   README: phrase change ([3a11a16](https://github.com/webpack/webpack-cli/commit/3a11a16))
-   README: add link to webpack-scaffold-starter ([e35a194](https://github.com/webpack/webpack-cli/commit/e35a194))
-   README: update scaffolding links ([74179b5](https://github.com/webpack/webpack-cli/commit/74179b5))
-   serve: link to webpack-dev-server ([cb68b1b](https://github.com/webpack/webpack-cli/commit/cb68b1b))
-   serve: update docs to use webpack-dev-server ([f7451d4](https://github.com/webpack/webpack-cli/commit/f7451d4))
-   replace tooltip link to terser plugin ([4254730](https://github.com/webpack/webpack-cli/commit/4254730))
-   replace Uglify with Terser in comments ([799577d](https://github.com/webpack/webpack-cli/commit/799577d))
-   replace UglifyJsPlugin with TerserPlugin in migrate docs ([326f783](https://github.com/webpack/webpack-cli/commit/326f783))

## Enh

-   webpack-scaffold: improve prompt and doc ([#794](https://github.com/webpack/webpack-cli/pull/794))

## Fix

-   add: add types ([d4ce6f2](https://github.com/webpack/webpack-cli/commit/d4ce6f2))
-   add: fix runTransform ([dbc3e9e](https://github.com/webpack/webpack-cli/commit/dbc3e9e))
-   add: lint code ([163b309](https://github.com/webpack/webpack-cli/commit/163b309))
-   add: add handling for topScope ([1162cf5](https://github.com/webpack/webpack-cli/commit/1162cf5))
-   bin, serve: force default package export, add serve default ([#815](https://github.com/webpack/webpack-cli/pull/815))
-   init: refactored the init.ts success message ([#810](https://github.com/webpack/webpack-cli/pull/810))
-   opencollective prompt: fix grammar ([246db42](https://github.com/webpack/webpack-cli/commit/246db42))
-   opencollective-prompt: check write permissions ([5284b7e](https://github.com/webpack/webpack-cli/commit/5284b7e))
-   scaffold: config file is always generated at the project root ([#801](https://github.com/webpack/webpack-cli/pull/801))
-   utils: refactors utils ([7fe3543](https://github.com/webpack/webpack-cli/commit/7fe3543))
-   clear up comment about default function purpose ([e48507d](https://github.com/webpack/webpack-cli/commit/e48507d))
-   remove unused files ([ec242ab](https://github.com/webpack/webpack-cli/commit/ec242ab))
-   reset files ([9863445](https://github.com/webpack/webpack-cli/commit/9863445))
-   replace lookups for TerserPlugin in webpack.optimise ([ef23fec](https://github.com/webpack/webpack-cli/commit/ef23fec))

## Misc

-   chore(docs): Refactors links for badges ([#859](https://github.com/webpack/webpack-cli/pull/859))
-   opencollective-prompt: improve grammar ([e17a26d](https://github.com/webpack/webpack-cli/commit/e17a26d))
-   Remove tslint in favour of eslint ([#834](https://github.com/webpack/webpack-cli/pull/834))
-   cli: refactor functions into utils and config dirs, merge yargs options ([#781](https://github.com/webpack/webpack-cli/pull/781))
-   utils: refactors scaffold ([0b28fb3](https://github.com/webpack/webpack-cli/commit/0b28fb3))

<a name="3.3.1"></a>

# 3.3.1 (2019-04-21)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.5...v3.3.1)

## New Features

-   terser: clean old files ([89e6b74](https://github.com/webpack/webpack-cli/commit/89e6b74))
-   terser: remove leftover files ([27d5b4d](https://github.com/webpack/webpack-cli/commit/27d5b4d))
-   terser: replace after merging master ([c404655](https://github.com/webpack/webpack-cli/commit/c404655))
-   replace Uglify with Terser in generators ([2b8651b](https://github.com/webpack/webpack-cli/commit/2b8651b))
-   use terserPlugin in loaderOptionsPlugin ([14f5337](https://github.com/webpack/webpack-cli/commit/14f5337))
-   use terserJsPlugin for transformations during migrate ([33c6185](https://github.com/webpack/webpack-cli/commit/33c6185))
-   replace uglifyJsPlugin with terserPlugin in migrate ([d467f3b](https://github.com/webpack/webpack-cli/commit/d467f3b))
-   opencollective prompt: work on windows setting atime by code ([3af73a8](https://github.com/webpack/webpack-cli/commit/3af73a8))
-   opencollective prompt: fix typo ([c2351b1](https://github.com/webpack/webpack-cli/commit/c2351b1))
-   opencollective prompt: remove .lastocprint file from fs ([b96ad56](https://github.com/webpack/webpack-cli/commit/b96ad56))
-   opencollective prompt: extract weekday to variable ([790d27a](https://github.com/webpack/webpack-cli/commit/790d27a))
-   opencollective prompt: set terminal cols to 80 ([badc32d](https://github.com/webpack/webpack-cli/commit/badc32d))
-   opencollective prompt: fix azure ci ([ea0039a](https://github.com/webpack/webpack-cli/commit/ea0039a))
-   opencollective prompt: lint ([ea906d8](https://github.com/webpack/webpack-cli/commit/ea906d8))
-   opencollective prompt: clear package.json modifications ([f080733](https://github.com/webpack/webpack-cli/commit/f080733))
-   opencollective prompt: add prompt in postinstall script ([dd9d528](https://github.com/webpack/webpack-cli/commit/dd9d528))

## Ast

-   change tooltip property from uglify to terser ([ea9e4b8](https://github.com/webpack/webpack-cli/commit/ea9e4b8))
-   replace requires and inits for uglify with terser ([3011a6c](https://github.com/webpack/webpack-cli/commit/3011a6c))
-   replace UglifyJsPlugin with TerserPlugin ([21da35f](https://github.com/webpack/webpack-cli/commit/21da35f))

## Docs

-   contributing: fixes dead link ([#835](https://github.com/webpack/webpack-cli/pull/835))
-   opencollective prompt: improve code clarity ([55992a4](https://github.com/webpack/webpack-cli/commit/55992a4))
-   packages: adds downloads/month shield ([6a0375a](https://github.com/webpack/webpack-cli/commit/6a0375a))
-   readme: adds contributors shield ([958d064](https://github.com/webpack/webpack-cli/commit/958d064))
-   README: phrase change ([3a11a16](https://github.com/webpack/webpack-cli/commit/3a11a16))
-   README: add link to webpack-scaffold-starter ([e35a194](https://github.com/webpack/webpack-cli/commit/e35a194))
-   README: update scaffolding links ([74179b5](https://github.com/webpack/webpack-cli/commit/74179b5))
-   serve: link to webpack-dev-server ([cb68b1b](https://github.com/webpack/webpack-cli/commit/cb68b1b))
-   serve: update docs to use webpack-dev-server ([f7451d4](https://github.com/webpack/webpack-cli/commit/f7451d4))
-   replace tooltip link to terser plugin ([4254730](https://github.com/webpack/webpack-cli/commit/4254730))
-   replace Uglify with Terser in comments ([799577d](https://github.com/webpack/webpack-cli/commit/799577d))
-   replace UglifyJsPlugin with TerserPlugin in migrate docs ([326f783](https://github.com/webpack/webpack-cli/commit/326f783))

## Enh

-   webpack-scaffold: improve prompt and doc ([#794](https://github.com/webpack/webpack-cli/pull/794))

## Fix

-   add: add types ([d4ce6f2](https://github.com/webpack/webpack-cli/commit/d4ce6f2))
-   add: fix runTransform ([dbc3e9e](https://github.com/webpack/webpack-cli/commit/dbc3e9e))
-   add: lint code ([163b309](https://github.com/webpack/webpack-cli/commit/163b309))
-   add: add handling for topScope ([1162cf5](https://github.com/webpack/webpack-cli/commit/1162cf5))
-   bin, serve: force default package export, add serve default ([#815](https://github.com/webpack/webpack-cli/pull/815))
-   init: refactored the init.ts success message ([#810](https://github.com/webpack/webpack-cli/pull/810))
-   scaffold: config file is always generated at the project root ([#801](https://github.com/webpack/webpack-cli/pull/801))
-   utils: refactors utils ([7fe3543](https://github.com/webpack/webpack-cli/commit/7fe3543))
-   clear up comment about default function purpose ([e48507d](https://github.com/webpack/webpack-cli/commit/e48507d))
-   remove unused files ([ec242ab](https://github.com/webpack/webpack-cli/commit/ec242ab))
-   reset files ([9863445](https://github.com/webpack/webpack-cli/commit/9863445))
-   replace lookups for TerserPlugin in webpack.optimise ([ef23fec](https://github.com/webpack/webpack-cli/commit/ef23fec))

## Misc

-   Remove tslint in favour of eslint ([#834](https://github.com/webpack/webpack-cli/pull/834))
-   cli: refactor functions into utils and config dirs, merge yargs options ([#781](https://github.com/webpack/webpack-cli/pull/781))
-   utils: refactors scaffold ([0b28fb3](https://github.com/webpack/webpack-cli/commit/0b28fb3))

<a name="3.3.0"></a>

# 3.3.0 (2019-03-15)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.3...v3.3.0)

## New Features

-   use webpack.config as default name in dev scaffold ([385a672](https://github.com/webpack/webpack-cli/commit/385a672))
-   only display once a week ([b6199e5](https://github.com/webpack/webpack-cli/commit/b6199e5))
-   add util to run-and-get watch proc ([1d2ccd5](https://github.com/webpack/webpack-cli/commit/1d2ccd5))
-   add test-util to append data to file ([e9e1dcb](https://github.com/webpack/webpack-cli/commit/e9e1dcb))
-   log: clean single line logs ([5d2284b](https://github.com/webpack/webpack-cli/commit/5d2284b))
-   log: add gitignore ([7c830b5](https://github.com/webpack/webpack-cli/commit/7c830b5))
-   log: make log package ([df7c224](https://github.com/webpack/webpack-cli/commit/df7c224))
-   log: add clrscr function ([11b3bff](https://github.com/webpack/webpack-cli/commit/11b3bff))
-   log: few changes ([bc32727](https://github.com/webpack/webpack-cli/commit/bc32727))
-   log: add newline for title ([4047213](https://github.com/webpack/webpack-cli/commit/4047213))
-   log: remove unwanted commits ([c088f3e](https://github.com/webpack/webpack-cli/commit/c088f3e))
-   log: task based custom loggers ([2c43a41](https://github.com/webpack/webpack-cli/commit/2c43a41))

## Docs

-   scaffolding: lowercase Webpack ([d19c1f7](https://github.com/webpack/webpack-cli/commit/d19c1f7))
-   scaffolding: fix typos ([b94b0de](https://github.com/webpack/webpack-cli/commit/b94b0de))
-   scaffolding: improve grammar ([6b79072](https://github.com/webpack/webpack-cli/commit/6b79072))
-   add lerna badge in README ([#786](https://github.com/webpack/webpack-cli/pull/786))
-   contributing: refactor & formatting ([1042cb2](https://github.com/webpack/webpack-cli/commit/1042cb2))
-   contributing: improve formatting ([47fcd7f](https://github.com/webpack/webpack-cli/commit/47fcd7f))
-   contributing: : at the end of paragraphs ([48d65fd](https://github.com/webpack/webpack-cli/commit/48d65fd))
-   contributing: update instructions to run individual tests ([b7cca58](https://github.com/webpack/webpack-cli/commit/b7cca58))
-   contributing: update instructions to run individual tests ([bc0297a](https://github.com/webpack/webpack-cli/commit/bc0297a))
-   contributing: add yarn before running jest ([126cf55](https://github.com/webpack/webpack-cli/commit/126cf55))
-   contributing: commands to install jest globally ([18b7c2e](https://github.com/webpack/webpack-cli/commit/18b7c2e))
-   contributing: fixes typo ([c458380](https://github.com/webpack/webpack-cli/commit/c458380))
-   contributing: improves formatting ([abac823](https://github.com/webpack/webpack-cli/commit/abac823))
-   contributing: adds prebuild instructions ([81cb46a](https://github.com/webpack/webpack-cli/commit/81cb46a))
-   readme: add downloads badge ([dc2423c](https://github.com/webpack/webpack-cli/commit/dc2423c))
-   scaffold: add link option for local ([f8424be](https://github.com/webpack/webpack-cli/commit/f8424be))
-   scaffold: Add installation guide for packages/webpack-scaffold ([#727](https://github.com/webpack/webpack-cli/pull/727))
-   scaffolding: fix typo ([98818a1](https://github.com/webpack/webpack-cli/commit/98818a1))
-   scaffolding: improve description & formatting ([0f657d0](https://github.com/webpack/webpack-cli/commit/0f657d0))
-   scaffolding: fix links ([e11c524](https://github.com/webpack/webpack-cli/commit/e11c524))
-   scaffolding: add yarn example ([d47eea0](https://github.com/webpack/webpack-cli/commit/d47eea0))
-   scaffolding: fix typo ([87ba169](https://github.com/webpack/webpack-cli/commit/87ba169))
-   scaffolding: improved structure, formatting, typos ([8949f82](https://github.com/webpack/webpack-cli/commit/8949f82))
-   init documentaion ([4b130bb](https://github.com/webpack/webpack-cli/commit/4b130bb))
-   rename Webpack to webpack ([900c13e](https://github.com/webpack/webpack-cli/commit/900c13e))
-   init documentaion ([14d2b47](https://github.com/webpack/webpack-cli/commit/14d2b47))

## Fix

-   bin: use compiler.close API correctly for stats ([568161d](https://github.com/webpack/webpack-cli/commit/568161d))
-   bin: extension detection ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   init: lint code ([20aab48](https://github.com/webpack/webpack-cli/commit/20aab48))
-   init: support global installation ([1cb0166](https://github.com/webpack/webpack-cli/commit/1cb0166))
-   init: revert to local installation ([48b3b23](https://github.com/webpack/webpack-cli/commit/48b3b23))
-   init: update prompt command ([c1c0739](https://github.com/webpack/webpack-cli/commit/c1c0739))
-   init: update prompt command ([1cab3cb](https://github.com/webpack/webpack-cli/commit/1cab3cb))
-   readme: remove old dependency status link ([4df0000](https://github.com/webpack/webpack-cli/commit/4df0000))
-   readme: add fallback badge for dependency status ([0e3753b](https://github.com/webpack/webpack-cli/commit/0e3753b))
-   tests: remove snapshot for static compilation ([54a3ac4](https://github.com/webpack/webpack-cli/commit/54a3ac4))
-   tests: remove snapshot for static compilation ([3af0948](https://github.com/webpack/webpack-cli/commit/3af0948))
-   tests: update jest ([d195774](https://github.com/webpack/webpack-cli/commit/d195774))
-   close compiler, own sh script and output clearing ([6ded275](https://github.com/webpack/webpack-cli/commit/6ded275))
-   failing test ([88888bb](https://github.com/webpack/webpack-cli/commit/88888bb))
-   failing test ([986472a](https://github.com/webpack/webpack-cli/commit/986472a))
-   test: fix travis ts build ([22d3acc](https://github.com/webpack/webpack-cli/commit/22d3acc))

## Misc

-   Correction of the webpack-merge configuration ([2ed8c60](https://github.com/webpack/webpack-cli/commit/2ed8c60))
-   replace opencollective with light vers ([848bf4b](https://github.com/webpack/webpack-cli/commit/848bf4b))

<a name="3.2.2"></a>

# 3.2.2 (2019-02-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.3...v3.2.2)

## New Features

-   only display once a week ([b6199e5](https://github.com/webpack/webpack-cli/commit/b6199e5))
-   add util to run-and-get watch proc ([1d2ccd5](https://github.com/webpack/webpack-cli/commit/1d2ccd5))
-   add test-util to append data to file ([e9e1dcb](https://github.com/webpack/webpack-cli/commit/e9e1dcb))
-   log: clean single line logs ([5d2284b](https://github.com/webpack/webpack-cli/commit/5d2284b))
-   log: add gitignore ([7c830b5](https://github.com/webpack/webpack-cli/commit/7c830b5))
-   log: make log package ([df7c224](https://github.com/webpack/webpack-cli/commit/df7c224))
-   log: add clrscr function ([11b3bff](https://github.com/webpack/webpack-cli/commit/11b3bff))
-   log: few changes ([bc32727](https://github.com/webpack/webpack-cli/commit/bc32727))
-   log: add newline for title ([4047213](https://github.com/webpack/webpack-cli/commit/4047213))
-   log: remove unwanted commits ([c088f3e](https://github.com/webpack/webpack-cli/commit/c088f3e))
-   log: task based custom loggers ([2c43a41](https://github.com/webpack/webpack-cli/commit/2c43a41))

## Docs

-   init documentaion ([14d2b47](https://github.com/webpack/webpack-cli/commit/14d2b47))
-   scaffold: Add installation guide for packages/webpack-scaffold ([#727](https://github.com/webpack/webpack-cli/pull/727))

## Fix

-   close compiler, own sh script and output clearing ([6ded275](https://github.com/webpack/webpack-cli/commit/6ded275))
-   bin: extension detection ([#724](https://github.com/webpack/webpack-cli/pull/724))
-   readme: remove old dependency status link ([4df0000](https://github.com/webpack/webpack-cli/commit/4df0000))
-   readme: add fallback badge for dependency status ([0e3753b](https://github.com/webpack/webpack-cli/commit/0e3753b))
-   failing test ([88888bb](https://github.com/webpack/webpack-cli/commit/88888bb))
-   test: fix travis ts build ([22d3acc](https://github.com/webpack/webpack-cli/commit/22d3acc))

## Misc

-   Correction of the webpack-merge configuration ([2ed8c60](https://github.com/webpack/webpack-cli/commit/2ed8c60))
-   replace opencollective with light vers ([848bf4b](https://github.com/webpack/webpack-cli/commit/848bf4b))

<a name="3.1.2"></a>

# 3.1.2 (2018-09-29)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.1.1...v3.1.2)

## Docs

-   init: update headers ([dc4ded9](https://github.com/webpack/webpack-cli/commit/dc4ded9))
-   init: update init documentation ([2ccf9a9](https://github.com/webpack/webpack-cli/commit/2ccf9a9))
-   readme: update webpack-cli to webpack CLI ([f3a225a](https://github.com/webpack/webpack-cli/commit/f3a225a))
-   readme: change addons to scaffolds ([747aef9](https://github.com/webpack/webpack-cli/commit/747aef9))
-   readme: update links ([f8187f1](https://github.com/webpack/webpack-cli/commit/f8187f1))
-   readme: update README.md ([#614](https://github.com/webpack/webpack-cli/pull/614))
-   readme: update Readme based on feedback ([da05c2f](https://github.com/webpack/webpack-cli/commit/da05c2f))

## Fix

-   tapable: fix hook options ([9aed0dc](https://github.com/webpack/webpack-cli/commit/9aed0dc))
-   replace test regex ([d4e1614](https://github.com/webpack/webpack-cli/commit/d4e1614))

<a name="3.1.1"></a>

# 3.1.1 (2018-09-23)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.1.0...v3.1.1)

## New Features

-   migrate: CommonChunksPlugin to SplitChunksPlugin ([#558](https://github.com/webpack/webpack-cli/pull/558))
-   types: types for packages ([#578](https://github.com/webpack/webpack-cli/pull/578))

## CLI

-   allow array value for --ouput-library ([#559](https://github.com/webpack/webpack-cli/pull/559))

## Docs

-   fixed latest changelog link ([#556](https://github.com/webpack/webpack-cli/pull/556))
-   migrate documentaion ([#554](https://github.com/webpack/webpack-cli/pull/554))
-   init documentaion ([#547](https://github.com/webpack/webpack-cli/pull/547))
-   contribution: fix the setup workflow #591 ([#597](https://github.com/webpack/webpack-cli/pull/597))
-   typedoc: add ts docs ([#571](https://github.com/webpack/webpack-cli/pull/571))

## Fix

-   generate-loader: include example template in npm package ([d26ea82](https://github.com/webpack/webpack-cli/commit/d26ea82))
-   generate-plugin: include example template in npm package ([77fa723](https://github.com/webpack/webpack-cli/commit/77fa723))
-   package: update import-local to version 2.0.0 🚀 ([#576](https://github.com/webpack/webpack-cli/pull/576))
-   prettier: add parser, filePath ([#553](https://github.com/webpack/webpack-cli/pull/553))
-   schema: resolve references in schema ([#605](https://github.com/webpack/webpack-cli/pull/605))

## Misc

-   Revert "cli: allow array value for --ouput-library (#559)" ([#561](https://github.com/webpack/webpack-cli/pull/561))

<a name="3.1.0"></a>

# 3.1.0 (2018-07-18)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v3.0.8...v.3.1.0)

## New Features

-   generators: add typescript support ([c1844f8](https://github.com/webpack/webpack-cli/commit/c1844f8))
-   init: add typescript support ([222ccdc](https://github.com/webpack/webpack-cli/commit/222ccdc))
-   make: add typescript support ([4b574d9](https://github.com/webpack/webpack-cli/commit/4b574d9))
-   remove: add typescript support ([f1623ed](https://github.com/webpack/webpack-cli/commit/f1623ed))
-   scaffold: add typescript support ([eaf6fdf](https://github.com/webpack/webpack-cli/commit/eaf6fdf))
-   scaffold: add typescript support ([f611c27](https://github.com/webpack/webpack-cli/commit/f611c27))
-   serve: add typescript support ([d313421](https://github.com/webpack/webpack-cli/commit/d313421))
-   types: add webpack types schema ([90909e4](https://github.com/webpack/webpack-cli/commit/90909e4))
-   typescript: setup base infra ([fe25465](https://github.com/webpack/webpack-cli/commit/fe25465))
-   typescript: setup base infra ([373a304](https://github.com/webpack/webpack-cli/commit/373a304))
-   update: add typescript support ([53505b9](https://github.com/webpack/webpack-cli/commit/53505b9))
-   utils: add typescript support ([47702cb](https://github.com/webpack/webpack-cli/commit/47702cb))

## Ast

-   parser: remove ([7f51c27](https://github.com/webpack/webpack-cli/commit/7f51c27))
-   parser: remove ([faeec57](https://github.com/webpack/webpack-cli/commit/faeec57))

## Docs

-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   update jsdoc ([#507](https://github.com/webpack/webpack-cli/pull/507))
-   pkg: readme file for add package ([#498](https://github.com/webpack/webpack-cli/pull/498))
-   pkg: readme info ([#497](https://github.com/webpack/webpack-cli/pull/497))
-   pkg: readme info ([#497](https://github.com/webpack/webpack-cli/pull/497))

## Fix

-   default named import bug ([ce956c0](https://github.com/webpack/webpack-cli/commit/ce956c0))
-   generators: named export ([8adbe9e](https://github.com/webpack/webpack-cli/commit/8adbe9e))

## Misc

-   Update yargs to the latest version 🚀 ([#533](https://github.com/webpack/webpack-cli/pull/533))

    <a name="0.0.8-development"></a>

# 0.0.8-development (2018-06-15, webpack CLI v.3)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.5...v0.0.8-development)

## Ast

-   parser: add ([#456](https://github.com/webpack/webpack-cli/pull/456))

## CLI

-   add: re-add add command ([bf78411](https://github.com/webpack/webpack-cli/commit/bf78411))
-   color: don't use color on non-tty ([#452](https://github.com/webpack/webpack-cli/pull/452))
-   init: Better defaults ([#451](https://github.com/webpack/webpack-cli/pull/451))
-   symlinks: Fix paths ([#453](https://github.com/webpack/webpack-cli/pull/453))

## Fix

-   cli: show help flag when defaults fail ([#466](https://github.com/webpack/webpack-cli/pull/466))
-   vulnerabilities: vulnerabilities patch for v3 ([#460](https://github.com/webpack/webpack-cli/pull/460))

## Tests

-   cov: use regular nyc on tests ([3aa96ce](https://github.com/webpack/webpack-cli/commit/3aa96ce))
-   coverage: fix coverage ([#473](https://github.com/webpack/webpack-cli/pull/473))
-   no-options: refactor tests ([7be10d8](https://github.com/webpack/webpack-cli/commit/7be10d8))
-   parser: fix recursive-tests signature ([#470](https://github.com/webpack/webpack-cli/pull/470))

## Misc

-   Added yarn lock file to gitignore ([#455](https://github.com/webpack/webpack-cli/pull/455))

<a name="0.0.6"></a>

# 0.0.6 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.5...v0.0.6)

## CLI

-   path: resolve better ([7fca948](https://github.com/webpack/webpack-cli/commit/7fca948))

## Misc

-   v0.0.6 ([f544578](https://github.com/webpack/webpack-cli/commit/f544578))

<a name="0.0.5"></a>

# 0.0.5 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.4...v0.0.5)

## Misc

-   v0.0.5 ([062fa28](https://github.com/webpack/webpack-cli/commit/062fa28))

<a name="0.0.4"></a>

# 0.0.4 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.3...v0.0.4)

## Misc

-   v0.0.4 ([e29a173](https://github.com/webpack/webpack-cli/commit/e29a173))
-   v0.0.3 ([01cef3f](https://github.com/webpack/webpack-cli/commit/01cef3f))
-   v0.0.2 ([6489b10](https://github.com/webpack/webpack-cli/commit/6489b10))

<a name="0.0.3"></a>

# 0.0.3 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.2...v0.0.3)

## Misc

-   v0.0.3 ([b51e66d](https://github.com/webpack/webpack-cli/commit/b51e66d))

<a name="0.0.2"></a>

# 0.0.2 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v0.0.1...v0.0.2)

## Misc

-   v0.0.2 ([91be3fd](https://github.com/webpack/webpack-cli/commit/91be3fd))

<a name="0.0.1"></a>

# 0.0.1 (2018-05-17)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.3...v0.0.1)

## CLI

-   pkgs: re-add entries ([b2c2bbd](https://github.com/webpack/webpack-cli/commit/b2c2bbd))
-   prompt: wip ([5f357c9](https://github.com/webpack/webpack-cli/commit/5f357c9))
-   prompt: initial comment for prompt file ([f8a71c0](https://github.com/webpack/webpack-cli/commit/f8a71c0))

## Fix

-   monorepo: fix versions in pacakges ([2b3035c](https://github.com/webpack/webpack-cli/commit/2b3035c))
-   monorepo: update lock files ([ca8f5c1](https://github.com/webpack/webpack-cli/commit/ca8f5c1))
-   monorepo: fix cross spawn versions ([0fcc5b3](https://github.com/webpack/webpack-cli/commit/0fcc5b3))
-   monorepo: fix lint errors ([74fb759](https://github.com/webpack/webpack-cli/commit/74fb759))
-   revert: packagejson ([3dd244b](https://github.com/webpack/webpack-cli/commit/3dd244b))

## Misc

-   v0.0.1 ([faae7aa](https://github.com/webpack/webpack-cli/commit/faae7aa))

<a name="2.1.3"></a>

# 2.1.3 (2018-05-06)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.1.2...v2.1.3)

## CLI

-   cmds: revise yargs command ([#422](https://github.com/webpack/webpack-cli/pull/422))

<a name="2.0.14"></a>

# 2.0.14 (2018-04-05)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.13...2.0.14)

## New Features

-   use npm ci for tests (#367) ([#368](https://github.com/webpack/webpack-cli/pull/368))
-   add envinfo as `webpack-cli info` command ([51ab19f](https://github.com/webpack/webpack-cli/commit/51ab19f))
-   --entry should override config.entry (#155) ([#358](https://github.com/webpack/webpack-cli/pull/358))

## CLI

-   refactor: improve folder structure ([#371](https://github.com/webpack/webpack-cli/pull/371))

## Fix

-   loader,plugin: fix generators path bug ([b4bfafb](https://github.com/webpack/webpack-cli/commit/b4bfafb))

<a name="2.0.13"></a>

# 2.0.13 (2018-03-22)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/2.0.12...2.0.13)

## CLI

-   init: add webpack-cli dep ([#347](https://github.com/webpack/webpack-cli/pull/347))

<a name="2.0.12"></a>

# 2.0.12 (2018-03-14)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.11...v2.0.12)

## New Features

-   support --build-delimiter for opt-in output delimiter (#192) ([#340](https://github.com/webpack/webpack-cli/pull/340))

## Fix

-   removes debug in migrate ([#342](https://github.com/webpack/webpack-cli/pull/342))

## Misc

-   cz: fix type description ([#339](https://github.com/webpack/webpack-cli/pull/339))
-   init: fix global-modules require statement in package-manager ([610aa02](https://github.com/webpack/webpack-cli/commit/610aa02))
-   init-generator: cleanup ([b8c3145](https://github.com/webpack/webpack-cli/commit/b8c3145))

<a name="2.0.11"></a>

# 2.0.11 (2018-03-10)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.10...v2.0.11)

## CLI

-   init: Refactor Yeoman ([#323](https://github.com/webpack/webpack-cli/pull/323))
-   tapable: Remove Tapable#apply calls ([#305](https://github.com/webpack/webpack-cli/pull/305))

## Docs

-   update README to remove inconsistent CLI messaging (#327) ([#328](https://github.com/webpack/webpack-cli/pull/328))

## Fix

-   migrate: move options to use ([#308](https://github.com/webpack/webpack-cli/pull/308))
-   adding 'fix' to whitelist ([10a00df](https://github.com/webpack/webpack-cli/commit/10a00df))

## Misc

-   deps: clean up dependencies ([7078282](https://github.com/webpack/webpack-cli/commit/7078282))
-   generator: Allow local paths to generators ([#265](https://github.com/webpack/webpack-cli/pull/265))
-   grammar: revise spelling and incorrect syntax ([#293](https://github.com/webpack/webpack-cli/pull/293))
-   readme: add npm badge ([#303](https://github.com/webpack/webpack-cli/pull/303))

<a name="2.0.10"></a>

# 2.0.10 (2018-03-02)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.10)

## New Features

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Ast

-   init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## CLI

-   devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
-   version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Fix

-   generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))
-   yeoman-generator fork issue ([#294](https://github.com/webpack/webpack-cli/pull/294))
-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Misc

-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   Commitlint ([#300](https://github.com/webpack/webpack-cli/pull/300))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   strict Promise configuration validation ([#298](https://github.com/webpack/webpack-cli/pull/298))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   binTestCases: remove obsolete snapshot ([42301d7](https://github.com/webpack/webpack-cli/commit/42301d7))
-   dep: add webpack 4 as peer dependency ([#297](https://github.com/webpack/webpack-cli/pull/297))
-   migrate: prettify output ([#281](https://github.com/webpack/webpack-cli/pull/281))
-   revert: revert supports-color usage ([f8e819a](https://github.com/webpack/webpack-cli/commit/f8e819a))
-   revert: revert supports-color usage ([75f706b](https://github.com/webpack/webpack-cli/commit/75f706b))
-   syntax: prettify ([5cb146f](https://github.com/webpack/webpack-cli/commit/5cb146f))
-   yargs: add description for module-bind-\* args ([#286](https://github.com/webpack/webpack-cli/pull/286))

<a name="2.0.9"></a>

# 2.0.9 (2018-02-25)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.9)

## Ast

-   init: fix init command ([d36cd4f](https://github.com/webpack/webpack-cli/commit/d36cd4f))

## CLI

-   devServer: change devServer path ([c27e961](https://github.com/webpack/webpack-cli/commit/c27e961))
-   version: v.2.0.8 ([9406912](https://github.com/webpack/webpack-cli/commit/9406912))

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))
-   generator: use yeoman clone ([0b4269c](https://github.com/webpack/webpack-cli/commit/0b4269c))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

<a name="2.0.7"></a>

# 2.0.7 (2018-02-24)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.7)

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))
-   chore: add project tools and utilities ([#270](https://github.com/webpack/webpack-cli/pull/270))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   Revert "Show help on no command" ([#276](https://github.com/webpack/webpack-cli/pull/276))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   refactor: reduce code duplication use process.exitCode instead of process.exit ([#272](https://github.com/webpack/webpack-cli/pull/272))

<a name="2.0.6"></a>

# 2.0.6 (2018-02-20)

[Full Changelog](https://github.com/webpack/webpack-cli/compare/v2.0.4...v2.0.6)

## Feat

-   show help when no options given ([a7ee15a](https://github.com/webpack/webpack-cli/commit/a7ee15a))

## Fix

-   Resolve webpack dependencies ([#251](https://github.com/webpack/webpack-cli/pull/251))
-   change help logic ([d67f4b7](https://github.com/webpack/webpack-cli/commit/d67f4b7))

## Improvement

-   add an option to watch messaging. Add .idea to .gitignore ([#200](https://github.com/webpack/webpack-cli/pull/200))

## Refactor

-   convert-args: remove unused arguments ([#253](https://github.com/webpack/webpack-cli/pull/253))

## Style

-   run formatter ([7be0da7](https://github.com/webpack/webpack-cli/commit/7be0da7))

## Misc

-   remove yargs major update due security compromise ([9bd7ed4](https://github.com/webpack/webpack-cli/commit/9bd7ed4))
-   [feature] configuration validation ([#240](https://github.com/webpack/webpack-cli/pull/240))
-   v.2.0.6 ([4333088](https://github.com/webpack/webpack-cli/commit/4333088))
-   fix typo.. ([0f1cee6](https://github.com/webpack/webpack-cli/commit/0f1cee6))
-   2.0.5 ([94ac6db](https://github.com/webpack/webpack-cli/commit/94ac6db))
-   Change from git:// to https:// ([#259](https://github.com/webpack/webpack-cli/pull/259))
-   Issue 249 fixed and other enums refactored ([#264](https://github.com/webpack/webpack-cli/pull/264))
-   Refactor bin directory ([#263](https://github.com/webpack/webpack-cli/pull/263))
-   Add jsdoc comments for migrate ([#255](https://github.com/webpack/webpack-cli/pull/255))
-   add commitlinting: adds commit linting to the cli ([7e4dd3d](https://github.com/webpack/webpack-cli/commit/7e4dd3d))
-   add eslint ignore items: adds build folder and commit linter to ignore ([a400809](https://github.com/webpack/webpack-cli/commit/a400809))

<a name="2.0.0"></a>

## 2.0.0 (2017-12-21)

-   Adds add
-   Remove some mocks
-   Remove validationschema and ajv dependencies
-   Update Jest & Jest-cli
-   Remove unused dependencies
-   Creator is now init
-   Using env preset ([#197](https://github.com/webpack/webpack-cli/pull/197))
-   Using Yarn ([#203](https://github.com/webpack/webpack-cli/pull/203))
-   Using peer dep of webpack
-   Transformations is now migrate
-   Init has its own generator
-   Commands are refactored into a HOC and sent to a folder for each command with an helper for scaffolding aliases
-   Using RawList instead of List for better usability ([82c64db](https://github.com/webpack/webpack-cli/commit/541ba62f02c4a1fcc807eac62a551fcae3f2d2c3))
-   lib/transformations/util is now in lib/utils/ast-utils
-   Each AST module now has an extra argument that specifies action to be done
-   FindPluginsByRoot is now FindRootByName and more generalistic
-   Added ast util function createEmptyCallableFunctionWithArguments
-   Refactor for readability ([#214](https://github.com/webpack/webpack-cli/pull/214))
-   Remove dist from repo ([#215](https://github.com/webpack/webpack-cli/pull/215))
-   Remove entry and output validation ([#217](https://github.com/webpack/webpack-cli/pull/217))
-   topScope now checks if the import already is present
-   Updated test errors/issue-5576, remember to sync with webpack/next
-   User friendly startup message ([#218](https://github.com/webpack/webpack-cli/pull/218))
-   Migrate now uses prettier ([88aaaa2](https://github.com/webpack/webpack-cli/commit/972d4cd90061644aa2f4aaac33d2d80cb4a56d57)
-   Added transform for mode ([972d4cd](https://github.com/webpack/webpack-cli/commit/e1f512c9bb96694dd623562dc4cef411ed004c2c)
-   Remove recast fork ([fba04da](https://github.com/webpack/webpack-cli/commit/b416d9c50138ef343b8bac6e3f66fdd5b917857d))
-   New transforms ([b416d9c](https://github.com/webpack/webpack-cli/commit/28680c944dca0860ca59a38910840a641b418d18))
-   JSdocs are added ([47de46a](https://github.com/webpack/webpack-cli/commit/285846a4cb1f976edcdb36629cf247d8017ff956))
-   Added serve alias ([#204](https://github.com/webpack/webpack-cli/pull/204))
-   Migrate has new validate logic ([c4c68e8](https://github.com/webpack/webpack-cli/commit/5d4430a6a5531cd8084e5a591f7884e746e21b2f))
-   webpack serve logic ([5d4430a](https://github.com/webpack/webpack-cli/commit/992bfe2b08b98aebb43c68d5e5a92320ba3e32a8))
-   webpack --config-register and webpack -r is added ([1f24d19](https://github.com/webpack/webpack-cli/commit/ab9421136887b7e9e10f25a39b59fb32f07b5037))
-   work on makefile generation ([d86e1ce](https://github.com/webpack/webpack-cli/commit/4f9a4f88a8bd113762a54c05b3b9fe6f459855db))
-   Appveyor is added ([9b2f6f5](https://github.com/webpack/webpack-cli/commit/c5c97462d6ccfa4c02fd79206fa075815520cd88))
-   Remove commit-validate from docs ([#222](https://github.com/webpack/webpack-cli/pull/222))
-   Added transform ResolveLoader ([7c713ce](https://github.com/webpack/webpack-cli/commit/3c90e83fa7b8dd5fbecaee5d1b9d8f0279600096))
-   Using v8-compile-cache ([7e57314](https://github.com/webpack/webpack-cli/commit/0564ceb77a995239d0be7a022b948cbd727773a4))
-   Adds webpack-cli bot ([#224](https://github.com/webpack/webpack-cli/pull/224))

<a name="1.3.2"></a>

## 1.3.2 (2017-05-15)

### Bug Fixes

-   add css-loader appropriately ([#141](https://github.com/webpack/webpack-cli/issues/141)) ([a71600e](https://github.com/webpack/webpack-cli/commit/a71600e))
-   Deps 'webpack' and 'uglifyjs-webpack-plugin' not installed when user answers yes to 'using ES2015' ([#135](https://github.com/webpack/webpack-cli/issues/135)). ([#136](https://github.com/webpack/webpack-cli/issues/136)) ([524f035](https://github.com/webpack/webpack-cli/commit/524f035))
-   Install correct (`es2015`) babel preset to match generated config ([#138](https://github.com/webpack/webpack-cli/issues/138)) ([b0af53f](https://github.com/webpack/webpack-cli/commit/b0af53f))
-   use correct test function ([#129](https://github.com/webpack/webpack-cli/issues/129)) ([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))

<a name="1.3.1"></a>

## 1.3.1 (2017-05-02)

### Bug Fixes

-   add safe traverse to loaderoptionsplugin ([#77](https://github.com/webpack/webpack-cli/issues/77)) ([4020043](https://github.com/webpack/webpack-cli/commit/4020043))
-   Do not create LoaderOptionsPlugin if loaderOptions is empty ([#72](https://github.com/webpack/webpack-cli/issues/72)) ([b9d22c9](https://github.com/webpack/webpack-cli/commit/b9d22c9))
    ([68a2dfd](https://github.com/webpack/webpack-cli/commit/68a2dfd))
-   Upgrade to Jest 19 ([#71](https://github.com/webpack/webpack-cli/issues/71)) ([fe62523](https://github.com/webpack/webpack-cli/commit/fe62523))
-   Use `safeTraverse` where appropriate ([#94](https://github.com/webpack/webpack-cli/issues/94)) ([dcde2b6](https://github.com/webpack/webpack-cli/commit/dcde2b6))
    ([3464d9e](https://github.com/webpack/webpack-cli/commit/3464d9e))
-   Use real paths from argvs instead of dummy hard-coded file ([#65](https://github.com/webpack/webpack-cli/issues/65)) ([a46edbb](https://github.com/webpack/webpack-cli/commit/a46edbb))

### Features

-   Add beautifier config for JS code ([64c88ea](https://github.com/webpack/webpack-cli/commit/64c88ea))
-   Add commit validation and commits template ([d0cbfc0](https://github.com/webpack/webpack-cli/commit/d0cbfc0))
-   Add editorconfig settings from core webpack ([89809de](https://github.com/webpack/webpack-cli/commit/89809de))
-   Add yarn settings to handle dependencies ([34579c7](https://github.com/webpack/webpack-cli/commit/34579c7))
-   Adds a resolved path for output ([#80](https://github.com/webpack/webpack-cli/issues/80)) ([37a594d](https://github.com/webpack/webpack-cli/commit/37a594d))
-   Introduce reserve and timestamps ([#24](https://github.com/webpack/webpack-cli/issues/24)) ([ed267b4](https://github.com/webpack/webpack-cli/commit/ed267b4))
-   Webpack-CLI version 1([#105](https://github.com/webpack/webpack-cli/pull/105))
-   Feature: Use listr to display progress and errors for transformations([#92](https://github.com/webpack/webpack-cli/pull/92))
-   Feature: Jscodeshift Transformations for --migrate ([#40](https://github.com/webpack/webpack-cli/pull/40))
