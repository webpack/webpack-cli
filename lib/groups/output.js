const path = require('path');
const GroupHelper = require('../utils/group-helper');

class OutputGroup extends GroupHelper {
    constructor(options) {
        super(options);
    }

    resolveOptions() {
        const { args, resolveFilePath } = this;

        this.opts = {
            options: {
                output: {},
            },
        };

        if (args) {
            if (args.output) {
                const outputInfo = path.parse(args.output);
                this.opts.options.output['path'] = outputInfo.dir ? path.resolve(process.cwd(), outputInfo.dir) : path.resolve(process.cwd(), 'dist');
                this.opts.options.output.filename = outputInfo.base;
            } else {
                this.opts.options.output['path'] = resolveFilePath(args.output, 'dist');
                this.opts.options.output.filename = 'bundle.js';
            }
        }
    }

    run() {
        this.resolveOptions();
        return this.opts;
    }
}

module.exports = OutputGroup;
