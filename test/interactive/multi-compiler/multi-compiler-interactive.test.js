'use strict';
const { runAndGetWatchProc } = require('../../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { version } = require('webpack');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled', 'webpack'];

describe('--interactive flag with multi compiler', () => {
    it('should output in interactive with --interactive', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--interactive'], false, '', true);
        let semaphore = 2;
        const clear = '\x1B[2J\x1B[3J\x1B[H';
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (semaphore === 2 && data.includes('\u2B24')) {
                writeFileSync(resolve(__dirname, './src/index.js'), `console.log('Battlesnax');`);
                semaphore--;
                return;
            }
            if (semaphore === 1) {
                if (data.includes('Compilation') || data.includes('watching files for updates')) {
                    return;
                }
                expect(data).toBe(clear);
                semaphore--;
                return;
            }
            if (semaphore === 0) {
                if (data.includes('Compilation') || data.includes('watching files for updates') || data.includes(clear)) {
                    return;
                }
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

    it('should output in standard with --watch only', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 1;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (semaphore === 1 && data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, './src/index.js'), `console.log('Battlesnax');`);
                semaphore--;
                return;
            }
            if (semaphore === 0) {
                if (data.includes('Compilation') || data.includes('watching files for updates')) {
                    return;
                }
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
});
