const { existsSync } = require("fs");
const { resolve, extname } = require("path");
const ErrorHelper = require("../utils/error-helper");

class ConfigGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.arrayToObject(options);
		this.extensions = [".mjs", ".js", ".json", ".babel.js", ".ts"];
		this.defaultConfigFiles = this.getDefaultConfigFiles();
		this.configFiles = [];
		this.configOptions = [];
	}
	getDefaultConfigFiles() {
		return ["webpack.config", "webpackfile"]
			.map(filename =>
				this.extensions.map(ext => ({
					path: resolve(filename + ext),
					ext: ext
				}))
			)
			.reduce((a, i) => a.concat(i), []);
	}
	getConfigExtension(configPath) {
		for (let i = this.extensions.length - 1; i >= 0; i--) {
			const tmpExt = this.extensions[i];
			if (configPath.indexOf(tmpExt, configPath.length - tmpExt.length) > -1) {
				return tmpExt;
			}
		}
		return extname(configPath);
	}
	mapConfigArg(configArg) {
		const { path } = configArg;
		const ext = this.getConfigExtension(path);
		return {
			path,
			ext
		};
	}

	registerCompiler(moduleDescriptor) {
		if (moduleDescriptor) {
			if (typeof moduleDescriptor === "string") {
				require(moduleDescriptor);
			} else if (!Array.isArray(moduleDescriptor)) {
				moduleDescriptor.register(require(moduleDescriptor.module));
			} else {
				for (let i = 0; i < moduleDescriptor.length; i++) {
					try {
						registerCompiler(moduleDescriptor[i]);
						break;
					} catch (e) {
						// do nothing
					}
				}
			}
		}
	}

	requireConfig(configPath) {
		const { configRegister } = this.opts;
		this.configOptions = (() => {
			if (configRegister && configRegister.length) {
				module.paths.unshift(
					resolve(process.cwd(), "node_modules"),
					process.cwd()
				);
				configRegister.forEach(dep => {
					require(dep);
				});
				return require(configPath);
			} else {
				return require(configPath);
			}
		})();
		//this.opts = prepareOptions(this.opts);
	}
	resolveConfigFiles() {
		const { config } = this.opts;
		if (config) {
			// convert config to an array if it's not
			this.configFiles = Array.isArray(config)
				? config.filter(f => existsSync(f)).map(this.mapConfigArg.bind(this))
				: [config].filter(f => existsSync(f)).map(this.mapConfigArg.bind(this));
		} else {
			this.configFiles = this.defaultConfigFiles.find(defaultFile =>
				existsSync(defaultFile.path)
			);
		}
		if (this.configFiles && this.configFiles.length) {
			this.configFiles.forEach(file => {
				this.registerCompiler(this.extensions[file.ext]);
				this.configOptions.push(this.requireConfig(file.path));
			});
		}

		if (this.configOptions.length === 1) {
			// set defaults based on this.configOptions[0]
			//return processConfiguredOptions(this.configOptions[0]);
		} else {
			// set defaults based on nothing
			//return processConfiguredOptions(this.configOptions);
		}
	}

	run() {
		this.resolveConfigFiles();
		return this.opts;
	}
}

module.exports = ConfigGroup;
