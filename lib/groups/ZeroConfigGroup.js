const GroupHelper = require('../utils/GroupHelper');

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
    getEnvFromOptionsAndMode() {
        if (process.env.NODE_ENV && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development')) {
            return process.env.NODE_ENV;
        } else if (this.args.prod) {
            return 'production';
        } else if (this.args.dev) {
            return 'development';
        }
        return 'production';
    }

    resolveZeroConfig() {
        const defaultConfigType = this.getEnvFromOptionsAndMode();
        const defaultConfig = require(`./${defaultConfigType}-config`)();

        const isEntryObject = defaultConfig.entry && defaultConfig.entry instanceof Object;
        const isOutputDefined = defaultConfig.output && defaultConfig.output.filename;
        const isConflictingOutput = isEntryObject && isOutputDefined && defaultConfig.output.filename === 'bundle.js';
        if (isConflictingOutput) {
            defaultConfig.output.filename = '[name].bundle.js';
        }
        this.opts.options = defaultConfig;
    }

    run() {
        this.resolveZeroConfig();
        return this.opts;
    }
}

module.exports = ZeroConfigGroup;
