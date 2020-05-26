const GroupHelper = require('../utils/GroupHelper');

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
            options.target = args.target;
        }
    }
    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = AdvancedGroup;
