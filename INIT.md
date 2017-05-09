## webpack init

Through [yeoman](http://yeoman.io/), the `webpack-cli init` feature allows people to create scaffolds and generate new projects quickly. An npm dependency that scaffolds a `webpack.config.js` through `webpack-cli` is what we refer to as an **addon**.

We ask several questions in the default generator to get you started.

---

1. `Will your application have multiple bundles? (Y/n)`

What we are meaning here, is if you want to provide your bundle a single or multiple [entry points](https://webpack.js.org/configuration/entry-context/#entry). If you have more than one entry point to your app, answer yes. If you only have one, answer no.

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

If you answered `Yes` to `Question 3`, the default name of your configuration will be `webpack.prod.js`, otherwise it will be `webpack.config.js` if you don't answer. Other good options to answer to this question is: `dev`, `base`, `production` or `development`.
