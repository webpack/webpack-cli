/* eslint-disable node/no-unpublished-require */

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const stripAnsi = require('strip-ansi');

const ROOT_PATH = process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : path.resolve(__dirname, '..');

const getBinPath = () => path.resolve(ROOT_PATH, './packages/webpack-cli/bin/cli.js');

const getPkgPath = (pkg, isSubPackage) => {
    const pkgPath = isSubPackage ? `./node_modules/@webpack-cli/${pkg}` : `./node_modules/${pkg}`;
    return path.resolve(ROOT_PATH, pkgPath);
};

const swapPkgName = (current, isSubPackage = false) => {
    // info -> .info and vice-versa
    const next = current.startsWith('.') ? current.substr(1) : `.${current}`;
    console.log(`  swapping ${current} with ${next}`);
    fs.renameSync(getPkgPath(current, isSubPackage), getPkgPath(next, isSubPackage));
};

const CLI_ENTRY_PATH = getBinPath();

const runTest = (package, cliArgs = [], logMessage, isSubPackage = false) => {
    // Simulate package missing
    swapPkgName(package, isSubPackage);

    const proc = execa(CLI_ENTRY_PATH, cliArgs, {
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
            swapPkgName(`.${package}`, isSubPackage);
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName(`.${package}`, isSubPackage);
            resolve(false);
        });
    });
};

const runTestWithHelp = (package, cliArgs = [], logMessage, isSubPackage = false) => {
    // Simulate package missing
    swapPkgName(package, isSubPackage);

    const proc = execa(CLI_ENTRY_PATH, cliArgs, {
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
            swapPkgName(`.${package}`, isSubPackage);
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName(`.${package}`, isSubPackage);
            resolve(false);
        });
    });
};

module.exports = {
    getBinPath,
    swapPkgName,
    runTest,
    runTestWithHelp,
};
