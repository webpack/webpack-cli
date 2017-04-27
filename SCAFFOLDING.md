# Introduction

Setting up webpack for the first time is hard. Writing advanced configurations like offline support for [PWA](https://developers.google.com/web/progressive-web-apps/)'s are even harder. The `init` feature is designed to support people that want to create their own configuration or initializing other projects people create.

Through yeoman, the `webpack --init` feature allows people to create scaffolds and generate new projects quickly. An npm dependency that scaffolds a `webpack.config.js` through `webpack-cli` is what we refer to as an **addon**.

## Writing a good scaffold

Before writing any code, you should analyze your purpose for the scaffold. Should it be generalistic? Should it be targeted for a library, such as [react](https://facebook.github.io/react/)? Furthermore, you should decide if you want to ask users for your scaffold such as **"What is your entry point?"**, or scaffold a boilerplate.

## webpack-addons

[`webpack-addons`](https://github.com/webpack-contrib/webpack-addons) is a utility suite for creating addons. It contains functions that could be of use for creating an addon yourself.

## webpack-addons-yourpackage

In order for `webpack-cli` to compile your package, it relies on a prefix of `webpack-addons`. The package must also be published on npm. If you are curious on how to create your very own `addon`, please read [How do I compose a webpack-addon?](https://github.com/ev1stensberg/webpack-addons-demo).

## API

To build a great scaffold, you got to know the API. As we are running the scaffolding through yeoman, we support [their API](http://yeoman.io/learning/). To create an addon, you must create a [`yeoman-generator`](http://yeoman.io/authoring/). In the generator, you can create all the properties webpack has, as well as custom logic on top.

- `opts.env.configuration`
- `opts.env.configuration.myObj`
- `myObj.webpackOptions`
 - `merge`
- `myObj.topScope`
- `myObj.configName`
