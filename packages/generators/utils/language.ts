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

function updateEntryExt(self, newExt: string): void {
	const jsEntryOption = self.configuration.config.webpackOptions.entry;
	const jsExtension = new RegExp("\.js(?!.*\.js)");
	let tsEntryOption = {};
	if (typeof jsEntryOption === "string") {
		tsEntryOption = jsEntryOption.replace(jsExtension, newExt);
	} else if (typeof jsEntryOption === "object") {
		Object.keys(jsEntryOption).forEach((entry: string): void => {
			tsEntryOption[entry] = jsEntryOption[entry].replace(jsExtension, newExt);
		});
	}
	self.configuration.config.webpackOptions.entry = tsEntryOption;
}

/**
 *
 * Returns an module.rule object that has the babel loader if invoked
 *
 * @returns {Function} A callable function that adds the babel-loader with env preset
 */
export function getBabelLoader(): ModuleRule {
	return {
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
	};
}

export function getTypescriptLoader(): ModuleRule {
	return {
		test: "/\.tsx?$/",
		loader: "'ts-loader'",
		include: ["path.resolve(__dirname, 'src')"],
		exclude: ["/node_modules/"],
	};
}

export default function language(self, langType: string): void {
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

			updateEntryExt(self, ".ts");
			break;
	}
}
