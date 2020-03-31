const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    static validOptions() {
        return ['none', 'errors-only', 'minimal', 'normal', 'detailed', 'verbose', 'errors-warnings'];
    }

    constructor(options) {
        super(options);
    }

    resolveOptions() {
        if (this.args.verbose && this.args.stats) {
            logger.warn('Conflict between "verbose" and "stats" options. Using verbose.');
            this.opts.option.stats = {
                verbose: true,
            };
        } else {
            if (this.args.verbose) {
                this.opts.option.stats = {
                    verbose: true,
                };
            } else {
                this.opts.options.stats = this.args.stats;
            }
        }
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = StatsGroup;
