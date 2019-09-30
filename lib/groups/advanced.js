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
            const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
            this.opts.options.plugins = [new HotModuleReplacementPlugin()];
        }
        if (args.debug) {
            const LoaderOptionsPlugin = require('webpack').LoaderOptionsPlugin;
            const loaderPluginVal = new LoaderOptionsPlugin({
                debug: true,
            });

            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(loaderPluginVal);
            } else {
                this.opts.options.plugins = [loaderPluginVal];
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
        if (args.global) {
            let value = args.global;
            const idx = value.indexOf('=');
            let name;
            if (idx >= 0) {
                name = value.substr(0, idx);
                value = value.substr(idx + 1);
            } else {
                name = value;
            }
            const ProvidePlugin = require('webpack').ProvidePlugin;
            if (this.opts.options && this.opts.options.plugins) {
                this.opts.options.plugins.unshift(new ProvidePlugin(name, value));
            } else {
                this.opts.options.plugins = [this.loadPlugin(args.plugin)];
            }
        }
        if (args.target) {
            this.opts.options.target = args.target;
        }
    }
    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = AdvancedGroup;
