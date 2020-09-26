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
        const { dir, base, ext } = path.parse(output);
        finalOptions.options.output.path = ext.length === 0 ? path.resolve(dir, base) : path.resolve(dir);
        if (ext.length > 0) finalOptions.options.output.filename = base;
    }
    return finalOptions;
};

module.exports = resolveOutput;
