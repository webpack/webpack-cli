/* eslint-disable node/no-unpublished-require */
'use strict';

const fs = require('fs');
const path = require('path');
const concat = require('concat-stream');
const execa = require('execa');

const firstPrompt = 'Will your application have multiple bundles?';
const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;

// To account for node_modules installation
jest.setTimeout(200000);

function runAndGetWatchProc(testCase, args = []) {
    const cwd = path.resolve(testCase);

    const webpackProc = execa(path.resolve(__dirname, '../../bin/cli.js'), args, {
        cwd,
        reject: false,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
    });

    return webpackProc;
}

const run = async (...answers) => {
    const runner = runAndGetWatchProc(__dirname, ['init'], false);

    runner.stdin.setDefaultEncoding('utf-8');

    // Simulate answers buy sending the answers after waiting for 1s
    const simulateAnswers = answers.reduce((prevAnswer, answer) => {
        return prevAnswer.then(() => {
            return new Promise((resolvePromise) => {
                setTimeout(() => {
                    runner.stdin.write(answer);
                    resolvePromise();
                }, 1000);
            });
        });
    }, Promise.resolve());

    await simulateAnswers.then(() => {
        runner.stdin.end();
    });

    return new Promise((resolve) => {
        runner.stdout.pipe(
            concat((result) => {
                resolve(result.toString());
            }),
        );
    });
};

const ENTER = '\x0D';

describe('init', () => {
    it('should scaffold when given answers', async () => {
        const stdout = await run('N', ENTER, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './yarn.lock', './src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(path.join(__dirname, file))).toBeTruthy();
        });
    });
});
