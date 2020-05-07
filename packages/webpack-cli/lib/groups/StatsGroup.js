const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    static validOptions() {
        const validArrayString = ['none', 'errors-only', 'minimal', 'normal', 'detailed', 'verbose', 'errors-warnings'];
        const validArrayObject = validArrayString.map((e) => {
            return { verbose: true, stats: `${e}` };
        });
        validArrayObject.push({ verbose: true });
        return { validArrayString, validArrayObject };
    }

    constructor(options) {
        super(options);
    }

    resolveOptions() {
        if (this.args.verbose && this.args.stats) {
            logger.warn('Conflict between "verbose" and "stats" options. Using verbose.');
            this.opts.outputOptions.stats = 'verbose';
        } else {
            if (this.args.verbose) {
                this.opts.outputOptions.stats = 'verbose';
            } else {
                this.opts.outputOptions.stats = this.args.stats;
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
