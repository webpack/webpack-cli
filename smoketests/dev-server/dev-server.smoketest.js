const path = require('path');
const { spawn } = require('child_process');
// eslint-disable-next-line node/no-unpublished-require
const puppeteer = require('puppeteer');
const assert = require('assert');

(async () => {
    console.log('\n============================ SERVE COMPILATION ============================\n');

    const outputPath = path.resolve(__dirname, 'bin');
    const argsWithOutput = ['serve'].concat('--output', outputPath);
    const WEBPACK_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');

    const devServerProcess = spawn(WEBPACK_PATH, argsWithOutput, { cwd: path.resolve(process.cwd(), './dev-server') });

    devServerProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
            const title = await page.title();
            assert(title, 'Webpack App');
            await browser.close();
            devServerProcess.kill();
            process.exit(0);
        })();
    });

    devServerProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
        console.error('Promise Error in dev-server, exiting...', err);
        process.exit(1);
        // Application specific logging, throwing an error, or other logic here
    });
})();
