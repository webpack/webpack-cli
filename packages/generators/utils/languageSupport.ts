import { Rule } from "../types";

export enum LangType {
	ES6 = "ES6",
	Typescript = "Typescript"
}

const replaceExt = (path: string, ext: string): string => path.substr(0, path.lastIndexOf(".")) + `${ext}'`;

function updateEntryExt(self, newExt: string): void {
	const jsEntryOption = self.configuration.config.webpackOptions.entry;
	let tsEntryOption = {};
	if (typeof jsEntryOption === "string") {
		tsEntryOption = replaceExt(jsEntryOption, newExt);
	} else if (typeof jsEntryOption === "object") {
		Object.keys(jsEntryOption).forEach((entry: string): void => {
			tsEntryOption[entry] = replaceExt(jsEntryOption[entry], newExt);
		});
	}
	self.configuration.config.webpackOptions.entry = tsEntryOption;
}

const getFolder = (path: string): string =>
	path
		.replace("'./", "")
		.split("/")
		.slice(0, -1)
		.join("/");

function getEntryFolders(self): string[] {
	const entryOption = self.configuration.config.webpackOptions.entry;
	let entryFolders = {};
	if (typeof entryOption === "string") {
		const folder = getFolder(entryOption);
		if (folder.length > 0) entryFolders[folder] = true;
	} else if (typeof entryOption === "object") {
		Object.keys(entryOption).forEach((entry: string): void => {
			const folder = getFolder(entryOption[entry]);
			if (folder.length > 0) entryFolders[folder] = true;
		});
	}
	return Object.keys(entryFolders);
}

/**
 *
 * Returns an module.rule object for the babel loader
 * @param {string[]} includeFolders An array of folders to include
 * @returns {Rule} A configuration containing the babel-loader with env preset
 */
export function getBabelLoader(includeFolders: string[]): Rule {
	const include = includeFolders.map((folder: string): string => `path.resolve(__dirname, '${folder}')`);
	return {
		test: "/.(js|jsx)$/",
		include,
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
		}
	};
}

/**
 *
 * Returns an module.rule object for the typescript loader
 * @param {string[]} includeFolders An array of folders to include
 * @returns {Rule} A configuration containing the ts-loader
 */
export function getTypescriptLoader(includeFolders: string[]): Rule {
	const include = includeFolders.map((folder: string): string => `path.resolve(__dirname, '${folder}')`);
	return {
		test: "/.(ts|tsx)?$/",
		loader: "'ts-loader'",
		include,
		exclude: ["/node_modules/"]
	};
}

export default function language(self, langType: string): void {
	const entryFolders = getEntryFolders(self);
	switch (langType) {
		case LangType.ES6:
			self.dependencies.push("babel-loader", "@babel/core", "@babel/preset-env");
			self.configuration.config.webpackOptions.module.rules.push(getBabelLoader(entryFolders));
			break;

		case LangType.Typescript:
			self.dependencies.push("typescript", "ts-loader");
			self.configuration.config.webpackOptions.module.rules.push(getTypescriptLoader(entryFolders));
			self.configuration.config.webpackOptions.resolve = {
				extensions: ["'.tsx'", "'.ts'", "'.js'"]
			};

			updateEntryExt(self, ".ts");
			break;
	}
}
