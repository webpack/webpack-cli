<div align="center">
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

# webpack CLI

The official CLI of webpack

## About

webpack CLI provides a flexible set of commands for developers to increase speed when setting up a custom webpack project. As of webpack v4, webpack is not expecting a configuration file, but often developers want to create a more custom webpack configuration based on their use-cases and needs. webpack CLI addresses these needs by providing a set of tools to improve the setup of custom webpack configuration.

## How to install

When you have followed the [Getting Started](https://webpack.js.org/guides/getting-started/) guide of webpack then webpack CLI is already installed!

Otherwise

```bash
npm install --save-dev webpack-cli
```

or

```bash
yarn add webpack-cli --dev
```

## Supported arguments and commands

### Usage

All interactions with webpack-cli are of the form

```bash
npx webpack-cli [command] [options]
```

If no command is specified then `bundle` command is used by default

### Help Usage

You display basic commands and arguments -

```bash
npx webpack-cli --help
```

To display all supported commands and arguments -

```bash
npx webpack-cli --help=verbose
```

or

```bash
npx webpack-cli --help verbose
```

### Available Commands

```
  bundle | b      Run webpack
  help | h        Display help for commands and options
  version | v     Output version number of the 'webpack', 'webpack-cli' and other related packages
  init | c        Initialize a new webpack configuration
  migrate | m     Migrate a configuration to a new version
  loader | l      Scaffold a loader repository
  plugin | p      Scaffold a plugin repository
  info | i        Outputs information about your system and dependencies
  serve | s       Run the webpack Dev Server
  configtest | t  Tests webpack configuration against validation errors.
```

### webpack 4

```
  --analyze                     It invokes webpack-bundle-analyzer plugin to get bundle information
  --entry string[]              The entry point(s) of your application.
  -c, --config string[]         Provide path to webpack configuration file(s)
  --config-name string[]        Name of the configuration to use
  -m, --merge                   Merge several configurations using webpack-merge
  --progress string, boolean    Print compilation progress during build
  --color                       Enables colors on console
  --no-color                    Disable colors on console
  --env string[]                Environment passed to the configuration when it is a function
  --name string                 Name of the configuration. Used when loading multiple configurations
  --help                        Outputs list of supported flags
  -o, --output-path string      Output location of the generated bundle
  -t, --target string[]         Sets the build target
  -w, --watch                   Watch for files changes
  --no-watch                    Do not watch for file changes
  -h, --hot                     Enables Hot Module Replacement
  --no-hot                      Disables Hot Module Replacement
  -d, --devtool string          Controls if and how source maps are generated.
  --no-devtool                  Do not generate source maps
  --prefetch string             Prefetch this request
  -j, --json string, boolean    Prints result as JSON or store it in a file
  --mode string                 Defines the mode to pass to webpack
  -v, --version                 Get current version
  --stats string, boolean       It instructs webpack on how to treat the stats
  --no-stats                    Disables stats output
```

### webpack 5

Checkout [`OPTIONS.md`](../../OPTIONS.md) to see list of all available options.
