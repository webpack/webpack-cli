module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["hey", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
}
