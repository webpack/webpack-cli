# Introduction

Setting up webpack for the first time is hard. Writing advanced configurations to optimize performance is even harder. The `init` feature is designed to support people that want to create their own configuration or initializing other projects people create.

## webpack init

Through [yeoman](http://yeoman.io/), the `webpack-cli init` feature allows people to create scaffolds and generate new projects quickly. An npm dependency that scaffolds a `webpack.config.js` through `webpack-cli` is what we refer to as an **addon**.

We ask several questions in the default generator to get you started.

---

1. `Will you be creating multiple bundles? (Y/n)`

What we are meaning here, is if you want to provide your bundle a single or multiple [entry points](https://webpack.js.org/configuration/entry-context/#entry). If you have only one entry to your app, answer yes. If you got more modules you want to bundle, answer no.

2. `Which folder will your generated bundles be in? [default: dist]`

This answers to the output directory of your application. The output directory is where servers or your `index.html` will read the generated bundle from.

3. `Are you going to use this in production? (Y/n)`

If you answer `Yes` to this, we add [`ExtractTextPlugin`](https://github.com/webpack-contrib/extract-text-webpack-plugin) to your project. This means that your style files will be separated in production from the bundles where they are used. If you answer `No`, we will not use the plugin, and `Question 6` will be ignored by default.

4. `Will you be using ES2015? (Y/n)`

If you answer `Yes` to this question, we will add [`ES2015`](https://babeljs.io/learn-es2015/) to your webpack configuration, which will allow you to use modern JavaScript in your project.

5. `Will you use one of the below CSS solutions?`

If you use any sort of style in your project, such as [`.less`](http://lesscss.org/), [`.scss`](http://sass-lang.com/),  [`.css`](https://developer.mozilla.org/en-US/docs/Web/CSS) or [`postCSS`](http://postcss.org/) you will need to declare this here. If you don't use CSS, answer no.

6. `If you want to bundle your CSS files, what will you name the bundle? (press 
enter to skip)`

If you answered `Yes` to `Question 3`, this will be enabled. The default value for your generated CSS file is `style.[contentHash].css`, which will collect all your `.less`, `.scss` or `.css` into one file. This will make your build faster in production.

7. `Name your 'webpack.[name].js?' [default: 'prod/config']`

If you answered `Yes` to `Question 3`, the default name of your configuration will be `webpack.prod.js`, otherwise it will be `webpack.config.js` if you don't supply an answer. Other good options to answer to this question is: `dev`, `base`, `production` or `development`.


## Writing a good scaffold

Before writing a `webpack-cli` scaffold, think about what you're trying to achieve. Do you want a "general" scaffold that could be used by any project or type of app? Do you want something very focused - like a scaffold that writes both your `webpack.config.js` and your framework code? It's also useful to think about the user experience for your scaffold.

`webpack-cli` offers an experience that is interactive and you can prompt users for questions (like, "What is your entry point?") to help customize the output accordingly.

## webpack-addons

[`webpack-addons`](https://github.com/webpack-contrib/webpack-addons) is a utility suite for creating addons. It contains functions that could be of use for creating an addon yourself.

## webpack-addons-yourpackage

In order for `webpack-cli` to compile your package, it relies on a prefix of `webpack-addons`. The package must also be published on npm. If you are curious about how you can create your very own `addon`, please read [How do I compose a webpack-addon?](https://github.com/ev1stensberg/webpack-addons-demo).

## API

To create an `addon`, you must create a [`yeoman-generator`](http://yeoman.io/authoring/). Because of that, you can optionally extend your generator to include methods from the [Yeoman API](http://yeoman.io/learning/). Its worth noting that we support all the properties of a regular webpack configuration. In order for us to do this, there's a thing you need to remember.

Objects are made using strings, while strings are made using double strings. This means that in order for you to create an string, you have to wrap it inside another string for us to validate it correctly.


### `opts.env.configuration`(Required)

Initialized inside the constructor of your generator in order for the CLI to work.

```js
constructor(args, opts) {
		super(args, opts);
		opts.env.configuration = {};
	}
```
### `opts.env.configuration.myObj` (required)

`myObj` is your scaffold. This is where you will add options for the CLI to transform into a configuration. You can name it anything, and you can also add more objects, that could represent a `dev.config` or `prod.config`.

```js
constructor(args, opts) {
		super(args, opts);
		opts.env.configuration = {
			dev: {},
			prod: {}
		};
	}
```

### `myObj.webpackOptions` (required)

As with a regular webpack configuration, this property behaves the same. Inside `webpackOptions` you can declare the properties you want to scaffold. You can for instance, scaffold `entry`, `output` and `context`.

(Inside a yeoman method)
```js
this.options.env.configuration.dev.webpackOptions = {
entry: '\'app.js\'',
output: {....},
merge: 'myConfig'
};
```
If you want to use `webpack-merge`, you can supply `webpackOptions` with the merge property, and the configuration you want to merge it with. 

### `myObj.topScope`(optional)

The `topScope` property is a way for the authors to add special behaviours, like functions that could be called inside a configuration, or variable initializations and module imports. 

```js
this.options.env.configuration.dev.topScope = [
'var webpack = require(\'webpack\');'
'var path = require(\'path\');'
];
```

### `myObj.configName`(optional)

If you want to name your `webpack.config.js` something special, you can do that.

```js
this.options.env.configuration.dev.configName = 'base';
```
