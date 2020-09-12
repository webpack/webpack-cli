'use strict';
const { run, runAndGetWatchProc } = require('../utils/test-utils');
const { stat, writeFileSync } = require('fs');
const { resolve } = require('path');
const { version } = require('webpack');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--interactive flag', () => {
    it('should add InteractiveModePlugin to config', (done) => {
        const { stderr, stdout } = run(__dirname, ['--interactive']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('InteractiveModePlugin');
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should work with --watch', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['-c', './webpack.watch.js', '--watch', '--interactive'], false, '', true);
        let semaphore = 2;
        const clear = '\x1B[2J\x1B[3J\x1B[H';
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, 'index.js'), `console.log('I am Batman');`);
                semaphore--;
                return;
            }
            if (semaphore === 1) {
                expect(data).toBe(clear);
                semaphore--;
                return;
            }
            if (semaphore === 0) {
                if (version.startsWith('5')) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }
                proc.kill();
                done();
                return;
            }
        });
    });

    it('should not output in interactive with --watch only', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['-c', './webpack.watch.js', '--watch'], false, '', true);
        let semaphore = 1;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, 'index.js'), `console.log('I am Batman');`);
                semaphore--;
                return;
            }
            if (semaphore === 0) {
                if (version.startsWith('5')) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }
                proc.kill();
                done();
                return;
            }
        });
    });
});
