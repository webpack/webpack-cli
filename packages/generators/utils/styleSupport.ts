import tooltip from "./tooltip";

export enum StylingType {
	CSS = "CSS",
	SASS = "SASS",
	LESS = "LESS",
	PostCSS = "PostCSS"
}

export enum LoaderName {
	CSS = "css-loader",
	SASS = "sass-loader",
	STYLE = "style-loader",
	LESS = "less-loader",
	POSTCSS = "postcss-loader"
}

export enum StyleRegex {
	CSS = "/.css$/",
	SASS = "/.(scss|css)$/",
	LESS = "/.(less|css)$/",
	PostCSS = "/.css$/"
}

export interface Loader {
	loader: string;
	options?: {
		importLoaders?: number;
		sourceMap?: boolean;
		plugins?: string;
	};
}

export default function style(
	self,
	stylingType: string
): {
	ExtractUseProps: Loader[];
	regExpForStyles: StyleRegex;
} {
	const ExtractUseProps: Loader[] = [];
	let regExpForStyles: StyleRegex = null;

	switch (stylingType) {
		case StylingType.CSS:
			regExpForStyles = StyleRegex.CSS;

			self.dependencies.push(LoaderName.CSS);
			if (!self.isProd) {
				self.dependencies.push(LoaderName.STYLE);
				ExtractUseProps.push({
					loader: `"${LoaderName.STYLE}"`
				});
			}
			ExtractUseProps.push({
				loader: `"${LoaderName.CSS}"`,
				options: {
					sourceMap: true
				}
			});
			break;

		case StylingType.SASS:
			regExpForStyles = StyleRegex.SASS;

			self.dependencies.push("node-sass", LoaderName.SASS, LoaderName.CSS);
			if (!self.isProd) {
				self.dependencies.push(LoaderName.STYLE);
				ExtractUseProps.push({
					loader: `"${LoaderName.STYLE}"`
				});
			}
			ExtractUseProps.push(
				{
					loader: `"${LoaderName.CSS}"`,
					options: {
						sourceMap: true
					}
				},
				{
					loader: `"${LoaderName.SASS}"`,
					options: {
						sourceMap: true
					}
				}
			);
			break;

		case StylingType.LESS:
			regExpForStyles = StyleRegex.LESS;

			self.dependencies.push("less", LoaderName.LESS, LoaderName.CSS);
			if (!self.isProd) {
				self.dependencies.push(LoaderName.STYLE);
				ExtractUseProps.push({
					loader: `"${LoaderName.STYLE}"`
				});
			}
			ExtractUseProps.push(
				{
					loader: `"${LoaderName.CSS}"`,
					options: {
						sourceMap: true
					}
				},
				{
					loader: `"${LoaderName.LESS}"`,
					options: {
						sourceMap: true
					}
				}
			);
			break;

		case StylingType.PostCSS:
			regExpForStyles = StyleRegex.PostCSS;

			self.configuration.config.topScope.push(
				tooltip.postcss(),
				"const autoprefixer = require('autoprefixer');",
				"const precss = require('precss');",
				"\n"
			);

			self.dependencies.push("precss", "autoprefixer", LoaderName.CSS, LoaderName.POSTCSS);
			if (!self.isProd) {
				self.dependencies.push(LoaderName.STYLE);
				ExtractUseProps.push({
					loader: `"${LoaderName.STYLE}"`
				});
			}
			ExtractUseProps.push(
				{
					loader: `"${LoaderName.CSS}"`,
					options: {
						importLoaders: 1,
						sourceMap: true
					}
				},
				{
					loader: `"${LoaderName.POSTCSS}"`,
					options: {
						plugins: `function () {
							return [
								precss,
								autoprefixer
							];
						}`
					}
				}
			);
			break;
	}
	return { ExtractUseProps, regExpForStyles };
}
