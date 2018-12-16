const { existsSync } = require("fs");
const { resolve, extname } = require("path");

const GroupHelper = require("../utils/group-helper");

class ConfigGroup extends GroupHelper {
	constructor(options) {
		super(options);
		this.extensions = [".mjs", ".js", ".json", ".babel.js", ".ts"];
		this.defaultConfigFiles = this.getDefaultConfigFiles();
		this.configFiles = null;
		this.configOptions = [];
	}
	getDefaultConfigFiles() {
		const {mode} = this.args;
		let DEFAULT_FILES = ["webpack.config", "webpack.dev", "webpackfile"];
		if(mode === 'prod') {
			DEFAULT_FILES.unshift("webpack.prod");
		}
		return DEFAULT_FILES
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
	mapConfigArg(path) {
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
		const { register } = this.args;
		this.configOptions = (() => {
			if (register && register.length) {
				module.paths.unshift(
					resolve(process.cwd(), "node_modules"),
					process.cwd()
				);
				register.forEach(dep => {
					require(dep);
				});
				return require(configPath);
			} else {
				return require(configPath);
			}
		})();
	}

	resolveConfigFiles() {
		const { config, mode } = this.args;
		// Check if config param is passed, set default based on that
		if (config) {
			const configPath = this.resolveFilePath(config, `webpack.${mode}.js`);
			this.configFiles = configPath ? configPath : null;
		}
		if(!this.configFiles) {
			this.configFiles = this.defaultConfigFiles.filter(defaultFile =>
				existsSync(defaultFile)
			).map(this.mapConfigArg.bind(this));
		}
		// grab array config etc
		if(this.configFiles.length < 1) {
			const defaultConfig = this.defaultConfigFiles.filter(e => existsSync(e.path)).find(e => {
				return this.resolveFilePath(e.path, `webpack.${mode}.js`)
			});
			this.configFiles = defaultConfig && defaultConfig.path ? defaultConfig.path : defaultConfig;
		}

		if (this.configFiles && Array.isArray(this.configFiles)) {
			this.configFiles.forEach(file => {
				this.registerCompiler(this.extensions[file.ext]);
				this.configOptions.push(this.requireConfig(file));
			});
		} else if(this.configFiles) {
			// single object
			this.registerCompiler(this.extensions[this.getConfigExtension(this.configFiles)]);
			this.configOptions.push(this.requireConfig(this.configFiles));
		} else {
			
		}
		if (this.configOptions.length === 1) {
			// set defaults based on this.configOptions[0]
			//return processConfiguredOptions(this.configOptions[0]);
		} else {
			// set defaults based on nothing
			this.opts['options'] = this.configOptions;
			//return processConfiguredOptions(this.configOptions);
		}
	}

	resolveConfigMerging() {
		const {merge} = this.args;
		if(merge) {
			const newConfigPath = this.resolveFilePath(merge);
			const newConfig = newConfigPath ? require(newConfigPath) : null;
			this.opts['options'] = require('webpack-merge')(this.opts['options'], newConfig);
		}
	}

	run() {
		this.resolveConfigFiles();
		this.resolveConfigMerging();
		return this.opts;
	}
}

module.exports = ConfigGroup;
