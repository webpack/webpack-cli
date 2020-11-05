const path = require('path');
const { core, groups } = require('../utils/cli-flags');
const { packageExists } = require('../utils/package-exists');
const { promptInstallation } = require('../utils/prompt-installation');
const { yellow } = require('colorette');
const { error, success } = require('../utils/logger');

const WEBPACK_OPTION_FLAGS = core
    .filter((coreFlag) => {
        return coreFlag.group === groups.BASIC_GROUP;
    })
    .reduce((result, flagObject) => {
        result.push(flagObject.name);
        if (flagObject.alias) {
            result.push(flagObject.alias);
        }
        return result;
    }, []);

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

/*
    Mode priority:
        - Mode flag
        - Mode from config
        - Mode form NODE_ENV
    */
/**
 *
 * @param {string} mode - mode flag value
 * @param {Object} configObject - contains relevant loaded config
 */
const assignMode = (mode, configObject, options) => {
    const {
        env: { NODE_ENV },
    } = process;
    const { mode: configMode } = configObject;
    let finalMode;
    if (mode) {
        finalMode = mode;
    } else if (configMode) {
        finalMode = configMode;
    } else if (NODE_ENV && (NODE_ENV === PRODUCTION || NODE_ENV === DEVELOPMENT)) {
        finalMode = NODE_ENV;
    } else {
        finalMode = PRODUCTION;
    }
    options.mode = finalMode;
};

const resolveArgs = async (args, configOptions) => {
    const { outputPath, stats, json, mode, target, prefetch, hot, analyze } = args;

    const finalOptions = {
        options: {},
        outputOptions: {},
    };
    Object.keys(args).forEach((arg) => {
        if (WEBPACK_OPTION_FLAGS.includes(arg)) {
            finalOptions.outputOptions[arg] = args[arg];
        }
        if (arg === 'devtool') {
            finalOptions.options.devtool = args[arg];
        }
        if (arg === 'name') {
            finalOptions.options.name = args[arg];
        }
        if (arg === 'watch') {
            finalOptions.options.watch = true;
        }
        if (arg === 'entry') {
            finalOptions.options[arg] = args[arg];
        }
    });
    if (outputPath) {
        finalOptions.options.output = { path: path.resolve(outputPath) };
    }

    if (stats !== undefined) {
        finalOptions.options.stats = stats;
    }
    if (json) {
        finalOptions.outputOptions.json = json;
    }

    if (hot) {
        const { HotModuleReplacementPlugin } = require('webpack');
        const hotModuleVal = new HotModuleReplacementPlugin();
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(hotModuleVal);
        } else {
            finalOptions.options.plugins = [hotModuleVal];
        }
    }
    if (prefetch) {
        const { PrefetchPlugin } = require('webpack');
        const prefetchVal = new PrefetchPlugin(null, args.prefetch);
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(prefetchVal);
        } else {
            finalOptions.options.plugins = [prefetchVal];
        }
    }
    if (analyze) {
        if (packageExists('webpack-bundle-analyzer')) {
            // eslint-disable-next-line node/no-extraneous-require
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            const bundleAnalyzerVal = new BundleAnalyzerPlugin();
            if (finalOptions.options && finalOptions.options.plugins) {
                finalOptions.options.plugins.unshift(bundleAnalyzerVal);
            } else {
                finalOptions.options.plugins = [bundleAnalyzerVal];
            }
        } else {
            await promptInstallation('webpack-bundle-analyzer', () => {
                error(`It looks like ${yellow('webpack-bundle-analyzer')} is not installed.`);
            })
                .then(() => success(`${yellow('webpack-bundle-analyzer')} was installed sucessfully.`))
                .catch(() => {
                    error(`Action Interrupted, Please try once again or install ${yellow('webpack-bundle-analyzer')} manually.`);
                    process.exit(2);
                });
        }
    }
    if (target) {
        finalOptions.options.target = args.target;
    }

    if (Array.isArray(configOptions)) {
        configOptions.map((configObject) => assignMode(mode, configObject, finalOptions.options));
    } else assignMode(mode, configOptions, finalOptions.options);

    return finalOptions;
};

module.exports = resolveArgs;
