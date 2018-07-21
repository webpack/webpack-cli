const schema = require('../descriptions/schema');

class ErrorHelper {
    constructor() {
        this.errors = [];
    }

    processOptions(opts) {
        opts.forEach( (opt) => {
            // check type of the option, push an error otherwise
            Object.keys(opt).forEach( key => {
                this.verifyType(key, opt[key])
            })
        });
        return {
            errors: this.errors,
            opts
        }
    }

    verifyType(key, val) {
        const schemaProp = schema[key];
       /*  if(!schemaProp.includes(val)) {
            const errMsg = 'Unrecognized Option: ' + val + ' supplied to ' + key;
            this.errors.push(errMsg);
        } */
    }
}

module.exports = ErrorHelper;