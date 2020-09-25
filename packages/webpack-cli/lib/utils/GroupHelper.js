const { arrayToObject } = require('../utils/arg-utils');

class GroupHelper {
    constructor(options) {
        this.args = arrayToObject(options);
        this.opts = {
            outputOptions: {},
            options: {},
        };
        this.strategy = undefined;
    }

    run() {
        throw new Error('You must implement the "run" function');
    }
}

module.exports = GroupHelper;
