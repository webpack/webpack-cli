# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.1.0...@webpack-cli/serve@1.2.0) (2020-12-25)

### Bug Fixes

-   respect `--watch-options-stdin` ([2d1e001](https://github.com/webpack/webpack-cli/commit/2d1e001e7f4f560c2b36607bd1b29dfe2aa32066))
-   do not default host in webpack-dev-server v4 ([#2141](https://github.com/webpack/webpack-cli/issues/2141)) ([dbbe4d4](https://github.com/webpack/webpack-cli/commit/dbbe4d4bc93ff9147ba43fae2d2352fa3583558d))
-   do not default port in webpack-dev-server v4 ([#2126](https://github.com/webpack/webpack-cli/issues/2126)) ([cda3047](https://github.com/webpack/webpack-cli/commit/cda30471f51db4631a0f54b852c553de270f7f64))
-   set client port when using default port ([#2147](https://github.com/webpack/webpack-cli/issues/2147)) ([4b97348](https://github.com/webpack/webpack-cli/commit/4b973488a42c4e12d86e0324a4c7051d1380a6fa))
-   catch dev server import during webpack serve ([#2070](https://github.com/webpack/webpack-cli/issues/2070)) ([70bf770](https://github.com/webpack/webpack-cli/commit/70bf7708c21dffe6521f1800b9dec2a62d21cfe2))
-   respect `--color`/`--no-color` options ([#2042](https://github.com/webpack/webpack-cli/issues/2042)) ([09bd812](https://github.com/webpack/webpack-cli/commit/09bd8126e95c9675b1f6862451f629cd4c439adb))

# [1.1.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1...@webpack-cli/serve@1.1.0) (2020-11-04)

### Bug Fixes

-   resolve dev server hot options correctly ([#2022](https://github.com/webpack/webpack-cli/issues/2022)) ([7c5a2ba](https://github.com/webpack/webpack-cli/commit/7c5a2bae49625ee4982d7478b7e741968731cea2))

### Features

-   add WEBPACK_SERVE environment variable ([#2027](https://github.com/webpack/webpack-cli/issues/2027)) ([ea369a9](https://github.com/webpack/webpack-cli/commit/ea369a98ea5ec366b688caebcb1276d9fbe0c651))
-   export utils from core for other packages ([#2011](https://github.com/webpack/webpack-cli/issues/2011)) ([3004549](https://github.com/webpack/webpack-cli/commit/3004549c06b3fe00708d8e1eecf42419e0f72f66))

## [1.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-rc.1...@webpack-cli/serve@1.0.1) (2020-10-10)

**Note:** Version bump only for package @webpack-cli/serve

## [1.0.1-rc.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/serve@1.0.1-alpha.5...@webpack-cli/serve@1.0.1-rc.1) (2020-10-06)

### Bug Fixes

-   peer dependencies for `webpack serve` ([#1317](https://github.com/webpack/webpack-cli/issues/1317)) ([f8ec203](https://github.com/webpack/webpack-cli/commit/f8ec20382702450134032a65403894573b04be8d))
-   **packages:** make packages have correct main paths to index ([#1366](https://github.com/webpack/webpack-cli/issues/1366)) ([5dd7bd6](https://github.com/webpack/webpack-cli/commit/5dd7bd62046568481996e48328b15a335557f8ae))
-   **serve:** merge CLI and devServer options correctly ([#1649](https://github.com/webpack/webpack-cli/issues/1649)) ([2cdf5ce](https://github.com/webpack/webpack-cli/commit/2cdf5ce159f63ac65b33f4aca4c82fa1e959fef5))
-   **serve:** supplying help or version as an arg should throw error ([#1694](https://github.com/webpack/webpack-cli/issues/1694)) ([6eb7883](https://github.com/webpack/webpack-cli/commit/6eb78833f910135ca798c0c28f8d236ef234a76c))

### Features

-   allow multiple targets ([#1799](https://github.com/webpack/webpack-cli/issues/1799)) ([1724ddb](https://github.com/webpack/webpack-cli/commit/1724ddb9067d5c5ba2654d4e5473ee9de5610825))
-   serve integration ([#1712](https://github.com/webpack/webpack-cli/issues/1712)) ([d3e2936](https://github.com/webpack/webpack-cli/commit/d3e29368c40ee47e4f7a07c41281714645e20ea7))

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

-   **init:** fix webpack config scaffold ([#1231](https://github.com/webpack/webpack-cli/issues/1231)) ([2dc495a](https://github.com/webpack/webpack-cli/commit/2dc495a8d050d28478c6c2533d7839e9ff78d76c)), closes [#1230](https://github.com/webpack/webpack-cli/issues/1230)
