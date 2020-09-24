const path = require('path');

const parseDirectory = (metaData) => {
    return {
        // filename: DEFAULT_FILENAME,
        path: path.resolve(metaData.dir, metaData.name),
    };
};

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
        const outputInfo = path.parse(output);
        if (!outputInfo.ext.length) {
            finalOptions.options.output = parseDirectory(outputInfo);
        } else {
            finalOptions.options.output.path = path.resolve(outputInfo.dir);
            finalOptions.options.output.filename = outputInfo.base;
        }
    }
    return finalOptions;
};

module.exports = resolveOutput;
