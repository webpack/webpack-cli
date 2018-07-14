const ErrorHelper = require('../utils/error-helper');

class ConfigGroup extends ErrorHelper {
    constructor(options) {
        super(options);
        this.opts = options;
    }

    processOptions() {
        this.opts.forEach( (opt) => {
            // check type of the option, push an error otherwise
            Object.keys(opt).forEach( key => {
                this.verifyType(key, opt[key])
            })
        })
    }
    run() {
        this.processOptions();
        return null;
    }
}

module.exports = ConfigGroup;