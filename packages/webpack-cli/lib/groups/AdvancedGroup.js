const GroupHelper = require('../utils/GroupHelper');

class AdvancedGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }
    // TODO: fixme. This function is requiring modules that are not installed
    // loadPlugin(name) {
    //     const loadUtils = require('loader-utils');
    //     let args;
    //     try {
    //         const p = name && name.indexOf('?');
    //         if (p > -1) {
    //             args = loadUtils.parseQuery(name.substring(p));
    //             name = name.substring(0, p);
    //         }
    //     } catch (e) {
    //         logger.error('Invalid plugin arguments ' + name + ' (' + e + ').');
    //         process.exit(-1); // eslint-disable-line
    //     }
    //
    //     let path;
    //     try {
    //         const resolve = require('enhanced-resolve');
    //         path = resolve.sync(process.cwd(), name);
    //     } catch (e) {
    //         logger.error('Cannot resolve plugin ' + name + '.');
    //         process.exit(-1); // eslint-disable-line
    //     }
    //     let Plugin;
    //     try {
    //         Plugin = require(path);
    //     } catch (e) {
    //         logger.error('Cannot load plugin ' + name + '. (' + path + ')');
    //         throw e;
    //     }
    //     try {
    //         return new Plugin(args);
    //     } catch (e) {
    //         logger.error('Cannot instantiate plugin ' + name + '. (' + path + ')');
    //         throw e;
    //     }
    // }
    resolveOptions() {
        const {
            args,
            opts: { options },
        } = this;

        if (args.hot) {
            const { HotModuleReplacementPlugin } = require('webpack');
            const hotModuleVal = new HotModuleReplacementPlugin();
            if (options && options.plugins) {
                options.plugins.unshift(hotModuleVal);
            } else {
                options.plugins = [hotModuleVal];
            }
        }
        if (args.prefetch) {
            const { PrefetchPlugin } = require('webpack');
            const prefetchVal = new PrefetchPlugin(null, args.prefetch);
            if (options && options.plugins) {
                options.plugins.unshift(prefetchVal);
            } else {
                // Currently the Plugin function is not functional  -> https://github.com/webpack/webpack-cli/pull/1140#discussion_r376761359
                // options.plugins = [prefetchVal];
            }
        }
        if (args.plugin) {
            if (options && options.plugins) {
                options.plugins.unshift(this.loadPlugin(args.plugin));
            } else {
                options.plugins = [this.loadPlugin(args.plugin)];
            }
        }
        if (args.target) {
            options.target = args.target;
        }
    }
    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = AdvancedGroup;
