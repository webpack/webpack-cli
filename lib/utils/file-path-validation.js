const { existsSync } = require("fs");
const { join, resolve } = require("path");

class Validator {
	constructor() {
		// this.exists = existsSync(fileName);
	}
	resolveFilePath(filename, defaultValue) {
		if (filename.indexOf(".js") < 0) {
			filename += filename + ".js";
		}
		if (Array.isArray(filename)) {
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
			[`src/${filename}`, `lib/${filename}`, `${defaultValue}.js`].forEach(
				p => {
					const lookUpPath = join(process.cwd(), ...p.split("/"));
					if (existsSync(lookUpPath)) {
						configPath = lookUpPath;
					}
				}
			);

			if (!configPath) {
				configPath = join(process.cwd(), filename);
			}
		}
		return {
			shouldUseMem: configPathExists,
			path: configPathExists ? predefinedConfigPath : configPath
		};
	}
	resolveFileDirectory(pathname, defaultDir) {
		const relativePath = resolve(pathname);
		const dirExists = existsSync(relativePath) ? true : false;
		// TODO: move this to instance variable
		const defaultDirectory = resolve(process.cwd(), defaultDir);
		return {
			shouldUseMem: dirExists ? false : true,
			path: dirExists ? relativePath : defaultDirectory
		};
	}
	setString(name, defaultString) {
		return name ? name : defaultString;
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
