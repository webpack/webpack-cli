class ConfigGroup {
    constructor(options) {
        this.opts = options;
    }

    processOptions() {
        this.opts.forEach( (opt) => {
            // check type of the option, push an error otherwise
            console.log(opt, "yo")
        })
    }
    run() {
        this.processOptions();
        return null;
    }
}

module.exports = ConfigGroup;