'use strict';

const path = require('path');
const execa = require('execa');
const { renameSync } = require('fs');
const stripAnsi = require('strip-ansi');

const ROOT = process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : path.resolve(__dirname, '../../');
const CLI_ENTRY_PATH = path.resolve(ROOT, './packages/webpack-cli/bin/cli.js');

const getPkgPath = (pkg) => {
    return path.resolve(ROOT, `./node_modules/@webpack-cli/${pkg}`);
};

const swapPkgName = (current, next) => {
    console.log(`  swapping ${current} with ${next}`);
    renameSync(getPkgPath(current), getPkgPath(next));
};

const runTest = () => {
    // Simulate package missing
    swapPkgName('generators', '.generators');

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
            swapPkgName('.generators', 'generators');
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.generators', 'generators');
            resolve(false);
        });
    });
};

module.exports.run = [runTest];
module.exports.name = 'Missing @webpack-cli/generators';
