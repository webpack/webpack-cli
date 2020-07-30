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
        if (this.args.verbose && this.args.stats) {
            logger.warn('Conflict between "verbose" and "stats" options. Using verbose.');
            this.opts.options.stats = 'verbose';
        } else {
            if (this.args.verbose) {
                this.opts.options.stats = 'verbose';
            } else if (this.args.stats && !StatsGroup.validOptions().includes(this.args.stats)) {
                logger.warn(`'${this.args.stats}' is invalid value for stats. Using 'normal' option for stats`);
                this.opts.options.stats = 'normal';
            } else {
                this.opts.options.stats = this.args.stats;
            }
        }
        if (this.args.json) {
            this.opts.outputOptions.json = true;
        }
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = StatsGroup;
