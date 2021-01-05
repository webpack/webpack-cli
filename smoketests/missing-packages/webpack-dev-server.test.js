const path = require('path');
const execa = require('execa');
const { renameSync } = require('fs');
const stripAnsi = require('strip-ansi');

const CLI_ENTRY_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');
const pathToPackage = require.resolve('webpack-dev-server').split(path.sep);
const pathToBase = pathToPackage.slice(0, pathToPackage.indexOf('webpack-dev-server'));

const getPkgPath = (pkg) => {
    return [...pathToBase, pkg].join(path.sep);
};

const swapPkgName = (current, next) => {
    console.log(`  swapping ${current} with ${next}`);
    renameSync(getPkgPath(current), getPkgPath(next));
};

const runTest = () => {
    // Simulate package missing
    swapPkgName('webpack-dev-server', '.webpack-dev-server');

    const proc = execa(CLI_ENTRY_PATH, ['serve'], {
        cwd: __dirname,
    });

    proc.stdin.setDefaultEncoding('utf-8');
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('  timeout: killing process');
            proc.kill();
        }, 1000);

        const logMessage = "For using 'serve' command you need to install: 'webpack-dev-server' package";
        const prompt = 'Would you like to install';
        let hasLogMessage = false,
            hasPrompt = false,
            hasPassed = false;

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
                hasPassed = true;
                proc.kill();
            }
        });

        proc.on('exit', () => {
            swapPkgName('.webpack-dev-server', 'webpack-dev-server');
            resolve(hasPassed);
        });

        proc.on('error', () => {
            swapPkgName('.webpack-dev-server', 'webpack-dev-server');
            resolve(false);
        });
    });
};

module.exports.run = runTest;
module.exports.name = 'Missing webpack-dev-server';
