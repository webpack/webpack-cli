const GroupHelper = require('../utils/group-helper');

class StatsGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    resolveOptions() {
        Object.keys(this.args).forEach(arg => {
            if (['quiet', 'verbose', 'json', 'silent'].includes(arg)) {
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
