'use strict';

const { runAndGetWatchProc, isWebpack5 } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 0;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();

            if (semaphore === 0 && data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);

                semaphore++;

                return;
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

                return;
            }

            if (semaphore === 2 && data.includes('watching files for updates')) {
                proc.kill();
                done();

                return;
            }
        });
    });

    it('should print compilation lifecycle', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 0;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();

            if (semaphore === 0 && data.includes('Compilation starting')) {
                semaphore++;

                return;
            }

            if (semaphore === 1 && data.includes('Compilation finished')) {
                semaphore++;

                return;
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

                return;
            }

            if (semaphore === 3 && data.includes('watching files for updates...')) {
                semaphore++;

                proc.kill();
                done();

                return;
            }
        });
    });
});
