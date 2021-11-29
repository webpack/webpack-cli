# webpack-cli init

`webpack-cli init` is used to initialize `webpack` projects quickly by scaffolding configuration and creating a runnable project with all the dependencies based on the user preferences.

## Table of Contents

- [Initial Setup](#initial-setup)
  - [Local Setup](#local-setup)
  - [Global Setup](#global-setup)
- [Usage](#usage)
  - [Running Locally](#running-locally)
  - [Running Globally](#running-globally)
  - [CLI options](#cli-options)
- [Description of questions asked by the generator](#description-of-questions-asked-by-the-generator)
  - [Default Template](#default-template)

## Setup

Install `webpack` and `webpack-cli` as devDependencies

```shell
npm install --save-dev webpack webpack-cli
```

## Usage

### Running Locally

```bash
npx webpack-cli init
```

### Running Globally

```shell
webpack-cli init
```

### CLI options

**To generate default template**

```bash
webpack-cli init
```

**To generate with default answers**

```bash
webpack-cli init -f, --force
```

**To scaffold in a specified path**

```bash
webpack-cli init [generation-path]
```

**To scaffold specified template**

```bash
webpack-cli init -t, --template <template-name>
```

## Description of questions asked by the generator

### Default template

1. `Which of the following JS solutions do you want to use?`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .js, .ts and other related files)_

This enables webpack to parse [`ES2015`](https://babeljs.io/learn-es2015/) code or Typescript code as per choice.

2. `Do you want to use webpack-dev-server?`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/dev-server/)_

Adds a development server to serve webpack bundles and hence make development faster.

3. `Do you want to simplify the creation of HTML files for your bundle?`

Adds `html-webpack-plugin` that simplifies creation of HTML files to serve your bundles.

4. `Do you want to add PWA support?`

Adds [`workbox-webpack-plugin`](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) which generates a complete service worker for you.

5. `Which of the following CSS solutions do you want to use?`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .css files)_

If you use any sort of style in your project, such as [`.css`](https://developer.mozilla.org/en-US/docs/Web/CSS) you will need to select this here. If you don't use CSS, answer `none`.
