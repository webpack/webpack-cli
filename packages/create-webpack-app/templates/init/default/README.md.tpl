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
<% if (langType === "Typescript") { %>
## TypeScript

<% if (useTsLoader) { %>This project compiles TypeScript with `ts-loader`, which type
checks as it builds and handles every TypeScript feature, `.tsx` included.

webpack can also strip the types itself, with no loader at all — it is faster, but it
covers erasable syntax only (types, generics, `import type`, casts) and checks nothing.
Re-run `create-webpack-app` and answer `built-in` to that question to try it.<% } else { %>webpack strips the types itself (it needs Node.js >= 22.6), so this project has no
TypeScript loader. Stripping is erasable syntax only — types, generics, `import type`
and casts — so `enum`, `namespace`, parameter properties, decorator metadata and `.tsx`
need a loader instead: re-run `create-webpack-app` and answer `ts-loader` to that
question, which also type checks as it builds.<% } %>

<% if (useTsLoader) { %>Either way, `tsconfig.json` is what your editor reads, and:<% } else { %>Nothing is type checked during the build. `tsconfig.json` is what your editor reads,
and:<% } %>

```bash
npm run check:types
```

runs `tsc --noEmit` over the project.
<% } %>
