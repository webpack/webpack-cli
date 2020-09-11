'use strict';
const { run, runAndGetWatchProc } = require('../utils/test-utils');
const { stat, writeFileSync } = require('fs');
const { resolve } = require('path');

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
                expect(data).toContain('main.js');
                proc.kill();
                done();
                return;
            }
        });
    });
});
