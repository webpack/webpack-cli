/* eslint-disable node/no-unpublished-require */
'use strict';

const fs = require('fs');
const { join } = require('path');
const concat = require('concat-stream');
const { runAndGetWatchProc } = require('../../utils/test-utils');

const firstPrompt = 'Will your application have multiple bundles?';
// To account for node_modules installation
jest.setTimeout(200000);

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
        console.log(stdout);
        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './yarn.lock', './src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(join(__dirname, file))).toBeTruthy();
        });
    });
});
