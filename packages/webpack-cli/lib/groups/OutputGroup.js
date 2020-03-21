const path = require('path');
const GroupHelper = require('../utils/GroupHelper');

class OutputGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.opts = {
            options: {
                output: {},
            },
        };

        this.strategy = {
            'output.filename': 'prepend',
            'output.path': 'prepend',
        };
    }

    parseDirectory(metaData) {
        return {
            // filename: DEFAULT_FILENAME,
            path: path.resolve(metaData.dir, metaData.name),
        };
    }

    resolveOptions() {
        const { args } = this;
        if (args) {
            const { output } = args;
            // TODO: Remove comment before merge
            // We need to show warning when empty output flag is supplied
            // which is set to boolean true by commander
            if (!output || output === true) {
                return;
            }
            const outputInfo = path.parse(output);
            if (!outputInfo.ext.length) {
                this.opts.options.output = this.parseDirectory(outputInfo);
            } else {
                this.opts.options.output.path = path.resolve(outputInfo.dir);
                this.opts.options.output.filename = outputInfo.base;
            }
        }
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = OutputGroup;
