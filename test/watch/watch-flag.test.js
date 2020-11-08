'use strict';

const stripAnsi = require('strip-ansi');
const { runAndGetWatchProc, isWebpack5, cliLogs } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 0;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());
            if (semaphore === 1 && data.includes('index.js')) {
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

            if (semaphore === 0 && data.includes(cliLogs[2])) {
                process.nextTick(() => {
                    writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);

                    semaphore++;
                });
            }

            if (semaphore === 2 && data.includes(cliLogs[2])) {
                proc.kill();
                done();
            }
        });
    });

    it('should print compilation lifecycle', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 0;

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());
            if (semaphore === 2 && data.includes('index.js')) {
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

            if (semaphore === 0 && data.includes(cliLogs[0])) {
                semaphore++;
            }

            if (semaphore === 1 && data.includes(cliLogs[1])) {
                semaphore++;
            }

            if (semaphore === 3 && data.includes(cliLogs[2])) {
                semaphore++;

                proc.kill();
                done();
            }
        });
    });
});
