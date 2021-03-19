'use strict';

const execa = require('execa');
const path = require('path');
const stripAnsi = require('strip-ansi');

const { getRootPath, swapPkgName } = require('../helpers');

const ROOT_PATH = getRootPath();
const CLI_ENTRY_PATH = path.resolve(ROOT_PATH, './packages/webpack-cli/bin/cli.js');

const runTest = () => {
    // Simulate package missing
    swapPkgName('webpack');

    const proc = execa(CLI_ENTRY_PATH, [], {
        cwd: __dirname,
    });

    proc.stdin.setDefaultEncoding('utf-8');

    proc.stdout.on('data', (chunk) => {
        console.log(`  stdout: ${chunk.toString()}`);
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            proc.kill();
        }, 30000);

        const logMessage = 'It looks like webpack is not installed.';
        const prompt = 'Would you like to install';
        let hasLogMessage = false,
            hasPrompt = false,
            hasPassed = false;

        proc.stderr.on('data', (chunk) => {
            let data = stripAnsi(chunk.toString());
            console.log(`  stderr: ${data}`);

            if (data.includes(logMessage)) {
                hasLogMessage = true;
            }

            if (data.includes(prompt)) {
                hasPrompt = true;
            }

            if (hasLogMessage && hasPrompt) {
                hasPassed = true;
                proc.kill();
            }
        });

        proc.on('exit', () => {
            swapPkgName('.webpack');
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.webpack');
            resolve(false);
        });
    });
};

module.exports.run = [runTest];
module.exports.name = 'Missing webpack';
