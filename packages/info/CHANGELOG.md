# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@2.0.0...@webpack-cli/info@2.0.1) (2022-12-05)

**Note:** Version bump only for package @webpack-cli/info

# [2.0.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.5.0...@webpack-cli/info@2.0.0) (2022-11-17)

### Features

- **info:** show information for webpack-cli packages by default ([#3362](https://github.com/webpack/webpack-cli/issues/3362)) ([a1161a8](https://github.com/webpack/webpack-cli/commit/a1161a83d1c8be942ebd2fc93c20e463db38f632))

### BREAKING CHANGES

- the minimum supported webpack version is v5.0.0 (#3342) ([b1af0dc](https://github.com/webpack/webpack-cli/commit/b1af0dc7ebcdf746bc37889e4c1f978c65acc4a5)), closes [#3342](https://github.com/webpack/webpack-cli/issues/3342)
- webpack-cli no longer supports webpack v4, the minimum supported version is webpack v5.0.0

# [1.5.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.4.1...@webpack-cli/info@1.5.0) (2022-06-13)

### Features

- added types ([8ec1375](https://github.com/webpack/webpack-cli/commit/8ec1375092a6f9676e82fa4231dd88b1016c2302))

## [1.4.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.4.0...@webpack-cli/info@1.4.1) (2022-01-24)

**Note:** Version bump only for package @webpack-cli/info

# [1.4.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.3.0...@webpack-cli/info@1.4.0) (2021-10-06)

### Features

- **info:** added the `--additional-package` option ([06cd267](https://github.com/webpack/webpack-cli/commit/06cd267663955f64b70685c604105d051ffd6beb))
- allow to run commands without webpack installation where it is unnecessary ([#2907](https://github.com/webpack/webpack-cli/issues/2907)) ([603041d](https://github.com/webpack/webpack-cli/commit/603041d7e6a9b764bd79d1a8effd22a3e0f019cb))

# [1.3.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.2.4...@webpack-cli/info@1.3.0) (2021-06-07)

### Bug Fixes

- prettier config ([#2719](https://github.com/webpack/webpack-cli/issues/2719)) ([181295f](https://github.com/webpack/webpack-cli/commit/181295fb1b1973c201c221813562219d85b845ae))

### Features

- **info:** add alias for --output ([#2709](https://github.com/webpack/webpack-cli/issues/2709)) ([3453053](https://github.com/webpack/webpack-cli/commit/34530530f99750a5efc382293127753f05fc8064))

## [1.2.4](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.2.3...@webpack-cli/info@1.2.4) (2021-05-06)

**Note:** Version bump only for package @webpack-cli/info

## [1.2.3](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.2.2...@webpack-cli/info@1.2.3) (2021-03-27)

### Bug Fixes

- grammar in description of `--output` ([#2554](https://github.com/webpack/webpack-cli/issues/2554)) ([c6f781d](https://github.com/webpack/webpack-cli/commit/c6f781d741da3b07b25756c053427e5c358ad14f))

## [1.2.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.2.1...@webpack-cli/info@1.2.2) (2021-02-02)

**Note:** Version bump only for package @webpack-cli/info

## [1.2.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.2.0...@webpack-cli/info@1.2.1) (2020-12-31)

### Bug Fixes

- the `--help` option is working without `webpack-dev-server` ([#2267](https://github.com/webpack/webpack-cli/issues/2267)) ([1dae54d](https://github.com/webpack/webpack-cli/commit/1dae54da94d3220437b9257efe512447023de1d3))

# [1.2.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.1.0...@webpack-cli/info@1.2.0) (2020-12-25)

### Features

- display monorepos in info output ([#2203](https://github.com/webpack/webpack-cli/issues/2203)) ([d0acf30](https://github.com/webpack/webpack-cli/commit/d0acf3072edd8182c95e37997ac91789da899d66))

# [1.1.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.2...@webpack-cli/info@1.1.0) (2020-11-04)

### Bug Fixes

- **info:** throw error and exit for invalid --output value ([#2020](https://github.com/webpack/webpack-cli/issues/2020)) ([a994d4b](https://github.com/webpack/webpack-cli/commit/a994d4b52a99b3b77d25aac88f741e036a1c44ec))

### Features

- export utils from core for other packages ([#2011](https://github.com/webpack/webpack-cli/issues/2011)) ([3004549](https://github.com/webpack/webpack-cli/commit/3004549c06b3fe00708d8e1eecf42419e0f72f66))

## [1.0.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.1...@webpack-cli/info@1.0.2) (2020-10-19)

**Note:** Version bump only for package @webpack-cli/info

## [1.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.1-rc.1...@webpack-cli/info@1.0.1) (2020-10-10)

**Note:** Version bump only for package @webpack-cli/info

## [1.0.1-rc.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.1-alpha.4...@webpack-cli/info@1.0.1-rc.1) (2020-10-06)

### Bug Fixes

- **info:** throw an error if help or version is passed as an arg ([#1737](https://github.com/webpack/webpack-cli/issues/1737)) ([c8ca878](https://github.com/webpack/webpack-cli/commit/c8ca87858b81e0c23e161d227558d2f0aeac003a))
- **packages:** make packages have correct main paths to index ([#1366](https://github.com/webpack/webpack-cli/issues/1366)) ([5dd7bd6](https://github.com/webpack/webpack-cli/commit/5dd7bd62046568481996e48328b15a335557f8ae))

## [1.0.1-alpha.4](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/info@1.0.1-alpha.3...@webpack-cli/info@1.0.1-alpha.4) (2020-03-02)

**Note:** Version bump only for package @webpack-cli/info

## [1.0.1-alpha.3](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/info@1.0.1-alpha.2...@webpack-cli/info@1.0.1-alpha.3) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/info

## [1.0.1-alpha.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.1-alpha.1...@webpack-cli/info@1.0.1-alpha.2) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/info

## [1.0.1-alpha.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/info@1.0.1-alpha.0...@webpack-cli/info@1.0.1-alpha.1) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/info
