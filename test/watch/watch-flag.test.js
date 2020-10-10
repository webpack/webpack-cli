'use strict';

const { runAndGetWatchProc } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { version } = require('webpack');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 1;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
                semaphore = 0;
                return;
            }
            if (semaphore === 0 && data.includes('index.js')) {
                if (version.startsWith('5')) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }
                semaphore--;
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
            if (semaphore === 0) {
                expect(data).toContain('Compilation  starting');
            }
            if (semaphore === 1) {
                expect(data).toContain('Compilation  finished');
            }
            if (semaphore === 2) {
                if (version.startsWith('5')) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }
            }
            if (semaphore === 3) {
                expect(data).toContain('watching files for updates');
                proc.kill();
                done();
                return;
            }
            semaphore++;
        });
    });
});
