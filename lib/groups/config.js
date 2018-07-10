const ErrorHelper = require('../utils/error-helper');

class ConfigGroup extends ErrorHelper {
    constructor(options) {
        super();
        this.opts = options;
    }

    processOptions() {
        this.opts.forEach( (opt) => {
            // check type of the option, push an error otherwise
           // this.verifyType(opt)
           console.log(opt)
        })
    }
    run() {
        this.processOptions();
        return null;
    }
}

module.exports = ConfigGroup;