<div>
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

# create-webpack-app CLI

## About

- `create-webpack-app` is a cli tool that enables developers to scaffold a new webpack project quickly. It provides developers with a flexible set of commands to increase speed when setting up a custom webpack project. webpack CLI addresses these needs by providing tools to improve the setup of custom webpack configuration.
- It also supports several front-end frameworks and libraries like React, Angular, Vue, Svelte, etc.
- Webpack Loader and Plugin scaffolding is also supported.

## Supported arguments and commands

### Usage

```bash
npx create-webpack-app [command] [options]
```

### CLI options

**To generate default template**

```bash
npx create-webpack-app
```

**To generate with default answers**

```bash
npx create-webpack-app -f, --force
```

**To scaffold in a specified path**

```bash
npx create-webpack-app [generation-path]
```

**To scaffold in a specified path with a custom project-name**

```bash
npx create-webpack-app [generation-path] [project-name]
```
