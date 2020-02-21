const { existsSync } = require('fs');
const { resolve, sep, dirname, parse } = require('path');
const { extensions } = require('interpret');
const { logger } = require('@webpack-cli/logger');
const { packageExists, promptInstallation } = require('@webpack-cli/package-utils');
const GroupHelper = require('../utils/GroupHelper');
const chalk = require('chalk');
const rechoir = require('rechoir');

const DEFAULT_CONFIG_LOC = [
    '.webpack/webpack.config',
    '.webpack/webpack.config.dev',
    '.webpack/webpack.config.prod',
    '.webpack/webpackfile',
    'webpack.config',
];

const fileTypes = {
    '.babel.js': ['@babel/register', 'babel-register', 'babel-core/register', 'babel/register'],
    '.babel.ts': ['@babel/register'],
    '.ts': ['ts-node/register', 'tsconfig-paths/register'],
};

const getDefaultConfigFiles = () => {
    return DEFAULT_CONFIG_LOC.map(filename => {
        return Object.keys(extensions).map(ext => {
            return {
                path: resolve(filename + ext),
                ext: ext,
                module: extensions[ext],
            };
        });
    }).reduce((a, i) => a.concat(i), []);
};

const getConfigInfoFromFileName = filename => {
    const fileMetaData = parse(filename);
    return Object.keys(extensions)
        .filter(ext => ext.includes(fileMetaData.ext))
        .filter(ext => fileMetaData.base.substr(fileMetaData.base.length - ext.length) === ext)
        .map(ext => {
            return {
                path: resolve(filename),
                ext: ext,
                module: extensions[ext],
            };
        })
        .filter(e => existsSync(e.path));
};

class ConfigGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    requireLoader(extension, path) {
        try {
            rechoir.prepare(extensions, path, process.cwd());
        } catch (e) {
            throw e;
        }
    }

    requireConfig(configModule) {
        const extension = Object.keys(fileTypes).find(t => configModule.ext.endsWith(t));

        if (extension) {
            this.requireLoader(extension, configModule.path);
        }

        let config = require(configModule.path);
        if (config.default) {
            config = config.default;
        }

        return {
            content: config,
            path: configModule.path,
        };
    }

    finalize(moduleObj) {
        const newOptionsObject = {
            outputOptions: {},
            options: {},
        };

        if (!moduleObj) {
            return newOptionsObject;
        }
        const configPath = moduleObj.path;
        const configOptions = moduleObj.content;
        if (configOptions.length > 0) {
            newOptionsObject['options'] = configOptions;
        } else if (typeof configOptions === 'function') {
            const newOptions = configOptions();
            newOptionsObject['options'] = newOptions;
        } else {
            if (Array.isArray(configOptions) && !configOptions.length) {
                newOptionsObject['options'] = {};
                return newOptionsObject;
            }
            newOptionsObject['options'] = configOptions;
        }

        if (configOptions && configPath.includes('.webpack')) {
            const currentPath = configPath;
            const parentContext = dirname(currentPath)
                .split(sep)
                .slice(0, -1)
                .join('/');
            if (Array.isArray(configOptions)) {
                configOptions.forEach(config => {
                    config.context = config.context || parentContext;
                });
            } else {
                configOptions.context = configOptions.context || parentContext;
            }
            newOptionsObject['options'] = configOptions;
        }
        return newOptionsObject;
    }

    resolveConfigFiles() {
        const { config, mode } = this.args;

        if (config) {
            const configPath = resolve(process.cwd(), config);
            const configFiles = getConfigInfoFromFileName(configPath);
            if (!configFiles.length) {
                this.opts.processingMessageBuffer.push({
                    lvl: 'warn',
                    msg: `Configuration ${config} not found in ${configPath}`,
                });
                return;
            }
            const foundConfig = configFiles[0];
            const resolvedConfig = this.requireConfig(foundConfig);
            this.opts = this.finalize(resolvedConfig);
            return;
        }

        const defaultConfigFiles = getDefaultConfigFiles();
        const tmpConfigFiles = defaultConfigFiles.filter(file => {
            return existsSync(file.path);
        });

        const configFiles = tmpConfigFiles.map(this.requireConfig.bind(this));
        if (configFiles.length) {
            const defaultConfig = configFiles.find(p => p.path.includes(mode));
            if (defaultConfig) {
                const envConfig = defaultConfig.map(c => c.content);
                this.opts = this.finalize(envConfig);
                return;
            }
            const foundConfig = configFiles.pop();
            this.opts = this.finalize(foundConfig);
            return;
        }
    }

    resolveConfigMerging() {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.keys(this.args).some(arg => arg === 'merge')) {
            const { merge } = this.args;

            const newConfigPath = this.resolveFilePath(merge, 'webpack.base.js');
            if (newConfigPath) {
                const configFiles = getConfigInfoFromFileName(newConfigPath);
                if (!configFiles.length) {
                    this.opts.processingMessageBuffer.push({
                        lvl: 'warn',
                        msg: 'Could not find file to merge configuration with...',
                    });
                    return;
                }
                const foundConfig = configFiles[0];
                const resolvedConfig = this.requireConfig(foundConfig);
                const newConfigurationsObject = this.finalize(resolvedConfig);
                const webpackMerge = require('webpack-merge');
                this.opts['options'] = webpackMerge(this.opts['options'], newConfigurationsObject.options);
            }
        }
    }

    run() {
        this.resolveConfigFiles();
        this.resolveConfigMerging();
        return this.opts;
    }
}

module.exports = ConfigGroup;
