const schema = require('./optionsSchema');

class ErrorHelper {
    constructor() {
        this.errors = [];
    }
    verifyType(key, val) {
        const schemaProp = schema[key];
        console.log(schemaProp)
        // arrrays -> schemaProps.includes(val);
    }
}

module.exports = ErrorHelper;