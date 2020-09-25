const path = require('path');

/**
 * Resolves the output flag
 * @param {args} args - Parsed arguments passed to the CLI
 */
const resolveOutput = (args) => {
    const { output } = args;
    const finalOptions = {
        options: { output: {} },
        outputOptions: {},
    };
    if (output) {
        const { dir, base } = path.parse(output);
        finalOptions.options.output.path = path.resolve(dir);
        finalOptions.options.output.filename = base;
    }
    return finalOptions;
};

module.exports = resolveOutput;
