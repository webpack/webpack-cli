'use strict';

const { runWatch, isWindows, runAndGetWatchProc } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
const { version } = require('webpack');

const wordsInStatsv4 = ['Hash', 'Version', 'Time', 'Built at:', 'main.js'];
const wordsInStatsv5 = ['asset', 'index.js', 'compiled successfully'];

describe('--watch flag', () => {
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }

    it('should watch for file changes', async () => {
        const { stdout } = await runWatch({
            testCase: __dirname,
            args: ['--watch'],
            setOutput: false,
            outputKillStr: 'main',
        });

        expect(stdout).toContain('watching files for updates...');
    });

    it('should recompile upon file change', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--watch'], false, '', true);
        let semaphore = 1;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (semaphore === 1 && data.includes('watching files for updates')) {
                writeFileSync(resolve(__dirname, './src/index.js'), `console.log('watch flag test');`);
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
                semaphore--;
                proc.kill();
                done();
                return;
            }
        });
    });
});
