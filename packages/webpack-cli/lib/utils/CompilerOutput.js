class CompilerOutput {
    generateRawOutput(stats, options) {
        process.stdout.write(stats.toString(options.stats));
    }

    generateJsonOutput() {}

    /**
     * Given an array of entry points from webpack compiler,
     * it builds a string with a simple information
     *
     * @param {object[]} chunks Chunks emitted by compilation
     * @private
     * @returns {string} An array of strings with information of the entry points
     */
    _createChunksOutput(chunks) {
        return chunks
            .map((chunk) => {
                const moduleString = chunk.modules
                    .map((module) => {
                        return `${module.name} [size: ${module.size} bytes]`;
                    })
                    .join('\n');

                return moduleString;
            })
            .slice(0, 15)
            .join('\n');
    }
}

module.exports = { CompilerOutput };
