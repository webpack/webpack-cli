const GroupHelper = require('../utils/GroupHelper');

/**
 * StatsGroup gathers information about the stats options
 */
class StatsGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    resolveOptions() {
        Object.keys(this.args).forEach(arg => {
            if (['quiet', 'verbose', 'json', 'silent', 'standard'].includes(arg)) {
                this.opts.outputOptions[arg] = this.args[arg];
            } else {
                this.opts.options[arg] = this.args[arg];
            }
        });
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = StatsGroup;
