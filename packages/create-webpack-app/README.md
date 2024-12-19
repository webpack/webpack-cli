<div>
    <a href="https://github.com/webpack/webpack-cli">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>

# create-webpack-app CLI

## About

- `create-webpack-app` is a cli tool that enables developers to scaffold a new webpack project quickly. It provides developers with a flexible set of commands to increase speed when setting up a custom webpack project. webpack CLI addresses these needs by providing tools to improve the setup of custom webpack configuration.
- It also supports several front-end frameworks and libraries like React, Vue, Svelte and pure project.
- Webpack Loader and Plugin scaffolding is also supported.

## Supported arguments and commands

### Usage

```bash
npx @webpack-cli/create-webpack-app [command] [options]
```

### Commands

- `init` (also used by default when nothing specified) - project generator
- `loader` - loader generator
- `plugin` - plugin generator

### CLI options

**To generate default template**

```bash
npx @webpack-cli/create-webpack-app
```

**To generate with default answers**

```bash
npx @webpack-cli/create-webpack-app -f
```

or

```bash
npx @webpack-cli/create-webpack-app --force
```

**To generate in a specified path**

```bash
npx @webpack-cli/create-webpack-app [generation-path]
```

**To generate a project according to a template**

```bash
npx @webpack-cli/create-webpack-app --template <template-name>
```

Available templates:

- `default` (used by default when nothing specified) - generate a basic template for JS(TS)/CSS/HTML without any frameworks
- [`react`](https://react.dev/)
- [`vue`](https://vuejs.org/)
- [`svelte`](https://svelte.dev/)

Available templates for `loader` and `plugin` generators:

- `default` (used by default when nothing specified) - generate bootstrap code
