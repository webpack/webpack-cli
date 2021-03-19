'use strict';

const execa = require('execa');
const stripAnsi = require('strip-ansi');

const { getBinPath, swapPkgName } = require('../helpers');

const CLI_ENTRY_PATH = getBinPath();
const isSubPackage = true;

const runTest = () => {
    // Simulate package missing
    swapPkgName('generators', isSubPackage);

    const proc = execa(CLI_ENTRY_PATH, ['init'], {
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

        const errorMessage = "For using this command you need to install: '@webpack-cli/generators' package";

        let hasErrorMessage = false,
            hasPassed = false;

        proc.stderr.on('data', (chunk) => {
            let data = stripAnsi(chunk.toString());
            console.log(`  stderr: ${data}`);

            if (data.includes(errorMessage)) {
                hasErrorMessage = true;
            }

            if (hasErrorMessage) {
                hasPassed = true;
                proc.kill();
            }
        });

        proc.on('exit', () => {
            swapPkgName('.generators', isSubPackage);
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.generators', isSubPackage);
            resolve(false);
        });
    });
};

const runTestWithHelp = () => {
    // Simulate package missing
    swapPkgName('generators', isSubPackage);

    const proc = execa(CLI_ENTRY_PATH, ['help', 'init'], {
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

        const logMessage = "For using 'init' command you need to install '@webpack-cli/generators' package";
        const undefinedLogMessage = "Can't find and load command";

        let hasLogMessage = false,
            hasUndefinedLogMessage = false,
            hasPassed = false;

        proc.stderr.on('data', (chunk) => {
            let data = stripAnsi(chunk.toString());
            console.log(`  stderr: ${data}`);

            if (data.includes(logMessage)) {
                hasLogMessage = true;
            }

            if (data.includes(undefinedLogMessage)) {
                hasUndefinedLogMessage = true;
            }

            if (hasLogMessage || hasUndefinedLogMessage) {
                hasPassed = true;
                proc.kill();
            }
        });

        proc.on('exit', () => {
            swapPkgName('.generators', isSubPackage);
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.generators', isSubPackage);
            resolve(false);
        });
    });
};

module.exports.run = [runTest, runTestWithHelp];
module.exports.name = 'Missing @webpack-cli/generators';
