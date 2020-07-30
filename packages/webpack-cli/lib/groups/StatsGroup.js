const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    static validOptions() {
        return ['none', 'errors-only', 'minimal', 'normal', 'detailed', 'verbose', 'errors-warnings', true, false];
    }

    constructor(options) {
        super(options);
    }

    resolveOptions() {
        const { stats, json } = this.args;
        if (stats && !StatsGroup.validOptions().includes(stats)) {
            logger.warn(`'${stats}' is invalid value for stats. Using 'normal' option for stats`);
            this.opts.options.stats = 'normal';
        } else {
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
