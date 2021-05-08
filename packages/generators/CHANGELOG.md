# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@2.0.0...@webpack-cli/generators@2.1.0) (2021-05-06)

### Bug Fixes

-   add node env as prod in default template ([#2614](https://github.com/webpack/webpack-cli/issues/2614)) ([5ea478c](https://github.com/webpack/webpack-cli/commit/5ea478ca9e8fda691e37fdd6d0ad8d1df074e224))
-   broken URL in generated webpack.config.js ([#2600](https://github.com/webpack/webpack-cli/issues/2600)) ([6e207bc](https://github.com/webpack/webpack-cli/commit/6e207bc24886f7f8a87a19119924a682f66e575b))
-   comment typo in webpack.config.js template file ([#2639](https://github.com/webpack/webpack-cli/issues/2639)) ([d2ab57d](https://github.com/webpack/webpack-cli/commit/d2ab57d2268d8cc8df628f35d75774c88330a5f8))
-   correct webpack config for `babel-loader` and `ts-loader` ([#2577](https://github.com/webpack/webpack-cli/issues/2577)) ([177dca7](https://github.com/webpack/webpack-cli/commit/177dca7c20fff0708721426598fcd5a89384eb8e))
-   send warning regarding invalid template to stderr ([#2687](https://github.com/webpack/webpack-cli/issues/2687)) ([dc0481b](https://github.com/webpack/webpack-cli/commit/dc0481becfde5553fa95a393d1167539b2e14ec2))
-   update usage info ([#2594](https://github.com/webpack/webpack-cli/issues/2594)) ([9d07d67](https://github.com/webpack/webpack-cli/commit/9d07d67faf147cbaf0dddb95038403963e5f2afb))
-   **generators:** use correct exit code ([#2569](https://github.com/webpack/webpack-cli/issues/2569)) ([9a18e7f](https://github.com/webpack/webpack-cli/commit/9a18e7f6cdf8524ecee3cfaf09595983eebf35b9))

### Features

-   add --template flag for addon generator ([#2576](https://github.com/webpack/webpack-cli/issues/2576)) ([c8f702a](https://github.com/webpack/webpack-cli/commit/c8f702ac399252b8e5da899e6014a2832321caa3))
-   add `create` and `new` alias for `init` ([#2616](https://github.com/webpack/webpack-cli/issues/2616)) ([5a9789d](https://github.com/webpack/webpack-cli/commit/5a9789db237b7696adfdc9826b0dda749fedfa9a))
-   add support for mini-css-extract-plugin on demand ([#2571](https://github.com/webpack/webpack-cli/issues/2571)) ([ed201c0](https://github.com/webpack/webpack-cli/commit/ed201c0744d08dc376a234ddafe32f6b5fe60082))
-   add support for mode specific config ([#2585](https://github.com/webpack/webpack-cli/issues/2585)) ([993a7f0](https://github.com/webpack/webpack-cli/commit/993a7f02ec1546a7aca1ee537366faa8ac18de84))
-   added support arguments description ([#2659](https://github.com/webpack/webpack-cli/issues/2659)) ([4dfd166](https://github.com/webpack/webpack-cli/commit/4dfd166f757ce94130bf9b7580f2dbe2868b8f4f))
-   allow setup extract plugin ([#2644](https://github.com/webpack/webpack-cli/issues/2644)) ([71bfaa8](https://github.com/webpack/webpack-cli/commit/71bfaa8ef5e9de4d4f0cbee4ba7e57a5b1b69d90))
-   make extention case insensitive ([#2572](https://github.com/webpack/webpack-cli/issues/2572)) ([67eeaaf](https://github.com/webpack/webpack-cli/commit/67eeaaf66ed5b6b3b705c2b595e3923f2cb725e6))
-   prettify generated config ([#2640](https://github.com/webpack/webpack-cli/issues/2640)) ([c3c069e](https://github.com/webpack/webpack-cli/commit/c3c069e1cc7958a6f7b5d4cdb74acb12bc25d8c7))

# [2.0.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.3.1...@webpack-cli/generators@2.0.0) (2021-03-27)

### BREAKING CHANGES

-   `--generation-path` option was removed, please use `webpack init ./path/to/generation`
-   `--auto` option was removed in favor `--force`
-   utils for ast transformations were removed

### Bug Fixes

-   description for `init` command ([#2528](https://github.com/webpack/webpack-cli/issues/2528)) ([0f0e403](https://github.com/webpack/webpack-cli/commit/0f0e403464711d5c7ddfe9537e00969fb3474685))
-   update prompt message ([#2523](https://github.com/webpack/webpack-cli/issues/2523)) ([7b87485](https://github.com/webpack/webpack-cli/commit/7b87485c6b161d472422e7f86680a7e221223ec1))
-   add serve script if opted for WDS with init ([#2424](https://github.com/webpack/webpack-cli/issues/2424)) ([78e2fa7](https://github.com/webpack/webpack-cli/commit/78e2fa7036e123beefe2010e0a6cc10697d14c4d))
-   improve prettier message ([#2419](https://github.com/webpack/webpack-cli/issues/2419)) ([21a1a30](https://github.com/webpack/webpack-cli/commit/21a1a30c687cd800396a1c13abefc57bf42886f3))

### Features

-   add additional scripts to init template ([#2550](https://github.com/webpack/webpack-cli/issues/2550)) ([665d993](https://github.com/webpack/webpack-cli/commit/665d99378f272179e39236cb21773ef1b1907314))
-   add postcss support to default template ([#2526](https://github.com/webpack/webpack-cli/issues/2526)) ([2627d0f](https://github.com/webpack/webpack-cli/commit/2627d0f9490be35f21ed0f55134d7851dd2e5cd0))
-   allow all css possibilities for default template ([#2544](https://github.com/webpack/webpack-cli/issues/2544)) ([a141bbb](https://github.com/webpack/webpack-cli/commit/a141bbb1902ec9039d197f3b4b049e2e3eaff793))

## [1.3.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.3.0...@webpack-cli/generators@1.3.1) (2021-02-02)

**Note:** Version bump only for package @webpack-cli/generators

# [1.3.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.2.1...@webpack-cli/generators@1.3.0) (2021-01-19)

### Bug Fixes

-   init generator ([#2324](https://github.com/webpack/webpack-cli/issues/2324)) ([016bb34](https://github.com/webpack/webpack-cli/commit/016bb348d7cc9cb299555ec8edd373130fb1b77c))
-   regression with webpack config ([#2319](https://github.com/webpack/webpack-cli/issues/2319)) ([50bbe56](https://github.com/webpack/webpack-cli/commit/50bbe56c0ae9d72301c4ac51fdc2b04df7b66451))
-   remove splitchunks ([#2310](https://github.com/webpack/webpack-cli/issues/2310)) ([e44e855](https://github.com/webpack/webpack-cli/commit/e44e855c7e302932a828fcedf7abfe205b47c716))
-   remove style-loader from the loader chain ([#2309](https://github.com/webpack/webpack-cli/issues/2309)) ([19a25cf](https://github.com/webpack/webpack-cli/commit/19a25cf83dc2f680a5028f4b449d7f79895231f0))
-   use worker from plugin and remove default ([#2340](https://github.com/webpack/webpack-cli/issues/2340)) ([9100137](https://github.com/webpack/webpack-cli/commit/9100137bc4e7d77915407aec554da25f0ae9e55c))

### Features

-   flexible init scaffolding ([#2311](https://github.com/webpack/webpack-cli/issues/2311)) ([9a74ad0](https://github.com/webpack/webpack-cli/commit/9a74ad08b984325a63d953c685496e48700a2caf))

## [1.2.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.2.0...@webpack-cli/generators@1.2.1) (2020-12-31)

### Bug Fixes

-   the `--help` option is working without `webpack-dev-server` ([#2267](https://github.com/webpack/webpack-cli/issues/2267)) ([1dae54d](https://github.com/webpack/webpack-cli/commit/1dae54da94d3220437b9257efe512447023de1d3))

# [1.2.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.1.0...@webpack-cli/generators@1.2.0) (2020-12-25)

### Bug Fixes

-   typos in options

### Features

-   union generators

# [1.1.0](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.2...@webpack-cli/generators@1.1.0) (2020-11-04)

### Bug Fixes

-   **generators:** correct optimization.splitChunks option in config ([#2008](https://github.com/webpack/webpack-cli/issues/2008)) ([f86ef2d](https://github.com/webpack/webpack-cli/commit/f86ef2d6c0a4cba3b2002baf32b78e06cbaafc4a))

### Features

-   export utils from core for other packages ([#2011](https://github.com/webpack/webpack-cli/issues/2011)) ([3004549](https://github.com/webpack/webpack-cli/commit/3004549c06b3fe00708d8e1eecf42419e0f72f66))

## [1.0.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.1...@webpack-cli/generators@1.0.2) (2020-10-19)

### Bug Fixes

-   output stacktrace on errors ([#1949](https://github.com/webpack/webpack-cli/issues/1949)) ([9ba9d6f](https://github.com/webpack/webpack-cli/commit/9ba9d6f460fb25fb79d52f4360239b8c4b471451))

## [1.0.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.1-rc.1...@webpack-cli/generators@1.0.1) (2020-10-10)

### Bug Fixes

-   cleanup `package-utils` package ([#1822](https://github.com/webpack/webpack-cli/issues/1822)) ([fd5b92b](https://github.com/webpack/webpack-cli/commit/fd5b92b3cd40361daec5bf4486e455a41f4c9738))
-   upgrade lock file ([#1885](https://github.com/webpack/webpack-cli/issues/1885)) ([8df291e](https://github.com/webpack/webpack-cli/commit/8df291eef0fad7c91d912b158b3c2915cddfacd1))

## [1.0.1-rc.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.5...@webpack-cli/generators@1.0.1-rc.1) (2020-10-06)

### Bug Fixes

-   **generators:** fix and refactor entry util, add tests ([#1392](https://github.com/webpack/webpack-cli/issues/1392)) ([219c633](https://github.com/webpack/webpack-cli/commit/219c633e284518fe9c638d26a49d79394f0b6d68))
-   **generators:** fix generators init loader's test regex ([#1309](https://github.com/webpack/webpack-cli/issues/1309)) ([62e0314](https://github.com/webpack/webpack-cli/commit/62e03143ba3b8752665a5ff6ff134daadbe9c2bc))
-   **generators:** fix small issues with generators ([#1385](https://github.com/webpack/webpack-cli/issues/1385)) ([f62c60d](https://github.com/webpack/webpack-cli/commit/f62c60d0a52fd6294ead8e0ee9310d017fe21807))
-   add necessary peerDependencies ([#1825](https://github.com/webpack/webpack-cli/issues/1825)) ([0f13ab5](https://github.com/webpack/webpack-cli/commit/0f13ab5ddd9e28e5e7095721d086a58aebaf98a5))
-   generated loader template ([#1720](https://github.com/webpack/webpack-cli/issues/1720)) ([a380a78](https://github.com/webpack/webpack-cli/commit/a380a785c296208af7017f547cd34cf72517f9da))

## [1.0.1-alpha.5](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.4...@webpack-cli/generators@1.0.1-alpha.5) (2020-03-02)

**Note:** Version bump only for package @webpack-cli/generators

## [1.0.1-alpha.4](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.3...@webpack-cli/generators@1.0.1-alpha.4) (2020-02-29)

**Note:** Version bump only for package @webpack-cli/generators

## [1.0.1-alpha.3](https://github.com/ematipico/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.2...@webpack-cli/generators@1.0.1-alpha.3) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/generators

## [1.0.1-alpha.2](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.1...@webpack-cli/generators@1.0.1-alpha.2) (2020-02-23)

**Note:** Version bump only for package @webpack-cli/generators

## [1.0.1-alpha.1](https://github.com/webpack/webpack-cli/compare/@webpack-cli/generators@1.0.1-alpha.0...@webpack-cli/generators@1.0.1-alpha.1) (2020-02-23)

### Bug Fixes

-   **cli:** fix file resolution inside group helper ([#1221](https://github.com/webpack/webpack-cli/issues/1221)) ([76d2eb3](https://github.com/webpack/webpack-cli/commit/76d2eb316ab154c19ebf639b7d6c82df76dc0695))
