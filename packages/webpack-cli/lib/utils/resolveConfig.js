const { existsSync } = require('fs');
const { resolve, extname } = require('path');
const webpackMerge = require('webpack-merge');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');
const logger = require('./logger');

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

// Reads a config file given the config metadata
const requireConfig = (configModule) => {
    const extension = Object.keys(jsVariants).find((t) => configModule.ext.endsWith(t));

    if (extension) {
        rechoir.prepare(extensions, configModule.path, process.cwd());
    }

    let config = require(configModule.path);

    if (config.default) {
        config = config.default;
    }

    return { config, path: configModule.path };
};

// Responsible for reading user configuration files
// else does a default config lookup and resolves it.
const resolveConfigFiles = async (args, configOptions) => {
    const { config, mode } = args;

    if (config && config.length > 0) {
        const resolvedOptions = [];
        const finalizedConfigs = config.map(async (webpackConfig) => {
            const configPath = resolve(webpackConfig);
            const configFiles = getConfigInfoFromFileName(configPath);

            if (!configFiles.length) {
                logger.error(`The specified config file doesn't exist in ${configPath}`);
                process.exit(2);
            }

            const foundConfig = configFiles[0];
            const resolvedConfig = requireConfig(foundConfig);

            return finalize(resolvedConfig, args, configOptions);
        });

        // resolve all the configs
        for await (const resolvedOption of finalizedConfigs) {
            if (Array.isArray(resolvedOption.options)) {
                resolvedOptions.push(...resolvedOption.options);
            } else {
                resolvedOptions.push(resolvedOption.options);
            }
        }

        configOptions['options'] = resolvedOptions.length > 1 ? resolvedOptions : resolvedOptions[0] || {};

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
            configOptions = await finalize(defaultConfig, args, configOptions, true);
            return;
        }

        const foundConfig = configFiles.pop();
        configOptions = await finalize(foundConfig, args, configOptions, true);
        return;
    }
};

// Given config data, determines the type of config and
// returns final config
const finalize = async (moduleObj, args, configOptions, isDefaultConfig = false) => {
    const { env, configName } = args;

    if (!moduleObj) {
        return configOptions;
    }

    if (isDefaultConfig) {
        configOptions.outputOptions.defaultConfig = moduleObj.path;
    }

    const config = moduleObj.config;

    const isMultiCompilerMode = Array.isArray(config);
    const rawConfigs = isMultiCompilerMode ? config : [config];

    let configs = [];

    const allConfigs = await Promise.all(
        rawConfigs.map(async (rawConfig) => {
            const isPromise = typeof rawConfig.then === 'function';

            if (isPromise) {
                rawConfig = await rawConfig;
            }

            // `Promise` may return `Function`
            if (typeof rawConfig === 'function') {
                // when config is a function, pass the env from args to the config function
                rawConfig = await rawConfig(env, args);
            }

            return rawConfig;
        }),
    );

    for (const singleConfig of allConfigs) {
        if (Array.isArray(singleConfig)) {
            configs.push(...singleConfig);
        } else {
            configs.push(singleConfig);
        }
    }

    if (configName) {
        const foundConfigNames = [];

        configs = configs.filter((options) => {
            const found = configName.includes(options.name);

            if (found) {
                foundConfigNames.push(options.name);
            }

            return found;
        });

        if (foundConfigNames.length !== configName.length) {
            // Configuration with name "test" was not found.
            logger.error(
                configName
                    .filter((name) => !foundConfigNames.includes(name))
                    .map((configName) => `Configuration with name "${configName}" was not found.`)
                    .join('\n'),
            );
            process.exit(2);
        }
    }

    if (configs.length === 0) {
        logger.error('No configurations found');
        process.exit(2);
    }

    configOptions['options'] = configs.length > 1 ? configs : configs[0];

    return configOptions;
};

const resolveConfigMerging = async (args, configOptions) => {
    const { merge } = args;

    if (merge) {
        // Get the current configuration options
        const { options } = configOptions;

        // we can only merge when there are multiple configurations
        // either by passing multiple configs by flags or passing a
        // single config exporting an array
        if (!Array.isArray(options)) {
            logger.error('At least two configurations are required for merge.');
            process.exit(2);
        }

        // We return a single config object which is passed to the compiler
        configOptions['options'] = options.reduce((currentConfig, mergedConfig) => webpackMerge(currentConfig, mergedConfig), {});
    }
    return configOptions;
};

module.exports = {
    resolveConfigFiles,
    resolveConfigMerging,
};
