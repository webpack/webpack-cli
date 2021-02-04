# webpack-cli init

`webpack-cli init` is used to initialize `webpack` projects quickly by scaffolding configuration and creating a runnable project with all the dependencies based on the user preferences.

## Table of Contents

-   [Initial Setup](#initial-setup)
    -   [Local Setup](#local-setup)
    -   [Global Setup](#global-setup)
-   [Usage](#usage)
    -   [Running Locally](#running-locally)
    -   [Running Globally](#running-globally)
    -   [CLI options](#cli-options)
    -   [Description of questions asked by generator](#description-of-questions-asked-by-generator)

## Initial Setup

### Local Setup

These are the steps necessary to set up `webpack-cli init` locally:

1. Create `package.json` through npm

    ```shell
    npm init
    ```

2. Install `webpack` and `webpack-cli` as devDependencies

    ```shell
    npm install --save-dev webpack webpack-cli
    ```

3. Install `@webpack-cli/init` package to add the init scaffold

    ```shell
    npm install --save-dev @webpack-cli/init
    ```

### Global Setup

These are the steps necessary to set up `webpack-cli init` globally:

1. Install `webpack` and `webpack-cli` globally

    ```shell
    npm install -g webpack webpack-cli
    ```

2. Install `@webpack-cli/init` package to add the create scaffold

    ```shell
    npm install -g @webpack-cli/init
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

**Via defaults**

```bash
webpack-cli init
```

**To generate default configs**

```bash
webpack-cli init --auto
```

**To scaffold in a specified path**

```bash
webpack-cli init --generation-path [path]
```

**Via custom scaffold**

```bash
webpack-cli init webpack-scaffold-[name]
```
