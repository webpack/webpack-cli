const { existsSync } = require("fs");
const { join, resolve } = require("path");

class Validator {
	constructor() {
		// this.exists = existsSync(fileName);
	}
	resolveFilePath(filename, defaultValue) {
		if (!filename) {
			filename = null;
		}
		if (filename && filename.indexOf(".js") < 0) {
			filename = filename + ".js";
		}
		if (filename && Array.isArray(filename)) {
			return filename.map(fp => this.resolveFilePath(fp));
		}
		let configPath;
		const predefinedConfigPath = filename
			? resolve(process.cwd(), filename)
			: null;
		const configPathExists = predefinedConfigPath
			? existsSync(predefinedConfigPath)
			: false;

		if (!configPathExists) {
			let LOOKUP_PATHS = [`${defaultValue}.js`, `src/${defaultValue}.js`];
			if(filename) {
				LOOKUP_PATHS.push(`src/${filename}`);
			}
			LOOKUP_PATHS.forEach(
				p => {
					const lookUpPath = join(process.cwd(), ...p.split("/"));
					if (existsSync(lookUpPath)) {
						configPath = lookUpPath;
					}
				}
			);
			if (!configPath && filename) {
				configPath = join(process.cwd(), filename);
			} else {
				configPath = null;
			}
		}
		return {
			path: configPathExists ? predefinedConfigPath : configPath
		};
	}
	resolveFileDirectory(pathname, defaultDir) {
		if (!pathname) {
			pathname = "dist";
		}
		const relativePath = resolve(pathname);
		const dirExists = existsSync(relativePath) ? true : false;
		// TODO: move this to instance variable
		const defaultDirectory = resolve(process.cwd(), defaultDir);
		process.shouldUseMem = dirExists ? false : true;
		return {
			path: dirExists ? relativePath : defaultDirectory
		};
	}
	setString(name, defaultString) {
		return name ? name : defaultString;
	}
	setBoolean(bol, defaultBool) {
		return bol ? bol : defaultBool;
	}
	setNumber(num, defaultNum) {
		return parseInt(num ? num : defaultNum);
	}
	setArrayVal(string, options, defaultValue) {
		return options.includes(string.toLowerCase())
			? string.toLowerCase()
			: defaultValue;
	}
}
module.exports = Validator;
