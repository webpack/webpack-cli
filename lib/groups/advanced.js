const GroupHelper = require('../utils/group-helper');

class AdvancedGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }
    loadPlugin(name) {
        const loadUtils = require('loader-utils');
        let args;
        try {
            const p = name && name.indexOf('?');
            if (p > -1) {
                args = loadUtils.parseQuery(name.substring(p));
                name = name.substring(0, p);
            }
        } catch (e) {
            process.cliLogger.error('Invalid plugin arguments ' + name + ' (' + e + ').');
            process.exit(-1); // eslint-disable-line
        }

        let path;
        try {
            const resolve = require('enhanced-resolve');
            path = resolve.sync(process.cwd(), name);
        } catch (e) {
            process.cliLogger.error('Cannot resolve plugin ' + name + '.');
            process.exit(-1); // eslint-disable-line
        }
        let Plugin;
        try {
            Plugin = require(path);
        } catch (e) {
            process.cliLogger.error('Cannot load plugin ' + name + '. (' + path + ')');
            throw e;
        }
        try {
            return new Plugin(args);
        } catch (e) {
            process.cliLogger.error('Cannot instantiate plugin ' + name + '. (' + path + ')');
            throw e;
        }
    }
    resolveOptions() {
        const { args } = this;
        if (args.hot) {
            const { HotModuleReplacementPlugin } = require('webpack');
            const hotModuleVal = new HotModuleReplacementPlugin();
            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(hotModuleVal);
            } else {
                this.opts.options.plugins = [hotModuleVal];
            }
        }
        if (args.prefetch) {
            const { PrefetchPlugin } = require('webpack');
            const prefetchVal = new PrefetchPlugin(null, args.prefetch);
            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(prefetchVal);
            } else {
                this.opts.options.plugins = [prefetchVal];
            }
        }
        if (args.plugin) {
            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(this.loadPlugin(args.plugin));
            } else {
                this.opts.options.plugins = [this.loadPlugin(args.plugin)];
            }
        }
        if (args.target) {
            this.opts.options.target = args.target;
        }

        if (args.global) {
            const globalArrLen = args.global.length;
            if (!globalArrLen) {
                process.cliLogger.warn('Argument to global flag is none');
                return;
            }
            if (globalArrLen === 1) {
                process.cliLogger.warn('Argument to global flag expected a key/value pair');
                return;
            }

            const providePluginObject = {};
            args.global.forEach((arg, idx) => {
                const isKey = idx % 2 === 0 ? true : false;
                const isConcatArg = arg.includes('=');
                if (isKey && isConcatArg) {
                    const splitIdx = arg.indexOf('=');
                    const argVal = arg.substr(splitIdx + 1);
                    const argKey = arg.substr(0, splitIdx);
                    if (!argVal.length) {
                        process.cliLogger.warn(`Found unmatching value for global flag key '${argKey}'`);
                        return;
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (providePluginObject.hasOwnProperty(argKey)) {
                        process.cliLogger.warn(`Overriding key '${argKey}' for global flag`);
                    }
                    providePluginObject[argKey] = argVal;
                    return;
                }
                if (isKey) {
                    const nextArg = args.global[idx + 1];
                    // eslint-disable-next-line no-prototype-builtins
                    if (providePluginObject.hasOwnProperty(arg)) {
                        process.cliLogger.warn(`Overriding key '${arg}' for global flag`);
                    }
                    if (!nextArg) {
                        process.cliLogger.warn(`Found unmatching value for global flag key '${arg}'`);
                        return;
                    }
                    providePluginObject[arg] = nextArg;
                }
            });

            const { ProvidePlugin } = require('webpack');
            const globalVal = new ProvidePlugin(providePluginObject);
            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(globalVal);
            } else {
                this.opts.options.plugins = [globalVal];
            }
        }
    }
    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = AdvancedGroup;
