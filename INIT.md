# webpack-cli init

`webpack-cli init` is used to initialize `webpack` projects quickly by scaffolding configuration and installing modules required for the project as per user preferences.

## Initial Setup
A. **Local setup**

Follow given steps to locally setup `webpack-cli init` by installing dependencies:
1. Create `package.json` through npm.

	```shell
	$ npm init
	```

2. Install `webpack` and `webpack-cli` as devDependencies.

	```shell
    $ npm install --save-dev webpack webpack-cli
    ```

3. Install `@webpack-cli/init` package to add init addon.

	```shell
    $ npm install --save-dev @webpack-cli/init
    ```
	
B. **Global Setup**

Follow following steps to setup `webpack-cli init` globally:
1. Install `webpack` and `webpack-cli` globally.
	```shell
	$ npm install -g webpack webpack-cli
	```
	
2. Install `@webpack-cli/init` package to add init addon.
	```shell
	$ npm install -g @webpack-cli/init
	```
    
## Usage
A. **For local setup**:
```shell
$ npx webpack-cli init
```

B. **For global setup**
```shell
$ webpack-cli init
```

### Description of questions asked by generator

1. `Will your application have multiple bundles? (Y/n)`

> *Property/key to resolve: [entry](https://webpack.js.org/configuration/entry-context/#entry)*

What we are meaning here, is if you want to provide your bundle a single or multiple [entry points](https://webpack.js.org/configuration/entry-context/#entry). If you have more than one entry point to your app, answer yes. If you only have one, answer no.

2. `Which folder will your generated bundles be in? [default: dist]`

> *Property/key to resolve: [output.path](https://webpack.js.org/configuration/output/#output-path)*

This answers to the [output directory](https://webpack.js.org/configuration/output/#output-path) of your application. The output directory is where servers or your `index.html` will read the generated bundle from.

4. `Will you be using ES2015? (Y/n)`

> *Property/key to resolve: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .js files)*

If you answer `Yes` to this question, we will add [`ES2015`](https://babeljs.io/learn-es2015/) to your webpack configuration, which will allow you to use modern JavaScript in your project.

5. `Will you use one of the below CSS solutions?`

> *Property/key to resolve: [module.rules](https://webpack.js.org/configuration/module/#module-rules) (for .scss,.less,.css,.postCSS files)*

If you use any sort of style in your project, such as [`.less`](http://lesscss.org/), [`.scss`](http://sass-lang.com/),  [`.css`](https://developer.mozilla.org/en-US/docs/Web/CSS) or [`postCSS`](http://postcss.org/) you will need to declare this here. If you don't use CSS, answer no.

6. `If you want to bundle your CSS files, what will you name the bundle? (press 
enter to skip)`

If you indicate based on previous questions that you are using production, this will be enabled. The default value for your generated CSS file is `style.[contentHash].css`, which will collect all your `.less`, `.scss` or `.css` into one file. This will make your build faster in production.
