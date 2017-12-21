"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')",
					someArr: ["Hey"]
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-1",
	{
		noParse: /jquery|lodash/,
		rules: [
			{
				test: new RegExp(/\.js$/),
				parser: {
					amd: false
				},
				use: [
					"'htmllint-loader'",
					{
						loader: "'html-loader'",
						options: {
							hello: "'world'"
						}
					}
				]
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			"{{#if_eq build 'standalone'}}",
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')",
					someArr: ["Hey"]
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-1",
	{
		noParse: /jquery|lodash/,
		rules: [
			{
				test: new RegExp(/\.js$/),
				parser: {
					amd: false
				},
				use: [
					"'htmllint-loader'",
					{
						loader: "'html-loader'",
						options: {
							hello: "'world'"
						}
					}
				]
			}
		]
	},
	"add"
);

defineTest(
	__dirname,
	"module",
	"module-2",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
	"add"
);
