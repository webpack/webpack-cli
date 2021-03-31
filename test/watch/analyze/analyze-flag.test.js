'use strict';

// eslint-disable-next-line node/no-unpublished-require
const stripAnsi = require('strip-ansi');
const { runAndGetWatchProc } = require('../../utils/test-utils');

describe('"analyze" option', () => {
    it('should load webpack-bundle-analyzer plugin with --analyze flag', (done) => {
        const proc = runAndGetWatchProc(__dirname, ['--analyze'], false, '', true);

        proc.stdout.on('data', (chunk) => {
            const data = stripAnsi(chunk.toString());

            if (data.includes('Webpack Bundle Analyzer is started at')) {
                expect(data).toContain('Webpack Bundle Analyzer is started at');

                proc.kill();
                done();
            }
        });
    });
});
