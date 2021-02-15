const path = require('path');
const execa = require('execa');
const { renameSync } = require('fs');

const ROOT = process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : path.resolve(__dirname, '../../');
const CLI_ENTRY_PATH = path.resolve(ROOT, './packages/webpack-cli/bin/cli.js');

const getPkgPath = (pkg) => {
    return path.resolve(ROOT, `./node_modules/${pkg}`);
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
            let data = chunk.toString();
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
