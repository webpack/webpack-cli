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

A scaffold can be executed using [`webpack-cli init`](./INIT.md): 

```js
webpack-cli init <your-scaffold>
```

#### Running a scaffold locally
When the scaffold package is in you local file system you should pass its path to `init`:

```bash
webpack-cli init path/to/your/scaffold
```

Or you can create a global module and symlink to the local one:

* Using npm

	```bash
	cd path/to/my-scaffold
	npm link
	webpack-cli init my-scaffold
	```

* Using yarn

	```bash
	cd path/to/my-scaffold
	yarn link
	webpack-cli init my-scaffold

#### Running a scaffold from npm

If the package is in npm, its name must begin with `webpack-scaffold` and can be used running:

```js
webpack-cli init webpack-scaffold-yourpackage
```


## API

To create a `scaffold`, you must create a [`yeoman-generator`](http://yeoman.io/authoring/). Because of that, you can optionally extend your generator to include methods from the [Yeoman API](http://yeoman.io/learning/). It's worth noting that we support all the properties of a regular webpack configuration. In order for us to do this, there's a thing you need to remember:

> Objects are made using strings, while strings are made using double strings. This means that in order for you to create a string, you have to wrap it inside another string for us to validate it correctly.

### Required
- [opts.env.configuration](#optsenvconfiguration-required)
- [opts.env.configuration.myObj](#optsenvconfigurationmyObj-required)
- [myObj.webpackOptions](#myObjwebpackOptions-required)
- [writing()](#writing()-required)
  
### Optional
- [myObj.merge](#myObjmerge-optional)
- [myObj.topScope](#myObjtopScope-optional)
- [myObj.configName](#myObjconfigName-optional)

### `opts.env.configuration`(required)

This is the entry point your configuration, initialize it inside the constructor of your generator in order for the CLI to work:

```js
constructor(args, opts) {
	super(args, opts);
	opts.env.configuration = {};
}
```
### `opts.env.configuration.myObj` (required)

This is your scaffold, you add here the options that the CLI will transform into a webpack configuration. You can have many different scaffolds named as you prefer, representing different configurations like `dev.config` or `prod.config`:

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

This object has the same format as a regular webpack configuration, so you declare here the properties that you want to scaffold, like `entry`, `output` and `context`. You can initialize this inside a yeoman method:

```js
this.options.env.configuration.dev.webpackOptions = {
	entry: '\'app.js\'',
	output: {...}
};
```

### `myObj.merge` (optional)

If you want to use [`webpack-merge`](https://github.com/survivejs/webpack-merge), you can set the `merge` property of `myObj` to the name of the configuration you want to merge it with: 

```js
this.options.env.configuration.dev.merge = 'myConfig';
```

### `myObj.topScope`(optional)

The `topScope` property is where you write all the code needed by your configuration, like module imports and functions/variables definitions:

```js
this.options.env.configuration.dev.topScope = [
	'const webpack = require(\'webpack\');',
	'const path = require(\'path\');'
];
```

### `myObj.configName`(optional)

`configName` allows you to customize the name of your configuration file. For example you can name it `webpack.base.js` instead of the default `webpack.config.js`:

```js
this.options.env.configuration.dev.configName = 'base';
```

### `writing` (required)

For the scaffolding instance to run, you need to write your configuration to a `.yo-rc.json` file. This could be done using one of the lifecycles in the yeoman generator, such as the `writing` method:

```js
writing() {
	this.config.set('configuration', myObj)
}
```
