 # Generator-Webpack-Scaffold

> This package will let you create your own custom webpack scaffold


## Installation


```bash
$ npm install
$ npm run run
```

This will create a folder with name webpack-scaffold-<your-scaffold-name>
Now you can work on this project folder to write your custom scaffold
*yup thats it*

To work on the scaffold project, navigate to your created scaffold using

```bash
cd webpack-scaffold-<your-scaffold-name>

```

And start editing in `generator.js`.

Add your custom questions in `utils/questions.js`.

Your config file options goes here : `utils/dev-config.js`.

We used the `@webpack-cli/webpack-scaffold` package for config APIs you can check the guide [here](https://github.com/webpack/webpack-cli/tree/master/packages/webpack-scaffold).

The scaffold create is on top of [yeoman-generator](http://yeoman.io/authoring/) project with which we can use the [yeoman-api](http://yeoman.io/learning/).

