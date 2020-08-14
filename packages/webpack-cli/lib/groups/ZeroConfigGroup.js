const GroupHelper = require('../utils/GroupHelper');

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
/**
 * ZeroConfigGroup creates a zero configuration based on the environment
 */
class ZeroConfigGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    /**
     * It determines the mode to pass to webpack compiler
     * @returns {string} The mode
     */
    resolveMode() {
        if (process.env.NODE_ENV && (process.env.NODE_ENV === PRODUCTION || process.env.NODE_ENV === DEVELOPMENT)) {
            return process.env.NODE_ENV;
        } else {
            if (this.args.mode) {
                return this.args.mode;
            }
        }
    }

    run() {
        this.opts.options.mode = this.resolveMode();
        return this.opts;
    }
}

module.exports = ZeroConfigGroup;
