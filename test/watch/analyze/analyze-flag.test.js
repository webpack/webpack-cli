'use strict';

const { runAndGetWatchProc } = require('../../utils/test-utils');

describe('"analyze" option', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--analyze'], false, '', true);

        proc.stdout.on('data', (chunk) => {
            const data = chunk.toString();

            if (data.includes('Webpack Bundle Analyzer is started at')) {
                expect(data).toContain('Webpack Bundle Analyzer is started at');

                proc.kill();
                done();
            }
        });
    });
});
