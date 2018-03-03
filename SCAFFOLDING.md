# Introduction

Setting up webpack for the first time is hard. Writing advanced configurations to optimize performance is even harder. The `init` feature is designed to support people that want to create their own configuration or initializing other projects people create.

## Writing a good scaffold

Before writing a `webpack-cli` scaffold, think about what you're trying to achieve. Do you want a "general" scaffold that could be used by any project or type of app? Do you want something very focused - like a scaffold that writes both your `webpack.config.js` and your framework code? It's also useful to think about the user experience for your scaffold.

`webpack-cli` offers an experience that is interactive and you can prompt users for questions (like, "What is your entry point?") to help customize the output accordingly.

## webpack-addons

[`webpack-addons`](https://github.com/webpack-contrib/webpack-addons) is a utility suite for creating addons. It contains functions that could be of use for creating an addon yourself.

## webpack-addons-yourpackage

In order for `webpack-cli` to compile your package, it must be available on npm or on your local filesystem. If you are curious about how you can create your very own `addon`, please read [How do I compose a
webpack-addon?](https://github.com/ev1stensberg/webpack-addons-demo).

If the package is on npm, its name must have a prefix of `webpack-addons`.

If the package is on your local filesystem, it can be named whatever you want. Pass the path to the package.

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
