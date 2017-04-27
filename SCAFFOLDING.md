# Introduction

Setting up webpack for the first time is hard. Writing advanced configurations like offline support for [PWA](https://developers.google.com/web/progressive-web-apps/)'s are even harder. The `init` feature is designed to support people that want to create their own configuration or initializing other projects people create.

Through yeoman, the `webpack --init` feature allows people to create scaffolds and generate new projects quickly. An npm dependency that scaffolds a `webpack.config.js` through `webpack-cli` is what we refer to as an **addon**.

## Writing a good scaffold

Before writing any code, you should analyze your purpose for the scaffold. Should it be generalistic? Should it be targeted for a library, such as [react](https://facebook.github.io/react/)? Furthermore, you should decide if you want to make user interactions in your `addon`, or just scaffold an boilerplate with preconfigured settings.

## webpack-addons

[`webpack-addons`](https://github.com/webpack-contrib/webpack-addons) is a utility suite for creating addons. It contains functions that could be of use for creating an addon yourself.

## webpack-addons-yourpackage

In order for `webpack-cli` to compile your package, it relies on a prefix of `webpack-addons`. The package must also be published on npm. If you are curious about how you can create your very own `addon`, please read [How do I compose a webpack-addon?](https://github.com/ev1stensberg/webpack-addons-demo).

## API

To create an `addon`, you must create a [`yeoman-generator`](http://yeoman.io/authoring/). Because of that, you can optionally extend your generator to include methods from the [Yeoman API](http://yeoman.io/learning/). Its worth noting that we support all the properties of a regular webpack configuration. In order for us to do this, there's a thing you need to remember.

Objects are made using strings, while strings are made using double strings. This means that in order for you to create an string, you have to wrap it inside another string for us to validate it correctly.


### `opts.env.configuration`
### `opts.env.configuration.myObj`
### `myObj.webpackOptions`
### `merge`
### `myObj.topScope`
### `myObj.configName`
