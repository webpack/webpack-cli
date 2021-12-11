# create-webpack-app

`create-webpack-app` is used to initialize `webpack` projects quickly by scaffolding configuration and creating a runnable project with all the dependencies based on the user preferences.

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
npx create-webpack-app
```

### Running Globally

```shell
create-webpack-app
```

### CLI options

**To generate default template**

```bash
create-webpack-app
```

**To generate with default answers**

```bash
create-webpack-app -f, --force
```

**To scaffold in a specified path**

```bash
create-webpack-app [generation-path]
```

**To scaffold specified template**

```bash
create-webpack-app -t, --template <template-name>
```
