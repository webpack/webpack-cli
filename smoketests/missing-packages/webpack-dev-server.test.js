'use strict';

const execa = require('execa');
const path = require('path');
const stripAnsi = require('strip-ansi');

const { getRootPath, swapPkgName } = require('../helpers');

const ROOT_PATH = getRootPath();
const CLI_ENTRY_PATH = path.resolve(ROOT_PATH, './packages/webpack-cli/bin/cli.js');

const runTest = () => {
    // Simulate package missing
    swapPkgName('webpack-dev-server');

    const proc = execa(CLI_ENTRY_PATH, ['serve'], {
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

        const logMessage = "For using 'serve' command you need to install: 'webpack-dev-server' package";
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
            swapPkgName('.webpack-dev-server');
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.webpack-dev-server');
            resolve(false);
        });
    });
};

module.exports.run = [runTest];
module.exports.name = 'Missing webpack-dev-server';
