const chalk = require('chalk');
const Table = require('cli-table3');
const webpack = require('webpack');
const logger = require('./logger');

class CompilerOutput {
    generateFancyOutput(statsObj, statsErrors, processingMessageBuffer) {
        const { assets, entrypoints, time, builtAt, warnings, outputPath, hash, chunks } = statsObj;

        const visibleEmojies = this._showEmojiConditionally() ? ['✅', '🌏', '⚒️ ', '⏱ ', '📂', '#️⃣'] : new Array(6).fill('');

        process.stdout.write('\n');
        process.stdout.write(`${visibleEmojies[0]} ${chalk.underline.bold('Compilation Results')}\n`);
        process.stdout.write('\n');
        process.stdout.write(`${visibleEmojies[1]} Version: ${webpack.version}\n`);
        process.stdout.write(`${visibleEmojies[2]} Built: ${new Date(builtAt).toString()}\n`);
        process.stdout.write(`${visibleEmojies[3]} Compile Time: ${time}ms\n`);
        process.stdout.write(`${visibleEmojies[4]} Output Directory: ${outputPath}\n`);
        process.stdout.write(`${visibleEmojies[5]} Hash: ${hash}\n`);
        process.stdout.write('\n');

        const assetsTble = new Table({
            head: ['Entrypoint', 'Bundle'],
            style: { compact: true, 'padding-left': 1, head: [] },
        });

        let compilationTableEmpty = true;

        Object.keys(entrypoints).forEach(entry => {
            const entrypoint = entrypoints[entry];
            entrypoint.assets.forEach(assetName => {
                const asset = assets.find(asset => {
                    return asset.name === assetName;
                });
                const entrypointChunks = entrypoint.chunks.map(id => {
                    return chunks.find(chunk => chunk.id === id);
                });

                const chunksOutput = this._createChunksOutput(entrypointChunks);
                const kbSize = `${(asset.size / 1000).toFixed(2)} kb`;
                const hasBeenCompiled = asset.comparedForEmit;
                const bundleTbl = new Table({
                    chars: {
                        top: '',
                        'top-mid': '',
                        'top-left': '',
                        'top-right': '',
                        bottom: '',
                        'bottom-mid': '',
                        'bottom-left': '',
                        'bottom-right': '',
                        left: '',
                        'left-mid': '',
                        mid: '',
                        'mid-mid': '',
                        right: '',
                        'right-mid': '',
                    },
                    style: { compact: true },
                });
                bundleTbl.push({ 'Bundle Name': asset.name });
                bundleTbl.push({ 'Compared For Emit': hasBeenCompiled });
                bundleTbl.push({ 'Bundle size': kbSize });
                const bundleOutput = bundleTbl.toString() + `\n\nModules:\n${chunksOutput}`;
                assetsTble.push([entrypoint.name, bundleOutput]);
                compilationTableEmpty = false;
            });
        });

        if (!compilationTableEmpty) {
            process.stdout.write(assetsTble.toString());
        }

        if (processingMessageBuffer.length > 0) {
            processingMessageBuffer.forEach(buff => {
                if (buff.lvl === 'warn') {
                    warnings.push(buff.msg);
                } else {
                    statsErrors.push(buff.msg);
                }
            });
        }

        if (warnings) {
            warnings.forEach(warning => {
                process.stdout.write('\n\n');

                if (warning.message) {
                    logger.warn(warning.message);
                    process.stdout.write('\n');
                    logger.debug(warning.stack);
                    return;
                }
                logger.warn(warning);
            });
            process.stdout.write('\n');
        }

        if (statsErrors) {
            statsErrors.forEach(err => {
                if (err.loc) logger.warn(err.loc);
                if (err.name) {
                    process.stdout.write('\n');
                    logger.error(err.name);
                }
            });
        }
        return statsObj;
    }

    generateRawOutput(stats) {
        process.stdout.write(stats.toString());
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
            .map(chunk => {
                const moduleString = chunk.modules
                    .map(module => {
                        return `${module.name} [size: ${module.size} bytes]`;
                    })
                    .join('\n');

                return moduleString;
            })
            .slice(0, 15)
            .join('\n');
    }

    _showEmojiConditionally() {
        return process.stdout.isTTY && process.platform === 'darwin';
    }
}

module.exports = { CompilerOutput };
