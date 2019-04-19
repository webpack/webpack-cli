import tooltip from "./tooltip";

export default function style(self, stylingType) {
	const ExtractUseProps = [];
	let regExpForStyles = null;
	switch (stylingType) {
		case "SASS":
			self.dependencies.push(
				"sass-loader",
				"node-sass",
				"style-loader",
				"css-loader",
			);
			regExpForStyles = `${new RegExp(/\.(scss|css)$/)}`;
			if (self.isProd) {
				ExtractUseProps.push(
					{
						loader: "'css-loader'",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "'sass-loader'",
						options: {
							sourceMap: true,
						},
					},
				);
			} else {
				ExtractUseProps.push(
					{
						loader: "'style-loader'",
					},
					{
						loader: "'css-loader'",
					},
					{
						loader: "'sass-loader'",
					},
				);
			}
			break;
		case "LESS":
			regExpForStyles = `${new RegExp(/\.(less|css)$/)}`;
			self.dependencies.push(
				"less-loader",
				"less",
				"style-loader",
				"css-loader",
			);
			if (self.isProd) {
				ExtractUseProps.push(
					{
						loader: "'css-loader'",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "'less-loader'",
						options: {
							sourceMap: true,
						},
					},
				);
			} else {
				ExtractUseProps.push(
					{
						loader: "'css-loader'",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "'less-loader'",
						options: {
							sourceMap: true,
						},
					},
				);
			}
			break;
		case "PostCSS":
			self.configuration.config.topScope.push(
				tooltip.postcss(),
				"const autoprefixer = require('autoprefixer');",
				"const precss = require('precss');",
				"\n",
			);
			self.dependencies.push(
				"style-loader",
				"css-loader",
				"postcss-loader",
				"precss",
				"autoprefixer",
			);
			regExpForStyles = `${new RegExp(/\.css$/)}`;
			if (self.isProd) {
				ExtractUseProps.push(
					{
						loader: "'css-loader'",
						options: {
							importLoaders: 1,
							sourceMap: true,
						},
					},
					{
						loader: "'postcss-loader'",
						options: {
							plugins: `function () {
                                return [
                                    precss,
                                    autoprefixer
                                ];
                            }`,
						},
					},
				);
			} else {
				ExtractUseProps.push(
					{
						loader: "'style-loader'",
					},
					{
						loader: "'css-loader'",
						options: {
							importLoaders: 1,
							sourceMap: true,
						},
					},
					{
						loader: "'postcss-loader'",
						options: {
							plugins: `function () {
                                return [
                                    precss,
                                    autoprefixer
                                ];
                            }`,
						},
					},
				);
			}
			break;
		case "CSS":
			self.dependencies.push("style-loader", "css-loader");
			regExpForStyles = `${new RegExp(/\.css$/)}`;
			if (self.isProd) {
				ExtractUseProps.push({
					loader: "'css-loader'",
					options: {
						sourceMap: true,
					},
				});
			} else {
				ExtractUseProps.push(
					{
						loader: "'style-loader'",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "'css-loader'",
					},
				);
			}
			break;
	}
	return { ExtractUseProps, regExpForStyles };
}
