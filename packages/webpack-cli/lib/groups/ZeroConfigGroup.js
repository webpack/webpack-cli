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
    getEnvFromOptionsAndMode() {
        if (process.env.NODE_ENV && (process.env.NODE_ENV === PRODUCTION || process.env.NODE_ENV === DEVELOPMENT)) {
            return process.env.NODE_ENV;
        } else {
            if ((this.args.mode || this.args.noMode) && (this.args.dev || this.args.prod)) {
                logger.warn(
                    `You provided both ${this.args.mode ? 'mode' : 'no-mode'} and ${
                        this.args.prod ? '--prod' : '--dev'
                    } arguments. You should provide just one. "${this.args.mode ? 'mode' : 'no-mode'}" will be used`,
                );
                if (this.args.mode){
                    return this.args.mode ;
                } else {
                    return NONE ;
                }
            }
            if (this.args.noMode && this.args.mode) {
                logger.warn(
                    'You Provided both mode and no-mode arguments. You Should Provide just one. "mode" will be used.'
                )
            }
            if (this.args.mode) {
                return this.args.mode;
            }
            if (this.args.prod) {
                return PRODUCTION;
            } else if (this.args.dev) {
                return DEVELOPMENT;
            } else if (this.args.noMode) {
                return NONE;
            }
            return PRODUCTION;
        }
    }

    resolveZeroConfig() {
        const defaultConfigType = this.getEnvFromOptionsAndMode();
        let defaultConfig;
        if (defaultConfigType === PRODUCTION) {
            defaultConfig = require('../utils/production-config')();
        } else if (defaultConfigType === DEVELOPMENT) {
            defaultConfig = require('../utils/development-config')();
        } else {
            defaultConfig = require('../utils/none-config')();
        }

        const isEntryObject = defaultConfig.entry && defaultConfig.entry instanceof Object;
        const isOutputDefined = defaultConfig.output && defaultConfig.output.filename;
        const isConflictingOutput = isEntryObject && isOutputDefined && defaultConfig.output.filename === 'main.js';
        if (isConflictingOutput) {
            defaultConfig.output.filename = '[name].main.js';
        }
        this.opts.options = defaultConfig;
    }

    run() {
        this.resolveZeroConfig();
        return this.opts;
    }
}

module.exports = ZeroConfigGroup;
