const { existsSync } = require('fs');
const { resolve, sep, dirname, parse } = require('path');
const webpackMerge = require('webpack-merge');
const { extensions, jsVariants } = require('interpret');
const GroupHelper = require('../utils/GroupHelper');
const rechoir = require('rechoir');
const MergeError = require('../utils/errors/MergeError');

// Order defines the priority, in increasing order
// example - config file lookup will be in order of .webpack/webpack.config.development.js -> webpack.config.development.js -> webpack.config.js
const DEFAULT_CONFIG_LOC = [
    'webpack.config',
    'webpack.config.dev',
    'webpack.config.development',
    'webpack.config.prod',
    'webpack.config.production',
    '.webpack/webpack.config',
    '.webpack/webpack.config.none',
    '.webpack/webpack.config.dev',
    '.webpack/webpack.config.development',
    '.webpack/webpack.config.prod',
    '.webpack/webpack.config.production',
    '.webpack/webpackfile',
];

const modeAlias = {
    production: 'prod',
    development: 'dev',
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
        const extension = Object.keys(jsVariants).find((t) => configModule.ext.endsWith(t));

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

    async finalize(moduleObj) {
        const { argv } = this.args;
        const newOptionsObject = {
            outputOptions: {},
            options: {},
            processingMessageBuffer: [],
        };

        if (!moduleObj) {
            return newOptionsObject;
        }
        const configPath = moduleObj.path;
        const configOptions = moduleObj.content;
        if (typeof configOptions === 'function') {
            // when config is a function, pass the env from args to the config function
            let formattedEnv;
            if (Array.isArray(this.args.env)) {
                formattedEnv = this.args.env.reduce((envObject, envOption) => {
                    envObject[envOption] = true;
                    return envObject;
                }, {});
            }
            const newOptions = configOptions(formattedEnv, argv);
            // When config function returns a promise, resolve it, if not it's resolved by default
            newOptionsObject['options'] = await Promise.resolve(newOptions);
        } else {
            if (Array.isArray(configOptions) && !configOptions.length) {
                newOptionsObject['options'] = {};
                return newOptionsObject;
            }
            newOptionsObject['options'] = configOptions;
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

    async resolveConfigFiles() {
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
            this.opts = await this.finalize(resolvedConfig);
            return;
        }

        const defaultConfigFiles = getDefaultConfigFiles();
        const tmpConfigFiles = defaultConfigFiles.filter((file) => {
            return existsSync(file.path);
        });

        const configFiles = tmpConfigFiles.map(this.requireConfig.bind(this));
        if (configFiles.length) {
            const defaultConfig = configFiles.find((p) => p.path.includes(mode) || p.path.includes(modeAlias[mode]));
            if (defaultConfig) {
                this.opts = await this.finalize(defaultConfig);
                return;
            }
            const foundConfig = configFiles.pop();
            this.opts = await this.finalize(foundConfig);
            return;
        }
    }

    async resolveConfigMerging() {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.keys(this.args).some((arg) => arg === 'merge')) {
            const { merge } = this.args;

            // try resolving merge config
            const newConfigPath = this.resolveFilePath(merge);

            if (!newConfigPath) {
                throw new MergeError("The supplied merge config doesn't exist.");
            }

            const configFiles = getConfigInfoFromFileName(newConfigPath);
            const foundConfig = configFiles[0];
            const resolvedConfig = this.requireConfig(foundConfig);
            const newConfigurationsObject = await this.finalize(resolvedConfig);
            this.opts['options'] = webpackMerge(this.opts['options'], newConfigurationsObject.options);
        }
    }

    async run() {
        await this.resolveConfigFiles();
        await this.resolveConfigMerging();
        return this.opts;
    }
}

module.exports = ConfigGroup;
