'use strict';

const { runAndGetWatchProc } = require('../utils/test-utils');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

describe('--analyze flag', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--analyze'], false, '', true);
        let semaphore = 1;
        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();
            if (semaphore === 1 && data.includes('BundleAnalyzerPlugin')) {
                writeFileSync(resolve(__dirname, './src/main.js'), `console.log('analyze flag test');`);
                semaphore--;
                return;
            }
            if (semaphore === 0) {
                expect(data).toContain('Webpack Bundle Analyzer is started at http://127.0.0.1:8888');
                semaphore--;
                proc.kill();
                done();
                return;
            }
        });
    });
});
