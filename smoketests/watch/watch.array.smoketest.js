#!/usr/bin/env node

const assert = require('assert');
const { unlinkSync, renameSync } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const { appendDataIfFileExists, runAndGetWatchProc, copyFileAsync } = require('../../test/utils/test-utils');

console.log('\n============================ ARRAY/CHILD COMPILATION ============================\n');

const testEntryFiles = [
    {
        name: 'dev.js',
        fp: resolve(__dirname, 'dev.js'),
        cpFp: null,
    },
    {
        name: 'prod.js',
        fp: resolve(__dirname, 'prod.js'),
        cpFP: null,
    },
];

/**
 * Make a copy of each file
 * @returns {void}
 */
async function setup() {
    await testEntryFiles.forEach(async (file) => {
        // eslint-disable-next-line
        file.cpFP = await copyFileAsync(__dirname, file.name);
    });
}

/**
 * Remove symlinks, restore file
 * @returns {void}
 */
async function teardown() {
    testEntryFiles.forEach((file) => {
        try {
            unlinkSync(file.fp);
        } catch (e) {
            console.warn('could not remove the file:' + file.fp + '\n' + e.message);
        } finally {
            renameSync(file.cpFP, file.fp);
        }
    });
}

// eslint-disable-next-line
(async () => {
    try {
        await setup();

        // Spawn one process in watch mode and fill up a buffer of results
        const webpackProc = runAndGetWatchProc(__dirname, ['--watch', '--config', './webpack.array.config.js']);
        const dataBuffer = [];

        const id = setInterval(() => {
            // Close process if time is over 5s
            if (process.uptime() > 5) {
                assert.strictEqual(true, false, 'Test for child compilation hang, exiting');
                process.exit(-1);
            } else if (dataBuffer.length > 3) {
                clearInterval(id);
                webpackProc.kill('SIGINT');
                return;
            }
            appendDataIfFileExists(__dirname, testEntryFiles[0].name, '//junk-comment');
            appendDataIfFileExists(__dirname, testEntryFiles[1].name, '//junk2-comment');
        }, 1000);

        // Array based configuration with child compilation
        webpackProc.stdout.on('data', (data) => {
            data = data.toString();
            console.log(data);
            dataBuffer.push(data);
            // Close process if buffer is full enough
            if (dataBuffer.length > 3) {
                webpackProc.kill('SIGINT');
                return;
            }
        });

        // Buffer should have compiled equal amount of each compilation and have diff output directories
        // eslint-disable-next-line
        webpackProc.stderr.on('close', async () => {
            assert.strictEqual(dataBuffer.length > 3, true, 'expected buffer for array configuration to be more than 3');
            await teardown();
            webpackProc.kill('SIGINT');
        });
    } catch (e) {
        // Nothing
    }
})();
