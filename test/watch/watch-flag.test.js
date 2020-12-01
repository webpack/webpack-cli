'use strict';

const stripAnsi = require('strip-ansi');
const { run, runAndGetWatchProc, isWebpack5 } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should work with negative value', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './watch.config.js', '--no-watch']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });

    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'development'], false, '', true);

        let semaphore = 0;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            console.log(data);
            console.log(semaphore);

            if (((isWebpack5 && semaphore === 1) || (!isWebpack5 && semaphore === 2) || semaphore === 6) && data.includes('index.js')) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                semaphore++;
            }
        });

        proc.stderr.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            console.log(data);
            console.log(semaphore);

            if (semaphore === 0 && data.includes('Compilation starting...')) {
                semaphore++;
            }

            if (((isWebpack5 && semaphore === 2) || (!isWebpack5 && semaphore === 1)) && data.includes('Compilation finished')) {
                semaphore++;
            }

            if (semaphore === 3 && data.includes('Compiler is watching files for updates...')) {
                process.nextTick(() => {
                    writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                });

                semaphore++;
            }

            if (semaphore === 4 && data.includes('was modified')) {
                semaphore++;
            }

            if (semaphore === 5 && data.includes('Compilation starting...')) {
                semaphore++;
            }

            if (semaphore === 7 && data.includes('Compilation finished')) {
                semaphore++;
            }

            if (semaphore === 8 && data.includes('Compiler is watching files for updates...')) {
                proc.kill();
                done();
            }
        });
    });
});
