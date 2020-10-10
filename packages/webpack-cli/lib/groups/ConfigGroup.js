const { existsSync } = require('fs');
const { resolve, sep, dirname, extname } = require('path');
const webpackMerge = require('webpack-merge');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');
const ConfigError = require('../utils/errors/ConfigError');
const logger = require('../utils/logger');

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

let opts = {
    outputOptions: {},
    options: {},
};

// Return a list of default configs in various formats
const getDefaultConfigFiles = () => {
    return DEFAULT_CONFIG_LOC.map((filename) => {
        // Since .cjs is not available on interpret side add it manually to default config extension list
        return [...Object.keys(extensions), '.cjs'].map((ext) => {
            return {
                path: resolve(filename + ext),
                ext: ext,
                module: extensions[ext],
            };
        });
    }).reduce((a, i) => a.concat(i), []);
};

const getConfigInfoFromFileName = (filename) => {
    const ext = extname(filename);
    // since we support only one config for now
    const allFiles = [filename];
    // return all the file metadata
    return allFiles
        .map((file) => {
            return {
                path: resolve(file),
                ext: ext,
                module: extensions[ext] || null,
            };
        })
        .filter((e) => existsSync(e.path));
};

// Prepare rechoir environment to load multiple file formats
const requireLoader = (extension, path) => {
    rechoir.prepare(extensions, path, process.cwd());
};

// Reads a config file given the config metadata
const requireConfig = (configModule) => {
    const extension = Object.keys(jsVariants).find((t) => configModule.ext.endsWith(t));

    if (extension) {
        requireLoader(extension, configModule.path);
    }

    let config = require(configModule.path);
    if (config.default) {
        config = config.default;
    }

    return {
        content: config,
        path: configModule.path,
    };
};

// Responsible for reading user configuration files
// else does a default config lookup and resolves it.
const resolveConfigFiles = async (args) => {
    const { config, mode } = args;
    if (config && config.length > 0) {
        const resolvedOptions = [];
        const finalizedConfigs = config.map(async (webpackConfig) => {
            const configPath = resolve(webpackConfig);
            const configFiles = getConfigInfoFromFileName(configPath);
            if (!configFiles.length) {
                throw new ConfigError(`The specified config file doesn't exist in ${configPath}`);
            }
            const foundConfig = configFiles[0];
            const resolvedConfig = requireConfig(foundConfig);
            return finalize(resolvedConfig, args);
        });
        // resolve all the configs
        for await (const resolvedOption of finalizedConfigs) {
            if (Array.isArray(resolvedOption.options)) {
                resolvedOptions.push(...resolvedOption.options);
            } else {
                resolvedOptions.push(resolvedOption.options);
            }
        }
        // When the resolved configs are more than 1, then pass them as Array [{...}, {...}] else pass the first config object {...}
        const finalOptions = resolvedOptions.length > 1 ? resolvedOptions : resolvedOptions[0] || {};

        opts['options'] = finalOptions;
        return;
    }

    // When no config is supplied, lookup for default configs
    const defaultConfigFiles = getDefaultConfigFiles();
    const tmpConfigFiles = defaultConfigFiles.filter((file) => {
        return existsSync(file.path);
    });

    const configFiles = tmpConfigFiles.map(requireConfig);
    if (configFiles.length) {
        const defaultConfig = configFiles.find((p) => p.path.includes(mode) || p.path.includes(modeAlias[mode]));
        if (defaultConfig) {
            opts = await finalize(defaultConfig, args);
            return;
        }
        const foundConfig = configFiles.pop();
        opts = await finalize(foundConfig, args);
        return;
    }
};

// Given config data, determines the type of config and
// returns final config
const finalize = async (moduleObj, args) => {
    const { env, configName } = args;
    const newOptionsObject = {
        outputOptions: {},
        options: {},
    };

    if (!moduleObj) {
        return newOptionsObject;
    }
    const configPath = moduleObj.path;
    const configOptions = moduleObj.content;
    if (typeof configOptions === 'function') {
        // when config is a function, pass the env from args to the config function
        let formattedEnv;
        if (Array.isArray(env)) {
            formattedEnv = env.reduce((envObject, envOption) => {
                envObject[envOption] = true;
                return envObject;
            }, {});
        }
        const newOptions = configOptions(formattedEnv, args);
        // When config function returns a promise, resolve it, if not it's resolved by default
        newOptionsObject['options'] = await Promise.resolve(newOptions);
    } else if (configName) {
        if (Array.isArray(configOptions) && configOptions.length > 1) {
            // In case of exporting multiple configurations, If you pass a name to --config-name flag,
            // webpack will only build that specific configuration.
            const namedOptions = configOptions.filter((opt) => configName.includes(opt.name));
            if (namedOptions.length === 0) {
                logger.error(`Configuration with name "${configName}" was not found.`);
                process.exit(2);
            } else {
                newOptionsObject['options'] = namedOptions;
            }
        } else {
            logger.error('Multiple configurations not found. Please use "--config-name" with multiple configurations.');
            process.exit(2);
        }
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
};

const resolveConfigMerging = async (args) => {
    const { merge } = args;
    if (merge) {
        // Get the current configuration options
        const { options: configOptions } = opts;

        // we can only merge when there are multiple configurations
        // either by passing multiple configs by flags or passing a
        // single config exporting an array
        if (!Array.isArray(configOptions)) {
            throw new ConfigError('Atleast two configurations are required for merge.', 'MergeError');
        }

        // We return a single config object which is passed to the compiler
        const mergedOptions = configOptions.reduce((currentConfig, mergedConfig) => webpackMerge(currentConfig, mergedConfig), {});
        opts['options'] = mergedOptions;
    }
};

const handleConfigResolution = async (args) => {
    await resolveConfigFiles(args);
    await resolveConfigMerging(args);
    return opts;
};

module.exports = handleConfigResolution;
