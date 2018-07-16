const ErrorHelper = require('../utils/error-helper');

class InitGroup extends ErrorHelper {
    constructor(options) {
        super(options);
        this.opts = this.processOptions(options);
    }
    run() {
        return this.opts;
    }
}

module.exports = InitGroup;