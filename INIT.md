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

**To force config generation**

```bash
webpack-cli init --force
```

**To scaffold in a specified path**

```bash
webpack-cli init --generation-path [path]
```

**Via custom scaffold**

```bash
webpack-cli init webpack-scaffold-[name]
```

### Description of questions asked by the generator

1. `Will your application have multiple bundles? (y/N)`

> _Property/key resolved: [entry](https://webpack.js.org/configuration/entry-context/#entry)_

This is used to determine if your app will have multiple [entry points](https://webpack.js.org/configuration/entry-context/#entry).
If you want to have multiple entry points, answer yes. If you want to have only one, answer no.

2. `Which will be your application entry point? (src/index)`

> _Property/key resolved: [entry](https://webpack.js.org/configuration/entry-context/#entry)_

This tells webpack from which file to start bundling your application. The default answer `src/index` will tell webpack to look for a file called `index` inside a folder named `src`.

3. `In which folder do you want to store your generated bundles? (dist)`

> _Property/key resolved: [output.path](https://webpack.js.org/configuration/output/#output-path)_

The output directory is where your bundled application will be. Your `index.html` will read the generated files from this folder, that is usually named `dist`.

4. `Will you be using ES2015? (Y/n)`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .js files)_

This enables webpack to parse [`ES2015`](https://babeljs.io/learn-es2015/) code. Answer `Yes` if you want to use modern JavaScript in your project.

5. `Will you use one of the below CSS solutions?`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .scss,.less,.css,.postCSS files)_

If you use any sort of style in your project, such as [`.less`](http://lesscss.org/), [`.scss`](http://sass-lang.com/), [`.css`](https://developer.mozilla.org/en-US/docs/Web/CSS) or [`postCSS`](http://postcss.org/) you will need to declare this here. If you don't use CSS, answer no.

6. `If you want to bundle your CSS files, what will you name the bundle? (press enter to skip)`

If you indicate based on previous questions that you are using production, this will be enabled. The default value for your generated CSS file is `style.[contentHash].css`, which will collect all your `.less`, `.scss` or `.css` into one file. This will make your build faster in production.

7. `Do you want to use webpack-dev-server?`

> _Property/key resolved: [module.rules](https://webpack.js.org/configuration/dev-server/)_

Adds a development server to serve webpack bundles and hence make development faster.

8. `Do you want to simplify the creation of HTML files for your bundle?`

Adds `html-webpack-plugin` that simplifies creation of HTML files to serve your bundles.

9. `Do you want to add PWA support?`

Adds `workbox-webpack-plugin` which generates a complete service worker for you and one that generates a list of assets to precache that is injected into a service worker file.
