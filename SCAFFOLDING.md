# Introduction

Let's face it. Setting up webpack for the first time is hard. Writing advanced configurations like support for [PWA](https://developers.google.com/web/progressive-web-apps/)'s are even harder. The `init` feature is designed to support people to create their own configuration or initializing other projects people have created.

Through yeoman, the `webpack --init` feature allows people to create scaffolds and generate new projects quickly, or to integrate a scaffold with other tools. A dependency with an scaffold, is what we refer to as an **addon**.

## Writing a good scaffold

Before writing any code, you should analyze your purpose for the scaffold. Should it be generalistic? Should it be targeted for a library, such as [react](https://facebook.github.io/react/)? Furthermore, you should decide if you want to ask users for your scaffold such as **"What is your entry point?"**. Through yeoman, we support building up a configuration based on user interactions. You can also avoid any input from the user if you simply want to create a configuration to start working with.

## API

To build a great scaffold, you got to know the API. As we are running the scaffolding through yeoman, we support [their API](http://yeoman.io/learning/).

To create an addon, you create a [`yeoman-generator`](http://yeoman.io/authoring/). In the generator, you can create all the properties webpack has, as well as custom logic on top.

Before going forward, please read [How do I compose a webpack-addon?]()

## webpack-addons
