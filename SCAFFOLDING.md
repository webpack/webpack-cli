# Introduction

Setting up webpack for the first time is hard. Writing advanced configurations to optimize performance is even harder. The `init` feature is designed to support people that want to create their own configuration or initializing other projects people create.

## Creating a scaffold

Before writing a `webpack-cli` scaffold, think about what you're trying to achieve. Do you want a "general" scaffold that could be used by any project or type of app? Do you want something very focused, like a scaffold that writes both your `webpack.config.js` and your framework code? It's also useful to think about the user experience for your scaffold.

`webpack-cli` offers an experience that is interactive and you can prompt users for questions (like, "What is your entry point?") to help customize the output accordingly.

### Writing a scaffold

There are many resources where you can learn how to write a scaffold, you can start from: [How do I compose a
webpack-scaffold?](https://github.com/evenstensberg/webpack-scaffold-demo)


[`webpack-scaffold`](./packages/webpack-scaffold) is a utility suite for creating scaffolds. It contains functions that could be used to create a scaffold.


### Running a scaffold

A scaffold can be executed running: 

```js
webpack-cli init <your-scaffold>
```

#### Running a scaffold locally
When the scaffold package is on you local file system you should pass its path to `init`:

```js
webpack-cli init path/to/your/scaffold
```

#### Running a scaffold from npm

If the package is on npm, its name must begin with `webpack-scaffold` and can be used running:

```js
webpack-cli init webpack-scaffold-yourpackage
```


## API

To create a `scaffold`, you must create a [`yeoman-generator`](http://yeoman.io/authoring/). Because of that, you can optionally extend your generator to include methods from the [Yeoman API](http://yeoman.io/learning/). Its worth noting that we support all the properties of a regular webpack configuration. In order for us to do this, there's a thing you need to remember.

Objects are made using strings, while strings are made using double strings. This means that in order for you to create a string, you have to wrap it inside another string for us to validate it correctly.

### Required
- [opts.env.configuration](#`opts.env.configuration`-(required))
- [opts.env.configuration.myConfig](#`opts.env.configuration.myConfig`-(required))
- [myConfig.webpackOptions](#`myConfig.webpackOptions`-(required))
- [writing()](#`writing()`-(required))
  
### Optional
- [myConfig.merge](#`myConfig.merge`-(optional))
- [myConfig.topScope](#`myConfig.topScope`-(optional))
- [myObj.configName](#`myObj.configName`-(optional))

### `opts.env.configuration` (required)

Is initialized inside the constructor of your generator in order for the CLI to work.

```js
constructor(args, opts) {
	super(args, opts);
	opts.env.configuration = {};
}
```

### `opts.env.configuration.myConfig` (required)

Every `myConfig` will be transformed into a webpack configuration. You can name those keys as you prefer (e.g. `dev`, `prod`):

```js
constructor(args, opts) {
	super(args, opts);
	opts.env.configuration = {
		dev: {},
		prod: {}
	};
}
```

### `myConfig.webpackOptions` (required)

This object behaves as a regular webpack configuration, you declare here  properties you want to scaffold, like `entry`, `output` and `context`:

(Inside a yeoman method)

```js
this.options.env.configuration.dev = 
	webpackOptions: {
		entry: '\'app.js\'',
		output: {....}
	}
};
```

### `writing()` (required)

For the scaffolding instance to run, you need to write your configuration to a `.yo-rc.json` file. This could be done using one of the lifecycles in the yeoman generator, such as the `writing` method:

```js
writing() {
	this.config.set('configuration', myObj)
}
```

### `myConfig.merge` (optional)

If you want to use `webpack-merge`, you can set the `merge` property with the name of the configuration you want to merge with:

```js
this.options.env.configuration.dev = {
	merge: 'anotherConfig'
};
```

### `myConfig.topScope` (optional)

The `topScope` property is a way for the to add special behaviours to your scaffold, like functions that could be called inside a configuration, variable initializations and module imports:

```js
this.options.env.configuration.dev.topScope = [
	'var webpack = require(\'webpack\');'
	'var path = require(\'path\');'
];
```

### `myObj.configName` (optional)

Used if you want to name your `webpack.config.js` differently:

```js
this.options.env.configuration.dev.configName = 'base';
```
