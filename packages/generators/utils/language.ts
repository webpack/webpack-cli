export enum LangType {
	ES6 = "ES6",
	Typescript = "Typescript",
}

interface ModuleRule extends Object {
	include?: string[];
	exclude?: string[];
	loader: string;
	options?: {
		plugins: string[];
		presets: Preset[][];
	};
	test: string;
}

type Preset = string | object;

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
export function getBabelLoader(): ModuleRule {
	return {
		// TODO migrate tslint
		// tslint:disable: object-literal-sort-keys
		test: "/\.js$/",
		include: ["path.resolve(__dirname, 'src')"],
		loader: "'babel-loader'",
		options: {
			plugins: ["'syntax-dynamic-import'"],
			presets: [
				[
					"'@babel/preset-env'",
					{
						"'modules'": false
					}
				]
			]
		},
		// tslint:enable: object-literal-sort-keys
	};
}

export function getTypescriptLoader(): ModuleRule {
	return {
		// TODO migrate tslint
		// tslint:disable: object-literal-sort-keys
		test: "/\.tsx?$/",
		loader: "'ts-loader'",
		include: ["path.resolve(__dirname, 'src')"],
		exclude: ["/node_modules/"],
		// tslint:enable: object-literal-sort-keys
	};
}

export default function language(self, langType) {
	switch (langType) {
		case LangType.ES6:
			self.dependencies.push(
				"babel-loader",
				"@babel/core",
				"@babel/preset-env",
			);
			self.configuration.config.webpackOptions.module.rules.push(
				getBabelLoader(),
			);
			break;

		case LangType.Typescript:
			self.dependencies.push(
				"typescript",
				"ts-loader",
			);
			self.configuration.config.webpackOptions.module.rules.push(
				getTypescriptLoader(),
			);
			self.configuration.config.webpackOptions.resolve = {
				extensions: [ "'.tsx'", "'.ts'", "'.js'" ],
			};

			// Update the entry files extensions to .ts
			const jsEntryOption = self.configuration.config.webpackOptions.entry;
			const jsExtension = new RegExp("\.js(?!.*\.js)");
			let tsEntryOption = {};
			if (typeof jsEntryOption === "string") {
				tsEntryOption = jsEntryOption.replace(jsExtension, ".ts");
			} else if (typeof jsEntryOption === "object") {
				Object.keys(jsEntryOption).map((entry) => {
					tsEntryOption[entry] = jsEntryOption[entry].replace(jsExtension, ".ts");
				});
			}
			self.configuration.config.webpackOptions.entry = tsEntryOption;
			self.log(jsEntryOption.replace(jsExtension, ".ts"), jsEntryOption);
			break;
	}
}
