const { existsSync } = require('fs');
const { resolve, extname } = require('path');

const GroupHelper = require('../utils/group-helper');

const VALID_EXTENSIONS = ['.mjs', '.js', '.json', '.babel.js', '.ts'];
const DEFAULT_CONFIG_LOC = ['.webpack/webpack.config', '.webpack/webpack.config.dev', '.webpack/webpack.config.prod', '.webpack/webpackfile', 'webpack.config'];

const getDefaultConfigFiles = () => {
    return DEFAULT_CONFIG_LOC.map(filename =>
        VALID_EXTENSIONS.map(ext => ({
            path: resolve(filename + ext),
            ext: ext,
        })),
    ).reduce((a, i) => a.concat(i), []);
}

class ConfigGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    getConfigExtension(configPath) {
        for (let i = VALID_EXTENSIONS.length - 1; i >= 0; i--) {
            const tmpExt = VALID_EXTENSIONS[i];
            if (configPath.includes(tmpExt, configPath.length - tmpExt.length)) {
                return tmpExt;
            }
        }
        return extname(configPath);
    }
    mapConfigArg(config) {
        const { path } = config;
        const ext = this.getConfigExtension(path);
        return {
            path,
            ext,
        };
    }

    require(path) {
        const result = require(path);
        if (result && result.__esModule && result.default) {
            return result.default;
        }
        return result;
    }

    requireConfig(configPath) {
        const { register } = this.args;

        return (() => {
            if (register && register.length) {
                module.paths.unshift(resolve(process.cwd(), 'node_modules'));
                register.forEach(dep => {
                    const isRelative = ['./', '../', '.\\', '..\\'].some(start => dep.startsWith(start));
                    if (isRelative) {
                        require(resolve(process.cwd(), dep));
                    } else {
                        require(dep);
                    }
                });
            }
            return this.require(configPath);
        })();
    }

    async resolveConfigFiles() {
        const { config, mode } = this.args;
        const path = require('path');

        let configFiles;
        if (config) {
            //TODO: check for existence, give user feedback otherwise
            const configPath = path.resolve(process.cwd(), config);
            const ext = this.getConfigExtension(configPath);
            configFiles = {
                path: configPath,
                ext,
            };
        }
        if (!configFiles) {
            const defaultConfigFiles = getDefaultConfigFiles();
            const tmpConfigFiles = defaultConfigFiles
                .filter(file => {
                    return existsSync(file.path);
                })
                .map(this.mapConfigArg.bind(this));
            if (tmpConfigFiles.length) {
                if (!config) {
                    const defaultConfig = tmpConfigFiles.find(p => p.path.includes(mode));
                    configFiles = defaultConfig || tmpConfigFiles[0];
                }
            }
        }
        
        let configOptions = [];
        if (configFiles) {
            // TODO: support mjs etc..
            const resolvedConfigurationFiles = this.requireConfig(configFiles.path);
            configOptions = resolvedConfigurationFiles;
        }
        if (configOptions.length > 0) {
            const merge = require('webpack-merge');
            this.opts['options'] = configOptions.reduce( (prev, curr) => {
                return merge(prev, curr);
            }, {});
        } 
        else if(typeof configOptions === 'function') {
            const newOptions = await configOptions();
            this.opts['options'] = newOptions;
        } 
        else {
            if(Array.isArray(configOptions) && !configOptions.length) {
                this.opts['options'] = {};
                return;
            }
            this.opts['options'] = configOptions;
        }
    }

    resolveConfigMerging() {
        const { merge } = this.args;
        if (merge) {
            const newConfigPath = this.resolveFilePath(merge, 'webpack.base');
            const newConfig = newConfigPath ? this.require(newConfigPath) : null;
            this.opts['options'] = require('webpack-merge')(this.opts['options'], newConfig);
        }
    }

    async run() {
        await this.resolveConfigFiles();
        this.resolveConfigMerging();
        return this.opts;
    }
}

module.exports = ConfigGroup;
