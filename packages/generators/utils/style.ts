import tooltip from "./tooltip";

export enum StylingType {
	CSS = "CSS",
	SASS = "SASS",
	LESS = "LESS",
	PostCSS = "PostCSS",
}

export enum Loader {
	CSS = "css-loader",
	SASS = "sass-loader",
	STYLE = "style-loader",
	LESS = "less-loader",
	POSTCSS = "postcss-loader",
}

export enum StyleRegex {
	CSS = "/\.css$/",
	SASS = "/\.(scss|css)$/",
	LESS = "/\.(less|css)$/",
	PostCSS = "/\.css$/",
}

export interface ILoader {
	loader: string;
	options?: {
		importLoaders?: number;
		sourceMap?: boolean;
		plugins?: string;
	};
}

export default function style(self, stylingType) {
	const ExtractUseProps: ILoader[] = [];
	let regExpForStyles = null;

	switch (stylingType) {
		case StylingType.CSS:
			regExpForStyles = StyleRegex.CSS;

			self.dependencies.push(
				Loader.CSS,
			);
			if (!self.isProd) {
				self.dependencies.push(
					Loader.STYLE,
				);
				ExtractUseProps.push(
					{
						loader: `"${Loader.STYLE}"`,
					},
				);
			}
			ExtractUseProps.push({
				loader: `"${Loader.CSS}"`,
				options: {
					sourceMap: true,
				},
			});
			break;

		case StylingType.SASS:
			regExpForStyles = StyleRegex.SASS;

			self.dependencies.push(
				"node-sass",
				Loader.SASS,
				Loader.CSS,
			);
			if (!self.isProd) {
				self.dependencies.push(
					Loader.STYLE,
				);
				ExtractUseProps.push(
					{
						loader: `"${Loader.STYLE}"`,
					},
				);
			}
			ExtractUseProps.push(
				{
					loader: `"${Loader.CSS}"`,
					options: {
						sourceMap: true,
					},
				},
				{
					loader: `"${Loader.SASS}"`,
					options: {
						sourceMap: true,
					},
				},
			);
			break;

		case StylingType.LESS:
			regExpForStyles = StyleRegex.LESS;

			self.dependencies.push(
				"less",
				Loader.LESS,
				Loader.CSS,
			);
			if (!self.isProd) {
				self.dependencies.push(
					Loader.STYLE,
				);
				ExtractUseProps.push(
					{
						loader: `"${Loader.STYLE}"`,
					},
				);
			}
			ExtractUseProps.push(
				{
					loader: `"${Loader.CSS}"`,
					options: {
						sourceMap: true,
					},
				},
				{
					loader: `"${Loader.LESS}"`,
					options: {
						sourceMap: true,
					},
				},
			);
			break;

		case StylingType.PostCSS:
			regExpForStyles = StyleRegex.PostCSS;

			self.configuration.config.topScope.push(
				tooltip.postcss(),
				"const autoprefixer = require('autoprefixer');",
				"const precss = require('precss');",
				"\n",
			);

			self.dependencies.push(
				"precss",
				"autoprefixer",
				Loader.CSS,
				Loader.POSTCSS,
			);
			if (!self.isProd) {
				self.dependencies.push(
					Loader.STYLE,
				);
				ExtractUseProps.push(
					{
						loader: `"${Loader.STYLE}"`,
					},
				);
			}
			ExtractUseProps.push(
				{
					loader: `"${Loader.CSS}"`,
					options: {
						importLoaders: 1,
						sourceMap: true,
					},
				},
				{
					loader: `"${Loader.POSTCSS}"`,
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
			break;
	}
	return { ExtractUseProps, regExpForStyles };
}
