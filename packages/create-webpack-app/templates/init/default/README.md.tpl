# 🚀 Welcome to your new awesome project!

This project has been created using **create-webpack-app**, you can now run

```bash
npm run build
```

or

```bash
yarn build
```

to bundle your application

## HTML and CSS

`index.html` is the entry point of this project — webpack bundles every script and
stylesheet the page references and emits the page as `dist/index.html`, with the
references rewritten to the generated assets. Both are supported out of the box, so
no loader or plugin is needed for `.html` and `.css` files.

Sass, Less, Stylus and PostCSS keep that support and only add their own loader on
top of it, as a `css/auto` rule:

```js
{
    test: /\.s[ac]ss$/i,
    type: "css/auto",
    use: ["sass-loader"],
}
```

They combine, too: webpack applies `use` right to left, so `["postcss-loader",
"sass-loader"]` compiles the Sass first and runs PostCSS over the result.
