'use strict';

const stripAnsi = require('strip-ansi');
const { runAndGetWatchProc, isWebpack5 } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'production'], false, '', true);
        let semaphore = 0;
        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (semaphore === 0 && data.includes('watching files for updates')) {
                process.nextTick(() => {
                    writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);

                    semaphore++;
                });
            }

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

            if (semaphore === 2 && data.includes('watching files for updates')) {
                proc.kill();
                done();
            }
        });
    });

    it('should print compilation lifecycle', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch', '--mode', 'production'], false, '', true);
        let semaphore = 0;
        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (semaphore === 0 && data.includes('Compilation starting')) {
                semaphore++;
            }

            if (semaphore === 1 && data.includes('Compilation finished')) {
                semaphore++;
            }

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

            if (semaphore === 3 && data.includes('watching files for updates...')) {
                semaphore++;

                proc.kill();
                done();
            }
        });
    });
});
