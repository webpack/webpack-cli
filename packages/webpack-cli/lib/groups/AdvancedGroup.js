const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
const { yellow } = require('chalk');

class AdvancedGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }
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
                options.plugins = [prefetchVal];
            }
        }
        if (args.target) {
            const validTargets = [
                'web',
                'webworker',
                'node',
                'async-node',
                'node-webkit',
                'electron-main',
                'electron-renderer',
                'electron-preload',
            ];
            if (validTargets.includes(args.target)) {
                options.target = args.target;
            } else {
                logger.warn(yellow(`"${args.target}" is an invalid value for "target" option. Using "web" by default.`));
                options.target = 'web';
            }
        }
    }
    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = AdvancedGroup;
