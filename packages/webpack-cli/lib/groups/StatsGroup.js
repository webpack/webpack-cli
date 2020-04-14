const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    static validOptions() {
        let validArrayString = ['none', 'errors-only', 'minimal', 'normal', 'detailed', 'verbose', 'errors-warnings'];
        let validArrayObject = [{ verbose: true }, { verbose: true, stats: 'verbose' }];
        return { validArrayString, validArrayObject };
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
