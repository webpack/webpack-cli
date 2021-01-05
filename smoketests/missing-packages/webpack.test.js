const path = require('path');
const execa = require('execa');
const { renameSync } = require('fs');
const stripAnsi = require('strip-ansi');

const CLI_ENTRY_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');
const pathToPackage = require.resolve('webpack').split(path.sep);
const pathToBase = pathToPackage.slice(0, pathToPackage.indexOf('webpack'));

const getPkgPath = (pkg) => {
    return [...pathToBase, pkg].join(path.sep);
};

const swapPkgName = (current, next) => {
    console.log(`  swapping ${current} with ${next}`);
    renameSync(getPkgPath(current), getPkgPath(next));
};

const runTest = () => {
    // Simulate package missing
    swapPkgName('webpack', '.webpack');

    const proc = execa(CLI_ENTRY_PATH, [], {
        cwd: __dirname,
    });

    proc.stdin.setDefaultEncoding('utf-8');
    return new Promise((resolve) => {
        setTimeout(() => {
            proc.kill();
        }, 1000);

        const logMessage = 'It looks like webpack is not installed.';
        const prompt = 'Would you like to install';
        let hasLogMessage = false,
            hasPrompt = false;

        proc.stderr.on('data', (chunk) => {
            let data = stripAnsi(chunk.toString());
            console.log(`  stdout: ${data}`);

            if (data.includes(logMessage)) {
                hasLogMessage = true;
            }

            if (data.includes(prompt)) {
                hasPrompt = true;
            }

            if (hasLogMessage && hasPrompt) {
                proc.kill();
                swapPkgName('.webpack', 'webpack');
                resolve(true);
            }
        });

        proc.on('exit', () => {
            swapPkgName('.webpack', 'webpack');
            resolve(false);
        });

        proc.on('error', () => {
            swapPkgName('.webpack', 'webpack');
            resolve(false);
        });
    });
};

module.exports.run = runTest;
module.exports.name = 'Missing webpack';
