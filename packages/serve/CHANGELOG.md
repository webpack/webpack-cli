# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@2.0.0...@webpack-cli/serve@2.0.1) (2022-12-05)

**Note:** Version bump only for package @webpack-cli/serve

# [2.0.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.7.0...@webpack-cli/serve@2.0.0) (2022-11-17)

### BREAKING CHANGES

- the minimum supported webpack version is v5.0.0 (#3342) ([b1af0dc](https://github.com/webpack/webpack-cli/commit/b1af0dc7ebcdf746bc37889e4c1f978c65acc4a5)), closes [#3342](https://github.com/webpack/webpack-cli/issues/3342)
- webpack-cli no longer supports webpack v4, the minimum supported version is webpack v5.0.0
- webpack-cli no longer supports webpack-dev-server v3, the minimum supported version is webpack-dev-server v4.0.0

# [1.7.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.6.1...@webpack-cli/serve@1.7.0) (2022-06-13)

### Features

- added types ([8ec1375](https://github.com/webpack/webpack-cli/commit/8ec1375092a6f9676e82fa4231dd88b1016c2302))

## [1.6.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.6.0...@webpack-cli/serve@1.6.1) (2022-01-24)

**Note:** Version bump only for package @webpack-cli/serve

# [1.6.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.5.2...@webpack-cli/serve@1.6.0) (2021-10-06)

### Bug Fixes

- allow falsy values for `port` option ([#2962](https://github.com/webpack/webpack-cli/issues/2962)) ([da135dd](https://github.com/webpack/webpack-cli/commit/da135dd717e88b6aa9a0559c1e4e8acb4ee8f3c1))

### Features

- allow to run commands without webpack installation where it is unnecessary ([#2907](https://github.com/webpack/webpack-cli/issues/2907)) ([603041d](https://github.com/webpack/webpack-cli/commit/603041d7e6a9b764bd79d1a8effd22a3e0f019cb))

## [1.5.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.5.1...@webpack-cli/serve@1.5.2) (2021-08-15)

### Bug Fixes

- ci for dev server next ([#2841](https://github.com/webpack/webpack-cli/issues/2841)) ([54d34b7](https://github.com/webpack/webpack-cli/commit/54d34b723cbeaf8cc13cff45398530be1db911e4))
- respect dev server CLI options for multi compiler mode ([de48278](https://github.com/webpack/webpack-cli/commit/de482784a4f8cbb9eacbbe1c6b6f3c62ef60567a))
- using new dev server API for v4 ([#2886](https://github.com/webpack/webpack-cli/issues/2886)) ([f66d01f](https://github.com/webpack/webpack-cli/commit/f66d01f0e382b0b3ffc753ac7549eb252e19e26c))

## [1.5.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.5.0...@webpack-cli/serve@1.5.1) (2021-06-07)

### Bug Fixes

- broken serve with new CLI API ([#2770](https://github.com/webpack/webpack-cli/issues/2770)) ([2d7ab35](https://github.com/webpack/webpack-cli/commit/2d7ab3549c429193b4ed5fbc6174153c847e0330))

# [1.5.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.4.0...@webpack-cli/serve@1.5.0) (2021-06-07)

### Bug Fixes

- prettier config ([#2719](https://github.com/webpack/webpack-cli/issues/2719)) ([181295f](https://github.com/webpack/webpack-cli/commit/181295fb1b1973c201c221813562219d85b845ae))

### Features

- new CLI options API for serve ([#2754](https://github.com/webpack/webpack-cli/issues/2754)) ([bb7c9d3](https://github.com/webpack/webpack-cli/commit/bb7c9d3c9b0dca11242e2febcd41805c063e1317))

# [1.4.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.3.1...@webpack-cli/serve@1.4.0) (2021-05-06)

### Bug Fixes

- avoid unnecessary searching port ([#2648](https://github.com/webpack/webpack-cli/issues/2648)) ([5063ed7](https://github.com/webpack/webpack-cli/commit/5063ed7970cd12fd042308edfccca8dbf249f0fc))
- **serve:** do not set port client port directly ([#2624](https://github.com/webpack/webpack-cli/issues/2624)) ([ec18b8e](https://github.com/webpack/webpack-cli/commit/ec18b8e478ff1a5f8d85bbddc599001dfd69eba3))

### Features

- add `server` alias for `serve` command ([#2631](https://github.com/webpack/webpack-cli/issues/2631)) ([c9ee947](https://github.com/webpack/webpack-cli/commit/c9ee947618c06447bc1f949e4d401e63f737f38d))

## [1.3.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.3.0...@webpack-cli/serve@1.3.1) (2021-03-27)

**Note:** Version bump only for package @webpack-cli/serve

# [1.3.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.2.2...@webpack-cli/serve@1.3.0) (2021-02-02)

### Bug Fixes

- avoid deprecation message ([9d6dbda](https://github.com/webpack/webpack-cli/commit/9d6dbda93da167a1aaad03f599105a4fe7849dc3))
- error message on invalid plugin options ([#2380](https://github.com/webpack/webpack-cli/issues/2380)) ([f9ce1d3](https://github.com/webpack/webpack-cli/commit/f9ce1d30b83bf0e0b4d91498d012c13c208e6e67))

### Features

- entries syntax ([#2369](https://github.com/webpack/webpack-cli/issues/2369)) ([6b31614](https://github.com/webpack/webpack-cli/commit/6b3161479578f572f803f579c7e71073eb797184))

## [1.2.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.2.1...@webpack-cli/serve@1.2.2) (2021-01-19)

### Bug Fixes

- pass all `argv` to configurations when `serve` command used ([#2345](https://github.com/webpack/webpack-cli/issues/2345)) ([5070b9b](https://github.com/webpack/webpack-cli/commit/5070b9bcbd5bdac00088d0c21486ad181a4df000))
- respect `--stats`, `--color` and `--no-color` option for serve c… ([#2312](https://github.com/webpack/webpack-cli/issues/2312)) ([73d3fec](https://github.com/webpack/webpack-cli/commit/73d3feced18b4e3708f958707326a6642a594cf2))

## [1.2.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.2.0...@webpack-cli/serve@1.2.1) (2020-12-31)

### Bug Fixes

- do not apply HotModuleReplacement plugin twice ([#2269](https://github.com/webpack/webpack-cli/issues/2269)) ([bb16d44](https://github.com/webpack/webpack-cli/commit/bb16d4481414a5f3c0cbeb18af690084b2ae4215))
- respect the `output.publicPath` option for the `serve`command ([#2271](https://github.com/webpack/webpack-cli/issues/2271)) ([a3092ef](https://github.com/webpack/webpack-cli/commit/a3092ef2b51ece30221f7dd7b30a686626c1fd7a))
- the `--help` option is working without `webpack-dev-server` ([#2267](https://github.com/webpack/webpack-cli/issues/2267)) ([1dae54d](https://github.com/webpack/webpack-cli/commit/1dae54da94d3220437b9257efe512447023de1d3))
- the `--progress` option with the `serve` command ([#2265](https://github.com/webpack/webpack-cli/issues/2265)) ([952a188](https://github.com/webpack/webpack-cli/commit/952a1883b1a18c4fb38e8eb7bbbdb2aefc7942f4))

# [1.2.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.1.0...@webpack-cli/serve@1.2.0) (2020-12-25)

### Bug Fixes

- respect `--watch-options-stdin` ([2d1e001](https://github.com/webpack/webpack-cli/commit/2d1e001e7f4f560c2b36607bd1b29dfe2aa32066))
- do not default host in webpack-dev-server v4 ([#2141](https://github.com/webpack/webpack-cli/issues/2141)) ([dbbe4d4](https://github.com/webpack/webpack-cli/commit/dbbe4d4bc93ff9147ba43fae2d2352fa3583558d))
- do not default port in webpack-dev-server v4 ([#2126](https://github.com/webpack/webpack-cli/issues/2126)) ([cda3047](https://github.com/webpack/webpack-cli/commit/cda30471f51db4631a0f54b852c553de270f7f64))
- set client port when using default port ([#2147](https://github.com/webpack/webpack-cli/issues/2147)) ([4b97348](https://github.com/webpack/webpack-cli/commit/4b973488a42c4e12d86e0324a4c7051d1380a6fa))
- catch dev server import during webpack serve ([#2070](https://github.com/webpack/webpack-cli/issues/2070)) ([70bf770](https://github.com/webpack/webpack-cli/commit/70bf7708c21dffe6521f1800b9dec2a62d21cfe2))
- respect `--color`/`--no-color` options ([#2042](https://github.com/webpack/webpack-cli/issues/2042)) ([09bd812](https://github.com/webpack/webpack-cli/commit/09bd8126e95c9675b1f6862451f629cd4c439adb))

# [1.1.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1...@webpack-cli/serve@1.1.0) (2020-11-04)

### Bug Fixes

- resolve dev server hot options correctly ([#2022](https://github.com/webpack/webpack-cli/issues/2022)) ([7c5a2ba](https://github.com/webpack/webpack-cli/commit/7c5a2bae49625ee4982d7478b7e741968731cea2))

### Features

- add WEBPACK_SERVE environment variable ([#2027](https://github.com/webpack/webpack-cli/issues/2027)) ([ea369a9](https://github.com/webpack/webpack-cli/commit/ea369a98ea5ec366b688caebcb1276d9fbe0c651))
- export utils from core for other packages ([#2011](https://github.com/webpack/webpack-cli/issues/2011)) ([3004549](https://github.com/webpack/webpack-cli/commit/3004549c06b3fe00708d8e1eecf42419e0f72f66))

## [1.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-rc.1...@webpack-cli/serve@1.0.1) (2020-10-10)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-rc.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.5...@webpack-cli/serve@1.0.1-rc.1) (2020-10-06)

### Bug Fixes

- peer dependencies for `webpack serve` ([#1317](https://github.com/webpack/webpack-cli/issues/1317)) ([f8ec203](https://github.com/webpack/webpack-cli/commit/f8ec20382702450134032a65403894573b04be8d))
- **packages:** make packages have correct main paths to index ([#1366](https://github.com/webpack/webpack-cli/issues/1366)) ([5dd7bd6](https://github.com/webpack/webpack-cli/commit/5dd7bd62046568481996e48328b15a335557f8ae))
- **serve:** merge CLI and devServer options correctly ([#1649](https://github.com/webpack/webpack-cli/issues/1649)) ([2cdf5ce](https://github.com/webpack/webpack-cli/commit/2cdf5ce159f63ac65b33f4aca4c82fa1e959fef5))
- **serve:** supplying help or version as an arg should throw error ([#1694](https://github.com/webpack/webpack-cli/issues/1694)) ([6eb7883](https://github.com/webpack/webpack-cli/commit/6eb78833f910135ca798c0c28f8d236ef234a76c))

### Features

- allow multiple targets ([#1799](https://github.com/webpack/webpack-cli/issues/1799)) ([1724ddb](https://github.com/webpack/webpack-cli/commit/1724ddb9067d5c5ba2654d4e5473ee9de5610825))
- serve integration ([#1712](https://github.com/webpack/webpack-cli/issues/1712)) ([d3e2936](https://github.com/webpack/webpack-cli/commit/d3e29368c40ee47e4f7a07c41281714645e20ea7))

## [1.0.1-alpha.5](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.4...@webpack-cli/serve@1.0.1-alpha.5) (2020-03-02)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-alpha.4](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.3...@webpack-cli/serve@1.0.1-alpha.4) (2020-02-29)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-alpha.3](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.2...@webpack-cli/serve@1.0.1-alpha.3) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-alpha.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.1...@webpack-cli/serve@1.0.1-alpha.2) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-alpha.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.0...@webpack-cli/serve@1.0.1-alpha.1) (2020-02-23)

### Bug Fixes

- **init:** fix webpack config scaffold ([#1231](https://github.com/webpack/webpack-cli/issues/1231)) ([2dc495a](https://github.com/webpack/webpack-cli/commit/2dc495a8d050d28478c6c2533d7839e9ff78d76c)), closes [#1230](https://github.com/webpack/webpack-cli/issues/1230)
