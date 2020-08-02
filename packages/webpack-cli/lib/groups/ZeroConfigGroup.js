const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const NONE = 'none';
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
                if (this.args.mode !== PRODUCTION && this.args.mode !== DEVELOPMENT && this.args.mode !== NONE) {
                    logger.warn('You provided an invalid value for "mode" option. Using "production" by default');
                    return PRODUCTION;
                }
                return this.args.mode;
            }
            return PRODUCTION;
        }
    }

    run() {
        this.opts.options.mode = this.resolveMode();
        return this.opts;
    }
}

module.exports = ZeroConfigGroup;
