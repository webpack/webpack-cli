const path = require('path');
const GroupHelper = require('../utils/group-helper');

const DEFAULT_FILENAME = 'bundle.js';

class OutputGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.opts = {
            options: {
                output: {},
            },
        };
    }

    parseDirectory(metaData) {
        return {
            filename: DEFAULT_FILENAME,
            path: path.resolve(metaData.dir, metaData.name),
        };
    }

    resolveOptions() {
        const { args } = this;
        if (args) {
            const { output } = args;
            if (!output) {
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
