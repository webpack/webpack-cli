const { existsSync } = require('fs');
const { resolve, sep, dirname, parse } = require('path');
const { extensions } = require('interpret');
const GroupHelper = require('../utils/GroupHelper');
const rechoir = require('rechoir');

// Order defines the priority, in increasing order
const DEFAULT_CONFIG_LOC = [
    '.webpack/webpack.config',
    '.webpack/webpack.config.none',
    '.webpack/webpack.config.dev',
    '.webpack/webpack.config.development',
    '.webpack/webpack.config.prod',
    '.webpack/webpack.config.production',
    '.webpack/webpackfile',
    'webpack.config.development',
    'webpack.config',
    'webpack.config.production',
];

const modeAlias = {
    production: 'prod',
    development: 'dev',
};

const fileTypes = {
    '.babel.js': ['@babel/register', 'babel-register', 'babel-core/register', 'babel/register'],
    '.babel.ts': ['@babel/register'],
    '.ts': ['ts-node/register', 'tsconfig-paths/register'],
};

const getDefaultConfigFiles = () => {
    return DEFAULT_CONFIG_LOC.map((filename) => {
        return Object.keys(extensions).map((ext) => {
            return {
                path: resolve(filename + ext),
                ext: ext,
                module: extensions[ext],
            };
        });
    }).reduce((a, i) => a.concat(i), []);
};

const getConfigInfoFromFileName = (filename) => {
    const fileMetaData = parse(filename);
    return Object.keys(extensions)
        .filter((ext) => ext.includes(fileMetaData.ext))
        .filter((ext) => fileMetaData.base.substr(fileMetaData.base.length - ext.length) === ext)
        .map((ext) => {
            return {
                path: resolve(filename),
                ext: ext,
                module: extensions[ext],
            };
        })
        .filter((e) => existsSync(e.path));
};

class ConfigGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    requireLoader(extension, path) {
        rechoir.prepare(extensions, path, process.cwd());
    }

    requireConfig(configModule) {
        const extension = Object.keys(fileTypes).find((t) => configModule.ext.endsWith(t));

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
        console.log({ moduleObj });
        const configPath = moduleObj.path;
        const configOptions = moduleObj.content;
        if (typeof configOptions === 'function') {
            // when config is a function, pass the env from args to the config function
            const newOptions = configOptions(this.args.env);
            newOptionsObject['options'] = newOptions;
        } else {
            if (Array.isArray(configOptions) && !configOptions.length) {
                newOptionsObject['options'] = {};
                return newOptionsObject;
            }
            newOptionsObject['options'] = configOptions;
            console.log({ configOptions, newOptionsObject });
        }

        if (configOptions && configPath.includes('.webpack')) {
            const currentPath = configPath;
            const parentContext = dirname(currentPath).split(sep).slice(0, -1).join(sep);
            if (Array.isArray(configOptions)) {
                configOptions.forEach((config) => {
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
        const tmpConfigFiles = defaultConfigFiles.filter((file) => {
            return existsSync(file.path);
        });

        const configFiles = tmpConfigFiles.map(this.requireConfig.bind(this));
        if (configFiles.length) {
            const defaultConfig = configFiles.find((p) => p.path.includes(mode) || p.path.includes(modeAlias[mode]));
            console.log({ defaultConfig, configFiles, mode });
            if (defaultConfig) {
                this.opts = this.finalize(defaultConfig);
                return;
            }
            const foundConfig = configFiles.pop();
            this.opts = this.finalize(foundConfig);
            return;
        }
    }

    resolveConfigMerging() {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.keys(this.args).some((arg) => arg === 'merge')) {
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
        console.log(this.opts);
        return this.opts;
    }
}

module.exports = ConfigGroup;
