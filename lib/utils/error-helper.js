const schema = require('../descriptions/schema');

class ErrorHelper {
    constructor() {
        this.errors = [];
    }
    verifyType(key, val) {
        const schemaProp = schema[key];
        if(!schemaProp.includes(val)) {
            console.log(val)
        }
    }
}

module.exports = ErrorHelper;