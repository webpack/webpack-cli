const GroupHelper = require('../utils/GroupHelper');
/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    resolveOptions() {
        const { stats, json } = this.args;
        if (stats !== undefined) {
            this.opts.options.stats = stats;
        }
        if (json) {
            this.opts.outputOptions.json = true;
        }
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = StatsGroup;
