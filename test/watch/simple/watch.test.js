'use strict';

const stripAnsi = require('strip-ansi');
const { run, runAndGetWatchProc, isWebpack5 } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should work with negative value', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './watch.config.js', '--no-watch']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'development'], false, '', true);

        let modified = false;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                    });

                    modified = true;
                } else {
                    proc.kill();
                    done();
                }
            }
        });
    });
});
