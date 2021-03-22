'use strict';

const execa = require('execa');
const stripAnsi = require('strip-ansi');

const { getBinPath, swapPkgName } = require('../helpers');

const CLI_ENTRY_PATH = getBinPath();

const runTest = () => {
    // Simulate package missing
    swapPkgName('webpack-bundle-analyzer');

    const proc = execa(CLI_ENTRY_PATH, ['--analyze'], {
        cwd: __dirname,
    });

    proc.stdin.setDefaultEncoding('utf-8');

    proc.stdout.on('data', (chunk) => {
        console.log(`  stdout: ${chunk.toString()}`);
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('  timeout: killing process');
            proc.kill();
        }, 30000);

        const logMessage = 'It looks like webpack-bundle-analyzer is not installed.';
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
            swapPkgName('.webpack-bundle-analyzer');
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.webpack-bundle-analyzer');
            resolve(false);
        });
    });
};

module.exports.run = [runTest];
module.exports.name = 'Missing webpack-bundle-analyzer';
