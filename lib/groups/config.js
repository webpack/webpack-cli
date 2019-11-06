const { existsSync } = require('fs');
const { resolve, sep, dirname } = require('path');
const { extensions } = require('interpret');

const GroupHelper = require('../utils/group-helper');

const DEFAULT_CONFIG_LOC = ['.webpack/webpack.config', '.webpack/webpack.config.dev', '.webpack/webpack.config.prod', '.webpack/webpackfile', 'webpack.config'];

const getDefaultConfigFiles = () => {
    return DEFAULT_CONFIG_LOC.map(filename => {
        return Object.keys(extensions).map(ext => {
            return {
                path: resolve(filename + ext),
                ext: ext,
                module: extensions[ext]
            }
        })
    }).reduce((a, i) => a.concat(i), []);
}

const getConfigInfoFromFileName = (filename) => {
    const originalExt = filename.split('.').pop();
    return Object.keys(extensions).filter(ext => {
        return '.'.concat(originalExt) === ext;
    }).
    map(ext => {
        return {
            path: resolve(filename),
            ext: ext,
            module: extensions[ext]
        } 
    }).filter(e => existsSync(e.path));
}

class ConfigGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    require(path) {
        const result = require(path);
        if (result && result.__esModule && result.default) {
            return result.default;
        }
        return {
            path: path,
            content: result
        };
    }

    requireConfig(configModule) {
        return (() => {
            try {
                if(!configModule.module) {
                    return this.require(configModule.path);
                }
            } catch(err) {
                console.log(err);
            }
        })();
    }

    async finalize(moduleObj) {
        let newOptionsObject = {
            outputOptions: {},
                options: {}
        };

        if(!moduleObj) {
            return newOptionsObject;
        }
        const configPath = moduleObj.path;
        const configOptions = moduleObj.content;
        if (configOptions.length > 0) {
            newOptionsObject['options'] = configOptions;
        }
        else if (typeof configOptions === 'function') {
            const newOptions = await configOptions();
            newOptionsObject['options'] = newOptions;
        }
        else {
            if (Array.isArray(configOptions) && !configOptions.length) {
                newOptionsObject['options'] = {};
                return newOptionsObject;
            }
            newOptionsObject['options'] = configOptions;
        }

        if (configOptions && configPath.includes('.webpack')) {
            const currentPath = configPath;
            const parentContext = dirname(currentPath).split(sep).slice(0, -1).join('/');
            if(Array.isArray(configOptions)) {
                configOptions.forEach(config => {
                    config.context = config.context || parentContext;
                })
            } else {
                configOptions.context = configOptions.context || parentContext;
            }
            newOptionsObject['options'] = configOptions;
        }
        return newOptionsObject;
    }

    async resolveConfigFiles() {
        const { config, mode } = this.args;

        if (config) {
            const configPath = resolve(process.cwd(), config);
            const configFiles = getConfigInfoFromFileName(configPath);
            if(!configFiles.length) {
                this.opts.processingMessageBuffer.push({
                    lvl: 'warn',
                    msg: `Configuration ${config} not found in ${configPath}`
                });
                return;
            }
            const foundConfig = configFiles[0];
            const resolvedConfig = this.requireConfig(foundConfig);
            this.opts = this.finalize(resolvedConfig);
            return;
        }

        const defaultConfigFiles = getDefaultConfigFiles();
        const tmpConfigFiles = defaultConfigFiles
        .filter(file => {
            return existsSync(file.path);
        });

        const configFiles = tmpConfigFiles.map(this.requireConfig.bind(this));
        if (configFiles.length) {
            const defaultConfig = configFiles.find(p => p.path.includes(mode));
            if(defaultConfig) {
                const envConfig = defaultConfig.map(c => c.content);
                this.opts = this.finalize(envConfig);
                return;
            }
            const foundConfig = configFiles.pop();
            this.opts = this.finalize(foundConfig);
            return;
        }
    }

    async resolveConfigMerging() {
        if (this.args.hasOwnProperty('merge')) {
            const { merge } = this.args;

            const newConfigPath = this.resolveFilePath(merge, 'webpack.base.js');
            if(newConfigPath) {
                const configFiles = getConfigInfoFromFileName(newConfigPath);
                if(!configFiles.length) {
                    this.opts.processingMessageBuffer.push({
                        lvl: 'warn',
                        msg: 'Could not find file to merge configuration with...'
                    })
                    return;
                }
                const foundConfig = configFiles[0];
                const resolvedConfig = this.requireConfig(foundConfig);
                const newConfigurationsObject = await this.finalize(resolvedConfig);
                const webpackMerge = require('webpack-merge');
                this.opts['options'] = webpackMerge(this.opts['options'], newConfigurationsObject.options);
            }
        }
    }

    async run() {
        await this.resolveConfigFiles();
        await this.resolveConfigMerging();
        return this.opts;
    }
}

module.exports = ConfigGroup;
