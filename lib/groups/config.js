const ErrorHelper = require('../utils/error-helper');

class ConfigGroup extends ErrorHelper {
    constructor(options) {
        super(options);
        this.opts = this.processOptions(options);
    }
    run() {
        return this.opts;
    }
}

module.exports = ConfigGroup;